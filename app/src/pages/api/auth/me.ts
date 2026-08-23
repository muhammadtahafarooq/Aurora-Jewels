import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { getSession } from '../../../lib/auth';
import { getProfile } from '../../../services/auth';

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
