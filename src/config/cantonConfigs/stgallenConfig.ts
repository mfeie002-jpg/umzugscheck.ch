import { Building2, Home, Package, Truck, Shield, Clock, TrendingUp, BookOpen } from "lucide-react";
import { CantonConfig } from "@/components/canton/CantonTemplate";

export const stgallenConfig: CantonConfig = {
  name: "St. Gallen",
  slug: "stgallen",
  tagline: "Ostschweiz-Zentrum",
  icon: BookOpen,
  iconColor: "text-emerald-600",
  cities: ["St. Gallen", "Rapperswil-Jona", "Wil", "Gossau", "Buchs", "Uzwil", "Altstätten", "Rorschach", "Flawil", "Herisau"],
  companies: [
    { name: "St. Gallen Umzüge AG", rating: 4.9, reviews: 345, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Ostschweiz Moving", rating: 4.8, reviews: 287, priceLevel: "günstig", sponsored: true, available: true, badge: "Preistipp" },
    { name: "Premium St. Gallen", rating: 4.8, reviews: 234, priceLevel: "premium", sponsored: false, available: true, badge: "Premium" },
    { name: "Bodensee Transporte", rating: 4.7, reviews: 198, priceLevel: "fair", sponsored: false, available: true, badge: "Regional" },
    { name: "Fürstenland Umzüge", rating: 4.7, reviews: 167, priceLevel: "günstig", sponsored: false, available: true, badge: "Beliebt" },
    { name: "Rheintal Moving GmbH", rating: 4.6, reviews: 143, priceLevel: "fair", sponsored: false, available: false, badge: null },
    { name: "Toggenburg Transporte", rating: 4.6, reviews: 121, priceLevel: "günstig", sponsored: false, available: true, badge: "Lokal" },
    { name: "Säntis Umzüge", rating: 4.5, reviews: 98, priceLevel: "premium", sponsored: false, available: true, badge: null },
    { name: "Wil Express", rating: 4.5, reviews: 87, priceLevel: "fair", sponsored: false, available: true, badge: "Schnell" },
    { name: "Rorschach Umzugsteam", rating: 4.4, reviews: 76, priceLevel: "günstig", sponsored: false, available: false, badge: null },
  ],
  priceExamples: [
    { size: "1-2 Zimmer", range: "CHF 460 - 860", avg: "CHF 660" },
    { size: "3-4 Zimmer", range: "CHF 920 - 1'590", avg: "CHF 1'220" },
    { size: "5+ Zimmer", range: "CHF 1'780 - 3'180", avg: "CHF 2'390" },
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
    { title: "Ostschweiz-Experten", desc: "Lokale Firmen mit Bodensee-Region Erfahrung", icon: BookOpen },
    { title: "Bis 40% sparen", desc: "Vergleichen Sie St. Galler Umzugsfirmen", icon: TrendingUp },
    { title: "Schnelle Offerten", desc: "Bis zu 5 Angebote in 24h", icon: Clock },
    { title: "Geprüfte Partner", desc: "Alle Firmen versichert und verifiziert", icon: Shield },
  ],
  faqs: [
    { question: "Was kostet ein Umzug in St. Gallen?", answer: "Ein Umzug in St. Gallen kostet zwischen CHF 460 und CHF 3'180 je nach Wohnungsgrösse. Die Preise in St. Gallen sind moderat." },
    { question: "Gibt es Umzugsfirmen für das Rheintal?", answer: "Ja, mehrere unserer Partner sind auf Umzüge im Rheintal und in Richtung Österreich spezialisiert." },
    { question: "Wie buche ich einen Umzug in St. Gallen?", answer: "Füllen Sie unser Formular in 2 Minuten aus und erhalten Sie bis zu 5 kostenlose Offerten von geprüften St. Galler Umzugsfirmen." },
    { question: "Brauche ich eine Parkbewilligung?", answer: "In der Altstadt von St. Gallen ist eine Parkbewilligung erforderlich. Unsere Partner unterstützen Sie dabei." },
    { question: "Sind die Umzugsfirmen versichert?", answer: "Alle Unternehmen auf unserer Plattform sind vollständig versichert und verifiziert." },
  ],
  seo: {
    title: "Umzugsfirmen St. Gallen – Vergleichen & bis zu 40% sparen",
    description: "Vergleichen Sie Umzugsfirmen in St. Gallen. Kostenlose Offerten von geprüften Unternehmen. ✓ Ostschweiz-Experten ✓ 100% gratis",
    keywords: "Umzug St. Gallen, Umzugsfirma St. Gallen, Zügelfirma Ostschweiz, Umzugsunternehmen Bodensee",
  },
  localInfo: {
    title: "Umzug in St. Gallen – Informationen",
    paragraphs: [
      { text: "St. Gallen ist das Zentrum der Ostschweiz und bekannt für seine UNESCO-Weltkulturerbe Stiftsbibliothek. Die Stadt verbindet historisches Erbe mit moderner Wirtschaft." },
      { title: "Bodensee-Region", text: "Die Nähe zum Bodensee macht St. Gallen zu einem attraktiven Wohnort. Viele Umzüge führen in die umliegenden Gemeinden am See." },
      { title: "Grenznahe Umzüge", text: "Für Umzüge nach Österreich oder Liechtenstein sind unsere Partner bestens gerüstet. Sie kennen die Zollbestimmungen und Anforderungen." },
    ],
  },
  notificationCity: "Gossau",
  activeUsersBase: 10,
};
