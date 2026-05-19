import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProofBlock from '../components/ProofBlock';
import CTAStrip from '../components/CTAStrip';
import { useContent } from '../lib/useContent';

function ThreeCol({ blocks }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'rgba(52,65,109,0.08)', borderRadius: 3, overflow: 'hidden' }}>
      {blocks.map((b, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
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

export default function Institutions() {
  const { content: cms } = useContent('institutions');

  const c = {
    hero_eyebrow: cms?.hero_eyebrow || "For Institutional Investors & Strategic Partners",
    hero_headline: cms?.hero_headline || "35 years of institutional investment process. The same intelligence that served General Motors, AMEX, and the US Treasury — now structured for the partnerships, mandates, and platforms that define what comes next.",
    hero_sub: cms?.hero_sub || "Paradigm reads active market data to identify where leadership is forming within each mandate — and builds portfolios from that signal. Transparent. Explainable. No black box.",
    platform_para1: cms?.platform_para1 || "One platform. Three capabilities. Custom active strategies, SMA conversion, and direct and custom indexing — fully integrated. Customization, personalization, and tax-loss harvesting run across all three — at the individual account level. Institutions operate the platform. Paradigm provides the investment intelligence and the infrastructure.",
    platform_para2: cms?.platform_para2 || "For institutions managing assets across multiple mandates and account types, the operational consequence is significant. One process. One relationship. One coherent investment narrative across every client, every committee, and every regulatory filing that asks how the portfolio is positioned and why.",
  };

  return (
    <>
      <Helmet>
        <title>For Institutions — Paradigm Asset Management</title>
        <meta name="description" content="35 years of institutional investment process. The same intelligence that served General Motors, AMEX, and the US Treasury — now structured for the partnerships that define what comes next." />
      </Helmet>

      <HeroSection
        eyebrow={c.hero_eyebrow}
        headline={c.hero_headline}
        sub={c.hero_sub}
        compact
        ctas={[{ label: 'Start a Conversation', to: '/contact', variant: 'outline' }]}
      />

      {/* Core Story — Institutional Register */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Core Story</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[
                "Every active strategy operates within the boundaries of its expertise. A manager running large cap value runs large cap value — with precision and pattern recognition built over years. That specialization is a genuine edge. It is also a structural constraint: when market leadership rotates outside those boundaries, the strategy lags. Not because of error. Because staying current with the rotation would mean operating outside the domain of real competence.",
                "Most institutional portfolios manage this by diversifying across managers and styles. It is a reasonable solution. It is also an expensive one — multiple management fees, multiple mandates to monitor, and a portfolio that reflects yesterday's allocation decisions more than today's market reality.",
                "Paradigm reads active market data to identify where leadership is forming within each mandate right now. From that signal Paradigm constructs portfolios not anchored to any single approach. Informed by the full picture of where returns are being found within each asset class today. Evaluated monthly. Rebalanced when the signal confirms a shift — not on a calendar schedule.",
                "The result is a portfolio built from collective market intelligence that no single strategy can replicate — because replicating it would require leaving the domain of its own expertise.",
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

      {/* What Paradigm Offers Institutions */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem', textAlign: 'center' }}>What Paradigm Offers Institutions</p>
          <h2 className="section-headline" style={{ color: '#34416D', textAlign: 'center', marginBottom: '0.625rem' }}>
            Three distinct ways institutions work with Paradigm.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', color: '#637890', textAlign: 'center', maxWidth: 480, margin: '0 auto 3.5rem' }}>
            Each is a different application of the same investment process.
          </p>
          <ThreeCol blocks={[
            {
              label: 'Investment Mandates',
              title: 'Existing strategies. Institutional quality.',
              body: "Large Cap Value. Domestic All-Cap All-Style. International Developed. World Value. Small Cap Domestic. Each strategy built from active market data. Each portfolio systematically positioned toward current market leadership within the mandate.",
            },
            {
              label: 'Custom Mandates',
              title: 'Any specification. Built to order.',
              body: "Paradigm builds custom strategies to institutional specification. Any style, any geography, any thematic or ESG overlay. The same collective intelligence process — applied to the mandate the institution defines. No off-the-shelf products.",
            },
            {
              label: 'Strategic Partnerships',
              title: 'Platform. Sub-advisory. Distribution.',
              body: "Paradigm is actively building strategic relationships with aggregators, OCIOs, and institutional platforms. Portfolio as a Service — product manufacturing, sub-advisory, and white-label delivery — at institutional scale.",
            },
          ]} />
        </div>
      </section>

      {/* The Platform */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Platform</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                {c.platform_para1}
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                {c.platform_para2}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Proof */}
      <section className="section-white">
        <div className="section-inner" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <ProofBlock variant="institutional" />
        </div>
      </section>

      <CTAStrip variant="institutional" />
    </>
  );
}
