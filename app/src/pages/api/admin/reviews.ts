import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { requireAdmin } from '../../../lib/auth';
import { listAllReviews, updateReviewStatus, deleteReview } from '../../../services/reviews';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') ?? '20', 10);
    const status = url.searchParams.get('status') ?? undefined;

    const reviews = await listAllReviews(db, { page, perPage, status });
    return jsonSuccess({ reviews });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch reviews.' });
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
    if (!id) return jsonError(400, { error: 'Review ID is required' });

    const body = await context.request.json();
    const status = typeof body.status === 'string' ? body.status : '';
    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return jsonError(400, { error: 'Invalid status' });
    }

    await updateReviewStatus(db, id, status);
    return jsonSuccess({ success: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to update review.' });
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
    if (!id) return jsonError(400, { error: 'Review ID is required' });

    await deleteReview(db, id);
    return jsonSuccess({ success: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to delete review.' });
  }
};
