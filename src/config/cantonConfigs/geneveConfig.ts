import { CantonConfig } from '@/components/canton/CantonTemplate';

export const geneveConfig: CantonConfig = {
  name: "Genève",
  code: "GE",
  slug: "geneve",
  heroTitle: "Entreprises de déménagement à Genève",
  heroSubtitle: "Trouvez les meilleures entreprises de déménagement dans la cité internationale. Comparez gratuitement.",
  
  companies: [
    {
      id: "ge-1",
      name: "Genève Déménagements SA",
      rating: 4.9,
      reviewCount: 312,
      priceLevel: "premium",
      services: ["Déménagement privé", "International", "Diplomatic"],
      description: "Leader du déménagement à Genève",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ge-2",
      name: "UN Relocation Services",
      rating: 4.8,
      reviewCount: 267,
      priceLevel: "premium",
      services: ["Diplomatic", "Expat", "International"],
      description: "Spécialisé organisations internationales",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ge-3",
      name: "Léman Moving Geneva",
      rating: 4.7,
      reviewCount: 198,
      priceLevel: "fair",
      services: ["Déménagement privé", "France voisine"],
      description: "Service transfrontalier France-Suisse",
      logo: "/placeholder.svg"
    },
    {
      id: "ge-4",
      name: "Carouge Express",
      rating: 4.6,
      reviewCount: 156,
      priceLevel: "fair",
      services: ["Déménagement privé", "Nettoyage"],
      description: "Service rapide et efficace",
      logo: "/placeholder.svg"
    },
    {
      id: "ge-5",
      name: "Eaux-Vives Movers",
      rating: 4.7,
      reviewCount: 123,
      priceLevel: "fair",
      services: ["Déménagement privé", "Monte-meubles"],
      description: "Experts de la rive gauche",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "Studio", priceRange: "CHF 700 - 1'100", details: "Prix élevés" },
    { size: "3 pièces", priceRange: "CHF 1'400 - 2'200", details: "Standard Genève" },
    { size: "Villa", priceRange: "CHF 3'000 - 5'500", details: "Service premium" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: "Home", link: "/privatumzug" },
    { name: "International", icon: "Globe", link: "/international" },
    { name: "Entreprise", icon: "Building2", link: "/firmenumzug" },
    { name: "Nettoyage", icon: "Sparkles", link: "/reinigung" },
    { name: "Monte-meubles", icon: "ArrowUpFromLine", link: "/moebellift" },
    { name: "Stockage", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Cité internationale", description: "ONU, OMS, CERN, OMC", icon: "Globe" },
    { title: "Multilingue", description: "FR, EN, DE, ES, +", icon: "Languages" },
    { title: "France voisine", description: "Transfrontalier Annemasse, Annecy", icon: "MapPin" },
    { title: "Expats", description: "Service relocation complet", icon: "Plane" }
  ],
  
  faqs: [
    {
      question: "Combien coûte un déménagement à Genève?",
      answer: "Un déménagement à Genève coûte entre CHF 700 et CHF 5'500 - les prix les plus élevés de Suisse en raison de la demande."
    },
    {
      question: "Y a-t-il des entreprises pour les diplomates?",
      answer: "Oui, plusieurs entreprises sont spécialisées dans les déménagements diplomatiques avec procédures douanières."
    },
    {
      question: "Peut-on déménager vers la France voisine?",
      answer: "Oui, de nombreuses entreprises offrent des services transfrontaliers vers Annemasse, Ferney, Gex et Annecy."
    },
    {
      question: "Comment s'inscrire à Genève?",
      answer: "L'inscription à l'Office cantonal de la population doit être effectuée dans les 14 jours suivant l'arrivée."
    },
    {
      question: "Faut-il une autorisation de stationnement?",
      answer: "Oui, à Genève une autorisation de voirie est nécessaire. Elle doit être demandée à l'avance auprès de la commune."
    }
  ],
  
  localInfo: `
    <h3>Déménager dans le canton de Genève</h3>
    <p>Le canton de Genève est le plus international de Suisse, abritant de nombreuses organisations internationales et une population très diverse.</p>
    
    <h4>Inscription</h4>
    <p>L'inscription à l'Office cantonal de la population et des migrations (OCPM) doit être effectuée dans les 14 jours.</p>
    
    <h4>Marché immobilier</h4>
    <p>Genève a l'un des marchés immobiliers les plus tendus de Suisse. Beaucoup de résidents vivent en France voisine.</p>
    
    <h4>Quartiers populaires</h4>
    <p>Eaux-Vives, Champel, Carouge, Plainpalais et Cologny sont très demandés. Les communes de la rive droite offrent plus d'espace.</p>
  `,
  
  metaTitle: "Entreprises de déménagement Genève | International | Umzugscheck.ch",
  metaDescription: "Comparez les meilleures entreprises de déménagement à Genève. Service international et diplomatique. Jusqu'à 5 offres sans engagement."
};
