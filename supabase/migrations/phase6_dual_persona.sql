-- Phase 6: dual personas (payer + collector), invite linking, and payment confirmations

alter table public.profiles
  add column if not exists role text not null default 'payer' check (role in ('payer', 'collector')),
  add column if not exists trial_started_at timestamptz not null default now(),
  add column if not exists trial_ends_at timestamptz not null default (now() + interval '14 days'),
  add column if not exists collector_plan text not null default 'starter' check (collector_plan in ('starter', 'growth', 'custom'));

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

do $$
begin
  if not exists (
    select 1 from pg_type where typname = 'payment_confirmation_status'
  ) then
    create type public.payment_confirmation_status as enum ('submitted', 'received');
  end if;
end $$;

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
