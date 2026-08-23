import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { submitReview } from '../../../services/reviews';
import { validateReview } from '../../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);
    const body = await context.request.json();
    const payload = validateReview(body);
    const result = await submitReview(db, payload);
    return jsonSuccess(result, 201);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to submit review.' });
  }
};
