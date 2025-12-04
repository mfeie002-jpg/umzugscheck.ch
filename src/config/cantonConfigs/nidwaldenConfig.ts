import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, Percent, Crown, Waves, Train } from 'lucide-react';

export const nidwaldenConfig: CantonConfig = {
  name: "Nidwalden",
  slug: "nidwalden",
  tagline: "Umzug am Vierwaldstättersee – Tiefste Steuern",
  icon: Percent,
  iconColor: "text-emerald-600",
  cities: ["Stans", "Hergiswil", "Stansstad", "Buochs", "Ennetbürgen", "Beckenried", "Emmetten"],
  
  companies: [
    { name: "Nidwaldner Umzüge", rating: 4.8, reviews: 89, priceLevel: "fair", sponsored: true, available: true, badge: "Marktführer" },
    { name: "Stans Transport AG", rating: 4.7, reviews: 67, priceLevel: "fair", sponsored: true, available: true, badge: null },
    { name: "Bürgenstock Movers", rating: 4.9, reviews: 56, priceLevel: "premium", sponsored: false, available: true, badge: "Premium" },
    { name: "Hergiswil Express", rating: 4.6, reviews: 45, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Stanserhorn Umzüge", rating: 4.5, reviews: 34, priceLevel: "günstig", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 500 - 800", avg: "CHF 650" },
    { size: "3-Zimmer Wohnung", range: "CHF 1'000 - 1'500", avg: "CHF 1'250" },
    { size: "Villa Bürgenstock", range: "CHF 3'000 - 5'000", avg: "CHF 4'000" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Villenumzug", icon: Crown, link: "/villenumzug" },
    { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
    { name: "Entsorgung", icon: Trash2, link: "/entsorgung" },
    { name: "Kunsttransport", icon: Package, link: "/kunsttransport" },
    { name: "Lagerung", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Tiefste Steuern", desc: "Schweizweit tiefste Belastung", icon: Percent },
    { title: "Bürgenstock", desc: "Luxusresort & Villen", icon: Crown },
    { title: "Vierwaldstättersee", desc: "Traumhafte Seelage", icon: Waves },
    { title: "Nähe Luzern", desc: "10 Min. zur Stadt", icon: Train }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Nidwalden?", answer: "Ein Umzug in Nidwalden kostet CHF 500 - 5'000. Villenumzüge am Bürgenstock sind aufgrund der Exklusivität teurer." },
    { question: "Warum hat Nidwalden so tiefe Steuern?", answer: "Nidwalden hat bewusst auf Standortattraktivität gesetzt und bietet schweizweit eine der tiefsten Steuerbelastungen." },
    { question: "Gibt es Spezialisten für Bürgenstock?", answer: "Ja, einige Firmen sind auf Umzüge in die exklusive Bürgenstock-Region spezialisiert." },
    { question: "Wie melde ich mich in Nidwalden an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
    { question: "Wie ist die Erreichbarkeit?", answer: "Nidwalden ist via A2 und Zentralbahn optimal erschlossen. Nach Luzern sind es nur 10-15 Minuten." }
  ],
  
  seo: {
    title: "Umzugsfirmen Nidwalden vergleichen | Tiefste Steuern | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen in Nidwalden. Tiefste Steuern der Schweiz. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Nidwalden, Umzug Stans, Bürgenstock Umzug"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Nidwalden",
    paragraphs: [
      { text: "Der Halbkanton Nidwalden am Vierwaldstättersee ist bekannt für seine traumhafte Lage und die schweizweit tiefsten Steuern." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
      { title: "Steuerparadies Nr. 1", text: "Nidwalden gilt als steuergünstigster Kanton der Schweiz und zieht entsprechend viele wohlhabende Zuzüger an." },
      { title: "Gemeinden", text: "Stans (Hauptort), Hergiswil, Stansstad, Buochs, Ennetbürgen, Beckenried, Emmetten und weitere kleine Gemeinden." }
    ]
  },
  
  notificationCity: "Stans",
  activeUsersBase: 5
};
