-- Create neighborhood_profiles table for hyper-local data
CREATE TABLE IF NOT EXISTS public.neighborhood_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_name TEXT NOT NULL,
  postal_code TEXT,
  canton_code TEXT NOT NULL,
  
  -- Lifestyle scores (0-100)
  family_score INTEGER DEFAULT 50,
  expat_score INTEGER DEFAULT 50,
  commuter_score INTEGER DEFAULT 50,
  quiet_score INTEGER DEFAULT 50,
  nightlife_score INTEGER DEFAULT 20,
  nature_score INTEGER DEFAULT 50,
  
  -- Financial data
  tax_rate_single NUMERIC(5,2),
  tax_rate_family NUMERIC(5,2),
  avg_rent_3room INTEGER,
  avg_rent_4room INTEGER,
  property_price_sqm INTEGER,
  
  -- Demographics
  population INTEGER,
  population_growth_percent NUMERIC(4,2),
  foreigner_percent NUMERIC(4,2),
  avg_age NUMERIC(4,1),
  
  -- Infrastructure
  train_station_distance_km NUMERIC(4,2),
  highway_distance_km NUMERIC(4,2),
  zurich_commute_minutes INTEGER,
  
  -- Meta
  description TEXT,
  highlights TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(city_name, canton_code)
);

-- Enable RLS with public read access
ALTER TABLE public.neighborhood_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Neighborhood profiles are publicly readable"
ON public.neighborhood_profiles
FOR SELECT
USING (true);

-- Create indexes
CREATE INDEX idx_neighborhood_profiles_canton ON public.neighborhood_profiles(canton_code);
CREATE INDEX idx_neighborhood_profiles_postal ON public.neighborhood_profiles(postal_code);

-- Create POIs table for local infrastructure
CREATE TABLE IF NOT EXISTS public.pois (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  neighborhood_id UUID REFERENCES public.neighborhood_profiles(id) ON DELETE CASCADE,
  city_name TEXT NOT NULL,
  canton_code TEXT NOT NULL,
  
  poi_type TEXT NOT NULL, -- 'school', 'doctor', 'supermarket', 'train_station', 'restaurant', 'gym', 'park'
  name TEXT NOT NULL,
  address TEXT,
  
  -- Location
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  
  -- Details
  rating NUMERIC(2,1),
  review_count INTEGER DEFAULT 0,
  phone TEXT,
  website TEXT,
  opening_hours JSONB,
  
  -- Meta
  distance_from_center_km NUMERIC(4,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS with public read access
ALTER TABLE public.pois ENABLE ROW LEVEL SECURITY;

CREATE POLICY "POIs are publicly readable"
ON public.pois
FOR SELECT
USING (true);

-- Create indexes
CREATE INDEX idx_pois_neighborhood ON public.pois(neighborhood_id);
CREATE INDEX idx_pois_city ON public.pois(city_name);
CREATE INDEX idx_pois_type ON public.pois(poi_type);
CREATE INDEX idx_pois_canton ON public.pois(canton_code);