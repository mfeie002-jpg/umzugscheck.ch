import * as vscode from 'vscode';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface AITask {
  id: string;
  title: string;
  prompt: string;
  agent: 'codex' | 'copilot';
  target_files?: string[];
  priority?: number;
  status: string;
}

let supabase: SupabaseClient | null = null;
let currentTask: AITask | null = null;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('Umzugscheck AI Agent activated');

  // Create status bar item
  statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.command = 'umzugscheck.showQueue';
  statusBarItem.text = '$(rocket) AI Agent';
  statusBarItem.tooltip = 'Click to show task queue';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // Initialize Supabase client
  initializeSupabase();

  // Register commands
  context.subscriptions.push(
    vscode.commands.registerCommand('umzugscheck.nextCodexTask', () => fetchNextTask('codex')),
    vscode.commands.registerCommand('umzugscheck.nextCopilotTask', () => fetchNextTask('copilot')),
    vscode.commands.registerCommand('umzugscheck.markDone', markTaskDone),
    vscode.commands.registerCommand('umzugscheck.showQueue', showTaskQueue),
    vscode.commands.registerCommand('umzugscheck.generateTasks', generateTasks)
  );

  // Watch for configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(e => {
      if (e.affectsConfiguration('umzugscheck')) {
        initializeSupabase();
      }
    })
  );

  // Check for pending tasks on startup
  setTimeout(() => checkPendingTasks(), 3000);
}

function initializeSupabase() {
  const config = vscode.workspace.getConfiguration('umzugscheck');
  const url = config.get<string>('supabaseUrl') || process.env.SUPABASE_URL;
  const key = config.get<string>('supabaseAnonKey') || process.env.SUPABASE_ANON_KEY;

  // Default to the project's Supabase instance if not configured
  const finalUrl = url || 'https://vgitgdvxanodfgokokix.supabase.co';
  const finalKey = key || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZnaXRnZHZ4YW5vZGZnb2tva2l4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMTI3OTksImV4cCI6MjA4MTY4ODc5OX0.2OpecGv3OAO--Riv1RbuoojATDEA7u2fhsNorOw-I_4';

  if (finalUrl && finalKey) {
    supabase = createClient(finalUrl, finalKey);
    console.log('Supabase client initialized');
  } else {
    vscode.window.showWarningMessage(
      'Umzugscheck AI Agent: Supabase not configured. Go to Settings to configure.'
    );
  }
}

async function checkPendingTasks() {
  if (!supabase) return;

  try {
    const { count } = await supabase
      .from('ai_task_queue')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (count && count > 0) {
      statusBarItem.text = `$(rocket) AI Agent (${count})`;
      
      const config = vscode.workspace.getConfiguration('umzugscheck');
      if (config.get<boolean>('showNotifications')) {
        const action = await vscode.window.showInformationMessage(
          `🤖 ${count} AI Task(s) pending!`,
          'Load CODEX',
          'Load COPILOT',
          'Dismiss'
        );

        if (action === 'Load CODEX') {
          fetchNextTask('codex');
        } else if (action === 'Load COPILOT') {
          fetchNextTask('copilot');
        }
      }
    } else {
      statusBarItem.text = '$(rocket) AI Agent';
    }
  } catch (error) {
    console.error('Error checking pending tasks:', error);
  }
}

async function fetchNextTask(agent: 'codex' | 'copilot') {
  if (!supabase) {
    vscode.window.showErrorMessage('Supabase not configured');
    return;
  }

  try {
    // Mark current task as in_progress if it was pending
    const { data: task, error } = await supabase
      .from('ai_task_queue')
      .select('*')
      .eq('agent', agent)
      .eq('status', 'pending')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (error || !task) {
      vscode.window.showInformationMessage(`No pending ${agent.toUpperCase()} tasks`);
      return;
    }

    // Update status to in_progress
    await supabase
      .from('ai_task_queue')
      .update({ status: 'in_progress', started_at: new Date().toISOString() })
      .eq('id', task.id);

    currentTask = task;

    // Format the prompt for Copilot Chat
    const formattedPrompt = formatPromptForCopilot(task);

    // Show the task and copy to clipboard
    const panel = vscode.window.createWebviewPanel(
      'aiTask',
      `${agent.toUpperCase()} Task: ${task.title}`,
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    panel.webview.html = getTaskWebviewContent(task, formattedPrompt);

    // Copy to clipboard
    await vscode.env.clipboard.writeText(formattedPrompt);

    // Show notification with action
    const action = await vscode.window.showInformationMessage(
      `📋 ${agent.toUpperCase()} Task loaded and copied! Open Copilot Chat (Cmd+I) and paste.`,
      'Open Copilot Chat',
      'Mark Done'
    );

    if (action === 'Open Copilot Chat') {
      vscode.commands.executeCommand('workbench.action.chat.open');
    } else if (action === 'Mark Done') {
      markTaskDone();
    }

    statusBarItem.text = `$(sync~spin) ${agent.toUpperCase()}: ${task.title.substring(0, 20)}...`;

  } catch (error) {
    console.error('Error fetching task:', error);
    vscode.window.showErrorMessage(`Error fetching ${agent} task: ${error}`);
  }
}

function formatPromptForCopilot(task: AITask): string {
  const agentContext = task.agent === 'codex' 
    ? `Du bist CODEX für umzugscheck.ch - der Architekt für neue Features und Business Logic.

DEIN ARBEITSBEREICH:
✅ src/components/ (neue Komponenten erstellen)
✅ src/hooks/ (Custom Hooks)
✅ src/lib/ (Business Logic)
✅ src/pages/ (neue Seiten)
✅ supabase/functions/ (Edge Functions)

🚫 NICHT ANFASSEN: src/components/ui/, index.css, tailwind.config.ts`

    : `Du bist COPILOT für umzugscheck.ch - der Polierer für Styling und Optimierungen.

DEIN ARBEITSBEREICH:
✅ index.css (Design Tokens, CSS Variablen)
✅ tailwind.config.ts (Theme-Erweiterungen)
✅ src/components/ui/ (Shadcn-Anpassungen)
✅ Bestehende Komponenten: NUR Styling-Fixes

🚫 NICHT ANFASSEN: Neue Dateien erstellen, Business Logic`;

  let prompt = `${agentContext}

---

## Task: ${task.title}

${task.prompt}`;

  if (task.target_files && task.target_files.length > 0) {
    prompt += `

### Target Files:
${task.target_files.map(f => `- \`${f}\``).join('\n')}`;
  }

  prompt += `

---

WICHTIG: Swiss-Markt beachten (de-CH, CHF, ASTAG). Mobile-first, WCAG 2.1 AA Kontraste.`;

  return prompt;
}

function getTaskWebviewContent(task: AITask, formattedPrompt: string): string {
  const agentColor = task.agent === 'codex' ? '#3b82f6' : '#22c55e';
  const agentEmoji = task.agent === 'codex' ? '🔵' : '🟢';

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${task.title}</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      padding: 20px;
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--vscode-panel-border);
    }
    .badge {
      background: ${agentColor};
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
    }
    h1 {
      font-size: 18px;
      margin: 0;
    }
    .prompt {
      background: var(--vscode-textCodeBlock-background);
      border: 1px solid var(--vscode-panel-border);
      border-radius: 8px;
      padding: 16px;
      font-family: var(--vscode-editor-font-family);
      font-size: 13px;
      line-height: 1.5;
      white-space: pre-wrap;
      max-height: 400px;
      overflow-y: auto;
    }
    .actions {
      margin-top: 20px;
      display: flex;
      gap: 12px;
    }
    button {
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
    }
    button:hover {
      background: var(--vscode-button-hoverBackground);
    }
    .success {
      background: #22c55e;
    }
    .info {
      background: var(--vscode-textBlockQuote-background);
      border-left: 3px solid ${agentColor};
      padding: 12px 16px;
      margin: 16px 0;
      font-size: 13px;
    }
    .files {
      margin-top: 16px;
    }
    .files h3 {
      font-size: 14px;
      margin-bottom: 8px;
    }
    .file-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .file-tag {
      background: var(--vscode-badge-background);
      color: var(--vscode-badge-foreground);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: var(--vscode-editor-font-family);
    }
  </style>
</head>
<body>
  <div class="header">
    <span class="badge">${agentEmoji} ${task.agent.toUpperCase()}</span>
    <h1>${task.title}</h1>
  </div>
  
  <div class="info">
    ✅ Prompt wurde in die Zwischenablage kopiert!<br>
    Öffne Copilot Chat (Cmd+I) und füge den Prompt ein.
  </div>

  ${task.target_files && task.target_files.length > 0 ? `
  <div class="files">
    <h3>📁 Target Files:</h3>
    <div class="file-list">
      ${task.target_files.map(f => `<span class="file-tag">${f}</span>`).join('')}
    </div>
  </div>
  ` : ''}

  <h3>📝 Prompt:</h3>
  <div class="prompt">${escapeHtml(formattedPrompt)}</div>

  <div class="actions">
    <button onclick="copyPrompt()">📋 Erneut kopieren</button>
    <button class="success" onclick="markDone()">✅ Task abschließen</button>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    
    function copyPrompt() {
      navigator.clipboard.writeText(\`${escapeJs(formattedPrompt)}\`);
      vscode.postMessage({ command: 'copied' });
    }
    
    function markDone() {
      vscode.postMessage({ command: 'markDone' });
    }
  </script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeJs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');
}

async function markTaskDone() {
  if (!supabase || !currentTask) {
    vscode.window.showWarningMessage('No active task to mark as done');
    return;
  }

  try {
    await supabase
      .from('ai_task_queue')
      .update({ 
        status: 'done', 
        completed_at: new Date().toISOString() 
      })
      .eq('id', currentTask.id);

    vscode.window.showInformationMessage(`✅ Task "${currentTask.title}" marked as done!`);

    const previousAgent = currentTask.agent;
    currentTask = null;
    statusBarItem.text = '$(rocket) AI Agent';

    // Auto-load next task if enabled
    const config = vscode.workspace.getConfiguration('umzugscheck');
    if (config.get<boolean>('autoLoadNextTask')) {
      const action = await vscode.window.showInformationMessage(
        '🔄 Load next task?',
        `Next ${previousAgent.toUpperCase()}`,
        'Show Queue',
        'Done'
      );

      if (action === `Next ${previousAgent.toUpperCase()}`) {
        fetchNextTask(previousAgent);
      } else if (action === 'Show Queue') {
        showTaskQueue();
      }
    }

  } catch (error) {
    console.error('Error marking task done:', error);
    vscode.window.showErrorMessage(`Error: ${error}`);
  }
}

async function showTaskQueue() {
  if (!supabase) {
    vscode.window.showErrorMessage('Supabase not configured');
    return;
  }

  try {
    const { data: tasks } = await supabase
      .from('ai_task_queue')
      .select('*')
      .in('status', ['pending', 'in_progress'])
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (!tasks || tasks.length === 0) {
      vscode.window.showInformationMessage('🎉 No pending tasks! Queue is empty.');
      return;
    }

    const codexTasks = tasks.filter(t => t.agent === 'codex');
    const copilotTasks = tasks.filter(t => t.agent === 'copilot');

    const items: vscode.QuickPickItem[] = [
      { label: '🔵 CODEX Tasks', kind: vscode.QuickPickItemKind.Separator },
      ...codexTasks.map(t => ({
        label: `${t.status === 'in_progress' ? '▶️' : '⏸️'} ${t.title}`,
        description: `Priority: ${t.priority || '-'}`,
        detail: t.prompt?.substring(0, 100) + '...'
      })),
      { label: '🟢 COPILOT Tasks', kind: vscode.QuickPickItemKind.Separator },
      ...copilotTasks.map(t => ({
        label: `${t.status === 'in_progress' ? '▶️' : '⏸️'} ${t.title}`,
        description: `Priority: ${t.priority || '-'}`,
        detail: t.prompt?.substring(0, 100) + '...'
      }))
    ];

    const selected = await vscode.window.showQuickPick(items, {
      title: `AI Task Queue (${tasks.length} tasks)`,
      placeHolder: 'Select a task or press Esc to close'
    });

    // If a task was selected, offer to load it
    if (selected && selected.kind !== vscode.QuickPickItemKind.Separator) {
      const isCodex = codexTasks.some(t => selected.label.includes(t.title));
      fetchNextTask(isCodex ? 'codex' : 'copilot');
    }

  } catch (error) {
    console.error('Error showing queue:', error);
    vscode.window.showErrorMessage(`Error: ${error}`);
  }
}

async function generateTasks() {
  if (!supabase) {
    vscode.window.showErrorMessage('Supabase not configured');
    return;
  }

  const notes = await vscode.window.showInputBox({
    prompt: 'Founder Notes (optional) - Spezielle Anweisungen für die Task-Generierung',
    placeHolder: 'z.B. "Fokus auf Mobile UX" oder leer lassen'
  });

  try {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: '🧠 Generating AI Tasks...',
        cancellable: false
      },
      async () => {
        const { data, error } = await supabase!.functions.invoke('generate-ai-tasks', {
          body: { founder_notes: notes || undefined }
        });

        if (error) throw error;

        vscode.window.showInformationMessage(
          `✅ ${data.tasks_created} new tasks created! ${data.summary || ''}`,
          'Show Queue'
        ).then(action => {
          if (action === 'Show Queue') {
            showTaskQueue();
          }
        });
      }
    );
  } catch (error) {
    console.error('Error generating tasks:', error);
    vscode.window.showErrorMessage(`Error generating tasks: ${error}`);
  }
}

export function deactivate() {
  if (statusBarItem) {
    statusBarItem.dispose();
  }
}
