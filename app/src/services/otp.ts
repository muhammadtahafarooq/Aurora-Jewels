import { eq, and, gt, isNull } from 'drizzle-orm';
import type { DB } from '../lib/db';
import { otpCodes } from '@database/schema';
import { generateId, now } from '../lib/utils';
import { send } from '../lib/email';
import { BadRequestError } from '../lib/errors';

const OTP_EXPIRY_MINUTES = 10;
const OTP_LENGTH = 6;

function generateOTP(): string {
  let code = '';
  for (let i = 0; i < OTP_LENGTH; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

function getOTPExpiry(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + OTP_EXPIRY_MINUTES);
  return d.toISOString();
}

export async function sendOTP(
  db: DB,
  email: string,
  purpose: 'register' | 'reset_password',
): Promise<{ success: boolean }> {
  const code = generateOTP();
  const ts = now();
  const id = generateId('otp');
  const expiresAt = getOTPExpiry();

  await db.insert(otpCodes).values({
    id,
    email: email.toLowerCase(),
    code,
    purpose,
    expiresAt,
    createdAt: ts,
  });

  const subject = purpose === 'register'
    ? 'Verify your Aurora Jewels account'
    : 'Reset your Aurora Jewels password';

  const body = purpose === 'register'
    ? `<p>Your verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;margin:16px 0;">${code}</p><p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`
    : `<p>Your password reset code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:4px;margin:16px 0;">${code}</p><p>This code expires in ${OTP_EXPIRY_MINUTES} minutes.</p>`;

  await send(email, subject, body);

  return { success: true };
}

export async function verifyOTP(
  db: DB,
  email: string,
  code: string,
  purpose: 'register' | 'reset_password',
): Promise<{ valid: boolean }> {
  const ts = now();

  const [otp] = await db
    .select()
    .from(otpCodes)
    .where(
      and(
        eq(otpCodes.email, email.toLowerCase()),
        eq(otpCodes.code, code),
        eq(otpCodes.purpose, purpose),
        isNull(otpCodes.usedAt),
        gt(otpCodes.expiresAt, ts),
      ),
    )
    .limit(1);

  if (!otp) {
    throw new BadRequestError('Invalid or expired verification code', 'INVALID_OTP');
  }

  await db.update(otpCodes).set({ usedAt: ts }).where(eq(otpCodes.id, otp.id));

  return { valid: true };
}
