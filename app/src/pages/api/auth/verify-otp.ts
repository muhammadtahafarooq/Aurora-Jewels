import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { verifyOTP } from '../../../services/otp';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const code = typeof body.code === 'string' ? body.code.trim() : '';
    const purpose = typeof body.purpose === 'string' ? body.purpose : '';

    if (!email || !code) {
      return jsonError(400, { error: 'Email and code are required', code: 'VALIDATION_ERROR' });
    }

    if (purpose !== 'register' && purpose !== 'reset_password') {
      return jsonError(400, { error: 'Purpose must be "register" or "reset_password"', code: 'VALIDATION_ERROR' });
    }

    const result = await verifyOTP(db, email, code, purpose);

    return jsonSuccess({ success: true, valid: result.valid });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Verification failed.' });
  }
};
