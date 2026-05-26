# Code Change Agent Setup

The Code Change mode is separate from Quick CMS Edit. Quick CMS Edit publishes
validated Supabase content/settings. Code Change creates reviewed GitHub pull
requests for React/CSS structure or design work.

## Safety Boundary

- The browser never receives OpenAI, GitHub, or Supabase service-role secrets.
- All `/api/code-agent/*` routes validate the signed-in user with Supabase and
  require `is_cms_admin()` before taking action.
- Generated changes can only modify website-facing `src` JS/JSX/CSS files
  outside `src/pages/admin` and `src/lib`, or safe text assets under `public`.
- Generated changes cannot edit API routes, authorization, Supabase migrations,
  environment files, packages, CI, or the agent approval UI.
- A generated branch does not change production. Merge and rollback merge each
  require an explicit administrator action after checks pass.

## Workflow

1. The admin submits a request in **Code Change**. Status is `Requested`.
2. **Approve and generate preview** calls the backend, which asks OpenAI for
   structured full-file replacements and validates every target path.
3. The backend commits the validated files to an `agent/*` GitHub branch and
   opens a pull request against `main`.
4. GitHub Actions runs `npm run lint` and `npm run build`; Vercel creates the
   pull-request preview deployment through its GitHub integration.
5. **Refresh checks** marks the request ready only when `Build and lint` and a
   Vercel check have succeeded.
6. **Approve and merge** squash-merges the pull request into `main`.
7. After publication, **Create rollback preview** creates a new pull request
   restoring every changed file to its pre-agent blob. It is checked and merged
   through the same approval flow.

## Database Migration

After this code is committed and Supabase Preview succeeds, run this new
migration once in the live Supabase SQL Editor:

```text
supabase/migrations/202605260001_code_change_agent.sql
```

It creates `cms_code_change_requests`, readable only by CMS admins, while
server mutations use the Vercel-only service-role key after administrator
authentication is checked.

## GitHub App

Create a GitHub App installed only on `Ashhadk7/Paradigm-Website` with:

- Repository contents: Read and write
- Pull requests: Read and write
- Checks: Read-only
- Commit statuses: Read-only
- Metadata: Read-only

Record the App ID, installation ID, and generated private key as Vercel
server-only environment variables. A fine-grained token can be used for local
testing, but the GitHub App is the intended production credential.

## Vercel Environment Variables

Add values listed in `server.env.example` to Vercel project settings for
Production and Preview deployments. Keep the existing browser-safe
`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` values.

Keep `VITE_ENABLE_CODE_AGENT=false` during the initial deployment. After the
live database migration and server-only secrets are configured, set
`VITE_ENABLE_CODE_AGENT=true` and redeploy to expose the Code Change mode to
administrators.

After adding or changing Vercel environment variables, redeploy; environment
changes do not apply to already-created deployments.

## OpenAI Contract

The backend calls the Responses API with Structured Outputs. The model returns
only:

```json
{
  "summary": "Description of the proposed website update.",
  "changes": [
    {
      "path": "src/components/Navbar.jsx",
      "content": "Complete replacement file contents",
      "reason": "Why this file changes"
    }
  ]
}
```

The server independently rejects protected paths, duplicate paths, empty
change lists, and oversized output before a GitHub branch is created.

## Local Verification

Frontend verification works with:

```bash
npm run lint
npm run build
```

Testing the server routes locally requires Vercel Functions plus configured
server secrets, for example using `vercel dev`. GitHub branch creation and
OpenAI generation are intentionally unavailable without those credentials.
