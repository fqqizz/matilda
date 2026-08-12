-- ============================================================
-- MATILDA Jewellery — Production Supabase Schema
-- Migration: 002_matilda_production.sql
-- Created: 2026-08
-- 
-- Safe, additive migration ensuring full CMS product image,
-- category, collection, order snapshot, and storage compatibility.
-- ============================================================

-- Enable pgcrypto / uuid extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── 1. CATEGORIES TABLE ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 2. COLLECTIONS TABLE ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.collections (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 3. PRODUCTS TABLE ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  sku              TEXT UNIQUE,
  subtitle         TEXT,
  description      TEXT NOT NULL DEFAULT '',
  long_description TEXT,
  materials        TEXT DEFAULT 'Polished fashion alloy with protective coating',
  price            NUMERIC(10,2) NOT NULL DEFAULT 0,
  compare_at_price NUMERIC(10,2),
  original_price   NUMERIC(10,2),
  stock_quantity   INTEGER NOT NULL DEFAULT 0,
  stock            INTEGER NOT NULL DEFAULT 0,
  category_id      UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  category         TEXT, -- Fallback text category name
  status           TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  is_published     BOOLEAN NOT NULL DEFAULT true,
  is_featured      BOOLEAN NOT NULL DEFAULT false,
  is_new_arrival   BOOLEAN NOT NULL DEFAULT false,
  is_best_seller   BOOLEAN NOT NULL DEFAULT false,
  rating           NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  review_count     INTEGER NOT NULL DEFAULT 0,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  details          JSONB NOT NULL DEFAULT '[]'::jsonb,
  metadata         JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 4. PRODUCT IMAGES TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT,
  image_url    TEXT NOT NULL,
  alt_text     TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_primary   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 5. COLLECTION PRODUCTS JUNCTION ─────────────────────────
CREATE TABLE IF NOT EXISTS public.collection_products (
  collection_id UUID NOT NULL REFERENCES public.collections(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- ── 6. ORDERS TABLE (HISTORICAL SNAPSHOTS) ───────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number          TEXT UNIQUE,
  customer_name         TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT,
  shipping_address      JSONB NOT NULL,
  subtotal              NUMERIC(10,2) NOT NULL,
  shipping_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee          NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount          NUMERIC(10,2) NOT NULL,
  total                 NUMERIC(10,2),
  payment_status        TEXT NOT NULL DEFAULT 'pending',
  order_status          TEXT NOT NULL DEFAULT 'pending',
  status                TEXT NOT NULL DEFAULT 'pending',
  payment_method        TEXT DEFAULT 'Razorpay (Cards / UPI / NetBanking)',
  payment_reference     TEXT,
  razorpay_order_id     TEXT,
  razorpay_payment_id   TEXT,
  tracking_number       TEXT,
  customer_note         TEXT,
  admin_note            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 7. ORDER ITEMS TABLE (PRICE & METADATA SNAPSHOT) ─────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id            UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name          TEXT NOT NULL,
  product_sku           TEXT,
  product_image_url     TEXT,
  quantity              INTEGER NOT NULL CHECK (quantity > 0),
  unit_price            NUMERIC(10,2) NOT NULL,
  line_total            NUMERIC(10,2) NOT NULL,
  selected_variant      JSONB
);

-- ── 8. PRODUCT REVIEWS TABLE ─────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id        UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  author_name       TEXT NOT NULL,
  location          TEXT,
  rating            SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title             TEXT NOT NULL,
  comment           TEXT NOT NULL,
  verified_purchase BOOLEAN NOT NULL DEFAULT false,
  is_approved       BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 9. SITE SETTINGS TABLE ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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
  is_test_mode            BOOLEAN NOT NULL DEFAULT true,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── 10. INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at desc);
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ── 11. ROW LEVEL SECURITY ───────────────────────────────────
ALTER TABLE public.categories         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings      ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_active_categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_active_collections" ON public.collections FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_published_products" ON public.products FOR SELECT USING (status = 'published' OR is_published = true);
CREATE POLICY "public_read_product_images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "public_read_collection_products" ON public.collection_products FOR SELECT USING (true);
CREATE POLICY "public_read_approved_reviews" ON public.product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "public_read_site_settings" ON public.site_settings FOR SELECT USING (true);

-- Public order creation
CREATE POLICY "public_insert_orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_order_items" ON public.order_items FOR INSERT WITH CHECK (true);

-- ── 12. STORAGE BUCKET CONFIGURATION ─────────────────────────
-- Supabase Storage bucket 'product-images' configuration:
--
-- 1. Create bucket 'product-images' (Public: true) in Supabase Dashboard > Storage
-- 2. Storage Policies:
--    - SELECT: bucket_id = 'product-images' (Public read)
--    - INSERT/UPDATE/DELETE: Managed securely via server API endpoints using service role key
