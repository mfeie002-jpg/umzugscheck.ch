# 5-Agent Testing Framework für Umzugscheck.ch

> **Ziel**: Jeder der 5 AI Agents testet einen spezifischen Bereich der Plattform systematisch und dokumentiert die Ergebnisse.

---

## 🎯 Agent-Aufgabenverteilung

| Agent | Spezialisierung | Funnels (Core 20) | Fokus |
|-------|-----------------|-------------------|-------|
| **Lovable** | Live Browser Testing | 1-4 (Homepage, Vergleich, Video, AI-Rechner) | Interaktive Flow-Tests mit Screenshots |
| **ChatGPT** | UX/Conversion Audit | 5-8 (Firmenverzeichnis, Rankings) | Deep-Dive UX-Analyse, Conversion-Optimierung |
| **Claude** | Code & Architecture Review | 9-12 (Service-Rechner) | Component-Qualität, Performance, Accessibility |
| **Gemini** | SEO & Content Analysis | 13-16 (Regional, Services) | Meta-Tags, Schema.org, Content-Qualität |
| **Grok** | Edge Cases & Stress Testing | 17-20 (Info, B2B, Extras) | Error Handling, Edge Cases, Mobile Extreme |

---

## 📋 ChatGPT Agent - UX/Conversion Audit Prompt

```markdown
Du bist ein Senior UX/Conversion-Analyst. Analysiere diese 4 Umzugscheck.ch Seiten:

**Deine Aufgaben:**
1. Öffne jede URL im Browser
2. Dokumentiere für jede Seite:

### Seite: [URL]
**Route**: [Route]
**Getestet am**: [Datum]

#### 1. First Impression (5-Sekunden-Test)
- [ ] Value Proposition sofort klar?
- [ ] CTA above the fold sichtbar?
- [ ] Trust-Elemente erkennbar?

#### 2. CTA-Analyse
- [ ] Primärer CTA-Text handlungsauffordernd?
- [ ] Sekundäre CTAs nicht ablenkend?
- [ ] Button-Farbe kontrastreich?

#### 3. Formular-UX (falls vorhanden)
- [ ] Minimale Feldanzahl?
- [ ] Inline-Validation?
- [ ] Error-Messages hilfreich?
- [ ] Progress-Indicator (bei Multi-Step)?

#### 4. Mobile Check
- [ ] Touch-Targets ≥44px?
- [ ] Kein horizontaler Scroll?
- [ ] Sticky CTA funktioniert?

#### 5. Trust-Elemente
- [ ] Bewertungen/Sterne sichtbar?
- [ ] "Kostenlos & unverbindlich" prominent?
- [ ] Firmenlogos/Zertifikate vorhanden?

#### 6. Conversion-Killer identifiziert
- [ ] Ablenkende Elemente?
- [ ] Zu viele Optionen (Hick's Law)?
- [ ] Unklare nächste Schritte?

### Ergebnis
- **Conversion Score**: [1-10]
- **Top 3 Quick Wins**: [Liste]
- **Critical Issues**: [Liste]

---

**URLs zum Testen:**
1. https://umzugscheckv2.lovable.app/umzugsfirmen
2. https://umzugscheckv2.lovable.app/beste-umzugsfirma
3. https://umzugscheckv2.lovable.app/guenstige-umzugsfirma
4. https://umzugscheckv2.lovable.app/firma/express-umzuege

**Test-Daten:**
- PLZ Von: 8001
- PLZ Nach: 3000
- Zimmer: 3.5
- Email: test@example.com
- Tel: +41 44 123 45 67
```

---

## 📋 Claude Agent - Code & Architecture Review Prompt

```markdown
Du bist ein Senior Frontend Architect. Analysiere die Umzugscheck.ch Rechner-Komponenten.

**Kontext:**
- Stack: React 18, Vite, Tailwind CSS, TypeScript, Supabase
- Ziel: Performance, Accessibility, Code-Qualität

**Deine Aufgaben:**
Für jede Route, analysiere:

### Route: /rechner/reinigung
1. **Component Structure**
   - Ist die Komponente <500 LOC?
   - Props korrekt typisiert?
   - Custom Hooks für Logik extrahiert?

2. **Performance**
   - Lazy Loading implementiert?
   - useMemo/useCallback wo nötig?
   - Re-Renders minimiert?

3. **Accessibility**
   - ARIA-Labels vorhanden?
   - Keyboard-Navigation funktioniert?
   - Focus-Management korrekt?

4. **Form Handling**
   - Validation Schema (Zod)?
   - Error Boundaries?
   - Loading States?

5. **Design System Compliance**
   - Semantic Tokens verwendet (nicht hardcoded colors)?
   - Responsive Breakpoints korrekt?
   - Dark Mode Support?

### Ergebnis Template
```json
{
  "route": "/rechner/reinigung",
  "component_score": 8,
  "performance_score": 7,
  "accessibility_score": 6,
  "issues": [
    {"severity": "high", "issue": "Missing ARIA labels on form inputs"},
    {"severity": "medium", "issue": "No error boundary"}
  ],
  "recommendations": [
    "Add aria-describedby for error messages",
    "Implement React.lazy for calculator component"
  ]
}
```

**Routes zum Analysieren:**
1. /rechner/reinigung
2. /rechner/entsorgung
3. /rechner/lager
4. /rechner/packservice
```

---

## 📋 Gemini Agent - SEO & Content Analysis Prompt

```markdown
Du bist ein SEO-Spezialist für den Schweizer Markt. Analysiere die Umzugscheck.ch Seiten.

**Deine Aufgaben:**
Für jede URL, prüfe:

### Seite: [URL]

#### 1. Technical SEO
- [ ] Title Tag <60 Zeichen, Keyword vorne?
- [ ] Meta Description <160 Zeichen, CTA enthalten?
- [ ] Canonical URL korrekt?
- [ ] H1 einzigartig und keyword-optimiert?
- [ ] Heading-Hierarchie (H1→H2→H3)?

#### 2. Schema.org Markup
- [ ] LocalBusiness Schema vorhanden?
- [ ] FAQPage Schema für FAQ-Sektionen?
- [ ] BreadcrumbList Schema?
- [ ] AggregateRating für Bewertungen?

#### 3. Content-Qualität
- [ ] Keyword-Dichte 1-2%?
- [ ] LSI-Keywords verwendet?
- [ ] Lokale Keywords (Schweiz, Kantone)?
- [ ] Interne Links zu relevanten Seiten?

#### 4. Core Web Vitals (geschätzt)
- [ ] LCP: Hero-Image optimiert?
- [ ] FID: Keine blocking JS?
- [ ] CLS: Keine Layout-Shifts?

#### 5. Mobile SEO
- [ ] Viewport Meta korrekt?
- [ ] Font-Size ≥16px?
- [ ] Touch-Targets ok?

### Ergebnis
- **SEO Score**: [1-100]
- **Missing Schema**: [Liste]
- **Content Gaps**: [Liste]
- **Quick Wins**: [Liste]

---

**URLs zum Analysieren:**
1. https://umzugscheckv2.lovable.app/umzugsfirmen/zuerich
2. https://umzugscheckv2.lovable.app/umzugsfirmen/bern
3. https://umzugscheckv2.lovable.app/privatumzug
4. https://umzugscheckv2.lovable.app/firmenumzug
```

---

## 📋 Grok Agent - Edge Cases & Stress Testing Prompt

```markdown
Du bist ein QA-Engineer spezialisiert auf Edge Cases. Teste Umzugscheck.ch auf Grenzfälle.

**Deine Aufgaben:**
Versuche die Seiten zu "brechen" mit:

### 1. Input Validation Tests
- Leere Formulare absenden
- Ungültige PLZ (99999, ABC, -1)
- SQL Injection Versuche (`'; DROP TABLE--`)
- XSS Versuche (`<script>alert(1)</script>`)
- Extrem lange Eingaben (1000+ Zeichen)
- Emoji in Textfeldern (🏠📦)
- Unicode-Sonderzeichen

### 2. Navigation Edge Cases
- Direkt-URL mit ungültigem Slug (/firma/nicht-existiert)
- Doppelte Slashes (//umzugsfirmen)
- URL-Encoding-Tests
- Browser Back/Forward Verhalten

### 3. State Management
- Formular halb ausfüllen, Seite neu laden
- Multi-Tab gleichzeitig
- Offline-Modus aktivieren
- Session Timeout simulieren

### 4. Mobile Extreme
- Viewport 320px Breite
- Landscape-Mode
- Zoom 200%
- Screen Reader aktiviert (VoiceOver/TalkBack)

### 5. Performance Stress
- Schnelles mehrfaches Klicken auf Submit
- Viele Filter gleichzeitig aktivieren
- Pagination Extreme (Seite 1000)

### Ergebnis Template
```json
{
  "test_category": "Input Validation",
  "test_case": "SQL Injection in PLZ field",
  "input": "'; DROP TABLE--",
  "expected": "Validation error shown",
  "actual": "[Was passiert ist]",
  "status": "PASS/FAIL",
  "severity": "critical/high/medium/low",
  "screenshot": "[Link falls relevant]"
}
```

**Seiten zum Testen:**
1. https://umzugscheckv2.lovable.app/umzugskosten
2. https://umzugscheckv2.lovable.app/umzugscheckliste
3. https://umzugscheckv2.lovable.app/faq
4. https://umzugscheckv2.lovable.app/fuer-firmen
```

---

## 🔄 Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                    TESTING WORKFLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐     │
│  │ Lovable │   │ ChatGPT │   │ Claude  │   │ Gemini  │     │
│  │ (Live)  │   │  (UX)   │   │ (Code)  │   │  (SEO)  │     │
│  └────┬────┘   └────┬────┘   └────┬────┘   └────┬────┘     │
│       │             │             │             │           │
│       ▼             ▼             ▼             ▼           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              RESULTS AGGREGATION                     │   │
│  │         (Markdown Reports in /docs/testing/)         │   │
│  └─────────────────────────────────────────────────────┘   │
│       │             │             │             │           │
│       ▼             ▼             ▼             ▼           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                  ISSUE TRACKING                      │   │
│  │        (GitHub Issues / Admin Dashboard)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                  │
│                          ▼                                  │
│  ┌─────────┐                                               │
│  │  Grok   │ ◄─── Final Edge Case Validation               │
│  │ (QA)    │                                               │
│  └─────────┘                                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Results Aggregation Template

Nach jedem Test-Zyklus, fülle diese Zusammenfassung aus:

```markdown
# Funnel Health Report - [DATUM]

## Executive Summary
- **Getestete Funnels**: X/20
- **Pass Rate**: X%
- **Critical Issues**: X
- **Agents eingesetzt**: Lovable, ChatGPT, Claude, Gemini, Grok

## Agent Results

| Agent | Funnels | Pass | Warn | Fail | Top Issue |
|-------|---------|------|------|------|-----------|
| Lovable | 1-4 | 4 | 0 | 0 | - |
| ChatGPT | 5-8 | 3 | 1 | 0 | CTA zu klein auf Mobile |
| Claude | 9-12 | 2 | 2 | 0 | Missing ARIA labels |
| Gemini | 13-16 | 3 | 1 | 0 | Schema.org fehlt |
| Grok | 17-20 | 4 | 0 | 0 | - |

## Critical Issues (Must Fix)
1. [Issue 1]
2. [Issue 2]

## Quick Wins (Easy Fixes)
1. [Win 1]
2. [Win 2]

## Next Actions
- [ ] Fix Critical Issues
- [ ] Schedule Retest
- [ ] Update Test Suite
```

---

## 🚀 Getting Started

1. **Copy den Prompt** für deinen zugewiesenen Agent
2. **Paste in ChatGPT/Claude/Gemini/Grok**
3. **Führe Tests durch**
4. **Dokumentiere Ergebnisse** im Template-Format
5. **Teile Results** mit dem Team

---

*Erstellt: 2025-01-28 | Version: 1.0*
