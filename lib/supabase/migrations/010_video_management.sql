-- ============================================================
-- Video Management Hub - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- (and 009_showcase_video.sql for showcase videos)
-- ============================================================

-- ============================================================
-- STEP 1 -- Tables
-- ============================================================

-- /video page-er cards: Final Collection, Drapping, Studio Collection
create table if not exists public.page_videos (
  id text primary key,
  slug text not null unique,
  title text not null default '',
  cover text not null default '',
  video_url text not null default '',
  description text not null default '',
  mode text not null default 'autoplay',
  created_at timestamptz not null default now()
);

-- /video/additional-work gallery
create table if not exists public.additional_work_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  video_url text not null default '',
  video_date text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_additional_work_videos_sort_order
  on public.additional_work_videos (sort_order, created_at);

-- ============================================================
-- STEP 2 -- Row Level Security
-- ============================================================

alter table public.page_videos enable row level security;
alter table public.additional_work_videos enable row level security;

drop policy if exists page_video_read on public.page_videos;
drop policy if exists page_video_write on public.page_videos;
drop policy if exists aw_video_read on public.additional_work_videos;
drop policy if exists aw_video_write on public.additional_work_videos;

create policy page_video_read
  on public.page_videos for select using (true);
create policy page_video_write
  on public.page_videos for all
  to authenticated using (true) with check (true);

create policy aw_video_read
  on public.additional_work_videos for select using (true);
create policy aw_video_write
  on public.additional_work_videos for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STEP 3 -- Storage
-- Page videos upload to the 'project-videos' bucket (page-videos/),
-- additional work videos to the same bucket (additional-work/),
-- covers to 'project-images' (page-videos/). Buckets + policies
-- come from 001_init.sql.
-- ============================================================

-- ============================================================
-- STEP 4 -- Seed (idempotent — mirrors VIDEO_ITEMS in data/video.ts)
-- ============================================================

insert into public.page_videos (id, slug, title, cover, video_url, description, mode) values
  ('final-collection', 'final-collection', 'Final Collection', '/files/holiday-vibes/thum1.jpg', '/video/1.mp4', 'Final collection-er video.', 'autoplay'),
  ('drapping-final-dress', 'drapping-final-dress', 'Drapping Final Dress', '/images/thum2.jpg', '/video/1.mp4', 'Draping process-er video.', 'autoplay'),
  ('studio-collection', 'studio-collection', 'Studio Collection', '/images/thum3.jpg', '/video/1.mp4', 'Studio collection-er video.', 'click-fullscreen')
on conflict (id) do nothing;

insert into public.additional_work_videos (title, video_url, video_date, sort_order)
select 'Additional Work 01', '/video/1.mp4', '2026-02-01', 1
where not exists (select 1 from public.additional_work_videos);
