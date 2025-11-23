-- Create update_updated_at_column function first
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT,
  description TEXT,
  services TEXT[],
  price_level TEXT CHECK (price_level IN ('CHF', 'CHF CHF', 'CHF CHF CHF')),
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  service_areas TEXT[],
  phone TEXT,
  email TEXT,
  website TEXT,
  gallery_images TEXT[],
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  move_date DATE,
  from_postal TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_postal TEXT NOT NULL,
  to_city TEXT NOT NULL,
  calculator_type TEXT NOT NULL,
  calculator_input JSONB NOT NULL,
  calculator_output JSONB NOT NULL,
  comments TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'quoted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Companies policies (public read)
CREATE POLICY "Companies are viewable by everyone"
  ON public.companies FOR SELECT
  USING (true);

-- Leads policies (anyone can insert for lead capture)
CREATE POLICY "Anyone can create leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

-- Create updated_at trigger for companies
CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON public.companies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes
CREATE INDEX idx_companies_service_areas ON public.companies USING GIN(service_areas);
CREATE INDEX idx_companies_rating ON public.companies (rating DESC);
CREATE INDEX idx_companies_featured ON public.companies (featured) WHERE featured = true;
CREATE INDEX idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX idx_leads_status ON public.leads (status);

-- Insert sample companies
INSERT INTO public.companies (name, logo, description, services, price_level, rating, review_count, service_areas, phone, email, website, verified, featured) VALUES
('ZüriUmzug AG', '🚛', 'Professionelle Umzüge in der ganzen Schweiz seit 1998. Spezialisiert auf Privat- und Büroumzüge mit Komplettservice.', ARRAY['Privatumzug', 'Büroumzug', 'Reinigung', 'Entsorgung'], 'CHF CHF', 4.9, 245, ARRAY['Zürich', 'Aargau', 'Zug'], '+41 44 123 45 67', 'info@zueri-umzug.ch', 'https://zueri-umzug.ch', true, true),
('Berner Zügelprofi', '📦', 'Ihr Partner für stressfreie Umzüge im Raum Bern. Familienbetrieb mit über 20 Jahren Erfahrung.', ARRAY['Privatumzug', 'Einlagerung', 'Entsorgung', 'Verpackung'], 'CHF CHF CHF', 4.8, 189, ARRAY['Bern', 'Solothurn', 'Freiburg'], '+41 31 234 56 78', 'kontakt@berner-zuegelprofi.ch', 'https://berner-zuegelprofi.ch', true, true),
('Basel Express Move', '🏠', 'Schnell, sicher und zuverlässig – Ihr Umzug in Basel und Umgebung. Faire Preise garantiert.', ARRAY['Privatumzug', 'Verpackung', 'Montage'], 'CHF CHF', 4.7, 156, ARRAY['Basel-Stadt', 'Basel-Landschaft'], '+41 61 345 67 89', 'hello@basel-express.ch', 'https://basel-express.ch', true, false),
('Swiss Move Solutions', '🚚', 'Schweizweite Umzugslösungen mit Premium-Service. International erfahren, lokal verwurzelt.', ARRAY['Privatumzug', 'Büroumzug', 'International', 'Einlagerung'], 'CHF CHF CHF', 4.9, 312, ARRAY['Zürich', 'Bern', 'Basel-Stadt', 'Genève', 'Vaud'], '+41 800 123 456', 'info@swissmove.ch', 'https://swissmove.ch', true, true),
('Luzerner Transportteam', '📍', 'Spezialisiert auf anspruchsvolle Umzüge mit Klavieren, Kunstwerken und Antiquitäten.', ARRAY['Privatumzug', 'Klaviertransport', 'Reinigung', 'Montage'], 'CHF CHF', 4.8, 178, ARRAY['Luzern', 'Zug', 'Schwyz'], '+41 41 456 78 90', 'team@luzerner-transport.ch', 'https://luzerner-transport.ch', true, false),
('Genève Déménagement', '🎯', 'Service de déménagement professionnel à Genève. Expérience internationale et service personnalisé.', ARRAY['Privatumzug', 'Büroumzug', 'Einlagerung', 'International'], 'CHF CHF CHF', 4.7, 203, ARRAY['Genève', 'Vaud'], '+41 22 567 89 01', 'info@geneve-demenagement.ch', 'https://geneve-demenagement.ch', true, false);