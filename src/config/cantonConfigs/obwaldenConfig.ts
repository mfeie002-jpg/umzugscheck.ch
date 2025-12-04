import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Mountain, Sparkles, Trash2, ArrowUpFromLine, Package, Percent, Snowflake, Waves } from 'lucide-react';

export const obwaldenConfig: CantonConfig = {
  name: "Obwalden",
  slug: "obwalden",
  tagline: "Umzug am Sarnersee – Tiefe Steuern",
  icon: Mountain,
  iconColor: "text-green-600",
  cities: ["Sarnen", "Kerns", "Sachseln", "Alpnach", "Giswil", "Lungern", "Engelberg"],
  
  companies: [
    { name: "Obwaldner Umzüge", rating: 4.7, reviews: 78, priceLevel: "fair", sponsored: true, available: true, badge: "Seit 1975" },
    { name: "Sarnen Transport", rating: 4.6, reviews: 56, priceLevel: "fair", sponsored: true, available: true, badge: null },
    { name: "Engelberg Movers", rating: 4.8, reviews: 67, priceLevel: "premium", sponsored: false, available: true, badge: "Titlis-Region" },
    { name: "Kernser Umzüge", rating: 4.5, reviews: 45, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Pilatus Transport OW", rating: 4.6, reviews: 34, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 450 - 700", avg: "CHF 575" },
    { size: "3-Zimmer Wohnung", range: "CHF 900 - 1'400", avg: "CHF 1'150" },
    { size: "Chalet Engelberg", range: "CHF 2'000 - 3'500", avg: "CHF 2'750" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Chaletumzug", icon: Mountain, link: "/chaletumzug" },
    { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
    { name: "Entsorgung", icon: Trash2, link: "/entsorgung" },
    { name: "Möbellift", icon: ArrowUpFromLine, link: "/moebellift" },
    { name: "Lagerung", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Tiefe Steuern", desc: "Attraktiver Steuerfuss", icon: Percent },
    { title: "Engelberg", desc: "Ferienort Titlis-Region", icon: Snowflake },
    { title: "Sarnersee", desc: "Idyllische Seelage", icon: Waves },
    { title: "Pilatus", desc: "Berge vor der Haustür", icon: Mountain }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Obwalden?", answer: "Ein Umzug in Obwalden kostet CHF 450 - 3'500. Chaletumzüge in Engelberg sind aufgrund der Lage teurer." },
    { question: "Gibt es Firmen für Umzüge nach Engelberg?", answer: "Ja, spezialisierte Firmen bieten Chaletumzüge in den Ferienort an, inkl. Seilbahn-Koordination wenn nötig." },
    { question: "Warum ist Obwalden bei Zuzügern beliebt?", answer: "Obwalden bietet tiefe Steuern, schöne Natur und gute Anbindung an Luzern und Zürich." },
    { question: "Wie melde ich mich an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
    { question: "Wie ist die Verkehrsanbindung?", answer: "Obwalden ist via A8 (Brünig) und Zentralbahn gut erreichbar. Nach Luzern sind es ca. 20 Minuten." }
  ],
  
  seo: {
    title: "Umzugsfirmen Obwalden vergleichen | Tiefe Steuern | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen in Obwalden. Tiefe Steuern, schöne Natur. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Obwalden, Umzug Sarnen, Engelberg Umzug"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Obwalden",
    paragraphs: [
      { text: "Der Halbkanton Obwalden liegt in der Zentralschweiz am Sarnersee und ist einer der steuergünstigsten Kantone der Schweiz." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
      { title: "Steuerparadies", text: "Obwalden hat eine der tiefsten Steuerbelastungen der Schweiz, was den Kanton für Zuzüger attraktiv macht." },
      { title: "Gemeinden", text: "Sarnen (Hauptort), Kerns, Sachseln, Alpnach, Giswil, Lungern und Engelberg sind die sieben Gemeinden." }
    ]
  },
  
  notificationCity: "Sarnen",
  activeUsersBase: 4
};
