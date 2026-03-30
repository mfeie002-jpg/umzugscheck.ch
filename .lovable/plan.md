

# 10%-Sample: 3 selbsterklärende Infografiken

## Ziel
3 Infografiken bauen, die **ohne umgebenden Text** verständlich sind. Jede Grafik enthält Titel, Zahlen, Labels, Legenden und visuelle Hierarchie direkt im SVG. Wie eine echte Infografik — Text im Bild ist erwünscht.

## Die 3 Samples

### Sample 1: Revenue Waterfall (RevenueStreamExamples)
Gestapeltes Wasserfall-Diagramm im SVG:
- Titel im Bild: **"10 Revenue Streams → CHF 553 pro Lead"**
- 10 farbige Blöcke die sich aufeinander stapeln (von links nach rechts aufbauend)
- Jeder Block: Emoji + Name + CHF-Betrag + Kategorie-Farbe (Quick/Medium/Complex)
- Kumulative Linie oben die den Gesamtwert zeigt
- Legende unten: 3 Kategorien mit Farbcodes
- Abschluss-Label rechts: **"CHF 553 AOV"** gross und prominent

### Sample 2: TAM/SAM/SOM Konzentrische Kreise (MarketPotentialSection)
Drei ineinander liegende Kreise im SVG:
- Äusserster Kreis: **TAM — CHF 1 Mrd.+ / "Schweizer Umzugsmarkt gesamt"**
- Mittlerer Kreis: **SAM — CHF 50 Mio. / "Digital erreichbar"**
- Innerster Kreis: **SOM — CHF 3'200 / "Jahr 1 Ziel"**
- Proportional skaliert (nicht 1:1 — sonst wäre SOM unsichtbar, also logarithmisch)
- 4 Acquisition-Channel-Pfeile die in den SOM-Kreis zeigen (SEO 70%, TV 15%, Referral 10%, Social 5%)
- Titel oben: **"Marktpotenzial Schweiz"**
- Kontext-Label: **"120'000 Umzüge/Jahr"**

### Sample 3: Break-Even-Pfad (VisionProfitabilityRoadmap)
Horizontale Timeline-Grafik im SVG:
- X-Achse: Monate M1–M18
- Y-Achse: Revenue CHF 0 → 6'000+
- Aufsteigende Kurve mit Datenpunkten
- **Rote Zone** (unter Break-Even) und **Grüne Zone** (über Break-Even)
- Horizontale gestrichelte Linie bei **CHF 6'000 = "Break-Even"**
- Meilenstein-Marker auf der Kurve: "Erste Leads" (M2), "100 Leads/Mo" (M6), "Break-Even" (M12-15)
- 5 Phase-Labels am unteren Rand (aus den bestehenden Milestones)
- Titel oben: **"Von Null auf Profitabel"**
- Untertitel: **"Der 15-Monats-Pfad zum selbsttragenden Modell"**

## Technische Umsetzung

| Aspekt | Detail |
|--------|--------|
| **Neues File** | `src/components/vision/InvestorInfographics3.tsx` |
| **Tech** | Reines SVG + Framer Motion (viewBox-basiert, responsive) |
| **Farben** | Brand-Tokens: Teal `#008080`, Orange `#FF6B1A`, Slate-Töne, Grün/Rot für Zonen |
| **Text im Bild** | Titel, Subtitel, Labels, Zahlen, Legenden — alles als SVG `<text>` |
| **Integration** | Einfügen in `RevenueStreamExamples.tsx`, `MarketPotentialSection.tsx`, `VisionProfitabilityRoadmap.tsx` |

## Nach Approval
Wenn der Stil passt, folgen die restlichen 7 Infografiken im gleichen Standard.

