-- Lead Bidding System Tables
-- Real-time auction system for providers to bid on leads

-- Bids table - stores all provider bids on leads
CREATE TABLE IF NOT EXISTS public.lead_bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  bid_amount DECIMAL(10,2) NOT NULL CHECK (bid_amount > 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'won', 'lost', 'expired', 'withdrawn')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure one bid per provider per lead
  UNIQUE(lead_id, provider_id)
);

-- Add bidding fields to leads table if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'leads' AND column_name = 'bidding_enabled') THEN
    ALTER TABLE public.leads ADD COLUMN bidding_enabled BOOLEAN DEFAULT false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'leads' AND column_name = 'starting_bid') THEN
    ALTER TABLE public.leads ADD COLUMN starting_bid DECIMAL(10,2) DEFAULT 10.00;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'leads' AND column_name = 'current_highest_bid') THEN
    ALTER TABLE public.leads ADD COLUMN current_highest_bid DECIMAL(10,2);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'leads' AND column_name = 'winning_provider_id') THEN
    ALTER TABLE public.leads ADD COLUMN winning_provider_id UUID REFERENCES public.service_providers(id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'leads' AND column_name = 'bidding_closes_at') THEN
    ALTER TABLE public.leads ADD COLUMN bidding_closes_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'leads' AND column_name = 'bid_count') THEN
    ALTER TABLE public.leads ADD COLUMN bid_count INTEGER DEFAULT 0;
  END IF;
END $$;

-- Enable RLS on lead_bids
ALTER TABLE public.lead_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_bids (using email-based auth since service_providers has no user_id)

-- Providers can view their own bids (via email match)
CREATE POLICY "Providers view own bids via email"
  ON public.lead_bids FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM public.service_providers 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Providers can create bids
CREATE POLICY "Providers create bids via email"
  ON public.lead_bids FOR INSERT
  WITH CHECK (
    provider_id IN (
      SELECT id FROM public.service_providers 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Providers can update their own bids
CREATE POLICY "Providers update own bids via email"
  ON public.lead_bids FOR UPDATE
  USING (
    provider_id IN (
      SELECT id FROM public.service_providers 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- Admins can view all bids
CREATE POLICY "Admins view all bids"
  ON public.lead_bids FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can manage all bids
CREATE POLICY "Admins manage all bids"
  ON public.lead_bids FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to update bid statistics when a new bid is placed
CREATE OR REPLACE FUNCTION public.update_lead_bid_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.leads
  SET 
    current_highest_bid = (
      SELECT MAX(bid_amount) 
      FROM public.lead_bids 
      WHERE lead_id = NEW.lead_id AND status = 'active'
    ),
    bid_count = (
      SELECT COUNT(*) 
      FROM public.lead_bids 
      WHERE lead_id = NEW.lead_id AND status = 'active'
    ),
    updated_at = now()
  WHERE id = NEW.lead_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to update stats on bid changes
DROP TRIGGER IF EXISTS update_bid_stats_trigger ON public.lead_bids;
CREATE TRIGGER update_bid_stats_trigger
  AFTER INSERT OR UPDATE ON public.lead_bids
  FOR EACH ROW
  EXECUTE FUNCTION public.update_lead_bid_stats();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lead_bids_lead_id ON public.lead_bids(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_bids_provider_id ON public.lead_bids(provider_id);
CREATE INDEX IF NOT EXISTS idx_lead_bids_status ON public.lead_bids(status);
CREATE INDEX IF NOT EXISTS idx_leads_bidding_enabled ON public.leads(bidding_enabled) WHERE bidding_enabled = true;
CREATE INDEX IF NOT EXISTS idx_leads_bidding_closes_at ON public.leads(bidding_closes_at) WHERE bidding_enabled = true;