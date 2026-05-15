import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import CTAStrip from '../components/CTAStrip';

function ProcessStep({ num, title, body, isLast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55 }}
      style={{
        display: 'grid',
        gridTemplateColumns: '5rem 1fr',
        gap: '2rem',
        paddingBottom: isLast ? 0 : '3rem',
        borderBottom: isLast ? 'none' : '1px solid rgba(52,65,109,0.08)',
        marginBottom: isLast ? 0 : '3rem',
        alignItems: 'start',
      }}
    >
      <div>
        <span style={{
          fontFamily: 'Source Serif 4, Georgia, serif',
          fontSize: '3rem',
          fontWeight: 700,
          color: '#C4A25B',
          lineHeight: 1,
          display: 'block',
        }}>{num}</span>
      </div>
      <div>
        <h3 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.3 }}>{title}</h3>
        <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>{body}</p>
      </div>
    </motion.div>
  );
}

export default function Process() {
  return (
    <>
      <Helmet>
        <title>Our Process — Paradigm Asset Management</title>
        <meta name="description" content="Systematic. Transparent. Explainable at every step. How Paradigm reads active market data to build portfolios from collective market intelligence." />
      </Helmet>

      <HeroSection
        headline="Systematic. Transparent.\nExplainable at every step."
        minimal
      />

      {/* Data Foundation */}
      <section className="section-white">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Data Foundation</p>
            <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '1.75rem' }}>
              Every Paradigm portfolio begins with data.
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <motion.p
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0 }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}
              >
                Not analyst opinions. Not committee views. Market data — specifically the disclosed holdings of active investment strategies across the global equity universe. This data is public. What Paradigm does with it is not.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.07 }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}
              >
                Paradigm's Active Market Data database covers more than 20,000 strategies across 45,000 securities in 75 global markets. It is the most comprehensive view of where active capital is positioned within any mandate at any given time. Updated continuously. Evaluated monthly for changes in regime leadership.
              </motion.p>
            </div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '3rem' }}>
              {[
                { value: '20,000+', label: 'Active strategies tracked' },
                { value: '45,000', label: 'Securities covered' },
                { value: '75', label: 'Global markets' },
              ].map((s, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  style={{ background: '#F5F3EF', borderRadius: 3, padding: '1.5rem', textAlign: 'center' }}
                >
                  <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '2rem', fontWeight: 700, color: '#34416D', lineHeight: 1.1 }}>{s.value}</p>
                  <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', fontWeight: 500, color: '#637890', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '0.375rem' }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Four Steps */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Process</p>
            <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '0.625rem' }}>
              Four steps. Every mandate. Every month.
            </h2>
            <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', color: '#637890', marginBottom: '3.5rem', lineHeight: 1.6 }}>
              The same four steps run for every mandate. Evaluated monthly. Signal-driven from start to finish.
            </p>

            <ProcessStep
              num="01"
              title="Isolate the mandate universe."
              body="Every portfolio begins with a defined mandate. Large Cap Value. International Developed. A custom thematic strategy. Whatever the mandate, Paradigm isolates the relevant dataset from Active Market Data — the universe of strategies operating within that specific space."
            />
            <ProcessStep
              num="02"
              title="Identify regime leadership."
              body="DMinor — Paradigm's proprietary pattern recognition engine — identifies which strategies within the mandate are in genuine market leadership right now. Not which strategies performed best over the last three years. Which are leading within the mandate today. The distinction matters. Most manager searches are backward-looking by design — they evaluate trailing performance and hire the sub-style that just led the cycle. DMinor reads current market positioning."
            />
            <ProcessStep
              num="03"
              title="Generate the Portfolio Blueprint."
              body="The strategies in regime leadership reveal a consensus view of the market — which sectors, factors, regions, and securities are concentrated in the leading positions. That consensus becomes the Portfolio Blueprint: a map of where the market's collective attention is focused within the mandate right now. The Blueprint is not a replication of any single strategy. It is a new intelligence that emerges from the aggregate of many strategies each doing their job well within their own domain."
            />
            <ProcessStep
              num="04"
              title="Build, optimize, and monitor."
              body="Paradigm optimizes the portfolio toward the Blueprint — maximum return relative to risk within the mandate parameters. The model runs monthly from the beginning. A rebalance is triggered when the signal confirms a shift in regime leadership, not when a calendar date arrives. Tax-loss harvesting runs on the active positions through the platform. The advisor or institution operates this capability. Paradigm enables it."
              isLast
            />
          </div>
        </div>
      </section>

      {/* Why No Black Box */}
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
                  fontWeight: 600,
                  borderLeft: '4px solid #C4A25B',
                  paddingLeft: '1.5rem',
                }}
              >
                Transparent and explainable is not a feature. It is the architecture.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Process-specific intro before CTA */}
      <section className="section-offwhite">
        <div className="section-inner" style={{ paddingTop: '3.5rem', paddingBottom: '0' }}>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}
          >
            <p style={{
              fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890',
            }}>
              The process is built to answer questions. If you have specific ones, a conversation is the right next step.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA — both audience types */}
      <CTAStrip variant="both" />
    </>
  );
}
