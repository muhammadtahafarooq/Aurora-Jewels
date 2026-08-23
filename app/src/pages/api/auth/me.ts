import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { getSession, requireAuth } from '../../../lib/auth';
import { getProfile } from '../../../services/auth';
import { users, customerProfiles } from '@database/schema';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const session = await getSession(context);
    if (!session) {
      return jsonError(401, { error: 'Not authenticated' });
    }

    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const profile = await getProfile(db, session.sub);
    return jsonSuccess(profile);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch profile.' });
  }
};

export const PUT: APIRoute = async (context) => {
  try {
    const session = await requireAuth(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const ts = new Date().toISOString();

    if (body.email !== undefined) {
      if (typeof body.email !== 'string' || !body.email.includes('@')) {
        return jsonError(400, { error: 'Invalid email address.', code: 'VALIDATION_ERROR' });
      }
      const emailLower = body.email.trim().toLowerCase();
      const [existing] = await db.select().from(users).where(eq(users.email, emailLower));
      if (existing && existing.id !== session.sub) {
        return jsonError(400, { error: 'Email is already in use.', code: 'DUPLICATE_EMAIL' });
      }
      await db.update(users).set({ email: emailLower, updatedAt: ts }).where(eq(users.id, session.sub));
    }

    const [profile] = await db.select().from(customerProfiles).where(eq(customerProfiles.userId, session.sub));
    if (profile) {
      const updates: Record<string, unknown> = { updatedAt: ts };
      if (body.firstName !== undefined) updates.firstName = body.firstName;
      if (body.lastName !== undefined) updates.lastName = body.lastName;
      if (body.phone !== undefined) updates.phone = body.phone;
      await db.update(customerProfiles).set(updates).where(eq(customerProfiles.userId, session.sub));
    }

    return jsonSuccess({ ok: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to update profile.' });
  }
};
