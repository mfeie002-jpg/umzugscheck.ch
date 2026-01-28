# Zapier AI Autopilot Setup für umzugscheck.ch

## 🎯 Überblick
Automatische AI-Task-Verarbeitung über Zapier mit 2 parallelen Workflows (CODEX & COPILOT).

---

## 📋 Vorbereitungen

### Erforderliche Accounts
- ✅ Zapier Account (Free oder bezahlt)
- ✅ OpenAI Account (für ChatGPT Integration)
- ✅ Supabase Account (bereits konfiguriert)

### Credentials sammeln
```
SUPABASE_URL: https://vgitgdvxanodfgokokix.supabase.co
ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4
WEBHOOK_URL: https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook
```

---

## 🚀 ZAP 1: CODEX Executor (Every 30 Minutes)

### Step 1️⃣: Trigger - Schedule
1. **Zapier Home** → **Create** → **New Zap**
2. **Trigger App**: `Schedule by Zapier`
3. **Trigger**: `Every 30 minutes`
4. **Time**: Set starting time (z.B. 9:00 AM)
5. **Test Trigger** → Continue

---

### Step 2️⃣: Get Next CODEX Task (Webhook)
1. **+ Add Step** → **App**: `Webhooks by Zapier`
2. **Event**: `POST`
3. **URL**: 
   ```
   https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook
   ```
4. **Headers**: 
   ```json
   {
     "Content-Type": "application/json",
     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4"
   }
   ```
5. **Body** (raw JSON):
   ```json
   {
     "action": "next",
     "agent": "codex"
   }
   ```
6. **Unflatten**: ON
7. **Test** → sollte einen Task mit Struktur zurückgeben:
   ```json
   {
     "task": {
       "id": "uuid-here",
       "prompt": "Dein Prompt Text...",
       "priority": 1,
       "agent": "codex",
       "created_at": "2026-01-28..."
     }
   }
   ```

---

### Step 3️⃣: Filter - Nur fortfahren wenn Task existiert
1. **+ Add Step** → **App**: `Filter by Zapier`
2. **Condition 1**: 
   ```
   Task (from Step 2) → is not empty
   ```
3. **Continue** (bei erfolgreichem Filter)

---

### Step 4️⃣: Send Prompt to ChatGPT
1. **+ Add Step** → **App**: `ChatGPT` (by OpenAI)
2. **Action**: `Send prompt`
3. **Prompt**:
   ```
   Insert data from this step → Select "Prompt" from Step 2 (Task.Prompt)
   ```
   **Raw**: `{{Step2.task.prompt}}`
4. **Model**: `gpt-4` (oder `gpt-3.5-turbo` für schneller/günstiger)
5. **Temperature**: `0.7` (für Balance zwischen Kreativität & Konsistenz)
6. **Test** → ChatGPT antwortet mit Task-Ergebnis

---

### Step 5️⃣: Mark Task Complete (Webhook)
1. **+ Add Step** → **App**: `Webhooks by Zapier`
2. **Event**: `POST`
3. **URL**:
   ```
   https://vgitgdvxanodfgokokix.supabase.co/functions/v1/ai-task-webhook
   ```
4. **Headers** (wie Step 2):
   ```json
   {
     "Content-Type": "application/json",
     "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4"
   }
   ```
5. **Body** (raw JSON):
   ```json
   {
     "action": "complete",
     "task_id": "{{Step2.task.id}}",
     "output_summary": "{{Step4.response}}",
     "agent": "codex"
   }
   ```
6. **Test** → Bestätigung dass Task als erledigt markiert wurde

---

### Step 6️⃣: Error Handling (Optional aber empfohlen)
1. **Add Filter für Fehler**: 
   ```
   Step 4 (ChatGPT Response) → Error → Continue
   ```
2. **Action**: `Send Email` oder `Slack Message`
   ```
   Nachricht: "CODEX Task {{Step2.task.id}} failed: {{Step4.error}}"
   ```

---

## 🟢 ZAP 2: COPILOT Executor (Every 30 Minutes, mit 15-Minuten-Versatz)

**Exakt gleiche Struktur wie Zap 1, nur mit diesen Änderungen:**

### Step 2 (Unterschied):
```json
{
  "action": "next",
  "agent": "copilot"
}
```

### Step 5 (Unterschied):
```json
{
  "action": "complete",
  "task_id": "{{Step2.task.id}}",
  "output_summary": "{{Step4.response}}",
  "agent": "copilot"
}
```

### Schedule Timing:
- **Zap 1 (CODEX)**: Starten um **9:00 AM** (Every 30 min)
- **Zap 2 (COPILOT)**: Starten um **9:15 AM** (Every 30 min)
  - Dadurch laufen nie beide gleichzeitig und Ressourcen werden besser genutzt

---

## 🔧 JSON Body Referenz (Zum Kopieren)

### Get Next Task (Alle Agents)
```json
{
  "action": "next",
  "agent": "codex"
}
```
**Varianten**: `"agent": "codex"` oder `"agent": "copilot"`

### Mark Task Complete
```json
{
  "action": "complete",
  "task_id": "550e8400-e29b-41d4-a716-446655440000",
  "output_summary": "Task wurde erfolgreich ausgeführt. Ergebnis: [Summary hier]",
  "agent": "codex"
}
```

### Webhook Headers (Alle Requests)
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4"
}
```

---

## ⚠️ Error Handling & Best Practices

### 1. **Kein Task verfügbar** (Häufigste Situation)
**Problem**: Webhook gibt leeren Task zurück
**Lösung**: Filter Step prüft ob `task` NULL ist → stoppt Zap graceful

**Webhook Response**: 
```json
{
  "task": null,
  "message": "No pending tasks"
}
```

### 2. **ChatGPT API Error**
**Problem**: OpenAI API nicht erreichbar oder Rate Limit
**Lösung**: 
- Set Retry Policy in Webhooks Step: `Retry on error` → 2x nach 5 min
- ChatGPT Step mit Fallback (2. Versuch mit `gpt-3.5-turbo`)

### 3. **Webhook Timeout**
**Problem**: Edge Function antwortet nicht in 30 Sekunden
**Lösung**:
```
- Timeout setting: 60 Sekunden (max in Zapier)
- Task zu groß? → Split in mehrere kleinere Tasks
```

### 4. **Monitoring & Logging**
**Setup**:
1. **Zapier Logs**: Jeder Zap speichert automatisch Execution Logs
2. **Supabase Logs**: Edge Function Logs unter `Functions` → `ai-task-webhook`
3. **Slack Notification** (Optional):
   ```
   Zap Step: "Send Slack Message"
   Channel: #ai-autopilot
   Message: "✅ CODEX Task {{Step2.task.id}} completed in {{now - Step1.timestamp}}"
   ```

### 5. **Cost Optimization**
| Frequenz | ChatGPT Calls/Tag | Est. Cost/Monat |
|----------|------------------|-----------------|
| 30 min (2 Zaps) | 96 | ~$5-15 (gpt-3.5) |
| 15 min (2 Zaps) | 192 | ~$10-30 |
| 5 min (2 Zaps) | 576 | ~$30-90 |

**Empfehlung**: Start mit 30 Minuten, dann basierend auf Queue-Tiefe anpassen

---

## 📊 Monitoring Dashboard Setup

Erstelle dir ein View in Supabase:
```sql
SELECT 
  id,
  agent,
  status,
  prompt,
  output_summary,
  created_at,
  completed_at,
  EXTRACT(EPOCH FROM (completed_at - created_at)) as duration_seconds
FROM ai_task_queue
WHERE completed_at IS NOT NULL
ORDER BY completed_at DESC
LIMIT 50;
```

---

## ✅ Testing Checklist

- [ ] Zap 1 Test mit manuellem Trigger durchführen
- [ ] Prüfe ob Task in Supabase als `status: completed` markiert wird
- [ ] Prüfe Webhook Response im Zapier Log
- [ ] ChatGPT Response überprüfen (logisch, nicht null)
- [ ] Zap 2 mit gleichem Flow testen
- [ ] Beide Zaps aktivieren
- [ ] 30 Minuten warten und Execution Log prüfen
- [ ] Ein Task manuell zur Queue hinzufügen und verfolgen

---

## 🚨 Troubleshooting

### "Unauthorized" Error (401)
**Ursache**: Anon Key falsch/abgelaufen
**Fix**: Neu aus `.env` kopieren, Zap updaten, Test erneut laufen

### "Task ist null auch wenn Daten in Queue"
**Ursache**: Edge Function Filter nicht korrekt
**Fix**: Edge Function Log überprüfen
```
supabase functions logs ai-task-webhook
```

### "ChatGPT antwortet nicht"
**Ursache**: OpenAI API Problem oder Prompt zu lang
**Fix**: 
- Prompt in Zap-Editor kontrollieren
- Länge beschränken (<4000 Tokens)
- Fallback mit einfacherem Prompt einbauen

### Zap startet nie
**Ursache**: Schedule falsch konfiguriert oder Zap deaktiviert
**Fix**: 
- Zapier Dashboard → Check Zap Status (muss ON sein)
- Clock Icon → Verifiziere Time Zone und Schedule

---

## 📝 Nächste Schritte

1. **Beide Zaps erstellen** (folge Schritt-für-Schritt-Anleitung oben)
2. **Testing durchführen** (Checklist oben)
3. **Monitoring einrichten** (Slack/Email Notifications)
4. **Performance tunen** (Frequenz basierend auf Queue-Tiefe)
5. **Dokumentieren** welche Tasks erfolgreich ausgeführt wurden

---

**Last Updated**: 2026-01-28
**Status**: Ready for Production
