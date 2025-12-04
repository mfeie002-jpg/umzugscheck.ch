import { CantonConfig } from '@/components/canton/CantonTemplate';

export const fribourgConfig: CantonConfig = {
  name: "Fribourg",
  code: "FR",
  slug: "fribourg",
  heroTitle: "Entreprises de déménagement à Fribourg",
  heroSubtitle: "Trouvez les meilleures entreprises de déménagement dans le canton bilingue. Comparez gratuitement.",
  
  companies: [
    {
      id: "fr-1",
      name: "Fribourg Déménagements SA",
      rating: 4.8,
      reviewCount: 187,
      priceLevel: "fair",
      services: ["Déménagement privé", "Entreprise", "Nettoyage"],
      description: "Leader du déménagement à Fribourg",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "fr-2",
      name: "Freiburger Umzüge",
      rating: 4.7,
      reviewCount: 156,
      priceLevel: "fair",
      services: ["Privatumzug", "Studentenumzug"],
      description: "Zweisprachiger Service DE/FR",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "fr-3",
      name: "Bulle Transport",
      rating: 4.6,
      reviewCount: 123,
      priceLevel: "günstig",
      services: ["Déménagement privé", "Gruyère"],
      description: "Spécialiste de la Gruyère",
      logo: "/placeholder.svg"
    },
    {
      id: "fr-4",
      name: "Uni Movers Fribourg",
      rating: 4.7,
      reviewCount: 112,
      priceLevel: "günstig",
      services: ["Studentenumzug", "WG-Umzug"],
      description: "Günstig für Studierende",
      logo: "/placeholder.svg"
    },
    {
      id: "fr-5",
      name: "Sense-Umzüge",
      rating: 4.5,
      reviewCount: 89,
      priceLevel: "fair",
      services: ["Privatumzug", "Seniorenumzug"],
      description: "Sensebezirk & Deutschfreiburg",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "Studio/1-Zimmer", priceRange: "CHF 450 - 700", details: "Studentenfreundlich" },
    { size: "3-Zimmer/3 pièces", priceRange: "CHF 900 - 1'400", details: "Standard" },
    { size: "5-Zimmer/5 pièces", priceRange: "CHF 1'800 - 2'800", details: "Familienumzug" }
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
    { title: "Bilingue", description: "Service DE & FR", icon: "Languages" },
    { title: "Université", description: "Tarifs étudiants", icon: "GraduationCap" },
    { title: "Gruyère", description: "Umzüge in die Voralpen", icon: "Mountain" },
    { title: "Mittellage", description: "Zwischen Bern & Lausanne", icon: "MapPin" }
  ],
  
  faqs: [
    {
      question: "Was kostet ein Umzug in Freiburg?",
      answer: "Ein Umzug in Freiburg kostet CHF 450 - 2'800 - günstiger als Bern oder Lausanne, mit vielen Studentenangeboten."
    },
    {
      question: "Gibt es zweisprachige Umzugsfirmen?",
      answer: "Ja, die meisten Freiburger Firmen bieten Service auf Deutsch und Französisch an."
    },
    {
      question: "Sind Umzüge in die Gruyère teurer?",
      answer: "Umzüge in die Voralpen-Region sind etwas teurer wegen längerer Distanzen und bergigem Terrain."
    },
    {
      question: "Gibt es Studentenrabatte?",
      answer: "Ja, viele Firmen bieten Sondertarife für Studierende der Universität Freiburg."
    },
    {
      question: "Wie melde ich mich an?",
      answer: "Die Anmeldung erfolgt beim Einwohneramt innerhalb von 14 Tagen nach dem Umzug."
    }
  ],
  
  localInfo: `
    <h3>Umziehen im Kanton Freiburg</h3>
    <p>Der Kanton Freiburg ist der einzige offiziell zweisprachige Kanton der Schweiz (Französisch und Deutsch) und liegt zwischen Bern und Lausanne.</p>
    
    <h4>An- und Abmeldung</h4>
    <p>Die Anmeldung erfolgt bei der Einwohnerkontrolle. In der Stadt Freiburg auf Französisch, im Sensebezirk auf Deutsch.</p>
    
    <h4>Universitätsstadt</h4>
    <p>Freiburg ist eine wichtige Universitätsstadt. Viele Umzugsfirmen haben spezielle Angebote für Studierende.</p>
    
    <h4>Beliebte Regionen</h4>
    <p>Stadt Freiburg, Bulle (Gruyère), Murten/Morat, Düdingen und der Sensebezirk sind die Hauptregionen.</p>
  `,
  
  metaTitle: "Umzugsfirmen Freiburg vergleichen | Bilingue | Umzugscheck.ch",
  metaDescription: "Vergleichen Sie die besten Umzugsfirmen in Freiburg. Zweisprachiger Service DE/FR. Bis zu 5 unverbindliche Offerten."
};
