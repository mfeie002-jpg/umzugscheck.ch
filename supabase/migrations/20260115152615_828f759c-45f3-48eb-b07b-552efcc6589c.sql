-- Fix remaining overly permissive RLS policies (batch 5)

-- 1. platform_analytics: Service role ALL with true
DROP POLICY IF EXISTS "Service role can manage platform analytics" ON public.platform_analytics;
CREATE POLICY "Admins can manage platform analytics" 
ON public.platform_analytics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. price_alerts: Anyone INSERT with true - add validation
DROP POLICY IF EXISTS "Anyone can create price alerts" ON public.price_alerts;
CREATE POLICY "Anon can create price alerts" 
ON public.price_alerts 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  user_email IS NOT NULL AND
  user_email LIKE '%@%.%' AND
  canton_code IS NOT NULL AND
  max_price > 0
);

-- 3. provider_click_events: Service role ALL with true
DROP POLICY IF EXISTS "Service role can manage click events" ON public.provider_click_events;
CREATE POLICY "Admins can manage click events" 
ON public.provider_click_events 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- Allow anon/auth to insert (for tracking)
CREATE POLICY "Anon can insert click events" 
ON public.provider_click_events 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  provider_id IS NOT NULL AND
  event_type IS NOT NULL
);

-- 4. provider_performance_metrics: Service role ALL with true
DROP POLICY IF EXISTS "Service role can manage performance metrics" ON public.provider_performance_metrics;
CREATE POLICY "Admins can manage performance metrics" 
ON public.provider_performance_metrics 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. public_move_listings: Lead owners ALL with true
DROP POLICY IF EXISTS "Lead owners can manage their listings" ON public.public_move_listings;
CREATE POLICY "Admins can manage move listings" 
ON public.public_move_listings 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- Allow anon to create listings
CREATE POLICY "Anon can create move listings" 
ON public.public_move_listings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  from_city IS NOT NULL AND
  to_city IS NOT NULL AND
  move_date IS NOT NULL
);