import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
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

// Deterministic PRNG (mulberry32) so bubble positions stay stable across renders.
function makeRng(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Scatter `count` bubbles uniformly inside an annular band [rInner, rOuter].
// Each bubble also carries drift parameters so it can rise + wobble like a
// real bubble in liquid (consumed by BubbleField below).
function generateBubbles(count, rInner, rOuter, seed, baseSize) {
  const rng = makeRng(seed);
  const cx = 250;
  const cy = 250;
  const bubbles = [];
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    // sqrt for uniform area distribution within the annulus
    const r = Math.sqrt(rng() * (rOuter * rOuter - rInner * rInner) + rInner * rInner);
    const size = baseSize * (0.5 + rng() * 0.9);
    bubbles.push({
      cx: cx + Math.cos(angle) * r,
      cy: cy + Math.sin(angle) * r,
      size,
      // how far this bubble rises over its loop (bigger bubbles rise a bit more)
      rise: 22 + rng() * 34 + size * 0.6,
      // horizontal wobble amplitude and phase
      sway: 4 + rng() * 9,
      swayDir: rng() < 0.5 ? -1 : 1,
      delay: rng() * 6.0,
      duration: 6.0 + rng() * 5.0,
      // subtle size breathing
      pulse: 0.12 + rng() * 0.16,
    });
  }
  return bubbles;
}

// Staged narrowing sequence: bubbles fill the FULL disc of the active ring,
// dropping in count as the universe narrows. Labels appear in sync per stage.
// 0: All Data (grey) 300 · 1: Some Data (blue) 150 · 2: Select Data (navy) 50
// Staged narrowing sequence: bubbles fill the FULL disc of the active ring,
// dropping in count as the universe narrows. Labels appear centered.
// labelLines: split across rows so a larger label still fits the smaller ring.
const STAGES = [
  { ring: 0, labelLines: ['All Data'],        clipR: 240, bubbles: generateBubbles(300, 0, 226, 1011, 8.0), strokeColor: 'rgba(255,255,255,0.8)', glowColor: 'rgba(255,255,255,1)', fillColor: 'rgba(255,255,255,0.45)', labelFill: '#ffffff', labelHalo: '#1a2240' },
  { ring: 1, labelLines: ['Some Data'],       clipR: 170, bubbles: generateBubbles(150, 0, 152, 2027, 12.0), strokeColor: 'rgba(255,255,255,0.8)', glowColor: 'rgba(255,255,255,1)', fillColor: 'rgba(255,255,255,0.45)', labelFill: '#ffffff', labelHalo: '#1a2240' },
  { ring: 2, labelLines: ['Select', 'Data'],  clipR: 100, bubbles: generateBubbles(9, 0, 80, 3041, 16.0), strokeColor: 'rgba(255,255,255,0.8)', glowColor: 'rgba(255,255,255,1)', fillColor: 'rgba(255,255,255,0.45)', labelFill: '#ffffff', labelHalo: '#1a2240' },
];

const STAGE_DURATION = 12000; // ms each stage holds before advancing

function BubbleField({ bubbles, strokeColor, glowColor, fillColor, clipId }) {
  return (
    <g clipPath={clipId ? `url(#${clipId})` : undefined}>
      {bubbles.map((b, i) => {
        const sway = b.sway * b.swayDir;
        return (
          <motion.circle
            key={i}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={Math.max(1, b.size * 0.15)}
            style={{ filter: `drop-shadow(0px 0px 4px ${glowColor})` }}
            initial={{ cx: b.cx, cy: b.cy, r: b.size, opacity: 0 }}
            animate={{
              // rise upward (cy decreases) over the loop
              cy: [b.cy, b.cy - b.rise * 0.35, b.cy - b.rise * 0.7, b.cy - b.rise],
              // wobble left/right like a real bubble
              cx: [b.cx, b.cx + sway, b.cx - sway * 0.6, b.cx],
              // gentle size breathing
              r: [b.size, b.size * (1 + b.pulse), b.size, b.size * (1 + b.pulse * 0.5)],
              // fade in, hold, fade out as it reaches the top
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              times: [0, 0.15, 0.85, 1],
            }}
          />
        );
      })}
    </g>
  );
}

function AnimatedOrbit() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, STAGE_DURATION);
    return () => clearInterval(id);
  }, []);

  // Rings reveal progressively: ring N is visible once we've reached its stage,
  // and stays visible through the rest of the sequence.
  const ringVisible = (ring) => stage >= ring;
  const active = STAGES[stage];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <svg
        viewBox="0 0 500 500"
        aria-hidden="true"
        style={{ width: '100%', maxWidth: 620, display: 'block', margin: '0 auto' }}
      >
        {/* Clip paths keep each stage's bubbles inside its ring as they rise */}
        <defs>
          <clipPath id="clip-ring-0"><circle cx={250} cy={250} r={238} /></clipPath>
          <clipPath id="clip-ring-1"><circle cx={250} cy={250} r={168} /></clipPath>
          <clipPath id="clip-ring-2"><circle cx={250} cy={250} r={98} /></clipPath>
        </defs>

        {/* Filled layered rings — revealed progressively as the sequence narrows */}
        <motion.circle cx={250} cy={250} r={240} fill="#7E8CB5"
          animate={{ opacity: ringVisible(0) ? 1 : 0 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
        />
        <motion.circle cx={250} cy={250} r={170} fill="#34416D"
          initial={{ opacity: 0 }}
          animate={{ opacity: ringVisible(1) ? 1 : 0, scale: ringVisible(1) ? 1 : 0.85 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <motion.circle cx={250} cy={250} r={100} fill="#C4A25B"
          initial={{ opacity: 0 }}
          animate={{ opacity: ringVisible(2) ? 1 : 0, scale: ringVisible(2) ? 1 : 0.85 }}
          transition={{ duration: 2.5, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        {/* Bubble field + label for the current stage only (cross-fade between stages) */}
        <AnimatePresence mode="wait">
          <motion.g
            key={stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          >
            <BubbleField bubbles={active.bubbles} strokeColor={active.strokeColor} glowColor={active.glowColor} fillColor={active.fillColor} clipId={`clip-ring-${active.ring}`} />
            {active.labelLines && (
              <text
                x={250}
                y={250}
                textAnchor="middle"
                dominantBaseline="central"
                fill={active.labelFill}
                stroke={active.labelHalo}
                strokeWidth={5}
                fontFamily="Inter, sans-serif"
                fontSize="30"
                fontWeight="700"
                letterSpacing="2.5"
                style={{ pointerEvents: 'none', paintOrder: 'stroke fill', strokeLinejoin: 'round' }}
              >
                {active.labelLines.map((line, i) => (
                  <tspan
                    key={i}
                    x={250}
                    // vertically center the block: shift up half the total line span
                    dy={i === 0 ? `${-(active.labelLines.length - 1) * 0.6}em` : '1.2em'}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
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
          <div className="what-we-see-header" style={{ marginBottom: '3.5rem' }}>
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
