-- Add sort_order to projects so dashboard reordering can persist.
alter table public.projects
  add column if not exists sort_order integer not null default 0;

-- Backfill existing rows per category by created_at.
with ranked as (
  select id, row_number() over (partition by category_id order by created_at asc) - 1 as rn
  from public.projects
)
update public.projects p
set sort_order = r.rn
from ranked r
where p.id = r.id;

create index if not exists idx_projects_sort_order
  on public.projects (category_id, sort_order);