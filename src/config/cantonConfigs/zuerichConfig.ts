import { CantonConfig } from '@/components/canton/CantonTemplate';

export const zuerichConfig: CantonConfig = {
  name: "Zürich",
  code: "ZH",
  slug: "zuerich",
  heroTitle: "Umzugsfirmen in Zürich vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen im Kanton Zürich. Kostenlos Offerten vergleichen und bis zu 40% sparen.",
  
  companies: [
    {
      id: "zh-1",
      name: "Zürich Umzüge AG",
      rating: 4.9,
      reviewCount: 487,
      priceLevel: "premium",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      description: "Premium Umzugsservice in der grössten Schweizer Stadt",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "zh-2",
      name: "Limmat Moving",
      rating: 4.8,
      reviewCount: 342,
      priceLevel: "fair",
      services: ["Privatumzug", "Möbellift", "Entsorgung"],
      description: "Zuverlässige Umzüge entlang der Limmat",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "zh-3",
      name: "City Movers Zürich",
      rating: 4.7,
      reviewCount: 298,
      priceLevel: "günstig",
      services: ["Privatumzug", "Studentenumzug"],
      description: "Günstige Umzüge in der Stadt Zürich",
      logo: "/placeholder.svg"
    },
    {
      id: "zh-4",
      name: "Zürcher Qualitätsumzüge",
      rating: 4.8,
      reviewCount: 256,
      priceLevel: "premium",
      services: ["Firmenumzug", "Kunsttransport", "Tresor"],
      description: "Spezialisiert auf hochwertige Umzüge",
      logo: "/placeholder.svg"
    },
    {
      id: "zh-5",
      name: "Express Umzug ZH",
      rating: 4.6,
      reviewCount: 189,
      priceLevel: "fair",
      services: ["Expressumzug", "Wochenendumzug"],
      description: "Schnelle Umzüge auch am Wochenende",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 600 - 900", details: "Ideal für Singles" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 1'200 - 1'800", details: "Für Familien" },
    { size: "5-Zimmer Haus", priceRange: "CHF 2'500 - 4'000", details: "Kompletter Hausumzug" }
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
    { title: "Finanzmetropole", description: "Spezialisierte Umzüge für Banking & Finance", icon: "TrendingUp" },
    { title: "Multikulti-Stadt", description: "Mehrsprachiger Service für internationale Kunden", icon: "Globe" },
    { title: "ETH & Uni Zürich", description: "Spezialangebote für Studierende und Akademiker", icon: "GraduationCap" },
    { title: "Stadtverkehr", description: "Erfahrung mit Parkplatzbewirtschaftung", icon: "Car" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Zürich?",
      answer: "Ein Umzug in Zürich kostet je nach Wohnungsgrösse zwischen CHF 600 und CHF 4'000. Die Stadt Zürich hat höhere Preise aufgrund von Parkgebühren und Verkehr."
    },
    {
      question: "Brauche ich eine Parkbewilligung für den Umzug?",
      answer: "Ja, in der Stadt Zürich benötigen Sie eine Halteverbot-Bewilligung. Diese kostet ca. CHF 80-150 und sollte 2 Wochen im Voraus beantragt werden."
    },
    {
      question: "Gibt es Umzugsfirmen für Firmenumzüge in Zürich?",
      answer: "Ja, viele Zürcher Umzugsfirmen sind auf Büroumzüge spezialisiert und bieten IT-Equipment-Transport sowie Wochenendumzüge an."
    },
    {
      question: "Wann ist die beste Zeit für einen Umzug in Zürich?",
      answer: "Die ruhigsten Zeiten sind Januar bis März. Ende Monat und Semesterende sind besonders gefragt und teurer."
    },
    {
      question: "Bieten Zürcher Umzugsfirmen auch Reinigung an?",
      answer: "Ja, die meisten Umzugsfirmen bieten Komplett-Pakete mit Endreinigung nach Zürcher Standard an."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Zürich</h3>
    <p>Der Kanton Zürich ist mit über 1.5 Millionen Einwohnern der bevölkerungsreichste Kanton der Schweiz. Die Stadt Zürich als Wirtschaftszentrum zieht jährlich tausende Neuzuzüger an.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung beim Einwohneramt muss innerhalb von 14 Tagen nach dem Umzug erfolgen. In der Stadt Zürich können Sie dies online über das eUmzug-Portal erledigen.</p>
    
    <h4>Parkierung und Verkehr</h4>
    <p>In den Stadtkreisen 1-8 ist eine Halteverbot-Bewilligung für Umzugsfahrzeuge obligatorisch. Planen Sie genügend Zeit für den Stadtverkehr ein, besonders während der Stosszeiten.</p>
    
    <h4>Beliebte Umzugsziele</h4>
    <p>Die beliebtesten Quartiere sind Seefeld, Wipkingen, Oerlikon und Altstetten. Ausserhalb der Stadt sind Winterthur, Uster und Dübendorf gefragte Wohnorte.</p>
  `,
  
  metaTitle: "Umzugsfirmen Zürich vergleichen | Bis 40% sparen | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie kostenlos die besten Umzugsfirmen in Zürich. Erhalten Sie bis zu 5 unverbindliche Offerten und sparen Sie bis zu 40% bei Ihrem Umzug."
};
