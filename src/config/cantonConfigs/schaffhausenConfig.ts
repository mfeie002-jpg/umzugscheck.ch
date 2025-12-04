import { CantonConfig } from '@/components/canton/CantonTemplate';

export const schaffhausenConfig: CantonConfig = {
  name: "Schaffhausen",
  code: "SH",
  slug: "schaffhausen",
  heroTitle: "Umzugsfirmen in Schaffhausen vergleichen",
  heroSubtitle: "Finden Sie die besten Umzugsunternehmen an der Rheinfall-Stadt. Kostenlos Offerten vergleichen.",
  
  companies: [
    {
      id: "sh-1",
      name: "Schaffhauser Umzüge AG",
      rating: 4.8,
      reviewCount: 123,
      priceLevel: "fair",
      services: ["Privatumzug", "Firmenumzug", "Reinigung"],
      description: "Regionalführer seit 1980",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "sh-2",
      name: "Rheinfall Transport",
      rating: 4.7,
      reviewCount: 98,
      priceLevel: "fair",
      services: ["Privatumzug", "Deutschland"],
      description: "Grenzüberschreitende Umzüge",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "sh-3",
      name: "Munot Movers",
      rating: 4.6,
      reviewCount: 76,
      priceLevel: "günstig",
      services: ["Privatumzug", "Studentenumzug"],
      description: "Günstige Umzüge in der Altstadt",
      logo: "/placeholder.svg"
    },
    {
      id: "sh-4",
      name: "Klettgau Umzüge",
      rating: 4.5,
      reviewCount: 54,
      priceLevel: "günstig",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Ländliche Region Klettgau",
      logo: "/placeholder.svg"
    },
    {
      id: "sh-5",
      name: "Stein am Rhein Transport",
      rating: 4.7,
      reviewCount: 45,
      priceLevel: "fair",
      services: ["Privatumzug", "Altstadt"],
      description: "Erfahrung mit historischen Bauten",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", priceRange: "CHF 450 - 700", details: "Günstig" },
    { size: "3-Zimmer Wohnung", priceRange: "CHF 900 - 1'400", details: "Standard" },
    { size: "5-Zimmer Haus", priceRange: "CHF 1'800 - 2'800", details: "Familienumzug" }
  ],
  
  services: [
    { name: "Privatumzug", icon: "Home", link: "/privatumzug" },
    { name: "Firmenumzug", icon: "Building2", link: "/firmenumzug" },
    { name: "Deutschland", icon: "Globe", link: "/international" },
    { name: "Reinigung", icon: "Sparkles", link: "/reinigung" },
    { name: "Entsorgung", icon: "Trash2", link: "/entsorgung" },
    { name: "Lagerung", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Rheinfall", description: "Europas grösster Wasserfall", icon: "Waves" },
    { title: "Deutschland-Nähe", description: "Grenzüberschreitende Umzüge", icon: "Globe" },
    { title: "Altstadt", description: "Historische Erker-Häuser", icon: "Building" },
    { title: "Wein-Region", description: "Schaffhauser Blauburgunder", icon: "Wine" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Schaffhausen?",
      answer: "Ein Umzug in Schaffhausen kostet CHF 450 - 2'800 - günstiger als die Grossstädte Zürich oder Basel."
    },
    {
      question: "Gibt es Firmen für Umzüge nach Deutschland?",
      answer: "Ja, viele Schaffhauser Firmen sind auf grenzüberschreitende Umzüge nach Süddeutschland spezialisiert."
    },
    {
      question: "Wie sind die Zufahrtsbedingungen in der Altstadt?",
      answer: "Die historische Altstadt hat enge Gassen. Zufahrtszeiten sind beschränkt, Möbellifte oft notwendig."
    },
    {
      question: "Wie melde ich mich in Schaffhausen an?",
      answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle innerhalb von 14 Tagen nach dem Umzug."
    },
    {
      question: "Ist Schaffhausen eine Exklave?",
      answer: "Teilweise - der Kanton hat mehrere Exklaven, die von deutschem Gebiet umschlossen sind."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Schaffhausen</h3>
    <p>Der Kanton Schaffhausen liegt im äussersten Norden der Schweiz und ist bekannt für den Rheinfall - Europas grössten Wasserfall.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen.</p>
    
    <h4>Grenzregion</h4>
    <p>Die Nähe zu Deutschland macht grenzüberschreitende Umzüge häufig. Viele Pendler wohnen hier und arbeiten in Zürich.</p>
    
    <h4>Gemeinden</h4>
    <p>Schaffhausen (Hauptstadt), Neuhausen am Rheinfall, Stein am Rhein, Thayngen und die Klettgau-Gemeinden.</p>
  `,
  
  metaTitle: "Umzugsfirmen Schaffhausen vergleichen | Rheinfall | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen in Schaffhausen. Grenzüberschreitende Umzüge. Bis zu 5 unverbindliche Offerten."
};
