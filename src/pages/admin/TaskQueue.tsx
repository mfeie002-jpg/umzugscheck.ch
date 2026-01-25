<<<<<<< Updated upstream
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAITasks, useWebhookLogs, useCreateTask, useUpdateTaskStatus, useDeleteTask, useTaskStats, AITask, WebhookLog } from "@/hooks/useAITaskQueue";
import { Plus, RefreshCw, Check, Trash2, Play, Copy, Clock, AlertCircle, CheckCircle, Code, Palette, ExternalLink, Zap, Radio, Brain, Sparkles, TrendingDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-700 border-amber-500/30",
  in_progress: "bg-blue-500/20 text-blue-700 border-blue-500/30",
  done: "bg-green-500/20 text-green-700 border-green-500/30",
};

const AGENT_ICONS: Record<string, React.ReactNode> = {
  codex: <Code className="h-4 w-4" />,
  copilot: <Palette className="h-4 w-4" />,
};

export default function TaskQueue() {
  const [agentFilter, setAgentFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedTask, setSelectedTask] = useState<AITask | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: tasks, isLoading, refetch } = useAITasks({
    agent: agentFilter || undefined,
    status: statusFilter || undefined,
  });
  const { data: logs } = useWebhookLogs(20);
  const { data: stats } = useTaskStats();
  const createTask = useCreateTask();
  const updateStatus = useUpdateTaskStatus();
  const deleteTask = useDeleteTask();
  const { toast } = useToast();

  const [agentRunnerResult, setAgentRunnerResult] = useState<{
    agent: "codex" | "copilot";
    task_id: string;
    title: string;
    prompt: string;
    target_files: string[] | null;
  } | null>(null);
  const [agentRunnerLoading, setAgentRunnerLoading] = useState<"codex" | "copilot" | null>(null);
  const [autoLoadEnabled, setAutoLoadEnabled] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  
  // Task Generator State
  const [founderNotes, setFounderNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatorResult, setGeneratorResult] = useState<{
    success: boolean;
    tasks_created: number;
    summary?: string;
    priority_reasoning?: string;
    context_used?: {
      flows_analyzed: number;
      issues_considered: number;
      low_score_alerts: number;
      founder_notes_included: boolean;
    };
  } | null>(null);

  const [newTask, setNewTask] = useState({
    agent: "codex",
    title: "",
    description: "",
    prompt: "",
    target_files: "",
    priority: 5,
  });

  const handleCreateTask = () => {
    if (!newTask.title || !newTask.prompt) {
      toast({ title: "Fehler", description: "Titel und Prompt sind erforderlich", variant: "destructive" });
      return;
    }
    createTask.mutate({
      agent: newTask.agent,
      title: newTask.title,
      description: newTask.description,
      prompt: newTask.prompt,
      target_files: newTask.target_files ? newTask.target_files.split(",").map(f => f.trim()) : [],
      priority: newTask.priority,
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        setNewTask({ agent: "codex", title: "", description: "", prompt: "", target_files: "", priority: 5 });
      },
    });
  };

  const copyPrompt = (prompt: string, title?: string, agent?: string) => {
    // Format for VS Code Copilot Chat
    const formattedPrompt = title && agent 
      ? `[${agent.toUpperCase()} TASK] ${title}\n\n${prompt}`
      : prompt;
    navigator.clipboard.writeText(formattedPrompt);
    toast({ 
      title: "📋 Prompt kopiert!", 
      description: "Jetzt in VS Code Copilot Chat (Cmd+I) einfügen" 
    });
  };

  const copyPromptForVSCode = (task: { prompt: string; title: string; agent: string; target_files?: string[] | null }) => {
    const header = `# ${task.agent.toUpperCase()} TASK: ${task.title}`;
    const files = task.target_files?.length 
      ? `\n\n## Target Files:\n${task.target_files.map(f => `- ${f}`).join('\n')}`
      : '';
    const formattedPrompt = `${header}${files}\n\n## Instructions:\n${task.prompt}`;
    navigator.clipboard.writeText(formattedPrompt);
    toast({ 
      title: "🚀 VS Code Ready!", 
      description: "Paste in Copilot Chat (Cmd+I / Ctrl+I)" 
    });
  };

  const fetchNextTask = useCallback(async (agent: "codex" | "copilot", silent = false) => {
    setAgentRunnerLoading(agent);
    try {
      const { data, error } = await supabase.functions.invoke("ai-task-webhook", {
        body: { action: "next", agent },
      });

      if (error) throw error;
      if (!data?.task_id || !data?.prompt) {
        if (!silent) {
          toast({
            title: "Keine pending Tasks",
            description: data?.message || `Keine pending Tasks für ${agent}.`,
          });
        }
        setAgentRunnerResult(null);
        return false;
      }

      setAgentRunnerResult({
        agent,
        task_id: data.task_id,
        title: data.title,
        prompt: data.prompt,
        target_files: data.target_files ?? null,
      });
      if (!silent) {
        toast({ title: "Task geladen", description: `Nächster ${agent.toUpperCase()} Task ist bereit.` });
      }
      return true;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unbekannter Fehler";
      if (!silent) {
        toast({ title: "Fehler", description: message, variant: "destructive" });
      }
      return false;
    } finally {
      setAgentRunnerLoading(null);
    }
  }, [toast]);

  const markRunnerTaskDone = async () => {
    if (!agentRunnerResult?.task_id) return;
    const currentAgent = agentRunnerResult.agent;
    try {
      const { error } = await supabase.functions.invoke("ai-task-webhook", {
        body: { action: "complete", task_id: agentRunnerResult.task_id },
      });
      if (error) throw error;

      toast({ title: "Task abgeschlossen", description: "Status wurde auf done gesetzt." });
      setAgentRunnerResult(null);
      refetch();
      
      // Auto-load next task if enabled
      if (autoLoadEnabled) {
        setTimeout(() => {
          fetchNextTask(currentAgent, true).then((hasTask) => {
            if (hasTask) {
              toast({ 
                title: "🚀 Nächster Task geladen", 
                description: `Auto-Load: ${currentAgent.toUpperCase()} Task bereit.` 
              });
            }
          });
        }, 500);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unbekannter Fehler";
      toast({ title: "Fehler", description: message, variant: "destructive" });
    }
  };

  // Realtime subscription for task updates
  useEffect(() => {
    const channel = supabase
      .channel('ai-task-queue-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_task_queue',
        },
        (payload) => {
          console.log('[Realtime] Task change:', payload);
          refetch();
          
          // If a task was just marked done and auto-load is on, we already handle it in markRunnerTaskDone
          // This catches external changes (e.g., from Zapier or direct DB edits)
          if (payload.eventType === 'INSERT' && autoLoadEnabled) {
            const newTask = payload.new as AITask;
            if (newTask.status === 'pending' && !agentRunnerResult) {
              toast({
                title: "📥 Neuer Task eingegangen",
                description: `${newTask.agent.toUpperCase()}: ${newTask.title}`,
              });
            }
          }
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === 'SUBSCRIBED');
        console.log('[Realtime] Status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [autoLoadEnabled, agentRunnerResult, refetch, toast]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            🤖 AI Task Queue
          </h1>
          <p className="text-muted-foreground mt-1">Zapier → ChatGPT → Codex/Copilot Workflow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Aktualisieren
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Neue Task
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Neue Task erstellen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Agent</label>
                    <Select value={newTask.agent} onValueChange={(v) => setNewTask(t => ({ ...t, agent: v }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="codex">🔵 CODEX (Features)</SelectItem>
                        <SelectItem value="copilot">🟣 COPILOT (Styling)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Priorität</label>
                    <Select value={String(newTask.priority)} onValueChange={(v) => setNewTask(t => ({ ...t, priority: Number(v) }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">🔴 Kritisch (10)</SelectItem>
                        <SelectItem value="7">🟠 Hoch (7)</SelectItem>
                        <SelectItem value="5">🟡 Normal (5)</SelectItem>
                        <SelectItem value="3">🟢 Niedrig (3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Titel</label>
                  <Input
                    value={newTask.title}
                    onChange={(e) => setNewTask(t => ({ ...t, title: e.target.value }))}
                    placeholder="z.B. Hero Section Animation hinzufügen"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Beschreibung (optional)</label>
                  <Input
                    value={newTask.description}
                    onChange={(e) => setNewTask(t => ({ ...t, description: e.target.value }))}
                    placeholder="Kurze Beschreibung der Aufgabe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    value={newTask.prompt}
                    onChange={(e) => setNewTask(t => ({ ...t, prompt: e.target.value }))}
                    placeholder="Der vollständige Prompt für den AI-Agent..."
                    rows={8}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Zieldateien (kommagetrennt)</label>
                  <Input
                    value={newTask.target_files}
                    onChange={(e) => setNewTask(t => ({ ...t, target_files: e.target.value }))}
                    placeholder="src/components/Hero.tsx, src/pages/Index.tsx"
                  />
                </div>
                <Button onClick={handleCreateTask} disabled={createTask.isPending} className="w-full">
                  {createTask.isPending ? "Erstellen..." : "Task erstellen"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <div className="text-sm text-muted-foreground">Gesamt</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            <div>
              <div className="text-2xl font-bold">{stats?.pending || 0}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{stats?.in_progress || 0}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{stats?.done || 0}</div>
              <div className="text-sm text-muted-foreground">Done</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.codex || 0}</div>
              <div className="text-sm text-muted-foreground">Codex</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 flex items-center gap-2">
            <Palette className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-2xl font-bold">{stats?.copilot || 0}</div>
              <div className="text-sm text-muted-foreground">Copilot</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tasks">
        <TabsList>
          <TabsTrigger value="tasks">📋 Tasks</TabsTrigger>
          <TabsTrigger value="agent">🧩 Agent Runner</TabsTrigger>
          <TabsTrigger value="logs">📝 Webhook Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <Select value={agentFilter || "all"} onValueChange={(v) => setAgentFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Alle Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Agents</SelectItem>
                <SelectItem value="codex">🔵 CODEX</SelectItem>
                <SelectItem value="copilot">🟣 COPILOT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter || "all"} onValueChange={(v) => setStatusFilter(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Alle Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Status</SelectItem>
                <SelectItem value="pending">⏳ Pending</SelectItem>
                <SelectItem value="in_progress">▶️ In Progress</SelectItem>
                <SelectItem value="done">✅ Done</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks List */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Laden...</div>
          ) : !tasks?.length ? (
            <Card className="py-12">
              <CardContent className="text-center">
                <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Keine Tasks gefunden</h3>
                <p className="text-muted-foreground mt-1">
                  Zapier sendet automatisch neue Tasks oder erstelle manuell welche.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={task.agent === "codex" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}>
                            {AGENT_ICONS[task.agent]}
                            <span className="ml-1 uppercase">{task.agent}</span>
                          </Badge>
                          <Badge variant="outline" className={STATUS_COLORS[task.status || "pending"]}>
                            {task.status || "pending"}
                          </Badge>
                          {task.priority && task.priority > 5 && (
                            <Badge variant="destructive" className="text-xs">P{task.priority}</Badge>
                          )}
                          {task.source && (
                            <Badge variant="secondary" className="text-xs">{task.source}</Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-lg">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                        )}
                        {task.target_files && task.target_files.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {task.target_files.map((file, i) => (
                              <Badge key={i} variant="outline" className="text-xs font-mono">
                                {file}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-2">
                          Erstellt: {task.created_at ? format(new Date(task.created_at), "dd.MM.yyyy HH:mm", { locale: de }) : "-"}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTask(task)}>
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="default"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => copyPromptForVSCode(task)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          → VS Code
                        </Button>
                        {task.status === "pending" && (
                          <Button size="sm" variant="default" onClick={() => updateStatus.mutate({ taskId: task.id, status: "in_progress" })}>
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                        )}
                        {task.status === "in_progress" && (
                          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus.mutate({ taskId: task.id, status: "done" })}>
                            <Check className="h-4 w-4 mr-1" />
                            Done
                          </Button>
                        )}
                        <Button size="sm" variant="destructive" onClick={() => deleteTask.mutate(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="agent" className="mt-4 space-y-4">
          {/* Task Generator Section */}
          <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                🧠 Task Generator (Hybrid-Modus)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Generiert automatisch CODEX + COPILOT Tasks basierend auf Flow-Analysen, Issues und deinen Notes
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="founder-notes" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Founder Notes (optional, wird priorisiert)
                </Label>
                <Textarea
                  id="founder-notes"
                  value={founderNotes}
                  onChange={(e) => setFounderNotes(e.target.value)}
                  placeholder="z.B. 'Focus auf Mobile CTA-Button', 'Trust-Signale auf Homepage verbessern', 'Firmenumzug-Flow optimieren'..."
                  rows={3}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  disabled={isGenerating}
                  onClick={async () => {
                    setIsGenerating(true);
                    setGeneratorResult(null);
                    try {
                      const { data, error } = await supabase.functions.invoke("generate-ai-tasks", {
                        body: { founder_notes: founderNotes || undefined },
                      });

                      if (error) throw error;
                      
                      setGeneratorResult(data);
                      if (data.success && data.tasks_created > 0) {
                        toast({
                          title: "🎉 Tasks generiert!",
                          description: `${data.tasks_created} neue Tasks wurden erstellt.`,
                        });
                        refetch();
                      } else {
                        toast({
                          title: "Keine Tasks erstellt",
                          description: data.error || "ChatGPT konnte keine Tasks generieren.",
                          variant: "destructive",
                        });
                      }
                    } catch (e) {
                      const message = e instanceof Error ? e.message : "Unbekannter Fehler";
                      toast({ title: "Fehler", description: message, variant: "destructive" });
                    } finally {
                      setIsGenerating(false);
                    }
                  }}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      ChatGPT analysiert...
                    </>
                  ) : (
                    <>
                      <Brain className="h-5 w-5 mr-2" />
                      🚀 Tasks generieren
                    </>
                  )}
                </Button>
              </div>

              {/* Generator Result */}
              {generatorResult && (
                <Card className={generatorResult.success ? "border-green-500/30 bg-green-500/5" : "border-red-500/30 bg-red-500/5"}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      {generatorResult.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className="font-semibold">
                        {generatorResult.tasks_created} Tasks erstellt
                      </span>
                    </div>
                    
                    {generatorResult.summary && (
                      <p className="text-sm">{generatorResult.summary}</p>
                    )}
                    
                    {generatorResult.priority_reasoning && (
                      <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                        <strong>Begründung:</strong> {generatorResult.priority_reasoning}
                      </div>
                    )}

                    {generatorResult.context_used && (
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Badge variant="outline">📊 {generatorResult.context_used.flows_analyzed} Flows</Badge>
                        <Badge variant="outline">🐛 {generatorResult.context_used.issues_considered} Issues</Badge>
                        {generatorResult.context_used.low_score_alerts > 0 && (
                          <Badge variant="destructive" className="flex items-center gap-1">
                            <TrendingDown className="h-3 w-3" />
                            {generatorResult.context_used.low_score_alerts} Low-Score Alerts
                          </Badge>
                        )}
                        {generatorResult.context_used.founder_notes_included && (
                          <Badge className="bg-amber-500/20 text-amber-700 border-amber-500/30">✨ Founder Notes</Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>

          {/* Agent Runner Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  Agent Runner
                  {realtimeConnected && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30 animate-pulse">
                      <Radio className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="auto-load"
                      checked={autoLoadEnabled}
                      onCheckedChange={setAutoLoadEnabled}
                    />
                    <Label htmlFor="auto-load" className="text-sm flex items-center gap-1">
                      <Zap className="h-4 w-4 text-amber-500" />
                      Auto-Load
                    </Label>
                  </div>
                </div>
              </div>
              {autoLoadEnabled && (
                <p className="text-sm text-muted-foreground mt-1">
                  Nach "Done" wird automatisch der nächste Task vom gleichen Agent geladen
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">{AGENT_ICONS.codex} <span className="ml-1">CODEX</span></Badge>
                        <span className="text-sm text-muted-foreground">Nächsten Task holen</span>
                      </div>
                      <Button
                        onClick={() => fetchNextTask("codex")}
                        disabled={agentRunnerLoading !== null}
                      >
                        {agentRunnerLoading === "codex" ? "Lade..." : "Next"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-secondary text-secondary-foreground border-border">{AGENT_ICONS.copilot} <span className="ml-1">COPILOT</span></Badge>
                        <span className="text-sm text-muted-foreground">Nächsten Task holen</span>
                      </div>
                      <Button
                        onClick={() => fetchNextTask("copilot")}
                        disabled={agentRunnerLoading !== null}
                      >
                        {agentRunnerLoading === "copilot" ? "Lade..." : "Next"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {agentRunnerResult && (
                <Card className="border-dashed">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={
                              agentRunnerResult.agent === "codex"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-secondary text-secondary-foreground border-border"
                            }
                          >
                            {AGENT_ICONS[agentRunnerResult.agent]} <span className="ml-1 uppercase">{agentRunnerResult.agent}</span>
                          </Badge>
                          <Badge variant="outline" className="font-mono text-xs">{agentRunnerResult.task_id}</Badge>
                        </div>
                        <h3 className="font-semibold mt-2">{agentRunnerResult.title}</h3>
                        {agentRunnerResult.target_files?.length ? (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {agentRunnerResult.target_files.map((f, i) => (
                              <Badge key={i} variant="outline" className="text-xs font-mono">{f}</Badge>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button 
                          size="lg"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
                          onClick={() => copyPromptForVSCode({
                            prompt: agentRunnerResult.prompt,
                            title: agentRunnerResult.title,
                            agent: agentRunnerResult.agent,
                            target_files: agentRunnerResult.target_files,
                          })}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          📋 Copy für VS Code
                        </Button>
                        <Button variant="outline" onClick={markRunnerTaskDone}>
                          <Check className="h-4 w-4 mr-2" />
                          ✅ Done & Nächster
                        </Button>
                      </div>
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">{agentRunnerResult.prompt}</pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Letzte Webhook-Aufrufe</CardTitle>
            </CardHeader>
            <CardContent>
              {!logs?.length ? (
                <div className="text-center py-8 text-muted-foreground">
                  Noch keine Webhook-Logs. Sobald Zapier den Webhook aufruft, erscheinen hier die Details.
                </div>
              ) : (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Zeit</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Methode</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="text-sm">
                            {format(new Date(log.created_at), "dd.MM. HH:mm:ss")}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.method}</Badge>
                          </TableCell>
                          <TableCell>
                            {log.success ? (
                              <Badge className="bg-green-100 text-green-700">✅ OK</Badge>
                            ) : (
                              <Badge variant="destructive">❌ Error</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {log.error_message && (
                              <span className="text-red-600 text-xs">{log.error_message}</span>
                            )}
                            {log.payload && (
                              <Button size="sm" variant="ghost" onClick={() => {
                                navigator.clipboard.writeText(JSON.stringify(log.payload, null, 2));
                                toast({ title: "Payload kopiert" });
                              }}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Detail Dialog */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTask && AGENT_ICONS[selectedTask.agent]}
              {selectedTask?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Prompt:</h4>
                  <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">
                    {selectedTask.prompt}
                  </pre>
                </div>
                <Button onClick={() => copyPrompt(selectedTask.prompt)} className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Prompt in Zwischenablage kopieren
                </Button>
                {selectedTask.output_summary && (
                  <div>
                    <h4 className="font-medium mb-2">Output Summary:</h4>
                    <p className="text-sm text-muted-foreground">{selectedTask.output_summary}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
=======
import { useCallback, useEffect, useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";

type AgentType = "codex" | "copilot";

interface PendingTask {
  id: string;
  title: string;
  priority?: number | null;
  created_at?: string | null;
}

interface PendingQueuePayload {
  count: number;
  codex: PendingTask[];
  copilot: PendingTask[];
}

interface AgentRunnerTask {
  task_id?: string;
  title?: string;
  prompt?: string;
  target_files?: string[];
  message?: string;
}

const AGENT_LABELS: Record<AgentType, string> = {
  codex: "CODEX",
  copilot: "COPILOT"
};

const formatDate = (value?: string | null) => {
  if (!value) return "";
  return new Date(value).toLocaleString("de-CH", {
    dateStyle: "short",
    timeStyle: "short"
  });
};

const AgentQueueCard = ({
  label,
  tasks
}: {
  label: string;
  tasks: PendingTask[];
}) => (
  <Card className="min-w-[240px] border">
    <CardHeader>
      <CardTitle>{label}</CardTitle>
      <CardDescription>
        {tasks.length === 0 ? "Keine offenen Tasks" : `${tasks.length} pending`}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sobald neue Tasks eintreffen, werden sie hier angezeigt.
        </p>
      ) : (
        tasks.slice(0, 4).map((task) => (
          <div key={task.id} className="space-y-1 rounded-md border border-border px-3 py-2">
            <p className="text-sm font-semibold leading-snug text-foreground">
              {task.title}
            </p>
            <p className="text-xs text-muted-foreground flex flex-wrap gap-2">
              <span className="uppercase tracking-[0.4px]">#{task.id.slice(0, 6)}</span>
              <span>Priorität {task.priority ?? "—"}</span>
              {task.created_at && <span>{formatDate(task.created_at)}</span>}
            </p>
          </div>
        ))
      )}
    </CardContent>
  </Card>
);

const TaskQueue = () => {
  const [queueData, setQueueData] = useState<PendingQueuePayload | null>(null);
  const [queueLoading, setQueueLoading] = useState(false);
  const [agent, setAgent] = useState<AgentType>("codex");
  const [currentTask, setCurrentTask] = useState<AgentRunnerTask | null>(null);
  const [runnerMessage, setRunnerMessage] = useState("");
  const [runnerLoading, setRunnerLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completionSummary, setCompletionSummary] = useState("");
  const [filesTouched, setFilesTouched] = useState("");
  const [activeTab, setActiveTab] = useState<"queue" | "agent-runner">("queue");

  const fetchQueue = useCallback(async () => {
    setQueueLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-task-webhook/pending", {
        method: "GET"
      });
      if (error) throw error;
      setQueueData(data || null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Fehler beim Laden der Queue";
      toast.error(message);
    } finally {
      setQueueLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (activeTab === "queue") {
      fetchQueue();
    }
  }, [activeTab, fetchQueue]);

  const handleFetchNext = useCallback(async () => {
    setRunnerLoading(true);
    setRunnerMessage("");
    try {
      const path = `ai-task-webhook/next?agent=${agent}`;
      const { data, error } = await supabase.functions.invoke(path, { method: "GET" });
      if (error) throw error;
      if (!data?.task_id) {
        setCurrentTask(null);
        setRunnerMessage(data?.message || "Keine pending Tasks mehr vorhanden.");
        return;
      }
      setCurrentTask({
        task_id: data.task_id,
        title: data.title,
        prompt: data.prompt,
        target_files: data.target_files,
        message: data.message
      });
      setRunnerMessage("Task geladen. Kopiere den Prompt und starte den Agenten.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Next-Task fehlgeschlagen";
      toast.error(message);
      setRunnerMessage(message);
    } finally {
      setRunnerLoading(false);
    }
  }, [agent]);

  const handleCompleteTask = useCallback(async () => {
    if (!currentTask?.task_id) {
      toast.error("Kein Task ausgewählt.");
      return;
    }
    setCompleteLoading(true);
    try {
      const files = filesTouched
        .split(",")
        .map((file) => file.trim())
        .filter(Boolean);

      const { error } = await supabase.functions.invoke("ai-task-webhook/complete", {
        method: "POST",
        body: {
          task_id: currentTask.task_id,
          output_summary: completionSummary || "Task erledigt",
          files_changed: files
        }
      });

      if (error) throw error;
      toast.success("Task als done markiert.");
      setCompletionSummary("");
      setFilesTouched("");
      setCurrentTask(null);
      setRunnerMessage("Task abgeschlosssen. Hole den nächsten mit \"Next\".");
      fetchQueue();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Task konnte nicht abgeschlossen werden.";
      toast.error(message);
    } finally {
      setCompleteLoading(false);
    }
  }, [completionSummary, currentTask, filesTouched, fetchQueue]);

  const agentPrompt = useMemo(() => currentTask?.prompt, [currentTask]);

  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div className="space-y-1">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Task Queue
          </p>
          <h1 className="text-3xl font-semibold text-foreground">AI-Agenten steuern</h1>
          <p className="text-sm text-muted-foreground">
            Greife direkt aus der UI auf neue CODEX/COPILOT Aufgaben zu, markiere sie als done
            und beobachte den aktuellen Queue-Status.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "queue" | "agent-runner")} className="space-y-4">
          <TabsList>
            <TabsTrigger value="queue">Task Queue</TabsTrigger>
            <TabsTrigger value="agent-runner">🧩 Agent Runner</TabsTrigger>
          </TabsList>

          <TabsContent value="queue">
            <Card className="border">
              <CardHeader className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Queue Überblick</CardTitle>
                  <CardDescription>
                    Insgesamt {queueData?.count ?? "–"} offene Tasks. Aktualisiert bei Tab-Wechsel.
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchQueue}
                  disabled={queueLoading}
                >
                  {queueLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Aktualisieren
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AgentQueueCard label="CODEX" tasks={queueData?.codex ?? []} />
                  <AgentQueueCard label="COPILOT" tasks={queueData?.copilot ?? []} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agent-runner">
            <Card className="border">
              <CardHeader>
                <CardTitle>Agent Runner</CardTitle>
                <CardDescription>
                  Hole per invoke den nächsten Task ohne externe URLs und markiere ihn als erledigt.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex flex-wrap items-end gap-3">
                  <div className="min-w-[200px]">
                    <Label htmlFor="agent-select">Agent</Label>
                    <Select value={agent} onValueChange={(value) => setAgent(value as AgentType)}>
                      <SelectTrigger id="agent-select" className="w-full">
                        <SelectValue placeholder="Agent wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="codex">CODEX</SelectItem>
                        <SelectItem value="copilot">COPILOT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleFetchNext} disabled={runnerLoading}>
                    {runnerLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Next
                  </Button>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <RefreshCw className="h-4 w-4" />
                    Queue-Status: {queueData?.count ?? "–"}
                  </div>
                </div>

                {runnerMessage && (
                  <div className="rounded-md border border-border bg-muted px-4 py-3 text-sm text-muted-foreground">
                    {runnerMessage}
                  </div>
                )}

                {currentTask ? (
                  <div className="space-y-4 rounded-md border border-border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-lg font-semibold text-foreground">
                          {currentTask.title || "Unbenannter Task"}
                        </p>
                        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                          {AGENT_LABELS[agent]}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        #{currentTask.task_id?.slice(0, 6) || "ID-unbekannt"}
                      </p>
                    </div>
                    {currentTask.message && (
                      <p className="text-sm text-muted-foreground">{currentTask.message}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {(currentTask.target_files ?? []).map((target) => (
                        <span
                          key={target}
                          className="rounded-full border border-border px-3 py-0.5 text-xs font-medium text-foreground/80"
                        >
                          {target}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-1 text-sm">
                      <Label>Prompt</Label>
                      <pre className="max-h-64 overflow-auto rounded border border-border bg-muted p-3 text-xs leading-relaxed whitespace-pre-wrap">
                        {agentPrompt || "Prompt wird hier angezeigt, sobald ein Task geladen ist."}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border border-border p-4 text-sm text-muted-foreground">
                    Drücke auf „Next“, um den nächsten Task zu laden.
                  </div>
                )}

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Files geändert (Komma getrennt)</Label>
                    <Input
                      placeholder="src/pages/admin/Example.tsx, src/lib/showcase.ts"
                      value={filesTouched}
                      onChange={(event) => setFilesTouched(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Output Summary</Label>
                    <Textarea
                      value={completionSummary}
                      onChange={(event) => setCompletionSummary(event.target.value)}
                      placeholder="Kurze Zusammenfassung, was verändert wurde ..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={handleCompleteTask}
                    disabled={!currentTask || completeLoading}
                  >
                    {completeLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Mark as done
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setCurrentTask(null);
                      setCompletionSummary("");
                      setFilesTouched("");
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TaskQueue;
>>>>>>> Stashed changes
