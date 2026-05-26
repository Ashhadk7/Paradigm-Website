-- Persist CMS assistant conversations and the reversible state of applied prompts.
-- Apply after 202605250001_secure_cms_foundation.sql.

create table if not exists public.cms_agent_sessions (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users(id) on delete cascade,
  page_key text not null default 'home',
  title text not null check (char_length(title) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cms_agent_stages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.cms_agent_sessions(id) on delete cascade,
  sequence_number integer not null,
  prompt text not null check (char_length(prompt) between 1 and 4000),
  changes jsonb not null default '[]'::jsonb,
  before_settings jsonb not null,
  after_settings jsonb not null,
  status text not null default 'applied' check (status in ('applied', 'reverted')),
  created_at timestamptz not null default now(),
  reverted_at timestamptz,
  unique (session_id, sequence_number)
);

alter table public.cms_agent_sessions enable row level security;
alter table public.cms_agent_stages enable row level security;

drop policy if exists "CMS admins can read own assistant sessions" on public.cms_agent_sessions;
create policy "CMS admins can read own assistant sessions"
  on public.cms_agent_sessions for select
  to authenticated
  using (owner_user_id = (select auth.uid()) and (select public.is_cms_admin()));

drop policy if exists "CMS admins can read own assistant stages" on public.cms_agent_stages;
create policy "CMS admins can read own assistant stages"
  on public.cms_agent_stages for select
  to authenticated
  using (
    (select public.is_cms_admin())
    and exists (
      select 1
      from public.cms_agent_sessions session
      where session.id = session_id
        and session.owner_user_id = (select auth.uid())
    )
  );

grant select on public.cms_agent_sessions, public.cms_agent_stages to authenticated;

create or replace function public.create_cms_agent_session(
  p_title text,
  p_page_key text default 'home'
)
returns public.cms_agent_sessions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_session public.cms_agent_sessions;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;

  if p_page_key <> 'home' or char_length(trim(p_title)) not between 1 and 120 then
    raise exception 'Invalid assistant session details' using errcode = '22023';
  end if;

  insert into public.cms_agent_sessions (owner_user_id, page_key, title)
  values ((select auth.uid()), p_page_key, trim(p_title))
  returning * into v_session;

  return v_session;
end;
$$;

create or replace function public.append_cms_agent_stage(
  p_session_id uuid,
  p_prompt text,
  p_changes jsonb,
  p_before_settings jsonb,
  p_after_settings jsonb
)
returns public.cms_agent_stages
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next_sequence integer;
  v_stage public.cms_agent_stages;
begin
  if not public.is_cms_admin()
    or not exists (
      select 1 from public.cms_agent_sessions
      where id = p_session_id and owner_user_id = (select auth.uid())
    )
  then
    raise exception 'Assistant session access required' using errcode = '42501';
  end if;

  if char_length(trim(p_prompt)) not between 1 and 4000 then
    raise exception 'Invalid prompt' using errcode = '22023';
  end if;

  select coalesce(max(sequence_number), 0) + 1
    into v_next_sequence
    from public.cms_agent_stages
    where session_id = p_session_id;

  insert into public.cms_agent_stages (
    session_id,
    sequence_number,
    prompt,
    changes,
    before_settings,
    after_settings
  ) values (
    p_session_id,
    v_next_sequence,
    trim(p_prompt),
    coalesce(p_changes, '[]'::jsonb),
    p_before_settings,
    p_after_settings
  )
  returning * into v_stage;

  update public.cms_agent_sessions
  set updated_at = now()
  where id = p_session_id;

  return v_stage;
end;
$$;

create or replace function public.revert_cms_agent_stages(
  p_session_id uuid,
  p_from_sequence integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_cms_admin()
    or not exists (
      select 1 from public.cms_agent_sessions
      where id = p_session_id and owner_user_id = (select auth.uid())
    )
  then
    raise exception 'Assistant session access required' using errcode = '42501';
  end if;

  update public.cms_agent_stages
  set status = 'reverted',
      reverted_at = now()
  where session_id = p_session_id
    and sequence_number >= p_from_sequence
    and status = 'applied';

  update public.cms_agent_sessions
  set updated_at = now()
  where id = p_session_id;
end;
$$;

revoke all on function public.create_cms_agent_session(text, text) from public;
revoke all on function public.append_cms_agent_stage(uuid, text, jsonb, jsonb, jsonb) from public;
revoke all on function public.revert_cms_agent_stages(uuid, integer) from public;

grant execute on function public.create_cms_agent_session(text, text) to authenticated;
grant execute on function public.append_cms_agent_stage(uuid, text, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.revert_cms_agent_stages(uuid, integer) to authenticated;
