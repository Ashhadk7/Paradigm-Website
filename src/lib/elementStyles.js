// Per-element style overrides for the visual CMS editor.
//
// Styles live inside each page's content JSONB under a reserved `_styles` key:
//   content._styles = { hero_headline: { textAlign: 'center', fontSize: '3.2rem' }, ... }
// This rides on the existing `save_page_content` RPC (arbitrary JSONB) and the
// existing useContent fetch/cache/live-update pipeline — no schema change.
//
// Every value the editor can produce is validated here so the popover and the
// <Editable> renderer agree and so we never inject arbitrary CSS.

export const STYLES_KEY = '_styles';

// Allowed CSS properties and their permitted values. Anything not listed is
// dropped on the way in (sanitizeStyle) so stored data stays safe and bounded.
export const TEXT_ALIGN_OPTIONS = ['left', 'center', 'right'];

export const FONT_SIZE_OPTIONS = [
  '0.85rem', '0.95rem', '1rem', '1.0625rem', '1.25rem', '1.5rem',
  '1.85rem', '2.2rem', '2.6rem', '3rem', '3.2rem', '3.6rem', '4rem',
];

export const FONT_WEIGHT_OPTIONS = [400, 500, 600, 700, 800];

// Spacing presets (applied to marginTop / marginBottom). rem strings.
export const SPACING_OPTIONS = ['0rem', '0.5rem', '1rem', '1.5rem', '2rem', '2.5rem', '3rem', '4rem'];

export const LETTER_SPACING_OPTIONS = ['normal', '0.02em', '0.05em', '0.1em', '0.16em'];

// Brand palette — only these colors are selectable (keeps the site on-brand).
export const COLOR_OPTIONS = [
  { label: 'Navy', value: '#34416D' },
  { label: 'Gold', value: '#C4A25B' },
  { label: 'Off-white', value: '#F5F3EF' },
  { label: 'Near-black', value: '#2C2C2C' },
  { label: 'Blue-grey', value: '#637890' },
];

// Validators per allowed key. `hidden` is a boolean (visibility toggle).
const VALIDATORS = {
  textAlign: (v) => (TEXT_ALIGN_OPTIONS.includes(v) ? v : undefined),
  fontSize: (v) => (FONT_SIZE_OPTIONS.includes(v) ? v : undefined),
  fontWeight: (v) => (FONT_WEIGHT_OPTIONS.includes(Number(v)) ? Number(v) : undefined),
  marginTop: (v) => (SPACING_OPTIONS.includes(v) ? v : undefined),
  marginBottom: (v) => (SPACING_OPTIONS.includes(v) ? v : undefined),
  letterSpacing: (v) => (LETTER_SPACING_OPTIONS.includes(v) ? v : undefined),
  color: (v) => (COLOR_OPTIONS.some((o) => o.value === v) ? v : undefined),
  hidden: (v) => (v === true ? true : undefined),
};

export const ALLOWED_STYLE_KEYS = Object.keys(VALIDATORS);

// Strip a raw style object down to allowed, validated keys only.
export function sanitizeStyle(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const clean = {};
  for (const key of ALLOWED_STYLE_KEYS) {
    if (raw[key] === undefined || raw[key] === null) continue;
    const validated = VALIDATORS[key](raw[key]);
    if (validated !== undefined) clean[key] = validated;
  }
  return clean;
}

// Read the (sanitized) style override for a field from a content object.
export function getStyle(content, field) {
  const styles = content?.[STYLES_KEY];
  if (!styles || typeof styles !== 'object') return {};
  return sanitizeStyle(styles[field]);
}

// True when the field is marked hidden.
export function isHidden(content, field) {
  return getStyle(content, field).hidden === true;
}

// Split a stored override into a CSS-style object (for the `style` prop),
// dropping the non-CSS `hidden` flag.
export function toCssStyle(override) {
  const clean = sanitizeStyle(override);
  // Drop the non-CSS visibility flag; everything else is a valid CSS prop.
  delete clean.hidden;
  return clean;
}

// Merge a base inline-style object with a field's override (override wins).
export function mergeStyle(base, content, field) {
  return { ...base, ...toCssStyle(getStyle(content, field)) };
}

// Immutably set a partial style override for a field on a content object.
// Returns a NEW content object. Passing { hidden: false } clears the flag.
export function withFieldStyle(content, field, partial) {
  const prevStyles = content?.[STYLES_KEY] || {};
  const prevForField = sanitizeStyle(prevStyles[field]);

  const nextForField = { ...prevForField };
  for (const [key, value] of Object.entries(partial)) {
    if (value === undefined || value === null || value === false) {
      delete nextForField[key];
    } else {
      nextForField[key] = value;
    }
  }
  const cleaned = sanitizeStyle(nextForField);

  const nextStyles = { ...prevStyles };
  if (Object.keys(cleaned).length === 0) {
    delete nextStyles[field];
  } else {
    nextStyles[field] = cleaned;
  }

  return { ...content, [STYLES_KEY]: nextStyles };
}
