import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParadigmHeroField from '../components/ParadigmHeroField';
import { useContent } from '../lib/useContent';

function ProcessStep({ num, title, paragraphs, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className="process-step-row"
      style={{
        display: 'grid',
        gap: '2rem',
        paddingBottom: isLast ? 0 : '3rem',
        marginBottom: isLast ? 0 : '3rem',
        borderBottom: isLast ? 'none' : '1px solid rgba(52,65,109,0.08)',
        alignItems: 'start',
      }}
    >
      {/* Navy number block */}
      <div style={{
        background: '#34416D',
        borderRadius: 4,
        width: '5rem',
        height: '5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'Source Serif 4, Georgia, serif',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#C4A25B',
          lineHeight: 1,
        }}>{num}</span>
      </div>
      {/* Copy block */}
      <div style={{ paddingTop: '0.5rem' }}>
        <h3 style={{
          fontFamily: 'Source Serif 4, Georgia, serif',
          fontSize: '1.375rem',
          color: '#34416D',
          marginBottom: '1rem',
          lineHeight: 1.3,
        }}>{title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {paragraphs.map((p, i) => (
            <p key={i} style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>{p}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Process() {
  const { content: cms } = useContent('process');

  const c = {
    hero_headline: cms?.hero_headline || "Systematic.\nTransparent.\nExplainable at every step.",
    data_foundation_eyebrow: cms?.data_foundation_eyebrow || "The Data Foundation",
    data_foundation_text: cms?.data_foundation_text || "Every Paradigm portfolio begins with data. Not analyst opinions. Not committee views. Market data — specifically the disclosed holdings of active investment strategies across the global equity universe. This data is public. What Paradigm does with it is not.",
    data_foundation_amd: cms?.data_foundation_amd || "Paradigm's Active Market Data (AMD) covers more than 12,000 strategies across 45,000 securities in 75 global markets. It is the most comprehensive view of where active capital is positioned within any mandate at any given time. Updated continuously. Evaluated monthly for changes in regime leadership.",
    process_eyebrow: cms?.process_eyebrow || "The Process — Four Steps",
    process_intro: cms?.process_intro || "The same four steps run for every mandate. Evaluated monthly. Signal-driven from start to finish.",
    step1_title: cms?.step1_title || "Isolate the mandate universe.",
    step1_text: cms?.step1_text || "Every portfolio begins with a defined mandate. Large Cap Value. International Developed. A custom thematic strategy. Whatever the mandate, Paradigm isolates the relevant dataset from AMD — the universe of strategies operating within that specific space.",
    step2_title: cms?.step2_title || "Identify regime leadership.",
    step2_para1: cms?.step2_para1 || "CIPE — Paradigm's Collective Intelligence Portfolio Engine — identifies which strategies within the mandate are in genuine market leadership right now. Not which strategies performed best over the last three years. Which are leading within the mandate today.",
    step2_para2: cms?.step2_para2 || "The distinction matters. Most manager searches are backward-looking by design — they evaluate trailing performance and hire the sub-style that just led the cycle. CIPE reads current market positioning.",
    step3_title: cms?.step3_title || "Generate the Portfolio Blueprint.",
    step3_text: cms?.step3_text || "The strategies in regime leadership reveal a consensus view of the market — which sectors, factors, regions, and securities are concentrated in the leading positions. That consensus becomes the Portfolio Blueprint: a map of where the market's collective attention is focused within the mandate right now.",
    step3_text_2: cms?.step3_text_2 || "The Blueprint is not a replication of any single strategy. It is a new intelligence that emerges from the aggregate of many strategies each doing their job well within their own domain.",
    step4_title: cms?.step4_title || "Build, optimize, and monitor.",
    step4_text: cms?.step4_text || "Paradigm optimizes the portfolio toward the Blueprint — maximum return relative to risk within the mandate parameters. The model runs monthly from the beginning. A rebalance is triggered when the signal confirms a shift in regime leadership, not when a calendar date arrives.",
    step4_text_2: cms?.step4_text_2 || "Tax-loss harvesting runs on the active positions through the platform. The advisor or institution operates this capability. Paradigm enables it.",
    black_box_eyebrow: cms?.black_box_eyebrow || "Why No Black Box",
    black_box_1: cms?.black_box_1 || "Systematic investment processes are often dismissed as black boxes — algorithms that produce outputs no one can explain or defend. Paradigm's process is the opposite.",
    black_box_2: cms?.black_box_2 || "Every input to the Portfolio Blueprint is observable market data. Every output is a specific security position with a specific rationale: this position reflects where the collective market signal says leadership is forming within this mandate today. Every rebalance decision is traceable to a specific change in that signal. Every position can be explained to a client, a committee, or a regulator in plain language.",
    black_box_pullquote: cms?.black_box_pullquote || "Transparent and explainable is not a feature. It is the architecture.",
    cta_intro: cms?.cta_intro || "The process is built to answer questions. If you have specific ones, a conversation is the right next step.",
    cta_advisor_eyebrow: cms?.cta_advisor_eyebrow || "For Advisors",
    cta_advisor_text: cms?.cta_advisor_text || "See what a portfolio built from collective intelligence looks like for your practice. Worth 20 minutes.",
    cta_advisor_button: cms?.cta_advisor_button || "Book a 20-Minute Call",
    cta_institution_eyebrow: cms?.cta_institution_eyebrow || "For Institutions",
    cta_institution_text: cms?.cta_institution_text || "Paradigm is actively building strategic relationships with family offices, OCIOs, and institutional partners.",
    cta_institution_button: cms?.cta_institution_button || "Start a Conversation",
  };

  const words = c.hero_headline.split('\n');

  return (
    <>
      <Helmet>
        <title>Our Process — Paradigm Asset Management</title>
        <meta name="description" content="Systematic. Transparent. Explainable at every step. How Paradigm reads active market data to build portfolios from collective market intelligence." />
      </Helmet>

      {/* ── HERO — Minimal: H1 only, no sub, no CTA ── */}
      <section
        className="hero-section"
      >
        {/* Animated data-field background */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <ParadigmHeroField variant="institutions" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
        </div>

        <div className="hero-inner">
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
            {/* Staggered three-line H1 (single h1, animated line spans) */}
            <h1 className="display-headline" style={{ lineHeight: 1.1 }}>
              {words.map((word, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    display: 'block',
                    marginBottom: i < words.length - 1 ? '0.15em' : 0,
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            {/* Subtle gold accent line below the H1 */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
              style={{
                height: 2,
                background: 'linear-gradient(90deg, #C4A25B 0%, transparent 70%)',
                marginTop: '2rem',
                maxWidth: 180,
                transformOrigin: 'left',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── THE DATA FOUNDATION — text left, illustration right ── */}
      <section className="core-story-band">
        <div className="core-story-band-text" style={{ background: '#fff' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.data_foundation_eyebrow}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}
            >
              {c.data_foundation_text}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.07 }}
              style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}
            >
              {c.data_foundation_amd}
            </motion.p>
          </div>
        </div>
        <div className="core-story-band-art">
          <img src="/paradigm-data-foundation.svg" alt="The data foundation" />
        </div>
      </section>

      {/* ── THE PROCESS — FOUR STEPS (2×2 grid: 01 & 03 top, 02 & 04 below) ── */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 760, marginBottom: '3.5rem' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.process_eyebrow}</p>
            <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#637890', lineHeight: 1.8 }}>
              {(() => {
                // Put "Evaluated monthly..." on its own line. Works whether the
                // text comes from code or the CMS.
                const intro = c.process_intro;
                const idx = intro.indexOf('Evaluated monthly');
                if (idx > 0) {
                  return (
                    <>
                      {intro.slice(0, idx).trim()}
                      <br />
                      {intro.slice(idx).trim()}
                    </>
                  );
                }
                return intro;
              })()}
            </p>
          </div>

          {/* 2-column grid; source order 01,03,02,04 places 01 & 03 in the
              first row and 02 & 04 in the second row. */}
          <div className="process-steps-2x2">
            <ProcessStep num="01" title={c.step1_title} paragraphs={[c.step1_text]} isLast />
            <ProcessStep num="03" title={c.step3_title} paragraphs={[c.step3_text, c.step3_text_2]} isLast />
            <ProcessStep num="02" title={c.step2_title} paragraphs={[c.step2_para1, c.step2_para2]} isLast />
            <ProcessStep num="04" title={c.step4_title} paragraphs={[c.step4_text, c.step4_text_2]} isLast />
          </div>
        </div>
      </section>

      {/* ── WHY NO BLACK BOX — illustration left, text right (mirror) ── */}
      <section className="core-story-band core-story-band--reverse">
        <div className="core-story-band-art">
          <img src="/paradigm-No-black-box.svg" alt="No black box — transparent and explainable" />
        </div>
        <div className="core-story-band-text" style={{ background: '#fff' }}>
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.black_box_eyebrow}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
              {c.black_box_1}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}
              style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
              {c.black_box_2}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
              style={{
                fontFamily: 'Source Serif 4, Georgia, serif',
                fontSize: '1.375rem',
                lineHeight: 1.5,
                color: '#34416D',
                fontWeight: 700,
              }}
            >
              {c.black_box_pullquote}
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA — PROCESS PAGE ── */}
      <section style={{ borderTop: '1px solid rgba(52,65,109,0.12)' }}>
        <div className="section-inner" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890',
              maxWidth: 600, margin: '0 0 3rem',
            }}
          >
            {c.cta_intro}
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            {/* Advisor CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{c.cta_advisor_eyebrow}</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.4 }}>
                {c.cta_advisor_text}
              </p>
              <Link to="/contact" className="btn-gold" style={{ marginTop: '0.5rem' }}>
                {c.cta_advisor_button}
              </Link>
            </motion.div>
            {/* Institutional CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>{c.cta_institution_eyebrow}</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.4 }}>
                {c.cta_institution_text}
              </p>
              <Link to="/contact" className="btn-outline-navy" style={{ marginTop: '0.5rem' }}>
                {c.cta_institution_button}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
