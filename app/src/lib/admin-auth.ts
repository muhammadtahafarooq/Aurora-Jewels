import type { APIContext } from 'astro';
import { verifySession } from './auth';

export async function requireAdminPage(context: APIContext): Promise<boolean> {
  try {
    const cookieHeader = context.request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/aj_session=([^;]+)/);
    if (!match) return false;
    const session = await verifySession(match[1]);
    return session?.role === 'admin';
  } catch {
    return false;
  }
}
