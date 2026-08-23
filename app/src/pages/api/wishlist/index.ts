import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { toggleWishlistItem, listWishlistItems } from '../../../services/wishlist';
import { requireAuth } from '../../../lib/auth';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const session = await requireAuth(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);
    const items = await listWishlistItems(db, session.sub);
    return jsonSuccess({ items, count: items.length });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch wishlist.' });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const session = await requireAuth(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);
    const body = await context.request.json();
    const productId = typeof body.productId === 'string' ? body.productId : '';
    if (!productId) return jsonError(400, { error: 'productId is required' });
    const result = await toggleWishlistItem(db, session.sub, productId);
    return jsonSuccess(result);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to toggle wishlist.' });
  }
};
