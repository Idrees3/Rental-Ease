-- Phase 3: payment history (run once in Supabase SQL Editor)

create type public.tracker_kind as enum ('rent', 'emi');

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind public.tracker_kind not null,
  tracker_id uuid not null,
  amount_paid_qar numeric(12, 2) not null check (amount_paid_qar > 0),
  amount_due_qar numeric(12, 2) not null check (amount_due_qar > 0),
  paid_at timestamptz not null default now(),
  month_year text not null,
  created_at timestamptz not null default now()
);

create index if not exists payment_records_tracker_idx
  on public.payment_records (kind, tracker_id, month_year);

alter table public.payment_records enable row level security;

create policy "Users manage own payments"
  on public.payment_records for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
