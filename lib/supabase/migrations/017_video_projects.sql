-- ============================================================
-- Video Projects - dynamic video galleries (like Project Management)
-- Run this in Supabase SQL Editor
-- ============================================================

-- ============================================================
-- STEP 1 -- Tables
-- ============================================================

create table if not exists public.video_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.video_project_videos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.video_projects(id) on delete cascade,
  title text not null default '',
  video_url text not null default '',
  video_date text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_video_project_videos_project
  on public.video_project_videos (project_id, sort_order, created_at);

-- ============================================================
-- STEP 2 -- Row Level Security
-- ============================================================

alter table public.video_projects enable row level security;
alter table public.video_project_videos enable row level security;

drop policy if exists vp_read on public.video_projects;
drop policy if exists vp_write on public.video_projects;
drop policy if exists vpv_read on public.video_project_videos;
drop policy if exists vpv_write on public.video_project_videos;

create policy vp_read
  on public.video_projects for select using (true);
create policy vp_write
  on public.video_projects for all
  to authenticated using (true) with check (true);

create policy vpv_read
  on public.video_project_videos for select using (true);
create policy vpv_write
  on public.video_project_videos for all
  to authenticated using (true) with check (true);