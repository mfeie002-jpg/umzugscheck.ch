

# USP Framework auf Umzugscheck anpassen

## Analyse: Was existiert vs. was im Dokument steht

**Bereits eingebaut und aktuell:**
- TwoPillarModel (Zwei-Säulen SVG) ✅
- FundingRoadmapSection (3 Tranchen) ✅
- GrowthPRStrategySection ✅
- InvestorClosingSection (Giuseppe-Brief) ✅
- OverkillVisionSection (50 Tech-USPs) ✅

**Das Problem:** Die `USPFrameworkSection` enthält 50 **generische SaaS-USPs** (AR Workspaces, Haptic Collaboration, Mental Health Dashboard etc.), die **nichts mit Umzugscheck zu tun haben**. Das Dokument liefert 10 plattformspezifische "Whoa"-USPs, die deutlich stärker sind:

| # | Generisch (aktuell) | Umzugscheck-spezifisch (Dokument) |
|---|---------------------|-----------------------------------|
| 1 | AR Spatial Workspaces | LIDAR AI View Scan |
| 2 | Haptic Collaboration | Smart Escrow (Treuhand) |
| 3 | Neurologische Sentiment-Analyse | Dynamic Pricing Engine |
| 4 | Video-Repurposing-Engine | Swiss Handover Protocol |
| 5 | NFC Cloud Bridge | Quality-Weighted Bidding |

## Was gemacht wird

**Die USPFrameworkSection mit umzugsspezifischen USPs ersetzen.** Die 3-Tier-Struktur (Whoa/Core/Foundation) bleibt, aber der Inhalt wird auf die Plattform zugeschnitten:

### Tier 1 — "Whoa" (10 USPs, grosse Cards)
Die 10 aus dem Dokument: Hyper-Adaptive KI, LIDAR AI View Scan, Smart Escrow, Dynamic Pricing Engine, Prädiktive Auto-Workflows, Zero-UI Experience, Quality-Weighted Bidding, Swiss Handover Protocol, Fixkosten-Eliminierung, NFC Cloud Bridge.

### Tier 2 — "Core" (20 USPs)
Angepasst auf Umzugscheck-Kontext: WhatsApp Commerce, Cherry/Chaff Sorting, Multi-Brand Routing, KI-Content-Pipeline, 2'110 Gemeinden SEO, Modularer Warenkorb (Cross-Selling), Echtzeit-Verfügbarkeit, etc.

### Tier 3 — "Foundation" (20 USPs)
Schweiz-spezifisch: OR Art. 14 Compliance, Datenschutz DSG, Transparente Preise, Abnahmegarantie, Schweizer Hosting, Mobile-First, etc.

## Dateien

| Aktion | Datei |
|--------|-------|
| Rewrite | `src/components/vision/USPFrameworkSection.tsx` — alle 50 USPs umzugsspezifisch |

## Technisch
- Gleiche 3-Tier Card-Struktur bleibt (expandable Tiers 2+3)
- Gleiche Icons/Badges/Animationen
- Nur der Inhalt wird von generisch auf plattformspezifisch umgeschrieben

