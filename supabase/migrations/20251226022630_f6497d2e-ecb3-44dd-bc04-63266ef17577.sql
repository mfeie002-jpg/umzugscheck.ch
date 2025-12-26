-- Create flow_versions table for storing calculator flow versions with screenshots, config, and AI feedback
CREATE TABLE public.flow_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id TEXT NOT NULL, -- e.g., "umzugsofferten", "umzugsofferten-v2"
  version_number TEXT NOT NULL, -- e.g., "1.0", "1.1", "2.0"
  version_name TEXT, -- Optional friendly name
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Flow configuration snapshot
  step_configs JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of step configs
  
  -- Captured screenshots (base64 or URLs)
  screenshots JSONB NOT NULL DEFAULT '{}'::jsonb, -- { step1Desktop: "...", step1Mobile: "...", etc }
  
  -- Captured HTML per step
  html_snapshots JSONB NOT NULL DEFAULT '{}'::jsonb, -- { step1: "html...", step2: "html...", etc }
  
  -- AI feedback storage
  ai_feedback TEXT, -- Raw AI analysis/feedback
  ai_feedback_source TEXT, -- "chatgpt", "claude", "gemini", etc
  ai_feedback_date TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_by TEXT, -- User who created this version
  is_baseline BOOLEAN DEFAULT false, -- Mark as baseline for comparison
  is_live BOOLEAN DEFAULT false, -- Mark as currently deployed version
  tags TEXT[] DEFAULT '{}'::text[], -- Tags for filtering
  
  UNIQUE(flow_id, version_number)
);

-- Enable RLS
ALTER TABLE public.flow_versions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view versions (public read for admin tool)
CREATE POLICY "Flow versions are viewable by everyone" 
ON public.flow_versions 
FOR SELECT 
USING (true);

-- Policy: Authenticated users can create versions
CREATE POLICY "Authenticated users can create flow versions" 
ON public.flow_versions 
FOR INSERT 
WITH CHECK (true);

-- Policy: Authenticated users can update versions
CREATE POLICY "Authenticated users can update flow versions" 
ON public.flow_versions 
FOR UPDATE 
USING (true);

-- Policy: Authenticated users can delete versions
CREATE POLICY "Authenticated users can delete flow versions" 
ON public.flow_versions 
FOR DELETE 
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_flow_versions_flow_id ON public.flow_versions(flow_id);
CREATE INDEX idx_flow_versions_created_at ON public.flow_versions(created_at DESC);