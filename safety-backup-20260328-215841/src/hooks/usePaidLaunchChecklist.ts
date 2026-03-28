/**
 * Hook for managing Paid Launch Checklist tasks
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PaidLaunchTask {
  id: string;
  site: 'feierabend' | 'umzugscheck' | 'both';
  priority: 'p0' | 'p1' | 'p2';
  category: 'tracking' | 'landing' | 'copy' | 'dev' | 'ops';
  title: string;
  goal: string | null;
  change_description: string | null;
  acceptance_criteria: string[] | null;
  owner: 'dev' | 'tracking' | 'copy' | 'ops' | null;
  complexity: 's' | 'm' | 'l' | null;
  status: 'todo' | 'in_progress' | 'done' | 'blocked';
  blocked_reason: string | null;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ChecklistStats {
  total: number;
  done: number;
  p0Total: number;
  p0Done: number;
  p1Total: number;
  p1Done: number;
  p2Total: number;
  p2Done: number;
  byCategory: Record<string, { total: number; done: number }>;
}

export function usePaidLaunchTasks(filters?: { priority?: string; category?: string; status?: string }) {
  return useQuery({
    queryKey: ["paid-launch-checklist", filters],
    queryFn: async () => {
      let query = supabase
        .from("paid_launch_checklist")
        .select("*")
        .order("priority", { ascending: true })
        .order("created_at", { ascending: true });

      if (filters?.priority) {
        query = query.eq("priority", filters.priority);
      }
      if (filters?.category) {
        query = query.eq("category", filters.category);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as PaidLaunchTask[];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function usePaidLaunchStats() {
  return useQuery({
    queryKey: ["paid-launch-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paid_launch_checklist")
        .select("priority, category, status");

      if (error) throw error;

      const tasks = data as Pick<PaidLaunchTask, 'priority' | 'category' | 'status'>[];
      
      const stats: ChecklistStats = {
        total: tasks.length,
        done: tasks.filter(t => t.status === 'done').length,
        p0Total: tasks.filter(t => t.priority === 'p0').length,
        p0Done: tasks.filter(t => t.priority === 'p0' && t.status === 'done').length,
        p1Total: tasks.filter(t => t.priority === 'p1').length,
        p1Done: tasks.filter(t => t.priority === 'p1' && t.status === 'done').length,
        p2Total: tasks.filter(t => t.priority === 'p2').length,
        p2Done: tasks.filter(t => t.priority === 'p2' && t.status === 'done').length,
        byCategory: {},
      };

      // Calculate by category
      const categories = ['tracking', 'landing', 'copy', 'dev', 'ops'];
      categories.forEach(cat => {
        const catTasks = tasks.filter(t => t.category === cat);
        stats.byCategory[cat] = {
          total: catTasks.length,
          done: catTasks.filter(t => t.status === 'done').length,
        };
      });

      return stats;
    },
    refetchInterval: 30000,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ taskId, status }: { taskId: string; status: PaidLaunchTask['status'] }) => {
      const updateData: Record<string, unknown> = { status };
      
      if (status === 'done') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      const { error } = await supabase
        .from("paid_launch_checklist")
        .update(updateData)
        .eq("id", taskId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paid-launch-checklist"] });
      queryClient.invalidateQueries({ queryKey: ["paid-launch-stats"] });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}

export function useCopyTaskToAIQueue() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (task: PaidLaunchTask) => {
      const { error } = await supabase
        .from("ai_task_queue")
        .insert({
          agent: 'copilot',
          title: `[PAID-LAUNCH] ${task.title}`,
          description: task.goal || null,
          prompt: task.change_description || task.title,
          target_files: inferTargetFiles(task),
          priority: task.priority === 'p0' ? 10 : task.priority === 'p1' ? 5 : 2,
          source: 'paid-launch-cockpit',
          status: 'pending',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-task-queue"] });
      toast({ title: "Task zu AI Queue hinzugefügt", description: "Der Task wurde erfolgreich kopiert." });
    },
    onError: (error) => {
      toast({ title: "Fehler", description: error.message, variant: "destructive" });
    },
  });
}

function inferTargetFiles(task: PaidLaunchTask): string[] {
  const files: string[] = [];
  
  // Infer based on category and title keywords
  if (task.category === 'tracking') {
    files.push('src/lib/attribution-tracking.ts');
    if (task.title.toLowerCase().includes('ga4') || task.title.toLowerCase().includes('google')) {
      files.push('src/lib/google-analytics.ts');
    }
  }
  
  if (task.category === 'landing' || task.title.toLowerCase().includes('landing')) {
    files.push('src/pages/paid/');
  }
  
  if (task.title.toLowerCase().includes('/danke') || task.title.toLowerCase().includes('thank')) {
    files.push('src/pages/Danke.tsx');
  }
  
  if (task.title.toLowerCase().includes('form') || task.title.toLowerCase().includes('expressquote')) {
    files.push('src/components/forms/');
  }
  
  if (task.title.toLowerCase().includes('consent')) {
    files.push('src/lib/consent-mode.ts');
  }
  
  return files;
}
