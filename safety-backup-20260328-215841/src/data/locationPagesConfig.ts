/**
 * LOCATION PAGES CONFIG
 * 
 * Gold Standard Configuration for Canton + City Landing Pages
 * Scalable template system for all Swiss locations
 * 
 * URL Structure:
 * - Canton: /umzugsfirmen/kanton-{slug}
 * - City: /umzugsfirmen/{citySlug}
 */

// ==================== TYPES ====================

export interface PriceMatrixItem {
  label: string;
  min: number;
  max: number;
  savings: string;
  icon: string;
}

export interface TopCompany {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'Günstig' | 'Mittel' | 'Premium';
  badges: ('popular' | 'bestPrice' | 'premium' | 'verified' | 'topRated')[];
  services?: string[];
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  savedAmount?: number;
  verified?: boolean;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface QuartierData {
  name: string;
  challenges: string[];
  tip?: string;
}

export interface PriceExample {
  route: string;
  size: string;
  priceRange: string;
}

export interface ServiceConfig {
  key: string;
  title: string;
  shortDesc: string;
  icon: string;
  slug: string;
  startingFrom?: string;
}

export interface NeighborLink {
  type: 'canton' | 'city';
  name: string;
  slug: string;
}

export interface CityInCanton {
  name: string;
  slug: string;
  shortBlurb: string;
  population?: number;
}

// Base config shared by both
export interface LocationPageBase {
  type: 'canton' | 'city';
  slug: string;
  name: string;
  
  // SEO
  seo: {
    title: string;
    description: string;
    h1: string;
    canonicalUrl: string;
  };
  
  // Stats
  stats: {
    providerCount: number;
    reviewCount: number;
    avgRating: number;
    activeUsersBase?: number;
  };
  
  // Content
  services: ServiceConfig[];
  faqs: FAQ[];
  testimonials: Testimonial[];
  localTips: string[];
  neighbors: NeighborLink[];
}

// Canton-specific config
export interface CantonPageConfig extends LocationPageBase {
  type: 'canton';
  short: string;
  municipalityCount: number;
  
  // Price Matrix
  priceMatrix: {
    small: PriceMatrixItem;
    medium: PriceMatrixItem;
    large: PriceMatrixItem;
  };
  
  // Cities in this canton
  citiesInCanton: CityInCanton[];
  
  // Top companies
  topCompanies: TopCompany[];
}

// City-specific config
export interface CityPageConfig extends LocationPageBase {
  type: 'city';
  cantonSlug: string;
  cantonName: string;
  cantonShort: string;
  population?: number;
  
  // Quartiere
  quartiere: QuartierData[];
  
  // Price examples (routes)
  priceExamples: PriceExample[];
  
  // City-specific services (on top of core)
  citySpecificServices?: ServiceConfig[];
  
  // Unique sections for this city
  uniqueSections?: string[];
}

// ==================== CORE SERVICES (Shared) ====================

export const CORE_SERVICES: ServiceConfig[] = [
  { key: 'privatumzug', title: 'Privatumzug', shortDesc: 'Kompletter Umzugsservice für Ihr Zuhause', icon: 'Home', slug: 'privatumzug' },
  { key: 'firmenumzug', title: 'Firmenumzug', shortDesc: 'Professioneller Büro- & Geschäftsumzug', icon: 'Building2', slug: 'firmenumzug' },
  { key: 'reinigung', title: 'Umzugsreinigung', shortDesc: 'Endreinigung mit Abnahmegarantie', icon: 'Sparkles', slug: 'reinigung', startingFrom: 'ab CHF 250' },
  { key: 'montage', title: 'Möbelmontage', shortDesc: 'Auf- & Abbau Ihrer Möbel', icon: 'Wrench', slug: 'montage' },
  { key: 'packservice', title: 'Ein-/Auspackservice', shortDesc: 'Professionelles Verpacken', icon: 'Package', slug: 'packservice' },
  { key: 'lagerung', title: 'Einlagerung', shortDesc: 'Sichere Lagerräume in Ihrer Nähe', icon: 'Warehouse', slug: 'lagerung' },
  { key: 'entsorgung', title: 'Entsorgung', shortDesc: 'Fachgerechte Entsorgung & Recycling', icon: 'Trash2', slug: 'entsorgung' },
  { key: 'spezialtransport', title: 'Spezialtransport', shortDesc: 'Klavier, Kunst, Tresor & mehr', icon: 'Truck', slug: 'spezialtransport' },
];

// ==================== ZUG CANTON CONFIG ====================

export const KANTON_ZUG_CONFIG: CantonPageConfig = {
  type: 'canton',
  slug: 'zug',
  name: 'Zug',
  short: 'ZG',
  municipalityCount: 11,
  
  seo: {
    title: 'Umzugsfirmen Kanton Zug vergleichen | Alle 11 Gemeinden | Umzugscheck',
    description: 'Vergleichen Sie 30+ geprüfte Umzugsfirmen im Kanton Zug. Gratis Offerten in 24–48h für alle 11 Gemeinden. Bis zu 40% sparen.',
    h1: 'Umzugsfirmen im Kanton Zug vergleichen',
    canonicalUrl: '/umzugsfirmen/kanton-zug',
  },
  
  stats: {
    providerCount: 30,
    reviewCount: 2847,
    avgRating: 4.8,
    activeUsersBase: 15,
  },
  
  priceMatrix: {
    small: { 
      label: '1.5 - 2.5 Zimmer', 
      min: 550, 
      max: 900, 
      savings: 'bis CHF 360',
      icon: 'Home'
    },
    medium: { 
      label: '3.5 - 4.5 Zimmer', 
      min: 770, 
      max: 1200, 
      savings: 'bis CHF 480',
      icon: 'Building'
    },
    large: { 
      label: '5+ Zimmer / Haus', 
      min: 1500, 
      max: 2500, 
      savings: 'bis CHF 600',
      icon: 'Castle'
    },
  },
  
  topCompanies: [
    { id: 'zuger-umzuege', name: 'Zuger Umzüge AG', rating: 4.9, reviewCount: 187, priceLevel: 'Mittel', badges: ['popular', 'verified'] },
    { id: 'happy-move', name: 'Happy Move Baar', rating: 4.7, reviewCount: 134, priceLevel: 'Günstig', badges: ['bestPrice', 'verified'] },
    { id: 'see-transporte', name: 'See-Transporte Cham', rating: 4.8, reviewCount: 98, priceLevel: 'Premium', badges: ['premium', 'topRated'] },
    { id: 'aegerital-transport', name: 'Ägerital Transport GmbH', rating: 4.8, reviewCount: 76, priceLevel: 'Mittel', badges: ['verified'] },
  ],
  
  citiesInCanton: [
    { name: 'Zug', slug: 'zug', shortBlurb: 'Altstadt & Crypto Valley', population: 32000 },
    { name: 'Baar', slug: 'baar', shortBlurb: 'Grösste Gemeinde, gute Anbindung', population: 25000 },
    { name: 'Cham', slug: 'cham', shortBlurb: 'Seeufer & Familienquartiere', population: 17000 },
    { name: 'Risch-Rotkreuz', slug: 'risch-rotkreuz', shortBlurb: 'Zentrale Lage, schnell wachsend', population: 11000 },
    { name: 'Steinhausen', slug: 'steinhausen', shortBlurb: 'Zwischen Zug & Cham', population: 10500 },
    { name: 'Hünenberg', slug: 'huenenberg', shortBlurb: 'Ruhige Wohnlage', population: 9500 },
    { name: 'Oberägeri', slug: 'oberaegeri', shortBlurb: 'Bergdorf am Ägerisee', population: 6500 },
    { name: 'Unterägeri', slug: 'unteraegeri', shortBlurb: 'Erholungsgebiet am Ägerisee', population: 8500 },
    { name: 'Menzingen', slug: 'menzingen', shortBlurb: 'Ländliche Gemeinde', population: 5000 },
    { name: 'Neuheim', slug: 'neuheim', shortBlurb: 'Kleinste Gemeinde', population: 2500 },
    { name: 'Walchwil', slug: 'walchwil', shortBlurb: 'Am Zugersee, Premium-Lagen', population: 3800 },
  ],
  
  localTips: [
    'Für Altstadt Zug: Halteverbotszone unbedingt organisieren (enges Gassensystem)',
    'Crypto Valley = viele internationale Umzüge, Teams mit Englisch-Kenntnissen wählen',
    'Ägerital: Steile Zufahrten erfordern kleinere Fahrzeuge oder Möbellift',
    'Monatsende-Termine sind in Zug sehr beliebt – 4-6 Wochen Vorlauf empfohlen',
    'Zuger Firmen kennen die Eigenheiten der 11 Gemeinden',
    'Premium-Lagen wie Walchwil haben oft Zufahrtsbeschränkungen',
    'Kombinieren Sie Umzug + Reinigung für Abnahmegarantie',
    'Expat-Umzüge: Zollformalitäten bei internationalen Zügen beachten',
    'Firmenumzüge: IT-Equipment erfordert Spezialverpackung',
    'Wochenend-Umzüge sind in Wohnquartieren oft günstiger',
  ],
  
  faqs: [
    { question: 'Was kostet ein Umzug im Kanton Zug?', answer: 'Die Kosten variieren je nach Wohnungsgrösse und Strecke. Ein 2-Zimmer-Umzug kostet CHF 550-900, ein 4-Zimmer-Umzug CHF 770-1\'200. Mit dem Vergleich sparen Sie bis zu 40%.' },
    { question: 'Wie viele Umzugsfirmen gibt es im Kanton Zug?', answer: 'Wir arbeiten mit über 30 geprüften Umzugsfirmen im Kanton Zug zusammen. Alle sind versichert und haben positive Bewertungen.' },
    { question: 'Wie schnell erhalte ich Offerten?', answer: 'In der Regel erhalten Sie 3-5 unverbindliche Offerten innerhalb von 24-48 Stunden.' },
    { question: 'Welche Gemeinden werden abgedeckt?', answer: 'Alle 11 Gemeinden im Kanton Zug: Zug, Baar, Cham, Risch-Rotkreuz, Steinhausen, Hünenberg, Oberägeri, Unterägeri, Menzingen, Neuheim und Walchwil.' },
    { question: 'Brauche ich in Zug eine Halteverbotszone?', answer: 'In der Altstadt Zug und engen Quartieren ist eine Halteverbotszone empfohlen. Unsere Partner organisieren dies für Sie.' },
    { question: 'Bieten Zuger Firmen auch Reinigung an?', answer: 'Ja, viele unserer Partner bieten Komplettpaket: Umzug + Endreinigung + Wohnungsabgabe mit Abnahmegarantie.' },
    { question: 'Was ist bei Expat-Umzügen zu beachten?', answer: 'Bei internationalen Umzügen helfen unsere Partner mit Zollformalitäten. Viele Teams sprechen Englisch.' },
    { question: 'Wie weit im Voraus sollte ich buchen?', answer: 'Mindestens 3-4 Wochen im Voraus, bei Monatsende-Terminen oder Hauptsaison 6-8 Wochen.' },
    { question: 'Führt Umzugscheck.ch selbst Umzüge durch?', answer: 'Nein, Umzugscheck.ch ist ein reiner Vergleichs- und Vermittlungsservice. Der Umzug wird durch unsere geprüften Partnerfirmen durchgeführt.' },
    { question: 'Sind die Offerten wirklich kostenlos?', answer: 'Ja, alle Offerten sind 100% kostenlos und unverbindlich. Sie gehen keinerlei Verpflichtung ein.' },
  ],
  
  testimonials: [
    { name: 'Marco K.', location: 'Zug → Baar', rating: 5, text: 'Super Service! Die Firma war pünktlich und hat alles professionell erledigt.', date: '2024-11', savedAmount: 340, verified: true },
    { name: 'Sarah L.', location: 'Cham → Steinhausen', rating: 5, text: 'Dank dem Vergleich habe ich über CHF 400 gespart. Sehr empfehlenswert!', date: '2024-10', savedAmount: 420, verified: true },
    { name: 'Thomas M.', location: 'Risch → Zug', rating: 4, text: 'Schnelle Offerten und gute Beratung. Würde ich wieder nutzen.', date: '2024-10', verified: true },
    { name: 'Julia B.', location: 'Oberägeri → Unterägeri', rating: 5, text: 'Trotz steiler Strasse hat alles perfekt geklappt. Top Team!', date: '2024-09', savedAmount: 280, verified: true },
    { name: 'Peter H.', location: 'Hünenberg → Cham', rating: 5, text: 'Komplettpaket mit Reinigung gebucht. Wohnungsabgabe hat auf Anhieb geklappt!', date: '2024-09', savedAmount: 510, verified: true },
    { name: 'Anna S.', location: 'Walchwil → Zug', rating: 5, text: 'Premium-Service für meine Antiquitäten. Alles unbeschädigt angekommen.', date: '2024-08', verified: true },
  ],
  
  services: CORE_SERVICES,
  
  neighbors: [
    { type: 'canton', name: 'Zürich', slug: 'zuerich' },
    { type: 'canton', name: 'Schwyz', slug: 'schwyz' },
    { type: 'canton', name: 'Luzern', slug: 'luzern' },
    { type: 'canton', name: 'Aargau', slug: 'aargau' },
  ],
};

// ==================== ZUG CITY CONFIG ====================

export const STADT_ZUG_CONFIG: CityPageConfig = {
  type: 'city',
  slug: 'zug',
  name: 'Zug',
  cantonSlug: 'zug',
  cantonName: 'Zug',
  cantonShort: 'ZG',
  population: 32000,
  
  seo: {
    title: 'Umzugsfirmen in Zug vergleichen | Alle Quartiere | Umzugscheck',
    description: 'Vergleichen Sie geprüfte Umzugsfirmen in der Stadt Zug. Von Altstadt bis Zugerberg – Gratis Offerten in 24–48h. Bis zu 40% sparen.',
    h1: 'Umzugsfirmen in Zug vergleichen',
    canonicalUrl: '/umzugsfirmen/zug',
  },
  
  stats: {
    providerCount: 25,
    reviewCount: 1847,
    avgRating: 4.8,
    activeUsersBase: 12,
  },
  
  quartiere: [
    { 
      name: 'Altstadt & Seepromenade', 
      challenges: ['Enge Gassen', 'Halteverbot nötig', 'Zeitfenster beachten'],
      tip: 'Möbellift für Altbauten empfohlen'
    },
    { 
      name: 'Herti & Guthirt', 
      challenges: ['Moderne Wohnblöcke', 'Gute Parkplätze', 'Schnelle Zufahrt'],
      tip: 'Standard-Umzug meist problemlos'
    },
    { 
      name: 'Lorzen & Oberwil', 
      challenges: ['Familienquartiere', 'Einfamilienhäuser', 'Grössere Volumen'],
      tip: 'Mehr Helfer für EFH einplanen'
    },
    { 
      name: 'Bahnhof & Crypto Valley', 
      challenges: ['Büros & Studios', 'Express-Umzüge', 'Mehrsprachig'],
      tip: 'Expat-erfahrene Teams wählen'
    },
    { 
      name: 'Zugerberg', 
      challenges: ['Steile Zufahrt', 'Kleinere Fahrzeuge', 'Premium-Lagen'],
      tip: 'Vorabbesichtigung empfohlen'
    },
    { 
      name: 'Letzi & Industrie', 
      challenges: ['Gute A4-Anbindung', 'Firmenumzüge', 'Keine Parkprobleme'],
      tip: 'Ideal für Büroumzüge'
    },
  ],
  
  priceExamples: [
    { route: 'Altstadt → Herti', size: '2 Zimmer', priceRange: 'CHF 690–1\'100' },
    { route: 'Guthirt → Baar', size: '3.5 Zimmer', priceRange: 'CHF 950–1\'450' },
    { route: 'Seestrasse → Cham', size: '4.5 Zimmer', priceRange: 'CHF 1\'300–1\'950' },
    { route: 'Oberwil → Steinhausen', size: '5 Zimmer EFH', priceRange: 'CHF 1\'800–2\'600' },
    { route: 'Zürich → Zug (Expat)', size: '3.5 Zimmer', priceRange: 'CHF 1\'400–2\'100' },
  ],
  
  citySpecificServices: [
    { key: 'multilingual', title: 'Mehrsprachige Teams', shortDesc: 'DE/EN/FR für Expats', icon: 'Globe', slug: 'international' },
    { key: 'international', title: 'Internationale Umzüge', shortDesc: 'EU & weltweit', icon: 'Plane', slug: 'international' },
    { key: 'zoll', title: 'Zollformalitäten', shortDesc: 'Für Grenzübertritt', icon: 'FileCheck', slug: 'international' },
    { key: 'relocation', title: 'Relocation', shortDesc: 'Kompletter Standortwechsel', icon: 'MapPin', slug: 'relocation' },
    { key: 'bueroumzug', title: 'Büro- & Firmenumzug', shortDesc: 'Crypto Valley Expertise', icon: 'Building2', slug: 'firmenumzug' },
    { key: 'it-transport', title: 'Serverraum-/IT-Transport', shortDesc: 'Sichere IT-Verlegung', icon: 'Server', slug: 'spezialtransport' },
  ],
  
  uniqueSections: ['Quartiere', 'Preisbeispiele', 'Expat+Firmenumzug', 'Komplettpaket', '5 Tipps', 'Internal Linking'],
  
  localTips: [
    'Altstadt: Halteverbotszone ist Pflicht – unsere Partner organisieren dies',
    'Crypto Valley: Viele Expat-Umzüge, Teams mit Englisch wählen',
    'Zugerberg: Vorabbesichtigung wegen steiler Zufahrt empfohlen',
    'Monatsende-Termine: Mindestens 4 Wochen Vorlauf in Zug',
    'Komplettpaket (Umzug + Reinigung) spart Zeit bei Wohnungsabgabe',
  ],
  
  faqs: [
    { question: 'Was kostet ein Umzug in der Stadt Zug?', answer: 'Die Kosten hängen von Wohnungsgrösse, Etage und Quartier ab. Ein 2-Zimmer-Umzug innerhalb Zug kostet CHF 690-1\'100, ein 4-Zimmer-Umzug CHF 1\'300-1\'950.' },
    { question: 'Brauche ich in der Altstadt Zug eine Halteverbotszone?', answer: 'Ja, in der Altstadt und vielen Quartieren ist eine Parkbewilligung nötig. Unsere Partner organisieren dies für CHF 80-120.' },
    { question: 'Gibt es Umzugsfirmen mit Englisch-Service?', answer: 'Ja, viele unserer Partner im Crypto Valley bieten mehrsprachigen Service (DE/EN/FR) für Expats an.' },
    { question: 'Was ist bei einem Umzug auf den Zugerberg zu beachten?', answer: 'Die steile Zufahrt erfordert oft kleinere Fahrzeuge. Wir empfehlen eine Vorabbesichtigung durch die Umzugsfirma.' },
    { question: 'Bieten Zuger Firmen auch Büroumzüge an?', answer: 'Ja, viele Partner haben Erfahrung mit Firmenumzügen im Crypto Valley, inkl. IT-Equipment und Serverräumen.' },
    { question: 'Führt Umzugscheck.ch selbst Umzüge durch?', answer: 'Nein, Umzugscheck.ch ist ein reiner Vergleichs- und Vermittlungsservice. Der Umzug wird durch geprüfte Partnerfirmen durchgeführt.' },
  ],
  
  testimonials: [
    { name: 'Michael R.', location: 'Altstadt → Herti', rating: 5, text: 'Umzug in der Altstadt perfekt gemeistert. Halteverbot war kein Problem.', date: '2024-11', savedAmount: 320, verified: true },
    { name: 'Emma T.', location: 'Zürich → Zug', rating: 5, text: 'Expat-Umzug super organisiert. Team sprach perfekt Englisch!', date: '2024-10', savedAmount: 450, verified: true },
    { name: 'David S.', location: 'Zugerberg', rating: 5, text: 'Trotz steiler Zufahrt alles reibungslos. Sehr professionell.', date: '2024-09', verified: true },
  ],
  
  services: CORE_SERVICES,
  
  neighbors: [
    { type: 'canton', name: 'Kanton Zug', slug: 'kanton-zug' },
    { type: 'city', name: 'Baar', slug: 'baar' },
    { type: 'city', name: 'Cham', slug: 'cham' },
    { type: 'city', name: 'Steinhausen', slug: 'steinhausen' },
    { type: 'city', name: 'Hünenberg', slug: 'huenenberg' },
  ],
};

// ==================== LOCATION PAGES REGISTRY ====================

export const locationPages = {
  // Cantons
  'kanton-zug': KANTON_ZUG_CONFIG,
  
  // Cities
  'zug': STADT_ZUG_CONFIG,
};

// ==================== HELPER FUNCTIONS ====================

export function getLocationConfig(slug: string): CantonPageConfig | CityPageConfig | null {
  return locationPages[slug as keyof typeof locationPages] || null;
}

export function isCantonConfig(config: CantonPageConfig | CityPageConfig): config is CantonPageConfig {
  return config.type === 'canton';
}

export function isCityConfig(config: CantonPageConfig | CityPageConfig): config is CityPageConfig {
  return config.type === 'city';
}

export function getServiceLink(serviceSlug: string, locationSlug: string, locationType: 'canton' | 'city'): string {
  if (locationType === 'canton') {
    return `/leistungen/${serviceSlug}/kanton-${locationSlug}`;
  }
  return `/leistungen/${serviceSlug}/${locationSlug}`;
}
