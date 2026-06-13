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
    trust_stat_3_sub: cms?.trust_stat_3_sub || "Domestic, international, global",
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
          <div className="what-we-see-split">
            {/* Left: anchored headline */}
            <div className="what-we-see-header">
              <p className="eyebrow">What We See</p>
              <h2 className="section-headline">
                {(() => {
                  // "Three observations." on line 1, the rest on line 2.
                  const m = c.what_we_see_headline.match(/^(.*?[.!?])\s+(.*)$/s);
                  if (!m) return c.what_we_see_headline;
                  return (
                    <>
                      {m[1]}
                      <br />
                      {m[2]}
                    </>
                  );
                })()}
              </h2>
            </div>

            {/* Right: numbered observations */}
            <div className="observations-grid">
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
                  className="observation-row"
                  style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline' }}
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
          <div className="platform-split">
            {/* Left: platform intro text */}
            <div className="platform-left">
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Platform</p>
              <p style={{ fontFamily: 'Inter', fontSize: '1.25rem', lineHeight: 1.8, color: '#637890', margin: 0 }}>
                {c.platform_text}
              </p>
            </div>

            {/* Right: Proven over 35 years proof block */}
            <ProofBlock variant="home" body={c.proof_body} bridge={c.proof_bridge} />
          </div>
        </div>
      </section>

      <CTAStrip variant="both" advisorText={c.cta_advisor_text} institutionText={c.cta_institution_text} />
    </>
  );
}
