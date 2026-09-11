-- ============================================================
-- Portfolio Project Management - Supabase Init Migration
-- Run these sections ONE AT A TIME in Supabase SQL Editor
-- If any section errors, run it again — everything uses
-- idempotent "if not exists" / "if exists" / "on conflict".
-- ============================================================

-- ============================================================
-- STEP 1 — Tables
-- Run this block first.
-- ============================================================

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  cover text not null default '',
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  category_id uuid not null references public.categories (id) on delete cascade,
  title text not null,
  cover text not null default '',
  project_type text not null default '',
  "date" text not null default '',
  location text not null default '',
  description text not null default '',
  pdf_url text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  image_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_projects_category_id
  on public.projects (category_id);
create index if not exists idx_project_images_project_id
  on public.project_images (project_id);

-- ============================================================
-- STEP 2 — updated_at trigger
-- Run after Step 1.
-- ============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_projects_set_updated_at on public.projects;
create trigger on_projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

-- ============================================================
-- STEP 3 — Row Level Security
-- Run after Step 1.
-- ============================================================

alter table public.categories        enable row level security;
alter table public.projects          enable row level security;
alter table public.project_images    enable row level security;

drop policy if exists cat_read on public.categories;
drop policy if exists cat_write on public.categories;
drop policy if exists proj_read on public.projects;
drop policy if exists proj_write on public.projects;
drop policy if exists pimg_read on public.project_images;
drop policy if exists pimg_write on public.project_images;

create policy cat_read
  on public.categories for select using (true);
create policy cat_write
  on public.categories for all
  to authenticated using (true) with check (true);

create policy proj_read
  on public.projects for select using (true);
create policy proj_write
  on public.projects for all
  to authenticated using (true) with check (true);

create policy pimg_read
  on public.project_images for select using (true);
create policy pimg_write
  on public.project_images for all
  to authenticated using (true) with check (true);

-- ============================================================
-- STEP 4 — Storage buckets
-- Run after Step 3.
-- NOTE: if this fails with a permission error, create the
-- buckets manually in Supabase Dashboard > Storage > New bucket:
--   project-covers  (public)
--   project-images  (public)
--   project-pdfs    (public)
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('project-covers', 'project-covers', true),
  ('project-images', 'project-images', true),
  ('project-pdfs', 'project-pdfs', true)
on conflict (id) do nothing;

drop policy if exists stg_portfolio_read on storage.objects;
drop policy if exists stg_portfolio_insert on storage.objects;
drop policy if exists stg_portfolio_update on storage.objects;
drop policy if exists stg_portfolio_delete on storage.objects;

create policy stg_portfolio_read
  on storage.objects for select
  using (bucket_id in ('project-covers', 'project-images', 'project-pdfs'));

create policy stg_portfolio_insert
  on storage.objects for insert to authenticated
  with check (bucket_id in ('project-covers', 'project-images', 'project-pdfs'));

create policy stg_portfolio_update
  on storage.objects for update to authenticated
  using (bucket_id in ('project-covers', 'project-images', 'project-pdfs'));

create policy stg_portfolio_delete
  on storage.objects for delete to authenticated
  using (bucket_id in ('project-covers', 'project-images', 'project-pdfs'));

-- ============================================================
-- STEP 5 — Seed categories
-- Run after Steps 1 + 2.
-- ============================================================

insert into public.categories (id, slug, title, cover, description)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'academic-hons',
    'Academic (Hons)',
    '/files/holiday-vibes/thum1.jpg',
    'Academic (Hons)-er shob project ei jaigay pawa jabe.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'professional',
    'Professional',
    '/images/thum2.jpg',
    'Professional kaj-er collection.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'additional-work',
    'Additional Work',
    '/images/thum3.jpg',
    'Additional/extra project work.'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'gallery',
    'Gallery',
    '/images/thum4.jpg',
    'Gallery showcase.'
  )
on conflict (slug) do nothing;

-- ============================================================
-- STEP 6 -- Seed projects
-- Run after Step 5.
-- ============================================================

do $$
declare
  cat_id_academic  uuid := '11111111-1111-1111-1111-111111111111';
  cat_id_pro       uuid := '22222222-2222-2222-2222-222222222222';
  cat_id_additional uuid := '33333333-3333-3333-3333-333333333333';
  cat_id_gallery   uuid := '44444444-4444-4444-4444-444444444444';
begin

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('holiday-vibes', cat_id_academic, 'Holiday Vibes', '/files/holiday-vibes/thum1.jpg',
    'Illustrations, Flats, and Print work', 'September 2025', 'Fleetwood, BD',
    'This is a three-piece holiday collection that was designed to fit into a storefront''s holiday collection for 2025. The main focus was on the printwork, which was all hand-designed using Procreate.',
    '/files/holiday-vibes/RMG development.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('academic-project-2', cat_id_academic, 'Academic Project 2', '/images/thum2.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/holiday-vibes/RMG development.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('academic-project-3', cat_id_academic, 'Academic Project 3', '/images/thum3.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/holiday-vibes/RMG development.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('urban-essentials', cat_id_pro, 'Urban Essentials', '/images/thum2.jpg',
    'Fashion Collection, Tech Pack, Print Design', 'January 2026', 'Dhaka, BD',
    'A modern streetwear-inspired capsule collection created for young adults. The project includes concept development, print exploration, technical packs, and presentation boards for production.',
    '/files/urban-essentials/tech-pack.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('professional-project-2', cat_id_pro, 'Professional Project 2', '/images/thum3.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/urban-essentials/tech-pack.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('professional-project-3', cat_id_pro, 'Professional Project 3', '/images/thum4.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/urban-essentials/tech-pack.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('coastal-retreat', cat_id_additional, 'Coastal Retreat', '/images/thum3.jpg',
    'Resort Wear, Textile Design, Collection Development', 'May 2026', 'Cox''s Bazar, BD',
    'A resort-inspired apparel collection featuring lightweight fabrics, tropical prints, and relaxed silhouettes. The project covers mood boards, print development, garment illustrations, and production-ready documentation.',
    '/files/coastal-retreat/collection-book.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('additional-project-2', cat_id_additional, 'Additional Project 2', '/images/thum4.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/coastal-retreat/collection-book.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('additional-project-3', cat_id_additional, 'Additional Project 3', '/images/thum2.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/coastal-retreat/collection-book.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('gallery-1', cat_id_gallery, 'Gallery Showcase', '/images/thum4.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/coastal-retreat/collection-book.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('gallery-2', cat_id_gallery, 'Gallery 2', '/images/thum2.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/coastal-retreat/collection-book.pdf')
  on conflict (slug) do nothing;

  insert into public.projects (slug, category_id, title, cover, project_type, "date", location, description, pdf_url)
  values ('gallery-3', cat_id_gallery, 'Gallery 3', '/images/thum3.jpg',
    'TODO - project type', 'TODO', 'TODO',
    'TODO - ei project-er real description add koro.',
    '/files/coastal-retreat/collection-book.pdf')
  on conflict (slug) do nothing;

end $$;

-- ============================================================
-- STEP 7 — Seed project images
-- Run after Step 6.
-- ============================================================

insert into public.project_images (project_id, image_url, sort_order)
select p.id, v.image_url, v.sort_order
from (values
  ('holiday-vibes', '/images/Swatch/1.png', 0),
  ('holiday-vibes', '/images/Swatch/2.png', 1),
  ('holiday-vibes', '/images/Swatch/3.png', 2),
  ('holiday-vibes', '/images/Swatch/4.png', 3),
  ('academic-project-2', '/images/img1.jpg', 0),
  ('academic-project-2', '/images/img2.jpg', 1),
  ('academic-project-3', '/images/img3.jpg', 0),
  ('academic-project-3', '/images/img4.jpg', 1),
  ('urban-essentials', '/images/img1.jpg', 0),
  ('urban-essentials', '/images/img2.jpg', 1),
  ('urban-essentials', '/images/img3.jpg', 2),
  ('urban-essentials', '/images/img4.jpg', 3),
  ('professional-project-2', '/images/img5.jpg', 0),
  ('professional-project-2', '/images/img1.jpg', 1),
  ('professional-project-3', '/images/img2.jpg', 0),
  ('professional-project-3', '/images/img3.jpg', 1),
  ('coastal-retreat', '/images/img4.jpg', 0),
  ('coastal-retreat', '/images/img5.jpg', 1),
  ('coastal-retreat', '/images/img1.jpg', 2),
  ('coastal-retreat', '/images/img2.jpg', 3),
  ('additional-project-2', '/images/img3.jpg', 0),
  ('additional-project-2', '/images/img4.jpg', 1),
  ('additional-project-3', '/images/img5.jpg', 0),
  ('additional-project-3', '/images/img1.jpg', 1),
  ('gallery-1', '/images/img1.jpg', 0),
  ('gallery-1', '/images/img3.jpg', 1),
  ('gallery-2', '/images/img4.jpg', 0),
  ('gallery-2', '/images/img2.jpg', 1),
  ('gallery-3', '/images/img5.jpg', 0),
  ('gallery-3', '/images/img1.jpg', 1)
) as v (slug, image_url, sort_order)
join public.projects p on p.slug = v.slug
where not exists (
  select 1 from public.project_images pi where pi.project_id = p.id
);
