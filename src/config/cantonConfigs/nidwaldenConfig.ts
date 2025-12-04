import { CantonConfig } from '@/components/canton/CantonTemplate';

export const nidwaldenConfig: CantonConfig = {
  name: "Nidwalden",
  code: "NW",
  slug: "nidwalden",
  heroTitle: "Umzugsfirmen in Nidwalden vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen am Vierwaldstättersee. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "nw-1",
      name: "Nidwaldner Umzüge",
      rating: 4.8,
      reviewCount: 89,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      description: "Marktführer in Nidwalden",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "nw-2",
      name: "Stans Transport AG",
      rating: 4.7,
      reviewCount: 67,
      priceLevel: "fair",
      services: ["Privatumzug", "Möbellift"],
      description: "Zuverlässig im Hauptort",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "nw-3",
      name: "Bürgenstock Movers",
      rating: 4.9,
      reviewCount: 56,
      priceLevel: "premium",
      services: ["Villenumzug", "Kunsttransport"],
      description: "Premium-Service Bürgenstock",
      logo: "/placeholder.svg"
    },
    {
      id: "nw-4",
      name: "Hergiswil Express",
      rating: 4.6,
      reviewCount: 45,
      priceLevel: "fair",
      services: ["Privatumzug", "Expressumzug"],
      description: "Schnelle Umzüge am See",
      logo: "/placeholder.svg"
    },
    {
      id: "nw-5",
      name: "Stanserhorn Umzüge",
      rating: 4.5,
      reviewCount: 34,
      priceLevel: "günstig",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Persönlicher Familienservice",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 500 - 800", details: "Günstig" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 1'000 - 1'500", details: "Standard" },
    { size: "Villa Bürgenstock", priceRange: "CHF 3'000 - 5'000", details: "Premium" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Villenumzug", icon: "Crown", link: "/villenumzug" },
    { name: "Reinigung", icon: "Sparkles", link: "/reinigung" },
    { name: "Entsorgung", icon: "Trash2", link: "/entsorgung" },
    { name: "Kunsttransport", icon: "Palette", link: "/kunsttransport" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Tiefste Steuern", description: "Schweizweit tiefste Belastung", icon: "Percent" },
    { title: "Bürgenstock", description: "Luxusresort & Villen", icon: "Crown" },
    { title: "Vierwaldstättersee", description: "Traumhafte Seelage", icon: "Waves" },
    { title: "Nähe Luzern", description: "10 Min. zur Stadt", icon: "Train" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Nidwalden?",
      answer: "Ein Umzug in Nidwalden kostet CHF 500 - 5'000. Villenumzüge am Bürgenstock sind aufgrund der Exklusivität teurer."
    },
    {
      question: "Warum hat Nidwalden so tiefe Steuern?",
      answer: "Nidwalden hat bewusst auf Standortattraktivität gesetzt und bietet schweizweit eine der tiefsten Steuerbelastungen."
    },
    {
      question: "Gibt es Spezialisten für Bürgenstock?",
      answer: "Ja, einige Firmen sind auf Umzüge in die exklusive Bürgenstock-Region spezialisiert."
    },
    {
      question: "Wie melde ich mich in Nidwalden an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen."
    },
    {
      question: "Wie ist die Erreichbarkeit?",
      answer: "Nidwalden ist via A2 und Zentralbahn optimal erschlossen. Nach Luzern sind es nur 10-15 Minuten."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Nidwalden</h3>
    <p>Der Halbkanton Nidwalden am Vierwaldstättersee ist bekannt für seine traumhafte Lage und die schweizweit tiefsten Steuern.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen.</p>
    
    <h4>Steuerparadies Nr. 1</h4>
    <p>Nidwalden gilt als steuergünstigster Kanton der Schweiz und zieht entsprechend viele wohlhabende Zuzüger an.</p>
    
    <h4>Gemeinden</h4>
    <p>Stans (Hauptort), Hergiswil, Stansstad, Buochs, Ennetbürgen, Beckenried, Emmetten und weitere kleine Gemeinden.</p>
  `,
  
  metaTitle: "Umzugsfirmen Nidwalden vergleichen | Tiefste Steuern | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen in Nidwalden. Tiefste Steuern der Schweiz. Bis zu 5 unverbindliche Offerten."
};
