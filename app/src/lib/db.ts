import { drizzle } from 'drizzle-orm/d1';
import type { D1Database } from '@cloudflare/workers-types';
import type { DrizzleD1 } from 'drizzle-orm/d1';
import * as schema from '@database/schema';

export function createDb(env: { DB: D1Database }) {
  return drizzle(env.DB as unknown as DrizzleD1, { schema });
}

export type DB = ReturnType<typeof createDb>;
