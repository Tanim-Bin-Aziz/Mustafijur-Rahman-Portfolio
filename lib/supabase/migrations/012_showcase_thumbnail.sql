-- ============================================================
-- Showcase Gallery Thumbnail - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 003_showcase.sql / 009
-- ============================================================

-- Each showcase ring card can show a separate thumbnail image
-- (a chosen crop of the full image) instead of auto-cropping
-- the full image. Empty thumbnail_url = card uses image_url.

alter table public.showcase_images
  add column if not exists thumbnail_url text not null default '';

-- ============================================================
-- Storage
-- Thumbnails upload to the existing 'project-images' bucket
-- under showcase/thumbnails/. Reuses 001_init.sql policies.
-- ============================================================
