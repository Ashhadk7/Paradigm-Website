import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GLSLHills } from '../components/ui/glsl-hills';

function ProcessStep({ num, title, paragraphs, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '6rem 1fr',
        gap: '2.5rem',
        paddingBottom: isLast ? 0 : '3.5rem',
        marginBottom: isLast ? 0 : '3.5rem',
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
  const words = ['Systematic.', 'Transparent.', 'Explainable at every step.'];

  return (
    <>
      <Helmet>
        <title>Our Process — Paradigm Asset Management</title>
        <meta name="description" content="Systematic. Transparent. Explainable at every step. How Paradigm reads active market data to build portfolios from collective market intelligence." />
      </Helmet>

      {/* ── HERO — Minimal: H1 only, no sub, no CTA ── */}
      <section
        className="hero-section"
        style={{
          paddingTop: '5rem',
          paddingBottom: '3rem',
        }}
      >
        {/* GLSL hills background */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.8, zIndex: 0 }}>
          <GLSLHills speed={0.3} cameraZ={130} />
        </div>

        <div className="hero-inner">
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
            {/* Staggered three-line H1 */}
            {words.map((word, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <h1
                  className="display-headline"
                  style={{
                    marginBottom: i < words.length - 1 ? '0.15em' : 0,
                    lineHeight: 1.1,
                  }}
                >
                  {word}
                </h1>
              </motion.div>
            ))}

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

      {/* ── THE DATA FOUNDATION ── */}
      <section className="section-white">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Data Foundation</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              <motion.p
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}
              >
                Every Paradigm portfolio begins with data. Not analyst opinions. Not committee views. Market data — specifically the disclosed holdings of active investment strategies across the global equity universe. This data is public. What Paradigm does with it is not.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.07 }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}
              >
                Paradigm's Active Market Data (AMD) covers more than 12,000 strategies across 45,000 securities in 75 global markets. It is the most comprehensive view of where active capital is positioned within any mandate at any given time. Updated continuously. Evaluated monthly for changes in regime leadership.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROCESS — FOUR STEPS ── */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Process — Four Steps</p>
            <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#637890', marginBottom: '3.5rem', lineHeight: 1.8 }}>
              The same four steps run for every mandate. Evaluated monthly. Signal-driven from start to finish.
            </p>

            <ProcessStep
              num="01"
              title="Isolate the mandate universe."
              paragraphs={[
                "Every portfolio begins with a defined mandate. Large Cap Value. International Developed. A custom thematic strategy. Whatever the mandate, Paradigm isolates the relevant dataset from AMD — the universe of strategies operating within that specific space.",
              ]}
            />
            <ProcessStep
              num="02"
              title="Identify regime leadership."
              paragraphs={[
                "CIPE — Paradigm's Collective Intelligence Portfolio Engine — identifies which strategies within the mandate are in genuine market leadership right now. Not which strategies performed best over the last three years. Which are leading within the mandate today.",
                "The distinction matters. Most manager searches are backward-looking by design — they evaluate trailing performance and hire the sub-style that just led the cycle. CIPE reads current market positioning.",
              ]}
            />
            <ProcessStep
              num="03"
              title="Generate the Portfolio Blueprint."
              paragraphs={[
                "The strategies in regime leadership reveal a consensus view of the market — which sectors, factors, regions, and securities are concentrated in the leading positions. That consensus becomes the Portfolio Blueprint: a map of where the market's collective attention is focused within the mandate right now.",
                "The Blueprint is not a replication of any single strategy. It is a new intelligence that emerges from the aggregate of many strategies each doing their job well within their own domain.",
              ]}
            />
            <ProcessStep
              num="04"
              title="Build, optimize, and monitor."
              paragraphs={[
                "Paradigm optimizes the portfolio toward the Blueprint — maximum return relative to risk within the mandate parameters. The model runs monthly from the beginning. A rebalance is triggered when the signal confirms a shift in regime leadership, not when a calendar date arrives.",
                "Tax-loss harvesting runs on the active positions through the platform. The advisor or institution operates this capability. Paradigm enables it.",
              ]}
              isLast
            />
          </div>
        </div>
      </section>

      {/* ── WHY NO BLACK BOX ── */}
      <section className="section-white">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>Why No Black Box</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                Systematic investment processes are often dismissed as black boxes — algorithms that produce outputs no one can explain or defend. Paradigm's process is the opposite.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                Every input to the Portfolio Blueprint is observable market data. Every output is a specific security position with a specific rationale: this position reflects where the collective market signal says leadership is forming within this mandate today. Every rebalance decision is traceable to a specific change in that signal. Every position can be explained to a client, a committee, or a regulator in plain language.
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
                Transparent and explainable is not a feature. It is the architecture.
              </motion.p>
            </div>
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
              textAlign: 'center', maxWidth: 600, margin: '0 auto 3rem',
            }}
          >
            The process is built to answer questions. If you have specific ones, a conversation is the right next step.
          </motion.p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            {/* Advisor CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>For Advisors</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.4 }}>
                See what a portfolio built from collective intelligence looks like for your practice. Worth 20 minutes.
              </p>
              <Link to="/contact" className="btn-gold" style={{ marginTop: '0.5rem' }}>
                Book a 20-Minute Call
              </Link>
            </motion.div>
            {/* Institutional CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>For Institutions</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.4 }}>
                Paradigm is actively building strategic relationships with family offices, OCIOs, and institutional partners.
              </p>
              <Link to="/contact" className="btn-outline-navy" style={{ marginTop: '0.5rem' }}>
                Start a Conversation
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
