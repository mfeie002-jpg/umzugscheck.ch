
# KI Video-Analyse: Build Error Fixes + Komplettes Export-Bundle für feierabendservices.ch

## Was gebaut wird

Zwei separate Ziele in einem Durchgang:

1. **Build-Fehler beheben** in `ScreenshotRenderModeRoot.tsx` und `use-push-notifications.tsx`
2. **Frame-basierte Video-Analyse** – Upgrade der bestehenden Komponente + neue Edge Function + DB-Tabelle
3. **Komplettes Export-Bundle** für das andere Projekt (feierabendservices.ch) – alle nötigen Dateien mit angepasstem Prompt und Kontext

---

## Teil 1: Build-Fehler beheben

### Fix A – `ScreenshotRenderModeRoot.tsx` (Zeile 42)

**Problem:** `UCIntersectionObserver` implementiert das Interface `IntersectionObserver`, aber `scrollMargin` (eine `readonly string`-Property) fehlt – TypeScript TS2420 und TS2345.

**Fix:** `readonly scrollMargin: string = "0px"` zur Klasse hinzufügen (direkt nach `thresholds`).

```text
class UCIntersectionObserver implements IntersectionObserver {
  readonly root: ...
  readonly rootMargin: ...
  readonly thresholds: ...
  readonly scrollMargin: string = "0px";   // <-- NEU
  ...
```

### Fix B – `use-push-notifications.tsx` (Zeilen 19 und 38)

**Problem:** `registration.pushManager` existiert nicht auf dem TypeScript-Typ `ServiceWorkerRegistration` in dieser Environment-Konfiguration (TS2339).

**Fix:** Type-Assertion via `(registration as any).pushManager` an beiden Stellen.

---

## Teil 2: Frame-basierte Video-Analyse (Upgrade auf diesem Projekt)

### A) Neue Utility: `src/utils/extractVideoFrames.ts`

Client-seitige Frame-Extraktion:
- Nimmt ein `File`-Objekt (Video) entgegen
- Erstellt ein unsichtbares `<video>` + `<canvas>` (offscreen, nicht im DOM)
- Extrahiert 10 gleichmässig verteilte Frames via `currentTime` seek
- Skaliert jeden Frame auf max 1024px (Aspect Ratio behalten)
- Exportiert als JPEG base64 (quality 0.75)
- Gibt `Promise<string[]>` zurück (array of `data:image/jpeg;base64,...`)
- Beinhaltet Cleanup der Object URL

### B) Neue Edge Function: `supabase/functions/analyze-inventory-frames/index.ts`

Neue robuste Edge Function (alte `analyze-moving-video` bleibt als Fallback):

**Input:**
```text
{
  frames: string[],          // JPEG base64 frames
  serviceType: "umzug" | "raeumung" | "entsorgung" | "firmenumzug",
  zip?, city?, rooms?, floor?, elevator?, urgency?, notes?, gclid?
}
```

**Output STRICT JSON:**
```text
{
  serviceType,
  estimated_volume_m3,
  estimated_weight_kg | null,
  bulky_items: [{item, count, notes}],
  disposal_breakdown | null,   // nur für raeumung/entsorgung
  recommended_team: {people, hours, vehicles, lift_needed},
  price_range_chf: {low, high, rationale},
  confidence,
  followup_questions[],
  red_flags[],
  assumptions[]
}
```

**Prompt-Strategie nach serviceType:**
- `umzug` / `firmenumzug`: Fokus auf Inventar, Volumen m³, Team, Fahrzeuge, CHF-Preisrange
- `raeumung`: Fokus auf disposal_breakdown (Sperrgut, Elektro, Sonderabfall), Entsorgungskosten
- `entsorgung`: Fokus auf Gewicht, Entsorgungskategorien, Kosten CHF

**Technische Details:**
- Max 10 Frames; wenn mehr übergeben werden, werden sie gleichmässig ausgewählt
- Robustes JSON-Parsing (```json``` wrapper, Fallback mit sinnvollen Defaults)
- Rate limiting via bestehende `check_rate_limit` RPC (5 Requests/h)
- CORS mit allen Supabase-Headers
- LOVABLE_API_KEY aus Environment; Modell `google/gemini-2.5-flash`
- 402/429 Fehler werden sauber an Client weitergeleitet

### C) Datenbank: `video_surveys` Tabelle

SQL-Migration für neue Tabelle:

| Spalte | Typ | Notes |
|---|---|---|
| id | uuid PK | default gen_random_uuid() |
| created_at | timestamptz | default now() |
| service_type | text | umzug/raeumung/entsorgung/firmenumzug |
| frames_count | int | Anzahl analysierter Frames |
| analysis_json | jsonb | Vollständiges AI-Resultat |
| confidence | numeric(3,2) | 0.00 bis 1.00 |
| gclid | text | nullable |
| gbraid | text | nullable |
| wbraid | text | nullable |
| fbclid | text | nullable |
| landing_path | text | URL-Pfad bei Einstieg |
| city | text | nullable |
| zip | text | nullable |
| phone | text | nullable |
| email | text | nullable |
| status | text | default 'completed' |
| lead_id | uuid | nullable, für spätere Verknüpfung |

**RLS:**
- `INSERT` für anon (öffentlich, kein Login nötig)
- `SELECT` / `UPDATE` nur für authentifizierte Admins

**config.toml:** Neuer Eintrag `[functions.analyze-inventory-frames]` mit `verify_jwt = false`

### D) Frontend: `VideoInventoryAnalysis.tsx` – Rework

Die bestehende Komponente wird erweitert (nicht ersetzt):

1. **Neuer `serviceType` Prop** (default: `"umzug"`)
2. **Frame-Extraktion** statt base64 des ganzen Videos (ruft `extractVideoFrames` auf)
3. **Neue Result-Typen** passend zur neuen Edge Function
4. **Fortschritts-Steps** sichtbar:
   - Step 1: "Frames werden extrahiert..." (mit Counter: 1/10, 2/10...)
   - Step 2: "KI analysiert Frames..."
   - Step 3: "Fertig ✓"
5. **Erweiterte Result-Card:**
   - Volumen m³ + Preisrange CHF (prominent)
   - Bulky Items Liste
   - Team-Empfehlung (Personen, Stunden, Fahrzeuge)
   - Confidence-Badge (grün/gelb/rot)
   - Follow-up Fragen der KI (als Accordion)
   - Red Flags (z.B. "Enge Treppe erkannt")
6. **Dual CTA nach Analyse:**
   - "Remote Offerte fixieren" → WhatsApp (nutzt `generateWhatsAppLink` aus `src/utils/whatsapp.ts`)
   - "Vor-Ort Besichtigung buchen" → Link zu Kontaktformular
7. **DB-Persistenz:** Nach erfolgreicher Analyse Speichern in `video_surveys` inkl. GCLID aus URL-Params

---

## Teil 3: Export-Bundle für feierabendservices.ch

Das ist das wichtigste Deliverable: alle Dateien, die das andere Projekt braucht, um die KI-Video-Analyse zu implementieren. Diese werden als vollständige, copy-pasteable Dateien in einem dedizierten Ordner `src/exports/feierabend-video-analyzer/` abgelegt.

### Inhalt des Bundles:

**Datei 1: `FEIERABEND_SETUP.md`**
Schritt-für-Schritt Anleitung:
1. Welche Dateien wohin kopieren
2. Edge Function deployen
3. Datenbank-Migration ausführen (SQL beigefügt)
4. config.toml Eintrag hinzufügen
5. Komponente einbinden
6. Testen

**Datei 2: `feierabend-edge-function.ts`** (ready to paste als `supabase/functions/analyze-inventory-frames/index.ts`)
Identisch mit der Edge Function aus Teil 2, aber mit angepasstem Prompt für Feierabend Services:
- Fokus auf **Haushaltsauflösung, Räumung, Entsorgung, Firmenräumung** (Feierabend's Kernservices)
- Preislogik für Zürich/Deutschschweiz
- Branding: "Feierabend Services" in Fehler- und Hinweistexten
- Fallback-Daten angepasst

**Datei 3: `feierabend-extract-frames.ts`** (ready to paste als `src/utils/extractVideoFrames.ts`)
Identisch mit Utility aus Teil A – keine Anpassungen nötig, ist UI-agnostisch.

**Datei 4: `feierabend-video-component.tsx`** (ready to paste, angepasste Variante)
Variante der VideoInventoryAnalysis-Komponente, angepasst für Feierabend:
- Kein Umzugs-Fokus, sondern: Räumung, Haushaltsauflösung, Entsorgung, Firmenräumung
- ServiceType-Auswahl als erstes UI-Element (Tabs: Räumung / Entsorgung / Firmenräumung)
- Texte in Schweizerdeutsch/Hochdeutsch angepasst: "Räumungsgut erfassen", "Entsorgungsvolumen schätzen"
- CTAs angepasst: "Jetzt Offerte anfordern" (zu Feierabend Kontaktformular), "Direkt anrufen" (Feierabend Tel)
- WhatsApp CTA mit Feierabend-Nummer (Platzhalter, konfigurierbar)
- Kein `onInventoryChange` Callback-Zwang – standalone funktionsfähig

**Datei 5: `feierabend-db-migration.sql`**
Vollständige SQL-Migration für `video_surveys` Tabelle inkl. RLS-Policies – copy-paste ready.

**Datei 6: `feierabend-config-snippet.toml`**
TOML-Snippet zum Einfügen in `supabase/config.toml`.

---

## Dateiänderungen-Übersicht

```text
GEÄNDERT:
- src/components/ScreenshotRenderModeRoot.tsx     (Build-Fix: scrollMargin)
- src/hooks/use-push-notifications.tsx            (Build-Fix: pushManager cast)
- src/components/offerten-v2/VideoInventoryAnalysis.tsx  (Frame-Analyse Upgrade)
- supabase/config.toml                            (neuer Function-Eintrag)

NEU (für dieses Projekt):
- src/utils/extractVideoFrames.ts                 (Frame-Extraktion Utility)
- supabase/functions/analyze-inventory-frames/index.ts  (neue Edge Function)
- DB Migration: video_surveys Tabelle

NEU (Export-Bundle für feierabendservices.ch):
- src/exports/feierabend-video-analyzer/FEIERABEND_SETUP.md
- src/exports/feierabend-video-analyzer/feierabend-edge-function.ts
- src/exports/feierabend-video-analyzer/feierabend-extract-frames.ts
- src/exports/feierabend-video-analyzer/feierabend-video-component.tsx
- src/exports/feierabend-video-analyzer/feierabend-db-migration.sql
- src/exports/feierabend-video-analyzer/feierabend-config-snippet.toml
```

---

## Testen nach Implementierung

1. Build läuft ohne TS-Fehler durch (scrollMargin + pushManager fixes)
2. Öffne `/umzugsofferten` → VideoInventoryAnalysis ist sichtbar
3. Lade ein kurzes Handyvideo hoch (10–30 Sek)
4. Sieh Frame-Extraktion: "Frames extrahieren 1/10, 2/10..."
5. KI-Analyse läuft: "KI analysiert..."
6. Result-Card zeigt: Volumen, CHF-Preisrange, Bulky Items, Team-Empfehlung, Confidence
7. Dual CTAs sind sichtbar und klickbar
8. In der Datenbank erscheint ein neuer Eintrag in `video_surveys`
9. Das Export-Bundle unter `src/exports/feierabend-video-analyzer/` ist vollständig und dokumentiert

## Hinweis für feierabendservices.ch

Das Bundle in `src/exports/feierabend-video-analyzer/` ist selbsterklärend – der Entwickler des anderen Projekts kann:
1. `FEIERABEND_SETUP.md` lesen
2. Die 5 Dateien an die richtigen Orte kopieren
3. Die Migration ausführen
4. Die Komponente in einer Page einbinden

Keine weiteren Abhängigkeiten als Supabase + Lovable AI (LOVABLE_API_KEY ist in jedem Lovable Cloud Projekt automatisch gesetzt).
