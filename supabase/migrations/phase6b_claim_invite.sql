-- Fix invite linking: payers cannot see/update unlinked properties under RLS.
-- Use a security-definer RPC so payers can claim by invite code safely.

create or replace function public.claim_property_invite(p_invite_code text)
returns public.collector_properties
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_role text;
  v_full_name text;
  v_email text;
  v_property public.collector_properties;
begin
  if v_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select role, full_name, email
    into v_role, v_full_name, v_email
  from public.profiles
  where id = v_user_id;

  if v_role is distinct from 'payer' then
    raise exception 'Only payers can connect with an invite code';
  end if;

  if exists (
    select 1 from public.collector_properties where payer_id = v_user_id
  ) then
    raise exception 'You are already linked to a collector property';
  end if;

  select *
    into v_property
  from public.collector_properties
  where upper(invite_code) = upper(trim(p_invite_code))
  for update;

  if not found then
    raise exception 'Invite code not found';
  end if;

  if v_property.payer_id is not null then
    raise exception 'This invite code has already been used';
  end if;

  update public.collector_properties
  set
    payer_id = v_user_id,
    payer_name = coalesce(v_full_name, payer_name),
    payer_email = coalesce(v_email, payer_email)
  where id = v_property.id
  returning * into v_property;

  return v_property;
end;
$$;

revoke all on function public.claim_property_invite(text) from public;
grant execute on function public.claim_property_invite(text) to authenticated;
