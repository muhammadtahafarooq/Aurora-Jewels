import { eq, and, isNull, desc, like, SQL, inArray } from 'drizzle-orm';
import type { DB } from '../lib/db';
import {
  products,
  productImages,
  productVariants,
  inventory,
  productCategories,
  productCollections,
  categories,
  collections,
} from '@database/schema';
import { NotFoundError } from '../lib/errors';
import { paginate, now } from '../lib/utils';

/* ─── List Products ─────────────────────── */

export interface ListProductsOptions {
  page?: number;
  perPage?: number;
  collection?: string;
  category?: string;
  featured?: boolean;
  newArrivals?: boolean;
  search?: string;
  status?: string;
}

export async function listProducts(db: DB, opts: ListProductsOptions) {
  const { offset, limit, page, perPage } = paginate(opts.page ?? 1, opts.perPage ?? 20);

  // Pre-resolve collection/category product IDs (filters apply before pagination)
  let collectionProductIds: string[] | null = null;
  let categoryProductIds: string[] | null = null;

  if (opts.collection) {
    const [col] = await db
      .select({ id: collections.id })
      .from(collections)
      .where(eq(collections.slug, opts.collection))
      .limit(1);

    if (col) {
      const rows = await db
        .select({ productId: productCollections.productId })
        .from(productCollections)
        .where(eq(productCollections.collectionId, col.id));
      collectionProductIds = rows.map((r) => r.productId);
    } else {
      collectionProductIds = [];
    }
  }

  if (opts.category) {
    const [cat] = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, opts.category))
      .limit(1);

    if (cat) {
      const rows = await db
        .select({ productId: productCategories.productId })
        .from(productCategories)
        .where(eq(productCategories.categoryId, cat.id));
      categoryProductIds = rows.map((r) => r.productId);
    } else {
      categoryProductIds = [];
    }
  }

  // Build the intersection of collection + category IDs
  let filteredProductIds: string[] | null = null;
  if (collectionProductIds !== null && categoryProductIds !== null) {
    filteredProductIds = collectionProductIds.filter((id) => categoryProductIds!.includes(id));
  } else if (collectionProductIds !== null) {
    filteredProductIds = collectionProductIds;
  } else if (categoryProductIds !== null) {
    filteredProductIds = categoryProductIds;
  }

  // If a filter resolved to empty set, short-circuit
  if (filteredProductIds !== null && filteredProductIds.length === 0) {
    return { products: [], total: 0, page, perPage };
  }

  const conditions: SQL[] = [isNull(products.deletedAt)];

  if (opts.status) {
    conditions.push(eq(products.status, opts.status));
  } else {
    conditions.push(eq(products.status, 'active'));
  }

  if (opts.featured) {
    conditions.push(eq(products.isFeatured, 1));
  }

  if (opts.search) {
    conditions.push(like(products.name, `%${opts.search}%`));
  }

  // Apply collection/category filter at DB level
  if (filteredProductIds !== null) {
    conditions.push(inArray(products.id, filteredProductIds));
  }

  const where = and(...conditions);

  // Count total matching rows (before pagination)
  const countResult = await db
    .select({ count: products.id })
    .from(products)
    .where(where);

  const total = countResult.length;

  const rows = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      description: products.description,
      shortDescription: products.shortDescription,
      status: products.status,
      isFeatured: products.isFeatured,
      createdAt: products.createdAt,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(where)
    .orderBy(desc(products.createdAt))
    .limit(limit)
    .offset(offset);

  // Attach primary image
  const productIds = rows.map((r) => r.id);
  const primaryImages =
    productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(
            and(
              inArray(productImages.productId, productIds),
              eq(productImages.isPrimary, 1),
            ),
          )
      : [];

  const imageMap = new Map(primaryImages.map((img) => [img.productId, img.imageUrl]));

  const result = rows.map((row) => ({
    ...row,
    imageUrl: imageMap.get(row.id) ?? null,
  }));

  return { products: result, total, page, perPage };
}

/* ─── Get Product by Slug ───────────────── */

export async function getProductBySlug(db: DB, slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), isNull(products.deletedAt)))
    .limit(1);

  if (!product) throw new NotFoundError('Product');

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, product.id))
    .orderBy(productImages.sortOrder);

  const variants = await db
    .select()
    .from(productVariants)
    .where(
      and(eq(productVariants.productId, product.id), eq(productVariants.isActive, 1)),
    )
    .orderBy(productVariants.createdAt);

  // Attach inventory to variants
  const variantIds = variants.map((v) => v.id);
  const inventoryRows =
    variantIds.length > 0
      ? await db.select().from(inventory).where(inArray(inventory.variantId, variantIds))
      : [];
  const inventoryMap = new Map(inventoryRows.map((inv) => [inv.variantId, inv]));

  const enrichedVariants = variants.map((v) => {
    const inv = inventoryMap.get(v.id);
    const available = inv ? inv.quantity - inv.reservedQuantity : 0;
    return { ...v, availableQuantity: available };
  });

  // Categories
  const catLinks = await db
    .select({ categoryId: productCategories.categoryId })
    .from(productCategories)
    .where(eq(productCategories.productId, product.id));
  const catIds = catLinks.map((c) => c.categoryId);
  const productCategoriesList =
    catIds.length > 0
      ? await db.select().from(categories).where(inArray(categories.id, catIds))
      : [];

  // Collections
  const colLinks = await db
    .select({ collectionId: productCollections.collectionId })
    .from(productCollections)
    .where(eq(productCollections.productId, product.id));
  const colIds = colLinks.map((c) => c.collectionId);
  const productCollectionsList =
    colIds.length > 0
      ? await db.select().from(collections).where(inArray(collections.id, colIds))
      : [];

  return {
    ...product,
    images,
    variants: enrichedVariants,
    categories: productCategoriesList,
    collections: productCollectionsList,
  };
}

/* ─── Get Product by ID (admin) ─────────── */

export async function getProductById(db: DB, id: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!product) throw new NotFoundError('Product');
  return product;
}

/* ─── Related Products ──────────────────── */

export async function getRelatedProducts(db: DB, slug: string, limit: number = 4) {
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  if (!product) return [];

  // Get collection IDs for this product
  const colLinks = await db
    .select({ collectionId: productCollections.collectionId })
    .from(productCollections)
    .where(eq(productCollections.productId, product.id));

  if (colLinks.length === 0) return [];

  const colIds = colLinks.map((c) => c.collectionId);

  // Find other products in same collections
  const relatedProductIds = await db
    .select({ productId: productCollections.productId })
    .from(productCollections)
    .where(inArray(productCollections.collectionId, colIds));

  const ids = [...new Set(relatedProductIds.map((r) => r.productId))].filter(
    (id) => id !== product.id,
  );

  if (ids.length === 0) return [];

  const rows = await db
    .select()
    .from(products)
    .where(and(inArray(products.id, ids.slice(0, limit)), eq(products.status, 'active')));

  // Attach images
  const pIds = rows.map((r) => r.id);
  const imgs =
    pIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(and(inArray(productImages.productId, pIds), eq(productImages.isPrimary, 1)))
      : [];
  const imgMap = new Map(imgs.map((i) => [i.productId, i.imageUrl]));

  return rows.map((r) => ({ ...r, imageUrl: imgMap.get(r.id) ?? null }));
}

/* ─── All Categories ────────────────────── */

export async function listCategories(db: DB) {
  return db
    .select()
    .from(categories)
    .where(and(eq(categories.isActive, 1), isNull(categories.deletedAt)))
    .orderBy(categories.sortOrder);
}

/* ─── All Collections ───────────────────── */

export async function listCollections(db: DB) {
  return db
    .select()
    .from(collections)
    .where(and(eq(collections.isActive, 1), isNull(collections.deletedAt)))
    .orderBy(collections.sortOrder);
}

/* ─── Create Product (admin) ────────────── */

export interface CreateProductInput {
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  status?: string;
  isFeatured?: boolean;
}

export async function createProduct(db: DB, input: CreateProductInput) {
  const id = generateId();
  const ts = now();

  await db.insert(products).values({
    id,
    name: input.name,
    slug: input.slug,
    description: input.description ?? null,
    shortDescription: input.shortDescription ?? null,
    status: input.status ?? 'draft',
    isFeatured: input.isFeatured ? 1 : 0,
    createdAt: ts,
    updatedAt: ts,
  });

  return { id };
}

/* ─── Update Product (admin) ────────────── */

export interface UpdateProductInput {
  name?: string;
  description?: string;
  shortDescription?: string;
  status?: string;
  isFeatured?: boolean;
}

export async function updateProduct(db: DB, id: string, input: UpdateProductInput) {
  const ts = now();
  const updates: Record<string, unknown> = { updatedAt: ts };

  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.shortDescription !== undefined) updates.shortDescription = input.shortDescription;
  if (input.status !== undefined) updates.status = input.status;
  if (input.isFeatured !== undefined) updates.isFeatured = input.isFeatured ? 1 : 0;

  await db.update(products).set(updates).where(eq(products.id, id));
}

/* ─── Delete Product (admin, soft) ──────── */

export async function deleteProduct(db: DB, id: string) {
  const ts = now();
  await db.update(products).set({ deletedAt: ts }).where(eq(products.id, id));
}
