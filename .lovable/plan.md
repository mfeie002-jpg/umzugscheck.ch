

# Webhook Update: "create" Action + "openclaw" Agent freischalten

## Problem

Die Edge Function hat einen Bug in der Action-Routing-Logik:
- Zeile 48: `if (body?.action)` fängt alle Requests mit `action` ab
- Zeile 243: Nur `next`, `complete`, `pending`, `debug-last`, `stats` sind erlaubt → "create" wird als "Unknown action" abgelehnt
- Die eigentliche "create"-Logik existiert bereits (Zeile 281), wird aber nie erreicht, weil der Action-Router vorher abbricht
- Agents sind überall auf `codex` und `copilot` hardcoded

## Lösung

**1 Datei ändern:** `supabase/functions/ai-task-webhook/index.ts`

- **"create" in den Action-Router aufnehmen** (Zeile ~48-249): Wenn `requestedAction === 'create'`, die bestehende Create-Logik (Zeile 281-320) ausführen
- **Agent-Whitelist erweitern** auf `['codex', 'copilot', 'openclaw']` an allen 4 Stellen (POST action next, POST action create, GET next, GET complete)
- **"create" zur `available_actions`-Liste hinzufügen** in der Fehlermeldung

Damit kann OpenClaw sofort:
- `action: "create"` mit `agent: "openclaw"` Tasks erstellen
- `action: "next"` mit `agent: "openclaw"` Tasks abholen
- `action: "complete"` Tasks abschliessen

Kein DB-Schema-Change nötig – das `agent`-Feld ist ein freier Text.

