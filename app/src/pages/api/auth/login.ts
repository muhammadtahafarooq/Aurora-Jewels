import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { loginUser } from '../../../services/auth';
import { setSessionCookie } from '../../../lib/auth';
import { validateLogin } from '../../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  try {
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const input = validateLogin(body);
    const result = await loginUser(db, input);

    const response = jsonSuccess({
      success: true,
      userId: result.userId,
      role: result.role,
    });
    const isSecure = new URL(context.request.url).protocol === 'https:';
    return setSessionCookie(response, result.token, isSecure);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Login failed.' });
  }
};
