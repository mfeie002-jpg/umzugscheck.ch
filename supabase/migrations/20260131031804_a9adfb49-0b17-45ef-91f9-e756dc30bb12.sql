-- Journey tracking table for Relo-OS 6-phase system
CREATE TABLE public.relo_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  current_phase TEXT NOT NULL DEFAULT 'route' CHECK (current_phase IN ('route', 'inventory', 'quote', 'booking', 'moving', 'complete')),
  archetype TEXT CHECK (archetype IN ('overwhelmed_professional', 'family_manager', 'silver_downsizer', 'expat_transfer', NULL)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  -- Phase data stored as JSONB
  route_data JSONB,
  inventory_data JSONB,
  quote_data JSONB,
  booking_data JSONB,
  moving_data JSONB,
  complete_data JSONB
);

-- Swiss Admin tasks tracking
CREATE TABLE public.swiss_admin_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id UUID REFERENCES public.relo_journeys(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('eumzug', 'swiss_post', 'serafe', 'address_change', 'utility_notification', 'custom')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
  completed_at TIMESTAMPTZ,
  deep_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.relo_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.swiss_admin_tasks ENABLE ROW LEVEL SECURITY;

-- RLS policies for relo_journeys
CREATE POLICY "Users can view their own journeys"
ON public.relo_journeys FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journeys"
ON public.relo_journeys FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journeys"
ON public.relo_journeys FOR UPDATE
USING (auth.uid() = user_id);

-- Allow anonymous journey creation (for guest users before auth)
CREATE POLICY "Allow anonymous journey creation"
ON public.relo_journeys FOR INSERT
WITH CHECK (user_id IS NULL);

CREATE POLICY "Allow viewing anonymous journeys by lead_id"
ON public.relo_journeys FOR SELECT
USING (user_id IS NULL);

-- RLS policies for swiss_admin_tasks
CREATE POLICY "Users can view their journey tasks"
ON public.swiss_admin_tasks FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.relo_journeys
    WHERE relo_journeys.id = swiss_admin_tasks.journey_id
    AND (relo_journeys.user_id = auth.uid() OR relo_journeys.user_id IS NULL)
  )
);

CREATE POLICY "Users can create tasks for their journeys"
ON public.swiss_admin_tasks FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.relo_journeys
    WHERE relo_journeys.id = swiss_admin_tasks.journey_id
    AND (relo_journeys.user_id = auth.uid() OR relo_journeys.user_id IS NULL)
  )
);

CREATE POLICY "Users can update tasks for their journeys"
ON public.swiss_admin_tasks FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.relo_journeys
    WHERE relo_journeys.id = swiss_admin_tasks.journey_id
    AND (relo_journeys.user_id = auth.uid() OR relo_journeys.user_id IS NULL)
  )
);

-- Indexes for performance
CREATE INDEX idx_relo_journeys_user_id ON public.relo_journeys(user_id);
CREATE INDEX idx_relo_journeys_lead_id ON public.relo_journeys(lead_id);
CREATE INDEX idx_relo_journeys_current_phase ON public.relo_journeys(current_phase);
CREATE INDEX idx_swiss_admin_tasks_journey_id ON public.swiss_admin_tasks(journey_id);
CREATE INDEX idx_swiss_admin_tasks_status ON public.swiss_admin_tasks(status);

-- Updated_at trigger
CREATE TRIGGER update_relo_journeys_updated_at
BEFORE UPDATE ON public.relo_journeys
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_swiss_admin_tasks_updated_at
BEFORE UPDATE ON public.swiss_admin_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();