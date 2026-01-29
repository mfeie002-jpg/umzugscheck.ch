# Umzugscheck.ch – ChatGPT Prompt Library

> **10 Premium ChatGPT Prompts für maximale AI-Feedback-Qualität**

---

## 📋 ÜBERSICHT

| # | ID | Titel | Kategorie | Priorität |
|---|-----|-------|-----------|-----------|
| 1 | cross-validation | Cross-Validation Matrix | analysis | P0 |
| 2 | friction-audit | Friction Point Deep-Dive | audit | P0 |
| 3 | conversion-psychology | Conversion Psychology Audit | audit | P0 |
| 4 | mobile-excellence | Mobile Excellence Check | audit | P0 |
| 5 | copy-teardown | Copy Teardown | analysis | P1 |
| 6 | competitor-benchmark | Competitor Benchmark Template | comparison | P1 |
| 7 | ab-test-generator | A/B Test Hypothesis Generator | synthesis | P1 |
| 8 | v10-blueprint | V10 Ultimate Blueprint | synthesis | P0 |
| 9 | accessibility-audit | Accessibility Quick-Audit | audit | P1 |
| 10 | implementation-roadmap | Implementation Roadmap | synthesis | P0 |

---

## 🎯 EMPFOHLENE REIHENFOLGE

1. **Friction Audit** - Probleme identifizieren
2. **Mobile Excellence** - Mobile-UX prüfen
3. **Psychology Audit** - Conversion-Psychologie
4. **Cross-Validation** - Flows vergleichen
5. **Copy Teardown** - Texte optimieren
6. **V10 Blueprint** - Ultimate Flow designen
7. **A/B Test Generator** - Tests planen
8. **Implementation Roadmap** - Umsetzung planen

---

## 1️⃣ CROSS-VALIDATION MATRIX

**ID:** `cross-validation`  
**Kategorie:** Analysis  
**Priorität:** P0

**Beschreibung:** Prüft jeden Flow gegen alle anderen auf Inkonsistenzen

### Prompt

```markdown
## CROSS-VALIDATION MATRIX

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

Output: Matrix + Gewinner pro Kategorie + V10 Empfehlung
```

**Verwendung:** Vergleiche mehrere Flow-Varianten auf Konsistenz und Best Practices.

---

## 2️⃣ FRICTION POINT DEEP-DIVE

**ID:** `friction-audit`  
**Kategorie:** Audit  
**Priorität:** P0

**Beschreibung:** Identifiziert und quantifiziert alle Reibungspunkte

### Prompt

```markdown
## FRICTION POINT DEEP-DIVE

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

Output: Vollständige Friction-Map mit priorisierter Roadmap
```

**Verwendung:** Identifiziere alle Reibungspunkte in einem Funnel und priorisiere Fixes.

---

## 3️⃣ CONVERSION PSYCHOLOGY AUDIT

**ID:** `conversion-psychology`  
**Kategorie:** Audit  
**Priorität:** P0

**Beschreibung:** Analysiert psychologische Trigger und Persuasion-Patterns

### Prompt

```markdown
## CONVERSION PSYCHOLOGY AUDIT

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

Output: Psychologie-Score pro Flow + Top 5 Verbesserungen
```

**Verwendung:** Analysiere Persuasion-Patterns und optimiere für höhere Conversion.

---

## 4️⃣ MOBILE EXCELLENCE CHECK

**ID:** `mobile-excellence`  
**Kategorie:** Audit  
**Priorität:** P0

**Beschreibung:** Tiefenanalyse der Mobile-UX nach Google-Standards

### Prompt

```markdown
## MOBILE EXCELLENCE CHECK

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

Output: Mobile-Score + Touch-Heatmap-Beschreibung + Fixes
```

**Verwendung:** Analysiere Mobile-UX und identifiziere Touch-Probleme.

---

## 5️⃣ COPY TEARDOWN

**ID:** `copy-teardown`  
**Kategorie:** Analysis  
**Priorität:** P1

**Beschreibung:** Analysiert alle Texte auf Conversion-Wirkung

### Prompt

```markdown
## COPY TEARDOWN

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

Output: Alle Texte mit konkreten Optimierungen
```

**Verwendung:** Optimiere alle Texte für maximale Conversion.

---

## 6️⃣ COMPETITOR BENCHMARK TEMPLATE

**ID:** `competitor-benchmark`  
**Kategorie:** Comparison  
**Priorität:** P1

**Beschreibung:** Template für Wettbewerbsvergleich

### Prompt

```markdown
## COMPETITOR BENCHMARK

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

Output: Competitive Matrix + Differenzierungsstrategie
```

**Verwendung:** Vergleiche mit Wettbewerbern (movu.ch, etc.).

---

## 7️⃣ A/B TEST HYPOTHESIS GENERATOR

**ID:** `ab-test-generator`  
**Kategorie:** Synthesis  
**Priorität:** P1

**Beschreibung:** Generiert priorisierte A/B-Test-Hypothesen

### Prompt

```markdown
## A/B TEST HYPOTHESIS GENERATOR

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

Output: 10 priorisierte A/B-Test-Hypothesen mit Roadmap
```

**Verwendung:** Generiere datengetriebene A/B-Test-Hypothesen.

---

## 8️⃣ V10 ULTIMATE BLUEPRINT

**ID:** `v10-blueprint`  
**Kategorie:** Synthesis  
**Priorität:** P0

**Beschreibung:** Detaillierte Spezifikation für den perfekten Flow

### Prompt

```markdown
## V10 "ULTIMATE FLOW" BLUEPRINT

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

Output: Komplette V10 Spezifikation für Entwickler
```

**Verwendung:** Erstelle die Blaupause für den "Ultimate Flow".

---

## 9️⃣ ACCESSIBILITY QUICK-AUDIT

**ID:** `accessibility-audit`  
**Kategorie:** Audit  
**Priorität:** P1

**Beschreibung:** WCAG 2.1 Schnellprüfung

### Prompt

```markdown
## ACCESSIBILITY QUICK-AUDIT (WCAG 2.1)

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

Output: Accessibility-Score + kritische Fixes
```

**Verwendung:** Schnelle WCAG 2.1 Prüfung für Barrierefreiheit.

---

## 🔟 IMPLEMENTATION ROADMAP

**ID:** `implementation-roadmap`  
**Kategorie:** Synthesis  
**Priorität:** P0

**Beschreibung:** Priorisierte Umsetzungs-Roadmap

### Prompt

```markdown
## IMPLEMENTATION ROADMAP

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

Output: Vollständige Roadmap mit Ressourcen und KPIs
```

**Verwendung:** Erstelle eine priorisierte Umsetzungs-Roadmap.

---

## 💡 KOMBINATIONS-TIPPS

### Für initiale Analyse:
1. **Friction Audit** → Probleme finden
2. **Mobile Excellence** → Mobile-Gaps
3. **Psychology Audit** → Persuasion-Gaps

### Für Optimierung:
1. **Copy Teardown** → Texte verbessern
2. **V10 Blueprint** → Neue Version designen
3. **A/B Test Generator** → Tests planen

### Für Wettbewerb:
1. **Competitor Benchmark** → Vergleich erstellen
2. **Cross-Validation** → Interne Varianten
3. **Implementation Roadmap** → Priorisieren

---

## 📁 KEY FILE

```
src/lib/chatgpt-prompt-enhancements.ts  → Alle 10 Prompts + Export-Funktionen
```

---

*Letzte Aktualisierung: Januar 2025*
