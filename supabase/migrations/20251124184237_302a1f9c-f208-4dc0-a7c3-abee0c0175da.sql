-- Add service_type column to companies table for service-specific matching
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS service_types TEXT[] DEFAULT ARRAY['moving']::TEXT[];

-- Add comment explaining service types
COMMENT ON COLUMN public.companies.service_types IS 'Types of services offered: moving, cleaning, disposal, storage, packing, assembly';

-- Create bundled_estimates table for multi-service bundling
CREATE TABLE IF NOT EXISTS public.bundled_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- List of estimate session IDs being bundled
  estimate_session_ids UUID[] NOT NULL,
  
  -- Combined pricing
  total_price_min NUMERIC NOT NULL,
  total_price_max NUMERIC NOT NULL,
  
  -- Metadata
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days')
);

-- Enable RLS
ALTER TABLE public.bundled_estimates ENABLE ROW LEVEL SECURITY;

-- Anyone can create bundled estimates
CREATE POLICY "Anyone can create bundled estimates"
  ON public.bundled_estimates
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Anyone can view bundled estimates
CREATE POLICY "Anyone can view bundled estimates"
  ON public.bundled_estimates
  FOR SELECT
  TO public
  USING (true);

-- Add bundled_estimate_id to leads table
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS bundled_estimate_id UUID REFERENCES public.bundled_estimates(id);

-- Add funnel_variant column to estimate_sessions for A/B testing
ALTER TABLE public.estimate_sessions
ADD COLUMN IF NOT EXISTS funnel_variant TEXT DEFAULT 'default';

COMMENT ON COLUMN public.estimate_sessions.funnel_variant IS 'A/B test variant: default, variant_a, variant_b, etc.';

-- Add conversion tracking columns to estimate_sessions
ALTER TABLE public.estimate_sessions
ADD COLUMN IF NOT EXISTS viewed_companies BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS selected_companies INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS submitted_lead BOOLEAN DEFAULT false;

-- Create index for A/B testing analytics
CREATE INDEX IF NOT EXISTS idx_estimate_sessions_funnel_variant ON public.estimate_sessions(funnel_variant);
CREATE INDEX IF NOT EXISTS idx_estimate_sessions_conversion ON public.estimate_sessions(viewed_companies, submitted_lead);