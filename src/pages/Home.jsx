import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import HeroSection from '../components/HeroSection';
import ProofBlock from '../components/ProofBlock';
import CTAStrip from '../components/CTAStrip';
import { useContent } from '../lib/useContent';
import { usePresentation } from '../lib/usePresentation';

function Stat({ value, label }) {
  return (
    <motion.div
      className="home-stat"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <strong>{value}</strong>
      <span>{label}</span>
    </motion.div>
  );
}

const LEGEND = [
  { label: 'ALL DATA', sub: 'Active market data universe', gold: false },
  { label: 'SOME DATA', sub: 'Mandate-specific dataset', gold: false },
  { label: 'SELECT DATA', sub: 'Regime leadership cluster', gold: false },
  { label: 'PORTFOLIO BLUEPRINT', sub: 'The confirmed signal', gold: true },
];

function AnimatedOrbit() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <svg
        viewBox="0 0 300 300"
        aria-hidden="true"
        style={{ width: '100%', maxWidth: 280, display: 'block', margin: '0 auto' }}
      >
        <motion.circle cx={150} cy={150} r={133} stroke="#34416D" fill="none" strokeWidth={1}
          variants={{ hidden: { opacity: 0.7 }, visible: { opacity: 0.08, transition: { delay: 0.2, duration: 1.2 } } }}
        />
        <motion.circle cx={150} cy={150} r={95} stroke="#34416D" fill="none" strokeWidth={1.5}
          variants={{ hidden: { opacity: 0.7 }, visible: { opacity: 0.22, transition: { delay: 0.45, duration: 1.0 } } }}
        />
        <motion.circle cx={150} cy={150} r={56} stroke="#34416D" fill="none" strokeWidth={2}
          variants={{ hidden: { opacity: 0.7 }, visible: { opacity: 0.55, transition: { delay: 0.65, duration: 0.8 } } }}
        />
        <motion.circle
          cx={150} cy={150} r={24}
          fill="#C4A25B"
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          variants={{ hidden: { opacity: 0, scale: 0.4 }, visible: { opacity: 1, scale: 1, transition: { delay: 0.9, duration: 0.6, type: 'spring', stiffness: 180 } } }}
        />
        <motion.text x={150} y={154} textAnchor="middle" fill="#fff"
          fontFamily="Inter, sans-serif" fontSize="8" fontWeight="700" letterSpacing="1.5"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { delay: 1.1, duration: 0.4 } } }}
        >
          PB
        </motion.text>
      </svg>

      <div style={{ marginTop: '2.5rem', display: 'flex', flexDirection: 'column' }}>
        {LEGEND.map(({ label, sub, gold }, i) => (
          <motion.div
            key={label}
            variants={{ hidden: { opacity: 0, x: 10 }, visible: { opacity: 1, x: 0, transition: { delay: 0.25 + i * 0.1, duration: 0.4 } } }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem 0',
              borderBottom: i < 3 ? '1px solid rgba(52,65,109,0.07)' : 'none',
            }}
          >
            <span style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.6rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: gold ? '#C4A25B' : 'rgba(52,65,109,0.45)',
              minWidth: 128,
              flexShrink: 0,
            }}>
              {label}
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.8125rem', color: '#637890', lineHeight: 1.5 }}>
              {sub}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { content: cms } = useContent('home');
  const presentation = usePresentation('home');

  const c = {
    // Hero
    hero_eyebrow: cms?.hero_eyebrow || "Institutional Portfolio Infrastructure for the Next Generation of Wealth Platforms",
    hero_headline: cms?.hero_headline || "The collective intelligence of the market.\nBuilt into every portfolio.",
    hero_sub: cms?.hero_sub || "Paradigm identifies where market leadership is forming — right now, within each mandate — and builds portfolios that reflect it. Portfolios that can move as leadership moves.",
    // Trust Strip
    trust_stat_1_value: cms?.trust_stat_1_value || "35 Years",
    trust_stat_1_label: cms?.trust_stat_1_label || "Founded 1990",
    trust_stat_2_value: cms?.trust_stat_2_value || "65 of the top 100",
    trust_stat_2_label: cms?.trust_stat_2_label || "U.S. pension funds served",
    trust_stat_3_value: cms?.trust_stat_3_value || "6",
    trust_stat_3_label: cms?.trust_stat_3_label || "Equity strategies",
    trust_stat_3_sub: cms?.trust_stat_3_sub || "Funded — domestic, international, global",
    trust_stat_4_value: cms?.trust_stat_4_value || "$7B+",
    trust_stat_4_label: cms?.trust_stat_4_label || "Cumulative AUM",
    trust_stat_5_value: cms?.trust_stat_5_value || "100%",
    trust_stat_5_label: cms?.trust_stat_5_label || "Employee owned",
    // What We See
    what_we_see_headline: cms?.what_we_see_headline || "Three observations. Thirty-five years. The foundation behind every portfolio Paradigm builds.",
    obs_1: cms?.obs_1 || "No single mind sees everything the market knows. No single dataset captures everything experts observe. No single system processes both at scale. Dynamic Collective Intelligence is what emerges when human expertise, vast market data, and computing power are combined systematically — a new intelligence that surpasses any individual component.",
    obs_2: cms?.obs_2 || "Every specialist performs well when market conditions align with their expertise — and faces headwinds when they shift. This is not a failure of skill. It is the inherent structure of specialization. When leadership moves away from a strategy's domain, the strategy waits. So do its clients.",
    obs_3: cms?.obs_3 || "Paradigm identifies where regime leadership is forming within each mandate and qualifies that signal through collective intelligence. The result is a Portfolio Blueprint — a portfolio built from the confirmed consensus of what the market is rewarding right now.",
    // The Story
    story_1: cms?.story_1 || "Every active strategy operates within the boundaries of its expertise. A deep value manager knows deep value with precision built over years. A quality growth manager has a genuine edge in quality growth. That specialization is the source of their advantage — and the boundary they cannot cross without leaving behind what they actually know how to do.",
    story_2: cms?.story_2 || "When market leadership moves outside those boundaries, the strategy lags. Not because of a mistake. Because following the rotation would mean operating outside the domain of genuine competence. Their clients wait for the cycle to return.",
    story_3: cms?.story_3 || "Paradigm reads active market data to identify where leadership is forming within each mandate right now — and constructs portfolios from that signal. Not anchored to any single approach. Not waiting for a cycle to reverse.",
    story_4: cms?.story_4 || "No single strategy can do this by definition. To follow the rotation, it would have to leave the domain of its own expertise.",
    // The Platform
    platform_text: cms?.platform_text || "One platform. Three capabilities. Custom active strategies built to specification, SMA conversion of existing fund exposures into customizable tax-aware portfolios, and direct and custom indexing at scale. Customization, personalization, and tax-loss harvesting run across all three — at the individual client level. Built for advisors and institutions who want the full capability without splitting it across multiple vendors.",
    // Proof
    proof_body: cms?.proof_body || "Over 35 years Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury. 65 of the nation's top 100 US pension funds have worked with Paradigm.",
    proof_bridge: cms?.proof_bridge || "The same intelligence is now accessible to advisors and institutional partners.",
    // Closing CTA
    cta_advisor_text: cms?.cta_advisor_text || "See what a portfolio built from collective intelligence looks like for your practice. Worth 20 minutes.",
    cta_institution_text: cms?.cta_institution_text || "Paradigm is actively building strategic relationships with family offices, OCIOs, and institutional partners. Start a conversation.",
  };

  return (
    <>
      <Helmet>
        <title>Paradigm Asset Management — The Collective Intelligence of the Market</title>
        <meta name="description" content={c.hero_sub} />
      </Helmet>

      <HeroSection
        eyebrow={c.hero_eyebrow}
        headline={c.hero_headline}
        sub={c.hero_sub}
        appearance={presentation}

        ctas={[
          { label: 'For Advisors', to: '/advisors', variant: 'gold' },
          { label: 'For Family Offices', to: '/familyoffice', variant: 'navy' },
          { label: 'For Institutions', to: '/institutions', variant: 'outline' },
        ]}
      />

      <section className={`home-proof-band home-proof-band--${presentation.trust_band_density}`}>
        <div className="home-proof-inner">
          <Stat value={c.trust_stat_1_value} label={c.trust_stat_1_label} />
          <Stat value={c.trust_stat_2_value} label={c.trust_stat_2_label} />
          <Stat value={c.trust_stat_3_value} label={<>{c.trust_stat_3_label}<br /><span className="stat-sub">{c.trust_stat_3_sub}</span></>} />
          <Stat value={c.trust_stat_4_value} label={c.trust_stat_4_label} />
          <Stat value={c.trust_stat_5_value} label={c.trust_stat_5_label} />
        </div>
      </section>

      {/* ── WHAT WE SEE ── */}
      <section className="section-white">
        <div className="section-inner">
          <div style={{ marginBottom: '3.5rem' }}>
            <p className="eyebrow">What We See</p>
            <h2 className="section-headline" style={{ maxWidth: 640 }}>
              {c.what_we_see_headline}
            </h2>
          </div>

          <div className="what-we-see-grid">
            {/* Left: numbered observations */}
            <div style={{ maxWidth: 540 }}>
              {[
                { num: '01', body: c.obs_1 },
                { num: '02', body: c.obs_2 },
                { num: '03', body: c.obs_3 },
              ].map(({ num, body }, i) => (
                <motion.div
                  key={num}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  style={{ display: 'flex', gap: '1.5rem', marginBottom: i < 2 ? '2.5rem' : 0 }}
                >
                  <span style={{
                    fontFamily: 'Source Serif 4, Georgia, serif',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: '#C4A25B',
                    lineHeight: 1,
                    minWidth: '2.5rem',
                    paddingTop: '0.15rem',
                    flexShrink: 0,
                  }}>
                    {num}
                  </span>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.0625rem',
                    lineHeight: 1.75,
                    color: '#637890',
                    margin: 0,
                  }}>
                    {body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Right: animated concentric circles */}
            <AnimatedOrbit />
          </div>
        </div>
      </section>

      {/* ── THE STORY ── */}
      <section className="section-white">
        <div className="section-inner">
          <div style={{ maxWidth: 720, display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {[c.story_1, c.story_2, c.story_3, c.story_4].map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}
              >
                {p}
              </motion.p>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE PLATFORM ── */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ maxWidth: 720 }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Platform</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                {c.platform_text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROOF ── */}
      <section className="section-offwhite compact-proof-section">
        <div className="section-inner">
          <ProofBlock variant="home" body={c.proof_body} bridge={c.proof_bridge} />
        </div>
      </section>

      <CTAStrip variant="both" advisorText={c.cta_advisor_text} institutionText={c.cta_institution_text} />
    </>
  );
}
