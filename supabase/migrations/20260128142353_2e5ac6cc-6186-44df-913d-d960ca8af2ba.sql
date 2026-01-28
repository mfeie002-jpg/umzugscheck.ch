-- Paid Media Data Storage Tables

-- Main table for daily campaign metrics
CREATE TABLE public.paid_media_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL CHECK (platform IN ('google_ads', 'meta_ads', 'microsoft_ads', 'tiktok_ads', 'linkedin_ads')),
  campaign_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT, -- search, display, video, shopping, etc.
  status TEXT DEFAULT 'active',
  daily_budget_chf NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(platform, campaign_id)
);

-- Daily metrics per campaign
CREATE TABLE public.paid_media_daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES public.paid_media_campaigns(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  cost_chf NUMERIC(10,2) DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  conversion_value_chf NUMERIC(10,2) DEFAULT 0,
  ctr NUMERIC(5,4) GENERATED ALWAYS AS (
    CASE WHEN impressions > 0 THEN clicks::NUMERIC / impressions ELSE 0 END
  ) STORED,
  cpc_chf NUMERIC(10,2) GENERATED ALWAYS AS (
    CASE WHEN clicks > 0 THEN cost_chf / clicks ELSE 0 END
  ) STORED,
  cpl_chf NUMERIC(10,2) GENERATED ALWAYS AS (
    CASE WHEN conversions > 0 THEN cost_chf / conversions ELSE 0 END
  ) STORED,
  roas NUMERIC(10,2) GENERATED ALWAYS AS (
    CASE WHEN cost_chf > 0 THEN conversion_value_chf / cost_chf ELSE 0 END
  ) STORED,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(campaign_id, date)
);

-- Sync log for API calls
CREATE TABLE public.paid_media_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform TEXT NOT NULL,
  sync_type TEXT DEFAULT 'scheduled', -- scheduled, manual
  status TEXT DEFAULT 'pending', -- pending, running, success, failed
  records_synced INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Kill switch alerts based on memory/strategy
CREATE TABLE public.paid_media_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- cpl_threshold, cm2_threshold, claims_threshold, runway_threshold
  severity TEXT DEFAULT 'warning', -- info, warning, critical
  message TEXT NOT NULL,
  metric_value NUMERIC,
  threshold_value NUMERIC,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_at TIMESTAMPTZ,
  acknowledged_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.paid_media_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_media_daily_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_media_sync_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paid_media_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Allow authenticated users with admin role
CREATE POLICY "Admins can manage paid_media_campaigns"
  ON public.paid_media_campaigns FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage paid_media_daily_metrics"
  ON public.paid_media_daily_metrics FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage paid_media_sync_log"
  ON public.paid_media_sync_log FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage paid_media_alerts"
  ON public.paid_media_alerts FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to check kill switches
CREATE OR REPLACE FUNCTION public.check_paid_media_kill_switches()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_avg_cpl NUMERIC;
BEGIN
  -- Calculate 7-day average CPL
  SELECT AVG(cpl_chf) INTO v_avg_cpl
  FROM paid_media_daily_metrics
  WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    AND conversions > 0;
  
  -- Kill switch: CPL > CHF 90 (7d avg)
  IF v_avg_cpl > 90 THEN
    INSERT INTO paid_media_alerts (alert_type, severity, message, metric_value, threshold_value)
    VALUES ('cpl_threshold', 'critical', 
      'KILL SWITCH: 7-Tage CPL überschreitet CHF 90 - ADS PAUSIEREN!',
      v_avg_cpl, 90);
  -- Warning: CPL > CHF 60
  ELSIF v_avg_cpl > 60 THEN
    INSERT INTO paid_media_alerts (alert_type, severity, message, metric_value, threshold_value)
    VALUES ('cpl_threshold', 'warning', 
      'Warnung: CPL steigt über CHF 60 - Kampagnen überprüfen',
      v_avg_cpl, 60);
  END IF;
END;
$$;

-- Trigger to update campaign updated_at
CREATE TRIGGER update_paid_media_campaigns_updated_at
  BEFORE UPDATE ON public.paid_media_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Indexes for performance
CREATE INDEX idx_paid_media_metrics_date ON public.paid_media_daily_metrics(date);
CREATE INDEX idx_paid_media_metrics_campaign ON public.paid_media_daily_metrics(campaign_id);
CREATE INDEX idx_paid_media_alerts_type ON public.paid_media_alerts(alert_type, is_acknowledged);