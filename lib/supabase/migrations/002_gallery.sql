-- ============================================================
-- Gallery Image Management - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- ============================================================

-- ============================================================
-- STEP 1 -- Tables
-- ============================================================

create table if not exists public.gallery_folders (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  folder_id uuid not null references public.gallery_folders (id) on delete cascade,
  title text not null default '',
  image_url text not null default '',
  date date,
  created_at timestamptz not null default now()
);

create index if not exists idx_gallery_images_folder_id
  on public.gallery_images (folder_id);

-- ============================================================
-- STEP 2 -- Row Level Security
-- ============================================================

alter table public.gallery_folders enable row level security;
alter table public.gallery_images enable row level security;

drop policy if exists gal_folder_read on public.gallery_folders;
drop policy if exists gal_folder_write on public.gallery_folders;
drop policy if exists gal_image_read on public.gallery_images;
drop policy if exists gal_image_write on public.gallery_images;

create policy gal_folder_read
  on public.gallery_folders for select using (true);
create policy gal_folder_write
  on public.gallery_folders for all
  to authenticated using (true) with check (true);

create policy gal_image_read
  on public.gallery_images for select using (true);
create policy gal_image_write
  on public.gallery_images for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STEP 3 -- Seed folders
-- ============================================================

insert into public.gallery_folders (id, slug, name)
values
  ('aaaaaaaa-0000-0000-0000-000000000001', 'studio', 'Studio Collection'),
  ('aaaaaaaa-0000-0000-0000-000000000002', 'holiday', 'Holiday Vibes'),
  ('aaaaaaaa-0000-0000-0000-000000000003', 'draping', 'Draping Process')
on conflict (slug) do nothing;

-- ============================================================
-- STEP 4 -- Seed images (from existing data/gallery.ts)
-- ============================================================

do $$
declare
  folder_studio  uuid := 'aaaaaaaa-0000-0000-0000-000000000001';
  folder_holiday uuid := 'aaaaaaaa-0000-0000-0000-000000000002';
  folder_draping uuid := 'aaaaaaaa-0000-0000-0000-000000000003';
begin

  insert into public.gallery_images (folder_id, title, image_url, date)
  values
    (folder_studio, 'Editorial Shot 01',
     'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000',
     '2026-02-15'),
    (folder_holiday, 'Beach Mood',
     'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000',
     '2026-01-20'),
    (folder_draping, 'Silk Draping Detail',
     'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000',
     '2026-02-10'),
    (folder_studio, 'Studio Portait Black',
     'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000',
     '2026-03-01'),
    (folder_holiday, 'Sunset Vibes',
     'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1000',
     '2025-12-25')
  on conflict do nothing;

end $$;
