import type { APIRoute } from 'astro';

export const prerender = false;

const BASE = 'https://aurorajewels.pk';

const staticPages = [
  '', '/shop', '/collections', '/new-arrivals', '/about', '/our-story', '/location',
  '/contact', '/faq', '/privacy-policy', '/terms-conditions', '/shipping-returns',
  '/register', '/login', '/forgot-password', '/cart', '/checkout',
];

export const GET: APIRoute = async () => {
  const urls = staticPages.map((path) => `  <url><loc>${BASE}${path}</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
};
