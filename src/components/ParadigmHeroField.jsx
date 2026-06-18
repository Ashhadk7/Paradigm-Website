import { useId } from "react";

/**
 * ParadigmHeroField
 * ------------------
 * Animated "market data field" background for hero sections.
 * A field of cool points spanning the FULL width, with a warm-gold "leadership"
 * bloom that slowly drifts and loops on the right as the focus. A soft scrim
 * darkens the left just enough for headline copy. Renders inline SVG (so the CSS
 * animation always runs), scales to any container, pauses for reduced-motion.
 *
 * USAGE
 *   import ParadigmHeroField from "@/components/ParadigmHeroField";
 *
 *   <section className="hero">
 *     <ParadigmHeroField variant="home" style={{ position:"absolute", inset:0 }} />
 *     <div className="hero__copy"> ...headline, buttons... </div>
 *   </section>
 *
 *   // Sub-pages — same component, leadership placed a little differently
 *   <ParadigmHeroField variant="advisors" />
 *   <ParadigmHeroField variant="institutions" />
 *
 * PROPS (all optional)
 *   variant      "home" | "advisors" | "family" | "institutions"  -> preset bloom position
 *   bloom        { x, y } fractions 0..1, overrides variant (keep x >= ~0.66 so the
 *                focus clears the text side)
 *   colors       { navy, cool, gold, bright }  -> defaults to brand palette;
 *                repoint at your design tokens if you prefer
 *   loopSeconds  drift loop duration (default 22). Higher = slower/calmer.
 *   driftScale   how far the bloom travels (default 1). Try 0.6 subtle, 1.5 more.
 *   density      dot spacing in px (default 24). Lower = denser field.
 *   fieldOpacity overall strength of the dot field (default 0.85, 0..1).
 *   scrim        left-side darkening for text legibility (default 0.6, 0..1).
 *                Set 0 for a uniform field with no darkening.
 *   scrimSpan    how far the scrim reaches before fading out (default 0.5, 0..1).
 *   showSignal   show the gold leadership bloom (default true). false = quiet field only.
 *   className/style  passed to the root <svg>.
 */

const VARIANTS = {
  home: { x: 0.74, y: 0.46 },
  advisors: { x: 0.72, y: 0.34 },
  family: { x: 0.77, y: 0.5 },
  institutions: { x: 0.7, y: 0.62 },
};

const BRAND = {
  navy: "#34416D",
  cool: "#637890",
  gold: "#C4A25B",
  bright: "#EDE0C4",
};

export default function ParadigmHeroField({
  variant = "home",
  bloom,
  colors = BRAND,
  loopSeconds = 22,
  driftScale = 1,
  density = 24,
  fieldOpacity = 0.85,
  scrim = 0.6,
  scrimSpan = 0.5,
  showSignal = true,
  className,
  style,
}) {
  const raw = useId();
  const uid = `phf${raw.replace(/[^a-zA-Z0-9]/g, "")}`;

  const W = 1440;
  const H = 560;
  const pos = bloom ?? VARIANTS[variant] ?? VARIANTS.home;
  const cx = pos.x * W;
  const cy = pos.y * H;
  const d = driftScale;

  const css = `
.${uid}-bloom { animation: ${uid}-drift ${loopSeconds}s ease-in-out infinite; }
.${uid}-core  { animation: ${uid}-pulse ${(loopSeconds / 3.4).toFixed(1)}s ease-in-out infinite; }
@keyframes ${uid}-drift {
  0%   { transform: translate(0px, 0px); }
  25%  { transform: translate(${-42 * d}px, ${36 * d}px); }
  50%  { transform: translate(${27 * d}px, ${63 * d}px); }
  75%  { transform: translate(${-12 * d}px, ${-27 * d}px); }
  100% { transform: translate(0px, 0px); }
}
@keyframes ${uid}-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.72; } }
@media (prefers-reduced-motion: reduce) {
  .${uid}-bloom, .${uid}-core { animation: none; }
}`;

  const dot = (r, key) => (
    <pattern
      id={`${uid}-${key}`}
      patternUnits="userSpaceOnUse"
      width={density}
      height={density}
    >
      <circle cx={density / 2} cy={density / 2} r={r} fill={colors[key]} />
    </pattern>
  );

  return (
    <svg
      className={className}
      style={style}
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Market data field with a forming leadership signal"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>{css}</style>
      <defs>
        {dot(1.9, "cool")}
        {dot(2.6, "gold")}
        {dot(2.9, "bright")}
        <linearGradient id={`${uid}-scrim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={colors.navy} stopOpacity={scrim} />
          <stop offset={scrimSpan} stopColor={colors.navy} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width={W} height={H} fill={colors.navy} />
      <rect x="0" y="0" width={W} height={H} fill={`url(#${uid}-cool)`} opacity={fieldOpacity} />
      <rect x="0" y="0" width={W} height={H} fill={`url(#${uid}-scrim)`} />

      {showSignal && (
        <g className={`${uid}-bloom`}>
          <ellipse cx={cx} cy={cy} rx="260" ry="200" fill={colors.gold} opacity="0.12" />
          <ellipse cx={cx} cy={cy} rx="210" ry="160" fill={`url(#${uid}-gold)`} />
          <ellipse
            className={`${uid}-core`}
            cx={cx}
            cy={cy}
            rx="90"
            ry="68"
            fill={`url(#${uid}-bright)`}
          />
        </g>
      )}
    </svg>
  );
}
