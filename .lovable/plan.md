

# KI Video-Analyse: Frame-basierte Inventar-Erkennung

## Uebersicht

Die bestehende Video-Analyse wird von "ganzes Video als base64" auf eine robuste Frame-Extraktion umgebaut. Der Client extrahiert 8-12 Frames aus dem Video, komprimiert sie, und schickt nur die Frames an eine neue Edge Function. Das System wird erweiterbar fuer Umzug, Raeumung, Entsorgung und Firmenumzug.

Zusaetzlich werden die Build-Fehler in `ScreenshotRenderModeRoot.tsx` und `use-push-notifications.tsx` behoben.

---

## Architektur

```text
[Handy-Video]
     |
     v
[Client: extractVideoFrames()]
     | 8-12 JPEG frames (max 1024px, quality 0.7)
     v
[Edge Function: analyze-inventory-frames]
     | frames[] + serviceType + metadata
     v
[Lovable AI Gateway (gemini-2.5-flash)]
     | STRICT JSON response
     v
[DB: video_surveys] + [UI: Result Card mit CTAs]
```

---

## Deliverables

### A) Utility: `src/utils/extractVideoFrames.ts`

Neue Utility-Funktion die:
- Ein `File`-Objekt (Video) entgegennimmt
- Ein unsichtbares `<video>` + `<canvas>` Element erstellt
- 8-12 gleichmaessig verteilte Frames extrahiert (seek via `currentTime`)
- Jeden Frame auf max 1024px skaliert und als JPEG base64 (quality 0.7) exportiert
- `Promise<string[]>` zurueckgibt (array of `data:image/jpeg;base64,...`)

### B) Edge Function: `supabase/functions/analyze-inventory-frames/index.ts`

Neue Edge Function (die alte `analyze-moving-video` bleibt als Fallback):

- **Input:** `{ frames: string[], serviceType, zip?, city?, rooms?, floor?, elevator?, urgency?, notes?, gclid? }`
- **Max 10 Frames** - wenn mehr, werden gleichmaessig 10 ausgewaehlt
- **Prompt variiert nach serviceType:**
  - `umzug` / `firmenumzug`: Fokus auf Inventar, Volumen, Team, Fahrzeuge
  - `raeumung` / `entsorgung`: Fokus auf disposal_breakdown, Gewicht, Entsorgungskategorien
- **Output STRICT JSON:**
  ```text
  {
    serviceType, estimated_volume_m3, estimated_weight_kg|null,
    bulky_items[{item,count,notes}],
    disposal_breakdown|null (fuer raeumung/entsorgung),
    recommended_team{people,hours,vehicles,lift_needed},
    price_range_chf{low,high,rationale},
    confidence (0..1),
    followup_questions[], red_flags[], assumptions[]
  }
  ```
- Robustes JSON-Parsing (```json``` wrapper, fallback)
- CORS korrekt mit allen Supabase-Headers
- Rate limiting via bestehende `check_rate_limit` RPC

### C) Datenbank: `video_surveys` Tabelle

SQL-Migration fuer eine neue Tabelle:

| Spalte | Typ | Beschreibung |
|--------|-----|--------------|
| id | uuid PK | |
| created_at | timestamptz | |
| service_type | text | umzug/raeumung/entsorgung/firmenumzug |
| frames_count | int | Anzahl analysierte Frames |
| analysis_json | jsonb | Vollstaendiges AI-Resultat |
| confidence | numeric | 0-1 |
| gclid | text | Google Click ID |
| gbraid | text | |
| wbraid | text | |
| fbclid | text | Meta Click ID |
| landing_path | text | URL-Pfad bei Einstieg |
| city | text | |
| zip | text | |
| phone | text | Optional |
| email | text | Optional |
| status | text | pending/completed/error |
| lead_id | uuid | Spaetere Verknuepfung mit leads-Tabelle |

RLS: INSERT fuer anon (oeffentlich, da kein Login noetig), SELECT/UPDATE nur fuer admins.

### D) Frontend-Komponente: Rework `VideoInventoryAnalysis.tsx`

Die bestehende Komponente wird erweitert:

1. **ServiceType-Auswahl** als optionale Prop (default: umzug)
2. **Frame-Extraktion** statt base64-Upload des ganzen Videos
3. **Analyse-Fortschritt** mit Steps: "Frames extrahieren..." -> "KI analysiert..." -> "Fertig"
4. **Result-Card** zeigt:
   - Geschaetztes Volumen + Preisrange CHF
   - Bulky Items Liste
   - Team-Empfehlung (Personen, Stunden)
   - Confidence-Badge
   - Follow-up Fragen der KI
   - Red Flags (z.B. "Enge Treppe erkannt")
5. **Dual CTA nach Analyse:**
   - "Remote Offerte fixieren" -> WhatsApp/Anruf (bestehende WhatsApp-Utils)
   - "Vor-Ort Besichtigung buchen" -> Link zu Terminbuchung oder Kontaktformular
6. **DB-Persistenz:** Nach erfolgreicher Analyse wird das Resultat in `video_surveys` gespeichert inkl. GCLID/URL-Params

### E) Build-Fehler beheben

1. **ScreenshotRenderModeRoot.tsx (Zeile 42):** `scrollMargin` Property zur `UCIntersectionObserver` Klasse hinzufuegen (`readonly scrollMargin: string = "0px"`)
2. **use-push-notifications.tsx (Zeile 19, 38):** TypeScript `pushManager` Fehler mit Type-Assertion beheben (`(registration as any).pushManager`)

### F) Config

- `supabase/config.toml`: Neuer Eintrag `[functions.analyze-inventory-frames]` mit `verify_jwt = false`
- Bestehende Funktion `analyze-moving-video` bleibt als Fallback

---

## Technische Details

### Frame-Extraktion (Client-seitig)

```text
1. Erstelle HTMLVideoElement + Canvas (offscreen)
2. Lade Video-File als Object URL
3. Warte auf "loadedmetadata" Event
4. Berechne Timestamps: duration / (targetFrames + 1) * i
5. Fuer jeden Timestamp: video.currentTime = t, warte auf "seeked"
6. Zeichne Frame auf Canvas (max 1024px), exportiere als JPEG base64
7. Raeume Object URL auf
```

### Prompt-Strategie nach ServiceType

- **umzug/firmenumzug:** "Schaetze Umzugsvolumen, Inventar, Team-Groesse, Fahrzeuge, Preisrange CHF"
- **raeumung:** "Schaetze Raeumungsaufwand, Entsorgungskategorien (Sperrgut, Elektro, Sondermuell), Team, Preisrange CHF"
- **entsorgung:** "Schaetze Entsorgungsvolumen und -gewicht, Kategorien, Kosten CHF"

### GCLID/Attribution Tracking

Beim Laden der Komponente werden URL-Parameter (`gclid`, `gbraid`, `wbraid`, `fbclid`) aus `window.location.search` gelesen und mit dem Survey gespeichert.

---

## Testen

1. Oeffne `/umzugsofferten` oder eine Seite mit der VideoInventoryAnalysis-Komponente
2. Waehle ein kurzes Handyvideo (10-30 Sek. Wohnungsrundgang)
3. Die Frames werden extrahiert (sichtbar im Fortschritt)
4. Die KI analysiert die Frames und liefert Inventar + Preisrange
5. Pruefe die Resultate und die CTAs
6. Pruefe in der Datenbank, ob ein `video_surveys`-Eintrag erstellt wurde

