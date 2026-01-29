# Umzugscheck.ch – Regionen-Datenbank

> **Alle 26 Kantone mit vollständigen Daten für SEO, Preise und lokale Inhalte**

---

## 📍 ÜBERSICHT: ALLE 26 KANTONE

| Slug | Name | Kürzel | Preis-Koeffizient |
|------|------|--------|-------------------|
| zuerich | Zürich | ZH | 1.18 |
| bern | Bern | BE | 1.08 |
| luzern | Luzern | LU | 1.05 |
| uri | Uri | UR | 0.90 |
| schwyz | Schwyz | SZ | 1.02 |
| obwalden | Obwalden | OW | 0.92 |
| nidwalden | Nidwalden | NW | 0.95 |
| glarus | Glarus | GL | 0.88 |
| zug | Zug | ZG | 1.00 |
| freiburg | Freiburg | FR | 0.95 |
| solothurn | Solothurn | SO | 0.98 |
| basel-stadt | Basel-Stadt | BS | 1.12 |
| basel-land | Basel-Land | BL | 1.05 |
| schaffhausen | Schaffhausen | SH | 0.95 |
| appenzell-ausserrhoden | Appenzell Ausserrhoden | AR | 0.88 |
| appenzell-innerrhoden | Appenzell Innerrhoden | AI | 0.85 |
| st-gallen | St. Gallen | SG | 1.02 |
| graubuenden | Graubünden | GR | 0.95 |
| aargau | Aargau | AG | 1.00 |
| thurgau | Thurgau | TG | 0.95 |
| tessin | Tessin | TI | 1.05 |
| waadt | Waadt | VD | 1.10 |
| wallis | Wallis | VS | 0.92 |
| neuenburg | Neuenburg | NE | 0.98 |
| genf | Genf | GE | 1.15 |
| jura | Jura | JU | 0.88 |

---

## 🏆 POPULAR REGIONS (TOP 8)

Die 8 wichtigsten Kantone für Traffic & Leads:

```typescript
export const POPULAR_REGIONS = [
  'zuerich',      // Grösste Stadt, höchster Traffic
  'bern',         // Hauptstadt
  'basel-stadt',  // Drittgrösste Stadt
  'aargau',       // Grosser Kanton, viele Pendler
  'zug',          // Expat-Hotspot, Premium-Segment
  'luzern',       // Tourismus & Zentralschweiz
  'st-gallen',    // Ostschweiz-Zentrum
  'genf',         // Romandie, International
];
```

---

## 📐 DATENSTRUKTUR

### TypeScript Interface

```typescript
export interface RegionData {
  // Basic
  slug: string;
  name: string;
  short: string;
  type: 'kanton';
  
  // SEO
  seo: {
    title: string;
    description: string;
    h1: string;
    canonicalUrl: string;
  };
  
  // Stats
  stats: {
    providerCount: number;
    reviewCount: number;
    avgRating: number;
    activeUsersBase: number;
  };
  
  // Preise
  priceMatrix: {
    small: PriceRange;   // 1.5-2.5 Zimmer
    medium: PriceRange;  // 3.5-4.5 Zimmer
    large: PriceRange;   // 5+ Zimmer
  };
  priceCoefficient: number;
  
  // Lokale Inhalte
  localTips: string[];
  localBlurb: string;
  
  // Relations
  nearbyRegions: NearbyRegion[];
  topCompanies: Company[];
  faqs: FAQ[];
  testimonials: Testimonial[];
}

export interface PriceRange {
  min: number;
  max: number;
  label: string;
  icon: string;
  savings: string;
}
```

---

## 💰 PREIS-MATRIX (Basis: Kanton Zug = 1.0)

### Small (1.5 - 2.5 Zimmer)

| Kanton | Min CHF | Max CHF | Ersparnis |
|--------|---------|---------|-----------|
| Zürich | 650 | 1'100 | bis CHF 440 |
| Bern | 600 | 1'000 | bis CHF 400 |
| Basel-Stadt | 620 | 1'050 | bis CHF 420 |
| Zug | 550 | 900 | bis CHF 360 |
| Genf | 630 | 1'080 | bis CHF 430 |
| Luzern | 580 | 950 | bis CHF 380 |

### Medium (3.5 - 4.5 Zimmer)

| Kanton | Min CHF | Max CHF | Ersparnis |
|--------|---------|---------|-----------|
| Zürich | 950 | 1'500 | bis CHF 600 |
| Bern | 850 | 1'350 | bis CHF 540 |
| Basel-Stadt | 900 | 1'420 | bis CHF 570 |
| Zug | 770 | 1'200 | bis CHF 480 |
| Genf | 920 | 1'470 | bis CHF 590 |
| Luzern | 820 | 1'280 | bis CHF 510 |

### Large (5+ Zimmer / Haus)

| Kanton | Min CHF | Max CHF | Ersparnis |
|--------|---------|---------|-----------|
| Zürich | 1'800 | 3'000 | bis CHF 720 |
| Bern | 1'620 | 2'700 | bis CHF 650 |
| Basel-Stadt | 1'720 | 2'850 | bis CHF 680 |
| Zug | 1'500 | 2'500 | bis CHF 600 |
| Genf | 1'760 | 2'950 | bis CHF 710 |
| Luzern | 1'580 | 2'630 | bis CHF 630 |

---

## 🔎 SEO-STRUKTUR PRO KANTON

### Beispiel: Kanton Zürich

```typescript
seo: {
  title: 'Umzugsfirmen im Kanton Zürich vergleichen | 80+ Anbieter | Umzugscheck',
  description: 'Vergleichen Sie 80+ geprüfte Umzugsfirmen im Kanton Zürich – von Winterthur bis Wädenswil, Uster bis Kloten. Gratis Offerten in 24h, bis zu 40% sparen.',
  h1: 'Umzugsfirmen im Kanton Zürich vergleichen',
  canonicalUrl: '/umzugsfirmen/kanton-zuerich',
}
```

### Beispiel: Kanton Zug

```typescript
seo: {
  title: 'Umzugsfirmen Kanton Zug vergleichen | Alle 11 Gemeinden | Umzugscheck',
  description: 'Vergleichen Sie 30+ geprüfte Umzugsfirmen im Kanton Zug. Gratis Offerten in 24–48h für alle 11 Gemeinden: Zug, Baar, Cham, Steinhausen, Hünenberg, Risch-Rotkreuz, Oberägeri, Unterägeri, Menzingen, Walchwil, Neuheim. Bis zu 40% sparen.',
  h1: 'Umzugsfirmen im Kanton Zug vergleichen',
  canonicalUrl: '/umzugsfirmen/kanton-zug',
}
```

---

## 🎯 LOKALE TIPPS (UNIQUE PRO KANTON)

### Zürich
```typescript
localTips: [
  'Innerkantonale Umzüge (z.B. Winterthur → Zürich) oft günstiger als gedacht',
  'Agglomeration (Uster, Wetzikon, Bülach) 10-20% günstiger als Stadt Zürich',
  'Parkbewilligung bei städtischen Gebieten nötig (CHF 80-150)',
  'Monatsende-Umzüge im ganzen Kanton früh buchen',
]
```

### Zug
```typescript
localTips: [
  'Alle 11 Gemeinden: Zug, Baar, Cham, Steinhausen, Hünenberg, Risch-Rotkreuz, Oberägeri, Unterägeri, Menzingen, Walchwil, Neuheim – kurze Distanzen halten Kosten tief',
  'Zuger Altstadt & Seepromenade: Halteverbotszonen und Zeitfenster frühzeitig beantragen (Kosten ca. CHF 80–150)',
  'Monatsende/Quartalsende: Extrem hohe Nachfrage – Termin 3–4 Wochen im Voraus sichern',
  'Expat-Hotspot: Viele Firmen bieten mehrsprachige Teams (DE/EN/FR) und Relocation-Services',
  'Ägerital (Oberägeri, Unterägeri): Bergstrassen beachten – erfahrene Teams mit passendem Fuhrpark',
  'Lorzenebene (Baar, Cham, Steinhausen): Viele Neubaugebiete mit guter Zufahrt – oft günstiger',
  'Premium-Villen am Zugersee: Spezialtransporte für Kunst, Antiquitäten und empfindliche Güter verfügbar',
  'Komplettpaket-Tipp: Umzug + Endreinigung + Wohnungsabgabe aus einer Hand spart Zeit und Nerven',
  'S-Bahn-Nähe: Gute ÖV-Anbindung ermöglicht flexible Terminplanung auch ohne Auto',
  'Crypto Valley: Büroumzüge am Wochenende, Serverraum-Transporte und diskrete Abwicklung für Startups',
]
```

---

## 🏢 TOP COMPANIES (Beispiel Zürich)

```typescript
topCompanies: [
  {
    id: 'zuerich-umzuege',
    name: 'Zürcher Umzüge AG',
    rating: 4.9,
    reviewCount: 342,
    badges: ['Top Bewertung', 'Lokal'],
    services: ['Privatumzug', 'Reinigung', 'Möbellift'],
    priceLevel: 'Mittel',
    responseTime: '< 2h',
    isPopular: true,
  },
  {
    id: 'express-move-zh',
    name: 'Express Move Zürich',
    rating: 4.8,
    reviewCount: 256,
    badges: ['Preis-Sieger'],
    services: ['Privatumzug', 'Entsorgung', 'Einlagerung'],
    priceLevel: 'Günstig',
    responseTime: '< 1h',
    isBestPrice: true,
  },
  {
    id: 'premium-transporte',
    name: 'Premium Transporte AG',
    rating: 4.9,
    reviewCount: 189,
    badges: ['Premium'],
    services: ['Firmenumzug', 'Möbellift', 'Reinigung'],
    priceLevel: 'Premium',
    responseTime: '< 4h',
    isPremium: true,
  },
]
```

---

## ❓ FAQs (Beispiel Zürich)

```typescript
faqs: [
  {
    question: 'Welche Orte gehören zum Kanton Zürich?',
    answer: 'Der Kanton Zürich umfasst die Stadt Zürich sowie Winterthur, Uster, Dübendorf, Dietikon, Wetzikon, Kloten, Bülach, Wädenswil, Horgen und über 160 weitere Gemeinden. Wir vermitteln Umzugsfirmen in allen Regionen des Kantons.',
  },
  {
    question: 'Was kostet ein Umzug im Kanton Zürich?',
    answer: 'Die Kosten variieren nach Distanz und Wohnungsgrösse. Innerkantonale Umzüge (z.B. Winterthur → Zürich) kosten für 3 Zimmer ca. CHF 950-1500. Kürzere Strecken (Uster → Dübendorf) sind günstiger. Mit unserem Vergleich sparen Sie bis zu 40%.',
  },
  {
    question: 'Gibt es regionale Preisunterschiede im Kanton Zürich?',
    answer: 'Ja, Zürich-Stadt hat höhere Preise (Parkdruck, Altbauten, Halteverbot). Agglomerationsgemeinden wie Uster, Wetzikon oder Bülach sind oft 10-20% günstiger. Ein Vergleich lohnt sich besonders.',
  },
  {
    question: 'Ist Umzugscheck.ch selbst eine Umzugsfirma?',
    answer: 'Nein, wir sind ein reiner Vergleichs- und Vermittlungsservice. Die Durchführung erfolgt ausschliesslich durch unsere geprüften, versicherten Partnerfirmen im Kanton Zürich.',
  },
]
```

---

## ⭐ TESTIMONIALS (Beispiel Zürich)

```typescript
testimonials: [
  {
    name: 'Stefan R.',
    location: 'Zürich → Winterthur',
    rating: 5,
    text: 'Perfekter Service! Innerhalb von 24h hatte ich 5 Angebote. Die Firma war professionell und CHF 500 günstiger als erwartet.',
    date: 'vor 2 Tagen',
    verified: true,
    savedAmount: 500,
  },
  {
    name: 'Claudia M.',
    location: 'Oerlikon → Altstetten',
    rating: 5,
    text: 'Umzug lief reibungslos! Die Möbellift-Option war perfekt für unsere Altbau-Wohnung. Absolut empfehlenswert.',
    date: 'vor 5 Tagen',
    verified: true,
    savedAmount: 380,
  },
]
```

---

## 🔍 AUTOCOMPLETE PLACES

```typescript
export const AUTOCOMPLETE_PLACES: AutocompletePlace[] = [
  { label: '8001 Zürich', slug: 'zuerich', plz: '8001' },
  { label: '3000 Bern', slug: 'bern', plz: '3000' },
  { label: '4001 Basel', slug: 'basel-stadt', plz: '4001' },
  { label: '6300 Zug', slug: 'zug', plz: '6300' },
  { label: '6003 Luzern', slug: 'luzern', plz: '6003' },
  { label: '9000 St. Gallen', slug: 'st-gallen', plz: '9000' },
  { label: '1200 Genf', slug: 'genf', plz: '1200' },
  { label: '8400 Winterthur', slug: 'zuerich', plz: '8400' },
  { label: '1003 Lausanne', slug: 'waadt', plz: '1003' },
  { label: '6900 Lugano', slug: 'tessin', plz: '6900' },
  { label: '5000 Aarau', slug: 'aargau', plz: '5000' },
  { label: '5400 Baden', slug: 'aargau', plz: '5400' },
  { label: '8200 Schaffhausen', slug: 'schaffhausen', plz: '8200' },
  { label: '7000 Chur', slug: 'graubuenden', plz: '7000' },
  { label: '8500 Frauenfeld', slug: 'thurgau', plz: '8500' },
  { label: '4500 Solothurn', slug: 'solothurn', plz: '4500' },
  { label: '1700 Freiburg', slug: 'freiburg', plz: '1700' },
  { label: '1950 Sion', slug: 'wallis', plz: '1950' },
  { label: '2000 Neuchâtel', slug: 'neuenburg', plz: '2000' },
  { label: '2800 Delémont', slug: 'jura', plz: '2800' },
];
```

---

## 🔧 SHARED SERVICES

```typescript
export const SERVICES: Service[] = [
  { title: "Endreinigung", icon: Sparkles, description: "Wohnungsabnahme garantiert", link: "/services/reinigung" },
  { title: "Ein-/Auspackservice", icon: Package, description: "Professionelles Verpacken", link: "/services/packservice" },
  { title: "Möbelmontage", icon: Sofa, description: "Auf- & Abbau vor Ort", link: "/services/moebelmontage" },
  { title: "Möbellift", icon: Truck, description: "Für schwere Möbel", link: "/services/moebellift" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume", link: "/services/lagerung" },
  { title: "Entsorgung", icon: Trash2, description: "Fachgerechte Entsorgung", link: "/services/entsorgung" },
];
```

---

## 🛡️ GUARANTEES

```typescript
export const GUARANTEES: Guarantee[] = [
  { title: "Kostenlos-Garantie", description: "100% gratis, keine versteckten Gebühren", icon: CircleDollarSign },
  { title: "Datenschutz-Garantie", description: "Schweizer Hosting, DSGVO-konform", icon: ShieldCheck },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte & versicherte Firmen", icon: BadgeCheck },
  { title: "Zufriedenheits-Garantie", description: "Wir helfen bei Problemen", icon: ThumbsUp },
];
```

---

## 📁 KEY FILE

```
src/data/regions-database.ts  → ~1600 Zeilen, alle 26 Kantone
```

---

*Letzte Aktualisierung: Januar 2025*
