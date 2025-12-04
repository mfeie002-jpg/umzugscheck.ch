import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Mountain, Sparkles, Trash2, ArrowUpFromLine, Package, Percent, Snowflake, Users, Wallet } from 'lucide-react';

export const glarusConfig: CantonConfig = {
  name: "Glarus",
  slug: "glarus",
  tagline: "Umzug im Glarnerland – Flat Rate Tax Kanton",
  icon: Mountain,
  iconColor: "text-green-700",
  cities: ["Glarus", "Näfels", "Oberurnen", "Schwanden", "Elm", "Braunwald", "Mollis"],
  
  companies: [
    { name: "Glarner Umzüge AG", rating: 4.7, reviews: 67, priceLevel: "fair", sponsored: true, available: true, badge: "Lokal" },
    { name: "Linth Transport", rating: 4.6, reviews: 54, priceLevel: "günstig", sponsored: true, available: true, badge: "Günstig" },
    { name: "Braunwald Moving", rating: 4.8, reviews: 45, priceLevel: "premium", sponsored: false, available: true, badge: "Autofrei-Experte" },
    { name: "Näfels Express", rating: 4.5, reviews: 34, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Elm Bergumzüge", rating: 4.6, reviews: 28, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 400 - 650", avg: "CHF 525" },
    { size: "3-Zimmer Wohnung", range: "CHF 800 - 1'300", avg: "CHF 1'050" },
    { size: "Chalet Braunwald", range: "CHF 1'800 - 3'000", avg: "CHF 2'400" }
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
    { title: "Flat Rate Tax", desc: "Einheitlicher Steuerfuss", icon: Percent },
    { title: "Braunwald", desc: "Autofreier Ferienort", icon: Snowflake },
    { title: "Landsgemeinde", desc: "Direkte Demokratie", icon: Users },
    { title: "Günstig wohnen", desc: "Tiefe Mietpreise", icon: Wallet }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Glarus?", answer: "Ein Umzug in Glarus kostet CHF 400 - 3'000 - einer der günstigsten Kantone für Umzüge." },
    { question: "Wie funktioniert ein Umzug nach Braunwald?", answer: "Braunwald ist autofrei. Güter werden per Standseilbahn transportiert. Spezialfirmen koordinieren dies." },
    { question: "Was ist die Glarner Flat Rate Tax?", answer: "Glarus hat als erster Kanton eine Flat Rate Tax eingeführt - ein einheitlicher Steuersatz für alle." },
    { question: "Wie melde ich mich in Glarus an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle einer der drei Gemeinden innerhalb von 14 Tagen." },
    { question: "Gibt es nur drei Gemeinden?", answer: "Ja, Glarus hat 2011 die Gemeinden fusioniert: Glarus Nord, Glarus (Mitte) und Glarus Süd." }
  ],
  
  seo: {
    title: "Umzugsfirmen Glarus vergleichen | Günstig | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen im Kanton Glarus. Günstige Umzüge im Glarnerland. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Glarus, Umzug Glarnerland, Braunwald Umzug"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Glarus",
    paragraphs: [
      { text: "Der Kanton Glarus ist ein kleiner Bergkanton mit nur drei Gemeinden und der traditionellen Landsgemeinde als Parlamentsform." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei einer der drei Gemeinden: Glarus Nord, Glarus oder Glarus Süd." },
      { title: "Gemeindereform", text: "2011 wurden alle Gemeinden zu nur drei fusioniert - ein schweizweites Novum, das die Verwaltung vereinfacht." },
      { title: "Regionen", text: "Glarus Nord (Näfels, Oberurnen), Glarus (Hauptort), Glarus Süd (Schwanden, Elm, Braunwald) mit dem autofreien Ferienort." }
    ]
  },
  
  notificationCity: "Glarus",
  activeUsersBase: 5
};
