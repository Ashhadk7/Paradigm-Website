# Paradigm — Google Re-Crawl Runbook

Companion to the client brief (*Google Search Indexing · SEO Meta Tags · Sitemap*, July 2026).

**Status: shipped and live.** The build is deployed to `www.paradigmasset.com` via
SSH (see Step 0). Verified live: real per-page HTML, correct favicon, apex→www
redirect, real 404s, robots.txt, sitemap.xml. Only Google Search Console remains,
and it needs the firm's Google account.

---

## Important: what the brief missed

The brief diagnosed the problem as "Google has not re-crawled." That was only
half of it.

Every page was serving crawlers an identical **1.3 KB empty shell** — same
`<title>`, zero body copy — because the site is a client-rendered React SPA on
static hosting. The meta tags the brief asked for were *already in the code*;
they just never reached Googlebot's first pass, since they're written by
JavaScript after load.

Had we only done the brief's five steps, we'd have asked Google to re-crawl
seven pages that all look blank and identical — which is worse than doing
nothing, because it replaces stale-but-real content with empty pages.

**This is now fixed.** Every page ships real HTML (18–26 KB) with correct title,
description, canonical, and full body copy baked in at build time.

Two further problems were found and fixed:

- **`paradigmasset.com` and `www.paradigmasset.com` both returned 200** with no
  redirect, so Google saw two competing copies of every page. Now a 301 to `www`.
- **Every unknown URL returned 200**, generating soft-404s that waste crawl
  budget. Now real 404s.

---

## Step 0 — Deploy the build to SiteGround  ✅ done

SiteGround does **not** auto-deploy from GitHub — pushing to `main` alone never
makes changes live. This is now deployed via SSH; **for future changes**, this is
the fast path (no zip/File Manager needed):

```bash
export SSHPASS='Mehroz1234##'
export RSYNC_RSH="sshpass -P passphrase -e ssh -i ~/.ssh/paradigm_siteground -p 18765 -o ConnectTimeout=25"
npm run build
rsync -az --delete --exclude 'frank.html' --exclude 'karlo.txt' \
  dist/ u2647-wszgeuthkbls@35.212.38.203:www/paradigmasset.com/public_html/
```

Notes:
- Connect by **IP** (`35.212.38.203`), not `ssh.paradigmasset.com` — that hostname
  doesn't resolve because the domain's nameservers are GoDaddy's, not SiteGround's.
- `frank.html` / `karlo.txt` are stray pre-existing test files in the docroot,
  excluded so `--delete` doesn't remove them.
- Back up first if it's been a while: `ssh ... 'tar czf ~/backup-$(date +%Y%m%d).tar.gz -C ~/www/paradigmasset.com public_html'`

Fallback (no SSH access): use `paradigm-site.zip` in the repo root via
**SiteGround → Site Tools → File Manager**, extract into `public_html`, and
confirm `.htaccess` made it — File Manager hides dotfiles by default, so enable
"show hidden files" or the www redirect and 404s silently won't work.

**Confirm it worked** — run these, or just load the URLs in a browser:

```bash
curl -s https://www.paradigmasset.com/robots.txt          # real robots.txt, not HTML
curl -s https://www.paradigmasset.com/sitemap.xml         # real XML, not HTML
curl -sL https://www.paradigmasset.com/about | grep -o '<title>[^<]*</title>'
# expect: About Paradigm Asset Management — Founded 1990
curl -sI https://paradigmasset.com/ | grep -i location    # expect a 301 to www
```

If `/about` still shows the generic "Paradigm Asset Management" title, the
upload didn't take or `.htaccess` is missing.

---

## Step 1 — Google Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console),
   signed in with **the firm's Google account** (not a personal one — James needs
   ongoing access).
2. **Add Property → URL prefix →** `https://www.paradigmasset.com`
3. Choose **HTML tag** verification. Google gives you a token.
4. Open `index.html` in the repo. Near the top of `<head>` is a commented slot:

   ```html
   <!-- <meta name="google-site-verification" content="PASTE_TOKEN_HERE" /> -->
   ```

   Uncomment it, paste the token, then `npm run build` and re-upload (Step 0).
5. Back in Search Console, click **Verify**.

*Alternative:* DNS TXT-record verification at the registrar avoids a rebuild. If
you have registrar access, it's the faster path.

Also add `https://paradigmasset.com` (no www) as a second property so the
redirect is visible to Google — optional but useful.

---

## Step 2 — Submit the sitemap

Search Console → **Sitemaps** → enter `sitemap.xml` → **Submit**.
Status should read *Success* within minutes.

The sitemap is generated automatically at build time from the route list, so it
can't drift out of sync with the site. It contains the seven public pages from
the brief. `/legal` is deliberately excluded from the sitemap (but still
crawlable), as is the `/familyoffices` alias, which would otherwise compete with
`/familyoffice` as a duplicate.

---

## Step 3 — Request indexing

Search Console → **URL inspection** (top search bar) → paste each URL →
**Request Indexing**. One at a time; there's a daily quota, so if it stops you,
finish the rest tomorrow.

```
https://www.paradigmasset.com/
https://www.paradigmasset.com/advisors
https://www.paradigmasset.com/familyoffice
https://www.paradigmasset.com/institutions
https://www.paradigmasset.com/process
https://www.paradigmasset.com/about
https://www.paradigmasset.com/contact
```

Before requesting, use the inspection tool's **View Crawled Page** to confirm
Google sees real content. If it shows an empty shell, Step 0 didn't take —
stop and fix that first, or you'll burn the indexing quota on blank pages.

---

## Step 4 — Meta titles and descriptions  ✅ done

Implemented verbatim from the brief's table, in `src/lib/seo.js`. Nothing to do.

**One note for the client:** two entries exceed Google's display width and will
be visibly truncated in results:

- **Home title** — 63 chars (Google shows ~60): *"…Collective Intelligence Portfolio Platform"*
- **About description** — ~175 chars (Google shows ~160)

Harmless, and they don't affect ranking. I left the approved copy exactly as
written rather than silently editing it. Trimming Home's title to
`Paradigm Asset Management — Collective Intelligence Platform` (59) would
display in full, if James wants that.

---

## Step 5 — robots.txt  ✅ done

Exactly as specified, at `public/robots.txt`, disallowing `/admin` and
`/private` and pointing at the sitemap.

---

## Timeline

| When | What |
|---|---|
| Immediately | Sitemap shows *Success* in Search Console |
| 24–72 hours | Crawling begins; new content starts appearing |
| 1–2 weeks | All pages re-indexed with new titles and descriptions |
| Ongoing | Monitor impressions, clicks, average position weekly |

The old content will keep showing until Google re-crawls. That's normal and not
a sign anything is wrong.

---

## For future development

`npm run build` now runs the prerender automatically — no extra step, but the
build takes ~15s longer and needs Chrome (bundled via the `puppeteer`
devDependency).

**Adding a new public page?** Add it to the router *and* to `SEO` in
`src/lib/seo.js`. It's then prerendered, canonicalised, and added to the sitemap
automatically.

`npm run build:nossr` does a plain Vite build without prerendering, for quick
local checks.

The build fails loudly rather than shipping a page with a missing or wrong
canonical — this caught a real bug during development where every page inherited
the homepage's canonical, which would have told Google to drop six pages from
the index.
