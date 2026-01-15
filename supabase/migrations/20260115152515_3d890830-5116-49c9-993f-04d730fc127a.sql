-- Fix remaining overly permissive RLS policies (batch 3)

-- 1. flow_step_metrics: Service role INSERT with true
DROP POLICY IF EXISTS "Service role can insert step metrics" ON public.flow_step_metrics;
CREATE POLICY "Admins can insert step metrics" 
ON public.flow_step_metrics 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. flow_ux_issues: Service role INSERT with true
DROP POLICY IF EXISTS "Service role can insert ux issues" ON public.flow_ux_issues;
CREATE POLICY "Admins can insert ux issues" 
ON public.flow_ux_issues 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. homepage_ab_events: Anyone INSERT with true - add basic validation
DROP POLICY IF EXISTS "Anyone can insert AB events" ON public.homepage_ab_events;
CREATE POLICY "Anon can insert AB events" 
ON public.homepage_ab_events 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  session_id IS NOT NULL AND
  flow_variant IS NOT NULL AND
  event_type IS NOT NULL
);

-- 4. landing_page_analyses: ALL with true - restrict to admin
DROP POLICY IF EXISTS "Allow all operations on landing_page_analyses" ON public.landing_page_analyses;
CREATE POLICY "Admins can manage landing page analyses" 
ON public.landing_page_analyses 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add SELECT for public viewing
CREATE POLICY "Anyone can view landing page analyses" 
ON public.landing_page_analyses 
FOR SELECT 
USING (true);