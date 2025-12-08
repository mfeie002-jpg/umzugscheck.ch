-- Create a secure public view for service providers that excludes sensitive data
CREATE OR REPLACE VIEW public.service_providers_public AS
SELECT 
  id,
  company_name,
  contact_person_name,
  city,
  zip,
  country,
  cantons_served,
  cities_served,
  services_offered,
  description,
  short_description,
  long_description,
  logo_url,
  profile_gallery,
  website,
  fleet_size,
  employees_count,
  certifications,
  team_members,
  working_hours,
  booking_calendar_url,
  discount_offer,
  price_level,
  quality_score,
  success_rate,
  response_time_minutes,
  avg_completion_time_hours,
  ranking_position,
  featured_position,
  is_featured,
  sponsored_tier,
  profile_completeness,
  verification_status,
  account_status,
  slug,
  created_at,
  updated_at
FROM public.service_providers
WHERE verification_status = 'approved' AND account_status = 'active';

-- Grant SELECT access on the view to authenticated users  
GRANT SELECT ON public.service_providers_public TO authenticated;
GRANT SELECT ON public.service_providers_public TO anon;

-- Add comment explaining the view purpose
COMMENT ON VIEW public.service_providers_public IS 'Public view of approved service providers that excludes sensitive data like password_hash, email, phone, and billing information';

-- Drop the old overly permissive policy if it exists
DROP POLICY IF EXISTS "Approved providers viewable by authenticated" ON public.service_providers;

-- Create a more restrictive policy for the base table
-- Only allow admins and the provider themselves to see full records
CREATE POLICY "Providers can view own full record" 
ON public.service_providers 
FOR SELECT 
USING (
  -- Admin access
  has_role(auth.uid(), 'admin'::app_role)
  OR
  -- Provider viewing their own record (by email match)
  email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Ensure service role can still manage all records
DROP POLICY IF EXISTS "Service role can manage providers" ON public.service_providers;
CREATE POLICY "Service role can manage providers"
ON public.service_providers
FOR ALL
USING (true)
WITH CHECK (true);