import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GLSLHills } from './ui/glsl-hills';

export default function HeroSection({ eyebrow, headline, sub, ctas = [], minimal = false }) {
  return (
    <section
      className="hero-section"
      style={{
        minHeight: minimal ? '46vh' : '100vh',
        paddingTop: minimal ? '7rem' : '5rem',
        paddingBottom: minimal ? '3.25rem' : '3rem',
      }}
    >
      <div className="hero-texture" />

      {/* GLSL Hills — animated WebGL terrain behind content */}
      {!minimal && (
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35, zIndex: 0 }}>
          <GLSLHills speed={0.3} cameraZ={130} />
        </div>
      )}

      <div className="hero-inner">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: 'easeOut' }}
          style={{ maxWidth: 760, position: 'relative', zIndex: 2 }}
        >
          {eyebrow && (
            <p className="eyebrow" style={{ marginBottom: '1rem' }}>{eyebrow}</p>
          )}

          <h1 className="display-headline" style={{ marginBottom: '1.35rem', whiteSpace: 'pre-line' }}>
            {headline}
          </h1>

          {sub && (
            <p className="hero-subcopy">
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

      {!minimal && (
        <motion.div
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="scroll-indicator"
        >
          <span>Scroll</span>
          <div />
        </motion.div>
      )}
    </section>
  );
}
