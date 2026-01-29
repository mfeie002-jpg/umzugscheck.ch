# 🇨🇭 UMZUGSCHECK.CH – Vollständiges AI-Briefing

> **Für ChatGPT "Project Knowledge" optimiert – Stand: Januar 2026**

---

## 📋 QUICK REFERENCE

| Attribut | Wert |
|----------|------|
| **Projekt** | umzugscheck.ch |
| **Vision** | "Relo-OS" – Relocation Operating System |
| **Claim** | "Der Archetyp, an dem sich alle anderen orientieren" |
| **Ziel** | Digital Marketing Award 2026 |
| **Markt** | Schweizer Umzugsmarkt (~120'000 Umzüge/Jahr) |
| **Sprache** | Schweizer Hochdeutsch (kein "ß") |

---

## 🎯 VISION: THE INVISIBLE MOVE

Umzugscheck.ch transformiert sich von einem Lead-Aggregator zu einem **Relocation Operating System (Relo-OS)**, das den gesamten Umzugsprozess end-to-end abwickelt.

### Primärmetrik: Perfect Moves Delivered (PMD)
- 0 Schadensfälle
- Pünktliche Ankunft
- <1 Stunde Admin-Aufwand für Kunden

### Die 4 Zielgruppen-Archetypen

| Archetyp | Kernbedürfnis | Pain Point |
|----------|---------------|------------|
| **Overwhelmed Professional** | Speed, keine Überwachung | Zeit |
| **Family Manager** | Sicherheit, keine versteckten Kosten | Kontrolle |
| **Silver Downsizer** | Würde, Expertise | Überforderung |
| **Expat Transfer** | Bürokratie, Sprachunterstützung | Fremde |

---

## 🏗️ TECH STACK

```
Frontend:     React 18 + TypeScript + Vite
Styling:      Tailwind CSS + shadcn/ui
State:        TanStack Query + React Context
Routing:      React Router v6 (Lazy Loading)
Backend:      Supabase (Lovable Cloud)
Edge Functions: 80+ Serverless Functions
```

### Verzeichnisstruktur

```
src/
├── assets/              # Statische Assets
├── components/
│   ├── ui/              # shadcn/ui Basis
│   ├── common/          # Wiederverwendbar
│   ├── calculator/      # Preisrechner
│   ├── funnel/          # Lead-Funnels
│   ├── companies/       # Firmen-Listings
│   ├── admin/           # Admin-Dashboard
│   └── layout/          # Header, Footer, Nav
├── hooks/               # Custom Hooks
├── lib/
│   ├── cherries-chaff/  # Lead Routing Engine
│   └── chatgpt-prompt-enhancements.ts
├── data/
│   └── regions-database.ts  # 26 Kantone
├── pages/               # Route-Komponenten
└── integrations/        # Supabase
```

---

## 💼 GESCHÄFTSMODELL: CHERRIES & CHAFF

Das hybride Modell nutzt Umzugscheck als Akquisitions-Funnel für drei interne Marken:

### Lead-Routing Tiers

| Tier | Score | Routing | Aktion |
|------|-------|---------|--------|
| **Tier 1** | >60 | Feierabend Umzug (exklusiv) | Human-Call in 15 Min |
| **Tier 2** | 30-59 | Marketplace (max 3 Partner) | Auto-Versand |
| **Tier 3** | <30 | Reject oder Budget CHF 15 | Keine Concierge |

### Multi-Brand Strategie

| Brand | Segment | Ø Preis | Fokus |
|-------|---------|---------|-------|
| **Feierabend Umzug** | Premium & Concierge | CHF 2'800 | Familien, Senioren |
| **Umzug Express** | Speed & Flexibilität | CHF 1'600 | Profis |
| **Zügelhelden** | Preis-Leistung | CHF 1'100 | Studenten, Budget |

### Revenue Stacking (10 Streams)

1. Commission (Lead-Verkauf)
2. Escrow/Treuhand
3. Insurance
4. Bureaucracy Services
5. Telco Partnerschaften
6. Storage
7. Cleaning
8. Furniture Disposal
9. Premium Listings
10. Data/Insights

---

## 📊 LEAD SCORING LOGIK

```typescript
// Score 0-100 berechnet aus:

SCORING_WEIGHTS = {
  rooms: {
    'gt_3.5': +30,      // Grosser Umzug
    '2.5_to_3.5': +20,  // Standard
    '2_to_2.5': +10,
    '1.5_to_2': 0,
    'lt_1.5': -10,      // Klein
  },
  distance: {
    'gt_50': +20,       // Fernumzug
    '20_to_50': +15,
    '10_to_20': +10,
    'lt_10': +5,        // Lokal
  },
  services: {
    'packing_unpacking': +20,  // Verpackung
    'reinigung': +10,          // Reinigung
    'lagerung': +5,            // Lagerung
  },
  date: {
    'mid_month': +20,   // Tage 3-20 (Kapazitäts-Fill)
    'end_month': 0,     // Tage 26-2
    'urgent': -20,      // <7 Tage
    'tomorrow': -50,    // <24h (Auto-Reject)
  },
  budget_signal: {
    'quality_focus': +10,
    'cheapest': -20,    // Preisjäger
    'student_wg': -30,  // Niedrige Marge
  }
}
```

### Routing Rules

```
Rule 1: Score ≥60 + Kapazität → FEIERABEND_EXCLUSIVE
Rule 2: Score ≥60 + keine Kapazität → MARKETPLACE_PREMIUM_AUCTION
Rule 3: Score 30-59 → MARKETPLACE_ROUND_ROBIN (max 3 Partner)
Rule 4: Score <30 → AUTO_REJECT oder Budget CHF 15
```

### Hard Rules
- Umzüge <CHF 800-1000 → NIEMALS zu Feierabend
- Dynamic Concierge: Human nur für >2.5 Zimmer ODER >50km

---

## 🔄 RELO-OS: 6-PHASEN ARCHITEKTUR

```
┌─────────────────────────────────────────────────────────────────────┐
│                        RELO-OS CUSTOMER JOURNEY                      │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────────┤
│  ROUTE   │INVENTORY │  QUOTE   │ BOOKING  │  MOVING  │   COMPLETE   │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────────┤
│ Initial- │ AI Video │ Instant  │ Quality- │ Live GPS │ Swiss Hand-  │
│ isierung │ Scan +   │ Fixed-   │ Weighted │ Tracking │ over Proto-  │
│          │ LiDAR    │ Price    │ Bidding  │ + ETAs   │ col          │
│          │ Digital  │ Dynamic  │ Smart    │          │ After Move   │
│          │ Twin     │ Pricing  │ Escrow   │          │ Care         │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────────┤
│ 30 Sek   │ 5 Min    │ Instant  │ 24-48h   │ Moving   │ +7 Tage      │
│          │          │          │          │ Day      │              │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────────┘
```

### Phase Details

1. **ROUTE** – Initialisierung
   - Funnel-Entry, PLZ-Eingabe, Service-Auswahl

2. **INVENTORY** – AI Video Scan + LiDAR
   - Digital Twin der Wohnung
   - Automatische Volumenberechnung
   - Spezialitems-Erkennung (Klavier, Kunst)

3. **QUOTE** – Instant Fixed-Price
   - Dynamic Pricing Engine
   - Garantierter Festpreis (keine Überraschungen)
   - Regional-Koeffizienten

4. **BOOKING** – Quality-Weighted Bidding
   - Smart Escrow (Treuhand)
   - Bidding nur für qualifizierte Partner
   - Zahlungsgarantie

5. **MOVING** – Live GPS Tracking
   - Echtzeit-ETAs
   - Status-Updates
   - Direkte Kommunikation

6. **COMPLETE** – Swiss Handover Protocol
   - Digitale Unterschriften
   - Schadensdokumentation
   - After Move Care (Nachbarschaftsinfo)
   - Escrow Release

---

## 🗺️ REGIONEN-DATENBANK (26 Kantone)

Die Datei `src/data/regions-database.ts` enthält für jeden Kanton:

### Datenstruktur pro Kanton

```typescript
interface RegionData {
  slug: string;           // z.B. 'zuerich'
  name: string;           // z.B. 'Zürich'
  short: string;          // z.B. 'ZH'
  
  seo: {
    title: string;
    description: string;
    h1: string;
    canonicalUrl: string;
  };
  
  stats: {
    providerCount: number;
    reviewCount: number;
    avgRating: number;
    activeUsersBase: number;
  };
  
  priceMatrix: {
    small: PriceRange;    // 1.5-2.5 Zimmer
    medium: PriceRange;   // 3.5-4.5 Zimmer
    large: PriceRange;    // 5+ Zimmer
  };
  
  priceCoefficient: number;  // 1.18 für Zürich, 1.0 Durchschnitt
  
  localTips: string[];
  localBlurb: string;
  nearbyRegions: NearbyRegion[];
  topCompanies: Company[];
  faqs: FAQ[];
  testimonials: Testimonial[];
}
```

### Preis-Koeffizienten (Beispiele)

| Kanton | Koeffizient | Bedeutung |
|--------|-------------|-----------|
| Zürich | 1.18 | +18% teurer als Durchschnitt |
| Zug | 1.00 | Durchschnitt |
| Genf | 1.15 | +15% |
| Bern | 1.05 | +5% |
| Aargau | 0.95 | -5% günstiger |

### Alle 26 Kantone

```
ZH Zürich      BE Bern        LU Luzern      UR Uri
SZ Schwyz      OW Obwalden    NW Nidwalden   GL Glarus
ZG Zug         FR Freiburg    SO Solothurn   BS Basel-Stadt
BL Basel-Land  SH Schaffhausen AR Appenzell AR AI Appenzell IR
SG St. Gallen  GR Graubünden  AG Aargau      TG Thurgau
TI Tessin      VD Waadt       VS Wallis      NE Neuenburg
GE Genf        JU Jura
```

---

## 🛤️ ROUTING STRUKTUR

### Hauptfunnels (Core Conversion)

```
/umzugsofferten          → Lead-Funnel "Golden Flow" (Haupteingang)
/preisrechner            → Instant Calculator (SEO-Traffic)
/umzugsfirmen            → Directory (SEO-Traffic)
/umzugsfirmen/{kanton}   → Regionale Rankings
```

### Service-Seiten

```
/services/reinigung      → Endreinigung
/services/entsorgung     → Entsorgung/Räumung
/services/lagerung       → Einlagerung
/services/firmenumzug    → B2B Umzüge
/services/moebellift     → Möbellift
/services/packservice    → Verpackungsservice
```

### Admin-Tools

```
/admin/ai-command-center → AI Prompt Center
/admin/task-queue        → AI Autopilot Hub
/admin/flow-analysis     → Conversion Analyse
/admin/leads             → Lead Management
/admin/providers         → Provider Management
/admin/escrow            → Escrow Dashboard
```

### Flow-Varianten (Testing)

```
/umzugsofferten          → Production (Golden Flow)
/umzugsofferten-v5b      → V5.b Funnel Layout
/umzugsofferten-v5c      → V5.c Archetype 2026
```

---

## ⚡ EDGE FUNCTIONS (80+)

### Kategorien

#### AI-Funktionen
- `ai-assistant` – Allgemeiner AI-Helfer
- `ai-flow-generator` – Flow-Generierung
- `generate-ai-tasks` – Task-Generierung
- `ai-site-analysis` – Website-Analyse
- `analyze-moving-video` – Video-Inventar-Analyse

#### Lead-Management
- `create-funnel-lead` – Lead-Erstellung aus Funnel
- `purchase-lead` – Lead-Kauf durch Provider
- `provider-leads` – Leads für Provider
- `send-lead-notification` – Lead-Benachrichtigung

#### Analyse & Monitoring
- `analyze-landing-page` – Landing Page Analyse
- `lighthouse` – Performance-Analyse
- `deep-flow-analysis` – Conversion-Analyse
- `capture-screenshot` – Screenshot-Capture

#### Benachrichtigungen
- `send-email` – E-Mail-Versand
- `send-sms-notification` – SMS
- `send-review-request` – Review-Anfrage
- `availability-notification` – Verfügbarkeits-Alerts

#### Provider-Management
- `provider-login` – Provider Login
- `provider-signup` – Provider Registrierung
- `provider-subscription` – Abo-Verwaltung
- `admin-verify-provider` – Verifizierung

#### Escrow/Treuhand
- `create-checkout` – Stripe Checkout
- `escrow-webhook` – Escrow Events
- `stripe-webhook` – Stripe Events

---

## 🧪 A/B TESTING SYSTEM

### Navigation-Varianten (17 Versionen)

```
V1-V17 Navigation Variants
├── Header Layout
├── CTA Placement
├── Menu Structure
└── Mobile Behavior
```

### Flow-Varianten (48+)

```
48+ Flow-Varianten konsolidiert zu:
└── "Golden Flow" = V10 Smart Router + V10 Navigation
```

### Konfiguration

Datei: `src/contexts/NavigationABContext.tsx`
Config: `src/lib/unified-ab-config.ts`

```typescript
// URL Override: ?nav=v10
// localStorage: AB_STORAGE_KEYS.NAV_VARIANT
```

---

## 🧠 CHATGPT PROMPT LIBRARY (10 Premium)

Datei: `src/lib/chatgpt-prompt-enhancements.ts`

### 1. Cross-Validation Matrix (P0)
Kreuzvalidierung aller Flows auf Inkonsistenzen.

### 2. Friction Point Deep-Dive (P0)
Identifiziert und quantifiziert alle Reibungspunkte:
- Cognitive Load
- Decision Fatigue
- Input Friction
- Trust Friction
- Visual Friction
- Mobile Friction

### 3. Conversion Psychology Audit (P0)
Cialdini's 6 Prinzipien:
- Reciprocity
- Commitment
- Social Proof
- Authority
- Liking
- Scarcity

### 4. Mobile Excellence Check (P0)
Google Mobile-First Standards:
- Core Web Vitals
- Touch-Optimierung (48px Targets)
- Thumb Zone Analyse

### 5. Copy Teardown (P1)
Analyse aller Texte auf AIDA-Score.

### 6. Competitor Benchmark Template (P1)
Feature Matrix für Wettbewerbsvergleich.

### 7. A/B Test Hypothesis Generator (P1)
ICE-Score basierte Hypothesen.

### 8. V10 Ultimate Blueprint (P0)
Detaillierte Spezifikation für perfekten Flow:
- ⏱️ Unter 90 Sekunden komplett
- 📱 Mobile-First
- 🛡️ Trust auf jedem Step
- ⚡ Zero Friction

### 9. Accessibility Quick-Audit (P1)
WCAG 2.1 Schnellprüfung.

### 10. Implementation Roadmap (P0)
Priorisierte Umsetzungs-Roadmap:
- Quick Wins (1-2 Tage)
- Short-Term (1-2 Wochen)
- Medium-Term (1 Monat)
- Long-Term (Quartal)

---

## 🤖 AI AUTOPILOT SYSTEM

### Task Queue

Pfad: `/admin/task-queue`
Tabelle: `ai_task_queue`

### Agents

| Agent | Fokus | Tasks |
|-------|-------|-------|
| **CODEX** | Code | Bugs, Features, Refactoring |
| **COPILOT** | Copy/UX | Texte, Design, Conversion |

### Workflow

```
1. Task wird erstellt (manuell oder auto-generiert)
2. Agent wird assigned
3. Status: pending → in_progress → completed
4. Output wird gespeichert
5. Realtime Auto-Load nach Completion
```

### Auto-Generation

Bei leerem Queue werden automatisch neue Tasks basierend auf:
- Flow-Analyse-Ergebnissen
- Security Scans
- Performance-Metriken
- User Feedback

---

## 🛡️ SWISS TRUST TRIUMVIRATE

Grading-Framework für Umzugsfirmen:

### 3 Säulen

| Säule | Gewicht | Faktoren |
|-------|---------|----------|
| **Institutional Trust** | 35% | UID, Versicherung, Mitgliedschaften |
| **Social Trust** | 30% | Reviews, Team-Fotos, Cases |
| **Process Trust** | 35% | Transparenz, Garantien, SLAs |

### Quality Tiers

```
Elite (90-100)   → "Swiss Premium Partner"
Premium (75-89)  → "Verified Partner"
Verified (60-74) → "Geprüfter Anbieter"
Basis (<60)      → Standard-Listing
```

---

## 🗣️ SPRACHLICHE KONVENTIONEN

### Schweizer Hochdeutsch

- **KEIN "ß"** → Immer "ss" (Strasse, Gruss, Schweiss)
- **"zügeln"** statt "umziehen"
- **"Offerte"** statt "Angebot"
- **"Zügeltermin"** statt "Umzugstermin"
- **Zahlenformat**: CHF 1'500 (Apostroph, nicht Punkt)

### Tonalität

- **Sie-Form** für formelle Kommunikation
- Vertrauenswürdig, seriös
- Keine übertriebenen Superlative
- Schweizer Bescheidenheit

### Beispiele

❌ "Das beste Umzugsunternehmen Deutschlands"
✅ "Geprüfte Umzugsfirmen in der Schweiz"

❌ "Jetzt Angebot sichern!"
✅ "Jetzt Offerte erhalten"

❌ "Super günstiger Preis!"
✅ "Faire, transparente Preise"

---

## 📁 KEY FILES REFERENZ

### Core Business Logic

```
src/lib/cherries-chaff/
├── index.ts           → Exports
├── types.ts           → Lead, RoutingTier Types
├── routing-brain.ts   → Lead Scoring & Routing
├── calculations.ts    → COGS, CAC, CM2
├── scenarios.ts       → Markt-Szenarien
└── guardrails.ts      → Alerts & Kill-Switches
```

### Data

```
src/data/
├── regions-database.ts  → 26 Kantone komplett
└── constants.ts         → CITIES, SERVICES, SITE_CONFIG
```

### AI & Prompts

```
src/lib/chatgpt-prompt-enhancements.ts  → 10 Premium Prompts
```

### A/B Testing

```
src/contexts/NavigationABContext.tsx  → Nav A/B Context
src/lib/unified-ab-config.ts          → Unified Config
src/lib/navigation-variants.ts        → 17 Nav Variants
```

### Architecture

```
ARCHITECTURE.md          → Tech-Architektur
docs/AI_BRIEFING.md      → Dieses Dokument
docs/MERGE_REPORT.md     → Repository-Merge Info
```

---

## 🎖️ ERFOLGSKRITERIEN

### Digital Marketing Award 2026

- ✓ Strategie
- ✓ UX
- ✓ Conversion
- ✓ Automatisierung
- ✓ Innovation

### Performance KPIs

| Metrik | Ziel |
|--------|------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Funnel Conversion | > 15% |
| Lead Quality Score | > 65 |

---

## 🚀 QUICK START FÜR NEUE AI

1. **Verstehe das Geschäftsmodell**: Cherries & Chaff Hybrid
2. **Kenne die 3 Brands**: Feierabend (Premium), Express (Speed), Zügelhelden (Value)
3. **Lead Scoring**: Score >60 = Premium, 30-59 = Marketplace, <30 = Reject
4. **Schweizer Sprache**: Kein "ß", "zügeln", "Offerte", Sie-Form
5. **Relo-OS Vision**: 6 Phasen von Route bis Complete
6. **Prompt Library nutzen**: 10 Prompts für Conversion-Optimierung

---

## 📞 SUPPORT

Bei Fragen zur Architektur:
- `ARCHITECTURE.md` lesen
- Edge Functions in `supabase/functions/` prüfen
- Routing-Logik in `src/lib/cherries-chaff/` verstehen

---

*Letzte Aktualisierung: Januar 2026*
*Version: 1.0*
*Generiert für ChatGPT Project Knowledge*
