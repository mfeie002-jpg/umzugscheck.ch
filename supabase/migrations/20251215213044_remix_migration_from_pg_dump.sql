CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "public";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: account_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.account_status AS ENUM (
    'active',
    'inactive'
);


--
-- Name: app_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.app_role AS ENUM (
    'admin',
    'user'
);


--
-- Name: price_level; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.price_level AS ENUM (
    'günstig',
    'fair',
    'premium'
);


--
-- Name: verification_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.verification_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);


--
-- Name: auto_assign_providers_to_lead(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.auto_assign_providers_to_lead() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  matched_providers uuid[];
  estimated_price numeric;
BEGIN
  -- Extract estimated price from calculator output if available
  estimated_price := NULL;
  IF NEW.calculator_output IS NOT NULL THEN
    BEGIN
      estimated_price := (NEW.calculator_output->>'priceMin')::numeric;
    EXCEPTION WHEN OTHERS THEN
      estimated_price := NULL;
    END;
  END IF;
  
  -- Find matching providers
  matched_providers := public.find_matching_providers(
    NEW.from_postal,
    NEW.to_postal,
    estimated_price
  );
  
  -- Assign providers to the lead
  NEW.assigned_provider_ids := matched_providers;
  
  RETURN NEW;
END;
$$;


--
-- Name: calculate_lead_quality_on_insert(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_lead_quality_on_insert() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
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


--
-- Name: calculate_provider_match_score(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.calculate_provider_match_score(p_provider_id uuid, p_lead_id uuid) RETURNS integer
    LANGUAGE plpgsql STABLE
    SET search_path TO 'public'
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


--
-- Name: capture_ranking_benchmark(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.capture_ranking_benchmark(p_notes text DEFAULT NULL::text) RETURNS uuid
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
$$;


--
-- Name: check_rate_limit(text, text, integer, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_rate_limit(p_identifier text, p_action_type text, p_max_attempts integer, p_window_minutes integer) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_attempt_count integer;
  v_window_start timestamptz;
BEGIN
  SELECT attempt_count, window_start
  INTO v_attempt_count, v_window_start
  FROM rate_limits
  WHERE identifier = p_identifier
    AND action_type = p_action_type;
  
  IF NOT FOUND OR (now() - v_window_start) > (p_window_minutes || ' minutes')::interval THEN
    INSERT INTO rate_limits (identifier, action_type, attempt_count, window_start)
    VALUES (p_identifier, p_action_type, 1, now())
    ON CONFLICT (identifier, action_type) 
    DO UPDATE SET attempt_count = 1, window_start = now();
    RETURN true;
  END IF;
  
  IF v_attempt_count >= p_max_attempts THEN
    RETURN false;
  END IF;
  
  UPDATE rate_limits
  SET attempt_count = attempt_count + 1
  WHERE identifier = p_identifier AND action_type = p_action_type;
  
  RETURN true;
END;
$$;


--
-- Name: close_lead_bidding(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.close_lead_bidding(p_lead_id uuid) RETURNS json
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  v_winning_bid RECORD;
  v_result JSON;
BEGIN
  -- Get the highest active bid
  SELECT * INTO v_winning_bid
  FROM lead_bids
  WHERE lead_id = p_lead_id 
    AND status = 'active'
  ORDER BY bid_amount DESC, created_at ASC
  LIMIT 1;
  
  IF v_winning_bid IS NOT NULL THEN
    -- Mark winning bid
    UPDATE lead_bids
    SET status = 'won'
    WHERE id = v_winning_bid.id;
    
    -- Mark other bids as lost
    UPDATE lead_bids
    SET status = 'outbid'
    WHERE lead_id = p_lead_id 
      AND id != v_winning_bid.id 
      AND status = 'active';
    
    -- Disable bidding on lead
    UPDATE leads
    SET bidding_enabled = false
    WHERE id = p_lead_id;
    
    v_result := json_build_object(
      'success', true,
      'winning_bid_id', v_winning_bid.id,
      'winning_provider_id', v_winning_bid.provider_id,
      'winning_amount', v_winning_bid.bid_amount
    );
  ELSE
    v_result := json_build_object(
      'success', false,
      'message', 'No active bids found'
    );
  END IF;
  
  RETURN v_result;
END;
$$;


--
-- Name: count_provider_leads_this_month(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.count_provider_leads_this_month(provider_id uuid) RETURNS integer
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT COUNT(*)::integer
  FROM public.leads
  WHERE provider_id = ANY(assigned_provider_ids)
    AND created_at >= date_trunc('month', CURRENT_DATE)
    AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month';
$$;


--
-- Name: find_matching_providers(text, text, numeric); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.find_matching_providers(lead_from_postal text, lead_to_postal text, estimated_value numeric DEFAULT NULL::numeric) RETURNS uuid[]
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  from_canton text;
  to_canton text;
  matching_provider_ids uuid[];
BEGIN
  -- Get cantons from postal codes
  from_canton := public.get_canton_from_postal(lead_from_postal);
  to_canton := public.get_canton_from_postal(lead_to_postal);
  
  -- Find providers that match the criteria
  SELECT ARRAY_AGG(sp.id)
  INTO matching_provider_ids
  FROM public.service_providers sp
  WHERE 
    -- Must be approved and active
    sp.verification_status = 'approved'
    AND sp.account_status = 'active'
    
    -- Must serve at least one of the relevant cantons
    AND (
      from_canton = ANY(sp.cantons_served) 
      OR to_canton = ANY(sp.cantons_served)
    )
    
    -- Check max leads per month limit
    AND (
      sp.max_leads_per_month IS NULL
      OR public.count_provider_leads_this_month(sp.id) < sp.max_leads_per_month
    )
    
    -- Check minimum job value
    AND (
      sp.min_job_value IS NULL
      OR estimated_value IS NULL
      OR estimated_value >= sp.min_job_value
    )
    
    -- Check preferred regions (if set, must match)
    AND (
      sp.preferred_regions IS NULL
      OR array_length(sp.preferred_regions, 1) IS NULL
      OR from_canton = ANY(sp.preferred_regions)
      OR to_canton = ANY(sp.preferred_regions)
    );
  
  RETURN COALESCE(matching_provider_ids, ARRAY[]::uuid[]);
END;
$$;


--
-- Name: get_canton_from_postal(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_canton_from_postal(postal_code text) RETURNS text
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  canton_code text;
BEGIN
  -- Swiss postal code to canton mapping (simplified)
  -- First digit indicates general region
  CASE 
    WHEN postal_code LIKE '1%' THEN
      CASE
        WHEN postal_code BETWEEN '1000' AND '1299' THEN canton_code := 'VD';
        WHEN postal_code BETWEEN '1300' AND '1499' THEN canton_code := 'VD';
        WHEN postal_code BETWEEN '1500' AND '1699' THEN canton_code := 'FR';
        WHEN postal_code BETWEEN '1700' AND '1799' THEN canton_code := 'FR';
        ELSE canton_code := 'VD';
      END CASE;
    WHEN postal_code LIKE '2%' THEN
      CASE
        WHEN postal_code BETWEEN '2000' AND '2099' THEN canton_code := 'NE';
        WHEN postal_code BETWEEN '2300' AND '2799' THEN canton_code := 'JU';
        WHEN postal_code BETWEEN '2800' AND '2899' THEN canton_code := 'JU';
        ELSE canton_code := 'NE';
      END CASE;
    WHEN postal_code LIKE '3%' THEN canton_code := 'BE';
    WHEN postal_code LIKE '4%' THEN
      CASE
        WHEN postal_code BETWEEN '4000' AND '4999' THEN canton_code := 'BS';
        ELSE canton_code := 'BL';
      END CASE;
    WHEN postal_code LIKE '5%' THEN canton_code := 'AG';
    WHEN postal_code LIKE '6%' THEN
      CASE
        WHEN postal_code BETWEEN '6000' AND '6499' THEN canton_code := 'LU';
        WHEN postal_code BETWEEN '6500' AND '6999' THEN canton_code := 'TI';
        ELSE canton_code := 'LU';
      END CASE;
    WHEN postal_code LIKE '7%' THEN canton_code := 'GR';
    WHEN postal_code LIKE '8%' THEN canton_code := 'ZH';
    WHEN postal_code LIKE '9%' THEN
      CASE
        WHEN postal_code BETWEEN '9000' AND '9499' THEN canton_code := 'SG';
        WHEN postal_code BETWEEN '9500' AND '9699' THEN canton_code := 'AR';
        ELSE canton_code := 'SG';
      END CASE;
    ELSE canton_code := NULL;
  END CASE;
  
  RETURN canton_code;
END;
$$;


--
-- Name: get_provider_conversion_history(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_provider_conversion_history(p_provider_id uuid) RETURNS jsonb
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
DECLARE
  result jsonb;
BEGIN
  WITH conversion_data AS (
    SELECT 
      COUNT(*) as total_leads,
      COUNT(*) FILTER (WHERE conversion_status = 'converted') as converted_leads,
      
      -- By calculator type
      jsonb_object_agg(
        DISTINCT l.calculator_type,
        jsonb_build_object(
          'total', COUNT(*) FILTER (WHERE l.calculator_type = l.calculator_type),
          'converted', COUNT(*) FILTER (WHERE l.calculator_type = l.calculator_type AND lt.conversion_status = 'converted')
        )
      ) FILTER (WHERE l.calculator_type IS NOT NULL) as by_calculator_type,
      
      -- By canton
      jsonb_object_agg(
        DISTINCT SUBSTRING(l.from_postal FROM 1 FOR 1),
        jsonb_build_object(
          'total', COUNT(*) FILTER (WHERE SUBSTRING(l.from_postal FROM 1 FOR 1) = SUBSTRING(l.from_postal FROM 1 FOR 1)),
          'converted', COUNT(*) FILTER (WHERE SUBSTRING(l.from_postal FROM 1 FOR 1) = SUBSTRING(l.from_postal FROM 1 FOR 1) AND lt.conversion_status = 'converted')
        )
      ) FILTER (WHERE l.from_postal IS NOT NULL) as by_postal_prefix,
      
      AVG(EXTRACT(EPOCH FROM (lt.conversion_date - lt.purchased_at)) / 86400) FILTER (WHERE lt.conversion_status = 'converted') as avg_conversion_time_days
      
    FROM public.lead_transactions lt
    JOIN public.leads l ON lt.lead_id = l.id
    WHERE lt.provider_id = p_provider_id
      AND lt.conversion_status IN ('converted', 'lost')
  )
  SELECT jsonb_build_object(
    'total_leads', COALESCE(total_leads, 0),
    'converted_leads', COALESCE(converted_leads, 0),
    'avg_conversion_time_days', COALESCE(avg_conversion_time_days, 0),
    'by_calculator_type', COALESCE(by_calculator_type, '{}'::jsonb),
    'by_canton', COALESCE(by_postal_prefix, '{}'::jsonb)
  )
  INTO result
  FROM conversion_data;
  
  RETURN COALESCE(result, jsonb_build_object(
    'total_leads', 0,
    'converted_leads', 0,
    'avg_conversion_time_days', 0,
    'by_calculator_type', '{}'::jsonb,
    'by_canton', '{}'::jsonb
  ));
END;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;


--
-- Name: has_role(uuid, public.app_role); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.has_role(_user_id uuid, _role public.app_role) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;


--
-- Name: log_ranking_change(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_ranking_change() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
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
$$;


--
-- Name: provider_can_receive_lead(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.provider_can_receive_lead(provider_id uuid) RETURNS boolean
    LANGUAGE plpgsql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
DECLARE
  subscription_limit integer;
  current_month_leads integer;
BEGIN
  -- Get the max leads from active subscription
  SELECT sp.max_leads_per_month INTO subscription_limit
  FROM public.provider_subscriptions ps
  JOIN public.subscription_plans sp ON ps.plan_id = sp.id
  WHERE ps.provider_id = $1
    AND ps.status = 'active'
    AND (ps.end_date IS NULL OR ps.end_date > now())
  LIMIT 1;
  
  -- If no subscription or unlimited plan (NULL limit), return true
  IF subscription_limit IS NULL THEN
    RETURN true;
  END IF;
  
  -- Count leads this month
  current_month_leads := public.count_provider_leads_this_month($1);
  
  -- Check if under limit
  RETURN current_month_leads < subscription_limit;
END;
$_$;


--
-- Name: provider_has_active_subscription(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.provider_has_active_subscription(provider_id uuid) RETURNS boolean
    LANGUAGE sql STABLE SECURITY DEFINER
    SET search_path TO 'public'
    AS $_$
  SELECT EXISTS (
    SELECT 1
    FROM public.provider_subscriptions
    WHERE provider_subscriptions.provider_id = $1
      AND status = 'active'
      AND (end_date IS NULL OR end_date > now())
  );
$_$;


--
-- Name: update_conversion_tracking(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_conversion_tracking() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = now();
  
  -- If status changed to converted, set conversion_date if not already set
  IF NEW.conversion_status = 'converted' AND OLD.conversion_status != 'converted' AND NEW.conversion_date IS NULL THEN
    NEW.conversion_date = now();
  END IF;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_lead_bid_stats(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_lead_bid_stats() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  -- Update lead with latest bid info
  UPDATE leads
  SET 
    current_highest_bid = (
      SELECT MAX(bid_amount) 
      FROM lead_bids 
      WHERE lead_id = NEW.lead_id AND status = 'active'
    ),
    bid_count = (
      SELECT COUNT(*) 
      FROM lead_bids 
      WHERE lead_id = NEW.lead_id AND status = 'active'
    )
  WHERE id = NEW.lead_id;
  
  -- Mark previous bids as outbid
  UPDATE lead_bids
  SET status = 'outbid'
  WHERE lead_id = NEW.lead_id 
    AND id != NEW.id 
    AND status = 'active'
    AND bid_amount < NEW.bid_amount;
  
  RETURN NEW;
END;
$$;


--
-- Name: update_provider_performance_metrics(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_provider_performance_metrics() RETURNS trigger
    LANGUAGE plpgsql
    SET search_path TO 'public'
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


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


--
-- Name: validate_email(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_email(email text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    SET search_path TO 'public'
    AS $_$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$_$;


--
-- Name: validate_phone(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.validate_phone(phone text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    SET search_path TO 'public'
    AS $_$
BEGIN
  RETURN phone ~* '^\+?[0-9\s\-\(\)]{8,20}$';
END;
$_$;


SET default_table_access_method = heap;

--
-- Name: ab_tests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ab_tests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    variant_a_config jsonb NOT NULL,
    variant_b_config jsonb NOT NULL,
    variant_a_impressions integer DEFAULT 0,
    variant_b_impressions integer DEFAULT 0,
    variant_a_conversions integer DEFAULT 0,
    variant_b_conversions integer DEFAULT 0,
    status text DEFAULT 'active'::text NOT NULL,
    started_at timestamp with time zone DEFAULT now(),
    ended_at timestamp with time zone,
    created_by text
);


--
-- Name: billing_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.billing_records (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id uuid NOT NULL,
    lead_id uuid,
    price_chf numeric NOT NULL,
    billing_model text NOT NULL,
    status text DEFAULT 'open'::text,
    billing_period text,
    created_at timestamp with time zone DEFAULT now(),
    paid_at timestamp with time zone,
    invoice_number text,
    CONSTRAINT billing_records_billing_model_check CHECK ((billing_model = ANY (ARRAY['CPL'::text, 'PPC'::text, 'Subscription'::text]))),
    CONSTRAINT billing_records_status_check CHECK ((status = ANY (ARRAY['open'::text, 'paid'::text, 'cancelled'::text])))
);


--
-- Name: bundled_estimates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bundled_estimates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    estimate_session_ids uuid[] NOT NULL,
    total_price_min numeric NOT NULL,
    total_price_max numeric NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval)
);


--
-- Name: call_tracking; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.call_tracking (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL,
    call_duration integer,
    was_successful boolean DEFAULT false,
    caller_phone text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: companies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.companies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    logo text,
    description text,
    services text[],
    price_level text,
    rating numeric(2,1),
    review_count integer DEFAULT 0,
    service_areas text[],
    phone text,
    email text,
    website text,
    gallery_images text[],
    verified boolean DEFAULT false,
    featured boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    service_types text[] DEFAULT ARRAY['moving'::text],
    CONSTRAINT companies_price_level_check CHECK (((price_level IS NULL) OR (length(price_level) > 0))),
    CONSTRAINT companies_rating_check CHECK (((rating >= (0)::numeric) AND (rating <= (5)::numeric)))
);


--
-- Name: conversion_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.conversion_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    city text NOT NULL,
    service text NOT NULL,
    source_page text,
    conversion_type text NOT NULL,
    lead_id uuid,
    company_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: email_automation_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_automation_settings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    alert_type text NOT NULL,
    enabled boolean DEFAULT true,
    threshold_value numeric,
    frequency text DEFAULT 'daily'::text,
    last_sent_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: email_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL,
    campaign_type text NOT NULL,
    subject text NOT NULL,
    body_template text NOT NULL,
    trigger_event text NOT NULL,
    trigger_delay_hours integer DEFAULT 0,
    is_active boolean DEFAULT true,
    sent_count integer DEFAULT 0
);


--
-- Name: email_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_queue (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    scheduled_for timestamp with time zone NOT NULL,
    campaign_id uuid,
    recipient_email text NOT NULL,
    recipient_name text,
    lead_id uuid,
    status text DEFAULT 'pending'::text,
    sent_at timestamp with time zone,
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb
);


--
-- Name: estimate_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.estimate_sessions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    move_details jsonb NOT NULL,
    estimate jsonb NOT NULL,
    matching_company_ids uuid[] DEFAULT ARRAY[]::uuid[],
    expires_at timestamp with time zone DEFAULT (now() + '7 days'::interval),
    funnel_variant text DEFAULT 'default'::text,
    viewed_companies boolean DEFAULT false,
    selected_companies integer DEFAULT 0,
    submitted_lead boolean DEFAULT false
);


--
-- Name: historical_pricing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.historical_pricing (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    canton_code text NOT NULL,
    month text NOT NULL,
    year integer NOT NULL,
    avg_price numeric NOT NULL,
    min_price numeric NOT NULL,
    max_price numeric NOT NULL,
    lead_volume integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: lead_bids; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_bids (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid NOT NULL,
    provider_id uuid NOT NULL,
    bid_amount numeric NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT valid_bid_amount CHECK ((bid_amount > (0)::numeric))
);

ALTER TABLE ONLY public.lead_bids REPLICA IDENTITY FULL;


--
-- Name: lead_quality_factors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_quality_factors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid NOT NULL,
    quality_score integer NOT NULL,
    value_score integer DEFAULT 0,
    urgency_score integer DEFAULT 0,
    completeness_score integer DEFAULT 0,
    historical_score integer DEFAULT 0,
    provider_fit_score integer DEFAULT 0,
    predicted_conversion_probability numeric(5,2),
    recommended_price numeric(10,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT lead_quality_factors_quality_score_check CHECK (((quality_score >= 0) AND (quality_score <= 100)))
);


--
-- Name: lead_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lead_transactions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id uuid NOT NULL,
    lead_id uuid NOT NULL,
    amount numeric NOT NULL,
    currency text DEFAULT 'CHF'::text,
    status text DEFAULT 'pending'::text NOT NULL,
    stripe_payment_intent_id text,
    purchased_at timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    conversion_status text DEFAULT 'pending'::text,
    conversion_date timestamp with time zone,
    actual_job_value numeric,
    conversion_notes text,
    lost_reason text,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT lead_transactions_conversion_status_check CHECK ((conversion_status = ANY (ARRAY['pending'::text, 'converted'::text, 'lost'::text, 'expired'::text]))),
    CONSTRAINT lead_transactions_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])))
);


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text,
    move_date date,
    from_postal text NOT NULL,
    from_city text NOT NULL,
    to_postal text NOT NULL,
    to_city text NOT NULL,
    calculator_type text NOT NULL,
    calculator_input jsonb NOT NULL,
    calculator_output jsonb NOT NULL,
    comments text,
    status text DEFAULT 'new'::text,
    created_at timestamp with time zone DEFAULT now(),
    assigned_provider_ids uuid[] DEFAULT '{}'::uuid[],
    lead_source text DEFAULT 'umzugsrechner'::text,
    bidding_enabled boolean DEFAULT false,
    bidding_closes_at timestamp with time zone,
    starting_bid numeric,
    current_highest_bid numeric,
    bid_count integer DEFAULT 0,
    estimate_session_id uuid,
    selected_company_ids uuid[] DEFAULT ARRAY[]::uuid[],
    bundled_estimate_id uuid,
    CONSTRAINT leads_status_check CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'quoted'::text, 'closed'::text])))
);


--
-- Name: ml_ranking_models; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ml_ranking_models (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    model_name text NOT NULL,
    model_version text NOT NULL,
    training_data jsonb NOT NULL,
    accuracy_score numeric DEFAULT 0,
    last_trained_at timestamp with time zone DEFAULT now(),
    status text DEFAULT 'active'::text NOT NULL,
    recommendations jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    email text NOT NULL,
    subscribed_at timestamp with time zone DEFAULT now() NOT NULL,
    is_active boolean DEFAULT true,
    source text DEFAULT 'homepage'::text,
    unsubscribed_at timestamp with time zone
);


--
-- Name: payment_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payment_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id uuid NOT NULL,
    amount numeric NOT NULL,
    currency text DEFAULT 'CHF'::text,
    payment_type text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    description text,
    stripe_payment_id text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT payment_history_payment_type_check CHECK ((payment_type = ANY (ARRAY['subscription'::text, 'per_lead'::text]))),
    CONSTRAINT payment_history_status_check CHECK ((status = ANY (ARRAY['pending'::text, 'completed'::text, 'failed'::text, 'refunded'::text])))
);


--
-- Name: platform_analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_analytics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    metric_date date DEFAULT CURRENT_DATE NOT NULL,
    total_leads integer DEFAULT 0,
    total_conversions integer DEFAULT 0,
    avg_lead_value numeric(10,2),
    total_revenue numeric(12,2),
    active_providers integer DEFAULT 0,
    new_providers integer DEFAULT 0,
    avg_response_time_hours numeric(10,2),
    customer_satisfaction_avg numeric(3,2),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: price_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_alerts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_email text NOT NULL,
    canton_code text NOT NULL,
    max_price numeric NOT NULL,
    alert_frequency text DEFAULT 'daily'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_triggered_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    full_name text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: provider_availability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider_availability (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id uuid NOT NULL,
    date date NOT NULL,
    slots_available integer DEFAULT 0,
    slots_booked integer DEFAULT 0,
    is_available boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: provider_click_events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider_click_events (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id uuid NOT NULL,
    event_type text NOT NULL,
    price_chf numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    user_ip text,
    user_agent text,
    referer text,
    CONSTRAINT provider_click_events_event_type_check CHECK ((event_type = ANY (ARRAY['profile_view'::text, 'external_link'::text, 'phone_click'::text, 'email_click'::text])))
);


--
-- Name: provider_conversion_stats; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.provider_conversion_stats WITH (security_invoker='true') AS
 SELECT provider_id,
    count(*) AS total_leads,
    count(*) FILTER (WHERE (conversion_status = 'converted'::text)) AS converted_leads,
    count(*) FILTER (WHERE (conversion_status = 'lost'::text)) AS lost_leads,
    count(*) FILTER (WHERE (conversion_status = 'pending'::text)) AS pending_leads,
    round((((count(*) FILTER (WHERE (conversion_status = 'converted'::text)))::numeric / NULLIF((count(*) FILTER (WHERE (conversion_status = ANY (ARRAY['converted'::text, 'lost'::text]))))::numeric, (0)::numeric)) * (100)::numeric), 2) AS conversion_rate,
    avg(actual_job_value) FILTER (WHERE (conversion_status = 'converted'::text)) AS avg_job_value,
    avg((EXTRACT(epoch FROM (conversion_date - purchased_at)) / (86400)::numeric)) FILTER (WHERE (conversion_status = 'converted'::text)) AS avg_days_to_convert
   FROM public.lead_transactions
  GROUP BY provider_id;


--
-- Name: provider_performance_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider_performance_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id uuid NOT NULL,
    metric_date date DEFAULT CURRENT_DATE NOT NULL,
    leads_received integer DEFAULT 0,
    leads_viewed integer DEFAULT 0,
    leads_contacted integer DEFAULT 0,
    leads_converted integer DEFAULT 0,
    response_time_avg_hours numeric(10,2),
    conversion_rate numeric(5,2),
    customer_satisfaction_score numeric(3,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: provider_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider_subscriptions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    provider_id uuid NOT NULL,
    plan_id uuid NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    start_date timestamp with time zone DEFAULT now() NOT NULL,
    end_date timestamp with time zone,
    stripe_subscription_id text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT provider_subscriptions_status_check CHECK ((status = ANY (ARRAY['active'::text, 'cancelled'::text, 'expired'::text, 'paused'::text])))
);


--
-- Name: ranking_benchmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ranking_benchmarks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    snapshot_date timestamp with time zone DEFAULT now() NOT NULL,
    configuration jsonb NOT NULL,
    total_impressions integer DEFAULT 0,
    total_conversions integer DEFAULT 0,
    avg_conversion_rate numeric DEFAULT 0,
    avg_time_to_conversion numeric DEFAULT 0,
    revenue_generated numeric DEFAULT 0,
    notes text,
    created_by text
);


--
-- Name: ranking_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ranking_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    company_name text NOT NULL,
    "position" integer NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    changed_at timestamp with time zone DEFAULT now(),
    changed_by text
);


--
-- Name: rate_limits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rate_limits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    identifier text NOT NULL,
    action_type text NOT NULL,
    attempt_count integer DEFAULT 1 NOT NULL,
    window_start timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: realtime_ranking_metrics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.realtime_ranking_metrics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    metric_type text NOT NULL,
    company_id uuid,
    value numeric NOT NULL,
    metadata jsonb,
    recorded_at timestamp with time zone DEFAULT now()
);


--
-- Name: regional_rankings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.regional_rankings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    region_code text NOT NULL,
    region_name text NOT NULL,
    company_id uuid NOT NULL,
    "position" integer NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: review_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_photos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid,
    photo_url text NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now(),
    display_order integer DEFAULT 0
);


--
-- Name: review_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_requests (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lead_id uuid NOT NULL,
    provider_id uuid NOT NULL,
    customer_email text NOT NULL,
    customer_name text NOT NULL,
    request_sent_at timestamp with time zone DEFAULT now(),
    reminder_sent_at timestamp with time zone,
    review_submitted boolean DEFAULT false,
    review_id uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: review_responses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_responses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    company_id uuid NOT NULL,
    user_id uuid NOT NULL,
    response text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: review_votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_votes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    user_id uuid NOT NULL,
    lead_id uuid,
    rating numeric(2,1) NOT NULL,
    title text NOT NULL,
    comment text NOT NULL,
    service_ratings jsonb DEFAULT '{}'::jsonb,
    photos text[] DEFAULT ARRAY[]::text[],
    verified boolean DEFAULT false,
    helpful_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT reviews_rating_check CHECK (((rating >= (1)::numeric) AND (rating <= (5)::numeric)))
);


--
-- Name: scheduled_rankings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scheduled_rankings (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    scheduled_date timestamp with time zone NOT NULL,
    configuration jsonb NOT NULL,
    description text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    executed_at timestamp with time zone,
    created_by text
);


--
-- Name: seasonal_ranking_presets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.seasonal_ranking_presets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    season text NOT NULL,
    description text,
    configuration jsonb NOT NULL,
    is_active boolean DEFAULT false,
    created_by text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: service_providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_providers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_name text NOT NULL,
    contact_person_name text NOT NULL,
    email text NOT NULL,
    password_hash text NOT NULL,
    phone text NOT NULL,
    website text,
    street text NOT NULL,
    zip text NOT NULL,
    city text NOT NULL,
    country text DEFAULT 'Schweiz'::text NOT NULL,
    cantons_served text[] DEFAULT '{}'::text[] NOT NULL,
    services_offered text[] DEFAULT '{}'::text[] NOT NULL,
    description text,
    fleet_size integer,
    employees_count integer,
    price_level public.price_level DEFAULT 'fair'::public.price_level,
    logo_url text,
    verification_status public.verification_status DEFAULT 'pending'::public.verification_status NOT NULL,
    max_leads_per_month integer DEFAULT 50,
    preferred_regions text[] DEFAULT '{}'::text[],
    min_job_value numeric(10,2),
    account_status public.account_status DEFAULT 'active'::public.account_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    billing_model text DEFAULT 'CPL'::text,
    lead_price_chf numeric DEFAULT 25.00,
    click_price_chf numeric DEFAULT 1.50,
    subscription_plan text DEFAULT 'none'::text,
    monthly_fee_chf numeric DEFAULT 0,
    is_featured boolean DEFAULT false,
    ranking_position integer,
    featured_position integer,
    phone_tracking_number text,
    certifications text[] DEFAULT '{}'::text[],
    response_time_minutes integer,
    avg_completion_time_hours integer,
    success_rate numeric,
    discount_offer text,
    profile_gallery text[] DEFAULT '{}'::text[],
    short_description text,
    long_description text,
    slug text,
    cities_served text[] DEFAULT '{}'::text[],
    sponsored_tier integer,
    cpl_enabled boolean DEFAULT false,
    cpc_enabled boolean DEFAULT false,
    call_tracking_enabled boolean DEFAULT false,
    cpl_price_chf numeric(10,2) DEFAULT 25.00,
    cpc_price_chf numeric(10,2) DEFAULT 1.50,
    call_price_chf numeric(10,2) DEFAULT 5.00,
    bidding_active boolean DEFAULT false,
    max_bid_chf numeric(10,2) DEFAULT 0.00,
    daily_budget_chf numeric(10,2) DEFAULT 100.00,
    daily_budget_remaining_chf numeric(10,2) DEFAULT 100.00,
    quality_score numeric(3,2) DEFAULT 0.50,
    profile_completeness numeric(3,2) DEFAULT 0.00,
    team_members jsonb DEFAULT '[]'::jsonb,
    booking_calendar_url text,
    working_hours jsonb DEFAULT '{}'::jsonb,
    CONSTRAINT service_providers_billing_model_check CHECK ((billing_model = ANY (ARRAY['CPL'::text, 'PPC'::text, 'Subscription'::text]))),
    CONSTRAINT service_providers_sponsored_tier_check CHECK (((sponsored_tier >= 1) AND (sponsored_tier <= 4))),
    CONSTRAINT service_providers_subscription_plan_check CHECK ((subscription_plan = ANY (ARRAY['none'::text, 'basic'::text, 'premium'::text, 'enterprise'::text]))),
    CONSTRAINT service_providers_success_rate_check CHECK (((success_rate >= (0)::numeric) AND (success_rate <= (100)::numeric)))
);


--
-- Name: service_providers_public; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.service_providers_public WITH (security_invoker='true') AS
 SELECT id,
    company_name,
    contact_person_name,
    city,
    zip,
    country,
    cantons_served,
    cities_served,
    services_offered,
    description,
    short_description,
    long_description,
    logo_url,
    profile_gallery,
    website,
    fleet_size,
    employees_count,
    certifications,
    team_members,
    working_hours,
    booking_calendar_url,
    discount_offer,
    price_level,
    quality_score,
    success_rate,
    response_time_minutes,
    avg_completion_time_hours,
    ranking_position,
    featured_position,
    is_featured,
    sponsored_tier,
    profile_completeness,
    verification_status,
    account_status,
    slug,
    created_at,
    updated_at
   FROM public.service_providers
  WHERE ((verification_status = 'approved'::public.verification_status) AND (account_status = 'active'::public.account_status));


--
-- Name: sponsored_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sponsored_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    company_id uuid NOT NULL,
    tier integer NOT NULL,
    region text,
    monthly_price_chf numeric NOT NULL,
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT sponsored_plans_tier_check CHECK (((tier >= 1) AND (tier <= 4)))
);


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    price_monthly numeric NOT NULL,
    price_yearly numeric,
    max_leads_per_month integer,
    features jsonb DEFAULT '[]'::jsonb,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    tier_name text,
    priority_level integer DEFAULT 1,
    advanced_analytics boolean DEFAULT false,
    auto_bidding boolean DEFAULT false,
    competitor_insights boolean DEFAULT false,
    display_order integer DEFAULT 0
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    role public.app_role NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: ab_tests ab_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ab_tests
    ADD CONSTRAINT ab_tests_pkey PRIMARY KEY (id);


--
-- Name: billing_records billing_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_records
    ADD CONSTRAINT billing_records_pkey PRIMARY KEY (id);


--
-- Name: bundled_estimates bundled_estimates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bundled_estimates
    ADD CONSTRAINT bundled_estimates_pkey PRIMARY KEY (id);


--
-- Name: call_tracking call_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_tracking
    ADD CONSTRAINT call_tracking_pkey PRIMARY KEY (id);


--
-- Name: companies companies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.companies
    ADD CONSTRAINT companies_pkey PRIMARY KEY (id);


--
-- Name: conversion_analytics conversion_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversion_analytics
    ADD CONSTRAINT conversion_analytics_pkey PRIMARY KEY (id);


--
-- Name: email_automation_settings email_automation_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_automation_settings
    ADD CONSTRAINT email_automation_settings_pkey PRIMARY KEY (id);


--
-- Name: email_campaigns email_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_campaigns
    ADD CONSTRAINT email_campaigns_pkey PRIMARY KEY (id);


--
-- Name: email_queue email_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_queue
    ADD CONSTRAINT email_queue_pkey PRIMARY KEY (id);


--
-- Name: estimate_sessions estimate_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.estimate_sessions
    ADD CONSTRAINT estimate_sessions_pkey PRIMARY KEY (id);


--
-- Name: historical_pricing historical_pricing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.historical_pricing
    ADD CONSTRAINT historical_pricing_pkey PRIMARY KEY (id);


--
-- Name: lead_bids lead_bids_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_bids
    ADD CONSTRAINT lead_bids_pkey PRIMARY KEY (id);


--
-- Name: lead_quality_factors lead_quality_factors_lead_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_quality_factors
    ADD CONSTRAINT lead_quality_factors_lead_id_key UNIQUE (lead_id);


--
-- Name: lead_quality_factors lead_quality_factors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_quality_factors
    ADD CONSTRAINT lead_quality_factors_pkey PRIMARY KEY (id);


--
-- Name: lead_transactions lead_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_transactions
    ADD CONSTRAINT lead_transactions_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: ml_ranking_models ml_ranking_models_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ml_ranking_models
    ADD CONSTRAINT ml_ranking_models_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_key UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: payment_history payment_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_pkey PRIMARY KEY (id);


--
-- Name: platform_analytics platform_analytics_metric_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_analytics
    ADD CONSTRAINT platform_analytics_metric_date_key UNIQUE (metric_date);


--
-- Name: platform_analytics platform_analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_analytics
    ADD CONSTRAINT platform_analytics_pkey PRIMARY KEY (id);


--
-- Name: price_alerts price_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_alerts
    ADD CONSTRAINT price_alerts_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: provider_availability provider_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_availability
    ADD CONSTRAINT provider_availability_pkey PRIMARY KEY (id);


--
-- Name: provider_availability provider_availability_provider_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_availability
    ADD CONSTRAINT provider_availability_provider_id_date_key UNIQUE (provider_id, date);


--
-- Name: provider_click_events provider_click_events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_click_events
    ADD CONSTRAINT provider_click_events_pkey PRIMARY KEY (id);


--
-- Name: provider_performance_metrics provider_performance_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_performance_metrics
    ADD CONSTRAINT provider_performance_metrics_pkey PRIMARY KEY (id);


--
-- Name: provider_performance_metrics provider_performance_metrics_provider_id_metric_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_performance_metrics
    ADD CONSTRAINT provider_performance_metrics_provider_id_metric_date_key UNIQUE (provider_id, metric_date);


--
-- Name: provider_subscriptions provider_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_subscriptions
    ADD CONSTRAINT provider_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: ranking_benchmarks ranking_benchmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranking_benchmarks
    ADD CONSTRAINT ranking_benchmarks_pkey PRIMARY KEY (id);


--
-- Name: ranking_history ranking_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranking_history
    ADD CONSTRAINT ranking_history_pkey PRIMARY KEY (id);


--
-- Name: rate_limits rate_limits_identifier_action_type_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_identifier_action_type_key UNIQUE (identifier, action_type);


--
-- Name: rate_limits rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rate_limits
    ADD CONSTRAINT rate_limits_pkey PRIMARY KEY (id);


--
-- Name: realtime_ranking_metrics realtime_ranking_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realtime_ranking_metrics
    ADD CONSTRAINT realtime_ranking_metrics_pkey PRIMARY KEY (id);


--
-- Name: regional_rankings regional_rankings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regional_rankings
    ADD CONSTRAINT regional_rankings_pkey PRIMARY KEY (id);


--
-- Name: review_photos review_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_photos
    ADD CONSTRAINT review_photos_pkey PRIMARY KEY (id);


--
-- Name: review_requests review_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_requests
    ADD CONSTRAINT review_requests_pkey PRIMARY KEY (id);


--
-- Name: review_responses review_responses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_responses
    ADD CONSTRAINT review_responses_pkey PRIMARY KEY (id);


--
-- Name: review_votes review_votes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: scheduled_rankings scheduled_rankings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scheduled_rankings
    ADD CONSTRAINT scheduled_rankings_pkey PRIMARY KEY (id);


--
-- Name: seasonal_ranking_presets seasonal_ranking_presets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.seasonal_ranking_presets
    ADD CONSTRAINT seasonal_ranking_presets_pkey PRIMARY KEY (id);


--
-- Name: service_providers service_providers_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_email_key UNIQUE (email);


--
-- Name: service_providers service_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_pkey PRIMARY KEY (id);


--
-- Name: service_providers service_providers_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_slug_key UNIQUE (slug);


--
-- Name: sponsored_plans sponsored_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sponsored_plans
    ADD CONSTRAINT sponsored_plans_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: review_responses unique_review_response; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_responses
    ADD CONSTRAINT unique_review_response UNIQUE (review_id);


--
-- Name: reviews unique_user_company_review; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT unique_user_company_review UNIQUE (user_id, company_id);


--
-- Name: review_votes unique_user_review_vote; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT unique_user_review_vote UNIQUE (user_id, review_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role);


--
-- Name: idx_ab_tests_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ab_tests_status ON public.ab_tests USING btree (status);


--
-- Name: idx_benchmarks_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_benchmarks_date ON public.ranking_benchmarks USING btree (snapshot_date);


--
-- Name: idx_billing_records_period; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_records_period ON public.billing_records USING btree (billing_period);


--
-- Name: idx_billing_records_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_records_provider ON public.billing_records USING btree (provider_id);


--
-- Name: idx_billing_records_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_billing_records_status ON public.billing_records USING btree (status);


--
-- Name: idx_call_tracking_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_call_tracking_company ON public.call_tracking USING btree (company_id);


--
-- Name: idx_click_events_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_click_events_date ON public.provider_click_events USING btree (created_at);


--
-- Name: idx_click_events_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_click_events_provider ON public.provider_click_events USING btree (provider_id);


--
-- Name: idx_companies_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_companies_featured ON public.companies USING btree (featured) WHERE (featured = true);


--
-- Name: idx_companies_rating; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_companies_rating ON public.companies USING btree (rating DESC);


--
-- Name: idx_companies_service_areas; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_companies_service_areas ON public.companies USING gin (service_areas);


--
-- Name: idx_conversion_analytics_city; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversion_analytics_city ON public.conversion_analytics USING btree (city);


--
-- Name: idx_conversion_analytics_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversion_analytics_created_at ON public.conversion_analytics USING btree (created_at);


--
-- Name: idx_conversion_analytics_service; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_conversion_analytics_service ON public.conversion_analytics USING btree (service);


--
-- Name: idx_email_automation_alert_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_automation_alert_type ON public.email_automation_settings USING btree (alert_type);


--
-- Name: idx_email_automation_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_automation_user_id ON public.email_automation_settings USING btree (user_id);


--
-- Name: idx_email_queue_scheduled; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_queue_scheduled ON public.email_queue USING btree (scheduled_for) WHERE (status = 'pending'::text);


--
-- Name: idx_email_queue_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_email_queue_status ON public.email_queue USING btree (status);


--
-- Name: idx_estimate_sessions_conversion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_estimate_sessions_conversion ON public.estimate_sessions USING btree (viewed_companies, submitted_lead);


--
-- Name: idx_estimate_sessions_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_estimate_sessions_created_at ON public.estimate_sessions USING btree (created_at DESC);


--
-- Name: idx_estimate_sessions_funnel_variant; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_estimate_sessions_funnel_variant ON public.estimate_sessions USING btree (funnel_variant);


--
-- Name: idx_historical_pricing_canton; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_historical_pricing_canton ON public.historical_pricing USING btree (canton_code);


--
-- Name: idx_historical_pricing_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_historical_pricing_date ON public.historical_pricing USING btree (year DESC, month);


--
-- Name: idx_lead_bids_lead_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_bids_lead_id ON public.lead_bids USING btree (lead_id);


--
-- Name: idx_lead_bids_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_bids_provider_id ON public.lead_bids USING btree (provider_id);


--
-- Name: idx_lead_bids_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_bids_status ON public.lead_bids USING btree (status);


--
-- Name: idx_lead_quality_lead; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_quality_lead ON public.lead_quality_factors USING btree (lead_id);


--
-- Name: idx_lead_quality_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_quality_score ON public.lead_quality_factors USING btree (quality_score DESC);


--
-- Name: idx_lead_transactions_conversion_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_transactions_conversion_status ON public.lead_transactions USING btree (conversion_status);


--
-- Name: idx_lead_transactions_lead_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_transactions_lead_id ON public.lead_transactions USING btree (lead_id);


--
-- Name: idx_lead_transactions_provider_conversion; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_transactions_provider_conversion ON public.lead_transactions USING btree (provider_id, conversion_status);


--
-- Name: idx_lead_transactions_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lead_transactions_provider_id ON public.lead_transactions USING btree (provider_id);


--
-- Name: idx_leads_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_created_at ON public.leads USING btree (created_at DESC);


--
-- Name: idx_leads_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_leads_status ON public.leads USING btree (status);


--
-- Name: idx_ml_models_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ml_models_status ON public.ml_ranking_models USING btree (status);


--
-- Name: idx_newsletter_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_newsletter_active ON public.newsletter_subscribers USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_newsletter_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers USING btree (email);


--
-- Name: idx_payment_history_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_payment_history_provider_id ON public.payment_history USING btree (provider_id);


--
-- Name: idx_platform_analytics_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_platform_analytics_date ON public.platform_analytics USING btree (metric_date DESC);


--
-- Name: idx_price_alerts_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_price_alerts_active ON public.price_alerts USING btree (is_active) WHERE (is_active = true);


--
-- Name: idx_price_alerts_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_price_alerts_email ON public.price_alerts USING btree (user_email);


--
-- Name: idx_provider_availability_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provider_availability_date ON public.provider_availability USING btree (date);


--
-- Name: idx_provider_availability_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provider_availability_provider ON public.provider_availability USING btree (provider_id);


--
-- Name: idx_provider_performance_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provider_performance_date ON public.provider_performance_metrics USING btree (metric_date DESC);


--
-- Name: idx_provider_performance_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provider_performance_provider ON public.provider_performance_metrics USING btree (provider_id);


--
-- Name: idx_provider_subscriptions_provider_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provider_subscriptions_provider_id ON public.provider_subscriptions USING btree (provider_id);


--
-- Name: idx_provider_subscriptions_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_provider_subscriptions_status ON public.provider_subscriptions USING btree (status);


--
-- Name: idx_providers_bidding; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_providers_bidding ON public.service_providers USING btree (bidding_active, sponsored_tier) WHERE ((bidding_active = true) OR (sponsored_tier > 0));


--
-- Name: idx_ranking_history_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ranking_history_company ON public.ranking_history USING btree (company_id);


--
-- Name: idx_ranking_history_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_ranking_history_date ON public.ranking_history USING btree (changed_at);


--
-- Name: idx_realtime_metrics_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realtime_metrics_company ON public.realtime_ranking_metrics USING btree (company_id);


--
-- Name: idx_realtime_metrics_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realtime_metrics_time ON public.realtime_ranking_metrics USING btree (recorded_at);


--
-- Name: idx_realtime_metrics_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_realtime_metrics_type ON public.realtime_ranking_metrics USING btree (metric_type);


--
-- Name: idx_regional_rankings_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_regional_rankings_company ON public.regional_rankings USING btree (company_id);


--
-- Name: idx_regional_rankings_region; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_regional_rankings_region ON public.regional_rankings USING btree (region_code);


--
-- Name: idx_review_photos_review; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_photos_review ON public.review_photos USING btree (review_id);


--
-- Name: idx_review_requests_lead; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_requests_lead ON public.review_requests USING btree (lead_id);


--
-- Name: idx_review_requests_provider; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_requests_provider ON public.review_requests USING btree (provider_id);


--
-- Name: idx_scheduled_rankings_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scheduled_rankings_date ON public.scheduled_rankings USING btree (scheduled_date);


--
-- Name: idx_scheduled_rankings_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_scheduled_rankings_status ON public.scheduled_rankings USING btree (status);


--
-- Name: idx_seasonal_presets_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seasonal_presets_active ON public.seasonal_ranking_presets USING btree (is_active);


--
-- Name: idx_seasonal_presets_season; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_seasonal_presets_season ON public.seasonal_ranking_presets USING btree (season);


--
-- Name: idx_service_providers_featured; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_providers_featured ON public.service_providers USING btree (featured_position) WHERE ((is_featured = true) AND (featured_position IS NOT NULL));


--
-- Name: idx_service_providers_ranking; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_providers_ranking ON public.service_providers USING btree (ranking_position) WHERE (ranking_position IS NOT NULL);


--
-- Name: idx_service_providers_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_service_providers_slug ON public.service_providers USING btree (slug);


--
-- Name: idx_sponsored_plans_company; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_sponsored_plans_company ON public.sponsored_plans USING btree (company_id);


--
-- Name: service_providers track_ranking_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER track_ranking_changes AFTER UPDATE ON public.service_providers FOR EACH ROW EXECUTE FUNCTION public.log_ranking_change();


--
-- Name: leads trigger_auto_assign_providers; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_auto_assign_providers BEFORE INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.auto_assign_providers_to_lead();


--
-- Name: leads trigger_calculate_lead_quality; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_calculate_lead_quality AFTER INSERT ON public.leads FOR EACH ROW EXECUTE FUNCTION public.calculate_lead_quality_on_insert();


--
-- Name: lead_bids trigger_update_bid_stats; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_bid_stats AFTER INSERT ON public.lead_bids FOR EACH ROW EXECUTE FUNCTION public.update_lead_bid_stats();


--
-- Name: lead_transactions trigger_update_provider_metrics; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_update_provider_metrics AFTER INSERT OR UPDATE ON public.lead_transactions FOR EACH ROW EXECUTE FUNCTION public.update_provider_performance_metrics();


--
-- Name: companies update_companies_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: lead_transactions update_conversion_tracking_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_conversion_tracking_trigger BEFORE UPDATE ON public.lead_transactions FOR EACH ROW EXECUTE FUNCTION public.update_conversion_tracking();


--
-- Name: price_alerts update_price_alerts_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_price_alerts_updated_at BEFORE UPDATE ON public.price_alerts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: profiles update_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: provider_subscriptions update_provider_subscriptions_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_provider_subscriptions_updated_at BEFORE UPDATE ON public.provider_subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: review_responses update_review_responses_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_review_responses_updated_at BEFORE UPDATE ON public.review_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: reviews update_reviews_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: service_providers update_service_providers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_service_providers_updated_at BEFORE UPDATE ON public.service_providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subscription_plans update_subscription_plans_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON public.subscription_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: billing_records billing_records_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_records
    ADD CONSTRAINT billing_records_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: billing_records billing_records_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.billing_records
    ADD CONSTRAINT billing_records_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: call_tracking call_tracking_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.call_tracking
    ADD CONSTRAINT call_tracking_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: conversion_analytics conversion_analytics_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversion_analytics
    ADD CONSTRAINT conversion_analytics_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.service_providers(id);


--
-- Name: conversion_analytics conversion_analytics_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.conversion_analytics
    ADD CONSTRAINT conversion_analytics_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id);


--
-- Name: email_automation_settings email_automation_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_automation_settings
    ADD CONSTRAINT email_automation_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: email_queue email_queue_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_queue
    ADD CONSTRAINT email_queue_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.email_campaigns(id);


--
-- Name: email_queue email_queue_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_queue
    ADD CONSTRAINT email_queue_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id);


--
-- Name: lead_bids lead_bids_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_bids
    ADD CONSTRAINT lead_bids_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: lead_bids lead_bids_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_bids
    ADD CONSTRAINT lead_bids_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: lead_quality_factors lead_quality_factors_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_quality_factors
    ADD CONSTRAINT lead_quality_factors_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: lead_transactions lead_transactions_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_transactions
    ADD CONSTRAINT lead_transactions_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: lead_transactions lead_transactions_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lead_transactions
    ADD CONSTRAINT lead_transactions_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: leads leads_bundled_estimate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_bundled_estimate_id_fkey FOREIGN KEY (bundled_estimate_id) REFERENCES public.bundled_estimates(id);


--
-- Name: leads leads_estimate_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_estimate_session_id_fkey FOREIGN KEY (estimate_session_id) REFERENCES public.estimate_sessions(id);


--
-- Name: payment_history payment_history_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payment_history
    ADD CONSTRAINT payment_history_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: provider_availability provider_availability_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_availability
    ADD CONSTRAINT provider_availability_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id);


--
-- Name: provider_click_events provider_click_events_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_click_events
    ADD CONSTRAINT provider_click_events_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: provider_performance_metrics provider_performance_metrics_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_performance_metrics
    ADD CONSTRAINT provider_performance_metrics_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: provider_subscriptions provider_subscriptions_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_subscriptions
    ADD CONSTRAINT provider_subscriptions_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.subscription_plans(id);


--
-- Name: provider_subscriptions provider_subscriptions_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_subscriptions
    ADD CONSTRAINT provider_subscriptions_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: ranking_history ranking_history_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ranking_history
    ADD CONSTRAINT ranking_history_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: realtime_ranking_metrics realtime_ranking_metrics_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.realtime_ranking_metrics
    ADD CONSTRAINT realtime_ranking_metrics_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: regional_rankings regional_rankings_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.regional_rankings
    ADD CONSTRAINT regional_rankings_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: review_photos review_photos_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_photos
    ADD CONSTRAINT review_photos_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_requests review_requests_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_requests
    ADD CONSTRAINT review_requests_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE CASCADE;


--
-- Name: review_requests review_requests_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_requests
    ADD CONSTRAINT review_requests_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: review_requests review_requests_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_requests
    ADD CONSTRAINT review_requests_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id);


--
-- Name: review_responses review_responses_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_responses
    ADD CONSTRAINT review_responses_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: review_responses review_responses_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_responses
    ADD CONSTRAINT review_responses_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_responses review_responses_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_responses
    ADD CONSTRAINT review_responses_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: review_votes review_votes_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(id) ON DELETE CASCADE;


--
-- Name: review_votes review_votes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_votes
    ADD CONSTRAINT review_votes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_lead_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_lead_id_fkey FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_profiles_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_profiles_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: sponsored_plans sponsored_plans_company_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sponsored_plans
    ADD CONSTRAINT sponsored_plans_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: review_responses Admins can create responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can create responses" ON public.review_responses FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: leads Admins can delete leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete leads" ON public.leads FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: review_responses Admins can delete responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete responses" ON public.review_responses FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ab_tests Admins can manage AB tests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage AB tests" ON public.ab_tests USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: reviews Admins can manage all reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all reviews" ON public.reviews TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ranking_benchmarks Admins can manage benchmarks; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage benchmarks" ON public.ranking_benchmarks USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: email_automation_settings Admins can manage email automation settings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage email automation settings" ON public.email_automation_settings USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: email_campaigns Admins can manage email campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage email campaigns" ON public.email_campaigns USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: email_queue Admins can manage email queue; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage email queue" ON public.email_queue USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: newsletter_subscribers Admins can manage newsletter subscribers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage newsletter subscribers" ON public.newsletter_subscribers USING (public.has_role(auth.uid(), 'admin'::public.app_role)) WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: payment_history Admins can manage payment history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage payment history" ON public.payment_history USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: regional_rankings Admins can manage regional rankings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage regional rankings" ON public.regional_rankings USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: scheduled_rankings Admins can manage scheduled rankings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage scheduled rankings" ON public.scheduled_rankings USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: seasonal_ranking_presets Admins can manage seasonal presets; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage seasonal presets" ON public.seasonal_ranking_presets USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: sponsored_plans Admins can manage sponsored plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage sponsored plans" ON public.sponsored_plans USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: subscription_plans Admins can manage subscription plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage subscription plans" ON public.subscription_plans USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: provider_subscriptions Admins can manage subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage subscriptions" ON public.provider_subscriptions USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: lead_transactions Admins can manage transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage transactions" ON public.lead_transactions USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: service_providers Admins can update all service providers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update all service providers" ON public.service_providers FOR UPDATE USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: leads Admins can update leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update leads" ON public.leads FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: review_responses Admins can update responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update responses" ON public.review_responses FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: ml_ranking_models Admins can view ML models; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view ML models" ON public.ml_ranking_models FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: lead_bids Admins can view all bids; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all bids" ON public.lead_bids FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: billing_records Admins can view all billing records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all billing records" ON public.billing_records FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: call_tracking Admins can view all call tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all call tracking" ON public.call_tracking FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: provider_click_events Admins can view all click events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all click events" ON public.provider_click_events FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: leads Admins can view all leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all leads" ON public.leads FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: payment_history Admins can view all payment history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all payment history" ON public.payment_history FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Admins can view all roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: service_providers Admins can view all service providers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all service providers" ON public.service_providers FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: provider_subscriptions Admins can view all subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all subscriptions" ON public.provider_subscriptions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: lead_transactions Admins can view all transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view all transactions" ON public.lead_transactions FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: platform_analytics Admins can view platform analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view platform analytics" ON public.platform_analytics FOR SELECT USING ((EXISTS ( SELECT 1
   FROM public.user_roles
  WHERE ((user_roles.user_id = auth.uid()) AND (user_roles.role = 'admin'::public.app_role)))));


--
-- Name: ranking_history Admins can view ranking history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view ranking history" ON public.ranking_history FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: realtime_ranking_metrics Admins can view realtime metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can view realtime metrics" ON public.realtime_ranking_metrics FOR SELECT USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: bundled_estimates Anyone can create bundled estimates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create bundled estimates" ON public.bundled_estimates FOR INSERT WITH CHECK (true);


--
-- Name: estimate_sessions Anyone can create estimate sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create estimate sessions" ON public.estimate_sessions FOR INSERT WITH CHECK (true);


--
-- Name: leads Anyone can create leads; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);


--
-- Name: price_alerts Anyone can create price alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create price alerts" ON public.price_alerts FOR INSERT WITH CHECK (true);


--
-- Name: service_providers Anyone can create service provider account; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can create service provider account" ON public.service_providers FOR INSERT WITH CHECK (true);


--
-- Name: newsletter_subscribers Anyone can subscribe to newsletter; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);


--
-- Name: subscription_plans Anyone can view active subscription plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view active subscription plans" ON public.subscription_plans FOR SELECT USING ((is_active = true));


--
-- Name: conversion_analytics Anyone can view analytics data; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view analytics data" ON public.conversion_analytics FOR SELECT USING (true);


--
-- Name: bundled_estimates Anyone can view bundled estimates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view bundled estimates" ON public.bundled_estimates FOR SELECT USING (true);


--
-- Name: estimate_sessions Anyone can view estimate sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view estimate sessions" ON public.estimate_sessions FOR SELECT USING (true);


--
-- Name: historical_pricing Anyone can view historical pricing; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view historical pricing" ON public.historical_pricing FOR SELECT USING (true);


--
-- Name: provider_availability Anyone can view provider availability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view provider availability" ON public.provider_availability FOR SELECT USING (true);


--
-- Name: review_responses Anyone can view responses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view responses" ON public.review_responses FOR SELECT USING (true);


--
-- Name: review_photos Anyone can view review photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view review photos" ON public.review_photos FOR SELECT USING (true);


--
-- Name: review_votes Anyone can view review votes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view review votes" ON public.review_votes FOR SELECT USING (true);


--
-- Name: reviews Anyone can view reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);


--
-- Name: estimate_sessions Authenticated update estimate sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated update estimate sessions" ON public.estimate_sessions FOR UPDATE TO authenticated USING (true);


--
-- Name: reviews Authenticated users can create reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: review_votes Authenticated users can vote; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can vote" ON public.review_votes FOR INSERT TO authenticated WITH CHECK ((auth.uid() = user_id));


--
-- Name: bundled_estimates Authenticated view bundled estimates; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated view bundled estimates" ON public.bundled_estimates FOR SELECT USING (true);


--
-- Name: estimate_sessions Authenticated view estimate sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated view estimate sessions" ON public.estimate_sessions FOR SELECT TO authenticated USING (true);


--
-- Name: lead_quality_factors Authorized view lead quality; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authorized view lead quality" ON public.lead_quality_factors FOR SELECT TO authenticated USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (lead_id IN ( SELECT l.id
   FROM public.leads l
  WHERE (l.assigned_provider_ids @> ARRAY[( SELECT service_providers.id
           FROM public.service_providers
          WHERE (service_providers.email = (( SELECT users.email
                   FROM auth.users
                  WHERE (users.id = auth.uid())))::text))])))));


--
-- Name: companies Companies are viewable by everyone; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Companies are viewable by everyone" ON public.companies FOR SELECT USING (true);


--
-- Name: user_roles Only admins can delete roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: conversion_analytics Only admins can insert analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can insert analytics" ON public.conversion_analytics FOR INSERT WITH CHECK (true);


--
-- Name: user_roles Only admins can insert roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: user_roles Only admins can update roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Only admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'::public.app_role));


--
-- Name: lead_bids Providers can create bids; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can create bids" ON public.lead_bids FOR INSERT WITH CHECK ((provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: provider_availability Providers can manage their own availability; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can manage their own availability" ON public.provider_availability USING (((provider_id)::text = (auth.jwt() ->> 'sub'::text)));


--
-- Name: lead_bids Providers can update their own bids; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can update their own bids" ON public.lead_bids FOR UPDATE USING ((provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: lead_bids Providers can view bids on leads they can access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view bids on leads they can access" ON public.lead_bids FOR SELECT USING (((provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))) OR (lead_id IN ( SELECT leads.id
   FROM public.leads
  WHERE (leads.assigned_provider_ids @> ARRAY[( SELECT service_providers.id
           FROM public.service_providers
          WHERE (service_providers.email = (( SELECT users.email
                   FROM auth.users
                  WHERE (users.id = auth.uid())))::text))])))));


--
-- Name: service_providers Providers can view own full record; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view own full record" ON public.service_providers FOR SELECT USING ((public.has_role(auth.uid(), 'admin'::public.app_role) OR (email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text)));


--
-- Name: provider_performance_metrics Providers can view own performance metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view own performance metrics" ON public.provider_performance_metrics FOR SELECT USING ((provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: review_requests Providers can view own review requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view own review requests" ON public.review_requests FOR SELECT USING ((provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: billing_records Providers can view their own billing records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view their own billing records" ON public.billing_records FOR SELECT USING ((provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: call_tracking Providers can view their own call tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view their own call tracking" ON public.call_tracking FOR SELECT USING ((company_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: provider_click_events Providers can view their own click events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view their own click events" ON public.provider_click_events FOR SELECT USING ((provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: payment_history Providers can view their own payment history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view their own payment history" ON public.payment_history FOR SELECT USING ((((provider_id)::text = (auth.uid())::text) OR (provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text)))));


--
-- Name: sponsored_plans Providers can view their own sponsored plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view their own sponsored plans" ON public.sponsored_plans FOR SELECT USING ((company_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))));


--
-- Name: provider_subscriptions Providers can view their own subscriptions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view their own subscriptions" ON public.provider_subscriptions FOR SELECT USING ((((provider_id)::text = (auth.uid())::text) OR (provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text)))));


--
-- Name: lead_transactions Providers can view their own transactions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers can view their own transactions" ON public.lead_transactions FOR SELECT USING ((((provider_id)::text = (auth.uid())::text) OR (provider_id IN ( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text)))));


--
-- Name: service_providers Providers update own profile authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers update own profile authenticated" ON public.service_providers FOR UPDATE TO authenticated USING ((email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text));


--
-- Name: leads Providers view assigned leads authenticated; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Providers view assigned leads authenticated" ON public.leads FOR SELECT TO authenticated USING ((assigned_provider_ids @> ARRAY[( SELECT service_providers.id
   FROM public.service_providers
  WHERE (service_providers.email = (( SELECT users.email
           FROM auth.users
          WHERE (users.id = auth.uid())))::text))]));


--
-- Name: review_photos Review owners can delete photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Review owners can delete photos" ON public.review_photos FOR DELETE USING ((EXISTS ( SELECT 1
   FROM public.reviews
  WHERE ((reviews.id = review_photos.review_id) AND ((reviews.user_id)::text = (auth.jwt() ->> 'sub'::text))))));


--
-- Name: review_photos Review owners can manage photos; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Review owners can manage photos" ON public.review_photos FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM public.reviews
  WHERE ((reviews.id = review_photos.review_id) AND ((reviews.user_id)::text = (auth.jwt() ->> 'sub'::text))))));


--
-- Name: service_providers Service providers can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service providers can update their own profile" ON public.service_providers FOR UPDATE USING ((((auth.uid())::text = (id)::text) OR (email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text)));


--
-- Name: service_providers Service providers can view their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service providers can view their own profile" ON public.service_providers FOR SELECT USING ((((auth.uid())::text = (id)::text) OR (email = (( SELECT users.email
   FROM auth.users
  WHERE (users.id = auth.uid())))::text)));


--
-- Name: billing_records Service role can manage billing; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage billing" ON public.billing_records TO service_role USING (true);


--
-- Name: call_tracking Service role can manage call tracking; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage call tracking" ON public.call_tracking USING (true);


--
-- Name: provider_click_events Service role can manage click events; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage click events" ON public.provider_click_events TO service_role USING (true);


--
-- Name: lead_quality_factors Service role can manage lead quality factors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage lead quality factors" ON public.lead_quality_factors TO service_role USING (true);


--
-- Name: provider_performance_metrics Service role can manage performance metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage performance metrics" ON public.provider_performance_metrics TO service_role USING (true);


--
-- Name: platform_analytics Service role can manage platform analytics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage platform analytics" ON public.platform_analytics TO service_role USING (true);


--
-- Name: service_providers Service role can manage providers; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage providers" ON public.service_providers USING (true) WITH CHECK (true);


--
-- Name: review_requests Service role can manage review requests; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage review requests" ON public.review_requests TO service_role USING (true);


--
-- Name: sponsored_plans Service role can manage sponsored plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role can manage sponsored plans" ON public.sponsored_plans USING (true);


--
-- Name: rate_limits Service role manage rate limits; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Service role manage rate limits" ON public.rate_limits TO service_role USING (true);


--
-- Name: ranking_history System can insert ranking history; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert ranking history" ON public.ranking_history FOR INSERT WITH CHECK (true);


--
-- Name: realtime_ranking_metrics System can insert realtime metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert realtime metrics" ON public.realtime_ranking_metrics FOR INSERT WITH CHECK (true);


--
-- Name: regional_rankings System can insert regional rankings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can insert regional rankings" ON public.regional_rankings FOR INSERT WITH CHECK (true);


--
-- Name: ml_ranking_models System can manage ML models; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage ML models" ON public.ml_ranking_models USING (true);


--
-- Name: billing_records System can manage billing records; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage billing records" ON public.billing_records USING (true);


--
-- Name: scheduled_rankings System can manage scheduled rankings; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can manage scheduled rankings" ON public.scheduled_rankings USING (true);


--
-- Name: ab_tests System can update AB test metrics; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "System can update AB test metrics" ON public.ab_tests FOR UPDATE USING (true);


--
-- Name: price_alerts Users can delete their own alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own alerts" ON public.price_alerts FOR DELETE TO authenticated USING ((user_email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)));


--
-- Name: reviews Users can delete their own reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can delete their own reviews" ON public.reviews FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: review_votes Users can remove their votes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can remove their votes" ON public.review_votes FOR DELETE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING ((auth.uid() = id));


--
-- Name: price_alerts Users can update their own alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own alerts" ON public.price_alerts FOR UPDATE TO authenticated USING ((user_email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)));


--
-- Name: reviews Users can update their own reviews; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE TO authenticated USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING ((auth.uid() = id));


--
-- Name: user_roles Users can view own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: price_alerts Users can view their own alerts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own alerts" ON public.price_alerts FOR SELECT TO authenticated USING ((user_email = ((current_setting('request.jwt.claims'::text, true))::json ->> 'email'::text)));


--
-- Name: user_roles Users can view their own roles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT TO authenticated USING ((auth.uid() = user_id));


--
-- Name: newsletter_subscribers Users can view their own subscription; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own subscription" ON public.newsletter_subscribers FOR SELECT USING ((auth.email() = email));


--
-- Name: ab_tests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ab_tests ENABLE ROW LEVEL SECURITY;

--
-- Name: billing_records; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.billing_records ENABLE ROW LEVEL SECURITY;

--
-- Name: bundled_estimates; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.bundled_estimates ENABLE ROW LEVEL SECURITY;

--
-- Name: call_tracking; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.call_tracking ENABLE ROW LEVEL SECURITY;

--
-- Name: companies; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

--
-- Name: conversion_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.conversion_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: email_automation_settings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_automation_settings ENABLE ROW LEVEL SECURITY;

--
-- Name: email_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: email_queue; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.email_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: estimate_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.estimate_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: historical_pricing; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.historical_pricing ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_bids; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lead_bids ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_quality_factors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lead_quality_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: lead_transactions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lead_transactions ENABLE ROW LEVEL SECURITY;

--
-- Name: leads; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

--
-- Name: ml_ranking_models; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ml_ranking_models ENABLE ROW LEVEL SECURITY;

--
-- Name: newsletter_subscribers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

--
-- Name: payment_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

--
-- Name: platform_analytics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.platform_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: price_alerts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: provider_availability; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.provider_availability ENABLE ROW LEVEL SECURITY;

--
-- Name: provider_click_events; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.provider_click_events ENABLE ROW LEVEL SECURITY;

--
-- Name: provider_performance_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.provider_performance_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: provider_subscriptions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.provider_subscriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: ranking_benchmarks; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ranking_benchmarks ENABLE ROW LEVEL SECURITY;

--
-- Name: ranking_history; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.ranking_history ENABLE ROW LEVEL SECURITY;

--
-- Name: rate_limits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

--
-- Name: realtime_ranking_metrics; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.realtime_ranking_metrics ENABLE ROW LEVEL SECURITY;

--
-- Name: regional_rankings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.regional_rankings ENABLE ROW LEVEL SECURITY;

--
-- Name: review_photos; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_photos ENABLE ROW LEVEL SECURITY;

--
-- Name: review_requests; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_requests ENABLE ROW LEVEL SECURITY;

--
-- Name: review_responses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_responses ENABLE ROW LEVEL SECURITY;

--
-- Name: review_votes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_votes ENABLE ROW LEVEL SECURITY;

--
-- Name: reviews; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

--
-- Name: scheduled_rankings; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.scheduled_rankings ENABLE ROW LEVEL SECURITY;

--
-- Name: seasonal_ranking_presets; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.seasonal_ranking_presets ENABLE ROW LEVEL SECURITY;

--
-- Name: service_providers; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.service_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: sponsored_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.sponsored_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: subscription_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


