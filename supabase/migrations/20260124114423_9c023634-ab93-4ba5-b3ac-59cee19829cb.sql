-- AI Task Queue für automatisierte Agent-Tasks
CREATE TABLE IF NOT EXISTS public.ai_task_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent TEXT NOT NULL CHECK (agent IN ('codex', 'copilot')),
  title TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  target_files TEXT[] DEFAULT '{}',
  priority INTEGER DEFAULT 5,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'done', 'cancelled')),
  source TEXT DEFAULT 'zapier',
  zapier_run_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  output_summary TEXT,
  files_changed TEXT[]
);

-- Index für schnelle Agent-Abfragen
CREATE INDEX IF NOT EXISTS idx_ai_task_queue_agent_status ON public.ai_task_queue(agent, status);
CREATE INDEX IF NOT EXISTS idx_ai_task_queue_priority ON public.ai_task_queue(priority DESC, created_at ASC);

-- RLS aktivieren (Admin-only Zugriff)
ALTER TABLE public.ai_task_queue ENABLE ROW LEVEL SECURITY;

-- Policy: Nur authentifizierte Benutzer können lesen
CREATE POLICY "Authenticated users can read ai_task_queue"
  ON public.ai_task_queue FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Nur authentifizierte Benutzer können Tasks erstellen/updaten
CREATE POLICY "Authenticated users can manage ai_task_queue"
  ON public.ai_task_queue FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anon kann via Edge Function Tasks erstellen (Zapier Webhook)
CREATE POLICY "Anon can insert via webhook"
  ON public.ai_task_queue FOR INSERT
  TO anon
  WITH CHECK (source = 'zapier');