import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Mountain, Building2, Palette, Calendar, Package, MapPin, Languages } from 'lucide-react';

export const graubuendenConfig: CantonConfig = {
  name: "Graubünden",
  slug: "graubuenden",
  tagline: "Umzug in den Alpen – Chalet & Bergexperten",
  icon: Mountain,
  iconColor: "text-emerald-700",
  cities: ["Chur", "Davos", "St. Moritz", "Pontresina", "Klosters", "Lenzerheide", "Arosa", "Scuol"],
  
  companies: [
    { name: "Bündner Umzüge AG", rating: 4.8, reviews: 187, priceLevel: "fair", sponsored: true, available: true, badge: "Alpen-Experte" },
    { name: "Chur City Movers", rating: 4.7, reviews: 156, priceLevel: "fair", sponsored: true, available: true, badge: null },
    { name: "Engadin Transport", rating: 4.9, reviews: 134, priceLevel: "premium", sponsored: false, available: true, badge: "St. Moritz" },
    { name: "Davos Klosters Moving", rating: 4.6, reviews: 98, priceLevel: "premium", sponsored: false, available: true, badge: null },
    { name: "Alpin Umzüge GR", rating: 4.7, reviews: 87, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 600 - 1'000", avg: "CHF 800" },
    { size: "3-Zimmer Wohnung", range: "CHF 1'200 - 2'000", avg: "CHF 1'600" },
    { size: "Chalet/Ferienhaus", range: "CHF 2'500 - 5'000", avg: "CHF 3'750" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Chaletumzug", icon: Mountain, link: "/chaletumzug" },
    { name: "Firmenumzug", icon: Building2, link: "/firmenumzug" },
    { name: "Kunsttransport", icon: Palette, link: "/kunsttransport" },
    { name: "Saisonumzug", icon: Calendar, link: "/saisonumzug" },
    { name: "Lagerung", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Alpen-Experten", desc: "Spezialisiert auf Bergumzüge", icon: Mountain },
    { title: "Feriendomizile", desc: "Chalet- und Zweitwohnungs-Umzüge", icon: Home },
    { title: "150 Täler", desc: "Kenntnis aller Regionen", icon: MapPin },
    { title: "Mehrsprachig", desc: "DE, IT, RM Service", icon: Languages }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Graubünden?", answer: "Umzüge in Graubünden kosten CHF 600 - 5'000. Bergumzüge und abgelegene Chalets sind teurer aufgrund schwieriger Zugänge." },
    { question: "Gibt es Spezialisten für Chaletumzüge?", answer: "Ja, mehrere Bündner Firmen sind auf Umzüge in Berggebiete wie Engadin, Davos oder Lenzerheide spezialisiert." },
    { question: "Wie funktioniert ein Umzug nach St. Moritz?", answer: "Umzüge ins Engadin erfordern spezielle Planung wegen Passübergängen und saisonaler Einschränkungen." },
    { question: "Bieten Firmen auch Zweitwohnungs-Umzüge an?", answer: "Ja, viele Firmen sind auf saisonale Umzüge für Ferienwohnungen spezialisiert." },
    { question: "Was ist bei Umzügen im Winter zu beachten?", answer: "Winterumzüge erfordern wetterfeste Planung. Pässe können gesperrt sein, Schneeketten sind oft nötig." }
  ],
  
  seo: {
    title: "Umzugsfirmen Graubünden vergleichen | Alpen-Experten | Umzugscheck.ch",
    description: "Vergleichen Sie spezialisierte Umzugsfirmen in Graubünden. Experten für Chalet- und Bergumzüge. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Graubünden, Chalet Umzug, Umzug St. Moritz, Umzug Davos"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Graubünden",
    paragraphs: [
      { text: "Graubünden ist der grösste und dünnstbesiedelte Kanton der Schweiz mit über 150 Tälern und drei Amtssprachen (Deutsch, Italienisch, Rätoromanisch)." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde. In vielen Bergdörfern ist persönliches Erscheinen erforderlich." },
      { title: "Besondere Herausforderungen", text: "Umzüge in Berggebiete erfordern spezielles Equipment und Erfahrung. Enge Strassen, steile Zufahrten und Wetterabhängigkeit sind typisch." },
      { title: "Beliebte Regionen", text: "Chur (Hauptstadt), Engadin (St. Moritz, Pontresina), Davos/Klosters, Lenzerheide, Arosa und das Prättigau sind die Hauptregionen." }
    ]
  },
  
  notificationCity: "Chur",
  activeUsersBase: 9
};
