import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { sendOTP } from '../../../services/otp';
import { users } from '@database/schema';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const purpose = typeof body.purpose === 'string' ? body.purpose : '';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError(400, { error: 'Valid email is required', code: 'VALIDATION_ERROR' });
    }

    if (purpose !== 'register' && purpose !== 'reset_password') {
      return jsonError(400, { error: 'Purpose must be "register" or "reset_password"', code: 'VALIDATION_ERROR' });
    }

    // For registration: check if user already exists
    if (purpose === 'register') {
      const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (existing) {
        return jsonError(400, { error: 'An account with this email already exists. Please sign in.', code: 'USER_EXISTS' });
      }
    }

    // For reset: check user exists
    if (purpose === 'reset_password') {
      const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
      if (!existing) {
        // Don't reveal whether user exists — return success anyway
        return jsonSuccess({ success: true, message: 'If an account with that email exists, a code has been sent.' });
      }
    }

    await sendOTP(db, email, purpose);

    return jsonSuccess({ success: true, message: 'Verification code sent to your email.' });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to send verification code.' });
  }
};
