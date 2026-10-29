-- Motif / Supabase schema
-- Run this once in the Supabase SQL Editor.
-- The app uses a single authenticated user; RLS isolates rows by auth.uid().

create table if not exists public.entries (
  user_id uuid not null references auth.users (id) on delete cascade,
  id text not null,
  title text not null,
  year integer check (year is null or year between 1880 and 2100),
  director text not null default '',
  runtime text not null default '',
  genres text[] not null default '{}',
  country text not null default '',
  language text not null default '',
  status text not null default 'watched' check (status in ('watched', 'watchlist')),
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  watched_at date,
  watched_year integer check (watched_year is null or watched_year between 1880 and 2200),
  added_at timestamptz,
  favorite boolean not null default false,
  rewatches integer not null default 0 check (rewatches >= 0),
  still text not null default '',
  poster text not null default '',
  synopsis text not null default '',
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, id)
);

create index if not exists entries_user_id_idx
  on public.entries (user_id);

create index if not exists entries_user_year_idx
  on public.entries (user_id, watched_year desc);

alter table public.entries enable row level security;

drop policy if exists "entries_select_own" on public.entries;
create policy "entries_select_own"
  on public.entries
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "entries_insert_own" on public.entries;
create policy "entries_insert_own"
  on public.entries
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "entries_update_own" on public.entries;
create policy "entries_update_own"
  on public.entries
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "entries_delete_own" on public.entries;
create policy "entries_delete_own"
  on public.entries
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

grant select, insert, update, delete on public.entries to authenticated;
revoke all on public.entries from anon;

create or replace function public.set_entries_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists entries_set_updated_at on public.entries;
create trigger entries_set_updated_at
  before update on public.entries
  for each row
  execute function public.set_entries_updated_at();
