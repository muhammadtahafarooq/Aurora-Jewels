import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { requireAdmin } from '../../../lib/auth';
import { users, orders, products, reviews } from '@database/schema';
import { isNull, sql, desc } from 'drizzle-orm';

export const prerender = false;

async function countRows(db: ReturnType<typeof createDb>, query: ReturnType<typeof db.select>) {
  const rows = await query;
  return rows[0] ? Object.values(rows[0])[0] as number : 0;
}

export const GET: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const tO = await countRows(db, db.select({ c: sql`count(*)` }).from(orders));
    const tP = await countRows(db, db.select({ c: sql`count(*)` }).from(products).where(isNull(products.deletedAt)));
    const tC = await countRows(db, db.select({ c: sql`count(*)` }).from(users).where(sql`${users.role} = 'customer' AND ${users.deletedAt} IS NULL`));
    const tR = await countRows(db, db.select({ c: sql`coalesce(sum(${orders.totalAmount}),0)` }).from(orders).where(sql`${orders.status} != 'cancelled'`));
    const pR = await countRows(db, db.select({ c: sql`count(*)` }).from(reviews).where(sql`${reviews.status} = 'pending' AND ${reviews.deletedAt} IS NULL`));

    const recentOrders = await db
      .select({ id: orders.id, orderNumber: orders.orderNumber, customerName: orders.customerName, totalAmount: orders.totalAmount, status: orders.status, createdAt: orders.createdAt })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(5);

    return jsonSuccess({ totalOrders: tO, totalProducts: tP, totalCustomers: tC, totalRevenue: tR, pendingReviews: pR, recentOrders });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch stats.' });
  }
};
