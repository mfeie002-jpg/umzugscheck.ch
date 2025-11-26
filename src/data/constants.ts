/**
 * Global constants for umzugscheck.ch
 */

export const CITIES = [
  { name: 'Zürich', slug: 'zuerich', canton: 'ZH' },
  { name: 'Bern', slug: 'bern', canton: 'BE' },
  { name: 'Basel', slug: 'basel', canton: 'BS' },
  { name: 'Genf', slug: 'genf', canton: 'GE' },
  { name: 'Lausanne', slug: 'lausanne', canton: 'VD' },
  { name: 'Luzern', slug: 'luzern', canton: 'LU' },
  { name: 'Winterthur', slug: 'winterthur', canton: 'ZH' },
  { name: 'St. Gallen', slug: 'st-gallen', canton: 'SG' },
  { name: 'Zug', slug: 'zug', canton: 'ZG' },
  { name: 'Lugano', slug: 'lugano', canton: 'TI' },
  { name: 'Biel', slug: 'biel', canton: 'BE' },
  { name: 'Aarau', slug: 'aarau', canton: 'AG' },
  { name: 'Schaffhausen', slug: 'schaffhausen', canton: 'SH' },
  { name: 'Chur', slug: 'chur', canton: 'GR' },
] as const;

export const SERVICES = [
  { name: 'Umzug', slug: 'umzug', icon: 'Truck' },
  { name: 'Endreinigung', slug: 'reinigung', icon: 'Sparkles' },
  { name: 'Räumung', slug: 'raeumung', icon: 'PackageX' },
  { name: 'Firmenumzug', slug: 'firmenumzug', icon: 'Building2' },
  { name: 'Möbeltransport', slug: 'transport', icon: 'Package' },
  { name: 'Lagerung', slug: 'lagerung', icon: 'Warehouse' },
  { name: 'Entsorgung', slug: 'entsorgung', icon: 'Trash2' },
  { name: 'Umzug + Reinigung', slug: 'umzug-mit-reinigung', icon: 'PackagePlus' },
] as const;

export const SITE_CONFIG = {
  name: 'umzugscheck.ch',
  url: 'https://www.umzugscheck.ch',
  description: 'Schweizer Vergleichsportal für Umzugsfirmen',
  logo: '/assets/umzugscheck-logo.png',
  ogImage: '/assets/og-image.png',
  twitterHandle: '@umzugscheck',
} as const;

export const CTA_TEXTS = {
  primary: 'JETZT GRATIS OFFERTEN VERGLEICHEN',
  primaryShort: 'Jetzt vergleichen',
  secondary: 'Mehr erfahren',
  calculator: 'Preis berechnen',
  city: (city: string) => `Offerten in ${city} vergleichen`,
  service: (service: string) => `Jetzt ${service}-Angebote sichern`,
  sticky: 'Kostenlose Offerten – jetzt starten',
  viewCompanies: 'Alle Anbieter anzeigen',
  viewPricing: 'Preisbeispiele ansehen',
} as const;

export const TRUST_METRICS = {
  rating: '4.8',
  ratingMax: '5',
  totalMoves: '15\'000+',
  reviewCount: '2\'800+',
  avgResponseTime: '< 24h',
  satisfaction: '98%',
} as const;
