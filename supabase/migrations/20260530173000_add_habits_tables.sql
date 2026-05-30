create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  description text,
  tone text not null check (tone in ('sage', 'amber', 'sky', 'rose', 'plum')),
  icon_key text not null check (icon_key in ('spark', 'leaf', 'book', 'sun', 'heart')),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.habit_completions (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  completed_on date not null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists habit_completions_habit_id_completed_on_key
on public.habit_completions (habit_id, completed_on);

alter table public.habits enable row level security;
alter table public.habit_completions enable row level security;

drop policy if exists "Habits are viewable by their owner" on public.habits;
create policy "Habits are viewable by their owner"
on public.habits
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Habits are insertable by their owner" on public.habits;
create policy "Habits are insertable by their owner"
on public.habits
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Habits are updateable by their owner" on public.habits;
create policy "Habits are updateable by their owner"
on public.habits
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Habits are deletable by their owner" on public.habits;
create policy "Habits are deletable by their owner"
on public.habits
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Habit completions are viewable by their owner" on public.habit_completions;
create policy "Habit completions are viewable by their owner"
on public.habit_completions
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Habit completions are insertable by their owner" on public.habit_completions;
create policy "Habit completions are insertable by their owner"
on public.habit_completions
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Habit completions are deletable by their owner" on public.habit_completions;
create policy "Habit completions are deletable by their owner"
on public.habit_completions
for delete
to authenticated
using ((select auth.uid()) = user_id);
