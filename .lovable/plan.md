

## 🔧 Fix: Doppelte Navigation CTAs entfernen

### Problem
In der Navigation `NavigationV16.tsx` werden auf großen Bildschirmen (≥1280px) **zwei CTA-Buttons** gleichzeitig angezeigt:
- "Offerten erhalten" (voller CTA)
- "Offerte" (kurzer CTA)

### Ursache
Der Code hat zwei separate CTA-Buttons:

```text
┌─────────────────────────────────────────────────────────────────┐
│  Zeile 319-326: Button 1 (xl:flex)                              │
│  → Sichtbar ab 1280px (xl Breakpoint)                           │
│  → "Offerten erhalten" mit Icon                                 │
│                                                                 │
│  Zeile 328-334: Button 2 (md:flex)                              │
│  → Sichtbar ab 768px (md Breakpoint) - AUCH auf xl!             │
│  → "Offerte" kurze Version                                      │
└─────────────────────────────────────────────────────────────────┘
```

Der zweite Button fehlt die Klasse `xl:hidden`, daher erscheint er auch auf großen Screens.

### Lösung

**Datei:** `src/components/navigation/NavigationV16.tsx`

**Änderung in Zeile 329:**

Vorher:
```tsx
<Button asChild className="hidden md:flex h-10 px-4 ...">
```

Nachher:
```tsx
<Button asChild className="hidden md:flex xl:hidden h-10 px-4 ...">
```

### Erwartetes Ergebnis

| Viewport | Button 1 (groß) | Button 2 (kurz) |
|----------|-----------------|-----------------|
| < 768px (Mobile) | ❌ | ❌ |
| 768px - 1279px (Tablet/md) | ❌ | ✅ |
| ≥ 1280px (Desktop/xl) | ✅ | ❌ |

### Betroffene Datei
- `src/components/navigation/NavigationV16.tsx` (1 Zeile)

