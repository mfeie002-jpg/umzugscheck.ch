import { Building2, Home, Package, Truck, Shield, Clock, TrendingUp, Mountain } from "lucide-react";
import { CantonConfig } from "@/components/canton/CantonTemplate";

export const luzernConfig: CantonConfig = {
  name: "Luzern",
  slug: "luzern",
  tagline: "Zentralschweiz",
  icon: Mountain,
  iconColor: "text-sky-600",
  cities: ["Luzern", "Emmen", "Kriens", "Ebikon", "Horw", "Sursee", "Hochdorf", "Willisau", "Rothenburg", "Root"],
  companies: [
    { name: "Luzern Umzüge AG", rating: 4.9, reviews: 367, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Pilatus Moving", rating: 4.8, reviews: 298, priceLevel: "günstig", sponsored: true, available: true, badge: "Preistipp" },
    { name: "Premium Zentralschweiz", rating: 4.8, reviews: 256, priceLevel: "premium", sponsored: false, available: true, badge: "Premium" },
    { name: "Vierwaldstättersee Transporte", rating: 4.7, reviews: 212, priceLevel: "fair", sponsored: false, available: true, badge: "Regional" },
    { name: "Seeland Umzüge Luzern", rating: 4.7, reviews: 178, priceLevel: "günstig", sponsored: false, available: true, badge: "Beliebt" },
    { name: "Entlebuch Moving GmbH", rating: 4.6, reviews: 145, priceLevel: "fair", sponsored: false, available: false, badge: null },
    { name: "Rontal Transporte", rating: 4.6, reviews: 123, priceLevel: "günstig", sponsored: false, available: true, badge: "Lokal" },
    { name: "Reuss Umzüge", rating: 4.5, reviews: 108, priceLevel: "premium", sponsored: false, available: true, badge: null },
    { name: "Emmen Express", rating: 4.5, reviews: 92, priceLevel: "fair", sponsored: false, available: true, badge: "Schnell" },
    { name: "Kriens Umzugsteam", rating: 4.4, reviews: 78, priceLevel: "günstig", sponsored: false, available: false, badge: null },
  ],
  priceExamples: [
    { size: "1-2 Zimmer", range: "CHF 480 - 880", avg: "CHF 680" },
    { size: "3-4 Zimmer", range: "CHF 960 - 1'650", avg: "CHF 1'250" },
    { size: "5+ Zimmer", range: "CHF 1'850 - 3'250", avg: "CHF 2'450" },
  ],
  services: [
    { name: "Umzug + Reinigung", icon: Home, link: "/umzug-mit-reinigung" },
    { name: "Firmenumzug", icon: Building2, link: "/firmenumzug-schweiz" },
    { name: "Möbellift", icon: Truck, link: "/moebellift" },
    { name: "Entsorgung", icon: Package, link: "/entsorgung-raeumung" },
    { name: "Einlagerung", icon: Package, link: "/einlagerung" },
    { name: "Kleintransporte", icon: Truck, link: "/kleintransporte" },
  ],
  usps: [
    { title: "Zentralschweiz-Experten", desc: "Lokale Firmen mit Bergregion-Erfahrung", icon: Mountain },
    { title: "Bis 40% sparen", desc: "Vergleichen Sie Luzerner Umzugsfirmen", icon: TrendingUp },
    { title: "Schnelle Offerten", desc: "Bis zu 5 Angebote in 24h", icon: Clock },
    { title: "Geprüfte Partner", desc: "Alle Firmen versichert und verifiziert", icon: Shield },
  ],
  faqs: [
    { question: "Was kostet ein Umzug in Luzern?", answer: "Ein Umzug in Luzern kostet zwischen CHF 480 und CHF 3'250 je nach Wohnungsgrösse. Die Preise in Luzern entsprechen etwa dem Schweizer Durchschnitt." },
    { question: "Gibt es Umzugsfirmen für Bergregionen?", answer: "Ja, mehrere unserer Partner sind auf Umzüge in schwer zugängliche Berggebiete spezialisiert." },
    { question: "Wie buche ich einen Umzug in Luzern?", answer: "Füllen Sie unser Formular in 2 Minuten aus und erhalten Sie bis zu 5 kostenlose Offerten von geprüften Luzerner Umzugsfirmen." },
    { question: "Brauche ich eine Parkbewilligung?", answer: "In der Altstadt von Luzern ist eine Parkbewilligung erforderlich. Unsere Partner helfen Ihnen bei der Beantragung." },
    { question: "Sind die Umzugsfirmen versichert?", answer: "Alle Unternehmen auf unserer Plattform sind vollständig versichert und verifiziert." },
  ],
  seo: {
    title: "Umzugsfirmen Luzern – Vergleichen & bis zu 40% sparen",
    description: "Vergleichen Sie Umzugsfirmen in Luzern. Kostenlose Offerten von geprüften Unternehmen. ✓ Zentralschweiz-Experten ✓ 100% gratis",
    keywords: "Umzug Luzern, Umzugsfirma Luzern, Zügelfirma Luzern, Umzugsunternehmen Zentralschweiz",
  },
  localInfo: {
    title: "Umzug in Luzern – Informationen",
    paragraphs: [
      { text: "Luzern ist das Tor zur Zentralschweiz und bietet eine einmalige Kombination aus Stadt und Natur. Die historische Altstadt und der Vierwaldstättersee machen die Stadt zu einem beliebten Wohnort." },
      { title: "Altstadt-Umzüge", text: "Umzüge in der Luzerner Altstadt erfordern besondere Planung aufgrund der engen Gassen und historischen Gebäude." },
      { title: "Zentralschweiz vernetzt", text: "Von Luzern aus sind alle umliegenden Kantone schnell erreichbar. Unsere Partner sind auf regionale Umzüge spezialisiert." },
    ],
  },
  notificationCity: "Emmen",
  activeUsersBase: 11,
};
