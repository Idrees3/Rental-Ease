-- Phase 4: monthly category budgets (run once in Supabase SQL Editor)

create table if not exists public.category_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  category public.expense_category not null,
  amount_qar numeric(12, 2) not null check (amount_qar > 0),
  month_year text not null,
  created_at timestamptz not null default now(),
  unique (user_id, category, month_year)
);

alter table public.category_budgets enable row level security;

create policy "Users manage own budgets"
  on public.category_budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
