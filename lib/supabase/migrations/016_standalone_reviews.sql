-- ============================================================
-- 016 — Standalone (home page) reviews
-- Reviews can now be left without a project and the comment is
-- optional (name + star rating stay required).
-- Run in Supabase SQL Editor. Idempotent: safe to run twice.
-- ============================================================

alter table public.project_reviews
  alter column project_id drop not null;

alter table public.project_reviews
  alter column comment drop not null,
  alter column comment set default '';

drop policy if exists pr_insert on public.project_reviews;
create policy pr_insert
  on public.project_reviews for insert
  to anon, authenticated
  with check (
    rating between 1 and 5
    and char_length(btrim(name)) between 1 and 80
    and char_length(btrim(comment)) <= 2000
  );
