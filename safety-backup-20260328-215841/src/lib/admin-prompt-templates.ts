/**
 * Analysis prompt templates for AI feedback tools
 * Extracted from Admin Tools.tsx for maintainability
 */

export interface ProjectConfig {
  projectName: string;
  projectUrl: string;
  description: string;
  goals: string;
  targetAudience: string;
  competitors: string;
  additionalPages: string[];
}

export const generateAnalysisPrompt = (config: ProjectConfig) => `# AI Analysis Request: ${config.projectName}

## Project Overview
- **URL**: ${config.projectUrl}
- **Description**: ${config.description}
- **Goals**: ${config.goals}
- **Target Audience**: ${config.targetAudience}

## Competitors
${config.competitors}

## Pages Analyzed
${config.additionalPages.map(p => `- ${config.projectUrl}${p}`).join('\n')}

## Analysis Instructions

Please analyze the attached screenshots and HTML files. Focus on:

### 1. UX/UI Analysis
- Visual hierarchy and layout
- Mobile responsiveness
- Call-to-action effectiveness
- User flow optimization

### 2. SEO Analysis
- Meta tags and structure
- Heading hierarchy (H1-H6)
- Internal linking
- Raw vs. Rendered HTML differences

### 3. Conversion Optimization
- Form design and placement
- Trust signals
- Value proposition clarity
- Friction points

### 4. Recommendations
- Quick wins (easy to implement)
- Medium-term improvements
- Strategic recommendations

Please provide specific, actionable feedback with examples from the screenshots.
`;

export const generateQuickPrompt = (config: ProjectConfig) => `# Quick Analysis Prompt

${config.projectName} - Schnelle UX/Conversion-Analyse

## Projekt
- URL: ${config.projectUrl}
- Branche: Comparison Platform

## Aufgabe
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
`;

export const generateDeepPrompt = (config: ProjectConfig) => `# Deep Audit Prompt

${config.projectName} - Vollständige Analyse

## Projekt
- URL: ${config.projectUrl}
- Zielgruppe: ${config.targetAudience}
- Konkurrenten: ${Array.isArray(config.competitors) ? config.competitors.join(', ') : (config.competitors || '').toString().replace(/\n/g, ', ')}

## Analyse-Bereiche
1. Conversion Funnel (40%)
2. SEO & Content (25%)
3. Technical Performance (20%)
4. Trust & Social Proof (15%)

## Erwarteter Output
- Executive Summary
- ICE-priorisierte Findings
- Wettbewerbs-Vergleich
- 90-Tage Roadmap
`;

export const generateCodePrompt = (config: ProjectConfig) => `# Code Review Prompt

${config.projectName} - Technische Analyse

## Stack
React 18, Vite, TypeScript, Tailwind CSS, Supabase

## Fokus
1. Performance (30%) - Bundle Size, Rendering
2. Architecture (25%) - Components, State
3. TypeScript (20%) - Type Safety
4. Best Practices (15%) - Error Handling
5. Security (10%) - API, RLS

## Output
- Critical Issues
- Code Smells
- Optimization Opportunities
- Konkrete Code-Snippets
`;

export const generateScreenshotPrompt = (config: ProjectConfig) => `# Screenshot Analysis Prompt

${config.projectName} - Visuelles Review

## Analyse-Punkte
1. Visual Hierarchy (25%)
2. Above the Fold (25%)
3. Design Consistency (20%)
4. Mobile/Responsive (15%)
5. Conversion-Optimierung (15%)

## Output
- Positives ✅
- Verbesserungen ⚠️
- Kritische Issues ❌
- Quick Wins 🚀
`;

export const generateRegressionPrompt = (config: ProjectConfig) => `# Regression Report Prompt

${config.projectName} - Änderungs-Analyse

## Aufgabe
Analysiere Unterschiede zwischen Baseline und neuem Screenshot:

1. Art der Änderungen
2. Impact-Bewertung (High/Medium/Low)
3. Potenzielle Ursachen
4. Empfehlungen

## Output
| Bereich | Änderung | Impact | Empfehlung |
|---------|----------|--------|------------|
`;

export const generateSEOPrompt = (config: ProjectConfig) => `# SEO Deep Dive Prompt

${config.projectName} - Suchmaschinen-Optimierung

## Analyse-Bereiche
1. On-Page SEO (30%)
2. Technical SEO (25%)
3. Content Quality (20%)
4. Local SEO CH (15%)
5. Off-Page Signals (10%)

## Output
- SEO Score Card
- Top 5 Quick Wins
- Keyword Opportunities
- 6-Monats Roadmap
`;

export const generateAccessibilityPrompt = (config: ProjectConfig) => `# Accessibility Audit Prompt

${config.projectName} - WCAG 2.1 Level AA

## Prüfbereiche
1. Perceivable (25%)
2. Operable (25%)
3. Understandable (25%)
4. Robust (25%)

## Output
- Accessibility Score
- Kritische Issues (Level A)
- Wichtige Issues (Level AA)
- Empfehlungen
`;

export interface PackageOptions {
  desktopScreenshots: boolean;
  mobileScreenshots: boolean;
  rawHtml: boolean;
  renderedHtml: boolean;
  prompts: boolean;
  pdfBrief: boolean;
}

export const generateReadme = (config: ProjectConfig, packageOptions: PackageOptions) => {
  const selectedItems: string[] = [];
  if (packageOptions.desktopScreenshots || packageOptions.mobileScreenshots) {
    const types = [];
    if (packageOptions.desktopScreenshots) types.push('Desktop');
    if (packageOptions.mobileScreenshots) types.push('Mobile');
    selectedItems.push(`- **/screenshots/** - ${types.join(' & ')} Screenshots aller Seiten`);
  }
  if (packageOptions.rawHtml) {
    selectedItems.push('- **/html/** - Raw HTML (ohne JavaScript)');
  }
  if (packageOptions.renderedHtml) {
    selectedItems.push('- **/rendered-html/** - Gerendertes HTML (nach JavaScript-Ausführung)');
  }
  if (packageOptions.prompts) {
    selectedItems.push('- **/prompts/** - 7 verschiedene KI-Analyse-Prompts');
  }
  if (packageOptions.pdfBrief) {
    selectedItems.push('- **PROJECT_BRIEF.pdf** - Projekt-Zusammenfassung');
  }

  return `# ${config.projectName} - AI Feedback Package

## Generiert am ${new Date().toLocaleDateString('de-CH')}

### Inhalt

${selectedItems.join('\n')}

### Verwendung

1. Öffne ChatGPT, Claude oder Gemini
2. ${packageOptions.prompts ? 'Wähle einen Prompt aus dem /prompts/ Ordner' : 'Formuliere deine Analyse-Anfrage'}
3. ${packageOptions.prompts ? 'Füge den Prompt ein' : 'Beschreibe was du analysieren möchtest'}
4. Lade relevante Screenshots oder HTML-Dateien hoch
5. Erhalte detaillierte Analyse

${packageOptions.prompts ? `### Prompts

1. **Quick Analysis** - Schnelle UX/Conversion-Checks (~2 Min)
2. **Deep Audit** - Vollständige Analyse (~10 Min)
3. **Code Review** - Technische Qualität (~5 Min)
4. **Screenshot Analysis** - Visuelles Review (~3 Min)
5. **Regression Report** - Änderungs-Analyse (~3 Min)
6. **SEO Deep Dive** - Suchmaschinen-Optimierung (~8 Min)
7. **Accessibility Audit** - WCAG-Konformität (~5 Min)
` : ''}
### Projekt-Details

- **URL:** ${config.projectUrl}
- **Beschreibung:** ${config.description}
- **Zielgruppe:** ${config.targetAudience}
- **Konkurrenten:** ${Array.isArray(config.competitors) ? config.competitors.join(', ') : (config.competitors || '').toString().replace(/\n/g, ', ')}
- **Analysierte Seiten:** Homepage${config.additionalPages.length > 0 ? ` + ${config.additionalPages.length} weitere` : ''}
`;
};

export const generateGeminiReadme = (imageCount: number) => `# Gemini-Optimiertes Package

## 📋 Gemini Upload-Limits
- **Max. 10 Bilder** pro Prompt ✅
- **Max. 32.000 Tokens** (Free) / 1 Mio Tokens (Advanced) ✅
- Alle Texte in **einer Datei** kombiniert ✅

## 📁 Inhalt
- ${imageCount} Screenshots (nummeriert)
- KOMPLETT_ANALYSE.md (alle Infos + HTML + Prompts)

## 🚀 So verwendest du es mit Gemini

1. Öffne gemini.google.com
2. Klicke auf "Dateien hinzufügen"
3. Lade ALLE ${imageCount + 1} Dateien aus diesem ZIP hoch:
   - Alle .png Bilder
   - KOMPLETT_ANALYSE.md
4. Schreibe: "Analysiere diese Website basierend auf den Informationen in der Markdown-Datei"
5. Erhalte detaillierte Analyse!

## ⚡ Tipps für beste Ergebnisse
- Gemini Advanced empfohlen für längere Analysen
- Bei Timeout: Frage in mehreren Schritten
- Bilder werden automatisch analysiert
`;
