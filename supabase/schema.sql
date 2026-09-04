-- Rental Ease — Supabase schema
-- Run in Supabase SQL Editor after creating your project

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  onesignal_external_id text,
  push_enabled boolean not null default false,
  email_reminders boolean not null default true,
  role text not null default 'payer' check (role in ('payer', 'collector')),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '14 days'),
  collector_plan text not null default 'starter' check (collector_plan in ('starter', 'growth', 'custom')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Rent tracker
create table if not exists public.rent_trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  landlord_name text,
  amount_qar numeric(12, 2) not null check (amount_qar > 0),
  due_day int not null check (due_day between 1 and 28),
  reminder_days_before int not null default 3 check (reminder_days_before >= 0),
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.rent_trackers enable row level security;

create policy "Users manage own rent"
  on public.rent_trackers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- EMI / loans
create type public.loan_type as enum ('home', 'car', 'personal', 'other');

create table if not exists public.emi_trackers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lender_name text not null,
  loan_type public.loan_type not null default 'other',
  amount_qar numeric(12, 2) not null check (amount_qar > 0),
  due_day int not null check (due_day between 1 and 28),
  reminder_days_before int not null default 3,
  end_date date,
  notes text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.emi_trackers enable row level security;

create policy "Users manage own emi"
  on public.emi_trackers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Monthly expenses
create type public.expense_category as enum (
  'utilities', 'telecom', 'subscription', 'groceries', 'transport', 'other'
);

create table if not exists public.monthly_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  category public.expense_category not null default 'other',
  amount_qar numeric(12, 2) not null check (amount_qar >= 0),
  due_day int check (due_day is null or due_day between 1 and 31),
  is_recurring boolean not null default true,
  month_year text not null,
  is_paid boolean not null default false,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.monthly_expenses enable row level security;

create policy "Users manage own expenses"
  on public.monthly_expenses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'role', 'payer')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create table if not exists public.collector_properties (
  id uuid primary key default gen_random_uuid(),
  collector_id uuid not null references auth.users (id) on delete cascade,
  payer_id uuid unique references auth.users (id) on delete set null,
  invite_code text not null unique,
  property_name text not null,
  payer_name text,
  payer_email text,
  monthly_rent_qar numeric(12, 2) not null check (monthly_rent_qar > 0),
  due_day int not null check (due_day between 1 and 28),
  remaining_balance_qar numeric(12, 2) not null default 0 check (remaining_balance_qar >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists collector_properties_collector_idx
  on public.collector_properties (collector_id, created_at);

create index if not exists collector_properties_invite_code_idx
  on public.collector_properties (invite_code);

alter table public.collector_properties enable row level security;

create policy "Collectors manage own properties"
  on public.collector_properties for all
  using (auth.uid() = collector_id)
  with check (auth.uid() = collector_id);

create policy "Payers can read linked property"
  on public.collector_properties for select
  using (auth.uid() = payer_id);

create type public.payment_confirmation_status as enum ('submitted', 'received');

create table if not exists public.rent_payment_confirmations (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.collector_properties (id) on delete cascade,
  payer_id uuid not null references auth.users (id) on delete cascade,
  collector_id uuid not null references auth.users (id) on delete cascade,
  amount_qar numeric(12, 2) not null check (amount_qar > 0),
  month_year text not null,
  status public.payment_confirmation_status not null default 'submitted',
  submitted_at timestamptz not null default now(),
  received_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists rent_payment_confirmations_property_idx
  on public.rent_payment_confirmations (property_id, submitted_at desc);

create index if not exists rent_payment_confirmations_collector_idx
  on public.rent_payment_confirmations (collector_id, status, submitted_at desc);

alter table public.rent_payment_confirmations enable row level security;

create policy "Payers create and view own payment confirmations"
  on public.rent_payment_confirmations for select
  using (auth.uid() = payer_id);

create policy "Payers submit own payment confirmations"
  on public.rent_payment_confirmations for insert
  with check (auth.uid() = payer_id);

create policy "Collectors view own payment confirmations"
  on public.rent_payment_confirmations for select
  using (auth.uid() = collector_id);

create policy "Collectors mark payments received"
  on public.rent_payment_confirmations for update
  using (auth.uid() = collector_id)
  with check (auth.uid() = collector_id);

-- Payment history (Phase 3)
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

-- Category budgets (Phase 4)
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
