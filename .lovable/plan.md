

# /investoren Seite: Komplette Restrukturierung

## Problem
Die Seite zeigt aktuell ~25 Sektionen in einem langen Strom ohne klare Dramaturgie. Doppelte KPI-Blöcke, zu viele gleichartige Karten, Vision und Proof vermischt. Der Investor muss scrollen und hoffen, dass irgendwo die Antwort auf seine 5 Kernfragen kommt.

## Neue Dramaturgie: 5 Beweise in klarer Reihenfolge

```text
1. HERO: "Der Motor ist gebaut. Jetzt finanzieren wir die Inbetriebnahme."
   + 4 Proof-Kacheln (Live | 95% KI | 10 Streams | 553 CHF/90% Marge)

2. WAS BEREITS GEBAUT WURDE (Build Timeline Nov–Mär)
   + Founder Stats Block (130+ Seiten, 26 Städte, 2'903h, 60 Funnels)

3. WIRTSCHAFTLICH ATTRAKTIV (3-Layer System + Unit Economics)
   - 3-Layer Map: Capture → Transaction → Expansion
   - Revenue Waterfall (bereits vorhanden)
   - Unit Economics (bereits vorhanden, konsolidiert)

4. SKALIERBAR + SCHWER KOPIERBAR
   - Growth Flywheel (neue SVG)
   - SEO/Content Moat (bestehend)
   - Narrative Moat Block (neu: "Das Projekt IST das PR-Asset")
   - "Why Now?" Block (fragmentierter Markt + KI-Timing)

5. KAPITAL REDUZIERT RISIKEN
   - Funding Timeline (Phase 0–3, bestehend, Zahlen beibehalten: 80k)
   - 5 KPI-Ebenen pro Tranche
   - Kill-Switch / 5-Runs Methodik (bestehend)

6. OVERKILL (expandable)
   - OverkillVisionSection mit neuen 50 USPs aus Dokument
   - USPFrameworkSection (bereits umgeschrieben)

7. CLOSING
   - InvestorClosingSection (Giuseppe-Brief)
```

## Konkrete Änderungen

### A. Neue Komponenten (3 Dateien)

| Datei | Inhalt |
|-------|--------|
| `BuildTimelineSection.tsx` | SVG-Timeline Nov 2025–Mär 2026 mit 5 Monatspunkten + Founder-Stats-Block |
| `ThreeLayerSystemMap.tsx` | SVG: Capture/Transaction/Expansion als 3 Ebenen statt 10 Einzelkarten |
| `NarrativeMoatSection.tsx` | "Why Now?" + "Narrative Moat" + Growth Flywheel SVG |

### B. InvestorenLanding.tsx — Sektionen neu ordnen + entdoppeln

**Entfernt/konsolidiert:**
- `VisionQuickStats` + `VisionLiveStats` → zusammenführen in Hero-Proof-Block
- `VisionVisualDivider` (3x) → auf 1 reduzieren
- `Vision10PillarSection` → ersetzt durch ThreeLayerSystemMap (10 Säulen bleiben in /vision)
- `MarketDeepDiveSection` → in NarrativeMoat integriert
- `ReloOSJourneySection` + `ReloOSFeaturesGrid` → nach /vision verschieben (zu detailliert für Pitch)

**Neue Reihenfolge:**
1. Hero (VisionEmotionalHero — neuer Subtitle)
2. 4 Proof-Kacheln (konsolidiert aus QuickStats/LiveStats)
3. BuildTimelineSection (neu)
4. ThreeLayerSystemMap (neu)
5. RevenueStreamExamples + UnitEconomicsDetailed + ModularerWarenkorbSection
6. NarrativeMoatSection (neu: Flywheel + Why Now + Narrative Moat)
7. SEOContentMoatSection
8. FundingRoadmapSection (bestehend, 80k bleibt)
9. FiveRunsMethodologySection
10. WhyInvestSection (50 Gründe)
11. OverkillVisionSection + USPFrameworkSection
12. InvestorClosingSection

### C. OverkillVisionSection — 50 USPs aus Dokument

Die bestehenden 50 USPs werden mit den spezifischen aus dem Dokument ersetzt:

**Tier 1 (15 Sci-Fi):** Holographic 3D Preview, Agentic AI Concierge, ETF-Kautions-Investment, Blockchain Digital Twin, Exoskelette, IoT Smart Boxes, Drone Inspection, Dynamic Pricing, eUmzugCH API, Smart Lock Biometric, Move Now Pay Later, Carbon-Neutral Routing, AI Video Inventory, Humanoid Robots, Tax Optimizer

**Tier 2 (20 Prozess):** 1-Click Utility Switcher, Predictive Cleaning AI, B2B Reverse Auction, Fleet GPS, Zero-Waste Eco Boxes, AI-Translated Expat, B2B Micro-Loans, Instant Claim Settlement, Trust Score Blockchain, AI Lead Scoring, Social Network Sync, Pet-Relocation, Enterprise Expat Dashboard, Smart Packing AI, Fractional Booking, RFID No-Box-Left-Behind, Wi-Fi Scanner, Cleaning Livestream, Smart Home Pre-Conditioning, Plant Survival AI

**Tier 3 (15 Detail-Liebe):** First-Night Kit, Waste Calendar, Lift Reservation Bot, Twint Tipping, Schulanmeldung, Gym Canceller, Sun Simulator, Color Psychology, Parking Permit, Fridge Chef AI, First-Aid Videos, Weather Alerts, Spotify Welcome Home, Gamification Dashboard, Relocation GPT

### D. VisionEmotionalHero — Neuer Investor-Subtitle

Aktueller Text wird ersetzt durch:
> "Wir haben den Motor bereits gebaut. Jetzt finanzieren wir nicht mehr die Idee, sondern die kontrollierte Inbetriebnahme bis zur Selbsttragfähigkeit."

## Dateien-Übersicht

| Aktion | Datei |
|--------|-------|
| Create | `src/components/vision/BuildTimelineSection.tsx` |
| Create | `src/components/vision/ThreeLayerSystemMap.tsx` |
| Create | `src/components/vision/NarrativeMoatSection.tsx` |
| Rewrite | `src/components/vision/OverkillVisionSection.tsx` |
| Rewrite | `src/pages/InvestorenLanding.tsx` (Sektionsreihenfolge + Imports) |
| Edit | `src/components/vision/VisionEmotionalHero.tsx` (neuer Subtitle) |

## Technisch
- SVG + Framer Motion (wie alle bestehenden Infographics)
- Brand-Farben: Teal #008080, Orange #FF6B1A
- Responsive via viewBox
- Persona-Logik bleibt erhalten (VIP Banner, FunInterruptCards)

