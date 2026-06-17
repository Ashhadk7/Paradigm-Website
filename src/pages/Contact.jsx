import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, MapPin, ArrowUpRight } from 'lucide-react';

function ContactPath({ tag, headline, body, ctaLabel, ctaVariant, ctaHref, email, phone, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      style={{
        background: '#fff',
        border: '1px solid rgba(52,65,109,0.1)',
        borderRadius: 6,
        padding: '3rem 2.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        background: ctaVariant === 'gold'
          ? 'linear-gradient(90deg, #C4A25B, rgba(196,162,91,0.3))'
          : 'linear-gradient(90deg, #34416D, rgba(52,65,109,0.3))',
      }} />

      <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B' }}>{tag}</p>
      <h2 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.625rem', color: '#34416D', lineHeight: 1.25 }}>{headline}</h2>
      <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', lineHeight: 1.8, color: '#637890', flexGrow: 1 }}>{body}</p>

      <div style={{ marginTop: '0.5rem' }}>
        <a href={ctaHref} className={`btn-${ctaVariant}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          {ctaLabel} <ArrowUpRight size={14} />
        </a>
      </div>

      <div style={{ borderTop: '1px solid rgba(52,65,109,0.08)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <a href={`mailto:${email}`} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontFamily: 'Inter', fontSize: '0.875rem', color: '#34416D', textDecoration: 'none' }}>
          <Mail size={14} style={{ color: '#C4A25B', flexShrink: 0 }} /> {email}
        </a>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact — Paradigm Asset Management</title>
        <meta name="description" content="Start here. Book a 20-minute call or start a conversation. jef@paradigmasset.com" />
      </Helmet>

      {/* ── HERO — Minimal, light background, open and warm ── */}
      <section style={{
        background: '#F5F3EF',
        paddingTop: 'clamp(7rem, 14vh, 10rem)',
        paddingBottom: 'clamp(3rem, 8vh, 5rem)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle decorative circle — hidden on small screens */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          style={{
            position: 'absolute',
            top: '50%',
            right: 'clamp(-4rem, 5vw, 8%)',
            width: 'clamp(180px, 25vw, 320px)',
            height: 'clamp(180px, 25vw, 320px)',
            borderRadius: '50%',
            border: '1px solid rgba(196,162,91,0.1)',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem', width: '100%' }}>
          <motion.h1
            initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              fontFamily: 'Source Serif 4, Georgia, serif',
              fontSize: 'clamp(2.75rem, 8vw, 6.5rem)',
              fontWeight: 700,
              color: '#34416D',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}
          >
            Start here.
          </motion.h1>

          {/* Gold accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            style={{
              height: 2,
              background: 'linear-gradient(90deg, #C4A25B 0%, transparent 60%)',
              marginTop: '1.5rem',
              maxWidth: 120,
              transformOrigin: 'left',
            }}
          />
        </div>
      </section>

      {/* ── TWO PATHS — Equal visual weight ── */}
      <section className="section-offwhite">
        <div className="section-inner" style={{ paddingTop: '4.5rem', paddingBottom: '4.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <ContactPath
              tag="For Advisors & Multi-Family Offices"
              headline="Book a 20-Minute Call"
              body="See what a portfolio built from collective market intelligence looks like for your practice. A 20-minute call is enough to know whether this fits what you are building for your clients."
              ctaLabel="Book a 20-Minute Call"
              ctaVariant="gold"
              ctaHref="mailto:jef@paradigmasset.com?subject=20-Minute Call Request"
              email="jef@paradigmasset.com"
              delay={0}
            />
            <ContactPath
              tag="For Institutions & Strategic Partners"
              headline="Start a Conversation"
              body="Paradigm is actively building strategic relationships with institutional investors, family offices, OCIOs, and platforms. If you are exploring what a partnership looks like, the right first step is a conversation."
              ctaLabel="Start a Conversation"
              ctaVariant="outline-navy"
              ctaHref="mailto:jef@paradigmasset.com?subject=Institutional Inquiry"
              email="jef@paradigmasset.com"
              delay={0.12}
            />
          </div>

          {/* ── DIRECT CONTACT ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              background: '#34416D',
              borderRadius: 6,
              padding: 'clamp(1.75rem, 4vw, 3rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.875rem' }}>Direct Contact</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#F5F3EF', marginBottom: '0.25rem' }}>James Francis</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.8125rem', color: 'rgba(245,243,239,0.6)' }}>Founder & CEO</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              <a href="mailto:jef@paradigmasset.com" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontFamily: 'Inter', fontSize: '1rem', color: '#C4A25B', textDecoration: 'none' }}>
                <Mail size={15} style={{ opacity: 0.7 }} /> jef@paradigmasset.com
              </a>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem' }}>
              <MapPin size={15} style={{ color: 'rgba(245,243,239,0.4)', flexShrink: 0, marginTop: 3 }} />
              <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: 'rgba(245,243,239,0.55)', lineHeight: 1.7 }}>
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
