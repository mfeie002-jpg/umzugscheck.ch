# Cleanup-Roadmap – Umzugscheck.ch

> **Ziel:** Duplikate entfernen, Struktur vereinheitlichen, Dead Code eliminieren

---

## 🔴 KRITISCH – Sofort angehen

### 1. Homepage-Varianten konsolidieren
**Aktueller Zustand:** 10+ Homepage-Varianten
```
src/pages/
├── Index.tsx              # Aktuelle Haupt-Homepage
├── IndexPremium.tsx       # Premium-Variante
├── IndexPremiumScreenshot.tsx
├── IndexRedesign.tsx
├── NewIndex.tsx
├── HomeOptimized.tsx
├── HomePage.tsx
├── PremiumHomepage.tsx
└── LandingPage.tsx
```

**Aktion:**
- [ ] Identifiziere welche Homepage LIVE ist
- [ ] Merge beste Features in Haupt-Index.tsx
- [ ] Archiviere/Lösche Rest

### 2. Umzugsofferten-Funnels konsolidieren
**Aktueller Zustand:** 8+ Varianten
```
src/pages/
├── Umzugsofferten.tsx
├── UmzugsoffertenBaseline.tsx
├── UmzugsoffertenV1.tsx
├── UmzugsoffertenV1a.tsx
├── UmzugsoffertenV1b.tsx
├── UmzugsoffertenV2a.tsx
├── UmzugsoffertenVariant.tsx
└── OffertenPage.tsx
└── OffertenOptimized.tsx
```

**Aktion:**
- [ ] Identifiziere welcher Funnel LIVE ist
- [ ] Konsolidiere auf 1 Haupt-Funnel mit Feature Flags
- [ ] Archiviere Rest

### 3. Komponenten-Ordner aufräumen
**Aktueller Zustand:** 10+ Funnel-Varianten als Ordner
```
src/components/
├── funnel-v1/
├── funnel-v1b/
├── offerten-v2/
├── premium-v2/
├── swissmove-v7/
├── ultimate-v6/
├── video-first-v4/
├── zerofriction-v9/
├── decisionfree-v8/
├── god-mode-v3/
└── marketplace-v5/
```

**Aktion:**
- [ ] Bestimme welche Variante(n) aktiv sind
- [ ] Extrahiere gemeinsame Komponenten
- [ ] Konsolidiere auf 1-2 Ordner

---

## 🟡 MITTEL – Diese Woche

### 4. Doppelte Feature-Komponenten
```
src/components/
├── FAQ.tsx
├── FAQAccordion.tsx
├── FAQSearch.tsx
├── reviews/              # Ordner
├── review/               # Doppelter Ordner!
├── ReviewHighlights.tsx  # Lose Datei
├── RegionalReviews.tsx   # Lose Datei
```

**Aktion:**
- [ ] Merge `review/` und `reviews/` Ordner
- [ ] Konsolidiere FAQ-Komponenten
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

| Metrik | Vorher | Nachher (Ziel) |
|--------|--------|----------------|
| Homepage-Varianten | 10+ | 1-2 |
| Funnel-Varianten | 8+ | 1-2 |
| Komponenten-Ordner | 40+ | 15-20 |
| Lose Komponenten | 180+ | 30-50 |
| index.css Zeilen | 1450 | ~650 ✅ |

---

## ⚡ Quick Wins (Sofort machbar)

1. [x] Design System konsolidieren (index.css)
2. [ ] Ungenutzte Imports in App.tsx entfernen
3. [ ] Dead Routes aus Router entfernen
4. [ ] Duplicate Keyframes entfernen ✅
5. [ ] Gemini-Button hinzugefügt ✅

---

*Letzte Aktualisierung: Dezember 2024*
