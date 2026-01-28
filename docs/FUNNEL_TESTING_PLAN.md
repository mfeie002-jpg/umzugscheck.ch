# Umzugscheck Core 20 Funnels - Agent Testing Plan

> **Ziel**: Jeder AI Agent (Claude, GPT, Gemini, Grok, Lovable) kann jeden Funnel systematisch durchtesten.

---

## 🎯 Übersicht: Die 20 Core Customer Journeys

| # | Funnel Name | Route | Customer Intent | Priorität |
|---|-------------|-------|-----------------|-----------|
| 1 | Homepage Smart Router | `/` | "Ich suche Umzugshilfe" | 🔴 Critical |
| 2 | Vergleich Wizard | `/vergleich` | "Ich will Offerten vergleichen" | 🔴 Critical |
| 3 | Video-Offerte | `/video` | "Video-basierte Schätzung" | 🔴 Critical |
| 4 | AI Photo Upload | `/rechner/ai` | "Fotos hochladen für Preis" | 🟡 High |
| 5 | Firmenverzeichnis | `/umzugsfirmen` | "Welche Firmen gibt es?" | 🔴 Critical |
| 6 | Beste Firmen Ranking | `/beste-umzugsfirma` | "Wer ist der Beste?" | 🔴 Critical |
| 7 | Günstige Firmen | `/guenstige-umzugsfirma` | "Wer ist günstig?" | 🟡 High |
| 8 | Firmenprofil | `/firma/:slug` | "Details zu dieser Firma" | 🟡 High |
| 9 | Reinigungsrechner | `/rechner/reinigung` | "Was kostet Endreinigung?" | 🟡 High |
| 10 | Entsorgungsrechner | `/rechner/entsorgung` | "Was kostet Entrümpelung?" | 🟡 High |
| 11 | Region Zürich | `/umzugsfirmen/zuerich` | "Firmen in Zürich" | 🔴 Critical |
| 12 | Region Bern | `/umzugsfirmen/bern` | "Firmen in Bern" | 🟡 High |
| 13 | Privatumzug Service | `/privatumzug` | "Normaler Umzug Service" | 🟡 High |
| 14 | Firmenumzug Service | `/firmenumzug` | "Büroumzug Service" | 🟡 High |
| 15 | Umzugskosten Guide | `/umzugskosten` | "Was kostet ein Umzug?" | 🟢 Medium |
| 16 | Checkliste | `/umzugscheckliste` | "Was muss ich tun?" | 🟢 Medium |
| 17 | FAQ | `/faq` | "Häufige Fragen" | 🟢 Medium |
| 18 | Für Firmen (B2B) | `/fuer-firmen` | "Ich bin Umzugsfirma" | 🟡 High |
| 19 | Lagerrechner | `/rechner/lager` | "Was kostet Einlagerung?" | 🟢 Medium |
| 20 | Packservice | `/rechner/packservice` | "Was kostet Packservice?" | 🟢 Medium |

---

## 📋 Test-Protokoll Template

### Für jeden Funnel ausfüllen:

```markdown
## Funnel #X: [Name]

**Route**: `/route`
**Getestet am**: YYYY-MM-DD
**Agent**: [Claude/GPT/Gemini/Grok/Lovable]
**Viewport**: [Desktop 1920x1080 / Mobile 390x844]

### 1. Page Load
- [ ] Seite lädt vollständig (<3s)
- [ ] Keine Console Errors
- [ ] Hero/CTA sichtbar above the fold

### 2. Primary CTA
- [ ] Haupt-CTA ist klar erkennbar
- [ ] CTA-Text ist handlungsauffordernd
- [ ] Klick führt zum erwarteten nächsten Schritt

### 3. Formular/Interaktion (falls vorhanden)
- [ ] Alle Felder sind ausfüllbar
- [ ] Validation funktioniert
- [ ] Error Messages sind verständlich
- [ ] Submit führt zum nächsten Schritt

### 4. Conversion Path
- [ ] Klarer Pfad zum Lead/Offerte
- [ ] Progress wird angezeigt (falls mehrstufig)
- [ ] Keine Dead Ends

### 5. Mobile Responsiveness
- [ ] Touch Targets ≥44px
- [ ] Kein horizontaler Scroll
- [ ] Sticky CTAs funktionieren

### 6. Trust Elements
- [ ] Social Proof sichtbar
- [ ] Bewertungen/Badges vorhanden
- [ ] "Kostenlos & unverbindlich" kommuniziert

### Ergebnis
- **Status**: ✅ Pass / ⚠️ Issues / ❌ Fail
- **Issues gefunden**: [Liste]
- **Screenshots**: [Links]
```

---

## 🤖 Agent-Spezifische Anweisungen

### Für Lovable Agent (Browser Tool)

```
1. open_browser mit viewport {width: 1920, height: 1080}
2. Für jeden Funnel:
   a. navigate_to_sandbox und dann zur Route
   b. observe("primary CTA and form elements")
   c. screenshot
   d. act("click primary CTA")
   e. Falls Formular: act("fill form with test data")
   f. observe("result or next step")
   g. screenshot
3. Dokumentiere Ergebnisse
```

### Für Claude/GPT/Gemini (via Browser Extension oder API)

```json
{
  "task": "funnel_test",
  "base_url": "https://umzugscheckv2.lovable.app",
  "funnels": [
    {"name": "Homepage", "route": "/", "expected_cta": "Offerten erhalten"},
    {"name": "Vergleich", "route": "/vergleich", "expected_cta": "Weiter"},
    {"name": "Video", "route": "/video", "expected_cta": "Video hochladen"},
    ...
  ],
  "test_data": {
    "from_postal": "8001",
    "to_postal": "3000",
    "rooms": "3",
    "email": "test@example.com",
    "phone": "+41 44 123 45 67",
    "name": "Test User"
  }
}
```

---

## 📊 Erwartete Ergebnisse pro Funnel

### 1. Homepage Smart Router (`/`)
- **Entry**: PLZ-Eingabe oder Method Selection (Form/Video/Chat/WhatsApp)
- **Exit**: Weiterleitung zu `/vergleich` oder spezifischem Flow
- **KPI**: CTA Click Rate >15%

### 2. Vergleich Wizard (`/vergleich`)
- **Entry**: PLZ + Zimmer + Datum
- **Exit**: Lead Submission → Thank You Page
- **KPI**: Completion Rate >25%

### 3. Video-Offerte (`/video`)
- **Entry**: Video Upload Interface
- **Exit**: AI-Analyse → Preisschätzung → Lead
- **KPI**: Upload Completion >40%

### 4. AI Photo Upload (`/rechner/ai`)
- **Entry**: Foto Upload (Drag & Drop)
- **Exit**: Inventar-Erkennung → Preisschätzung
- **KPI**: Photo Upload >30%

### 5. Firmenverzeichnis (`/umzugsfirmen`)
- **Entry**: Firmen-Liste mit Filter/Sort
- **Exit**: Firmenprofil oder direktes Offerten-Request
- **KPI**: Profile View Rate >35%

### 6. Beste Firmen (`/beste-umzugsfirma`)
- **Entry**: Ranking-Liste (Top-bewertet)
- **Exit**: Offerten von Top-Firmen anfordern
- **KPI**: Multi-Select Rate >20%

### 7. Günstige Firmen (`/guenstige-umzugsfirma`)
- **Entry**: Ranking-Liste (Preis-sortiert)
- **Exit**: Offerten von günstigen Firmen
- **KPI**: Similar to #6

### 8. Firmenprofil (`/firma/:slug`)
- **Entry**: Detail-Seite einer Firma
- **Exit**: Offerte von dieser Firma anfordern
- **KPI**: Contact Rate >15%

### 9-10. Service-Rechner (`/rechner/*`)
- **Entry**: Service-spezifisches Formular
- **Exit**: Preisschätzung → Offerten-Anfrage
- **KPI**: Calculator Completion >40%

### 11-12. Regionale Seiten (`/umzugsfirmen/:region`)
- **Entry**: Lokale Firmen-Liste
- **Exit**: Regionale Offerten anfordern
- **KPI**: Local Engagement >25%

### 13-14. Service Pages (`/privatumzug`, `/firmenumzug`)
- **Entry**: Service-Landingpage
- **Exit**: Zum Hauptrechner weiterleiten
- **KPI**: CTA Click Rate >20%

### 15-17. Info Pages (`/umzugskosten`, `/umzugscheckliste`, `/faq`)
- **Entry**: Informationssuche
- **Exit**: CTA zu Offerten oder Rechner
- **KPI**: Cross-Link Click Rate >10%

### 18. B2B Portal (`/fuer-firmen`)
- **Entry**: Provider/Partner werden
- **Exit**: Registrierung oder Kontakt
- **KPI**: Sign-up Rate >5%

### 19-20. Zusatz-Rechner (`/rechner/lager`, `/rechner/packservice`)
- **Entry**: Zusatzservice-Bedarf
- **Exit**: Bundle mit Hauptumzug
- **KPI**: Add-on Rate >15%

---

## 🔄 Automatisierte Test-Ausführung

### Option A: Lovable Browser Agent

```
Prompt für Lovable:
"Teste Funnel #1 (Homepage):
1. Öffne Browser auf Desktop-Viewport
2. Navigiere zu /
3. Mache Screenshot
4. Finde den Primary CTA
5. Klicke darauf
6. Dokumentiere was passiert
7. Mache finalen Screenshot"
```

### Option B: External Agent (Claude/GPT mit MCP)

```bash
# MCP Server starten
npx mcp-server-puppeteer

# Test ausführen
claude "Test die Homepage von https://umzugscheckv2.lovable.app"
```

### Option C: E2E Test Suite (Vitest + Playwright)

Siehe `src/lib/e2e-helpers.ts` für vorbereitete Test-Selektoren.

---

## 📈 Reporting Template

### Wöchentlicher Funnel Health Report

| Funnel | Status | Issues | Last Test | Agent |
|--------|--------|--------|-----------|-------|
| Homepage | ✅ | 0 | 2026-01-28 | Lovable |
| Vergleich | ⚠️ | 2 | 2026-01-28 | Claude |
| Video | ✅ | 0 | 2026-01-27 | GPT |
| ... | ... | ... | ... | ... |

### Issue Tracking

| ID | Funnel | Issue | Severity | Status |
|----|--------|-------|----------|--------|
| F001 | Vergleich | Mobile CTA zu klein | High | Open |
| F002 | Video | Upload Error auf Safari | Medium | In Progress |

---

## 🎯 Next Steps

1. **Jetzt**: Lovable testet Core 5 Funnels live
2. **Danach**: Ergebnisse in diesem Dokument dokumentieren
3. **Wöchentlich**: Alle 20 Funnels durchtesten
4. **Automatisierung**: E2E Suite für CI/CD aufbauen

---

*Erstellt: 2026-01-28 | Version: 1.0*
