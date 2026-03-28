// ============================================================================
// 10 CHATGPT PROMPT ENHANCEMENTS - World-Class AI Feedback System
// ============================================================================

export interface PromptEnhancement {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  prompt: string;
  category: 'analysis' | 'comparison' | 'synthesis' | 'audit' | 'creative';
  priority: 'P0' | 'P1' | 'P2';
}

export const CHATGPT_PROMPT_ENHANCEMENTS: PromptEnhancement[] = [
  {
    id: 'cross-validation',
    title: 'Cross-Validation Matrix',
    titleEn: 'Cross-Validation Matrix',
    description: 'Prüft jeden Flow gegen alle anderen auf Inkonsistenzen',
    category: 'analysis',
    priority: 'P0',
    prompt: `## CROSS-VALIDATION MATRIX

Erstelle eine Kreuzvalidierungs-Matrix:

| Element | V1 | V2 | V3 | ... | Best Practice | Winner |
|---------|----|----|----|----|---------------|--------|
| Hero CTA | X | ✓ | ✓ | | Kontrast + Action | V3 |
| Trust Signals | ✓ | X | ✓ | | Above Fold | V1 |
| Mobile Touch | X | X | ✓ | | 48px Targets | V3 |

Für jedes Element:
1. Markiere ✓ wenn Best Practice erfüllt
2. Markiere X wenn verbesserungswürdig
3. Bestimme den Gewinner pro Kategorie
4. Erkläre WARUM der Gewinner besser ist

Output: Matrix + Gewinner pro Kategorie + V10 Empfehlung`
  },
  {
    id: 'friction-audit',
    title: 'Friction Point Deep-Dive',
    titleEn: 'Friction Point Deep-Dive',
    description: 'Identifiziert und quantifiziert alle Reibungspunkte',
    category: 'audit',
    priority: 'P0',
    prompt: `## FRICTION POINT DEEP-DIVE

Analysiere jeden Step auf Friction:

### Friction-Kategorien:
1. **Cognitive Load** - Zu viel auf einmal
2. **Decision Fatigue** - Zu viele Optionen
3. **Input Friction** - Schwierige Eingaben
4. **Trust Friction** - Fehlende Sicherheit
5. **Visual Friction** - Unklare Hierarchie
6. **Mobile Friction** - Touch-Probleme

### Pro Flow/Step:
| Step | Friction Type | Severity (1-10) | Fix Effort | Impact |
|------|--------------|-----------------|------------|--------|

### Priorisierung:
- 🔴 Severity 8-10: Sofort fixen
- 🟡 Severity 5-7: Nächster Sprint
- 🟢 Severity 1-4: Backlog

Output: Vollständige Friction-Map mit priorisierter Roadmap`
  },
  {
    id: 'conversion-psychology',
    title: 'Conversion Psychology Audit',
    titleEn: 'Conversion Psychology Audit',
    description: 'Analysiert psychologische Trigger und Persuasion-Patterns',
    category: 'audit',
    priority: 'P0',
    prompt: `## CONVERSION PSYCHOLOGY AUDIT

Prüfe jeden Flow auf psychologische Prinzipien:

### Cialdini's 6 Principles:
1. **Reciprocity** - Geben vor Nehmen (Preisschätzung vor Kontakt)
2. **Commitment** - Kleine Schritte zuerst (Micro-Commitments)
3. **Social Proof** - Bewertungen, Zahlen, Testimonials
4. **Authority** - Zertifikate, Partner, Medien
5. **Liking** - Sympathische Sprache, Bilder
6. **Scarcity** - Dringlichkeit, Limitierung

### Pro Flow bewerten:
| Principle | Vorhanden? | Stärke (1-10) | Verbesserung |
|-----------|-----------|---------------|--------------|

### Zusätzliche Patterns:
- Loss Aversion ("Verpassen Sie nicht...")
- Anchoring (Preisrahmen zuerst zeigen)
- Choice Architecture (Default-Optionen)
- Progress Indication (Fortschrittsbalken)

Output: Psychologie-Score pro Flow + Top 5 Verbesserungen`
  },
  {
    id: 'mobile-excellence',
    title: 'Mobile Excellence Check',
    titleEn: 'Mobile Excellence Check',
    description: 'Tiefenanalyse der Mobile-UX nach Google-Standards',
    category: 'audit',
    priority: 'P0',
    prompt: `## MOBILE EXCELLENCE CHECK

Analysiere Mobile-Screenshots nach Google Mobile-First Standards:

### Core Web Vitals Proxy:
- LCP-Bereich sichtbar? (Hauptinhalt above fold)
- CLS-Risiken? (Springende Elemente)
- Interaktive Elemente erreichbar?

### Touch-Optimierung:
| Element | Mindestgröße 48px? | Abstand 8px? | Thumb Zone? |
|---------|-------------------|--------------|-------------|

### Mobile-Spezifisch:
- [ ] Sticky CTA am unteren Rand
- [ ] Keine Hover-Only Elemente
- [ ] Native Input-Typen (tel, email)
- [ ] Autofill-Unterstützung
- [ ] Keine horizontalen Scrolls
- [ ] Lesbare Schrift (min 16px)

### Thumb Zone Analyse:
- Grün (easy reach): Wichtige CTAs?
- Gelb (stretch): Sekundäre Actions?
- Rot (hard): Navigation?

Output: Mobile-Score + Touch-Heatmap-Beschreibung + Fixes`
  },
  {
    id: 'copy-teardown',
    title: 'Copy Teardown',
    titleEn: 'Copy Teardown',
    description: 'Analysiert alle Texte auf Conversion-Wirkung',
    category: 'analysis',
    priority: 'P1',
    prompt: `## COPY TEARDOWN

Analysiere jeden Text-Element:

### Headlines:
| Flow | Headline | AIDA Score | Improvement |
|------|----------|------------|-------------|
| | | A:_ I:_ D:_ A:_ | |

### CTA-Texte:
| CTA Original | Problem | Optimiert | Begründung |
|--------------|---------|-----------|------------|
| "Weiter" | Vage | "Offerte erhalten" | Action-orientiert |

### Micro-Copy:
- Formular-Labels klar?
- Error Messages hilfreich?
- Placeholder-Texte sinnvoll?
- Help-Texte vorhanden?

### Tone of Voice:
- Konsistent?
- Zielgruppengerecht?
- Vertrauensbildend?

Output: Alle Texte mit konkreten Optimierungen`
  },
  {
    id: 'competitor-benchmark',
    title: 'Competitor Benchmark Template',
    titleEn: 'Competitor Benchmark Template',
    description: 'Template für Wettbewerbsvergleich',
    category: 'comparison',
    priority: 'P1',
    prompt: `## COMPETITOR BENCHMARK

Wenn Competitor-Screenshots vorhanden, vergleiche:

### Feature Matrix:
| Feature | Unsere Flows | Competitor A | Competitor B | Best in Class |
|---------|-------------|--------------|--------------|---------------|
| Steps | | | | |
| Trust Signals | | | | |
| Mobile UX | | | | |
| Speed | | | | |

### Unique Selling Points:
- Was machen WIR besser?
- Was machen SIE besser?
- Was fehlt bei BEIDEN?

### Steal-Worthy Ideas:
1. Element: ___ | Von: ___ | Warum gut: ___
2. ...

### Differenzierung:
- Wie können wir uns abheben?
- Welche Nische können wir besetzen?

Output: Competitive Matrix + Differenzierungsstrategie`
  },
  {
    id: 'ab-test-generator',
    title: 'A/B Test Hypothesis Generator',
    titleEn: 'A/B Test Hypothesis Generator',
    description: 'Generiert priorisierte A/B-Test-Hypothesen',
    category: 'synthesis',
    priority: 'P1',
    prompt: `## A/B TEST HYPOTHESIS GENERATOR

Basierend auf der Analyse, generiere A/B-Tests:

### Format pro Test:
**Test #X: [Name]**
- **Hypothese:** Wenn wir [Änderung], dann [Ergebnis], weil [Begründung]
- **Control:** [Aktueller Zustand]
- **Variant:** [Änderung]
- **Primary Metric:** [z.B. Conversion Rate]
- **Secondary Metrics:** [z.B. Time on Step, Bounce Rate]
- **Sample Size:** [Geschätzt]
- **Expected Impact:** +X% bis +Y%
- **Effort:** Low/Medium/High
- **Priorität:** P0/P1/P2

### ICE Score:
| Test | Impact (1-10) | Confidence (1-10) | Ease (1-10) | Score |
|------|--------------|-------------------|-------------|-------|

### Roadmap:
- Woche 1-2: Test #_
- Woche 3-4: Test #_
- Monat 2: Test #_, #_

Output: 10 priorisierte A/B-Test-Hypothesen mit Roadmap`
  },
  {
    id: 'v10-blueprint',
    title: 'V10 Ultimate Blueprint',
    titleEn: 'V10 Ultimate Blueprint',
    description: 'Detaillierte Spezifikation für den perfekten Flow',
    category: 'synthesis',
    priority: 'P0',
    prompt: `## V10 "ULTIMATE FLOW" BLUEPRINT

Erstelle eine detaillierte Spezifikation:

### V10 Grundprinzipien:
- ⏱️ Unter 90 Sekunden komplett
- 📱 Mobile-First, Desktop-Enhanced
- 🛡️ Trust auf jedem Step
- ⚡ Zero Friction
- 🎯 Ein klares Ziel pro Step

### Step-by-Step Spezifikation:

**Step 1: [Name]**
- Ziel: ___
- Layout: ___
- Elemente (priorisiert):
  1. ___
  2. ___
- Trust-Signal: ___
- CTA: ___
- Mobile-Besonderheit: ___

[Für jeden Step wiederholen]

### V10 Features:
- [ ] Progressive Disclosure
- [ ] Smart Defaults
- [ ] Inline Validation
- [ ] Autosave
- [ ] Exit Intent
- [ ] Progress Indicator

### Wireframe-Beschreibung:
[ASCII-Art oder detaillierte Beschreibung]

Output: Komplette V10 Spezifikation für Entwickler`
  },
  {
    id: 'accessibility-audit',
    title: 'Accessibility Quick-Audit',
    titleEn: 'Accessibility Quick-Audit',
    description: 'WCAG 2.1 Schnellprüfung',
    category: 'audit',
    priority: 'P1',
    prompt: `## ACCESSIBILITY QUICK-AUDIT (WCAG 2.1)

Prüfe auf Basis der Screenshots:

### Visuell erkennbar:
- [ ] Farbkontrast ausreichend (4.5:1 Text, 3:1 UI)
- [ ] Nicht nur Farbe als Information
- [ ] Text mindestens 16px
- [ ] Fokus-Indikatoren sichtbar
- [ ] Klare visuelle Hierarchie

### Interaktion:
- [ ] Touch Targets 48x48px
- [ ] Genug Abstand zwischen Elementen
- [ ] Keine Zeitlimits sichtbar
- [ ] Formulare mit Labels

### Struktur:
- [ ] Logische Überschriften-Hierarchie
- [ ] Sinnvolle Leserichtung
- [ ] Gruppierung zusammengehöriger Elemente

### Pro Flow:
| Kriterium | Status | Problem | Fix |
|-----------|--------|---------|-----|

Output: Accessibility-Score + kritische Fixes`
  },
  {
    id: 'implementation-roadmap',
    title: 'Implementation Roadmap',
    titleEn: 'Implementation Roadmap',
    description: 'Priorisierte Umsetzungs-Roadmap',
    category: 'synthesis',
    priority: 'P0',
    prompt: `## IMPLEMENTATION ROADMAP

Basierend auf allen Analysen, erstelle eine Roadmap:

### Quick Wins (1-2 Tage)
| # | Änderung | Flow/Step | Impact | Aufwand |
|---|----------|-----------|--------|---------|
| 1 | | | 🔥🔥🔥 | ⚡ |

### Short-Term (1-2 Wochen)
| # | Änderung | Abhängigkeit | Impact | Aufwand |
|---|----------|--------------|--------|---------|

### Medium-Term (1 Monat)
| # | Änderung | Ressourcen | Impact | Aufwand |
|---|----------|------------|--------|---------|

### Long-Term (Quartal)
| # | Änderung | Team | Impact | Aufwand |
|---|----------|------|--------|---------|

### Abhängigkeiten:
[Mermaid-Diagramm oder Liste]

### Ressourcen-Schätzung:
- Design: X Stunden
- Frontend: X Stunden
- Backend: X Stunden
- QA: X Stunden

### KPIs pro Phase:
- Quick Wins: +X% Conversion
- Short-Term: +X% Conversion
- Medium-Term: +X% Conversion

Output: Vollständige Roadmap mit Ressourcen und KPIs`
  }
];

// Get all enhancements as formatted markdown for export
export const getAllEnhancementsMarkdown = (): string => {
  const sections = CHATGPT_PROMPT_ENHANCEMENTS.map((e, i) => `
## ${i + 1}. ${e.title}

**Kategorie:** ${e.category} | **Priorität:** ${e.priority}

${e.description}

${e.prompt}

---
`).join('\n');

  return `# 🧠 10 CHATGPT PROMPT ENHANCEMENTS

Diese Prompts sind für maximale AI-Feedback-Qualität optimiert.
Verwende sie einzeln oder kombiniert für umfassende Analysen.

${sections}

## Empfohlene Reihenfolge:

1. **Friction Audit** - Probleme identifizieren
2. **Mobile Excellence** - Mobile-UX prüfen
3. **Psychology Audit** - Conversion-Psychologie
4. **Cross-Validation** - Flows vergleichen
5. **Copy Teardown** - Texte optimieren
6. **V10 Blueprint** - Ultimate Flow designen
7. **A/B Test Generator** - Tests planen
8. **Implementation Roadmap** - Umsetzung planen

---
*Generated by Umzugscheck.ch AI Command Center*
`;
};

// Get enhancement by ID
export const getEnhancementById = (id: string): PromptEnhancement | undefined => {
  return CHATGPT_PROMPT_ENHANCEMENTS.find(e => e.id === id);
};

// Get enhancements by category
export const getEnhancementsByCategory = (category: PromptEnhancement['category']): PromptEnhancement[] => {
  return CHATGPT_PROMPT_ENHANCEMENTS.filter(e => e.category === category);
};

// Get P0 enhancements (highest priority)
export const getP0Enhancements = (): PromptEnhancement[] => {
  return CHATGPT_PROMPT_ENHANCEMENTS.filter(e => e.priority === 'P0');
};
