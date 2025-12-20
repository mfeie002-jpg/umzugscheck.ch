-- Analysis Reports Table for AI-Generated Website Analysis
CREATE TABLE public.analysis_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  website_url TEXT NOT NULL,
  site_name TEXT NOT NULL,
  overall_score INTEGER NOT NULL DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
  total_issues INTEGER NOT NULL DEFAULT 0,
  critical_issues INTEGER NOT NULL DEFAULT 0,
  warning_issues INTEGER NOT NULL DEFAULT 0,
  info_issues INTEGER NOT NULL DEFAULT 0,
  total_hours INTEGER NOT NULL DEFAULT 0,
  hourly_rate INTEGER NOT NULL DEFAULT 150,
  monthly_loss INTEGER NOT NULL DEFAULT 0,
  current_revenue INTEGER NOT NULL DEFAULT 0,
  projected_revenue INTEGER NOT NULL DEFAULT 0,
  categories JSONB NOT NULL DEFAULT '[]'::jsonb,
  consequences JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  viewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.analysis_reports ENABLE ROW LEVEL SECURITY;

-- Public can view reports by token (for sharing)
CREATE POLICY "Anyone can view reports by token"
ON public.analysis_reports
FOR SELECT
USING (true);

-- Service role can manage all reports
CREATE POLICY "Service role can manage reports"
ON public.analysis_reports
FOR ALL
USING (true);

-- Admins can manage reports
CREATE POLICY "Admins can manage reports"
ON public.analysis_reports
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for fast token lookups
CREATE INDEX idx_analysis_reports_token ON public.analysis_reports(token);
CREATE INDEX idx_analysis_reports_lead_id ON public.analysis_reports(lead_id);
CREATE INDEX idx_analysis_reports_created_at ON public.analysis_reports(created_at DESC);

-- Update trigger for updated_at
CREATE TRIGGER update_analysis_reports_updated_at
BEFORE UPDATE ON public.analysis_reports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();