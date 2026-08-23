import type { APIContext } from 'astro';
import { SignJWT, jwtVerify } from 'jose';
import type { JWTPayload } from 'jose';
import { createDb, type DB } from './db';
import { users } from '@database/schema';
import { eq, and, isNull } from 'drizzle-orm';
import { UnauthorizedError, ForbiddenError } from './errors';

/* ─── Config ────────────────────────────── */

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'aurora-jewels-dev-secret-change-in-production',
);

const COOKIE_NAME = 'aj_session';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/* ─── JWT Types ─────────────────────────── */

export interface SessionPayload extends JWTPayload {
  sub: string; // user id
  role: string;
}

/* ─── Helpers ───────────────────────────── */

export function signSession(userId: string, role: string): Promise<string> {
  return new SignJWT({ sub: userId, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${TOKEN_MAX_AGE}s`)
    .sign(JWT_SECRET);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

export function setSessionCookie(response: Response, token: string, isSecure: boolean = true): Response {
  const secure = isSecure ? '; Secure' : '';
  const cookie = `${COOKIE_NAME}=${token}; Path=/; HttpOnly;${secure} SameSite=Strict; Max-Age=${TOKEN_MAX_AGE}`;
  response.headers.append('Set-Cookie', cookie);
  return response;
}

export function clearSessionCookie(response: Response, isSecure: boolean = true): Response {
  const secure = isSecure ? '; Secure' : '';
  response.headers.append(
    'Set-Cookie',
    `${COOKIE_NAME}=; Path=/; HttpOnly;${secure} SameSite=Strict; Max-Age=0`,
  );
  return response;
}

function getSessionToken(context: APIContext): string | null {
  const cookieHeader = context.request.headers.get('Cookie') || '';
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/* ─── Session Extraction ────────────────── */

export async function getSession(context: APIContext): Promise<SessionPayload | null> {
  const token = getSessionToken(context);
  if (!token) return null;
  return verifySession(token);
}

/* ─── Authentication Guards ─────────────── */

export async function requireAuth(context: APIContext): Promise<SessionPayload> {
  const session = await getSession(context);
  if (!session) throw new UnauthorizedError();
  return session;
}

export async function requireAdmin(context: APIContext): Promise<SessionPayload> {
  const session = await requireAuth(context);
  if (session.role !== 'admin') throw new ForbiddenError('Admin access required');
  return session;
}

/* ─── DB User Lookup ────────────────────── */

export async function getUserByEmail(db: DB, email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);
  return user ?? null;
}

export async function getUserById(db: DB, id: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  return user ?? null;
}

export { COOKIE_NAME };
