import { CantonConfig } from '@/components/canton/CantonTemplate';

export const bernConfig: CantonConfig = {
  name: "Bern",
  code: "BE",
  slug: "bern",
  heroTitle: "Umzugsfirmen in Bern vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen in der Bundesstadt. Kostenlos Offerten vergleichen und bis zu 40% sparen.",
  
  companies: [
    {
      id: "be-1",
      name: "Berner Umzüge AG",
      rating: 4.9,
      reviewCount: 356,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      description: "Traditionsunternehmen in der Bundesstadt",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "be-2",
      name: "Aare Moving",
      rating: 4.8,
      reviewCount: 278,
      priceLevel: "günstig",
      services: ["Privatumzug", "Studentenumzug"],
      description: "Günstige Umzüge für Studierende",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "be-3",
      name: "Hauptstadt Transporte",
      rating: 4.7,
      reviewCount: 234,
      priceLevel: "premium",
      services: ["Firmenumzug", "Behördenumzug"],
      description: "Spezialisiert auf Bundesverwaltung",
      logo: "/placeholder.svg"
    },
    {
      id: "be-4",
      name: "Bern Express Umzug",
      rating: 4.6,
      reviewCount: 189,
      priceLevel: "fair",
      services: ["Expressumzug", "Möbellift"],
      description: "Schnelle Umzüge in der Altstadt",
      logo: "/placeholder.svg"
    },
    {
      id: "be-5",
      name: "Oberland Movers",
      rating: 4.8,
      reviewCount: 156,
      priceLevel: "fair",
      services: ["Bergumzug", "Chaletumzug"],
      description: "Experten für Berner Oberland",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 500 - 800", details: "Ideal für Singles" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 1'000 - 1'600", details: "Für Familien" },
    { size: "5-Zimmer Haus", priceRange: "CHF 2'200 - 3'500", details: "Kompletter Hausumzug" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Firmenumzug", icon: "Building2", link: "/firmenumzug" },
    { name: "Reinigung", icon: "Sparkles", link: "/reinigung" },
    { name: "Entsorgung", icon: "Trash2", link: "/entsorgung" },
    { name: "Möbellift", icon: "ArrowUpFromLine", link: "/moebellift" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "UNESCO Altstadt", description: "Erfahrung mit engen Altstadtgassen", icon: "Building" },
    { title: "Uni & Fachhochschulen", description: "Studentenrabatte verfügbar", icon: "GraduationCap" },
    { title: "Bundesstadt", description: "Behörden- und Diplomatenumzüge", icon: "Landmark" },
    { title: "Berner Oberland", description: "Umzüge ins Berggebiet", icon: "Mountain" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Bern?",
      answer: "Ein Umzug in Bern kostet je nach Wohnungsgrösse zwischen CHF 500 und CHF 3'500. Die Altstadt ist aufgrund enger Gassen etwas teurer."
    },
    {
      question: "Gibt es spezielle Regelungen für die Berner Altstadt?",
      answer: "Ja, in der UNESCO-geschützten Altstadt gelten besondere Zufahrtszeiten. Umzüge sind meist nur morgens zwischen 7-10 Uhr erlaubt."
    },
    {
      question: "Bieten Berner Firmen auch Umzüge ins Oberland an?",
      answer: "Ja, viele Berner Umzugsfirmen sind auf Bergumzüge spezialisiert und verfügen über geeignete Fahrzeuge für Chalets."
    },
    {
      question: "Wie melde ich mich in Bern an?",
      answer: "Die Anmeldung erfolgt beim Einwohnerdienst der Stadt Bern innerhalb von 14 Tagen. Online-Anmeldung ist über eUmzug möglich."
    },
    {
      question: "Wann ist die beste Umzugszeit in Bern?",
      answer: "Ausserhalb der Uni-Semesterzeiten (Februar/März und August/September) sind die Preise günstiger und mehr Termine verfügbar."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Bern</h3>
    <p>Der Kanton Bern ist der zweitgrösste Kanton der Schweiz und erstreckt sich vom Mittelland bis ins Hochgebirge des Berner Oberlandes.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung beim Einwohnerdienst muss innerhalb von 14 Tagen erfolgen. In der Stadt Bern ist die Online-Anmeldung über eUmzug möglich.</p>
    
    <h4>Besonderheiten Altstadt</h4>
    <p>Die UNESCO-Welterbe Altstadt erfordert spezielle Planung. Zufahrtszeiten sind beschränkt und Möbellifte oft notwendig.</p>
    
    <h4>Beliebte Wohngebiete</h4>
    <p>Kirchenfeld, Länggasse, Breitenrain und Bümpliz sind beliebte Stadtquartiere. Im Umland sind Thun, Biel und Burgdorf gefragte Wohnorte.</p>
  `,
  
  metaTitle: "Umzugsfirmen Bern vergleichen | Bis 40% sparen | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie kostenlos die besten Umzugsfirmen in Bern. Erhalten Sie bis zu 5 unverbindliche Offerten und sparen Sie bis zu 40% bei Ihrem Umzug."
};
