import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { requireAdmin } from '../../../lib/auth';
import { listOrders, getOrderById, updateOrderStatus } from '../../../services/orders';
import { validateOrderUpdate } from '../../../lib/validation';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const orderId = url.searchParams.get('id');

    if (orderId) {
      const order = await getOrderById(db, orderId);
      return jsonSuccess(order);
    }

    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') ?? '20', 10);
    const status = url.searchParams.get('status') ?? undefined;

    const result = await listOrders(db, { page, perPage, status });
    return jsonSuccess(result);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch orders.' });
  }
};

export const PATCH: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const orderId = url.searchParams.get('id');
    if (!orderId) return jsonError(400, { error: 'Order ID is required' });

    const body = await context.request.json();
    const updates = validateOrderUpdate(body);
    await updateOrderStatus(db, orderId, updates);
    return jsonSuccess({ success: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to update order.' });
  }
};
