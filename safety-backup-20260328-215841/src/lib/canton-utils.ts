// Canton utility functions for URL routing and validation

export const SWISS_CANTONS = [
  'aargau', 'appenzell', 'basel', 'bern', 'fribourg', 'geneve', 
  'glarus', 'graubuenden', 'jura', 'luzern', 'neuchatel', 'nidwalden', 
  'obwalden', 'schaffhausen', 'schwyz', 'solothurn', 'stgallen', 
  'tessin', 'thurgau', 'uri', 'waadt', 'wallis', 'zuerich', 'zug'
] as const;

export type CantonSlug = typeof SWISS_CANTONS[number];

export const CANTON_DISPLAY_NAMES: Record<CantonSlug, string> = {
  aargau: 'Aargau',
  appenzell: 'Appenzell',
  basel: 'Basel',
  bern: 'Bern',
  fribourg: 'Fribourg',
  geneve: 'Genf',
  glarus: 'Glarus',
  graubuenden: 'Graubünden',
  jura: 'Jura',
  luzern: 'Luzern',
  neuchatel: 'Neuenburg',
  nidwalden: 'Nidwalden',
  obwalden: 'Obwalden',
  schaffhausen: 'Schaffhausen',
  schwyz: 'Schwyz',
  solothurn: 'Solothurn',
  stgallen: 'St. Gallen',
  tessin: 'Tessin',
  thurgau: 'Thurgau',
  uri: 'Uri',
  waadt: 'Waadt',
  wallis: 'Wallis',
  zuerich: 'Zürich',
  zug: 'Zug',
};

export const isValidCanton = (slug: string): slug is CantonSlug => {
  return SWISS_CANTONS.includes(slug as CantonSlug);
};

export const getCantonDisplayName = (slug: string): string => {
  if (isValidCanton(slug)) {
    return CANTON_DISPLAY_NAMES[slug];
  }
  return slug.charAt(0).toUpperCase() + slug.slice(1);
};

export const getCantonSEOData = (canton: CantonSlug) => {
  const displayName = CANTON_DISPLAY_NAMES[canton];
  return {
    title: `Umzugsfirmen in ${displayName} vergleichen | umzugscheck.ch`,
    description: `Finden Sie die besten Umzugsfirmen im Kanton ${displayName}. Vergleichen Sie Preise, Bewertungen und Services. Kostenlose Offerten von geprüften Umzugsunternehmen.`,
    keywords: `Umzugsfirma ${displayName}, Umzug ${displayName}, Umzugsunternehmen ${displayName}, Zügeln ${displayName}`,
    canonical: `https://umzugscheck.ch/umzugsfirmen/${canton}`,
  };
};

export const getOffertenSEOData = (region: CantonSlug) => {
  const displayName = CANTON_DISPLAY_NAMES[region];
  return {
    title: `Umzugsofferten ${displayName} | Gratis vergleichen | umzugscheck.ch`,
    description: `Erhalten Sie kostenlose Umzugsofferten von geprüften Umzugsfirmen im Kanton ${displayName}. Vergleichen Sie Preise und sparen Sie bis zu 40%.`,
    keywords: `Umzugsofferten ${displayName}, Umzug Offerte ${displayName}, Umzugskosten ${displayName}`,
    canonical: `https://umzugscheck.ch/umzugsofferten/${region}`,
  };
};
