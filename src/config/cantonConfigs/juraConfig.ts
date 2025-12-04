import { CantonConfig } from '@/components/canton/CantonTemplate';

export const juraConfig: CantonConfig = {
  name: "Jura",
  code: "JU",
  slug: "jura",
  heroTitle: "Entreprises de déménagement dans le Jura",
  heroSubtitle: "Trouvez les meilleures entreprises de déménagement dans le plus jeune canton suisse. Comparez gratuitement.",
  
  companies: [
    {
      id: "ju-1",
      name: "Jura Déménagements SA",
      rating: 4.7,
      reviewCount: 98,
      priceLevel: "fair",
      services: ["Déménagement privé", "Entreprise", "Nettoyage"],
      description: "Leader du déménagement dans le Jura",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ju-2",
      name: "Delémont Moving",
      rating: 4.6,
      reviewCount: 78,
      priceLevel: "günstig",
      services: ["Déménagement privé", "Petit budget"],
      description: "Service économique au chef-lieu",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ju-3",
      name: "Porrentruy Transport",
      rating: 4.5,
      reviewCount: 56,
      priceLevel: "günstig",
      services: ["Déménagement privé", "France"],
      description: "Proche de la frontière française",
      logo: "/placeholder.svg"
    },
    {
      id: "ju-4",
      name: "Franches-Montagnes Movers",
      rating: 4.7,
      reviewCount: 45,
      priceLevel: "fair",
      services: ["Déménagement campagne", "Ferme"],
      description: "Spécialiste région équestre",
      logo: "/placeholder.svg"
    },
    {
      id: "ju-5",
      name: "Ajoie Express",
      rating: 4.4,
      reviewCount: 34,
      priceLevel: "günstig",
      services: ["Déménagement privé", "Express"],
      description: "Rapide et efficace en Ajoie",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "Studio", priceRange: "CHF 400 - 650", details: "Très économique" },
    { size: "3 pièces", priceRange: "CHF 800 - 1'300", details: "Standard" },
    { size: "Ferme", priceRange: "CHF 1'800 - 3'000", details: "Spécialisé" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: "Home", link: "/privatumzug" },
    { name: "Entreprise", icon: "Building2", link: "/firmenumzug" },
    { name: "France", icon: "Globe", link: "/international" },
    { name: "Nettoyage", icon: "Sparkles", link: "/reinigung" },
    { name: "Débarras", icon: "Trash2", link: "/entsorgung" },
    { name: "Stockage", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Plus jeune canton", description: "Fondé en 1979", icon: "Flag" },
    { title: "Franches-Montagnes", description: "Paradis équestre", icon: "Sparkles" },
    { title: "Proche France", description: "Transfrontalier facile", icon: "Globe" },
    { title: "Prix bas", description: "Coût de vie avantageux", icon: "Wallet" }
  ],
  
  faqs: [
    {
      question: "Combien coûte un déménagement dans le Jura?",
      answer: "Un déménagement dans le Jura coûte entre CHF 400 et CHF 3'000 - l'un des cantons les plus économiques."
    },
    {
      question: "Y a-t-il des entreprises pour déménager en France?",
      answer: "Oui, la proximité de la frontière française facilite les déménagements transfrontaliers."
    },
    {
      question: "Le Jura est-il bien desservi?",
      answer: "Le Jura est accessible par l'A16 (Transjurane) et les CFF via Delémont."
    },
    {
      question: "Comment s'inscrire dans le Jura?",
      answer: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant l'arrivée."
    },
    {
      question: "Pourquoi le Jura est-il le plus jeune canton?",
      answer: "Le canton du Jura a été créé en 1979 suite à sa séparation du canton de Berne par votation populaire."
    }
  ],
  
  localInfo: `
    <h3>Déménager dans le canton du Jura</h3>
    <p>Le canton du Jura est le plus jeune canton suisse, créé en 1979. Il offre un cadre de vie paisible avec un coût de vie avantageux.</p>
    
    <h4>Inscription</h4>
    <p>L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant l'arrivée.</p>
    
    <h4>Trois districts</h4>
    <p>Delémont (chef-lieu), Porrentruy (Ajoie) et les Franches-Montagnes (Saignelégier) forment les trois districts.</p>
    
    <h4>Régions</h4>
    <p>L'Ajoie, les Franches-Montagnes (célèbres pour les chevaux) et la vallée de Delémont offrent des cadres très différents.</p>
  `,
  
  metaTitle: "Entreprises de déménagement Jura | Économique | Umzugscheck.ch",
  metaDescription: "Comparez les meilleures entreprises de déménagement dans le Jura. Prix économiques. Jusqu'à 5 offres sans engagement."
};
