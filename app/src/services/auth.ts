import { eq, and, isNull, gt } from 'drizzle-orm';
import type { DB } from '../lib/db';
import { users, customerProfiles, emailVerificationTokens, passwordResets } from '@database/schema';
import { generateId, now } from '../lib/utils';
import { ConflictError, NotFoundError, UnauthorizedError, BadRequestError } from '../lib/errors';
import { signSession } from '../lib/auth';
import type { ValidatedRegister, ValidatedLogin } from '../lib/validation';
import { hashPassword, verifyPassword } from '../lib/password';
import { sendVerificationEmail, sendPasswordResetEmail } from '../lib/email';

/* ─── Register ──────────────────────────── */

export async function registerUser(db: DB, input: ValidatedRegister) {
  const [existing] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing) {
    throw new ConflictError('An account with this email already exists');
  }

  const userId = generateId();
  const profileId = generateId();
  const ts = now();

  const passwordHash = await hashPassword(input.password);

  await db.insert(users).values({
    id: userId,
    email: input.email,
    passwordHash,
    role: 'customer',
    isActive: 1,
    createdAt: ts,
    updatedAt: ts,
  });

  await db.insert(customerProfiles).values({
    id: profileId,
    userId,
    firstName: input.firstName || null,
    lastName: input.lastName || null,
    createdAt: ts,
    updatedAt: ts,
  });

  const verificationToken = generateId('vrf');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

  await db.insert(emailVerificationTokens).values({
    id: generateId(),
    userId,
    token: verificationToken,
    expiresAt,
    createdAt: ts,
  });

  sendVerificationEmail(input.email, verificationToken, input.firstName).catch(() => {});

  return { userId, role: 'customer' };
}

/* ─── Verify Email ──────────────────────── */

export async function verifyEmail(db: DB, token: string) {
  const ts = now();

  const [record] = await db
    .select()
    .from(emailVerificationTokens)
    .where(
      and(
        eq(emailVerificationTokens.token, token),
        gt(emailVerificationTokens.expiresAt, ts),
      ),
    )
    .limit(1);

  if (!record) {
    throw new BadRequestError('Invalid or expired verification link');
  }

  await db
    .update(users)
    .set({ emailVerifiedAt: ts, updatedAt: ts })
    .where(eq(users.id, record.userId));

  await db
    .delete(emailVerificationTokens)
    .where(eq(emailVerificationTokens.id, record.id));

  return { verified: true };
}

/* ─── Login ─────────────────────────────── */

export async function loginUser(db: DB, input: ValidatedLogin) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.email, input.email), isNull(users.deletedAt)))
    .limit(1);

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Account is deactivated');
  }

  if (!user.emailVerifiedAt) {
    throw new UnauthorizedError('Please verify your email before logging in');
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const token = await signSession(user.id, user.role);
  return { userId: user.id, token, role: user.role };
}

/* ─── Forgot Password ───────────────────── */

export async function forgotPassword(db: DB, email: string) {
  const ts = now();

  const [user] = await db
    .select({ id: users.id, email: users.email })
    .from(users)
    .where(and(eq(users.email, email), isNull(users.deletedAt)))
    .limit(1);

  if (!user) return { sent: true };

  const existingTokens = await db
    .select({ id: passwordResets.id })
    .from(passwordResets)
    .where(and(eq(passwordResets.userId, user.id), isNull(passwordResets.usedAt)));

  for (const t of existingTokens) {
    await db.delete(passwordResets).where(eq(passwordResets.id, t.id));
  }

  const resetToken = generateId('rst');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  await db.insert(passwordResets).values({
    id: generateId(),
    userId: user.id,
    token: resetToken,
    expiresAt,
    createdAt: ts,
  });

  sendPasswordResetEmail(email, resetToken).catch(() => {});

  return { sent: true };
}

/* ─── Reset Password ────────────────────── */

export async function resetPassword(db: DB, token: string, newPassword: string) {
  const ts = now();

  const [record] = await db
    .select()
    .from(passwordResets)
    .where(
      and(
        eq(passwordResets.token, token),
        gt(passwordResets.expiresAt, ts),
        isNull(passwordResets.usedAt),
      ),
    )
    .limit(1);

  if (!record) {
    throw new BadRequestError('Invalid or expired reset link');
  }

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(users)
    .set({ passwordHash, updatedAt: ts })
    .where(eq(users.id, record.userId));

  await db
    .update(passwordResets)
    .set({ usedAt: ts })
    .where(eq(passwordResets.id, record.id));

  return { reset: true };
}

/* ─── Get Profile ───────────────────────── */

export async function getProfile(db: DB, userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      role: users.role,
      emailVerifiedAt: users.emailVerifiedAt,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) throw new NotFoundError('User');

  const [profile] = await db
    .select()
    .from(customerProfiles)
    .where(eq(customerProfiles.userId, userId))
    .limit(1);

  return { ...user, profile: profile ?? null };
}

/* ─── Update Profile ────────────────────── */

export async function updateProfile(
  db: DB,
  userId: string,
  data: { firstName?: string; lastName?: string; phone?: string },
) {
  const ts = now();

  const [profile] = await db
    .select()
    .from(customerProfiles)
    .where(eq(customerProfiles.userId, userId))
    .limit(1);

  if (!profile) throw new NotFoundError('Profile');

  const updates: Record<string, unknown> = { updatedAt: ts };
  if (data.firstName !== undefined) updates.firstName = data.firstName;
  if (data.lastName !== undefined) updates.lastName = data.lastName;
  if (data.phone !== undefined) updates.phone = data.phone;

  await db.update(customerProfiles).set(updates).where(eq(customerProfiles.id, profile.id));
}
