# MATILDA JEWELLERY — PRODUCTION SETUP & HANDOFF GUIDE
**Founder & Creative Director:** Duha Ajaz Pandith  
**Brand Identity:** MATILDA by Duha Ajaz Pandith  
**Official Instagram:** [@matilldaaa._](https://www.instagram.com/mattilldaaa._/)  
**Direct Contact / WhatsApp:** +91 95411 98330  
**Positioning Statement:** *"Timeless silhouettes offering the look of fine jewellery at a fraction of the cost. Delivery across India."*

---

## 1. OVERVIEW OF BUILT PLATFORM

MATILDA has been crafted as a quiet-luxury, feminine editorial ecommerce experience built with:
- **Frontend & App Architecture:** Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Design Tokens:** Deep Burgundy (`#3A080C`), Wine/Maroon (`#5A1118`), Dark Wine (`#260407`), Warm Gold (`#C8A15A`), Champagne Gold (`#E4C98A`), Ivory (`#F7F1E8`), Warm Cream (`#EFE3D2`), Charcoal (`#191414`)
- **Typography:** *Cormorant Garamond* (Editorial Serif) + *Inter* (UI Sans) + *Marck Script* (Founder Signature Accent)
- **Authentic Brand Assets:** Primary transparent leopard script mark, secondary cream mark, and real seed product data (Waist Chains, Gothic Star Pendant, Keepsake Heart, Tulip Bracelet, Enamel Bangles, MATILDA MEN Cross-Link, Marathi Nose Rings).
- **Core Commerce Systems:**
  - Mask-wipe cinematic preloader
  - Instant full-screen search overlay with auto-complete
  - Interactive catalogue with category filtering, price slider, and sorting
  - Sticky Product Detail Page (PDP) with image zoom and customer star ratings & verified reviews
  - Slide-out Cart Drawer with Pan-India free shipping progress bar
  - 4-Step Checkout with India pin code validation
  - Isolated Razorpay payment integration architecture (Test Mode & Live Ready)
  - Real-time Order Confirmation, Tracking timeline, and WhatsApp order sharing
  - Real Authenticated Admin Panel (`/admin`) with zero fake data calculations, product CRUD, order status updater, inventory stock editor, and customer reviews.

---

## 2. REQUIRED BEFORE LAUNCH (CHECKLIST)

### A. Admin Authentication Passcode
1. The default master passcode for the `/admin` portal is currently set to: **`1234`**.
2. To change this before production deployment, update the passcode check inside [`app/admin/layout.tsx`](file:///C:/Users/faaiz/.gemini/antigravity-ide/scratch/matilda-jewellery/app/admin/layout.tsx) or set an environment variable `ADMIN_PASSCODE`.

### B. Razorpay Live Payment Gateway Integration
The checkout is architected with an isolated Razorpay bridge.
1. Sign up at [Razorpay Dashboard](https://dashboard.razorpay.com/) and complete KYC.
2. In Razorpay Settings → API Keys, generate your **Key ID** and **Key Secret**.
3. Create a `.env.local` file in your repository:
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key_here
   ```
4. You can also toggle between Test Mode and Live Mode directly inside **Admin Portal → Store Settings**.

### C. Domain & Production Hosting (Vercel)
1. Push the repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Connect your custom domain (e.g. `matildajewellery.com` or `shopmatilda.in`) under Vercel Domain Settings.
4. Add DNS records (A record pointing to `76.76.21.21` and CNAME `cname.vercel-dns.com`).

### D. Logistics & Shipping Integration
- Orders currently default to Pan-India Express Courier (Delhivery / BlueDart / DTDC) with estimated dispatch within 24 hours.
- To connect automated label generation, integrate Shiprocket or Delhivery One API webhooks to auto-generate tracking numbers.

---

## 3. STORE CATALOGUE & INVENTORY MANAGEMENT

### Adding & Editing Products
1. Navigate to `/admin/products`.
2. Click **Add Product** to create a new piece with photos, title, description, category, price, SKU, and stock.
3. Use the **Edit** action to update prices or toggle `Featured`, `New Arrival`, or `Best Seller` badges.

### Managing Orders & Customer Communication
1. Navigate to `/admin/orders`.
2. When a customer places an order, click **Inspect** to see their full address and click **WhatsApp Customer** to initiate immediate confirmation.
3. Update fulfillment status from `Processing` → `Shipped` and add the courier tracking waybill number.

### Managing Stock & Low-Stock Alerts
1. Navigate to `/admin/inventory`.
2. The dashboard automatically flags pieces with fewer than 5 units as `Low Stock` and highlights `Out of Stock` items.

---

## 4. OPTIONAL FUTURE ENHANCEMENTS

1. **Live Instagram Feed API:** Connect the Instagram Basic Display Graph API to automatically stream feed posts from `@matilldaaa._`.
2. **Automated WhatsApp Business Notifications:** Connect the Meta WhatsApp Cloud API via Gupshup/Interakt to trigger instant automated WhatsApp order confirmation messages.
3. **Database Migration (Supabase / PostgreSQL):** Transition from browser storage to a serverless PostgreSQL database (Supabase / Neon) using Prisma or Drizzle ORM when order volume scales beyond 500+ orders/month.

---

*MATILDA by Duha Ajaz Pandith • Timeless silhouettes. Made to become yours.*
