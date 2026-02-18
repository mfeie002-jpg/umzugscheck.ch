# Feierabend Services – KI Video-Analyse Setup Guide

## Übersicht

Dieses Bundle enthält alle Dateien für die KI-Video-Analyse auf feierabendservices.ch.
Das System extrahiert 10 Frames aus einem Handyvideo und lässt die KI Räumungsvolumen + Kosten schätzen.

## Ziel-Funktionalität

- Kunde filmt Wohnung/Büro per Handy (15–30 Sek)
- System extrahiert 10 Frames (clientseitig, kein Video upload)  
- KI (Gemini 2.5 Flash) analysiert Frames → schätzt Volumen, Team, CHF-Preis
- Ergebnis wird in DB gespeichert + WhatsApp/Call CTA angeboten

## Dateien (wo einsetzen)

| Bundle-Datei | Ziel im Projekt |
|---|---|
| `feierabend-edge-function.ts` | `supabase/functions/analyze-inventory-frames/index.ts` |
| `feierabend-extract-frames.ts` | `src/utils/extractVideoFrames.ts` |
| `feierabend-video-component.tsx` | `src/components/FeierabendVideoAnalysis.tsx` |
| `feierabend-db-migration.sql` | In DB ausführen via Lovable Cloud → Backend → SQL Editor |
| `feierabend-config-snippet.toml` | Einfügen in `supabase/config.toml` |

## Schritt-für-Schritt

### 1. Dateien kopieren

```bash
# Kopiere Edge Function
cp feierabend-edge-function.ts supabase/functions/analyze-inventory-frames/index.ts

# Kopiere Frame-Utility
cp feierabend-extract-frames.ts src/utils/extractVideoFrames.ts

# Kopiere Komponente
cp feierabend-video-component.tsx src/components/FeierabendVideoAnalysis.tsx
```

### 2. config.toml ergänzen

Öffne `supabase/config.toml` und füge am Ende hinzu (Inhalt aus `feierabend-config-snippet.toml`):

```toml
[functions.analyze-inventory-frames]
verify_jwt = false
```

### 3. Datenbank-Migration ausführen

Öffne Lovable Cloud Backend → SQL Editor und führe den Inhalt von `feierabend-db-migration.sql` aus.

### 4. Komponente in einer Page einbinden

```tsx
import FeierabendVideoAnalysis from "@/components/FeierabendVideoAnalysis";

// In deiner Seite:
<FeierabendVideoAnalysis 
  defaultServiceType="raeumung"
  whatsappPhone="41XXXXXXXXX"  // Feierabend Nummer einsetzen
  bookingUrl="/kontakt"
/>
```

### 5. Testen

1. Öffne die Seite im Browser
2. Wähle Service-Typ (Räumung / Entsorgung / Firmenräumung)
3. Lade ein kurzes Video hoch (oder filmé direkt)
4. Sieh: Frame-Extraktion Fortschritt → KI analysiert → Resultat mit CHF-Preis
5. Prüfe in Lovable Cloud Backend → `video_surveys` Tabelle: neuer Eintrag vorhanden

## Konfiguration

### WhatsApp Nummer anpassen

In `feierabend-video-component.tsx`, Zeile mit `DEFAULT_PHONE`:
```typescript
const DEFAULT_FEIERABEND_PHONE = "41XXXXXXXXX"; // ← Feierabend Nummer einsetzen
```

### Service-Typen anpassen

Feierabend's Services sind:
- `raeumung` – Haushaltsauflösung / Räumung  
- `entsorgung` – Entsorgung einzelner Gegenstände
- `firmenumzug` – Firmenräumung / Betriebsauflösung

Den `umzug` Typ kann man auch behalten (Wohnungsumzug), oder entfernen wenn Feierabend das nicht anbietet.

## Anforderungen

- Lovable Cloud Projekt (hat `LOVABLE_API_KEY` automatisch)
- Supabase-Projekt verbunden
- Kein weiterer API-Key nötig

## Datenschutz

- Videos verlassen das Gerät NIE komplett (nur 10 JPEG-Frames werden gesendet)
- Frames werden nicht persistent gespeichert (nur `analysis_json` in DB)
- GDPR-konform für CH/EU
