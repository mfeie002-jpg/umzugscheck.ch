# Cleanup-Roadmap – Umzugscheck.ch

> **Ziel:** Duplikate entfernen, Struktur vereinheitlichen, Dead Code eliminieren

---

## 🟢 ERLEDIGT – Homepage-Varianten

### 1. Homepage-Varianten ✅
**Status:** Analysiert und bereinigt

**Aktive Routes (für A/B Testing):**
```
/           → IndexPremium.tsx (LIVE Hauptseite)
/old-home   → Index.tsx
/v2         → HomeOptimized.tsx
/v3         → NewIndex.tsx
/v4         → HomePage.tsx
/landing    → LandingPage.tsx
```

**Gelöschte Dead Code Dateien:**
- [x] `IndexRedesign.tsx` (nicht importiert)
- [x] `PremiumHomepage.tsx` (nicht importiert)
- [x] `CompanyDetail.tsx` (nicht importiert)

**Screenshot-Variante (für Capture-System):**
- `IndexPremiumScreenshot.tsx` (verwendet von Index.tsx + IndexPremium.tsx)

### 2. Umzugsofferten-Funnels ✅
**Status:** Architektur für A/B Testing - BLEIBT

Die Varianten sind gewollt für systematisches A/B Testing:
- `Umzugsofferten.tsx` - Haupt-Funnel
- `UmzugsoffertenBaseline.tsx` - Baseline für Vergleiche
- `UmzugsoffertenV1.tsx` → Redirect zu V1a
- `UmzugsoffertenV1a.tsx`, `V1b.tsx`, `V2a.tsx` - Test-Varianten
- `UmzugsoffertenVariant.tsx` - Dynamische Variante

**Hinweis:** Konsolidierung würde A/B Testing-Fähigkeiten zerstören.

### 3. Komponenten-Ordner ✅
**Status:** Analysiert - Funnel-Varianten sind für A/B Testing

Diese Ordner unterstützen das A/B Testing System:
```
src/components/
├── funnel-v1/         # A/B Varianten
├── funnel-v1b/
├── swissmove-v7/      # Aktiv in UmzugsoffertenVariant
├── decisionfree-v8/   # Aktiv
├── zerofriction-v9/   # Aktiv
└── ...
```

**Hinweis:** Werden von `useFlowVersion` dynamisch geladen.

---

## 🟡 MITTEL – Diese Woche

### 4. Doppelte Feature-Komponenten
```
src/components/
├── FAQAccordion.tsx      # Einfaches FAQ mit Schema.org ✅ (bleibt - 51 Verwendungen)
├── FAQSearch.tsx         # FAQ mit Suchfunktion ✅ (bleibt - 1 Verwendung)
├── reviews/              # Konsolidiert ✅
│   ├── ReviewSubmissionForm.tsx (verschoben aus review/)
│   ├── ReviewForm.tsx
│   ├── ReviewCard.tsx
│   └── ...
```

**Status:**
- [x] Merge `review/` und `reviews/` Ordner → ReviewSubmissionForm verschoben
- [x] FAQ-Komponenten analysiert → verschiedene Zwecke, bleiben getrennt
- [ ] Organisiere nach Feature-Domäne

### 5. Preisrechner-Komponenten
```
src/components/
├── calculator/
├── calculator-variants/
├── QuickCalculator.tsx
├── QuickQuoteCalculator.tsx
├── InstantPriceEstimator.tsx
├── MovingCostCalculatorMini.tsx
```

**Aktion:**
- [ ] Alle in `calculator/` vereinen
- [ ] Gemeinsame Logik extrahieren

---

## 🟢 NICE-TO-HAVE – Nächste Woche

### 6. Lose Komponenten organisieren
~180 Komponenten in `/components` Root sollten in thematische Ordner:

| Kategorie | Komponenten |
|-----------|-------------|
| `pricing/` | PriceHeatMap, PriceHistoryChart, PricingBox, etc. |
| `checklist/` | MovingChecklist, SmartMovingChecklist, DocumentChecklist |
| `location/` | CantonComparison, SwitzerlandMap, NeighborhoodInsights |
| `notifications/` | NotificationCenter, PushNotificationPrompt, PriceAlerts |
| `social/` | SocialShareButtons, SocialProofMetrics |

### 7. Service-Seiten konsolidieren
```
src/pages/
├── services/
├── services-v2/
```
→ Merge zu einem Ordner

---

## 📊 Metriken

| Metrik | Vorher | Nachher |
|--------|--------|---------|
| Homepage-Varianten | 10+ | 6 (4 aktiv + 2 Screenshot) ✅ |
| Dead Code Pages | 3+ | 0 ✅ |
| Funnel-Varianten | 8+ | 8 (A/B Testing aktiv) |
| index.css Zeilen | 1450 | ~650 ✅ |
| Counter-Komponenten | 6 | 1 ✅ |
| Rating-Komponenten | 4 | 1 ✅ |
| Review-Ordner | 2 | 1 ✅ |

---

## ⚡ Quick Wins (Sofort machbar)

1. [x] Design System konsolidieren (index.css)
2. [x] AnimatedCounter konsolidiert (6→1 Datei)
3. [x] RatingStars konsolidiert (4→1 Datei)
4. [x] Ungenutzte homepage/AnimatedCounter.tsx gelöscht
5. [ ] Dead Routes aus Router entfernen
6. [x] Duplicate Keyframes entfernen
7. [x] Gemini-Button hinzugefügt

---

## 🔧 Admin Tools.tsx Refactoring Plan

**Status:** 3349 Zeilen - Kritisch für Wartbarkeit

### Struktur-Analyse:
| Zeilen | Inhalt |
|--------|--------|
| 1-99 | Imports, Types, Interfaces |
| 100-500 | Helper functions, Constants |
| 500-900 | Auto-analyze, URL discovery logic |
| 900-2500 | Inline Edge Function templates (Strings) |
| 2500-3349 | UI Components (Tabs, Cards) |

### Empfohlene Extraktion:
1. `AIWebsiteAnalyzer.tsx` - Auto-analyze + runAutoAnalyze logic
2. `ProjectConfigPanel.tsx` - Config state + auto-fill
3. `ManualPackageExport.tsx` - ZIP generation logic
4. `EdgeFunctionTemplates.ts` - Alle inline function strings als Konstanten
5. `UrlDiscoveryPanel.tsx` - Firecrawl URL discovery

### Priorität:
- [ ] Edge Function Strings auslagern (einfachste Änderung, größte Impact)
- [ ] Auto-analyze in eigene Komponente
- [ ] UI-Tabs in Sub-Komponenten splitten

---

*Letzte Aktualisierung: 27. Dezember 2024*
