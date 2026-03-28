/**
 * Complete Swiss City Data - Fixed Version
 */

export interface CityData {
  name: string;
  slug: string;
  canton: string;
  description: string;
  priceExamples: { size: string; distance: string; priceRange: string; icon?: "home" | "trending" | "dollar" }[];
  advantages: string[];
  faqs: { question: string; answer: string }[];
  neighboringCities: string[];
  mainPostalCode: string; // Main postal code for pre-filling forms
}

const createPriceExample = (size: string, range: string, icon: "home" | "trending" | "dollar" = "home") => ({
  size,
  distance: size.includes("2") ? "innerorts" : size.includes("3") ? "bis 20km" : "bis 50km",
  priceRange: range,
  icon
});

export const swissCities: Record<string, CityData> = {
  "zuerich": {
    name: "Zürich",
    slug: "zuerich",
    canton: "Zürich",
    description: "Die grösste Stadt der Schweiz bietet eine Vielzahl an professionellen Umzugsfirmen mit exzellenter Qualität.",
    priceExamples: [
      createPriceExample("2 Zimmer", "CHF 800–1'200", "home"),
      createPriceExample("3 Zimmer", "CHF 1'200–1'800", "trending"),
      createPriceExample("4+ Zimmer", "CHF 1'800–3'000", "dollar")
    ],
    advantages: ["Kurzfristige Verfügbarkeit", "Lokale Teams mit Ortskenntnissen", "Faire Preise durch Wettbewerb"],
    faqs: [
      { question: "Was kostet ein Umzug in Zürich?", answer: "Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 1'200–1'800." },
      { question: "Welche Umzugsfirmen sind empfehlenswert?", answer: "Auf umzugscheck.ch finden Sie die am besten bewerteten Firmen." },
      { question: "Wie lange im Voraus buchen?", answer: "2-4 Wochen im Voraus ist ideal." }
    ],
    neighboringCities: ["winterthur", "zug", "luzern"],
    mainPostalCode: "8001"
  },
  "bern": {
    name: "Bern",
    slug: "bern",
    canton: "Bern",
    description: "Die Bundesstadt kombiniert historischen Charme mit moderner Infrastruktur.",
    priceExamples: [
      createPriceExample("2 Zimmer", "CHF 750–1'100", "home"),
      createPriceExample("3 Zimmer", "CHF 1'100–1'700", "trending"),
      createPriceExample("4+ Zimmer", "CHF 1'700–2'800", "dollar")
    ],
    advantages: ["Altstadtkompetenz", "Faire Preise", "Schnelle Verfügbarkeit"],
    faqs: [
      { question: "Was kostet ein Umzug in Bern?", answer: "Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'100–1'700." }
    ],
    neighboringCities: ["biel", "luzern", "basel"],
    mainPostalCode: "3011"
  },
  "basel": {
    name: "Basel",
    slug: "basel",
    canton: "Basel-Stadt",
    description: "Grenzstadt mit Erfahrung in nationalen und internationalen Umzügen.",
    priceExamples: [
      createPriceExample("2 Zimmer", "CHF 780–1'150", "home"),
      createPriceExample("3 Zimmer", "CHF 1'150–1'750", "trending"),
      createPriceExample("4+ Zimmer", "CHF 1'750–2'900", "dollar")
    ],
    advantages: ["Internationale Erfahrung", "Grenznahe Expertise", "Schnelle Abwicklung"],
    faqs: [
      { question: "Was kostet ein Umzug in Basel?", answer: "Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'150–1'750." }
    ],
    neighboringCities: ["luzern", "bern", "zuerich"],
    mainPostalCode: "4001"
  },
  "luzern": {
    name: "Luzern",
    slug: "luzern",
    canton: "Luzern",
    description: "Die Zentralschweizer Perle mit persönlichem Service und lokaler Expertise.",
    priceExamples: [
      createPriceExample("2 Zimmer", "CHF 720–1'080", "home"),
      createPriceExample("3 Zimmer", "CHF 1'080–1'650", "trending"),
      createPriceExample("4+ Zimmer", "CHF 1'650–2'700", "dollar")
    ],
    advantages: ["Persönlicher Service", "Lokale Expertise", "Faire Preise"],
    faqs: [
      { question: "Was kostet ein Umzug in Luzern?", answer: "Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'080–1'650." }
    ],
    neighboringCities: ["zug", "zuerich", "bern"],
    mainPostalCode: "6003"
  },
  "zug": {
    name: "Zug",
    slug: "zug",
    canton: "Zug",
    description: "Premium-Standort mit erstklassigen Umzugsservices für anspruchsvolle Kunden.",
    priceExamples: [
      createPriceExample("2 Zimmer", "CHF 900–1'350", "home"),
      createPriceExample("3 Zimmer", "CHF 1'350–2'000", "trending"),
      createPriceExample("4+ Zimmer", "CHF 2'000–3'200", "dollar")
    ],
    advantages: ["Premium Service", "Diskretion", "Hochwertige Ausstattung"],
    faqs: [
      { question: "Was kostet ein Umzug in Zug?", answer: "Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'350–2'000." }
    ],
    neighboringCities: ["zuerich", "luzern", "schwyz"],
    mainPostalCode: "6300"
  },
  "st-gallen": {
    name: "St. Gallen",
    slug: "st-gallen",
    canton: "St. Gallen",
    description: "Ostschweizer Zentrum mit erfahrenen Umzugsspezialisten.",
    priceExamples: [
      createPriceExample("2 Zimmer", "CHF 700–1'050", "home"),
      createPriceExample("3 Zimmer", "CHF 1'050–1'600", "trending"),
      createPriceExample("4+ Zimmer", "CHF 1'600–2'600", "dollar")
    ],
    advantages: ["Regionale Expertise", "Faire Preise", "Zuverlässigkeit"],
    faqs: [
      { question: "Was kostet ein Umzug in St. Gallen?", answer: "Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'050–1'600." }
    ],
    neighboringCities: ["zuerich", "winterthur", "konstanz"],
    mainPostalCode: "9000"
  },
  "winterthur": {
    name: "Winterthur",
    slug: "winterthur",
    canton: "Zürich",
    description: "Zweitgrösste Stadt des Kantons Zürich mit vielen lokalen Umzugsanbietern.",
    priceExamples: [
      createPriceExample("2 Zimmer", "CHF 750–1'100", "home"),
      createPriceExample("3 Zimmer", "CHF 1'100–1'700", "trending"),
      createPriceExample("4+ Zimmer", "CHF 1'700–2'800", "dollar")
    ],
    advantages: ["Lokale Expertise", "Kurze Wege", "Günstige Preise"],
    faqs: [
      { question: "Was kostet ein Umzug in Winterthur?", answer: "Ein 3-Zimmer-Umzug kostet durchschnittlich CHF 1'100–1'700." }
    ],
    neighboringCities: ["zuerich", "st-gallen", "schaffhausen"],
    mainPostalCode: "8400"
  }
};

export function getCityData(slug: string): CityData {
  return swissCities[slug] || swissCities["zuerich"];
}
