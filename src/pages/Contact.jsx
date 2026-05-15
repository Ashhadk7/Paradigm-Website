import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

function ContactPath({ tag, headline, body, ctaLabel, ctaVariant, ctaHref, email, phone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        background: '#fff',
        border: '1px solid rgba(52,65,109,0.1)',
        borderRadius: 4,
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
    >
      <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B' }}>{tag}</p>
      <h2 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.5rem', color: '#34416D', lineHeight: 1.3 }}>{headline}</h2>
      <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.75, color: '#637890', flexGrow: 1 }}>{body}</p>
      <div style={{ marginTop: '0.5rem' }}>
        <a href={ctaHref} className={`btn-${ctaVariant}`} style={{ alignSelf: 'flex-start' }}>{ctaLabel}</a>
      </div>
      <div style={{ borderTop: '1px solid rgba(52,65,109,0.08)', paddingTop: '1.25rem' }}>
        <a href={`mailto:${email}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.875rem', color: '#34416D', textDecoration: 'none', marginBottom: '0.25rem' }}>{email}</a>
        <a href={`tel:+1${phone.replace(/\D/g, '')}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.875rem', color: '#637890', textDecoration: 'none' }}>{phone}</a>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact — Paradigm Asset Management</title>
        <meta name="description" content="Start here. Book a 20-minute call or start a conversation. jef@paradigmasset.com · 917-991-3348" />
      </Helmet>

      {/* ── HERO — Minimal, light background, not navy ── */}
      <section style={{
        background: '#F5F3EF',
        paddingTop: '9rem',
        paddingBottom: '4rem',
        borderBottom: '1px solid rgba(52,65,109,0.08)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: 'Source Serif 4, Georgia, serif',
              fontSize: 'clamp(3rem, 7vw, 5rem)',
              fontWeight: 700,
              color: '#34416D',
              lineHeight: 1.1,
            }}
          >
            Start here.
          </motion.h1>
        </div>
      </section>

      {/* ── TWO PATHS ── */}
      <section className="section-offwhite">
        <div className="section-inner" style={{ paddingTop: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <ContactPath
              tag="For Advisors & Multi-Family Offices"
              headline="Book a 20-Minute Call"
              body="See what a portfolio built from collective market intelligence looks like for your practice. A 20-minute call is enough to know whether this fits what you are building for your clients."
              ctaLabel="Book a 20-Minute Call"
              ctaVariant="gold"
              ctaHref="mailto:jef@paradigmasset.com?subject=20-Minute Call Request"
              email="jef@paradigmasset.com"
              phone="917-991-3348"
            />
            <ContactPath
              tag="For Institutions & Strategic Partners"
              headline="Start a Conversation"
              body="Paradigm is actively building strategic relationships with institutional investors, family offices, OCIOs, and platforms. If you are exploring what a partnership looks like, the right first step is a conversation."
              ctaLabel="Start a Conversation"
              ctaVariant="outline-navy"
              ctaHref="mailto:jef@paradigmasset.com?subject=Institutional Inquiry"
              email="jef@paradigmasset.com"
              phone="917-991-3348"
            />
          </div>

          {/* ── DIRECT CONTACT ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              background: '#34416D',
              borderRadius: 4,
              padding: '2.5rem 3rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              alignItems: 'start',
            }}
          >
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.75rem' }}>Direct Contact</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.25rem', color: '#F5F3EF', marginBottom: '0.25rem' }}>James Francis</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.8125rem', color: 'rgba(245,243,239,0.6)' }}>Founder & CEO</p>
            </div>
            <div>
              <a href="mailto:jef@paradigmasset.com" style={{ display: 'block', fontFamily: 'Inter', fontSize: '1rem', color: '#C4A25B', textDecoration: 'none', marginBottom: '0.375rem' }}>jef@paradigmasset.com</a>
              <a href="tel:9179913348" style={{ display: 'block', fontFamily: 'Inter', fontSize: '1rem', color: 'rgba(245,243,239,0.8)', textDecoration: 'none' }}>917-991-3348</a>
            </div>
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: 'rgba(245,243,239,0.55)', lineHeight: 1.65 }}>
                Paradigm Asset Management Co. LLC<br />
                1345 Avenue of the Americas<br />
                2nd Floor, Suite 107<br />
                New York, NY 10105
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
