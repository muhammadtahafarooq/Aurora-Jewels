var BREVO_API_KEY = process.env.BREVO_API_KEY || '';
var FROM_EMAIL = process.env.FROM_EMAIL || 'admin@aurorajewels.pk';
var FROM_NAME = process.env.FROM_NAME || 'Aurora Jewels';
var ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@aurorajewels.pk';
var APP_URL = process.env.APP_URL || 'http://localhost:4321';

var DEV_MODE = !BREVO_API_KEY;

export { DEV_MODE, ADMIN_EMAIL };

export function baseUrl(): string {
  return APP_URL;
}

export function fmt(amount: number): string {
  return 'Rs. ' + (amount / 100).toFixed(0);
}

function btn(href: string, label: string): string {
  return '<a href="' + href + '" style="display:inline-block;padding:12px 24px;background:#0D302B;color:#FAF8F3;text-decoration:none;font-weight:600;font-size:14px;">' + label + '</a>';
}

function p(text: string): string {
  return '<p style="margin:0 0 16px 0;color:#171A18;font-size:14px;line-height:1.6;">' + text + '</p>';
}

function muted(text: string): string {
  return '<p style="margin:0 0 16px 0;color:#6B7280;font-size:13px;line-height:1.5;">' + text + '</p>';
}

function infoRow(label: string, value: string): string {
  return '<div style="display:flex;justify-content:space-between;padding:8px 0;"><span style="color:#6B7280;font-size:13px;">' + label + '</span><span style="color:#171A18;font-size:13px;font-weight:500;">' + value + '</span></div>';
}

function wrap(title: string, bodyHtml: string): string {
  var year = new Date().getFullYear();
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body style="margin:0;padding:0;background-color:#FAF8F3;font-family:Georgia,serif;">'
    + '<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#FAF8F3;padding:24px 0;"><tr><td align="center">'
    + '<table width="600" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;overflow:hidden;">'
    + '<tr><td style="background-color:#FFFFFF;padding:24px 40px;border-bottom:2px solid #C6A56A;"><h1 style="margin:0;color:#0D302B;font-size:24px;font-weight:600;">Aurora Jewels</h1></td></tr>'
    + '<tr><td style="padding:32px 40px;"><h2 style="margin:0 0 24px 0;color:#0D302B;font-size:20px;font-weight:600;">' + title + '</h2>' + bodyHtml + '</td></tr>'
    + '<tr><td style="background-color:#F9FAFB;padding:24px 40px;border-top:1px solid #E5E7EB;">'
    + '<p style="margin:0 0 8px 0;color:#6B7280;font-size:12px;">Aurora Jewels | <a href="https://aurorajewels.pk" style="color:#C6A56A;text-decoration:none;">aurorajewels.pk</a></p>'
    + '<p style="margin:0;color:#9CA3AF;font-size:11px;">&copy; ' + year + ' Aurora Jewels. All rights reserved.</p></td></tr>'
    + '</table></td></tr></table></body></html>';
}

async function send(to: string, subject: string, html: string): Promise<void> {
  if (DEV_MODE) {
    console.log('[DEV EMAIL] To: ' + to + ' | Subject: ' + subject);
    return;
  }
  try {
    var res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: FROM_EMAIL, name: FROM_NAME },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });
    if (!res.ok) {
      var err = await res.text();
      console.error('Brevo email error (' + res.status + '):', err);
    }
  } catch (error) {
    console.error('Email send error:', error);
  }
}

export { send };

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{ name: string; quantity: number; unitPrice: number; lineTotal: number }>;
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  shippingAddress: string;
}

export async function sendVerificationEmail(to: string, token: string, firstName?: string): Promise<void> {
  var name = firstName ? firstName : 'there';
  var link = baseUrl() + '/verify-email?token=' + token;
  var body = p('Hi ' + name + ',')
    + p('Thank you for signing up at Aurora Jewels. Please verify your email address by clicking the button below.')
    + btn(link, 'Verify Email')
    + muted('This link will expire in 24 hours. If you did not create an account, please ignore this email.');
  var html = wrap('Verify Your Email', body);
  await send(to, 'Verify Your Email - Aurora Jewels', html);
}

export async function sendWelcomeEmail(to: string, firstName?: string): Promise<void> {
  var name = firstName ? firstName : 'there';
  var buttons = '<div style="margin:24px 0;">'
    + btn(baseUrl() + '/collections', 'Browse Collection')
    + ' &nbsp; '
    + btn(baseUrl() + '/account', 'My Account')
    + '</div>';
  var body = p('Hi ' + name + ',')
    + p('Your email has been verified successfully. Welcome to the Aurora Jewels family!')
    + p('Explore our curated collection of fine jewelry pieces crafted just for you.')
    + buttons;
  var html = wrap('Welcome to Aurora Jewels!', body);
  await send(to, 'Welcome to Aurora Jewels!', html);
}

export async function sendPasswordResetEmail(to: string, token: string, firstName?: string): Promise<void> {
  var name = firstName ? firstName : 'there';
  var link = baseUrl() + '/reset-password?token=' + token;
  var body = p('Hi ' + name + ',')
    + p('We received a request to reset your password. Click the button below to set a new password.')
    + btn(link, 'Reset Password')
    + muted('This link will expire in 1 hour. If you did not request a password reset, please ignore this email.');
  var html = wrap('Reset Your Password', body);
  await send(to, 'Reset Your Password - Aurora Jewels', html);
}

export async function sendOrderConfirmation(data: OrderEmailData): Promise<void> {
  var itemsHtml = '';
  for (var i = 0; i < data.items.length; i++) {
    var item = data.items[i];
    itemsHtml += '<tr style="border-bottom:1px solid #E5E7EB;">'
      + '<td style="padding:12px 0;color:#171A18;font-size:13px;">' + item.name + '</td>'
      + '<td style="padding:12px 0;color:#6B7280;font-size:13px;text-align:center;">' + item.quantity + '</td>'
      + '<td style="padding:12px 0;color:#171A18;font-size:13px;text-align:right;">' + fmt(item.unitPrice) + '</td>'
      + '<td style="padding:12px 0;color:#171A18;font-size:13px;text-align:right;font-weight:500;">' + fmt(item.lineTotal) + '</td>'
      + '</tr>';
  }

  var discountRow = '';
  if (data.discountAmount > 0) {
    var couponLabel = data.couponCode ? ' (' + data.couponCode + ')' : '';
    discountRow = infoRow('Discount' + couponLabel, '-' + fmt(data.discountAmount));
  }

  var orderBox = '<div style="background-color:#F9FAFB;padding:16px;margin:16px 0;">'
    + '<p style="margin:0 0 8px 0;color:#6B7280;font-size:12px;">Order Number</p>'
    + '<p style="margin:0;color:#0D302B;font-size:18px;font-weight:600;">' + data.orderNumber + '</p></div>';

  var tableHeader = '<tr style="border-bottom:2px solid #E5E7EB;">'
    + '<td style="padding:8px 0;color:#6B7280;font-size:12px;font-weight:600;">Item</td>'
    + '<td style="padding:8px 0;color:#6B7280;font-size:12px;font-weight:600;text-align:center;">Qty</td>'
    + '<td style="padding:8px 0;color:#6B7280;font-size:12px;font-weight:600;text-align:right;">Price</td>'
    + '<td style="padding:8px 0;color:#6B7280;font-size:12px;font-weight:600;text-align:right;">Total</td></tr>';

  var summary = '<div style="border-top:2px solid #E5E7EB;padding-top:16px;margin-top:16px;">'
    + infoRow('Subtotal', fmt(data.subtotal))
    + discountRow
    + infoRow('Shipping', fmt(data.shippingAmount))
    + infoRow('Total (COD)', '<span style="color:#0D302B;font-weight:700;font-size:15px;">' + fmt(data.totalAmount) + '</span>')
    + '</div>';

  var addressBox = '<div style="background-color:#F9FAFB;padding:16px;margin:24px 0;">'
    + '<p style="margin:0 0 8px 0;color:#6B7280;font-size:12px;">Shipping Address</p>'
    + '<p style="margin:0;color:#171A18;font-size:13px;line-height:1.5;">' + data.shippingAddress + '</p></div>';

  var table = '<table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">'
    + tableHeader + itemsHtml + '</table>';

  var body = p('Hi ' + data.customerName + ',')
    + p('Thank you for your order! We have received your order and it is being processed.')
    + orderBox + table + summary + addressBox
    + muted('Payment is Cash on Delivery (COD). Please keep the exact amount ready at delivery.')
    + btn(baseUrl() + '/orders', 'View Order');
  var html = wrap('Order Confirmed!', body);
  await send(data.customerEmail, 'Order Confirmed - ' + data.orderNumber + ' - Aurora Jewels', html);
}

export async function sendPaymentConfirmation(data: { orderNumber: string; customerName: string; customerEmail: string; totalAmount: number }): Promise<void> {
  var amountBox = '<div style="background-color:#F9FAFB;padding:16px;margin:16px 0;">'
    + '<p style="margin:0 0 8px 0;color:#6B7280;font-size:12px;">Amount Received</p>'
    + '<p style="margin:0;color:#0D302B;font-size:24px;font-weight:700;">' + fmt(data.totalAmount) + '</p></div>';
  var body = p('Hi ' + data.customerName + ',')
    + p('We have received your Cash on Delivery (COD) payment for order <strong>' + data.orderNumber + '</strong>.')
    + amountBox
    + muted('Thank you for your payment. If you have any questions, please contact our support team.')
    + btn(baseUrl() + '/orders', 'View Order');
  var html = wrap('Payment Received', body);
  await send(data.customerEmail, 'Payment Received - ' + data.orderNumber + ' - Aurora Jewels', html);
}

export async function sendShippingNotification(data: { orderNumber: string; customerName: string; customerEmail: string; trackingInfo?: string }): Promise<void> {
  var trackingHtml = '';
  if (data.trackingInfo) {
    trackingHtml = '<div style="background-color:#F9FAFB;padding:16px;margin:16px 0;">'
      + '<p style="margin:0 0 8px 0;color:#6B7280;font-size:12px;">Tracking Information</p>'
      + '<p style="margin:0;color:#171A18;font-size:13px;">' + data.trackingInfo + '</p></div>';
  }
  var body = p('Hi ' + data.customerName + ',')
    + p('Great news! Your order <strong>' + data.orderNumber + '</strong> has been shipped and is on its way to you.')
    + trackingHtml
    + muted('If you have any questions about your shipment, please contact our support team.')
    + btn(baseUrl() + '/orders', 'Track Order');
  var html = wrap('Your Order Has Been Shipped!', body);
  await send(data.customerEmail, 'Order Shipped - ' + data.orderNumber + ' - Aurora Jewels', html);
}

export async function sendDeliveryNotification(data: { orderNumber: string; customerName: string; customerEmail: string }): Promise<void> {
  var body = p('Hi ' + data.customerName + ',')
    + p('Your order <strong>' + data.orderNumber + '</strong> has been delivered successfully. We hope you love your new jewelry!')
    + p('We would greatly appreciate it if you could take a moment to leave a review.')
    + btn(baseUrl() + '/orders/' + data.orderNumber + '/review', 'Leave a Review')
    + muted('Thank you for choosing Aurora Jewels!');
  var html = wrap('Your Order Has Been Delivered!', body);
  await send(data.customerEmail, 'Order Delivered - ' + data.orderNumber + ' - Aurora Jewels', html);
}

export async function sendAdminOrderNotification(data: { orderNumber: string; customerName: string; customerEmail: string; customerPhone: string; totalAmount: number; itemCount: number }): Promise<void> {
  var details = '<div style="background-color:#F9FAFB;padding:16px;margin:16px 0;">'
    + infoRow('Order Number', data.orderNumber)
    + infoRow('Customer', data.customerName)
    + infoRow('Email', data.customerEmail)
    + infoRow('Phone', data.customerPhone)
    + infoRow('Items', String(data.itemCount))
    + infoRow('Total (COD)', fmt(data.totalAmount))
    + '</div>';
  var body = p('A new order has been placed on Aurora Jewels.')
    + details
    + muted('This is an automated notification. Please review the order in the admin dashboard.');
  var html = wrap('New Order Received', body);
  await send(ADMIN_EMAIL, 'New Order - ' + data.orderNumber + ' - Aurora Jewels', html);
}

export async function sendContactFormNotification(data: { name: string; email: string; subject: string; message: string }): Promise<void> {
  var details = '<div style="background-color:#F9FAFB;padding:16px;margin:16px 0;">'
    + infoRow('Name', data.name)
    + infoRow('Email', data.email)
    + infoRow('Subject', data.subject)
    + '</div>'
    + '<div style="background-color:#F9FAFB;padding:16px;margin:16px 0;">'
    + '<p style="margin:0 0 8px 0;color:#6B7280;font-size:12px;">Message</p>'
    + '<p style="margin:0;color:#171A18;font-size:13px;line-height:1.5;">' + data.message + '</p></div>';
  var body = p('A new message has been received from the contact form.')
    + details
    + muted('Please respond to the customer at ' + data.email + '.');
  var html = wrap('New Contact Form Message', body);
  await send(ADMIN_EMAIL, 'Contact Form - ' + data.subject + ' - Aurora Jewels', html);
}
