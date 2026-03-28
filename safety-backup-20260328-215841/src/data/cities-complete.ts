/**
 * Complete Swiss City Data for All 14 Major Cities
 * Used for dynamic city page generation with localized content
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

export const swissCities: Record<string, CityData> = {
  "zuerich": {
    name: "Zürich",
    slug: "zuerich",
    canton: "Zürich",
    description: "Die grösste Stadt der Schweiz bietet eine Vielzahl an professionellen Umzugsfirmen mit exzellenter Qualität.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 800–1'200", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'200–1'800", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'800–3'000", icon: "dollar" }
    ],
    advantages: [
      "Kurzfristige Verfügbarkeit",
      "Lokale Teams mit Ortskenntnissen",
      "Faire Preise durch Wettbewerb"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Zürich?", answer: "Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 1'200–1'800, abhängig von Stockwerk, Distanz und Zusatzservices." },
      { question: "Welche Umzugsfirmen sind in Zürich empfehlenswert?", answer: "Auf umzugscheck.ch finden Sie die am besten bewerteten Zürcher Umzugsfirmen mit echten Kundenbewertungen." },
      { question: "Wie lange im Voraus sollte ich buchen?", answer: "2-4 Wochen im Voraus ist ideal. Express-Umzüge sind bei manchen Anbietern auch kurzfristiger möglich." }
    ],
    neighboringCities: ["winterthur", "zug", "luzern"]
  },
  "bern": {
    name: "Bern",
    slug: "bern",
    canton: "Bern",
    description: "Die Bundesstadt kombiniert historischen Charme mit moderner Infrastruktur und erfahrenen Umzugsprofis.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 750–1'100", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'100–1'700", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'700–2'800", icon: "dollar" }
    ],
    advantages: [
      "Altstadtkompetenz der lokalen Firmen",
      "Faire Preise für Qualität",
      "Schnelle Verfügbarkeit"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Bern?", answer: "Ein 3-Zimmer-Umzug kostet in Bern durchschnittlich CHF 1'100–1'700." },
      { question: "Können Umzüge in der Altstadt durchgeführt werden?", answer: "Ja, lokale Firmen kennen sich mit Altstadtumzügen und Parkbewilligungen aus." },
      { question: "Welche Services sind verfügbar?", answer: "Umzug, Reinigung, Entsorgung, Lagerung und Möbelmontage." }
    ],
    neighboringCities: ["biel", "luzern", "basel"]
  },
  "basel": {
    name: "Basel",
    slug: "basel",
    canton: "Basel-Stadt",
    description: "Basel im Dreiländereck bietet erstklassige Umzugsfirmen für nationale und internationale Umzüge.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 800–1'150", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'150–1'750", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'750–2'900", icon: "dollar" }
    ],
    advantages: [
      "Internationale Umzugserfahrung",
      "Mehrsprachige Teams",
      "Moderne Infrastruktur"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Basel?", answer: "Ein 3-Zimmer-Umzug innerorts kostet durchschnittlich CHF 1'150–1'750." },
      { question: "Sind internationale Umzüge möglich?", answer: "Ja, viele Basler Firmen sind auf grenzüberschreitende Umzüge spezialisiert." },
      { question: "Wie weit im Voraus sollte ich buchen?", answer: "2-3 Wochen Vorlaufzeit ist optimal. Express-Service ist oft verfügbar." }
    ],
    neighboringCities: ["bern", "aarau", "biel"]
  },
  "genf": {
    name: "Genf",
    slug: "genf",
    canton: "Genève",
    description: "Die internationale Stadt am Genfersee mit erfahrenen mehrsprachigen Umzugsteams.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 850–1'250", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'250–1'900", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'900–3'200", icon: "dollar" }
    ],
    advantages: [
      "Internationale Erfahrung",
      "Mehrsprachige Teams (FR/EN/DE)",
      "Grenzüberschreitende Umzüge"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Genf?", answer: "Ein 3-Zimmer-Umzug kostet in Genf CHF 1'250–1'900." },
      { question: "Sprechen die Teams Französisch?", answer: "Ja, alle Genfer Umzugsfirmen bieten französischsprachige Teams." },
      { question: "Sind internationale Umzüge möglich?", answer: "Ja, Genfer Firmen sind spezialisiert auf grenzüberschreitende Umzüge nach Frankreich." }
    ],
    neighboringCities: ["lausanne", "bern", "luzern"]
  },
  "lausanne": {
    name: "Lausanne",
    slug: "lausanne",
    canton: "Vaud",
    description: "Die Olympiastadt am Genfersee bietet qualifizierte Umzugsfirmen mit regionaler Expertise.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 800–1'200", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'200–1'800", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'800–3'000", icon: "dollar" }
    ],
    advantages: [
      "Regionale Expertise",
      "Französisch- und deutschsprachige Teams",
      "Faire Preise"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Lausanne?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'200–1'800." },
      { question: "Gibt es deutschsprachige Umzugsfirmen?", answer: "Ja, viele Firmen bieten mehrsprachige Teams." },
      { question: "Wie lange dauert ein Umzug?", answer: "Ein 3-Zimmer-Umzug dauert durchschnittlich 4-6 Stunden." }
    ],
    neighboringCities: ["genf", "bern", "luzern"]
  },
  "luzern": {
    name: "Luzern",
    slug: "luzern",
    canton: "Luzern",
    description: "Die Zentralschweizer Stadt bietet professionelle Umzugsfirmen mit regionaler Kompetenz.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 750–1'150", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'150–1'750", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'750–2'900", icon: "dollar" }
    ],
    advantages: [
      "Zentrale Lage in der Schweiz",
      "Erfahrene lokale Teams",
      "Gutes Preis-Leistungs-Verhältnis"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Luzern?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'150–1'750." },
      { question: "Wie weit im Voraus sollte ich buchen?", answer: "2-3 Wochen Vorlaufzeit ist empfohlen." },
      { question: "Welche Zusatzservices gibt es?", answer: "Reinigung, Entsorgung, Lagerung und Möbelmontage." }
    ],
    neighboringCities: ["zuerich", "zug", "bern"]
  },
  "winterthur": {
    name: "Winterthur",
    slug: "winterthur",
    canton: "Zürich",
    description: "Die grösste Stadt im Kanton Zürich ausserhalb der Hauptstadt bietet erstklassige Umzugsservices.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 750–1'100", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'100–1'700", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'700–2'800", icon: "dollar" }
    ],
    advantages: [
      "Günstigere Preise als Zürich",
      "Schnelle Verfügbarkeit",
      "Lokale Kenntnisse"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Winterthur?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'100–1'700." },
      { question: "Sind die Preise günstiger als in Zürich?", answer: "Ja, Winterthur bietet oft günstigere Tarife bei gleicher Qualität." },
      { question: "Können Umzüge nach Zürich durchgeführt werden?", answer: "Ja, viele Firmen bieten Umzüge zwischen Winterthur und Zürich an." }
    ],
    neighboringCities: ["zuerich", "stgallen", "schaffhausen"]
  },
  "stgallen": {
    name: "St. Gallen",
    slug: "stgallen",
    canton: "St. Gallen",
    description: "Die Ostschweizer Metropole mit erfahrenen Umzugsfirmen und regionaler Expertise.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 700–1'050", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'050–1'650", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'650–2'700", icon: "dollar" }
    ],
    advantages: [
      "Regionale Expertise Ostschweiz",
      "Faire Preise",
      "Schnelle Reaktionszeiten"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in St. Gallen?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'050–1'650." },
      { question: "Gibt es Express-Umzüge?", answer: "Ja, viele Firmen bieten kurzfristige Umzüge an." },
      { question: "Welche Regionen werden bedient?", answer: "Gesamte Ostschweiz inkl. Appenzell und Thurgau." }
    ],
    neighboringCities: ["winterthur", "zuerich", "chur"]
  },
  "zug": {
    name: "Zug",
    slug: "zug",
    canton: "Zug",
    description: "Die wohlhabende Zuger Wirtschaftsmetropole mit Premium-Umzugsservices.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 800–1'200", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'200–1'850", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'850–3'100", icon: "dollar" }
    ],
    advantages: [
      "Premium-Services",
      "Hohe Qualitätsstandards",
      "Zentrale Lage"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Zug?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'200–1'850." },
      { question: "Gibt es Premium-Umzugsservices?", answer: "Ja, Zug bietet gehobene Umzugsservices mit Vollservice." },
      { question: "Wie schnell sind die Teams verfügbar?", answer: "Oft innerhalb 1-2 Wochen, Express auch kurzfristiger." }
    ],
    neighboringCities: ["zuerich", "luzern", "aarau"]
  },
  "lugano": {
    name: "Lugano",
    slug: "lugano",
    canton: "Ticino",
    description: "Die grösste Stadt im Tessin mit italienischsprachigen Umzugsteams.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 750–1'150", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'150–1'750", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'750–2'900", icon: "dollar" }
    ],
    advantages: [
      "Italienischsprachige Teams",
      "Regionale Tessin-Expertise",
      "Internationale Umzüge nach Italien"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Lugano?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'150–1'750." },
      { question: "Sprechen die Teams Italienisch?", answer: "Ja, alle Tessiner Firmen bieten italienischsprachige Teams." },
      { question: "Sind Umzüge nach Italien möglich?", answer: "Ja, viele Firmen sind auf grenzüberschreitende Umzüge spezialisiert." }
    ],
    neighboringCities: ["bern", "luzern", "zuerich"]
  },
  "biel": {
    name: "Biel/Bienne",
    slug: "biel",
    canton: "Bern",
    description: "Die zweisprachige Stadt mit französisch- und deutschsprachigen Umzugsteams.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 700–1'050", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'050–1'600", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'600–2'700", icon: "dollar" }
    ],
    advantages: [
      "Zweisprachige Teams (DE/FR)",
      "Günstige Preise",
      "Regionale Expertise"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Biel?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'050–1'600." },
      { question: "Gibt es zweisprachige Teams?", answer: "Ja, Biel bietet deutsch- und französischsprachige Umzugsteams." },
      { question: "Wie lange im Voraus buchen?", answer: "2-3 Wochen sind ideal." }
    ],
    neighboringCities: ["bern", "basel", "luzern"]
  },
  "aarau": {
    name: "Aarau",
    slug: "aarau",
    canton: "Aargau",
    description: "Die Aargauer Kantonshauptstadt mit professionellen Umzugsservices.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 700–1'050", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'050–1'650", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'650–2'750", icon: "dollar" }
    ],
    advantages: [
      "Zentrale Lage Mittelland",
      "Faire Preise",
      "Erfahrene Teams"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Aarau?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'050–1'650." },
      { question: "Welche Regionen werden bedient?", answer: "Gesamter Aargau und angrenzende Kantone." },
      { question: "Gibt es Kombi-Pakete?", answer: "Ja, Umzug + Reinigung aus einer Hand." }
    ],
    neighboringCities: ["basel", "zuerich", "zug"]
  },
  "schaffhausen": {
    name: "Schaffhausen",
    slug: "schaffhausen",
    canton: "Schaffhausen",
    description: "Die nördlichste Stadt der Schweiz mit regionalen Umzugsexperten.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 650–1'000", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'000–1'550", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'550–2'600", icon: "dollar" }
    ],
    advantages: [
      "Günstige Preise",
      "Regionale Kompetenz",
      "Nähe zu Deutschland"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Schaffhausen?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'000–1'550." },
      { question: "Sind Umzüge nach Deutschland möglich?", answer: "Ja, grenzüberschreitende Umzüge sind verfügbar." },
      { question: "Wie schnell sind die Teams?", answer: "Oft innerhalb 1-2 Wochen verfügbar." }
    ],
    neighboringCities: ["winterthur", "zuerich", "stgallen"]
  },
  "chur": {
    name: "Chur",
    slug: "chur",
    canton: "Graubünden",
    description: "Die älteste Stadt der Schweiz mit erfahrenen Bergumzugs-Spezialisten.",
    priceExamples: [
      { size: "2 Zimmer", distance: "innerorts", priceRange: "CHF 750–1'100", icon: "home" },
      { size: "3 Zimmer", distance: "bis 20km", priceRange: "CHF 1'100–1'700", icon: "trending" },
      { size: "4+ Zimmer", distance: "bis 50km", priceRange: "CHF 1'700–2'850", icon: "dollar" }
    ],
    advantages: [
      "Bergumzugs-Spezialisten",
      "Regionale Graubünden-Expertise",
      "Zuverlässige Teams"
    ],
    faqs: [
      { question: "Was kostet ein Umzug in Chur?", answer: "Ein 3-Zimmer-Umzug kostet CHF 1'100–1'700." },
      { question: "Gibt es Spezialisten für Bergumzüge?", answer: "Ja, Churer Firmen sind auf Bergregionen spezialisiert." },
      { question: "Welche Täler werden bedient?", answer: "Gesamtes Graubünden inkl. Engadin und Surselva." }
    ],
    neighboringCities: ["stgallen", "zuerich", "luzern"]
  }
};

export const getAllCitySlugs = (): string[] => {
  return Object.keys(swissCities);
};

export const getCityData = (slug: string): CityData | null => {
  return swissCities[slug] || null;
};
