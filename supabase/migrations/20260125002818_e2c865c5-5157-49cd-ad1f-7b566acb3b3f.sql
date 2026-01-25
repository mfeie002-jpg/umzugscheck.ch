-- =====================================================
-- PHASE 2: Move Projects & Project Bids Tables
-- (provider_availability already exists)
-- =====================================================

-- Move Project Status Enum
CREATE TYPE public.move_project_status AS ENUM (
  'route',
  'inventory', 
  'quote',
  'booking',
  'moving',
  'complete'
);

-- Core Move Projects Table
CREATE TABLE public.move_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Status & Progress
  status move_project_status NOT NULL DEFAULT 'route',
  progress_percentage INTEGER NOT NULL DEFAULT 0,
  
  -- Route Details
  from_address TEXT,
  from_postal TEXT,
  from_city TEXT,
  from_floor INTEGER,
  from_has_elevator BOOLEAN DEFAULT false,
  to_address TEXT,
  to_postal TEXT,
  to_city TEXT,
  to_floor INTEGER,
  to_has_elevator BOOLEAN DEFAULT false,
  distance_km NUMERIC,
  
  -- Inventory (JSON for flexibility)
  inventory_data JSONB DEFAULT '[]'::jsonb,
  total_volume_m3 NUMERIC,
  total_items INTEGER DEFAULT 0,
  
  -- Dates
  preferred_date DATE,
  flexible_dates BOOLEAN DEFAULT true,
  
  -- Quote & Pricing
  estimated_price_min NUMERIC,
  estimated_price_max NUMERIC,
  final_price NUMERIC,
  
  -- Provider Assignment
  assigned_provider_id UUID REFERENCES public.service_providers(id),
  provider_confirmed BOOLEAN DEFAULT false,
  
  -- Contact Info (for anonymous users)
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  
  -- Tracking
  events JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE public.move_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for move_projects
CREATE POLICY "Users can view their own projects"
  ON public.move_projects FOR SELECT
  USING (
    user_id = auth.uid() OR 
    contact_email = (current_setting('request.jwt.claims', true)::json->>'email')
  );

CREATE POLICY "Users can create projects"
  ON public.move_projects FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own projects"
  ON public.move_projects FOR UPDATE
  USING (
    user_id = auth.uid() OR
    contact_email = (current_setting('request.jwt.claims', true)::json->>'email')
  );

CREATE POLICY "Admins can manage all projects"
  ON public.move_projects FOR ALL
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can view assigned projects"
  ON public.move_projects FOR SELECT
  USING (
    assigned_provider_id IN (
      SELECT id FROM service_providers 
      WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

-- =====================================================
-- Provider Bids on Projects
-- =====================================================
CREATE TABLE public.project_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.move_projects(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  
  bid_amount NUMERIC NOT NULL,
  includes_packing BOOLEAN DEFAULT false,
  includes_materials BOOLEAN DEFAULT false,
  estimated_duration_hours INTEGER,
  
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ DEFAULT (now() + interval '48 hours'),
  
  UNIQUE(project_id, provider_id)
);

ALTER TABLE public.project_bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can manage their bids"
  ON public.project_bids FOR ALL
  USING (
    provider_id IN (
      SELECT id FROM service_providers 
      WHERE email = (current_setting('request.jwt.claims', true)::json->>'email')
    )
  );

CREATE POLICY "Project owners can view bids"
  ON public.project_bids FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM move_projects 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all bids"
  ON public.project_bids FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- Update Triggers
-- =====================================================
CREATE TRIGGER update_move_projects_updated_at
  BEFORE UPDATE ON public.move_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_bids_updated_at
  BEFORE UPDATE ON public.project_bids
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX idx_move_projects_user_id ON public.move_projects(user_id);
CREATE INDEX idx_move_projects_status ON public.move_projects(status);
CREATE INDEX idx_move_projects_provider ON public.move_projects(assigned_provider_id);
CREATE INDEX idx_project_bids_project ON public.project_bids(project_id);
CREATE INDEX idx_project_bids_provider ON public.project_bids(provider_id);