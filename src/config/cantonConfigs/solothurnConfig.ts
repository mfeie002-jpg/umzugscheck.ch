import { CantonConfig } from '@/components/canton/CantonTemplate';

export const solothurnConfig: CantonConfig = {
  name: "Solothurn",
  code: "SO",
  slug: "solothurn",
  heroTitle: "Umzugsfirmen in Solothurn vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen in der schönsten Barockstadt. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "so-1",
      name: "Solothurner Umzüge",
      rating: 4.8,
      reviewCount: 167,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      description: "Traditionsunternehmen in der Barockstadt",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "so-2",
      name: "Aare Transport SO",
      rating: 4.7,
      reviewCount: 134,
      priceLevel: "günstig",
      services: ["Privatumzug", "Studentenumzug"],
      description: "Günstige Umzüge entlang der Aare",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "so-3",
      name: "Olten Movers",
      rating: 4.6,
      reviewCount: 112,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug"],
      description: "Zentral im Mittelland",
      logo: "/placeholder.svg"
    },
    {
      id: "so-4",
      name: "Grenchen Express",
      rating: 4.5,
      reviewCount: 89,
      priceLevel: "fair",
      services: ["Expressumzug", "Möbellift"],
      description: "Schnelle Umzüge in der Uhrenstadt",
      logo: "/placeholder.svg"
    },
    {
      id: "so-5",
      name: "Jura-Südfuss Umzüge",
      rating: 4.7,
      reviewCount: 78,
      priceLevel: "günstig",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Regional verwurzelt",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 450 - 700", details: "Günstig" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 900 - 1'400", details: "Standard" },
    { size: "5-Zimmer Haus", priceRange: "CHF 1'800 - 2'800", details: "Komplett" }
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
    { title: "Barockstadt", description: "Erfahrung mit Altstadt-Umzügen", icon: "Building" },
    { title: "Verkehrsknotenpunkt", description: "Olten: Zentrum der Schweiz", icon: "Train" },
    { title: "Uhrenindustrie", description: "Grenchen & Biel-Region", icon: "Watch" },
    { title: "Mittelland", description: "Zentrale Lage, gute Preise", icon: "MapPin" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Solothurn?",
      answer: "Ein Umzug in Solothurn kostet zwischen CHF 450 und CHF 2'800 - günstiger als in den Grossstädten."
    },
    {
      question: "Gibt es besondere Regelungen für die Altstadt Solothurn?",
      answer: "Ja, in der barocken Altstadt gelten Zufahrtsbeschränkungen. Möbellifte sind oft notwendig."
    },
    {
      question: "Bieten Solothurner Firmen auch Umzüge nach Bern/Zürich?",
      answer: "Ja, dank der zentralen Lage sind Umzüge in beide Richtungen problemlos möglich."
    },
    {
      question: "Wie melde ich mich in Solothurn an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle innerhalb von 14 Tagen nach dem Umzug."
    },
    {
      question: "Sind die Preise in Olten anders als in Solothurn?",
      answer: "Die Preise sind ähnlich. In Olten gibt es aufgrund der zentralen Lage mehr Anbieterauswahl."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Solothurn</h3>
    <p>Der Kanton Solothurn liegt im Schweizer Mittelland und ist bekannt für seine barocke Hauptstadt und die Uhrenindustrie.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen.</p>
    
    <h4>Verkehrslage</h4>
    <p>Olten ist der wichtigste Eisenbahnknotenpunkt der Schweiz. Dies macht den Kanton zu einem beliebten Pendlerstandort.</p>
    
    <h4>Beliebte Wohnorte</h4>
    <p>Die Stadt Solothurn, Olten, Grenchen, Zuchwil und Dornach/Arlesheim sind die grössten Orte. Die Altstadt Solothurn ist UNESCO-Kandidat.</p>
  `,
  
  metaTitle: "Umzugsfirmen Solothurn vergleichen | Günstig | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie kostenlos die besten Umzugsfirmen in Solothurn. Faire Preise im Mittelland. Bis zu 5 unverbindliche Offerten."
};
