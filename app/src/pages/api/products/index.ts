import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { listProducts } from '../../../services/products';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') ?? '20', 10);
    const collection = url.searchParams.get('collection') ?? undefined;
    const category = url.searchParams.get('category') ?? undefined;
    const featured = url.searchParams.get('featured') === 'true';
    const newArrivals = url.searchParams.get('newArrivals') === 'true';
    const search = url.searchParams.get('search') ?? undefined;

    const result = await listProducts(db, {
      page,
      perPage,
      collection,
      category,
      featured,
      newArrivals,
      search,
    });

    return jsonSuccess(result);
  } catch (err) {
    return jsonError(500, { error: 'Failed to fetch products.' });
  }
};
