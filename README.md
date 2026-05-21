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
│   ├── favicon.svg
│   └── icons.svg
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

Implemented CMS pages:

- Home
- For Advisors
- For Family Offices
- For Institutions
- Our Process
- About

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

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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
