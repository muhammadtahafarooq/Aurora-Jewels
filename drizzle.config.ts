import type { Config } from 'drizzle-kit';

export default {
  schema: './database/schema.ts',
  out: './database/migrations',
  dialect: 'sqlite',
  driver: 'd1-http', // Configured to push migrations directly to Cloudflare D1 local/cloud
} satisfies Config;
