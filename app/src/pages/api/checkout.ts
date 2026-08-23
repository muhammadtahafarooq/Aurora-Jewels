import type { APIRoute } from 'astro';
import { createDb } from '../../lib/db';
import { jsonError, jsonSuccess } from '../../lib/errors';
import { createOrder } from '../../services/orders';
import { validateCheckout } from '../../lib/validation';
import { getSession } from '../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const payload = validateCheckout(body);

    const session = await getSession(context);
    const userId = session?.sub ?? null;

    const result = await createOrder(db, payload, userId);

    return jsonSuccess({
      success: true,
      message: 'Order placed successfully. You will pay on delivery.',
      orderId: result.orderId,
      orderNumber: result.orderNumber,
    });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Checkout failed. Please try again.' });
  }
};
