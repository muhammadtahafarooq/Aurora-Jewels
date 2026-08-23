import type { APIRoute } from 'astro';
import { eq, and, isNull } from 'drizzle-orm';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess, BadRequestError } from '../../../lib/errors';
import { requireAuth } from '../../../lib/auth';
import { generateId } from '../../../lib/utils';
import { customerAddresses } from '@database/schema';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    const session = await requireAuth(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const addresses = await db
      .select()
      .from(customerAddresses)
      .where(and(eq(customerAddresses.userId, session.sub), isNull(customerAddresses.deletedAt)));

    return jsonSuccess({ addresses });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch addresses.' });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    const session = await requireAuth(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();

    if (typeof body.recipientName !== 'string' || body.recipientName.trim().length < 2) {
      throw new BadRequestError('recipientName must be at least 2 characters', 'VALIDATION_ERROR');
    }
    if (typeof body.phone !== 'string' || body.phone.trim().length === 0) {
      throw new BadRequestError('phone is required', 'VALIDATION_ERROR');
    }
    if (typeof body.addressLine1 !== 'string' || body.addressLine1.trim().length < 5) {
      throw new BadRequestError('addressLine1 must be at least 5 characters', 'VALIDATION_ERROR');
    }
    if (typeof body.city !== 'string' || body.city.trim().length < 2) {
      throw new BadRequestError('city must be at least 2 characters', 'VALIDATION_ERROR');
    }

    const id = generateId('addr');

    await db.insert(customerAddresses).values({
      id,
      userId: session.sub,
      recipientName: body.recipientName.trim(),
      phone: body.phone.trim(),
      addressLine1: body.addressLine1.trim(),
      addressLine2: body.addressLine2?.trim() || null,
      city: body.city.trim(),
      province: body.province?.trim() || null,
      postalCode: body.postalCode?.trim() || null,
      country: body.country?.trim() || 'PK',
      isDefault: body.isDefault ? 1 : 0,
      label: body.label?.trim() || null,
    });

    return jsonSuccess({ id }, 201);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to create address.' });
  }
};
