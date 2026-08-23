import { eq, and } from 'drizzle-orm';
import type { DB } from '../lib/db';
import { wishlists, wishlistItems, products, productImages } from '@database/schema';
import { generateId, now } from '../lib/utils';

/* ─── Get or Create Wishlist ────────────── */

async function getOrCreateWishlist(db: DB, userId: string) {
  const [existing] = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .limit(1);

  if (existing) return existing;

  const id = generateId();
  const ts = now();
  await db.insert(wishlists).values({ id, userId, createdAt: ts, updatedAt: ts });
  return { id, userId, createdAt: ts, updatedAt: ts };
}

/* ─── Toggle Wishlist Item ──────────────── */

export async function toggleWishlistItem(
  db: DB,
  userId: string,
  productId: string,
): Promise<{ added: boolean }> {
  const wishlist = await getOrCreateWishlist(db, userId);

  const [existing] = await db
    .select()
    .from(wishlistItems)
    .where(
      and(
        eq(wishlistItems.wishlistId, wishlist.id),
        eq(wishlistItems.productId, productId),
      ),
    )
    .limit(1);

  if (existing) {
    await db
      .delete(wishlistItems)
      .where(
        and(
          eq(wishlistItems.wishlistId, wishlist.id),
          eq(wishlistItems.productId, productId),
        ),
      );
    return { added: false };
  }

  await db.insert(wishlistItems).values({
    wishlistId: wishlist.id,
    productId,
    createdAt: now(),
  });
  return { added: true };
}

/* ─── List Wishlist Items ───────────────── */

export async function listWishlistItems(db: DB, userId: string) {
  const [wishlist] = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .limit(1);

  if (!wishlist) return [];

  const items = await db
    .select({ productId: wishlistItems.productId })
    .from(wishlistItems)
    .where(eq(wishlistItems.wishlistId, wishlist.id));

  if (items.length === 0) return [];

  const productIds = items.map((i) => i.productId);

  const rows = await db
    .select()
    .from(products)
    .where(eq(products.status, 'active'));

  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.isPrimary, 1));

  const imageMap = new Map(images.map((i) => [i.productId, i.imageUrl]));

  return rows
    .filter((p) => productIds.includes(p.id))
    .map((p) => ({ ...p, imageUrl: imageMap.get(p.id) ?? null }));
}

/* ─── Check Wishlist ────────────────────── */

export async function isInWishlist(db: DB, userId: string, productId: string): Promise<boolean> {
  const [wishlist] = await db
    .select()
    .from(wishlists)
    .where(eq(wishlists.userId, userId))
    .limit(1);

  if (!wishlist) return false;

  const [item] = await db
    .select()
    .from(wishlistItems)
    .where(
      and(
        eq(wishlistItems.wishlistId, wishlist.id),
        eq(wishlistItems.productId, productId),
      ),
    )
    .limit(1);

  return !!item;
}
