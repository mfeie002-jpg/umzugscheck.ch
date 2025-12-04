import { CantonConfig } from '@/components/canton/CantonTemplate';

export const neuchatelConfig: CantonConfig = {
  name: "Neuchâtel",
  code: "NE",
  slug: "neuchatel",
  heroTitle: "Entreprises de déménagement à Neuchâtel",
  heroSubtitle: "Trouvez les meilleures entreprises de déménagement dans le canton horloger. Comparez gratuitement.",
  
  companies: [
    {
      id: "ne-1",
      name: "Neuchâtel Déménagements SA",
      rating: 4.8,
      reviewCount: 156,
      priceLevel: "fair",
      services: ["Déménagement privé", "Entreprise", "Nettoyage"],
      description: "Leader du déménagement à Neuchâtel",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ne-2",
      name: "La Chaux-de-Fonds Moving",
      rating: 4.7,
      reviewCount: 123,
      priceLevel: "fair",
      services: ["Déménagement privé", "Industrie"],
      description: "Spécialiste des Montagnes neuchâteloises",
      isSponsored: true,
      logo: "/placeholder.svg"
    },
    {
      id: "ne-3",
      name: "Lac de Neuchâtel Transport",
      rating: 4.6,
      reviewCount: 98,
      priceLevel: "günstig",
      services: ["Déménagement privé", "Stockage"],
      description: "Service au bord du lac",
      logo: "/placeholder.svg"
    },
    {
      id: "ne-4",
      name: "Val-de-Travers Movers",
      rating: 4.5,
      reviewCount: 67,
      priceLevel: "günstig",
      services: ["Déménagement privé", "Campagne"],
      description: "Région de l'absinthe",
      logo: "/placeholder.svg"
    },
    {
      id: "ne-5",
      name: "UniNE Student Movers",
      rating: 4.6,
      reviewCount: 56,
      priceLevel: "günstig",
      services: ["Déménagement étudiant", "Petit budget"],
      description: "Tarifs étudiants avantageux",
      logo: "/placeholder.svg"
    }
  ],
  
  priceExamples: [
    { size: "Studio", priceRange: "CHF 450 - 700", details: "Économique" },
    { size: "3 pièces", priceRange: "CHF 900 - 1'400", details: "Standard" },
    { size: "5+ pièces", priceRange: "CHF 1'800 - 2'800", details: "Famille" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: "Home", link: "/privatumzug" },
    { name: "Entreprise", icon: "Building2", link: "/firmenumzug" },
    { name: "Nettoyage", icon: "Sparkles", link: "/reinigung" },
    { name: "Débarras", icon: "Trash2", link: "/entsorgung" },
    { name: "Monte-meubles", icon: "ArrowUpFromLine", link: "/moebellift" },
    { name: "Stockage", icon: "Package", link: "/lagerung" }
  ],
  
  usps: [
    { title: "Horlogerie", description: "Berceau de l'horlogerie suisse", icon: "Watch" },
    { title: "Université", description: "Tarifs étudiants", icon: "GraduationCap" },
    { title: "Lac", description: "Plus grand lac entièrement suisse", icon: "Waves" },
    { title: "Absinthe", description: "Val-de-Travers historique", icon: "Wine" }
  ],
  
  faqs: [
    {
      question: "Combien coûte un déménagement à Neuchâtel?",
      answer: "Un déménagement à Neuchâtel coûte entre CHF 450 et CHF 2'800 - prix moyens pour la Romandie."
    },
    {
      question: "Y a-t-il des réductions pour les étudiants?",
      answer: "Oui, plusieurs entreprises offrent des tarifs réduits pour les étudiants de l'Université de Neuchâtel."
    },
    {
      question: "Les prix sont-ils différents dans les Montagnes?",
      answer: "La Chaux-de-Fonds et Le Locle peuvent avoir des suppléments en hiver en raison des conditions météorologiques."
    },
    {
      question: "Comment s'inscrire à Neuchâtel?",
      answer: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant le déménagement."
    },
    {
      question: "Pourquoi La Chaux-de-Fonds est-elle spéciale?",
      answer: "La Chaux-de-Fonds est classée au patrimoine mondial de l'UNESCO pour son urbanisme horloger unique."
    }
  ],
  
  localInfo: `
    <h3>Déménager dans le canton de Neuchâtel</h3>
    <p>Le canton de Neuchâtel est le berceau de l'horlogerie suisse, avec une riche histoire industrielle et le plus grand lac entièrement suisse.</p>
    
    <h4>Inscription</h4>
    <p>L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant l'arrivée.</p>
    
    <h4>Deux régions</h4>
    <p>Le Littoral (Neuchâtel, Boudry) et les Montagnes (La Chaux-de-Fonds, Le Locle) ont des caractères très différents.</p>
    
    <h4>Villes principales</h4>
    <p>Neuchâtel (chef-lieu), La Chaux-de-Fonds (plus grande ville), Le Locle, Val-de-Travers et Boudry.</p>
  `,
  
  metaTitle: "Entreprises de déménagement Neuchâtel | Horlogerie | Umzugscheck.ch",
  metaDescription: "Comparez les meilleures entreprises de déménagement à Neuchâtel. Canton horloger. Jusqu'à 5 offres sans engagement."
};
