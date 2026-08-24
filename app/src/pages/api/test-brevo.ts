import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const env = (context.locals as any).runtime?.env;
  const apiKey = env?.BREVO_API_KEY;
  const fromEmail = env?.FROM_EMAIL || 'webdevelopmenttestgmail@gmail.com';

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'No BREVO_API_KEY' }), { status: 500 });
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: fromEmail, name: 'Aurora Jewels' },
        to: [{ email: 'muhammadtahafarooq22@gmail.com' }],
        subject: 'Test - Aurora Jewels',
        htmlContent: '<p>This is a test email from Aurora Jewels.</p>',
      }),
    });

    const text = await res.text();
    return new Response(JSON.stringify({
      status: res.status,
      statusText: res.statusText,
      body: text,
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
