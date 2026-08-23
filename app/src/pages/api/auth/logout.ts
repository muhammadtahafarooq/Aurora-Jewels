import type { APIRoute } from 'astro';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { clearSessionCookie } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const response = jsonSuccess({ success: true, message: 'Logged out' });
  const isSecure = new URL(context.request.url).protocol === 'https:';
  return clearSessionCookie(response, isSecure);
};
