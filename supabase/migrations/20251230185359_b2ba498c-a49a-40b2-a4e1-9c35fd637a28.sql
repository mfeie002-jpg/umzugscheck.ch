-- ============================================================================
-- FLOW ARCHETYPE SCORES TABLE
-- Stores per-archetype scores for each analysis run
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.flow_archetype_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  run_id UUID REFERENCES public.flow_analysis_runs(id) ON DELETE CASCADE,
  flow_id TEXT NOT NULL,
  archetype TEXT NOT NULL, -- 'securitySeeker', 'efficiencyMaximizer', 'valueHunter', 'overwhelmedParent'
  archetype_name TEXT NOT NULL, -- 'Sicherheits-Sucher', etc.
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  reasoning TEXT,
  missing_elements JSONB DEFAULT '[]'::jsonb,
  improvements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient queries
CREATE INDEX IF NOT EXISTS idx_flow_archetype_scores_run_id ON public.flow_archetype_scores(run_id);
CREATE INDEX IF NOT EXISTS idx_flow_archetype_scores_flow_id ON public.flow_archetype_scores(flow_id);

-- Enable RLS
ALTER TABLE public.flow_archetype_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated users can view archetype scores"
  ON public.flow_archetype_scores FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage archetype scores"
  ON public.flow_archetype_scores FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can manage archetype scores"
  ON public.flow_archetype_scores FOR ALL
  USING (true);

-- ============================================================================
-- ADD MISSING COLUMNS TO flow_ux_issues FOR DEDUPLICATION
-- ============================================================================

-- Add affected_elements array for deduplication
ALTER TABLE public.flow_ux_issues 
  ADD COLUMN IF NOT EXISTS affected_elements JSONB DEFAULT '[]'::jsonb;

-- Add effort and impact columns
ALTER TABLE public.flow_ux_issues 
  ADD COLUMN IF NOT EXISTS effort TEXT DEFAULT 'medium';

ALTER TABLE public.flow_ux_issues 
  ADD COLUMN IF NOT EXISTS impact TEXT DEFAULT 'medium';

-- ============================================================================
-- ADD MISSING COLUMNS TO flow_analysis_runs
-- ============================================================================

-- Add mobile_score and trust_score
ALTER TABLE public.flow_analysis_runs 
  ADD COLUMN IF NOT EXISTS mobile_score INTEGER;

ALTER TABLE public.flow_analysis_runs 
  ADD COLUMN IF NOT EXISTS trust_score INTEGER;

-- Add badge for quick reference
ALTER TABLE public.flow_analysis_runs 
  ADD COLUMN IF NOT EXISTS score_badge TEXT;

-- Add movu comparison data
ALTER TABLE public.flow_analysis_runs 
  ADD COLUMN IF NOT EXISTS movu_comparison JSONB DEFAULT '{"betterThan": [], "worseThan": []}'::jsonb;

-- Add quick wins array
ALTER TABLE public.flow_analysis_runs 
  ADD COLUMN IF NOT EXISTS quick_wins JSONB DEFAULT '[]'::jsonb;

-- Add strengths array
ALTER TABLE public.flow_analysis_runs 
  ADD COLUMN IF NOT EXISTS strengths JSONB DEFAULT '[]'::jsonb;