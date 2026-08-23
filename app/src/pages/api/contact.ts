import type { APIRoute } from 'astro';
import { BadRequestError, jsonError, jsonSuccess } from '../../lib/errors';
import { sendContactFormNotification } from '../../lib/email';

export const prerender = false;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json();
    const { name, email, subject, message } = body as Record<string, unknown>;

    if (typeof name !== 'string' || name.trim().length < 2) {
      throw new BadRequestError('Name must be at least 2 characters.', 'INVALID_NAME');
    }
    if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      throw new BadRequestError('Please provide a valid email address.', 'INVALID_EMAIL');
    }
    if (typeof message !== 'string' || message.trim().length < 10) {
      throw new BadRequestError('Message must be at least 10 characters.', 'INVALID_MESSAGE');
    }

    await sendContactFormNotification({
      name: name.trim(),
      email: email.trim(),
      subject: (typeof subject === 'string' && subject.trim().length > 0) ? subject.trim() : 'Contact Form',
      message: message.trim(),
    });

    return jsonSuccess({ success: true, message: 'Message received. We will get back to you shortly.' });
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err) {
      const e = err as { status: number; code: string; message: string };
      return jsonError(e.status, { error: e.message, code: e.code });
    }
    return jsonError(500, { error: 'Failed to send message.' });
  }
};
