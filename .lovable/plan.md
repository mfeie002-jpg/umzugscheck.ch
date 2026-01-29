
# Plan: AI_BRIEFING.md erstellen

## Ziel
Erstellen einer vollständigen Dokumentationsdatei (`docs/AI_BRIEFING.md`) mit allem Wissen über das Umzugscheck.ch Projekt für das Onboarding einer neuen ChatGPT-Instanz.

---

## Datei-Inhalt (Struktur)

### 1. HEADER & VISION
- Projektname: umzugscheck.ch
- Vision: "Relo-OS" (Relocation Operating System) / "Invisible Move"
- Ziel: Digital Marketing Award 2026
- Claim: "Der Archetyp, an dem sich alle anderen orientieren"

### 2. TECH STACK
```text
Frontend:     React 18 + TypeScript + Vite
Styling:      Tailwind CSS + shadcn/ui
State:        TanStack Query + React Context
Routing:      React Router v6 (Lazy Loading)
Backend:      Supabase (Lovable Cloud)
Edge Functions: 80+ Serverless Functions
```

### 3. GESCHÄFTSMODELL

#### Cherries & Chaff Hybrid-Modell
- **Tier 1 (Score >60)**: Feierabend Umzug (Premium-Brand, exklusiv)
- **Tier 2 (Score 30-59)**: Marketplace Premium Auction (max 3 Partner)
- **Tier 3 (Score <30)**: Reject oder Budget CHF 15

#### Multi-Brand Strategie
| Brand | Segment | Ø Preis | Fokus |
|-------|---------|---------|-------|
| Feierabend Umzug | Premium | CHF 2'800 | Familien, Senioren |
| Umzug Express | Speed | CHF 1'600 | Profis |
| Zügelhelden | Value | CHF 1'100 | Studenten, Budget |

### 4. LEAD SCORING LOGIK
```text
Score 0-100 berechnet aus:
- Zimmer: >3.5 → +30 | 2-3 → +20 | <2 → -10
- Distanz: >50km → +20 | lokal → +10
- Services: Verpackung → +20 | Reinigung → +10
- Datum: Mid-month → +20 | Urgent → -50
- Budget: Qualität → +10 | Günstigste → -20
```

### 5. RELO-OS 6-PHASEN ARCHITEKTUR
```text
1. ROUTE     → Initialisierung
2. INVENTORY → AI Video Scan + LiDAR Digital Twin
3. QUOTE     → Instant Fixed-Price (Dynamic Pricing)
4. BOOKING   → Quality-Weighted Bidding + Smart Escrow
5. MOVING    → Live GPS Tracking + ETAs
6. COMPLETE  → Swiss Handover Protocol + After Move Care
```

### 6. REGIONEN-DATENBANK
- Alle 26 Kantone mit vollständigen Daten
- Preis-Koeffizienten (z.B. Zürich: 1.18, Zug: 1.0)
- SEO-Texte, lokale Tipps, FAQs pro Kanton
- Datei: `src/data/regions-database.ts`

### 7. ROUTING STRUKTUR
```text
Hauptfunnels:
  /umzugsofferten          → Lead-Funnel (Golden Flow)
  /preisrechner            → Instant Calculator
  /umzugsfirmen/{kanton}   → Regionale Rankings

Services:
  /services/reinigung      → Endreinigung
  /services/entsorgung     → Entsorgung/Räumung
  /services/lagerung       → Einlagerung
  /services/firmenumzug    → B2B Umzüge

Admin:
  /admin/ai-command-center → AI Prompt Center
  /admin/task-queue        → AI Autopilot Hub
  /admin/flow-analysis     → Conversion Analyse
```

### 8. EDGE FUNCTIONS (80+)
Kategorien:
- AI: `ai-assistant`, `ai-flow-generator`, `generate-ai-tasks`
- Lead: `create-funnel-lead`, `purchase-lead`, `provider-leads`
- Analysis: `analyze-landing-page`, `lighthouse`, `deep-flow-analysis`
- Notifications: `send-email`, `send-sms-notification`, `send-lead-notification`
- Provider: `provider-login`, `provider-signup`, `provider-subscription`

### 9. A/B TESTING SYSTEM
- 17 Navigation-Varianten (V1-V17)
- 48+ Flow-Varianten (konsolidiert zu "Golden Flow")
- Golden Flow = V10 Smart Router + V10 Navigation
- Datei: `src/contexts/NavigationABContext.tsx`

### 10. CHATGPT PROMPT LIBRARY (10 Premium Prompts)
1. Cross-Validation Matrix
2. Friction Point Deep-Dive
3. Conversion Psychology Audit
4. Mobile Excellence Check
5. Copy Teardown
6. Competitor Benchmark Template
7. A/B Test Hypothesis Generator
8. V10 Ultimate Blueprint
9. Accessibility Quick-Audit
10. Implementation Roadmap

### 11. AI AUTOPILOT SYSTEM
- Task Queue: `/admin/task-queue`
- Agents: CODEX (Code), COPILOT (Copy/UX)
- Auto-Generation bei leerem Queue
- Realtime Auto-Load nach Task-Completion

### 12. SWISS TRUST TRIUMVIRATE
Grading-Framework für Umzugsfirmen:
- Institutional Trust (35%): UID, Versicherung, Mitgliedschaften
- Social Trust (30%): Reviews, Team-Fotos, Cases
- Process Trust (35%): Transparenz, Garantien

### 13. SPRACHLICHE KONVENTIONEN
- Schweizer Hochdeutsch (kein "ß")
- "zügeln" statt "umziehen"
- "Offerte" statt "Angebot"
- "Sie-Form" für formelle Kommunikation

### 14. KEY FILES
```text
src/data/regions-database.ts      → 26 Kantone mit Preisen/SEO
src/lib/cherries-chaff/           → Lead Routing Engine
src/lib/chatgpt-prompt-enhancements.ts → Premium Prompts
src/contexts/NavigationABContext.tsx   → A/B Testing
ARCHITECTURE.md                   → Tech-Architektur
```

---

## Technische Umsetzung

**Neue Datei erstellen:**
```
docs/AI_BRIEFING.md
```

**Inhalt:** ~500 Zeilen vollständiges Markdown-Dokument mit:
- Alle oben genannten Sektionen
- Code-Beispiele für Lead-Scoring
- Mermaid-Diagramm für Relo-OS Phasen
- Tabellen für Brands, Kantone, Prompts
- Links zu relevanten Dateien

---

## Ergebnis
Eine einzige, vollständige Markdown-Datei, die:
1. Als ChatGPT "Project Knowledge" hochgeladen werden kann
2. Alle Business-Logik und technischen Details enthält
3. Die neue AI sofort produktiv macht
