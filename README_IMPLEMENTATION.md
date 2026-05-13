# Paradigm Asset Management Website - Implementation Overview

The Paradigm Asset Management website has been built with a focus on institutional quality, professional aesthetics, and a problem-first narrative.

## 🎨 Design System
- **Colors**:
  - `paradigm-dark-blue` (#34416D): Primary brand color for trust and authority.
  - `warm-gold` (#C4A25B): Accent color for highlighting key CTAs and value points.
  - `warm-off-white` (#F5F3EF): Main background for a premium, clean feel.
- **Typography**:
  - **Headers**: `Playfair Display` (Serif) - Communicates tradition and elegance.
  - **Body**: `Inter` (Sans-serif) - Ensures modern readability.

## 🏗️ Architecture
- **Framework**: React + Vite
- **Styling**: TailwindCSS (Utility-first with custom configuration)
- **Animations**: Framer Motion (Smooth transitions and scroll effects)
- **Routing**: React Router DOM (Single Page Application architecture)
- **SEO**: React Helmet Async (Dynamic metadata per page)

## 📄 Page Breakdown
1. **Home**: High-level value proposition with the "Style-Lock" insight and brand story.
2. **For Advisors**: Focused on the "Style-Lock" and "Commodification" traps, offering proprietary stories.
3. **For Institutions**: Highlights 35 years of rigor and service to top 100 pension funds.
4. **Our Process**: A transparent 4-step breakdown of the investment methodology.
5. **About**: Firm history and leadership bio for James Francis.
6. **Contact**: Bifurcated forms tailored to Advisor and Institutional needs.

## 🚀 Getting Started
To run the development server locally:
```bash
cd paradigm-website
npm run dev
```

To build for production:
```bash
npm run build
```

## 🛠️ Key Components
- `Navbar.jsx`: Responsive glassmorphism navigation.
- `HeroSection.jsx`: Dynamic hero with animated text and background overlays.
- `AudienceSplit.jsx`: Visual bifurcation for primary audiences.
- `ProofPoint.jsx`: Credibility section showcasing tenure and client trust.
