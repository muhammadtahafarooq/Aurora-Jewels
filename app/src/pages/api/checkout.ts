import type { APIRoute } from 'astro';

export const prerender = false; // Ensures this endpoint is built as a serverless edge endpoint (SSR)

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { name, email, phone, address, city, items } = body;

    // 1. Basic validation (Ensure no missing variables)
    if (!name || !email || !phone || !address || !city || !items || !Array.isArray(items)) {
      return new Response(JSON.stringify({ error: 'Missing required checkout parameters.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // TODO: Write order record in Cloudflare D1 via Drizzle ORM
    // TODO: Trigger asynchronous Resend order email notification using context.waitUntil()

    return new Response(JSON.stringify({ success: true, message: 'COD Order placed successfully.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Checkout failed internally.', details: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
