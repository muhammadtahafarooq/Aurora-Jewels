import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// 1. Products Table
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  price: integer('price').notNull(), // in cents (e.g. 5000 = Rs. 50.00)
  isFeatured: integer('is_featured').default(0).notNull(), // 0 = false, 1 = true
  isNewArrival: integer('is_new_arrival').default(0).notNull(), // 0 = false, 1 = true
  stockStatus: text('stock_status').default('in_stock').notNull(), // in_stock, low_stock, out_of_stock
  createdAt: integer('created_at').notNull(), // epoch timestamp
  updatedAt: integer('updated_at').notNull(),
});

// 2. Product Images Table (4:5 Portrait Gallery)
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  url: text('url').notNull(), // Cloudflare R2 path
  position: integer('position').default(0).notNull(),
});

// 3. Product Variants Table (e.g., sizes, metal colors)
export const productVariants = sqliteTable('product_variants', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  name: text('name').notNull(), // e.g. "Size: 6", "18K Yellow Gold"
  sku: text('sku').unique(),
  priceOverride: integer('price_override'), // in cents, overrides base product price if not null
  stock: integer('stock').default(0).notNull(),
});

// 4. Orders Table (COD Only)
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), // AJ-1001 or UUID
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email').notNull(),
  customerPhone: text('customer_phone').notNull(), // Mandatory contact number for COD verification
  shippingAddress: text('shipping_address').notNull(),
  city: text('city').notNull(), // Delivery routing (Karachi, Lahore, etc.)
  totalAmount: integer('total_amount').notNull(), // in cents
  status: text('status').default('pending').notNull(), // pending, confirmed, shipped, delivered, cancelled
  couponApplied: text('coupon_applied'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// 5. Order Items Pivot Table
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id')
    .notNull()
    .references(() => products.id),
  variantId: text('variant_id')
    .references(() => productVariants.id),
  quantity: integer('quantity').notNull(),
  price: integer('price').notNull(), // Historical price in cents
});

// 6. Product Reviews Table
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  customerName: text('customer_name').notNull(),
  rating: integer('rating').notNull(), // 1 to 5
  comment: text('comment'),
  isApproved: integer('is_approved').default(0).notNull(), // Admin moderation check
  createdAt: integer('created_at').notNull(),
});

// 7. Wishlists Table (Saves products for registered accounts)
export const wishlists = sqliteTable('wishlists', {
  id: text('id').primaryKey(),
  customerEmail: text('customer_email').notNull(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  createdAt: integer('created_at').notNull(),
});
