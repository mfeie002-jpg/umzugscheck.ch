
# Integration Analyse: 8 Link-Worthy AI Products

## Executive Summary

Von den 8 vorgeschlagenen Produkten sind **5.5 bereits implementiert**. Nur 2.5 Produkte fehlen noch vollständig oder als eigenständige Tools.

---

## Status-Matrix

```
┌─────────────────────────────────┬────────────┬────────────────────────────────┐
│ Produkt                         │ Status     │ Implementierung                │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 1. Move Readiness Checker       │ ✅ FERTIG  │ /umzugs-checkliste-generator   │
│                                 │            │ 675 LOC, Wizard + Timeline     │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 2. Entsorgungs-Planer           │ ❌ NEU     │ Nicht vorhanden                │
│                                 │            │ Nur als Add-on erwähnt         │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 3. Gemeinde-Wizard              │ ⚠️ 50%     │ Logic: eumzug-ch.ts            │
│                                 │            │ Fehlt: Standalone-Page         │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 4. Address Change Autopilot     │ ⚠️ 50%     │ Logic: swiss-post.ts           │
│                                 │            │ Fehlt: Standalone-Page         │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 5. Halteverbot-Planer           │ ✅ FERTIG  │ /halteverbot-planer            │
│                                 │            │ 670 LOC, 8 Städte              │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 6. Swiss Handover Protocol      │ ✅ FERTIG  │ HandoverProtocol.tsx           │
│                                 │            │ 405 LOC, Digitale Unterschrift │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 7. Trust Score Badge + API      │ ✅ FERTIG  │ quality-badge.ts               │
│                                 │            │ 651 LOC, Trust Triumvirate     │
├─────────────────────────────────┼────────────┼────────────────────────────────┤
│ 8. MovePulse / Zügel-Report     │ ✅ FERTIG  │ /daten                         │
│                                 │            │ Index + Dashboard + Living     │
└─────────────────────────────────┴────────────┴────────────────────────────────┘
```

---

## Bereits Implementierte Produkte (Details)

### 1. Move Readiness Checker ✅

**Datei:** `src/pages/tools/MoveReadinessChecker.tsx` (675 LOC)

**Features:**
- Wizard-Interface mit PLZ-Eingabe
- Canton-Erkennung aus PLZ
- Personalisierte Timeline (T-30 bis T+14)
- Household-Type-Optionen (Single/Couple/Family)
- Zusatz-Optionen (Kinder, Haustiere, Fahrzeuge)
- Checklisten-Engine mit Fortschritt-Tracking
- Schema.org HowTo-Markup für SEO

**Route:** `/umzugs-checkliste-generator`

---

### 5. Halteverbot & Permit Planner ✅

**Datei:** `src/pages/tools/ParkingPermitPlanner.tsx` (670 LOC)

**Features:**
- 8 Städte implementiert (ZH, BS, BE, WI, LU, SG, LS, GE)
- Deadline-Calculator mit Schweizer Feiertagen
- Step-by-Step Anleitung pro Stadt
- Kosten-Schätzung pro Fahrzeugtyp
- Kontakt-URLs zu Behörden
- Frist-Warnungen bei knapper Zeit

**Route:** `/halteverbot-planer`

---

### 6. Swiss Handover Protocol ✅

**Datei:** `src/components/relo-os/HandoverProtocol.tsx` (405 LOC)

**Features:**
- Raum-für-Raum Dokumentation
- 4 Standard-Kategorien (Reinigung, Schlüssel, Zähler, Zustand)
- Foto-Upload Tracking
- Digitale Unterschrift (Mieter + Vermieter)
- Progress-Tracking mit Pflichtfeldern
- Swiss Rental Law konform ("Wohnungsabgabe")

**Integration:** Relo-OS Phase 6 (Complete)

---

### 7. Trust Score Badge ✅

**Datei:** `src/lib/quality-badge.ts` (651 LOC)

**Features:**
- 4 Badge-Levels (none, verified, premium, elite)
- Trust Triumvirate Integration:
  - Institutional Trust (UID, Handelsregister, ASTAG)
  - Social Trust (Reviews, Team Photos)
  - Process Trust (Transparenz, Garantien)
- Grenzwerte und Berechnung
- Verifizierbare Links (Zefix, etc.)

---

### 8. MovePulse / Zügel-Report ✅

**Dateien:**
- `src/components/data-journalism/MovingCostIndex.tsx` (330 LOC)
- `src/components/data-journalism/MovingStatisticsDashboard.tsx` (403 LOC)
- `src/components/data-journalism/LivingCostComparison.tsx`
- `src/pages/DataJournalismPage.tsx`

**Route:** `/daten`

**Features:**
- Umzugskosten-Index pro Kanton (alle 26)
- Trend-Analyse (steigend/stabil/sinkend)
- Jahresstatistik mit Recharts-Visualisierung
- Saisonale Muster
- Top-10 Umzugsrouten
- Methodik-Abschnitt für Journalisten

---

## Fehlende Produkte (Implementierungsplan)

### 2. Entsorgungs- & Sperrgut Planner ❌ (100% NEU)

**Warum wichtig:**
- Städte wie ERZ Zürich haben offene APIs
- Jeder Umzug hat Entsorgungsbedarf
- Linkable von Städten, Hausverwaltungen, Recyclinghöfen

**Neue Dateien:**
```
src/lib/relo-os/swiss-integration/disposal/
├── types.ts                 # DisposalItem, DisposalCategory
├── city-calendars.ts        # ERZ API, andere Städte
├── item-classifier.ts       # Was gehört wohin?
└── index.ts

src/pages/tools/
└── DisposalPlanner.tsx      # /entsorgungsplaner
```

**Datenquellen:**
- Open ERZ API (Zürich) - kostenlos
- opendata.swiss Abfall-Datasets
- Stadt-spezifische .ics Kalender

**Features MVP:**
- PLZ-Eingabe → nächste Sammeltermine
- Artikel-Klassifizierung (Sperrgut, Elektro, Grüngut, etc.)
- Recyclinghof-Finder mit Karte
- Kalender-Export (.ics)
- Umzugs-spezifische Empfehlungen

---

### 3. Gemeinde-Wizard ⚠️ (50% NEU)

**Bestehendes Fundament:**
```typescript
// src/lib/relo-os/swiss-integration/eumzug-ch.ts
export const initiateEUmzug = async (request: EUmzugRequest): Promise<EUmzugResponse>
export const checkEUmzugSupport = async (postalCode: string): Promise<boolean>
export const getRegistrationDeadline = (moveDate: Date): Date
```

**Fehlt: Standalone Public Page**

```
src/pages/tools/
└── CommuneRegistrationWizard.tsx   # /ummeldung-wizard
```

**Features MVP:**
- PLZ-Eingabe (alt + neu)
- eUmzugCH-Support-Check
- Deep-Link zur richtigen Gemeinde
- Fallback-Anleitung für nicht-digitale Gemeinden
- Frist-Reminder (14 Tage nach Umzug)
- Dokumenten-Checkliste

---

### 4. Address Change Autopilot ⚠️ (50% NEU)

**Bestehendes Fundament:**
```typescript
// src/lib/relo-os/swiss-integration/swiss-post.ts
export const generateSwissPostLink = (request: AddressChangeRequest): SwissPostResponse
export const scheduleSwissPostReminder = (moveDate: Date)
export const getRecommendedOrderDate = (moveDate: Date): Date
```

**Fehlt: Standalone Public Page + Institution Checklist**

```
src/pages/tools/
└── AddressChangeWizard.tsx   # /adressaenderung
```

**Features MVP:**
- Swiss Post Deep-Link Generator
- Institution-Checklist:
  - Krankenkasse
  - Bank(en)
  - Versicherungen
  - Arbeitgeber
  - Abos (SBB, Swisscom, etc.)
  - Vereine
- Email-Template Generator
- Kosten-Schätzung (Swiss Post Nachsendung)
- T-7 Reminder

---

## Priorisierung Empfehlung

| Priorität | Produkt | Aufwand | Impact |
|-----------|---------|---------|--------|
| **P1** | Entsorgungs-Planer | Mittel | Hoch (100% neu, stark linkable) |
| **P2** | Address Change Wizard | Niedrig | Mittel (Logic existiert, nur Page) |
| **P3** | Commune Registration Wizard | Niedrig | Mittel (Logic existiert, nur Page) |

---

## Technische Implementierung

### Entsorgungs-Planer (P1)

**Neue Database-Tabellen:**
```sql
CREATE TABLE disposal_categories (
  id TEXT PRIMARY KEY,
  name_de TEXT NOT NULL,
  name_fr TEXT,
  name_it TEXT,
  icon TEXT,
  disposal_type TEXT -- 'collection' | 'drop_off' | 'special'
);

CREATE TABLE disposal_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_slug TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  category_id TEXT REFERENCES disposal_categories(id),
  next_collection DATE,
  frequency TEXT, -- 'weekly' | 'biweekly' | 'monthly'
  calendar_url TEXT
);

CREATE TABLE recycling_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  lat NUMERIC,
  lng NUMERIC,
  opening_hours JSONB,
  accepted_categories TEXT[],
  website_url TEXT
);
```

**Edge Function (optional):**
```typescript
// supabase/functions/erz-calendar-sync/
// Sync mit Open ERZ API für Zürich
```

---

### Address Change Wizard (P2)

**Neue Dateien:**
```
src/lib/relo-os/swiss-integration/address-change/
├── types.ts                  # Institution, ChangeRequest
├── institutions.ts           # Standard-Institutionen-Liste
├── email-templates.ts        # Generierte Texte
└── index.ts

src/pages/tools/
└── AddressChangeWizard.tsx   # /adressaenderung
```

**Keine neuen DB-Tabellen nötig** - Institutionen können als statische Liste starten.

---

### Commune Registration Wizard (P3)

**Neue Dateien:**
```
src/pages/tools/
└── CommuneRegistrationWizard.tsx   # /ummeldung-wizard
```

**Nutzt bestehende:**
- `eumzug-ch.ts` für eUmzugCH-Integration
- `canton-rules.ts` für kantonale Unterschiede
- `canton_regulations` DB-Tabelle (bereits vorhanden)

---

## Zusammenfassung

**Bereits fertig (5.5/8):**
1. Move Readiness Checker ✅
2. Halteverbot-Planner ✅
3. Swiss Handover Protocol ✅
4. Trust Score Badge ✅
5. MovePulse / Zügel-Report ✅
6. eUmzugCH + Swiss Post Logic (50%) ⚠️

**Noch zu bauen (2.5/8):**
1. Entsorgungs- & Sperrgut Planner (100% NEU) - **P1**
2. Address Change Wizard Page (50% NEU) - **P2**
3. Commune Registration Wizard Page (50% NEU) - **P3**

Die Plattform ist bereits **~70% des Weges** zur "Public Infrastructure" - nur noch 3 Tools fehlen, wobei 2 davon hauptsächlich UI-Pages sind (Backend-Logic existiert bereits).
