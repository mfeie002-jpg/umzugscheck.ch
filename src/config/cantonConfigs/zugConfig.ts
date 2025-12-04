import { CantonConfig } from '@/components/canton/CantonTemplate';

export const zugConfig: CantonConfig = {
  name: "Zug",
  code: "ZG",
  slug: "zug",
  heroTitle: "Umzugsfirmen in Zug vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen im wohlhabenden Kanton Zug. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "zg-1",
      name: "Zug Premium Movers",
      rating: 4.9,
      reviewCount: 234,
      priceLevel: "premium",
      services: ["Privatumzug", "Firmenumzug", "Kunsttransport"],
      description: "Premium-Service für anspruchsvolle Kunden",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "zg-2",
      name: "Crypto Valley Moving",
      rating: 4.8,
      reviewCount: 187,
      priceLevel: "premium",
      services: ["Firmenumzug", "IT-Transport", "Tresor"],
      description: "Spezialisiert auf Tech-Unternehmen",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "zg-3",
      name: "Zuger Umzüge",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "fair",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Familienunternehmen seit 1985",
      logo: "/placeholder.svg"
    },
    {
      id: "zg-4",
      name: "See-Umzüge Zug",
      rating: 4.6,
      reviewCount: 134,
      priceLevel: "fair",
      services: ["Privatumzug", "Möbellift"],
      description: "Umzüge rund um den Zugersee",
      logo: "/placeholder.svg"
    },
    {
      id: "zg-5",
      name: "International Relocation Zug",
      rating: 4.8,
      reviewCount: 98,
      priceLevel: "premium",
      services: ["Internationaler Umzug", "Expat-Service"],
      description: "Expat-Umzüge weltweit",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 700 - 1'000", details: "Premium-Qualität" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 1'400 - 2'200", details: "Full-Service" },
    { size: "5-Zimmer Villa", priceRange: "CHF 3'000 - 5'000", details: "White-Glove-Service" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Firmenumzug", icon: "Building2", link: "/firmenumzug" },
    { name: "International", icon: "Globe", link: "/international" },
    { name: "Kunsttransport", icon: "Palette", link: "/kunsttransport" },
    { name: "Tresor-Transport", icon: "Lock", link: "/tresortransport" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Crypto Valley", description: "Spezialisiert auf Tech-Startups", icon: "Cpu" },
    { title: "Tiefe Steuern", description: "Viele Expat-Umzüge", icon: "Percent" },
    { title: "Premium-Service", description: "White-Glove-Behandlung", icon: "Crown" },
    { title: "Zugersee", description: "Seeanstösser-Expertise", icon: "Waves" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Zug?",
      answer: "Umzüge in Zug sind tendenziell hochpreisiger (CHF 700 - 5'000) aufgrund der Premium-Ansprüche und internationalen Klientel."
    },
    {
      question: "Gibt es Umzugsfirmen für internationale Expats?",
      answer: "Ja, Zug hat viele auf Expat-Relocation spezialisierte Firmen mit mehrsprachigem Service und weltweitem Netzwerk."
    },
    {
      question: "Wie funktioniert ein Firmenumzug im Crypto Valley?",
      answer: "Spezialisierte Firmen bieten IT-Equipment-Transport, sichere Datenhandhabung und Wochenend-Umzüge für Startups."
    },
    {
      question: "Brauche ich spezielle Versicherung für wertvolle Güter?",
      answer: "Ja, bei Kunstwerken, Antiquitäten oder Tresoren empfehlen wir eine erweiterte Transportversicherung."
    },
    {
      question: "Wann muss ich mich in Zug anmelden?",
      answer: "Die Anmeldung bei der Einwohnerkontrolle muss innerhalb von 14 Tagen nach dem Umzug erfolgen."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Zug</h3>
    <p>Der Kanton Zug ist bekannt für tiefe Steuern und das Crypto Valley - ein Hotspot für Blockchain-Unternehmen und internationale Firmen.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle innerhalb von 14 Tagen. Expats benötigen zusätzliche Dokumente.</p>
    
    <h4>Internationale Community</h4>
    <p>Zug hat einen hohen Anteil internationaler Einwohner. Viele Umzugsfirmen bieten mehrsprachigen Service und Expat-Pakete.</p>
    
    <h4>Beliebte Wohnlagen</h4>
    <p>Die Stadt Zug, Baar, Cham und die Seeanliegergemeinden sind besonders gefragt. Villenlagen am Zugersee gehören zu den teuersten der Schweiz.</p>
  `,
  
  metaTitle: "Umzugsfirmen Zug vergleichen | Premium-Service | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen in Zug. Premium-Service für Expats und Unternehmen. Bis zu 5 unverbindliche Offerten."
};
