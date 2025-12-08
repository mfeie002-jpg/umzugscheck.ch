-- Fix the security definer view by recreating it with SECURITY INVOKER
DROP VIEW IF EXISTS public.service_providers_public;

CREATE VIEW public.service_providers_public 
WITH (security_invoker = true)
AS
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

-- Grant SELECT access on the view  
GRANT SELECT ON public.service_providers_public TO authenticated;
GRANT SELECT ON public.service_providers_public TO anon;

COMMENT ON VIEW public.service_providers_public IS 'Public view of approved service providers that excludes sensitive data like password_hash, email, phone, and billing information. Uses SECURITY INVOKER for proper RLS enforcement.';