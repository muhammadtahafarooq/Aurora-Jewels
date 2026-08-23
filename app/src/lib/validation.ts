import { BadRequestError } from './errors';

/* ─── Checkout Validation ───────────────── */

interface CheckoutItem {
  slug: string;
  variantId?: string;
  qty: number;
}

interface CheckoutPayload {
  name: unknown;
  email: unknown;
  phone: unknown;
  address: unknown;
  city: unknown;
  province?: unknown;
  postalCode?: unknown;
  items: unknown;
  couponCode?: unknown;
  notes?: unknown;
}

export interface ValidatedCheckout {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  items: CheckoutItem[];
  couponCode: string | null;
  notes: string | null;
}

export function validateCheckout(body: CheckoutPayload): ValidatedCheckout {
  const errors: string[] = [];

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  if (name.length < 2) errors.push('Name is required (min 2 chars)');

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');

  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  if (!/^[+\d][\d\s-]{7,}$/.test(phone)) errors.push('Valid phone number is required');

  const address = typeof body.address === 'string' ? body.address.trim() : '';
  if (address.length < 5) errors.push('Address is required (min 5 chars)');

  const city = typeof body.city === 'string' ? body.city.trim() : '';
  if (city.length < 2) errors.push('City is required');

  const province = typeof body.province === 'string' ? body.province.trim() : '';
  const postalCode = typeof body.postalCode === 'string' ? body.postalCode.trim() : '';

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push('At least one item is required');
  }

  const items: CheckoutItem[] = [];
  if (Array.isArray(body.items)) {
    for (const item of body.items) {
      const slug = typeof item?.slug === 'string' ? item.slug.trim() : '';
      const qty = typeof item?.qty === 'number' ? item.qty : parseInt(String(item?.qty), 10);
      if (!slug) errors.push('Item slug is required');
      if (!Number.isInteger(qty) || qty < 1) errors.push('Item quantity must be at least 1');
      items.push({ slug, variantId: item?.variantId || undefined, qty: qty || 1 });
    }
  }

  const couponCode =
    typeof body.couponCode === 'string' && body.couponCode.trim()
      ? body.couponCode.trim().toUpperCase()
      : null;

  const notes =
    typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim().slice(0, 500) : null;

  if (errors.length > 0) {
    throw new BadRequestError(errors.join('; '), 'VALIDATION_ERROR');
  }

  return { name, email, phone, address, city, province, postalCode, items, couponCode, notes };
}

/* ─── Review Validation ─────────────────── */

interface ReviewPayload {
  productId: unknown;
  rating: unknown;
  title?: unknown;
  body: unknown;
  customerName: unknown;
}

export interface ValidatedReview {
  productId: string;
  rating: number;
  title: string | null;
  body: string;
  customerName: string;
}

export function validateReview(body: ReviewPayload): ValidatedReview {
  const errors: string[] = [];

  const productId = typeof body.productId === 'string' ? body.productId.trim() : '';
  if (!productId) errors.push('Product ID is required');

  const rating = typeof body.rating === 'number' ? body.rating : parseInt(String(body.rating), 10);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    errors.push('Rating must be between 1 and 5');
  }

  const title =
    typeof body.title === 'string' && body.title.trim() ? body.title.trim().slice(0, 100) : null;

  const reviewBody = typeof body.body === 'string' ? body.body.trim() : '';
  if (reviewBody.length < 10) errors.push('Review body is required (min 10 chars)');

  const customerName =
    typeof body.customerName === 'string' ? body.customerName.trim() : '';
  if (customerName.length < 2) errors.push('Customer name is required');

  if (errors.length > 0) {
    throw new BadRequestError(errors.join('; '), 'VALIDATION_ERROR');
  }

  return { productId, rating, title, body: reviewBody, customerName };
}

/* ─── Auth Validation ───────────────────── */

interface RegisterPayload {
  email: unknown;
  password: unknown;
  firstName?: unknown;
  lastName?: unknown;
}

export interface ValidatedRegister {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export function validateRegister(body: RegisterPayload): ValidatedRegister {
  const errors: string[] = [];

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');

  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length < 8) errors.push('Password must be at least 8 characters');

  const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
  const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';

  if (errors.length > 0) {
    throw new BadRequestError(errors.join('; '), 'VALIDATION_ERROR');
  }

  return { email, password, firstName, lastName };
}

interface LoginPayload {
  email: unknown;
  password: unknown;
}

export interface ValidatedLogin {
  email: string;
  password: string;
}

export function validateLogin(body: LoginPayload): ValidatedLogin {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!email || !password) {
    throw new BadRequestError('Email and password are required', 'VALIDATION_ERROR');
  }

  return { email, password };
}

/* ─── Coupon Validation ─────────────────── */

interface CouponPayload {
  code: unknown;
}

export function validateCouponPayload(body: CouponPayload): string {
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  if (!code || code.length < 3) {
    throw new BadRequestError('Coupon code is required', 'VALIDATION_ERROR');
  }
  return code;
}

/* ─── Forgot Password Validation ────────── */

interface ForgotPasswordPayload {
  email: unknown;
}

export function validateForgotPassword(body: ForgotPasswordPayload): string {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BadRequestError('Valid email is required', 'VALIDATION_ERROR');
  }
  return email;
}

/* ─── Reset Password Validation ─────────── */

interface ResetPasswordPayload {
  token: unknown;
  password: unknown;
}

export interface ValidatedResetPassword {
  token: string;
  password: string;
}

export function validateResetPassword(body: ResetPasswordPayload): ValidatedResetPassword {
  const errors: string[] = [];

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  if (!token) errors.push('Reset token is required');

  const password = typeof body.password === 'string' ? body.password : '';
  if (password.length < 8) errors.push('Password must be at least 8 characters');

  if (errors.length > 0) {
    throw new BadRequestError(errors.join('; '), 'VALIDATION_ERROR');
  }

  return { token, password };
}

/* ─── Order Status Update ───────────────── */

interface OrderStatusPayload {
  status: unknown;
  paymentStatus?: unknown;
}

const VALID_ORDER_STATUSES = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const VALID_PAYMENT_STATUSES = ['pending', 'cod_due', 'paid', 'failed', 'refunded'];

export interface ValidatedOrderUpdate {
  status?: string;
  paymentStatus?: string;
}

export function validateOrderUpdate(body: OrderStatusPayload): ValidatedOrderUpdate {
  const result: ValidatedOrderUpdate = {};

  if (typeof body.status === 'string') {
    if (!VALID_ORDER_STATUSES.includes(body.status)) {
      throw new BadRequestError(`Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`);
    }
    result.status = body.status;
  }

  if (typeof body.paymentStatus === 'string') {
    if (!VALID_PAYMENT_STATUSES.includes(body.paymentStatus)) {
      throw new BadRequestError(`Invalid payment status. Must be one of: ${VALID_PAYMENT_STATUSES.join(', ')}`);
    }
    result.paymentStatus = body.paymentStatus;
  }

  if (!result.status && !result.paymentStatus) {
    throw new BadRequestError('At least one of status or paymentStatus is required');
  }

  return result;
}
