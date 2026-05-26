-- Store administrator-reviewed source-code change workflows.
-- Code generation and GitHub mutations run only through the trusted backend.

create table if not exists public.cms_code_change_requests (
  id uuid primary key default gen_random_uuid(),
  requested_by uuid not null references auth.users(id) on delete cascade,
  prompt text not null check (char_length(trim(prompt)) between 10 and 4000),
  scope text not null default 'website_ui',
  status text not null default 'requested' check (status in (
    'requested',
    'generating',
    'generation_failed',
    'preview_ready',
    'merge_ready',
    'merging',
    'merged',
    'rejected',
    'revert_preview_ready',
    'revert_ready',
    'reverting',
    'reverted'
  )),
  summary text,
  branch_name text,
  pull_request_number integer,
  pull_request_url text,
  preview_url text,
  base_sha text,
  head_sha text,
  changed_files jsonb not null default '[]'::jsonb,
  checks jsonb not null default '[]'::jsonb,
  merge_sha text,
  revert_branch_name text,
  revert_pull_request_number integer,
  revert_pull_request_url text,
  revert_head_sha text,
  revert_merge_sha text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.cms_code_change_requests enable row level security;

drop policy if exists "CMS admins can read code change requests" on public.cms_code_change_requests;
create policy "CMS admins can read code change requests"
  on public.cms_code_change_requests for select
  to authenticated
  using ((select public.is_cms_admin()));

revoke all on public.cms_code_change_requests from anon, authenticated;
grant select on public.cms_code_change_requests to authenticated;

create or replace function public.create_cms_code_change_request(p_prompt text)
returns public.cms_code_change_requests
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.cms_code_change_requests;
begin
  if not public.is_cms_admin() then
    raise exception 'CMS administrator access required' using errcode = '42501';
  end if;

  if char_length(trim(p_prompt)) not between 10 and 4000 then
    raise exception 'Describe a code change in at least 10 characters' using errcode = '22023';
  end if;

  insert into public.cms_code_change_requests (requested_by, prompt)
  values ((select auth.uid()), trim(p_prompt))
  returning * into v_request;

  return v_request;
end;
$$;

revoke all on function public.create_cms_code_change_request(text) from public;
grant execute on function public.create_cms_code_change_request(text) to authenticated;
