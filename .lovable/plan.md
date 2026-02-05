

# Plan: Zusätzlicher Live Social Proof im Hero-Bereich

## Aktuelle Situation (Analyse)

Auf dem Screenshot sehe ich im Hero-Bereich bereits:
- ✅ "Bekannt aus" Logos (SRF, NZZ, Blick)
- ✅ Trust-Badges (Kostenlos, Unverbindlich, Datenschutz)
- ✅ A/B-Varianten Badges unten links (HA, N1, SV7)

Was fehlt: **Lebendige, sich aktualisierende Elemente** die zeigen, dass die Plattform aktiv genutzt wird.

---

## Vorschläge für mehr "Leben"

### 1. **Live Activity Toast/Popup** (unten links, statt der Debug-Badges)
Dezente, sich wechselnde Notifications wie bei Booking.com:

```text
┌──────────────────────────────────┐
│ 🟢 Sandra aus Basel              │
│    hat gerade 3 Offerten erhalten│
│    vor 2 Minuten                 │
└──────────────────────────────────┘
```

**Position**: Unten links im Hero oder Form-Card
**Vorteil**: Zeigt echte Aktivität, ohne aufdringlich zu sein

---

### 2. **Live Counter im Form-Header**
Unterhalb "200+ Firmen vergleichen":

```text
200+ Firmen vergleichen
🟢 47 Personen vergleichen gerade
```

Alternativ:

```text
🟢 128 Offerten heute angefordert
```

**Komponente existiert bereits**: `LiveCounter.tsx` - muss nur integriert werden

---

### 3. **Inline Live-Ticker zwischen Form-Feldern**
Nach dem letzten Feld, vor dem CTA-Button:

```text
[Von-Feld]
[Nach-Feld]  
[Wohnungsgrösse]

───────────────────────────
🟢 Zürich → Bern: CHF 620 gespart vor 5 Min
───────────────────────────

[Jetzt checken lassen →]
```

---

### 4. **"Gerade aktiv" Badge im CTA-Button-Bereich**
Klein, unterhalb des Buttons:

```text
[Jetzt checken lassen →]

🟢 8 andere vergleichen gerade in deiner Region
```

---

## Empfohlene Lösung: Kombination aus #2 + #4

**Minimal-invasiv, maximal effektiv:**

```text
┌─────────────────────────────────────┐
│      🏆 Bester Preis garantiert     │
│                                     │
│   200+ Firmen vergleichen           │
│   🟢 47 Personen vergleichen gerade │ ← NEU
│   ─────────────────────────────     │
│   Von (PLZ oder Ort) *              │
│   [_______________________]         │
│   Nach (PLZ oder Ort) *             │
│   [_______________________]         │
│   Wohnungsgrösse *                  │
│   [_______________________]         │
│                                     │
│   [  🔵 Jetzt checken lassen →  ]   │
│                                     │
│   🟢 Letzte Anfrage vor 2 Min aus   │ ← NEU
│      Zürich                         │
│                                     │
│   ✓ Kostenlos ✓ Unverbindlich       │
└─────────────────────────────────────┘
```

---

## Technische Umsetzung

### Neue Komponente: `HeroLiveActivityLine.tsx`

```tsx
// Kompakte Single-Line Live-Aktivität für Hero-Integration
const activities = [
  { city: "Zürich", action: "vergleicht gerade Preise" },
  { city: "Basel", action: "hat 3 Offerten erhalten" },
  { city: "Bern", action: "hat eine Firma gebucht" },
  // ...
];

// Auto-rotate alle 4-5 Sekunden
// Grüner Pulse-Dot + Text
```

### Integration in `HeroVariantOriginal.tsx`

1. **Im Form-Header** (nach "Wir finden den günstigsten Anbieter"):
   - `<LiveCounter baseValue={45} label="Personen vergleichen gerade" />`

2. **Nach dem CTA-Button** (vor Trust-Badges):
   - `<HeroLiveActivityLine />` - Zeigt rotierende Aktivitäten

---

## Dateien die geändert werden

| Datei | Änderung |
|-------|----------|
| `src/components/homepage/HeroLiveActivityLine.tsx` | NEU - Kompakte Live-Line |
| `src/components/homepage/HeroVariantOriginal.tsx` | Integration der neuen Elemente |

---

## Alternative Optionen (Optional)

Falls du **mehr Dramatik** willst:

- **Floating Toast**: Wie Booking.com, kleine Popup-Bubble unten links
- **Counter Animation**: Zahl tickt live hoch während User schaut
- **Region-Personalisierung**: "12 Personen aus Zürich vergleichen gerade" (mit Geo-IP)

---

## Zusammenfassung

**Empfehlung**: Zwei dezente Live-Elemente hinzufügen:
1. **Header**: "🟢 47 Personen vergleichen gerade"
2. **Nach CTA**: "🟢 Letzte Anfrage vor 2 Min aus Zürich"

Das schafft **Social Proof ohne Ablenkung** vom Hauptziel (Formular ausfüllen).

