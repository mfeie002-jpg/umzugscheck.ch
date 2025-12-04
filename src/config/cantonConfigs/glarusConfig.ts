import { CantonConfig } from '@/components/canton/CantonTemplate';

export const glarusConfig: CantonConfig = {
  name: "Glarus",
  code: "GL",
  slug: "glarus",
  heroTitle: "Umzugsfirmen in Glarus vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen im Glarnerland. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "gl-1",
      name: "Glarner Umzüge AG",
      rating: 4.7,
      reviewCount: 67,
      priceLevel: "fair",
      services: ["Privatumzug", "Bergumzug", "Reinigung"],
      description: "Traditionsunternehmen im Glarnerland",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "gl-2",
      name: "Linth Transport",
      rating: 4.6,
      reviewCount: 54,
      priceLevel: "günstig",
      services: ["Privatumzug", "Firmenumzug"],
      description: "Günstige Umzüge im Linthgebiet",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "gl-3",
      name: "Braunwald Moving",
      rating: 4.8,
      reviewCount: 45,
      priceLevel: "premium",
      services: ["Chaletumzug", "Seilbahn-Transport"],
      description: "Spezialist autofreies Braunwald",
      logo: "/placeholder.svg"
    },
    {
      id: "gl-4",
      name: "Näfels Express",
      rating: 4.5,
      reviewCount: 34,
      priceLevel: "fair",
      services: ["Privatumzug", "Expressumzug"],
      description: "Schnelle Umzüge in der Region",
      logo: "/placeholder.svg"
    },
    {
      id: "gl-5",
      name: "Elm Bergumzüge",
      rating: 4.6,
      reviewCount: 28,
      priceLevel: "fair",
      services: ["Bergumzug", "Chaletumzug"],
      description: "Erfahrung mit Bergdörfern",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 400 - 650", details: "Sehr günstig" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 800 - 1'300", details: "Standard" },
    { size: "Chalet Braunwald", priceRange: "CHF 1'800 - 3'000", details: "Seilbahn-Transport" }
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
    { title: "Flat Rate Tax", description: "Einheitlicher Steuerfuss", icon: "Percent" },
    { title: "Braunwald", description: "Autofreier Ferienort", icon: "Snowflake" },
    { title: "Landsgemeinde", description: "Direkte Demokratie", icon: "Users" },
    { title: "Günstig wohnen", description: "Tiefe Mietpreise", icon: "Wallet" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Glarus?",
      answer: "Ein Umzug in Glarus kostet CHF 400 - 3'000 - einer der günstigsten Kantone für Umzüge."
    },
    {
      question: "Wie funktioniert ein Umzug nach Braunwald?",
      answer: "Braunwald ist autofrei. Güter werden per Standseilbahn transportiert. Spezialfirmen koordinieren dies."
    },
    {
      question: "Was ist die Glarner Flat Rate Tax?",
      answer: "Glarus hat als erster Kanton eine Flat Rate Tax eingeführt - ein einheitlicher Steuersatz für alle."
    },
    {
      question: "Wie melde ich mich in Glarus an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle einer der drei Gemeinden innerhalb von 14 Tagen."
    },
    {
      question: "Gibt es nur drei Gemeinden?",
      answer: "Ja, Glarus hat 2011 die Gemeinden fusioniert: Glarus Nord, Glarus (Mitte) und Glarus Süd."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Glarus</h3>
    <p>Der Kanton Glarus ist ein kleiner Bergkanton mit nur drei Gemeinden und der traditionellen Landsgemeinde als Parlamentsform.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei einer der drei Gemeinden: Glarus Nord, Glarus oder Glarus Süd.</p>
    
    <h4>Gemeindereform</h4>
    <p>2011 wurden alle Gemeinden zu nur drei fusioniert - ein schweizweites Novum, das die Verwaltung vereinfacht.</p>
    
    <h4>Regionen</h4>
    <p>Glarus Nord (Näfels, Oberurnen), Glarus (Hauptort), Glarus Süd (Schwanden, Elm, Braunwald) mit dem autofreien Ferienort.</p>
  `,
  
  metaTitle: "Umzugsfirmen Glarus vergleichen | Günstig | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen im Kanton Glarus. Günstige Umzüge im Glarnerland. Bis zu 5 unverbindliche Offerten."
};
