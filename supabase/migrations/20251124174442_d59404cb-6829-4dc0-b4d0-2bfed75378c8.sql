-- Fix security warnings: Set search_path for all functions

-- Update get_canton_from_postal function
CREATE OR REPLACE FUNCTION public.get_canton_from_postal(postal_code text)
RETURNS text
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  canton_code text;
BEGIN
  -- Swiss postal code to canton mapping (simplified)
  -- First digit indicates general region
  CASE 
    WHEN postal_code LIKE '1%' THEN
      CASE
        WHEN postal_code BETWEEN '1000' AND '1299' THEN canton_code := 'VD';
        WHEN postal_code BETWEEN '1300' AND '1499' THEN canton_code := 'VD';
        WHEN postal_code BETWEEN '1500' AND '1699' THEN canton_code := 'FR';
        WHEN postal_code BETWEEN '1700' AND '1799' THEN canton_code := 'FR';
        ELSE canton_code := 'VD';
      END CASE;
    WHEN postal_code LIKE '2%' THEN
      CASE
        WHEN postal_code BETWEEN '2000' AND '2099' THEN canton_code := 'NE';
        WHEN postal_code BETWEEN '2300' AND '2799' THEN canton_code := 'JU';
        WHEN postal_code BETWEEN '2800' AND '2899' THEN canton_code := 'JU';
        ELSE canton_code := 'NE';
      END CASE;
    WHEN postal_code LIKE '3%' THEN canton_code := 'BE';
    WHEN postal_code LIKE '4%' THEN
      CASE
        WHEN postal_code BETWEEN '4000' AND '4999' THEN canton_code := 'BS';
        ELSE canton_code := 'BL';
      END CASE;
    WHEN postal_code LIKE '5%' THEN canton_code := 'AG';
    WHEN postal_code LIKE '6%' THEN
      CASE
        WHEN postal_code BETWEEN '6000' AND '6499' THEN canton_code := 'LU';
        WHEN postal_code BETWEEN '6500' AND '6999' THEN canton_code := 'TI';
        ELSE canton_code := 'LU';
      END CASE;
    WHEN postal_code LIKE '7%' THEN canton_code := 'GR';
    WHEN postal_code LIKE '8%' THEN canton_code := 'ZH';
    WHEN postal_code LIKE '9%' THEN
      CASE
        WHEN postal_code BETWEEN '9000' AND '9499' THEN canton_code := 'SG';
        WHEN postal_code BETWEEN '9500' AND '9699' THEN canton_code := 'AR';
        ELSE canton_code := 'SG';
      END CASE;
    ELSE canton_code := NULL;
  END CASE;
  
  RETURN canton_code;
END;
$$;

-- Update count_provider_leads_this_month function
CREATE OR REPLACE FUNCTION public.count_provider_leads_this_month(provider_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM public.leads
  WHERE provider_id = ANY(assigned_provider_ids)
    AND created_at >= date_trunc('month', CURRENT_DATE)
    AND created_at < date_trunc('month', CURRENT_DATE) + interval '1 month';
$$;

-- Update find_matching_providers function
CREATE OR REPLACE FUNCTION public.find_matching_providers(
  lead_from_postal text,
  lead_to_postal text,
  estimated_value numeric DEFAULT NULL
)
RETURNS uuid[]
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  from_canton text;
  to_canton text;
  matching_provider_ids uuid[];
BEGIN
  -- Get cantons from postal codes
  from_canton := public.get_canton_from_postal(lead_from_postal);
  to_canton := public.get_canton_from_postal(lead_to_postal);
  
  -- Find providers that match the criteria
  SELECT ARRAY_AGG(sp.id)
  INTO matching_provider_ids
  FROM public.service_providers sp
  WHERE 
    -- Must be approved and active
    sp.verification_status = 'approved'
    AND sp.account_status = 'active'
    
    -- Must serve at least one of the relevant cantons
    AND (
      from_canton = ANY(sp.cantons_served) 
      OR to_canton = ANY(sp.cantons_served)
    )
    
    -- Check max leads per month limit
    AND (
      sp.max_leads_per_month IS NULL
      OR public.count_provider_leads_this_month(sp.id) < sp.max_leads_per_month
    )
    
    -- Check minimum job value
    AND (
      sp.min_job_value IS NULL
      OR estimated_value IS NULL
      OR estimated_value >= sp.min_job_value
    )
    
    -- Check preferred regions (if set, must match)
    AND (
      sp.preferred_regions IS NULL
      OR array_length(sp.preferred_regions, 1) IS NULL
      OR from_canton = ANY(sp.preferred_regions)
      OR to_canton = ANY(sp.preferred_regions)
    );
  
  RETURN COALESCE(matching_provider_ids, ARRAY[]::uuid[]);
END;
$$;
