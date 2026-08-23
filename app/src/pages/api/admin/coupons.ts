import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { requireAdmin } from '../../../lib/auth';
import { listCoupons, createCoupon, updateCoupon, deleteCoupon } from '../../../services/coupons';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);
    const coupons = await listCoupons(db);
    return jsonSuccess({ coupons });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch coupons.' });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);
    const body = await context.request.json();

    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const discountType = typeof body.discountType === 'string' ? body.discountType : '';
    const discountValue = typeof body.discountValue === 'number' ? body.discountValue : 0;

    if (!code || !discountType || discountValue <= 0) {
      return jsonError(400, { error: 'code, discountType, and discountValue are required' });
    }

    const result = await createCoupon(db, {
      code,
      discountType,
      discountValue,
      minimumOrderAmount: body.minimumOrderAmount,
      startsAt: body.startsAt,
      expiresAt: body.expiresAt,
      usageLimit: body.usageLimit,
    });

    return jsonSuccess(result, 201);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to create coupon.' });
  }
};

export const PATCH: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonError(400, { error: 'Coupon ID is required' });

    const body = await context.request.json();
    await updateCoupon(db, id, body);
    return jsonSuccess({ success: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to update coupon.' });
  }
};

export const DELETE: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonError(400, { error: 'Coupon ID is required' });

    await deleteCoupon(db, id);
    return jsonSuccess({ success: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to delete coupon.' });
  }
};
