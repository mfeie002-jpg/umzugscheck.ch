import { CantonConfig } from '@/components/canton/CantonTemplate';

export const graubuendenConfig: CantonConfig = {
  name: "Graubünden",
  code: "GR",
  slug: "graubuenden",
  heroTitle: "Umzugsfirmen in Graubünden vergleichen",
  heroSubtitle: "Finden Sie spezialisierte Umzugsunternehmen für Bergregionen. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "gr-1",
      name: "Bündner Umzüge AG",
      rating: 4.8,
      reviewCount: 187,
      priceLevel: "fair",
      services: ["Privatumzug", "Chaletumzug", "Bergumzug"],
      description: "Spezialisten für Alpenumzüge",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "gr-2",
      name: "Chur City Movers",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug"],
      description: "Umzüge in der ältesten Stadt der Schweiz",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "gr-3",
      name: "Engadin Transport",
      rating: 4.9,
      reviewCount: 134,
      priceLevel: "premium",
      services: ["Chaletumzug", "Kunsttransport", "Zweitwohnung"],
      description: "Premium-Service St. Moritz & Engadin",
      logo: "/placeholder.svg"
    },
    {
      id: "gr-4",
      name: "Davos Klosters Moving",
      rating: 4.6,
      reviewCount: 98,
      priceLevel: "premium",
      services: ["Chaletumzug", "Saisonumzug"],
      description: "Erfahrung mit Feriendomizilen",
      logo: "/placeholder.svg"
    },
    {
      id: "gr-5",
      name: "Alpin Umzüge GR",
      rating: 4.7,
      reviewCount: 87,
      priceLevel: "fair",
      services: ["Bergumzug", "Seniorenumzug"],
      description: "Schwierige Zugänge kein Problem",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 600 - 1'000", details: "Bergzuschlag möglich" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 1'200 - 2'000", details: "Standardumzug" },
    { size: "Chalet/Ferienhaus", priceRange: "CHF 2'500 - 5'000", details: "Spezialservice" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Chaletumzug", icon: "Mountain", link: "/chaletumzug" },
    { name: "Firmenumzug", icon: "Building2", link: "/firmenumzug" },
    { name: "Kunsttransport", icon: "Palette", link: "/kunsttransport" },
    { name: "Saisonumzug", icon: "Calendar", link: "/saisonumzug" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Alpen-Experten", description: "Spezialisiert auf Bergumzüge", icon: "Mountain" },
    { title: "Feriendomizile", description: "Chalet- und Zweitwohnungs-Umzüge", icon: "Home" },
    { title: "150 Täler", description: "Kenntnis aller Regionen", icon: "MapPin" },
    { title: "Mehrsprachig", description: "DE, IT, RM Service", icon: "Languages" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Graubünden?",
      answer: "Umzüge in Graubünden kosten CHF 600 - 5'000. Bergumzüge und abgelegene Chalets sind teurer aufgrund schwieriger Zugänge."
    },
    {
      question: "Gibt es Spezialisten für Chaletumzüge?",
      answer: "Ja, mehrere Bündner Firmen sind auf Umzüge in Berggebiete wie Engadin, Davos oder Lenzerheide spezialisiert."
    },
    {
      question: "Wie funktioniert ein Umzug nach St. Moritz?",
      answer: "Umzüge ins Engadin erfordern spezielle Planung wegen Passübergängen und saisonaler Einschränkungen."
    },
    {
      question: "Bieten Firmen auch Zweitwohnungs-Umzüge an?",
      answer: "Ja, viele Firmen sind auf saisonale Umzüge für Ferienwohnungen spezialisiert."
    },
    {
      question: "Was ist bei Umzügen im Winter zu beachten?",
      answer: "Winterumzüge erfordern wetterfeste Planung. Pässe können gesperrt sein, Schneeketten sind oft nötig."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Graubünden</h3>
    <p>Graubünden ist der grösste und dünnstbesiedelte Kanton der Schweiz mit über 150 Tälern und drei Amtssprachen (Deutsch, Italienisch, Rätoromanisch).</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde. In vielen Bergdörfern ist persönliches Erscheinen erforderlich.</p>
    
    <h4>Besondere Herausforderungen</h4>
    <p>Umzüge in Berggebiete erfordern spezielles Equipment und Erfahrung. Enge Strassen, steile Zufahrten und Wetterabhängigkeit sind typisch.</p>
    
    <h4>Beliebte Regionen</h4>
    <p>Chur (Hauptstadt), Engadin (St. Moritz, Pontresina), Davos/Klosters, Lenzerheide, Arosa und das Prättigau sind die Hauptregionen.</p>
  `,
  
  metaTitle: "Umzugsfirmen Graubünden vergleichen | Alpen-Experten | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie spezialisierte Umzugsfirmen in Graubünden. Experten für Chalet- und Bergumzüge. Bis zu 5 unverbindliche Offerten."
};
