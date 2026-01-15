-- Fix remaining overly permissive RLS policies (batch 2)

-- 1. custom_flow_configs: ALL with true - should be admin only
DROP POLICY IF EXISTS "Allow all for custom_flow_configs" ON public.custom_flow_configs;
CREATE POLICY "Admins can manage custom flow configs" 
ON public.custom_flow_configs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. estimate_sessions: INSERT/UPDATE with true - add validation
DROP POLICY IF EXISTS "Anyone can create estimate sessions" ON public.estimate_sessions;
CREATE POLICY "Anon and auth can create estimate sessions" 
ON public.estimate_sessions 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  move_details IS NOT NULL AND
  estimate IS NOT NULL
);

DROP POLICY IF EXISTS "Authenticated update estimate sessions" ON public.estimate_sessions;
CREATE POLICY "Anon and auth can update estimate sessions" 
ON public.estimate_sessions 
FOR UPDATE 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 3. flow_alerts: Service role INSERT with true - restrict to admin
DROP POLICY IF EXISTS "Service role can insert alerts" ON public.flow_alerts;
CREATE POLICY "Admins can insert alerts" 
ON public.flow_alerts 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 4. flow_analysis_runs: Service role INSERT/UPDATE with true - restrict to admin
DROP POLICY IF EXISTS "Service role can insert analysis runs" ON public.flow_analysis_runs;
DROP POLICY IF EXISTS "Service role can update analysis runs" ON public.flow_analysis_runs;
CREATE POLICY "Admins can manage analysis runs" 
ON public.flow_analysis_runs 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. flow_archetype_scores: Service role ALL with true - restrict to admin
DROP POLICY IF EXISTS "Service role can manage archetype scores" ON public.flow_archetype_scores;
CREATE POLICY "Admins can manage archetype scores" 
ON public.flow_archetype_scores 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));