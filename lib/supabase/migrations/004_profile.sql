-- ============================================================
-- Profile Management - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001/002/003 migrations
-- ============================================================

-- Single-row key/value store: the whole profile lives in one jsonb doc.
create table if not exists public.profile_settings (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profile_settings enable row level security;

drop policy if exists profile_settings_read on public.profile_settings;
drop policy if exists profile_settings_write on public.profile_settings;

create policy profile_settings_read
  on public.profile_settings for select using (true);
create policy profile_settings_write
  on public.profile_settings for all
  to authenticated using (true) with check (true);

-- No seed needed: the app falls back to DEFAULT_PROFILE in data/profile.ts
-- until you save from Dashboard > Profile Management.
