import { eq, and, isNull, desc, SQL } from 'drizzle-orm';
import type { DB } from '../lib/db';
import {
  orders,
  orderItems,
  orderAddresses,
  products,
  productVariants,
  inventory,
  coupons,
} from '@database/schema';
import { generateId, generateOrderNumber, now } from '../lib/utils';
import { BadRequestError, NotFoundError, InternalError } from '../lib/errors';
import type { ValidatedCheckout } from '../lib/validation';

/* ─── Create Order (COD) ────────────────── */

export interface CreateOrderResult {
  orderId: string;
  orderNumber: string;
}

export async function createOrder(
  db: DB,
  payload: ValidatedCheckout,
  userId: string | null = null,
): Promise<CreateOrderResult> {
  // 1. Resolve products + compute line totals
  let subtotal = 0;
  const lineItems: Array<{
    productId: string | null;
    variantId: string | null;
    productName: string;
    variantName: string | null;
    sku: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
  }> = [];

  for (const item of payload.items) {
    const [product] = await db
      .select()
      .from(products)
      .where(and(eq(products.slug, item.slug), eq(products.status, 'active')))
      .limit(1);

    if (!product) {
      throw new BadRequestError(`Product "${item.slug}" not found or unavailable`);
    }

    let unitPrice: number;
    let productName = product.name;
    let variantName: string | null = null;
    let sku: string | null = null;
    let resolvedVariantId: string | null = null;

    if (item.variantId) {
      const [variant] = await db
        .select()
        .from(productVariants)
        .where(
          and(
            eq(productVariants.id, item.variantId),
            eq(productVariants.productId, product.id),
            eq(productVariants.isActive, 1),
          ),
        )
        .limit(1);

      if (!variant) {
        throw new BadRequestError(`Variant "${item.variantId}" not found for "${item.slug}"`);
      }

      unitPrice = variant.price;
      resolvedVariantId = variant.id;
      variantName = variant.variantName;
      sku = variant.sku;

      // Check inventory
      const [inv] = await db
        .select()
        .from(inventory)
        .where(eq(inventory.variantId, variant.id))
        .limit(1);

      if (inv) {
        const available = inv.quantity - inv.reservedQuantity;
        if (available < item.qty) {
          throw new BadRequestError(`Insufficient stock for "${item.slug}" (available: ${available})`);
        }
      }
    } else {
      // Use product base price — try default variant, then first active
      let [defaultVariant] = await db
        .select()
        .from(productVariants)
        .where(
          and(
            eq(productVariants.productId, product.id),
            eq(productVariants.isActive, 1),
            eq(productVariants.isDefault, 1),
          ),
        )
        .limit(1);

      if (!defaultVariant) {
        [defaultVariant] = await db
          .select()
          .from(productVariants)
          .where(
            and(
              eq(productVariants.productId, product.id),
              eq(productVariants.isActive, 1),
            ),
          )
          .limit(1);
      }

      if (defaultVariant) {
        unitPrice = defaultVariant.price;
        resolvedVariantId = defaultVariant.id;
        variantName = defaultVariant.variantName;
        sku = defaultVariant.sku;

        const [inv] = await db
          .select()
          .from(inventory)
          .where(eq(inventory.variantId, defaultVariant.id))
          .limit(1);

        if (inv) {
          const available = inv.quantity - inv.reservedQuantity;
          if (available < item.qty) {
            throw new BadRequestError(`Insufficient stock for "${item.slug}" (available: ${available})`);
          }
        }
      } else {
        throw new BadRequestError(`No active variant found for "${item.slug}"`);
      }
    }

    const lineTotal = unitPrice * item.qty;
    subtotal += lineTotal;

    lineItems.push({
      productId: product.id,
      variantId: resolvedVariantId,
      productName,
      variantName,
      sku,
      unitPrice,
      quantity: item.qty,
      lineTotal,
    });
  }

  // 2. Validate and apply coupon
  let discountAmount = 0;
  if (payload.couponCode) {
    const coupon = await validateCouponCode(db, payload.couponCode, subtotal);
    if (coupon) {
      discountAmount = coupon.discount;
    }
  }

  const totalAmount = Math.max(0, subtotal - discountAmount);

  // 3. Create order in a transaction
  const orderId = generateId();
  const orderNumber = generateOrderNumber();
  const ts = now();

  try {
    await db.transaction(async (tx) => {
      // Insert order
      await tx.insert(orders).values({
        id: orderId,
        orderNumber,
        userId: userId,
        customerName: payload.name,
        customerEmail: payload.email,
        customerPhone: payload.phone,
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'cod_due',
        subtotal,
        discountAmount,
        shippingAmount: 0,
        totalAmount,
        currency: 'PKR',
        couponCode: payload.couponCode,
        customerNotes: payload.notes,
        createdAt: ts,
        updatedAt: ts,
      });

      // Insert order address
      await tx.insert(orderAddresses).values({
        id: generateId(),
        orderId,
        recipientName: payload.name,
        phone: payload.phone,
        email: payload.email,
        addressLine1: payload.address,
        city: payload.city,
        province: payload.province || null,
        postalCode: payload.postalCode || null,
        country: 'PK',
        createdAt: ts,
      });

      // Insert order items
      for (const li of lineItems) {
        await tx.insert(orderItems).values({
          id: generateId(),
          orderId,
          productId: li.productId,
          variantId: li.variantId,
          productName: li.productName,
          variantName: li.variantName,
          sku: li.sku,
          unitPrice: li.unitPrice,
          quantity: li.quantity,
          lineTotal: li.lineTotal,
          createdAt: ts,
        });

        // Reserve inventory
        if (li.variantId) {
          const [inv] = await tx
            .select()
            .from(inventory)
            .where(eq(inventory.variantId, li.variantId))
            .limit(1);

          if (inv) {
            await tx
              .update(inventory)
              .set({
                reservedQuantity: inv.reservedQuantity + li.quantity,
                updatedAt: ts,
              })
              .where(eq(inventory.id, inv.id));
          }
        }
      }

      // Increment coupon usage count
      if (payload.couponCode) {
        const [couponRow] = await tx
          .select()
          .from(coupons)
          .where(eq(coupons.code, payload.couponCode))
          .limit(1);
        if (couponRow) {
          await tx
            .update(coupons)
            .set({ usageCount: couponRow.usageCount + 1, updatedAt: ts })
            .where(eq(coupons.id, couponRow.id));
        }
      }
    });
  } catch (err) {
    if (err instanceof BadRequestError) throw err;
    throw new InternalError('Failed to create order');
  }

  return { orderId, orderNumber };
}

/* ─── Validate Coupon Code ──────────────── */

async function validateCouponCode(
  db: DB,
  code: string,
  subtotal: number,
): Promise<{ discount: number } | null> {
  const [coupon] = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code), eq(coupons.isActive, 1), isNull(coupons.deletedAt)))
    .limit(1);

  if (!coupon) return null;

  // Check expiry
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return null;

  // Check start date
  if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) return null;

  // Check usage limit
  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return null;

  // Check minimum order amount
  if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) return null;

  // Calculate discount
  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.floor((subtotal * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return { discount };
}

/* ─── Get Order (admin) ─────────────────── */

export async function getOrderById(db: DB, id: string) {
  const [order] = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!order) throw new NotFoundError('Order');

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id))
    .orderBy(orderItems.createdAt);

  const [address] = await db
    .select()
    .from(orderAddresses)
    .where(eq(orderAddresses.orderId, id))
    .limit(1);

  return { ...order, items, address };
}

/* ─── Get Order by Number ───────────────── */

export async function getOrderNumber(db: DB, orderNumber: string) {
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  if (!order) throw new NotFoundError('Order');

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return { ...order, items };
}

/* ─── List Orders by User ────────────────── */

export async function listUserOrders(db: DB, userId: string) {
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const result = [];
  for (const order of rows) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));
    result.push({ ...order, items });
  }

  return result;
}

/* ─── List Orders (admin) ───────────────── */

export async function listOrders(
  db: DB,
  opts: { page?: number; perPage?: number; status?: string } = {},
) {
  const page = Math.max(1, opts.page ?? 1);
  const perPage = Math.min(100, Math.max(1, opts.perPage ?? 20));
  const offset = (page - 1) * perPage;

  const conditions: SQL[] = [];
  if (opts.status) {
    conditions.push(eq(orders.status, opts.status));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const countResult = await db
    .select({ count: orders.id })
    .from(orders)
    .where(where);

  const rows = await db
    .select()
    .from(orders)
    .where(where)
    .orderBy(desc(orders.createdAt))
    .limit(perPage)
    .offset(offset);

  return { orders: rows, total: countResult.length, page, perPage };
}

/* ─── Update Order Status (admin) ───────── */

export async function updateOrderStatus(
  db: DB,
  id: string,
  updates: { status?: string; paymentStatus?: string },
) {
  const ts = now();
  const setValues: Record<string, unknown> = { updatedAt: ts };

  if (updates.status) setValues.status = updates.status;
  if (updates.paymentStatus) setValues.paymentStatus = updates.paymentStatus;

  await db.update(orders).set(setValues).where(eq(orders.id, id));
}
