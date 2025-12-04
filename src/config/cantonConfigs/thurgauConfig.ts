import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, Globe, Package, Waves, TreePine, Apple, Train } from 'lucide-react';

export const thurgauConfig: CantonConfig = {
  name: "Thurgau",
  slug: "thurgau",
  tagline: "Umzug im Apfelkanton – Bodenseeregion",
  icon: Apple,
  iconColor: "text-green-600",
  cities: ["Frauenfeld", "Kreuzlingen", "Arbon", "Weinfelden", "Amriswil", "Romanshorn", "Bischofszell"],
  
  companies: [
    { name: "Thurgauer Umzüge AG", rating: 4.8, reviews: 198, priceLevel: "fair", sponsored: true, available: true, badge: "Seit 1990" },
    { name: "Bodensee Movers", rating: 4.7, reviews: 156, priceLevel: "günstig", sponsored: true, available: true, badge: "Grenzverkehr" },
    { name: "Frauenfeld Express", rating: 4.6, reviews: 134, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Kreuzlingen Transport", rating: 4.7, reviews: 112, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Obstland Umzüge", rating: 4.5, reviews: 89, priceLevel: "günstig", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 450 - 700", avg: "CHF 575" },
    { size: "3-Zimmer Wohnung", range: "CHF 900 - 1'400", avg: "CHF 1'150" },
    { size: "5-Zimmer Haus", range: "CHF 1'800 - 3'000", avg: "CHF 2'400" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Firmenumzug", icon: Building2, link: "/firmenumzug" },
    { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
    { name: "Entsorgung", icon: Trash2, link: "/entsorgung" },
    { name: "Deutschland", icon: Globe, link: "/international" },
    { name: "Lagerung", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Bodenseeregion", desc: "Grenzüberschreitende Umzüge", icon: Waves },
    { title: "Ländlich", desc: "Günstigere Preise als Städte", icon: TreePine },
    { title: "Obstbau-Region", desc: "Erfahrung mit Bauernhöfen", icon: Apple },
    { title: "Nähe Zürich", desc: "Pendler-Umzüge", icon: Train }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug im Thurgau?", answer: "Ein Umzug im Thurgau kostet zwischen CHF 450 und CHF 3'000 - deutlich günstiger als in den Grossstädten." },
    { question: "Gibt es Firmen für Umzüge nach Deutschland?", answer: "Ja, viele Thurgauer Firmen bieten grenzüberschreitende Umzüge nach Konstanz und in den süddeutschen Raum an." },
    { question: "Wie lange dauert ein Umzug im Thurgau?", answer: "Aufgrund kurzer Distanzen und weniger Verkehr sind Umzüge oft in einem halben Tag erledigt." },
    { question: "Wo melde ich mich im Thurgau an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
    { question: "Sind Wochenendumzüge im Thurgau möglich?", answer: "Ja, viele Firmen bieten Samstagsumzüge an. Sonntags sind Umzüge eingeschränkt möglich." }
  ],
  
  seo: {
    title: "Umzugsfirmen Thurgau vergleichen | Günstig | Umzugscheck.ch",
    description: "Vergleichen Sie kostenlos die besten Umzugsfirmen im Thurgau. Günstige Preise in der Bodenseeregion. Bis zu 5 Offerten.",
    keywords: "Umzugsfirma Thurgau, Umzug Frauenfeld, Umzug Kreuzlingen"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Thurgau",
    paragraphs: [
      { text: "Der Kanton Thurgau, auch Apfelkanton genannt, liegt im Nordosten der Schweiz am Bodensee und ist bekannt für seine ländliche Idylle." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde. Online-Anmeldung ist in vielen Gemeinden möglich." },
      { title: "Grenzregion", text: "Die Nähe zu Deutschland (Konstanz) macht grenzüberschreitende Umzüge zu einem häufigen Service." },
      { title: "Beliebte Wohnorte", text: "Frauenfeld (Hauptort), Kreuzlingen, Arbon, Weinfelden und Amriswil sind die grössten Gemeinden. Die Seegemeinden sind besonders begehrt." }
    ]
  },
  
  notificationCity: "Frauenfeld",
  activeUsersBase: 10
};
