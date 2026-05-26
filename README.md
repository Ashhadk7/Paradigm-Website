# Paradigm Asset Management Website

Production marketing website and lightweight CMS for Paradigm Asset Management Co. LLC.

The site presents Paradigm's collective intelligence investment process across advisor, family office, institutional, process, and firm-story pages. Content is managed through a protected `/admin` dashboard backed by Supabase.

## Overview

Paradigm is a React single-page application built with Vite. It combines a polished institutional marketing site with an internal CMS so page copy can be updated without code changes.

Core capabilities:

- Public marketing pages for all primary audiences
- Supabase-backed page content CMS
- Protected admin dashboard at `/admin`
- Section-based CMS editing for every major page
- Real-time local content refresh after CMS saves
- Responsive navigation, animated heroes, and editorial page sections
- Vercel-ready SPA routing via `public/_redirects` and `vercel.json`

## Tech Stack

| Area | Technology |
| --- | --- |
| Frontend | React 19, Vite |
| Routing | React Router |
| CMS/Data | Supabase |
| Animation | Framer Motion |
| SEO | React Helmet Async |
| Icons | Lucide React |
| Styling | Tailwind CSS import plus custom CSS and inline component styles |
| Visuals | Three.js / custom GLSL hills background |

## Project Structure

```text
.
├── public/
│   ├── _redirects
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CTAStrip.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProofBlock.jsx
│   │   └── ui/
│   │       └── glsl-hills.jsx
│   ├── lib/
│   │   ├── supabase.js
│   │   └── useContent.js
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Advisors.jsx
│   │   ├── Contact.jsx
│   │   ├── FamilyOffice.jsx
│   │   ├── Home.jsx
│   │   ├── Institutions.jsx
│   │   ├── Legal.jsx
│   │   ├── Process.jsx
│   │   └── admin/
│   │       ├── Admin.jsx
│   │       ├── AdminDashboard.jsx
│   │       └── AdminLogin.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── supabase-setup.sql
├── package.json
├── vite.config.js
└── vercel.json
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Homepage, market intelligence narrative, proof, and CTAs |
| `/advisors` | Wealth advisor and independent RIA pitch |
| `/familyoffice` | Multi-family office and OCIO pitch |
| `/familyoffices` | Alias for `/familyoffice` |
| `/institutions` | Institutional investors and strategic partners |
| `/process` | Investment process and Active Market Data methodology |
| `/about` | Firm story, James Francis profile, team, advisory board |
| `/contact` | Inquiry and contact page |
| `/legal` | Disclosures and legal copy |
| `/admin` | Protected CMS dashboard |

## CMS Architecture

The CMS uses a `page_content` table in Supabase. Each page stores a JSON `content` object keyed by `page_key`.

CMS publishing is restricted through a `cms_admins` allowlist. Saves use the
`save_page_content` database function so the content mutation and its
`cms_change_log` audit record succeed or fail together.

Allowlisted appearance controls are stored separately in `page_presentation`.
The homepage supports hero/trust-band layout controls. The shared `Site Shell`
surface supports navigation/footer tone and accent selections. Unsupported
settings are rejected in the database.

The assistant converts quoted copy replacement requests on any configured CMS
page into reviewable content changes, and converts supported Home/Site Shell
style requests into reviewable presentation changes. It publishes only after
administrator approval. It does not yet call a model or rewrite source code.

The assistant is opened from a prominent lower-right Design Assistant control.
It provides saved conversations, a review-first edit timeline, and a restore
action under every published request. Each restore publishes the content and
presentation snapshot from immediately before that request and marks later
active stages as reverted.

Implemented CMS pages:

- Home
- For Advisors
- For Family Offices
- For Institutions
- Our Process
- About
- Site Shell (shared navigation and footer)

The admin dashboard groups fields by the same section order used on the public website. Section navigation highlights the section currently in view and scrolls within the dashboard without changing section-specific URL hashes.

Content flow:

1. Public pages call `useContent(pageKey)`.
2. `useContent` reads from Supabase and caches page content in memory.
3. Admin saves write the updated JSON content to Supabase.
4. `publishContentUpdate` updates the local cache and broadcasts the change to mounted pages and other open tabs.

## Supabase Setup

The Supabase schema is provided in:

```text
supabase-setup.sql
```

For a fresh Supabase project or Supabase Preview branch, migrations run in
order and begin with the `page_content` foundation:

```text
supabase/migrations/202605250000_page_content_foundation.sql
supabase/migrations/202605250001_secure_cms_foundation.sql
supabase/migrations/202605250002_agent_chat_sessions.sql
supabase/migrations/202605250003_agent_content_checkpoints.sql
supabase/migrations/202605250004_site_shell_controls.sql
```

For an existing Supabase project that already has `page_content`, apply:

```text
supabase/migrations/202605250001_secure_cms_foundation.sql
supabase/migrations/202605250002_agent_chat_sessions.sql
supabase/migrations/202605250003_agent_content_checkpoints.sql
supabase/migrations/202605250004_site_shell_controls.sql
```

The migration automatically authorizes the existing
`admin@paradigmasset.com` Auth user if that account already exists. If the
account is created after the migration, authorize it once from the SQL
Editor:

```sql
insert into public.cms_admins (user_id)
select id
from auth.users
where lower(email) = lower('admin@paradigmasset.com')
on conflict (user_id) do nothing;
```

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Only those public Supabase browser values go into the Vite app `.env`.
OpenAI integration should be added through a server-side Supabase Edge
Function; never expose an OpenAI key through a `VITE_*` variable. The intended
request/validation flow is documented in:

```text
docs/openai-cms-assistant.md
```

Image uploads use the Supabase storage bucket named:

```text
images
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run ESLint:

```bash
npm run lint
```

## Deployment

The app is ready for Vercel or any static host that supports SPA fallbacks.

Build output:

```text
dist/
```

Vercel config:

```text
vercel.json
```

Static redirect fallback:

```text
public/_redirects
```

## Development Notes

- Public page copy is preserved as fallback values in each page component and in admin defaults.
- The admin dashboard should not change client-provided copy unless an authenticated admin edits and saves content.
- CMS page hashes are page-level only, such as `/admin#home` or `/admin#about`; section scrolling does not mutate the URL.
- The shared `HeroSection` handles animated public-page heroes for Home, Advisors, Family Office, and Institutions.
- Process and About use custom staggered hero layouts.

## Verification

Before pushing changes, run:

```bash
npm run build
```

For focused checks during CMS work:

```bash
npx eslint src/pages/admin/AdminDashboard.jsx
```
