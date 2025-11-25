-- Add billing and subscription fields to service_providers table
ALTER TABLE service_providers 
ADD COLUMN IF NOT EXISTS billing_model TEXT DEFAULT 'CPL' CHECK (billing_model IN ('CPL', 'PPC', 'Subscription')),
ADD COLUMN IF NOT EXISTS lead_price_chf NUMERIC DEFAULT 25.00,
ADD COLUMN IF NOT EXISTS click_price_chf NUMERIC DEFAULT 1.50,
ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'none' CHECK (subscription_plan IN ('none', 'basic', 'premium', 'enterprise')),
ADD COLUMN IF NOT EXISTS monthly_fee_chf NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;

-- Create billing_records table for CPL tracking
CREATE TABLE IF NOT EXISTS billing_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  price_chf NUMERIC NOT NULL,
  billing_model TEXT NOT NULL CHECK (billing_model IN ('CPL', 'PPC', 'Subscription')),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'paid', 'cancelled')),
  billing_period TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  paid_at TIMESTAMP WITH TIME ZONE,
  invoice_number TEXT
);

CREATE INDEX IF NOT EXISTS idx_billing_records_provider ON billing_records(provider_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_status ON billing_records(status);
CREATE INDEX IF NOT EXISTS idx_billing_records_period ON billing_records(billing_period);

-- Create provider_click_events table for PPC tracking
CREATE TABLE IF NOT EXISTS provider_click_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES service_providers(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('profile_view', 'external_link', 'phone_click', 'email_click')),
  price_chf NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_ip TEXT,
  user_agent TEXT,
  referer TEXT
);

CREATE INDEX IF NOT EXISTS idx_click_events_provider ON provider_click_events(provider_id);
CREATE INDEX IF NOT EXISTS idx_click_events_date ON provider_click_events(created_at);

-- Enable RLS on new tables
ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_click_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for billing_records
CREATE POLICY "Admins can view all billing records"
  ON billing_records FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can view their own billing records"
  ON billing_records FOR SELECT
  USING (provider_id IN (
    SELECT id FROM service_providers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  ));

CREATE POLICY "System can manage billing records"
  ON billing_records FOR ALL
  USING (true);

-- RLS Policies for provider_click_events
CREATE POLICY "Admins can view all click events"
  ON provider_click_events FOR SELECT
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Providers can view their own click events"
  ON provider_click_events FOR SELECT
  USING (provider_id IN (
    SELECT id FROM service_providers 
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
  ));

CREATE POLICY "System can manage click events"
  ON provider_click_events FOR ALL
  USING (true);