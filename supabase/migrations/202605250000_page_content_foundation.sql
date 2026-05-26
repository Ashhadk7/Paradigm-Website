-- Establish the CMS table for fresh Supabase projects and preview branches.
-- Existing projects keep their published JSON because rows are never replaced.

create table if not exists public.page_content (
  id bigint generated always as identity primary key,
  page_key text unique not null,
  content jsonb not null default '{}',
  updated_at timestamptz default now()
);

alter table public.page_content enable row level security;

drop policy if exists "Public can read content" on public.page_content;
create policy "Public can read content"
  on public.page_content for select
  using (true);

-- React page defaults render the initial website copy until an administrator
-- publishes custom fields. These keys also satisfy dependent foreign keys.
insert into public.page_content (page_key, content) values
  ('home', '{}'::jsonb),
  ('advisors', '{}'::jsonb),
  ('familyoffice', '{}'::jsonb),
  ('institutions', '{}'::jsonb),
  ('process', '{}'::jsonb),
  ('about', '{}'::jsonb)
on conflict (page_key) do nothing;
