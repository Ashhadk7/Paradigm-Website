import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { GLSLHills } from '../components/ui/glsl-hills';

function TeamCard({ name, title, prev, bio }) {
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
      <h3 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.125rem', color: '#34416D', marginBottom: '0.2rem' }}>{name}</h3>
      <p style={{ fontFamily: 'Inter', fontSize: '0.8125rem', fontWeight: 600, color: '#C4A25B', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>{title}</p>
      {prev && <p style={{ fontFamily: 'Inter', fontSize: '0.75rem', color: '#637890', marginBottom: '0.875rem' }}>Previous: {prev}</p>}
      {bio && <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', lineHeight: 1.7, color: '#637890' }}>{bio}</p>}
    </motion.div>
  );
}

export default function About() {
  const clauses = [
    'Built on a single conviction.',
    'Run for 35 years.',
    'Now accessible to the partners and platforms that need it most.',
  ];

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
            {clauses.map((clause, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.7,
                  delay: 0.3 + i * 0.25,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              >
                <h1
                  className="display-headline"
                  style={{
                    marginBottom: i < clauses.length - 1 ? '0.15em' : 0,
                    lineHeight: 1.1,
                  }}
                >
                  {clause}
                </h1>
              </motion.div>
            ))}

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
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>The Firm</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {[
                "Paradigm Asset Management was founded in 1990 on a specific conviction: that the collective intelligence embedded in active market data could be read, distilled, and expressed as portfolios that no individual strategy could construct on its own.",
                "That conviction has not changed in 35 years. The data has grown. The process has been refined. The platform has been rebuilt for the scale and sophistication the market now requires. The conviction — that the collective signal of the market is more intelligent than any individual expression of it — is the same.",
                "Paradigm is an SEC-registered investment adviser. One of the nation's oldest firms of its kind. Managing assets for institutional clients for 35 years before opening its platform to advisors and institutional partners.",
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
              <p className="eyebrow" style={{ marginBottom: '1rem' }}>Founder & CEO</p>
              <h2 className="section-headline" style={{ color: '#34416D', marginBottom: '1.75rem' }}>
                James Francis
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                  James Francis founded Paradigm in 1990 with a question that has driven the firm ever since: what does the market know collectively that no single strategy can know on its own?
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.07 }}
                  style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                  The answer became CIPE — the Collective Intelligence Portfolio Engine, a process that reads active market data across thousands of strategies to identify where leadership is forming within each mandate. It has run continuously for 35 years through the full cycle of market regimes, serving institutional clients across pension funds, endowments, and government entities.
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.14 }}
                  style={{ fontFamily: 'Inter', fontSize: '1.0625rem', lineHeight: 1.8, color: '#637890' }}>
                  James is the author of <em>Artificial Integrity: Leadership in an Age of Intelligent Systems.</em>
                </motion.p>
              </div>
            </div>
            {/* Portrait placeholder */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{
                width: 220, height: 260, background: '#34416D', borderRadius: 4,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem'
              }}>
                <span style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontWeight: 700, fontSize: '3rem', color: '#C4A25B' }}>JF</span>
                <span style={{ fontFamily: 'Inter', fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(245,243,239,0.5)' }}>Photo Coming</span>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.125rem', color: '#34416D' }}>James Francis</p>
                <p style={{ fontFamily: 'Inter', fontSize: '0.8125rem', color: '#C4A25B', fontWeight: 600 }}>Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE TEAM ── */}
      <section className="section-white">
        <div className="section-inner">
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>The Team</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <TeamCard
              name="James Francis"
              title="Founder & CEO"
              prev="IBM, Shearson, Oppenheimer & Co."
              bio="Business development, portfolio management, and firm strategy. Founded Paradigm in 1990."
            />
            <TeamCard
              name="Gregory Pai"
              title="Investment Strategist"
              prev="Price Waterhouse"
              bio="Extensive portfolio management, data science, and computing experience."
            />
            <TeamCard
              name="Chaoxie Liu"
              title="Data Scientist"
              prev="Australia and New Zealand Bank"
              bio="Model and algorithm development, coding, and data infrastructure."
            />
            <TeamCard
              name="Jeffrey Marcus"
              title="Operations"
              prev="Pension Investment Analyst, Warner Lambert"
              bio="Portfolio construction, optimization, trading, and performance attribution and reporting."
            />
            <TeamCard
              name="Odalisse Sosa"
              title="Operations"
            />
            <TeamCard
              name="Jarius DeWalt"
              title="Team Member"
            />
          </div>

          {/* ── ADVISORY BOARD ── */}
          <p className="eyebrow" style={{ marginBottom: '0.875rem' }}>Advisory Board</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <TeamCard
              name="Robert Capaldi"
              title="Advisor"
              bio="Former Senior Strategist to BlackRock's CEO."
            />
            <TeamCard
              name="Natalie Turnow"
              title="Advisor"
              bio="Former CIO, Calvert Funds."
            />
          </div>
        </div>
      </section>

    </>
  );
}
