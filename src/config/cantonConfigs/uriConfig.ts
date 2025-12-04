import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Mountain, Sparkles, Trash2, ArrowUpFromLine, Package, Flag, TreePine, Wallet } from 'lucide-react';

export const uriConfig: CantonConfig = {
  name: "Uri",
  slug: "uri",
  tagline: "Umzug im Gotthardkanton – Tor zum Süden",
  icon: Mountain,
  iconColor: "text-amber-700",
  cities: ["Altdorf", "Erstfeld", "Schattdorf", "Bürglen", "Flüelen", "Andermatt", "Silenen"],
  
  companies: [
    { name: "Urner Umzüge AG", rating: 4.7, reviews: 87, priceLevel: "fair", sponsored: true, available: true, badge: "Familienunternehmen" },
    { name: "Gotthard Transport", rating: 4.6, reviews: 67, priceLevel: "fair", sponsored: true, available: true, badge: "Passexperte" },
    { name: "Altdorf Movers", rating: 4.5, reviews: 54, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Tell Umzüge", rating: 4.6, reviews: 45, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Reuss-Tal Transport", rating: 4.4, reviews: 38, priceLevel: "günstig", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 450 - 700", avg: "CHF 575" },
    { size: "3-Zimmer Wohnung", range: "CHF 900 - 1'400", avg: "CHF 1'150" },
    { size: "5-Zimmer Haus", range: "CHF 1'800 - 2'800", avg: "CHF 2'300" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Bergumzug", icon: Mountain, link: "/bergumzug" },
    { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
    { name: "Entsorgung", icon: Trash2, link: "/entsorgung" },
    { name: "Möbellift", icon: ArrowUpFromLine, link: "/moebellift" },
    { name: "Lagerung", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Gotthard", desc: "Tor zum Süden", icon: Mountain },
    { title: "Urkanton", desc: "Wiege der Schweiz", icon: Flag },
    { title: "Reusstal", desc: "Malerische Talumzüge", icon: TreePine },
    { title: "Günstig", desc: "Tiefere Lebenskosten", icon: Wallet }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Uri?", answer: "Ein Umzug in Uri kostet CHF 450 - 2'800 - einer der günstigsten Kantone der Zentralschweiz." },
    { question: "Gibt es Umzugsfirmen für Bergdörfer?", answer: "Ja, Urner Firmen sind auf Umzüge in abgelegene Berggemeinden spezialisiert." },
    { question: "Wie ist die Erreichbarkeit?", answer: "Uri ist über die A2 (Gotthard) und die Gotthardbahn gut erreichbar. Die Neue Eisenbahn-Alpentransversale (NEAT) verkürzt Reisezeiten." },
    { question: "Wo melde ich mich in Uri an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
    { question: "Ist Wilhelm Tell aus Uri?", answer: "Ja, der Legende nach stammt Wilhelm Tell aus Bürglen bei Altdorf - daher der Name mancher Umzugsfirma." }
  ],
  
  seo: {
    title: "Umzugsfirmen Uri vergleichen | Günstig | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen im Kanton Uri. Günstige Preise im Gotthardkanton. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Uri, Umzug Altdorf, Umzug Gotthard"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Uri",
    paragraphs: [
      { text: "Der Kanton Uri ist einer der vier Waldstätte und Urkantone der Schweiz am Fuss des Gotthards." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
      { title: "Gotthard-Kanton", text: "Uri ist das Tor zum Süden. Der Kanton profitiert vom Gotthard-Basistunnel und liegt zentral auf der Nord-Süd-Achse." },
      { title: "Gemeinden", text: "Altdorf (Hauptort), Erstfeld, Schattdorf, Bürglen und Flüelen sind die grössten Gemeinden. Die Bergdörfer bieten günstige Wohnlagen." }
    ]
  },
  
  notificationCity: "Altdorf",
  activeUsersBase: 4
};
