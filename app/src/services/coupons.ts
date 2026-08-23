import { eq, and, isNull } from 'drizzle-orm';
import type { DB } from '../lib/db';
import { coupons, couponProducts, couponCollections } from '@database/schema';
import { generateId, now } from '../lib/utils';
import { NotFoundError, BadRequestError } from '../lib/errors';

/* ─── Validate & Get Coupon Info ────────── */

export interface CouponValidation {
  valid: boolean;
  code: string;
  discountType: string;
  discountValue: number;
  discount: number;
  minimumOrderAmount: number | null;
  reason?: string;
}

export async function validateCoupon(
  db: DB,
  code: string,
  subtotal: number,
): Promise<CouponValidation> {
  const [coupon] = await db
    .select()
    .from(coupons)
    .where(and(eq(coupons.code, code), eq(coupons.isActive, 1), isNull(coupons.deletedAt)))
    .limit(1);

  if (!coupon) {
    return { valid: false, code, discountType: '', discountValue: 0, discount: 0, minimumOrderAmount: null, reason: 'Invalid coupon code' };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount: 0, minimumOrderAmount: coupon.minimumOrderAmount, reason: 'Coupon has expired' };
  }

  if (coupon.startsAt && new Date(coupon.startsAt) > new Date()) {
    return { valid: false, code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount: 0, minimumOrderAmount: coupon.minimumOrderAmount, reason: 'Coupon is not yet active' };
  }

  if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
    return { valid: false, code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount: 0, minimumOrderAmount: coupon.minimumOrderAmount, reason: 'Coupon usage limit reached' };
  }

  if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) {
    return { valid: false, code, discountType: coupon.discountType, discountValue: coupon.discountValue, discount: 0, minimumOrderAmount: coupon.minimumOrderAmount, reason: `Minimum order amount is ${coupon.minimumOrderAmount}` };
  }

  let discount = 0;
  if (coupon.discountType === 'percentage') {
    discount = Math.floor((subtotal * coupon.discountValue) / 100);
  } else {
    discount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discount,
    minimumOrderAmount: coupon.minimumOrderAmount,
  };
}

/* ─── List Coupons (admin) ──────────────── */

export async function listCoupons(db: DB) {
  return db.select().from(coupons).orderBy(coupons.createdAt);
}

/* ─── Create Coupon (admin) ─────────────── */

export interface CreateCouponInput {
  code: string;
  discountType: string;
  discountValue: number;
  minimumOrderAmount?: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
}

export async function createCoupon(db: DB, input: CreateCouponInput) {
  const id = generateId();
  const ts = now();

  await db.insert(coupons).values({
    id,
    code: input.code.toUpperCase(),
    discountType: input.discountType,
    discountValue: input.discountValue,
    minimumOrderAmount: input.minimumOrderAmount ?? null,
    startsAt: input.startsAt ?? null,
    expiresAt: input.expiresAt ?? null,
    usageLimit: input.usageLimit ?? null,
    usageCount: 0,
    isActive: 1,
    createdAt: ts,
    updatedAt: ts,
  });

  return { id };
}

/* ─── Update Coupon (admin) ─────────────── */

export interface UpdateCouponInput {
  discountType?: string;
  discountValue?: number;
  minimumOrderAmount?: number;
  startsAt?: string;
  expiresAt?: string;
  usageLimit?: number;
  isActive?: boolean;
}

export async function updateCoupon(db: DB, id: string, input: UpdateCouponInput) {
  const [existing] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  if (!existing) throw new NotFoundError('Coupon');

  const updates: Record<string, unknown> = { updatedAt: now() };
  if (input.discountType !== undefined) updates.discountType = input.discountType;
  if (input.discountValue !== undefined) updates.discountValue = input.discountValue;
  if (input.minimumOrderAmount !== undefined) updates.minimumOrderAmount = input.minimumOrderAmount;
  if (input.startsAt !== undefined) updates.startsAt = input.startsAt;
  if (input.expiresAt !== undefined) updates.expiresAt = input.expiresAt;
  if (input.usageLimit !== undefined) updates.usageLimit = input.usageLimit;
  if (input.isActive !== undefined) updates.isActive = input.isActive ? 1 : 0;

  await db.update(coupons).set(updates).where(eq(coupons.id, id));
}

/* ─── Delete Coupon (admin, soft) ───────── */

export async function deleteCoupon(db: DB, id: string) {
  await db.update(coupons).set({ deletedAt: now() }).where(eq(coupons.id, id));
}
