import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Percent, Waves, TrendingUp, Train } from 'lucide-react';

export const zugConfig: CantonConfig = {
  name: "Zug",
  slug: "zug",
  tagline: "Umzug im Steuerkanton – Crypto Valley",
  icon: TrendingUp,
  iconColor: "text-blue-700",
  cities: ["Zug", "Baar", "Cham", "Steinhausen", "Risch-Rotkreuz", "Hünenberg", "Oberägeri", "Unterägeri"],
  
  companies: [
    { name: "Zuger Umzüge AG", rating: 4.9, reviews: 234, priceLevel: "premium", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Baar Moving Services", rating: 4.8, reviews: 178, priceLevel: "fair", sponsored: true, available: true, badge: null },
    { name: "Crypto Valley Movers", rating: 4.7, reviews: 145, priceLevel: "premium", sponsored: false, available: true, badge: "International" },
    { name: "Ägerisee Transport", rating: 4.6, reviews: 98, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Zugersee Express", rating: 4.7, reviews: 87, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 600 - 950", avg: "CHF 775" },
    { size: "3-Zimmer Wohnung", range: "CHF 1'200 - 1'900", avg: "CHF 1'550" },
    { size: "5-Zimmer Villa", range: "CHF 2'800 - 4'500", avg: "CHF 3'650" }
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
    { title: "Tiefste Steuern", desc: "Schweizweit attraktivste Steuerbelastung", icon: Percent },
    { title: "Crypto Valley", desc: "Hub für Blockchain & Fintech", icon: TrendingUp },
    { title: "Zugersee", desc: "Traumhafte Seelage", icon: Waves },
    { title: "Nähe Zürich", desc: "25 Min. zur Grossstadt", icon: Train }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Zug?", answer: "Ein Umzug in Zug kostet CHF 600 - 4'500. Die hohe Nachfrage und Premium-Immobilien erhöhen die Preise." },
    { question: "Warum ist Zug so beliebt?", answer: "Zug bietet tiefste Steuern, internationale Unternehmen, schöne Lage und perfekte Anbindung an Zürich." },
    { question: "Gibt es Firmen für internationale Umzüge?", answer: "Ja, viele Zuger Firmen sind auf internationale Relocation für Expats spezialisiert." },
    { question: "Wie melde ich mich in Zug an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle innerhalb von 14 Tagen nach dem Umzug." },
    { question: "Wie ist die Verkehrsanbindung?", answer: "Zug liegt an der A4 und hat direkten Bahnanschluss nach Zürich (25 Min.) und Luzern (20 Min.)." }
  ],
  
  seo: {
    title: "Umzugsfirmen Zug vergleichen | Tiefste Steuern | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen im Kanton Zug. Crypto Valley & tiefste Steuern. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Zug, Umzug Zug, Crypto Valley Umzug"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Zug",
    paragraphs: [
      { text: "Der Kanton Zug ist einer der kleinsten aber wohlhabendsten Kantone der Schweiz, bekannt als Crypto Valley und Steueroase." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
      { title: "Wirtschaftszentrum", text: "Zug ist Sitz vieler internationaler Unternehmen und Blockchain-Firmen. Entsprechend hoch ist die Nachfrage nach Wohnraum." },
      { title: "Gemeinden", text: "Zug (Hauptort), Baar, Cham, Steinhausen, Risch-Rotkreuz, Hünenberg und die Ägerisee-Gemeinden." }
    ]
  },
  
  notificationCity: "Zug",
  activeUsersBase: 12
};
