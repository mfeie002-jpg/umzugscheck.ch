-- Fix remaining overly permissive RLS policies (batch 6 - final)

-- 1. rate_limits: Service role ALL with true
DROP POLICY IF EXISTS "Service role manage rate limits" ON public.rate_limits;
CREATE POLICY "Admins can manage rate limits" 
ON public.rate_limits 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. realtime_ranking_metrics: System INSERT with true
DROP POLICY IF EXISTS "System can insert realtime metrics" ON public.realtime_ranking_metrics;
CREATE POLICY "Admins can manage realtime metrics" 
ON public.realtime_ranking_metrics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. regional_rankings: System INSERT with true
DROP POLICY IF EXISTS "System can insert regional rankings" ON public.regional_rankings;
-- Admin policy already exists

-- 4. review_requests: Service role ALL with true
DROP POLICY IF EXISTS "Service role can manage review requests" ON public.review_requests;
CREATE POLICY "Admins can manage review requests" 
ON public.review_requests 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. scheduled_rankings: System ALL with true
DROP POLICY IF EXISTS "System can manage scheduled rankings" ON public.scheduled_rankings;
-- Admin policy already exists

-- 6. screenshot_alert_settings: ALL with true
DROP POLICY IF EXISTS "Allow all operations on screenshot_alert_settings" ON public.screenshot_alert_settings;
CREATE POLICY "Admins can manage screenshot alert settings" 
ON public.screenshot_alert_settings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 7. screenshot_history: ALL with true
DROP POLICY IF EXISTS "Allow all operations on screenshot_history" ON public.screenshot_history;
CREATE POLICY "Admins can manage screenshot history" 
ON public.screenshot_history 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 8. screenshot_regression_results: ALL with true
DROP POLICY IF EXISTS "Allow all operations on screenshot_regression_results" ON public.screenshot_regression_results;
CREATE POLICY "Admins can manage screenshot regression results" 
ON public.screenshot_regression_results 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));