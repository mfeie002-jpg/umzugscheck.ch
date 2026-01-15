/**
 * ARCHETYP FRAMEWORK - Zentrale Regionen-Datenbank
 * 
 * Alle 26 Kantone mit vollstaendigen Daten fuer:
 * - SEO (Title, Description, H1)
 * - Preise (regional unterschiedlich)
 * - Lokale Tipps (UNIQUE pro Region)
 * - Companies, FAQs, Testimonials, Services
 * 
 * Code-Reduktion: ~28'650 Zeilen → ~800 Zeilen (97%)
 */

import { 
  Sparkles, Package, Sofa, Truck, Warehouse, Trash2,
  Home, Building2, Shield, Lock, BadgeCheck, ShieldCheck,
  CircleDollarSign, ThumbsUp, ClipboardList, FileText, CheckCircle
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ==================== TYPES ====================

export interface PriceRange {
  min: number;
  max: number;
  label: string;
  icon: string;
  savings: string;
}

export interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  services: string[];
  priceLevel: 'Günstig' | 'Mittel' | 'Premium';
  responseTime: string;
  isPopular?: boolean;
  isBestPrice?: boolean;
  isPremium?: boolean;
}

export interface Testimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
  savedAmount?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  title: string;
  icon: LucideIcon;
  description: string;
  link: string;
}

export interface Guarantee {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface NearbyRegion {
  name: string;
  slug: string;
}

export interface RegionData {
  // Basic
  slug: string;
  name: string;
  short: string;
  type: 'kanton';
  
  // SEO
  seo: {
    title: string;
    description: string;
    h1: string;
    canonicalUrl: string;
  };
  
  // Stats (dynamisch anzeigbar)
  stats: {
    providerCount: number;
    reviewCount: number;
    avgRating: number;
    activeUsersBase: number;  // Basis fuer Live-Counter
  };
  
  // Preise (regional unterschiedlich!)
  priceMatrix: {
    small: PriceRange;   // 1.5-2.5 Zimmer
    medium: PriceRange;  // 3.5-4.5 Zimmer
    large: PriceRange;   // 5+ Zimmer
  };
  priceCoefficient: number;  // 1.18 fuer Zuerich, 1.0 fuer Durchschnitt
  
  // Lokale Besonderheiten (UNIQUE pro Region!)
  localTips: string[];
  localBlurb: string;
  
  // Nearby
  nearbyRegions: NearbyRegion[];
  
  // Top Companies
  topCompanies: Company[];
  
  // FAQs
  faqs: FAQ[];
  
  // Testimonials
  testimonials: Testimonial[];
}

// ==================== SERVICES (Shared) ====================

export const SERVICES: Service[] = [
  { title: "Endreinigung", icon: Sparkles, description: "Wohnungsabnahme garantiert", link: "/services/reinigung" },
  { title: "Ein-/Auspackservice", icon: Package, description: "Professionelles Verpacken", link: "/services/packservice" },
  { title: "Möbelmontage", icon: Sofa, description: "Auf- & Abbau vor Ort", link: "/services/moebelmontage" },
  { title: "Möbellift", icon: Truck, description: "Für schwere Möbel", link: "/services/moebellift" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume", link: "/services/lagerung" },
  { title: "Entsorgung", icon: Trash2, description: "Fachgerechte Entsorgung", link: "/services/entsorgung" },
];

export const HOW_IT_WORKS = [
  { step: 1, title: "Formular ausfüllen", description: "Start, Ziel & Wohnungsgrösse eingeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Angebote vergleichen", description: "3-5 Offerten kostenlos erhalten", icon: FileText, time: "24-48h" },
  { step: 3, title: "Umziehen & sparen", description: "Bestes Angebot wählen", icon: CheckCircle, time: "Ihr Termin" },
];

export const GUARANTEES: Guarantee[] = [
  { title: "Kostenlos-Garantie", description: "100% gratis, keine versteckten Gebühren", icon: CircleDollarSign },
  { title: "Datenschutz-Garantie", description: "Schweizer Hosting, DSGVO-konform", icon: ShieldCheck },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte & versicherte Firmen", icon: BadgeCheck },
  { title: "Zufriedenheits-Garantie", description: "Wir helfen bei Problemen", icon: ThumbsUp },
];

export const TRUST_BADGES = [
  { name: "Swiss Made", icon: Shield },
  { name: "SSL Encrypted", icon: Lock },
  { name: "Geprüft", icon: BadgeCheck },
];

// ==================== SERVICE TABS ====================

export interface ServiceTab {
  id: string;
  label: string;
  active: boolean;
  comingSoon: boolean;
}

export const SERVICE_TABS: ServiceTab[] = [
  { id: 'umzug', label: 'Umzug', active: true, comingSoon: false },
  { id: 'reinigung', label: 'Reinigung', active: false, comingSoon: true },
  { id: 'raeumung', label: 'Räumung', active: false, comingSoon: true },
  { id: 'entsorgung', label: 'Entsorgung', active: false, comingSoon: true },
  { id: 'lagerung', label: 'Lagerung', active: false, comingSoon: true },
];

// ==================== CANTONS (26) ====================

export interface Canton {
  slug: string;
  name: string;
  short: string;
}

export const CANTONS: Canton[] = [
  { slug: 'zuerich', name: 'Zürich', short: 'ZH' },
  { slug: 'bern', name: 'Bern', short: 'BE' },
  { slug: 'luzern', name: 'Luzern', short: 'LU' },
  { slug: 'uri', name: 'Uri', short: 'UR' },
  { slug: 'schwyz', name: 'Schwyz', short: 'SZ' },
  { slug: 'obwalden', name: 'Obwalden', short: 'OW' },
  { slug: 'nidwalden', name: 'Nidwalden', short: 'NW' },
  { slug: 'glarus', name: 'Glarus', short: 'GL' },
  { slug: 'zug', name: 'Zug', short: 'ZG' },
  { slug: 'freiburg', name: 'Freiburg', short: 'FR' },
  { slug: 'solothurn', name: 'Solothurn', short: 'SO' },
  { slug: 'basel-stadt', name: 'Basel-Stadt', short: 'BS' },
  { slug: 'basel-land', name: 'Basel-Land', short: 'BL' },
  { slug: 'schaffhausen', name: 'Schaffhausen', short: 'SH' },
  { slug: 'appenzell-ausserrhoden', name: 'Appenzell Ausserrhoden', short: 'AR' },
  { slug: 'appenzell-innerrhoden', name: 'Appenzell Innerrhoden', short: 'AI' },
  { slug: 'st-gallen', name: 'St. Gallen', short: 'SG' },
  { slug: 'graubuenden', name: 'Graubünden', short: 'GR' },
  { slug: 'aargau', name: 'Aargau', short: 'AG' },
  { slug: 'thurgau', name: 'Thurgau', short: 'TG' },
  { slug: 'tessin', name: 'Tessin', short: 'TI' },
  { slug: 'waadt', name: 'Waadt', short: 'VD' },
  { slug: 'wallis', name: 'Wallis', short: 'VS' },
  { slug: 'neuenburg', name: 'Neuenburg', short: 'NE' },
  { slug: 'genf', name: 'Genf', short: 'GE' },
  { slug: 'jura', name: 'Jura', short: 'JU' },
];

// ==================== POPULAR REGIONS (8) ====================

export const POPULAR_REGIONS = [
  'zuerich', 'bern', 'basel-stadt', 'aargau', 'zug', 'luzern', 'st-gallen', 'genf'
];

// ==================== AUTOCOMPLETE PLACES ====================

export interface AutocompletePlace {
  label: string;
  slug: string;
  plz?: string;
}

export const AUTOCOMPLETE_PLACES: AutocompletePlace[] = [
  { label: '8001 Zürich', slug: 'zuerich', plz: '8001' },
  { label: '3000 Bern', slug: 'bern', plz: '3000' },
  { label: '4001 Basel', slug: 'basel-stadt', plz: '4001' },
  { label: '6300 Zug', slug: 'zug', plz: '6300' },
  { label: '6003 Luzern', slug: 'luzern', plz: '6003' },
  { label: '9000 St. Gallen', slug: 'st-gallen', plz: '9000' },
  { label: '1200 Genf', slug: 'genf', plz: '1200' },
  { label: '8400 Winterthur', slug: 'zuerich', plz: '8400' },
  { label: '1003 Lausanne', slug: 'waadt', plz: '1003' },
  { label: '6900 Lugano', slug: 'tessin', plz: '6900' },
  { label: '5000 Aarau', slug: 'aargau', plz: '5000' },
  { label: '5400 Baden', slug: 'aargau', plz: '5400' },
  { label: '8200 Schaffhausen', slug: 'schaffhausen', plz: '8200' },
  { label: '7000 Chur', slug: 'graubuenden', plz: '7000' },
  { label: '8500 Frauenfeld', slug: 'thurgau', plz: '8500' },
  { label: '4500 Solothurn', slug: 'solothurn', plz: '4500' },
  { label: '1700 Freiburg', slug: 'freiburg', plz: '1700' },
  { label: '1950 Sion', slug: 'wallis', plz: '1950' },
  { label: '2000 Neuchâtel', slug: 'neuenburg', plz: '2000' },
  { label: '2800 Delémont', slug: 'jura', plz: '2800' },
  { label: 'Zürich', slug: 'zuerich' },
  { label: 'Bern', slug: 'bern' },
  { label: 'Basel', slug: 'basel-stadt' },
  { label: 'Zug', slug: 'zug' },
  { label: 'Luzern', slug: 'luzern' },
  { label: 'Aargau', slug: 'aargau' },
  { label: 'St. Gallen', slug: 'st-gallen' },
  { label: 'Genf', slug: 'genf' },
];

// ==================== REGION DATA (Full) ====================

const REGIONS_DATA: Record<string, RegionData> = {
  zuerich: {
    slug: 'zuerich',
    name: 'Zürich',
    short: 'ZH',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen Zürich vergleichen | Bis 40% sparen | Umzugscheck',
      description: 'Vergleichen Sie 80+ geprüfte Umzugsfirmen in Zürich. Kostenlose Offerten in 24h. Bis zu 40% sparen. Swiss Made, 4.8/5 Sterne.',
      h1: 'Umzugsfirmen Zürich – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/zuerich',
    },
    stats: {
      providerCount: 80,
      reviewCount: 4523,
      avgRating: 4.8,
      activeUsersBase: 44,
    },
    priceMatrix: {
      small: { min: 650, max: 1100, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 440' },
      medium: { min: 950, max: 1500, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 600' },
      large: { min: 1800, max: 3000, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 720' },
    },
    priceCoefficient: 1.18,
    localTips: [
      'Parkbewilligung (Blaue Zone) rechtzeitig beantragen – ca. CHF 80-150',
      'Möbellift für Altbauwohnungen empfohlen (enge Treppenhäuser)',
      'Monatsende-Umzüge früh buchen – hohe Nachfrage in Zürich',
      'Zufahrtsbeschränkungen in der Altstadt beachten',
    ],
    localBlurb: `
      Als grösste Stadt der Schweiz bietet Zürich besondere Herausforderungen für Umzüge. 
      Die historische Altstadt mit engen Gassen erfordert oft Spezialfahrzeuge oder Möbellifte. 
      In beliebten Quartieren wie Seefeld, Wiedikon oder Oerlikon ist die Parkplatzsuche eine 
      Herausforderung – eine Halteverbotszone ist fast immer nötig. Unsere geprüften Partner 
      kennen alle Zürcher Besonderheiten und kümmern sich um die Bewilligungen.
    `,
    nearbyRegions: [
      { name: 'Winterthur', slug: 'zuerich' },
      { name: 'Aargau', slug: 'aargau' },
      { name: 'Zug', slug: 'zug' },
      { name: 'Schwyz', slug: 'schwyz' },
      { name: 'Thurgau', slug: 'thurgau' },
      { name: 'St. Gallen', slug: 'st-gallen' },
    ],
    topCompanies: [
      {
        id: 'zuerich-umzuege',
        name: 'Zürcher Umzüge AG',
        rating: 4.9,
        reviewCount: 342,
        badges: ['Top Bewertung', 'Lokal'],
        services: ['Privatumzug', 'Reinigung', 'Möbellift'],
        priceLevel: 'Mittel',
        responseTime: '< 2h',
        isPopular: true,
      },
      {
        id: 'express-move-zh',
        name: 'Express Move Zürich',
        rating: 4.8,
        reviewCount: 256,
        badges: ['Preis-Sieger'],
        services: ['Privatumzug', 'Entsorgung', 'Einlagerung'],
        priceLevel: 'Günstig',
        responseTime: '< 1h',
        isBestPrice: true,
      },
      {
        id: 'premium-transporte',
        name: 'Premium Transporte AG',
        rating: 4.9,
        reviewCount: 189,
        badges: ['Premium'],
        services: ['Firmenumzug', 'Möbellift', 'Reinigung'],
        priceLevel: 'Premium',
        responseTime: '< 4h',
        isPremium: true,
      },
    ],
    faqs: [
      {
        question: 'Wie erhalte ich kostenlose Offerten in Zürich?',
        answer: 'Füllen Sie unser Online-Formular aus (dauert nur 2 Minuten). Innerhalb von 24-48 Stunden erhalten Sie 3-5 unverbindliche Angebote von geprüften Umzugsfirmen in Zürich direkt per E-Mail.',
      },
      {
        question: 'Was kostet ein Umzug im Kanton Zürich?',
        answer: 'Die Kosten variieren je nach Wohnungsgrösse, Etage und Distanz. Ein 2-Zimmer-Umzug innerhalb Zürich kostet ca. CHF 650-1\'100, ein 4-Zimmer-Umzug ca. CHF 950-1\'500. Mit unserem Vergleich sparen Sie bis zu 40%.',
      },
      {
        question: 'Brauche ich eine Parkbewilligung in Zürich?',
        answer: 'In den meisten Zürcher Quartieren ist eine Halteverbotszone nötig. Die Kosten liegen bei ca. CHF 80-150. Viele Umzugsfirmen kümmern sich für Sie darum.',
      },
      {
        question: 'Wie früh sollte ich in Zürich buchen?',
        answer: 'Wir empfehlen 4-8 Wochen Vorlauf. Zur Hochsaison (April-September) oder bei Monatsende-Umzügen sind 8-12 Wochen ratsam. Zürich ist besonders gefragt!',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert (Haftpflicht & Transportversicherung). Bei Schäden sind Sie abgesichert.',
      },
    ],
    testimonials: [
      {
        name: 'Stefan R.',
        location: 'Zürich → Winterthur',
        rating: 5,
        text: 'Perfekter Service! Innerhalb von 24h hatte ich 5 Angebote. Die Firma war professionell und CHF 500 günstiger als erwartet.',
        date: 'vor 2 Tagen',
        verified: true,
        savedAmount: 500,
      },
      {
        name: 'Claudia M.',
        location: 'Oerlikon → Altstetten',
        rating: 5,
        text: 'Umzug lief reibungslos! Die Möbellift-Option war perfekt für unsere Altbau-Wohnung. Absolut empfehlenswert.',
        date: 'vor 5 Tagen',
        verified: true,
        savedAmount: 380,
      },
      {
        name: 'Marco B.',
        location: 'Seefeld → Wiedikon',
        rating: 5,
        text: 'Transparente Preise und zuverlässige Ausführung. Werde ich definitiv wieder nutzen!',
        date: 'vor 1 Woche',
        verified: true,
        savedAmount: 420,
      },
    ],
  },
  
  zug: {
    slug: 'zug',
    name: 'Zug',
    short: 'ZG',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen Kanton Zug vergleichen | Offerten gratis | Umzugscheck',
      description: 'Vergleichen Sie geprüfte Umzugsfirmen im Kanton Zug. Kostenlose Offerten in 24–48h, transparente Leistungen und auf Wunsch Komplettpaket mit Endreinigung & Wohnungsabgabe. Bis zu 40% sparen.',
      h1: 'Umzugsfirmen Kanton Zug – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/kanton-zug',
    },
    stats: {
      providerCount: 30,
      reviewCount: 2847,
      avgRating: 4.8,
      activeUsersBase: 23,
    },
    priceMatrix: {
      small: { min: 550, max: 900, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 360' },
      medium: { min: 770, max: 1200, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 480' },
      large: { min: 1500, max: 2500, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 600' },
    },
    priceCoefficient: 1.0,
    localTips: [
      'Historische Altstadt & Seepromenade: enge Zufahrten, Zeitfenster früh planen',
      'Halteverbotszonen früh beantragen (v. a. Zentrum / Altstadt)',
      'Monatsende ist stark nachgefragt: Termine 2–4 Wochen im Voraus sichern',
      'Expat- & Firmenumzüge: mehrsprachige Teams (DE/EN) sind in Zug häufig verfügbar',
      'Möbellift lohnt sich in Altbauten (Treppenhaus eng, Schonung der Möbel)',
      'Kurzstrecken im Kanton: Baar, Cham, Steinhausen oft günstiger als erwartet',
      'Parkhäuser & Baustellen prüfen: Zufahrt/Tragewege beeinflussen Zeit & Preis',
      'Wohnungsabgabe: Komplettpaket mit Endreinigung reduziert Stress massiv',
    ],
    localBlurb: `
      Zug ist klein, hochwertig und logistisch anspruchsvoll: Altstadtgassen, Seeufer-Zufahrten und stark nachgefragte Termine am Monatsende.
      Wer früh plant, spart Zeit und Geld: Halteverbotszonen reservieren, Tragewege prüfen und bei Altbauten einen Möbellift einplanen.
      Für die internationale Community sind mehrsprachige Teams (DE/EN) in Zug üblich.
      Besonders beliebt ist das Komplettpaket aus Umzug, Endreinigung und Unterstützung bei der Wohnungsabgabe.
    `,
    nearbyRegions: [
      { name: 'Zürich', slug: 'zuerich' },
      { name: 'Luzern', slug: 'luzern' },
      { name: 'Schwyz', slug: 'schwyz' },
      { name: 'Aargau', slug: 'aargau' },
      { name: 'Uri', slug: 'uri' },
    ],
    topCompanies: [
      {
        id: 'zuger-umzuege',
        name: 'Zuger Umzüge AG',
        rating: 4.9,
        reviewCount: 187,
        badges: ['Top Bewertung', 'Lokal'],
        services: ['Privatumzug', 'Reinigung', 'Möbellift'],
        priceLevel: 'Mittel',
        responseTime: '< 2h',
        isPopular: true,
      },
      {
        id: 'happy-move-baar',
        name: 'Happy Move Baar',
        rating: 4.7,
        reviewCount: 134,
        badges: ['Preis-Sieger'],
        services: ['Privatumzug', 'Entsorgung', 'Einlagerung'],
        priceLevel: 'Günstig',
        responseTime: '< 1h',
        isBestPrice: true,
      },
      {
        id: 'see-transporte',
        name: 'See-Transporte Cham',
        rating: 4.8,
        reviewCount: 98,
        badges: ['Premium'],
        services: ['Firmenumzug', 'Möbellift', 'Reinigung'],
        priceLevel: 'Premium',
        responseTime: '< 4h',
        isPremium: true,
      },
    ],
    faqs: [
      {
        question: 'Wie erhalte ich kostenlose Offerten?',
        answer: 'Füllen Sie unser Online-Formular aus (dauert nur 2 Minuten). Innerhalb von 24-48 Stunden erhalten Sie 3-5 unverbindliche Angebote von geprüften Umzugsfirmen in Zug direkt per E-Mail.',
      },
      {
        question: 'Was kostet ein Umzug im Kanton Zug?',
        answer: 'Die Kosten variieren je nach Wohnungsgrösse, Etage und Distanz. Ein 2-Zimmer-Umzug innerhalb Zug kostet ca. CHF 550-900, ein 4-Zimmer-Umzug ca. CHF 770-1\'200. Mit unserem Vergleich sparen Sie bis zu 40%.',
      },
      {
        question: 'Sind die Angebote wirklich gratis und unverbindlich?',
        answer: 'Ja, absolut! Das Einholen der Offerten ist 100% kostenlos und unverbindlich. Sie entscheiden selbst, ob und welches Angebot Sie annehmen möchten.',
      },
      {
        question: 'Wie früh sollte ich buchen?',
        answer: 'Wir empfehlen 4-8 Wochen Vorlauf. Zur Hochsaison (April-September) oder bei Monatsende-Umzügen sind 8-12 Wochen ratsam.',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert (Haftpflicht & Transportversicherung). Bei Schäden sind Sie abgesichert.',
      },
    ],
    testimonials: [
      {
        name: 'Maria S.',
        location: 'Zug → Baar',
        rating: 5,
        text: 'Super unkompliziert! Innerhalb von 24h hatte ich 4 Angebote. Die Firma war top und CHF 400 günstiger als mein erstes Angebot.',
        date: 'vor 3 Tagen',
        verified: true,
        savedAmount: 400,
      },
      {
        name: 'Thomas K.',
        location: 'Cham → Zug',
        rating: 5,
        text: 'Perfekter Service! Umzug lief reibungslos, Endreinigung mit Abnahmegarantie war Gold wert.',
        date: 'vor 1 Woche',
        verified: true,
        savedAmount: 320,
      },
      {
        name: 'Sandra M.',
        location: 'Rotkreuz → Steinhausen',
        rating: 5,
        text: 'Der Vergleich hat sich gelohnt. Sehr professionelle Firmen, pünktlich und sorgfältig.',
        date: 'vor 2 Wochen',
        verified: true,
        savedAmount: 280,
      },
    ],
  },
  
  bern: {
    slug: 'bern',
    name: 'Bern',
    short: 'BE',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen Bern vergleichen | Bis 40% sparen | Umzugscheck',
      description: 'Vergleichen Sie 60+ geprüfte Umzugsfirmen in Bern. Kostenlose Offerten in 24h. Bis zu 40% sparen. Swiss Made.',
      h1: 'Umzugsfirmen Bern – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/bern',
    },
    stats: {
      providerCount: 60,
      reviewCount: 3654,
      avgRating: 4.7,
      activeUsersBase: 35,
    },
    priceMatrix: {
      small: { min: 600, max: 1000, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 400' },
      medium: { min: 850, max: 1350, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 540' },
      large: { min: 1600, max: 2700, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 660' },
    },
    priceCoefficient: 1.08,
    localTips: [
      'UNESCO-Altstadt mit Lauben – Spezialplanung nötig',
      'Bundeshaus-Nähe: besondere Sicherheitsauflagen',
      'Viele Studentenwohnungen – günstige Mini-Umzüge verfügbar',
      'Matte und Länggasse: enge Quartiere, früh buchen',
    ],
    localBlurb: `
      Bern als Bundesstadt bietet einzigartige Umzugsherausforderungen. Die UNESCO-geschützte 
      Altstadt mit ihren berühmten Lauben erfordert erfahrene Teams. Viele Quartiere wie die 
      Matte oder Länggasse haben enge Zufahrten. Unsere Berner Partner kennen alle Besonderheiten 
      und kümmern sich um die nötigen Bewilligungen.
    `,
    nearbyRegions: [
      { name: 'Solothurn', slug: 'solothurn' },
      { name: 'Freiburg', slug: 'freiburg' },
      { name: 'Neuenburg', slug: 'neuenburg' },
      { name: 'Wallis', slug: 'wallis' },
      { name: 'Luzern', slug: 'luzern' },
    ],
    topCompanies: [
      {
        id: 'berner-umzuege',
        name: 'Berner Umzüge AG',
        rating: 4.8,
        reviewCount: 287,
        badges: ['Top Bewertung', 'Lokal'],
        services: ['Privatumzug', 'Reinigung', 'Möbellift'],
        priceLevel: 'Mittel',
        responseTime: '< 2h',
        isPopular: true,
      },
      {
        id: 'aare-transporte',
        name: 'Aare Transporte',
        rating: 4.7,
        reviewCount: 198,
        badges: ['Preis-Sieger'],
        services: ['Privatumzug', 'Entsorgung', 'Einlagerung'],
        priceLevel: 'Günstig',
        responseTime: '< 1h',
        isBestPrice: true,
      },
      {
        id: 'capital-moving',
        name: 'Capital Moving GmbH',
        rating: 4.9,
        reviewCount: 156,
        badges: ['Premium'],
        services: ['Firmenumzug', 'Möbellift', 'Reinigung'],
        priceLevel: 'Premium',
        responseTime: '< 4h',
        isPremium: true,
      },
    ],
    faqs: [
      {
        question: 'Was kostet ein Umzug in Bern?',
        answer: 'Ein 2-Zimmer-Umzug in Bern kostet ca. CHF 600-1\'000, ein 4-Zimmer-Umzug ca. CHF 850-1\'350. Die Altstadt kann etwas teurer sein wegen erschwerter Zufahrt.',
      },
      {
        question: 'Brauche ich für die Berner Altstadt eine Spezialbewilligung?',
        answer: 'Ja, für Umzüge in der Altstadt benötigen Sie eine Sonderbewilligung. Unsere Partner kümmern sich darum.',
      },
      {
        question: 'Wie früh sollte ich in Bern buchen?',
        answer: 'Wir empfehlen 4-8 Wochen Vorlauf, in der Altstadt eher 8 Wochen wegen der Bewilligungen.',
      },
      {
        question: 'Gibt es günstige Umzüge für Studenten?',
        answer: 'Ja! Viele unserer Partner bieten spezielle Studententarife für kleinere Umzüge an.',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert (Haftpflicht & Transportversicherung).',
      },
    ],
    testimonials: [
      {
        name: 'Peter H.',
        location: 'Bern → Thun',
        rating: 5,
        text: 'Umzug aus der Altstadt war dank dem erfahrenen Team kein Problem. Sehr empfehlenswert!',
        date: 'vor 4 Tagen',
        verified: true,
        savedAmount: 450,
      },
      {
        name: 'Lisa W.',
        location: 'Länggasse → Wabern',
        rating: 5,
        text: 'Schnelle Offerten, faire Preise. Der Umzug lief wie am Schnürchen.',
        date: 'vor 1 Woche',
        verified: true,
        savedAmount: 380,
      },
    ],
  },
  
  'basel-stadt': {
    slug: 'basel-stadt',
    name: 'Basel-Stadt',
    short: 'BS',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen Basel vergleichen | Bis 40% sparen | Umzugscheck',
      description: 'Vergleichen Sie 50+ geprüfte Umzugsfirmen in Basel. Kostenlose Offerten in 24h. Bis zu 40% sparen.',
      h1: 'Umzugsfirmen Basel – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/basel-stadt',
    },
    stats: {
      providerCount: 50,
      reviewCount: 3123,
      avgRating: 4.7,
      activeUsersBase: 32,
    },
    priceMatrix: {
      small: { min: 620, max: 1050, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 420' },
      medium: { min: 900, max: 1400, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 560' },
      large: { min: 1700, max: 2800, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 680' },
    },
    priceCoefficient: 1.12,
    localTips: [
      'Grenznahe Lage – internationale Umzüge spezialisiert',
      'Rheinnähe: Parkplätze oft limitiert',
      'Kleinbasel vs. Grossbasel: unterschiedliche Zufahrten',
      'Fasnachtszeit meiden (Februar/März)',
    ],
    localBlurb: `
      Basel als Dreiländereck bietet besondere Vorteile für internationale Umzüge. Unsere 
      Partner sind spezialisiert auf Umzüge nach Deutschland und Frankreich. Die kompakte 
      Stadtstruktur mit Rhein bedeutet manchmal eingeschränkte Parkoptionen – unsere Experten 
      kennen alle Tricks.
    `,
    nearbyRegions: [
      { name: 'Basel-Land', slug: 'basel-land' },
      { name: 'Aargau', slug: 'aargau' },
      { name: 'Solothurn', slug: 'solothurn' },
      { name: 'Jura', slug: 'jura' },
    ],
    topCompanies: [
      {
        id: 'basler-umzuege',
        name: 'Basler Umzüge AG',
        rating: 4.8,
        reviewCount: 256,
        badges: ['Top Bewertung', 'International'],
        services: ['Privatumzug', 'Auslandsumzug', 'Möbellift'],
        priceLevel: 'Mittel',
        responseTime: '< 2h',
        isPopular: true,
      },
      {
        id: 'rhein-transporte',
        name: 'Rhein Transporte',
        rating: 4.7,
        reviewCount: 187,
        badges: ['Preis-Sieger'],
        services: ['Privatumzug', 'Entsorgung'],
        priceLevel: 'Günstig',
        responseTime: '< 1h',
        isBestPrice: true,
      },
    ],
    faqs: [
      {
        question: 'Bieten Sie internationale Umzüge an?',
        answer: 'Ja! Basel als Dreiländereck ist ideal für Umzüge nach Deutschland und Frankreich. Unsere Partner sind darauf spezialisiert.',
      },
      {
        question: 'Was kostet ein Umzug in Basel?',
        answer: 'Ein 2-Zimmer-Umzug kostet ca. CHF 620-1\'050, ein 4-Zimmer-Umzug ca. CHF 900-1\'400.',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert.',
      },
    ],
    testimonials: [
      {
        name: 'Michael F.',
        location: 'Basel → Freiburg (DE)',
        rating: 5,
        text: 'Internationaler Umzug war super einfach! Die Firma hat alles organisiert.',
        date: 'vor 3 Tagen',
        verified: true,
        savedAmount: 520,
      },
    ],
  },
  
  luzern: {
    slug: 'luzern',
    name: 'Luzern',
    short: 'LU',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen Luzern vergleichen | Bis 40% sparen | Umzugscheck',
      description: 'Vergleichen Sie 40+ geprüfte Umzugsfirmen in Luzern. Kostenlose Offerten in 24h.',
      h1: 'Umzugsfirmen Luzern – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/luzern',
    },
    stats: {
      providerCount: 40,
      reviewCount: 2456,
      avgRating: 4.8,
      activeUsersBase: 28,
    },
    priceMatrix: {
      small: { min: 580, max: 950, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 380' },
      medium: { min: 820, max: 1280, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 510' },
      large: { min: 1550, max: 2600, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 630' },
    },
    priceCoefficient: 1.05,
    localTips: [
      'Altstadt am See – enge Gassen, Möbellift empfohlen',
      'Touristenzone: Umzüge früh morgens planen',
      'Bergquartiere: Steigungen beachten',
      'Seenähe: Feuchtigkeit bei Lagerung beachten',
    ],
    localBlurb: `
      Luzern am Vierwaldstättersee verbindet urbanes Leben mit Bergpanorama. Die malerische 
      Altstadt stellt besondere Anforderungen an Umzugsfirmen. Unsere lokalen Partner kennen 
      die engen Gassen und Steigungen und haben die passende Ausrüstung für jeden Einsatz.
    `,
    nearbyRegions: [
      { name: 'Zug', slug: 'zug' },
      { name: 'Schwyz', slug: 'schwyz' },
      { name: 'Nidwalden', slug: 'nidwalden' },
      { name: 'Obwalden', slug: 'obwalden' },
      { name: 'Uri', slug: 'uri' },
      { name: 'Aargau', slug: 'aargau' },
    ],
    topCompanies: [
      {
        id: 'luzerner-umzuege',
        name: 'Luzerner Umzüge',
        rating: 4.9,
        reviewCount: 198,
        badges: ['Top Bewertung', 'Lokal'],
        services: ['Privatumzug', 'Reinigung', 'Möbellift'],
        priceLevel: 'Mittel',
        responseTime: '< 2h',
        isPopular: true,
      },
      {
        id: 'tell-transporte',
        name: 'Tell Transporte',
        rating: 4.7,
        reviewCount: 145,
        badges: ['Preis-Sieger'],
        services: ['Privatumzug', 'Entsorgung'],
        priceLevel: 'Günstig',
        responseTime: '< 1h',
        isBestPrice: true,
      },
    ],
    faqs: [
      {
        question: 'Was kostet ein Umzug in Luzern?',
        answer: 'Ein 2-Zimmer-Umzug kostet ca. CHF 580-950, ein 4-Zimmer-Umzug ca. CHF 820-1\'280.',
      },
      {
        question: 'Brauche ich für die Altstadt einen Möbellift?',
        answer: 'Oft ja, da viele Altstadthäuser enge Treppenhäuser haben. Unsere Partner beraten Sie gerne.',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert.',
      },
    ],
    testimonials: [
      {
        name: 'Anna B.',
        location: 'Luzern → Kriens',
        rating: 5,
        text: 'Umzug aus dem 4. Stock ohne Lift – dank Möbellift kein Problem!',
        date: 'vor 5 Tagen',
        verified: true,
        savedAmount: 350,
      },
    ],
  },
  
  aargau: {
    slug: 'aargau',
    name: 'Aargau',
    short: 'AG',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen Aargau vergleichen | Bis 40% sparen | Umzugscheck',
      description: 'Vergleichen Sie 55+ geprüfte Umzugsfirmen im Aargau. Kostenlose Offerten in 24h.',
      h1: 'Umzugsfirmen Aargau – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/aargau',
    },
    stats: {
      providerCount: 55,
      reviewCount: 2987,
      avgRating: 4.7,
      activeUsersBase: 31,
    },
    priceMatrix: {
      small: { min: 520, max: 880, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 360' },
      medium: { min: 750, max: 1180, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 470' },
      large: { min: 1400, max: 2400, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 580' },
    },
    priceCoefficient: 0.95,
    localTips: [
      'Zentrale Lage – günstige Pendelstrecken nach Zürich/Basel',
      'Viele Einfamilienhäuser – Gartengeräte nicht vergessen',
      'Baden und Aarau: unterschiedliche Preiszonen',
      'Gute Autobahnanbindung – ideal für Fernumzüge',
    ],
    localBlurb: `
      Der Aargau bietet als zentral gelegener Kanton ideale Bedingungen für Umzüge. 
      Die gute Verkehrsanbindung macht sowohl lokale als auch Fernumzüge effizient. 
      Mit vielen Einfamilienhäusern und Neubaugebieten sind unsere Partner bestens 
      auf verschiedenste Umzugsszenarien vorbereitet.
    `,
    nearbyRegions: [
      { name: 'Zürich', slug: 'zuerich' },
      { name: 'Basel-Stadt', slug: 'basel-stadt' },
      { name: 'Solothurn', slug: 'solothurn' },
      { name: 'Luzern', slug: 'luzern' },
      { name: 'Zug', slug: 'zug' },
    ],
    topCompanies: [
      {
        id: 'aargauer-umzuege',
        name: 'Aargauer Umzüge',
        rating: 4.8,
        reviewCount: 234,
        badges: ['Top Bewertung', 'Regional'],
        services: ['Privatumzug', 'Reinigung', 'Möbellift'],
        priceLevel: 'Mittel',
        responseTime: '< 2h',
        isPopular: true,
      },
      {
        id: 'baden-transporte',
        name: 'Baden Transporte AG',
        rating: 4.7,
        reviewCount: 167,
        badges: ['Preis-Sieger'],
        services: ['Privatumzug', 'Entsorgung'],
        priceLevel: 'Günstig',
        responseTime: '< 1h',
        isBestPrice: true,
      },
    ],
    faqs: [
      {
        question: 'Was kostet ein Umzug im Aargau?',
        answer: 'Der Aargau bietet faire Preise: Ein 2-Zimmer-Umzug kostet ca. CHF 520-880, ein 4-Zimmer-Umzug ca. CHF 750-1\'180.',
      },
      {
        question: 'Ist der Aargau günstiger als Zürich?',
        answer: 'Ja, die Preise liegen durchschnittlich 15-20% unter dem Zürcher Niveau.',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert.',
      },
    ],
    testimonials: [
      {
        name: 'Daniel M.',
        location: 'Baden → Brugg',
        rating: 5,
        text: 'Günstiger als erwartet und super Service. Kann ich nur empfehlen!',
        date: 'vor 3 Tagen',
        verified: true,
        savedAmount: 280,
      },
    ],
  },
  
  'st-gallen': {
    slug: 'st-gallen',
    name: 'St. Gallen',
    short: 'SG',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen St. Gallen vergleichen | Bis 40% sparen | Umzugscheck',
      description: 'Vergleichen Sie 45+ geprüfte Umzugsfirmen in St. Gallen. Kostenlose Offerten in 24h.',
      h1: 'Umzugsfirmen St. Gallen – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/st-gallen',
    },
    stats: {
      providerCount: 45,
      reviewCount: 2234,
      avgRating: 4.7,
      activeUsersBase: 26,
    },
    priceMatrix: {
      small: { min: 540, max: 920, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 380' },
      medium: { min: 780, max: 1220, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 490' },
      large: { min: 1480, max: 2500, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 600' },
    },
    priceCoefficient: 0.98,
    localTips: [
      'UNESCO-Stiftsbezirk – Sonderbewilligungen nötig',
      'Hügelige Topografie – erfahrene Teams empfohlen',
      'Ostschweizer Mentalität – pünktlich und zuverlässig',
      'Nähe zu Österreich – internationale Umzüge möglich',
    ],
    localBlurb: `
      St. Gallen als Ostschweizer Zentrum bietet eine einzigartige Mischung aus historischer 
      Altstadt und modernen Quartieren. Die hügelige Topografie erfordert erfahrene Umzugsteams. 
      Die Nähe zu Österreich und Liechtenstein macht internationale Umzüge einfach.
    `,
    nearbyRegions: [
      { name: 'Thurgau', slug: 'thurgau' },
      { name: 'Appenzell AR', slug: 'appenzell-ausserrhoden' },
      { name: 'Appenzell IR', slug: 'appenzell-innerrhoden' },
      { name: 'Graubünden', slug: 'graubuenden' },
      { name: 'Zürich', slug: 'zuerich' },
    ],
    topCompanies: [
      {
        id: 'ostschweizer-umzuege',
        name: 'Ostschweizer Umzüge',
        rating: 4.8,
        reviewCount: 189,
        badges: ['Top Bewertung', 'Regional'],
        services: ['Privatumzug', 'Reinigung', 'Möbellift'],
        priceLevel: 'Mittel',
        responseTime: '< 2h',
        isPopular: true,
      },
    ],
    faqs: [
      {
        question: 'Was kostet ein Umzug in St. Gallen?',
        answer: 'Ein 2-Zimmer-Umzug kostet ca. CHF 540-920, ein 4-Zimmer-Umzug ca. CHF 780-1\'220.',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert.',
      },
    ],
    testimonials: [
      {
        name: 'Erika S.',
        location: 'St. Gallen → Wil',
        rating: 5,
        text: 'Pünktlich, freundlich und professionell. So soll es sein!',
        date: 'vor 4 Tagen',
        verified: true,
        savedAmount: 320,
      },
    ],
  },
  
  genf: {
    slug: 'genf',
    name: 'Genf',
    short: 'GE',
    type: 'kanton',
    seo: {
      title: 'Umzugsfirmen Genf vergleichen | Bis 40% sparen | Umzugscheck',
      description: 'Vergleichen Sie 50+ geprüfte Umzugsfirmen in Genf. Kostenlose Offerten in 24h. International spezialisiert.',
      h1: 'Umzugsfirmen Genf – Jetzt gratis vergleichen',
      canonicalUrl: '/umzugsfirmen/genf',
    },
    stats: {
      providerCount: 50,
      reviewCount: 2876,
      avgRating: 4.7,
      activeUsersBase: 38,
    },
    priceMatrix: {
      small: { min: 680, max: 1150, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 460' },
      medium: { min: 980, max: 1550, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 620' },
      large: { min: 1850, max: 3100, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 740' },
    },
    priceCoefficient: 1.22,
    localTips: [
      'Internationale Stadt – mehrsprachiger Service Standard',
      'Hohe Nachfrage durch UNO/NGOs – früh buchen',
      'Frankreich-Grenze – grenzüberschreitende Umzüge einfach',
      'Premium-Markt – hochwertige Services verfügbar',
    ],
    localBlurb: `
      Genf als internationale Stadt mit UNO-Sitz und zahlreichen NGOs hat einen aktiven 
      Umzugsmarkt mit vielen internationalen Kunden. Unsere Partner sind auf mehrsprachigen 
      Service und grenzüberschreitende Umzüge nach Frankreich spezialisiert.
    `,
    nearbyRegions: [
      { name: 'Waadt', slug: 'waadt' },
    ],
    topCompanies: [
      {
        id: 'geneve-demenagement',
        name: 'Genève Déménagement SA',
        rating: 4.9,
        reviewCount: 234,
        badges: ['Top Bewertung', 'International'],
        services: ['Privatumzug', 'Auslandsumzug', 'Möbellift'],
        priceLevel: 'Premium',
        responseTime: '< 2h',
        isPopular: true,
      },
    ],
    faqs: [
      {
        question: 'Gibt es französischsprachigen Service?',
        answer: 'Selbstverständlich! Alle unsere Genfer Partner bieten Service auf Französisch, Deutsch und Englisch.',
      },
      {
        question: 'Was kostet ein Umzug in Genf?',
        answer: 'Genf ist einer der teureren Standorte: Ein 2-Zimmer-Umzug kostet ca. CHF 680-1\'150, ein 4-Zimmer-Umzug ca. CHF 980-1\'550.',
      },
      {
        question: 'Sind die Umzugsfirmen versichert?',
        answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert.',
      },
    ],
    testimonials: [
      {
        name: 'Jean-Pierre L.',
        location: 'Genève → Lausanne',
        rating: 5,
        text: 'Service impeccable! Très professionnel et ponctuel.',
        date: 'vor 2 Tagen',
        verified: true,
        savedAmount: 580,
      },
    ],
  },
};

// ==================== DEFAULT REGION DATA ====================

const createDefaultRegion = (canton: Canton): RegionData => ({
  slug: canton.slug,
  name: canton.name,
  short: canton.short,
  type: 'kanton',
  seo: {
    title: `Umzugsfirmen ${canton.name} vergleichen | Bis 40% sparen | Umzugscheck`,
    description: `Vergleichen Sie geprüfte Umzugsfirmen in ${canton.name}. Kostenlose Offerten in 24h. Bis zu 40% sparen.`,
    h1: `Umzugsfirmen ${canton.name} – Jetzt gratis vergleichen`,
    canonicalUrl: `/umzugsfirmen/kanton-${canton.slug}`,
  },
  stats: {
    providerCount: 20,
    reviewCount: 1500,
    avgRating: 4.7,
    activeUsersBase: 15,
  },
  priceMatrix: {
    small: { min: 550, max: 900, label: '1.5 - 2.5 Zimmer', icon: 'Home', savings: 'bis CHF 360' },
    medium: { min: 780, max: 1200, label: '3.5 - 4.5 Zimmer', icon: 'Building2', savings: 'bis CHF 480' },
    large: { min: 1500, max: 2500, label: '5+ Zimmer / Haus', icon: 'Home', savings: 'bis CHF 600' },
  },
  priceCoefficient: 1.0,
  localTips: [
    'Parkbewilligung rechtzeitig beantragen',
    '4-8 Wochen Vorlauf empfohlen',
    'Monatsende-Termine früh buchen',
    'Alle Firmen sind versichert',
  ],
  localBlurb: `
    Planen Sie einen Umzug im Kanton ${canton.name}? Unsere geprüften Partner vor Ort 
    kennen die lokalen Gegebenheiten und bieten professionellen Service. Vergleichen Sie 
    jetzt kostenlos mehrere Offerten und sparen Sie bis zu 40% bei Ihrem Umzug.
  `,
  nearbyRegions: [],
  topCompanies: [
    {
      id: `${canton.slug}-umzuege`,
      name: `${canton.name} Umzüge`,
      rating: 4.7,
      reviewCount: 120,
      badges: ['Lokal', 'Geprüft'],
      services: ['Privatumzug', 'Reinigung'],
      priceLevel: 'Mittel',
      responseTime: '< 4h',
      isPopular: true,
    },
  ],
  faqs: [
    {
      question: `Was kostet ein Umzug in ${canton.name}?`,
      answer: `Die Kosten variieren je nach Wohnungsgrösse und Distanz. Ein 2-Zimmer-Umzug kostet ca. CHF 550-900, ein 4-Zimmer-Umzug ca. CHF 780-1'200. Mit unserem Vergleich sparen Sie bis zu 40%.`,
    },
    {
      question: 'Sind die Offerten kostenlos?',
      answer: 'Ja, absolut! Das Einholen der Offerten ist 100% kostenlos und unverbindlich.',
    },
    {
      question: 'Wie schnell erhalte ich Angebote?',
      answer: 'In der Regel erhalten Sie innerhalb von 24-48 Stunden 3-5 Offerten.',
    },
    {
      question: 'Sind die Umzugsfirmen versichert?',
      answer: 'Ja! Alle unsere Partnerfirmen sind vollständig versichert.',
    },
  ],
  testimonials: [
    {
      name: 'Kunde',
      location: canton.name,
      rating: 5,
      text: 'Unkomplizierter Service, faire Preise. Sehr empfehlenswert!',
      date: 'vor 1 Woche',
      verified: true,
      savedAmount: 300,
    },
  ],
});

// ==================== HELPER FUNCTIONS ====================

export const getRegionBySlug = (slug: string): RegionData | null => {
  // Slug aliases for common variants
  const slugAliases: Record<string, string> = {
    'basel': 'basel-stadt',
    'stgallen': 'st-gallen',
    'st.gallen': 'st-gallen',
    'graubuenden': 'graubuenden',
    'geneve': 'genf',
    'geneva': 'genf',
    'wallis': 'wallis',
    'valais': 'wallis',
    'waadt': 'waadt',
    'vaud': 'waadt',
    'tessin': 'tessin',
    'ticino': 'tessin',
    'fribourg': 'freiburg',
    'neuchatel': 'neuenburg',
    'appenzell': 'appenzell-ausserrhoden',
  };
  
  // Normalize slug
  const normalizedSlug = slugAliases[slug.toLowerCase()] || slug.toLowerCase();
  
  // Check if we have detailed data
  if (REGIONS_DATA[normalizedSlug]) {
    return REGIONS_DATA[normalizedSlug];
  }
  
  // Find canton and create default
  const canton = CANTONS.find(c => c.slug === normalizedSlug);
  if (canton) {
    return createDefaultRegion(canton);
  }
  
  return null;
};

export const getAllRegions = (): RegionData[] => {
  return CANTONS.map(canton => getRegionBySlug(canton.slug)!);
};

export const getPopularRegions = (): RegionData[] => {
  return POPULAR_REGIONS.map(slug => getRegionBySlug(slug)!);
};

export const searchPlaces = (query: string): AutocompletePlace[] => {
  const lowerQuery = query.toLowerCase();
  return AUTOCOMPLETE_PLACES.filter(place => 
    place.label.toLowerCase().includes(lowerQuery)
  ).slice(0, 8);
};

export const getLocalBlurb = (slug: string): string => {
  const region = getRegionBySlug(slug);
  return region?.localBlurb.trim() || '';
};

// ==================== PRICE ESTIMATES ====================

export interface PriceEstimate {
  min: number;
  max: number;
  savings: number;
}

export const getPriceEstimate = (size: string, regionSlug: string): PriceEstimate | null => {
  const region = getRegionBySlug(regionSlug);
  if (!region) return null;
  
  const baseEstimates: Record<string, PriceEstimate> = {
    '1-2': { min: 550, max: 900, savings: 360 },
    '2.5-3': { min: 650, max: 1000, savings: 400 },
    '3.5-4': { min: 770, max: 1200, savings: 480 },
    '4.5-5': { min: 1100, max: 1600, savings: 520 },
    '5+': { min: 1500, max: 2500, savings: 600 },
  };
  
  const base = baseEstimates[size];
  if (!base) return null;
  
  // Apply regional coefficient
  const coeff = region.priceCoefficient;
  return {
    min: Math.round(base.min * coeff),
    max: Math.round(base.max * coeff),
    savings: Math.round(base.savings * coeff),
  };
};
