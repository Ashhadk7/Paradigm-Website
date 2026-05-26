-- Extend assistant stages to publish and restore CMS copy on every managed page.
-- Apply after 202605250002_agent_chat_sessions.sql.

alter table public.cms_agent_stages
  add column if not exists before_content jsonb,
  add column if not exists after_content jsonb;

alter table public.cms_agent_stages
  alter column before_settings drop not null,
  alter column after_settings drop not null;

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

  if p_page_key not in ('home', 'advisors', 'familyoffice', 'institutions', 'process', 'about')
    or char_length(trim(p_title)) not between 1 and 120
  then
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
  p_before_content jsonb,
  p_after_content jsonb,
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

  if char_length(trim(p_prompt)) not between 1 and 4000
    or (p_after_content is null and p_after_settings is null)
  then
    raise exception 'Invalid prompt stage' using errcode = '22023';
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
    before_content,
    after_content,
    before_settings,
    after_settings
  ) values (
    p_session_id,
    v_next_sequence,
    trim(p_prompt),
    coalesce(p_changes, '[]'::jsonb),
    p_before_content,
    p_after_content,
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

revoke all on function public.append_cms_agent_stage(uuid, text, jsonb, jsonb, jsonb, jsonb, jsonb) from public;
revoke execute on function public.append_cms_agent_stage(uuid, text, jsonb, jsonb, jsonb) from authenticated;
grant execute on function public.append_cms_agent_stage(uuid, text, jsonb, jsonb, jsonb, jsonb, jsonb) to authenticated;
