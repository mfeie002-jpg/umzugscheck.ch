// ChatGPT Prompt Templates for Website Analysis

export interface PromptData {
  projectName?: string;
  projectUrl?: string;
  conversionRate?: number;
  bounceRate?: number;
  mobileScore?: number;
  avgSessionDuration?: string;
  topPages?: string[];
  competitors?: string[];
}

export type PromptVariant = "quick" | "deep" | "code";

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

export function generatePrompt(variant: PromptVariant, data: PromptData): string {
  switch (variant) {
    case "quick":
      return generateQuickAnalysisPrompt(data);
    case "deep":
      return generateDeepAuditPrompt(data);
    case "code":
      return generateCodeReviewPrompt(data);
    default:
      return generateQuickAnalysisPrompt(data);
  }
}

export function getPromptMetadata(variant: PromptVariant) {
  return PROMPT_VARIANTS[variant];
}
