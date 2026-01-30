
# Detaillierter Implementierungsplan: Fehlende AI-Produkte

## Status Zusammenfassung

Basierend auf der Codebase-Analyse sind **5.5 von 8 Produkten** bereits implementiert. Die folgenden 2.5 Produkte fehlen noch:

| Produkt | Status | Aufwand |
|---------|--------|---------|
| 1. **Review Sentiment Analyzer** | ❌ 0% | Hoch |
| 2. **Move Health Index + Post-Move Survey** | ❌ 10% | Sehr hoch |
| 3. **Neighborhood Future Simulator** | ⚠️ 40% | Mittel |
| 4. **Canton-to-Canton Flow Map** | ⚠️ 30% | Mittel |
| 5. **Predictive Trends Edge Function** | ⚠️ 20% | Mittel |

---

## Produkt 1: AI Review Sentiment Analyzer

### Beschreibung
NLP-basierte Analyse von Bewertungen zur automatischen Kategorisierung von Stärken/Schwächen pro Anbieter.

### Datenbank-Schema
Neue Tabelle `review_sentiments`:
```sql
CREATE TABLE review_sentiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES service_providers(id),
  
  -- Sentiment Scores
  overall_sentiment NUMERIC, -- -1.0 bis +1.0
  punctuality_score NUMERIC,
  professionalism_score NUMERIC,
  value_for_money_score NUMERIC,
  communication_score NUMERIC,
  care_with_items_score NUMERIC,
  
  -- Extracted Keywords
  positive_keywords TEXT[],
  negative_keywords TEXT[],
  
  -- Analysis Meta
  confidence NUMERIC,
  analyzed_at TIMESTAMP DEFAULT now(),
  model_version TEXT DEFAULT 'gemini-3-flash-preview'
);

-- Aggregierte Provider-Sentiments
CREATE TABLE provider_sentiment_summary (
  provider_id UUID PRIMARY KEY REFERENCES service_providers(id),
  total_reviews_analyzed INTEGER DEFAULT 0,
  avg_sentiment NUMERIC,
  
  -- Category Scores
  punctuality_avg NUMERIC,
  professionalism_avg NUMERIC,
  value_avg NUMERIC,
  communication_avg NUMERIC,
  care_avg NUMERIC,
  
  -- Top Keywords
  top_positive_keywords JSONB,
  top_negative_keywords JSONB,
  
  last_updated TIMESTAMP DEFAULT now()
);
```

### Edge Function: `analyze-review-sentiment`
```
supabase/functions/analyze-review-sentiment/
├── index.ts           # Main handler
└── sentiment-prompt.ts # Structured prompt for Gemini
```

**Technischer Ablauf:**
1. Trigger bei neuem Review OR Batch-Processing
2. Gemini 3 Flash mit structured output (tool calling)
3. Extrahiert 5 Kategorien + Keywords
4. Speichert in `review_sentiments`
5. Aktualisiert `provider_sentiment_summary`

**Tool Definition für Gemini:**
```typescript
const SENTIMENT_TOOL = {
  type: "function",
  function: {
    name: "analyze_review",
    parameters: {
      type: "object",
      properties: {
        overall_sentiment: { type: "number", minimum: -1, maximum: 1 },
        categories: {
          type: "object",
          properties: {
            punctuality: { type: "number", minimum: 0, maximum: 10 },
            professionalism: { type: "number", minimum: 0, maximum: 10 },
            value_for_money: { type: "number", minimum: 0, maximum: 10 },
            communication: { type: "number", minimum: 0, maximum: 10 },
            care_with_items: { type: "number", minimum: 0, maximum: 10 }
          }
        },
        positive_keywords: { type: "array", items: { type: "string" } },
        negative_keywords: { type: "array", items: { type: "string" } }
      }
    }
  }
};
```

### Frontend Komponente
```
src/components/providers/
└── SentimentInsights.tsx   # Radar-Chart + Keyword Cloud
```

**Features:**
- Radar-Chart mit 5 Kategorien
- Positive/Negative Keyword-Badges
- Trend-Vergleich (letzte 30 Tage vs. davor)
- Integration in Provider-Profil-Seite

---

## Produkt 2: Move Health Index + Post-Move Survey

### Beschreibung
Crowdsourced Feedback-System zur Messung von Umzugszufriedenheit und Stresslevel pro Region.

### Datenbank-Schema
```sql
-- Post-Move Surveys
CREATE TABLE post_move_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id),
  
  -- Location Data (anonymisiert)
  from_canton TEXT,
  to_canton TEXT,
  
  -- Stress & Satisfaction
  overall_satisfaction INTEGER CHECK (overall_satisfaction BETWEEN 1 AND 5),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5), -- 1=sehr entspannt, 5=sehr stressig
  
  -- Category Ratings
  planning_ease INTEGER CHECK (planning_ease BETWEEN 1 AND 5),
  moving_company_satisfaction INTEGER CHECK (moving_company_satisfaction BETWEEN 1 AND 5),
  admin_ease INTEGER CHECK (admin_ease BETWEEN 1 AND 5), -- Behördengänge
  neighbors_welcome INTEGER CHECK (neighbors_welcome BETWEEN 1 AND 5),
  
  -- Context
  had_damage BOOLEAN DEFAULT false,
  move_type TEXT, -- 'professional' | 'self' | 'mixed'
  household_type TEXT, -- 'single' | 'couple' | 'family'
  
  -- Open Feedback
  what_went_well TEXT,
  what_could_improve TEXT,
  
  -- Meta
  submitted_at TIMESTAMP DEFAULT now()
);

-- Aggregated Regional Index
CREATE TABLE move_health_index (
  canton_code TEXT PRIMARY KEY,
  canton_name TEXT,
  
  -- Scores (0-100)
  overall_health_score NUMERIC,
  satisfaction_index NUMERIC,
  stress_index NUMERIC,
  
  -- Category Breakdown
  planning_score NUMERIC,
  company_score NUMERIC,
  admin_score NUMERIC,
  welcome_score NUMERIC,
  
  -- Stats
  total_responses INTEGER,
  damage_rate_percent NUMERIC,
  
  -- Trend
  trend_vs_last_quarter TEXT, -- 'improving' | 'stable' | 'declining'
  
  last_calculated TIMESTAMP
);
```

### Edge Functions
```
supabase/functions/
├── submit-post-move-survey/    # Survey submission + validation
└── aggregate-move-health/      # Scheduled aggregation (weekly)
```

**Privacy-Regeln:**
- Minimum 20 Responses pro Kanton für Anzeige
- Keine Gemeinde-Level-Daten (zu granular)
- Keine Verknüpfung zu Provider-IDs in öffentlicher Ansicht

### Frontend Komponenten
```
src/components/relo-os/
├── PostMoveSurvey.tsx          # 5-Step Wizard (Relo-OS Phase 6)
└── SurveyTrigger.tsx           # T+7 Email/In-App Reminder

src/pages/
└── MoveHealthIndex.tsx         # Public Dashboard (/move-health-index)

src/components/data-journalism/
└── MoveHealthWidget.tsx        # Embeddable Widget
```

**Survey Flow (5 Steps):**
1. Overall: Zufriedenheit & Stress-Level
2. Planning: War die Planung einfach?
3. Moving Day: Wie lief der Umzugstag?
4. Admin: Behördengänge, Ummeldung
5. New Home: Willkommenskultur, Nachbarn

**Integration mit Relo-OS Phase 6:**
- Trigger nach 7 Tagen post-move
- Einbindung in HandoverProtocol.tsx
- Optional: Push-Notification via send-satisfaction-survey erweitern

---

## Produkt 3: Neighborhood Future Simulator

### Beschreibung
Interaktive 5-10-Jahres-Projektion für Quartiere basierend auf BFS-Szenarien.

### Datenbank-Erweiterung
`neighborhood_profiles` bereits vorhanden mit:
- population_growth_percent
- avg_age
- foreigner_percent

**Neue Spalten:**
```sql
ALTER TABLE neighborhood_profiles ADD COLUMN IF NOT EXISTS
  bfs_scenario_high JSONB,  -- {pop_2030, pop_2035, avg_age_2030, etc.}
  bfs_scenario_medium JSONB,
  bfs_scenario_low JSONB,
  infrastructure_outlook TEXT, -- 'expanding' | 'stable' | 'declining'
  development_projects JSONB; -- [{name, type, completion_year}]
```

### Frontend Komponente
```
src/pages/tools/
└── NeighborhoodFutureSimulator.tsx  # /quartier-prognose

src/components/tools/
├── FutureTimelineSlider.tsx    # Jahr-Slider (2025-2035)
├── ProjectionChart.tsx         # Bevölkerung/Alter/Miete über Zeit
└── DevelopmentProjectCard.tsx  # Geplante Bauprojekte
```

**Features:**
- Stadt-Auswahl (basierend auf `neighborhood_profiles`)
- Timeline-Slider: 2025 → 2035
- 3 Szenarien: Hoch/Mittel/Niedrig (BFS-Standard)
- Visualisierung:
  - Bevölkerungsentwicklung (Line Chart)
  - Altersstruktur-Veränderung
  - Geschätzte Mietpreisentwicklung
  - Infrastruktur-Outlook Badge
- Geplante Projekte (Bau, ÖV, etc.)

**Datenquellen:**
- BFS Bevölkerungsszenarien (opendata.swiss, kostenlos)
- Bestehende `neighborhood_profiles` Daten
- Manuelle Ergänzung: Bauprojekte pro Stadt

---

## Produkt 4: Canton-to-Canton Flow Map

### Beschreibung
Interaktive Visualisierung der Umzugsströme zwischen Kantonen.

### Datenbank-Schema
```sql
CREATE TABLE canton_migration_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER,
  from_canton TEXT,
  to_canton TEXT,
  
  -- Flow Data
  move_count INTEGER,
  avg_cost NUMERIC,
  
  -- Trend
  yoy_change_percent NUMERIC,
  trend TEXT, -- 'steigend' | 'stabil' | 'sinkend'
  
  -- Meta
  source TEXT DEFAULT 'platform_data',
  created_at TIMESTAMP DEFAULT now()
);
```

### Frontend Komponente
```
src/components/data-journalism/
├── MovingFlowMap.tsx           # SVG Schweiz-Karte mit Flow-Linien
├── FlowSankeyChart.tsx         # Alternative: Sankey-Diagramm
└── CantonFlowDetails.tsx       # Detail-Panel bei Klick
```

**Features:**
- SVG Schweiz-Karte mit 26 Kantonen
- Animierte Flow-Linien (Stärke = Volumen)
- Klick auf Kanton → Detail-Panel:
  - Top 5 Ziel-Kantone
  - Top 5 Herkunfts-Kantone
  - Durchschnittskosten
  - Trend vs. Vorjahr
- Filter: Jahr, Richtung (Zu-/Abwanderung)

**Datenquellen:**
- Primär: Aggregierte Platform-Daten (leads Tabelle)
- Sekundär: BFS Wanderungsstatistik (jährlich)

---

## Produkt 5: Predictive Trends Edge Function

### Beschreibung
AI-gestützte Prognose für Umzugsnachfrage basierend auf historischen Daten.

### Edge Function
```
supabase/functions/predict-moving-trends/
├── index.ts           # Main handler
├── data-aggregator.ts # Aggregiert Platform + BFS Daten
└── prompts.ts         # Gemini Prognose-Prompts
```

**Input:**
- Historische Leads (aggregiert pro Monat/Kanton)
- Saisonale Muster aus `MONTHLY_DISTRIBUTION`
- BFS Migrationsstatistik

**Output (Structured via Tool Calling):**
```typescript
interface TrendPrediction {
  canton: string;
  month: string;
  predicted_volume_index: number; // 0-200 (100 = Durchschnitt)
  confidence: number; // 0-1
  drivers: string[]; // ["Quartalswechsel", "Semesterbeginn", etc.]
  comparison: {
    vs_last_year: number;
    vs_3year_avg: number;
  };
}
```

### Frontend Integration
```
src/components/data-journalism/
└── PredictiveTrendsPanel.tsx   # Einbindung in MovingStatisticsDashboard
```

**Features:**
- 3-Monats-Prognose
- Kanton-spezifische Vorhersagen
- Confidence-Level Anzeige
- "Drivers" Erklärung (warum diese Prognose)

---

## Implementierungs-Reihenfolge

### Woche 1-2: Move Health Index (Basis)
1. DB Migration: `post_move_surveys`, `move_health_index`
2. Edge Function: `submit-post-move-survey`
3. Frontend: `PostMoveSurvey.tsx` (5-Step Wizard)
4. Integration: Trigger in Relo-OS Phase 6

### Woche 3-4: Sentiment Analyzer
1. DB Migration: `review_sentiments`, `provider_sentiment_summary`
2. Edge Function: `analyze-review-sentiment` mit Gemini Tool-Calling
3. Frontend: `SentimentInsights.tsx` (Radar + Keywords)
4. Integration: Provider-Profil-Seite

### Woche 5-6: Flow Map + Future Simulator
1. DB Migration: `canton_migration_flows`, `neighborhood_profiles` Erweiterung
2. Frontend: `MovingFlowMap.tsx` (SVG Karte)
3. Frontend: `NeighborhoodFutureSimulator.tsx` (Timeline UI)
4. Daten-Import: BFS Szenarien

### Woche 7-8: Predictive Trends + Polish
1. Edge Function: `predict-moving-trends`
2. Frontend: `PredictiveTrendsPanel.tsx`
3. Frontend: `MoveHealthIndex.tsx` (Public Dashboard)
4. Embeddable Widgets für alle neuen Features

---

## Technische Details

### Gemini Tool-Calling Pattern (Standard)
```typescript
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-3-flash-preview",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userContent }],
    tools: [STRUCTURED_OUTPUT_TOOL],
    tool_choice: { type: "function", function: { name: "tool_name" } },
  }),
});
```

### Privacy-Architektur
- Alle User-Daten anonymisiert bei Aggregation
- Minimum N=20 für öffentliche Anzeige
- Keine Verknüpfung Review → Provider in Sentiment-Export
- GDPR-konform: Löschung auf Anfrage

### Caching-Strategie
- `move_health_index`: Wöchentliche Neuberechnung
- `provider_sentiment_summary`: Bei jedem neuen Review
- `canton_migration_flows`: Monatliche Aktualisierung
- Predictions: 24h Cache

---

## Deliverables pro Produkt

| Produkt | DB Tables | Edge Functions | Frontend Components | Routes |
|---------|-----------|----------------|---------------------|--------|
| Sentiment Analyzer | 2 | 1 | 1 | - |
| Move Health Index | 2 | 2 | 3 | `/move-health-index` |
| Future Simulator | 0 (+columns) | 0 | 4 | `/quartier-prognose` |
| Flow Map | 1 | 1 | 3 | (in `/daten`) |
| Predictive Trends | 0 | 1 | 1 | (in `/daten`) |

**Gesamt:**
- 5 neue DB-Tabellen
- 5 neue Edge Functions
- 12 neue Frontend-Komponenten
- 2 neue öffentliche Routen
