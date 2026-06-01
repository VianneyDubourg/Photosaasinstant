# Deployment Guide

## Prerequisites

- Node.js 20+
- Supabase project (free or Pro)
- Stripe account
- LWS hosting with FTP access

---

## 1. Local Development

```bash
git clone https://github.com/YOUR_USERNAME/photosaasinstant.git
cd photosaasinstant
cp .env.example .env
# Edit .env with your credentials
npm install
npm run dev
```

---

## 2. Supabase Setup

1. Create a project at https://supabase.com
2. Run `src/supabase/schema.sql` in the SQL editor
3. Create storage buckets:
   - `previews` — public
   - `originals` — private
4. Copy your **Project URL** and **Anon Key** to `.env`

---

## 3. Stripe Setup

1. Create an account at https://stripe.com
2. Enable **Stripe Checkout** in the dashboard
3. Copy your **Publishable Key** to `.env`
4. Set your **Secret Key** as a Supabase Edge Function secret:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_live_...
   ```
5. Configure webhook endpoint: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`
   - Events: `checkout.session.completed`

---

## 4. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with static files.

---

## 5. FTP Deployment to LWS

1. After building, the `dist/` folder contains everything needed.
2. Connect to your LWS hosting via FTP (FileZilla or similar).
3. Upload the **contents** of `dist/` to your web root (`public_html/` or `www/`).
4. Create a `.htaccess` file in the web root:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

This ensures React Router works correctly on page refresh.

---

## 6. Custom Domain (LWS)

1. Log in to your LWS control panel.
2. Point your domain's DNS A record to your LWS hosting IP.
3. Configure the domain in the LWS hosting panel to point to the correct directory.

---

## 7. Environment Variables in Production

Since this is a static build, environment variables are embedded at build time.

**Before building for production**, update your `.env`:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-production-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your-key
```

Then rebuild: `npm run build`

---

## 8. production-build Folder

The `production-build/` folder in this repository always contains the latest ready-to-deploy build.

To deploy without building locally:
1. Download or clone this repository.
2. Open the `production-build/` folder.
3. Upload its contents via FTP to your LWS web root.
4. Add the `.htaccess` file (see step 5 above).

---

## Security Checklist

- [ ] Stripe keys are NOT in the repository
- [ ] Supabase service role key is NOT in the frontend build
- [ ] Row Level Security is enabled on all tables
- [ ] Originals bucket is private
- [ ] Stripe webhook signature verification is enabled
- [ ] Download tokens expire after 24 hours
