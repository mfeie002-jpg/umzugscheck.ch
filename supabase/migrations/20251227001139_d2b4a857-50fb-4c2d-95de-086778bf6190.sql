-- Homepage A/B Test Rotation System
-- Stores which flow variant is shown to users and tracks conversions

-- A/B Test Configuration Table
CREATE TABLE IF NOT EXISTS public.homepage_ab_config (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert default config row
INSERT INTO public.homepage_ab_config (id, is_active) 
VALUES ('00000000-0000-0000-0000-000000000001', false)
ON CONFLICT DO NOTHING;

-- Homepage A/B Test Impressions & Conversions
CREATE TABLE IF NOT EXISTS public.homepage_ab_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  user_id TEXT, -- anonymous user identifier from localStorage
  flow_variant TEXT NOT NULL, -- v1, v2, v3, etc.
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'cta_click', 'funnel_start', 'lead_submit')),
  page_path TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for fast querying
CREATE INDEX IF NOT EXISTS idx_homepage_ab_events_variant ON public.homepage_ab_events(flow_variant);
CREATE INDEX IF NOT EXISTS idx_homepage_ab_events_type ON public.homepage_ab_events(event_type);
CREATE INDEX IF NOT EXISTS idx_homepage_ab_events_session ON public.homepage_ab_events(session_id);
CREATE INDEX IF NOT EXISTS idx_homepage_ab_events_created ON public.homepage_ab_events(created_at DESC);

-- Enable RLS
ALTER TABLE public.homepage_ab_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_ab_events ENABLE ROW LEVEL SECURITY;

-- Policies for config (admin only read/write)
CREATE POLICY "Anyone can read AB config" 
ON public.homepage_ab_config 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can update AB config"
ON public.homepage_ab_config
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Policies for events (anyone can insert, admins can read)
CREATE POLICY "Anyone can insert AB events" 
ON public.homepage_ab_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Admins can read AB events"
ON public.homepage_ab_events
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Function to get A/B test statistics
CREATE OR REPLACE FUNCTION public.get_homepage_ab_stats(
  p_days INTEGER DEFAULT 30
)
RETURNS TABLE (
  flow_variant TEXT,
  impressions BIGINT,
  cta_clicks BIGINT,
  funnel_starts BIGINT,
  lead_submits BIGINT,
  cta_rate NUMERIC,
  funnel_rate NUMERIC,
  conversion_rate NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.flow_variant,
    COUNT(*) FILTER (WHERE e.event_type = 'impression') as impressions,
    COUNT(*) FILTER (WHERE e.event_type = 'cta_click') as cta_clicks,
    COUNT(*) FILTER (WHERE e.event_type = 'funnel_start') as funnel_starts,
    COUNT(*) FILTER (WHERE e.event_type = 'lead_submit') as lead_submits,
    ROUND((COUNT(*) FILTER (WHERE e.event_type = 'cta_click')::NUMERIC / 
           NULLIF(COUNT(*) FILTER (WHERE e.event_type = 'impression'), 0) * 100), 2) as cta_rate,
    ROUND((COUNT(*) FILTER (WHERE e.event_type = 'funnel_start')::NUMERIC / 
           NULLIF(COUNT(*) FILTER (WHERE e.event_type = 'impression'), 0) * 100), 2) as funnel_rate,
    ROUND((COUNT(*) FILTER (WHERE e.event_type = 'lead_submit')::NUMERIC / 
           NULLIF(COUNT(*) FILTER (WHERE e.event_type = 'impression'), 0) * 100), 2) as conversion_rate
  FROM public.homepage_ab_events e
  WHERE e.created_at >= now() - (p_days || ' days')::INTERVAL
  GROUP BY e.flow_variant
  ORDER BY conversion_rate DESC NULLS LAST;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER update_homepage_ab_config_updated_at
  BEFORE UPDATE ON public.homepage_ab_config
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();