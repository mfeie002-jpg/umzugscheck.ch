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

  // === ZH (Agglo & wichtige Städte) ===
  uster: { slug: 'uster', name: 'Uster', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  dubendorf: { slug: 'dubendorf', name: 'Dübendorf', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  dietikon: { slug: 'dietikon', name: 'Dietikon', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  wetzikon: { slug: 'wetzikon', name: 'Wetzikon', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  horgen: { slug: 'horgen', name: 'Horgen', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  kloten: { slug: 'kloten', name: 'Kloten', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  buelach: { slug: 'buelach', name: 'Bülach', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  schlieren: { slug: 'schlieren', name: 'Schlieren', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  wallisellen: { slug: 'wallisellen', name: 'Wallisellen', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },

  // === BE (Region Bern) ===
  koeniz: { slug: 'koeniz', name: 'Köniz', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  ostermundigen: { slug: 'ostermundigen', name: 'Ostermundigen', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  interlaken: { slug: 'interlaken', name: 'Interlaken', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  burgdorf: { slug: 'burgdorf', name: 'Burgdorf', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  langenthal: { slug: 'langenthal', name: 'Langenthal', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },

  // === BS/BL (Region Basel) ===
  riehen: { slug: 'riehen', name: 'Riehen', cantonSlug: 'basel-stadt', cantonName: 'Basel-Stadt', cantonShort: 'BS' },
  liestal: { slug: 'liestal', name: 'Liestal', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  muttenz: { slug: 'muttenz', name: 'Muttenz', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  pratteln: { slug: 'pratteln', name: 'Pratteln', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  allschwil: { slug: 'allschwil', name: 'Allschwil', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  binningen: { slug: 'binningen', name: 'Binningen', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },

  // === GE (Genf Agglo) ===
  carouge: { slug: 'carouge', name: 'Carouge', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  meyrin: { slug: 'meyrin', name: 'Meyrin', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  vernier: { slug: 'vernier', name: 'Vernier', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  lancy: { slug: 'lancy', name: 'Lancy', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },

  // === VD (Waadt) ===
  renens: { slug: 'renens', name: 'Renens', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  nyon: { slug: 'nyon', name: 'Nyon', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  vevey: { slug: 'vevey', name: 'Vevey', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  montreux: { slug: 'montreux', name: 'Montreux', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  morges: { slug: 'morges', name: 'Morges', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  yverdon: { slug: 'yverdon', name: 'Yverdon-les-Bains', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },

  // === TI (Tessin) ===
  bellinzona: { slug: 'bellinzona', name: 'Bellinzona', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  locarno: { slug: 'locarno', name: 'Locarno', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  mendrisio: { slug: 'mendrisio', name: 'Mendrisio', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  chiasso: { slug: 'chiasso', name: 'Chiasso', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },

  // === LU (Zentralschweiz) ===
  kriens: { slug: 'kriens', name: 'Kriens', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  emmen: { slug: 'emmen', name: 'Emmen', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  horw: { slug: 'horw', name: 'Horw', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  ebikon: { slug: 'ebikon', name: 'Ebikon', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },

  // === ZG (Zug) ===
  baar: { slug: 'baar', name: 'Baar', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  cham: { slug: 'cham', name: 'Cham', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },

  // === SG (St. Gallen) ===
  wil: { slug: 'wil', name: 'Wil', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  gossau: { slug: 'gossau', name: 'Gossau', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  rorschach: { slug: 'rorschach', name: 'Rorschach', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  rapperswiljona: { slug: 'rapperswiljona', name: 'Rapperswil-Jona', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },

  // === TG ===
  frauenfeld: { slug: 'frauenfeld', name: 'Frauenfeld', cantonSlug: 'thurgau', cantonName: 'Thurgau', cantonShort: 'TG' },
  kreuzlingen: { slug: 'kreuzlingen', name: 'Kreuzlingen', cantonSlug: 'thurgau', cantonName: 'Thurgau', cantonShort: 'TG' },
  arbon: { slug: 'arbon', name: 'Arbon', cantonSlug: 'thurgau', cantonName: 'Thurgau', cantonShort: 'TG' },

  // === AG (Aargau) ===
  baden: { slug: 'baden', name: 'Baden', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  wettingen: { slug: 'wettingen', name: 'Wettingen', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  lenzburg: { slug: 'lenzburg', name: 'Lenzburg', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  wohlen: { slug: 'wohlen', name: 'Wohlen', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  brugg: { slug: 'brugg', name: 'Brugg', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },

  // === SO ===
  olten: { slug: 'olten', name: 'Olten', cantonSlug: 'solothurn', cantonName: 'Solothurn', cantonShort: 'SO' },
  grenchen: { slug: 'grenchen', name: 'Grenchen', cantonSlug: 'solothurn', cantonName: 'Solothurn', cantonShort: 'SO' },

  // === GR ===
  davos: { slug: 'davos', name: 'Davos', cantonSlug: 'graubuenden', cantonName: 'Graubünden', cantonShort: 'GR' },
  "st-moritz": { slug: 'st-moritz', name: 'St. Moritz', cantonSlug: 'graubuenden', cantonName: 'Graubünden', cantonShort: 'GR' },

  // === VS ===
  sion: { slug: 'sion', name: 'Sion', cantonSlug: 'wallis', cantonName: 'Wallis', cantonShort: 'VS' },
  "brig-glis": { slug: 'brig-glis', name: 'Brig-Glis', cantonSlug: 'wallis', cantonName: 'Wallis', cantonShort: 'VS' },
  martigny: { slug: 'martigny', name: 'Martigny', cantonSlug: 'wallis', cantonName: 'Wallis', cantonShort: 'VS' },

  // === FR ===
  bulle: { slug: 'bulle', name: 'Bulle', cantonSlug: 'freiburg', cantonName: 'Freiburg', cantonShort: 'FR' },

  // === JU ===
  delemont: { slug: 'delemont', name: 'Delémont', cantonSlug: 'jura', cantonName: 'Jura', cantonShort: 'JU' },
  porrentruy: { slug: 'porrentruy', name: 'Porrentruy', cantonSlug: 'jura', cantonName: 'Jura', cantonShort: 'JU' },

  // === SH ===
  neuhausen: { slug: 'neuhausen', name: 'Neuhausen am Rheinfall', cantonSlug: 'schaffhausen', cantonName: 'Schaffhausen', cantonShort: 'SH' },

  // === GL / SZ / UR / OW / NW / AR / AI ===
  glarus: { slug: 'glarus', name: 'Glarus', cantonSlug: 'glarus', cantonName: 'Glarus', cantonShort: 'GL' },
  schwyz: { slug: 'schwyz', name: 'Schwyz', cantonSlug: 'schwyz', cantonName: 'Schwyz', cantonShort: 'SZ' },
  einsiedeln: { slug: 'einsiedeln', name: 'Einsiedeln', cantonSlug: 'schwyz', cantonName: 'Schwyz', cantonShort: 'SZ' },
  kuessnacht: { slug: 'kuessnacht', name: 'Küssnacht', cantonSlug: 'schwyz', cantonName: 'Schwyz', cantonShort: 'SZ' },
  altdorf: { slug: 'altdorf', name: 'Altdorf', cantonSlug: 'uri', cantonName: 'Uri', cantonShort: 'UR' },
  sarnen: { slug: 'sarnen', name: 'Sarnen', cantonSlug: 'obwalden', cantonName: 'Obwalden', cantonShort: 'OW' },
  stans: { slug: 'stans', name: 'Stans', cantonSlug: 'nidwalden', cantonName: 'Nidwalden', cantonShort: 'NW' },
  herisau: { slug: 'herisau', name: 'Herisau', cantonSlug: 'appenzell-ausserrhoden', cantonName: 'Appenzell Ausserrhoden', cantonShort: 'AR' },
  appenzell: { slug: 'appenzell', name: 'Appenzell', cantonSlug: 'appenzell-innerrhoden', cantonName: 'Appenzell Innerrhoden', cantonShort: 'AI' },

  // === NE (weitere Städte) ===
  "la-chaux-de-fonds": { slug: 'la-chaux-de-fonds', name: 'La Chaux-de-Fonds', cantonSlug: 'neuenburg', cantonName: 'Neuenburg', cantonShort: 'NE' },
  "le-locle": { slug: 'le-locle', name: 'Le Locle', cantonSlug: 'neuenburg', cantonName: 'Neuenburg', cantonShort: 'NE' },
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
