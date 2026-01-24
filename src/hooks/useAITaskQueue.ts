import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AITask {
  id: string;
  agent: string;
  title: string;
  description: string | null;
  prompt: string;
  status: string | null;
  priority: number | null;
  source: string | null;
  target_files: string[] | null;
  files_changed: string[] | null;
  output_summary: string | null;
  zapier_run_id: string | null;
  created_at: string | null;
  started_at: string | null;
  completed_at: string | null;
}

export interface WebhookLog {
  id: string;
  created_at: string;
  endpoint: string;
  method: string;
  payload: Record<string, unknown> | null;
  success: boolean;
  error_message: string | null;
  response_data: Record<string, unknown> | null;
  source_ip: string | null;
}

export function useAITasks(filters?: { agent?: string; status?: string }) {
  return useQuery({
    queryKey: ["ai-task-queue", filters],
    queryFn: async () => {
      let query = supabase
        .from("ai_task_queue")
        .select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });

      if (filters?.agent) {
        query = query.eq("agent", filters.agent);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as AITask[];
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

export function useWebhookLogs(limit = 20) {
  return useQuery({
    queryKey: ["ai-webhook-logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_task_webhook_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as WebhookLog[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (task: {
      agent: string;
      title: string;
      description?: string;
      prompt: string;
      target_files?: string[];
      priority?: number;
    }) => {
      const { data, error } = await supabase
        .from("ai_task_queue")
        .insert({
          agent: task.agent,
          title: task.title,
          description: task.description || null,
          prompt: task.prompt,
          target_files: task.target_files || [],
          priority: task.priority || 5,
          source: "manual",
          status: "pending",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-task-queue"] });
      toast({ title: "Task erstellt", description: "Der neue Task wurde hinzugefügt." });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ taskId, status, output_summary }: { taskId: string; status: string; output_summary?: string }) => {
      const updateData: Record<string, unknown> = { status };
      
      if (status === "in_progress") {
        updateData.started_at = new Date().toISOString();
      } else if (status === "done") {
        updateData.completed_at = new Date().toISOString();
        if (output_summary) {
          updateData.output_summary = output_summary;
        }
      }

      const { error } = await supabase
        .from("ai_task_queue")
        .update(updateData)
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-task-queue"] });
      toast({ title: "Status aktualisiert" });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("ai_task_queue")
        .delete()
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-task-queue"] });
      toast({ title: "Task gelöscht" });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}

export function useTaskStats() {
  return useQuery({
    queryKey: ["ai-task-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_task_queue")
        .select("agent, status");

      if (error) throw error;

      const stats = {
        total: data.length,
        pending: data.filter((t) => t.status === "pending").length,
        in_progress: data.filter((t) => t.status === "in_progress").length,
        done: data.filter((t) => t.status === "done").length,
        codex: data.filter((t) => t.agent === "codex").length,
        copilot: data.filter((t) => t.agent === "copilot").length,
      };

      return stats;
    },
    refetchInterval: 10000,
  });
}
