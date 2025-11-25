-- Fix price_alerts RLS policies to remove OR true condition
DROP POLICY IF EXISTS "Users can view their own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can update their own alerts" ON public.price_alerts;
DROP POLICY IF EXISTS "Users can delete their own alerts" ON public.price_alerts;

CREATE POLICY "Users can view their own alerts"
ON public.price_alerts
FOR SELECT
TO authenticated
USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can update their own alerts"
ON public.price_alerts
FOR UPDATE
TO authenticated
USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Users can delete their own alerts"
ON public.price_alerts
FOR DELETE
TO authenticated
USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Fix System policies to restrict to service_role only
DROP POLICY IF EXISTS "System can manage lead quality factors" ON public.lead_quality_factors;
DROP POLICY IF EXISTS "System can manage performance metrics" ON public.provider_performance_metrics;
DROP POLICY IF EXISTS "System can manage platform analytics" ON public.platform_analytics;
DROP POLICY IF EXISTS "System can manage review requests" ON public.review_requests;
DROP POLICY IF EXISTS "System manage rate limits" ON public.rate_limits;
DROP POLICY IF EXISTS "System can manage billing" ON public.billing_records;
DROP POLICY IF EXISTS "System can manage click events" ON public.provider_click_events;

CREATE POLICY "Service role can manage lead quality factors"
ON public.lead_quality_factors
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can manage performance metrics"
ON public.provider_performance_metrics
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can manage platform analytics"
ON public.platform_analytics
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can manage review requests"
ON public.review_requests
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role manage rate limits"
ON public.rate_limits
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can manage billing"
ON public.billing_records
FOR ALL
TO service_role
USING (true);

CREATE POLICY "Service role can manage click events"
ON public.provider_click_events
FOR ALL
TO service_role
USING (true);