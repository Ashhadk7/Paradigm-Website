// Single source of truth for per-page SEO metadata.
//
// Copy is taken verbatim from the client's approved developer brief
// (Paradigm Asset Management · Google Search & SEO · July 2026). Do not
// reword without sign-off — these strings are what appear in Google results.
//
// The prerender script (scripts/prerender.mjs) reads the same routes, so
// adding a public page here and to the router is all that's needed for it
// to be crawlable, canonicalised and listed in the sitemap.

export const SITE_ORIGIN = 'https://www.paradigmasset.com';

export const SEO = {
  '/': {
    title: 'Paradigm Asset Management — Collective Intelligence Portfolio Platform',
    description:
      '35 years of institutional investment intelligence — now accessible to advisors and institutions. Active management and direct indexing on one platform. Under your brand.',
  },
  '/advisors': {
    title: 'Portfolio Intelligence for Independent Advisors — Paradigm',
    description:
      'Paradigm gives advisors portfolios built from collective market intelligence. Active management and direct indexing. Tax-loss harvesting on both sleeves. Custodian-agnostic. Under your brand.',
  },
  '/familyoffice': {
    title: 'Direct Indexing & Active Management for Family Offices — Paradigm',
    description:
      'Paradigm builds custom portfolios to any mandate specification for multi-family offices and OCIOs. One platform. One relationship. Under your name. 35-year institutional track record.',
  },
  '/institutions': {
    title: 'Institutional Investment Intelligence — Paradigm Asset Management',
    description:
      '35 years serving General Motors, AMEX, and the US Treasury. Active management, direct indexing, and custom mandates for institutional investors and strategic partners.',
  },
  '/process': {
    title: 'How Paradigm Works — Collective Intelligence Investment Process',
    description:
      'Paradigm reads active market data to identify regime leadership within each mandate. Systematic. Transparent. Explainable at every step. No black box.',
  },
  '/about': {
    title: 'About Paradigm Asset Management — Founded 1990',
    description:
      'Built on a single conviction. Run for 35 years. Paradigm Asset Management has served institutional investors since 1990 with a data-driven collective intelligence investment process.',
  },
  '/contact': {
    title: 'Contact Paradigm Asset Management — Start a Conversation',
    description:
      'Book a 20-minute call with James Francis to see if Paradigm fits your practice. Or start an institutional conversation. jef@paradigmasset.com | 917-991-3348.',
  },
  '/legal': {
    title: 'Legal & Disclosures — Paradigm Asset Management',
    description:
      'Legal disclosures, regulatory information, and privacy policy for Paradigm Asset Management Co. LLC.',
  },
};

// Routes that get prerendered and listed in sitemap.xml.
// /legal is prerendered (so it indexes cleanly) but kept out of the sitemap,
// matching the seven pages the brief asks to be submitted.
// /familyoffices is a router alias only — excluded so it never competes with
// /familyoffice as a duplicate.
export const PRERENDER_ROUTES = Object.keys(SEO);
export const SITEMAP_ROUTES = PRERENDER_ROUTES.filter((r) => r !== '/legal');

export function canonicalFor(path) {
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}
