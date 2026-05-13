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

### Phase 2 — In Progress

| Route | Status |
| :--- | :--- |
| `/institutions` | Structure complete — copy pending final approval |
| `/process` | Structure complete — copy pending final approval |
| `/about` | Structure complete — team bios and photos pending |

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
