-- Add call tracking table
CREATE TABLE IF NOT EXISTS public.call_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  call_duration INTEGER, -- seconds
  was_successful BOOLEAN DEFAULT false,
  caller_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add sponsored plans table
CREATE TABLE IF NOT EXISTS public.sponsored_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  tier INTEGER NOT NULL CHECK (tier BETWEEN 1 AND 4), -- 1 = highest priority
  region TEXT,
  monthly_price_chf NUMERIC NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Extend service_providers with new fields needed for ranking
ALTER TABLE public.service_providers 
ADD COLUMN IF NOT EXISTS phone_tracking_number TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS response_time_minutes INTEGER,
ADD COLUMN IF NOT EXISTS avg_completion_time_hours INTEGER,
ADD COLUMN IF NOT EXISTS success_rate NUMERIC CHECK (success_rate BETWEEN 0 AND 100),
ADD COLUMN IF NOT EXISTS discount_offer TEXT,
ADD COLUMN IF NOT EXISTS profile_gallery TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS cities_served TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS sponsored_tier INTEGER CHECK (sponsored_tier BETWEEN 1 AND 4);

-- Create index on slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_service_providers_slug ON public.service_providers(slug);
CREATE INDEX IF NOT EXISTS idx_sponsored_plans_company ON public.sponsored_plans(company_id);
CREATE INDEX IF NOT EXISTS idx_call_tracking_company ON public.call_tracking(company_id);

-- Enable RLS
ALTER TABLE public.call_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sponsored_plans ENABLE ROW LEVEL SECURITY;

-- RLS policies for call_tracking
CREATE POLICY "Admins can view all call tracking"
ON public.call_tracking FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can view their own call tracking"
ON public.call_tracking FOR SELECT
USING (
  company_id IN (
    SELECT id FROM service_providers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);

CREATE POLICY "Service role can manage call tracking"
ON public.call_tracking FOR ALL
USING (true);

-- RLS policies for sponsored_plans
CREATE POLICY "Admins can manage sponsored plans"
ON public.sponsored_plans FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can view their own sponsored plans"
ON public.sponsored_plans FOR SELECT
USING (
  company_id IN (
    SELECT id FROM service_providers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())::text
  )
);

CREATE POLICY "Service role can manage sponsored plans"
ON public.sponsored_plans FOR ALL
USING (true);