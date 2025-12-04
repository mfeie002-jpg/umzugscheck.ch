import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Waves, GraduationCap, Languages, Mountain } from 'lucide-react';

export const waadtConfig: CantonConfig = {
  name: "Waadt",
  slug: "waadt",
  tagline: "Déménagement au Lac Léman – EPFL & UNIL",
  icon: Waves,
  iconColor: "text-blue-600",
  cities: ["Lausanne", "Vevey", "Montreux", "Nyon", "Morges", "Yverdon", "Pully", "Renens"],
  
  companies: [
    { name: "Lausanne Déménagements SA", rating: 4.9, reviews: 312, priceLevel: "fair", sponsored: true, available: true, badge: "Leader" },
    { name: "Léman Moving", rating: 4.8, reviews: 267, priceLevel: "premium", sponsored: true, available: true, badge: "International" },
    { name: "Riviera Transports", rating: 4.7, reviews: 198, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "EPFL Student Movers", rating: 4.6, reviews: 156, priceLevel: "günstig", sponsored: false, available: true, badge: "Étudiants" },
    { name: "Vaudois Express", rating: 4.7, reviews: 134, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "Studio/1 pièce", range: "CHF 550 - 850", avg: "CHF 700" },
    { size: "3 pièces", range: "CHF 1'100 - 1'700", avg: "CHF 1'400" },
    { size: "Villa 5+ pièces", range: "CHF 2'400 - 4'000", avg: "CHF 3'200" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: Home, link: "/privatumzug" },
    { name: "Déménagement entreprise", icon: Building2, link: "/firmenumzug" },
    { name: "Nettoyage", icon: Sparkles, link: "/reinigung" },
    { name: "Débarras", icon: Trash2, link: "/entsorgung" },
    { name: "Monte-meubles", icon: ArrowUpFromLine, link: "/moebellift" },
    { name: "Stockage", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Lac Léman", desc: "Experts de la région lémanique", icon: Waves },
    { title: "EPFL & UNIL", desc: "Tarifs étudiants disponibles", icon: GraduationCap },
    { title: "Multilingue", desc: "Service en FR, DE, EN", icon: Languages },
    { title: "Riviera", desc: "De Lausanne à Montreux", icon: Mountain }
  ],
  
  faqs: [
    { question: "Combien coûte un déménagement dans le canton de Vaud?", answer: "Un déménagement dans le canton de Vaud coûte entre CHF 550 et CHF 4'000 selon la taille et la distance." },
    { question: "Y a-t-il des réductions pour les étudiants EPFL/UNIL?", answer: "Oui, plusieurs entreprises offrent des tarifs réduits pour les étudiants avec carte d'étudiant valide." },
    { question: "Les entreprises vaudoises déménagent-elles aussi en Valais?", answer: "Oui, de nombreuses entreprises couvrent toute la Romandie, y compris le Valais et Genève." },
    { question: "Comment s'inscrire à Lausanne?", answer: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant le déménagement." },
    { question: "Quelle est la meilleure période pour déménager?", answer: "Évitez septembre (rentrée universitaire) et fin de mois. Les prix sont plus bas en hiver." }
  ],
  
  seo: {
    title: "Entreprises de déménagement Vaud | Comparez | Umzugscheck.ch",
    description: "Comparez gratuitement les meilleures entreprises de déménagement dans le canton de Vaud. Jusqu'à 5 offres sans engagement.",
    keywords: "déménagement Vaud, Umzug Lausanne, déménagement Lausanne"
  },
  
  localInfo: {
    title: "Déménager dans le canton de Vaud",
    paragraphs: [
      { text: "Le canton de Vaud est le troisième plus grand canton de Suisse, avec Lausanne comme capitale et un paysage varié du Lac Léman aux Alpes." },
      { title: "Inscription et formalités", text: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours. À Lausanne, vous pouvez le faire en ligne via eAnnonce." },
      { title: "Particularités régionales", text: "La Riviera vaudoise (Vevey, Montreux) et les communes du bord du lac sont très prisées mais aussi plus chères." },
      { title: "Zones populaires", text: "Lausanne-Centre, Pully, Morges, Nyon et Yverdon sont les villes les plus demandées. Les vignobles du Lavaux offrent un cadre unique." }
    ]
  },
  
  notificationCity: "Lausanne",
  activeUsersBase: 18
};
