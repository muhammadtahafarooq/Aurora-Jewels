import type { APIRoute } from 'astro';
import { createDb } from '../../lib/db';
import { like, or, eq, inArray } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = (context.locals as any).runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });

  const q = new URL(context.request.url).searchParams.get('q') || '';
  if (q.length < 2) return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });

  try {
    const db = createDb(env);
    const { products, categories, productCategories, collections, productCollections } = await import('@database/schema');
    const pattern = '%' + q + '%';

    // 1) Direct product matches
    const directMatches = await db
      .select({ id: products.id })
      .from(products)
      .where(or(
        like(products.name, pattern),
        like(products.slug, pattern),
        like(products.shortDescription, pattern),
        like(products.description, pattern),
      ))
      .limit(10);

    // 2) Category name matches → find product IDs in those categories
    const catMatches = await db
      .select({ productId: productCategories.productId })
      .from(productCategories)
      .innerJoin(categories, eq(categories.id, productCategories.categoryId))
      .where(or(like(categories.name, pattern), like(categories.slug, pattern)))
      .limit(20);

    // 3) Collection name matches → find product IDs in those collections
    const colMatches = await db
      .select({ productId: productCollections.productId })
      .from(productCollections)
      .innerJoin(collections, eq(collections.id, productCollections.collectionId))
      .where(or(like(collections.name, pattern), like(collections.slug, pattern)))
      .limit(20);

    // Merge all matched product IDs
    const allIds = [...new Set([...directMatches.map(r => r.id), ...catMatches.map(r => r.productId), ...colMatches.map(r => r.productId)])];

    if (allIds.length === 0) {
      return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });
    }

    const rows = await db
      .select({ id: products.id, name: products.name, slug: products.slug, shortDescription: products.shortDescription, imageUrl: products.imageUrl })
      .from(products)
      .where(inArray(products.id, allIds))
      .limit(10);

    return new Response(JSON.stringify({ results: rows }), { headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });
  }
};
