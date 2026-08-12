# MATILDA — Official Production Setup & Architecture Guide

Welcome to **MATILDA by Duha Ajaz Pandith**. This document details the exact configuration steps required to connect your Supabase production database, cloud storage bucket, payment gateway, and administrative credentials.

---

## 1. Environment Variables Configuration

Create a file named `.env.local` in the project root (or set these in your **Vercel Project Settings → Environment Variables**):

```bash
# ── SUPABASE (Production Database & Storage) ──
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Server-Side Only Service Role Key (Never expose to client)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ── ADMIN AUTHENTICATION (Server-Side Only) ──
ADMIN_PASSWORD=Duha@matilda12
ADMIN_SESSION_SECRET=matilda_super_secret_session_hmac_signing_key_2026

# ── RAZORPAY PAYMENT GATEWAY ──
# (Leave blank or in Test Mode until ready for live payments)
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXX

# ── SITE METADATA ──
NEXT_PUBLIC_SITE_URL=https://matilda-jewellery.vercel.app
```

> [!IMPORTANT]
> **Security Rule**: `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, and `RAZORPAY_KEY_SECRET` must **never** be prefixed with `NEXT_PUBLIC_` or placed in client components. The system uses server API endpoints (`/api/admin/*`) with timing-safe comparison and HMAC-signed httpOnly session cookies.

---

## 2. Supabase Database & Storage Setup

### Step A: Create Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Name the project `matilda-jewellery`, select your region (e.g. *South Asia - Mumbai*), and set a secure database password.
3. In **Project Settings → API**, copy:
   - **Project URL** -> `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys (anon public)** -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API Keys (service_role secret)** -> `SUPABASE_SERVICE_ROLE_KEY`

---

### Step B: Run SQL Migrations
1. In your Supabase dashboard, navigate to **SQL Editor** on the left menu.
2. Open [supabase/migrations/001_schema.sql](file:///C:/Users/faaiz/Downloads/matilda/supabase/migrations/001_schema.sql) and click **Run**.
3. Open [supabase/migrations/002_matilda_production.sql](file:///C:/Users/faaiz/Downloads/matilda/supabase/migrations/002_matilda_production.sql) and click **Run**.
4. This will set up:
   - `products` & `product_images`
   - `categories` & `collections`
   - `orders` & `order_items` (with historical snapshots)
   - `product_reviews` & `site_settings`
   - Row Level Security (RLS) policies and performance indexes.

---

### Step C: Create the Storage Bucket for Product Imagery
1. In Supabase dashboard, navigate to **Storage** → **New Bucket**.
2. Set **Bucket Name**: `product-images`
3. Toggle **Public Bucket**: `ON` (Checked / True)
4. Allowed MIME types: `image/jpeg, image/png, image/webp, image/jpg`
5. Maximum file size: `15MB`
6. Click **Save Bucket**.

---

## 3. Product Image Management Architecture

The MATILDA CMS utilizes a zero-base64, cloud-storage architecture:

```
Mobile Camera / Desktop File Picker
               ↓
FormData sent to /api/admin/upload-image
               ↓
Server validates and uploads binary to Supabase Storage ('product-images')
               ↓
Returns public image URL and storage_path
               ↓
Stored into 'product_images' table linked to product row
               ↓
Served via CDN to storefront visitors
```

### Key CMS Capabilities:
- **Multiple Image Uploads**: Select multiple high-res photos directly from mobile photo library or desktop.
- **Drag & Reorder**: Rearrange images with left/right reorder controls.
- **Set as Cover**: Designate any photo as the primary product cover.
- **Clean Image Deletion**: Removing a photo removes the database reference and deletes the object from Supabase Storage (preventing orphaned files).
- **External URL Support**: Paste external image URLs whenever needed.

---

## 4. Administrative Access & Security

- **Admin Route**: `/admin` (strictly hidden from public navigation, sitemaps, and footers).
- **Authentication**:
  - Enter the administrative password (`Duha@matilda12`).
  - Validated server-side in [app/api/admin/login/route.ts](file:///C:/Users/faaiz/Downloads/matilda/app/api/admin/login/route.ts) with timing-safe comparison.
  - Sets an `httpOnly`, `secure`, `sameSite: "strict"` HMAC-signed session cookie.

---

## 5. Payments & Orders

- **Razorpay Integration**:
  - In [Admin Portal → Store Settings](http://localhost:3006/admin/settings), you can toggle between **Test Mode** and **Live Mode**.
  - Test mode allows simulating successful orders without charging a card.
  - Live orders require `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
- **Historical Order Snapshots**:
  - Customer details, shipping addresses, prices, and product image URLs are snapshotted in `orders` and `order_items` at purchase time, ensuring historical receipts are never altered if a product is modified or deleted.

---

## 6. Official Brand Attributes
- **Brand**: `MATILDA`
- **Founder Attribution**: `by Duha Ajaz Pandith`
- **Official Instagram**: `@matilldaaa._` ([https://www.instagram.com/matilldaaa._/](https://www.instagram.com/matilldaaa._/))
- **WhatsApp Concierge**: `+91 95411 98330`
