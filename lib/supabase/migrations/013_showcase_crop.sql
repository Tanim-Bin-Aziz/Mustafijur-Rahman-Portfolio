-- ============================================================
-- Showcase Gallery Card Crop - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 012_showcase_thumbnail.sql
-- ============================================================

-- Each showcase ring card image can be panned/zoomed freely
-- to choose which area is displayed, instead of auto-cropping.

alter table public.showcase_images
  add column if not exists card_offset_x real not null default 50;

alter table public.showcase_images
  add column if not exists card_offset_y real not null default 50;

alter table public.showcase_images
  add column if not exists card_scale real not null default 1;

-- The first version of this feature used 0 as the default offset.
-- Switch existing untouched rows to the centred position.
update public.showcase_images
  set card_offset_x = 50
  where card_offset_x = 0;

update public.showcase_images
  set card_offset_y = 50
  where card_offset_y = 0;
