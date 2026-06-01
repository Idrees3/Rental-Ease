-- Phase 5: notification preferences (run once in Supabase SQL Editor)

alter table public.profiles
  add column if not exists push_enabled boolean not null default false,
  add column if not exists email_reminders boolean not null default true;
