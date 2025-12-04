import { CantonConfig } from '@/components/canton/CantonTemplate';
import { Home, Building2, Globe, Sparkles, Trash2, Package, Waves, Building, Wine } from 'lucide-react';

export const schaffhausenConfig: CantonConfig = {
  name: "Schaffhausen",
  slug: "schaffhausen",
  tagline: "Umzug am Rheinfall – Grenzregion Deutschland",
  icon: Waves,
  iconColor: "text-blue-600",
  cities: ["Schaffhausen", "Neuhausen am Rheinfall", "Stein am Rhein", "Thayngen", "Beringen", "Hallau"],
  
  companies: [
    { name: "Schaffhauser Umzüge AG", rating: 4.8, reviews: 123, priceLevel: "fair", sponsored: true, available: true, badge: "Seit 1980" },
    { name: "Rheinfall Transport", rating: 4.7, reviews: 98, priceLevel: "fair", sponsored: true, available: true, badge: "Grenzverkehr" },
    { name: "Munot Movers", rating: 4.6, reviews: 76, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Klettgau Umzüge", rating: 4.5, reviews: 54, priceLevel: "günstig", sponsored: false, available: true, badge: null },
    { name: "Stein am Rhein Transport", rating: 4.7, reviews: 45, priceLevel: "fair", sponsored: false, available: false, badge: null }
  ],
  
  priceExamples: [
    { size: "1-Zimmer Wohnung", range: "CHF 450 - 700", avg: "CHF 575" },
    { size: "3-Zimmer Wohnung", range: "CHF 900 - 1'400", avg: "CHF 1'150" },
    { size: "5-Zimmer Haus", range: "CHF 1'800 - 2'800", avg: "CHF 2'300" }
  ],
  
  services: [
    { name: "Privatumzug", icon: Home, link: "/privatumzug" },
    { name: "Firmenumzug", icon: Building2, link: "/firmenumzug" },
    { name: "Deutschland", icon: Globe, link: "/international" },
    { name: "Reinigung", icon: Sparkles, link: "/reinigung" },
    { name: "Entsorgung", icon: Trash2, link: "/entsorgung" },
    { name: "Lagerung", icon: Package, link: "/lagerung" }
  ],
  
  usps: [
    { title: "Rheinfall", desc: "Europas grösster Wasserfall", icon: Waves },
    { title: "Deutschland-Nähe", desc: "Grenzüberschreitende Umzüge", icon: Globe },
    { title: "Altstadt", desc: "Historische Erker-Häuser", icon: Building },
    { title: "Wein-Region", desc: "Schaffhauser Blauburgunder", icon: Wine }
  ],
  
  faqs: [
    { question: "Was kostet ein Umzug in Schaffhausen?", answer: "Ein Umzug in Schaffhausen kostet CHF 450 - 2'800 - günstiger als die Grossstädte Zürich oder Basel." },
    { question: "Gibt es Firmen für Umzüge nach Deutschland?", answer: "Ja, viele Schaffhauser Firmen sind auf grenzüberschreitende Umzüge nach Süddeutschland spezialisiert." },
    { question: "Wie sind die Zufahrtsbedingungen in der Altstadt?", answer: "Die historische Altstadt hat enge Gassen. Zufahrtszeiten sind beschränkt, Möbellifte oft notwendig." },
    { question: "Wie melde ich mich in Schaffhausen an?", answer: "Die Anmeldung erfolgt bei der Einwohnerkontrolle innerhalb von 14 Tagen nach dem Umzug." },
    { question: "Ist Schaffhausen eine Exklave?", answer: "Teilweise - der Kanton hat mehrere Exklaven, die von deutschem Gebiet umschlossen sind." }
  ],
  
  seo: {
    title: "Umzugsfirmen Schaffhausen vergleichen | Rheinfall | Umzugscheck.ch",
    description: "Vergleichen Sie die besten Umzugsfirmen in Schaffhausen. Grenzüberschreitende Umzüge. Bis zu 5 unverbindliche Offerten.",
    keywords: "Umzugsfirma Schaffhausen, Umzug Rheinfall, Deutschland Umzug"
  },
  
  localInfo: {
    title: "Umziehen im Kanton Schaffhausen",
    paragraphs: [
      { text: "Der Kanton Schaffhausen liegt im äussersten Norden der Schweiz und ist bekannt für den Rheinfall - Europas grössten Wasserfall." },
      { title: "An- und Abmeldung", text: "Die Anmeldung erfolgt bei der Einwohnerkontrolle Ihrer Gemeinde innerhalb von 14 Tagen." },
      { title: "Grenzregion", text: "Die Nähe zu Deutschland macht grenzüberschreitende Umzüge häufig. Viele Pendler wohnen hier und arbeiten in Zürich." },
      { title: "Gemeinden", text: "Schaffhausen (Hauptstadt), Neuhausen am Rheinfall, Stein am Rhein, Thayngen und die Klettgau-Gemeinden." }
    ]
  },
  
  notificationCity: "Schaffhausen",
  activeUsersBase: 6
};
