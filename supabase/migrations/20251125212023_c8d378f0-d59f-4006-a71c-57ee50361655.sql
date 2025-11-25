-- Add tables for advanced ranking features

-- Performance benchmarks table
CREATE TABLE IF NOT EXISTS ranking_benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  configuration JSONB NOT NULL,
  total_impressions INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  avg_conversion_rate NUMERIC DEFAULT 0,
  avg_time_to_conversion NUMERIC DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0,
  notes TEXT,
  created_by TEXT
);

CREATE INDEX idx_benchmarks_date ON ranking_benchmarks(snapshot_date);

-- Regional rankings table
CREATE TABLE IF NOT EXISTS regional_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region_code TEXT NOT NULL,
  region_name TEXT NOT NULL,
  company_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_regional_rankings_region ON regional_rankings(region_code);
CREATE INDEX idx_regional_rankings_company ON regional_rankings(company_id);

-- ML optimization models table
CREATE TABLE IF NOT EXISTS ml_ranking_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL,
  training_data JSONB NOT NULL,
  accuracy_score NUMERIC DEFAULT 0,
  last_trained_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active',
  recommendations JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_ml_models_status ON ml_ranking_models(status);

-- Real-time metrics table
CREATE TABLE IF NOT EXISTS realtime_ranking_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_type TEXT NOT NULL,
  company_id UUID REFERENCES service_providers(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  metadata JSONB,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE INDEX idx_realtime_metrics_type ON realtime_ranking_metrics(metric_type);
CREATE INDEX idx_realtime_metrics_company ON realtime_ranking_metrics(company_id);
CREATE INDEX idx_realtime_metrics_time ON realtime_ranking_metrics(recorded_at);

-- Enable RLS
ALTER TABLE ranking_benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE regional_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_ranking_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE realtime_ranking_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage benchmarks"
  ON ranking_benchmarks FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage regional rankings"
  ON regional_rankings FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert regional rankings"
  ON regional_rankings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view ML models"
  ON ml_ranking_models FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can manage ML models"
  ON ml_ranking_models FOR ALL
  USING (true);

CREATE POLICY "Admins can view realtime metrics"
  ON realtime_ranking_metrics FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert realtime metrics"
  ON realtime_ranking_metrics FOR INSERT
  WITH CHECK (true);

-- Enable realtime for metrics table
ALTER PUBLICATION supabase_realtime ADD TABLE realtime_ranking_metrics;

-- Function to capture benchmark snapshot
CREATE OR REPLACE FUNCTION capture_ranking_benchmark(p_notes TEXT DEFAULT NULL)
RETURNS UUID AS $$
DECLARE
  v_benchmark_id UUID;
  v_configuration JSONB;
  v_total_impressions INTEGER;
  v_total_conversions INTEGER;
  v_avg_conversion_rate NUMERIC;
BEGIN
  -- Get current ranking configuration
  SELECT jsonb_build_object(
    'featured', jsonb_agg(jsonb_build_object('id', id, 'position', featured_position) ORDER BY featured_position)
  )
  INTO v_configuration
  FROM service_providers
  WHERE is_featured = true;

  -- Calculate metrics from recent data (last 30 days)
  SELECT 
    COALESCE(SUM(variant_a_impressions + variant_b_impressions), 0),
    COALESCE(SUM(variant_a_conversions + variant_b_conversions), 0)
  INTO v_total_impressions, v_total_conversions
  FROM ab_tests
  WHERE started_at >= now() - interval '30 days';

  IF v_total_impressions > 0 THEN
    v_avg_conversion_rate := (v_total_conversions::NUMERIC / v_total_impressions) * 100;
  ELSE
    v_avg_conversion_rate := 0;
  END IF;

  -- Insert benchmark
  INSERT INTO ranking_benchmarks (
    configuration,
    total_impressions,
    total_conversions,
    avg_conversion_rate,
    notes
  ) VALUES (
    v_configuration,
    v_total_impressions,
    v_total_conversions,
    v_avg_conversion_rate,
    p_notes
  ) RETURNING id INTO v_benchmark_id;

  RETURN v_benchmark_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;