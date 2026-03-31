

# Zwei-Säulen-Modell: Web-Sektion + PDF

## Was gebaut wird

1. **Neue SVG-Infografik-Komponente** `TwoPillarModel.tsx` — zeigt das Ökosystem visuell:
   - Links: **Umzugscheck.ch** (Portal/Lead-Engine) mit SEO, KI, 10 Revenue Streams
   - Rechts: **Feierabend Services** (Physischer Dienstleister) mit Services, Premium, A-Z
   - Mitte: **Lead-Flow** mit Cherry/Chaff-Sorting (Kirschen → Feierabend, Spreu → Marktplatz)
   - Unten: **Synergie-Effekt** — Zero CAC, Kostentragung durch Spreu-Einnahmen
   - Alles als selbsterklärende Infografik mit eingebetteten Labels/Zahlen

2. **Integration in InvestorenLanding.tsx** — nach dem Hero/Stats-Block, vor den Business Pillars (ca. nach Sektion 3/4). Neue Sektion mit Badge "Zwei-Säulen-Modell" und Headline.

3. **PDF-Download** — Generiertes 2-Seiten A4 PDF via reportlab:
   - **Seite 1**: Zwei-Säulen Systemgrafik (Umzugscheck ↔ Feierabend)
   - **Seite 2**: Cherry & Chaff Logik, Unit Economics Vergleich, Synergie-Zahlen
   - Download-Button direkt in der Web-Sektion
   - PDF wird als statisches Asset unter `/mnt/documents/` generiert und in `public/` kopiert

## Dateien

| Aktion | Datei |
|--------|-------|
| Create | `src/components/vision/TwoPillarModel.tsx` |
| Create | PDF-Generierungsscript → `public/zwei-saeulen-modell.pdf` |
| Edit | `src/pages/InvestorenLanding.tsx` (Import + Platzierung) |

## Technisch
- SVG-Infografik: gleicher Stil wie `HeroSystemGraphic.tsx` (Teal/Orange/Dark, Framer Motion, viewBox)
- PDF: reportlab mit Brand-Farben, clean A4-Layout, Download via `<a href>` Button
- Alle Texte deutsch, Zahlen aus dem bestehenden Business Case

