import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { requireAuth } from '../../../lib/auth';
import { listUserOrders } from '../../../services/orders';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const session = await requireAuth(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);
    const orders = await listUserOrders(db, session.sub);
    return jsonSuccess({ orders });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch orders.' });
  }
};
