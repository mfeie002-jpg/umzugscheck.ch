import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Flag, Percent, Waves, Train } from 'lucide-react';

export const schwyzConfig: CantonConfig = {
  name: "Schwyz",
  slug: "schwyz",
  tagline: "Umzug im Urkanton – Tiefe Steuern",
  icon: Flag,
  iconColor: "text-red-600",
  cities: ["Schwyz", "Freienbach", "Einsiedeln", "Küssnacht", "Arth", "Lachen", "Goldau"],
  
  companies: [
    { name: "Schwyzer Umzüge AG", rating: 4.8, reviews: 156, priceLevel: "fair", sponsored: true, available: true, badge: "Tradition" },
    { name: "Einsiedeln Transport", rating: 4.7, reviews: 123, priceLevel: "fair", sponsored: true, available: true, badge: "Historisch" },
    { name: "March-Höfe Movers", rating: 4.6, reviews: 98, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Mythen Umzüge", rating: 4.7, reviews: 87, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Küssnacht Express", rating: 4.5, reviews: 76, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 500 - 800", avg: "CHF 650" },
    { size: "3-Zimmer Wohnung", range: "CHF 1'000 - 1'500", avg: "CHF 1'250" },
    { size: "5-Zimmer Haus", range: "CHF 2'000 - 3'200", avg: "CHF 2'600" }
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
    { title: "Urkanton", desc: "Wiege der Eidgenossenschaft", icon: Flag },
    { title: "Tiefe Steuern", desc: "Attraktiver Wohnkanton", icon: Percent },
    { title: "Zwei Seen", desc: "Zürich- & Vierwaldstättersee", icon: Waves },
    { title: "Nähe Zürich", desc: "Idealer Pendlerkanton", icon: Train }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Schwyz?", answer: "Ein Umzug im Kanton Schwyz kostet CHF 500 - 3'200 - etwas günstiger als Zürich bei guter Erreichbarkeit." },
    { question: "Warum ziehen viele nach Schwyz?", answer: "Der Kanton Schwyz bietet tiefe Steuern, schöne Landschaft und gute Anbindung an Zürich." },
    { question: "Gibt es Umzugsfirmen für Bergregionen?", answer: "Ja, mehrere Firmen sind auf Umzüge in die Mythenregion und ins Muotathal spezialisiert." },
    { question: "Wie melde ich mich in Schwyz an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
    { question: "Sind Umzüge nach Einsiedeln speziell?", answer: "Einsiedeln hat eine historische Altstadt. Zufahrtsbeschränkungen und enge Gassen erfordern Erfahrung." }
  ],
  
  seo: {
    title: "Umzugsfirmen Schwyz vergleichen | Tiefe Steuern | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen im Kanton Schwyz. Urkanton mit tiefen Steuern. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Schwyz, Umzug Einsiedeln, Umzug Freienbach"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Schwyz",
    paragraphs: [
      { text: "Der Kanton Schwyz ist einer der vier Waldstätte und Urkantone der Schweiz. Er gab der Schweiz ihren Namen." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
      { title: "Steuerparadies", text: "Der Kanton Schwyz hat eine der tiefsten Steuerbelastungen der Schweiz, was ihn für Zuzüger attraktiv macht." },
      { title: "Beliebte Gemeinden", text: "Freienbach (March), Schwyz (Hauptort), Einsiedeln, Küssnacht, Arth-Goldau und Lachen sind die grössten Gemeinden." }
    ]
  },
  
  notificationCity: "Schwyz",
  activeUsersBase: 8
};
