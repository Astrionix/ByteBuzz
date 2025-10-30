-- Supabase setup script for feedback_votes table, RLS policies, and realtime
-- Run these commands in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.feedback_votes (
  id uuid primary key default gen_random_uuid(),
  dish_id text not null,
  rating smallint not null check (rating between 1 and 5),
  user_id text,
  created_at timestamptz not null default now()
);

drop policy if exists "Allow anon select on feedback_votes" on public.feedback_votes;
create policy "Allow anon select on feedback_votes"
  on public.feedback_votes
  for select
  to anon
  using (true);

drop policy if exists "Allow anon insert on feedback_votes" on public.feedback_votes;
create policy "Allow anon insert on feedback_votes"
  on public.feedback_votes
  for insert
  to anon
  with check (true);

alter table public.feedback_votes enable row level security;

-- Enable realtime for the feedback_votes table via Settings > Database > Replication.
-- Toggle the table on in the UI after running this script.
