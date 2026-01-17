-- Referral System Tables for Phase 8

-- Main referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_email TEXT NOT NULL,
  referrer_name TEXT,
  referral_code TEXT NOT NULL UNIQUE,
  total_referrals INTEGER DEFAULT 0,
  successful_referrals INTEGER DEFAULT 0,
  total_earned_chf NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'blocked')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Individual referral conversions
CREATE TABLE public.referral_conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_id UUID REFERENCES public.referrals(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_name TEXT,
  lead_id UUID REFERENCES public.leads(id),
  conversion_type TEXT DEFAULT 'lead' CHECK (conversion_type IN ('signup', 'lead', 'completed_move')),
  reward_amount_chf NUMERIC(10,2) DEFAULT 50.00,
  reward_status TEXT DEFAULT 'pending' CHECK (reward_status IN ('pending', 'approved', 'paid', 'rejected')),
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Partner affiliates (Immobilienmakler, Hausverwaltungen)
CREATE TABLE public.affiliate_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  partner_type TEXT DEFAULT 'realtor' CHECK (partner_type IN ('realtor', 'property_manager', 'insurance', 'bank', 'other')),
  affiliate_code TEXT NOT NULL UNIQUE,
  commission_rate_percent NUMERIC(5,2) DEFAULT 10.00,
  total_referrals INTEGER DEFAULT 0,
  total_earned_chf NUMERIC(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'paused', 'terminated')),
  contract_signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Partner payouts
CREATE TABLE public.affiliate_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.affiliate_partners(id) ON DELETE CASCADE,
  amount_chf NUMERIC(10,2) NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  referral_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_reference TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Public can create referrals (for generating codes)
CREATE POLICY "Anyone can create referral codes" ON public.referrals
  FOR INSERT WITH CHECK (true);

-- Users can view their own referrals by email
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (true);

-- Admins can manage all
CREATE POLICY "Admins can manage referrals" ON public.referrals
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage conversions" ON public.referral_conversions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage partners" ON public.affiliate_partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can manage payouts" ON public.affiliate_payouts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Public insert for partner applications
CREATE POLICY "Anyone can apply as partner" ON public.affiliate_partners
  FOR INSERT WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_referrals_code ON public.referrals(referral_code);
CREATE INDEX idx_referrals_email ON public.referrals(referrer_email);
CREATE INDEX idx_conversions_referral ON public.referral_conversions(referral_id);
CREATE INDEX idx_partners_code ON public.affiliate_partners(affiliate_code);
CREATE INDEX idx_partners_status ON public.affiliate_partners(status);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'UMZ-';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update referral stats
CREATE OR REPLACE FUNCTION public.update_referral_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.referrals
    SET 
      total_referrals = total_referrals + 1,
      updated_at = now()
    WHERE id = NEW.referral_id;
  END IF;
  
  IF NEW.reward_status = 'paid' AND (OLD IS NULL OR OLD.reward_status != 'paid') THEN
    UPDATE public.referrals
    SET 
      successful_referrals = successful_referrals + 1,
      total_earned_chf = total_earned_chf + NEW.reward_amount_chf,
      updated_at = now()
    WHERE id = NEW.referral_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_referral_stats
AFTER INSERT OR UPDATE ON public.referral_conversions
FOR EACH ROW EXECUTE FUNCTION public.update_referral_stats();