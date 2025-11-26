-- Fix overly permissive RLS policies

-- Drop and recreate provider_performance_metrics policies
DROP POLICY IF EXISTS "Providers can view own performance metrics" ON provider_performance_metrics;
CREATE POLICY "Providers can view own performance metrics"
  ON provider_performance_metrics
  FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM service_providers 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Drop and recreate platform_analytics policies
DROP POLICY IF EXISTS "Admins can view platform analytics" ON platform_analytics;
CREATE POLICY "Admins can view platform analytics"
  ON platform_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role = 'admin'
    )
  );

-- Drop and recreate review_requests policies
DROP POLICY IF EXISTS "Providers can view own review requests" ON review_requests;
CREATE POLICY "Providers can view own review requests"
  ON review_requests
  FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM service_providers 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );