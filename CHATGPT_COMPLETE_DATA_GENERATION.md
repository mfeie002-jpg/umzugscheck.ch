# Complete ChatGPT Data Generation Prompt
## Umzugscheck.ch - Canton & City Landing Pages

---

## SCREENSHOTS

### Canton Page Screenshot (Kanton Zug)
**URL:** `/umzugsfirmen/kanton-zug`
![Canton Page](https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7c6ca27a-2a2e-4f86-bf23-ff5685675eb8/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1768507503717.png)

### City Page Screenshot (Stadt Zug)
**URL:** `/umzugsfirmen/zug`
![City Page](https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/42201a53-790b-4c87-bd3d-1841dcde9e4b/824c7aee-f292-46d7-b83b-be95fbdc3489.lovableproject.com-1768507499479.png)

---

## PAGE STRUCTURE (HTML Sections)

### Canton Page Sections (in order):
1. **RegionBreadcrumb** - Home > Umzugsfirmen Schweiz > Kanton {Name}
2. **UnifiedHero** - Hero with form, background image, trust badges
3. **RegionAnchorNavEnhanced** - Sticky navigation (Firmen, So funktioniert's, Preise, Tipps, FAQ)
4. **RegionMiniNav** - Mobile navigation
5. **RegionStickyMobileCTA** - Mobile sticky CTA
6. **RegionStats** - Provider count, reviews, rating, active users
7. **RegionProviders** - Top 3 company cards with ratings
8. **RegionHowWeRank** - "How we rank companies" credibility box
9. **LocationAwareHowItWorks** - 3-step process (Formular, Vergleichen, Sparen)
10. **RegionSavingsProof** - Savings testimonials
11. **RegionTestimonials** - Customer reviews
12. **RegionKomplettpaket** - Umzug + Reinigung + Wohnungsabgabe bundle
13. **RegionPriceTable** - Price ranges for small/medium/large apartments
14. **RegionWhySave** - Why comparing saves money
15. **RegionMidCTA** - Mid-page call to action
16. **RegionLocalTips** - 4 local tips specific to region
17. **RegionServicesEnhanced** - Services grid with dual CTAs
18. **RegionOfferComparison** - Offer comparison emphasis
19. **RegionTrustBox** - E-E-A-T trust indicators
20. **RegionGuarantees** - 4 guarantees
21. **Cities Grid** - Links to cities in the canton
22. **RegionGlossar** - Mini glossary
23. **RegionFAQ** - 3-5 FAQs with Schema.org
24. **RegionContentCluster** - Links to related content
25. **RegionNearby** - Nearby cantons
26. **RegionFooterCTA** - Final CTA section
27. **RegionExitIntent** - Exit intent popup

### City Page Sections (same components, slight variations):
Same structure as Canton, but with:
- City-specific breadcrumb (includes canton link)
- "Weitere Städte im Kanton" section instead of cities grid
- Links back to canton page

---

## DATA STRUCTURES

### FILE 1: `src/data/locations.ts` (ALREADY COMPLETE - 93 Cities)

```typescript
export interface CityData {
  slug: string;
  name: string;
  cantonSlug: string;
  cantonName: string;
  cantonShort: string;
}

export const CITIES_MAP: Record<string, CityData> = {
  // === ZH (12 cities) ===
  zuerich: { slug: 'zuerich', name: 'Zürich', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  winterthur: { slug: 'winterthur', name: 'Winterthur', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  uster: { slug: 'uster', name: 'Uster', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  dubendorf: { slug: 'dubendorf', name: 'Dübendorf', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  dietikon: { slug: 'dietikon', name: 'Dietikon', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  wetzikon: { slug: 'wetzikon', name: 'Wetzikon', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  horgen: { slug: 'horgen', name: 'Horgen', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  kloten: { slug: 'kloten', name: 'Kloten', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  buelach: { slug: 'buelach', name: 'Bülach', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  schlieren: { slug: 'schlieren', name: 'Schlieren', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  wallisellen: { slug: 'wallisellen', name: 'Wallisellen', cantonSlug: 'zuerich', cantonName: 'Zürich', cantonShort: 'ZH' },
  
  // === BE (7 cities) ===
  bern: { slug: 'bern', name: 'Bern', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  biel: { slug: 'biel', name: 'Biel/Bienne', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  thun: { slug: 'thun', name: 'Thun', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  koeniz: { slug: 'koeniz', name: 'Köniz', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  ostermundigen: { slug: 'ostermundigen', name: 'Ostermundigen', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  interlaken: { slug: 'interlaken', name: 'Interlaken', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  burgdorf: { slug: 'burgdorf', name: 'Burgdorf', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  langenthal: { slug: 'langenthal', name: 'Langenthal', cantonSlug: 'bern', cantonName: 'Bern', cantonShort: 'BE' },
  
  // === LU (5 cities) ===
  luzern: { slug: 'luzern', name: 'Luzern', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  kriens: { slug: 'kriens', name: 'Kriens', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  emmen: { slug: 'emmen', name: 'Emmen', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  horw: { slug: 'horw', name: 'Horw', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  ebikon: { slug: 'ebikon', name: 'Ebikon', cantonSlug: 'luzern', cantonName: 'Luzern', cantonShort: 'LU' },
  
  // === BS/BL (7 cities) ===
  basel: { slug: 'basel', name: 'Basel', cantonSlug: 'basel-stadt', cantonName: 'Basel-Stadt', cantonShort: 'BS' },
  riehen: { slug: 'riehen', name: 'Riehen', cantonSlug: 'basel-stadt', cantonName: 'Basel-Stadt', cantonShort: 'BS' },
  liestal: { slug: 'liestal', name: 'Liestal', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  muttenz: { slug: 'muttenz', name: 'Muttenz', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  pratteln: { slug: 'pratteln', name: 'Pratteln', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  allschwil: { slug: 'allschwil', name: 'Allschwil', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  binningen: { slug: 'binningen', name: 'Binningen', cantonSlug: 'basel-landschaft', cantonName: 'Basel-Landschaft', cantonShort: 'BL' },
  
  // === GE (5 cities) ===
  genf: { slug: 'genf', name: 'Genf', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  carouge: { slug: 'carouge', name: 'Carouge', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  meyrin: { slug: 'meyrin', name: 'Meyrin', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  vernier: { slug: 'vernier', name: 'Vernier', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  lancy: { slug: 'lancy', name: 'Lancy', cantonSlug: 'genf', cantonName: 'Genf', cantonShort: 'GE' },
  
  // === VD (7 cities) ===
  lausanne: { slug: 'lausanne', name: 'Lausanne', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  renens: { slug: 'renens', name: 'Renens', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  nyon: { slug: 'nyon', name: 'Nyon', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  vevey: { slug: 'vevey', name: 'Vevey', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  montreux: { slug: 'montreux', name: 'Montreux', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  morges: { slug: 'morges', name: 'Morges', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  yverdon: { slug: 'yverdon', name: 'Yverdon-les-Bains', cantonSlug: 'waadt', cantonName: 'Waadt', cantonShort: 'VD' },
  
  // === TI (5 cities) ===
  lugano: { slug: 'lugano', name: 'Lugano', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  bellinzona: { slug: 'bellinzona', name: 'Bellinzona', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  locarno: { slug: 'locarno', name: 'Locarno', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  mendrisio: { slug: 'mendrisio', name: 'Mendrisio', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  chiasso: { slug: 'chiasso', name: 'Chiasso', cantonSlug: 'tessin', cantonName: 'Tessin', cantonShort: 'TI' },
  
  // === ZG (11 cities) ===
  zug: { slug: 'zug', name: 'Zug', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  baar: { slug: 'baar', name: 'Baar', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  cham: { slug: 'cham', name: 'Cham', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  steinhausen: { slug: 'steinhausen', name: 'Steinhausen', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  huenenberg: { slug: 'huenenberg', name: 'Hünenberg', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  'risch-rotkreuz': { slug: 'risch-rotkreuz', name: 'Risch-Rotkreuz', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  oberaegeri: { slug: 'oberaegeri', name: 'Oberägeri', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  unteraegeri: { slug: 'unteraegeri', name: 'Unterägeri', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  menzingen: { slug: 'menzingen', name: 'Menzingen', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  walchwil: { slug: 'walchwil', name: 'Walchwil', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  neuheim: { slug: 'neuheim', name: 'Neuheim', cantonSlug: 'zug', cantonName: 'Zug', cantonShort: 'ZG' },
  
  // === SG (5 cities) ===
  stgallen: { slug: 'stgallen', name: 'St. Gallen', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  wil: { slug: 'wil', name: 'Wil', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  gossau: { slug: 'gossau', name: 'Gossau', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  rorschach: { slug: 'rorschach', name: 'Rorschach', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  rapperswiljona: { slug: 'rapperswiljona', name: 'Rapperswil-Jona', cantonSlug: 'st-gallen', cantonName: 'St. Gallen', cantonShort: 'SG' },
  
  // === AG (6 cities) ===
  aarau: { slug: 'aarau', name: 'Aarau', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  baden: { slug: 'baden', name: 'Baden', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  wettingen: { slug: 'wettingen', name: 'Wettingen', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  lenzburg: { slug: 'lenzburg', name: 'Lenzburg', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  wohlen: { slug: 'wohlen', name: 'Wohlen', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  brugg: { slug: 'brugg', name: 'Brugg', cantonSlug: 'aargau', cantonName: 'Aargau', cantonShort: 'AG' },
  
  // === TG (3 cities) ===
  frauenfeld: { slug: 'frauenfeld', name: 'Frauenfeld', cantonSlug: 'thurgau', cantonName: 'Thurgau', cantonShort: 'TG' },
  kreuzlingen: { slug: 'kreuzlingen', name: 'Kreuzlingen', cantonSlug: 'thurgau', cantonName: 'Thurgau', cantonShort: 'TG' },
  arbon: { slug: 'arbon', name: 'Arbon', cantonSlug: 'thurgau', cantonName: 'Thurgau', cantonShort: 'TG' },
  
  // === SO (3 cities) ===
  solothurn: { slug: 'solothurn', name: 'Solothurn', cantonSlug: 'solothurn', cantonName: 'Solothurn', cantonShort: 'SO' },
  olten: { slug: 'olten', name: 'Olten', cantonSlug: 'solothurn', cantonName: 'Solothurn', cantonShort: 'SO' },
  grenchen: { slug: 'grenchen', name: 'Grenchen', cantonSlug: 'solothurn', cantonName: 'Solothurn', cantonShort: 'SO' },
  
  // === GR (3 cities) ===
  chur: { slug: 'chur', name: 'Chur', cantonSlug: 'graubuenden', cantonName: 'Graubünden', cantonShort: 'GR' },
  davos: { slug: 'davos', name: 'Davos', cantonSlug: 'graubuenden', cantonName: 'Graubünden', cantonShort: 'GR' },
  "st-moritz": { slug: 'st-moritz', name: 'St. Moritz', cantonSlug: 'graubuenden', cantonName: 'Graubünden', cantonShort: 'GR' },
  
  // === VS (3 cities) ===
  sion: { slug: 'sion', name: 'Sion', cantonSlug: 'wallis', cantonName: 'Wallis', cantonShort: 'VS' },
  "brig-glis": { slug: 'brig-glis', name: 'Brig-Glis', cantonSlug: 'wallis', cantonName: 'Wallis', cantonShort: 'VS' },
  martigny: { slug: 'martigny', name: 'Martigny', cantonSlug: 'wallis', cantonName: 'Wallis', cantonShort: 'VS' },
  
  // === FR (2 cities) ===
  freiburg: { slug: 'freiburg', name: 'Freiburg', cantonSlug: 'freiburg', cantonName: 'Freiburg', cantonShort: 'FR' },
  bulle: { slug: 'bulle', name: 'Bulle', cantonSlug: 'freiburg', cantonName: 'Freiburg', cantonShort: 'FR' },
  
  // === NE (3 cities) ===
  neuchatel: { slug: 'neuchatel', name: 'Neuenburg', cantonSlug: 'neuenburg', cantonName: 'Neuenburg', cantonShort: 'NE' },
  "la-chaux-de-fonds": { slug: 'la-chaux-de-fonds', name: 'La Chaux-de-Fonds', cantonSlug: 'neuenburg', cantonName: 'Neuenburg', cantonShort: 'NE' },
  "le-locle": { slug: 'le-locle', name: 'Le Locle', cantonSlug: 'neuenburg', cantonName: 'Neuenburg', cantonShort: 'NE' },
  
  // === SH (2 cities) ===
  schaffhausen: { slug: 'schaffhausen', name: 'Schaffhausen', cantonSlug: 'schaffhausen', cantonName: 'Schaffhausen', cantonShort: 'SH' },
  neuhausen: { slug: 'neuhausen', name: 'Neuhausen am Rheinfall', cantonSlug: 'schaffhausen', cantonName: 'Schaffhausen', cantonShort: 'SH' },
  
  // === JU (2 cities) ===
  delemont: { slug: 'delemont', name: 'Delémont', cantonSlug: 'jura', cantonName: 'Jura', cantonShort: 'JU' },
  porrentruy: { slug: 'porrentruy', name: 'Porrentruy', cantonSlug: 'jura', cantonName: 'Jura', cantonShort: 'JU' },
  
  // === Small Cantons (1 city each) ===
  glarus: { slug: 'glarus', name: 'Glarus', cantonSlug: 'glarus', cantonName: 'Glarus', cantonShort: 'GL' },
  schwyz: { slug: 'schwyz', name: 'Schwyz', cantonSlug: 'schwyz', cantonName: 'Schwyz', cantonShort: 'SZ' },
  einsiedeln: { slug: 'einsiedeln', name: 'Einsiedeln', cantonSlug: 'schwyz', cantonName: 'Schwyz', cantonShort: 'SZ' },
  kuessnacht: { slug: 'kuessnacht', name: 'Küssnacht', cantonSlug: 'schwyz', cantonName: 'Schwyz', cantonShort: 'SZ' },
  altdorf: { slug: 'altdorf', name: 'Altdorf', cantonSlug: 'uri', cantonName: 'Uri', cantonShort: 'UR' },
  sarnen: { slug: 'sarnen', name: 'Sarnen', cantonSlug: 'obwalden', cantonName: 'Obwalden', cantonShort: 'OW' },
  stans: { slug: 'stans', name: 'Stans', cantonSlug: 'nidwalden', cantonName: 'Nidwalden', cantonShort: 'NW' },
  herisau: { slug: 'herisau', name: 'Herisau', cantonSlug: 'appenzell-ausserrhoden', cantonName: 'Appenzell Ausserrhoden', cantonShort: 'AR' },
  appenzell: { slug: 'appenzell', name: 'Appenzell', cantonSlug: 'appenzell-innerrhoden', cantonName: 'Appenzell Innerrhoden', cantonShort: 'AI' },
};
```

---

### FILE 2: `src/data/regions-database.ts` - RegionData Interface

```typescript
export interface RegionData {
  // Basic
  slug: string;
  name: string;
  short: string;
  type: 'kanton';
  
  // SEO
  seo: {
    title: string;          // Max 60 chars
    description: string;    // Max 160 chars
    h1: string;
    canonicalUrl: string;
  };
  
  // Stats
  stats: {
    providerCount: number;    // 8-50 depending on canton size
    reviewCount: number;      // 100-3000
    avgRating: number;        // 4.5-4.9
    activeUsersBase: number;  // 3-20 for live counter
  };
  
  // Prices
  priceMatrix: {
    small: { min: number; max: number; label: string; icon: string; savings: string };
    medium: { min: number; max: number; label: string; icon: string; savings: string };
    large: { min: number; max: number; label: string; icon: string; savings: string };
  };
  priceCoefficient: number;  // 0.85-1.25
  
  // Local Content (UNIQUE per region!)
  localTips: string[];      // 4 tips
  localBlurb: string;       // 2-3 sentences
  
  // Nearby Cantons
  nearbyRegions: { name: string; slug: string }[];
  
  // Top Companies (can be generic with region name)
  topCompanies: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
    badges: string[];
    services: string[];
    priceLevel: 'Günstig' | 'Mittel' | 'Premium';
    responseTime: string;
    isPopular?: boolean;
    isBestPrice?: boolean;
    isPremium?: boolean;
  }[];
  
  // FAQs (3-5 per region)
  faqs: { question: string; answer: string }[];
  
  // Testimonials (2-3 per region)
  testimonials: {
    name: string;
    location: string;
    rating: number;
    text: string;
    date: string;
    verified: boolean;
    savedAmount?: number;
  }[];
}
```

---

### GOLD STANDARD EXAMPLE: Kanton Zug

```typescript
zug: {
  slug: 'zug',
  name: 'Zug',
  short: 'ZG',
  type: 'kanton',
  
  seo: {
    title: 'Umzugsfirmen Kanton Zug – Jetzt Offerten vergleichen',
    description: 'Die besten Umzugsfirmen im Kanton Zug vergleichen ✓ Kostenlose Offerten ✓ Geprüfte Partner ✓ Bis zu 40% sparen. Jetzt Angebote erhalten!',
    h1: 'Umzugsfirmen im Kanton Zug',
    canonicalUrl: 'https://umzugscheck.ch/umzugsfirmen/kanton-zug',
  },
  
  stats: {
    providerCount: 12,
    reviewCount: 487,
    avgRating: 4.8,
    activeUsersBase: 8,
  },
  
  priceMatrix: {
    small: { min: 700, max: 1200, label: '1.5-2.5 Zimmer', icon: 'home', savings: 'bis CHF 280' },
    medium: { min: 1100, max: 1900, label: '3.5-4.5 Zimmer', icon: 'building', savings: 'bis CHF 450' },
    large: { min: 1800, max: 3200, label: '5+ Zimmer / Haus', icon: 'warehouse', savings: 'bis CHF 720' },
  },
  priceCoefficient: 1.20,
  
  localBlurb: 'Der Kanton Zug ist bekannt für seine wirtschaftsfreundliche Politik und hohe Lebensqualität. Trotz seiner kompakten Grösse verfügt er über erstklassige Umzugsdienstleister, die sowohl lokale als auch internationale Kunden professionell betreuen.',
  
  localTips: [
    'Zug hat viele internationale Firmen – einige Umzugsfirmen bieten mehrsprachigen Service (EN/DE/FR).',
    'Parkplatzsituation in der Zuger Altstadt ist schwierig – Möbellift oft empfohlen.',
    'Viele Neubauten in Baar und Cham haben spezifische Einzugsregelungen – vorher abklären.',
    'Der Zugerberg und Hanglagen können Umzüge erschweren – spezialisierte Firmen anfragen.'
  ],
  
  nearbyRegions: [
    { name: 'Zürich', slug: 'zuerich' },
    { name: 'Luzern', slug: 'luzern' },
    { name: 'Schwyz', slug: 'schwyz' },
    { name: 'Aargau', slug: 'aargau' },
  ],
  
  topCompanies: [
    {
      id: 'zug-1',
      name: 'Zug Express Umzüge',
      rating: 4.9,
      reviewCount: 156,
      badges: ['Geprüft', 'Versichert', 'Premium Partner'],
      services: ['Privatumzug', 'Firmenumzug', 'Möbellift'],
      priceLevel: 'Mittel',
      responseTime: '< 24h',
      isPopular: true,
    },
    {
      id: 'zug-2',
      name: 'Lorzen Transport GmbH',
      rating: 4.8,
      reviewCount: 98,
      badges: ['Geprüft', 'Versichert'],
      services: ['Privatumzug', 'Endreinigung', 'Entsorgung'],
      priceLevel: 'Günstig',
      responseTime: '< 48h',
      isBestPrice: true,
    },
    {
      id: 'zug-3',
      name: 'Swiss Premium Moving Zug',
      rating: 4.9,
      reviewCount: 134,
      badges: ['Geprüft', 'Versichert', 'Swiss Made'],
      services: ['Privatumzug', 'Firmenumzug', 'International'],
      priceLevel: 'Premium',
      responseTime: '< 24h',
      isPremium: true,
    },
  ],
  
  faqs: [
    {
      question: 'Was kostet ein Umzug im Kanton Zug?',
      answer: 'Ein 3-Zimmer-Umzug innerhalb des Kantons Zug kostet durchschnittlich CHF 1\'100–1\'900. Der Kanton Zug hat ein leicht höheres Preisniveau als der Schweizer Durchschnitt.'
    },
    {
      question: 'Gibt es auf Expats spezialisierte Umzugsfirmen in Zug?',
      answer: 'Ja, viele Zuger Umzugsfirmen sind auf internationale Kunden spezialisiert und bieten mehrsprachigen Service sowie Erfahrung mit Relocation-Paketen.'
    },
    {
      question: 'Wie lange im Voraus sollte ich in Zug buchen?',
      answer: 'Wir empfehlen 3-4 Wochen Vorlauf. Zu Monatsenden ist die Nachfrage hoch, Mitte Monat ist oft flexibler.'
    },
  ],
  
  testimonials: [
    {
      name: 'Michael R.',
      location: 'Zürich → Zug',
      rating: 5,
      text: 'Perfekter Umzug in meine neue Wohnung in Zug. Das Team war pünktlich und sprach sogar Englisch – ideal für mich.',
      date: '2024-11',
      verified: true,
      savedAmount: 380,
    },
    {
      name: 'Sandra W.',
      location: 'Baar → Cham',
      rating: 5,
      text: 'Sehr zufrieden mit dem Service! Pünktlich, professionell und keine versteckten Kosten.',
      date: '2024-10',
      verified: true,
      savedAmount: 290,
    },
  ],
}
```

---

## GENERATION RULES

### Price Coefficients:
| Region Type | Coefficient | Examples |
|-------------|-------------|----------|
| Premium (ZH, GE, ZG) | 1.15–1.25 | High demand, expensive market |
| Urban | 1.05–1.15 | BS, BE, VD |
| Standard | 1.00 | Most mid-sized cantons |
| Suburban | 0.95–1.00 | BL, TG, SO |
| Rural/Mountain | 0.85–0.95 | GR, VS, UR, OW, NW, AI, GL |

### Stats by Canton Size:
| Size | Provider Count | Review Count | Active Users |
|------|----------------|--------------|--------------|
| Large (ZH, BE, VD, AG) | 35-50 | 1500-3000 | 12-20 |
| Medium (GE, BS, SG, LU) | 20-35 | 600-1500 | 8-15 |
| Small (ZG, TG, SO, FR, etc.) | 10-20 | 300-600 | 5-10 |
| Tiny (AI, GL, OW, NW, UR, JU) | 5-12 | 80-300 | 3-6 |

### Content Quality Rules:
1. **SEO Titles**: Max 60 chars, pattern: "Umzugsfirmen Kanton {Name} – Jetzt Offerten vergleichen"
2. **Meta Descriptions**: Max 160 chars, include ✓ checkmarks
3. **Local Blurb**: 2-3 sentences with unique local facts
4. **Local Tips**: 4 tips, specific to region (parking, buildings, regulations, geography)
5. **FAQs**: 3-5 per region, answer real questions about costs, timing, local specifics
6. **Testimonials**: 2-3 per region, realistic names (Thomas M., Sandra K. style), specific routes
7. **Companies**: 3 per region with pattern: "{Region} Umzüge", "Express Umzug {Region}", "Swiss Premium Moving {Region}"

### Language Rules:
- Swiss German style (no ß, use "ss")
- Swiss number formatting: CHF 1'200 (apostrophe as thousand separator)
- Use proper Swiss place names

---

## WHAT TO GENERATE

### 1. Complete `REGIONS_DATABASE` for all 26 Cantons:
Already have: `zug`, `zuerich`
Need to generate: `bern`, `luzern`, `basel-stadt`, `basel-landschaft`, `aargau`, `st-gallen`, `solothurn`, `thurgau`, `graubuenden`, `wallis`, `freiburg`, `tessin`, `waadt`, `genf`, `neuenburg`, `schwyz`, `appenzell-ausserrhoden`, `appenzell-innerrhoden`, `schaffhausen`, `glarus`, `jura`, `nidwalden`, `obwalden`, `uri`

### 2. Complete `CITIES_DATABASE` for all 93 Cities:
New file: `src/data/cities-database.ts`

City data is simpler (no companies needed, uses canton's companies):
```typescript
export interface CityDetailData {
  slug: string;
  name: string;
  cantonSlug: string;
  cantonName: string;
  priceCoefficient: number;
  localBlurb: string;
  localTips: string[];
  faqs: { question: string; answer: string }[];
  testimonials: { name: string; location: string; rating: number; text: string; verified: boolean }[];
}
```

---

## OUTPUT FORMAT

Generate two files:

### Output 1: Additions to `src/data/regions-database.ts`
Add the 24 missing cantons to REGIONS_DATABASE.

### Output 2: New file `src/data/cities-database.ts`
Complete database with all 93 cities.

---

## QUALITY CHECKLIST

- [ ] All 26 cantons complete with unique localTips & localBlurb
- [ ] All 93 cities complete with unique content
- [ ] Price coefficients match guidelines
- [ ] Stats proportional to canton/city size
- [ ] SEO titles under 60 chars
- [ ] Meta descriptions under 160 chars
- [ ] 4 unique local tips per location
- [ ] 3-5 relevant FAQs per location
- [ ] 2-3 testimonials with realistic Swiss names
- [ ] nearbyRegions reference valid canton slugs
- [ ] Swiss formatting (CHF, apostrophe separators, no ß)
