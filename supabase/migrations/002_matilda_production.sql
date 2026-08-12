-- ============================================================
-- MATILDA Jewellery — Production Supabase Schema
-- Migration: 002_matilda_production.sql
-- Created: 2026-08
-- 
-- 100% IDEMPOTENT & ADDITIVE MIGRATION
-- Safely adds all missing columns, tables, indexes, and RLS policies
-- regardless of whether 001_schema.sql was already executed.
-- ============================================================

-- Enable pgcrypto & uuid extensions
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

ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

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

ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.collections ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ── 3. PRODUCTS TABLE (ENSURE ALL COLUMNS EXIST) ─────────────
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
  category         TEXT,
  status           TEXT NOT NULL DEFAULT 'published',
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

-- Ensure all columns exist even if products was created in 001
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS materials TEXT DEFAULT 'Polished fashion alloy with protective coating';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10,2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_best_seller BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2) DEFAULT 5.00;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS details JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Sync status default values
UPDATE public.products SET status = 'published' WHERE status IS NULL;
UPDATE public.products SET is_published = true WHERE is_published IS NULL;

-- ── 4. PRODUCT IMAGES TABLE ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.product_images (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id   UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  storage_path TEXT,
  image_url    TEXT,
  alt_text     TEXT,
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_primary   BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS storage_path TEXT;
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS alt_text TEXT;
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS is_primary BOOLEAN DEFAULT false;

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
  shipping_address      JSONB,
  subtotal              NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  shipping_fee          NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_amount       NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_amount          NUMERIC(10,2) NOT NULL DEFAULT 0,
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

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;

-- ── 7. ORDER ITEMS TABLE (PRICE & METADATA SNAPSHOT) ─────────
CREATE TABLE IF NOT EXISTS public.order_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id              UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id            UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name          TEXT NOT NULL,
  product_sku           TEXT,
  product_image_url     TEXT,
  quantity              INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price            NUMERIC(10,2) NOT NULL DEFAULT 0,
  line_total            NUMERIC(10,2) NOT NULL DEFAULT 0,
  selected_variant      JSONB
);

ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_sku TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS product_image_url TEXT;
ALTER TABLE public.order_items ADD COLUMN IF NOT EXISTS selected_variant JSONB;

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

ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false;
ALTER TABLE public.product_reviews ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;

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

-- Ensure default settings row exists
INSERT INTO public.site_settings (id) VALUES (gen_random_uuid())
  ON CONFLICT DO NOTHING;

-- ── 10. INDEXES ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_status ON public.products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at desc);
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

-- Clean up and recreate policies safely
DROP POLICY IF EXISTS "public_read_active_categories" ON public.categories;
DROP POLICY IF EXISTS "public_read_active_collections" ON public.collections;
DROP POLICY IF EXISTS "public_read_published_products" ON public.products;
DROP POLICY IF EXISTS "public_read_product_images" ON public.product_images;
DROP POLICY IF EXISTS "public_read_collection_products" ON public.collection_products;
DROP POLICY IF EXISTS "public_read_approved_reviews" ON public.product_reviews;
DROP POLICY IF EXISTS "public_read_site_settings" ON public.site_settings;
DROP POLICY IF EXISTS "public_insert_orders" ON public.orders;
DROP POLICY IF EXISTS "public_insert_order_items" ON public.order_items;

-- Public read policies
CREATE POLICY "public_read_active_categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_active_collections" ON public.collections FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_published_products" ON public.products FOR SELECT USING (is_published = true OR status = 'published');
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
-- 1. In Supabase Dashboard > Storage > Click "New Bucket":
--    - Name: product-images
--    - Public bucket: ON (checked)
-- 2. Storage Policies:
--    - SELECT: bucket_id = 'product-images' (Public read)
--    - INSERT/UPDATE/DELETE: Managed securely via server API routes with SUPABASE_SERVICE_ROLE_KEY
