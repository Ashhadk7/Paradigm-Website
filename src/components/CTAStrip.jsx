import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

/**
 * CTAStrip — bottom of every marketing page.
 * variant: 'advisor' | 'institutional' | 'both'
 */
export default function CTAStrip({
  variant = 'both',
  advisorText,
  institutionText,
  advisorTitle,
  advisorContactPrefix,
  advisorEmail,
  advisorPhone,
  advisorButtonLabel,
  mfoTitle,
  mfoEmail,
  mfoPhone,
  mfoButtonLabel,
  institutionalTitle,
  institutionalEmail,
  institutionalPhone,
  institutionalButtonLabel,
}) {
  return (
    <section className="cta-strip" style={{ borderTop: '1px solid rgba(52,65,109,0.12)' }}>
      <div className="section-inner" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        {variant === 'both' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem' }}>
            {/* Advisor */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>For Advisors</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.4 }}>
                {advisorText || "See what a portfolio built from collective intelligence looks like for your practice. Worth 20 minutes."}
              </p>
              <Link to="/contact" className="btn-gold" style={{ marginTop: '0.5rem' }}>
                Book a 20-Minute Call
              </Link>
            </motion.div>
            {/* Institutional */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="eyebrow" style={{ marginBottom: '0.75rem' }}>For Institutions</p>
              <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.375rem', color: '#34416D', marginBottom: '0.875rem', lineHeight: 1.4 }}>
                {institutionText || "Paradigm is actively building strategic relationships with family offices, OCIOs, and institutional partners. Start a conversation."}
              </p>
              <Link to="/contact" className="btn-outline-navy" style={{ marginTop: '0.5rem' }}>
                Start a Conversation
              </Link>
            </motion.div>
          </div>
        ) : variant === 'advisor' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto' }}
          >
            <p className="cta-title-oneline" style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.625rem', color: '#34416D', marginBottom: '0.625rem', lineHeight: 1.35 }}>
              {advisorTitle || "Worth 20 minutes to see what this looks like for your practice?"}
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#637890', marginBottom: '1.75rem' }}>
              {advisorContactPrefix || "Or reach us directly:"}&nbsp;
              <a href={`mailto:${advisorEmail || "jef@paradigmasset.com"}`} style={{ color: '#34416D', textDecoration: 'none' }}>{advisorEmail || "jef@paradigmasset.com"}</a>
            </p>
            <Link to="/contact" className="btn-gold">{advisorButtonLabel || "Book a 20-Minute Call"}</Link>
          </motion.div>
        ) : variant === 'mfo' ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}
          >
            <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.625rem', color: '#34416D', marginBottom: '1.75rem', lineHeight: 1.35 }}>
              {mfoTitle || "Paradigm builds portfolios the way your clients expect them to be built — to their specific mandate, informed by current market intelligence, presented as your firm's own process."}
            </p>
            <Link to="/contact" className="btn-outline-navy">{mfoButtonLabel || "Start a Conversation"}</Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}
          >
            <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '1.625rem', color: '#34416D', marginBottom: '0.625rem', lineHeight: 1.35 }}>
              {institutionalTitle || "Paradigm is actively building strategic relationships with institutional investors, pension funds, endowments, and platforms who want a different approach to portfolio construction."}
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: '0.875rem', color: '#637890', marginBottom: '1.75rem' }}>
              <a href={`mailto:${institutionalEmail || "jef@paradigmasset.com"}`} style={{ color: '#34416D', textDecoration: 'none' }}>{institutionalEmail || "jef@paradigmasset.com"}</a>
            </p>
            <Link to="/contact" className="btn-outline-navy">{institutionalButtonLabel || "Start a Conversation"}</Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
