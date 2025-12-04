import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Building, GraduationCap, Landmark, Mountain, MapPin } from 'lucide-react';

export const bernConfig: CantonConfig = {
  name: "Bern",
  slug: "bern",
  tagline: "Umzug in der Bundesstadt – sicher, schnell und fair",
  icon: Building,
  iconColor: "text-red-600",
  cities: ["Bern", "Thun", "Biel", "Burgdorf", "Langenthal", "Köniz", "Ostermundigen", "Muri bei Bern"],
  
  companies: [
    { name: "Berner Umzüge AG", rating: 4.9, reviews: 356, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Aare Moving", rating: 4.8, reviews: 278, priceLevel: "günstig", sponsored: true, available: true, badge: "Studentenrabatt" },
    { name: "Hauptstadt Transporte", rating: 4.7, reviews: 234, priceLevel: "premium", sponsored: false, available: true, badge: null },
    { name: "Bern Express Umzug", rating: 4.6, reviews: 189, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Oberland Movers", rating: 4.8, reviews: 156, priceLevel: "fair", sponsored: false, available: false, badge: "Bergexperte" }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 500 - 800", avg: "CHF 650" },
    { size: "3-Zimmer Wohnung", range: "CHF 1'000 - 1'600", avg: "CHF 1'300" },
    { size: "5-Zimmer Haus", range: "CHF 2'200 - 3'500", avg: "CHF 2'850" }
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
    { title: "UNESCO Altstadt", desc: "Erfahrung mit engen Altstadtgassen", icon: Building },
    { title: "Uni & Fachhochschulen", desc: "Studentenrabatte verfügbar", icon: GraduationCap },
    { title: "Bundesstadt", desc: "Behörden- und Diplomatenumzüge", icon: Landmark },
    { title: "Berner Oberland", desc: "Umzüge ins Berggebiet", icon: Mountain }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Bern?", answer: "Ein Umzug in Bern kostet je nach Wohnungsgrösse zwischen CHF 500 und CHF 3'500. Die Altstadt ist aufgrund enger Gassen etwas teurer." },
    { question: "Gibt es spezielle Regelungen für die Berner Altstadt?", answer: "Ja, in der UNESCO-geschützten Altstadt gelten besondere Zufahrtszeiten. Umzüge sind meist nur morgens zwischen 7-10 Uhr erlaubt." },
    { question: "Bieten Berner Firmen auch Umzüge ins Oberland an?", answer: "Ja, viele Berner Umzugsfirmen sind auf Bergumzüge spezialisiert und verfügen über geeignete Fahrzeuge für Chalets." },
    { question: "Wie melde ich mich in Bern an?", answer: "Die Anmeldung erfolgt beim Einwohnerdienst der Stadt Bern innerhalb von 14 Tagen. Online-Anmeldung ist über eUmzug möglich." },
    { question: "Wann ist die beste Umzugszeit in Bern?", answer: "Ausserhalb der Uni-Semesterzeiten (Februar/März und August/September) sind die Preise günstiger und mehr Termine verfügbar." }
  ],
  
  seo: {
    title: "Umzugsfirmen Bern vergleichen | Bis 40% sparen | Umzugscheck.ch",
    description: "Vergleichen Sie kostenlos die besten Umzugsfirmen in Bern. Erhalten Sie bis zu 5 unverbindliche Offerten und sparen Sie bis zu 40% bei Ihrem Umzug.",
    keywords: "Umzugsfirma Bern, Umzug Bern, Umzugsunternehmen Bern, Umzugsofferten Bern"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Bern",
    paragraphs: [
      { text: "Der Kanton Bern ist der zweitgrösste Kanton der Schweiz und erstreckt sich vom Mittelland bis ins Hochgebirge des Berner Oberlandes." },
      { title: "An- und Abmeldung", text: "Die Anmeldung beim Einwohnerdienst muss innerhalb von 14 Tagen erfolgen. In der Stadt Bern ist die Online-Anmeldung über eUmzug möglich." },
      { title: "Besonderheiten Altstadt", text: "Die UNESCO-Welterbe Altstadt erfordert spezielle Planung. Zufahrtszeiten sind beschränkt und Möbellifte oft notwendig." },
      { title: "Beliebte Wohngebiete", text: "Kirchenfeld, Länggasse, Breitenrain und Bümpliz sind beliebte Stadtquartiere. Im Umland sind Thun, Biel und Burgdorf gefragte Wohnorte." }
    ]
  },
  
  notificationCity: "Bern",
  activeUsersBase: 18
};
