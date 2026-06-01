# PhotoInstant

A simple photo marketplace for event photographers. Attendees find their photos, pay 1 AUD, and download the HD version instantly.

## Features

- Browse event photos by date, time, and location
- Watermarked preview — free to view
- HD download for 1 AUD via Stripe Checkout
- Admin dashboard for photo management
- Secure downloads via signed URLs

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Storage, Auth, Edge Functions)
- **Payments**: Stripe Checkout + Webhooks
- **Hosting**: LWS (FTP deployment), Vercel optional

## Quick Start

```bash
cp .env.example .env
# Fill in your Supabase and Stripe credentials
npm install
npm run dev
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment instructions.

## Project Structure

```
src/
├── components/    # Shared UI components
├── hooks/         # React Query data hooks
├── lib/           # Supabase and Stripe clients
├── pages/         # Route-level page components
│   └── admin/     # Protected admin pages
├── supabase/      # SQL schema and Edge Functions
└── types/         # TypeScript type definitions
```

## Environment Variables

See `.env.example` for required variables.
