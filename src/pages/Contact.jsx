import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

function ContactPath({ tag, headline, body, ctaLabel, ctaVariant, email, phone }) {
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
      <div style={{ display: 'flex', gap: '0.875rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
        <a href="/contact#form" className={`btn-${ctaVariant}`} style={{ alignSelf: 'flex-start' }}>{ctaLabel}</a>
      </div>
      <div style={{ borderTop: '1px solid rgba(52,65,109,0.08)', paddingTop: '1.25rem' }}>
        <a href={`mailto:${email}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.875rem', color: '#34416D', textDecoration: 'none', marginBottom: '0.25rem' }}>{email}</a>
        <a href={`tel:+1${phone.replace(/\D/g,'')}`} style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.875rem', color: '#637890', textDecoration: 'none' }}>{phone}</a>
      </div>
    </motion.div>
  );
}

export default function Contact() {
  const [tab, setTab] = useState('advisor');
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Helmet>
        <title>Contact — Paradigm Asset Management</title>
        <meta name="description" content="Start here. Book a 20-minute call or start a conversation. jef@paradigmasset.com · 917-991-3348" />
      </Helmet>

      {/* Minimal hero — off-white, warm */}
      <section style={{
        background: '#F5F3EF',
        paddingTop: '9rem',
        paddingBottom: '4rem',
        borderBottom: '1px solid rgba(52,65,109,0.08)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="eyebrow" style={{ marginBottom: '1rem', color: '#34416D' }}>Get in Touch</p>
            <h1 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 700, color: '#34416D', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Start here.
            </h1>
            <p style={{ fontFamily: 'Inter', fontSize: '1.125rem', color: '#637890', maxWidth: 520, lineHeight: 1.7 }}>
              Two paths. Two asks. Direct contact always visible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Two Paths */}
      <section className="section-offwhite">
        <div className="section-inner" style={{ paddingTop: '4rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            <ContactPath
              tag="For Advisors & Multi-Family Offices"
              headline="Book a 20-Minute Call"
              body="See what a portfolio built from collective market intelligence looks like for your practice. A 20-minute call is enough to know whether this fits what you are building for your clients."
              ctaLabel="Book a 20-Minute Call"
              ctaVariant="gold"
              email="jef@paradigmasset.com"
              phone="917-991-3348"
            />
            <ContactPath
              tag="For Institutions & Strategic Partners"
              headline="Start a Conversation"
              body="Paradigm is actively building strategic relationships with institutional investors, family offices, OCIOs, and platforms. If you are exploring what a partnership looks like, the right first step is a conversation."
              ctaLabel="Start a Conversation"
              ctaVariant="outline-navy"
              email="jef@paradigmasset.com"
              phone="917-991-3348"
            />
          </div>

          {/* Direct Contact block */}
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
              marginBottom: '4rem',
            }}
          >
            <div>
              <p style={{ fontFamily: 'Inter', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '0.75rem' }}>Direct Contact</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.25rem', color: '#F5F3EF', marginBottom: '0.25rem' }}>James Francis</p>
              <p style={{ fontFamily: 'Inter', fontSize: '0.8125rem', color: 'rgba(245,243,239,0.6)' }}>Founder & CEO</p>
            </div>
            <div>
              <a href="mailto:jef@paradigmasset.com" style={{ display: 'block', fontFamily: 'Inter', fontSize: '1rem', color: '#C4A25B', textDecoration: 'none', marginBottom: '0.375rem' }}>jef@paradigmasset.com</a>
              <a href="tel:2127716100" style={{ display: 'block', fontFamily: 'Inter', fontSize: '1rem', color: 'rgba(245,243,239,0.8)', textDecoration: 'none', marginBottom: '0.25rem' }}>212.771.6100</a>
              <a href="tel:9179913348" style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.875rem', color: 'rgba(245,243,239,0.55)', textDecoration: 'none' }}>917-991-3348</a>
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

          {/* Optional structured inquiry form */}
          <div id="form" style={{ maxWidth: 640, margin: '0 auto' }}>
            <p className="eyebrow" style={{ marginBottom: '0.875rem', textAlign: 'center' }}>Leave a Structured Inquiry</p>
            <h2 className="section-headline" style={{ color: '#34416D', textAlign: 'center', marginBottom: '2.5rem' }}>Optional — use the form below</h2>

            {/* Tab */}
            <div style={{ display: 'flex', gap: '0', background: 'rgba(52,65,109,0.06)', borderRadius: 3, padding: 3, marginBottom: '2rem' }}>
              {['advisor', 'institutional'].map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1,
                  padding: '0.75rem',
                  border: 'none',
                  borderRadius: 2,
                  background: tab === t ? '#34416D' : 'transparent',
                  color: tab === t ? '#F5F3EF' : '#637890',
                  fontFamily: 'Inter',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  transition: 'all 0.2s',
                }}>
                  {t === 'advisor' ? 'Advisor / MFO' : 'Institutional'}
                </button>
              ))}
            </div>

            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '4rem 2rem', background: '#fff', borderRadius: 4, border: '1px solid rgba(52,65,109,0.08)' }}
              >
                <div style={{ width: 56, height: 56, background: 'rgba(196,162,91,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                  <Send size={24} style={{ color: '#C4A25B' }} />
                </div>
                <h3 style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.5rem', color: '#34416D', marginBottom: '0.5rem' }}>Inquiry Sent</h3>
                <p style={{ fontFamily: 'Inter', fontSize: '0.9375rem', color: '#637890' }}>
                  We'll be in touch within one business day.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#fff', borderRadius: 4, border: '1px solid rgba(52,65,109,0.08)', padding: '2.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  {['First Name', 'Last Name'].map(label => (
                    <div key={label}>
                      <label style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#637890', marginBottom: '0.5rem' }}>{label}</label>
                      <input required type="text" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid rgba(52,65,109,0.15)', borderRadius: 3, fontFamily: 'Inter', fontSize: '0.9375rem', color: '#2C2C2C', background: '#F5F3EF', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#637890', marginBottom: '0.5rem' }}>Email</label>
                  <input required type="email" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid rgba(52,65,109,0.15)', borderRadius: 3, fontFamily: 'Inter', fontSize: '0.9375rem', color: '#2C2C2C', background: '#F5F3EF', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#637890', marginBottom: '0.5rem' }}>
                    {tab === 'advisor' ? 'Firm Name' : 'Institution Name'}
                  </label>
                  <input required type="text" style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid rgba(52,65,109,0.15)', borderRadius: 3, fontFamily: 'Inter', fontSize: '0.9375rem', color: '#2C2C2C', background: '#F5F3EF', outline: 'none' }} />
                </div>
                {tab === 'advisor' && (
                  <div>
                    <label style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#637890', marginBottom: '0.5rem' }}>AUM Range</label>
                    <select style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid rgba(52,65,109,0.15)', borderRadius: 3, fontFamily: 'Inter', fontSize: '0.9375rem', color: '#637890', background: '#F5F3EF', outline: 'none', appearance: 'none' }}>
                      <option>Select a range</option>
                      <option>Under $50M</option>
                      <option>$50M – $250M</option>
                      <option>$250M – $1B</option>
                      <option>$1B+</option>
                    </select>
                  </div>
                )}
                <div>
                  <label style={{ display: 'block', fontFamily: 'Inter', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#637890', marginBottom: '0.5rem' }}>Message</label>
                  <textarea required rows={4} style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid rgba(52,65,109,0.15)', borderRadius: 3, fontFamily: 'Inter', fontSize: '0.9375rem', color: '#2C2C2C', background: '#F5F3EF', outline: 'none', resize: 'vertical' }} />
                </div>
                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                  {tab === 'advisor' ? 'Book a 20-Minute Call' : 'Start a Conversation'}
                  <Send size={15} />
                </button>
                <p style={{ fontFamily: 'Inter', fontSize: '0.7rem', color: '#637890', textAlign: 'center', letterSpacing: '0.05em' }}>
                  By submitting you agree to our privacy policy. We do not share your information.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
