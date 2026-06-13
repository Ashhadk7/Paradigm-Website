import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Deterministic PRNG (mulberry32) so bubble positions stay stable across renders.
function makeRng(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Scatter `count` bubbles uniformly inside an annular band [rInner, rOuter].
// Each bubble also carries drift parameters so it can rise + wobble like a
// real bubble in liquid (consumed by BubbleField below).
function generateBubbles(count, rInner, rOuter, seed, baseSize) {
  const rng = makeRng(seed);
  const cx = 250;
  const cy = 250;
  const bubbles = [];
  for (let i = 0; i < count; i++) {
    const angle = rng() * Math.PI * 2;
    // sqrt for uniform area distribution within the annulus
    const r = Math.sqrt(rng() * (rOuter * rOuter - rInner * rInner) + rInner * rInner);
    const size = baseSize * (0.5 + rng() * 0.9);
    bubbles.push({
      cx: cx + Math.cos(angle) * r,
      cy: cy + Math.sin(angle) * r,
      size,
      // how far this bubble rises over its loop (bigger bubbles rise a bit more)
      rise: 22 + rng() * 34 + size * 0.6,
      // horizontal wobble amplitude and phase
      sway: 4 + rng() * 9,
      swayDir: rng() < 0.5 ? -1 : 1,
      delay: rng() * 6.0,
      duration: 6.0 + rng() * 5.0,
      // subtle size breathing
      pulse: 0.12 + rng() * 0.16,
    });
  }
  return bubbles;
}

// Staged narrowing sequence: bubbles fill the FULL disc of the active ring,
// dropping in count as the universe narrows. Labels appear in sync per stage.
// 0: All Data (grey) 300 · 1: Some Data (blue) 150 · 2: Select Data (navy) 50
// Staged narrowing sequence: bubbles fill the FULL disc of the active ring,
// dropping in count as the universe narrows. Labels appear centered.
// labelLines: split across rows so a larger label still fits the smaller ring.
const STAGES = [
  { ring: 0, labelLines: ['All Data'],        clipR: 240, bubbles: generateBubbles(300, 0, 226, 1011, 8.0), strokeColor: 'rgba(255,255,255,0.8)', glowColor: 'rgba(255,255,255,1)', fillColor: 'rgba(255,255,255,0.45)', labelFill: '#ffffff', labelHalo: '#1a2240' },
  { ring: 1, labelLines: ['Some Data'],       clipR: 170, bubbles: generateBubbles(150, 0, 152, 2027, 12.0), strokeColor: 'rgba(255,255,255,0.8)', glowColor: 'rgba(255,255,255,1)', fillColor: 'rgba(255,255,255,0.45)', labelFill: '#ffffff', labelHalo: '#1a2240' },
  { ring: 2, labelLines: ['Select', 'Data'],  clipR: 100, bubbles: generateBubbles(9, 0, 80, 3041, 16.0), strokeColor: 'rgba(255,255,255,0.8)', glowColor: 'rgba(255,255,255,1)', fillColor: 'rgba(255,255,255,0.45)', labelFill: '#1a2240', labelHalo: 'rgba(196,162,91,0.9)' },
];

const STAGE_DURATION = 12000; // ms each stage holds before advancing

function BubbleField({ bubbles, strokeColor, glowColor, fillColor, clipId }) {
  return (
    <g clipPath={clipId ? `url(#${clipId})` : undefined}>
      {bubbles.map((b, i) => {
        const sway = b.sway * b.swayDir;
        return (
          <motion.circle
            key={i}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth={Math.max(1, b.size * 0.15)}
            style={{ filter: `drop-shadow(0px 0px 4px ${glowColor})` }}
            initial={{ cx: b.cx, cy: b.cy, r: b.size, opacity: 0 }}
            animate={{
              // rise upward (cy decreases) over the loop
              cy: [b.cy, b.cy - b.rise * 0.35, b.cy - b.rise * 0.7, b.cy - b.rise],
              // wobble left/right like a real bubble
              cx: [b.cx, b.cx + sway, b.cx - sway * 0.6, b.cx],
              // gentle size breathing
              r: [b.size, b.size * (1 + b.pulse), b.size, b.size * (1 + b.pulse * 0.5)],
              // fade in, hold, fade out as it reaches the top
              opacity: [0, 0.95, 0.95, 0],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'easeInOut',
              times: [0, 0.15, 0.85, 1],
            }}
          />
        );
      })}
    </g>
  );
}

function AnimatedOrbit() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, STAGE_DURATION);
    return () => clearInterval(id);
  }, []);

  // Rings reveal progressively: ring N is visible once we've reached its stage,
  // and stays visible through the rest of the sequence.
  const ringVisible = (ring) => stage >= ring;
  const active = STAGES[stage];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <svg
        viewBox="0 0 500 500"
        aria-hidden="true"
        style={{ width: '100%', maxWidth: 620, display: 'block', margin: '0 auto' }}
      >
        {/* Clip paths keep each stage's bubbles inside its ring as they rise */}
        <defs>
          <clipPath id="clip-ring-0"><circle cx={250} cy={250} r={238} /></clipPath>
          <clipPath id="clip-ring-1"><circle cx={250} cy={250} r={168} /></clipPath>
          <clipPath id="clip-ring-2"><circle cx={250} cy={250} r={98} /></clipPath>
        </defs>

        {/* Filled layered rings — revealed progressively as the sequence narrows */}
        <motion.circle cx={250} cy={250} r={240} fill="#7E8CB5"
          animate={{ opacity: ringVisible(0) ? 1 : 0 }}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
        />
        <motion.circle cx={250} cy={250} r={170} fill="#34416D"
          initial={{ opacity: 0 }}
          animate={{ opacity: ringVisible(1) ? 1 : 0, scale: ringVisible(1) ? 1 : 0.85 }}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        <motion.circle cx={250} cy={250} r={100} fill="#C4A25B"
          initial={{ opacity: 0 }}
          animate={{ opacity: ringVisible(2) ? 1 : 0, scale: ringVisible(2) ? 1 : 0.85 }}
          transition={{ duration: 1.3, ease: 'easeInOut' }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        />

        {/* Bubble field + label for the current stage — old and new overlap
            (no mode="wait") so stages cross-fade smoothly instead of going
            blank between transitions. */}
        <AnimatePresence>
          <motion.g
            key={stage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: "easeInOut" }}
          >
            <BubbleField bubbles={active.bubbles} strokeColor={active.strokeColor} glowColor={active.glowColor} fillColor={active.fillColor} clipId={`clip-ring-${active.ring}`} />
            {active.labelLines && (
              <text
                x={250}
                y={250}
                textAnchor="middle"
                dominantBaseline="central"
                fill={active.labelFill}
                fontFamily="Inter, sans-serif"
                fontSize="30"
                fontWeight="700"
                letterSpacing="2.5"
                style={{ pointerEvents: 'none', filter: `drop-shadow(0 1px 6px ${active.labelHalo})` }}
              >
                {active.labelLines.map((line, i) => (
                  <tspan
                    key={i}
                    x={250}
                    // vertically center the block: shift up half the total line span
                    dy={i === 0 ? `${-(active.labelLines.length - 1) * 0.6}em` : '1.2em'}
                  >
                    {line}
                  </tspan>
                ))}
              </text>
            )}
          </motion.g>
        </AnimatePresence>
      </svg>
    </motion.div>
  );
}

export default AnimatedOrbit;
