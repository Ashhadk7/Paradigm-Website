import { Helmet } from 'react-helmet-async';
import { SEO, canonicalFor, SITE_ORIGIN } from '../lib/seo';

/**
 * Per-page SEO head tags: title, description, canonical, Open Graph, Twitter.
 *
 * Copy comes from src/lib/seo.js (the client-approved brief). Pass `path` and
 * the right metadata is looked up; `title`/`description` props override only
 * when a page needs something bespoke.
 *
 * These tags are baked into static HTML at build time by scripts/prerender.mjs,
 * so crawlers see them without executing JavaScript.
 */
export default function Seo({ path, title, description, image = '/logo.png' }) {
  const entry = SEO[path] || {};
  const finalTitle = title || entry.title || 'Paradigm Asset Management';
  const finalDescription = description || entry.description || '';
  const canonical = canonicalFor(path);
  const absoluteImage = image.startsWith('http') ? image : `${SITE_ORIGIN}${image}`;

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Paradigm Asset Management" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={absoluteImage} />
    </Helmet>
  );
}
