import { CantonConfig } from '@/components/canton/CantonTemplate';

export const appenzellConfig: CantonConfig = {
  name: "Appenzell",
  code: "AI/AR",
  slug: "appenzell",
  heroTitle: "Umzugsfirmen in Appenzell vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen im Appenzellerland. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "ai-1",
      name: "Appenzeller Umzüge",
      rating: 4.7,
      reviewCount: 89,
      priceLevel: "fair",
      services: ["Privatumzug", "Bergumzug", "Reinigung"],
      description: "Traditionsunternehmen im Appenzellerland",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ai-2",
      name: "Herisau Transport",
      rating: 4.6,
      reviewCount: 67,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug"],
      description: "Grösste Gemeinde AR",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ai-3",
      name: "Säntis Moving",
      rating: 4.8,
      reviewCount: 56,
      priceLevel: "premium",
      services: ["Chaletumzug", "Berghütte"],
      description: "Spezialist Säntis-Region",
      logo: "/placeholder.svg"
    },
    {
      id: "ai-4",
      name: "Teufen Express",
      rating: 4.5,
      reviewCount: 45,
      priceLevel: "fair",
      services: ["Privatumzug", "Expressumzug"],
      description: "Schnelle Umzüge Teufen-Region",
      logo: "/placeholder.svg"
    },
    {
      id: "ai-5",
      name: "Innerrhoder Umzüge",
      rating: 4.6,
      reviewCount: 34,
      priceLevel: "fair",
      services: ["Privatumzug", "Tradition"],
      description: "Familienbetrieb Appenzell Innerrhoden",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 450 - 700", details: "Günstig" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 900 - 1'400", details: "Standard" },
    { size: "Bauernhaus", priceRange: "CHF 2'000 - 3'500", details: "Speziell" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Bergumzug", icon: "Mountain", link: "/bergumzug" },
    { name: "Reinigung", icon: "Sparkles", link: "/reinigung" },
    { name: "Entsorgung", icon: "Trash2", link: "/entsorgung" },
    { name: "Möbellift", icon: "ArrowUpFromLine", link: "/moebellift" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Tradition", description: "Landsgemeinde & Brauchtum", icon: "Flag" },
    { title: "Säntis", description: "Alpstein-Bergwelt", icon: "Mountain" },
    { title: "Zwei Halbkantone", description: "AR & AI", icon: "Users" },
    { title: "St. Gallen-Nähe", description: "Gute Anbindung", icon: "Train" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Appenzell?",
      answer: "Ein Umzug im Appenzellerland kostet CHF 450 - 3'500 - günstig mit ländlichem Charme."
    },
    {
      question: "Was ist der Unterschied zwischen AR und AI?",
      answer: "Appenzell Ausserrhoden (AR) ist reformiert und grösser, Innerrhoden (AI) ist katholisch und hat die Landsgemeinde."
    },
    {
      question: "Gibt es Firmen für Bauernhaus-Umzüge?",
      answer: "Ja, lokale Firmen kennen die traditionellen Appenzeller Häuser und ihre besonderen Anforderungen."
    },
    {
      question: "Wie melde ich mich in Appenzell an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen."
    },
    {
      question: "Ist das Appenzellerland gut erreichbar?",
      answer: "Ja, über die Appenzeller Bahnen und die A1 ist die Region gut an St. Gallen und Zürich angebunden."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Appenzellerland</h3>
    <p>Das Appenzellerland besteht aus zwei Halbkantonen: Appenzell Ausserrhoden (AR) und Appenzell Innerrhoden (AI), mit reicher Tradition und Brauchtum.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen.</p>
    
    <h4>Zwei Halbkantone</h4>
    <p>AR (Hauptort Herisau) und AI (Hauptort Appenzell) haben unterschiedliche Verwaltungen und Steuersätze.</p>
    
    <h4>Gemeinden</h4>
    <p>Herisau, Teufen, Speicher (AR) und Appenzell (AI) sind die Hauptorte. Die Bergregion Säntis/Alpstein bietet spektakuläre Lagen.</p>
  `,
  
  metaTitle: "Umzugsfirmen Appenzell vergleichen | Tradition | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen im Appenzellerland (AR/AI). Tradition trifft Service. Bis zu 5 unverbindliche Offerten."
};
