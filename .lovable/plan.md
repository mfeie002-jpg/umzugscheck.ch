
# Plan: Integration der Medien-Logos im Hero-Tab

## Übersicht

Die hochgeladenen echten Medien-Logos (SRF, NZZ, 20 Minuten, watson, Mieterverband, newhome) sollen unter dem "Offerte checken lassen"-Button im Hero-Tab integriert werden - als "Bekannt aus & Partner" Block.

## Aktuelle Situation

Die aktuelle Implementierung in `KnownFromRow.tsx` und `media-logos.tsx` verwendet **CSS-basierte Logos** (Text/Badges statt echte Bilder). Die hochgeladenen PNG-Dateien zeigen die offiziellen Markenlogos:

| Marke | Aktuell | Neu |
|-------|---------|-----|
| SRF | CSS-Badge (rot) | Echtes Logo-Bild |
| NZZ | CSS serif text | Echtes Schrift-Logo |
| 20 Minuten | CSS colored text | Neues blaues Logo |
| watson | CSS mit W-Badge | Echtes Logo mit Pink-Strich |
| MV (Mieterverband) | Nicht vorhanden | NEU - grün/blau Logo |
| newhome | CSS + SVG icon | Echtes türkises Logo |

## Empfohlene Bezeichnung

**"Bekannt aus & Partner"** - da die Liste sowohl Medien (SRF, NZZ, 20min, watson) als auch Partnerorganisationen (Mieterverband, newhome) enthält.

---

## Umsetzungsschritte

### Schritt 1: Logo-Assets speichern

Alle hochgeladenen Logos in `public/logos/media/` speichern:

```text
public/logos/media/
├── srf.png           (rotes SRF-Badge)
├── nzz.png           (schwarzes NZZ-Logo)
├── 20min.png         (neues blaues Logo)
├── watson.png        (schwarz mit pink Strich)
├── mieterverband.png (MV mit blau/grün Diamond)
├── newhome.png       (türkis mit Home-Symbol)
```

### Schritt 2: Logo-Konfiguration erweitern

`src/components/trust/media-logos.tsx` um MV ergänzen:

```typescript
export const SWISS_MEDIA_PARTNERS = [
  { name: "SRF", logo: "/logos/media/srf.png", website: "srf.ch" },
  { name: "NZZ", logo: "/logos/media/nzz.png", website: "nzz.ch" },
  { name: "20 Minuten", logo: "/logos/media/20min.png", website: "20min.ch" },
  { name: "Watson", logo: "/logos/media/watson.png", website: "watson.ch" },
  { name: "Mieterverband", logo: "/logos/media/mieterverband.png", website: "mieterverband.ch" },
  { name: "newhome", logo: "/logos/media/newhome.png", website: "newhome.ch" },
];
```

### Schritt 3: Neue Logo-Komponente mit echten Bildern

`ColoredMediaLogo` Component anpassen für echte PNG-Logos:

```tsx
export const RealMediaLogo = memo(({ name, size = "md" }) => {
  const partner = SWISS_MEDIA_PARTNERS.find(p => p.name === name);
  const heights = { sm: "h-4", md: "h-5 sm:h-6", lg: "h-6 sm:h-8" };
  
  if (!partner?.logo) return <span>{name}</span>;
  
  return (
    <img 
      src={partner.logo} 
      alt={partner.name}
      className={`${heights[size]} w-auto object-contain`}
    />
  );
});
```

### Schritt 4: KnownFromRow aktualisieren

`src/components/homepage/KnownFromRow.tsx` anpassen:

1. Label ändern: **"Bekannt aus:"** → **"Bekannt aus & Partner"**
2. Logo-Liste erweitern: MV (Mieterverband) hinzufügen
3. Echte `<img>` Tags statt CSS-Komponenten verwenden
4. Mobile: 4 Logos anzeigen (SRF, NZZ, 20min, watson) + "+2"
5. Desktop: Alle 6 Logos

### Schritt 5: Mobile UX Optimierung

```text
Mobile Layout (390px):
┌────────────────────────────────┐
│  🛡️ Bekannt aus & Partner      │
├────────────────────────────────┤
│  [SRF] [NZZ] [20min] [watson]  │
│           & 2 weitere          │
└────────────────────────────────┘

Desktop Layout:
┌──────────────────────────────────────────────────────────────┐
│  🛡️ Bekannt aus & Partner:                                   │
│  [SRF] [NZZ] [20min] [watson] [MV] [newhome]                │
└──────────────────────────────────────────────────────────────┘
```

---

## Technische Details

### Zu erstellende Dateien
- `public/logos/media/srf.png`
- `public/logos/media/nzz.png`
- `public/logos/media/20min.png`
- `public/logos/media/watson.png`
- `public/logos/media/mieterverband.png`
- `public/logos/media/newhome.png`

### Zu ändernde Dateien
- `src/components/trust/media-logos.tsx` - Partner-Array mit Logo-Pfaden erweitern
- `src/components/homepage/KnownFromRow.tsx` - Echte Logos + MV integrieren

### Logo-Styling
- Grayscale by default: `grayscale opacity-50`
- Hover: `grayscale-0 opacity-100`
- Mobile height: `h-4` bis `h-5`
- Desktop height: `h-5` bis `h-7`
- Max-width: `max-w-[60px]` mobile, `max-w-[80px]` desktop
