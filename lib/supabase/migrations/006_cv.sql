-- ============================================================
-- CV Management - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- ============================================================

-- ============================================================
-- STEP 1 -- Table
-- ============================================================

create table if not exists public.cv_documents (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  file_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_cv_documents_sort_order
  on public.cv_documents (sort_order, created_at);

-- ============================================================
-- STEP 2 -- Row Level Security
-- ============================================================

alter table public.cv_documents enable row level security;

drop policy if exists cv_read on public.cv_documents;
drop policy if exists cv_write on public.cv_documents;

create policy cv_read
  on public.cv_documents for select using (true);
create policy cv_write
  on public.cv_documents for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STEP 3 -- Storage
-- CV PDFs upload to the 'project-pdfs' bucket under cv/.
-- The bucket + policies come from 001_init.sql.
-- The viewer at /about/cv shows the first CV (lowest sort_order).
-- ============================================================
