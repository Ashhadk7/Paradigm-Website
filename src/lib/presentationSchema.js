export const PRESENTATION_DEFAULTS = {
  home: {
    hero_density: 'balanced',
    hero_headline_width: 'standard',
    hero_headline_scale: 'standard',
    trust_band_density: 'balanced',
  },
  site: {
    shell_tone: 'navy',
    shell_accent: 'gold',
  },
};

export const HOME_PRESENTATION_CONTROLS = [
  {
    name: 'hero_density',
    label: 'Hero vertical spacing',
    description: 'Controls padding above and below the homepage hero content.',
    options: [
      { value: 'compact', label: 'Compact' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'spacious', label: 'Spacious' },
    ],
  },
  {
    name: 'hero_headline_width',
    label: 'Hero headline line length',
    description: 'Controls how much horizontal room the headline receives.',
    options: [
      { value: 'tight', label: 'Tight' },
      { value: 'standard', label: 'Standard' },
      { value: 'wide', label: 'Wide' },
    ],
  },
  {
    name: 'hero_headline_scale',
    label: 'Hero headline scale',
    description: 'Controls headline size without changing the page copy.',
    options: [
      { value: 'compact', label: 'Compact' },
      { value: 'standard', label: 'Standard' },
      { value: 'prominent', label: 'Prominent' },
    ],
  },
  {
    name: 'trust_band_density',
    label: 'Trust statistics spacing',
    description: 'Controls vertical whitespace around the statistics cards.',
    options: [
      { value: 'compact', label: 'Compact' },
      { value: 'balanced', label: 'Balanced' },
      { value: 'spacious', label: 'Spacious' },
    ],
  },
];

export const SITE_PRESENTATION_CONTROLS = [
  {
    name: 'shell_tone',
    label: 'Navigation and footer tone',
    description: 'Controls the shared navigation and footer background.',
    options: [
      { value: 'navy', label: 'Navy' },
      { value: 'charcoal', label: 'Charcoal' },
      { value: 'forest', label: 'Forest' },
    ],
  },
  {
    name: 'shell_accent',
    label: 'Navigation and footer accent',
    description: 'Controls active links, logo tiles, and footer rule.',
    options: [
      { value: 'gold', label: 'Gold' },
      { value: 'copper', label: 'Copper' },
      { value: 'sage', label: 'Sage' },
    ],
  },
];

export function normalizePresentation(pageKey, settings = {}) {
  const defaults = PRESENTATION_DEFAULTS[pageKey] || {};
  const controls = pageKey === 'home'
    ? HOME_PRESENTATION_CONTROLS
    : pageKey === 'site'
      ? SITE_PRESENTATION_CONTROLS
      : [];

  return controls.reduce((normalized, control) => {
    const allowedValues = control.options.map(option => option.value);
    const requestedValue = settings?.[control.name];
    normalized[control.name] = allowedValues.includes(requestedValue)
      ? requestedValue
      : defaults[control.name];
    return normalized;
  }, {});
}

export function resolveSitePalette(settings = {}) {
  const appearance = normalizePresentation('site', settings);
  const tone = {
    navy: '#34416D',
    charcoal: '#252a32',
    forest: '#18322d',
  }[appearance.shell_tone];
  const accent = {
    gold: '#C4A25B',
    copper: '#C27B58',
    sage: '#92AD9A',
  }[appearance.shell_accent];

  return { tone, accent };
}
