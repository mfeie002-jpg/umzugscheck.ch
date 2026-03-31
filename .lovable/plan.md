

# Investor Pitch Content Upgrade: 4 neue Sektionen + Closing-Rewrite

## Was sich ändert

Der gesamte Text aus dem Gespräch enthält 4 klare, neue Inhaltsblöcke plus eine verbesserte Closing-Sektion. Alles wird in die bestehende Dramaturgie auf `/investoren` eingefügt.

### 1. Rewrite: `InvestorClosingSection.tsx` — Founder Conviction

Die aktuelle "100% safe"-Quote (Zeile 114-118) wird durch die polierte Version ersetzt:

> «Für mich persönlich fühlt sich dieses Modell wie 100% an, weil ich nicht aufhöre, bis ein funktionierender profitabler Kern sichtbar ist. Objektiv nenne ich es trotzdem nicht blind 100%, weil Markt, Wettbewerb, Partnerqualität, Timing und Plattformabhängigkeiten nicht vollständig kontrollierbar sind. Genau deshalb bauen wir Umzugscheck nicht auf Hoffnung, sondern auf klare Optimierungszyklen, messbare Signale und harte Disziplin.»

Plus der "Schlussgedanke an den Investor"-Block und die harte Schlusszeile:

> «Mein Commitment ist kompromisslos. Ich werde nicht aufhören, bis wir einen funktionierenden profitablen Kern freigelegt haben oder die Daten eindeutig zeigen, dass er in dieser Form nicht existiert.»

### 2. Neue Komponente: `WhyWeWinSection.tsx`

3 Cards mit den Argumenten:
- **Systematisches Testing** — 60 Flow-Varianten, nicht raten sondern iterieren
- **Nachfrage + Leistung verstanden** — Portal kennt den Klick, Dienstleister kennt den Einsatz
- **Schnelleres Lernen** — Rückkopplung Portal ↔ Operations = schwerer kopierbar

### 3. Neue Komponente: `MarketAttractivenessSection.tsx`

3 Cards:
- **Hoher Kundennutzen** — 200+ Firmen, KI-Rechner, Transparenz in unübersichtlichem Markt
- **Mehrfache Servicebedürfnisse** — Umzug + Räumung + Reinigung = höherer AOV
- **Digitalisierung nicht ausgeschöpft** — 60 Flow-Varianten zeigen Optimierungspotenzial

### 4. Neue Komponente: `UseOfFundsSection.tsx`

Horizontaler Balken-Chart (SVG) mit der 80k-Verteilung:
- 35% / CHF 28k → Kundengewinnung (SEO, Ads, Content)
- 25% / CHF 20k → Produkt & Conversion (Funnel, UX, Tracking)
- 20% / CHF 16k → Operative Delivery (Prozesse, Qualität)
- 10% / CHF 8k → Brand & Trust (Reviews, Cases, Creatives)
- 10% / CHF 8k → Reserve / Working Capital

### 5. Integration in `InvestorenLanding.tsx`

Neue Reihenfolge nach NarrativeMoat:

```text
7. NarrativeMoatSection (Why Now + Flywheel)
8. MarketAttractivenessSection ← NEU
9. WhyWeWinSection ← NEU
10. SEOContentMoatSection
11. FundingRoadmapSection
12. UseOfFundsSection ← NEU
13. FiveRunsMethodologySection
14. WhyInvestSection
15. OverkillVisionSection + USPFrameworkSection
16. InvestorClosingSection (rewritten)
```

## Dateien

| Aktion | Datei |
|--------|-------|
| Create | `src/components/vision/WhyWeWinSection.tsx` |
| Create | `src/components/vision/MarketAttractivenessSection.tsx` |
| Create | `src/components/vision/UseOfFundsSection.tsx` |
| Rewrite | `src/components/vision/InvestorClosingSection.tsx` (Conviction-Text) |
| Edit | `src/pages/InvestorenLanding.tsx` (3 neue Imports + Platzierung) |

## Technisch
- Gleicher Stil: Framer Motion, Badge, Teal/Orange, responsive Cards
- UseOfFunds als horizontaler SVG-Balken mit Segment-Labels (viewBox)
- Alle Texte deutsch, Zahlen konsistent mit 80k-Modell

