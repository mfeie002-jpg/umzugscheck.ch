

# Update Milestone-Timeline + neue Growth/PR-Sektion

## Status: Was existiert bereits

- `FundingMilestoneTimeline.tsx` — existiert, startet bei Nov 2025, geht bis Aug 2026 ✅
- `FundingRoadmapSection.tsx` — Zeithorizont auf 12 Monate gesetzt ✅
- **Growth/PR Strategy Section — fehlt komplett** ❌

## Was zu tun ist

### 1. Milestone-Zusammenfassung verbessern (FundingMilestoneTimeline)

Die bestehende Timeline hat bereits Phase 0 (Nov–Mar) und die 3 Funding-Phasen. Ergänzungen:

- **Gate-Logik visueller machen**: Schloss-Icons zwischen den Phasen (F1 → F2 → F3), die zeigen: "Unlock nur bei Target-Erreichen"
- **30-Tage-Deadline** pro Phase klar beschriften: "30 Tage ODER Targets erreicht — was zuerst kommt"
- **Kill-Switch** visuell markieren: Wenn nach 3 Runden kein Fortschritt → Stopp

### 2. Neue Sektion: Growth & PR Strategy

**Neues Component:** `src/components/vision/GrowthPRStrategySection.tsx`

Kernthese: Das grösste Marketing-Asset ist das Projekt selbst — "95% AI-built Startup im kompetitivsten Markt der Welt."

**Infografik-Blöcke (SVG + Framer Motion):**

| Block | Inhalt |
|-------|--------|
| **Die Story** | Card: "KI baut 95% dieses Startups · Kompetitivster Markt · Reichstes Land" — warum das weltweit einzigartig ist |
| **Outreach-Map** | SVG-Weltkarte mit Zielgruppen: TechCrunch, Wired, t3n, Japan, ProductHunt, HackerNews — jeweils mit "Warum die darüber schreiben" |
| **Award-Pipeline** | Timeline: Swiss Startup Award, AI Innovation Awards, "Best Case: KI im härtesten Markt" |
| **Content-Flywheel** | Kreislauf-SVG: Projekt-Story → Presse → Backlinks → SEO-Boost → Traffic → Bessere Story |
| **Pitch-Angles** | 3 Cards pro Region: Japan ("How AI solves relocations"), USA ("95% AI-built"), EU/DACH ("Letzte analoge Branche automatisiert") |
| **Multilingual** | Hinweis: AI-Translation in alle Sprachen → direktes Outreach in Landessprache |

### 3. Integration in InvestorenLanding.tsx

- Growth/PR Section nach "Already Live" und vor "Overkill Vision" einfügen
- Neue Import + Component-Platzierung

## Technisch

- Reines SVG + Framer Motion (wie bestehende Infographics)
- Brand-Farben: Teal `#008080`, Orange `#FF6B1A`
- Alle Labels direkt im Bild (Infographic-Standard)
- Responsive via `viewBox`

