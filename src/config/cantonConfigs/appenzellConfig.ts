import { CantonConfig } from "@/components/canton/CantonTemplate";
import { Building2, Truck, Sparkles, Trash2, Package, Wrench, Shield, Clock, TrendingUp, CheckCircle, Mountain } from "lucide-react";

export const appenzellConfig: CantonConfig = {
  name: "Appenzell",
  slug: "appenzell",
  tagline: "Ihr Umzug im Appenzellerland",
  icon: Mountain,
  iconColor: "text-amber-600",
  cities: ["Appenzell", "Herisau", "Teufen", "Speicher", "Heiden", "Bühler", "Urnäsch"],
  companies: [
    { name: "Appenzeller Umzüge", rating: 4.7, reviews: 67, priceLevel: "fair", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Säntis Moving", rating: 4.6, reviews: 54, priceLevel: "günstig", sponsored: true, available: true, badge: "Beliebt" },
    { name: "Ausserrhoden Trans", rating: 4.5, reviews: 43, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Innerrhoden Express", rating: 4.4, reviews: 38, priceLevel: "günstig", sponsored: false, available: true, badge: null },
  ],
  priceExamples: [
    { size: "1-2 Zimmer", range: "CHF 550 - 950", avg: "CHF 750" },
    { size: "3-4 Zimmer", range: "CHF 1'000 - 1'800", avg: "CHF 1'400" },
    { size: "5+ Zimmer", range: "CHF 2'000 - 3'500", avg: "CHF 2'750" },
  ],
  services: [
    { name: "Privatumzug", icon: Truck, link: "/privatumzug" },
    { name: "Firmenumzug", icon: Building2, link: "/firmenumzug" },
    { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
    { name: "Entsorgung", icon: Trash2, link: "/entsorgung" },
    { name: "Lagerung", icon: Package, link: "/lagerung" },
    { name: "Montage", icon: Wrench, link: "/montage" },
  ],
  usps: [
    { title: "Geprüfte Firmen", desc: "Alle Appenzeller Umzugsfirmen sind verifiziert", icon: Shield },
    { title: "Lokale Expertise", desc: "Erfahrene Teams kennen jedes Dorf", icon: Mountain },
    { title: "Beste Preise", desc: "Transparente Preise ohne versteckte Kosten", icon: TrendingUp },
    { title: "Qualitätsgarantie", desc: "100% Zufriedenheit oder Geld zurück", icon: CheckCircle },
  ],
  faqs: [
    { question: "Was kostet ein Umzug in Appenzell?", answer: "Ein Umzug kostet zwischen CHF 550 und CHF 3'500 je nach Wohnungsgrösse." },
    { question: "Wie finde ich eine günstige Umzugsfirma?", answer: "Vergleichen Sie kostenlos Offerten auf umzugscheck.ch." },
    { question: "Wann ist die beste Zeit für einen Umzug?", answer: "Frühling und Herbst sind ideal." },
    { question: "Brauche ich eine Umzugsbewilligung?", answer: "Für Halteverbotszonen benötigen Sie eine Bewilligung der Gemeinde." },
    { question: "Wie lange dauert ein Umzug?", answer: "Ein lokaler Umzug dauert je nach Grösse 3-6 Stunden." },
  ],
  seo: {
    title: "Umzugsfirmen Appenzell vergleichen | Bis 40% sparen",
    description: "Die besten Umzugsfirmen in Appenzell vergleichen. Kostenlose Offerten, faire Preise.",
    keywords: "Umzug Appenzell, Umzugsfirma Appenzell, Appenzell Umzug Kosten",
  },
  localInfo: {
    title: "Umzug in Appenzell - Was Sie wissen müssen",
    paragraphs: [
      { title: "An- und Abmeldung", text: "Die Anmeldung muss innerhalb von 14 Tagen bei der Einwohnerkontrolle erfolgen." },
      { text: "Das Appenzellerland ist bekannt für seine hügelige Landschaft. Die Umzugsfirmen kennen alle Orte." },
    ],
  },
  notificationCity: "Appenzell",
  activeUsersBase: 8,
};
