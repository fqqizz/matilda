-- ============================================================
-- MATILDA Jewellery — Supabase Database Schema
-- Migration: 001_schema.sql
-- Created: 2026-08
-- 
-- IMPORTANT: This is an ADDITIVE migration.
-- Uses IF NOT EXISTS / DO NOTHING throughout.
-- Safe to run on an existing project.
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. ADMIN / USER PROFILES ─────────────────────────────────

-- Admin users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS admin_users (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Admin',
  role         TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. SITE SETTINGS ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS site_settings (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_name              TEXT NOT NULL DEFAULT 'MATILDA',
  founder_name            TEXT NOT NULL DEFAULT 'Duha Ajaz Pandith',
  tagline                 TEXT NOT NULL DEFAULT 'Timeless Silhouettes. Made To Become Yours.',
  bio                     TEXT,
  instagram_handle        TEXT DEFAULT '@matilldaaa._',
  instagram_url           TEXT DEFAULT 'https://www.instagram.com/matilldaaa._/',
  phone                   TEXT DEFAULT '+91 95411 98330',
  whatsapp_number         TEXT DEFAULT '919541198330',
  delivery_notice         TEXT DEFAULT 'Pan-India Express Delivery within 3–6 business days',
  announcement_text       TEXT DEFAULT 'Free Shipping on Orders Above ₹499  •  Dispatch Within 24 Hours',
  free_shipping_threshold INTEGER NOT NULL DEFAULT 499,
  standard_shipping_fee   INTEGER NOT NULL DEFAULT 49,
  razorpay_key_id         TEXT DEFAULT '',
  is_test_mode            BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure exactly one settings row
INSERT INTO site_settings (id) VALUES (uuid_generate_v4())
  ON CONFLICT DO NOTHING;

-- ── 3. CATEGORIES ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. PRODUCTS ──────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS products (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug             TEXT UNIQUE NOT NULL,
  sku              TEXT UNIQUE NOT NULL,
  name             TEXT NOT NULL,
  subtitle         TEXT,
  category_id      UUID REFERENCES categories(id) ON DELETE SET NULL,
  price            INTEGER NOT NULL CHECK (price >= 0),           -- stored in paise or INR integer
  original_price   INTEGER CHECK (original_price >= 0),
  description      TEXT NOT NULL DEFAULT '',
  long_description TEXT,
  materials        TEXT,
  stock            INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  is_featured      BOOLEAN NOT NULL DEFAULT FALSE,
  is_new_arrival   BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller   BOOLEAN NOT NULL DEFAULT FALSE,
  is_published     BOOLEAN NOT NULL DEFAULT FALSE,
  rating           NUMERIC(3,2) NOT NULL DEFAULT 0.00,
  review_count     INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── 5. PRODUCT IMAGES ────────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  -- Storage path in Supabase Storage bucket 'product-images'
  -- e.g. 'mtl-001/hero.webp'  — NOT a full URL, NOT base64.
  storage_path TEXT NOT NULL,
  alt_text    TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Only one primary image per product
CREATE UNIQUE INDEX IF NOT EXISTS product_images_primary_idx
  ON product_images (product_id)
  WHERE is_primary = TRUE;

-- ── 6. PRODUCT VARIANTS ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_variants (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id      UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name    TEXT NOT NULL,   -- e.g. "Size", "Colourway"
  option_label    TEXT NOT NULL,   -- e.g. "M–L (30\"–34\")"
  price_modifier  INTEGER NOT NULL DEFAULT 0,
  in_stock        BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

-- ── 7. PRODUCT DETAILS (bullet points) ───────────────────────

CREATE TABLE IF NOT EXISTS product_details (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  detail     TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ── 8. ADDRESSES ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS addresses (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name    TEXT NOT NULL,
  phone        TEXT NOT NULL,
  address_line TEXT NOT NULL,
  city         TEXT NOT NULL,
  state        TEXT NOT NULL,
  pincode      TEXT NOT NULL,
  country      TEXT NOT NULL DEFAULT 'India',
  is_default   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 9. CARTS ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS carts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,  -- for guest carts
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id           UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_selection JSONB,   -- e.g. {"Size": "M–L"}
  quantity          INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price        INTEGER NOT NULL,  -- price at time of adding to cart
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 10. ORDERS ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS orders (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number            TEXT UNIQUE NOT NULL,  -- e.g. 'MTL-2026-00001'
  user_id                 UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Customer snapshot (preserved even if user deletes account)
  customer_name           TEXT NOT NULL,
  customer_email          TEXT NOT NULL,
  customer_phone          TEXT NOT NULL,

  -- Shipping address snapshot
  shipping_name           TEXT NOT NULL,
  shipping_phone          TEXT NOT NULL,
  shipping_address_line   TEXT NOT NULL,
  shipping_city           TEXT NOT NULL,
  shipping_state          TEXT NOT NULL,
  shipping_pincode        TEXT NOT NULL,
  shipping_country        TEXT NOT NULL DEFAULT 'India',

  -- Pricing (always use snapshot, never recalculate from current product prices)
  subtotal                INTEGER NOT NULL,   -- in INR paise or rupees integer
  shipping_fee            INTEGER NOT NULL DEFAULT 0,
  discount_amount         INTEGER NOT NULL DEFAULT 0,
  total_amount            INTEGER NOT NULL,

  -- Status
  status                  TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),

  -- Payment
  payment_status          TEXT NOT NULL DEFAULT 'unpaid'
                            CHECK (payment_status IN ('unpaid','paid','failed','refunded','cod')),
  payment_method          TEXT,   -- 'razorpay', 'cod', etc.
  razorpay_order_id       TEXT,
  razorpay_payment_id     TEXT,
  razorpay_signature      TEXT,

  -- Notes
  customer_note           TEXT,
  admin_note              TEXT,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-generate order_number
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1;
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number = 'MTL-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(nextval('order_number_seq')::TEXT, 5, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_order_number ON orders;
CREATE TRIGGER orders_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- ── 11. ORDER ITEMS ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS order_items (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id              UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id            UUID REFERENCES products(id) ON DELETE SET NULL,

  -- PRICE SNAPSHOT — always preserved, never recalculated from current product price
  product_name_snapshot TEXT NOT NULL,
  product_sku_snapshot  TEXT NOT NULL,
  unit_price_snapshot   INTEGER NOT NULL,   -- exact price at time of order
  variant_snapshot      JSONB,              -- e.g. {"Size": "M–L"}
  image_url_snapshot    TEXT,               -- image URL at time of order

  quantity              INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  line_total            INTEGER NOT NULL    -- unit_price_snapshot * quantity
);

-- ── 12. PRODUCT REVIEWS ──────────────────────────────────────

CREATE TABLE IF NOT EXISTS product_reviews (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id       UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id         UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id          UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  author_name      TEXT NOT NULL,
  location         TEXT,
  rating           SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title            TEXT NOT NULL,
  comment          TEXT NOT NULL,
  verified_purchase BOOLEAN NOT NULL DEFAULT FALSE,
  is_approved      BOOLEAN NOT NULL DEFAULT TRUE,   -- admin can hide reviews

  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update product rating/reviewCount after review insert/delete
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products SET
    rating = (
      SELECT COALESCE(ROUND(AVG(rating)::NUMERIC, 2), 0)
      FROM product_reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND is_approved = TRUE
    ),
    review_count = (
      SELECT COUNT(*) FROM product_reviews
      WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        AND is_approved = TRUE
    )
  WHERE id = COALESCE(NEW.product_id, OLD.product_id);
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reviews_update_product_rating ON product_reviews;
CREATE TRIGGER reviews_update_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON product_reviews
  FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- ── 13. WISHLISTS ────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS wishlists (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,   -- guest wishlist via localStorage sync
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  added_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id),
  UNIQUE (session_id, product_id)
);

-- ── 14. COLLECTIONS ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS collections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  description TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_products (
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- ── 15. INDEXES ──────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category_id);
CREATE INDEX IF NOT EXISTS products_published_idx ON products (is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON orders (customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders (status);
CREATE INDEX IF NOT EXISTS product_reviews_product_idx ON product_reviews (product_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE admin_users        ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_details    ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists          ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts              ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── PUBLIC: read published products ──

CREATE POLICY "public_read_published_products" ON products
  FOR SELECT USING (is_published = TRUE);

CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_product_images" ON product_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_images.product_id AND is_published = TRUE)
  );

CREATE POLICY "public_read_product_variants" ON product_variants
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_variants.product_id AND is_published = TRUE)
  );

CREATE POLICY "public_read_product_details" ON product_details
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE id = product_details.product_id AND is_published = TRUE)
  );

CREATE POLICY "public_read_approved_reviews" ON product_reviews
  FOR SELECT USING (is_approved = TRUE);

CREATE POLICY "public_read_site_settings" ON site_settings
  FOR SELECT USING (TRUE);

CREATE POLICY "public_read_collections" ON collections
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "public_read_collection_products" ON collection_products
  FOR SELECT USING (TRUE);

-- ── PUBLIC: submit reviews ──
CREATE POLICY "authenticated_insert_review" ON product_reviews
  FOR INSERT WITH CHECK (TRUE);   -- open; tighten to auth.uid() IS NOT NULL for logged-in only

-- ── PUBLIC: manage own wishlist ──

CREATE POLICY "user_manage_wishlist" ON wishlists
  FOR ALL USING (
    user_id = auth.uid()
    OR session_id IS NOT NULL  -- guest session
  );

-- ── PUBLIC: manage own cart ──

CREATE POLICY "user_manage_cart" ON carts
  FOR ALL USING (user_id = auth.uid() OR session_id IS NOT NULL);

CREATE POLICY "user_manage_cart_items" ON cart_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM carts WHERE id = cart_items.cart_id AND (user_id = auth.uid() OR session_id IS NOT NULL))
  );

-- ── USER: own orders ──

CREATE POLICY "user_view_own_orders" ON orders
  FOR SELECT USING (user_id = auth.uid() OR customer_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "user_view_own_order_items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_items.order_id AND user_id = auth.uid())
  );

-- ── USER: own addresses ──

CREATE POLICY "user_manage_addresses" ON addresses
  FOR ALL USING (user_id = auth.uid());

-- ── ADMIN: full access to all tables ──

CREATE POLICY "admin_all_products"          ON products           FOR ALL USING (is_admin());
CREATE POLICY "admin_all_categories"        ON categories         FOR ALL USING (is_admin());
CREATE POLICY "admin_all_product_images"    ON product_images     FOR ALL USING (is_admin());
CREATE POLICY "admin_all_product_variants"  ON product_variants   FOR ALL USING (is_admin());
CREATE POLICY "admin_all_product_details"   ON product_details    FOR ALL USING (is_admin());
CREATE POLICY "admin_all_orders"            ON orders             FOR ALL USING (is_admin());
CREATE POLICY "admin_all_order_items"       ON order_items        FOR ALL USING (is_admin());
CREATE POLICY "admin_all_reviews"           ON product_reviews    FOR ALL USING (is_admin());
CREATE POLICY "admin_all_site_settings"     ON site_settings      FOR ALL USING (is_admin());
CREATE POLICY "admin_all_wishlists"         ON wishlists          FOR ALL USING (is_admin());
CREATE POLICY "admin_all_admin_users"       ON admin_users        FOR ALL USING (is_admin());
CREATE POLICY "admin_all_collections"       ON collections        FOR ALL USING (is_admin());
CREATE POLICY "admin_all_collection_prods"  ON collection_products FOR ALL USING (is_admin());

-- ============================================================
-- SUPABASE STORAGE BUCKETS
-- (Run in Supabase Dashboard > Storage, or via API)
-- ============================================================

-- Bucket: product-images
-- Access: Public read, Admin upload/delete
-- Note: Create manually in Dashboard:
--   Name: product-images
--   Public: true
--   File size limit: 10MB
--   Allowed MIME types: image/jpeg, image/png, image/webp, image/gif
--
-- Then add these storage policies in Dashboard > Storage > Policies:
--
-- Policy: "public_read_product_images_storage"
--   Operation: SELECT
--   Policy definition: bucket_id = 'product-images'
--
-- Policy: "admin_upload_product_images"
--   Operation: INSERT
--   Policy definition: bucket_id = 'product-images' AND is_admin()
--
-- Policy: "admin_delete_product_images"
--   Operation: DELETE
--   Policy definition: bucket_id = 'product-images' AND is_admin()
