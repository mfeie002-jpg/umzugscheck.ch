-- Create analysis queue table
CREATE TABLE public.flow_analysis_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_version TEXT NOT NULL, -- e.g., 'v1', 'v2', etc.
  flow_id TEXT NOT NULL, -- e.g., 'umzugsofferten-v1'
  priority INTEGER NOT NULL DEFAULT 0, -- Higher = more priority
  status TEXT NOT NULL DEFAULT 'queued', -- queued, processing, completed, failed
  queued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  result_run_id UUID, -- Reference to flow_analysis_runs.id
  created_by TEXT
);

-- Enable RLS
ALTER TABLE public.flow_analysis_queue ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Authenticated users can view queue" 
  ON public.flow_analysis_queue 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage queue" 
  ON public.flow_analysis_queue 
  FOR ALL 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage queue" 
  ON public.flow_analysis_queue 
  FOR ALL 
  USING (true);

-- Index for efficient queue processing
CREATE INDEX idx_flow_analysis_queue_status ON public.flow_analysis_queue(status, priority DESC, queued_at ASC);