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
import { Loader2, RefreshCw, Brain, Sparkles, History, CheckCircle2 } from "lucide-react";

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

interface CompletedTask {
  id: string;
  agent: string;
  title: string;
  output_summary: string | null;
  files_changed: string[] | null;
  completed_at: string | null;
  started_at: string | null;
  source: string | null;
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
  const [generateLoading, setGenerateLoading] = useState(false);
  const [agent, setAgent] = useState<AgentType>("codex");
  const [currentTask, setCurrentTask] = useState<AgentRunnerTask | null>(null);
  const [runnerMessage, setRunnerMessage] = useState("");
  const [runnerLoading, setRunnerLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [completionSummary, setCompletionSummary] = useState("");
  const [filesTouched, setFilesTouched] = useState("");
  const [activeTab, setActiveTab] = useState<"queue" | "agent-runner" | "history">("queue");
  const [historyData, setHistoryData] = useState<CompletedTask[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

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

  const handleGenerateTasks = useCallback(async () => {
    setGenerateLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-ai-tasks", {
        method: "POST"
      });
      if (error) throw error;
      const count = data?.tasks_created ?? 0;
      toast.success(`${count} neue Tasks generiert!`);
      fetchQueue();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Task-Generierung fehlgeschlagen";
      toast.error(message);
    } finally {
      setGenerateLoading(false);
    }
  }, [fetchQueue]);

  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from("ai_task_queue")
        .select("id, agent, title, output_summary, files_changed, completed_at, started_at, source")
        .eq("status", "done")
        .order("completed_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      setHistoryData((data as CompletedTask[]) || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : "History konnte nicht geladen werden";
      toast.error(message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  useEffect(() => {
    if (activeTab === "queue") {
      fetchQueue();
    } else if (activeTab === "history") {
      fetchHistory();
    }
  }, [activeTab, fetchQueue, fetchHistory]);

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

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "queue" | "agent-runner" | "history")} className="space-y-4">
          <TabsList>
            <TabsTrigger value="queue">Task Queue</TabsTrigger>
            <TabsTrigger value="agent-runner">🧩 Agent Runner</TabsTrigger>
            <TabsTrigger value="history">📜 History</TabsTrigger>
          </TabsList>

          <TabsContent value="queue">
            <Card className="border">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Queue Überblick</CardTitle>
                  <CardDescription>
                    Insgesamt {queueData?.count ?? "–"} offene Tasks. Aktualisiert bei Tab-Wechsel.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handleGenerateTasks}
                    disabled={generateLoading}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    {generateLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Brain className="mr-2 h-4 w-4" />}
                    🧠 Tasks generieren
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchQueue}
                    disabled={queueLoading}
                  >
                    {queueLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                    Aktualisieren
                  </Button>
                </div>
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
                    Drücke auf „Next", um den nächsten Task zu laden.
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

          <TabsContent value="history">
            <Card className="border">
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Erledigte Tasks
                  </CardTitle>
                  <CardDescription>
                    {historyData.length} abgeschlossene Tasks (letzte 50)
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchHistory}
                  disabled={historyLoading}
                >
                  {historyLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                  Aktualisieren
                </Button>
              </CardHeader>
              <CardContent>
                {historyLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : historyData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Noch keine erledigten Tasks vorhanden.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyData.map((task) => (
                      <div 
                        key={task.id} 
                        className="rounded-lg border border-border p-4 space-y-3 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-md ${task.agent === 'codex' ? 'bg-blue-500/10 text-blue-600' : 'bg-green-500/10 text-green-600'}`}>
                              <CheckCircle2 className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{task.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <span className={`font-medium uppercase ${task.agent === 'codex' ? 'text-blue-600' : 'text-green-600'}`}>
                                  {task.agent.toUpperCase()}
                                </span>
                                <span>•</span>
                                <span>#{task.id.slice(0, 8)}</span>
                                {task.source && (
                                  <>
                                    <span>•</span>
                                    <span className="capitalize">{task.source}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground text-right shrink-0">
                            {task.completed_at && (
                              <div>{formatDate(task.completed_at)}</div>
                            )}
                            {task.started_at && task.completed_at && (
                              <div className="text-muted-foreground/70">
                                Dauer: {Math.round((new Date(task.completed_at).getTime() - new Date(task.started_at).getTime()) / 1000 / 60)} min
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {task.output_summary && (
                          <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3">
                            {task.output_summary}
                          </div>
                        )}
                        
                        {task.files_changed && task.files_changed.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {task.files_changed.map((file, idx) => (
                              <span 
                                key={idx}
                                className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-mono"
                              >
                                {file}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default TaskQueue;
