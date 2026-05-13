# Paradigm Asset Management — Website

Production marketing site for **Paradigm Asset Management Co. LLC**, built as a React SPA. The site communicates Paradigm's collective intelligence investment process to three distinct audiences: independent wealth advisors, multi-family offices / OCIOs, and institutional investors.

Live domain: [paradigmasset.com](https://paradigmasset.com)

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Animation | Framer Motion |
| SEO | React Helmet Async |
| Fonts | Inter · Source Serif 4 (Google Fonts) |
| Styling | Custom CSS (brand token system) |
| Icons | Lucide React |

---

## Brand Tokens

```
Navy        #34416D   — primary backgrounds, headlines
Gold        #C4A25B   — accents, CTAs, eyebrows, highlights
Blue-grey   #637890   — body copy
Off-white   #F5F3EF   — warm backgrounds, hero, form fields
White       #FFFFFF   — section backgrounds
```

Fonts loaded via Google Fonts in `index.html`:
- **Source Serif 4** — all display / serif headings
- **Inter** — body text, UI, labels, eyebrows

---

## Project Structure

```
src/
├── components/
│   ├── CTAStrip.jsx        # Bottom CTA bar — variants: advisor | mfo | institutional | both
│   ├── Footer.jsx          # Site footer with nav links and legal
│   ├── HeroSection.jsx     # Reusable hero — eyebrow, H1, sub, visual, CTAs
│   ├── Navbar.jsx          # Top nav with advisor dropdown and mobile drawer
│   └── ProofBlock.jsx      # Navy proof section — variants: advisor | mfo | institutional
│
├── pages/
│   ├── Home.jsx            # /             — collective intelligence overview
│   ├── Advisors.jsx        # /advisors     — RIAs and independent wealth advisors
│   ├── FamilyOffice.jsx    # /familyoffice — MFOs and OCIOs
│   ├── Institutions.jsx    # /institutions — institutional allocators (Phase 2)
│   ├── Process.jsx         # /process      — four-step investment process (Phase 2)
│   ├── About.jsx           # /about        — firm history, team, advisory board (Phase 2)
│   ├── Contact.jsx         # /contact      — two-path inquiry + structured form
│   └── Legal.jsx           # /legal        — disclaimers, SEC registration, privacy
│
├── App.jsx                 # Route definitions
├── main.jsx                # React entry point
└── index.css               # All styles — tokens, layout, component classes
```

---

## Pages

### Phase 1 — Complete

| Route | Audience | Purpose |
|---|---|---|
| `/` | All | Collective intelligence story, trust strip, proof |
| `/advisors` | RIAs, wealth advisors | Full self-contained pitch — practice consequences, platform, proof |
| `/familyoffice` | MFOs, OCIOs | Portfolio manufacturing capability, custom mandates |
| `/contact` | All | Two-path inquiry (advisor vs institutional) + structured form |
| `/legal` | All | Disclaimers, SEC registration, performance disclosures |

### Phase 2 — In Progress

| Route | Status |
|---|---|
| `/institutions` | Structure complete — copy pending final approval |
| `/process` | Structure complete — copy pending final approval |
| `/about` | Structure complete — team bios and photos pending |

---

## Components

### `HeroSection`
Reusable full-width navy hero. Accepts `eyebrow`, `headline` (supports `\n` for intentional line breaks), `sub`, an optional `visual` right-column element, and a `ctas` array.

```jsx
<HeroSection
  eyebrow="For Wealth Advisors & Independent RIAs"
  headline="Your clients are paying active management fees. Most of that capital is locked inside a single strategy's approach. There is a different way to invest it."
  sub="Paradigm builds portfolios from active market data — not anchored to any single approach."
  ctas={[{ label: 'Book a 20-Minute Call', to: '/contact', variant: 'gold' }]}
/>
```

### `ProofBlock`
Navy callout block with institutional proof sentence. Three variants:

```jsx
<ProofBlock variant="advisor" />        // 35-year history, bridge to advisors
<ProofBlock variant="mfo" />            // 35-year history, bridge to MFOs
<ProofBlock variant="institutional" />  // 35 years + 65 pension funds, bridge to partners
```

### `CTAStrip`
Bottom-of-page conversion section. Four variants:

```jsx
<CTAStrip variant="advisor" />          // "Worth 20 minutes..." + gold CTA
<CTAStrip variant="mfo" />              // MFO-specific headline + navy outline CTA
<CTAStrip variant="institutional" />    // Institutional headline + navy outline CTA
<CTAStrip variant="both" />             // Two-column: advisor left + institutional right
```

---

## Running Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

```bash
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
```

---

## Copy Documents

All page copy is authored and approved by the client in versioned Word documents **before** development begins. The developer builds to the approved version — no copy changes in JSX without a corresponding update to the approved document.

| File | Covers |
|---|---|
| `paradigm-website-copy-p1-v7.docx` | Home, For Advisors |
| `paradigm-website-copy-p2-v2.docx` | For Family Offices, For Institutions, Our Process, About, Contact |
| `paradigm-website-brief-v4.docx` | Full project brief, design system, phase scope |

---

## Design Principles

**Copy-first.** Every word on the site is approved before it is built.

**Audience-specific pages.** `/advisors`, `/familyoffice`, and `/institutions` are fully self-contained. A visitor arriving from any channel — email campaign, search, conference referral — gets the complete context without needing to navigate elsewhere.

**Flexible story sections.** All narrative paragraph blocks use `display: flex; flex-direction: column; gap: 1.75rem` — never `marginBottom` tied to a hardcoded paragraph count. This allows copy revisions on staging without layout rework.

**No performance promises.** All copy is reviewed against SEC guidance. No return claims or performance guarantees appear anywhere on the site.

**Source Serif 4 only.** All serif display type uses Source Serif 4 with Georgia as fallback. No other serif font is loaded.

---

## Contact

**James Francis** — Founder & CEO
Paradigm Asset Management Co. LLC
jef@paradigmasset.com · 212.771.6100 · 917-991-3348

1345 Avenue of the Americas, 2nd Floor, Suite 107
New York, NY 10105
