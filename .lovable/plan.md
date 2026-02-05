
# Phase 2: Mobile UX-Verfeinerungen

## Ziel
Optimierung der Hero-Form-Interaktion auf Mobile: Schnellere Auswahl, weniger Klicks, bessere Validierung.

---

## Änderungen im Überblick

| Nr | Feature | Datei | Aufwand |
|----|---------|-------|---------|
| 2.1 | Inline Form-Validierung | `HeroVariantOriginal.tsx` | 30 min |
| 2.2 | Apartment Size Chips (Mobile) | `ApartmentSizeChips.tsx` (NEU) + Hero | 45 min |
| 2.3 | PLZ Autocomplete verbessern | `HeroVariantOriginal.tsx` | 30 min |
| 2.4 | "Rechner"-Link als Button | `HeroVariantOriginal.tsx` | 15 min |
| 2.5 | CTA-Button Optimierung | `HeroVariantOriginal.tsx` | 15 min |

**Gesamt: ~2-2.5 Stunden**

---

## 2.1 Inline Form-Validierung (Integration)

**Aktuell**: Keine Echtzeit-Validierung im Hero-Formular

**Änderung**: Integration der bestehenden `FormValidation.tsx` Hooks

```text
VORHER:                          NACHHER:
┌─────────────────────┐          ┌─────────────────────┐
│ Von (PLZ oder Ort) *│          │ Von (PLZ oder Ort) *│
│ [________________] │          │ [8001 Zürich_____]✓ │
│                     │          │ ✓ Gültige PLZ       │
└─────────────────────┘          └─────────────────────┘

┌─────────────────────┐          ┌─────────────────────┐
│ Von (PLZ oder Ort) *│          │ Von (PLZ oder Ort) *│
│ [abc______________] │          │ [abc______________]!│
│                     │          │ ⚠ Bitte gültige PLZ │
└─────────────────────┘          └─────────────────────┘
```

**Technisch**:
- Import `useFieldValidation`, `validationRules`, `ValidationFeedback` aus `FormValidation.tsx`
- Validierung bei `onBlur` für Von/Nach-Felder
- Grünes Häkchen bei gültiger PLZ (4 Ziffern oder erkannter Ort)
- Rotes Warnsymbol bei ungültiger Eingabe

---

## 2.2 Apartment Size Chips (Mobile-Optimiert)

**Problem**: Dropdown erfordert 2 Klicks (öffnen + auswählen)

**Lösung**: Horizontale Chips statt Dropdown auf Mobile

```text
VORHER (Dropdown):
┌─────────────────────────────────────┐
│ Wohnungsgrösse *        Rechner →   │
│ [Wählen Sie...               ▼]     │
└─────────────────────────────────────┘
  → Klick → Modal öffnet → Scrollen → Auswählen

NACHHER (Chips):
┌─────────────────────────────────────┐
│ Wohnungsgrösse *        [🧮 Rechner]│
│                                     │
│ [1] [1.5] [2] [2.5] [3] [3.5+] →   │ ← Horizontaler Scroll
└─────────────────────────────────────┘
  → 1 Tap = Fertig
```

**Neue Komponente**: `src/components/homepage/ApartmentSizeChips.tsx`

```tsx
// Kompakte Chips für Hero-Integration
const sizes = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5+'];

// Features:
// - Horizontaler Scroll auf Mobile
// - Touch-optimiert (min 44px Höhe)
// - Visuelle Selektion (Primary-Farbe)
// - Pulsierender Hinweis wenn nichts ausgewählt
```

**Integration**:
- Im Hero: Chips auf Mobile anzeigen (< 768px)
- Dropdown als Fallback auf Desktop behalten (oder Chips für beide)
- Bestehendes `VisualRoomSelector` Pattern als Referenz

---

## 2.3 PLZ Autocomplete verbessern

**Aktuell**: Native `<datalist>` mit PLZ-Daten

**Verbesserungen**:
1. **Geolocation-Button** im "Von"-Feld
2. **Besseres Feedback** bei Eingabe (Kanton anzeigen)
3. **Optimierte Filterlogik** für schnellere Ergebnisse

```text
Von (PLZ oder Ort) *
┌─────────────────────────────────┐
│ [Zürich___________] [📍 Standort]│ ← NEU: Location Button
└─────────────────────────────────┘
✓ 8001 Zürich (ZH) erkannt          ← Feedback mit Kanton
```

**Technisch**:
- Nutze bestehenden `useGeolocation` Hook
- Reverse Geocoding: Koordinaten → nächste PLZ
- Validierung gegen `swissPostalCodes` Array

---

## 2.4 "Rechner"-Link visuell verstärken

**Aktuell**: Kleiner blauer Text-Link "Rechner →"

**Problem**: Zu klein für Fat-Finger, wird übersehen

**Lösung**: Als Mini-Button mit Icon gestalten

```text
VORHER:                          NACHHER:
Wohnungsgrösse *    Rechner →    Wohnungsgrösse *   [🧮 Rechner]
                                                         ↑
                                              Button-Styling, klarer
```

**Technisch**:
- `Button` Komponente mit `variant="ghost"` und `size="sm"`
- Calculator Icon (`Calculator` von lucide-react)
- Tooltip: "Unsicher? Berechne deine Zimmerzahl"

---

## 2.5 CTA-Button Wording optimieren

**Aktuell**: "Jetzt checken lassen"

**Optimierungen**:
1. Subline hinzufügen: "Kostenlos & unverbindlich"
2. Alternative Texte vorbereiten für A/B Tests

```text
VORHER:
┌─────────────────────────────────┐
│    Jetzt checken lassen  →      │
└─────────────────────────────────┘

NACHHER:
┌─────────────────────────────────┐
│    Jetzt checken lassen  →      │
│    Kostenlos & unverbindlich    │ ← Subline
└─────────────────────────────────┘

ODER (A/B Variante):
┌─────────────────────────────────┐
│    Offerten anzeigen  →         │
│    100% kostenlos               │
└─────────────────────────────────┘
```

---

## Dateiänderungen

| Datei | Änderung |
|-------|----------|
| `src/components/homepage/ApartmentSizeChips.tsx` | **NEU** - Horizontale Chip-Auswahl für Zimmer |
| `src/components/homepage/HeroVariantOriginal.tsx` | Inline-Validierung, Chips-Integration, Location-Button, Rechner-Button, CTA-Subline |

---

## Implementierungs-Reihenfolge

```text
1. ApartmentSizeChips.tsx erstellen (neue Komponente)
2. HeroVariantOriginal.tsx aktualisieren:
   a) Form-Validierung integrieren (useFieldValidation)
   b) Geolocation-Button im "Von"-Feld
   c) Dropdown durch Chips ersetzen (Mobile)
   d) Rechner-Link als Button
   e) CTA-Button mit Subline
```

---

## Erwartete Ergebnisse

| Metrik | Vor | Nach (erwartet) |
|--------|-----|-----------------|
| Klicks bis Form-Submit | 5+ | 3-4 |
| Form-Abandonment Mobile | Baseline | -15-20% |
| Wohnungsgrösse Selektion | 2 Klicks | 1 Tap |
| Fehler bei PLZ-Eingabe | Unbekannt | Sofortige Korrektur |
