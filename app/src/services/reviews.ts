import { eq, and, isNull, desc, SQL } from 'drizzle-orm';
import type { DB } from '../lib/db';
import { reviews, products } from '@database/schema';
import { generateId, now } from '../lib/utils';
import type { ValidatedReview } from '../lib/validation';
import { NotFoundError } from '../lib/errors';

/* ─── Submit Review ─────────────────────── */

export async function submitReview(db: DB, payload: ValidatedReview) {
  // Verify product exists
  const [product] = await db
    .select({ id: products.id })
    .from(products)
    .where(and(eq(products.id, payload.productId), isNull(products.deletedAt)))
    .limit(1);

  if (!product) throw new NotFoundError('Product');

  const id = generateId();
  const ts = now();

  await db.insert(reviews).values({
    id,
    productId: payload.productId,
    userId: null,
    orderItemId: null,
    rating: payload.rating,
    title: payload.title,
    body: payload.body,
    status: 'pending',
    createdAt: ts,
    updatedAt: ts,
  });

  return { id, status: 'pending' };
}

/* ─── List Approved Reviews ─────────────── */

export async function listApprovedReviews(db: DB, productId: string) {
  return db
    .select()
    .from(reviews)
    .where(and(eq(reviews.productId, productId), eq(reviews.status, 'approved')))
    .orderBy(desc(reviews.createdAt));
}

/* ─── List All Reviews (admin) ──────────── */

export async function listAllReviews(
  db: DB,
  opts: { page?: number; perPage?: number; status?: string } = {},
) {
  const page = Math.max(1, opts.page ?? 1);
  const perPage = Math.min(100, Math.max(1, opts.perPage ?? 20));
  const offset = (page - 1) * perPage;

  const conditions: SQL[] = [];
  if (opts.status) {
    conditions.push(eq(reviews.status, opts.status));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(reviews)
    .where(where)
    .orderBy(desc(reviews.createdAt))
    .limit(perPage)
    .offset(offset);

  return rows;
}

/* ─── Update Review Status (admin) ──────── */

export async function updateReviewStatus(db: DB, id: string, status: string) {
  const [existing] = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  if (!existing) throw new NotFoundError('Review');

  await db
    .update(reviews)
    .set({ status, updatedAt: now() })
    .where(eq(reviews.id, id));
}

/* ─── Delete Review (admin, soft) ───────── */

export async function deleteReview(db: DB, id: string) {
  await db.update(reviews).set({ deletedAt: now() }).where(eq(reviews.id, id));
}
