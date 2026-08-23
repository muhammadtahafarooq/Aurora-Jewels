import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

/* ────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────── */
const now = () => new Date().toISOString();

/* ────────────────────────────────────────────
   1. users
   ──────────────────────────────────────────── */
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('customer'),
  isActive: integer('is_active').notNull().default(1),
  emailVerifiedAt: text('email_verified_at'),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   2. customer_profiles
   ──────────────────────────────────────────── */
export const customerProfiles = sqliteTable('customer_profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   3. customer_addresses
   ──────────────────────────────────────────── */
export const customerAddresses = sqliteTable('customer_addresses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  label: text('label'),
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: text('city').notNull(),
  province: text('province'),
  postalCode: text('postal_code'),
  country: text('country').notNull().default('PK'),
  isDefault: integer('is_default').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   4. categories
   ──────────────────────────────────────────── */
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   5. collections
   ──────────────────────────────────────────── */
export const collections = sqliteTable('collections', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   6. products
   ──────────────────────────────────────────── */
export const products = sqliteTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  shortDescription: text('short_description'),
  status: text('status').notNull().default('active'),
  isFeatured: integer('is_featured').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   7. product_categories  (composite PK)
   ──────────────────────────────────────────── */
export const productCategories = sqliteTable(
  'product_categories',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.categoryId] }) }),
);

/* ────────────────────────────────────────────
   8. product_collections  (composite PK)
   ──────────────────────────────────────────── */
export const productCollections = sqliteTable(
  'product_collections',
  {
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    collectionId: text('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.productId, t.collectionId] }) }),
);

/* ────────────────────────────────────────────
   9. product_images
   ──────────────────────────────────────────── */
export const productImages = sqliteTable('product_images', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'),
  sortOrder: integer('sort_order').notNull().default(0),
  isPrimary: integer('is_primary').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
});

/* ────────────────────────────────────────────
   10. product_variants
   ──────────────────────────────────────────── */
export const productVariants = sqliteTable('product_variants', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  sku: text('sku').unique().notNull(),
  variantName: text('variant_name'),
  size: text('size'),
  color: text('color'),
  price: integer('price').notNull(),
  compareAtPrice: integer('compare_at_price'),
  isDefault: integer('is_default').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   11. inventory  (one per variant)
   ──────────────────────────────────────────── */
export const inventory = sqliteTable('inventory', {
  id: text('id').primaryKey(),
  variantId: text('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(0),
  reservedQuantity: integer('reserved_quantity').notNull().default(0),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
});

/* ────────────────────────────────────────────
   12. wishlists
   ──────────────────────────────────────────── */
export const wishlists = sqliteTable('wishlists', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
});

/* ────────────────────────────────────────────
   13. wishlist_items  (composite PK)
   ──────────────────────────────────────────── */
export const wishlistItems = sqliteTable(
  'wishlist_items',
  {
    wishlistId: text('wishlist_id')
      .notNull()
      .references(() => wishlists.id, { onDelete: 'cascade' }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    createdAt: text('created_at').notNull().$defaultFn(now),
  },
  (t) => ({ pk: primaryKey({ columns: [t.wishlistId, t.productId] }) }),
);

/* ────────────────────────────────────────────
   14. reviews
   ──────────────────────────────────────────── */
export const reviews = sqliteTable('reviews', {
  id: text('id').primaryKey(),
  productId: text('product_id')
    .notNull()
    .references(() => products.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  orderItemId: text('order_item_id').references(() => orderItems.id, { onDelete: 'set null' }),
  rating: integer('rating').notNull(),
  title: text('title'),
  body: text('body').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   15. coupons
   ──────────────────────────────────────────── */
export const coupons = sqliteTable('coupons', {
  id: text('id').primaryKey(),
  code: text('code').unique().notNull(),
  discountType: text('discount_type').notNull(),
  discountValue: integer('discount_value').notNull(),
  minimumOrderAmount: integer('minimum_order_amount'),
  startsAt: text('starts_at'),
  expiresAt: text('expires_at'),
  usageLimit: integer('usage_limit'),
  usageCount: integer('usage_count').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   16. coupon_products  (composite PK)
   ──────────────────────────────────────────── */
export const couponProducts = sqliteTable(
  'coupon_products',
  {
    couponId: text('coupon_id')
      .notNull()
      .references(() => coupons.id, { onDelete: 'cascade' }),
    productId: text('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.couponId, t.productId] }) }),
);

/* ────────────────────────────────────────────
   17. coupon_collections  (composite PK)
   ──────────────────────────────────────────── */
export const couponCollections = sqliteTable(
  'coupon_collections',
  {
    couponId: text('coupon_id')
      .notNull()
      .references(() => coupons.id, { onDelete: 'cascade' }),
    collectionId: text('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
  },
  (t) => ({ pk: primaryKey({ columns: [t.couponId, t.collectionId] }) }),
);

/* ────────────────────────────────────────────
   18. orders
   ──────────────────────────────────────────── */
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').unique().notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  customerName: text('customer_name').notNull(),
  customerEmail: text('customer_email'),
  customerPhone: text('customer_phone').notNull(),
  status: text('status').notNull().default('pending'),
  paymentMethod: text('payment_method').notNull().default('cod'),
  paymentStatus: text('payment_status').notNull().default('cod_due'),
  subtotal: integer('subtotal').notNull(),
  discountAmount: integer('discount_amount').notNull().default(0),
  shippingAmount: integer('shipping_amount').notNull().default(0),
  totalAmount: integer('total_amount').notNull(),
  currency: text('currency').notNull().default('PKR'),
  couponCode: text('coupon_code'),
  customerNotes: text('customer_notes'),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
});

/* ────────────────────────────────────────────
   19. order_items
   ──────────────────────────────────────────── */
export const orderItems = sqliteTable('order_items', {
  id: text('id').primaryKey(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => products.id, { onDelete: 'set null' }),
  variantId: text('variant_id').references(() => productVariants.id, { onDelete: 'set null' }),
  productName: text('product_name').notNull(),
  variantName: text('variant_name'),
  sku: text('sku'),
  unitPrice: integer('unit_price').notNull(),
  quantity: integer('quantity').notNull(),
  lineTotal: integer('line_total').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(now),
});

/* ────────────────────────────────────────────
   20. order_addresses
   ──────────────────────────────────────────── */
export const orderAddresses = sqliteTable('order_addresses', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
  recipientName: text('recipient_name').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  addressLine1: text('address_line_1').notNull(),
  addressLine2: text('address_line_2'),
  city: text('city').notNull(),
  province: text('province'),
  postalCode: text('postal_code'),
  country: text('country').notNull().default('PK'),
  createdAt: text('created_at').notNull().$defaultFn(now),
});

/* ────────────────────────────────────────────
   21. content_pages
   ──────────────────────────────────────────── */
export const contentPages = sqliteTable('content_pages', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  content: text('content').notNull(),
  status: text('status').notNull().default('draft'),
  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   22. homepage_sections
   ──────────────────────────────────────────── */
export const homepageSections = sqliteTable('homepage_sections', {
  id: text('id').primaryKey(),
  sectionKey: text('section_key').unique().notNull(),
  title: text('title'),
  subtitle: text('subtitle'),
  body: text('body'),
  imageUrl: text('image_url'),
  ctaLabel: text('cta_label'),
  ctaUrl: text('cta_url'),
  sortOrder: integer('sort_order').notNull().default(0),
  isActive: integer('is_active').notNull().default(1),
  createdAt: text('created_at').notNull().$defaultFn(now),
  updatedAt: text('updated_at').notNull().$defaultFn(now),
  deletedAt: text('deleted_at'),
});

/* ────────────────────────────────────────────
   23. email_verification_tokens
   ──────────────────────────────────────────── */
export const emailVerificationTokens = sqliteTable('email_verification_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').unique().notNull(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull().$defaultFn(now),
});

/* ────────────────────────────────────────────
   24. password_resets
   ──────────────────────────────────────────── */
export const passwordResets = sqliteTable('password_resets', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').unique().notNull(),
  expiresAt: text('expires_at').notNull(),
  usedAt: text('used_at'),
  createdAt: text('created_at').notNull().$defaultFn(now),
});
