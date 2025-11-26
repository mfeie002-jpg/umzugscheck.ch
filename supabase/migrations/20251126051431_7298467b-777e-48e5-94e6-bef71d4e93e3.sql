-- Add search_path to functions missing it

-- validate_email
CREATE OR REPLACE FUNCTION public.validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- validate_phone
CREATE OR REPLACE FUNCTION public.validate_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  RETURN phone ~* '^\+?[0-9\s\-\(\)]{8,20}$';
END;
$$;

-- calculate_provider_match_score
CREATE OR REPLACE FUNCTION public.calculate_provider_match_score(p_provider_id uuid, p_lead_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_score INTEGER := 0;
  v_provider RECORD;
  v_lead RECORD;
  v_performance RECORD;
BEGIN
  SELECT * INTO v_provider FROM service_providers WHERE id = p_provider_id;
  SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
  
  IF v_provider IS NULL OR v_lead IS NULL THEN
    RETURN 0;
  END IF;
  
  IF get_canton_from_postal(v_lead.from_postal) = ANY(v_provider.cantons_served) THEN
    v_score := v_score + 30;
  END IF;
  
  IF v_provider.max_leads_per_month IS NULL OR 
     count_provider_leads_this_month(p_provider_id) < v_provider.max_leads_per_month THEN
    v_score := v_score + 20;
  END IF;
  
  SELECT * INTO v_performance 
  FROM provider_performance_metrics 
  WHERE provider_id = p_provider_id 
  ORDER BY metric_date DESC 
  LIMIT 1;
  
  IF v_performance IS NOT NULL THEN
    v_score := v_score + LEAST(30, ROUND(v_performance.conversion_rate));
  END IF;
  
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
$$;

-- update_provider_performance_metrics
CREATE OR REPLACE FUNCTION public.update_provider_performance_metrics()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
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
$$;

-- calculate_lead_quality_on_insert
CREATE OR REPLACE FUNCTION public.calculate_lead_quality_on_insert()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  v_quality_score INTEGER := 0;
  v_value_score INTEGER := 0;
  v_urgency_score INTEGER := 0;
  v_completeness_score INTEGER := 0;
  v_estimated_value NUMERIC;
BEGIN
  BEGIN
    v_estimated_value := (NEW.calculator_output->>'priceMin')::NUMERIC;
  EXCEPTION WHEN OTHERS THEN
    v_estimated_value := 0;
  END;
  
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
  
  v_completeness_score := 0;
  IF NEW.phone IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  IF NEW.email IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  IF NEW.move_date IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  IF NEW.comments IS NOT NULL THEN v_completeness_score := v_completeness_score + 5; END IF;
  
  v_quality_score := v_value_score + v_urgency_score + v_completeness_score;
  
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
$$;