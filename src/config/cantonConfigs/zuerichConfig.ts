import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Sparkles, Trash2, ArrowUpFromLine, Package, TrendingUp, Globe, GraduationCap, Car } from 'lucide-react';

export const zuerichConfig: CantonConfig = {
  name: "Zürich",
  slug: "zuerich",
  tagline: "Umzug in der grössten Schweizer Stadt",
  icon: Building2,
  iconColor: "text-blue-700",
  cities: ["Zürich", "Winterthur", "Uster", "Dübendorf", "Dietikon", "Wädenswil", "Horgen", "Kloten"],
  
  companies: [
    { name: "Zürich Umzüge AG", rating: 4.9, reviews: 487, priceLevel: "premium", sponsored: true, available: true, badge: "Top bewertet" },
    { name: "Limmat Moving", rating: 4.8, reviews: 342, priceLevel: "fair", sponsored: true, available: true, badge: null },
    { name: "City Movers Zürich", rating: 4.7, reviews: 298, priceLevel: "günstig", sponsored: false, available: true, badge: "Studentenrabatt" },
    { name: "Zürcher Qualitätsumzüge", rating: 4.8, reviews: 256, priceLevel: "premium", sponsored: false, available: true, badge: null },
    { name: "Express Umzug ZH", rating: 4.6, reviews: 189, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 600 - 900", avg: "CHF 750" },
    { size: "3-Zimmer Wohnung", range: "CHF 1'200 - 1'800", avg: "CHF 1'500" },
    { size: "5-Zimmer Haus", range: "CHF 2'500 - 4'000", avg: "CHF 3'250" }
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
    { title: "Finanzmetropole", desc: "Spezialisierte Umzüge für Banking & Finance", icon: TrendingUp },
    { title: "Multikulti-Stadt", desc: "Mehrsprachiger Service für internationale Kunden", icon: Globe },
    { title: "ETH & Uni Zürich", desc: "Spezialangebote für Studierende und Akademiker", icon: GraduationCap },
    { title: "Stadtverkehr", desc: "Erfahrung mit Parkplatzbewirtschaftung", icon: Car }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Zürich?", answer: "Ein Umzug in Zürich kostet je nach Wohnungsgrösse zwischen CHF 600 und CHF 4'000. Die Stadt Zürich hat höhere Preise aufgrund von Parkgebühren und Verkehr." },
    { question: "Brauche ich eine Parkbewilligung für den Umzug?", answer: "Ja, in der Stadt Zürich benötigen Sie eine Halteverbot-Bewilligung. Diese kostet ca. CHF 80-150 und sollte 2 Wochen im Voraus beantragt werden." },
    { question: "Gibt es Umzugsfirmen für Firmenumzüge in Zürich?", answer: "Ja, viele Zürcher Umzugsfirmen sind auf Büroumzüge spezialisiert und bieten IT-Equipment-Transport sowie Wochenendumzüge an." },
    { question: "Wann ist die beste Zeit für einen Umzug in Zürich?", answer: "Die ruhigsten Zeiten sind Januar bis März. Ende Monat und Semesterende sind besonders gefragt und teurer." },
    { question: "Bieten Zürcher Umzugsfirmen auch Reinigung an?", answer: "Ja, die meisten Umzugsfirmen bieten Komplett-Pakete mit Endreinigung nach Zürcher Standard an." }
  ],
  
  seo: {
    title: "Umzugsfirmen Zürich vergleichen | Bis 40% sparen | Umzugscheck.ch",
    description: "Vergleichen Sie kostenlos die besten Umzugsfirmen in Zürich. Erhalten Sie bis zu 5 unverbindliche Offerten und sparen Sie bis zu 40% bei Ihrem Umzug.",
    keywords: "Umzugsfirma Zürich, Umzug Zürich, Umzugsunternehmen Zürich"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Zürich",
    paragraphs: [
      { text: "Der Kanton Zürich ist mit über 1.5 Millionen Einwohnern der bevölkerungsreichste Kanton der Schweiz. Die Stadt Zürich als Wirtschaftszentrum zieht jährlich tausende Neuzuzüger an." },
      { title: "An- und Abmeldung", text: "Die Anmeldung beim Einwohneramt muss innerhalb von 14 Tagen nach dem Umzug erfolgen. In der Stadt Zürich können Sie dies online über das eUmzug-Portal erledigen." },
      { title: "Parkierung und Verkehr", text: "In den Stadtkreisen 1-8 ist eine Halteverbot-Bewilligung für Umzugsfahrzeuge obligatorisch. Planen Sie genügend Zeit für den Stadtverkehr ein, besonders während der Stosszeiten." },
      { title: "Beliebte Umzugsziele", text: "Die beliebtesten Quartiere sind Seefeld, Wipkingen, Oerlikon und Altstetten. Ausserhalb der Stadt sind Winterthur, Uster und Dübendorf gefragte Wohnorte." }
    ]
  },
  
  notificationCity: "Zürich",
  activeUsersBase: 28
};
