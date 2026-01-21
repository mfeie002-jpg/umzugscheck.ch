-- ================================================
-- Feature 1: Offer Check (Konkurrenz-Offerten analysieren)
-- Feature 2: Hard-Truth Feedback Loop (Mover-Feedback)
-- Feature 3: Managed Portal (Case System)
-- Feature 4: Case Tracking System
-- ================================================

-- 1. Offer Check Requests (User pastet Offerte)
CREATE TABLE IF NOT EXISTS public.offer_check_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT,
  offer_text TEXT NOT NULL,
  offer_amount NUMERIC,
  offer_provider TEXT,
  detected_issues JSONB DEFAULT '[]'::jsonb,
  analysis_result JSONB,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'analyzed', 'reviewed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Hard-Truth Feedback (Mover gibt echte Daten nach Umzug)
CREATE TABLE IF NOT EXISTS public.movescan_hard_truth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  movescan_id UUID,
  lead_id UUID REFERENCES public.leads(id),
  provider_id UUID REFERENCES public.service_providers(id),
  
  -- Actual move data (for AI training)
  actual_volume_m3 NUMERIC,
  actual_weight_kg NUMERIC,
  actual_duration_hours NUMERIC,
  actual_crew_size INTEGER,
  actual_truck_type TEXT,
  invoice_total_chf NUMERIC,
  distance_km NUMERIC,
  
  -- Comparison with estimate
  estimated_volume_m3 NUMERIC,
  volume_deviation_percent NUMERIC,
  price_deviation_percent NUMERIC,
  
  -- Feedback
  mover_notes TEXT,
  customer_satisfaction INTEGER CHECK (customer_satisfaction BETWEEN 1 AND 5),
  issues_reported TEXT[],
  
  -- Meta
  feedback_source TEXT DEFAULT 'mover' CHECK (feedback_source IN ('mover', 'customer', 'invoice_scan', 'manual')),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Managed Service Cases (Full-Service Tracking)
CREATE TABLE IF NOT EXISTS public.managed_cases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_number TEXT UNIQUE NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  
  -- Service details
  service_type TEXT DEFAULT 'full_service' CHECK (service_type IN ('full_service', 'partial', 'premium')),
  move_date DATE,
  from_address TEXT,
  to_address TEXT,
  
  -- Status tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'quoted', 'confirmed', 'scheduled', 'in_progress', 'completed', 'cancelled')),
  assigned_provider_id UUID REFERENCES public.service_providers(id),
  
  -- Timeline events stored as JSONB array
  timeline JSONB DEFAULT '[]'::jsonb,
  
  -- Pricing
  quoted_price_chf NUMERIC,
  final_price_chf NUMERIC,
  
  -- Internal
  internal_notes TEXT,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create case number sequence
CREATE SEQUENCE IF NOT EXISTS managed_case_seq START 1000;

-- Function to generate case number
CREATE OR REPLACE FUNCTION generate_case_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.case_number := 'UMZ-' || TO_CHAR(now(), 'YYMM') || '-' || LPAD(nextval('managed_case_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto case number
DROP TRIGGER IF EXISTS tr_generate_case_number ON public.managed_cases;
CREATE TRIGGER tr_generate_case_number
  BEFORE INSERT ON public.managed_cases
  FOR EACH ROW
  WHEN (NEW.case_number IS NULL)
  EXECUTE FUNCTION generate_case_number();

-- 4. Case Timeline Events (detailed history)
CREATE TABLE IF NOT EXISTS public.case_timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id UUID NOT NULL REFERENCES public.managed_cases(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_data JSONB,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.offer_check_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movescan_hard_truth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managed_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_timeline_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public insert for anonymous users, admin read)
CREATE POLICY "Anyone can submit offer check" ON public.offer_check_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit hard truth" ON public.movescan_hard_truth
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can create managed case" ON public.managed_cases
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can add timeline event" ON public.case_timeline_events
  FOR INSERT WITH CHECK (true);

-- Select policies for authenticated users
CREATE POLICY "Authenticated users can view offer checks" ON public.offer_check_requests
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view hard truth" ON public.movescan_hard_truth
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view cases" ON public.managed_cases
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view timeline" ON public.case_timeline_events
  FOR SELECT USING (auth.role() = 'authenticated');

-- Update policies for authenticated
CREATE POLICY "Authenticated users can update cases" ON public.managed_cases
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_offer_check_status ON public.offer_check_requests(status);
CREATE INDEX IF NOT EXISTS idx_hard_truth_provider ON public.movescan_hard_truth(provider_id);
CREATE INDEX IF NOT EXISTS idx_managed_cases_status ON public.managed_cases(status);
CREATE INDEX IF NOT EXISTS idx_case_timeline_case ON public.case_timeline_events(case_id);