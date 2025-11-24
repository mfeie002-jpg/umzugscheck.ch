-- Provider subscription plans enhancement
ALTER TABLE subscription_plans
ADD COLUMN IF NOT EXISTS tier_name TEXT,
ADD COLUMN IF NOT EXISTS priority_level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS advanced_analytics BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_bidding BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS competitor_insights BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing plans with tier information
UPDATE subscription_plans 
SET tier_name = 'Basic', priority_level = 1, display_order = 1
WHERE name LIKE '%Basic%' OR price_monthly < 100;

UPDATE subscription_plans 
SET tier_name = 'Pro', priority_level = 2, advanced_analytics = true, display_order = 2
WHERE name LIKE '%Pro%' OR (price_monthly >= 100 AND price_monthly < 300);

UPDATE subscription_plans 
SET tier_name = 'Enterprise', priority_level = 3, advanced_analytics = true, auto_bidding = true, competitor_insights = true, display_order = 3
WHERE name LIKE '%Enterprise%' OR price_monthly >= 300;

-- Provider performance metrics table
CREATE TABLE IF NOT EXISTS provider_performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  leads_received INTEGER DEFAULT 0,
  leads_viewed INTEGER DEFAULT 0,
  leads_contacted INTEGER DEFAULT 0,
  leads_converted INTEGER DEFAULT 0,
  response_time_avg_hours NUMERIC(10,2),
  conversion_rate NUMERIC(5,2),
  customer_satisfaction_score NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id, metric_date)
);

CREATE INDEX IF NOT EXISTS idx_provider_performance_provider ON provider_performance_metrics(provider_id);
CREATE INDEX IF NOT EXISTS idx_provider_performance_date ON provider_performance_metrics(metric_date DESC);

-- Review requests table
CREATE TABLE IF NOT EXISTS review_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  request_sent_at TIMESTAMPTZ DEFAULT now(),
  reminder_sent_at TIMESTAMPTZ,
  review_submitted BOOLEAN DEFAULT false,
  review_id UUID REFERENCES reviews(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_requests_provider ON review_requests(provider_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_lead ON review_requests(lead_id);

-- Platform analytics table
CREATE TABLE IF NOT EXISTS platform_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_leads INTEGER DEFAULT 0,
  total_conversions INTEGER DEFAULT 0,
  avg_lead_value NUMERIC(10,2),
  total_revenue NUMERIC(12,2),
  active_providers INTEGER DEFAULT 0,
  new_providers INTEGER DEFAULT 0,
  avg_response_time_hours NUMERIC(10,2),
  customer_satisfaction_avg NUMERIC(3,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(metric_date)
);

CREATE INDEX IF NOT EXISTS idx_platform_analytics_date ON platform_analytics(metric_date DESC);

-- Enhanced lead quality factors table
CREATE TABLE IF NOT EXISTS lead_quality_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  quality_score INTEGER NOT NULL CHECK (quality_score >= 0 AND quality_score <= 100),
  value_score INTEGER DEFAULT 0,
  urgency_score INTEGER DEFAULT 0,
  completeness_score INTEGER DEFAULT 0,
  historical_score INTEGER DEFAULT 0,
  provider_fit_score INTEGER DEFAULT 0,
  predicted_conversion_probability NUMERIC(5,2),
  recommended_price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(lead_id)
);

CREATE INDEX IF NOT EXISTS idx_lead_quality_lead ON lead_quality_factors(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_quality_score ON lead_quality_factors(quality_score DESC);

-- Function to calculate provider match score
CREATE OR REPLACE FUNCTION calculate_provider_match_score(
  p_provider_id UUID,
  p_lead_id UUID
) RETURNS INTEGER AS $$
DECLARE
  v_score INTEGER := 0;
  v_provider RECORD;
  v_lead RECORD;
  v_performance RECORD;
BEGIN
  -- Get provider and lead data
  SELECT * INTO v_provider FROM service_providers WHERE id = p_provider_id;
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  
  IF v_provider IS NULL OR v_lead IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Service area match (30 points)
  IF get_canton_from_postal(v_lead.from_postal) = ANY(v_provider.cantons_served) THEN
    v_score := v_score + 30;
  END IF;
  
  -- Capacity check (20 points)
  IF v_provider.max_leads_per_month IS NULL OR 
     count_provider_leads_this_month(p_provider_id) < v_provider.max_leads_per_month THEN
    v_score := v_score + 20;
  END IF;
  
  -- Historical performance (30 points)
  SELECT * INTO v_performance 
  FROM provider_performance_metrics 
  WHERE provider_id = p_provider_id 
  ORDER BY metric_date DESC 
  LIMIT 1;
  
  IF v_performance IS NOT NULL THEN
    v_score := v_score + LEAST(30, ROUND(v_performance.conversion_rate));
  END IF;
  
  -- Response time (20 points)
  IF v_performance IS NOT NULL AND v_performance.response_time_avg_hours IS NOT NULL THEN
    IF v_performance.response_time_avg_hours < 2 THEN
      v_score := v_score + 20;
    ELSIF v_performance.response_time_avg_hours < 6 THEN
      v_score := v_score + 15;
    ELSIF v_performance.response_time_avg_hours < 24 THEN
      v_score := v_score + 10;
    END IF;
  END IF;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger to update provider performance metrics
CREATE OR REPLACE FUNCTION update_provider_performance_metrics()
RETURNS TRIGGER AS $$
BEGIN
  -- Update or insert daily metrics for the provider
  INSERT INTO provider_performance_metrics (
    provider_id,
    metric_date,
    leads_received,
    leads_viewed,
    leads_contacted,
    leads_converted,
    conversion_rate
  )
  SELECT 
    lt.provider_id,
    CURRENT_DATE,
    COUNT(*),
    COUNT(*) FILTER (WHERE lt.status != 'pending'),
    COUNT(*) FILTER (WHERE lt.conversion_status IN ('contacted', 'quoted', 'converted')),
    COUNT(*) FILTER (WHERE lt.conversion_status = 'converted'),
    ROUND((COUNT(*) FILTER (WHERE lt.conversion_status = 'converted')::NUMERIC / NULLIF(COUNT(*), 0) * 100), 2)
  FROM lead_transactions lt
  WHERE lt.provider_id = NEW.provider_id
    AND DATE(lt.purchased_at) = CURRENT_DATE
  GROUP BY lt.provider_id
  ON CONFLICT (provider_id, metric_date) 
  DO UPDATE SET
    leads_received = EXCLUDED.leads_received,
    leads_viewed = EXCLUDED.leads_viewed,
    leads_contacted = EXCLUDED.leads_contacted,
    leads_converted = EXCLUDED.leads_converted,
    conversion_rate = EXCLUDED.conversion_rate,
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_provider_metrics
AFTER INSERT OR UPDATE ON lead_transactions
FOR EACH ROW
EXECUTE FUNCTION update_provider_performance_metrics();

-- Trigger to calculate lead quality on insert
CREATE OR REPLACE FUNCTION calculate_lead_quality_on_insert()
RETURNS TRIGGER AS $$
DECLARE
  v_quality_score INTEGER := 0;
  v_value_score INTEGER := 0;
  v_urgency_score INTEGER := 0;
  v_completeness_score INTEGER := 0;
  v_estimated_value NUMERIC;
BEGIN
  -- Extract estimated value
  BEGIN
    v_estimated_value := (NEW.calculator_output->>'priceMin')::NUMERIC;
  EXCEPTION WHEN OTHERS THEN
    v_estimated_value := 0;
  END;
  
  -- Value score (0-30)
  IF v_estimated_value > 5000 THEN
    v_value_score := 30;
  ELSIF v_estimated_value > 3000 THEN
    v_value_score := 25;
  ELSIF v_estimated_value > 1500 THEN
    v_value_score := 20;
  ELSIF v_estimated_value > 800 THEN
    v_value_score := 15;
  ELSE
    v_value_score := 10;
  END IF;
  
  -- Urgency score (0-20)
  IF NEW.move_date IS NOT NULL THEN
    IF NEW.move_date <= CURRENT_DATE + INTERVAL '7 days' THEN
      v_urgency_score := 20;
    ELSIF NEW.move_date <= CURRENT_DATE + INTERVAL '30 days' THEN
      v_urgency_score := 15;
    ELSIF NEW.move_date <= CURRENT_DATE + INTERVAL '60 days' THEN
      v_urgency_score := 10;
    ELSE
      v_urgency_score := 5;
    END IF;
  ELSE
    v_urgency_score := 5;
  END IF;
  
  -- Completeness score (0-20)
  v_completeness_score := 0;
  IF NEW.phone IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  IF NEW.email IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  IF NEW.move_date IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  IF NEW.comments IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  
  -- Total quality score
  v_quality_score := v_value_score + v_urgency_score + v_completeness_score;
  
  -- Insert quality factors
  INSERT INTO lead_quality_factors (
    lead_id,
    quality_score,
    value_score,
    urgency_score,
    completeness_score,
    predicted_conversion_probability,
    recommended_price
  ) VALUES (
    NEW.id,
    v_quality_score,
    v_value_score,
    v_urgency_score,
    v_completeness_score,
    LEAST(100, v_quality_score * 1.2),
    GREATEST(10, v_estimated_value * 0.05)
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_lead_quality
AFTER INSERT ON leads
FOR EACH ROW
EXECUTE FUNCTION calculate_lead_quality_on_insert();