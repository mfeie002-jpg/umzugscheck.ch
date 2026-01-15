-- Fix remaining overly permissive RLS policies (batch 4)

-- 1. landing_page_comparisons: ALL with true
DROP POLICY IF EXISTS "Allow all operations on landing_page_comparisons" ON public.landing_page_comparisons;
CREATE POLICY "Admins can manage landing page comparisons" 
ON public.landing_page_comparisons 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 2. landing_page_versions: ALL with true
DROP POLICY IF EXISTS "Allow all operations on landing_page_versions" ON public.landing_page_versions;
CREATE POLICY "Admins can manage landing page versions" 
ON public.landing_page_versions 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 3. landing_pages: ALL with true
DROP POLICY IF EXISTS "Allow all operations on landing_pages" ON public.landing_pages;
CREATE POLICY "Admins can manage landing pages" 
ON public.landing_pages 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
-- Add public read access
CREATE POLICY "Anyone can view landing pages" 
ON public.landing_pages 
FOR SELECT 
USING (true);

-- 4. lead_quality_factors: Service role ALL with true
DROP POLICY IF EXISTS "Service role can manage lead quality factors" ON public.lead_quality_factors;
CREATE POLICY "Admins can manage lead quality factors" 
ON public.lead_quality_factors 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 5. leads: Anyone INSERT with true - add validation
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anon can create leads" 
ON public.leads 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL AND
  name IS NOT NULL AND
  from_city IS NOT NULL AND
  to_city IS NOT NULL
);

-- 6. listing_bids: Providers INSERT/UPDATE with true - restrict properly
DROP POLICY IF EXISTS "Providers can create bids" ON public.listing_bids;
DROP POLICY IF EXISTS "Providers can update their own bids" ON public.listing_bids;
DROP POLICY IF EXISTS "Providers can view their own bids" ON public.listing_bids;
CREATE POLICY "Providers can create bids authenticated" 
ON public.listing_bids 
FOR INSERT 
TO authenticated
WITH CHECK (
  provider_id IN (
    SELECT sp.id FROM service_providers sp 
    WHERE sp.email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);
CREATE POLICY "Providers can update their own bids authenticated" 
ON public.listing_bids 
FOR UPDATE 
TO authenticated
USING (
  provider_id IN (
    SELECT sp.id FROM service_providers sp 
    WHERE sp.email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);
CREATE POLICY "Providers can view bids authenticated" 
ON public.listing_bids 
FOR SELECT 
TO authenticated
USING (
  provider_id IN (
    SELECT sp.id FROM service_providers sp 
    WHERE sp.email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  ) OR 
  has_role(auth.uid(), 'admin'::app_role)
);

-- 7. ml_ranking_models: System ALL with true
DROP POLICY IF EXISTS "System can manage ML models" ON public.ml_ranking_models;
CREATE POLICY "Admins can manage ML models" 
ON public.ml_ranking_models 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- 8. newsletter_subscribers: Anyone INSERT with true - add email validation
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Anon can subscribe to newsletter" 
ON public.newsletter_subscribers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL AND
  email LIKE '%@%.%'
);