import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { GLSLHills } from '../components/ui/glsl-hills';
import { useContent } from '../lib/useContent';

function TeamCard({ name, title, prev, bio, previousPrefix = 'Previous:' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        background: '#fff',
        border: '1px solid rgba(52,65,109,0.08)',
        borderRadius: 3,
        padding: '2rem',
      }}
    >
      {/* Placeholder avatar */}
      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#34416D', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontWeight: 700, fontSize: '1.25rem', color: '#C4A25B' }}>
          {name.split(' ').map(w => w[0]).join('')}
        </span>
      </div>
      <h3 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.45rem', color: '#34416D', marginBottom: '0.2rem' }}>{name}</h3>
      <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', fontWeight: 600, color: '#C4A25B', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{title}</p>
      {prev && <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#637890', marginBottom: '0.875rem' }}>{previousPrefix} {prev}</p>}
      {bio && <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.7, color: '#637890' }}>{bio}</p>}
    </motion.div>
  );
}

export default function About() {
  const { content: cms } = useContent('about');

  const c = {
    hero_headline: cms?.hero_headline || "Built on a single conviction.\nRun for 35 years.\nNow accessible to the partners and platforms that need it most.",
    firm_eyebrow: cms?.firm_eyebrow || "The Firm",
    firm_1: cms?.firm_1 || "Paradigm Asset Management was founded in 1990 on a specific conviction: that the collective intelligence embedded in active market data could be read, distilled, and expressed as portfolios that no individual strategy could construct on its own.",
    firm_2: cms?.firm_2 || "That conviction has not changed in 35 years. The data has grown. The process has been refined. The platform has been rebuilt for the scale and sophistication the market now requires. The conviction — that the collective signal of the market is more intelligent than any individual expression of it — is the same.",
    firm_3: cms?.firm_3 || "Paradigm is an SEC-registered investment adviser. One of the nation's oldest firms of its kind. Managing assets for institutional clients for 35 years before opening its platform to advisors and institutional partners.",
    james_title: cms?.james_title || "Founder & CEO",
    james_name: cms?.james_name || "James Francis",
    james_bio_1: cms?.james_bio_1 || "James Francis founded Paradigm in 1990 with a question that has driven the firm ever since: what does the market know collectively that no single strategy can know on its own?",
    james_bio_2: cms?.james_bio_2 || "The answer became CIPE — the Collective Intelligence Portfolio Engine, a process that reads active market data across thousands of strategies to identify where leadership is forming within each mandate. It has run continuously for 35 years through the full cycle of market regimes, serving institutional clients across pension funds, endowments, and government entities.",
    james_bio_3: cms?.james_bio_3 || "James is the author of Artificial Integrity: Leadership in an Age of Intelligent Systems.",
    james_image_url: cms?.james_image_url || "",
    james_image_alt: cms?.james_image_alt || "James Francis",
    james_placeholder_initials: cms?.james_placeholder_initials || "JF",
    james_placeholder_text: cms?.james_placeholder_text || "Photo Coming",
    team_eyebrow: cms?.team_eyebrow || "The Team",
    previous_prefix: cms?.previous_prefix || "Previous:",
    team_1_name: cms?.team_1_name || "James Francis",
    team_1_title: cms?.team_1_title || "Founder & CEO",
    team_1_prev: cms?.team_1_prev || "IBM, Shearson, Oppenheimer & Co.",
    team_1_bio: cms?.team_1_bio || "Business development, portfolio management, and firm strategy. Founded Paradigm in 1990.",
    team_2_name: cms?.team_2_name || "Gregory Pai",
    team_2_title: cms?.team_2_title || "Investment Strategist",
    team_2_prev: cms?.team_2_prev || "Price Waterhouse",
    team_2_bio: cms?.team_2_bio || "Extensive portfolio management, data science, and computing experience.",
    team_3_name: cms?.team_3_name || "Chaoxie Liu",
    team_3_title: cms?.team_3_title || "Data Scientist",
    team_3_prev: cms?.team_3_prev || "Australia and New Zealand Bank",
    team_3_bio: cms?.team_3_bio || "Model and algorithm development, coding, and data infrastructure.",
    team_4_name: cms?.team_4_name || "Jeffrey Marcus",
    team_4_title: cms?.team_4_title || "Operations",
    team_4_prev: cms?.team_4_prev || "Pension Investment Analyst, Warner Lambert",
    team_4_bio: cms?.team_4_bio || "Portfolio construction, optimization, trading, and performance attribution and reporting.",
    team_5_name: cms?.team_5_name || "Odalisse Sosa",
    team_5_title: cms?.team_5_title || "Operations",
    team_6_name: cms?.team_6_name || "Jarius DeWalt",
    team_6_title: cms?.team_6_title || "Team Member",
    advisory_eyebrow: cms?.advisory_eyebrow || "Advisory Board",
    advisor_1_name: cms?.advisor_1_name || "Robert Capaldi",
    advisor_1_title: cms?.advisor_1_title || "Advisor",
    advisor_1_bio: cms?.advisor_1_bio || "Former Senior Strategist to BlackRock's CEO.",
    advisor_2_name: cms?.advisor_2_name || "Natalie Turnow",
    advisor_2_title: cms?.advisor_2_title || "Advisor",
    advisor_2_bio: cms?.advisor_2_bio || "Former CIO, Calvert Funds.",
  };

  const clauses = c.hero_headline.split('\n');

  return (
    <>
      <Helmet>
        <title>About — Paradigm Asset Management</title>
        <meta name="description" content="Built on a single conviction. Run for 35 years. Now accessible to the partners and platforms that need it most." />
      </Helmet>

      {/* ── HERO — Serif H1, navy background, no subheading ── */}
      <section
        className="hero-section"
        style={{
          paddingTop: '5rem',
          paddingBottom: '3rem',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, opacity: 0.8, zIndex: 0 }}>
          <GLSLHills speed={0.3} cameraZ={130} />
        </div>

        <div className="hero-inner">
          <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
            <h1 className="display-headline" style={{ lineHeight: 1.1 }}>
              {clauses.map((clause, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.7,
                    delay: 0.3 + i * 0.25,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    display: 'block',
                    marginBottom: i < clauses.length - 1 ? '0.15em' : 0,
                  }}
                >
                  {clause}
                </motion.span>
              ))}
            </h1>

            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
              style={{
                height: 2,
                background: 'linear-gradient(90deg, #C4A25B 0%, transparent 70%)',
                marginTop: '2rem',
                maxWidth: 180,
                transformOrigin: 'left',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── THE FIRM ── */}
      <section className="section-white">
        <div className="section-inner">
          <div style={{ maxWidth: 720 }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.firm_eyebrow}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[
                c.firm_1,
                c.firm_2,
                c.firm_3,
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

      {/* ── JAMES FRANCIS — FOUNDER & CEO ── */}
      <section className="section-offwhite">
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>{c.james_title}</p>
              <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '1.75rem' }}>
                {c.james_name}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                  {c.james_bio_1}
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}
                  style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                  {c.james_bio_2}
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
                  style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                  {c.james_bio_3}
                </motion.p>
              </div>
            </div>
            {/* Portrait placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              {c.james_image_url ? (
                <img
                  src={c.james_image_url}
                  alt={c.james_image_alt}
                  style={{ width: 220, height: 260, objectFit: 'cover', borderRadius: 4 }}
                />
              ) : (
                <div style={{
                  width: 220, height: 260, background: '#34416D', borderRadius: 4,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem'
                }}>
                  <span style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontWeight: 700, fontSize: '3rem', color: '#C4A25B' }}>{c.james_placeholder_initials}</span>
                  <span style={{ fontFamily: 'Inter', fontSize: '1.0625rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.5)' }}>{c.james_placeholder_text}</span>
                </div>
              )}
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.45rem', color: '#34416D' }}>{c.james_name}</p>
                <p style={{ fontFamily: 'Inter', fontSize: '1.0625rem', color: '#C4A25B', fontWeight: 600 }}>{c.james_title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE TEAM ── */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>{c.team_eyebrow}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <TeamCard
              name={c.team_1_name}
              title={c.team_1_title}
              prev={c.team_1_prev}
              bio={c.team_1_bio}
              previousPrefix={c.previous_prefix}
            />
            <TeamCard
              name={c.team_2_name}
              title={c.team_2_title}
              prev={c.team_2_prev}
              bio={c.team_2_bio}
              previousPrefix={c.previous_prefix}
            />
            <TeamCard
              name={c.team_3_name}
              title={c.team_3_title}
              prev={c.team_3_prev}
              bio={c.team_3_bio}
              previousPrefix={c.previous_prefix}
            />
            <TeamCard
              name={c.team_4_name}
              title={c.team_4_title}
              prev={c.team_4_prev}
              bio={c.team_4_bio}
              previousPrefix={c.previous_prefix}
            />
            <TeamCard
              name={c.team_5_name}
              title={c.team_5_title}
              previousPrefix={c.previous_prefix}
            />
            <TeamCard
              name={c.team_6_name}
              title={c.team_6_title}
              previousPrefix={c.previous_prefix}
            />
          </div>

          {/* ── ADVISORY BOARD ── */}
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>{c.advisory_eyebrow}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <TeamCard
              name={c.advisor_1_name}
              title={c.advisor_1_title}
              bio={c.advisor_1_bio}
              previousPrefix={c.previous_prefix}
            />
            <TeamCard
              name={c.advisor_2_name}
              title={c.advisor_2_title}
              bio={c.advisor_2_bio}
              previousPrefix={c.previous_prefix}
            />
          </div>
        </div>
      </section>

    </>
  );
}
