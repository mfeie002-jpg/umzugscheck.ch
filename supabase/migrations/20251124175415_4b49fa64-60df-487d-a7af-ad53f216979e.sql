-- Create subscription plans table
CREATE TABLE public.subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly numeric NOT NULL,
  price_yearly numeric,
  max_leads_per_month integer,
  features jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create provider subscriptions table
CREATE TABLE public.provider_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.subscription_plans(id),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  start_date timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone,
  stripe_subscription_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create lead transactions table for per-lead purchases
CREATE TABLE public.lead_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text DEFAULT 'CHF',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  stripe_payment_intent_id text,
  purchased_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- Create payment history table
CREATE TABLE public.payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id uuid NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text DEFAULT 'CHF',
  payment_type text NOT NULL CHECK (payment_type IN ('subscription', 'per_lead')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  description text,
  stripe_payment_id text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans
CREATE POLICY "Anyone can view active subscription plans"
  ON public.subscription_plans
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage subscription plans"
  ON public.subscription_plans
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for provider_subscriptions
CREATE POLICY "Providers can view their own subscriptions"
  ON public.provider_subscriptions
  FOR SELECT
  USING (
    provider_id::text = auth.uid()::text 
    OR provider_id IN (
      SELECT id FROM public.service_providers WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all subscriptions"
  ON public.provider_subscriptions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage subscriptions"
  ON public.provider_subscriptions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for lead_transactions
CREATE POLICY "Providers can view their own transactions"
  ON public.lead_transactions
  FOR SELECT
  USING (
    provider_id::text = auth.uid()::text
    OR provider_id IN (
      SELECT id FROM public.service_providers WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all transactions"
  ON public.lead_transactions
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage transactions"
  ON public.lead_transactions
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for payment_history
CREATE POLICY "Providers can view their own payment history"
  ON public.payment_history
  FOR SELECT
  USING (
    provider_id::text = auth.uid()::text
    OR provider_id IN (
      SELECT id FROM public.service_providers WHERE email = (
        SELECT email FROM auth.users WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Admins can view all payment history"
  ON public.payment_history
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage payment history"
  ON public.payment_history
  FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Create indexes for performance
CREATE INDEX idx_provider_subscriptions_provider_id ON public.provider_subscriptions(provider_id);
CREATE INDEX idx_provider_subscriptions_status ON public.provider_subscriptions(status);
CREATE INDEX idx_lead_transactions_provider_id ON public.lead_transactions(provider_id);
CREATE INDEX idx_lead_transactions_lead_id ON public.lead_transactions(lead_id);
CREATE INDEX idx_payment_history_provider_id ON public.payment_history(provider_id);

-- Create triggers for updated_at
CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_provider_subscriptions_updated_at
  BEFORE UPDATE ON public.provider_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, max_leads_per_month, features) VALUES
  ('Basis', 'Ideal für kleine Umzugsunternehmen', 99, 990, 10, '["10 Leads pro Monat", "E-Mail Benachrichtigungen", "Profil-Verwaltung"]'::jsonb),
  ('Professional', 'Für wachsende Umzugsfirmen', 249, 2490, 30, '["30 Leads pro Monat", "E-Mail & SMS Benachrichtigungen", "Profil-Verwaltung", "Priorität bei Lead-Zuweisung", "Erweiterte Statistiken"]'::jsonb),
  ('Premium', 'Für etablierte Unternehmen', 499, 4990, 100, '["100 Leads pro Monat", "E-Mail & SMS Benachrichtigungen", "Profil-Verwaltung", "Höchste Priorität bei Lead-Zuweisung", "Erweiterte Statistiken", "Dedizierter Support", "Featured Listing"]'::jsonb),
  ('Unbegrenzt', 'Maximale Lead-Generierung', 999, 9990, NULL, '["Unbegrenzte Leads", "Alle Premium Features", "API-Zugang", "White-Label Optionen"]'::jsonb);

-- Function to check if provider has active subscription
CREATE OR REPLACE FUNCTION public.provider_has_active_subscription(provider_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.provider_subscriptions
    WHERE provider_subscriptions.provider_id = $1
      AND status = 'active'
      AND (end_date IS NULL OR end_date > now())
  );
$$;

-- Function to check if provider can receive more leads this month
CREATE OR REPLACE FUNCTION public.provider_can_receive_lead(provider_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  subscription_limit integer;
  current_month_leads integer;
BEGIN
  -- Get the max leads from active subscription
  SELECT sp.max_leads_per_month INTO subscription_limit
  FROM public.provider_subscriptions ps
  JOIN public.subscription_plans sp ON ps.plan_id = sp.id
  WHERE ps.provider_id = $1
    AND ps.status = 'active'
    AND (ps.end_date IS NULL OR ps.end_date > now())
  LIMIT 1;
  
  -- If no subscription or unlimited plan (NULL limit), return true
  IF subscription_limit IS NULL THEN
    RETURN true;
  END IF;
  
  -- Count leads this month
  current_month_leads := public.count_provider_leads_this_month($1);
  
  -- Check if under limit
  RETURN current_month_leads < subscription_limit;
END;
$$;