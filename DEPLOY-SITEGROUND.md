# Deploying to SiteGround

This is a Vite single-page app. SiteGround serves static files, so you build
the site locally and upload the `dist/` folder. There is **no server-side build
or env on SiteGround** — all `VITE_*` values are baked in at build time.

## One-time setup

1. Gather the real env values (from the client / Vercel project settings):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (CMS + live content)
   - `VITE_KLAVIYO_PUBLIC_KEY`, `VITE_KLAVIYO_LIST_ID` (Book-a-Call popup)
2. Create the production env file:
   ```bash
   cp .env.production.example .env.production
   # edit .env.production and paste the real values
   ```
   `.env.production` is gitignored — it never gets committed.

## Build

```bash
npm install        # first time only
npm run build      # outputs to dist/
```

`dist/` will contain `index.html`, `assets/`, all images, and `.htaccess`
(the `.htaccess` enables SPA routing + caching on Apache and is copied
automatically from `public/`).

> Tip: file managers sometimes hide dotfiles — make sure `.htaccess` actually
> gets uploaded. If deep links 404, a missing `.htaccess` is the usual cause.

## Upload

Upload **the contents of `dist/`** (not the folder itself) into the site's
document root on SiteGround:

- Root domain → `public_html/`
- Subdomain → that subdomain's document root

Use **SiteGround Site Tools → File Manager** (zip `dist/`, upload, extract) or
**SFTP** (credentials in Site Tools → Devs → SFTP). Replace existing files.

## Verify

- Home loads at the domain root.
- Navigate to `/process`, `/about`, then **refresh** — should NOT 404
  (confirms `.htaccess` is working).
- Open a "Book a 20-Minute Call" button → popup appears.

## Notes / caveats

- **Served from a subfolder** (e.g. `domain.com/paradigm/`)? Set
  `base: '/paradigm/'` in `vite.config.js` and rebuild, otherwise asset paths
  (which are absolute, `/assets/...`) will 404.
- **Updates are manual**: rebuild locally and re-upload `dist/` each change.
  (On Vercel, `git push` auto-deploys — SiteGround has no Git CI by default.)
- The public pages render with **default copy** even if Supabase is absent, so
  the marketing site is safe to ship without CMS keys; only `/admin` needs them.
