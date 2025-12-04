import { CantonConfig } from '@/components/canton/CantonTemplate';

export const obwaldenConfig: CantonConfig = {
  name: "Obwalden",
  code: "OW",
  slug: "obwalden",
  heroTitle: "Umzugsfirmen in Obwalden vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen am Sarnersee. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "ow-1",
      name: "Obwaldner Umzüge",
      rating: 4.7,
      reviewCount: 78,
      priceLevel: "fair",
      services: ["Privatumzug", "Bergumzug", "Reinigung"],
      description: "Regionalführer seit 1975",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ow-2",
      name: "Sarnen Transport",
      rating: 4.6,
      reviewCount: 56,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug"],
      description: "Zuverlässig im Hauptort",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ow-3",
      name: "Engelberg Movers",
      rating: 4.8,
      reviewCount: 67,
      priceLevel: "premium",
      services: ["Chaletumzug", "Ferienhaus"],
      description: "Spezialist für Titlis-Region",
      logo: "/placeholder.svg"
    },
    {
      id: "ow-4",
      name: "Kernser Umzüge",
      rating: 4.5,
      reviewCount: 45,
      priceLevel: "günstig",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Familienbetrieb im Kernsertal",
      logo: "/placeholder.svg"
    },
    {
      id: "ow-5",
      name: "Pilatus Transport OW",
      rating: 4.6,
      reviewCount: 34,
      priceLevel: "fair",
      services: ["Privatumzug", "Möbellift"],
      description: "Umzüge mit Bergblick",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 450 - 700", details: "Günstig" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 900 - 1'400", details: "Standard" },
    { size: "Chalet Engelberg", priceRange: "CHF 2'000 - 3'500", details: "Bergumzug" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Chaletumzug", icon: "Mountain", link: "/chaletumzug" },
    { name: "Reinigung", icon: "Sparkles", link: "/reinigung" },
    { name: "Entsorgung", icon: "Trash2", link: "/entsorgung" },
    { name: "Möbellift", icon: "ArrowUpFromLine", link: "/moebellift" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Tiefe Steuern", description: "Attraktiver Steuerfuss", icon: "Percent" },
    { title: "Engelberg", description: "Ferienort Titlis-Region", icon: "Snowflake" },
    { title: "Sarnersee", description: "Idyllische Seelage", icon: "Waves" },
    { title: "Pilatus", description: "Berge vor der Haustür", icon: "Mountain" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Obwalden?",
      answer: "Ein Umzug in Obwalden kostet CHF 450 - 3'500. Chaletumzüge in Engelberg sind aufgrund der Lage teurer."
    },
    {
      question: "Gibt es Firmen für Umzüge nach Engelberg?",
      answer: "Ja, spezialisierte Firmen bieten Chaletumzüge in den Ferienort an, inkl. Seilbahn-Koordination wenn nötig."
    },
    {
      question: "Warum ist Obwalden bei Zuzügern beliebt?",
      answer: "Obwalden bietet tiefe Steuern, schöne Natur und gute Anbindung an Luzern und Zürich."
    },
    {
      question: "Wie melde ich mich an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen."
    },
    {
      question: "Wie ist die Verkehrsanbindung?",
      answer: "Obwalden ist via A8 (Brünig) und Zentralbahn gut erreichbar. Nach Luzern sind es ca. 20 Minuten."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Obwalden</h3>
    <p>Der Halbkanton Obwalden liegt in der Zentralschweiz am Sarnersee und ist einer der steuergünstigsten Kantone der Schweiz.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen.</p>
    
    <h4>Steuerparadies</h4>
    <p>Obwalden hat eine der tiefsten Steuerbelastungen der Schweiz, was den Kanton für Zuzüger attraktiv macht.</p>
    
    <h4>Gemeinden</h4>
    <p>Sarnen (Hauptort), Kerns, Sachseln, Alpnach, Giswil, Lungern und Engelberg sind die sieben Gemeinden.</p>
  `,
  
  metaTitle: "Umzugsfirmen Obwalden vergleichen | Tiefe Steuern | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen in Obwalden. Tiefe Steuern, schöne Natur. Bis zu 5 unverbindliche Offerten."
};
