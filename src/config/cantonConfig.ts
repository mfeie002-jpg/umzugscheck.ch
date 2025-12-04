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

// Zürich Canton Config
export const zuerichConfig: CantonConfig = {
  slug: "zuerich",
  name: "Kanton Zürich",
  shortName: "Zürich",
  mainCity: "Zürich",
  locations: ["Zürich", "Winterthur", "Uster", "Dübendorf", "Dietikon", "Wetzikon", "Kloten", "Bülach", "Horgen", "Wädenswil"],
  seo: {
    title: "Umzugsfirma Zürich: Umzugsfirmen vergleichen & Offerten erhalten | umzugscheck.ch",
    description: "Finde die beste Umzugsfirma in Zürich: Vergleiche geprüfte Umzugsfirmen im Kanton Zürich, erhalte kostenlose Offerten und spare bis zu 40% beim Umzug.",
    keywords: "Umzugsfirma Zürich, Umzug Zürich, Umzugsfirmen Kanton Zürich, Umzugsunternehmen Zürich, Umzug Winterthur",
    geoRegion: "CH-ZH",
    geoPlacename: "Kanton Zürich, Schweiz",
    position: { lat: 47.3769, lng: 8.5417 }
  },
  companies: [
    { name: "Zürich Umzüge AG", tagline: "Premium-Service in der Limmatstadt", regions: ["Zürich", "Winterthur", "Uster"], services: ["Privatumzug", "Firmenumzug", "Reinigung"], priceLevel: "Mittel", rating: 4.9, reviewCount: 456, highlight: "Top bewertet", availability: "Verfügbar ab 10. Dez", isPopular: true, savingsPercent: 20 },
    { name: "Limmattal Moving", tagline: "Günstig & zuverlässig", regions: ["Dietikon", "Zürich", "Schlieren"], services: ["Privatumzug", "Entsorgung"], priceLevel: "Günstig", rating: 4.9, reviewCount: 387, highlight: "Preistipp", availability: "Sofort verfügbar", isBestPrice: true, savingsPercent: 35 },
    { name: "Premium Relocation Zürich", tagline: "Luxus-Umzüge mit Vollservice", regions: ["Zürich", "Zollikon", "Küsnacht"], services: ["Privatumzug", "International", "Kunst"], priceLevel: "Premium", rating: 4.8, reviewCount: 312, highlight: "Premium Service", availability: "Verfügbar ab 15. Dez", isPremium: true, savingsPercent: 10 },
    { name: "Winterthur Express", tagline: "Schnell im Grossraum Winterthur", regions: ["Winterthur", "Kloten", "Bülach"], services: ["Privatumzug", "Kleintransporte"], priceLevel: "Mittel", rating: 4.8, reviewCount: 276, highlight: "Express verfügbar", availability: "Heute verfügbar", savingsPercent: 25 },
    { name: "Zürisee Transporte", tagline: "Am See zu Hause", regions: ["Horgen", "Wädenswil", "Meilen"], services: ["Privatumzug", "Lagerung"], priceLevel: "Günstig", rating: 4.7, reviewCount: 234, highlight: "Beliebt", availability: "Ab nächster Woche", savingsPercent: 30 },
    { name: "Unterland Umzüge", tagline: "Zürcher Unterland Experten", regions: ["Bülach", "Kloten", "Opfikon"], services: ["Privatumzug"], priceLevel: "Mittel", rating: 4.7, reviewCount: 198, highlight: "Regional stark", availability: "Ausgebucht", savingsPercent: 20 },
    { name: "Oberland Moving GmbH", tagline: "Zürcher Oberland Spezialisten", regions: ["Uster", "Wetzikon", "Pfäffikon"], services: ["Privatumzug", "Entsorgung"], priceLevel: "Günstig", rating: 4.6, reviewCount: 167, highlight: "Lokal", availability: "Verfügbar", savingsPercent: 28 },
    { name: "City Zürich Transporte", tagline: "Innerstädtische Umzüge", regions: ["Zürich Kreis 1-12"], services: ["Firmenumzug", "Spezialtransporte"], priceLevel: "Premium", rating: 4.6, reviewCount: 143, highlight: "City-Experten", availability: "Verfügbar", savingsPercent: 12 },
    { name: "Glatttal Umzüge", tagline: "Glatttal & Umgebung", regions: ["Dübendorf", "Wallisellen", "Opfikon"], services: ["Privatumzug"], priceLevel: "Mittel", rating: 4.5, reviewCount: 121, highlight: "Schnell", availability: "Verfügbar", savingsPercent: 22 },
    { name: "Sihltal Express", tagline: "Sihltal Spezialist", regions: ["Adliswil", "Langnau", "Thalwil"], services: ["Privatumzug", "Kleintransporte"], priceLevel: "Günstig", rating: 4.5, reviewCount: 98, highlight: "Budget-freundlich", availability: "Ausgebucht", savingsPercent: 32 },
  ],
  priceExamples: [
    { title: "1-2 Zimmer", subtitle: "Studio / Kleinwohnung", description: "Ideal für Singles oder Paare mit wenig Hausrat", info: "Inkl. Transport, Be- & Entladung", priceRange: "CHF 590 – 990", avgSavings: "Ø 25% Ersparnis", icon: Home },
    { title: "3-4 Zimmer", subtitle: "Familienwohnung", description: "Standard-Wohnung für Familien", info: "Inkl. Verpackungsmaterial", priceRange: "CHF 1'190 – 1'990", avgSavings: "Ø 30% Ersparnis", icon: Home },
    { title: "5+ Zimmer", subtitle: "Grosshaushalt / Villa", description: "Grosse Wohnungen oder Häuser", info: "Inkl. Möbelmontage", priceRange: "CHF 2'190 – 3'790", avgSavings: "Ø 35% Ersparnis", icon: Building2 },
  ],
  services: [
    { title: "Umzug + Reinigung", description: "Komplettpaket mit Abgabegarantie", link: "/umzug-mit-reinigung", icon: Home, popularity: 95 },
    { title: "Firmenumzug", description: "Professionelle Büroumzüge", link: "/firmenumzug-schweiz", icon: Building2, popularity: 80 },
    { title: "Möbellift", description: "Aussenlifter für schwere Möbel", link: "/moebellift", icon: Truck, popularity: 60 },
    { title: "Entsorgung", description: "Räumung & Entsorgung", link: "/entsorgung-raeumung", icon: Trash2, popularity: 70 },
    { title: "Einlagerung", description: "Sichere Möbellagerung", link: "/einlagerung", icon: Package, popularity: 65 },
    { title: "Kleintransporte", description: "Einzelmöbel & kleine Transporte", link: "/kleintransporte", icon: Truck, popularity: 55 },
  ],
  usps: [
    { title: "Grösste Auswahl", description: "Die meisten Umzugsfirmen der Schweiz", icon: Layers, stat: "156+", statLabel: "Partnerfirmen" },
    { title: "Bis 40% sparen", description: "Durch direkten Preisvergleich", icon: TrendingUp, stat: "40%", statLabel: "Ersparnis" },
    { title: "Schnelle Offerten", description: "Bis zu 5 Angebote in 24h", icon: Clock, stat: "24h", statLabel: "Antwortzeit" },
    { title: "Geprüfte Partner", description: "Alle Firmen versichert & verifiziert", icon: Shield, stat: "100%", statLabel: "Versichert" },
  ],
  faqs: [
    { question: "Was kostet ein Umzug in Zürich?", answer: "Ein Umzug in Zürich kostet zwischen CHF 590 und CHF 3'790 je nach Wohnungsgrösse. Zürich hat die höchsten Umzugspreise der Schweiz.", category: "Kosten" },
    { question: "Welche Umzugsfirma ist die beste in Zürich?", answer: "Die besten Umzugsfirmen in Zürich haben Bewertungen von 4.8 oder höher. Vergleichen Sie auf unserer Plattform.", category: "Auswahl" },
    { question: "Brauche ich eine Parkbewilligung für den Umzug?", answer: "Ja, in Zürich ist eine Parkbewilligung beim Tiefbauamt erforderlich. Die meisten Umzugsfirmen kümmern sich darum.", category: "Administrativ" },
    { question: "Sind die Umzugsfirmen versichert?", answer: "Alle Unternehmen auf unserer Plattform sind vollständig versichert und verifiziert.", category: "Sicherheit" },
    { question: "Wie lange dauert ein Umzug in Zürich?", answer: "Ein durchschnittlicher 3-Zimmer-Umzug dauert 4-6 Stunden. Bei grösseren Wohnungen entsprechend länger.", category: "Ablauf" },
  ],
  seoContent: {
    intro: "Zürich ist die grösste Stadt der Schweiz und ein bedeutendes Wirtschaftszentrum. Der Umzugsmarkt ist entsprechend gross und wettbewerbsintensiv. Mit über 150 aktiven Umzugsfirmen finden Sie garantiert den passenden Partner für Ihren Umzug.",
    cityInfo: [
      { title: "Umzug in Zürich Stadt", content: "Die Stadt Zürich mit ihren 12 Kreisen bietet unterschiedliche Herausforderungen: Enge Gassen in der Altstadt, Parkplatzmangel in Aussersihl oder steile Hügel in Höngg. Professionelle Umzugsfirmen kennen diese lokalen Gegebenheiten." },
      { title: "Umzug nach Winterthur", content: "Winterthur ist die zweitgrösste Stadt im Kanton. Der Umzugsmarkt ist hier ebenfalls aktiv, mit spezialisierten lokalen Anbietern für die Region." },
    ],
    additionalServices: [
      { title: "Umzug mit Reinigung in Zürich", content: "Kombipakete aus Umzug und Endreinigung sind in Zürich besonders beliebt. Viele Anbieter garantieren die Wohnungsabnahme." },
      { title: "Firmenumzug in Zürich", content: "Als Wirtschaftsstandort sind Firmenumzüge in Zürich häufig. Spezialisierte Anbieter bieten Wochenend-Service für minimale Ausfallzeiten." },
    ],
  },
};

// Bern Canton Config  
export const bernConfig: CantonConfig = {
  slug: "bern",
  name: "Kanton Bern",
  shortName: "Bern",
  mainCity: "Bern",
  locations: ["Bern", "Biel/Bienne", "Thun", "Köniz", "Burgdorf", "Langenthal", "Interlaken", "Spiez", "Münsingen", "Worb"],
  seo: {
    title: "Umzugsfirma Bern: Umzugsfirmen vergleichen & Offerten erhalten | umzugscheck.ch",
    description: "Finde die beste Umzugsfirma in Bern: Vergleiche geprüfte Umzugsfirmen im Kanton Bern, erhalte kostenlose Offerten und spare bis zu 40% beim Umzug.",
    keywords: "Umzugsfirma Bern, Umzug Bern, Umzugsfirmen Kanton Bern, Umzugsunternehmen Bern, Umzug Thun",
    geoRegion: "CH-BE",
    geoPlacename: "Kanton Bern, Schweiz",
    position: { lat: 46.9480, lng: 7.4474 }
  },
  companies: [
    { name: "Berner Umzüge AG", tagline: "Tradition seit 1985", regions: ["Bern", "Köniz", "Ostermundigen"], services: ["Privatumzug", "Firmenumzug"], priceLevel: "Mittel", rating: 4.9, reviewCount: 342, highlight: "Top bewertet", availability: "Verfügbar ab 12. Dez", isPopular: true, savingsPercent: 22 },
    { name: "Aaretransporte GmbH", tagline: "Günstig an der Aare", regions: ["Bern", "Thun", "Münsingen"], services: ["Privatumzug", "Entsorgung"], priceLevel: "Günstig", rating: 4.8, reviewCount: 287, highlight: "Preistipp", availability: "Sofort verfügbar", isBestPrice: true, savingsPercent: 38 },
    { name: "Premium Moving Bern", tagline: "Vollservice für Anspruchsvolle", regions: ["Bern", "Muri", "Belp"], services: ["Privatumzug", "International"], priceLevel: "Premium", rating: 4.8, reviewCount: 234, highlight: "Premium Service", availability: "Verfügbar", isPremium: true, savingsPercent: 12 },
    { name: "Thunersee Transporte", tagline: "Berner Oberland Spezialisten", regions: ["Thun", "Spiez", "Interlaken"], services: ["Privatumzug"], priceLevel: "Mittel", rating: 4.7, reviewCount: 198, highlight: "Lokal", availability: "Verfügbar", savingsPercent: 25 },
    { name: "Oberland Umzüge", tagline: "Vom Thunersee bis zum Brienzersee", regions: ["Interlaken", "Thun", "Spiez"], services: ["Privatumzug", "Lagerung"], priceLevel: "Günstig", rating: 4.7, reviewCount: 167, highlight: "Beliebt", availability: "Ab nächster Woche", savingsPercent: 30 },
    { name: "Seeland Moving", tagline: "Seeland & Biel Region", regions: ["Biel", "Lyss", "Aarberg"], services: ["Privatumzug"], priceLevel: "Mittel", rating: 4.6, reviewCount: 143, highlight: "Regional", availability: "Verfügbar", savingsPercent: 20 },
    { name: "Emmental Express", tagline: "Schnell durchs Emmental", regions: ["Burgdorf", "Langenthal", "Langnau"], services: ["Privatumzug", "Kleintransporte"], priceLevel: "Günstig", rating: 4.6, reviewCount: 121, highlight: "Schnell", availability: "Ausgebucht", savingsPercent: 28 },
    { name: "Mittelland Transporte", tagline: "Flexibel im Mittelland", regions: ["Bern", "Burgdorf", "Langenthal"], services: ["Privatumzug"], priceLevel: "Mittel", rating: 4.5, reviewCount: 98, highlight: "Flexibel", availability: "Verfügbar", savingsPercent: 18 },
  ],
  priceExamples: [
    { title: "1-2 Zimmer", subtitle: "Studio / Kleinwohnung", description: "Ideal für Singles oder Paare", info: "Inkl. Transport, Be- & Entladung", priceRange: "CHF 490 – 890", avgSavings: "Ø 28% Ersparnis", icon: Home },
    { title: "3-4 Zimmer", subtitle: "Familienwohnung", description: "Standard-Wohnung für Familien", info: "Inkl. Verpackungsmaterial", priceRange: "CHF 990 – 1'690", avgSavings: "Ø 32% Ersparnis", icon: Home },
    { title: "5+ Zimmer", subtitle: "Grosshaushalt / Haus", description: "Grosse Wohnungen oder Häuser", info: "Inkl. Möbelmontage", priceRange: "CHF 1'890 – 3'290", avgSavings: "Ø 35% Ersparnis", icon: Building2 },
  ],
  services: [
    { title: "Umzug + Reinigung", description: "Komplettpaket mit Abgabegarantie", link: "/umzug-mit-reinigung", icon: Home, popularity: 92 },
    { title: "Firmenumzug", description: "Professionelle Büroumzüge", link: "/firmenumzug-schweiz", icon: Building2, popularity: 75 },
    { title: "Möbellift", description: "Aussenlifter für Altstadt", link: "/moebellift", icon: Truck, popularity: 70 },
    { title: "Entsorgung", description: "Räumung & Entsorgung", link: "/entsorgung-raeumung", icon: Trash2, popularity: 68 },
    { title: "Einlagerung", description: "Sichere Möbellagerung", link: "/einlagerung", icon: Package, popularity: 62 },
    { title: "Kleintransporte", description: "Einzelmöbel & kleine Transporte", link: "/kleintransporte", icon: Truck, popularity: 58 },
  ],
  usps: [
    { title: "Bundesstadt-Experten", description: "Lokale Firmen kennen Bern", icon: MapPin, stat: "85+", statLabel: "Partnerfirmen" },
    { title: "Bis 40% sparen", description: "Durch direkten Preisvergleich", icon: TrendingUp, stat: "38%", statLabel: "Ersparnis" },
    { title: "Schnelle Offerten", description: "Bis zu 5 Angebote in 24h", icon: Clock, stat: "24h", statLabel: "Antwortzeit" },
    { title: "Geprüfte Partner", description: "Alle Firmen versichert", icon: Shield, stat: "100%", statLabel: "Versichert" },
  ],
  faqs: [
    { question: "Was kostet ein Umzug in Bern?", answer: "Ein Umzug in Bern kostet zwischen CHF 490 und CHF 3'290 je nach Wohnungsgrösse. Bern ist günstiger als Zürich.", category: "Kosten" },
    { question: "Welche Umzugsfirma ist die beste in Bern?", answer: "Die besten Umzugsfirmen in Bern haben Bewertungen von 4.8 oder höher.", category: "Auswahl" },
    { question: "Brauche ich eine Parkbewilligung in der Altstadt?", answer: "Ja, in der Berner Altstadt (UNESCO-Welterbe) ist eine spezielle Bewilligung erforderlich.", category: "Administrativ" },
    { question: "Gibt es Spezialisten für Altstadt-Umzüge?", answer: "Ja, mehrere unserer Partner sind auf die engen Gassen der Berner Altstadt spezialisiert.", category: "Spezial" },
    { question: "Wie lange dauert ein Umzug in Bern?", answer: "Ein durchschnittlicher 3-Zimmer-Umzug dauert 4-5 Stunden. In der Altstadt kann es länger dauern.", category: "Ablauf" },
  ],
  seoContent: {
    intro: "Bern ist die Bundesstadt der Schweiz und Hauptstadt des gleichnamigen Kantons. Die UNESCO-geschützte Altstadt stellt besondere Anforderungen an Umzugsfirmen.",
    cityInfo: [
      { title: "Umzug in der Berner Altstadt", content: "Die mittelalterliche Altstadt mit ihren Laubengängen erfordert erfahrene Umzugsfirmen. Enge Gassen und fehlende Parkplätze machen spezielle Planung notwendig." },
      { title: "Umzug nach Thun", content: "Thun am Thunersee ist die zweitgrösste Stadt im Kanton. Die Region ist bei Familien beliebt und hat einen aktiven Umzugsmarkt." },
    ],
    additionalServices: [
      { title: "Umzug mit Reinigung in Bern", content: "Kombipakete aus Umzug und Endreinigung sind sehr beliebt. Viele Anbieter garantieren die Wohnungsabnahme." },
      { title: "Firmenumzug in Bern", content: "Als Verwaltungsstadt sind Büroumzüge häufig. Spezialisierte Anbieter bieten diskrete Wochenend-Services." },
    ],
  },
};

const cantonConfigs: Record<string, CantonConfig> = {
  zug: zugConfig,
  zuerich: zuerichConfig,
  bern: bernConfig,
};

export const getCantonConfig = (slug: string): CantonConfig | undefined => {
  return cantonConfigs[slug.toLowerCase()];
};

export const allCantons = [
  { slug: "zuerich", name: "Zürich" },
  { slug: "bern", name: "Bern" },
  { slug: "zug", name: "Zug" },
  { slug: "luzern", name: "Luzern" },
  { slug: "aargau", name: "Aargau" },
  { slug: "basel", name: "Basel" },
  { slug: "stgallen", name: "St. Gallen" },
];

export const getPriceLevelColor = (level: string): string => {
  switch (level) {
    case "Günstig": return "bg-green-100 text-green-800 border-green-200";
    case "Mittel": return "bg-blue-100 text-blue-800 border-blue-200";
    case "Mittel–Premium": return "bg-purple-100 text-purple-800 border-purple-200";
    case "Premium": return "bg-amber-100 text-amber-800 border-amber-200";
    default: return "bg-muted text-muted-foreground";
  }
};