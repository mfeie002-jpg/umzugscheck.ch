import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Globe, ArrowUpFromLine, Package, Languages, MapPin, Plane } from 'lucide-react';

export const geneveConfig: CantonConfig = {
  name: "Genève",
  slug: "geneve",
  tagline: "Déménagement international – Cité des Nations",
  icon: Globe,
  iconColor: "text-blue-700",
  cities: ["Genève", "Carouge", "Vernier", "Lancy", "Meyrin", "Onex", "Thônex", "Chêne-Bougeries"],
  
  companies: [
    { name: "Genève Déménagements SA", rating: 4.9, reviews: 312, priceLevel: "premium", sponsored: true, available: true, badge: "International" },
    { name: "UN Relocation Services", rating: 4.8, reviews: 267, priceLevel: "premium", sponsored: true, available: true, badge: "Diplomatique" },
    { name: "Léman Moving Geneva", rating: 4.7, reviews: 198, priceLevel: "fair", sponsored: false, available: true, badge: "France voisine" },
    { name: "Carouge Express", rating: 4.6, reviews: 156, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Eaux-Vives Movers", rating: 4.7, reviews: 123, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "Studio", range: "CHF 700 - 1'100", avg: "CHF 900" },
    { size: "3 pièces", range: "CHF 1'400 - 2'200", avg: "CHF 1'800" },
    { size: "Villa", range: "CHF 3'000 - 5'500", avg: "CHF 4'250" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: Home, link: "/privatumzug" },
    { name: "International", icon: Globe, link: "/international" },
    { name: "Entreprise", icon: Building2, link: "/firmenumzug" },
    { name: "Nettoyage", icon: Sparkles, link: "/reinigung" },
    { name: "Monte-meubles", icon: ArrowUpFromLine, link: "/moebellift" },
    { name: "Stockage", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Cité internationale", desc: "ONU, OMS, CERN, OMC", icon: Globe },
    { title: "Multilingue", desc: "FR, EN, DE, ES, +", icon: Languages },
    { title: "France voisine", desc: "Transfrontalier Annemasse, Annecy", icon: MapPin },
    { title: "Expats", desc: "Service relocation complet", icon: Plane }
  ],
  
  faqs: [
    { question: "Combien coûte un déménagement à Genève?", answer: "Un déménagement à Genève coûte entre CHF 700 et CHF 5'500 - les prix les plus élevés de Suisse en raison de la demande." },
    { question: "Y a-t-il des entreprises pour les diplomates?", answer: "Oui, plusieurs entreprises sont spécialisées dans les déménagements diplomatiques avec procédures douanières." },
    { question: "Peut-on déménager vers la France voisine?", answer: "Oui, de nombreuses entreprises offrent des services transfrontaliers vers Annemasse, Ferney, Gex et Annecy." },
    { question: "Comment s'inscrire à Genève?", answer: "L'inscription à l'Office cantonal de la population doit être effectuée dans les 14 jours suivant l'arrivée." },
    { question: "Faut-il une autorisation de stationnement?", answer: "Oui, à Genève une autorisation de voirie est nécessaire. Elle doit être demandée à l'avance auprès de la commune." }
  ],
  
  seo: {
    title: "Entreprises de déménagement Genève | International | Umzugscheck.ch",
    description: "Comparez les meilleures entreprises de déménagement à Genève. Service international et diplomatique. Jusqu'à 5 offres sans engagement.",
    keywords: "déménagement Genève, moving Geneva, Umzug Genf international"
  },
  
  localInfo: {
    title: "Déménager dans le canton de Genève",
    paragraphs: [
      { text: "Le canton de Genève est le plus international de Suisse, abritant de nombreuses organisations internationales et une population très diverse." },
      { title: "Inscription", text: "L'inscription à l'Office cantonal de la population et des migrations (OCPM) doit être effectuée dans les 14 jours." },
      { title: "Marché immobilier", text: "Genève a l'un des marchés immobiliers les plus tendus de Suisse. Beaucoup de résidents vivent en France voisine." },
      { title: "Quartiers populaires", text: "Eaux-Vives, Champel, Carouge, Plainpalais et Cologny sont très demandés. Les communes de la rive droite offrent plus d'espace." }
    ]
  },
  
  notificationCity: "Genève",
  activeUsersBase: 22
};
