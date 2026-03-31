

# Business Case PDF Integration: Sektion + Download

## Ausgangslage

- **PDF vorhanden**: 5-seitiger Business Case (Problem → Lösung → KI-Verbindung → Warum 2 Firmen → Synergien → Regionen)
- **TwoPillarModel existiert bereits**: SVG-Infografik mit Portal vs. Dienstleister, verlinkt auf `/zwei-saeulen-modell.pdf`
- **Inhaltliche Lücke**: Das PDF enthält 3 starke Argumente, die noch nicht auf der Seite sind:
  1. **Glaubwürdigkeit** — Portal bleibt neutral, Dienstleister liefert separat
  2. **Zero CAC** — Feierabend bekommt Kunden ohne eigene Ads
  3. **Doppelter Einkommensstrom** — Plattform-Marge + operative Marge

## Was gebaut wird

### 1. PDF als Download bereitstellen
- PDF nach `public/business-case-umzugscheck-feierabend.pdf` kopieren
- Download-Button in der TwoPillarModel-Sektion ergänzen (neben dem bestehenden)

### 2. Neue Komponente: `BusinessCaseOverviewSection.tsx`
Kompakte Sektion mit dem destillierten Business Case aus dem PDF:

**Block A — "Zwei Projekte. Ein Ökosystem."** (Headline)
- Problem-Statement: intransparenter Markt, fragmentierte Anbieter
- Lösung in einem Satz: *"Umzugscheck bringt die Kunden. Feierabend macht die Arbeit. Die KI verbindet beides."*

**Block B — 3 Vorteile der Trennung** (Cards)
- Glaubwürdigkeit: Portal bleibt neutral
- Zero CAC: Feierabend-Kunden fliessen organisch über Portal
- Doppelter Einkommensstrom: Vermittlung + eigene Ausführung

**Block C — Synergie-Tabelle** (2-Spalten)
- Links: Umzugscheck liefert (Reichweite, Leads, Marktdaten, KI, Skalierung)
- Rechts: Feierabend liefert (40+ Jahre, Exzellenz, Praxiswissen, Premium, Proof of Concept)

**Block D — Download-CTA**
- Button: "Business Case herunterladen (PDF)"

### 3. Integration in InvestorenLanding.tsx
- Neue Sektion **nach TwoPillarModel** (Position 4.5) einfügen
- Das ergänzt die bestehende SVG-Infografik mit dem textuellen Business Case

## Dateien

| Aktion | Datei |
|--------|-------|
| Copy | PDF → `public/business-case-umzugscheck-feierabend.pdf` |
| Create | `src/components/vision/BusinessCaseOverviewSection.tsx` |
| Edit | `src/pages/InvestorenLanding.tsx` (Import + Platzierung nach TwoPillarModel) |

## Technisch
- Gleicher Stil: Badge, Cards, Framer Motion, Teal/Orange
- Synergie-Tabelle als responsive 2-Spalten Grid (nicht SVG)
- PDF-Download als `<a href download>` Button

