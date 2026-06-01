# Changelog

All notable changes to this project will be documented here.

## [1.1.0] - 2026-06-01

### Added
- Legal pages: Terms of Service, Privacy Policy, Refund Policy (Australian Consumer Law + Privacy Act 1988)
- Legal links in footer (Terms · Privacy · Refund Policy)
- Gallery pagination (48 photos per page, Load more button)
- Slideshow page (`/slideshow`) for tablet display — protected by admin auth
  - Auto-rotating photos every 4s, QR code, pricing, 3-step flow
- B2B widget in footer (Budget booking / Full service options with mailto)
- Brochure lead capture page (`/brochure`) — sends PDF link via Resend, notifies photographer
- Admin photo delete — removes files from both Storage buckets before DB record
- HD copyright watermark on all downloaded photos (© Vianney Dubourg · vlogo.fr)
- Auto-cleanup Edge Function (`cleanup-old-photos`) — runs hourly via cron, deletes photos >10h
- 404 page
- Success page redesign — download button, 10h expiry warning, support contacts
- Admin dashboard day/week sales breakdown
- Email confirmation on purchase (via Resend) — sends download link to buyer
- Gallery lazy loading with fade-in on image load
- Back button in PhotoPage preserves gallery navigation history

### Changed
- Download link expiry changed from 48h to 10h (matches photo availability window)
- Contact email changed from `contact@vlogo.fr` to `hello@vlogo.fr` across all pages
- Phone number removed from footer and all public-facing content
- PhotoPage back button uses browser history (`navigate(-1)`) to preserve gallery filters
- HD photos now processed with subtle copyright overlay instead of separate original upload

### Fixed
- Admin delete now correctly removes files from `previews` and `originals` Storage buckets

## [1.0.2] - 2026-06-01

### Added
- `automation/` — Windows uploader tool for Surface Go 3
  - Watches a folder for new photo files (JPG, RAW, ARW, CR2, CR3, NEF, ORF, RW2)
  - Generates watermarked low-res JPEG preview using Sharp
  - Uploads preview to `previews` bucket and original to `originals` bucket
  - Creates database record automatically
  - Configurable via `.env` file (location, price, watermark text)
  - Buildable to standalone `.exe` via `pkg`

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
