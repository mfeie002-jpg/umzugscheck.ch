import { Building2, Home, Package, Truck, Shield, Clock, TrendingUp, Factory } from "lucide-react";
import { CantonConfig } from "@/components/canton/CantonTemplate";

export const aargauConfig: CantonConfig = {
  name: "Aargau",
  slug: "aargau",
  tagline: "Industriekanton",
  icon: Factory,
  iconColor: "text-orange-600",
  cities: ["Aarau", "Baden", "Wettingen", "Brugg", "Zofingen", "Rheinfelden", "Wohlen", "Lenzburg", "Windisch", "Oftringen"],
  companies: [
    { name: "Aargau Umzüge AG", rating: 4.9, reviews: 378, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Baden Moving", rating: 4.8, reviews: 312, priceLevel: "günstig", sponsored: true, available: true, badge: "Preistipp" },
    { name: "Premium Aargau Relocation", rating: 4.8, reviews: 267, priceLevel: "premium", sponsored: false, available: true, badge: "Premium" },
    { name: "Limmat-Tal Transporte", rating: 4.7, reviews: 223, priceLevel: "fair", sponsored: false, available: true, badge: "Regional" },
    { name: "Freiamt Umzüge", rating: 4.7, reviews: 189, priceLevel: "günstig", sponsored: false, available: true, badge: "Beliebt" },
    { name: "Wynental Moving GmbH", rating: 4.6, reviews: 156, priceLevel: "fair", sponsored: false, available: false, badge: null },
    { name: "Industriekanton Transporte", rating: 4.6, reviews: 134, priceLevel: "günstig", sponsored: false, available: true, badge: "Lokal" },
    { name: "Hallwilersee Umzüge", rating: 4.5, reviews: 112, priceLevel: "premium", sponsored: false, available: true, badge: null },
    { name: "Aaretal Express", rating: 4.5, reviews: 98, priceLevel: "fair", sponsored: false, available: true, badge: "Schnell" },
    { name: "Reussebene Umzugsteam", rating: 4.4, reviews: 76, priceLevel: "günstig", sponsored: false, available: false, badge: null },
  ],
  priceExamples: [
    { size: "1-2 Zimmer", range: "CHF 450 - 850", avg: "CHF 650" },
    { size: "3-4 Zimmer", range: "CHF 900 - 1'550", avg: "CHF 1'190" },
    { size: "5+ Zimmer", range: "CHF 1'750 - 3'150", avg: "CHF 2'390" },
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
    { title: "Zentrale Lage", desc: "Schnelle Verbindungen in alle Richtungen", icon: Factory },
    { title: "Bis 40% sparen", desc: "Vergleichen Sie Aargauer Umzugsfirmen", icon: TrendingUp },
    { title: "Schnelle Offerten", desc: "Bis zu 5 Angebote in 24h", icon: Clock },
    { title: "Geprüfte Partner", desc: "Alle Firmen versichert und verifiziert", icon: Shield },
  ],
  faqs: [
    { question: "Was kostet ein Umzug im Aargau?", answer: "Ein Umzug im Aargau kostet zwischen CHF 450 und CHF 3'150 je nach Wohnungsgrösse. Die Preise im Aargau sind günstiger als in Zürich oder Basel." },
    { question: "Welche Umzugsfirma ist die beste im Aargau?", answer: "Die besten Umzugsfirmen im Aargau haben Bewertungen von 4.8 oder höher und sind auf regionale Umzüge spezialisiert." },
    { question: "Wie buche ich einen Umzug im Aargau?", answer: "Füllen Sie unser Formular in 2 Minuten aus und erhalten Sie bis zu 5 kostenlose Offerten von geprüften Aargauer Umzugsfirmen." },
    { question: "Gibt es Firmenumzüge im Aargau?", answer: "Ja, mehrere unserer Partner sind auf Firmenumzüge im Industriekanton Aargau spezialisiert." },
    { question: "Sind die Umzugsfirmen versichert?", answer: "Alle Unternehmen auf unserer Plattform sind vollständig versichert und verifiziert." },
  ],
  seo: {
    title: "Umzugsfirmen Aargau – Vergleichen & bis zu 40% sparen",
    description: "Vergleichen Sie Umzugsfirmen im Aargau. Kostenlose Offerten von geprüften Unternehmen. ✓ Zentrale Lage ✓ 100% gratis",
    keywords: "Umzug Aargau, Umzugsfirma Aargau, Zügelfirma Aarau, Umzugsunternehmen Baden",
  },
  localInfo: {
    title: "Umzug im Aargau – Informationen",
    paragraphs: [
      { text: "Der Kanton Aargau liegt zentral in der Schweiz und ist bekannt als Industriekanton. Die gute Verkehrsanbindung macht ihn zu einem attraktiven Wohnort für Pendler nach Zürich, Basel und Bern." },
      { title: "Günstige Preise", text: "Umzugspreise im Aargau sind oft günstiger als in den grossen Städten, bei gleichbleibender Qualität der Dienstleistungen." },
      { title: "Pendler-Region", text: "Viele Aargauer pendeln in die umliegenden Grossstädte. Unsere Partner sind auf Umzüge zwischen dem Aargau und den Nachbarkantonen spezialisiert." },
    ],
  },
  notificationCity: "Baden",
  activeUsersBase: 12,
};
