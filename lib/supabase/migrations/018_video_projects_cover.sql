-- Add cover image column to video_projects
alter table public.video_projects
  add column if not exists cover text not null default '';