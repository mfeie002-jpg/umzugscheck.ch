import { CantonConfig } from '@/components/canton/CantonTemplate';

export const wallisConfig: CantonConfig = {
  name: "Wallis",
  code: "VS",
  slug: "wallis",
  heroTitle: "Umzugsfirmen im Wallis vergleichen",
  heroSubtitle: "Finden Sie spezialisierte Umzugsunternehmen im Rhonetal und den Walliser Alpen. Kostenlos vergleichen.",
  
  companies: [
    {
      id: "vs-1",
      name: "Valais Déménagements",
      rating: 4.8,
      reviewCount: 198,
      priceLevel: "fair",
      services: ["Déménagement privé", "Chalet", "Nettoyage"],
      description: "Leader du déménagement en Valais",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "vs-2",
      name: "Zermatt Moving Services",
      rating: 4.9,
      reviewCount: 156,
      priceLevel: "premium",
      services: ["Chaletumzug", "Elektromobil-Transport"],
      description: "Spezialist für autofreies Zermatt",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "vs-3",
      name: "Sion Transport SA",
      rating: 4.7,
      reviewCount: 134,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug"],
      description: "Umzüge in der Hauptstadt",
      logo: "/placeholder.svg"
    },
    {
      id: "vs-4",
      name: "Oberwallis Umzüge",
      rating: 4.6,
      reviewCount: 112,
      priceLevel: "fair",
      services: ["Privatumzug", "Bergumzug"],
      description: "Deutschsprachiger Service",
      logo: "/placeholder.svg"
    },
    {
      id: "vs-5",
      name: "Verbier Relocation",
      rating: 4.8,
      reviewCount: 89,
      priceLevel: "premium",
      services: ["Chaletumzug", "International"],
      description: "Premium-Service für Feriendomizile",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 550 - 900", details: "Talumzug" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 1'100 - 1'800", details: "Standard" },
    { size: "Chalet Bergstation", priceRange: "CHF 2'500 - 6'000", details: "Speziallogistik" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Chaletumzug", icon: "Mountain", link: "/chaletumzug" },
    { name: "Nettoyage", icon: "Sparkles", link: "/reinigung" },
    { name: "Débarras", icon: "Trash2", link: "/entsorgung" },
    { name: "Stockage", icon: "Package", link: "/lagerung" },
    { name: "International", icon: "Globe", link: "/international" }
  ],
  
  usps: [
    { title: "Matterhorn-Region", description: "Zermatt-Spezialisten (autofrei)", icon: "Mountain" },
    { title: "Zweisprachig", description: "Service DE & FR", icon: "Languages" },
    { title: "Skigebiete", description: "Verbier, Crans-Montana, Saas-Fee", icon: "Snowflake" },
    { title: "Weinregion", description: "Kenntnis der Rebdörfer", icon: "Wine" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug im Wallis?",
      answer: "Ein Umzug im Wallis kostet CHF 550 - 6'000. Bergstationen wie Zermatt oder Saas-Fee sind aufgrund Speziallogistik teurer."
    },
    {
      question: "Wie funktioniert ein Umzug nach Zermatt?",
      answer: "Zermatt ist autofrei. Güter werden per Bahn transportiert und vor Ort mit Elektrofahrzeugen verteilt. Spezialfirmen sind notwendig."
    },
    {
      question: "Gibt es zweisprachige Umzugsfirmen?",
      answer: "Ja, die meisten Walliser Firmen bieten Service auf Deutsch und Französisch an."
    },
    {
      question: "Wann ist die beste Zeit für Chaletumzüge?",
      answer: "Frühling (April-Mai) und Herbst (September-Oktober) zwischen den Saisons sind ideal."
    },
    {
      question: "Wo melde ich mich im Wallis an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Wallis</h3>
    <p>Das Wallis ist der drittgrösste Kanton der Schweiz und erstreckt sich entlang des Rhonetals von den höchsten Alpengipfeln bis zu den Rebbergen.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Gemeindeverwaltung. Im Oberwallis auf Deutsch, im Unterwallis auf Französisch.</p>
    
    <h4>Besondere Herausforderungen</h4>
    <p>Autofreie Orte (Zermatt, Saas-Fee), steile Bergstrassen und saisonale Zugänglichkeit erfordern spezialisierte Umzugsfirmen.</p>
    
    <h4>Beliebte Regionen</h4>
    <p>Sion (Hauptstadt), Sierre, Brig, Visp im Tal. Zermatt, Verbier, Crans-Montana, Saas-Fee und Leukerbad in den Bergen.</p>
  `,
  
  metaTitle: "Umzugsfirmen Wallis vergleichen | Berg-Spezialisten | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie spezialisierte Umzugsfirmen im Wallis. Experten für Zermatt, Verbier und Bergumzüge. Bis zu 5 Offerten."
};
