# Trust Logo Assets - Official Collection Guide

> **WICHTIG:** Logos dürfen NICHT KI-generiert oder nachgebaut werden. Nur offizielle Assets verwenden!

## Asset-Spezifikationen

| Eigenschaft | Wert |
|-------------|------|
| Format | SVG (bevorzugt), PNG (Fallback) |
| Canvas | 240 × 80 px (Querformat) |
| Hintergrund | Transparent |
| Ausrichtung | Horizontal & vertikal mittig |
| Max. Dateigrösse | 40 KB |
| Keine | Effekte, Schatten, Redesigns |

## Dateinamen-Schema

```
public/logos/trust/
├── trust-swiss-label.svg
├── trust-die-mobiliar.svg
├── trust-raiffeisen.svg
├── trust-zkb.svg
├── trust-astag-schweiz.svg
├── trust-trusted-shops.svg
├── trust-swiss-hosting.svg
├── trust-die-schweizerische-post.svg
├── trust-eumzugch.svg
├── trust-mieterverband-schweiz.svg
└── trust-twint.svg
```

## Offizielle Quellen (Brand/Media Kits)

| Institution | Offizielle Quelle | Asset-Typ | Lizenz |
|-------------|-------------------|-----------|--------|
| Swiss Label | https://www.swisslabel.ch/de/medien | SVG | Lizenzvereinbarung erforderlich |
| Die Mobiliar | https://www.mobiliar.ch/ueber-uns/medien | SVG/PNG | Medien-Nutzung |
| Raiffeisen | https://www.raiffeisen.ch/rch/de/ueber-uns/medien.html | SVG | Brand Guidelines beachten |
| ZKB | https://www.zkb.ch/de/ueber-uns/medien.html | SVG | Medien-Nutzung |
| ASTAG | https://www.astag.ch/de/ueber-uns/medien | PNG | Anfrage erforderlich |
| Trusted Shops | https://www.trustedshops.com/tsdocument/TRUSTED_SHOPS_STYLEGUIDE.pdf | SVG | Partner-Programm |
| Swiss Hosting | https://www.swiss-hosting.ch/ | PNG | Anfrage |
| Die Post | https://www.post.ch/de/ueber-uns/unternehmen/medien | SVG | Medien-Richtlinien |
| eUmzugCH | https://www.eumzug.swiss/ | PNG | Behörden-Anfrage |
| Mieterverband | https://www.mieterverband.ch/mv/politik-positionen/medien.html | PNG | Anfrage |
| TWINT | https://www.twint.ch/partner/ | SVG | Partner-Programm |

## Normalisierungs-Pipeline

### 1. Download
```bash
# Offizielle Assets von Brand-Portalen herunterladen
```

### 2. SVG-Optimierung (SVGO)
```bash
npx svgo -i input.svg -o output.svg --config='{
  "plugins": [
    "removeDoctype",
    "removeXMLProcInst",
    "removeComments",
    "removeMetadata",
    "removeTitle",
    "removeDesc",
    "removeUselessDefs",
    "removeEditorsNSData",
    "removeEmptyAttrs",
    "removeHiddenElems",
    "removeEmptyText",
    "removeEmptyContainers",
    "cleanupEnableBackground",
    "convertStyleToAttrs",
    "convertColors",
    "convertPathData",
    "convertTransform",
    "removeUnknownsAndDefaults",
    "removeNonInheritableGroupAttrs",
    "removeUselessStrokeAndFill",
    "removeUnusedNS",
    "cleanupNumericValues",
    "moveElemsAttrsToGroup",
    "moveGroupAttrsToElems",
    "collapseGroups",
    "removeRasterImages",
    "mergePaths",
    "convertShapeToPath",
    "sortAttrs",
    "removeDimensions"
  ]
}'
```

### 3. PNG-Normalisierung
```bash
# ImageMagick: Auf 240x80 skalieren mit transparentem Hintergrund
convert input.png -resize 240x80 -gravity center -extent 240x80 -background transparent output.png

# Komprimierung
pngquant --quality=65-80 output.png
```

### 4. QA-Checkliste
- [ ] Korrekte Ausrichtung (zentriert)
- [ ] Farben exakt wie Original
- [ ] Dateigrösse < 40 KB
- [ ] Lesbarkeit auf Mobile (min. 24px Höhe)
- [ ] Transparenter Hintergrund
- [ ] Keine Artefakte/Whitespace

## Psychologische Reihenfolge

### Homepage (Conversion-First)
1. Die Mobiliar (Risiko/Versicherung)
2. Die Post (CH-Infrastruktur)
3. eUmzugCH (Behörden)
4. TWINT (Zahlung)
5. ZKB (Finanz-Trust)
6. Raiffeisen (Finanz-Trust)
7. Mieterverband (Konsumentenschutz)
8. Swiss Label (Qualität)
9. ASTAG (Branchen-Authority)
10. Swiss Hosting (Daten-Souveränität)
11. Trusted Shops (E-Commerce)

### Vision-Seite (Authority/Ecosystem)
1. eUmzugCH (Behörden-Integration)
2. Die Post (Infrastruktur)
3. Swiss Hosting (Daten)
4. Die Mobiliar (Insurance)
5. TWINT (Payment)
6. ZKB (Finance)
7. Raiffeisen (Finance)
8. Mieterverband (Consumer)
9. ASTAG (Industry)
10. Swiss Label (Quality)
11. Trusted Shops (E-Commerce)

## Wichtiger Hinweis: Authentizität

Diese Trust-Section funktioniert nur bei **ehrlicher Beziehung** zu den Partnern:

| Beziehungstyp | Label-Empfehlung |
|---------------|------------------|
| Echte Partnerschaft/Vertrag | "Partner" / "Versichert mit" |
| Faktische Nutzung/Kompatibilität | "Zahlung möglich mit TWINT" |
| Weder noch | **Logo weglassen!** |

> "Fake Authority" zerstört Trust und schadet der Conversion.
