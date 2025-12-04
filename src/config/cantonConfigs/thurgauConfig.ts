import { CantonConfig } from '@/components/canton/CantonTemplate';

export const thurgauConfig: CantonConfig = {
  name: "Thurgau",
  code: "TG",
  slug: "thurgau",
  heroTitle: "Umzugsfirmen in Thurgau vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen im Apfelkanton. Kostenlos Offerten vergleichen und sparen.",
  
  companies: [
    {
      id: "tg-1",
      name: "Thurgauer Umzüge AG",
      rating: 4.8,
      reviewCount: 198,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      description: "Regionaler Marktführer seit 1990",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "tg-2",
      name: "Bodensee Movers",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "günstig",
      services: ["Privatumzug", "Grenzüberschreitend"],
      description: "Umzüge in der Bodenseeregion",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "tg-3",
      name: "Frauenfeld Express",
      rating: 4.6,
      reviewCount: 134,
      priceLevel: "fair",
      services: ["Expressumzug", "Möbellift"],
      description: "Schnelle Umzüge im Hauptort",
      logo: "/placeholder.svg"
    },
    {
      id: "tg-4",
      name: "Kreuzlingen Transport",
      rating: 4.7,
      reviewCount: 112,
      priceLevel: "fair",
      services: ["Privatumzug", "Deutschland-Umzug"],
      description: "Grenznahe Umzüge nach Konstanz",
      logo: "/placeholder.svg"
    },
    {
      id: "tg-5",
      name: "Obstland Umzüge",
      rating: 4.5,
      reviewCount: 89,
      priceLevel: "günstig",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Persönlicher Service auf dem Land",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 450 - 700", details: "Günstige Region" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 900 - 1'400", details: "Familienumzug" },
    { size: "5-Zimmer Haus", priceRange: "CHF 1'800 - 3'000", details: "Hausumzug" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Firmenumzug", icon: "Building2", link: "/firmenumzug" },
    { name: "Reinigung", icon: "Sparkles", link: "/reinigung" },
    { name: "Entsorgung", icon: "Trash2", link: "/entsorgung" },
    { name: "Deutschland", icon: "Globe", link: "/international" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Bodenseeregion", description: "Grenzüberschreitende Umzüge", icon: "Waves" },
    { title: "Ländlich", description: "Günstigere Preise als Städte", icon: "TreePine" },
    { title: "Obstbau-Region", description: "Erfahrung mit Bauernhöfen", icon: "Apple" },
    { title: "Nähe Zürich", description: "Pendler-Umzüge", icon: "Train" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug im Thurgau?",
      answer: "Ein Umzug im Thurgau kostet zwischen CHF 450 und CHF 3'000 - deutlich günstiger als in den Grossstädten."
    },
    {
      question: "Gibt es Firmen für Umzüge nach Deutschland?",
      answer: "Ja, viele Thurgauer Firmen bieten grenzüberschreitende Umzüge nach Konstanz und in den süddeutschen Raum an."
    },
    {
      question: "Wie lange dauert ein Umzug im Thurgau?",
      answer: "Aufgrund kurzer Distanzen und weniger Verkehr sind Umzüge oft in einem halben Tag erledigt."
    },
    {
      question: "Wo melde ich mich im Thurgau an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen."
    },
    {
      question: "Sind Wochenendumzüge im Thurgau möglich?",
      answer: "Ja, viele Firmen bieten Samstagsumzüge an. Sonntags sind Umzüge eingeschränkt möglich."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Thurgau</h3>
    <p>Der Kanton Thurgau, auch Apfelkanton genannt, liegt im Nordosten der Schweiz am Bodensee und ist bekannt für seine ländliche Idylle.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde. Online-Anmeldung ist in vielen Gemeinden möglich.</p>
    
    <h4>Grenzregion</h4>
    <p>Die Nähe zu Deutschland (Konstanz) macht grenzüberschreitende Umzüge zu einem häufigen Service.</p>
    
    <h4>Beliebte Wohnorte</h4>
    <p>Frauenfeld (Hauptort), Kreuzlingen, Arbon, Weinfelden und Amriswil sind die grössten Gemeinden. Die Seegemeinden sind besonders begehrt.</p>
  `,
  
  metaTitle: "Umzugsfirmen Thurgau vergleichen | Günstig | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie kostenlos die besten Umzugsfirmen im Thurgau. Günstige Preise in der Bodenseeregion. Bis zu 5 Offerten."
};
