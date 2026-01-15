# ChatGPT Data Generation Prompt
## Mission: Generate Complete Swiss Canton & City Data for Umzugscheck.ch

You are a data generation specialist. Your task is to generate complete, SEO-optimized, realistic data for **26 Swiss Cantons** and **93 Swiss Cities** for a moving company comparison platform.

---

## PART 1: EXISTING REFERENCE FILES

### FILE: src/data/locations.ts - CITIES_MAP (Reference Only - DO NOT MODIFY)

```typescript
export const CITIES_MAP: Record<string, CityInfo[]> = {
  "zuerich": [
    { name: "Zürich", slug: "zuerich", tagline: "Grösste Stadt der Schweiz" },
    { name: "Winterthur", slug: "winterthur", tagline: "Zweitgrösste Stadt im Kanton" },
    { name: "Uster", slug: "uster", tagline: "Zentrum des Zürcher Oberlands" },
    { name: "Dübendorf", slug: "duebendorf", tagline: "Innovationsstandort" },
    { name: "Dietikon", slug: "dietikon", tagline: "Tor zum Limmattal" },
    { name: "Wädenswil", slug: "waedenswil", tagline: "Perle am Zürichsee" },
    { name: "Horgen", slug: "horgen", tagline: "Seegemeinde mit Charme" },
    { name: "Bülach", slug: "buelach", tagline: "Zentrum des Zürcher Unterlands" },
    { name: "Kloten", slug: "kloten", tagline: "Flughafenstadt" },
    { name: "Schlieren", slug: "schlieren", tagline: "Dynamische Stadt im Limmattal" },
    { name: "Adliswil", slug: "adliswil", tagline: "Am Fusse des Albis" },
    { name: "Regensdorf", slug: "regensdorf", tagline: "Aufstrebende Gemeinde" }
  ],
  "bern": [
    { name: "Bern", slug: "bern", tagline: "Bundesstadt der Schweiz" },
    { name: "Biel/Bienne", slug: "biel", tagline: "Zweisprachige Uhrenstadt" },
    { name: "Thun", slug: "thun", tagline: "Tor zum Berner Oberland" },
    { name: "Köniz", slug: "koeniz", tagline: "Grösste Agglomerationsgemeinde" },
    { name: "Burgdorf", slug: "burgdorf", tagline: "Historische Zähringerstadt" },
    { name: "Langenthal", slug: "langenthal", tagline: "Zentrum des Oberaargaus" },
    { name: "Steffisburg", slug: "steffisburg", tagline: "Nachbargemeinde von Thun" },
    { name: "Spiez", slug: "spiez", tagline: "Perle am Thunersee" },
    { name: "Münsingen", slug: "muensingen", tagline: "Gemeinde im Aaretal" },
    { name: "Ostermundigen", slug: "ostermundigen", tagline: "Teil der Agglomeration Bern" },
    { name: "Muri bei Bern", slug: "muri-bei-bern", tagline: "Beliebte Wohngemeinde" },
    { name: "Interlaken", slug: "interlaken", tagline: "Zwischen zwei Seen" }
  ],
  "luzern": [
    { name: "Luzern", slug: "luzern", tagline: "Stadt am Vierwaldstättersee" },
    { name: "Emmen", slug: "emmen", tagline: "Grösste Agglomerationsgemeinde" },
    { name: "Kriens", slug: "kriens", tagline: "Am Fusse des Pilatus" },
    { name: "Horw", slug: "horw", tagline: "Seegemeinde mit Bergblick" },
    { name: "Ebikon", slug: "ebikon", tagline: "Verkehrsknoten der Region" },
    { name: "Sursee", slug: "sursee", tagline: "Historisches Städtchen" }
  ],
  "basel-stadt": [
    { name: "Basel", slug: "basel", tagline: "Kulturhauptstadt am Rhein" },
    { name: "Riehen", slug: "riehen", tagline: "Grünste Gemeinde des Kantons" },
    { name: "Bettingen", slug: "bettingen", tagline: "Kleinste Gemeinde des Kantons" }
  ],
  "basel-landschaft": [
    { name: "Allschwil", slug: "allschwil", tagline: "Grösste Gemeinde des Kantons" },
    { name: "Reinach BL", slug: "reinach-bl", tagline: "Beliebte Wohngemeinde" },
    { name: "Muttenz", slug: "muttenz", tagline: "Industriestandort mit Geschichte" },
    { name: "Pratteln", slug: "pratteln", tagline: "Wirtschaftszentrum" },
    { name: "Liestal", slug: "liestal", tagline: "Kantonshauptort" },
    { name: "Binningen", slug: "binningen", tagline: "Nahe an Basel" },
    { name: "Birsfelden", slug: "birsfelden", tagline: "Am Rhein gelegen" },
    { name: "Oberwil BL", slug: "oberwil-bl", tagline: "Familiengemeinde" }
  ],
  "aargau": [
    { name: "Aarau", slug: "aarau", tagline: "Kantonshauptstadt" },
    { name: "Baden", slug: "baden", tagline: "Bäderstadt mit Tradition" },
    { name: "Wettingen", slug: "wettingen", tagline: "Grösste Gemeinde im Kanton" },
    { name: "Wohlen", slug: "wohlen", tagline: "Im Herzen des Freiamts" },
    { name: "Oftringen", slug: "oftringen", tagline: "Verkehrsknoten" },
    { name: "Brugg", slug: "brugg", tagline: "Stadt der Brücken" },
    { name: "Rheinfelden", slug: "rheinfelden", tagline: "Am Hochrhein" },
    { name: "Lenzburg", slug: "lenzburg", tagline: "Schlossstadt" }
  ],
  "st-gallen": [
    { name: "St. Gallen", slug: "st-gallen", tagline: "UNESCO-Weltkulturerbe" },
    { name: "Rapperswil-Jona", slug: "rapperswil-jona", tagline: "Rosenstadt am See" },
    { name: "Wil SG", slug: "wil", tagline: "Historische Altstadt" },
    { name: "Gossau SG", slug: "gossau", tagline: "Zentrum im Fürstenland" },
    { name: "Uzwil", slug: "uzwil", tagline: "Industriegemeinde" },
    { name: "Buchs SG", slug: "buchs", tagline: "Grenzstadt zum Fürstentum" }
  ],
  "zug": [
    { name: "Zug", slug: "zug", tagline: "Wirtschaftsmetropole am See" },
    { name: "Baar", slug: "baar", tagline: "Grösste Gemeinde des Kantons" },
    { name: "Cham", slug: "cham", tagline: "Dynamische Seegemeinde" },
    { name: "Steinhausen", slug: "steinhausen", tagline: "Aufstrebende Gemeinde" },
    { name: "Rotkreuz", slug: "rotkreuz", tagline: "Innovationsstandort" }
  ],
  "solothurn": [
    { name: "Solothurn", slug: "solothurn", tagline: "Schönste Barockstadt" },
    { name: "Olten", slug: "olten", tagline: "Eisenbahnknotenpunkt" },
    { name: "Grenchen", slug: "grenchen", tagline: "Uhrenstadt" }
  ],
  "thurgau": [
    { name: "Frauenfeld", slug: "frauenfeld", tagline: "Kantonshauptstadt" },
    { name: "Kreuzlingen", slug: "kreuzlingen", tagline: "Grenzstadt zu Konstanz" },
    { name: "Arbon", slug: "arbon", tagline: "Stadt am Bodensee" },
    { name: "Amriswil", slug: "amriswil", tagline: "Marktstadt" },
    { name: "Weinfelden", slug: "weinfelden", tagline: "Zentrum im Thurgau" }
  ],
  "graubuenden": [
    { name: "Chur", slug: "chur", tagline: "Älteste Stadt der Schweiz" },
    { name: "Davos", slug: "davos", tagline: "Höchstgelegene Stadt Europas" },
    { name: "Landquart", slug: "landquart", tagline: "Verkehrsknotenpunkt" }
  ],
  "wallis": [
    { name: "Sion", slug: "sion", tagline: "Sonnige Kantonshauptstadt" },
    { name: "Sierre", slug: "sierre", tagline: "Stadt der Sonne" },
    { name: "Martigny", slug: "martigny", tagline: "Tor zu den Alpen" },
    { name: "Monthey", slug: "monthey", tagline: "Industriestadt" },
    { name: "Brig-Glis", slug: "brig", tagline: "Tor zum Simplon" }
  ],
  "freiburg": [
    { name: "Fribourg", slug: "fribourg", tagline: "Zweisprachige Universitätsstadt" },
    { name: "Bulle", slug: "bulle", tagline: "Hauptort der Greyerz" },
    { name: "Villars-sur-Glâne", slug: "villars-sur-glane", tagline: "Agglomerationsgemeinde" },
    { name: "Marly", slug: "marly", tagline: "Wachsende Gemeinde" }
  ],
  "tessin": [
    { name: "Lugano", slug: "lugano", tagline: "Grösste Stadt im Tessin" },
    { name: "Bellinzona", slug: "bellinzona", tagline: "Kantonshauptstadt" },
    { name: "Locarno", slug: "locarno", tagline: "Filmfestivalstadt" },
    { name: "Mendrisio", slug: "mendrisio", tagline: "Südlichste Stadt" },
    { name: "Chiasso", slug: "chiasso", tagline: "Grenzstadt zu Italien" }
  ],
  "waadt": [
    { name: "Lausanne", slug: "lausanne", tagline: "Olympische Hauptstadt" },
    { name: "Yverdon-les-Bains", slug: "yverdon", tagline: "Thermalbadstadt" },
    { name: "Montreux", slug: "montreux", tagline: "Jazzfestivalstadt" },
    { name: "Nyon", slug: "nyon", tagline: "Stadt am Genfersee" },
    { name: "Renens", slug: "renens", tagline: "Multikulturelle Stadt" },
    { name: "Vevey", slug: "vevey", tagline: "Stadt von Nestlé" },
    { name: "Pully", slug: "pully", tagline: "Elegante Wohngemeinde" },
    { name: "Morges", slug: "morges", tagline: "Tulpenstadt" }
  ],
  "genf": [
    { name: "Genf", slug: "genf", tagline: "Internationale Stadt" },
    { name: "Vernier", slug: "vernier", tagline: "Zweitgrösste Gemeinde" },
    { name: "Lancy", slug: "lancy", tagline: "Vielfältige Gemeinde" },
    { name: "Meyrin", slug: "meyrin", tagline: "CERN-Standort" },
    { name: "Carouge", slug: "carouge", tagline: "Sardinisches Erbe" },
    { name: "Onex", slug: "onex", tagline: "Multikulturelle Gemeinde" },
    { name: "Thônex", slug: "thonex", tagline: "Grenzgemeinde" }
  ],
  "neuenburg": [
    { name: "Neuchâtel", slug: "neuchatel", tagline: "Uhrmacherstadt" },
    { name: "La Chaux-de-Fonds", slug: "la-chaux-de-fonds", tagline: "UNESCO-Welterbe" }
  ],
  "schwyz": [
    { name: "Schwyz", slug: "schwyz", tagline: "Historischer Kantonshauptort" },
    { name: "Freienbach", slug: "freienbach", tagline: "Am Zürichsee" },
    { name: "Einsiedeln", slug: "einsiedeln", tagline: "Wallfahrtsort" }
  ],
  "appenzell-ausserrhoden": [
    { name: "Herisau", slug: "herisau", tagline: "Kantonshauptort" }
  ],
  "appenzell-innerrhoden": [
    { name: "Appenzell", slug: "appenzell", tagline: "Traditioneller Hauptort" }
  ],
  "schaffhausen": [
    { name: "Schaffhausen", slug: "schaffhausen", tagline: "Stadt am Rheinfall" },
    { name: "Neuhausen am Rheinfall", slug: "neuhausen", tagline: "Beim grössten Wasserfall Europas" }
  ],
  "glarus": [
    { name: "Glarus", slug: "glarus", tagline: "Kantonshauptort" }
  ],
  "jura": [
    { name: "Delémont", slug: "delemont", tagline: "Kantonshauptstadt" }
  ],
  "nidwalden": [
    { name: "Stans", slug: "stans", tagline: "Kantonshauptort" }
  ],
  "obwalden": [
    { name: "Sarnen", slug: "sarnen", tagline: "Kantonshauptort" }
  ],
  "uri": [
    { name: "Altdorf", slug: "altdorf", tagline: "Wilhelm-Tell-Stadt" }
  ]
};
```

---

## PART 2: CANTON DATA STRUCTURE & EXAMPLES

### TypeScript Interface for Cantons:

```typescript
export interface RegionData {
  slug: string;
  name: string;
  short: string;
  type: 'canton';
  seo: {
    title: string;
    description: string;
    h1: string;
    breadcrumb: string;
  };
  stats: {
    providerCount: number;
    avgRating: number;
    reviewCount: number;
  };
  prices: {
    priceCoefficient: number;
    small: { min: number; max: number; label: string };
    medium: { min: number; max: number; label: string };
    large: { min: number; max: number; label: string };
  };
  localContent: {
    blurb: string;
    localTips: string[];
    services: { title: string; icon: string; description: string }[];
  };
  nearbyCantons: string[];
  topCompanies: { name: string; rating: number; reviews: number; priceLevel: string; sponsored: boolean }[];
  faqs: { question: string; answer: string }[];
  testimonials: { name: string; location: string; rating: number; text: string; verified: boolean }[];
}
```

### GOLD STANDARD EXAMPLE 1: Zürich Canton

```typescript
"zuerich": {
  slug: "zuerich",
  name: "Zürich",
  short: "ZH",
  type: "canton",
  seo: {
    title: "Umzugsfirmen Kanton Zürich – 47 geprüfte Anbieter vergleichen",
    description: "Die besten Umzugsfirmen im Kanton Zürich ✓ Kostenlose Offerten ✓ Geprüfte Partner ✓ Faire Preise. Jetzt bis zu 5 Angebote erhalten und sparen.",
    h1: "Umzugsfirmen im Kanton Zürich",
    breadcrumb: "Zürich"
  },
  stats: {
    providerCount: 47,
    avgRating: 4.7,
    reviewCount: 2834
  },
  prices: {
    priceCoefficient: 1.15,
    small: { min: 650, max: 1100, label: "1-2 Zimmer" },
    medium: { min: 1200, max: 2200, label: "3-4 Zimmer" },
    large: { min: 2500, max: 4500, label: "5+ Zimmer / Haus" }
  },
  localContent: {
    blurb: "Der Kanton Zürich ist das wirtschaftliche Zentrum der Schweiz. Mit über 1.5 Millionen Einwohnern ist er der bevölkerungsreichste Kanton und verfügt über ein dichtes Netz an professionellen Umzugsunternehmen. Die Nähe zum Flughafen und die exzellente ÖV-Anbindung machen Umzüge hier besonders effizient.",
    localTips: [
      "Planen Sie Ihren Umzug wenn möglich nicht zum Monatsende – dann sind viele Firmen ausgebucht.",
      "In der Stadt Zürich benötigen Sie oft Halteverbotsschilder – fragen Sie die Umzugsfirma nach diesem Service.",
      "Viele Zürcher Altbauten haben enge Treppenhäuser – informieren Sie die Firma über die Gegebenheiten.",
      "Bei Umzügen im Seefeld oder Kreis 1 ist ein Möbellift oft die beste Lösung."
    ],
    services: [
      { title: "Privatumzug", icon: "home", description: "Kompletter Umzugsservice für Ihr Zuhause" },
      { title: "Firmenumzug", icon: "building", description: "Professionelle Büroumzüge mit minimaler Ausfallzeit" },
      { title: "Möbellift", icon: "arrowUp", description: "Für schwere Möbel und enge Treppenhäuser" },
      { title: "Endreinigung", icon: "sparkles", description: "Abgabegerechte Reinigung der alten Wohnung" }
    ]
  },
  nearbyCantons: ["aargau", "zug", "schwyz", "st-gallen", "thurgau", "schaffhausen"],
  topCompanies: [
    { name: "Züri Umzüge AG", rating: 4.9, reviews: 523, priceLevel: "mittel", sponsored: true },
    { name: "Limmat Transport GmbH", rating: 4.8, reviews: 412, priceLevel: "günstig", sponsored: false },
    { name: "SwissMove Zürich", rating: 4.7, reviews: 289, priceLevel: "premium", sponsored: false }
  ],
  faqs: [
    {
      question: "Was kostet ein Umzug im Kanton Zürich?",
      answer: "Die Kosten variieren je nach Wohnungsgrösse und Distanz. Ein 3-Zimmer-Umzug innerhalb des Kantons kostet durchschnittlich CHF 1'200–2'200. Holen Sie mehrere Offerten ein, um den besten Preis zu finden."
    },
    {
      question: "Wie weit im Voraus sollte ich eine Umzugsfirma buchen?",
      answer: "Wir empfehlen, mindestens 4-6 Wochen vor dem Umzugstermin Offerten einzuholen. Zu Monatsenden und im Sommer sind Umzugsfirmen besonders gefragt."
    },
    {
      question: "Brauche ich eine Halteverbotszone in Zürich?",
      answer: "In der Stadt Zürich ist eine Halteverbotszone oft notwendig. Die meisten Umzugsfirmen übernehmen die Beantragung bei der Stadt für Sie – fragen Sie bei der Offertanfrage danach."
    }
  ],
  testimonials: [
    {
      name: "Thomas M.",
      location: "Zürich → Winterthur",
      rating: 5,
      text: "Super professioneller Umzug! Das Team war pünktlich, freundlich und hat alles sorgfältig transportiert. Kann ich nur weiterempfehlen.",
      verified: true
    },
    {
      name: "Sandra K.",
      location: "Uster → Dübendorf",
      rating: 5,
      text: "Schnell, unkompliziert und fair im Preis. Die Offerten über umzugscheck.ch haben mir viel Zeit gespart.",
      verified: true
    }
  ]
}
```

### GOLD STANDARD EXAMPLE 2: Zug Canton

```typescript
"zug": {
  slug: "zug",
  name: "Zug",
  short: "ZG",
  type: "canton",
  seo: {
    title: "Umzugsfirmen Kanton Zug – 12 geprüfte Anbieter vergleichen",
    description: "Die besten Umzugsfirmen im Kanton Zug ✓ Kostenlose Offerten ✓ Geprüfte Partner ✓ Faire Preise. Jetzt bis zu 5 Angebote erhalten und sparen.",
    h1: "Umzugsfirmen im Kanton Zug",
    breadcrumb: "Zug"
  },
  stats: {
    providerCount: 12,
    avgRating: 4.8,
    reviewCount: 456
  },
  prices: {
    priceCoefficient: 1.20,
    small: { min: 700, max: 1200, label: "1-2 Zimmer" },
    medium: { min: 1300, max: 2400, label: "3-4 Zimmer" },
    large: { min: 2700, max: 4800, label: "5+ Zimmer / Haus" }
  },
  localContent: {
    blurb: "Der Kanton Zug ist bekannt für seine wirtschaftsfreundliche Politik und hohe Lebensqualität. Trotz seiner kleinen Fläche verfügt er über erstklassige Umzugsdienstleister. Die zentrale Lage zwischen Zürich und Luzern macht Zug zu einem beliebten Wohnort für Pendler.",
    localTips: [
      "Zug hat viele Expat-Familien – einige Umzugsfirmen bieten mehrsprachigen Service.",
      "Parkplatzsituation in der Zuger Altstadt ist schwierig – planen Sie einen Möbellift ein.",
      "Viele Neubauten in Baar und Cham – informieren Sie sich über Einzugsregelungen.",
      "Der Zuger See kann bei Umzügen am Ufer für Verzögerungen sorgen – früh starten!"
    ],
    services: [
      { title: "Privatumzug", icon: "home", description: "Kompletter Umzugsservice für Ihr Zuhause" },
      { title: "Firmenumzug", icon: "building", description: "Spezialisiert auf internationale Firmen" },
      { title: "Lagerung", icon: "archive", description: "Sichere Zwischenlagerung Ihrer Möbel" },
      { title: "Internationale Umzüge", icon: "globe", description: "Weltweite Umzugslösungen" }
    ]
  },
  nearbyCantons: ["zuerich", "luzern", "schwyz", "aargau"],
  topCompanies: [
    { name: "Zug Express Umzüge", rating: 4.9, reviews: 178, priceLevel: "premium", sponsored: true },
    { name: "Lorzen Transporte", rating: 4.8, reviews: 134, priceLevel: "mittel", sponsored: false },
    { name: "Central Swiss Moving", rating: 4.7, reviews: 98, priceLevel: "mittel", sponsored: false }
  ],
  faqs: [
    {
      question: "Warum sind Umzüge in Zug teurer als in anderen Kantonen?",
      answer: "Der Kanton Zug hat ein höheres Preisniveau aufgrund der starken Wirtschaft und hohen Lebenshaltungskosten. Die Qualität der Dienstleistungen ist jedoch entsprechend hoch."
    },
    {
      question: "Gibt es spezialisierte Umzugsfirmen für Expats in Zug?",
      answer: "Ja, mehrere Zuger Umzugsfirmen sind auf internationale Kunden spezialisiert und bieten Service in Englisch, Deutsch und weiteren Sprachen."
    },
    {
      question: "Wie lange dauert ein Umzug innerhalb von Zug?",
      answer: "Ein durchschnittlicher 3-4 Zimmer-Umzug innerhalb des Kantons dauert etwa 4-6 Stunden. Bei grösseren Umzügen oder vielen Treppen kann es länger dauern."
    }
  ],
  testimonials: [
    {
      name: "Michael R.",
      location: "Zürich → Zug",
      rating: 5,
      text: "Perfekter Umzug in meine neue Wohnung in Zug. Das Team sprach sogar Englisch – ideal für mich als Expat!",
      verified: true
    },
    {
      name: "Lisa W.",
      location: "Baar → Cham",
      rating: 5,
      text: "Sehr zufrieden! Pünktlich, professionell und die Preise waren transparent. Keine versteckten Kosten.",
      verified: true
    }
  ]
}
```

---

## PART 3: CITY DATA STRUCTURE & EXAMPLE

### TypeScript Interface for Cities:

```typescript
export interface CityDetailData {
  slug: string;
  name: string;
  cantonSlug: string;
  cantonName: string;
  seo: {
    title: string;
    description: string;
    h1: string;
    breadcrumb: string;
  };
  stats: {
    providerCount: number;
    avgRating: number;
    reviewCount: number;
  };
  prices: {
    priceCoefficient: number;
    small: { min: number; max: number; label: string };
    medium: { min: number; max: number; label: string };
    large: { min: number; max: number; label: string };
  };
  localContent: {
    blurb: string;
    localTips: string[];
  };
  faqs: { question: string; answer: string }[];
  testimonials: { name: string; location: string; rating: number; text: string; verified: boolean }[];
  nearbyRegions: { type: 'city' | 'canton'; slug: string; name: string }[];
}
```

### EXAMPLE: Zürich City

```typescript
"zuerich": {
  slug: "zuerich",
  name: "Zürich",
  cantonSlug: "zuerich",
  cantonName: "Zürich",
  seo: {
    title: "Umzugsfirmen Zürich – 32 lokale Anbieter vergleichen",
    description: "Die besten Umzugsfirmen in Zürich ✓ Lokale Experten ✓ Kostenlose Offerten ✓ Faire Preise. Jetzt Angebote vergleichen und bis zu 40% sparen.",
    h1: "Umzugsfirmen in Zürich",
    breadcrumb: "Zürich"
  },
  stats: {
    providerCount: 32,
    avgRating: 4.7,
    reviewCount: 1847
  },
  prices: {
    priceCoefficient: 1.18,
    small: { min: 680, max: 1150, label: "1-2 Zimmer" },
    medium: { min: 1250, max: 2300, label: "3-4 Zimmer" },
    large: { min: 2600, max: 4700, label: "5+ Zimmer / Haus" }
  },
  localContent: {
    blurb: "Zürich ist die grösste Stadt der Schweiz und bietet eine Vielzahl an professionellen Umzugsdienstleistern. Von der Altstadt bis zum Seefeld – lokale Firmen kennen jedes Quartier und die besonderen Herausforderungen wie enge Treppenhäuser, Parkplatzmangel und historische Gebäude.",
    localTips: [
      "Halteverbot frühzeitig bei der Stadt beantragen – in beliebten Quartieren wie Seefeld oder Wiedikon ist Parkraum knapp.",
      "Für Altbauten im Kreis 1 und 4 ist oft ein Möbellift die effizienteste Lösung.",
      "Umzüge zum Monatsende sind stark nachgefragt – frühzeitig buchen oder Mitte Monat wählen.",
      "Viele Zürcher Genossenschaften haben spezielle Einzugszeiten – informieren Sie sich vorab."
    ]
  },
  faqs: [
    {
      question: "Was kostet ein Umzug in Zürich?",
      answer: "Ein 3-Zimmer-Umzug innerhalb von Zürich kostet durchschnittlich CHF 1'250–2'300. Die genauen Kosten hängen von Faktoren wie Stockwerk, Lift und Distanz ab."
    },
    {
      question: "Brauche ich ein Halteverbot für meinen Umzug in Zürich?",
      answer: "In den meisten Fällen ja. Die Beantragung erfolgt bei der Stadt Zürich und sollte 2-3 Wochen vorher erfolgen. Viele Umzugsfirmen übernehmen dies als Service."
    },
    {
      question: "Welche Quartiere sind für Umzüge besonders herausfordernd?",
      answer: "Die Altstadt (Kreis 1), das Niederdorf und enge Quartiere wie das Seefeld können durch schmale Gassen und alte Gebäude anspruchsvoll sein. Ein erfahrener lokaler Anbieter ist hier Gold wert."
    }
  ],
  testimonials: [
    {
      name: "Andrea S.",
      location: "Kreis 4 → Oerlikon",
      rating: 5,
      text: "Trotz engem Treppenhaus im Altbau hat alles super geklappt. Das Team war sehr erfahren und kannte sich in Zürich bestens aus.",
      verified: true
    },
    {
      name: "Marco P.",
      location: "Seefeld → Wollishofen",
      rating: 5,
      text: "Schnelle Offerte, fairer Preis, professionelle Durchführung. Würde jederzeit wieder über umzugscheck.ch buchen!",
      verified: true
    }
  ],
  nearbyRegions: [
    { type: "city", slug: "winterthur", name: "Winterthur" },
    { type: "city", slug: "dübendorf", name: "Dübendorf" },
    { type: "city", slug: "uster", name: "Uster" },
    { type: "canton", slug: "zuerich", name: "Kanton Zürich" }
  ]
}
```

---

## PART 4: GENERATION RULES

### Price Coefficient Guidelines:
| Region Type | Coefficient | Examples |
|-------------|-------------|----------|
| Premium Urban (Zürich, Genf, Zug) | 1.15–1.25 | High demand, parking issues |
| Urban | 1.05–1.15 | Basel, Bern, Lausanne |
| Standard | 1.00 | Most mid-sized cities |
| Suburban | 0.95–1.00 | Agglomeration towns |
| Rural/Mountain | 0.85–0.95 | Graubünden, Wallis villages |

### Stats Guidelines:
| Canton Size | Provider Count | Review Count |
|-------------|----------------|--------------|
| Large (ZH, BE, VD, AG) | 30-50 | 1500-3000 |
| Medium (SG, LU, GE, BS) | 15-30 | 500-1500 |
| Small (ZG, SZ, NW, OW, etc.) | 8-15 | 200-500 |
| Tiny (AI, GL) | 3-8 | 50-200 |

For cities: Use 40-70% of canton stats for main city, 10-30% for smaller cities.

### Content Quality Rules:
1. **SEO Titles**: Max 60 chars, include "Umzugsfirmen [Location]" + provider count
2. **Meta Descriptions**: Max 160 chars, include ✓ checkmarks for trust signals
3. **Blurbs**: 2-3 sentences, unique facts about the location, mention local challenges
4. **Local Tips**: 4 tips per location, specific to local conditions (parking, buildings, regulations)
5. **FAQs**: 3 FAQs per location, answer real questions about costs, timing, local specifics
6. **Testimonials**: 2 per location, realistic names, specific routes, verified: true

### Language Rules:
- All content in Swiss German style (no ß, use "ss")
- Use Swiss number formatting: CHF 1'200 (apostrophe as thousand separator)
- Use proper Swiss place names and spellings

---

## PART 5: CANTONS TO GENERATE (24 remaining)

Generate data for these cantons (Zürich and Zug already exist):

1. bern
2. luzern
3. basel-stadt
4. basel-landschaft
5. aargau
6. st-gallen
7. solothurn
8. thurgau
9. graubuenden
10. wallis
11. freiburg
12. tessin
13. waadt
14. genf
15. neuenburg
16. schwyz
17. appenzell-ausserrhoden
18. appenzell-innerrhoden
19. schaffhausen
20. glarus
21. jura
22. nidwalden
23. obwalden
24. uri

---

## PART 6: CITIES TO GENERATE (93 total)

Generate data for ALL cities listed in CITIES_MAP above, grouped by canton.

---

## PART 7: OUTPUT FORMAT

### Output File 1: `regions-database-additions.ts`
Add the 24 missing cantons to the REGIONS_DATABASE object.

### Output File 2: `cities-database.ts` (NEW FILE)
```typescript
import { CityDetailData } from './types';

export const CITIES_DATABASE: Record<string, CityDetailData> = {
  // All 93 cities here
};
```

---

## QUALITY CHECKLIST

Before submitting, verify:
- [ ] All 24 remaining cantons have complete data
- [ ] All 93 cities have complete data
- [ ] Price coefficients match the guidelines
- [ ] Stats are realistic and proportional to canton size
- [ ] All SEO titles are under 60 characters
- [ ] All meta descriptions are under 160 characters
- [ ] No placeholder text (XXX, TODO, etc.)
- [ ] Swiss formatting used throughout (CHF, apostrophe separators)
- [ ] Each location has 4 unique local tips
- [ ] Each location has 3 relevant FAQs
- [ ] Each location has 2 verified testimonials
- [ ] nearbyCantons/nearbyRegions reference valid slugs

---

## START GENERATION

Generate the complete TypeScript code for all cantons and cities. Output in two parts:
1. First: All canton additions for regions-database.ts
2. Second: Complete cities-database.ts file
