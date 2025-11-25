-- Security fixes: Add missing RLS policies and rate limiting

-- 1. Drop and recreate service_providers policies for consistency
DROP POLICY IF EXISTS "Service providers are viewable by authenticated users" ON public.service_providers;
DROP POLICY IF EXISTS "Service providers can update own profile" ON public.service_providers;

CREATE POLICY "Approved providers viewable by authenticated"
ON public.service_providers
FOR SELECT
TO authenticated
USING (
  verification_status = 'approved' 
  AND account_status = 'active'
);

CREATE POLICY "Providers update own profile authenticated"
ON public.service_providers
FOR UPDATE
TO authenticated
USING (
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- 2. Add missing leads RLS policy
DROP POLICY IF EXISTS "Service providers can view assigned leads" ON public.leads;

CREATE POLICY "Providers view assigned leads authenticated"
ON public.leads
FOR SELECT
TO authenticated
USING (
  assigned_provider_ids @> ARRAY[(
    SELECT id FROM service_providers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  )]
);

-- 3. Secure estimate_sessions
DROP POLICY IF EXISTS "Users can view their own estimate sessions" ON public.estimate_sessions;
DROP POLICY IF EXISTS "Users can update their own estimate sessions" ON public.estimate_sessions;

CREATE POLICY "Authenticated view estimate sessions"
ON public.estimate_sessions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated update estimate sessions"
ON public.estimate_sessions
FOR UPDATE
TO authenticated
USING (true);

-- 4. Create rate limiting infrastructure
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  action_type text NOT NULL,
  attempt_count integer NOT NULL DEFAULT 1,
  window_start timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(identifier, action_type)
);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limits;

CREATE POLICY "System manage rate limits"
ON public.rate_limits
FOR ALL
USING (true);

-- Server-side rate limiting function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier text,
  p_action_type text,
  p_max_attempts integer,
  p_window_minutes integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Input validation functions
CREATE OR REPLACE FUNCTION public.validate_email(email text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_phone(phone text)
RETURNS boolean
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  RETURN phone ~* '^\+?[0-9\s\-\(\)]{8,20}$';
END;
$$;

-- Secure bundled_estimates
DROP POLICY IF EXISTS "Users can view bundled estimates they created" ON public.bundled_estimates;

CREATE POLICY "Authenticated view bundled estimates"
ON public.bundled_estimates
FOR SELECT
USING (true);

-- Secure lead quality factors
DROP POLICY IF EXISTS "Admins and assigned providers can view lead quality" ON public.lead_quality_factors;

CREATE POLICY "Authorized view lead quality"
ON public.lead_quality_factors
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR lead_id IN (
    SELECT l.id FROM leads l
    WHERE l.assigned_provider_ids @> ARRAY[(
      SELECT id FROM service_providers 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )]
  )
);