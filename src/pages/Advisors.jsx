import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import CTAStrip from '../components/CTAStrip';
import { useContent } from '../lib/useContent';

function ThreeCol({ blocks }) {
  return (
    // Framed full-width band: equal-height cells separated by full-height
    // vertical rules. First cell is flush-left (aligns with the section
    // headline "T"); last cell is flush-right (reaches the section edge), so
    // the row is balanced left-to-right regardless of each cell's copy length.
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

export default function Advisors() {
  const { content: cms } = useContent('advisors');

  const c = {
    hero_eyebrow: cms?.hero_eyebrow || "For Wealth Advisors & Independent RIAs",
    hero_headline: cms?.hero_headline || "Your clients are paying active management fees. Most of that capital is locked inside a single strategy's approach. There is a different way to invest it.",
    hero_sub: cms?.hero_sub || "Paradigm builds portfolios from active market data. Portfolios that can move within the mandate as market leadership moves. Under your name.",
    hero_cta_label: cms?.hero_cta_label || "Book a 20-Minute Call",
    core_story_eyebrow: cms?.core_story_eyebrow || "The Core Story",
    core_story_1: cms?.core_story_1 || "Every active strategy operates within the boundaries of its expertise. A deep value manager knows deep value. A quality growth manager has a genuine edge in quality growth. That specialization is not a limitation — it is the source of their edge. It is also the boundary they cannot cross without leaving what they genuinely know how to do.",
    core_story_2: cms?.core_story_2 || "When market leadership rotates outside those boundaries, the strategy lags. Not because of a mistake. Because following the rotation would mean leaving the domain of real competence. The clients who hired that strategy wait for the cycle to come back around.",
    core_story_3: cms?.core_story_3 || "Paradigm reads active market data to identify where leadership is forming within each mandate right now — and constructs portfolios from that signal. Not anchored to any single approach. Not waiting for a cycle to reverse.",
    core_story_4: cms?.core_story_4 || "The result is a portfolio that can move as leadership moves. Something no single strategy built around a defined approach can do — because doing it would mean abandoning the expertise that defines them.",
    practice_eyebrow: cms?.practice_eyebrow || "What This Means for Your Practice",
    practice_headline: cms?.practice_headline || "Three specific consequences",
    practice_sub: cms?.practice_sub || "For independent advisors and wealth managers.",
    consequence_1_label: cms?.consequence_1_label || "Consequence 01",
    consequence_1_title: cms?.consequence_1_title || "A proprietary investment story",
    consequence_1_body: cms?.consequence_1_body || "Your clients receive something no other advisor on any platform can replicate. Built from the market's full signal. Not any single strategy's approach. Presented under your name.",
    consequence_2_label: cms?.consequence_2_label || "Consequence 02",
    consequence_2_title: cms?.consequence_2_title || "Better economics",
    consequence_2_body: cms?.consequence_2_body || "Replace active strategies charging 65 to 100 basis points with portfolios built from collective market intelligence at a fraction of that cost. The margin difference stays with you.",
    consequence_3_label: cms?.consequence_3_label || "Consequence 03",
    consequence_3_title: cms?.consequence_3_title || "Tax efficiency on active strategies",
    consequence_3_body: cms?.consequence_3_body || "Run tax-loss harvesting on the active sleeve using the same workflow you already use for direct indexing. You operate it. Paradigm enables it. Your clients get better after-tax outcomes from both sleeves simultaneously.",
    platform_eyebrow: cms?.platform_eyebrow || "The Platform Capability",
    platform_headline: cms?.platform_headline || "One platform. Three capabilities.",
    platform_para1: cms?.platform_para1 || "Custom active strategies built to your specification, SMA conversion of existing fund exposures into customizable tax-aware portfolios, and direct and custom indexing at scale. Customization, personalization, and tax-loss harvesting run across all three — at the individual client level. You operate it. Paradigm enables it.",
    platform_para2: cms?.platform_para2 || "Most advisors manage these capabilities across multiple vendors, multiple processes, and multiple stories for clients. Paradigm consolidates them. One relationship. One interface. One coherent investment narrative for every client conversation.",
    delivery_eyebrow: cms?.delivery_eyebrow || "How It's Delivered",
    delivery_headline: cms?.delivery_headline || "Two ways to work with Paradigm.",
    delivery_sub: cms?.delivery_sub || "The capability is identical in both.",
    delivery_1_tag: cms?.delivery_1_tag || "Self-Serve Platform",
    delivery_1_tagline: cms?.delivery_1_tagline || "You build it. You run it.",
    delivery_1_body: cms?.delivery_1_body || "Access Paradigm's platform directly. Customize portfolios to your specification. Run customization, personalization, and tax-loss harvesting across both the active and indexed sleeves from a single interface. Your custodian. Your brand. Your decisions at every step.",
    delivery_2_tag: cms?.delivery_2_tag || "White Glove Service",
    delivery_2_tagline: cms?.delivery_2_tagline || "We build it. You run it.",
    delivery_2_body: cms?.delivery_2_body || "Paradigm builds the portfolio to your specification. It sits on the platform. You operate the personalization and tax-loss harvesting for your clients from there. The investment process is yours. The construction is Paradigm's. Your clients see your name on everything.",
    proof_body: cms?.proof_body || "Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history.",
    proof_bridge: cms?.proof_bridge || "The same investment intelligence is now available to independent advisors and multi-family offices.",
    cta_title: cms?.cta_title || "Worth 20 minutes to see what this looks like for your practice?",
    cta_contact_prefix: cms?.cta_contact_prefix || "Or reach us directly:",
    cta_email: cms?.cta_email || "jef@paradigmasset.com",
    cta_phone: cms?.cta_phone || "917-991-3348",
    cta_button_label: cms?.cta_button_label || "Book a 20-Minute Call",
  };

  return (
    <>
      <Helmet>
        <title>For Advisors — Paradigm Asset Management</title>
        <meta name="description" content="Paradigm builds portfolios from active market data — not anchored to any single approach. Portfolios that can move as market leadership moves. Under your name." />
      </Helmet>

      {/* ── HERO ── */}
      <HeroSection
        heroVariant="advisors"
        eyebrow={c.hero_eyebrow}
        headline={c.hero_headline}
        sub={c.hero_sub}
        compact
        ctas={[{ label: c.hero_cta_label, to: '/contact', variant: 'gold' }]}
      />

      {/* ── THE CORE STORY — two halves: text left (off-white), full-bleed art right ── */}
      <section className="core-story-band">
        {/* Left half: text on off-white (background unchanged) */}
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

        {/* Right half: illustration */}
        <div className="core-story-band-art">
          <img
            src="/paradigm-corestory-wealth-advisors.svg"
            alt="Paradigm core story — wealth advisors"
          />
        </div>
      </section>

      {/* ── WHAT THIS MEANS FOR YOUR PRACTICE ── */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>{c.practice_eyebrow}</p>
          <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '0.625rem' }}>
            {c.practice_headline}
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#637890', maxWidth: 560, margin: '0 0 3.5rem' }}>
            {c.practice_sub}
          </p>
          <ThreeCol blocks={[
            {
              label: c.consequence_1_label,
              title: c.consequence_1_title,
              body: c.consequence_1_body,
            },
            {
              label: c.consequence_2_label,
              title: c.consequence_2_title,
              body: c.consequence_2_body,
            },
            {
              label: c.consequence_3_label,
              title: c.consequence_3_title,
              body: c.consequence_3_body,
            },
          ]} />
        </div>
      </section>

      {/* ── THE PLATFORM CAPABILITY — faint emblem watermark bleeding off the
          left edge, text on the right; one continuous off-white band ── */}
      <section className="platform-cap-section">
        <div className="platform-cap-inner">
          <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.platform_eyebrow}</p>
          <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '1.75rem' }}>{c.platform_headline}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '1.25rem', lineHeight: 1.8, color: '#637890' }}>
              {c.platform_para1}
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '1.25rem', lineHeight: 1.8, color: '#637890' }}>
              {c.platform_para2}
            </p>
          </div>
        </div>
      </section>

      {/* ── HOW IT'S DELIVERED ── */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>{c.delivery_eyebrow}</p>
          <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '0.625rem' }}>
            {c.delivery_headline}
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#637890', maxWidth: 560, marginBottom: '3.5rem' }}>
            {c.delivery_sub}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                tag: c.delivery_1_tag,
                tagline: c.delivery_1_tagline,
                body: c.delivery_1_body,
                accent: true,
              },
              {
                tag: c.delivery_2_tag,
                tagline: c.delivery_2_tagline,
                body: c.delivery_2_body,
                accent: false,
              },
            ].map((card, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                style={{
                  background: card.accent ? '#34416D' : '#fff',
                  border: `1px solid ${card.accent ? '#34416D' : 'rgba(52,65,109,0.1)'}`,
                  borderRadius: 3,
                  padding: '2.5rem',
                }}
              >
                <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.625rem' }}>{card.tag}</p>
                <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.45rem', color: card.accent ? '#F5F3EF' : '#34416D', marginBottom: '1.125rem', lineHeight: 1.35 }}>{card.tagline}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.75, color: card.accent ? 'rgba(245,243,239,0.7)' : '#637890' }}>{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAStrip
        variant="advisor"
        advisorTitle={c.cta_title}
        advisorContactPrefix={c.cta_contact_prefix}
        advisorEmail={c.cta_email}
        advisorPhone={c.cta_phone}
        advisorButtonLabel={c.cta_button_label}
      />
    </>
  );
}
