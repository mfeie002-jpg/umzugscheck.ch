-- Create estimate_sessions table for funnel tracking
CREATE TABLE IF NOT EXISTS public.estimate_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Move details input
  move_details JSONB NOT NULL,
  
  -- Calculation results
  estimate JSONB NOT NULL,
  
  -- Matching company IDs
  matching_company_ids UUID[] DEFAULT ARRAY[]::UUID[],
  
  -- Session metadata
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

-- Enable RLS
ALTER TABLE public.estimate_sessions ENABLE ROW LEVEL SECURITY;

-- Anyone can create estimate sessions
CREATE POLICY "Anyone can create estimate sessions"
  ON public.estimate_sessions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can view estimate sessions (for the funnel)
CREATE POLICY "Anyone can view estimate sessions"
  ON public.estimate_sessions
  FOR SELECT
  TO public
  USING (true);

-- Add index for faster lookups
CREATE INDEX idx_estimate_sessions_created_at ON public.estimate_sessions(created_at DESC);

-- Update leads table to include estimate_session_id
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS estimate_session_id UUID REFERENCES public.estimate_sessions(id),
ADD COLUMN IF NOT EXISTS selected_company_ids UUID[] DEFAULT ARRAY[]::UUID[];