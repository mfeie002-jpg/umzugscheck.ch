
# Integration Plan: 7 Link-Worthy AI Products

## Executive Summary

Die 7 vorgeschlagenen Produkte sind eine **perfekte Erweiterung** der Relo-OS Architektur. Sie transformieren Umzugscheck.ch von einem internen Funnel-System zu einer **öffentlichen Infrastruktur**, die andere verlinken und integrieren.

**Priorisierung basierend auf:**
- Was bereits gebaut ist
- Geringster Aufwand → höchster Impact
- Alignment mit Relo-OS 6-Phasen

---

## Mapping zu Relo-OS Architektur

```
Relo-OS Phasen          →    Neue Produkte
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: ROUTE          →    Address Intelligence (#2)
                              "Real Address Exists" Validation
                              
Phase 3: QUOTE          →    Cost & Time Reality Index (#7)
                              Öffentlicher Benchmark
                              
Phase 4: BOOKING        →    Quality Badge System (#6) ✓
                              Bereits vorhanden - erweitern
                              
Phase 6: COMPLETE       →    Move Readiness Checker (#1)
                              Permit & Parking Planner (#4)
                              Utility Switchboard (#5)
                              
Plattform-weit          →    City Move Pulse (#3)
                              Aggregierte Insights
```

---

## Bereits vorhandenes Fundament

### Swiss Integration (Phase 6)
```
src/lib/relo-os/swiss-integration/
├── eumzug-ch.ts      ← eCH-0221 Standard bereits definiert
├── swiss-post.ts     ← T-7 Reminder Logic vorhanden
└── index.ts          ← SwissAdminAutopilotState definiert
```

### Quality Badge System
```
src/lib/quality-badge.ts
├── BadgeLevel: 'none' | 'verified' | 'premium' | 'elite'
├── calculateBadgeLevel() - funktionsfähig
├── Trust Triumvirate Integration - vorhanden
└── 651 Zeilen ausgereifter Code
```

### Pricing Engine
```
src/lib/guaranteed-price-engine.ts
├── Festpreis-Kalkulation
├── Confidence-Level System
├── Volumen/Distanz-basiert
└── Swiss Consumer Protection compliant
```

---

## Implementierungsplan: 3 Phasen

### PHASE 1: Link-Magnet (4-6 Wochen)
**Produkt: Move Readiness Checker + Permit Planner Combo**

#### Warum dieses zuerst?
- Baut auf bestehendem `swiss-integration/` auf
- Direkt linkable von Gemeinden, HR, Landlords
- Perfect für AI-gestützte Timeline-Generierung
- Differentiator: "Swiss Admin Autopilot" wird sichtbar

#### Neue Dateien
```
src/lib/relo-os/swiss-integration/
├── move-readiness/
│   ├── timeline-generator.ts    # T-30 bis T+14 Timeline
│   ├── canton-rules.ts          # Kantonale Regeln DB
│   └── checklist-engine.ts      # Personalisierte Checkliste
├── parking-permit/
│   ├── city-requirements.ts     # Stadt-spezifische Regeln
│   ├── permit-generator.ts      # Formular-Guide Generator
│   └── deadline-calculator.ts   # Fristen-Berechnung
└── index.ts                     # Updated exports
```

#### Neue Pages
```
src/pages/tools/
├── MoveReadinessChecker.tsx     # /umzugs-checkliste-generator
├── ParkingPermitPlanner.tsx     # /halteverbot-planer
└── index.tsx
```

#### Datenquellen
- eUmzugCH für Gemeinde-Eligibility (bereits in eumzug-ch.ts)
- Swiss Post für Fristen (bereits in swiss-post.ts)
- Neue DB: `parking_permit_rules` pro Stadt (8 Städte MVP)

#### AI-Layer
```typescript
// Edge Function: generate-move-timeline
interface TimelineRequest {
  fromCanton: string;
  toCanton: string;
  moveDate: string;
  householdType: 'single' | 'couple' | 'family';
  isRenter: boolean;
  needsCleaning: boolean;
}

interface TimelineResponse {
  timeline: TimelineItem[];  // T-30, T-14, T-7, T-3, T-1, Move Day, T+1, T+14
  checklist: ChecklistItem[];
  permits: PermitRequirement[];
  downloads: { type: string; url: string }[];
}
```

---

### PHASE 2: Embed + API (6-10 Wochen)
**Produkt: Address Intelligence Widget**

#### Erweiterung bestehender Infrastruktur
```
src/lib/swiss-validators.ts
├── swissPlzSchema              ← Erweitern um Swiss Post API
├── validateSwissPlz()          ← Building-Level Validation
└── Neue: SwissAddressAPI class
```

#### Neue Edge Functions
```
supabase/functions/
├── validate-address/          # POST - Validiert + enriched
├── suggest-address/           # GET - Autocomplete
└── address-intelligence/      # GET - Building-Level Insights
```

#### Öffentliche API Docs
```
src/pages/api/
├── AddressApiDocs.tsx         # /api/address - Dokumentation
└── ApiPlayground.tsx          # Live Tester
```

#### Embeddable Widget
```
src/components/embeddable/
├── AddressWidget.tsx          # iFrame-ready
└── widget-sdk.ts              # JavaScript SDK für externe Sites
```

---

### PHASE 3: Authority Product (Ongoing)
**Produkt: City Move Pulse Dashboard**

#### Daten-Aggregation
```
src/lib/analytics/
├── move-pulse/
│   ├── aggregator.ts          # Anonymisierte Lead-Aggregation
│   ├── seasonality.ts         # Saisonale Muster
│   └── insights-generator.ts  # AI Monthly Insights
```

#### Neue Pages
```
src/pages/pulse/
├── CityMovePulse.tsx          # /move-pulse/zuerich
├── PulseOverview.tsx          # /move-pulse
└── MonthlyReport.tsx          # /move-pulse/report/2026-01
```

#### Datenschutz-Architektur
- Minimum 50 Anfragen pro Stadt/Monat für Anzeige
- Keine Gebäude-Level-Daten
- Nur aggregierte Trends

---

## Quality Badge Erweiterung (#6)

Das bestehende System erweitern um **"Verified Move"** Tracking:

```typescript
// Erweiterung in src/lib/quality-badge.ts

interface VerifiedMoveMetrics {
  quoteAccuracy: number;       // Final vs Quote (%)
  punctualityScore: number;    // On-time arrival (%)
  damageClaimRate: number;     // Claims per 100 moves
  resolutionSpeed: number;     // Days to resolve issues
  customerSatisfaction: number; // Post-move survey
}

interface EnhancedBadgeLevel extends BadgeLevel {
  verifiedMoves: number;
  metrics: VerifiedMoveMetrics;
}
```

---

## Cost & Time Reality Index (#7)

Daten aus `guaranteed-price-engine.ts` aggregieren:

```
src/pages/tools/
├── MovingCostIndex.tsx        # /umzugskosten-index
├── CityPricingPage.tsx        # /umzugskosten/zuerich
```

Bereits vorhanden in `guaranteed-price-engine.ts`:
- Volume-basierte Kalkulation
- Distanz-Faktoren
- Etagen/Lift-Multiplikatoren
- Tier-Preise (Essential/Comfort/Premium)

---

## SEO & Link-Strategie

### Flagship Pages (Link-Magnets)
```
/umzugs-checkliste-generator     # Move Readiness Checker
/halteverbot-planer              # Permit & Parking Planner
/umzugskosten-index              # Cost Reality Index
/move-pulse                      # City Move Pulse
```

### Embed-Produkte
```
/api/address                     # Address Intelligence API Docs
/widget/address                  # Embeddable Widget Demo
```

### Schema.org Markup
- HowTo Schema für Checklisten
- FAQPage Schema für Permit-Fragen
- Dataset Schema für Cost Index

---

## Datenquellen-Integration

### Bereits verfügbar (nutzen)
- Swiss Post Address Assistant (free)
- swisstopo Building Addresses (free)
- eUmzugCH Commune List (via API)
- swissBOUNDARIES3D (free)

### Neue Daten aufbauen
- `parking_permit_rules` (8 Städte MVP)
- `canton_regulations` (26 Kantone)
- Aggregierte Lead-Daten (City Move Pulse)

---

## Technische Umsetzung

### Neue Module
```
src/lib/relo-os/
├── swiss-integration/
│   ├── move-readiness/         # NEU
│   ├── parking-permit/         # NEU
│   ├── utility-switch/         # NEU (Phase 2)
│   └── ... (existing)
├── public-tools/               # NEU
│   ├── cost-index.ts
│   ├── pulse-aggregator.ts
│   └── address-api.ts
```

### Edge Functions
```
supabase/functions/
├── generate-move-timeline/     # NEU
├── validate-address/           # Erweitern
├── get-parking-requirements/   # NEU
└── generate-pulse-insights/    # NEU (Phase 3)
```

### Database
```sql
-- Neue Tabellen
CREATE TABLE parking_permit_rules (
  city_slug TEXT PRIMARY KEY,
  requires_permit BOOLEAN,
  lead_time_days INTEGER,
  contact_url TEXT,
  instructions JSONB,
  updated_at TIMESTAMP
);

CREATE TABLE canton_regulations (
  canton_code TEXT PRIMARY KEY,
  eumzug_supported BOOLEAN,
  registration_deadline_days INTEGER,
  special_rules JSONB
);
```

---

## Zusammenfassung

| Phase | Produkt | Timeline | Aufwand |
|-------|---------|----------|---------|
| **1** | Move Readiness + Permit Planner | 4-6 Wochen | Mittel |
| **2** | Address Intelligence Widget | 6-10 Wochen | Hoch |
| **3** | City Move Pulse | Ongoing | Mittel |

**Empfehlung:** Starte mit Phase 1 (Move Readiness + Permit Planner) - es baut direkt auf dem bestehenden `swiss-integration/` Code auf und ist der schnellste Weg zu einem "linkable" Produkt.

---

## Nächste Schritte

1. **Parking Permit Rules DB** für 8 Städte aufbauen (Zürich, Basel, Bern, Winterthur, Luzern, St. Gallen, Lausanne, Genf)
2. **Timeline Generator** Edge Function erstellen
3. **Public Pages** `/umzugs-checkliste-generator` und `/halteverbot-planer` bauen
4. **Schema.org Markup** für SEO-Optimierung
