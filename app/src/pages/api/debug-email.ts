import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = (context.locals as any).runtime?.env;
  return new Response(JSON.stringify({
    hasBREVO_API_KEY: !!env?.BREVO_API_KEY,
    BREVO_API_KEY_length: env?.BREVO_API_KEY?.length || 0,
    FROM_EMAIL: env?.FROM_EMAIL || 'NOT SET',
    FROM_NAME: env?.FROM_NAME || 'NOT SET',
    ADMIN_EMAIL: env?.ADMIN_EMAIL || 'NOT SET',
  }, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
};
