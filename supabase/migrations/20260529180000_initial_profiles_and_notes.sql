create extension if not exists "pgcrypto";

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update
    set email = excluded.email,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null default '',
  content text not null default '',
  is_pinned boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
before update on public.notes
for each row
execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.notes enable row level security;

drop policy if exists "Profiles are viewable by their owner" on public.profiles;
create policy "Profiles are viewable by their owner"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Profiles are updateable by their owner" on public.profiles;
create policy "Profiles are updateable by their owner"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "Notes are viewable by their owner" on public.notes;
create policy "Notes are viewable by their owner"
on public.notes
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Notes are insertable by their owner" on public.notes;
create policy "Notes are insertable by their owner"
on public.notes
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Notes are updateable by their owner" on public.notes;
create policy "Notes are updateable by their owner"
on public.notes
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Notes are deletable by their owner" on public.notes;
create policy "Notes are deletable by their owner"
on public.notes
for delete
to authenticated
using ((select auth.uid()) = user_id);
