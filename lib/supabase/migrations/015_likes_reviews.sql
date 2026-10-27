-- ============================================================
-- 015 — Per-image likes + project reviews
-- Run in Supabase SQL Editor. Idempotent: safe to run twice.
-- ============================================================

-- ============================================================
-- STEP 1 — Per-image like counters
-- One row per liked image. Counts are readable ONLY by the
-- signed-in admin; anonymous visitors write through the
-- security-definer function below.
-- ============================================================

create table if not exists public.project_image_likes (
  image_id uuid primary key references public.project_images (id) on delete cascade,
  like_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.project_image_likes enable row level security;

drop policy if exists pil_read on public.project_image_likes;
create policy pil_read
  on public.project_image_likes for select
  to authenticated using (true);

-- No insert/update/delete policies on purpose: only the function writes.
create or replace function public.increment_image_like(p_image_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if exists (select 1 from public.project_images where id = p_image_id) then
    insert into public.project_image_likes (image_id, like_count)
    values (p_image_id, 1)
    on conflict (image_id) do update
      set like_count = public.project_image_likes.like_count + 1,
          updated_at = now();
  end if;
end;
$$;

revoke all on function public.increment_image_like(uuid) from public;
grant execute on function public.increment_image_like(uuid) to anon, authenticated;

-- ============================================================
-- STEP 2 — Project reviews
-- Public read + public insert (a name, 1–5 stars, a note).
-- Edit/delete stay admin-only.
-- ============================================================

create table if not exists public.project_reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_project_reviews_project
  on public.project_reviews (project_id, created_at desc);

alter table public.project_reviews enable row level security;

drop policy if exists pr_read on public.project_reviews;
drop policy if exists pr_insert on public.project_reviews;
drop policy if exists pr_update on public.project_reviews;
drop policy if exists pr_delete on public.project_reviews;

create policy pr_read
  on public.project_reviews for select using (true);

create policy pr_insert
  on public.project_reviews for insert
  to anon, authenticated
  with check (
    rating between 1 and 5
    and char_length(btrim(name)) between 1 and 80
    and char_length(btrim(comment)) between 1 and 2000
  );

create policy pr_update
  on public.project_reviews for update
  to authenticated using (true) with check (true);

create policy pr_delete
  on public.project_reviews for delete
  to authenticated using (true);

drop trigger if exists on_project_reviews_set_updated_at on public.project_reviews;
create trigger on_project_reviews_set_updated_at
  before update on public.project_reviews
  for each row
  execute function public.set_updated_at();
