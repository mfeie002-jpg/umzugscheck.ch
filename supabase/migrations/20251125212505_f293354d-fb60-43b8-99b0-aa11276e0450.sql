-- Add email automation settings table for smart alerts
CREATE TABLE IF NOT EXISTS email_automation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT true,
  threshold_value NUMERIC,
  frequency TEXT DEFAULT 'daily',
  last_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_automation_settings ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage email automation settings"
  ON email_automation_settings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add seasonal ranking presets table
CREATE TABLE IF NOT EXISTS seasonal_ranking_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  season TEXT NOT NULL,
  description TEXT,
  configuration JSONB NOT NULL,
  is_active BOOLEAN DEFAULT false,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE seasonal_ranking_presets ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Admins can manage seasonal presets"
  ON seasonal_ranking_presets
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_automation_user_id ON email_automation_settings(user_id);
CREATE INDEX IF NOT EXISTS idx_email_automation_alert_type ON email_automation_settings(alert_type);
CREATE INDEX IF NOT EXISTS idx_seasonal_presets_season ON seasonal_ranking_presets(season);
CREATE INDEX IF NOT EXISTS idx_seasonal_presets_active ON seasonal_ranking_presets(is_active);