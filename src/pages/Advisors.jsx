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

export default function Advisors() {
  return (
    <>
      <Helmet>
        <title>For Advisors — Paradigm Asset Management</title>
        <meta name="description" content="Paradigm builds portfolios from active market data — not anchored to any single approach. Portfolios that can move as market leadership moves. Under your name." />
      </Helmet>

      {/* ── HERO ── */}
      <HeroSection
        eyebrow="For Wealth Advisors & Independent RIAs"
        headline={"Your clients are paying active management fees. Most of that capital is locked inside a single strategy's approach. There is a different way to invest it."}
        sub="Paradigm builds portfolios from active market data — not anchored to any single approach. Portfolios that can move as market leadership moves. Under your name."
        ctas={[{ label: 'Book a 20-Minute Call', to: '/contact', variant: 'gold' }]}
      />

      {/* ── THE CORE STORY ── */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Core Story</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[
                "Every active strategy operates within the boundaries of its expertise. A deep value manager knows deep value. A quality growth manager has a genuine edge in quality growth. That specialization is not a limitation — it is the source of their edge. It is also the boundary they cannot cross without leaving what they genuinely know how to do.",
                "When market leadership rotates outside those boundaries, the strategy lags. Not because of a mistake. Because following the rotation would mean leaving the domain of real competence. The clients who hired that strategy wait for the cycle to come back around.",
                "Paradigm reads active market data to identify where leadership is forming within each mandate right now — and constructs portfolios from that signal. Not anchored to any single approach. Not waiting for a cycle to reverse.",
                "The result is a portfolio that can move as leadership moves. Something no single strategy built around a defined approach can do — because doing it would mean abandoning the expertise that defines them.",
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

      {/* ── WHAT THIS MEANS FOR YOUR PRACTICE ── */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem', textAlign: 'center' }}>What This Means for Your Practice</p>
          <h2 className="section-headline" style={{ color: '#34416D', textAlign: 'center', marginBottom: '0.625rem' }}>
            Three specific consequences
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', color: '#637890', textAlign: 'center', maxWidth: 480, margin: '0 auto 3.5rem' }}>
            For independent advisors and wealth managers.
          </p>
          <ThreeCol blocks={[
            {
              label: 'Consequence 01',
              title: 'A proprietary investment story',
              body: "Your clients receive something no other advisor on any platform can replicate. Built from the market's full signal. Not any single strategy's approach. Presented under your name.",
            },
            {
              label: 'Consequence 02',
              title: 'Better economics',
              body: 'Replace active strategies charging 65 to 100 basis points with portfolios built from collective market intelligence at a fraction of that cost. The margin difference stays with you.',
            },
            {
              label: 'Consequence 03',
              title: 'Tax efficiency on active strategies',
              body: 'Run tax-loss harvesting on the active sleeve using the same workflow you already use for direct indexing. You operate it. Paradigm enables it. Your clients get better after-tax outcomes from both sleeves simultaneously.',
            },
          ]} />
        </div>
      </section>

      {/* ── THE PLATFORM CAPABILITY ── */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Platform Capability</p>
            <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '1.75rem' }}>Active management and direct indexing.<br />One platform, fully integrated.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                Customization, personalization, and tax-loss harvesting run across both sleeves simultaneously — at the individual client level. <strong style={{ color: '#34416D', fontWeight: 600 }}>You operate it. Paradigm enables it.</strong>
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                Most advisors manage these capabilities across two vendors, two processes, and two different stories for clients. Paradigm consolidates both. One relationship. One interface. One coherent investment narrative for every client conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT'S DELIVERED ── */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem', textAlign: 'center' }}>How It's Delivered</p>
          <h2 className="section-headline" style={{ color: '#34416D', textAlign: 'center', marginBottom: '0.625rem' }}>
            Two ways to work with Paradigm.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', color: '#637890', textAlign: 'center', marginBottom: '3.5rem' }}>
            The capability is identical in both.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              {
                tag: 'Self-Serve Platform',
                tagline: 'You build it. You run it.',
                body: "Access Paradigm's platform directly. Customize portfolios to your specification. Run customization, personalization, and tax-loss harvesting across both the active and indexed sleeves from a single interface. Your custodian. Your brand. Your decisions at every step.",
                accent: true,
              },
              {
                tag: 'White Glove Service',
                tagline: 'We build it. You run it.',
                body: "Paradigm builds the portfolio to your specification. It sits on the platform. You operate the personalization and tax-loss harvesting for your clients from there. The investment process is yours. The construction is Paradigm's. Your clients see your name on everything.",
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
                <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.625rem' }}>{card.tag}</p>
                <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.25rem', color: card.accent ? '#F5F3EF' : '#34416D', marginBottom: '1.125rem', lineHeight: 1.35 }}>{card.tagline}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: card.accent ? 'rgba(245,243,239,0.7)' : '#637890' }}>{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section className="section-offwhite">
        <div className="section-inner" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
          <ProofBlock variant="advisor" />
        </div>
      </section>

      {/* ── CTA ── */}
      <CTAStrip variant="advisor" />
    </>
  );
}
