import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { verifyEmail } from '../../../services/auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const token = typeof body.token === 'string' ? body.token.trim() : '';
    if (!token) return jsonError(400, { error: 'Verification token is required' });

    const result = await verifyEmail(db, token);

    return jsonSuccess({
      success: true,
      message: 'Email verified. You can now log in.',
    });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Verification failed.' });
  }
};
