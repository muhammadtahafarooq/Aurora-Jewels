import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { getProductBySlug } from '../../../services/products';
import { listApprovedReviews } from '../../../services/reviews';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const slug = context.params?.slug;
    if (!slug) return jsonError(400, { error: 'Product slug is required' });

    const product = await getProductBySlug(db, slug);
    const reviews = await listApprovedReviews(db, product.id);

    return jsonSuccess({ ...product, reviews });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; message: string };
      return jsonError(e.status, { error: e.message });
    }
    return jsonError(500, { error: 'Failed to fetch product.' });
  }
};
