-- Add controlled global navigation/footer content and shell palette choices.
-- Apply after 202605250003_agent_content_checkpoints.sql.

insert into public.page_content (page_key, content) values
('site', '{
  "brand_name": "PARADIGM",
  "brand_descriptor": "Asset Management",
  "nav_institutions": "For Institutions",
  "nav_process": "Our Process",
  "nav_about": "About",
  "nav_contact": "Contact",
  "footer_strategies": "Strategies",
  "footer_process": "Process",
  "footer_team": "Team",
  "footer_legal": "Legal",
  "footer_contact": "Contact",
  "footer_copyright": "Copyright 2026 Paradigm Asset Management Co. LLC",
  "direct_email": "jef@paradigmasset.com",
  "direct_phone": "212.771.6100"
}'::jsonb)
on conflict (page_key) do nothing;

insert into public.page_presentation (page_key, settings) values
('site', '{
  "shell_tone": "navy",
  "shell_accent": "gold"
}'::jsonb)
on conflict (page_key) do nothing;

create or replace function public.save_page_presentation(
  p_page_key text,
  p_settings jsonb
)
returns public.page_presentation
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before jsonb;
  v_saved public.page_presentation;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;

  if p_page_key = 'home' then
    if p_settings is null
      or (p_settings - array[
        'hero_density',
        'hero_headline_width',
        'hero_headline_scale',
        'trust_band_density'
      ]) <> '{}'::jsonb
      or coalesce(p_settings->>'hero_density', '') not in ('compact', 'balanced', 'spacious')
      or coalesce(p_settings->>'hero_headline_width', '') not in ('tight', 'standard', 'wide')
      or coalesce(p_settings->>'hero_headline_scale', '') not in ('compact', 'standard', 'prominent')
      or coalesce(p_settings->>'trust_band_density', '') not in ('compact', 'balanced', 'spacious')
    then
      raise exception 'Unsupported page presentation settings' using errcode = '22023';
    end if;
  elsif p_page_key = 'site' then
    if p_settings is null
      or (p_settings - array['shell_tone', 'shell_accent']) <> '{}'::jsonb
      or coalesce(p_settings->>'shell_tone', '') not in ('navy', 'charcoal', 'forest')
      or coalesce(p_settings->>'shell_accent', '') not in ('gold', 'copper', 'sage')
    then
      raise exception 'Unsupported site shell settings' using errcode = '22023';
    end if;
  else
    raise exception 'Unsupported page presentation target' using errcode = '22023';
  end if;

  select settings into v_before
    from public.page_presentation
    where page_key = p_page_key;

  insert into public.page_presentation (page_key, settings, updated_at)
  values (p_page_key, p_settings, now())
  on conflict (page_key) do update
    set settings = excluded.settings,
        updated_at = excluded.updated_at
  returning * into v_saved;

  insert into public.cms_change_log (
    actor_user_id,
    action,
    resource_type,
    page_key,
    before_data,
    after_data
  ) values (
    (select auth.uid()),
    'presentation.save',
    'page_presentation',
    p_page_key,
    v_before,
    p_settings
  );

  return v_saved;
end;
$$;

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

  if p_page_key not in ('site', 'home', 'advisors', 'familyoffice', 'institutions', 'process', 'about')
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
