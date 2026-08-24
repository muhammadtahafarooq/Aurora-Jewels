import type { APIRoute } from 'astro';
import { createDb } from '../../lib/db';
import { like, or } from 'drizzle-orm';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = (context.locals as any).runtime?.env;
  if (!env?.DB) return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });

  const q = new URL(context.request.url).searchParams.get('q') || '';
  if (q.length < 2) return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });

  try {
    const db = createDb(env);
    const { products } = await import('@database/schema');
    const pattern = '%' + q + '%';

    const rows = await db
      .select({ id: products.id, name: products.name, slug: products.slug, shortDescription: products.shortDescription, imageUrl: products.imageUrl })
      .from(products)
      .where(or(like(products.name, pattern), like(products.slug, pattern), like(products.shortDescription, pattern)))
      .limit(10);

    return new Response(JSON.stringify({ results: rows }), { headers: { 'Content-Type': 'application/json' } });
  } catch {
    return new Response(JSON.stringify({ results: [] }), { headers: { 'Content-Type': 'application/json' } });
  }
};
