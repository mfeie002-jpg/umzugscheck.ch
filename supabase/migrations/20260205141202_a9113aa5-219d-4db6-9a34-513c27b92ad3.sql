-- Create conversion_events table for attribution tracking
CREATE TABLE public.conversion_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  session_id TEXT,
  -- UTM Attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  -- Click IDs (critical for ad platforms)
  gclid TEXT,
  gbraid TEXT,
  wbraid TEXT,
  fbclid TEXT,
  -- Context
  page_url TEXT,
  referrer TEXT,
  device_type TEXT DEFAULT 'desktop',
  client_ip TEXT,
  -- Conversion data
  lead_id UUID REFERENCES public.leads(id),
  company_id UUID,
  estimated_value NUMERIC,
  metadata JSONB,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_conversion_events_visitor_id ON public.conversion_events(visitor_id);
CREATE INDEX idx_conversion_events_event_type ON public.conversion_events(event_type);
CREATE INDEX idx_conversion_events_created_at ON public.conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_gclid ON public.conversion_events(gclid) WHERE gclid IS NOT NULL;
CREATE INDEX idx_conversion_events_lead_id ON public.conversion_events(lead_id) WHERE lead_id IS NOT NULL;

-- Enable RLS (public insert, admin read)
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (tracking data)
CREATE POLICY "Allow anonymous conversion tracking inserts"
ON public.conversion_events
FOR INSERT
WITH CHECK (true);

-- Add auto_reply_sent_at column to leads table if not exists
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS auto_reply_sent_at TIMESTAMP WITH TIME ZONE;

-- Add attribution columns to leads table
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS gclid TEXT,
ADD COLUMN IF NOT EXISTS fbclid TEXT;