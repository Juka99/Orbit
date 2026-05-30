create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  amount_ml integer not null check (amount_ml > 0 and amount_ml <= 5000),
  logged_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.water_logs enable row level security;

drop policy if exists "Water logs are viewable by their owner" on public.water_logs;
create policy "Water logs are viewable by their owner"
on public.water_logs
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Water logs are insertable by their owner" on public.water_logs;
create policy "Water logs are insertable by their owner"
on public.water_logs
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Water logs are deletable by their owner" on public.water_logs;
create policy "Water logs are deletable by their owner"
on public.water_logs
for delete
to authenticated
using ((select auth.uid()) = user_id);
