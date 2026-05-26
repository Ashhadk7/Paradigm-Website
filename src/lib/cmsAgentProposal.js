import { HOME_PRESENTATION_CONTROLS, SITE_PRESENTATION_CONTROLS, normalizePresentation } from './presentationSchema.js';

const CONTROL_MAP = Object.fromEntries(
  [...HOME_PRESENTATION_CONTROLS, ...SITE_PRESENTATION_CONTROLS].map(control => [control.name, control])
);

const FIELD_ALIASES = {
  hero_eyebrow: ['hero eyebrow', 'eyebrow'],
  hero_headline: ['hero section headline', 'hero section heading', 'hero headline', 'hero heading', 'headline', 'heading'],
  hero_sub: ['hero section subheading', 'hero section subtitle', 'hero subheading', 'hero subtitle', 'subheading', 'subtitle'],
  hero_cta_label: ['hero cta button', 'hero button', 'cta button'],
};

function optionLabel(controlName, value) {
  return CONTROL_MAP[controlName]?.options.find(option => option.value === value)?.label || value;
}

function hasAny(prompt, patterns) {
  return patterns.some(pattern => pattern.test(prompt));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fieldAliases(field) {
  const normalizedLabel = field.label
    .toLowerCase()
    .replaceAll('—', ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return [...new Set([
    ...(FIELD_ALIASES[field.name] || []),
    normalizedLabel,
    field.name.replaceAll('_', ' '),
  ])].sort((a, b) => b.length - a.length);
}

function findRequestedValue(request, aliases) {
  for (const alias of aliases) {
    const matcher = new RegExp(
      `(?:change|set|update|replace)\\s+(?:the\\s+)?${escapeRegExp(alias)}\\s+(?:to|with)\\s+(?:this\\s+)?["“]([^"”]+)["”]`,
      'i'
    );
    const match = request.match(matcher);
    if (match) return match[1].trim();
  }

  return null;
}

function buildContentChanges(request, fields, content) {
  const nextContent = { ...content };
  const changes = [];

  fields.forEach(field => {
    const value = findRequestedValue(request, fieldAliases(field));
    if (value === null || value === String(content[field.name] ?? '')) return;

    nextContent[field.name] = value;
    changes.push({
      kind: 'content',
      controlName: field.name,
      label: field.label,
      before: String(content[field.name] ?? ''),
      after: value,
      reason: `Replace the ${field.label.toLowerCase()} copy.`,
    });
  });

  return { nextContent, changes };
}

export function buildCmsProposal({ pageKey, prompt, presentation, content = {}, fields = [] }) {
  const request = prompt.trim();
  const normalizedPrompt = request.toLowerCase();

  if (!request) {
    return { error: 'Describe a layout or content adjustment first.' };
  }

  const { nextContent, changes } = buildContentChanges(request, fields, content);
  const currentPresentation = normalizePresentation(pageKey, presentation);
  const proposedPresentation = { ...currentPresentation };

  function proposeAppearance(controlName, value, reason) {
    if (proposedPresentation[controlName] === value) return;

    proposedPresentation[controlName] = value;
    changes.push({
      kind: 'presentation',
      controlName,
      label: CONTROL_MAP[controlName].label,
      before: optionLabel(controlName, currentPresentation[controlName]),
      after: optionLabel(controlName, value),
      reason,
    });
  }

  if (pageKey === 'home') {
    if (hasAny(normalizedPrompt, [
      /hero.{0,30}(padding|spacing).{0,20}(smaller|less|reduce|reduced|tighter|compact)/,
      /(smaller|less|reduce|tighter|compact).{0,30}hero.{0,20}(padding|spacing)/,
    ])) {
      proposeAppearance('hero_density', 'compact', 'Reduce vertical whitespace in the hero.');
    }

    if (hasAny(normalizedPrompt, [
      /hero.{0,30}(padding|spacing).{0,20}(larger|more|increase|spacious|room)/,
      /(larger|more|increase|spacious).{0,30}hero.{0,20}(padding|spacing)/,
    ])) {
      proposeAppearance('hero_density', 'spacious', 'Increase vertical whitespace in the hero.');
    }

    if (hasAny(normalizedPrompt, [
      /(trust|stats|statistics).{0,35}(spacing|space|padding).{0,20}(smaller|less|reduce|reduced|tighter|compact)/,
      /(reduce|less|tighten|smaller).{0,30}(spacing|space|padding).{0,25}(trust|stats|statistics)/,
      /(reduce|less|tighten|smaller).{0,30}(above|around).{0,30}(trust|stats|statistics)/,
    ])) {
      proposeAppearance('trust_band_density', 'compact', 'Reduce spacing around the trust statistics.');
    }

    if (hasAny(normalizedPrompt, [
      /(trust|stats|statistics).{0,35}(spacing|space|padding).{0,20}(larger|more|increase|spacious)/,
      /(increase|more|spacious).{0,30}(spacing|space|padding).{0,25}(trust|stats|statistics)/,
    ])) {
      proposeAppearance('trust_band_density', 'spacious', 'Increase spacing around the trust statistics.');
    }

    if (hasAny(normalizedPrompt, [
      /(headline|heading|title).{0,40}(tighter line|fewer lines|less wrapping|wider|more width|fit)/,
      /(widen|give more room).{0,30}(headline|heading|title)/,
    ])) {
      proposeAppearance('hero_headline_width', 'wide', 'Give the hero headline more line length.');
    }

    if (hasAny(normalizedPrompt, [
      /(headline|heading|title).{0,35}(narrower|more wrapping|shorter line)/,
      /(narrow|constrain).{0,30}(headline|heading|title)/,
    ])) {
      proposeAppearance('hero_headline_width', 'tight', 'Constrain the hero headline line length.');
    }

    if (hasAny(normalizedPrompt, [
      /(headline|heading|title).{0,30}(smaller|reduce|compact)/,
      /(smaller|reduce).{0,20}(headline|heading|title)/,
    ])) {
      proposeAppearance('hero_headline_scale', 'compact', 'Reduce hero headline scale.');
    }

    if (hasAny(normalizedPrompt, [
      /(headline|heading|title).{0,30}(larger|increase|bigger|prominent)/,
      /(larger|increase|bigger).{0,20}(headline|heading|title)/,
    ])) {
      proposeAppearance('hero_headline_scale', 'prominent', 'Increase hero headline scale.');
    }
  }

  if (pageKey === 'site') {
    if (hasAny(normalizedPrompt, [/(navbar|navigation|footer|shell).{0,30}(navy|blue)/, /(navy|blue).{0,30}(navbar|navigation|footer|shell)/])) {
      proposeAppearance('shell_tone', 'navy', 'Use the navy treatment for navigation and footer.');
    }
    if (hasAny(normalizedPrompt, [/(navbar|navigation|footer|shell).{0,30}(charcoal|black|dark gray)/, /(charcoal|black|dark gray).{0,30}(navbar|navigation|footer|shell)/])) {
      proposeAppearance('shell_tone', 'charcoal', 'Use the charcoal treatment for navigation and footer.');
    }
    if (hasAny(normalizedPrompt, [/(navbar|navigation|footer|shell).{0,30}(forest|green)/, /(forest|green).{0,30}(navbar|navigation|footer|shell)/])) {
      proposeAppearance('shell_tone', 'forest', 'Use the forest treatment for navigation and footer.');
    }
    if (hasAny(normalizedPrompt, [/(accent|highlight).{0,20}(gold)/, /(gold).{0,20}(accent|highlight)/])) {
      proposeAppearance('shell_accent', 'gold', 'Use the gold accent in the shared shell.');
    }
    if (hasAny(normalizedPrompt, [/(accent|highlight).{0,20}(copper)/, /(copper).{0,20}(accent|highlight)/])) {
      proposeAppearance('shell_accent', 'copper', 'Use the copper accent in the shared shell.');
    }
    if (hasAny(normalizedPrompt, [/(accent|highlight).{0,20}(sage)/, /(sage).{0,20}(accent|highlight)/])) {
      proposeAppearance('shell_accent', 'sage', 'Use the sage accent in the shared shell.');
    }
  }

  if (!changes.length) {
    return {
      error: 'For content, use a quoted replacement such as: Change the hero heading to "New heading". Layout controls are available on the Home page.',
    };
  }

  const hasContent = changes.some(change => change.kind === 'content');
  const hasAppearance = changes.some(change => change.kind === 'presentation');

  return {
    request,
    pageKey,
    changes,
    content: hasContent ? nextContent : null,
    settings: hasAppearance ? normalizePresentation(pageKey, proposedPresentation) : null,
    summary: `Prepared ${changes.length} approved ${changes.length === 1 ? 'change' : 'changes'} for ${pageKey === 'home' ? 'the homepage' : 'this page'}.`,
  };
}
