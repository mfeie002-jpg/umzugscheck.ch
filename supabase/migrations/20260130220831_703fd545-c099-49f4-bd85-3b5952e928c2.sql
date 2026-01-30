-- Parking Permit Rules for Swiss Cities (MVP: 8 major cities)
CREATE TABLE public.parking_permit_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  city_slug TEXT NOT NULL UNIQUE,
  city_name TEXT NOT NULL,
  canton_code TEXT NOT NULL,
  requires_permit BOOLEAN NOT NULL DEFAULT true,
  lead_time_days INTEGER NOT NULL DEFAULT 7,
  cost_chf NUMERIC(10,2),
  max_duration_hours INTEGER DEFAULT 8,
  contact_url TEXT,
  application_url TEXT,
  phone TEXT,
  email TEXT,
  instructions JSONB DEFAULT '{}',
  requirements JSONB DEFAULT '[]',
  tips TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Canton Regulations for eUmzug and Administrative Rules
CREATE TABLE public.canton_regulations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  canton_code TEXT NOT NULL UNIQUE,
  canton_name TEXT NOT NULL,
  eumzug_supported BOOLEAN NOT NULL DEFAULT false,
  eumzug_url TEXT,
  registration_deadline_days INTEGER NOT NULL DEFAULT 14,
  deregistration_required BOOLEAN NOT NULL DEFAULT true,
  special_rules JSONB DEFAULT '{}',
  utility_providers JSONB DEFAULT '{}',
  local_holidays TEXT[],
  language TEXT NOT NULL DEFAULT 'de',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.parking_permit_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.canton_regulations ENABLE ROW LEVEL SECURITY;

-- Public read access (these are reference data)
CREATE POLICY "Parking rules are publicly readable" 
ON public.parking_permit_rules 
FOR SELECT 
USING (true);

CREATE POLICY "Canton regulations are publicly readable" 
ON public.canton_regulations 
FOR SELECT 
USING (true);

-- Admin write access
CREATE POLICY "Admins can manage parking rules" 
ON public.parking_permit_rules 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage canton regulations" 
ON public.canton_regulations 
FOR ALL 
USING (public.has_role(auth.uid(), 'admin'));

-- Indexes for performance
CREATE INDEX idx_parking_rules_canton ON public.parking_permit_rules(canton_code);
CREATE INDEX idx_canton_regulations_eumzug ON public.canton_regulations(eumzug_supported);

-- Trigger for updated_at
CREATE TRIGGER update_parking_permit_rules_updated_at
BEFORE UPDATE ON public.parking_permit_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_canton_regulations_updated_at
BEFORE UPDATE ON public.canton_regulations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();