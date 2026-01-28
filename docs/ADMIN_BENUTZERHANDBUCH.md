# 📖 Admin Panel - Benutzerhandbuch

**Version:** 1.0  
**Stand:** Januar 2026  
**Plattform:** Umzugscheck.ch

---

## 🎯 Command Centers

### Unified Command Center (`/internal/command-center`)
**Badge:** HQ | **Highlight:** Ja

Das zentrale Entscheidungscockpit für SCALE/HOLD/STOP-Aktionen.

**Funktionen:**
- Echtzeit-KPI-Übersicht (Revenue, CM2, CAC, Cash Runway)
- Kill-Switch-Status für kritische Metriken
- Lead-Performance-Tracking
- Schnellaktionen für operative Entscheidungen

**Wann nutzen:** Täglich morgens für Statuscheck, bei wichtigen Entscheidungen

---

### Flow Command Center (`/flow-command-center`)
**Typ:** Externe Seite

Zentrales Dashboard für alle Flow-Analysen und UX-Optimierungen.

**Funktionen:**
- Flow-Ranking nach Score
- Issue-Tracking und Lösungsstatus
- Vergleich zwischen Flow-Varianten
- AI-Feedback-Integration

**Wann nutzen:** Bei UX-Optimierungen, A/B-Test-Auswertungen

---

### Finance & P&L (`/internal/finance`)
**Badge:** CFO

Vollständiges Finanz-Dashboard mit Szenario-Simulation.

**Funktionen:**
- Tägliche P&L-Tabelle (30 Tage Historie)
- CM2-Berechnung und CAC-Tracking
- Cash-Runway-Projektion
- **Szenario-Simulator:** What-If-Analysen für CPC-Änderungen, Close-Rate-Variationen, Arbeitskosten-Anpassungen

**Wann nutzen:** Wöchentliche Finanzplanung, Budgetentscheidungen

---

### Paid Media Control (`/internal/paid-media-control`)

Kontrolle und Monitoring aller bezahlten Werbekampagnen.

**Funktionen:**
- CPL-Tracking (7-Tage-Durchschnitt)
- ROI-Berechnung pro Kampagne
- Automatische Kill-Switches:
  - CPL > CHF 90 → PAUSE ADS
  - CM2 < 20% für 5 Jobs → STOP
  - Claims > 5% Revenue → PAUSE
- Budget-Verteilung nach Kanal

**Wann nutzen:** Täglich zur Kampagnenüberwachung

---

### 90-Day Roadmap (`/internal/launch-roadmap`)

Strategische Roadmap für Launch und Wachstum.

**Funktionen:**
- Wochenweise Meilensteine
- Feature-Prioritäten
- Team-Zuweisungen
- Fortschrittstracking

**Wann nutzen:** Sprint-Planung, Stakeholder-Updates

---

## 🧠 AI & Automation

### AI Command Center (`/admin/ai-command`)
**Badge:** ⚡ | **Highlight:** Ja

Zentraler Hub für alle AI-gestützten Operationen.

**Funktionen:**
- AI-Analyse-Dashboard
- Prompt-Management
- Model-Auswahl (GPT-5, Gemini 2.5, etc.)
- Batch-Verarbeitung

**Wann nutzen:** AI-gestützte Analysen, Content-Generierung

---

### Task Queue (AI Autopilot) (`/admin/task-queue`)
**Badge:** AUTO

Automatisierte Task-Generierung und -Ausführung.

**Funktionen:**
- **Queue Überblick:** Alle pending/in-progress/done Tasks
- **Agent Runner:** Ausführung einzelner CODEX/COPILOT Tasks
- **Task-Generierung:** Automatisch aus Flow-Scores und UX-Issues
- **History Tab:** Abgeschlossene Tasks mit Dauer und Output
- **Copy für VS Code:** Export für Copilot Chat

**Workflow:**
1. "Tasks generieren" klicken
2. Tasks werden aus Analyse-Daten erstellt
3. "Next CODEX/COPILOT" auswählen
4. Prompt kopieren oder automatisch verarbeiten
5. "Mark as done" → Nächster Task lädt automatisch

**Wann nutzen:** Kontinuierliche Verbesserungen automatisieren

---

### 1-Click ChatGPT Export (`/admin/chatgpt`)
**Badge:** NEU

Schnellexport für ChatGPT Deep Research.

**Funktionen:**
- Kompletter Codebase-Export
- Strukturiertes Markdown für AI-Analyse
- KPI-Daten inkludiert

**Wann nutzen:** Tiefenanalyse mit externen AI-Tools

---

### ChatGPT LP Export (`/admin/chatgpt-export`)

Export von Landing Pages für ChatGPT-Analyse.

**Funktionen:**
- HTML-Snapshot der Landing Pages
- Screenshot-Bundle
- Strukturierte Metadaten

---

### Prompt Library (`/admin/ai-export`)

Sammlung wiederverwendbarer AI-Prompts.

**Funktionen:**
- Kategorisierte Prompt-Vorlagen
- CODEX vs. COPILOT Prompts
- Export-Funktionen

---

### Flow Generator (`/admin/ai-command?tab=generator`)

AI-gestützte Flow-Generierung.

**Funktionen:**
- Neue Flows aus Beschreibung generieren
- Varianten erstellen
- Best-Practice-Templates

---

## 📞 Lead & Distribution

### Lead Routing Brain (`/internal/lead-routing`)
**Badge:** AI

Intelligente Lead-Verteilung mit AI-Scoring.

**Funktionen:**
- Lead-Score-Berechnung (0-100)
- **Tier-System:**
  - Tier 1 (Score >60): → feierabendumzug exklusiv
  - Tier 2 (30-59): → Marketplace (max 3 Partner)
  - Tier 3 (<30): → Auto-Reject oder CHF 15 Budget
- Kapazitäts-Matching
- Echtzeit-Routing

**Wann nutzen:** Lead-Qualität optimieren, Routing-Regeln anpassen

---

### Lead Distribution (`/internal/distribution`)

Manuelle und automatische Lead-Verteilung.

**Funktionen:**
- Partner-Kapazitäten verwalten
- Verteilungsregeln definieren
- Notfall-Routing

---

### Partner Network (`/internal/partners`)
**Badge:** B2B

Partnerverwaltung und Onboarding.

**Funktionen:**
- Partner-Directory
- Onboarding-Workflow
- Kanton-Coverage-Map
- Dispute Center
- Mystery Shopping (10% der Leads)
- Weekly Checklist

**Regeln:**
- Zürich: max 5-7 Partner
- Zug/Aargau: 2-3 Partner
- Rest: 1 nationaler Partner

---

### Leads verwalten (`/admin/leads`)

CRUD für alle eingegangenen Leads.

**Funktionen:**
- Lead-Liste mit Filter
- Status-Tracking
- Kontakthistorie
- Export-Funktionen

---

### Bieter-Aufträge (`/admin/listings`)

Verwaltung von Auktions-Listings.

**Funktionen:**
- Aktive Gebote
- Zuschläge verwalten
- Preis-Historie

---

## 🧪 Testing & Experimente

### A/B Testing (`/admin/ab-testing`)
**Highlight:** Ja

Zentrales A/B-Test-Management.

**Tabs:**
1. **Unified A/B:** Globale Test-Übersicht
2. **Flow Details:** Flow-Varianten-Vergleich
3. **Nav Details:** Navigation-Varianten
4. **Sections:** Homepage-Sektionen testen
5. **Rankings:** Firmen-Ranking-Tests

**Wann nutzen:** Vor jeder größeren Änderung

---

### Varianten Testen (`/admin/varianten-testen`)

Lokales Testing von Varianten vor Live-Schaltung.

**Funktionen:**
- Preview aller Varianten
- Side-by-Side-Vergleich
- Performance-Simulation

---

### Flow Tester (`/flow-tester`)
**Typ:** Externe Seite

Interaktiver Flow-Durchlauf-Tester.

**Funktionen:**
- Schritt-für-Schritt-Navigation
- Screenshot-Capture pro Step
- Issue-Markierung

---

### V3 Varianten (`/v3-varianten`)
**Typ:** Externe Seite

Version 3 Flow-Varianten-Übersicht.

---

### Mock Data (`/admin/mock-data`)

Testdaten-Generator.

**Funktionen:**
- Leads generieren
- Firmen erstellen
- Bewertungen simulieren

---

### Button Demo (`/admin/buttons`)

UI-Komponenten-Bibliothek.

**Funktionen:**
- Alle Button-Varianten
- States (hover, active, disabled)
- Größen und Farben

---

## 📸 Screenshots & Capture

### Screenshot Machine (`/admin/screenshots`)

Automatisierte Screenshot-Erstellung.

**Funktionen:**
- Alle Flows erfassen
- Mobile + Desktop Viewports
- Batch-Processing

---

### Screenshot Review (`/admin/screenshot-review`)

Review und Annotation von Screenshots.

**Funktionen:**
- Galerie-Ansicht
- Annotations hinzufügen
- Vor/Nach-Vergleich

---

### Flow Analysis Framework (`/admin/analysis-framework`)

Methodik-Referenz für Flow-Analyse.

**Tabs:**
1. **Archetypen:** User-Personas und Bedürfnisse
2. **Swissness:** CH-Markt-Spezifika (ASTAG, Zügeltage)
3. **Pricing:** Preismodell-Referenz
4. **Compliance:** Gesetzliche Anforderungen

---

### Flow Feedback Variants (`/admin/flow-feedback-variants`)

AI-generierte Flow-Varianten aus Feedback.

**Funktionen:**
- Varianten-Generierung aus Issues
- A/B-Test-Integration
- Score-Tracking

---

### ZIP Export (`/admin/zip-export`)

Bulk-Export als ZIP-Archiv.

**Funktionen:**
- Screenshots exportieren
- HTML-Snapshots
- Metadaten inkludiert

---

## 📊 Analytics & Reports

### Übersicht (`/admin/analytics`)

Globales Analytics-Dashboard.

**Funktionen:**
- Traffic-Übersicht
- Conversion-Raten
- Trend-Analyse

---

### Funnel Analytics (`/admin/funnel`)

Detaillierte Funnel-Analyse.

**Funktionen:**
- Drop-off-Punkte identifizieren
- Step-by-Step-Conversion
- Vergleich zwischen Flows

---

### Conversion Events (`/admin/conversions`)

Event-Tracking und -Analyse.

**Events-Schema:**
- `flow_start`
- `step_view`
- `step_complete`
- `flow_submit`
- `flow_success`
- `flow_error`
- `flow_abandon`

---

### ML Analytics (`/admin/ml-analytics`)

Machine-Learning-basierte Insights.

**Funktionen:**
- Predictive Analytics
- Anomalie-Erkennung
- Trend-Vorhersagen

---

### Preisanalyse (`/admin/pricing-analytics`)

Preisanalyse und Marktvergleich.

**Funktionen:**
- Historische Preisentwicklung
- Kanton-Vergleich
- Saisonalität

---

### URL Tracking (`/admin/url-tracking`)

UTM-Parameter und Kampagnen-Tracking.

---

### Reports Generator (`/admin/reports`)

Automatische Report-Erstellung.

**Funktionen:**
- PDF-Export
- Geplante Reports
- Custom Templates

---

### World Class Dashboard (`/admin/world-class`)

Benchmark-Vergleich mit Top-Performern.

---

## 🎬 Video-Analyse

### Video-Analysen (`/admin/video-analyses`)
**Badge:** NEU | **Highlight:** Ja

AI-gestützte Video-Analyse für Inventar-Scans.

**Funktionen:**
- LiDAR-Datenverarbeitung
- Digital Twin Generation
- Inventar-Erkennung

---

## 🚚 Relo-OS Journey

### Relo-OS Phasen (`/admin/relo-os-phases`)
**Badge:** DEV | **Highlight:** Ja

Status-Dashboard aller 6 Relo-OS Phasen.

**Phasen:**
1. **Route:** Adressen-Initialisierung
2. **Inventar:** AI Video Scan + LiDAR
3. **Offerte:** Dynamic Pricing Engine
4. **Buchung:** Smart Escrow via Stripe
5. **Umzug:** Live GPS-Tracking
6. **Übergabe:** Swiss Handover Protocol

---

### Invisible Move Demo (`/invisible-move-demo`)
**Typ:** Externe Seite

Interaktive Demo des kompletten Relo-OS Flows.

---

### Capabilities (`/admin/capabilities`)

Feature-Flag-Management.

**Funktionen:**
- Features aktivieren/deaktivieren
- Rollout-Steuerung
- A/B-Test-Integration

---

## 🏢 Firmen & Partner

### Firmen (`/admin/companies`)

Firmenverwaltung.

**Funktionen:**
- Firmenprofile bearbeiten
- Logo/Bilder verwalten
- Bewertungen moderieren

---

### Partner (Providers) (`/admin/providers`)

Service-Provider-Verwaltung.

**Funktionen:**
- Onboarding-Status
- Verifikation
- Preismodelle

---

### Bewertungen (`/admin/reviews`)

Review-Moderation.

**Funktionen:**
- Freigabe-Workflow
- Spam-Erkennung
- Antwort-Management

---

### Rankings (`/admin/rankings`)

Firmen-Ranking-Verwaltung.

**Funktionen:**
- Ranking-Score-Formel
- Featured-Positionen
- Sponsoring-Slots

---

### Verfügbarkeit (`/admin/availability`)

Kapazitäts-Kalender.

**Funktionen:**
- Verfügbarkeiten pro Partner
- Blockierte Termine
- Saisonale Anpassungen

---

## 💰 Billing & Finance

### Abrechnung (`/admin/billing`)

Rechnungsstellung und Zahlungen.

**Funktionen:**
- Offene Rechnungen
- Zahlungseingänge
- Mahnwesen

---

### Abos (`/admin/subscriptions`)

Subscription-Management.

**Funktionen:**
- Aktive Abos
- Upgrade/Downgrade
- Kündigungen

---

### Dynamische Preise (`/admin/dynamic-pricing`)

Preisanpassungen in Echtzeit.

**Faktoren:**
- Saisonalität (Zügeltage!)
- Kapazitätsauslastung
- Nachfrage-Peaks

---

## 📧 E-Mail & Automations

### E-Mail Automation (`/admin/email-automation`)

Automatisierte E-Mail-Sequenzen.

**Funktionen:**
- Trigger-basierte Kampagnen
- Drip-Sequenzen
- A/B-Tests für Subject Lines

---

### E-Mail Templates (`/admin/email-templates`)

Template-Editor.

**Funktionen:**
- HTML-Editor
- Variablen-Platzhalter
- Preview-Funktion

---

## 🚀 Launch & Growth

### Go-Live Checklist (`/admin/go-live`)
**Badge:** ✓

Launch-Readiness-Prüfung.

**Checkliste:**
- Security Audit (18 Checks)
- Performance Audit (Core Web Vitals)
- RLS-Policies
- SSL/HTTPS

---

### Post-Launch (`/admin/post-launch`)
**Badge:** LIVE

Post-Launch-Monitoring.

**Funktionen:**
- Echtzeit-Alerts
- Performance-Tracking
- User-Feedback

---

### Phase 6 Features (`/admin/phase-6`)

Upcoming Features für nächste Phase.

---

## 🔧 Tools & Export

### Admin Tools (`/admin/tools`)

Allgemeine Admin-Werkzeuge.

**Funktionen:**
- Cache leeren
- Logs einsehen
- Debug-Modus

---

### Code Export (`/admin/code-export`)

Codebase-Export.

**Funktionen:**
- Vollständiger Export
- Selektiver Export
- Git-Integration

---

### Dokumentation (`/admin/documentation`)

Interne Dokumentation.

**Inhalte:**
- API-Referenz
- Komponenten-Docs
- Onboarding-Guides

---

## 🔴 Kill-Switches (Kritische Stopps)

Diese automatischen Stopps sind **nicht verhandelbar**:

| Bedingung | Aktion |
|-----------|--------|
| CPL > CHF 90 (7d avg) | PAUSE ADS |
| CM2 < 20% für 5 Jobs | STOP Operations |
| Claims > 5% Revenue | PAUSE ADS |
| Cash Runway < 1 Monat | Emergency Mode |

**Marketplace-Pause:**
- Fill Rate < 70%
- Disputes > 15%
- Resale < 1.5

---

## 📱 Mobile-First Hinweise

Das gesamte Admin-Panel ist mobile-optimiert:

- **Touch Targets:** Mindestens 44x44px
- **Bottom Sheets:** Für komplexe Aktionen
- **Sticky Headers:** Immer sichtbare Navigation
- **Swipe-Gesten:** Unterstützt wo sinnvoll

---

## 🔗 Quick Links

| Aktion | Route |
|--------|-------|
| Morgen-Check | `/internal/command-center` |
| Leads bearbeiten | `/admin/leads` |
| Neue Kampagne | `/internal/paid-media-control` |
| Flow optimieren | `/flow-command-center` |
| AI-Task starten | `/admin/task-queue` |

---

*Erstellt mit ❤️ für das Umzugscheck-Team*
