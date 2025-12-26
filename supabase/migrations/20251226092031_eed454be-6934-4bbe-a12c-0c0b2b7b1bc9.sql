-- AutoFlow Analysis System Schema

-- Store analysis runs (daily/manual)
CREATE TABLE public.flow_analysis_runs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id TEXT NOT NULL,
  flow_name TEXT NOT NULL,
  run_type TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'scheduled', 'triggered'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  total_steps INTEGER,
  steps_captured INTEGER DEFAULT 0,
  overall_score INTEGER, -- 0-100
  conversion_score INTEGER, -- 0-100
  performance_score INTEGER, -- 0-100
  ux_score INTEGER, -- 0-100
  accessibility_score INTEGER, -- 0-100
  ai_summary TEXT,
  ai_recommendations JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store metrics per step
CREATE TABLE public.flow_step_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID REFERENCES public.flow_analysis_runs(id) ON DELETE CASCADE,
  flow_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  step_name TEXT,
  step_url TEXT,
  
  -- Performance metrics
  load_time_ms INTEGER,
  time_to_interactive_ms INTEGER,
  first_contentful_paint_ms INTEGER,
  largest_contentful_paint_ms INTEGER,
  cumulative_layout_shift NUMERIC(5,3),
  
  -- Conversion metrics (simulated/tracked)
  estimated_drop_off_rate NUMERIC(5,2),
  estimated_completion_rate NUMERIC(5,2),
  form_fields_count INTEGER,
  required_fields_count INTEGER,
  
  -- UX metrics
  mobile_friendliness_score INTEGER,
  touch_target_issues INTEGER,
  contrast_issues INTEGER,
  
  -- Screenshots
  desktop_screenshot_url TEXT,
  mobile_screenshot_url TEXT,
  
  -- AI analysis
  ai_issues JSONB DEFAULT '[]'::jsonb,
  ai_suggestions JSONB DEFAULT '[]'::jsonb,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store detected UX issues
CREATE TABLE public.flow_ux_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID REFERENCES public.flow_analysis_runs(id) ON DELETE CASCADE,
  flow_id TEXT NOT NULL,
  step_number INTEGER,
  severity TEXT NOT NULL, -- 'critical', 'warning', 'info'
  category TEXT NOT NULL, -- 'performance', 'accessibility', 'usability', 'conversion', 'mobile'
  issue_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  recommendation TEXT,
  affected_element TEXT,
  screenshot_url TEXT,
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alert settings
CREATE TABLE public.flow_alert_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id TEXT, -- NULL = all flows
  alert_type TEXT NOT NULL, -- 'score_drop', 'new_critical_issue', 'performance_degradation'
  threshold_value NUMERIC,
  email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alert history
CREATE TABLE public.flow_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_id UUID REFERENCES public.flow_alert_settings(id) ON DELETE SET NULL,
  flow_id TEXT,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  severity TEXT NOT NULL DEFAULT 'warning',
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Scheduled analysis jobs
CREATE TABLE public.flow_scheduled_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  flow_ids TEXT[] NOT NULL,
  schedule TEXT NOT NULL, -- 'daily', 'weekly', 'hourly'
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  notify_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flow_analysis_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_step_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_ux_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_alert_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_scheduled_jobs ENABLE ROW LEVEL SECURITY;

-- RLS policies for authenticated users (admin access)
CREATE POLICY "Authenticated users can view analysis runs" ON public.flow_analysis_runs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage analysis runs" ON public.flow_analysis_runs
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view step metrics" ON public.flow_step_metrics
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage step metrics" ON public.flow_step_metrics
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view ux issues" ON public.flow_ux_issues
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage ux issues" ON public.flow_ux_issues
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view alert settings" ON public.flow_alert_settings
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage alert settings" ON public.flow_alert_settings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view alerts" ON public.flow_alerts
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage alerts" ON public.flow_alerts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view scheduled jobs" ON public.flow_scheduled_jobs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage scheduled jobs" ON public.flow_scheduled_jobs
  FOR ALL USING (auth.role() = 'authenticated');

-- Public insert for edge functions (service role)
CREATE POLICY "Service role can insert analysis runs" ON public.flow_analysis_runs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update analysis runs" ON public.flow_analysis_runs
  FOR UPDATE USING (true);

CREATE POLICY "Service role can insert step metrics" ON public.flow_step_metrics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert ux issues" ON public.flow_ux_issues
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can insert alerts" ON public.flow_alerts
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_flow_analysis_runs_flow_id ON public.flow_analysis_runs(flow_id);
CREATE INDEX idx_flow_analysis_runs_status ON public.flow_analysis_runs(status);
CREATE INDEX idx_flow_analysis_runs_created_at ON public.flow_analysis_runs(created_at DESC);
CREATE INDEX idx_flow_step_metrics_run_id ON public.flow_step_metrics(run_id);
CREATE INDEX idx_flow_step_metrics_flow_id ON public.flow_step_metrics(flow_id);
CREATE INDEX idx_flow_ux_issues_run_id ON public.flow_ux_issues(run_id);
CREATE INDEX idx_flow_ux_issues_severity ON public.flow_ux_issues(severity);
CREATE INDEX idx_flow_alerts_created_at ON public.flow_alerts(created_at DESC);