# ChatGPT Analyse-Übersicht: Alles was wir bereitstellen

## 🎯 Übersicht: 4 Analyse-Systeme

| System | Automatisierung | Fokus | Output |
|--------|-----------------|-------|--------|
| **1. Manueller Flow Export** | Manuell | 9 Calculator Flows | ZIP für ChatGPT Upload |
| **2. AutoFlow AI Dashboard** | Voll-Automatisch | 9 Flows mit AI-Scoring | Scores, Issues, Alerts |
| **3. 1-Klick KI-Analyse** | Halb-Automatisch | Beliebige Seiten | AI-Findings + Export |
| **4. KI-Prompt Generator** | Manuell | 7 Prompt-Varianten | Copy & Paste Prompts |

---

## 1️⃣ Manueller Flow Export (CalculatorFlowReview)

### Was wird bereitgestellt:
- **9 Funnel-Varianten** (V1-V9 Umzugsofferten)
- **Pro Step:**
  - Desktop Screenshot (1920x1080)
  - Mobile Screenshot (390x844)
  - Rendered HTML (vollständig)
  - Meta-JSON (URL, Timestamps, Dimensionen)
  - Step-spezifischer Analyse-Prompt

### ZIP-Struktur:
```
chatgpt-package-v1-2025-01-15/
├── README.md
├── chatgpt-prompt.md
├── index.json
├── ai-context.json (optional)
├── step-1-adressen/
│   ├── desktop.png
│   ├── mobile.png
│   ├── rendered.html
│   ├── meta.json
│   └── step-prompt.md
├── step-2-details/
│   └── ...
└── step-3-kontakt/
    └── ...
```

### ChatGPT-Prompt enthält:
- Live-URLs aller Steps
- Step-Namen & Beschreibungen
- Flow-Varianten-Info
- Viewport-Dimensionen
- Capture-Timestamps
- AI-Context (falls generiert)

### Zusätzlich:
- **Meta-Analyse Prompt** für übergreifende Erkenntnisse nach Einzel-Analysen
- **V10 Vorschläge** basierend auf AI-Feedback
- **Flow-Überblick Export** mit allen 9 Flows zusammengefasst

---

## 2️⃣ AutoFlow AI Dashboard (NEU)

### Automatische Analyse:
- **Täglich/Manuell** alle 9 Flows analysieren
- **AI-Vision-Analyse** mit Gemini 2.5 Flash
- **Pro Flow:** Overall Score, Mobile Score, Conversion Score, UX Score

### Was die AI analysiert:
1. **Mobile-Friendliness**
   - Touch-Targets (min 44px)
   - Lesbarkeit
   - Scrollverhalten
   
2. **Conversion-Optimierung**
   - CTA-Klarheit
   - Formularfelder
   - Friction Points
   - Progress-Indikator

3. **UX-Qualität**
   - Visuelle Hierarchie
   - Konsistenz
   - Feedback
   - Ladezeiten

### Output:
- **Scores** (0-100) pro Dimension
- **Issues** mit Severity (kritisch/warnung/info)
- **Recommendations** priorisiert
- **Executive Summary** pro Flow
- **Alerts** bei kritischen Problemen

### Datenbank-Tabellen:
- `flow_analysis_runs` - Analyse-Läufe
- `flow_step_metrics` - Metriken pro Step
- `flow_ux_issues` - Erkannte Probleme
- `flow_alert_settings` - Alert-Konfiguration
- `flow_alerts` - Ausgelöste Alerts
- `flow_scheduled_jobs` - Geplante Analysen

---

## 3️⃣ 1-Klick KI-Analyse

### Features:
- **URL Discovery** via Firecrawl (Top 1/5/10/20 Seiten)
- **Automatische Screenshots** Desktop + Mobile
- **HTML Capture** (Raw + Rendered)
- **AI-Analyse** mit Gemini

### Output:
- Executive Summary
- Priorisierte Issue-Liste
- ROI-Schätzung
- Konkrete Handlungsempfehlungen
- ZIP mit allen Assets

---

## 4️⃣ KI-Prompt Generator

### 7 Prompt-Varianten:

| Variante | Fokus | Für wen |
|----------|-------|---------|
| **Quick** | 3-5 Verbesserungen | Schneller Überblick |
| **Deep** | Umfassende UX-Analyse | Detaillierte Optimierung |
| **Code** | Technische Implementierung | Entwickler |
| **Screenshot Diff** | Visuelle Unterschiede | Design-Vergleich |
| **Regression Report** | Regressionstesting | QA-Teams |
| **SEO Audit** | Suchmaschinenoptimierung | SEO-Spezialisten |
| **Accessibility** | Barrierefreiheit | A11y-Compliance |

### Jeder Prompt enthält:
- Projekt-Konfiguration
- Zielgruppe & Ziele
- Wettbewerber-Infos
- Spezifische Analyse-Aufgaben
- Erwartetes Output-Format

---

## 📊 Vergleich der Systeme

| Feature | Manuell | AutoFlow AI | 1-Klick | Prompt Gen |
|---------|---------|-------------|---------|------------|
| Screenshots | ✅ | ✅ | ✅ | ❌ |
| HTML | ✅ | ❌ | ✅ | ❌ |
| AI-Scoring | ❌ | ✅ | ✅ | ❌ |
| Issue Detection | ❌ | ✅ | ✅ | ❌ |
| Alerts | ❌ | ✅ | ❌ | ❌ |
| Automatisierung | ❌ | ✅ | Halb | ❌ |
| ZIP Export | ✅ | ❌ | ✅ | ❌ |
| ChatGPT Prompts | ✅ | ❌ | ❌ | ✅ |
| Flow-spezifisch | ✅ | ✅ | ❌ | ❌ |

---

## 🚀 Empfohlener Workflow

### Für kontinuierliche Optimierung:
1. **AutoFlow AI** aktivieren → Tägliche automatische Analyse
2. Bei **Alerts** → Manuelle Deep-Analyse mit ChatGPT
3. **ZIP exportieren** → In ChatGPT/Claude hochladen
4. Änderungen implementieren
5. **Regression Testing** → Baseline vergleichen

### Für einmalige Analyse:
1. **1-Klick KI-Analyse** starten
2. Findings reviewen
3. **ZIP + Deep Prompt** in ChatGPT für Details
4. Priorisierte Issues abarbeiten

### Für Konkurrenz-Vergleich:
1. Konkurrenz-URLs in **URL Discovery** eingeben
2. Screenshots aller Flows erfassen
3. **Comparison Prompt** in ChatGPT
4. Best Practices extrahieren

---

## 📍 Wo findest du was?

| Tool | Location |
|------|----------|
| Flow Export | `/admin/tools` → Calculator Review → Manuell |
| AutoFlow AI | `/admin/tools` → Calculator Review → AutoFlow AI |
| 1-Klick Analyse | `/admin/tools` → AI Feedback Package |
| Prompt Generator | `/admin/ai-export` |
| Screenshot Machine | `/admin/tools` → Screenshots |
| SEO Analyzer | `/admin/tools` → SEO HTML |
| Regression Testing | `/admin/tools` → Regression |
| Scheduled Monitoring | `/admin/tools` → Monitoring |

---

*Letzte Aktualisierung: 2025-01-15*
*Das Vorzeigemodell für AI-gestützte Website-Analyse*
