# Changelog

All notable changes to this project will be documented here.

## [1.0.1] - 2026-06-01

### Added
- Supabase Edge Function: `create-checkout` — creates Stripe Checkout session
- Supabase Edge Function: `stripe-webhook` — handles payment confirmation and order creation
- Supabase Edge Function: `get-download-url` — validates token and returns signed HD download URL
- `supabase/config.toml` for local development

### Changed
- PhotoPage now calls Edge Function directly via Supabase client instead of `/api/create-checkout`

### Removed
- `src/lib/stripe.ts` (no longer needed, Stripe is handled server-side in Edge Functions)

## [1.0.0] - 2026-06-01

### Added
- Initial project setup with React 18, TypeScript, Vite
- Tailwind CSS dark nightlife theme
- Supabase client integration
- PostgreSQL schema (photos + orders tables)
- Row Level Security policies
- Photo gallery with date, time, and location filters
- Photo detail page with watermarked preview
- Stripe Checkout integration
- Success/download page
- Admin dashboard (login, photos, orders)
- Marketing footer on all public pages
- Production build support for FTP deployment
- Full documentation (README, TODO, ROADMAP, DEPLOYMENT)
