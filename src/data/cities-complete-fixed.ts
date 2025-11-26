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
    neighboringCities: ["winterthur", "zug", "luzern"]
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
    neighboringCities: ["biel", "luzern", "basel"]
  }
};

export function getCityData(slug: string): CityData {
  return swissCities[slug] || swissCities["zuerich"];
}
