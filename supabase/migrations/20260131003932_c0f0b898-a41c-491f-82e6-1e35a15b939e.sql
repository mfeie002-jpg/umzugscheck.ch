-- Move Health Index: Survey responses and canton scores

-- Survey responses table
CREATE TABLE public.move_health_survey_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Move context
  from_canton TEXT NOT NULL,
  to_canton TEXT NOT NULL,
  move_date DATE NOT NULL,
  move_type TEXT DEFAULT 'private', -- private, company
  
  -- Step 1: Planning ease (1-5 scale)
  planning_ease_score INTEGER CHECK (planning_ease_score BETWEEN 1 AND 5),
  finding_company_ease INTEGER CHECK (finding_company_ease BETWEEN 1 AND 5),
  quote_comparison_ease INTEGER CHECK (quote_comparison_ease BETWEEN 1 AND 5),
  
  -- Step 2: Moving day experience (1-5 scale)
  moving_day_score INTEGER CHECK (moving_day_score BETWEEN 1 AND 5),
  punctuality_score INTEGER CHECK (punctuality_score BETWEEN 1 AND 5),
  care_with_items_score INTEGER CHECK (care_with_items_score BETWEEN 1 AND 5),
  professionalism_score INTEGER CHECK (professionalism_score BETWEEN 1 AND 5),
  
  -- Step 3: Admin hurdles (1-5 scale, 5 = easy)
  admin_hurdles_score INTEGER CHECK (admin_hurdles_score BETWEEN 1 AND 5),
  registration_ease INTEGER CHECK (registration_ease BETWEEN 1 AND 5),
  utility_transfer_ease INTEGER CHECK (utility_transfer_ease BETWEEN 1 AND 5),
  address_change_ease INTEGER CHECK (address_change_ease BETWEEN 1 AND 5),
  
  -- Step 4: Overall satisfaction
  overall_score INTEGER CHECK (overall_score BETWEEN 1 AND 5),
  would_recommend BOOLEAN DEFAULT true,
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 5), -- 1=very stressful, 5=relaxed
  
  -- Step 5: Open feedback
  positive_feedback TEXT,
  improvement_suggestions TEXT,
  
  -- Computed overall health score (0-100)
  health_score INTEGER GENERATED ALWAYS AS (
    ROUND(
      (COALESCE(planning_ease_score, 3) + 
       COALESCE(finding_company_ease, 3) + 
       COALESCE(quote_comparison_ease, 3) +
       COALESCE(moving_day_score, 3) + 
       COALESCE(punctuality_score, 3) + 
       COALESCE(care_with_items_score, 3) +
       COALESCE(professionalism_score, 3) +
       COALESCE(admin_hurdles_score, 3) + 
       COALESCE(registration_ease, 3) + 
       COALESCE(utility_transfer_ease, 3) +
       COALESCE(address_change_ease, 3) +
       COALESCE(overall_score, 3) +
       COALESCE(stress_level, 3)
      ) / 13.0 * 20
    )
  ) STORED,
  
  -- Metadata
  lead_id UUID REFERENCES public.leads(id),
  ip_hash TEXT, -- For rate limiting
  verified BOOLEAN DEFAULT false
);

-- Canton aggregated scores (updated by trigger)
CREATE TABLE public.move_health_canton_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  canton_code TEXT NOT NULL UNIQUE,
  canton_name TEXT NOT NULL,
  
  -- Aggregated scores (0-100)
  overall_health_score NUMERIC(5,2) DEFAULT 0,
  planning_score NUMERIC(5,2) DEFAULT 0,
  moving_day_score NUMERIC(5,2) DEFAULT 0,
  admin_score NUMERIC(5,2) DEFAULT 0,
  
  -- Stats
  total_responses INTEGER DEFAULT 0,
  recommend_rate NUMERIC(5,2) DEFAULT 0,
  avg_stress_level NUMERIC(3,2) DEFAULT 3,
  
  -- Grade (A-F based on score)
  grade TEXT GENERATED ALWAYS AS (
    CASE 
      WHEN overall_health_score >= 85 THEN 'A'
      WHEN overall_health_score >= 70 THEN 'B'
      WHEN overall_health_score >= 55 THEN 'C'
      WHEN overall_health_score >= 40 THEN 'D'
      ELSE 'F'
    END
  ) STORED,
  
  -- Trend
  score_trend NUMERIC(5,2) DEFAULT 0, -- positive = improving
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.move_health_survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.move_health_canton_scores ENABLE ROW LEVEL SECURITY;

-- Public can insert surveys (anonymous)
CREATE POLICY "Anyone can submit surveys" 
ON public.move_health_survey_responses 
FOR INSERT 
WITH CHECK (true);

-- Public can view canton scores
CREATE POLICY "Anyone can view canton scores" 
ON public.move_health_canton_scores 
FOR SELECT 
USING (true);

-- Admins can view all survey responses
CREATE POLICY "Admins can view surveys" 
ON public.move_health_survey_responses 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

-- Function to update canton scores after survey submission
CREATE OR REPLACE FUNCTION public.update_canton_health_scores()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_canton TEXT;
BEGIN
  -- Update both from and to cantons
  FOR v_canton IN SELECT UNNEST(ARRAY[NEW.from_canton, NEW.to_canton])
  LOOP
    INSERT INTO move_health_canton_scores (canton_code, canton_name)
    VALUES (v_canton, v_canton)
    ON CONFLICT (canton_code) DO NOTHING;
    
    UPDATE move_health_canton_scores
    SET 
      total_responses = (
        SELECT COUNT(*) FROM move_health_survey_responses 
        WHERE from_canton = v_canton OR to_canton = v_canton
      ),
      overall_health_score = (
        SELECT COALESCE(AVG(health_score), 0) 
        FROM move_health_survey_responses 
        WHERE from_canton = v_canton OR to_canton = v_canton
      ),
      planning_score = (
        SELECT COALESCE(AVG((planning_ease_score + finding_company_ease + quote_comparison_ease) / 3.0 * 20), 0)
        FROM move_health_survey_responses 
        WHERE from_canton = v_canton OR to_canton = v_canton
      ),
      moving_day_score = (
        SELECT COALESCE(AVG((moving_day_score + punctuality_score + care_with_items_score + professionalism_score) / 4.0 * 20), 0)
        FROM move_health_survey_responses 
        WHERE from_canton = v_canton OR to_canton = v_canton
      ),
      admin_score = (
        SELECT COALESCE(AVG((admin_hurdles_score + registration_ease + utility_transfer_ease + address_change_ease) / 4.0 * 20), 0)
        FROM move_health_survey_responses 
        WHERE from_canton = v_canton OR to_canton = v_canton
      ),
      recommend_rate = (
        SELECT COALESCE(AVG(CASE WHEN would_recommend THEN 100 ELSE 0 END), 0)
        FROM move_health_survey_responses 
        WHERE from_canton = v_canton OR to_canton = v_canton
      ),
      avg_stress_level = (
        SELECT COALESCE(AVG(stress_level), 3)
        FROM move_health_survey_responses 
        WHERE from_canton = v_canton OR to_canton = v_canton
      ),
      last_updated = now()
    WHERE canton_code = v_canton;
  END LOOP;
  
  RETURN NEW;
END;
$$;

-- Create trigger
CREATE TRIGGER update_canton_scores_trigger
AFTER INSERT ON public.move_health_survey_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_canton_health_scores();

-- Seed initial canton data
INSERT INTO move_health_canton_scores (canton_code, canton_name) VALUES
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