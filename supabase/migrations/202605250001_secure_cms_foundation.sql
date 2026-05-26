-- Secure the CMS write path and record every content publication.
-- Run this migration after the existing page_content table has been created.

create table if not exists public.cms_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.cms_admins enable row level security;

create or replace function public.is_cms_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.cms_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_cms_admin() from public;
grant execute on function public.is_cms_admin() to authenticated;

create table if not exists public.cms_change_log (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid not null references auth.users(id),
  action text not null check (action in ('content.save', 'presentation.save')),
  resource_type text not null check (resource_type in ('page_content', 'page_presentation')),
  page_key text not null,
  before_data jsonb,
  after_data jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.cms_change_log enable row level security;

drop policy if exists "CMS admins can read audit log" on public.cms_change_log;
create policy "CMS admins can read audit log"
  on public.cms_change_log for select
  to authenticated
  using ((select public.is_cms_admin()));

drop policy if exists "Admin can update content" on public.page_content;
drop policy if exists "Admin can insert content" on public.page_content;
drop policy if exists "CMS admins can update content" on public.page_content;
drop policy if exists "CMS admins can insert content" on public.page_content;

create policy "CMS admins can update content"
  on public.page_content for update
  to authenticated
  using ((select public.is_cms_admin()))
  with check ((select public.is_cms_admin()));

create policy "CMS admins can insert content"
  on public.page_content for insert
  to authenticated
  with check ((select public.is_cms_admin()));

create or replace function public.save_page_content(
  p_page_key text,
  p_content jsonb
)
returns public.page_content
language plpgsql
security definer
set search_path = public
as $$
declare
  v_before jsonb;
  v_saved public.page_content;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required'
      using errcode = '42501';
  end if;

  select content
    into v_before
    from public.page_content
    where page_key = p_page_key;

  insert into public.page_content (page_key, content, updated_at)
    values (p_page_key, p_content, now())
    on conflict (page_key) do update
      set content = excluded.content,
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
    'content.save',
    'page_content',
    p_page_key,
    v_before,
    p_content
  );

  return v_saved;
end;
$$;

revoke all on function public.save_page_content(text, jsonb) from public;
grant execute on function public.save_page_content(text, jsonb) to authenticated;

create table if not exists public.page_presentation (
  page_key text primary key references public.page_content(page_key) on delete cascade,
  settings jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.page_presentation enable row level security;

drop policy if exists "Public can read presentation" on public.page_presentation;
create policy "Public can read presentation"
  on public.page_presentation for select
  using (true);

drop policy if exists "CMS admins can update presentation" on public.page_presentation;
create policy "CMS admins can update presentation"
  on public.page_presentation for update
  to authenticated
  using ((select public.is_cms_admin()))
  with check ((select public.is_cms_admin()));

drop policy if exists "CMS admins can insert presentation" on public.page_presentation;
create policy "CMS admins can insert presentation"
  on public.page_presentation for insert
  to authenticated
  with check ((select public.is_cms_admin()));

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
    raise exception 'CMS administrator access required'
      using errcode = '42501';
  end if;

  if p_page_key <> 'home'
    or p_settings is null
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
    raise exception 'Unsupported page presentation settings'
      using errcode = '22023';
  end if;

  select settings
    into v_before
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

revoke all on function public.save_page_presentation(text, jsonb) from public;
grant execute on function public.save_page_presentation(text, jsonb) to authenticated;

insert into public.page_presentation (page_key, settings)
values (
  'home',
  '{
    "hero_density": "balanced",
    "hero_headline_width": "standard",
    "hero_headline_scale": "standard",
    "trust_band_density": "balanced"
  }'::jsonb
)
on conflict (page_key) do nothing;

-- Bootstrap the existing admin account when it already exists in Supabase Auth.
insert into public.cms_admins (user_id)
select id
from auth.users
where lower(email) = lower('admin@paradigmasset.com')
on conflict (user_id) do nothing;
