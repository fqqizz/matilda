# MATILDA Jewellery — Supabase Setup Guide

## Prerequisites
- A Supabase account at https://supabase.com
- Node.js 18+ installed
- The MATILDA codebase checked out locally

---

## Step 1 — Create a New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New project"**
3. Set:
   - **Name**: `matilda-jewellery`
   - **Database password**: choose a strong password and save it
   - **Region**: `ap-south-1` (Mumbai) for India performance
4. Wait ~2 minutes for provisioning

---

## Step 2 — Copy Your Credentials

In your project dashboard, go to **Settings → API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key (keep secret!) |

Copy these into your `.env.local` file (copy from `.env.example`).

---

## Step 3 — Run the Database Migration

In the Supabase Dashboard:
1. Go to **SQL Editor → New query**
2. Paste the entire contents of `supabase/migrations/001_schema.sql`
3. Click **Run**

✅ This creates all 16 tables, RLS policies, triggers, and indexes.

> The migration is **additive** — it uses `IF NOT EXISTS` throughout and is safe to run on an existing project. It will not drop or overwrite existing data.

---

## Step 4 — Create the Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **"New bucket"**
3. Set:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Yes
   - **File size limit**: `10485760` (10 MB)
   - **Allowed MIME types**: `image/jpeg,image/png,image/webp,image/gif`
4. Click **Save**

### Add Storage Policies

Go to **Storage → product-images → Policies → New policy**:

**Policy 1: Public read**
```sql
bucket_id = 'product-images'
```
Operation: `SELECT` (for both objects and folders)

**Policy 2: Admin upload**
```sql
bucket_id = 'product-images' AND (SELECT is_admin())
```
Operation: `INSERT`

**Policy 3: Admin delete**
```sql
bucket_id = 'product-images' AND (SELECT is_admin())
```
Operation: `DELETE`

---

## Step 5 — Create the First Admin User

1. In Supabase Dashboard, go to **Authentication → Users → Invite user**
2. Enter the admin email (Duha's email address)
3. They'll receive an invite email — they set their password on first login

4. After they sign in, add them to `admin_users` table:

```sql
INSERT INTO admin_users (id, email, display_name, role)
SELECT id, email, 'Duha', 'superadmin'
FROM auth.users
WHERE email = 'REPLACE_WITH_ACTUAL_ADMIN_EMAIL';
```

---

## Step 6 — Install Supabase Client

```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

---

## Step 7 — Connect the Application

Create `lib/supabase/client.ts`:

```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();
```

Create `lib/supabase/server.ts`:

```typescript
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerClient = () =>
  createServerComponentClient({ cookies });
```

---

## Step 8 — Migrate Product Images to Storage

Once Supabase Storage is connected, for each existing product:
1. Upload the image file to `product-images/{product-slug}/{filename}`
2. Get the public URL: `supabase.storage.from('product-images').getPublicUrl(path)`
3. Update the `product_images` table with `storage_path = path`

> **Important**: Never store base64 image data in the database. The `product_images` table stores only the `storage_path` (relative path in the bucket), not the full URL or base64. Generate the public URL on-the-fly using `getPublicUrl()`.

---

## Step 9 — (Optional) Enable Realtime for Orders

```sql
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE order_items;
```

Then in the admin dashboard, subscribe to order updates:

```typescript
supabase.channel('orders').on('postgres_changes', {
  event: '*', schema: 'public', table: 'orders'
}, (payload) => {
  // Refresh orders list
}).subscribe();
```

---

## Security Checklist

- [ ] `.env.local` is in `.gitignore` (never commit credentials)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is only used server-side
- [ ] RLS is enabled on all tables (check migration ran successfully)
- [ ] Admin `/admin` route is protected by Supabase Auth check
- [ ] Razorpay payment signature is verified server-side before order is marked paid
- [ ] Product prices in `order_items` use `unit_price_snapshot` (never recalculate from current price)

---

## Key Principles

### Price Snapshots
When creating an order, **always** save the product's price at the time of purchase in `order_items.unit_price_snapshot`. Never read the current product price for historical orders. This ensures that if Duha changes `₹159 → ₹199` tomorrow, existing orders remain at `₹159`.

### Image Architecture
```
Mobile camera / gallery
    ↓
File object
    ↓
base64 (LOCAL PREVIEW ONLY — never persisted)
    ↓
Upload to Supabase Storage bucket 'product-images'
    ↓
storage_path returned (e.g. 'mtl-001/hero.webp')
    ↓
Insert into product_images table
    ↓
Generate public URL on-the-fly with getPublicUrl()
    ↓
Storefront displays image
```

### Admin Authentication Flow
```
/admin page load
    ↓
Check Supabase session
    ↓
If no session → redirect to /admin/login
If session → check admin_users table
If not in admin_users → show "unauthorized"
If admin → render dashboard
```

---

## Razorpay Integration (Production)

1. Sign up at https://razorpay.com and get live keys
2. Add to `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_live_xxx
   RAZORPAY_KEY_SECRET=xxx
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxx
   ```
3. Create server route `app/api/payment/create-order/route.ts` that:
   - Creates a Razorpay order server-side
   - Returns the order ID to the frontend
4. After payment, verify signature server-side in `app/api/payment/verify/route.ts`
5. **Only** mark the order as `payment_status = 'paid'` after server-side signature verification
6. Never trust the frontend's payment success state

---

*For questions, contact the developer or refer to Supabase docs at https://supabase.com/docs*
