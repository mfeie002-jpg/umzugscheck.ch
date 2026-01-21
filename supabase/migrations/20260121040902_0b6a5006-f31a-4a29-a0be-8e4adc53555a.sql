-- Escrow/Treuhand System für sichere Zahlungsabwicklung

-- Escrow Transactions Table
CREATE TABLE public.escrow_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES public.leads(id),
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  provider_id UUID REFERENCES public.service_providers(id),
  
  -- Beträge
  total_amount NUMERIC NOT NULL,
  platform_fee NUMERIC DEFAULT 0,
  provider_payout NUMERIC NOT NULL,
  currency TEXT DEFAULT 'CHF',
  
  -- Status-Tracking
  status TEXT DEFAULT 'pending',
  
  -- Zeitstempel
  created_at TIMESTAMPTZ DEFAULT now(),
  funded_at TIMESTAMPTZ,
  service_completed_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  disputed_at TIMESTAMPTZ,
  
  -- Service Details
  service_type TEXT,
  service_date DATE,
  service_description TEXT,
  
  -- Bestätigungen
  customer_confirmed BOOLEAN DEFAULT false,
  provider_confirmed BOOLEAN DEFAULT false,
  
  -- Payment References
  stripe_payment_intent_id TEXT,
  stripe_transfer_id TEXT,
  
  -- Dispute Info
  dispute_reason TEXT,
  dispute_resolution TEXT,
  resolved_by TEXT,
  resolved_at TIMESTAMPTZ
);

-- Escrow Events für Audit Trail
CREATE TABLE public.escrow_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  escrow_id UUID NOT NULL REFERENCES public.escrow_transactions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.escrow_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.escrow_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies für Escrow Transactions (using email column from service_providers)
CREATE POLICY "Customers can view their escrow transactions"
ON public.escrow_transactions FOR SELECT
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Providers can view their escrow transactions"
ON public.escrow_transactions FOR SELECT
USING (provider_id IN (
  SELECT id FROM public.service_providers 
  WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
));

CREATE POLICY "Customers can confirm service completion"
ON public.escrow_transactions FOR UPDATE
USING (customer_email = current_setting('request.jwt.claims', true)::json->>'email')
WITH CHECK (customer_email = current_setting('request.jwt.claims', true)::json->>'email');

-- RLS Policies für Escrow Events
CREATE POLICY "Participants can view escrow events"
ON public.escrow_events FOR SELECT
USING (escrow_id IN (
  SELECT id FROM public.escrow_transactions 
  WHERE customer_email = current_setting('request.jwt.claims', true)::json->>'email'
  OR provider_id IN (
    SELECT id FROM public.service_providers 
    WHERE email = current_setting('request.jwt.claims', true)::json->>'email'
  )
));

-- Indexes for performance
CREATE INDEX idx_escrow_transactions_customer ON public.escrow_transactions(customer_email);
CREATE INDEX idx_escrow_transactions_provider ON public.escrow_transactions(provider_id);
CREATE INDEX idx_escrow_transactions_status ON public.escrow_transactions(status);
CREATE INDEX idx_escrow_transactions_lead ON public.escrow_transactions(lead_id);
CREATE INDEX idx_escrow_events_escrow ON public.escrow_events(escrow_id);

-- Function to log escrow events
CREATE OR REPLACE FUNCTION log_escrow_event()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.escrow_events (escrow_id, event_type, event_data)
    VALUES (NEW.id, 'created', jsonb_build_object('amount', NEW.total_amount, 'customer', NEW.customer_name));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.escrow_events (escrow_id, event_type, event_data)
      VALUES (NEW.id, 'status_changed', jsonb_build_object('from', OLD.status, 'to', NEW.status));
    END IF;
    IF NOT OLD.customer_confirmed AND NEW.customer_confirmed THEN
      INSERT INTO public.escrow_events (escrow_id, event_type, event_data)
      VALUES (NEW.id, 'customer_confirmed', jsonb_build_object('confirmed_at', now()));
    END IF;
    IF NOT OLD.provider_confirmed AND NEW.provider_confirmed THEN
      INSERT INTO public.escrow_events (escrow_id, event_type, event_data)
      VALUES (NEW.id, 'provider_confirmed', jsonb_build_object('confirmed_at', now()));
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for event logging
CREATE TRIGGER escrow_event_logger
AFTER INSERT OR UPDATE ON public.escrow_transactions
FOR EACH ROW EXECUTE FUNCTION log_escrow_event();

-- Function to auto-release funds after both confirmations
CREATE OR REPLACE FUNCTION auto_release_escrow()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_confirmed AND NEW.provider_confirmed AND NEW.status = 'funded' THEN
    NEW.status := 'released';
    NEW.released_at := now();
    NEW.service_completed_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for auto-release
CREATE TRIGGER escrow_auto_release
BEFORE UPDATE ON public.escrow_transactions
FOR EACH ROW EXECUTE FUNCTION auto_release_escrow();