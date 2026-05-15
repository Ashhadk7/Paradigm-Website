import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GLSLHills } from './ui/glsl-hills';

export default function HeroSection({ eyebrow, headline, sub, ctas = [], minimal = false, compact = false }) {
  return (
    <section
      className="hero-section"
      style={{
        minHeight: minimal ? '56vh' : '100vh',
        paddingTop: minimal ? '8rem' : '5rem',
        paddingBottom: minimal ? '4rem' : '3rem',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.8, zIndex: 0 }}>
        <GLSLHills speed={0.3} cameraZ={130} />
      </div>

      <div className="hero-inner">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ maxWidth: compact ? 720 : 760, position: 'relative', zIndex: 2 }}
        >
          {eyebrow && (
            <p className="eyebrow" style={{ marginBottom: compact ? '0.75rem' : '1rem' }}>{eyebrow}</p>
          )}

          <h1
            className={compact ? 'display-headline-compact' : 'display-headline'}
            style={{ marginBottom: compact ? '1rem' : '1.35rem', whiteSpace: 'pre-line' }}
          >
            {headline}
          </h1>

          {sub && (
            <p className="hero-subcopy" style={compact ? { fontSize: '0.95rem', marginBottom: '1.25rem' } : undefined}>
              {sub}
            </p>
          )}

          {ctas.length > 0 && (
            <div className="hero-actions">
              {ctas.map((cta, i) => (
                <Link key={i} to={cta.to} className={`btn-${cta.variant || 'gold'}`}>
                  {cta.label}
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
