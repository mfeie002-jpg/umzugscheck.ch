-- Add tables for ranking features

-- Scheduled rankings table
CREATE TABLE IF NOT EXISTS scheduled_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  configuration JSONB NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  executed_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT
);

CREATE INDEX idx_scheduled_rankings_date ON scheduled_rankings(scheduled_date);
CREATE INDEX idx_scheduled_rankings_status ON scheduled_rankings(status);

-- A/B tests table
CREATE TABLE IF NOT EXISTS ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  variant_a_config JSONB NOT NULL,
  variant_b_config JSONB NOT NULL,
  variant_a_impressions INTEGER DEFAULT 0,
  variant_b_impressions INTEGER DEFAULT 0,
  variant_a_conversions INTEGER DEFAULT 0,
  variant_b_conversions INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_by TEXT
);

CREATE INDEX idx_ab_tests_status ON ab_tests(status);

-- Ranking history table
CREATE TABLE IF NOT EXISTS ranking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  position INTEGER NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  changed_by TEXT
);

CREATE INDEX idx_ranking_history_company ON ranking_history(company_id);
CREATE INDEX idx_ranking_history_date ON ranking_history(changed_at);

-- Enable RLS
ALTER TABLE scheduled_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scheduled_rankings
CREATE POLICY "Admins can manage scheduled rankings"
  ON scheduled_rankings
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage scheduled rankings"
  ON scheduled_rankings
  FOR ALL
  USING (true);

-- RLS Policies for ab_tests
CREATE POLICY "Admins can manage AB tests"
  ON ab_tests
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can update AB test metrics"
  ON ab_tests
  FOR UPDATE
  USING (true);

-- RLS Policies for ranking_history
CREATE POLICY "Admins can view ranking history"
  ON ranking_history
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert ranking history"
  ON ranking_history
  FOR INSERT
  WITH CHECK (true);

-- Function to log ranking changes
CREATE OR REPLACE FUNCTION log_ranking_change()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND (
    OLD.ranking_position IS DISTINCT FROM NEW.ranking_position OR
    OLD.featured_position IS DISTINCT FROM NEW.featured_position OR
    OLD.is_featured IS DISTINCT FROM NEW.is_featured
  )) THEN
    INSERT INTO ranking_history (
      company_id,
      company_name,
      position,
      is_featured,
      changed_by
    ) VALUES (
      NEW.id,
      NEW.company_name,
      COALESCE(NEW.ranking_position, NEW.featured_position, 0),
      NEW.is_featured,
      current_setting('request.jwt.claims', true)::json->>'email'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for ranking changes
DROP TRIGGER IF EXISTS track_ranking_changes ON service_providers;
CREATE TRIGGER track_ranking_changes
  AFTER UPDATE ON service_providers
  FOR EACH ROW
  EXECUTE FUNCTION log_ranking_change();