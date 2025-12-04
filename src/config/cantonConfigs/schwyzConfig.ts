import { CantonConfig } from '@/components/canton/CantonTemplate';

export const schwyzConfig: CantonConfig = {
  name: "Schwyz",
  code: "SZ",
  slug: "schwyz",
  heroTitle: "Umzugsfirmen in Schwyz vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen im Urkanton. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "sz-1",
      name: "Schwyzer Umzüge AG",
      rating: 4.8,
      reviewCount: 156,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      description: "Traditionsunternehmen im Urkanton",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "sz-2",
      name: "Einsiedeln Transport",
      rating: 4.7,
      reviewCount: 123,
      priceLevel: "fair",
      services: ["Privatumzug", "Klosterumzug"],
      description: "Erfahrung mit historischen Gebäuden",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "sz-3",
      name: "March-Höfe Movers",
      rating: 4.6,
      reviewCount: 98,
      priceLevel: "günstig",
      services: ["Privatumzug", "Studentenumzug"],
      description: "Günstige Umzüge am Zürichsee",
      logo: "/placeholder.svg"
    },
    {
      id: "sz-4",
      name: "Mythen Umzüge",
      rating: 4.7,
      reviewCount: 87,
      priceLevel: "fair",
      services: ["Privatumzug", "Bergumzug"],
      description: "Umzüge in der Mythenregion",
      logo: "/placeholder.svg"
    },
    {
      id: "sz-5",
      name: "Küssnacht Express",
      rating: 4.5,
      reviewCount: 76,
      priceLevel: "fair",
      services: ["Expressumzug", "Möbellift"],
      description: "Schnelle Umzüge am Vierwaldstättersee",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 500 - 800", details: "Günstig" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 1'000 - 1'500", details: "Standard" },
    { size: "5-Zimmer Haus", priceRange: "CHF 2'000 - 3'200", details: "Familienumzug" }
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
    { title: "Urkanton", description: "Wiege der Eidgenossenschaft", icon: "Flag" },
    { title: "Tiefe Steuern", description: "Attraktiver Wohnkanton", icon: "Percent" },
    { title: "Zwei Seen", description: "Zürich- & Vierwaldstättersee", icon: "Waves" },
    { title: "Nähe Zürich", description: "Idealer Pendlerkanton", icon: "Train" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Schwyz?",
      answer: "Ein Umzug im Kanton Schwyz kostet CHF 500 - 3'200 - etwas günstiger als Zürich bei guter Erreichbarkeit."
    },
    {
      question: "Warum ziehen viele nach Schwyz?",
      answer: "Der Kanton Schwyz bietet tiefe Steuern, schöne Landschaft und gute Anbindung an Zürich."
    },
    {
      question: "Gibt es Umzugsfirmen für Bergregionen?",
      answer: "Ja, mehrere Firmen sind auf Umzüge in die Mythenregion und ins Muotathal spezialisiert."
    },
    {
      question: "Wie melde ich mich in Schwyz an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen."
    },
    {
      question: "Sind Umzüge nach Einsiedeln speziell?",
      answer: "Einsiedeln hat eine historische Altstadt. Zufahrtsbeschränkungen und enge Gassen erfordern Erfahrung."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Schwyz</h3>
    <p>Der Kanton Schwyz ist einer der vier Waldstätte und Urkantone der Schweiz. Er gab der Schweiz ihren Namen.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen.</p>
    
    <h4>Steuerparadies</h4>
    <p>Der Kanton Schwyz hat eine der tiefsten Steuerbelastungen der Schweiz, was ihn für Zuzüger attraktiv macht.</p>
    
    <h4>Beliebte Gemeinden</h4>
    <p>Freienbach (March), Schwyz (Hauptort), Einsiedeln, Küssnacht, Arth-Goldau und Lachen sind die grössten Gemeinden.</p>
  `,
  
  metaTitle: "Umzugsfirmen Schwyz vergleichen | Tiefe Steuern | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen im Kanton Schwyz. Urkanton mit tiefen Steuern. Bis zu 5 unverbindliche Offerten."
};
