import { motion } from 'framer-motion';

/**
 * ProofBlock — navy section with the institutional proof sentence.
 * Reusable across Home, Advisors, Institutions.
 * variant: 'advisor' | 'institutional' | 'mfo'
 */
const COPY = {
  advisor: {
    body: 'Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history.',
    bridge: 'The same investment intelligence is now available to independent advisors and multi-family offices.',
  },
  institutional: {
    body: 'Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history. 65 of the nation\'s top 100 US pension funds have worked with Paradigm.',
    bridge: 'The same intelligence is now structured for the institutional partnerships that define what comes next.',
  },
  mfo: {
    body: 'Paradigm has worked with institutional clients including General Motors, AMEX, and the US Treasury over its 35-year history.',
    bridge: 'The same investment intelligence is now available to multi-family offices and family office platforms.',
  },
};

export default function ProofBlock({ variant = 'advisor' }) {
  const copy = COPY[variant] || COPY.advisor;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        background: '#34416D',
        padding: '3.5rem',
        borderLeft: '4px solid #C4A25B',
        borderRadius: 2,
      }}
    >
      <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C4A25B', marginBottom: '1.25rem' }}>
        Proven Over 35 Years
      </p>
      <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', lineHeight: 1.6, color: '#F5F3EF', marginBottom: '0.875rem' }}>
        {copy.body}
      </p>
      <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: 'clamp(1.125rem, 2.5vw, 1.375rem)', lineHeight: 1.6, color: '#C4A25B', fontStyle: 'italic' }}>
        {copy.bridge}
      </p>
    </motion.div>
  );
}
