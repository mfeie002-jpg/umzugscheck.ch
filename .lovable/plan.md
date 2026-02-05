
# Plan: Logos korrigieren - Hero-Form + Swiss Infrastructure Section

## Problem-Analyse

Basierend auf den Screenshots gibt es zwei Logo-Bereiche:

### 1. Hero-Form Card (PARTNER & ZERTIFIZIERUNGEN)
- **Aktuell**: 4 Logos werden als TEXT angezeigt (eUmzugCH, DIE POST, ASTAG, +)
- **Soll**: Echte PNG-Logos wie im vorherigen Zustand
- **Pfade in KnownFromRow**: `/logos/eumzugch.png`, `/logos/post-logo.png`, `/logos/astag-logo.png`, `/logos/swiss-made.png`
- **Status**: Dateien existieren → sollten funktionieren

### 2. Swiss Infrastructure Section (nach Hero)
- **Aktuell**: 4 Cards mit "eumzugch.svg fehlt", "die-post.svg fehlt" etc.
- **Ursache**: SVG-Dateien in `/logos/trust/` sind leer oder fehlerhaft
- **Lösung**: PNG-Logos verwenden statt SVGs

---

## Umsetzungsplan

### Schritt 1: TrustRibbonVariantG - PNG statt SVG

Die Datei `src/components/trust/TrustRibbonVariantG.tsx` anpassen:

**Vorher:**
```typescript
const infrastructurePartners = [
  { id: "eumzugch", logo: "/logos/trust/eumzugch.svg", ... },
  { id: "post", logo: "/logos/trust/die-post.svg", ... },
  { id: "astag", logo: "/logos/trust/astag.svg", ... },
  { id: "swissmade", logo: "/logos/trust/swiss-label.svg", ... },
];
```

**Nachher (PNG-Pfade aus public/logos):**
```typescript
const infrastructurePartners = [
  { id: "eumzugch", logo: "/logos/eumzugch.png", ... },
  { id: "post", logo: "/logos/post-logo.png", ... },
  { id: "astag", logo: "/logos/astag-logo.png", ... },
  { id: "swissmade", logo: "/logos/swiss-made.png", ... },
];
```

### Schritt 2: Prüfen ob Hero-Form Logos korrekt angezeigt werden

Die KnownFromRow-Komponente verwendet bereits die korrekten PNG-Pfade:
- `/logos/eumzugch.png` ✓
- `/logos/post-logo.png` ✓
- `/logos/astag-logo.png` ✓
- `/logos/swiss-made.png` ✓

Falls Logos trotzdem nicht erscheinen → Bildpfade oder onError-Handler prüfen.

---

## Zu ändernde Dateien

| Datei | Änderung |
|-------|----------|
| `src/components/trust/TrustRibbonVariantG.tsx` | Logo-Pfade von SVG auf PNG umstellen |

## Erwartetes Ergebnis

1. **Hero-Form**: 4 echte Partner-Logos (eUmzugCH, Die Post, ASTAG, Swiss Made) mit grayscale Hover-Effekt
2. **Swiss Infrastructure Section**: 4 Cards mit sichtbaren PNG-Logos statt "fehlt"-Meldungen
