/**
 * LOCATIONS DATABASE
 * 
 * Zentrale Datenquelle für Städte und Kantone.
 * Ermöglicht saubere URL-Trennung:
 * - Städte: /umzugsfirmen/:citySlug
 * - Kantone: /umzugsfirmen/kanton-:cantonSlug
 */

export interface CantonData {
  slug: string;
  name: string;
  short: string;
}

export interface CityData {
  slug: string;
  name: string;
  cantonSlug: string;
  cantonName: string;
  cantonShort: string;
}

// ==================== KANTONE (26) ====================
export const CANTONS_MAP: Record<string, CantonData> = {
  zuerich: { slug: 'zuerich', name: 'Zürich', short: 'ZH' },
  bern: { slug: 'bern', name: 'Bern', short: 'BE' },
  luzern: { slug: 'luzern', name: 'Luzern', short: 'LU' },
  uri: { slug: 'uri', name: 'Uri', short: 'UR' },
  schwyz: { slug: 'schwyz', name: 'Schwyz', short: 'SZ' },
  obwalden: { slug: 'obwalden', name: 'Obwalden', short: 'OW' },
  nidwalden: { slug: 'nidwalden', name: 'Nidwalden', short: 'NW' },
  glarus: { slug: 'glarus', name: 'Glarus', short: 'GL' },
  zug: { slug: 'zug', name: 'Zug', short: 'ZG' },
  freiburg: { slug: 'freiburg', name: 'Freiburg', short: 'FR' },
  solothurn: { slug: 'solothurn', name: 'Solothurn', short: 'SO' },
  'basel-stadt': { slug: 'basel-stadt', name: 'Basel-Stadt', short: 'BS' },
  'basel-landschaft': { slug: 'basel-landschaft', name: 'Basel-Landschaft', short: 'BL' },
  schaffhausen: { slug: 'schaffhausen', name: 'Schaffhausen', short: 'SH' },
  'appenzell-ausserrhoden': { slug: 'appenzell-ausserrhoden', name: 'Appenzell Ausserrhoden', short: 'AR' },
  'appenzell-innerrhoden': { slug: 'appenzell-innerrhoden', name: 'Appenzell Innerrhoden', short: 'AI' },
  'st-gallen': { slug: 'st-gallen', name: 'St. Gallen', short: 'SG' },
  graubuenden: { slug: 'graubuenden', name: 'Graubünden', short: 'GR' },
  aargau: { slug: 'aargau', name: 'Aargau', short: 'AG' },
  thurgau: { slug: 'thurgau', name: 'Thurgau', short: 'TG' },
  tessin: { slug: 'tessin', name: 'Tessin', short: 'TI' },
  waadt: { slug: 'waadt', name: 'Waadt', short: 'VD' },
  wallis: { slug: 'wallis', name: 'Wallis', short: 'VS' },
  neuenburg: { slug: 'neuenburg', name: 'Neuenburg', short: 'NE' },
  genf: { slug: 'genf', name: 'Genf', short: 'GE' },
  jura: { slug: 'jura', name: 'Jura', short: 'JU' },
};

// ==================== STÄDTE ====================
// Nur Städte die eine eigene CityMovers-Seite haben
export const CITIES_MAP: Record<string, CityData> = {
  zuerich: { slug: 'zuerich', name: 'Zürich', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  bern: { slug: 'bern', name: 'Bern', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  basel: { slug: 'basel', name: 'Basel', cantonSlug: 'basel-stadt', cantonName: 'Basel-Stadt', cantonShort: 'BS' },
  genf: { slug: 'genf', name: 'Genf', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  lausanne: { slug: 'lausanne', name: 'Lausanne', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  luzern: { slug: 'luzern', name: 'Luzern', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  winterthur: { slug: 'winterthur', name: 'Winterthur', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  stgallen: { slug: 'stgallen', name: 'St. Gallen', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  zug: { slug: 'zug', name: 'Zug', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  lugano: { slug: 'lugano', name: 'Lugano', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  biel: { slug: 'biel', name: 'Biel/Bienne', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  aarau: { slug: 'aarau', name: 'Aarau', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  schaffhausen: { slug: 'schaffhausen', name: 'Schaffhausen', cantonSlug: 'schaffhausen', cantonName: 'Schaffhausen', cantonShort: 'SH' },
  chur: { slug: 'chur', name: 'Chur', cantonSlug: 'graubuenden', cantonName: 'Graubünden', cantonShort: 'GR' },
  thun: { slug: 'thun', name: 'Thun', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  freiburg: { slug: 'freiburg', name: 'Freiburg', cantonSlug: 'freiburg', cantonName: 'Freiburg', cantonShort: 'FR' },
  solothurn: { slug: 'solothurn', name: 'Solothurn', cantonSlug: 'solothurn', cantonName: 'Solothurn', cantonShort: 'SO' },
  neuchatel: { slug: 'neuchatel', name: 'Neuenburg', cantonSlug: 'neuenburg', cantonName: 'Neuenburg', cantonShort: 'NE' },
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Check if a slug is a known city
 */
export const isCity = (slug: string): boolean => {
  return slug in CITIES_MAP;
};

/**
 * Check if a slug is a known canton (but NOT also a city)
 * For slugs that are both city and canton (like zuerich), this returns false
 * because city takes priority
 */
export const isCantonOnly = (slug: string): boolean => {
  return slug in CANTONS_MAP && !(slug in CITIES_MAP);
};

/**
 * Check if a slug exists in cantons map
 */
export const isCanton = (slug: string): boolean => {
  return slug in CANTONS_MAP;
};

/**
 * Get city data by slug
 */
export const getCity = (slug: string): CityData | null => {
  return CITIES_MAP[slug] || null;
};

/**
 * Get canton data by slug
 */
export const getCanton = (slug: string): CantonData | null => {
  return CANTONS_MAP[slug] || null;
};

/**
 * Resolve a slug to determine its type:
 * - 'city' -> render CityMoversPage
 * - 'canton' -> redirect to /umzugsfirmen/kanton-{slug}
 * - 'unknown' -> 404
 */
export type SlugResolution = 
  | { type: 'city'; data: CityData }
  | { type: 'canton'; data: CantonData; redirectTo: string }
  | { type: 'unknown' };

export const resolveSlug = (slug: string): SlugResolution => {
  // Priority 1: Cities get their own page
  if (isCity(slug)) {
    return { type: 'city', data: CITIES_MAP[slug] };
  }
  
  // Priority 2: Cantons (that are not cities) redirect to /umzugsfirmen/kanton-{slug}
  if (isCanton(slug)) {
    return { 
      type: 'canton', 
      data: CANTONS_MAP[slug],
      redirectTo: `/umzugsfirmen/kanton-${slug}`
    };
  }
  
  // Unknown slug
  return { type: 'unknown' };
};

/**
 * Extract canton slug from /umzugsfirmen/kanton-{slug} format
 */
export const extractCantonFromKantonRoute = (slug: string): string | null => {
  if (slug.startsWith('kanton-')) {
    return slug.replace('kanton-', '');
  }
  return null;
};

// Export arrays for iteration
export const ALL_CANTONS = Object.values(CANTONS_MAP);
export const ALL_CITIES = Object.values(CITIES_MAP);
