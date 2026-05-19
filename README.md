# Paradigm Asset Management — Website

Production marketing site for **Paradigm Asset Management Co. LLC**, built as a React SPA. The site communicates Paradigm's collective intelligence investment process to three distinct audiences: independent wealth advisors, multi-family offices / OCIOs, and institutional investors.

---

## Tech Stack

| Layer | Choice |
| :--- | :--- |
| **Framework** | React 18 + Vite |
| **Routing** | React Router v6 |
| **Animation** | Framer Motion |
| **SEO** | React Helmet Async |
| **Fonts** | Inter · Source Serif 4 (Google Fonts) |
| **Styling** | Custom CSS (brand token system) |
| **Icons** | Lucide React |

---

## Project Structure

```text
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
| :--- | :--- | :--- |
| `/` | All | Collective intelligence story, trust strip, proof |
| `/advisors` | RIAs, wealth advisors | Full self-contained pitch — practice consequences, platform, proof |
| `/familyoffice` | MFOs, OCIOs | Portfolio manufacturing capability, custom mandates |
| `/contact` | All | Two-path inquiry (advisor vs institutional) + structured form |
| `/legal` | All | Disclaimers, SEC registration, performance disclosures |

### Phase 2 — Complete

| Route | Audience | Purpose |
| :--- | :--- | :--- |
| `/institutions` | Institutional allocators | Platform capability, operational consequence |
| `/process` | All | Four-step investment process, CIPE engine, Active Market Data |
| `/about` | All | Firm history, James Francis bio, team, advisory board |

---

## Copy Revisions — May 2026

Nine revisions applied to align the website with the updated PaaS deck and one-pager. All edits are copy-only; no structural or component changes.

| Edit | Scope | Summary |
| :--- | :--- | :--- |
| 01 | Home hero | Added infrastructure eyebrow above H1 |
| 02 | Process, About | DMinor renamed to CIPE (Collective Intelligence Portfolio Engine) |
| 03 | Process | Active Market Data (AMD) shorthand introduced; strategy count corrected to 12,000 |
| 04 | Global | James Francis title confirmed as Founder & CEO (was already correct) |
| 05 | Home | The Platform section — three-capability framing |
| 06 | For Advisors | Platform Capability section — three-capability framing |
| 07 | For Family Offices | Platform Operations column — three-capability naming |
| 08 | For Institutions | The Platform section — three-capability framing |
| 09 | Home | Trust Strip — infrastructure scale numbers replaced with firm credentials |

### Consistency checks passed
- Zero instances of `DMinor` across codebase
- Zero instances of `20,000 strategies` across codebase
- Zero instances of `President` in connection with James Francis
- Three-capability framing present on Home, For Advisors, For Family Offices, For Institutions
- Trust Strip shows firm credentials only (scale numbers remain on Process page)

---

## Getting Started

Follow these steps to set up the project locally and start development.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (Version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 2. Installation
Clone the repository (or navigate to the project directory) and install the necessary dependencies:

```bash
# Install dependencies
npm install
```

### 3. Development
To start the local development server with Hot Module Replacement (HMR):

```bash
# Start dev server
npm run dev
```
Once started, the application will be available at: `http://localhost:5173`

### 4. Production Build
To create an optimized production bundle in the `dist/` directory:

```bash
# Build for production
npm run build
```

### 5. Preview Production Build
To test the production build locally before deployment:

```bash
# Preview production build
npm run preview
```
