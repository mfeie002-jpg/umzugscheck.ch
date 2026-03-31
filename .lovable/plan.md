

# /investoren Konsolidierung: 20 Sektionen → 8

## Problem

Die Seite hat aktuell 20 einzelne Sektionen mit klaren Doppelungen:
- TwoPillarModel + BusinessCaseOverview → gleiches Thema
- RevenueStreams + UnitEconomics + ModularerWarenkorb → alles Wirtschaftlichkeit
- NarrativeMoat + MarketAttractiveness + WhyWeWin + SEOContentMoat → alles "Warum wir"
- FundingRoadmap + UseOfFunds → beides Kapitalverwendung
- WhyInvest (50 Gründe) + OverkillVision + USPFramework → dreifach Features/Gründe

## Neue Struktur: 8 Sektionen

```text
1. HERO + PROOF-KACHELN (bestehend, zusammenrücken)
2. BUILD TIMELINE (bestehend, bleibt)
3. GESCHÄFTSMODELL (merge: TwoPillarModel + BusinessCase + ThreeLayerSystem)
4. WIRTSCHAFTLICHKEIT (merge: Revenue + UnitEconomics + Warenkorb)
5. WETTBEWERBSVORTEIL (merge: NarrativeMoat + WhyWeWin + MarketAttractiveness + SEOMoat)
6. KAPITAL & ROADMAP (merge: FundingRoadmap + UseOfFunds)
7. RISIKOKONTROLLE (FiveRunsMethodology, bleibt)
8. OVERKILL (merge: WhyInvest + OverkillVision + USPFramework → 1 expandable Sektion)
9. CLOSING (InvestorClosing, bleibt)
```

## Konkrete Änderungen

### A. `InvestorenLanding.tsx` — Sektionen zusammenführen

Statt 20 separate Komponenten werden inhaltlich verwandte Blöcke in gemeinsame `<section>`-Container mit Tabs oder Accordion gruppiert:

**Sektion 3 "Geschäftsmodell"**: TwoPillarModel-SVG oben, darunter die 3 BusinessCase-Cards und das ThreeLayerSystem als Tab oder direkt gestapelt — alles unter einer Headline.

**Sektion 4 "Wirtschaftlichkeit"**: Revenue + UnitEconomics + Warenkorb unter einer Headline mit Tabs (Einnahmen | Margen | Warenkorb).

**Sektion 5 "Wettbewerbsvorteil"**: NarrativeMoat (Flywheel), WhyWeWin (3 Cards), MarketAttractiveness (3 Cards), SEOContentMoat → unter einer Headline, Cards nebeneinander statt als 4 separate full-width Sektionen.

**Sektion 6 "Kapital"**: FundingRoadmap + UseOfFunds in einer Sektion (Timeline oben, Balken-Chart unten).

**Sektion 8 "Overkill"**: WhyInvest + OverkillVision + USPFramework → eine expandable Sektion mit Tabs.

### B. Dateien

| Aktion | Datei |
|--------|-------|
| Rewrite | `src/pages/InvestorenLanding.tsx` — Neue 8-Sektions-Struktur |

Keine neuen Komponenten nötig. Die bestehenden Komponenten werden nur anders gruppiert und unter gemeinsame Überschriften gestellt. Die Einzelkomponenten bleiben unverändert.

## Ergebnis

- Statt 20× scrollen nur noch 8 klare Blöcke
- Keine Inhalte gehen verloren
- Dramaturgie wird klarer: Gebaut → Modell → Zahlen → Vorteil → Kapital → Risiko → Overkill → Abschluss

