import type { APIRoute } from 'astro';
import { createDb } from '../../../lib/db';
import { jsonError, jsonSuccess } from '../../../lib/errors';
import { requireAdmin } from '../../../lib/auth';
import { createProduct, updateProduct, deleteProduct, listProducts } from '../../../services/products';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const page = parseInt(url.searchParams.get('page') ?? '1', 10);
    const perPage = parseInt(url.searchParams.get('perPage') ?? '50', 10);

    const result = await listProducts(db, { page, perPage, status: undefined });
    return jsonSuccess(result);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to fetch products.' });
  }
};

export const POST: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const body = await context.request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const slug = typeof body.slug === 'string' ? body.slug.trim() : '';
    if (!name || !slug) return jsonError(400, { error: 'name and slug are required' });

    const result = await createProduct(db, {
      name,
      slug,
      description: body.description,
      shortDescription: body.shortDescription,
      status: body.status,
      isFeatured: body.isFeatured,
    });

    return jsonSuccess(result, 201);
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to create product.' });
  }
};

export const PATCH: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonError(400, { error: 'Product ID is required' });

    const body = await context.request.json();
    await updateProduct(db, id, body);
    return jsonSuccess({ success: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to update product.' });
  }
};

export const DELETE: APIRoute = async (context) => {
  try {
    await requireAdmin(context);
    const env = (context.locals as any).runtime?.env;
    if (!env?.DB) return jsonError(500, { error: 'Database not configured' });
    const db = createDb(env);

    const url = new URL(context.request.url);
    const id = url.searchParams.get('id');
    if (!id) return jsonError(400, { error: 'Product ID is required' });

    await deleteProduct(db, id);
    return jsonSuccess({ success: true });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to delete product.' });
  }
};
