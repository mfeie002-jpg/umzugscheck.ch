# Umzugscheck.ch · Service Image Generator

Brand-konsistente Service-Bilder via **OpenAI gpt-image-1.5** und **Gemini 3.1 Flash Image (Nano Banana 2)**. Generiert parallel mit beiden APIs für Vergleich, baut eine HTML-Vorschau, wartet auf deine Freigabe bevor Bilder ins Haupt-Repo wandern.

## Struktur

```
tools/image-gen/
├── generate.py          # Hauptskript
├── config.yaml          # 8 Services + Brand-Anker
├── styles.yaml          # 3 Stil-Presets (photo / illustration / 3d)
├── requirements.txt     # Python-Dependencies
├── .env.example         # API-Key Template
├── .gitignore           # schützt .env und preview/
└── preview/             # ← hier landen die Bilder (gitignored)
    ├── preview.html     # ← hier öffnen zum Vergleich
    └── phase1-styletest/
```

## Einmalig einrichten (5 Minuten)

Im Terminal von VS Code:

```bash
cd tools/image-gen

# Virtuelle Umgebung
python3 -m venv venv
source venv/bin/activate          # Mac/Linux
# venv\Scripts\activate           # Windows PowerShell

# Dependencies installieren
pip install -r requirements.txt

# API-Keys eintragen
cp .env.example .env
# Jetzt .env in VS Code öffnen und die beiden Keys einfügen:
#   OPENAI_API_KEY=sk-proj-...
#   GEMINI_API_KEY=AIza...
```

**API-Keys holen:**
- OpenAI: <https://platform.openai.com/api-keys> (braucht verifizierte Organisation für `gpt-image-1.5`)
- Gemini: <https://aistudio.google.com/apikey>

## Phase 1 — Stil-Test (dein erster Run)

Generiert **6 Bilder**: Privatumzug × 3 Stile × 2 APIs.

```bash
python generate.py --phase 1
```

Danach im Finder / VS Code Explorer `preview/preview.html` öffnen → du siehst alle 6 Bilder in einem Side-by-Side Grid. Wähle deinen Sieger (z.B. „Stil A — Fotorealistisch, OpenAI") und geh zu Phase 2.

**Kosten Phase 1 (ca.):**
- OpenAI gpt-image-1.5 high quality 1536×1024: ~3 × ca. $0.19 = ~$0.57
- Gemini Nano Banana 2 1K: 3 × $0.045 = ~$0.14
- **Total: ca. $0.71 / CHF 0.65**

## Phase 2 — Rollout

Sobald Stil + API gewählt sind, generiere die restlichen 7 Services. Das Privatumzug-Bild aus Phase 1 wird automatisch mitgenommen, sodass du am Ende alle 8 im finalen Ordner hast.

```bash
# Beispiel: Stil A fotorealistisch via OpenAI
python generate.py --phase 2 --style photorealistic --api openai

# Oder Stil B via Gemini
python generate.py --phase 2 --style illustration --api gemini
```

Output: `preview/phase2-<stil>-<api>/` + `preview/preview-phase2-<stil>-<api>.html`.

**Kosten Phase 2 (ca.):**
- OpenAI: 7 × $0.19 = ~$1.33
- Gemini: 7 × $0.045 = ~$0.32

## Single-Image Mode (für Retries / Prompt-Tuning)

Einzelnes Bild neu generieren, z.B. wenn ein Service nicht stimmt:

```bash
python generate.py --service firmenumzug --style photorealistic --api openai
```

Landet in `preview/single/`.

## Integration ins Haupt-Repo

Nach Freigabe:

1. Bilder aus `preview/phase2-<stil>-<api>/` nach `public/images/services/` kopieren
2. Optional: in WebP konvertieren für schnellere Ladezeiten (z.B. mit `cwebp`)
3. React-Komponenten auf die neuen Bildpfade umstellen
4. GitHub Desktop → Commit → Push → Lovable syncen

## Prompt-Anpassungen

- **Szene ändern** (z.B. Hund dazu, anderes Licht): `config.yaml` → `services.<key>.scene`
- **Stil feintunen** (z.B. wärmere Farben): `styles.yaml` → `<style>.description`
- **Brand-Anker ändern** (z.B. andere Uniform-Farbe): `config.yaml` → `brand.anchor`

Nach jeder Änderung einfach erneut laufen lassen — du brennst nur 1–2 Dollar für ein Retry.

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| `401 Unauthorized` OpenAI | Key falsch oder Organisation nicht verifiziert. Check: <https://platform.openai.com/settings/organization/general> |
| `403 PERMISSION_DENIED` Gemini | Key falsch oder Region nicht freigeschaltet. Versuch über Google AI Studio zu generieren als Sanity Check |
| Gemini liefert Text statt Bild | Modell-ID prüfen: `gemini-3.1-flash-image-preview` ist aktuell (Feb 2026) |
| Bilder sehen amerikanisch aus | `brand.anchor` in `config.yaml` verstärken mit „NOT American, NOT British, explicitly Swiss" |
| Zwei Mover sehen identisch aus | Im Szenenprompt variieren: „one with glasses, one without" |
