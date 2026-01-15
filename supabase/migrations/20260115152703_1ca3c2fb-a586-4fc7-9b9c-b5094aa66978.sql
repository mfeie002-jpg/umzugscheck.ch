-- Fix final remaining overly permissive RLS policies (batch 7)

-- 1. service_providers: INSERT with true - add validation, remove Service role ALL
DROP POLICY IF EXISTS "Anyone can create service provider account" ON public.service_providers;
CREATE POLICY "Anon can create service provider account" 
ON public.service_providers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL AND
  company_name IS NOT NULL AND
  contact_person_name IS NOT NULL
);

DROP POLICY IF EXISTS "Service role can manage providers" ON public.service_providers;
-- Admins can already manage via "Admins can update all service providers"

-- 2. sponsored_plans: Service role ALL with true
DROP POLICY IF EXISTS "Service role can manage sponsored plans" ON public.sponsored_plans;
-- Admin policy already exists