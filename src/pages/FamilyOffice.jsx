import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import CTAStrip from '../components/CTAStrip';
import { useContent } from '../lib/useContent';

function ThreeCol({ blocks }) {
  return (
    // Framed full-width band: first cell flush-left (aligns with the section
    // headline), last cell flush-right, equal-height cells with dividers.
    <div className="outcomes-band">
      {blocks.map((b, i) => (
        <motion.div key={i}
          className="outcome-cell"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1, duration: 0.5 }}
        >
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.875rem' }}>{b.label}</p>
          <h3 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.45rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.3 }}>{b.title}</h3>
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.75, color: '#637890', margin: 0 }}>{b.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

export default function FamilyOffice() {
  const { content: cms } = useContent('familyoffice');

  const c = {
    hero_eyebrow: cms?.hero_eyebrow || "For Multi-Family Offices & OCIOs",
    hero_headline: cms?.hero_headline || "Your clients expect portfolios built for them specifically. Most platforms offer portfolios built for everyone. There is a different approach.",
    hero_sub: cms?.hero_sub || "Paradigm builds portfolios to your specification for any client mandate. Your investment team operates the platform.",
    hero_cta_label: cms?.hero_cta_label || "Start a Conversation",
    core_story_eyebrow: cms?.core_story_eyebrow || "The Core Story",
    core_story_1: cms?.core_story_1 || "Every active strategy operates within the boundaries of its expertise. A deep value manager knows deep value. A quality growth manager has a genuine edge in quality growth. That specialization is a real edge. It is also a structural constraint: when market leadership shifts outside those boundaries, the strategy lags and waits.",
    core_story_2: cms?.core_story_2 || "Most family offices manage this by diversifying across managers and styles. It is a reasonable approach. It is also operationally complex — multiple manager relationships, multiple mandates to monitor, multiple performance narratives to maintain for clients across the family structure.",
    core_story_3: cms?.core_story_3 || "Paradigm identifies where regime leadership is forming within each mandate and qualifies that signal through collective intelligence. From that signal Paradigm builds a Portfolio Blueprint — a portfolio whose characteristics match what the market is rewarding within the mandate right now. Your investment team defines the parameters. Paradigm manufactures the portfolio. Your clients see your firm's process.",
    core_story_4: cms?.core_story_4 || "The result is institutional-quality portfolio construction at the mandate level — without the overhead of building that capability in-house.",
    offers_eyebrow: cms?.offers_eyebrow || "What Paradigm Offers Family Offices",
    offers_headline: cms?.offers_headline || "Three applications of the same capability.",
    offers_sub: cms?.offers_sub || "Each addresses a specific operational or investment challenge for multi-family offices.",
    offer_1_label: cms?.offer_1_label || "Custom Mandates",
    offer_1_title: cms?.offer_1_title || "Built to your specification.",
    offer_1_body: cms?.offer_1_body || "Every portfolio starts with the mandate your investment team defines. Style, geography, factor tilts, ESG constraints, thematic exposure. Paradigm identifies regime leadership within that mandate and builds the Portfolio Blueprint from the qualified collective intelligence signal.",
    offer_2_label: cms?.offer_2_label || "Platform Operations",
    offer_2_title: cms?.offer_2_title || "You operate it. Paradigm enables it.",
    offer_2_body: cms?.offer_2_body || "Customization, personalization, and tax-loss harvesting run across custom active, SMA conversion, and direct indexing — at the individual client account level. Your investment team runs these tools. Paradigm provides the infrastructure and the investment intelligence.",
    offer_3_label: cms?.offer_3_label || "White Glove Build",
    offer_3_title: cms?.offer_3_title || "We build it. You run it.",
    offer_3_body: cms?.offer_3_body || "Paradigm builds the portfolio to your specification. It sits on the platform. Your team operates the personalization and tax-loss harvesting from there. The investment process is yours. The construction is Paradigm's. Your clients see your firm's name on everything.",
    platform_ops_title: cms?.platform_ops_title || "The Operational Consequence",
    platform_ops_body: cms?.platform_ops_body || "Most multi-family offices manage active mandates through relationships with multiple style-specific managers. Each brings genuine expertise within their domain. Each also brings coordination overhead — performance monitoring across multiple mandates, attribution reporting across multiple accounts, and a different investment rationale for each manager in every client review.",
    platform_ops_body_2: cms?.platform_ops_body_2 || "Paradigm consolidates that into one process. One relationship. One coherent investment narrative across every client, every mandate, and every committee meeting that asks how the portfolio is positioned and why.",
    proof_body: cms?.proof_body || "Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history.",
    proof_bridge: cms?.proof_bridge || "The same investment intelligence is now available to multi-family offices and family office platforms.",
    cta_title: cms?.cta_title || "Paradigm builds portfolios the way your clients expect them to be built — to their specific mandate, informed by current market intelligence, presented as your firm's own process.",
    cta_email: cms?.cta_email || "jef@paradigmasset.com",
    cta_phone: cms?.cta_phone || "917-991-3348",
    cta_button_label: cms?.cta_button_label || "Start a Conversation",
  };

  return (
    <>
      <Helmet>
        <title>For Family Offices — Paradigm Asset Management</title>
        <meta name="description" content="Paradigm builds portfolios to your specification for any client mandate — using collective intelligence to identify regime leadership. Your clients see your process." />
      </Helmet>

      <HeroSection
        eyebrow={c.hero_eyebrow}
        headline={c.hero_headline}
        sub={c.hero_sub}
        compact
        ctas={[{ label: c.hero_cta_label, to: '/contact', variant: 'outline' }]}
      />

      {/* Core Story — two halves: text left (off-white), illustration right */}
      <section className="core-story-band">
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
            src="/paradigm-corestory-family-office.svg"
            alt="Paradigm core story — family offices"
          />
        </div>
      </section>

      {/* What Paradigm Offers Family Offices */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>{c.offers_eyebrow}</p>
          <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '0.625rem' }}>
            {c.offers_headline}
          </h2>
          <p className="section-sub-oneline" style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#637890', margin: '0 0 3.5rem' }}>
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

      {/* Operational Consequence — faint emblem watermark left, text right */}
      <section className="platform-cap-section">
        <div className="platform-cap-inner">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.platform_ops_title}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              style={{ fontFamily: 'Inter', fontSize: '1.25rem', lineHeight: 1.8, color: '#637890' }}>
              {c.platform_ops_body}
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              style={{ fontFamily: 'Inter', fontSize: '1.25rem', lineHeight: 1.8, color: '#637890' }}>
              {c.platform_ops_body_2}
            </motion.p>
          </div>
        </div>
      </section>

      <CTAStrip
        variant="mfo"
        mfoTitle={c.cta_title}
        mfoEmail={c.cta_email}
        mfoPhone={c.cta_phone}
        mfoButtonLabel={c.cta_button_label}
      />
    </>
  );
}
