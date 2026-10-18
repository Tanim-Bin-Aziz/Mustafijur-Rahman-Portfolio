-- ============================================================
-- Showcase Gallery Image Management - Supabase Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql & 002_gallery.sql
-- ============================================================

-- ============================================================
-- STEP 1 -- Table
-- ============================================================

create table if not exists public.showcase_images (
  id uuid primary key default gen_random_uuid(),
  title text not null default '',
  category text not null default '',
  location text not null default '',
  image_url text not null default '',
  thumbnail_url text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_showcase_images_sort_order
  on public.showcase_images (sort_order, created_at);

-- ============================================================
-- STEP 2 -- Row Level Security
-- ============================================================

alter table public.showcase_images enable row level security;

drop policy if exists showcase_image_read on public.showcase_images;
drop policy if exists showcase_image_write on public.showcase_images;

create policy showcase_image_read
  on public.showcase_images for select using (true);
create policy showcase_image_write
  on public.showcase_images for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STEP 3 -- Storage
-- Uploads reuse the existing 'project-images' bucket and its
-- policies created in 001_init.sql (files go under showcase/).
-- ============================================================

-- ============================================================
-- STEP 4 -- Seed fashion design dummy data
-- (mirrors SHOWCASE_RING in data/showcase.ts)
-- ============================================================

insert into public.showcase_images (id, title, category, location, image_url, sort_order)
values
  ('bbbbbbbb-0000-0000-0000-000000000001', 'Denim Pocket Front', 'DENIM', 'DHAKA', '/images/denim-pocket/1.png', 1),
  ('bbbbbbbb-0000-0000-0000-000000000002', 'Denim Pocket Topstitch', 'DENIM', 'DHAKA', '/images/denim-pocket/2.png', 2),
  ('bbbbbbbb-0000-0000-0000-000000000003', 'Cotton Swatch Set', 'TEXTILE', 'MILAN', '/images/Swatch/1.png', 3),
  ('bbbbbbbb-0000-0000-0000-000000000004', 'Linen & Wool Board', 'TEXTILE', 'PARIS', '/images/Swatch/2.png', 4),
  ('bbbbbbbb-0000-0000-0000-000000000005', 'Seasonal Colourway', 'TEXTILE', 'LONDON', '/images/Swatch/3.png', 5),
  ('bbbbbbbb-0000-0000-0000-000000000006', 'Swatch Card Layout', 'TEXTILE', 'TOKYO', '/images/Swatch/4.png', 6),
  ('bbbbbbbb-0000-0000-0000-000000000007', 'Look 01 - Summer Edit', 'RUNWAY', 'PARIS', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80', 7),
  ('bbbbbbbb-0000-0000-0000-000000000008', 'Look 02 - Studio Lookbook', 'LOOKBOOK', 'MILAN', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80', 8),
  ('bbbbbbbb-0000-0000-0000-000000000009', 'Look 03 - Street Edit', 'STREETWEAR', 'NEW YORK', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80', 9),
  ('bbbbbbbb-0000-0000-0000-000000000010', 'Look 04 - Retail Capsule', 'RETAIL', 'LONDON', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80', 10),
  ('bbbbbbbb-0000-0000-0000-000000000011', 'Look 05 - Tailored Suiting', 'TAILORING', 'LONDON', 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80', 11),
  ('bbbbbbbb-0000-0000-0000-000000000012', 'Look 06 - Day Dress', 'DRESSES', 'PARIS', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80', 12),
  ('bbbbbbbb-0000-0000-0000-000000000013', 'Look 07 - Duo Styling', 'EDITORIAL', 'TOKYO', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80', 13),
  ('bbbbbbbb-0000-0000-0000-000000000014', 'Look 08 - Evening Statement', 'EVENINGWEAR', 'MILAN', 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&q=80', 14),
  ('bbbbbbbb-0000-0000-0000-000000000015', 'Look 09 - Colour Pop Campaign', 'CAMPAIGN', 'NEW YORK', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80', 15),
  ('bbbbbbbb-0000-0000-0000-000000000016', 'Look 10 - Portrait Knits', 'KNITWEAR', 'LONDON', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&q=80', 16),
  ('bbbbbbbb-0000-0000-0000-000000000017', 'Look 11 - Denim Layering', 'DENIM', 'DHAKA', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80', 17),
  ('bbbbbbbb-0000-0000-0000-000000000018', 'Look 12 - Movement Study', 'SILK', 'PARIS', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80', 18),
  ('bbbbbbbb-0000-0000-0000-000000000019', 'Look 13 - Street Diaries', 'STREETWEAR', 'TOKYO', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80', 19),
  ('bbbbbbbb-0000-0000-0000-000000000020', 'Look 14 - Drape Silhouette', 'EVENINGWEAR', 'MILAN', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80', 20),
  ('bbbbbbbb-0000-0000-0000-000000000021', 'Look 15 - Knit Texture', 'KNITWEAR', 'MILAN', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=600&q=80', 21),
  ('bbbbbbbb-0000-0000-0000-000000000022', 'Look 16 - Fabric Bolts', 'TEXTILE', 'DHAKA', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80', 22),
  ('bbbbbbbb-0000-0000-0000-000000000023', 'Look 17 - Atelier Process', 'ATELIER', 'DHAKA', 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?w=600&q=80', 23),
  ('bbbbbbbb-0000-0000-0000-000000000024', 'Look 18 - Materials Palette', 'TEXTILE', 'DHAKA', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&q=80', 24)
on conflict (id) do nothing;
