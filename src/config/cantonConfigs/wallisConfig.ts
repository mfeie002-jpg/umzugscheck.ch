import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Mountain, Sparkles, Trash2, Package, Globe, Languages, Snowflake, Wine } from 'lucide-react';

export const wallisConfig: CantonConfig = {
  name: "Wallis",
  slug: "wallis",
  tagline: "Umzug in den Alpen – Zermatt & Bergdörfer",
  icon: Mountain,
  iconColor: "text-orange-600",
  cities: ["Sion", "Sierre", "Brig", "Visp", "Zermatt", "Verbier", "Crans-Montana", "Saas-Fee"],
  
  companies: [
    { name: "Valais Déménagements", rating: 4.8, reviews: 198, priceLevel: "fair", sponsored: true, available: true, badge: "Leader" },
    { name: "Zermatt Moving Services", rating: 4.9, reviews: 156, priceLevel: "premium", sponsored: true, available: true, badge: "Autofrei-Experte" },
    { name: "Sion Transport SA", rating: 4.7, reviews: 134, priceLevel: "fair", sponsored: false, available: true, badge: null },
    { name: "Oberwallis Umzüge", rating: 4.6, reviews: 112, priceLevel: "fair", sponsored: false, available: true, badge: "Deutsch" },
    { name: "Verbier Relocation", rating: 4.8, reviews: 89, priceLevel: "premium", sponsored: false, available: false, badge: "Premium" }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 550 - 900", avg: "CHF 725" },
    { size: "3-Zimmer Wohnung", range: "CHF 1'100 - 1'800", avg: "CHF 1'450" },
    { size: "Chalet Bergstation", range: "CHF 2'500 - 6'000", avg: "CHF 4'250" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Chaletumzug", icon: Mountain, link: "/chaletumzug" },
    { name: "Nettoyage", icon: Sparkles, link: "/reinigung" },
    { name: "Débarras", icon: Trash2, link: "/entsorgung" },
    { name: "Stockage", icon: Package, link: "/lagerung" },
    { name: "International", icon: Globe, link: "/international" }
  ],
  
  usps: [
    { title: "Matterhorn-Region", desc: "Zermatt-Spezialisten (autofrei)", icon: Mountain },
    { title: "Zweisprachig", desc: "Service DE & FR", icon: Languages },
    { title: "Skigebiete", desc: "Verbier, Crans-Montana, Saas-Fee", icon: Snowflake },
    { title: "Weinregion", desc: "Kenntnis der Rebdörfer", icon: Wine }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug im Wallis?", answer: "Ein Umzug im Wallis kostet CHF 550 - 6'000. Bergstationen wie Zermatt oder Saas-Fee sind aufgrund Speziallogistik teurer." },
    { question: "Wie funktioniert ein Umzug nach Zermatt?", answer: "Zermatt ist autofrei. Güter werden per Bahn transportiert und vor Ort mit Elektrofahrzeugen verteilt. Spezialfirmen sind notwendig." },
    { question: "Gibt es zweisprachige Umzugsfirmen?", answer: "Ja, die meisten Walliser Firmen bieten Service auf Deutsch und Französisch an." },
    { question: "Wann ist die beste Zeit für Chaletumzüge?", answer: "Frühling (April-Mai) und Herbst (September-Oktober) zwischen den Saisons sind ideal." },
    { question: "Wo melde ich mich im Wallis an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." }
  ],
  
  seo: {
    title: "Umzugsfirmen Wallis vergleichen | Berg-Spezialisten | Umzugscheck.ch",
    description: "Vergleichen Sie spezialisierte Umzugsfirmen im Wallis. Experten für Zermatt, Verbier und Bergumzüge. Bis zu 5 Offerten.",
    keywords: "Umzugsfirma Wallis, Umzug Zermatt, Umzug Verbier, Chalet Umzug"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Wallis",
    paragraphs: [
      { text: "Das Wallis ist der drittgrösste Kanton der Schweiz und erstreckt sich entlang des Rhonetals von den höchsten Alpengipfeln bis zu den Rebbergen." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Gemeindeverwaltung. Im Oberwallis auf Deutsch, im Unterwallis auf Französisch." },
      { title: "Besondere Herausforderungen", text: "Autofreie Orte (Zermatt, Saas-Fee), steile Bergstrassen und saisonale Zugänglichkeit erfordern spezialisierte Umzugsfirmen." },
      { title: "Beliebte Regionen", text: "Sion (Hauptstadt), Sierre, Brig, Visp im Tal. Zermatt, Verbier, Crans-Montana, Saas-Fee und Leukerbad in den Bergen." }
    ]
  },
  
  notificationCity: "Sion",
  activeUsersBase: 11
};
