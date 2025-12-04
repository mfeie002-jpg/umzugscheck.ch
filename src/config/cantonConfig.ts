/**
 * Canton Configuration System
 * Reusable config structure for all Swiss canton landing pages
 */

import { LucideIcon, Home, Building2, Truck, Package, Trash2, Shield, Clock, CheckCircle2, MapPin, TrendingUp, Layers } from "lucide-react";

// Types
export interface CantonCompany {
  name: string;
  tagline: string;
  regions: string[];
  services: string[];
  priceLevel: "Günstig" | "Mittel" | "Mittel–Premium" | "Premium";
  rating: number;
  reviewCount: number;
  highlight: string;
  availability: string;
  isPopular?: boolean;
  isAIRecommended?: boolean;
  isPremium?: boolean;
  isBestPrice?: boolean;
  savingsPercent: number;
}

export interface PriceExample {
  title: string;
  subtitle: string;
  description: string;
  info: string;
  priceRange: string;
  avgSavings: string;
  icon: LucideIcon;
}

export interface CantonService {
  title: string;
  description: string;
  link: string;
  icon: LucideIcon;
  popularity: number;
}

export interface CantonUSP {
  title: string;
  description: string;
  icon: LucideIcon;
  stat: string;
  statLabel: string;
}

export interface CantonFAQ {
  question: string;
  answer: string;
  category: string;
}

export interface CantonSEO {
  title: string;
  description: string;
  keywords: string;
  geoRegion: string;
  geoPlacename: string;
  position: { lat: number; lng: number };
}

export interface CantonConfig {
  slug: string;
  name: string;
  shortName: string;
  mainCity: string;
  locations: string[];
  seo: CantonSEO;
  companies: CantonCompany[];
  priceExamples: PriceExample[];
  services: CantonService[];
  usps: CantonUSP[];
  faqs: CantonFAQ[];
  seoContent: {
    intro: string;
    cityInfo: { title: string; content: string }[];
    additionalServices: { title: string; content: string }[];
  };
}

// Zug Canton Config - Master Template
export const zugConfig: CantonConfig = {
  slug: "zug",
  name: "Kanton Zug",
  shortName: "Zug",
  mainCity: "Zug",
  locations: [
    "Zug", "Baar", "Cham", "Steinhausen", "Hünenberg",
    "Risch/Rotkreuz", "Walchwil", "Menzingen", "Neuheim",
    "Oberägeri", "Unterägeri"
  ],
  seo: {
    title: "Umzugsfirma Zug: Umzugsfirmen vergleichen & Offerten erhalten | umzugscheck.ch",
    description: "Finde die beste Umzugsfirma in Zug: Vergleiche geprüfte Umzugsfirmen im Kanton Zug, erhalte kostenlose Offerten und spare Zeit & Geld beim Umzug. Privatumzug, Firmenumzug & Reinigung mit Abgabegarantie.",
    keywords: "Umzugsfirma Zug, Umzug Zug, Umzugsfirmen Kanton Zug, Umzugsunternehmen Zug, Umzug Baar, Umzug Cham, Umzug Steinhausen",
    geoRegion: "CH-ZG",
    geoPlacename: "Kanton Zug, Schweiz",
    position: { lat: 47.1662, lng: 8.5155 }
  },
  companies: [
    {
      name: "Zuger Umzüge",
      tagline: "Regionaler Spezialist für den Kanton Zug",
      regions: ["Zug", "Baar", "Cham", "Steinhausen"],
      services: ["Privatumzug", "Firmenumzug", "Reinigung", "Entsorgung"],
      priceLevel: "Mittel",
      rating: 4.7,
      reviewCount: 156,
      highlight: "Ideal für Umzüge in Zug & Baar",
      availability: "Verfügbar ab 15. Dez",
      isPopular: true,
      savingsPercent: 15,
    },
    {
      name: "Happy Moving GmbH",
      tagline: "Strukturierte Abläufe für komplexe Umzugsprojekte",
      regions: ["Zug", "Baar", "Cham", "Hünenberg", "Rotkreuz", "Schweizweit"],
      services: ["Privatumzug", "Firmenumzug", "Einlagerung", "Räumung", "Reinigung"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
      reviewCount: 234,
      highlight: "Full-Service inkl. Reinigung",
      availability: "Sofort verfügbar",
      isPopular: true,
      isAIRecommended: true,
      savingsPercent: 22,
    },
    {
      name: "Helvetia Transporte & Umzüge",
      tagline: "Starke Planung für anspruchsvolle Umzüge",
      regions: ["Zug", "Baar", "Cham", "Walchwil", "Hünenberg"],
      services: ["Privatumzug", "Firmenumzug", "Möbellift"],
      priceLevel: "Mittel",
      rating: 4.6,
      reviewCount: 89,
      highlight: "Spezialist für Möbellift-Einsätze",
      availability: "Verfügbar ab 20. Dez",
      savingsPercent: 12,
    },
    {
      name: "Kehrli + Oeler",
      tagline: "Traditionsunternehmen mit Fokus auf Qualität",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Premium",
      rating: 4.9,
      reviewCount: 412,
      highlight: "Höchste Qualitätsstandards",
      availability: "Auf Anfrage",
      isPremium: true,
      savingsPercent: 8,
    },
    {
      name: "Umzugsfuchs",
      tagline: "Preisorientierte Angebote mit Kostentransparenz",
      regions: ["Schweizweit inkl. Zug"],
      services: ["Privatumzug"],
      priceLevel: "Günstig",
      rating: 4.5,
      reviewCount: 178,
      highlight: "Beste Preise für Privatumzüge",
      availability: "Sofort verfügbar",
      isBestPrice: true,
      savingsPercent: 35,
    },
    {
      name: "Umzugprofis",
      tagline: "Full-Service inkl. Räumung und Reinigung",
      regions: ["Zug & Schweizweit"],
      services: ["Privatumzug", "Entsorgung", "Reinigung"],
      priceLevel: "Mittel",
      rating: 4.7,
      reviewCount: 145,
      highlight: "Komplettpaket möglich",
      availability: "Verfügbar ab 18. Dez",
      savingsPercent: 18,
    },
    {
      name: "Slavi Umzüge",
      tagline: "Persönliche Betreuung und langjährige Erfahrung",
      regions: ["Kanton Zug & Region"],
      services: ["Privatumzug", "Firmenumzug"],
      priceLevel: "Mittel",
      rating: 4.6,
      reviewCount: 67,
      highlight: "Familienbetrieb mit Herz",
      availability: "Sofort verfügbar",
      savingsPercent: 20,
    },
    {
      name: "Arnold Umzüge",
      tagline: "Umzug, Lager und Räumung kombiniert",
      regions: ["Kanton Zug"],
      services: ["Privatumzug", "Einlagerung", "Entsorgung"],
      priceLevel: "Mittel",
      rating: 4.5,
      reviewCount: 56,
      highlight: "Lagerlösungen verfügbar",
      availability: "Verfügbar ab 22. Dez",
      savingsPercent: 14,
    },
    {
      name: "Martinas Umzugsservice",
      tagline: "Umzug + Reinigung mit Abgabegarantie",
      regions: ["Kanton Zug & Umgebung"],
      services: ["Privatumzug", "Reinigung", "Einlagerung", "Räumung", "Firmenumzug"],
      priceLevel: "Mittel–Premium",
      rating: 4.8,
      reviewCount: 198,
      highlight: "Abgabegarantie inklusive",
      availability: "Sofort verfügbar",
      isPopular: true,
      savingsPercent: 25,
    },
    {
      name: "Fachmann Umzug",
      tagline: "Budgetfreundlich für mehrere Kantone",
      regions: ["Zürich, Aargau, Luzern & Zug"],
      services: ["Privatumzug", "Reinigung", "Entsorgung", "Einlagerung"],
      priceLevel: "Günstig",
      rating: 4.4,
      reviewCount: 112,
      highlight: "Kantonsübergreifend günstig",
      availability: "Verfügbar ab 17. Dez",
      savingsPercent: 30,
    },
  ],
  priceExamples: [
    {
      title: "2.5-Zimmer Wohnung",
      subtitle: "Innerhalb Stadt Zug",
      description: "Inkl. Transport, Tragen und einfacher Möbelmontage.",
      info: "2–3 Helfer · 1 LKW · ca. 4–6 Std.",
      priceRange: "CHF 800 – 1'400",
      avgSavings: "CHF 280",
      icon: Home,
    },
    {
      title: "3.5-Zimmer Wohnung",
      subtitle: "Zug → Baar oder Cham",
      description: "Mit Tragen, Transport und einfachem Auf- und Abbau.",
      info: "3 Helfer · 1 LKW · ca. 6–8 Std.",
      priceRange: "CHF 1'200 – 2'200",
      avgSavings: "CHF 420",
      icon: Building2,
    },
    {
      title: "4.5-Zimmer Haus",
      subtitle: "Umzug + Reinigung",
      description: "Komplettumzug mit Endreinigung und Abgabegarantie.",
      info: "Umzugs- + Reinigungsteam",
      priceRange: "CHF 2'500 – 4'500",
      avgSavings: "CHF 680",
      icon: Home,
    },
  ],
  services: [
    {
      title: "Umzug + Reinigung",
      description: "Kombiniertes Angebot mit garantierter Abnahme.",
      link: "/zug/umzug-mit-reinigung",
      icon: Home,
      popularity: 85,
    },
    {
      title: "Firmenumzug",
      description: "Professionelle Geschäftsumzüge mit minimaler Ausfallzeit.",
      link: "/zug/firmenumzug",
      icon: Building2,
      popularity: 72,
    },
    {
      title: "Möbellift",
      description: "Ideal für enge Zufahrten und obere Etagen.",
      link: "/zug/moebellift",
      icon: Truck,
      popularity: 65,
    },
    {
      title: "Entsorgung & Räumung",
      description: "Professionelle Entrümpelung von Kellern und Estrich.",
      link: "/zug/entsorgung-raeumung",
      icon: Trash2,
      popularity: 58,
    },
    {
      title: "Möbellager",
      description: "Sichere Lagermöglichkeiten für kurz- oder langfristig.",
      link: "/zug/moebellager",
      icon: Package,
      popularity: 45,
    },
    {
      title: "Kleintransporte",
      description: "Flexible Lösungen für WG-Umzüge oder einzelne Möbel.",
      link: "/zug/kleinumzug",
      icon: Truck,
      popularity: 52,
    },
  ],
  usps: [
    {
      title: "Geprüfte Umzugsfirmen",
      description: "Ausgewählte Umzugsfirmen, die regelmässig in Zug, Baar und Cham umziehen.",
      icon: Shield,
      stat: "100%",
      statLabel: "Verifiziert",
    },
    {
      title: "Zeit & Geld sparen",
      description: "Eine Anfrage, mehrere Offerten – bis zu 40% sparen.",
      icon: Clock,
      stat: "Ø 40%",
      statLabel: "Ersparnis",
    },
    {
      title: "Zusatzservices",
      description: "Reinigung, Entsorgung, Einlagerung – alles auf einen Blick.",
      icon: CheckCircle2,
      stat: "15+",
      statLabel: "Services",
    },
    {
      title: "Lokale Expertise",
      description: "Informationen zu Verwaltung, Parkbewilligungen und lokalen Gegebenheiten.",
      icon: MapPin,
      stat: "11",
      statLabel: "Gemeinden",
    },
    {
      title: "Transparenz",
      description: "Strukturierte Profile, klare Beschreibungen, keine versteckten Kosten.",
      icon: TrendingUp,
      stat: "4.8/5",
      statLabel: "Bewertung",
    },
    {
      title: "Direktvergleich",
      description: "Vergleiche mehrere Firmen nebeneinander und finde den besten Partner.",
      icon: Layers,
      stat: "3",
      statLabel: "Vergleichen",
    },
  ],
  faqs: [
    {
      question: "Was kostet ein Umzug in Zug?",
      answer: "Die Kosten hängen von mehreren Faktoren ab: Anzahl Zimmer, Etage, Distanz, Zugang und Zusatzleistungen. Ein 2.5-Zimmer-Umzug innerhalb von Zug kostet typischerweise CHF 800–1'400, ein 3.5-Zimmer-Umzug zwischen CHF 1'200–2'200. Für grössere Wohnungen oder Häuser rechne mit CHF 2'500–4'500.",
      category: "Kosten",
    },
    {
      question: "Wie früh sollte ich eine Umzugsfirma im Kanton Zug buchen?",
      answer: "Idealerweise 4–8 Wochen im Voraus. Bei Umzügen am Monatsende oder in der Hochsaison (April–September) empfehlen wir 8–12 Wochen Vorlauf. Besonders im wirtschaftsstarken Kanton Zug sind gute Umzugsfirmen oft früh ausgebucht.",
      category: "Planung",
    },
    {
      question: "Gibt es Umzugsfirmen mit Reinigung und Abgabegarantie?",
      answer: "Ja, mehrere unserer Partnerfirmen im Kanton Zug bieten kombinierte Umzugs- und Reinigungspakete mit Abgabegarantie an. Das bedeutet: Falls die Verwaltung die Reinigung nicht abnimmt, wird kostenlos nachgereinigt.",
      category: "Services",
    },
    {
      question: "Wie finde ich eine zuverlässige Umzugsfirma in Zug?",
      answer: "Über umzugscheck.ch vergleichst du geprüfte Umzugsfirmen im Kanton Zug. Achte auf Bewertungen, Erfahrungsberichte und das Leistungsspektrum. Hol dir mehrere Offerten und vergleiche Preise sowie inkludierte Leistungen.",
      category: "Vergleich",
    },
    {
      question: "Wie funktioniert der Firmenumzug im Kanton Zug über umzugscheck.ch?",
      answer: "Firmenumzüge sind ein wichtiger Schwerpunkt. Beschreibe dein Projekt (Bürogrösse, IT-Equipment, Zeitrahmen), und du erhältst massgeschneiderte Offerten von spezialisierten Umzugsfirmen. Viele bieten Wochenend-Umzüge an, um Ausfallzeiten zu minimieren.",
      category: "Services",
    },
    {
      question: "Brauche ich eine Parkbewilligung für den Umzug in Zug?",
      answer: "Das hängt vom Standort ab. In der Altstadt von Zug oder bei engen Quartieren kann eine Parkbewilligung oder ein temporäres Halteverbot nötig sein. Erkundige dich frühzeitig bei der Gemeinde oder frage deine Umzugsfirma – viele übernehmen das für dich.",
      category: "Planung",
    },
    {
      question: "Bieten die Umzugsfirmen Fixpreise oder Stundenansätze an?",
      answer: "Beides ist möglich. Einige Firmen arbeiten mit Fixpreisen (besonders bei Standardumzügen), andere nach Stunden. In den Offerten siehst du klar, welches Modell angeboten wird. Fixpreise bieten mehr Planungssicherheit, Stundenansätze können bei kleineren Umzügen günstiger sein.",
      category: "Kosten",
    },
  ],
  seoContent: {
    intro: `Der Kanton Zug zählt zu den wirtschaftlich stärksten Regionen der Schweiz. Viele Privatpersonen und Unternehmen ziehen wegen der attraktiven Steuersituation und der hohen Lebensqualität nach Zug. Doch auch innerhalb des Kantons finden regelmässig Umzüge statt – sei es von Baar nach Cham, von Zug in die Umgebung oder von weiter her in die Region.`,
    cityInfo: [
      {
        title: "Umzug in der Stadt Zug",
        content: `Die Stadt Zug ist das Zentrum des Kantons und bietet eine charmante Mischung aus Altstadt, modernen Wohnquartieren und wirtschaftlichen Hotspots. Ein Umzug innerhalb der Stadt kann aufgrund enger Gassen, Parkplatzmangel und hoher Auslastung anspruchsvoll sein. Umzugsfirmen mit lokaler Erfahrung kennen die Gegebenheiten – etwa, wo Möbellifte sinnvoll sind oder welche Strassen für grosse LKW gesperrt sind. Plane deinen Umzug frühzeitig und hole dir über umzugscheck.ch mehrere Offerten von Firmen, die regelmässig in Zug arbeiten.`
      },
      {
        title: "Umzug in Baar",
        content: `Baar ist die grösste Gemeinde im Kanton Zug und wächst stetig. Viele junge Familien und Berufstätige wählen Baar als Wohnort, weil es ruhiger ist als die Stadt Zug, aber dennoch verkehrstechnisch gut angebunden. Umzugsfirmen, die Baar gut kennen, wissen um Parkmöglichkeiten, Zufahrten und lokale Vorschriften. Nutze umzugscheck.ch, um geprüfte Umzugsfirmen zu vergleichen, die regelmässig in Baar tätig sind.`
      },
      {
        title: "Umzug in Cham",
        content: `Cham liegt am Zugersee und bietet hohe Lebensqualität. Die Gemeinde ist bei Familien beliebt und verfügt über gute Schulen und Freizeitmöglichkeiten. Ein Umzug nach oder innerhalb von Cham erfordert oft Koordination mit der Gemeindeverwaltung – etwa für Parkbewilligungen am Umzugstag. Viele Umzugsfirmen im Kanton Zug übernehmen diese Formalitäten für dich. Vergleiche jetzt Angebote über umzugscheck.ch.`
      },
    ],
    additionalServices: [
      {
        title: "Umzug mit Reinigung und Abgabegarantie im Kanton Zug",
        content: `Im Kanton Zug ist es üblich, die Wohnung bei Auszug besenrein oder sogar professionell gereinigt zu übergeben. Viele Umzugsfirmen bieten deshalb kombinierte Pakete aus Umzug und Endreinigung an – oft mit Abgabegarantie. Das bedeutet: Falls die Verwaltung die Reinigung nicht abnimmt, wird kostenlos nachgereinigt. Diese Kombipakete sind besonders beliebt bei stressigen Umzügen, weil du alles aus einer Hand erhältst.`
      },
      {
        title: "Firmenumzug im Kanton Zug",
        content: `Der Kanton Zug ist ein wichtiger Unternehmensstandort. Firmenumzüge erfordern besondere Planung: IT-Equipment, Möbel, Archive und empfindliche Geräte müssen sicher transportiert werden. Viele unserer Partnerfirmen bieten Wochenend-Umzüge an, um Ausfallzeiten zu minimieren. Beschreibe dein Projekt auf umzugscheck.ch und erhalte massgeschneiderte Offerten von spezialisierten Umzugsfirmen.`
      },
    ],
  },
};

// Helper function to get canton config by slug
export const getCantonConfig = (slug: string): CantonConfig | undefined => {
  const configs: Record<string, CantonConfig> = {
    zug: zugConfig,
    // Add more canton configs here as they are created
  };
  return configs[slug];
};

// All Swiss cantons for the RegionsDropdown
export const allCantons = [
  { slug: "zuerich", name: "Zürich", code: "ZH" },
  { slug: "bern", name: "Bern", code: "BE" },
  { slug: "luzern", name: "Luzern", code: "LU" },
  { slug: "uri", name: "Uri", code: "UR" },
  { slug: "schwyz", name: "Schwyz", code: "SZ" },
  { slug: "obwalden", name: "Obwalden", code: "OW" },
  { slug: "nidwalden", name: "Nidwalden", code: "NW" },
  { slug: "glarus", name: "Glarus", code: "GL" },
  { slug: "zug", name: "Zug", code: "ZG" },
  { slug: "fribourg", name: "Fribourg", code: "FR" },
  { slug: "solothurn", name: "Solothurn", code: "SO" },
  { slug: "basel", name: "Basel", code: "BS" },
  { slug: "schaffhausen", name: "Schaffhausen", code: "SH" },
  { slug: "appenzell", name: "Appenzell", code: "AR" },
  { slug: "stgallen", name: "St. Gallen", code: "SG" },
  { slug: "graubuenden", name: "Graubünden", code: "GR" },
  { slug: "aargau", name: "Aargau", code: "AG" },
  { slug: "thurgau", name: "Thurgau", code: "TG" },
  { slug: "tessin", name: "Tessin", code: "TI" },
  { slug: "waadt", name: "Waadt", code: "VD" },
  { slug: "wallis", name: "Wallis", code: "VS" },
  { slug: "neuchatel", name: "Neuenburg", code: "NE" },
  { slug: "geneve", name: "Genf", code: "GE" },
  { slug: "jura", name: "Jura", code: "JU" },
];

// Price level color helper
export const getPriceLevelColor = (level: string): string => {
  switch (level) {
    case "Günstig": return "bg-green-100 text-green-800 border-green-200";
    case "Mittel": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Mittel–Premium": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Premium": return "bg-amber-100 text-amber-800 border-amber-200";
    default: return "bg-muted text-muted-foreground";
  }
};
