-- ============================================================
-- Certificate Management - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- ============================================================

-- ============================================================
-- STEP 1 -- Table
-- ============================================================

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  description text not null default '',
  file_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_certificates_sort_order
  on public.certificates (sort_order, created_at);

-- ============================================================
-- STEP 2 -- Row Level Security
-- ============================================================

alter table public.certificates enable row level security;

drop policy if exists certificate_read on public.certificates;
drop policy if exists certificate_write on public.certificates;

create policy certificate_read
  on public.certificates for select using (true);
create policy certificate_write
  on public.certificates for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STEP 3 -- Storage
-- Image files (jpg/png) upload to the 'project-images' bucket
-- under certificates/. PDFs upload to the 'project-pdfs' bucket
-- under certificates/. Both buckets + policies come from
-- 001_init.sql — no extra storage setup needed.
-- ============================================================
