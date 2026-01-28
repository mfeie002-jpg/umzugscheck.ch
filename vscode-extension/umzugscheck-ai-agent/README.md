# Umzugscheck AI Agent - VS Code Extension

Automatisch AI-Tasks aus der Supabase Queue laden und direkt in VS Code / GitHub Copilot Chat ausführen.

## Features

- 🔵 **CODEX Tasks** - Neue Features, Komponenten, Business Logic
- 🟢 **COPILOT Tasks** - Styling, Fixes, Optimierungen
- 🔄 **Auto-Load** - Nächster Task wird automatisch geladen nach "Done"
- 📋 **One-Click Copy** - Prompt direkt in Zwischenablage für Copilot Chat
- 🧠 **Task Generation** - Neue Tasks basierend auf Flow-Analyse generieren

## Installation

1. Öffne VS Code Extensions (Cmd+Shift+X)
2. Klicke auf "..." → "Install from VSIX..."
3. Wähle die `umzugscheck-ai-agent-1.0.0.vsix` Datei

**Oder manuell:**
```bash
cd vscode-extension/umzugscheck-ai-agent
npm install
npm run compile
```

## Konfiguration

Die Extension ist bereits vorkonfiguriert für das umzugscheck.ch Projekt.

Optional in VS Code Settings:
```json
{
  "umzugscheck.supabaseUrl": "https://vgitgdvxanodfgokokix.supabase.co",
  "umzugscheck.supabaseAnonKey": "...",
  "umzugscheck.autoLoadNextTask": true,
  "umzugscheck.showNotifications": true
}
```

## Verwendung

### Commands (Cmd+Shift+P)

| Command | Beschreibung |
|---------|--------------|
| `Umzugscheck AI: Next CODEX Task` | Lädt nächsten CODEX-Task |
| `Umzugscheck AI: Next COPILOT Task` | Lädt nächsten COPILOT-Task |
| `Umzugscheck AI: Mark Current Task Done` | Markiert aktuellen Task als erledigt |
| `Umzugscheck AI: Show Task Queue` | Zeigt alle offenen Tasks |
| `Umzugscheck AI: Generate New Tasks` | Generiert neue Tasks via AI |

### Workflow

1. **Task laden**: `Cmd+Shift+P` → "Next CODEX Task" oder "Next COPILOT Task"
2. **Prompt wird automatisch kopiert** 
3. **Copilot Chat öffnen**: `Cmd+I`
4. **Prompt einfügen**: `Cmd+V`
5. **Ausführen lassen**
6. **Done markieren**: `Cmd+Shift+P` → "Mark Current Task Done"
7. → Nächster Task wird automatisch angeboten

### Status Bar

In der linken Status Bar siehst du:
- `$(rocket) AI Agent` - Bereit, keine Tasks in Bearbeitung
- `$(rocket) AI Agent (5)` - 5 Tasks pending
- `$(sync~spin) CODEX: Task Title...` - Task in Bearbeitung

## Keyboard Shortcuts (empfohlen)

Füge in `keybindings.json` hinzu:

```json
[
  {
    "key": "ctrl+alt+c",
    "command": "umzugscheck.nextCodexTask"
  },
  {
    "key": "ctrl+alt+p", 
    "command": "umzugscheck.nextCopilotTask"
  },
  {
    "key": "ctrl+alt+d",
    "command": "umzugscheck.markDone"
  }
]
```

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     VS Code Extension                        │
├─────────────────────────────────────────────────────────────┤
│  Status Bar → Quick Pick → Webview Panel → Clipboard        │
│       ↓            ↓            ↓              ↓            │
│  [AI Agent]  [Task List]  [Task Details]  [Copilot Chat]   │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Supabase (ai_task_queue)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │ pending  │→ │in_progress│→ │   done   │  │  failed  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### "Supabase not configured"
→ Überprüfe die Extension Settings

### Tasks werden nicht geladen
→ Überprüfe die Netzwerkverbindung und Supabase-Credentials

### Copilot Chat öffnet sich nicht
→ Stelle sicher, dass GitHub Copilot installiert ist

## Development

```bash
cd vscode-extension/umzugscheck-ai-agent
npm install
npm run watch  # Watch mode für Entwicklung
```

Zum Testen: F5 drücken für Extension Development Host.

## License

MIT - umzugscheck.ch
