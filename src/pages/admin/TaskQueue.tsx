import { useState } from "react";
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
import { useAITasks, useWebhookLogs, useCreateTask, useUpdateTaskStatus, useDeleteTask, useTaskStats, AITask, WebhookLog } from "@/hooks/useAITaskQueue";
import { Plus, RefreshCw, Check, Trash2, Play, Copy, Clock, AlertCircle, CheckCircle, Code, Palette, ExternalLink } from "lucide-react";
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

  const copyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    toast({ title: "Prompt kopiert", description: "In Zwischenablage kopiert" });
  };

  const fetchNextTask = async (agent: "codex" | "copilot") => {
    setAgentRunnerLoading(agent);
    try {
      const { data, error } = await supabase.functions.invoke("ai-task-webhook", {
        body: { action: "next", agent },
      });

      if (error) throw error;
      if (!data?.task_id || !data?.prompt) {
        toast({
          title: "Keine pending Tasks",
          description: data?.message || `Keine pending Tasks für ${agent}.`,
        });
        setAgentRunnerResult(null);
        return;
      }

      setAgentRunnerResult({
        agent,
        task_id: data.task_id,
        title: data.title,
        prompt: data.prompt,
        target_files: data.target_files ?? null,
      });
      toast({ title: "Task geladen", description: `Nächster ${agent.toUpperCase()} Task ist bereit.` });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unbekannter Fehler";
      toast({ title: "Fehler", description: message, variant: "destructive" });
    } finally {
      setAgentRunnerLoading(null);
    }
  };

  const markRunnerTaskDone = async () => {
    if (!agentRunnerResult?.task_id) return;
    try {
      const { error } = await supabase.functions.invoke("ai-task-webhook", {
        body: { action: "complete", task_id: agentRunnerResult.task_id },
      });
      if (error) throw error;

      toast({ title: "Task abgeschlossen", description: "Status wurde auf done gesetzt." });
      setAgentRunnerResult(null);
      refetch();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unbekannter Fehler";
      toast({ title: "Fehler", description: message, variant: "destructive" });
    }
  };

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
                        <Button size="sm" variant="outline" onClick={() => copyPrompt(task.prompt)}>
                          <Copy className="h-4 w-4 mr-1" />
                          Prompt
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

        <TabsContent value="agent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Agent Runner (ohne externe URL)</CardTitle>
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
                        <Button variant="outline" onClick={() => copyPrompt(agentRunnerResult.prompt)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Prompt kopieren
                        </Button>
                        <Button onClick={markRunnerTaskDone}>
                          <Check className="h-4 w-4 mr-2" />
                          Als done markieren
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
