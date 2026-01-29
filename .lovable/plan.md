

# Plan: 4 Zusätzliche ChatGPT Knowledge-Dokumente erstellen

## Ziel
Erstellung von 4 weiteren Markdown-Dateien (zusätzlich zum bereits erstellten `AI_BRIEFING.md`) für das ChatGPT "Project Knowledge" Upload:

1. **ARCHITECTURE.md** – Technische Architektur & Stack
2. **REGIONS_DATABASE.md** – Alle 26 Kantone mit Preisen & SEO
3. **PROMPT_LIBRARY.md** – 10 Premium ChatGPT Prompts vollständig
4. **FLOW_VARIANTS.md** – 17 Navigation-Varianten & A/B Testing

---

## Datei 1: docs/ARCHITECTURE.md (~250 Zeilen)

### Inhalt
- **Frontend Stack**: React 18, TypeScript, Vite, Tailwind, shadcn/ui
- **State Management**: TanStack Query, React Context
- **Routing**: React Router v6 mit Lazy Loading
- **Backend**: Supabase (Lovable Cloud)
- **Edge Functions**: Kategorisierte Liste aller 80+ Functions
- **Verzeichnisstruktur**: Detailliertes Tree-Diagram
- **Key Files**: Pfade zu wichtigen Dateien
- **Design System**: Farben, Typografie, Komponenten
- **Performance**: Code-Splitting, Lazy Loading, PWA

---

## Datei 2: docs/REGIONS_DATABASE.md (~400 Zeilen)

### Inhalt
- **Übersicht**: Alle 26 Kantone mit Kürzeln
- **Datenstruktur**: TypeScript Interface `RegionData`
- **Preis-Koeffizienten**: Tabelle aller Kantone
- **Preis-Matrix**: Small/Medium/Large pro Kanton
- **Popular Regions**: Die 8 wichtigsten Kantone
- **Detaildaten für Top-Kantone**:
  - Zürich (Koeffizient 1.18)
  - Zug (Koeffizient 1.0)
  - Bern (Koeffizient 1.08)
  - Basel-Stadt (Koeffizient 1.12)
  - Luzern (Koeffizient 1.05)
  - Genf (Koeffizient 1.15)
- **SEO-Struktur**: Title, Description, H1, Canonical
- **Lokale Tipps**: Unique Content pro Kanton
- **Autocomplete Places**: PLZ + Städte

---

## Datei 3: docs/PROMPT_LIBRARY.md (~500 Zeilen)

### Inhalt
Vollständige 10 Premium ChatGPT Prompts mit:

1. **Cross-Validation Matrix** (P0)
2. **Friction Point Deep-Dive** (P0)
3. **Conversion Psychology Audit** (P0)
4. **Mobile Excellence Check** (P0)
5. **Copy Teardown** (P1)
6. **Competitor Benchmark Template** (P1)
7. **A/B Test Hypothesis Generator** (P1)
8. **V10 Ultimate Blueprint** (P0)
9. **Accessibility Quick-Audit** (P1)
10. **Implementation Roadmap** (P0)

Pro Prompt:
- ID, Titel, Kategorie, Priorität
- Beschreibung
- Vollständiger Prompt-Text
- Verwendungsempfehlung

### Bonus
- Empfohlene Reihenfolge für Analyse
- Kombinations-Tipps

---

## Datei 4: docs/FLOW_VARIANTS.md (~350 Zeilen)

### Inhalt
- **Übersicht**: 17 Navigation-Varianten
- **Golden Flow Konzept**: V10 Smart Router + V10 Navigation
- **Varianten-Tabelle**: ID, Name, Beschreibung, Labels
- **Detaillierte Varianten**:
  - V1: Original (Status Quo)
  - V2: Ultimate (Lovable)
  - V3: ChatGPT Concierge
  - V4: Strategic Report
  - V5: Mobile-First Archetyp
  - V6: Conversion-Killer
  - V7: User Journey Split
  - V8: Zielgruppen-Split
  - V9: Allgemeines Menu-Konzept
  - V10: Conversion-Killer Final
  - V11: Simpel & Clean
  - V12: Optimiert (Best-of-Breed)
  - V13: Mobile-First Optimiert
  - V14: 2026 Design
  - V15: ChatGPT Feedback v15
  - V16: SEO-Optimiert 2026
  - V17: NavigationV17 (Neu)
- **Technische Details**:
  - URL-Parameter: `?nav=variant-b`
  - localStorage Key
  - Event Handling
  - Context Provider
- **Testing-Protokoll**: Wie A/B-Tests durchführen

---

## Technische Umsetzung

4 neue Dateien erstellen:

```text
docs/ARCHITECTURE.md
docs/REGIONS_DATABASE.md
docs/PROMPT_LIBRARY.md
docs/FLOW_VARIANTS.md
```

---

## Zusammenfassung aller 5 Dateien

| Datei | Zeilen | Fokus |
|-------|--------|-------|
| AI_BRIEFING.md | ~600 | Vollständiges Projekt-Briefing |
| ARCHITECTURE.md | ~250 | Tech Stack & Backend |
| REGIONS_DATABASE.md | ~400 | 26 Kantone mit Preisen |
| PROMPT_LIBRARY.md | ~500 | 10 Premium Prompts |
| FLOW_VARIANTS.md | ~350 | 17 A/B-Test Varianten |

**Total: ~2100 Zeilen Dokumentation für ChatGPT Project Knowledge**

---

## Ergebnis

Nach Genehmigung werden alle 4 Dateien erstellt und sind bereit für:
1. Upload zu ChatGPT Project
2. Vollständiges Onboarding einer neuen AI
3. Konsistente Dokumentation im Repository

