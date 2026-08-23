import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { users, customerProfiles } from '@database/schema';
import { generateId, now } from '../../../lib/utils';
import { hashPassword } from '../../../lib/password';
import { ConflictError } from '../../../lib/errors';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
    const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';

    if (!email || !password) {
      return jsonError(400, { error: 'Email and password are required', code: 'VALIDATION_ERROR' });
    }

    if (password.length < 8) {
      return jsonError(400, { error: 'Password must be at least 8 characters', code: 'VALIDATION_ERROR' });
    }

    // Check if email already exists
    const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing) throw new ConflictError('An account with this email already exists');

    const ts = now();
    const userId = generateId();
    const profileId = generateId();
    const passwordHash = await hashPassword(password);

    // Create user with email already verified (OTP verified in step 2)
    await db.insert(users).values({
      id: userId,
      email,
      passwordHash,
      role: 'customer',
      isActive: 1,
      emailVerifiedAt: ts,
      createdAt: ts,
      updatedAt: ts,
    });

    await db.insert(customerProfiles).values({
      id: profileId,
      userId,
      firstName: firstName || null,
      lastName: lastName || null,
      createdAt: ts,
      updatedAt: ts,
    });

    return jsonSuccess({
      success: true,
      message: 'Account created successfully. You can now log in.',
      userId,
    }, 201);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Registration failed.' });
  }
};
