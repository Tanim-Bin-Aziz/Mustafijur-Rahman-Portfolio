-- ============================================================
-- Showcase Video Cards (home page PixelWarpGallery) - Supabase
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- ============================================================

-- The home "Showcase" section: each card plays a looping
-- background video.

create table if not exists public.showcase_videos (
  id uuid primary key default gen_random_uuid(),
  label text not null default '',
  video_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_showcase_videos_sort_order
  on public.showcase_videos (sort_order, created_at);

alter table public.showcase_videos enable row level security;

drop policy if exists showcase_video_read on public.showcase_videos;
drop policy if exists showcase_video_write on public.showcase_videos;

create policy showcase_video_read
  on public.showcase_videos for select using (true);
create policy showcase_video_write
  on public.showcase_videos for all
  to authenticated using (true) with check (true);

-- Storage: videos upload to the 'project-videos' bucket (showcase/).
-- Bucket + policies come from 001_init.sql.

-- Seed (idempotent — mirrors the previous DEFAULT_ITEMS)
insert into public.showcase_videos (label, video_url, sort_order)
select 'Motion 01', '/video/1.mp4', 1
where not exists (select 1 from public.showcase_videos);
