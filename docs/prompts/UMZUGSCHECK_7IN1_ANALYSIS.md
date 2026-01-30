# UMFASSENDE WEBSITE-ANALYSE (7-in-1) — Umzugscheck.ch

> **Verwendung:** Kopiere diesen Prompt in ChatGPT, Claude oder Gemini zusammen mit Screenshots, Code-Exports oder der Live-URL für eine vollständige Analyse.

---

## Projekt-Information

| Feld | Wert |
|------|------|
| **Name** | Umzugscheck.ch |
| **URL** | https://umzugscheck.ch |
| **Branche** | Swiss Moving Comparison / Lead Generation |
| **Zielgruppe** | Schweizer Privatpersonen & Firmen, die einen Umzug planen |
| **Markt** | Schweiz (DE-CH primär, FR-CH sekundär) |
| **Tech Stack** | React 18, Vite, TypeScript, Tailwind CSS, Supabase Edge Functions |
| **Business Model** | CPL (Cost per Lead), CPC (Clicks), Sponsored Listings, Subscriptions |

## Aktuelle Metriken (Benchmark-Ziele)

| Metrik | Aktuell | Benchmark | Status |
|--------|---------|-----------|--------|
| Conversion Rate | — | 15-20% | 🎯 |
| Bounce Rate | — | < 35% | 🎯 |
| Mobile Score | — | 85+ | 🎯 |
| Ø Session Duration | — | > 3:00 | 🎯 |
| LCP | — | < 2.5s | 🎯 |
| CLS | — | < 0.1 | 🎯 |

## Wettbewerber zum Vergleich

- **MOVU.ch** — Marktführer, starkes Branding
- **Sirelo.ch** — Internationaler Player
- **Umzug.ch** — Schweizer Klassiker
- **Comparis.ch** (Umzugsbereich) — Trust-Authority

---

# TEIL 1: QUICK ANALYSIS

## Deine Aufgabe

Führe eine schnelle UX-Analyse von umzugscheck.ch durch und identifiziere:

### 1. TOP 3 Conversion-Killer
Was hindert Nutzer am Abschluss des Lead-Formulars oder Preisrechners?

### 2. Quick Wins
Welche Änderungen können diese Woche umgesetzt werden?

### 3. Mobile UX
Gibt es offensichtliche Mobile-Probleme? (70%+ Traffic ist Mobile!)

### 4. Swiss Trust Signals
Sind Schweizer Vertrauenselemente (ASTAG, Versicherung, UID) sichtbar?

## Ausgabeformat

| Problem | Seite | Auswirkung | Lösung (1 Satz) | Aufwand |
|---------|-------|------------|-----------------|---------|
| ... | Homepage | Hoch | ... | 2h |

---

# TEIL 2: DEEP AUDIT

## Analyse-Bereiche

### 1. Conversion Funnel (40% Fokus)

**Haupt-Funnel:** Homepage → Preisrechner → Ergebnis → Firmenauswahl → Lead-Formular → Danke-Seite

Analysiere:
- Wo steigen die meisten Nutzer aus?
- Ist der PLZ-First Ansatz optimal umgesetzt?
- Funktioniert der Preisrechner intuitiv?
- Sind CTAs ("Offerten erhalten", "Jetzt vergleichen") überzeugend?
- Gibt es Friction Points im Multi-Step-Formular?

### 2. SEO & Content (25% Fokus)

- Meta-Tags Qualität für Hauptseiten
- H1/H2 Struktur auf Regionalseiten (Zürich, Bern, Basel...)
- Interne Verlinkung zwischen Services & Regionen
- Content-Tiefe vs. MOVU/Sirelo
- Lokale Keywords ("Umzugsfirma Zürich", "günstig umziehen Bern")

### 3. Technical Performance (20% Fokus)

- Core Web Vitals (LCP, CLS, INP)
- Mobile Responsiveness (Touch Targets 44x44px min)
- JavaScript Bundle Size
- Image Optimization (WebP, Lazy Loading)
- Edge Function Response Times

### 4. Swiss Trust Triumvirate (15% Fokus)

**Institutional Trust:**
- ASTAG Badge sichtbar?
- Versicherungsnachweis?
- UID/Handelsregister?
- Schweizer Impressum?

**Social Trust:**
- Google Reviews Integration?
- Testimonials mit echten Fotos?
- Anzahl verifizierte Partner?

**Process Trust:**
- Datenschutz kommuniziert?
- "So funktioniert's" erklärt?
- Antwortzeit-Garantie?

## Erwartetes Output

### A) Executive Summary
2-3 Sätze: Gesamteindruck und kritischster Conversion-Blocker

### B) Priorisierte Findings (ICE Score)

| Finding | Impact | Confidence | Effort | ICE | Lösung |
|---------|--------|------------|--------|-----|--------|
| ... | 1-10 | 1-10 | 1-10 | Σ | ... |

### C) MOVU-Vergleich

| Feature | Umzugscheck | MOVU | Winner |
|---------|-------------|------|--------|
| Mobile UX | ? | ? | ? |
| Trust Signals | ? | ? | ? |
| Rechner UX | ? | ? | ? |
| Content Depth | ? | ? | ? |

### D) 90-Tage Roadmap

**Woche 1-2: Quick Wins**
- [ ] ...

**Woche 3-6: Medium Effort**
- [ ] ...

**Woche 7-12: Strategic**
- [ ] ...

---

# TEIL 3: CODE REVIEW

## Projekt-Spezifika

- **Stack:** React 18, Vite, TypeScript, Tailwind CSS, Supabase
- **Komponenten:** 200+ React Components, 80+ Edge Functions
- **State:** TanStack Query, React Hook Form, Zustand
- **UI Library:** shadcn/ui, Radix Primitives

## Review-Fokus

### 1. Performance (30%)

- Bundle Size & Code Splitting (48+ Calculator Variants!)
- React Rendering (useMemo, useCallback für Preisberechnungen)
- Lazy Loading der Regionalseiten
- Image Optimization (Firmenlogos, Hero Images)

### 2. Component Architecture (25%)

- Sind die 17 Navigation Variants konsolidiert?
- Gibt es Duplicate Code zwischen Calculator Variants?
- Custom Hooks Qualität (useEstimate, useCompanyMatching)
- API Layer (Supabase Client Pattern)

### 3. TypeScript Quality (20%)

- Type Safety für Lead-Daten
- Supabase Types korrekt generiert?
- Generics für Form Handling
- any/unknown Vermeidung

### 4. Best Practices (15%)

- Error Boundaries für Calculator Crashes
- Loading States (Skeleton UX)
- Form Validation (Zod Schemas)
- Accessibility (ARIA, Focus Management)

### 5. Security (10%)

- RLS Policies für leads, companies, billing
- Input Sanitization (PLZ, Email)
- Rate Limiting auf Edge Functions
- PII Data Handling

## Erwartetes Output

### A) Critical Issues
Sofort beheben (Bugs, Security, Performance-Blocker)

### B) Refactoring-Kandidaten
- Component Consolidation Opportunities
- Hook Deduplication
- Dead Code Elimination

### C) Performance Opportunities
Mit geschätztem Impact auf LCP/Bundle Size

### D) Code-Snippets
Für TOP 3 Issues: Vorher/Nachher

---

# TEIL 4: SCREENSHOT ANALYSE

## Zu analysierende Screens

1. **Homepage** (Desktop + Mobile)
2. **Preisrechner Step 1** (PLZ Eingabe)
3. **Preisrechner Ergebnis** (Preisanzeige + Firmenauswahl)
4. **Lead-Formular** (Kontaktdaten)
5. **Firmenverzeichnis** (/umzugsfirmen)
6. **Regionalseite** (z.B. /umzugsfirma-zuerich)

## Bewertungskriterien

### 1. Visual Hierarchy (25%)
- Ist "Offerten erhalten" der klarste CTA?
- Funktioniert der F-Pattern für den Preisrechner?
- Ist die Preisanzeige prominent genug?

### 2. Above the Fold (25%)
- Was sieht der Mobile-Nutzer ohne Scrollen?
- Ist der Hauptnutzen ("3 Offerten in 24h") sofort klar?
- Trust Badges sichtbar?

### 3. Swiss Design Consistency (20%)
- Passt das Design zur Schweizer Erwartung (seriös, clean)?
- Keine "zu amerikanischen" Elemente?
- Farben/Fonts konsistent?

### 4. Mobile Touch UX (15%)
- Touch Targets ≥ 44x44px?
- Bottom Sheet für Mobile Forms?
- Sticky CTA Button?

### 5. Conversion Elements (15%)
- Social Proof sichtbar (Bewertungen, Partner-Anzahl)?
- Urgency/Scarcity angemessen (nicht spammy)?
- Exit Intent Handling?

## Ausgabeformat

### ✅ Positives
- ...

### ⚠️ Verbesserungen
- ...

### ❌ Kritische Issues
- ...

### 🚀 Quick Wins (heute umsetzbar)
1. ...
2. ...
3. ...

---

# TEIL 5: SEO DEEP DIVE

## Hauptseiten zur Analyse

| Seite | URL | Ziel-Keyword |
|-------|-----|--------------|
| Homepage | / | umzugsfirma vergleichen schweiz |
| Preisrechner | /preisrechner | umzugskosten rechner |
| Firmenverzeichnis | /umzugsfirmen | umzugsfirmen schweiz |
| Zürich | /umzugsfirma-zuerich | umzugsfirma zürich |
| Bern | /umzugsfirma-bern | umzugsfirma bern |
| Ratgeber | /ratgeber | umzug tipps schweiz |

## SEO Analyse-Bereiche

### 1. On-Page SEO (30%)

- Title Tags: Einzigartig pro Stadt? Max 60 Zeichen?
- Meta Descriptions: CTA enthalten? Max 160 Zeichen?
- H1-H6: Eine H1 pro Seite? Logische Struktur?
- Keyword-Platzierung: In ersten 100 Wörtern?
- Alt-Tags: Für alle Firmenlogos?
- Interne Links: Hub-Spoke-Modell (Service → Region)?

### 2. Technical SEO (25%)

- Core Web Vitals: LCP < 2.5s, CLS < 0.1?
- Mobile-First: Responsive ohne Layout Shifts?
- Sitemap: Alle 26 Kantone enthalten?
- Robots.txt: Admin-Seiten blockiert?
- Canonical Tags: Keine Duplicate Content Issues?
- Schema.org: LocalBusiness, FAQPage, ItemList?

### 3. Content Quality (20%)

- E-E-A-T: Expertise durch Ratgeber-Artikel?
- Content Depth: Min. 500 Wörter pro Stadtseite?
- Aktualität: Preise/Statistiken aktuell?
- User Intent: Transactional vs. Informational Match?

### 4. Local SEO (15%)

- NAP Konsistenz (Name, Address, Phone)
- Regionale Keywords optimiert?
- Google Business Profile verlinkt?
- Quartier-spezifische Inhalte (Zürich Oerlikon, etc.)?

### 5. Competitor Gap Analysis (10%)

- Keywords wo MOVU rankt, wir nicht?
- Backlink-Profil vs. Wettbewerb?
- Content-Lücken?

## Erwartetes Output

### A) SEO Scorecard

| Kategorie | Score | Status | Top Issue |
|-----------|-------|--------|-----------|
| On-Page | /100 | 🟢/🟡/🔴 | ... |
| Technical | /100 | 🟢/🟡/🔴 | ... |
| Content | /100 | 🟢/🟡/🔴 | ... |
| Local | /100 | 🟢/🟡/🔴 | ... |

### B) Keyword Opportunities

| Keyword | Volume | Difficulty | Current Rank | Action |
|---------|--------|------------|--------------|--------|
| ... | ... | ... | ... | ... |

### C) 6-Monats SEO Roadmap

- **Monat 1-2:** Technical Fixes + Meta Optimization
- **Monat 3-4:** Content Expansion (Ratgeber, Stadtseiten)
- **Monat 5-6:** Link Building + Local SEO

---

# TEIL 6: ACCESSIBILITY AUDIT

## Ziel-Standard
**WCAG 2.1 Level AA** — Minimum für Schweizer Markt

## Kritische User Journeys

1. **Preisrechner ausfüllen** (Tastatur-Navigation)
2. **Firma auswählen** (Screen Reader)
3. **Kontaktformular absenden** (Error Handling)

## Prüfbereiche

### 1. Perceivable (25%)

- [ ] Alt-Texte für alle Firmenlogos
- [ ] Kontrast ≥ 4.5:1 (besonders Trust Badges)
- [ ] Text zoombar bis 200% ohne Layout-Break
- [ ] Keine Info nur durch Farbe (z.B. Preis-Ampel)

### 2. Operable (25%)

- [ ] Vollständige Tastatur-Navigation durch Rechner
- [ ] Skip-Link zu Hauptinhalt
- [ ] Fokus-Indikatoren auf allen interaktiven Elementen
- [ ] Keine Zeitlimits ohne Warnung

### 3. Understandable (25%)

- [ ] `lang="de-CH"` im HTML
- [ ] Konsistente Navigation auf allen Seiten
- [ ] Hilfreiche Fehlermeldungen bei Formularen
- [ ] Labels für alle Eingabefelder

### 4. Robust (25%)

- [ ] Valides HTML (keine Duplicate IDs)
- [ ] ARIA korrekt (nicht übermäßig)
- [ ] Screen Reader getestet (VoiceOver, NVDA)

## Erwartetes Output

### A) Accessibility Score

| WCAG Level | Status | Issues |
|------------|--------|--------|
| Level A | ✅/❌ | n |
| Level AA | ✅/❌ | n |

### B) Critical Fixes (Level A Violations)

| Issue | Element | WCAG Criterion | Fix |
|-------|---------|----------------|-----|
| ... | ... | ... | ... |

### C) Code-Snippets

Für TOP 3 Issues: Vorher/Nachher mit ARIA

---

# TEIL 7: ZUSAMMENFASSUNG

## Prioritäten-Matrix

| Kategorie | Top Issue | Impact | Effort | Sprint |
|-----------|-----------|--------|--------|--------|
| UX/Conversion | ... | Hoch | ... | W1 |
| Performance | ... | ... | ... | W2 |
| SEO | ... | ... | ... | W3 |
| Accessibility | ... | ... | ... | W4 |
| Code Quality | ... | ... | ... | W5 |

## Aktionsplan

### Diese Woche (Quick Wins)
1. ...
2. ...
3. ...

### Dieser Monat (Medium Effort)
1. ...
2. ...

### Nächstes Quartal (Strategic)
1. ...

## ROI-Schätzung

| Metrik | Aktuell | Nach Optimierung | Δ |
|--------|---------|------------------|---|
| Conversion Rate | X% | Y% | +Z% |
| Leads/Monat | A | B | +C |
| Revenue/Lead | CHF X | CHF X | — |
| **Potenzielle Mehreinnahmen** | — | — | **CHF Y'YYY/Monat** |

## Nächste Schritte

1. [ ] Diesen Report mit Team besprechen
2. [ ] Quick Wins in Sprint planen
3. [ ] A/B Tests für Top-Hypothesen aufsetzen
4. [ ] Monatliches Tracking einrichten

---

*Generiert für Umzugscheck.ch — Swiss Moving Comparison Platform*
*Template Version: 2.0 | Letzte Aktualisierung: Januar 2026*
