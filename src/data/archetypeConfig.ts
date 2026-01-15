/**
 * ARCHETYPE CONFIGURATION
 * 
 * Gold Standard Data Model for:
 * - Canton Landing Pages
 * - City Landing Pages  
 * - Service + Canton Pages
 * - Service + City Pages
 * 
 * Scalable, Type-Safe, SEO-Optimized
 */

// ==================== BASE TYPES ====================

export interface SEOConfig {
  title: string;
  description: string;
  h1: string;
  canonicalUrl: string;
}

export interface PlaceStats {
  providerCount: number;
  reviewCount: number;
  avgRating: number;
  activeUsersBase?: number;
}

export interface TrustGlobals {
  totalReviews: number;
  totalProviders: number;
  savingsPercent: number;
}

export interface TopCompany {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'Günstig' | 'Mittel' | 'Premium';
  badges: ('popular' | 'bestPrice' | 'premium' | 'verified' | 'topRated')[];
  shortPitch?: string;
  services?: string[];
}

export interface PriceAnchor {
  label: string;
  min: number;
  max: number;
  savingsText: string;
  notes?: string;
  icon?: string;
}

export interface PriceExample {
  routeLabel: string;
  sizeLabel: string;
  priceRange: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  name: string;
  place: string;
  rating: number;
  text: string;
  savedAmount?: number;
  verified?: boolean;
  date?: string;
}

export interface InternalLink {
  label: string;
  href: string;
}

export interface QuartierData {
  name: string;
  challenges: string[];
  tip?: string;
}

// ==================== SERVICE TYPES ====================

export interface ServiceConfig {
  key: string;
  slug: string;
  title: string;
  shortDesc: string;
  iconKey: string;
  uspBullets: string[];
  packages?: ServicePackage[];
  startingFrom?: string;
  isPopular?: boolean;
}

export interface ServicePackage {
  name: string;
  bestFor: string;
  bullets: string[];
  highlight?: boolean;
}

export interface ServicePlaceOverrides {
  placeSlug: string;
  serviceSlug: string;
  uniqueIntro?: string;
  uniqueTips?: string[];
  uniqueFaqs?: FAQ[];
  priceOverrides?: PriceAnchor[];
}

// ==================== PLACE BASE ====================

export interface PlaceBase {
  kind: 'canton' | 'city';
  name: string;
  slug: string;
  seo: SEOConfig;
  stats: PlaceStats;
  trustGlobals: TrustGlobals;
  topCompanies: TopCompany[];
  price: {
    anchors: PriceAnchor[];
    examples?: PriceExample[];
  };
  faqs: FAQ[];
  testimonials: Testimonial[];
  localTips: string[];
  internalLinks: {
    parent?: InternalLink;
    children?: InternalLink[];
    neighbors?: InternalLink[];
  };
  services: ServiceConfig[];
}

// Canton-specific
export interface CantonConfig extends PlaceBase {
  kind: 'canton';
  short: string;
  municipalityCount: number;
  citiesInCanton: Array<{
    name: string;
    slug: string;
    shortBlurb: string;
    population?: number;
  }>;
}

// City-specific
export interface CityConfig extends PlaceBase {
  kind: 'city';
  cantonSlug: string;
  cantonName: string;
  cantonShort: string;
  population?: number;
  quartiere: QuartierData[];
  citySpecificServices?: ServiceConfig[];
}

// ==================== CORE SERVICES ====================

export const CORE_SERVICES: ServiceConfig[] = [
  {
    key: 'privatumzug',
    slug: 'privatumzug',
    title: 'Privatumzug',
    shortDesc: 'Stressfreier Umzug für Ihr Zuhause',
    iconKey: 'Home',
    isPopular: true,
    uspBullets: [
      'Kompletter Service von A bis Z',
      'Professionelles Team',
      'Versicherung inklusive',
      'Flexible Termine',
    ],
    packages: [
      { name: 'Basis', bestFor: 'DIY mit Unterstützung', bullets: ['Transport', 'Tragservice', 'Grundversicherung'] },
      { name: 'Standard', bestFor: 'Die meisten Umzüge', bullets: ['Transport', 'Tragservice', 'Möbelschutz', 'Vollversicherung'], highlight: true },
      { name: 'Komfort', bestFor: 'Rundum sorglos', bullets: ['Alles inklusive', 'Ein-/Auspacken', 'Montage', 'Reinigung'] },
    ],
  },
  {
    key: 'firmenumzug',
    slug: 'firmenumzug',
    title: 'Firmenumzug',
    shortDesc: 'Professioneller Büro- & Geschäftsumzug',
    iconKey: 'Building2',
    uspBullets: [
      'Minimale Ausfallzeit',
      'IT-Equipment Handling',
      'Wochenend-Service',
      'Projektmanagement',
    ],
    packages: [
      { name: 'Büro klein', bestFor: '1-10 Arbeitsplätze', bullets: ['Büromöbel', 'IT-Grundservice', 'Wochenende möglich'] },
      { name: 'Büro mittel', bestFor: '10-50 Arbeitsplätze', bullets: ['Komplettumzug', 'IT-Spezialtransport', 'Projektleitung'], highlight: true },
      { name: 'Enterprise', bestFor: '50+ Arbeitsplätze', bullets: ['Full Service', 'IT-Infrastruktur', 'Etappenumzug', 'Notfallplan'] },
    ],
  },
  {
    key: 'endreinigung',
    slug: 'endreinigung',
    title: 'Endreinigung',
    shortDesc: 'Abnahmegarantie für Ihre Wohnung',
    iconKey: 'Sparkles',
    isPopular: true,
    startingFrom: 'ab CHF 250',
    uspBullets: [
      'Abnahmegarantie inklusive',
      'Professionelle Reinigungsteams',
      'Alle Räume inkl. Küche & Bad',
      'Nachreinigung bei Bedarf kostenlos',
    ],
    packages: [
      { name: 'Standard', bestFor: '1-3 Zimmer', bullets: ['Grundreinigung', 'Küche & Bad', 'Fenster innen'] },
      { name: 'Premium', bestFor: '3.5-5 Zimmer', bullets: ['Intensivreinigung', 'Backofen & Kühlschrank', 'Fenster innen/aussen'], highlight: true },
      { name: 'XL', bestFor: '5+ Zimmer / Haus', bullets: ['Komplettreinigung', 'Keller & Garage', 'Balkon/Terrasse', 'Nachkontrolle'] },
    ],
  },
  {
    key: 'moebelmontage',
    slug: 'moebelmontage',
    title: 'Möbelmontage',
    shortDesc: 'Auf- & Abbau durch Profis',
    iconKey: 'Wrench',
    uspBullets: [
      'Fachgerechte Montage',
      'Erfahrene Monteure',
      'Werkzeug inklusive',
      'Schadensversicherung',
    ],
  },
  {
    key: 'packservice',
    slug: 'packservice',
    title: 'Ein-/Auspackservice',
    shortDesc: 'Professionelles Verpacken',
    iconKey: 'Package',
    uspBullets: [
      'Zeitsparend',
      'Professionelles Material',
      'Bruchsicheres Verpacken',
      'Beschriftung inklusive',
    ],
  },
  {
    key: 'lagerung',
    slug: 'lagerung',
    title: 'Einlagerung',
    shortDesc: 'Sichere Lagerräume',
    iconKey: 'Warehouse',
    uspBullets: [
      'Klimatisierte Räume',
      'Flexibel buchbar',
      'Versicherung inklusive',
      'Jederzeit zugänglich',
    ],
  },
  {
    key: 'entsorgung',
    slug: 'entsorgung',
    title: 'Entsorgung',
    shortDesc: 'Fachgerechte Entsorgung',
    iconKey: 'Trash2',
    uspBullets: [
      'Umweltgerechte Entsorgung',
      'Sperrmüll & Elektro',
      'Entrümpelung',
      'Nachweis inklusive',
    ],
  },
  {
    key: 'spezialtransport',
    slug: 'spezialtransport',
    title: 'Spezialtransport',
    shortDesc: 'Klavier, Tresor, Kunst',
    iconKey: 'Truck',
    uspBullets: [
      'Spezialequipment',
      'Erfahrene Teams',
      'Vollversicherung',
      'Klimatransport möglich',
    ],
  },
];

// ==================== TRUST GLOBALS ====================

export const TRUST_GLOBALS: TrustGlobals = {
  totalReviews: 15000,
  totalProviders: 200,
  savingsPercent: 40,
};

// ==================== KANTON ZUG CONFIG ====================

export const KANTON_ZUG: CantonConfig = {
  kind: 'canton',
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
  
  trustGlobals: TRUST_GLOBALS,
  
  price: {
    anchors: [
      { label: '1.5 - 2.5 Zimmer', min: 550, max: 900, savingsText: 'bis CHF 360', icon: 'Home' },
      { label: '3.5 - 4.5 Zimmer', min: 770, max: 1200, savingsText: 'bis CHF 480', icon: 'Building' },
      { label: '5+ Zimmer / Haus', min: 1500, max: 2500, savingsText: 'bis CHF 600', icon: 'Castle' },
    ],
  },
  
  topCompanies: [
    { id: 'zuger-umzuege', name: 'Zuger Umzüge AG', rating: 4.9, reviewCount: 187, priceLevel: 'Mittel', badges: ['popular', 'verified'], shortPitch: 'Lokale Expertise seit 15+ Jahren' },
    { id: 'happy-move', name: 'Happy Move Baar', rating: 4.7, reviewCount: 134, priceLevel: 'Günstig', badges: ['bestPrice', 'verified'], shortPitch: 'Bestes Preis-Leistungs-Verhältnis' },
    { id: 'see-transporte', name: 'See-Transporte Cham', rating: 4.8, reviewCount: 98, priceLevel: 'Premium', badges: ['premium', 'topRated'], shortPitch: 'Premium-Service für anspruchsvolle Kunden' },
    { id: 'aegerital-transport', name: 'Ägerital Transport GmbH', rating: 4.8, reviewCount: 76, priceLevel: 'Mittel', badges: ['verified'], shortPitch: 'Spezialist für Ägerital & Berglagen' },
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
    { question: 'Brauche ich im Kanton Zug eine Halteverbotszone?', answer: 'In der Altstadt Zug und engen Quartieren ist eine Halteverbotszone empfohlen. Unsere Partner organisieren dies für Sie.' },
    { question: 'Bieten Zuger Firmen auch Reinigung an?', answer: 'Ja, viele unserer Partner bieten Komplettpaket: Umzug + Endreinigung + Wohnungsabgabe mit Abnahmegarantie.' },
    { question: 'Was ist bei Expat-Umzügen zu beachten?', answer: 'Bei internationalen Umzügen helfen unsere Partner mit Zollformalitäten. Viele Teams sprechen Englisch.' },
    { question: 'Wie weit im Voraus sollte ich buchen?', answer: 'Mindestens 3-4 Wochen im Voraus, bei Monatsende-Terminen oder Hauptsaison 6-8 Wochen.' },
    { question: 'Führt Umzugscheck.ch selbst Umzüge durch?', answer: 'Nein, Umzugscheck.ch ist ein reiner Vergleichs- und Vermittlungsservice. Der Umzug wird durch unsere geprüften Partnerfirmen durchgeführt.' },
    { question: 'Sind die Offerten wirklich kostenlos?', answer: 'Ja, alle Offerten sind 100% kostenlos und unverbindlich. Sie gehen keinerlei Verpflichtung ein.' },
  ],
  
  testimonials: [
    { name: 'Marco K.', place: 'Zug → Baar', rating: 5, text: 'Super Service! Die Firma war pünktlich und hat alles professionell erledigt.', savedAmount: 340, verified: true, date: '2024-11' },
    { name: 'Sarah L.', place: 'Cham → Steinhausen', rating: 5, text: 'Dank dem Vergleich habe ich über CHF 400 gespart. Sehr empfehlenswert!', savedAmount: 420, verified: true, date: '2024-10' },
    { name: 'Thomas M.', place: 'Risch → Zug', rating: 4, text: 'Schnelle Offerten und gute Beratung. Würde ich wieder nutzen.', verified: true, date: '2024-10' },
    { name: 'Julia B.', place: 'Oberägeri → Unterägeri', rating: 5, text: 'Trotz steiler Strasse hat alles perfekt geklappt. Top Team!', savedAmount: 280, verified: true, date: '2024-09' },
    { name: 'Peter H.', place: 'Hünenberg → Cham', rating: 5, text: 'Komplettpaket mit Reinigung gebucht. Wohnungsabgabe hat auf Anhieb geklappt!', savedAmount: 510, verified: true, date: '2024-09' },
    { name: 'Anna S.', place: 'Walchwil → Zug', rating: 5, text: 'Premium-Service für meine Antiquitäten. Alles unbeschädigt angekommen.', verified: true, date: '2024-08' },
  ],
  
  services: CORE_SERVICES,
  
  internalLinks: {
    parent: { label: 'Umzugsfirmen Schweiz', href: '/umzugsfirmen-schweiz' },
    neighbors: [
      { label: 'Kanton Zürich', href: '/umzugsfirmen/kanton-zuerich' },
      { label: 'Kanton Schwyz', href: '/umzugsfirmen/kanton-schwyz' },
      { label: 'Kanton Luzern', href: '/umzugsfirmen/kanton-luzern' },
      { label: 'Kanton Aargau', href: '/umzugsfirmen/kanton-aargau' },
    ],
  },
};

// ==================== STADT ZUG CONFIG ====================

export const STADT_ZUG: CityConfig = {
  kind: 'city',
  slug: 'zug',
  name: 'Zug',
  cantonSlug: 'zug',
  cantonName: 'Zug',
  cantonShort: 'ZG',
  population: 32000,
  
  seo: {
    title: 'Umzugsfirmen in Zug vergleichen | Alle Quartiere | Umzugscheck',
    description: 'Vergleichen Sie geprüfte Umzugsfirmen in der Stadt Zug. Von Altstadt bis Zugerberg – Gratis Offerten in 24–48h. Bis zu 40% sparen.',
    h1: 'Umzugsfirma in Zug finden: Offerten vergleichen & sparen',
    canonicalUrl: '/umzugsfirmen/zug',
  },
  
  stats: {
    providerCount: 25,
    reviewCount: 1847,
    avgRating: 4.8,
    activeUsersBase: 12,
  },
  
  trustGlobals: TRUST_GLOBALS,
  
  price: {
    anchors: [
      { label: '1.5 - 2.5 Zimmer', min: 690, max: 1100, savingsText: 'bis CHF 320', icon: 'Home' },
      { label: '3.5 - 4.5 Zimmer', min: 950, max: 1500, savingsText: 'bis CHF 450', icon: 'Building' },
      { label: '5+ Zimmer / Haus', min: 1600, max: 2600, savingsText: 'bis CHF 580', icon: 'Castle' },
    ],
    examples: [
      { routeLabel: 'Altstadt → Herti', sizeLabel: '2 Zimmer', priceRange: 'CHF 690–1\'100' },
      { routeLabel: 'Guthirt → Baar', sizeLabel: '3.5 Zimmer', priceRange: 'CHF 950–1\'450' },
      { routeLabel: 'Seestrasse → Cham', sizeLabel: '4.5 Zimmer', priceRange: 'CHF 1\'300–1\'950' },
      { routeLabel: 'Oberwil → Steinhausen', sizeLabel: '5 Zimmer EFH', priceRange: 'CHF 1\'800–2\'600' },
      { routeLabel: 'Zürich → Zug (Expat)', sizeLabel: '3.5 Zimmer', priceRange: 'CHF 1\'400–2\'100' },
    ],
  },
  
  topCompanies: KANTON_ZUG.topCompanies,
  
  quartiere: [
    { name: 'Altstadt & Seepromenade', challenges: ['Enge Gassen', 'Halteverbot nötig', 'Zeitfenster beachten'], tip: 'Möbellift für Altbauten empfohlen' },
    { name: 'Herti & Guthirt', challenges: ['Moderne Wohnblöcke', 'Gute Parkplätze', 'Schnelle Zufahrt'], tip: 'Standard-Umzug meist problemlos' },
    { name: 'Lorzen & Oberwil', challenges: ['Familienquartiere', 'Einfamilienhäuser', 'Grössere Volumen'], tip: 'Mehr Helfer für EFH einplanen' },
    { name: 'Bahnhof & Crypto Valley', challenges: ['Büros & Studios', 'Express-Umzüge', 'Mehrsprachig'], tip: 'Expat-erfahrene Teams wählen' },
    { name: 'Zugerberg', challenges: ['Steile Zufahrt', 'Kleinere Fahrzeuge', 'Premium-Lagen'], tip: 'Vorabbesichtigung empfohlen' },
    { name: 'Letzi & Industrie', challenges: ['Gute A4-Anbindung', 'Firmenumzüge', 'Keine Parkprobleme'], tip: 'Ideal für Büroumzüge' },
  ],
  
  citySpecificServices: [
    { key: 'multilingual', slug: 'international', title: 'Mehrsprachige Teams', shortDesc: 'DE/EN/FR für Expats', iconKey: 'Globe', uspBullets: ['Deutsch, Englisch, Französisch', 'Expat-Erfahrung', 'Internationale Standards'] },
    { key: 'international', slug: 'international', title: 'Internationale Umzüge', shortDesc: 'EU & weltweit', iconKey: 'Plane', uspBullets: ['Zollformalitäten', 'Container-Service', 'Länderexpertise'] },
    { key: 'relocation', slug: 'relocation', title: 'Relocation', shortDesc: 'Kompletter Standortwechsel', iconKey: 'MapPin', uspBullets: ['Alles aus einer Hand', 'Behördengänge', 'Wohnungssuche Support'] },
    { key: 'bueroumzug', slug: 'firmenumzug', title: 'Büro- & Firmenumzug', shortDesc: 'Crypto Valley Expertise', iconKey: 'Building2', uspBullets: ['IT-Equipment', 'Serverräume', 'Minimale Ausfallzeit'] },
    { key: 'it-transport', slug: 'spezialtransport', title: 'Serverraum-/IT-Transport', shortDesc: 'Sichere IT-Verlegung', iconKey: 'Server', uspBullets: ['ESD-Schutz', 'Klimatransport', 'Datenträger-Handling'] },
  ],
  
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
    { name: 'Michael R.', place: 'Altstadt → Herti', rating: 5, text: 'Umzug in der Altstadt perfekt gemeistert. Halteverbot war kein Problem.', savedAmount: 320, verified: true, date: '2024-11' },
    { name: 'Emma T.', place: 'Zürich → Zug', rating: 5, text: 'Expat-Umzug super organisiert. Team sprach perfekt Englisch!', savedAmount: 450, verified: true, date: '2024-10' },
    { name: 'David S.', place: 'Zugerberg', rating: 5, text: 'Trotz steiler Zufahrt alles reibungslos. Sehr professionell.', verified: true, date: '2024-09' },
  ],
  
  services: CORE_SERVICES,
  
  internalLinks: {
    parent: { label: 'Kanton Zug', href: '/umzugsfirmen/kanton-zug' },
    neighbors: [
      { label: 'Baar', href: '/umzugsfirmen/baar' },
      { label: 'Cham', href: '/umzugsfirmen/cham' },
      { label: 'Steinhausen', href: '/umzugsfirmen/steinhausen' },
      { label: 'Hünenberg', href: '/umzugsfirmen/huenenberg' },
    ],
  },
};

// ==================== NEIGHBOR CITIES (Stub configs) ====================

export const BAAR_CONFIG: CityConfig = {
  kind: 'city',
  slug: 'baar',
  name: 'Baar',
  cantonSlug: 'zug',
  cantonName: 'Zug',
  cantonShort: 'ZG',
  population: 25000,
  
  seo: {
    title: 'Umzugsfirmen in Baar vergleichen | Umzugscheck',
    description: 'Vergleichen Sie geprüfte Umzugsfirmen in Baar ZG. Gratis Offerten in 24–48h. Bis zu 40% sparen.',
    h1: 'Umzugsfirma in Baar finden: Offerten vergleichen',
    canonicalUrl: '/umzugsfirmen/baar',
  },
  
  stats: { providerCount: 20, reviewCount: 890, avgRating: 4.7, activeUsersBase: 8 },
  trustGlobals: TRUST_GLOBALS,
  price: {
    anchors: [
      { label: '1.5 - 2.5 Zimmer', min: 550, max: 950, savingsText: 'bis CHF 300', icon: 'Home' },
      { label: '3.5 - 4.5 Zimmer', min: 850, max: 1350, savingsText: 'bis CHF 420', icon: 'Building' },
    ],
  },
  topCompanies: [],
  quartiere: [
    { name: 'Zentrum', challenges: ['Gute Anbindung', 'Mischnutzung'], tip: 'Standardumzug' },
    { name: 'Inwil', challenges: ['Familienquartier', 'Einfamilienhäuser'], tip: 'Grössere Transporter' },
  ],
  localTips: ['Grösste Gemeinde im Kanton – viele Umzugsfirmen vor Ort', 'Gute Autobahnanbindung ermöglicht günstige Preise'],
  faqs: [{ question: 'Was kostet ein Umzug in Baar?', answer: 'Ein 3-Zimmer-Umzug in Baar kostet ca. CHF 850-1\'350.' }],
  testimonials: [],
  services: CORE_SERVICES,
  internalLinks: {
    parent: { label: 'Kanton Zug', href: '/umzugsfirmen/kanton-zug' },
    neighbors: [
      { label: 'Zug', href: '/umzugsfirmen/zug' },
      { label: 'Cham', href: '/umzugsfirmen/cham' },
    ],
  },
};

export const CHAM_CONFIG: CityConfig = {
  kind: 'city',
  slug: 'cham',
  name: 'Cham',
  cantonSlug: 'zug',
  cantonName: 'Zug',
  cantonShort: 'ZG',
  population: 17000,
  
  seo: {
    title: 'Umzugsfirmen in Cham vergleichen | Umzugscheck',
    description: 'Vergleichen Sie geprüfte Umzugsfirmen in Cham ZG. Gratis Offerten in 24–48h. Bis zu 40% sparen.',
    h1: 'Umzugsfirma in Cham finden: Offerten vergleichen',
    canonicalUrl: '/umzugsfirmen/cham',
  },
  
  stats: { providerCount: 18, reviewCount: 650, avgRating: 4.8, activeUsersBase: 6 },
  trustGlobals: TRUST_GLOBALS,
  price: {
    anchors: [
      { label: '1.5 - 2.5 Zimmer', min: 520, max: 880, savingsText: 'bis CHF 280', icon: 'Home' },
      { label: '3.5 - 4.5 Zimmer', min: 800, max: 1300, savingsText: 'bis CHF 400', icon: 'Building' },
    ],
  },
  topCompanies: [],
  quartiere: [
    { name: 'Seeufer', challenges: ['Premium-Lage', 'Enge Strassen'], tip: 'Vorabbesichtigung empfohlen' },
    { name: 'Hagendorn', challenges: ['Familienquartier'], tip: 'Standardumzug' },
  ],
  localTips: ['Am Zugersee gelegen – Seeuferhäuser erfordern oft Spezialequipment'],
  faqs: [{ question: 'Was kostet ein Umzug in Cham?', answer: 'Ein 3-Zimmer-Umzug in Cham kostet ca. CHF 800-1\'300.' }],
  testimonials: [],
  services: CORE_SERVICES,
  internalLinks: {
    parent: { label: 'Kanton Zug', href: '/umzugsfirmen/kanton-zug' },
    neighbors: [
      { label: 'Zug', href: '/umzugsfirmen/zug' },
      { label: 'Baar', href: '/umzugsfirmen/baar' },
    ],
  },
};

// ==================== REGISTRY ====================

export const ARCHETYPE_CANTONS: Record<string, CantonConfig> = {
  'zug': KANTON_ZUG,
};

export const ARCHETYPE_CITIES: Record<string, CityConfig> = {
  'zug': STADT_ZUG,
  'baar': BAAR_CONFIG,
  'cham': CHAM_CONFIG,
};

// ==================== HELPER FUNCTIONS ====================

export function getCantonConfig(slug: string): CantonConfig | null {
  return ARCHETYPE_CANTONS[slug] || null;
}

export function getCityConfig(slug: string): CityConfig | null {
  return ARCHETYPE_CITIES[slug] || null;
}

export function getServiceConfig(serviceSlug: string): ServiceConfig | null {
  return CORE_SERVICES.find(s => s.slug === serviceSlug) || null;
}

export function getServiceLink(serviceSlug: string, placeSlug: string, placeKind: 'canton' | 'city'): string {
  if (placeKind === 'canton') {
    return `/dienstleistungen/${serviceSlug}/kanton-${placeSlug}`;
  }
  return `/dienstleistungen/${serviceSlug}/${placeSlug}`;
}

export function getPlaceLink(placeSlug: string, placeKind: 'canton' | 'city'): string {
  if (placeKind === 'canton') {
    return `/umzugsfirmen/kanton-${placeSlug}`;
  }
  return `/umzugsfirmen/${placeSlug}`;
}
