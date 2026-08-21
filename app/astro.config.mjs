import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// Configure Astro to build editorial pages as static and run API/Admin routes on serverless workers.
export default defineConfig({
  output: 'hybrid',
  adapter: cloudflare({
    imageService: 'compile', // Uses build-time optimized image pipeline to convert WebP/AVIF
  }),
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false, // Customized base styles are loaded in global.css
    }),
  ],
});
