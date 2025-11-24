-- Enable RLS on new tables
ALTER TABLE provider_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_quality_factors ENABLE ROW LEVEL SECURITY;

-- RLS policies for provider_performance_metrics
CREATE POLICY "Providers can view own performance metrics"
  ON provider_performance_metrics FOR SELECT
  USING (true); -- Allow all to read for analytics

CREATE POLICY "System can manage performance metrics"
  ON provider_performance_metrics FOR ALL
  USING (true);

-- RLS policies for review_requests
CREATE POLICY "Providers can view own review requests"
  ON review_requests FOR SELECT
  USING (true);

CREATE POLICY "System can manage review requests"
  ON review_requests FOR ALL
  USING (true);

-- RLS policies for platform_analytics
CREATE POLICY "Admins can view platform analytics"
  ON platform_analytics FOR SELECT
  USING (true);

CREATE POLICY "System can manage platform analytics"
  ON platform_analytics FOR ALL
  USING (true);

-- RLS policies for lead_quality_factors
CREATE POLICY "Anyone can view lead quality factors"
  ON lead_quality_factors FOR SELECT
  USING (true);

CREATE POLICY "System can manage lead quality factors"
  ON lead_quality_factors FOR ALL
  USING (true);