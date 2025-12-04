import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Building, Train, Watch, MapPin } from 'lucide-react';

export const solothurnConfig: CantonConfig = {
  name: "Solothurn",
  slug: "solothurn",
  tagline: "Umzug in der Barockstadt – Zentrale Lage",
  icon: Building,
  iconColor: "text-amber-600",
  cities: ["Solothurn", "Olten", "Grenchen", "Zuchwil", "Dornach", "Biberist", "Derendingen"],
  
  companies: [
    { name: "Solothurner Umzüge", rating: 4.8, reviews: 167, priceLevel: "fair", sponsored: true, available: true, badge: "Tradition" },
    { name: "Aare Transport SO", rating: 4.7, reviews: 134, priceLevel: "günstig", sponsored: true, available: true, badge: "Günstig" },
    { name: "Olten Movers", rating: 4.6, reviews: 112, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Grenchen Express", rating: 4.5, reviews: 89, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Jura-Südfuss Umzüge", rating: 4.7, reviews: 78, priceLevel: "günstig", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 450 - 700", avg: "CHF 575" },
    { size: "3-Zimmer Wohnung", range: "CHF 900 - 1'400", avg: "CHF 1'150" },
    { size: "5-Zimmer Haus", range: "CHF 1'800 - 2'800", avg: "CHF 2'300" }
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
    { title: "Barockstadt", desc: "Erfahrung mit Altstadt-Umzügen", icon: Building },
    { title: "Verkehrsknotenpunkt", desc: "Olten: Zentrum der Schweiz", icon: Train },
    { title: "Uhrenindustrie", desc: "Grenchen & Biel-Region", icon: Watch },
    { title: "Mittelland", desc: "Zentrale Lage, gute Preise", icon: MapPin }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Solothurn?", answer: "Ein Umzug in Solothurn kostet zwischen CHF 450 und CHF 2'800 - günstiger als in den Grossstädten." },
    { question: "Gibt es besondere Regelungen für die Altstadt Solothurn?", answer: "Ja, in der barocken Altstadt gelten Zufahrtsbeschränkungen. Möbellifte sind oft notwendig." },
    { question: "Bieten Solothurner Firmen auch Umzüge nach Bern/Zürich?", answer: "Ja, dank der zentralen Lage sind Umzüge in beide Richtungen problemlos möglich." },
    { question: "Wie melde ich mich in Solothurn an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle innerhalb von 14 Tagen nach dem Umzug." },
    { question: "Sind die Preise in Olten anders als in Solothurn?", answer: "Die Preise sind ähnlich. In Olten gibt es aufgrund der zentralen Lage mehr Anbieterauswahl." }
  ],
  
  seo: {
    title: "Umzugsfirmen Solothurn vergleichen | Günstig | Umzugscheck.ch",
    description: "Vergleichen Sie kostenlos die besten Umzugsfirmen in Solothurn. Faire Preise im Mittelland. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Solothurn, Umzug Olten, Umzug Grenchen"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Solothurn",
    paragraphs: [
      { text: "Der Kanton Solothurn liegt im Schweizer Mittelland und ist bekannt für seine barocke Hauptstadt und die Uhrenindustrie." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
      { title: "Verkehrslage", text: "Olten ist der wichtigste Eisenbahnknotenpunkt der Schweiz. Dies macht den Kanton zu einem beliebten Pendlerstandort." },
      { title: "Beliebte Wohnorte", text: "Die Stadt Solothurn, Olten, Grenchen, Zuchwil und Dornach/Arlesheim sind die grössten Orte. Die Altstadt Solothurn ist UNESCO-Kandidat." }
    ]
  },
  
  notificationCity: "Solothurn",
  activeUsersBase: 9
};
