
-- Add slug and additional fields to companies table for full company profiles
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS long_description TEXT,
ADD COLUMN IF NOT EXISTS certifications TEXT[],
ADD COLUMN IF NOT EXISTS cities_served TEXT[],
ADD COLUMN IF NOT EXISTS response_time_hours INTEGER,
ADD COLUMN IF NOT EXISTS success_rate NUMERIC;

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);

-- Update existing companies with slugs
UPDATE public.companies SET slug = LOWER(REPLACE(REPLACE(REPLACE(name, ' ', '-'), 'ü', 'ue'), 'ä', 'ae')) WHERE slug IS NULL;
