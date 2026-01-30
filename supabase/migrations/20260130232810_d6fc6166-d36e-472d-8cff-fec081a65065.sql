-- Post-Move Surveys Table
CREATE TABLE public.post_move_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  
  -- Location Data (anonymized for privacy)
  from_canton TEXT NOT NULL,
  to_canton TEXT NOT NULL,
  
  -- Stress & Satisfaction (1-5 scale)
  overall_satisfaction INTEGER NOT NULL CHECK (overall_satisfaction BETWEEN 1 AND 5),
  stress_level INTEGER NOT NULL CHECK (stress_level BETWEEN 1 AND 5),
  
  -- Category Ratings (1-5 scale)
  planning_ease INTEGER CHECK (planning_ease BETWEEN 1 AND 5),
  moving_company_satisfaction INTEGER CHECK (moving_company_satisfaction BETWEEN 1 AND 5),
  admin_ease INTEGER CHECK (admin_ease BETWEEN 1 AND 5),
  neighbors_welcome INTEGER CHECK (neighbors_welcome BETWEEN 1 AND 5),
  
  -- Context
  had_damage BOOLEAN DEFAULT false,
  move_type TEXT CHECK (move_type IN ('professional', 'self', 'mixed')),
  household_type TEXT CHECK (household_type IN ('single', 'couple', 'family', 'shared')),
  
  -- Open Feedback
  what_went_well TEXT,
  what_could_improve TEXT,
  
  -- Meta
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Move Health Index (Aggregated Regional Scores)
CREATE TABLE public.move_health_index (
  canton_code TEXT PRIMARY KEY,
  canton_name TEXT NOT NULL,
  
  -- Scores (0-100 scale)
  overall_health_score NUMERIC DEFAULT 0,
  satisfaction_index NUMERIC DEFAULT 0,
  stress_index NUMERIC DEFAULT 0,
  
  -- Category Breakdown (0-100)
  planning_score NUMERIC DEFAULT 0,
  company_score NUMERIC DEFAULT 0,
  admin_score NUMERIC DEFAULT 0,
  welcome_score NUMERIC DEFAULT 0,
  
  -- Statistics
  total_responses INTEGER DEFAULT 0,
  damage_rate_percent NUMERIC DEFAULT 0,
  
  -- Trend
  trend_vs_last_quarter TEXT CHECK (trend_vs_last_quarter IN ('improving', 'stable', 'declining')),
  
  last_calculated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.post_move_surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.move_health_index ENABLE ROW LEVEL SECURITY;

-- Post-Move Surveys: Anyone can insert (anonymous submissions)
CREATE POLICY "Anyone can submit post-move surveys"
ON public.post_move_surveys
FOR INSERT
WITH CHECK (true);

-- Post-Move Surveys: Only service role can select (for aggregation)
CREATE POLICY "Service role can read all surveys"
ON public.post_move_surveys
FOR SELECT
USING (auth.role() = 'service_role');

-- Move Health Index: Public read access (this is public data)
CREATE POLICY "Anyone can view move health index"
ON public.move_health_index
FOR SELECT
USING (true);

-- Move Health Index: Only service role can modify
CREATE POLICY "Service role can manage move health index"
ON public.move_health_index
FOR ALL
USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX idx_post_move_surveys_from_canton ON public.post_move_surveys(from_canton);
CREATE INDEX idx_post_move_surveys_to_canton ON public.post_move_surveys(to_canton);
CREATE INDEX idx_post_move_surveys_submitted_at ON public.post_move_surveys(submitted_at);

-- Seed initial canton data for move_health_index
INSERT INTO public.move_health_index (canton_code, canton_name) VALUES
  ('ZH', 'Zürich'),
  ('BE', 'Bern'),
  ('LU', 'Luzern'),
  ('UR', 'Uri'),
  ('SZ', 'Schwyz'),
  ('OW', 'Obwalden'),
  ('NW', 'Nidwalden'),
  ('GL', 'Glarus'),
  ('ZG', 'Zug'),
  ('FR', 'Fribourg'),
  ('SO', 'Solothurn'),
  ('BS', 'Basel-Stadt'),
  ('BL', 'Basel-Landschaft'),
  ('SH', 'Schaffhausen'),
  ('AR', 'Appenzell Ausserrhoden'),
  ('AI', 'Appenzell Innerrhoden'),
  ('SG', 'St. Gallen'),
  ('GR', 'Graubünden'),
  ('AG', 'Aargau'),
  ('TG', 'Thurgau'),
  ('TI', 'Ticino'),
  ('VD', 'Vaud'),
  ('VS', 'Valais'),
  ('NE', 'Neuchâtel'),
  ('GE', 'Genève'),
  ('JU', 'Jura')
ON CONFLICT (canton_code) DO NOTHING;