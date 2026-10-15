-- ============================================================
-- CLO 3D Video Management - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- ============================================================

-- ============================================================
-- STEP 1 -- Video bucket + storage policies
-- ============================================================

insert into storage.buckets (id, name, public)
values ('project-videos', 'project-videos', true)
on conflict (id) do nothing;

drop policy if exists stg_portfolio_read on storage.objects;
drop policy if exists stg_portfolio_insert on storage.objects;
drop policy if exists stg_portfolio_update on storage.objects;
drop policy if exists stg_portfolio_delete on storage.objects;

create policy stg_portfolio_read
  on storage.objects for select
  using (bucket_id in ('project-covers', 'project-images', 'project-pdfs', 'project-videos'));

create policy stg_portfolio_insert
  on storage.objects for insert to authenticated
  with check (bucket_id in ('project-covers', 'project-images', 'project-pdfs', 'project-videos'));

create policy stg_portfolio_update
  on storage.objects for update to authenticated
  using (bucket_id in ('project-covers', 'project-images', 'project-pdfs', 'project-videos'));

create policy stg_portfolio_delete
  on storage.objects for delete to authenticated
  using (bucket_id in ('project-covers', 'project-images', 'project-pdfs', 'project-videos'));

-- ============================================================
-- STEP 2 -- Tables
-- ============================================================

create table if not exists public.clo3d_folders (
  id uuid primary key default gen_random_uuid(),
  name text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.clo3d_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  video_url text not null default '',
  folder_id uuid references public.clo3d_folders (id) on delete set null,
  video_date date not null default current_date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_clo3d_videos_folder_id
  on public.clo3d_videos (folder_id);

-- ============================================================
-- STEP 3 -- Row Level Security
-- ============================================================

alter table public.clo3d_folders enable row level security;
alter table public.clo3d_videos enable row level security;

drop policy if exists clo3d_folder_read on public.clo3d_folders;
drop policy if exists clo3d_folder_write on public.clo3d_folders;
drop policy if exists clo3d_video_read on public.clo3d_videos;
drop policy if exists clo3d_video_write on public.clo3d_videos;

create policy clo3d_folder_read
  on public.clo3d_folders for select using (true);
create policy clo3d_folder_write
  on public.clo3d_folders for all
  to authenticated using (true) with check (true);

create policy clo3d_video_read
  on public.clo3d_videos for select using (true);
create policy clo3d_video_write
  on public.clo3d_videos for all
  to authenticated using (true) with check (true);
