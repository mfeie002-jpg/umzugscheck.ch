import { Building2, Home, Package, Truck, Shield, Clock, TrendingUp, Landmark } from "lucide-react";
import { CantonConfig } from "@/components/canton/CantonTemplate";

export const baselConfig: CantonConfig = {
  name: "Basel",
  slug: "basel",
  tagline: "Kulturstadt am Rhein",
  icon: Landmark,
  iconColor: "text-purple-600",
  cities: ["Basel", "Riehen", "Binningen", "Allschwil", "Muttenz", "Pratteln", "Liestal", "Reinach", "Münchenstein", "Birsfelden"],
  companies: [
    { name: "Basel Umzüge AG", rating: 4.9, reviews: 412, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Rheinknie Moving", rating: 4.8, reviews: 356, priceLevel: "günstig", sponsored: true, available: true, badge: "Preistipp" },
    { name: "Premium Basel Relocation", rating: 4.8, reviews: 298, priceLevel: "premium", sponsored: false, available: true, badge: "Premium" },
    { name: "Dreiland Transporte", rating: 4.7, reviews: 245, priceLevel: "fair", sponsored: false, available: true, badge: "Grenzüberschreitend" },
    { name: "Baslerland Umzüge", rating: 4.7, reviews: 198, priceLevel: "günstig", sponsored: false, available: true, badge: "Beliebt" },
    { name: "Birsstadt Moving GmbH", rating: 4.6, reviews: 167, priceLevel: "fair", sponsored: false, available: false, badge: null },
    { name: "Kulturstadt Transporte", rating: 4.6, reviews: 143, priceLevel: "günstig", sponsored: false, available: true, badge: "Lokal" },
    { name: "Rheinhafen Umzüge", rating: 4.5, reviews: 121, priceLevel: "premium", sponsored: false, available: true, badge: null },
    { name: "Kleinbasel Express", rating: 4.5, reviews: 98, priceLevel: "fair", sponsored: false, available: true, badge: "Schnell" },
    { name: "St. Johann Umzugsteam", rating: 4.4, reviews: 87, priceLevel: "günstig", sponsored: false, available: false, badge: null },
  ],
  priceExamples: [
    { size: "1-2 Zimmer", range: "CHF 550 - 950", avg: "CHF 750" },
    { size: "3-4 Zimmer", range: "CHF 1'100 - 1'850", avg: "CHF 1'390" },
    { size: "5+ Zimmer", range: "CHF 2'050 - 3'550", avg: "CHF 2'690" },
  ],
  services: [
    { name: "Umzug + Reinigung", icon: Home, link: "/umzug-mit-reinigung" },
    { name: "Firmenumzug", icon: Building2, link: "/firmenumzug-schweiz" },
    { name: "Möbellift", icon: Truck, link: "/moebellift" },
    { name: "Entsorgung", icon: Package, link: "/entsorgung-raeumung" },
    { name: "Einlagerung", icon: Package, link: "/einlagerung" },
    { name: "International", icon: Truck, link: "/internationale-umzuege" },
  ],
  usps: [
    { title: "Dreiländer-Experten", desc: "Spezialisiert auf CH-DE-FR Umzüge", icon: Landmark },
    { title: "Bis 40% sparen", desc: "Vergleichen Sie Basler Umzugsfirmen", icon: TrendingUp },
    { title: "Schnelle Offerten", desc: "Bis zu 5 Angebote in 24h", icon: Clock },
    { title: "Geprüfte Partner", desc: "Alle Firmen versichert und verifiziert", icon: Shield },
  ],
  faqs: [
    { question: "Was kostet ein Umzug in Basel?", answer: "Ein Umzug in Basel kostet zwischen CHF 550 und CHF 3'550 je nach Wohnungsgrösse. Die Preise in Basel sind etwas höher als im Schweizer Durchschnitt." },
    { question: "Gibt es Umzugsfirmen für Grenzgänger?", answer: "Ja, mehrere unserer Partner sind auf grenzüberschreitende Umzüge nach Deutschland und Frankreich spezialisiert." },
    { question: "Wie buche ich einen Umzug in Basel?", answer: "Füllen Sie unser Formular in 2 Minuten aus und erhalten Sie bis zu 5 kostenlose Offerten von geprüften Basler Umzugsfirmen." },
    { question: "Brauche ich eine Parkbewilligung?", answer: "Ja, in Basel ist eine Parkbewilligung für Umzugsfahrzeuge erforderlich. Unsere Partner helfen Ihnen bei der Beantragung." },
    { question: "Sind die Umzugsfirmen versichert?", answer: "Alle Unternehmen auf unserer Plattform sind vollständig versichert und verifiziert." },
  ],
  seo: {
    title: "Umzugsfirmen Basel – Vergleichen & bis zu 40% sparen",
    description: "Vergleichen Sie Umzugsfirmen in Basel. Kostenlose Offerten von geprüften Unternehmen. ✓ Dreiländer-Experten ✓ 100% gratis",
    keywords: "Umzug Basel, Umzugsfirma Basel, Zügelfirma Basel, Umzugsunternehmen Basel",
  },
  localInfo: {
    title: "Umzug in Basel – Informationen",
    paragraphs: [
      { text: "Basel ist die drittgrösste Stadt der Schweiz und liegt im Dreiländereck an der Grenze zu Deutschland und Frankreich. Die Stadt ist bekannt für ihre Museen, die Pharma-Industrie und die historische Altstadt." },
      { title: "Grenzüberschreitende Umzüge", text: "Viele Basler ziehen in die grenznahen Gebiete in Deutschland oder Frankreich. Professionelle Umzugsfirmen sind auf diese besonderen Anforderungen spezialisiert." },
      { title: "Parkbewilligung und Altstadt", text: "Für Umzüge in Basel ist eine Parkbewilligung erforderlich. Besonders in der Altstadt können enge Gassen zusätzliche Herausforderungen darstellen." },
    ],
  },
  notificationCity: "Binningen",
  activeUsersBase: 14,
};
