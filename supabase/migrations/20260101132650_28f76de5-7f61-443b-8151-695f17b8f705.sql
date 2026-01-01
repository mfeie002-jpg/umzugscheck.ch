-- Fix PUBLIC_DATA_EXPOSURE: Restrict internal system tables to admin-only access

-- 1. Fix export_jobs table - remove overly permissive policies
DROP POLICY IF EXISTS "Anyone can view export jobs" ON export_jobs;
DROP POLICY IF EXISTS "Anyone can create export jobs" ON export_jobs;
DROP POLICY IF EXISTS "Anyone can update export jobs" ON export_jobs;

CREATE POLICY "Admins can manage export jobs" ON export_jobs
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Fix flow_versions table - restrict to admin for sensitive data
DROP POLICY IF EXISTS "Flow versions are viewable by everyone" ON flow_versions;
DROP POLICY IF EXISTS "Authenticated users can create flow versions" ON flow_versions;
DROP POLICY IF EXISTS "Authenticated users can update flow versions" ON flow_versions;
DROP POLICY IF EXISTS "Authenticated users can delete flow versions" ON flow_versions;

CREATE POLICY "Admins can manage flow versions" ON flow_versions
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix flow_analysis_queue table
DROP POLICY IF EXISTS "Authenticated users can view queue" ON flow_analysis_queue;
DROP POLICY IF EXISTS "Authenticated users can manage queue" ON flow_analysis_queue;
DROP POLICY IF EXISTS "Service role can manage queue" ON flow_analysis_queue;

CREATE POLICY "Admins can manage flow analysis queue" ON flow_analysis_queue
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Fix flow_feedback_variants table
DROP POLICY IF EXISTS "Allow all for authenticated users" ON flow_feedback_variants;

CREATE POLICY "Admins can manage flow feedback variants" ON flow_feedback_variants
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 5. Fix screenshot_baselines table
DROP POLICY IF EXISTS "Allow all operations on screenshot_baselines" ON screenshot_baselines;

CREATE POLICY "Admins can manage screenshot baselines" ON screenshot_baselines
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));

-- 6. Fix homepage_ab_config table - keep read for system but restrict management
DROP POLICY IF EXISTS "Anyone can read AB config" ON homepage_ab_config;
DROP POLICY IF EXISTS "Admins can update AB config" ON homepage_ab_config;

CREATE POLICY "Admins can manage AB config" ON homepage_ab_config
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role));