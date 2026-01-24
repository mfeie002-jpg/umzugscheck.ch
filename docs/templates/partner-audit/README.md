# Partner Trust Audit Templates

Diese Templates dienen der standardisierten Partner-Akquise und Trust-Analyse für Umzugsfirmen.

## Übersicht

| Template | Zweck | Zielgruppe |
|----------|-------|------------|
| `EXECUTIVE_SUMMARY.md` | 1-Seiten Audit für CEOs | Geschäftsführer, Entscheider |
| `TRUST_ARCHITECTURE.md` | 3-Säulen Blueprint | Operatives Team |
| `CONVERSION_SYSTEM.md` | UX & KPI Targets | Marketing, Sales |

## Das Trust Triumvirate Framework

Unser Bewertungssystem basiert auf drei Vertrauenssäulen:

### 1. Institutional Trust (35%)
- UID im Zefix verifiziert
- Versicherungsnachweis
- ASTAG/VSU Mitgliedschaft
- Festnetznummer
- Eigene Domain/Website

### 2. Social Trust (30%)
- Google Reviews (Anzahl & Rating)
- Team-Portraits
- Fallstudien/Referenzfotos
- Video-Testimonials
- Medien-Erwähnungen

### 3. Process Trust (35%)
- "So funktioniert's" Sektion
- Abgabegarantie kommuniziert
- Transparente Preisstruktur
- Antwortzeit < 12h
- Garantie-Badges sichtbar

## Verwendung

1. **Audit durchführen**: Firma anhand der Checklisten in `TRUST_ARCHITECTURE.md` bewerten
2. **Score berechnen**: Gewichtetes Scoring gemäss Framework
3. **Report erstellen**: `EXECUTIVE_SUMMARY.md` mit Firmenname und Werten ausfüllen
4. **Roadmap ableiten**: Konkrete Verbesserungen aus `CONVERSION_SYSTEM.md` priorisieren

## Integration mit Platform

Diese Templates sind direkt mit unserem `quality-badge.ts` Scoring-System verbunden:

```typescript
import { calculateTrustTriumvirate } from '@/lib/quality-badge';

const trustData = calculateTrustTriumvirate(providerData);
// -> { institutional: {...}, social: {...}, process: {...}, overallScore: 72 }
```

## Badge-Level Mapping

| Score | Level | Label |
|-------|-------|-------|
| 0-39 | none | Basis |
| 40-59 | verified | Verifiziert |
| 60-79 | premium | Premium Partner |
| 80-100 | elite | Elite Partner |
