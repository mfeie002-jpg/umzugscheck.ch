import { CantonConfig } from '@/components/canton/CantonTemplate';

export const uriConfig: CantonConfig = {
  name: "Uri",
  code: "UR",
  slug: "uri",
  heroTitle: "Umzugsfirmen in Uri vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen im Gotthardkanton. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "ur-1",
      name: "Urner Umzüge AG",
      rating: 4.7,
      reviewCount: 87,
      priceLevel: "fair",
      services: ["Privatumzug", "Bergumzug", "Reinigung"],
      description: "Familienunternehmen seit 1960",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ur-2",
      name: "Gotthard Transport",
      rating: 4.6,
      reviewCount: 67,
      priceLevel: "fair",
      services: ["Privatumzug", "Transitumzug"],
      description: "Erfahrung mit Passumzügen",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ur-3",
      name: "Altdorf Movers",
      rating: 4.5,
      reviewCount: 54,
      priceLevel: "günstig",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Persönlicher Service im Hauptort",
      logo: "/placeholder.svg"
    },
    {
      id: "ur-4",
      name: "Tell Umzüge",
      rating: 4.6,
      reviewCount: 45,
      priceLevel: "fair",
      services: ["Privatumzug", "Möbellift"],
      description: "Zuverlässig wie Wilhelm Tell",
      logo: "/placeholder.svg"
    },
    {
      id: "ur-5",
      name: "Reuss-Tal Transport",
      rating: 4.4,
      reviewCount: 38,
      priceLevel: "günstig",
      services: ["Privatumzug", "Kleinumzug"],
      description: "Günstige Umzüge im Reusstal",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 450 - 700", details: "Günstige Region" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 900 - 1'400", details: "Standard" },
    { size: "5-Zimmer Haus", priceRange: "CHF 1'800 - 2'800", details: "Familienumzug" }
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
    { title: "Gotthard", description: "Tor zum Süden", icon: "Mountain" },
    { title: "Urkanton", description: "Wiege der Schweiz", icon: "Flag" },
    { title: "Reusstal", description: "Malerische Talumzüge", icon: "TreePine" },
    { title: "Günstig", description: "Tiefere Lebenskosten", icon: "Wallet" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Uri?",
      answer: "Ein Umzug in Uri kostet CHF 450 - 2'800 - einer der günstigsten Kantone der Zentralschweiz."
    },
    {
      question: "Gibt es Umzugsfirmen für Bergdörfer?",
      answer: "Ja, Urner Firmen sind auf Umzüge in abgelegene Berggemeinden spezialisiert."
    },
    {
      question: "Wie ist die Erreichbarkeit?",
      answer: "Uri ist über die A2 (Gotthard) und die Gotthardbahn gut erreichbar. Die Neue Eisenbahn-Alpentransversale (NEAT) verkürzt Reisezeiten."
    },
    {
      question: "Wo melde ich mich in Uri an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen."
    },
    {
      question: "Ist Wilhelm Tell aus Uri?",
      answer: "Ja, der Legende nach stammt Wilhelm Tell aus Bürglen bei Altdorf - daher der Name mancher Umzugsfirma."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Uri</h3>
    <p>Der Kanton Uri ist einer der vier Waldstätte und Urkantone der Schweiz am Fuss des Gotthards.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen.</p>
    
    <h4>Gotthard-Kanton</h4>
    <p>Uri ist das Tor zum Süden. Der Kanton profitiert vom Gotthard-Basistunnel und liegt zentral auf der Nord-Süd-Achse.</p>
    
    <h4>Gemeinden</h4>
    <p>Altdorf (Hauptort), Erstfeld, Schattdorf, Bürglen und Flüelen sind die grössten Gemeinden. Die Bergdörfer bieten günstige Wohnlagen.</p>
  `,
  
  metaTitle: "Umzugsfirmen Uri vergleichen | Günstig | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen im Kanton Uri. Günstige Preise im Gotthardkanton. Bis zu 5 unverbindliche Offerten."
};
