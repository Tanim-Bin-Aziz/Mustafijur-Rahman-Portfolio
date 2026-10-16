-- ============================================================
-- Showcase Video - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 003_showcase.sql
-- ============================================================

-- Each showcase card on the homepage can play a looping
-- background video. Empty video_url = the card shows only
-- its image (previous behaviour).

alter table public.showcase_images
  add column if not exists video_url text not null default '';

-- ============================================================
-- Storage
-- Showcase videos upload to the 'project-videos' bucket under
-- showcase/. The bucket + policies come from 001_init.sql.
-- ============================================================
