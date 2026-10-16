-- ============================================================
-- About Cards Management - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- ============================================================

-- ============================================================
-- STEP 1 -- Table
-- ============================================================

create table if not exists public.about_cards (
  id text primary key,
  slug text not null unique,
  title text not null default '',
  cover text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_about_cards_sort_order
  on public.about_cards (sort_order, created_at);

-- ============================================================
-- STEP 2 -- Row Level Security
-- ============================================================

alter table public.about_cards enable row level security;

drop policy if exists about_cards_read on public.about_cards;
drop policy if exists about_cards_write on public.about_cards;

create policy about_cards_read
  on public.about_cards for select using (true);
create policy about_cards_write
  on public.about_cards for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STEP 3 -- Seed (idempotent - existing rows are kept)
-- ============================================================

insert into public.about_cards (id, slug, title, cover, description, sort_order) values
  ('profile', 'profile', 'Profile', '/images/thum3.jpg', 'About me and my background.', 0),
  ('cv', 'cv', 'CV', '/images/thum4.jpg', 'CV / resume download link.', 1)
on conflict (id) do nothing;

-- ============================================================
-- STEP 4 -- Storage
-- Cover images upload to the 'project-covers' bucket under about/.
-- The bucket + policies come from 001_init.sql.
-- The cards at /about read from this table; if the table is
-- missing the site falls back to the static defaults in
-- data/about.ts.
-- ============================================================
