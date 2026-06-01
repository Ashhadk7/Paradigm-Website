import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GLSLHills } from './ui/glsl-hills';
import Editable from './cms/Editable';
import { useEditMode } from '../lib/editModeContext';

function splitHeroCopy(text) {
  if (!text) return [];
  if (text.includes('\n')) {
    return text.split('\n');
  }

  const parts = text.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [text];
  return parts.map(part => part.trimEnd());
}

function splitHeroSubcopy(text) {
  if (!text) return [];
  return text.includes('\n') ? text.split('\n') : [text];
}

export default function HeroSection({ eyebrow, headline, sub, ctas = [], minimal = false, compact = false, appearance, editable, styleSource }) {
  const { editing } = useEditMode();
  const headlineLines = splitHeroCopy(headline);
  const subLines = splitHeroSubcopy(sub);
  // In edit mode, render the hero text as Editable so it can be clicked/styled.
  const editHero = editing && editable;
  const headlineDelay = 0.3;
  const headlineStep = 0.22;
  const subDelay = headlineDelay + Math.max(headlineLines.length, 1) * headlineStep + 0.1;
  const actionDelay = subDelay + Math.max(subLines.length, 1) * 0.12 + 0.15;

  return (
    <section
      className={`hero-section ${appearance?.hero_density ? `hero-section--${appearance.hero_density}` : ''}`}
      style={minimal ? { paddingTop: '8rem', paddingBottom: '4rem' } : undefined}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.8, zIndex: 0 }}>
        <GLSLHills speed={0.3} cameraZ={130} />
      </div>

      <div className="hero-inner">
        <div
          className={`hero-centered ${appearance?.hero_headline_width ? `hero-copy--${appearance.hero_headline_width}` : 'hero-copy--standard'}`}
          style={{ maxWidth: compact ? 960 : undefined, position: 'relative', zIndex: 2 }}
        >
          {editHero && eyebrow !== undefined ? (
            <Editable field={editable.eyebrowField} as="p" className="eyebrow"
              styleSource={styleSource} baseStyle={{ marginBottom: compact ? '0.75rem' : '1rem' }}>
              {eyebrow}
            </Editable>
          ) : eyebrow && (
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

          {editHero ? (
            <Editable
              field={editable.headlineField}
              as="h1"
              multiline
              className={`${compact ? 'display-headline-compact' : 'display-headline'} ${appearance?.hero_headline_scale ? `display-headline-size--${appearance.hero_headline_scale}` : ''}`}
              styleSource={styleSource}
              baseStyle={{ marginBottom: compact ? '1rem' : '1.35rem', whiteSpace: 'pre-line' }}
            >
              {headline}
            </Editable>
          ) : (
          <h1
            className={`${compact ? 'display-headline-compact' : 'display-headline'} ${appearance?.hero_headline_scale ? `display-headline-size--${appearance.hero_headline_scale}` : ''}`}
            style={{ marginBottom: compact ? '1rem' : '1.35rem' }}
          >
            {headlineLines.map((line, i) => (
              <motion.span
                key={`${line}-${i}`}
                className="hero-headline-line"
                initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  duration: 0.7,
                  delay: headlineDelay + i * headlineStep,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                style={{
                  display: 'block',
                  marginBottom: i < headlineLines.length - 1 ? '0.12em' : 0,
                }}
              >
                {line}
              </motion.span>
            ))}
          </h1>
          )}

          {editHero && sub !== undefined ? (
            <Editable field={editable.subField} as="p" multiline className="hero-subcopy"
              styleSource={styleSource}
              baseStyle={compact ? { fontSize: '0.95rem', marginBottom: '1.25rem', whiteSpace: 'pre-line' } : { whiteSpace: 'pre-line' }}>
              {sub}
            </Editable>
          ) : sub && (
            <p
              className="hero-subcopy"
              style={compact ? { fontSize: '0.95rem', marginBottom: '1.25rem' } : undefined}
            >
              {subLines.map((line, i) => (
                <motion.span
                  key={`${line}-${i}`}
                  initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  transition={{
                    duration: 0.6,
                    delay: subDelay + i * 0.12,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{ display: 'block' }}
                >
                  {line}
                </motion.span>
              ))}
            </p>
          )}

          {ctas.length > 0 && (
            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: actionDelay, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            className="hero-accent-line"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: actionDelay + 0.2, ease: 'easeOut' }}
            style={{
              height: 2,
              background: 'linear-gradient(90deg, #C4A25B 0%, transparent 70%)',
              marginTop: ctas.length > 0 ? '2rem' : '1.5rem',
              width: 180,
              transformOrigin: 'left',
            }}
          />
        </div>
      </div>
    </section>
  );
}
