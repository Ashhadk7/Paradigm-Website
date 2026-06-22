import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import CTAStrip from '../components/CTAStrip';
import { useContent } from '../lib/useContent';

function ThreeCol({ blocks }) {
  return (
    <div className="outcomes-band">
      {blocks.map((b, i) => (
        <motion.div key={i}
          className="outcome-cell"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
        >
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.875rem' }}>{b.label}</p>
          <h3 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.45rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.3 }}>{b.title}</h3>
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.75, color: '#637890', margin: 0 }}>{b.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function Institutions() {
  const { content: cms } = useContent('institutions');

  const c = {
    hero_eyebrow: cms?.hero_eyebrow || "For Institutional Investors & Strategic Partners",
    hero_headline: cms?.hero_headline || "35 years of institutional investment process.",
    hero_sub: cms?.hero_sub || "The same intelligence that served General Motors, AMEX, and the US Treasury — now structured for the partnerships, mandates, and platforms that define what comes next.\nParadigm reads active market data to identify where leadership is forming within each mandate — and builds portfolios from that signal. Transparent. Explainable. No black box.",
    hero_cta_label: cms?.hero_cta_label || "Start a Conversation",
    core_story_eyebrow: cms?.core_story_eyebrow || "The Core Story",
    core_story_1: cms?.core_story_1 || "Every active strategy operates within the boundaries of its expertise. A manager running large cap value runs large cap value — with precision and pattern recognition built over years. That specialization is a genuine edge. It is also a structural constraint: when market leadership rotates outside those boundaries, the strategy lags. Not because of error. Because staying current with the rotation would mean operating outside the domain of real competence.",
    core_story_2: cms?.core_story_2 || "Most institutional portfolios manage this by diversifying across managers and styles. It is a reasonable solution. It is also an expensive one — multiple management fees, multiple mandates to monitor, and a portfolio that reflects yesterday's allocation decisions more than today's market reality.",
    core_story_3: cms?.core_story_3 || "Paradigm reads active market data to identify where leadership is forming within each mandate right now. From that signal Paradigm constructs portfolios not anchored to any single approach. Informed by the full picture of where returns are being found within each asset class today. Evaluated monthly. Rebalanced when the signal confirms a shift — not on a calendar schedule.",
    core_story_4: cms?.core_story_4 || "The result is a portfolio built from collective market intelligence that no single strategy can replicate — because replicating it would require leaving the domain of its own expertise.",
    offers_eyebrow: cms?.offers_eyebrow || "What Paradigm Offers Institutions",
    offers_headline: cms?.offers_headline || "Three distinct ways institutions work with Paradigm.",
    offers_sub: cms?.offers_sub || "Each is a different application of the same investment process.",
    offer_1_label: cms?.offer_1_label || "Investment Mandates",
    offer_1_title: cms?.offer_1_title || "Existing strategies. Institutional quality.",
    offer_1_body: cms?.offer_1_body || "Large Cap Value. Domestic All-Cap All-Style. International Developed. World Value. Small Cap Domestic. Each strategy built from active market data. Each portfolio systematically positioned toward current market leadership within the mandate.",
    offer_2_label: cms?.offer_2_label || "Custom Mandates",
    offer_2_title: cms?.offer_2_title || "Any specification. Built to order.",
    offer_2_body: cms?.offer_2_body || "Paradigm builds custom strategies to institutional specification. Any style, any geography, any thematic or ESG overlay. The same collective intelligence process — applied to the mandate the institution defines. No off-the-shelf products.",
    offer_3_label: cms?.offer_3_label || "Strategic Partnerships",
    offer_3_title: cms?.offer_3_title || "Platform. Sub-advisory. Distribution.",
    offer_3_body: cms?.offer_3_body || "Paradigm is actively building strategic relationships with aggregators, OCIOs, and institutional platforms. Portfolio as a Service — product manufacturing, sub-advisory, and white-label delivery — at institutional scale.",
    platform_eyebrow: cms?.platform_eyebrow || "The Platform",
    platform_para1: cms?.platform_para1 || "One platform. Three capabilities. Custom active strategies, SMA conversion, and direct and custom indexing — fully integrated. Customization, personalization, and tax-loss harvesting run across all three — at the individual account level. Institutions operate the platform. Paradigm provides the investment intelligence and the infrastructure.",
    platform_para2: cms?.platform_para2 || "For institutions managing assets across multiple mandates and account types, the operational consequence is significant. One process. One relationship. One coherent investment narrative across every client, every committee, and every regulatory filing that asks how the portfolio is positioned and why.",
    proof_eyebrow: cms?.proof_eyebrow || "Proven Over 35 Years",
    proof_body: cms?.proof_body || "Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history. 65 of the nation's top 100 US pension funds have worked with Paradigm.",
    proof_bridge: cms?.proof_bridge || "The same intelligence is now structured for the institutional partnerships that define what comes next.",
    cta_title: cms?.cta_title || "Paradigm is actively building strategic relationships with institutional investors, pension funds, endowments, and platforms who want a different approach to portfolio construction.",
    cta_email: cms?.cta_email || "jef@paradigmasset.com",
    cta_phone: cms?.cta_phone || "917-991-3348",
    cta_button_label: cms?.cta_button_label || "Start a Conversation",
  };

  return (
    <>
      <Helmet>
        <title>For Institutions — Paradigm Asset Management</title>
        <meta name="description" content="35 years of institutional investment process. The same intelligence that served General Motors, AMEX, and the US Treasury — now structured for the partnerships that define what comes next." />
      </Helmet>

      <HeroSection
        heroVariant="institutions"
        eyebrow={c.hero_eyebrow}
        headline={c.hero_headline}
        sub={c.hero_sub}
        compact
        ctas={[{ label: c.hero_cta_label, to: '/contact', variant: 'outline' }]}
      />

      {/* Core Story — two halves: text left (off-white), illustration right; contained on white */}
      <div className="core-story-wrap">
      <section className="core-story-band core-story-band--contained">
        <div className="core-story-band-text">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.core_story_eyebrow}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {[
              c.core_story_1,
              c.core_story_2,
              c.core_story_3,
              c.core_story_4,
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
        <div className="core-story-band-art">
          <img
            src="/paradigm-corestory-institutional.svg"
            alt="Paradigm core story — institutional"
          />
        </div>
      </section>
      </div>

      {/* What Paradigm Offers Institutions */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>{c.offers_eyebrow}</p>
          <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '0.625rem' }}>
            {c.offers_headline}
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#637890', maxWidth: 560, margin: '0 0 3.5rem' }}>
            {c.offers_sub}
          </p>
          <ThreeCol blocks={[
            {
              label: c.offer_1_label,
              title: c.offer_1_title,
              body: c.offer_1_body,
            },
            {
              label: c.offer_2_label,
              title: c.offer_2_title,
              body: c.offer_2_body,
            },
            {
              label: c.offer_3_label,
              title: c.offer_3_title,
              body: c.offer_3_body,
            },
          ]} />
        </div>
      </section>

      {/* The Platform — faint emblem watermark left, text right */}
      <section className="platform-cap-section">
        <div className="platform-cap-inner">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.platform_eyebrow}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontFamily: 'Inter', fontSize: '1.25rem', lineHeight: 1.8, color: '#637890' }}>
              {c.platform_para1}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ fontFamily: 'Inter', fontSize: '1.25rem', lineHeight: 1.8, color: '#637890' }}>
              {c.platform_para2}
            </motion.p>
          </div>
        </div>
      </section>

      <CTAStrip
        variant="institutional"
        institutionalTitle={c.cta_title}
        institutionalEmail={c.cta_email}
        institutionalPhone={c.cta_phone}
        institutionalButtonLabel={c.cta_button_label}
      />
    </>
  );
}
