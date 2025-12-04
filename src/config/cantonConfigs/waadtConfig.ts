import { CantonConfig } from '@/components/canton/CantonTemplate';

export const waadtConfig: CantonConfig = {
  name: "Waadt",
  code: "VD",
  slug: "waadt",
  heroTitle: "Entreprises de déménagement dans le canton de Vaud",
  heroSubtitle: "Trouvez les meilleures entreprises de déménagement dans le canton de Vaud. Comparez les offres gratuitement.",
  
  companies: [
    {
      id: "vd-1",
      name: "Lausanne Déménagements SA",
      rating: 4.9,
      reviewCount: 312,
      priceLevel: "fair",
      services: ["Déménagement privé", "Déménagement entreprise"],
      description: "Leader du déménagement à Lausanne",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "vd-2",
      name: "Léman Moving",
      rating: 4.8,
      reviewCount: 267,
      priceLevel: "premium",
      services: ["Déménagement international", "Stockage"],
      description: "Spécialisé dans les déménagements internationaux",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "vd-3",
      name: "Riviera Transports",
      rating: 4.7,
      reviewCount: 198,
      priceLevel: "fair",
      services: ["Déménagement privé", "Nettoyage"],
      description: "Service de qualité sur la Riviera",
      logo: "/placeholder.svg"
    },
    {
      id: "vd-4",
      name: "EPFL Student Movers",
      rating: 4.6,
      reviewCount: 156,
      priceLevel: "günstig",
      services: ["Déménagement étudiant", "Petit déménagement"],
      description: "Prix étudiants avantageux",
      logo: "/placeholder.svg"
    },
    {
      id: "vd-5",
      name: "Vaudois Express",
      rating: 4.7,
      reviewCount: 134,
      priceLevel: "fair",
      services: ["Déménagement express", "Week-end"],
      description: "Déménagements rapides et efficaces",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "Studio/1 pièce", priceRange: "CHF 550 - 850", details: "Idéal pour étudiants" },
    { size: "3 pièces", priceRange: "CHF 1'100 - 1'700", details: "Pour familles" },
    { size: "Villa 5+ pièces", priceRange: "CHF 2'400 - 4'000", details: "Service complet" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: "Home", link: "/privatumzug" },
    { name: "Déménagement entreprise", icon: "Building2", link: "/firmenumzug" },
    { name: "Nettoyage", icon: "Sparkles", link: "/reinigung" },
    { name: "Débarras", icon: "Trash2", link: "/entsorgung" },
    { name: "Monte-meubles", icon: "ArrowUpFromLine", link: "/moebellift" },
    { name: "Stockage", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Lac Léman", description: "Experts de la région lémanique", icon: "Waves" },
    { title: "EPFL & UNIL", description: "Tarifs étudiants disponibles", icon: "GraduationCap" },
    { title: "Multilingue", description: "Service en FR, DE, EN", icon: "Languages" },
    { title: "Riviera", description: "De Lausanne à Montreux", icon: "Mountain" }
  ],
  
  faqs: [
    {
      question: "Combien coûte un déménagement dans le canton de Vaud?",
      answer: "Un déménagement dans le canton de Vaud coûte entre CHF 550 et CHF 4'000 selon la taille et la distance."
    },
    {
      question: "Y a-t-il des réductions pour les étudiants EPFL/UNIL?",
      answer: "Oui, plusieurs entreprises offrent des tarifs réduits pour les étudiants avec carte d'étudiant valide."
    },
    {
      question: "Les entreprises vaudoises déménagent-elles aussi en Valais?",
      answer: "Oui, de nombreuses entreprises couvrent toute la Romandie, y compris le Valais et Genève."
    },
    {
      question: "Comment s'inscrire à Lausanne?",
      answer: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant le déménagement."
    },
    {
      question: "Quelle est la meilleure période pour déménager?",
      answer: "Évitez septembre (rentrée universitaire) et fin de mois. Les prix sont plus bas en hiver."
    }
  ],
  
  localInfo: `
    <h3>Déménager dans le canton de Vaud</h3>
    <p>Le canton de Vaud est le troisième plus grand canton de Suisse, avec Lausanne comme capitale et un paysage varié du Lac Léman aux Alpes.</p>
    
    <h4>Inscription et formalités</h4>
    <p>L'inscription au contrôle des habitants doit être effectuée dans les 14 jours. À Lausanne, vous pouvez le faire en ligne via eAnnonce.</p>
    
    <h4>Particularités régionales</h4>
    <p>La Riviera vaudoise (Vevey, Montreux) et les communes du bord du lac sont très prisées mais aussi plus chères.</p>
    
    <h4>Zones populaires</h4>
    <p>Lausanne-Centre, Pully, Morges, Nyon et Yverdon sont les villes les plus demandées. Les vignobles du Lavaux offrent un cadre unique.</p>
  `,
  
  metaTitle: "Entreprises de déménagement Vaud | Comparez | Umzugscheck.ch",
  metaDescription: "Comparez gratuitement les meilleures entreprises de déménagement dans le canton de Vaud. Jusqu'à 5 offres sans engagement."
};
