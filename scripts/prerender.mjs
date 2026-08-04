/**
 * Post-build prerender.
 *
 * The site is a client-rendered SPA on static Apache hosting (SiteGround), so
 * crawlers were served a ~1.3 KB empty shell with an identical <title> on every
 * URL. This script boots the built app in headless Chrome, waits for React and
 * Helmet to settle, and writes real HTML per route into dist/.
 *
 * Page copy is safe to snapshot because every page defines hardcoded fallback
 * text with Supabase CMS values as an override (`cms?.x || "default"`). The
 * snapshot captures the approved fallback copy with no network access; the CMS
 * still overrides it in the browser after hydration.
 *
 * Also emits sitemap.xml from the same route list so the two cannot drift.
 *
 * Run: node scripts/prerender.mjs   (wired into `npm run build`)
 */
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { PRERENDER_ROUTES, SITEMAP_ROUTES, canonicalFor } from '../src/lib/seo.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.json': 'application/json', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.txt': 'text/plain', '.xml': 'application/xml',
};

// Minimal static server that mimics the SPA fallback in .htaccess.
//
// `shell` is the pristine post-Vite index.html held in memory. Every SPA
// fallback serves THAT rather than reading dist/index.html from disk — once we
// write the homepage snapshot, the on-disk file carries the homepage's title,
// description and canonical, and every later route would inherit them and end
// up canonicalised to "/". Serving the in-memory shell keeps runs hermetic and
// makes the build idempotent.
function serveDist(shell) {
  return createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const filePath = join(DIST, urlPath);
      if (!filePath.startsWith(DIST)) {
        res.writeHead(403).end('forbidden');
        return;
      }
      if (!existsSync(filePath) || !extname(filePath)) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(shell); // SPA fallback — always the clean shell
        return;
      }
      const body = await readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(500).end('error');
    }
  });
}

function buildSitemap() {
  const urls = SITEMAP_ROUTES.map(
    (route) => `  <url>\n    <loc>${canonicalFor(route)}</loc>\n  </url>`
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    throw new Error('dist/index.html missing — run `vite build` first.');
  }

  // Read the pristine shell BEFORE any snapshot overwrites dist/index.html.
  const shell = await readFile(join(DIST, 'index.html'), 'utf8');
  if (/rel="canonical"/.test(shell)) {
    throw new Error('dist/index.html already contains a canonical tag — stale build, run a clean `vite build`.');
  }

  const server = serveDist(shell);
  await new Promise((resolve) => server.listen(0, resolve));
  const { port } = server.address();
  const origin = `http://127.0.0.1:${port}`;

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let failures = 0;
  // Snapshots are buffered and flushed only after every route succeeds, so a
  // mid-run failure never leaves dist/ in a half-prerendered state.
  const snapshots = [];
  try {
    for (const route of PRERENDER_ROUTES) {
      const page = await browser.newPage();
      // Block Supabase/analytics so the snapshot is deterministic and offline-safe.
      await page.setRequestInterception(true);
      page.on('request', (r) => {
        const url = r.url();
        if (url.startsWith(origin)) r.continue();
        else r.abort();
      });

      try {
        await page.goto(`${origin}${route}`, { waitUntil: 'networkidle0', timeout: 45000 });
        // Wait for Helmet to write a route-specific title.
        await page.waitForFunction(
          () => document.title && document.title !== 'Paradigm Asset Management',
          { timeout: 15000 }
        ).catch(() => {});
        await page.waitForFunction(
          () => document.querySelector('#root')?.children.length > 0,
          { timeout: 15000 }
        );

        let html = await page.content();

        // Strip transient framer-motion inline styles that start elements hidden;
        // without this, crawlers can see opacity:0 content as cloaked/invisible.
        html = html.replace(/(<[^>]+style="[^"]*?)opacity:\s*0(;?)/g, '$1opacity:1$2');

        // Guard against the whole class of "every page got the homepage's tags"
        // bugs: exactly one description and one canonical, pointing at THIS route.
        const canonicals = html.match(/<link[^>]+rel="canonical"[^>]*>/g) || [];
        const descriptions = html.match(/<meta[^>]+name="description"[^>]*>/g) || [];
        const expected = canonicalFor(route);
        if (canonicals.length !== 1) {
          throw new Error(`expected 1 canonical, found ${canonicals.length}`);
        }
        if (descriptions.length !== 1) {
          throw new Error(`expected 1 description, found ${descriptions.length}`);
        }
        if (!canonicals[0].includes(`href="${expected}"`)) {
          throw new Error(`canonical points elsewhere: ${canonicals[0]}`);
        }

        const outDir = route === '/' ? DIST : join(DIST, route);
        await mkdir(outDir, { recursive: true });
        snapshots.push({ file: join(outDir, 'index.html'), html, outDir });

        const title = await page.title();
        const bytes = Buffer.byteLength(html);
        console.log(`✓ ${route.padEnd(16)} ${String(Math.round(bytes / 1024)).padStart(4)} KB  ${title.slice(0, 60)}`);
      } catch (err) {
        failures++;
        console.error(`✗ ${route} — ${err.message}`);
      } finally {
        await page.close();
      }
    }

    if (failures) {
      throw new Error(`${failures} route(s) failed to prerender — not shipping a partial build.`);
    }

    // All routes rendered cleanly — flush snapshots to disk.
    for (const { file, html } of snapshots) {
      await writeFile(file, html);
    }

    // Static 404 page served by Apache's ErrorDocument for unknown paths.
    const notFoundPage = await browser.newPage();
    await notFoundPage.setRequestInterception(true);
    notFoundPage.on('request', (r) => (r.url().startsWith(origin) ? r.continue() : r.abort()));
    await notFoundPage.goto(`${origin}/__404__`, { waitUntil: 'networkidle0', timeout: 45000 });
    await notFoundPage.waitForFunction(
      () => document.querySelector('#root')?.children.length > 0,
      { timeout: 15000 }
    );
    let notFoundHtml = await notFoundPage.content();
    notFoundHtml = notFoundHtml.replace(/(<[^>]+style="[^"]*?)opacity:\s*0(;?)/g, '$1opacity:1$2');
    await writeFile(join(DIST, '404.html'), notFoundHtml);
    await notFoundPage.close();
    console.log('✓ 404.html');

    await writeFile(join(DIST, 'sitemap.xml'), buildSitemap());
    console.log(`✓ sitemap.xml    ${SITEMAP_ROUTES.length} URLs`);
  } finally {
    await browser.close();
    server.close();
  }

  if (failures) {
    throw new Error(`${failures} route(s) failed to prerender — not shipping a partial build.`);
  }
}

main().catch((err) => {
  console.error(`\nPrerender failed: ${err.message}`);
  process.exit(1);
});
