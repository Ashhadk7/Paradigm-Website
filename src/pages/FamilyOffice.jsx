import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProofBlock from '../components/ProofBlock';
import CTAStrip from '../components/CTAStrip';

function ThreeCol({ blocks }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'rgba(52,65,109,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      {blocks.map((b, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
          style={{ background: '#fff', padding: '2.5rem 2rem' }}
        >
          <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.875rem' }}>{b.label}</p>
          <h3 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.25rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.3 }}>{b.title}</h3>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: '#637890' }}>{b.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function FamilyOffice() {
  return (
    <>
      <Helmet>
        <title>For Family Offices — Paradigm Asset Management</title>
        <meta name="description" content="Paradigm builds portfolios to your specification for any client mandate — using collective intelligence to identify regime leadership. Your clients see your process." />
      </Helmet>

      <HeroSection
        eyebrow="For Multi-Family Offices & OCIOs"
        headline={"Your clients expect portfolios built for them specifically. Most platforms offer portfolios built for everyone. There is a different approach."}
        sub="Paradigm builds portfolios to your specification for any client mandate — using collective intelligence to identify regime leadership within each mandate and qualify it through active market data. Your investment team operates the platform. Your clients see your process."
        ctas={[{ label: 'Start a Conversation', to: '/contact', variant: 'outline' }]}
      />

      {/* Core Story */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Core Story</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[
                "Every active strategy operates within the boundaries of its expertise. A deep value manager knows deep value. A quality growth manager has a genuine edge in quality growth. That specialization is a real edge. It is also a structural constraint: when market leadership shifts outside those boundaries, the strategy lags and waits.",
                "Most family offices manage this by diversifying across managers and styles. It is a reasonable approach. It is also operationally complex — multiple manager relationships, multiple mandates to monitor, multiple performance narratives to maintain for clients across the family structure.",
                "Paradigm identifies where regime leadership is forming within each mandate and qualifies that signal through collective intelligence. From that signal Paradigm builds a Portfolio Blueprint — a portfolio whose characteristics match what the market is rewarding within the mandate right now. Your investment team defines the parameters. Paradigm manufactures the portfolio. Your clients see your firm's process.",
                "The result is institutional-quality portfolio construction at the mandate level — without the overhead of building that capability in-house.",
              ].map((p, i) => (
                <motion.p key={i}
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                  style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.85, color: '#637890' }}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Paradigm Offers Family Offices */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem', textAlign: 'center' }}>What Paradigm Offers Family Offices</p>
          <h2 className="section-headline" style={{ color: '#34416D', textAlign: 'center', marginBottom: '0.625rem' }}>
            Three applications of the same capability.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', color: '#637890', textAlign: 'center', maxWidth: 480, margin: '0 auto 3.5rem' }}>
            Each addresses a specific operational or investment challenge for multi-family offices.
          </p>
          <ThreeCol blocks={[
            {
              label: 'Custom Mandates',
              title: 'Built to your specification.',
              body: "Every portfolio starts with the mandate your investment team defines. Style, geography, factor tilts, ESG constraints, thematic exposure. Paradigm identifies regime leadership within that mandate and builds the Portfolio Blueprint from the qualified collective intelligence signal.",
            },
            {
              label: 'Platform Operations',
              title: 'You operate it. Paradigm enables it.',
              body: "Customization, personalization, and tax-loss harvesting run across both the active and indexed sleeves simultaneously — at the individual client account level. Your investment team runs these tools. Paradigm provides the infrastructure and the investment intelligence.",
            },
            {
              label: 'White Glove Build',
              title: 'We build it. You run it.',
              body: "Paradigm builds the portfolio to your specification. It sits on the platform. Your team operates the personalization and tax-loss harvesting from there. The investment process is yours. The construction is Paradigm's. Your clients see your firm's name on everything.",
            },
          ]} />
        </div>
      </section>

      {/* Operational Consequence */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Operational Consequence</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                Most multi-family offices manage active mandates through relationships with multiple style-specific managers. Each brings genuine expertise within their domain. Each also brings coordination overhead — performance monitoring across multiple mandates, attribution reporting across multiple accounts, and a different investment rationale for each manager in every client review.
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                Paradigm consolidates that into one process. One relationship. One coherent investment narrative across every client, every mandate, and every committee meeting that asks how the portfolio is positioned and why.
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="section-white">
        <div className="section-inner" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <ProofBlock variant="mfo" />
        </div>
      </section>

      <CTAStrip variant="mfo" />
    </>
  );
}
