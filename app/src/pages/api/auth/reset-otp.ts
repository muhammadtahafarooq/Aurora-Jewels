import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { verifyOTP } from '../../../services/otp';
import { hashPassword } from '../../../lib/password';
import { users } from '@database/schema';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const otpCode = typeof body.otpCode === 'string' ? body.otpCode.trim() : '';

    if (!email || !password || !otpCode) {
      return jsonError(400, { error: 'Email, password, and OTP code are required', code: 'VALIDATION_ERROR' });
    }

    if (password.length < 8) {
      return jsonError(400, { error: 'Password must be at least 8 characters', code: 'VALIDATION_ERROR' });
    }

    // Verify OTP
    await verifyOTP(db, email, otpCode, 'reset_password');

    // Update password
    const passwordHash = await hashPassword(password);
    const ts = new Date().toISOString();

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return jsonError(404, { error: 'User not found', code: 'NOT_FOUND' });
    }

    await db.update(users).set({ passwordHash, updatedAt: ts }).where(eq(users.id, user.id));

    return jsonSuccess({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Password reset failed.' });
  }
};
