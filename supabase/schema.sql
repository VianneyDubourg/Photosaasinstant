-- Enable UUID extension
create extension if not exists "pgcrypto";

-- Photos table
create table public.photos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  taken_at timestamptz not null,
  latitude float,
  longitude float,
  location_label text,
  preview_path text not null,
  hd_path text not null,
  price_cents integer not null default 100,
  currency text not null default 'AUD',
  is_active boolean not null default true
);

-- Orders table
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  photo_id uuid not null references public.photos(id),
  stripe_session_id text not null,
  stripe_payment_intent text,
  buyer_email text,
  amount_total integer not null,
  currency text not null default 'AUD',
  status text not null default 'pending',
  download_token text not null unique,
  download_expires_at timestamptz
);

-- Row Level Security
alter table public.photos enable row level security;
alter table public.orders enable row level security;

-- Photos: anyone can read active photos
create policy "Public can view active photos"
  on public.photos for select
  using (is_active = true);

-- Orders: readable only by token (via RPC or edge function)
-- Admin access is via service role key only

-- Storage buckets (run these in Supabase dashboard or via CLI)
-- insert into storage.buckets (id, name, public) values ('previews', 'previews', true);
-- insert into storage.buckets (id, name, public) values ('originals', 'originals', false);

-- Storage policy: previews bucket is public
create policy "Public preview access"
  on storage.objects for select
  using (bucket_id = 'previews');

-- Indexes for performance
create index photos_taken_at_idx on public.photos(taken_at desc);
create index photos_is_active_idx on public.photos(is_active);
create index orders_download_token_idx on public.orders(download_token);
create index orders_stripe_session_idx on public.orders(stripe_session_id);

-- Leads table (brochure downloads)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now() not null,
  email text not null,
  name text,
  venue_name text,
  ip_hash text
);

alter table public.leads enable row level security;

-- Anyone can insert a lead (public form)
create policy "Public can submit leads"
  on public.leads for insert
  with check (true);

create index leads_email_idx on public.leads(email);
create index leads_created_at_idx on public.leads(created_at desc);
