import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Watch, GraduationCap, Waves, Wine } from 'lucide-react';

export const neuchatelConfig: CantonConfig = {
  name: "Neuchâtel",
  slug: "neuchatel",
  tagline: "Déménagement dans le canton horloger",
  icon: Watch,
  iconColor: "text-amber-600",
  cities: ["Neuchâtel", "La Chaux-de-Fonds", "Le Locle", "Val-de-Travers", "Boudry", "Peseux"],
  
  companies: [
    { name: "Neuchâtel Déménagements SA", rating: 4.8, reviews: 156, priceLevel: "fair", sponsored: true, available: true, badge: "Leader" },
    { name: "La Chaux-de-Fonds Moving", rating: 4.7, reviews: 123, priceLevel: "fair", sponsored: true, available: true, badge: "UNESCO" },
    { name: "Lac de Neuchâtel Transport", rating: 4.6, reviews: 98, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Val-de-Travers Movers", rating: 4.5, reviews: 67, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "UniNE Student Movers", rating: 4.6, reviews: 56, priceLevel: "günstig", sponsored: false, available: false, badge: "Étudiants" }
  ],
  
  priceExamples: [
    { size: "Studio", range: "CHF 450 - 700", avg: "CHF 575" },
    { size: "3 pièces", range: "CHF 900 - 1'400", avg: "CHF 1'150" },
    { size: "5+ pièces", range: "CHF 1'800 - 2'800", avg: "CHF 2'300" }
  ],
  
  services: [
    { name: "Déménagement privé", icon: Home, link: "/privatumzug" },
    { name: "Entreprise", icon: Building2, link: "/firmenumzug" },
    { name: "Nettoyage", icon: Sparkles, link: "/reinigung" },
    { name: "Débarras", icon: Trash2, link: "/entsorgung" },
    { name: "Monte-meubles", icon: ArrowUpFromLine, link: "/moebellift" },
    { name: "Stockage", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Horlogerie", desc: "Berceau de l'horlogerie suisse", icon: Watch },
    { title: "Université", desc: "Tarifs étudiants", icon: GraduationCap },
    { title: "Lac", desc: "Plus grand lac entièrement suisse", icon: Waves },
    { title: "Absinthe", desc: "Val-de-Travers historique", icon: Wine }
  ],
  
  faqs: [
    { question: "Combien coûte un déménagement à Neuchâtel?", answer: "Un déménagement à Neuchâtel coûte entre CHF 450 et CHF 2'800 - prix moyens pour la Romandie." },
    { question: "Y a-t-il des réductions pour les étudiants?", answer: "Oui, plusieurs entreprises offrent des tarifs réduits pour les étudiants de l'Université de Neuchâtel." },
    { question: "Les prix sont-ils différents dans les Montagnes?", answer: "La Chaux-de-Fonds et Le Locle peuvent avoir des suppléments en hiver en raison des conditions météorologiques." },
    { question: "Comment s'inscrire à Neuchâtel?", answer: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant le déménagement." },
    { question: "Pourquoi La Chaux-de-Fonds est-elle spéciale?", answer: "La Chaux-de-Fonds est classée au patrimoine mondial de l'UNESCO pour son urbanisme horloger unique." }
  ],
  
  seo: {
    title: "Entreprises de déménagement Neuchâtel | Horlogerie | Umzugscheck.ch",
    description: "Comparez les meilleures entreprises de déménagement à Neuchâtel. Canton horloger. Jusqu'à 5 offres sans engagement.",
    keywords: "déménagement Neuchâtel, Umzug Neuenburg, La Chaux-de-Fonds déménagement"
  },
  
  localInfo: {
    title: "Déménager dans le canton de Neuchâtel",
    paragraphs: [
      { text: "Le canton de Neuchâtel est le berceau de l'horlogerie suisse, avec une riche histoire industrielle et le plus grand lac entièrement suisse." },
      { title: "Inscription", text: "L'inscription au contrôle des habitants doit être effectuée dans les 14 jours suivant l'arrivée." },
      { title: "Deux régions", text: "Le Littoral (Neuchâtel, Boudry) et les Montagnes (La Chaux-de-Fonds, Le Locle) ont des caractères très différents." },
      { title: "Villes principales", text: "Neuchâtel (chef-lieu), La Chaux-de-Fonds (plus grande ville), Le Locle, Val-de-Travers et Boudry." }
    ]
  },
  
  notificationCity: "Neuchâtel",
  activeUsersBase: 8
};
