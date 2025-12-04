import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Globe, Sparkles, Trash2, Package, Flag, Wallet } from 'lucide-react';

export const juraConfig: CantonConfig = {
  name: "Jura",
  slug: "jura",
  tagline: "Déménagement économique – Le plus jeune canton",
  icon: Flag,
  iconColor: "text-red-700",
  cities: ["Delémont", "Porrentruy", "Saignelégier", "Courrendlin", "Bassecourt", "Courfaivre"],
  
  companies: [
    { name: "Jura Déménagements SA", rating: 4.7, reviews: 98, priceLevel: "fair", sponsored: true, available: true, badge: "Leader" },
    { name: "Delémont Moving", rating: 4.6, reviews: 78, priceLevel: "günstig", sponsored: true, available: true, badge: "Économique" },
    { name: "Porrentruy Transport", rating: 4.5, reviews: 56, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Franches-Montagnes Movers", rating: 4.7, reviews: 45, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Ajoie Express", rating: 4.4, reviews: 34, priceLevel: "günstig", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "Studio", range: "CHF 400 - 650", avg: "CHF 525" },
    { size: "3 pièces", range: "CHF 800 - 1'300", avg: "CHF 1'050" },
    { size: "Ferme", range: "CHF 1'800 - 3'000", avg: "CHF 2'400" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: Home, link: "/privatumzug" },
    { name: "Entreprise", icon: Building2, link: "/firmenumzug" },
    { name: "France", icon: Globe, link: "/international" },
    { name: "Nettoyage", icon: Sparkles, link: "/reinigung" },
    { name: "Débarras", icon: Trash2, link: "/entsorgung" },
    { name: "Stockage", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Plus jeune canton", desc: "Fondé en 1979", icon: Flag },
    { title: "Franches-Montagnes", desc: "Paradis équestre", icon: Sparkles },
    { title: "Proche France", desc: "Transfrontalier facile", icon: Globe },
    { title: "Prix bas", desc: "Coût de vie avantageux", icon: Wallet }
  ],
  
  faqs: [
    { question: "Combien coûte un déménagement dans le Jura?", answer: "Un déménagement dans le Jura coûte entre CHF 400 et CHF 3'000 - l'un des cantons les plus économiques." },
    { question: "Y a-t-il des entreprises pour déménager en France?", answer: "Oui, la proximité de la frontière française facilite les déménagements transfrontaliers." },
    { question: "Le Jura est-il bien desservi?", answer: "Le Jura est accessible par l'A16 (Transjurane) et les CFF via Delémont." },
    { question: "Comment s'inscrire dans le Jura?", answer: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant l'arrivée." },
    { question: "Pourquoi le Jura est-il le plus jeune canton?", answer: "Le canton du Jura a été créé en 1979 suite à sa séparation du canton de Berne par votation populaire." }
  ],
  
  seo: {
    title: "Entreprises de déménagement Jura | Économique | Umzugscheck.ch",
    description: "Comparez les meilleures entreprises de déménagement dans le Jura. Prix économiques. Jusqu'à 5 offres sans engagement.",
    keywords: "déménagement Jura, Umzug Jura, Delémont déménagement"
  },
  
  localInfo: {
    title: "Déménager dans le canton du Jura",
    paragraphs: [
      { text: "Le canton du Jura est le plus jeune canton suisse, créé en 1979. Il offre un cadre de vie paisible avec un coût de vie avantageux." },
      { title: "Inscription", text: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant l'arrivée." },
      { title: "Trois districts", text: "Delémont (chef-lieu), Porrentruy (Ajoie) et les Franches-Montagnes (Saignelégier) forment les trois districts." },
      { title: "Régions", text: "L'Ajoie, les Franches-Montagnes (célèbres pour les chevaux) et la vallée de Delémont offrent des cadres très différents." }
    ]
  },
  
  notificationCity: "Delémont",
  activeUsersBase: 4
};
