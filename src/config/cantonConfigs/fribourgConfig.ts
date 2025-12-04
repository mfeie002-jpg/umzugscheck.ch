import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Languages, GraduationCap, Mountain, MapPin } from 'lucide-react';

export const fribourgConfig: CantonConfig = {
  name: "Fribourg",
  slug: "fribourg",
  tagline: "Déménagement bilingue – Service DE & FR",
  icon: Languages,
  iconColor: "text-blue-600",
  cities: ["Fribourg", "Bulle", "Murten", "Düdingen", "Villars-sur-Glâne", "Marly", "Romont"],
  
  companies: [
    { name: "Fribourg Déménagements SA", rating: 4.8, reviews: 187, priceLevel: "fair", sponsored: true, available: true, badge: "Bilingue" },
    { name: "Freiburger Umzüge", rating: 4.7, reviews: 156, priceLevel: "fair", sponsored: true, available: true, badge: "DE/FR Service" },
    { name: "Bulle Transport", rating: 4.6, reviews: 123, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Uni Movers Fribourg", rating: 4.7, reviews: 112, priceLevel: "günstig", sponsored: false, available: true, badge: "Studentenrabatt" },
    { name: "Sense-Umzüge", rating: 4.5, reviews: 89, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "Studio/1-Zimmer", range: "CHF 450 - 700", avg: "CHF 575" },
    { size: "3-Zimmer/3 pièces", range: "CHF 900 - 1'400", avg: "CHF 1'150" },
    { size: "5-Zimmer/5 pièces", range: "CHF 1'800 - 2'800", avg: "CHF 2'300" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Firmenumzug", icon: Building2, link: "/firmenumzug" },
    { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
    { name: "Entsorgung", icon: Trash2, link: "/entsorgung" },
    { name: "Möbellift", icon: ArrowUpFromLine, link: "/moebellift" },
    { name: "Lagerung", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Bilingue", desc: "Service DE & FR", icon: Languages },
    { title: "Université", desc: "Tarifs étudiants", icon: GraduationCap },
    { title: "Gruyère", desc: "Umzüge in die Voralpen", icon: Mountain },
    { title: "Mittellage", desc: "Zwischen Bern & Lausanne", icon: MapPin }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Freiburg?", answer: "Ein Umzug in Freiburg kostet CHF 450 - 2'800 - günstiger als Bern oder Lausanne, mit vielen Studentenangeboten." },
    { question: "Gibt es zweisprachige Umzugsfirmen?", answer: "Ja, die meisten Freiburger Firmen bieten Service auf Deutsch und Französisch an." },
    { question: "Sind Umzüge in die Gruyère teurer?", answer: "Umzüge in die Voralpen-Region sind etwas teurer wegen längerer Distanzen und bergigem Terrain." },
    { question: "Gibt es Studentenrabatte?", answer: "Ja, viele Firmen bieten Sondertarife für Studierende der Universität Freiburg." },
    { question: "Wie melde ich mich an?", answer: "Die Anmeldung erfolgt beim Einwohneramt innerhalb von 14 Tagen nach dem Umzug." }
  ],
  
  seo: {
    title: "Umzugsfirmen Freiburg vergleichen | Bilingue | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen in Freiburg. Zweisprachiger Service DE/FR. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Freiburg, déménagement Fribourg, Umzug Freiburg bilingue"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Freiburg",
    paragraphs: [
      { text: "Der Kanton Freiburg ist der einzige offiziell zweisprachige Kanton der Schweiz (Französisch und Deutsch) und liegt zwischen Bern und Lausanne." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle. In der Stadt Freiburg auf Französisch, im Sensebezirk auf Deutsch." },
      { title: "Universitätsstadt", text: "Freiburg ist eine wichtige Universitätsstadt. Viele Umzugsfirmen haben spezielle Angebote für Studierende." },
      { title: "Beliebte Regionen", text: "Stadt Freiburg, Bulle (Gruyère), Murten/Morat, Düdingen und der Sensebezirk sind die Hauptregionen." }
    ]
  },
  
  notificationCity: "Fribourg",
  activeUsersBase: 11
};
