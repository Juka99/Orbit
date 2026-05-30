create table if not exists public.foods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  brand text,
  measure_unit text not null check (measure_unit in ('g', 'ml', 'pack')),
  basis_amount numeric(8,2) not null check (basis_amount > 0),
  calories_per_basis numeric(8,2) not null check (calories_per_basis >= 0),
  protein_g_per_basis numeric(8,2) not null default 0 check (protein_g_per_basis >= 0),
  carbs_g_per_basis numeric(8,2) not null default 0 check (carbs_g_per_basis >= 0),
  fats_g_per_basis numeric(8,2) not null default 0 check (fats_g_per_basis >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.calorie_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  food_id uuid not null references public.foods (id) on delete cascade,
  amount numeric(8,2) not null check (amount > 0),
  meal_type text not null check (meal_type in ('breakfast', 'lunch', 'dinner', 'snack')),
  logged_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now())
);

alter table public.foods enable row level security;
alter table public.calorie_entries enable row level security;

drop policy if exists "Foods are viewable by their owner" on public.foods;
create policy "Foods are viewable by their owner"
on public.foods
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Foods are insertable by their owner" on public.foods;
create policy "Foods are insertable by their owner"
on public.foods
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Foods are updateable by their owner" on public.foods;
create policy "Foods are updateable by their owner"
on public.foods
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Foods are deletable by their owner" on public.foods;
create policy "Foods are deletable by their owner"
on public.foods
for delete
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Calorie entries are viewable by their owner" on public.calorie_entries;
create policy "Calorie entries are viewable by their owner"
on public.calorie_entries
for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Calorie entries are insertable by their owner" on public.calorie_entries;
create policy "Calorie entries are insertable by their owner"
on public.calorie_entries
for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Calorie entries are deletable by their owner" on public.calorie_entries;
create policy "Calorie entries are deletable by their owner"
on public.calorie_entries
for delete
to authenticated
using ((select auth.uid()) = user_id);
