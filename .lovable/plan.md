
# Cherry-Pick Implementation Plan

## Übersicht

Basierend auf der Konsolidierung werden **3 neue Komponenten** gebaut und **3 bestehende optimiert**.

---

## Teil 1: Neue Komponenten (3 Stück)

### 1.1 TrustScoreWidget.tsx

**Beschreibung:** Ein visuelles Widget mit einem SVG-Ring-Chart, das einen Trust-Score von 94/100 anzeigt, plus 4 Kategorie-Fortschrittsbalken.

**Technische Umsetzung:**
- SVG-Kreis mit stroke-dasharray für den gefüllten Bereich
- Framer Motion für Entrance-Animation
- 4 horizontale Progress-Bars mit Labels

**Daten (statisch):**
- Transparenz: 23/25 (92%)
- Partnerschaften: 25/25 (100%)
- Bewertungen: 24/25 (96%)
- Datensicherheit: 22/25 (88%)
- Gesamtscore: 94/100

**Layout:**
- Desktop: Ring links, Kategorien rechts (horizontal)
- Mobile: Ring oben, Kategorien darunter (vertikal)

**Neuer Code:**
```
Datei: src/components/homepage/TrustScoreWidget.tsx
- SVG Ring (120px, stroke-width 10)
- Ring-Fill Animation bei Scroll-Into-View
- 4 Kategorie-Bars mit Progress-Animation
- Responsive Layout (flex-col auf Mobile, flex-row auf Desktop)
```

**Platzierung:** Nach Testimonials-Section, vor FAQ

---

### 1.2 CityPricesSection.tsx

**Beschreibung:** Interaktive Sektion mit Stadt-Selector und dynamischen Preis-Stats.

**Technische Umsetzung:**
- 6 Stadt-Pills als Tab-Navigation
- Stats-Card mit 3 Spalten (Preis, Firmen, Ersparnis)
- React State für aktive Stadt
- Instant Update bei Klick (kein Reload)

**Daten:**
| Stadt | Preis | Firmen | Ersparnis |
|-------|-------|--------|-----------|
| Zürich | CHF 1'400 | 48 | 32% |
| Bern | CHF 1'100 | 36 | 29% |
| Basel | CHF 1'200 | 29 | 31% |
| Genf | CHF 1'600 | 22 | 28% |
| Luzern | CHF 950 | 18 | 34% |
| St. Gallen | CHF 880 | 14 | 33% |

**Layout:**
- Headline zentriert
- Stadt-Pills: flex-wrap, justify-center
- Stats-Card: 3 Spalten auf Desktop, gestapelt auf Mobile
- CTA-Button: "Angebote in [Stadt] vergleichen"

**Neuer Code:**
```
Datei: src/components/homepage/CityPricesSection.tsx
- useState für selectedCity
- Scroll-Entrance Animation (Intersection Observer)
- Dynamischer CTA-Text mit Stadt-Name
```

**Platzierung:** Nach Testimonials oder TrustScoreWidget

---

### 1.3 ExitIntentMobileSheet.tsx

**Beschreibung:** Mobile-only Bottom-Sheet, das bei schnellem Scroll-Up erscheint.

**Technische Umsetzung:**
- Trigger: scrollY > 300px + scroll-velocity > 100px in < 500ms
- Vaul Bottom-Sheet (bereits installiert)
- Einmal pro Session (sessionStorage)
- Random Testimonial aus Pool

**Trigger-Logik:**
```typescript
// Scroll-Velocity Detection
let lastScrollY = 0;
let lastTime = Date.now();

const handleScroll = () => {
  const currentY = window.scrollY;
  const currentTime = Date.now();
  const velocity = (lastScrollY - currentY) / (currentTime - lastTime) * 1000;
  
  if (currentY > 300 && velocity > 200 && !hasTriggered) {
    setIsOpen(true);
    setHasTriggered(true);
    sessionStorage.setItem('exit_mobile_shown', 'true');
  }
  
  lastScrollY = currentY;
  lastTime = currentTime;
};
```

**Inhalt:**
- "Noch nicht sicher?" - Headline
- Random Testimonial (kompakt)
- "Jetzt kostenlos vergleichen" - CTA
- X-Button zum Schliessen

**Neuer Code:**
```
Datei: src/components/ExitIntentMobileSheet.tsx
- Vaul Sheet-Komponente
- useScrollVelocity Custom Hook
- Mobile-only (hidden md:hidden)
```

**Platzierung:** In Index.tsx als globaler Wrapper

---

## Teil 2: Optimierungen bestehender Komponenten

### 2.1 SocialProofTicker - Inline-Variante hinzufügen

**Aktueller Stand:** Popup-Benachrichtigungen unten links

**Erweiterung:** Zusätzliche inline Ticker-Variante als Section

**Änderungen:**
```
Datei: src/components/homepage/LiveActivityBanner.tsx (existiert bereits!)
- Review und ggf. Design-Update
- Nachrichten-Pool erweitern mit Ersparnis-Daten
```

Bemerkung: `LiveActivityBanner.tsx` existiert bereits und macht genau das. Nur Review nötig.

---

### 2.2 SavingsCalculator - Design-Update

**Aktueller Stand:** `PremiumSavingsCalculator.tsx` mit Sliders

**Erweiterung:** Zusätzliche Variante mit 3 Grossen-Pills (Klein/Mittel/Gross)

**Änderungen:**
```
Datei: src/components/homepage/SavingsCalculatorSimple.tsx (NEU)
- 3 Pills statt 2 Sliders für schnellere Interaktion
- Grössere Ersparnis-Anzeige in Grün
- Strikethrough für Originalpreis
```

**Daten (wie im Prompt):**
- Klein (1-2 Zi): CHF 1'200 → CHF 840 (30%)
- Mittel (3-4 Zi): CHF 1'800 → CHF 1'260 (30%)
- Gross (5+ Zi): CHF 2'800 → CHF 1'960 (30%)

---

### 2.3 Georgia Typography - CSS-Variable

**Aktueller Stand:** Georgia nur für NZZ-Logo

**Erweiterung:** Optionale CSS-Variable für Headlines

**Änderungen:**
```css
/* In src/index.css oder tailwind.config */
:root {
  --font-headline: Georgia, serif;
}

/* Neue Utility-Klasse */
.font-headline {
  font-family: var(--font-headline);
}
```

Bemerkung: Nicht global erzwingen, sondern als Option für A/B-Testing bereitstellen.

---

## Teil 3: Implementierungs-Reihenfolge

### Phase 1: Neue Komponenten (Priorität Hoch)
1. `TrustScoreWidget.tsx` - 2-3 Stunden
2. `CityPricesSection.tsx` - 2-3 Stunden  
3. `ExitIntentMobileSheet.tsx` - 2 Stunden

### Phase 2: Optimierungen (Priorität Mittel)
4. `SavingsCalculatorSimple.tsx` - 1-2 Stunden
5. Typography CSS-Variable - 30 Minuten

### Phase 3: Integration (Priorität Niedrig)
6. Komponenten in `Index.tsx` einbinden
7. A/B-Test-Varianten erstellen

---

## Teil 4: Was NICHT gemacht wird

### MockComparisonPreview
- **Grund:** `PremiumCompanyComparison.tsx` und `CompanyComparisonTable.tsx` existieren bereits
- **Aktion:** Keine neue Komponente, bestehende bei Bedarf stylen

### Kompletter Rebuild
- **Grund:** Würde AI Video Calculator und A/B-Testing zerstören
- **Aktion:** Cherry-Pick Ansatz stattdessen

---

## Zusammenfassung

| Komponente | Aktion | Aufwand | Status |
|------------|--------|---------|--------|
| TrustScoreWidget | Neu bauen | 2-3h | ✅ Fertig |
| CityPricesSection | Neu bauen | 2-3h | ✅ Fertig |
| ExitIntentMobileSheet | Neu bauen | 2h | ✅ Fertig |
| SavingsCalculatorSimple | Variante erstellen | 1-2h | ✅ Fertig |
| Georgia Typography | CSS-Variable | 30min | ✅ Fertig |
| LiveActivityBanner | Review (existiert) | 30min | ⏸️ Bereits vorhanden |

**Gesamtaufwand:** ca. 8-12 Stunden

Dieser Plan fügt die wertvollen UI-Ideen aus dem Rebuild-Prompt hinzu, **ohne** die bestehende Infrastruktur (A/B-Testing, AI Video Calculator, dynamische Daten) zu zerstören.

---

## Implementierte Dateien

- `src/components/homepage/TrustScoreWidget.tsx` - SVG Ring-Chart 94/100
- `src/components/homepage/CityPricesSection.tsx` - Stadt-Selector mit Preis-Stats
- `src/components/homepage/SavingsCalculatorSimple.tsx` - 3-Pills Sparrechner
- `src/components/ExitIntentMobileSheet.tsx` - Mobile Bottom-Sheet bei Scroll-Up
- `src/index.css` - `--font-headline: Georgia` Variable hinzugefügt

## Nächste Schritte

Die Komponenten sind erstellt und exportiert. Um sie zu nutzen:

```tsx
// In Index.tsx oder anderen Seiten:
import { TrustScoreWidget, CityPricesSection, SavingsCalculatorSimple } from "@/components/homepage";
import { ExitIntentMobileSheet } from "@/components/ExitIntentMobileSheet";

// Für Georgia Headlines (optional):
<h1 className="font-headline">Swiss Banking Style</h1>
```
