import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GLSLHills } from './ui/glsl-hills';

export default function HeroSection({ eyebrow, headline, sub, ctas = [], minimal = false, compact = false }) {
  return (
    <section
      className="hero-section"
      style={{
        minHeight: '100vh',
        paddingTop: minimal ? '8rem' : '5rem',
        paddingBottom: minimal ? '4rem' : '3rem',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.8, zIndex: 0 }}>
        <GLSLHills speed={0.3} cameraZ={130} />
      </div>

      <div className="hero-inner">
        <div style={{ maxWidth: compact ? 720 : 760, position: 'relative', zIndex: 2 }}>
          {eyebrow && (
            <motion.p
              className="eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ marginBottom: compact ? '0.75rem' : '1rem' }}
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            className={compact ? 'display-headline-compact' : 'display-headline'}
            initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ marginBottom: compact ? '1rem' : '1.35rem', whiteSpace: 'pre-line' }}
          >
            {headline}
          </motion.h1>

          {sub && (
            <motion.p
              className="hero-subcopy"
              initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={compact ? { fontSize: '0.95rem', marginBottom: '1.25rem' } : undefined}
            >
              {sub}
            </motion.p>
          )}

          {ctas.length > 0 && (
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {ctas.map((cta, i) => (
                <Link key={i} to={cta.to} className={`btn-${cta.variant || 'gold'}`}>
                  {cta.label}
                </Link>
              ))}
            </motion.div>
          )}

          {/* Gold accent line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
            style={{
              height: 2,
              background: 'linear-gradient(90deg, #C4A25B 0%, transparent 70%)',
              marginTop: ctas.length > 0 ? '2rem' : '1.5rem',
              maxWidth: 180,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </section>
  );
}
