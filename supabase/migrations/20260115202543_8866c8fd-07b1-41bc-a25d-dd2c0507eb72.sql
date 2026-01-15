-- URL Tracking System for documenting all page optimizations
-- This tracks every URL, its SEO status, changes history, and metrics

CREATE TABLE public.url_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url_path TEXT NOT NULL UNIQUE,
  page_type TEXT NOT NULL CHECK (page_type IN ('funnel', 'service', 'geo-kanton', 'geo-stadt', 'ratgeber', 'ranking', 'b2b', 'shop', 'landing', 'other')),
  status TEXT NOT NULL DEFAULT 'live' CHECK (status IN ('live', 'planned', 'in-progress', 'deprecated', 'redirect')),
  
  -- SEO Data
  primary_keyword TEXT,
  secondary_keywords TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  h1_tag TEXT,
  
  -- Business Metrics
  funnel_role TEXT CHECK (funnel_role IN ('traffic-magnet', 'lead-converter', 'trust-builder', 'seo-authority')),
  conversion_potential TEXT CHECK (conversion_potential IN ('sehr-hoch', 'hoch', 'mittel', 'niedrig')),
  search_intent TEXT CHECK (search_intent IN ('hot', 'warm', 'cold', 'informational')),
  estimated_search_volume INTEGER,
  
  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by TEXT,
  
  -- Notes
  notes TEXT,
  optimization_score INTEGER CHECK (optimization_score >= 0 AND optimization_score <= 100)
);

-- Change History Table - tracks every modification
CREATE TABLE public.url_change_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url_id UUID NOT NULL REFERENCES public.url_tracking(id) ON DELETE CASCADE,
  change_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_type TEXT NOT NULL CHECK (change_type IN ('created', 'content', 'seo', 'design', 'performance', 'redirect', 'a/b-test', 'fix', 'other')),
  change_description TEXT NOT NULL,
  changed_by TEXT,
  before_state JSONB,
  after_state JSONB,
  impact_notes TEXT
);

-- Enable RLS
ALTER TABLE public.url_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.url_change_history ENABLE ROW LEVEL SECURITY;

-- Policies for admin access (read-write for authenticated)
CREATE POLICY "Admins can manage URL tracking" ON public.url_tracking
  FOR ALL USING (true);

CREATE POLICY "Admins can manage URL change history" ON public.url_change_history
  FOR ALL USING (true);

-- Indexes for fast lookups
CREATE INDEX idx_url_tracking_path ON public.url_tracking(url_path);
CREATE INDEX idx_url_tracking_type ON public.url_tracking(page_type);
CREATE INDEX idx_url_tracking_status ON public.url_tracking(status);
CREATE INDEX idx_url_change_history_url ON public.url_change_history(url_id);
CREATE INDEX idx_url_change_history_date ON public.url_change_history(change_date DESC);

-- Auto-update timestamp trigger
CREATE TRIGGER update_url_tracking_updated_at
  BEFORE UPDATE ON public.url_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.url_tracking;
ALTER PUBLICATION supabase_realtime ADD TABLE public.url_change_history;