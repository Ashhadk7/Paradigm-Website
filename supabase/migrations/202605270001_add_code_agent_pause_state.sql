-- Add a paused state so admins can suspend a code-change request and resume it later.

alter table public.cms_code_change_requests
  add column if not exists paused_from_status text;

alter table public.cms_code_change_requests
  drop constraint if exists cms_code_change_requests_status_check;

alter table public.cms_code_change_requests
  add constraint cms_code_change_requests_status_check
  check (status in (
    'requested',
    'paused',
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
  ));
