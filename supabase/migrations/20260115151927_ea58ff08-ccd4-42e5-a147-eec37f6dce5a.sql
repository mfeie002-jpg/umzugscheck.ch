-- Fix overly permissive RLS policies
-- These policies have USING(true) or WITH CHECK(true) which is too permissive

-- 1. Fix bundled_estimates: INSERT should require valid session data
DROP POLICY IF EXISTS "Anyone can create bundled estimates" ON public.bundled_estimates;
CREATE POLICY "Anon and auth can create bundled estimates" 
ON public.bundled_estimates 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  array_length(estimate_session_ids, 1) > 0 AND
  total_price_min >= 0 AND
  total_price_max >= total_price_min
);

-- 2. Fix conversion_analytics: INSERT should validate required fields
DROP POLICY IF EXISTS "Only admins can insert analytics" ON public.conversion_analytics;
CREATE POLICY "System can insert analytics" 
ON public.conversion_analytics 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  conversion_type IS NOT NULL AND
  service IS NOT NULL AND
  city IS NOT NULL
);

-- 3. Fix ab_tests: UPDATE should only be for admins, remove "true" policy
DROP POLICY IF EXISTS "System can update AB test metrics" ON public.ab_tests;
CREATE POLICY "Admins can update AB test metrics" 
ON public.ab_tests 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix analysis_reports: Remove duplicate "true" policies
DROP POLICY IF EXISTS "Service role can manage reports" ON public.analysis_reports;
-- Keep "Anyone can view reports by token" for SELECT (public reports)
-- Keep "Admins can manage reports" for ALL

-- 5. Fix billing_records: Remove duplicate "true" policies
DROP POLICY IF EXISTS "System can manage billing records" ON public.billing_records;
DROP POLICY IF EXISTS "Service role can manage billing" ON public.billing_records;
-- Add proper admin-only management policy
CREATE POLICY "Admins can manage billing records" 
ON public.billing_records 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 6. Fix call_tracking: Remove "true" policy
DROP POLICY IF EXISTS "Service role can manage call tracking" ON public.call_tracking;
CREATE POLICY "Admins can manage call tracking" 
ON public.call_tracking 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));