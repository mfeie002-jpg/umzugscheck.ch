// ChatGPT Prompt Templates for Website Analysis
// Updated with screenshot analysis, regression testing, and comprehensive audit capabilities

export interface PromptData {
  projectName?: string;
  projectUrl?: string;
  conversionRate?: number;
  bounceRate?: number;
  mobileScore?: number;
  avgSessionDuration?: string;
  topPages?: string[];
  competitors?: string[];
  screenshotData?: {
    dimension: string;
    isFullPage: boolean;
    capturedAt: string;
    url: string;
  };
  regressionData?: {
    baselineName: string;
    diffPercent: number;
    threshold: number;
    status: string;
  };
}

export type PromptVariant = "quick" | "deep" | "code" | "screenshot" | "regression" | "seo" | "accessibility";

export const PROMPT_VARIANTS = {
  quick: {
    name: "Quick Analysis",
    description: "Schnelle UX/Conversion-Analyse (~2 Min)",
    icon: "Zap",
  },
  deep: {
    name: "Deep Audit",
    description: "Vollständige Funnel + SEO + Performance Analyse",
    icon: "Search",
  },
  code: {
    name: "Code Review",
    description: "Technische Code-Qualität Analyse",
    icon: "Code",
  },
  screenshot: {
    name: "Screenshot Analyse",
    description: "Visuelles Design & UX Review basierend auf Screenshot",
    icon: "Camera",
  },
  regression: {
    name: "Regression Report",
    description: "Analyse von visuellen Änderungen zwischen Versionen",
    icon: "GitCompare",
  },
  seo: {
    name: "SEO Deep Dive",
    description: "Detaillierte Suchmaschinen-Optimierung Analyse",
    icon: "Search",
  },
  accessibility: {
    name: "Accessibility Audit",
    description: "Barrierefreiheit und WCAG-Konformität",
    icon: "Eye",
  },
} as const;

export function generateQuickAnalysisPrompt(data: PromptData): string {
  return `# Website Quick Analysis

## Projekt
- **Name:** ${data.projectName || "Umzugscheck.ch"}
- **URL:** ${data.projectUrl || "https://umzugscheck.ch"}
- **Branche:** Swiss Moving Comparison Platform

## Aktuelle Metriken
- Conversion Rate: ${data.conversionRate || 14}%
- Bounce Rate: ${data.bounceRate || 38.5}%
- Mobile Score: ${data.mobileScore || 67}

## Deine Aufgabe
Führe eine schnelle UX-Analyse durch und identifiziere:

1. **TOP 3 Conversion-Killer** - Was hindert Nutzer am Abschluss?
2. **Quick Wins** - Welche Änderungen können diese Woche umgesetzt werden?
3. **Mobile UX** - Gibt es offensichtliche Mobile-Probleme?

## Ausgabeformat
Priorisierte Liste mit:
- Problem
- Auswirkung (Hoch/Mittel/Niedrig)
- Konkrete Lösung (1 Satz)
- Geschätzter Aufwand (Stunden)

Halte die Antwort kurz und actionable.`;
}

export function generateDeepAuditPrompt(data: PromptData): string {
  const competitors = data.competitors?.join(", ") || "movu.ch, comparis.ch";
  const topPages = data.topPages?.join("\n- ") || "Homepage, Rechner, Firmen-Verzeichnis";
  
  return `# Comprehensive Website Audit

## Projekt Details
- **Name:** ${data.projectName || "Umzugscheck.ch"}
- **URL:** ${data.projectUrl || "https://umzugscheck.ch"}
- **Branche:** Swiss Moving Comparison Platform
- **Zielgruppe:** Privatpersonen und Firmen, die umziehen möchten

## Aktuelle Performance-Metriken
| Metrik | Wert | Benchmark |
|--------|------|-----------|
| Conversion Rate | ${data.conversionRate || 14}% | 15-20% |
| Bounce Rate | ${data.bounceRate || 38.5}% | 30-40% |
| Mobile Score | ${data.mobileScore || 67} | 80+ |
| Avg. Session | ${data.avgSessionDuration || "2:45"} | 3:00+ |

## Top Pages zu analysieren
- ${topPages}

## Wettbewerber zum Vergleich
${competitors}

## Analyse-Bereiche

### 1. Conversion Funnel (40% Fokus)
- Homepage → Rechner → Ergebnis → Lead-Formular → Danke-Seite
- Wo steigen die meisten Nutzer aus?
- Welche CTAs funktionieren nicht?
- Ist der Rechner verständlich?

### 2. SEO & Content (25% Fokus)
- Meta-Tags Qualität
- H1/H2 Struktur
- Interne Verlinkung
- Content-Lücken vs. Wettbewerber

### 3. Technical Performance (20% Fokus)
- Core Web Vitals
- Mobile Responsiveness
- JavaScript Bundle Size
- Caching-Strategie

### 4. Trust & Social Proof (15% Fokus)
- Bewertungen sichtbar?
- Vertrauenselemente (Siegel, Partner)
- Testimonials
- Kontaktmöglichkeiten

## Erwartetes Output

### A) Executive Summary
2-3 Sätze: Gesamteindruck und kritischster Punkt

### B) Priorisierte Findings
Für jedes Finding:
1. **Problem** - Was ist das Issue?
2. **Impact** - Wie stark (ICE: Impact, Confidence, Effort)
3. **Evidence** - Wo sieht man das Problem?
4. **Solution** - Konkrete Lösung
5. **A/B Test Idee** - Wie validieren?

### C) Wettbewerbs-Vergleich
Was machen ${competitors} besser/schlechter?

### D) 90-Tage Roadmap
- Woche 1-2: Quick Wins
- Woche 3-6: Medium Effort
- Woche 7-12: Strategic Improvements

### E) KPIs zum Tracken
Welche Metriken sollten nach Umsetzung verbessern?`;
}

export function generateCodeReviewPrompt(data: PromptData): string {
  return `# Technical Code Review

## Projekt
- **Name:** ${data.projectName || "Umzugscheck.ch"}
- **Stack:** React 18, Vite, TypeScript, Tailwind CSS, Supabase
- **Ziel:** Code-Qualität und Performance optimieren

## Review-Fokus

### 1. Performance (30%)
- Bundle Size & Code Splitting
- React Rendering Optimization (useMemo, useCallback)
- Lazy Loading Implementation
- Image Optimization

### 2. Code Architecture (25%)
- Component Structure & Reusability
- State Management Patterns
- Custom Hooks Quality
- API Layer Design

### 3. TypeScript Quality (20%)
- Type Safety
- Interface/Type Definitions
- Generic Usage
- any/unknown Handling

### 4. Best Practices (15%)
- Error Handling & Error Boundaries
- Loading States
- Form Validation
- Accessibility (a11y)

### 5. Security (10%)
- Input Sanitization
- API Security (RLS Policies)
- Authentication Flow
- Data Exposure Risks

## Erwartetes Output

### A) Critical Issues
Sofort beheben (Bugs, Security, Performance-Blocker)

### B) Code Smells
Refactoring-Kandidaten mit Beispielen

### C) Optimization Opportunities
Performance-Verbesserungen mit geschätztem Impact

### D) Recommended Patterns
Best Practices die fehlen

### E) Konkrete Code-Snippets
Für die TOP 3 Issues: Vorher/Nachher Code`;
}

export function generateScreenshotAnalysisPrompt(data: PromptData): string {
  const screenshotInfo = data.screenshotData 
    ? `
- **Erfasste URL:** ${data.screenshotData.url}
- **Auflösung:** ${data.screenshotData.dimension}
- **Full Page:** ${data.screenshotData.isFullPage ? "Ja" : "Nein"}
- **Erfasst am:** ${data.screenshotData.capturedAt}`
    : "";

  return `# Visual Screenshot Analysis

## Projekt
- **Name:** ${data.projectName || "Umzugscheck.ch"}
- **URL:** ${data.projectUrl || "https://umzugscheck.ch"}
${screenshotInfo}

## Analysiere den Screenshot und bewerte:

### 1. Visual Hierarchy (25%)
- Ist die wichtigste Information (CTA, Value Proposition) sofort sichtbar?
- Gibt es eine klare visuelle Hierarchie?
- Funktioniert der F-Pattern oder Z-Pattern für Lesefluss?

### 2. Above the Fold (25%)
- Was sieht der Nutzer ohne zu scrollen?
- Ist der Hauptnutzen der Seite klar?
- Gibt es einen überzeugenden Call-to-Action?

### 3. Design Consistency (20%)
- Stimmen Farben, Fonts und Abstände überein?
- Gibt es visuelle Störelemente?
- Wirkt das Design professionell und vertrauenswürdig?

### 4. Mobile/Responsive (15%)
- Sehen Elemente auf dieser Auflösung korrekt aus?
- Sind Touch-Targets groß genug?
- Ist der Text lesbar?

### 5. Conversion-Optimierung (15%)
- Sind CTAs gut sichtbar und ansprechend?
- Gibt es Trust-Elemente (Bewertungen, Siegel)?
- Ist der nächste Schritt für den Nutzer klar?

## Ausgabeformat

### Positives ✅
- Was funktioniert gut?

### Verbesserungen ⚠️
- Was sollte optimiert werden? (Mit konkreten Vorschlägen)

### Kritische Issues ❌
- Was muss sofort behoben werden?

### Quick Wins 🚀
- 3 Änderungen die heute umgesetzt werden können`;
}

export function generateRegressionReportPrompt(data: PromptData): string {
  const regressionInfo = data.regressionData
    ? `
- **Baseline:** ${data.regressionData.baselineName}
- **Unterschied:** ${data.regressionData.diffPercent.toFixed(2)}%
- **Schwellenwert:** ${data.regressionData.threshold}%
- **Status:** ${data.regressionData.status}`
    : "";

  return `# Visual Regression Analysis Report

## Projekt
- **Name:** ${data.projectName || "Umzugscheck.ch"}
- **URL:** ${data.projectUrl || "https://umzugscheck.ch"}
${regressionInfo}

## Deine Aufgabe
Analysiere die Unterschiede zwischen der Baseline und dem neuen Screenshot:

### 1. Art der Änderungen
- Handelt es sich um beabsichtigte Änderungen?
- Gibt es unerwartete Layout-Shifts?
- Sind Inhalte verschwunden oder hinzugekommen?

### 2. Impact-Bewertung
- **High Impact:** Kritische UI-Elemente betroffen (CTAs, Navigation, Forms)
- **Medium Impact:** Sekundäre Elemente verändert
- **Low Impact:** Kosmetische Änderungen

### 3. Potenzielle Ursachen
- CSS-Änderungen
- Content-Updates
- Responsive Breakpoint Issues
- Third-Party Script Änderungen
- Browser Rendering Unterschiede

### 4. Empfehlungen
- Sollte die neue Version als neue Baseline übernommen werden?
- Gibt es Bugs die behoben werden müssen?
- Sind weitere Tests erforderlich?

## Ausgabeformat

| Bereich | Änderung | Impact | Empfehlung |
|---------|----------|--------|------------|
| Header | ... | High/Medium/Low | ... |
| Hero | ... | High/Medium/Low | ... |
| ... | ... | ... | ... |

### Zusammenfassung
- Gesamtbewertung: ✅ Akzeptabel / ⚠️ Review nötig / ❌ Kritisch
- Nächste Schritte: ...`;
}

export function generateSEOAuditPrompt(data: PromptData): string {
  const topPages = data.topPages?.join("\n- ") || "Homepage, Rechner, Firmen-Verzeichnis";
  
  return `# SEO Deep Dive Audit

## Projekt
- **Name:** ${data.projectName || "Umzugscheck.ch"}
- **URL:** ${data.projectUrl || "https://umzugscheck.ch"}
- **Branche:** Swiss Moving Comparison Platform
- **Markt:** Schweiz (DE-CH)

## Zu analysierende Seiten
- ${topPages}

## SEO Analyse-Bereiche

### 1. On-Page SEO (30%)
- Title Tags (Länge, Keywords, Einzigartigkeit)
- Meta Descriptions (Länge, CTA, Keywords)
- H1-H6 Struktur
- Keyword-Dichte und Platzierung
- Alt-Tags für Bilder
- Interne Verlinkung

### 2. Technical SEO (25%)
- Core Web Vitals (LCP, FID, CLS)
- Mobile-First Indexing
- XML Sitemap
- Robots.txt
- Canonical Tags
- Structured Data (Schema.org)
- HTTPS & Security Headers

### 3. Content Quality (20%)
- E-E-A-T Signale
- Content Depth und Relevanz
- Aktualität der Inhalte
- Duplicate Content Check
- User Intent Match

### 4. Local SEO (15%)
- Google Business Profile Optimierung
- NAP Konsistenz
- Regionale Keywords
- Swiss-spezifische Optimierungen

### 5. Off-Page Signals (10%)
- Backlink-Profil Einschätzung
- Domain Authority
- Social Signals
- Brand Mentions

## Erwartetes Output

### A) SEO Score Card
| Kategorie | Score | Status |
|-----------|-------|--------|
| On-Page | ?/100 | 🟢/🟡/🔴 |
| Technical | ?/100 | 🟢/🟡/🔴 |
| Content | ?/100 | 🟢/🟡/🔴 |
| Local | ?/100 | 🟢/🟡/🔴 |

### B) Top 5 Quick Wins
Sofort umsetzbare Verbesserungen

### C) Keyword Opportunities
Keywords für die die Seite ranken sollte

### D) Konkurrenz-Vergleich
Wo stehen wir vs. movu.ch, comparis.ch?

### E) 6-Monats SEO Roadmap
Priorisierte Maßnahmen`;
}

export function generateAccessibilityAuditPrompt(data: PromptData): string {
  return `# Accessibility (a11y) Audit

## Projekt
- **Name:** ${data.projectName || "Umzugscheck.ch"}
- **URL:** ${data.projectUrl || "https://umzugscheck.ch"}
- **Ziel-Standard:** WCAG 2.1 Level AA

## Prüfbereiche

### 1. Perceivable (25%)
- Textalternativen für Bilder
- Untertitel/Transkripte für Multimedia
- Kontrastverhältnisse (min 4.5:1)
- Responsive Text (zoombar bis 200%)
- Keine Information nur durch Farbe vermittelt

### 2. Operable (25%)
- Vollständige Tastaturnavigation
- Keine Tastatur-Fallen
- Skip-Links vorhanden
- Fokus-Indikatoren sichtbar
- Ausreichend Zeit für Interaktionen
- Keine Blitz-Effekte

### 3. Understandable (25%)
- Sprache im HTML definiert
- Konsistente Navigation
- Fehlerbehandlung bei Formularen
- Hilfreiche Fehlermeldungen
- Labels für Formularfelder

### 4. Robust (25%)
- Valides HTML
- ARIA korrekt verwendet
- Kompatibilität mit Screenreadern
- Kompatibilität mit verschiedenen Browsern

## Erwartetes Output

### A) Accessibility Score
| WCAG Level | Status | Issues |
|------------|--------|--------|
| Level A | ✅/❌ | n |
| Level AA | ✅/❌ | n |
| Level AAA | ✅/❌ | n |

### B) Kritische Issues
Muss sofort behoben werden (Level A Violations)

### C) Wichtige Issues
Sollte behoben werden (Level AA Violations)

### D) Empfehlungen
Best Practices und Verbesserungen

### E) Test-Empfehlungen
- Screenreader-Tests durchführen
- Keyboard-Navigation testen
- Zoom-Tests (200%, 400%)

### F) Code-Snippets
Für die TOP 3 Issues: Vorher/Nachher Code`;
}

export function generatePrompt(variant: PromptVariant, data: PromptData): string {
  switch (variant) {
    case "quick":
      return generateQuickAnalysisPrompt(data);
    case "deep":
      return generateDeepAuditPrompt(data);
    case "code":
      return generateCodeReviewPrompt(data);
    case "screenshot":
      return generateScreenshotAnalysisPrompt(data);
    case "regression":
      return generateRegressionReportPrompt(data);
    case "seo":
      return generateSEOAuditPrompt(data);
    case "accessibility":
      return generateAccessibilityAuditPrompt(data);
    default:
      return generateQuickAnalysisPrompt(data);
  }
}

export function getPromptMetadata(variant: PromptVariant) {
  return PROMPT_VARIANTS[variant];
}

// Export all prompt generators for external use
export const PROMPT_GENERATORS = {
  quick: generateQuickAnalysisPrompt,
  deep: generateDeepAuditPrompt,
  code: generateCodeReviewPrompt,
  screenshot: generateScreenshotAnalysisPrompt,
  regression: generateRegressionReportPrompt,
  seo: generateSEOAuditPrompt,
  accessibility: generateAccessibilityAuditPrompt,
} as const;
