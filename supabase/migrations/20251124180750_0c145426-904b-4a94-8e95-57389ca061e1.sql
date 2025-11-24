-- Create lead_bids table for tracking all bids on leads
CREATE TABLE IF NOT EXISTS public.lead_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  bid_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'active', -- active, outbid, won, withdrawn
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT valid_bid_amount CHECK (bid_amount > 0)
);

-- Add indexes for performance
CREATE INDEX idx_lead_bids_lead_id ON public.lead_bids(lead_id);
CREATE INDEX idx_lead_bids_provider_id ON public.lead_bids(provider_id);
CREATE INDEX idx_lead_bids_status ON public.lead_bids(status);

-- Enable RLS
ALTER TABLE public.lead_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can view all bids"
  ON public.lead_bids
  FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Providers can view bids on leads they can access"
  ON public.lead_bids
  FOR SELECT
  USING (
    provider_id IN (
      SELECT id FROM service_providers 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
    OR lead_id IN (
      SELECT id FROM leads 
      WHERE assigned_provider_ids @> ARRAY[(
        SELECT id FROM service_providers 
        WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
      )::uuid]
    )
  );

CREATE POLICY "Providers can create bids"
  ON public.lead_bids
  FOR INSERT
  WITH CHECK (
    provider_id IN (
      SELECT id FROM service_providers 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

CREATE POLICY "Providers can update their own bids"
  ON public.lead_bids
  FOR UPDATE
  USING (
    provider_id IN (
      SELECT id FROM service_providers 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  );

-- Add bidding fields to leads table
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS bidding_enabled BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS bidding_closes_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS starting_bid NUMERIC,
  ADD COLUMN IF NOT EXISTS current_highest_bid NUMERIC,
  ADD COLUMN IF NOT EXISTS bid_count INTEGER DEFAULT 0;

-- Function to update lead when new bid is placed
CREATE OR REPLACE FUNCTION update_lead_bid_stats()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update lead with latest bid info
  UPDATE leads
  SET 
    current_highest_bid = (
      SELECT MAX(bid_amount) 
      FROM lead_bids 
      WHERE lead_id = NEW.lead_id AND status = 'active'
    ),
    bid_count = (
      SELECT COUNT(*) 
      FROM lead_bids 
      WHERE lead_id = NEW.lead_id AND status = 'active'
    )
  WHERE id = NEW.lead_id;
  
  -- Mark previous bids as outbid
  UPDATE lead_bids
  SET status = 'outbid'
  WHERE lead_id = NEW.lead_id 
    AND id != NEW.id 
    AND status = 'active'
    AND bid_amount < NEW.bid_amount;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update bid stats
CREATE TRIGGER trigger_update_bid_stats
  AFTER INSERT ON public.lead_bids
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_bid_stats();

-- Enable realtime for lead_bids
ALTER TABLE public.lead_bids REPLICA IDENTITY FULL;

-- Function to close bidding and assign winner
CREATE OR REPLACE FUNCTION close_lead_bidding(p_lead_id UUID)
RETURNS JSON
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_winning_bid RECORD;
  v_result JSON;
BEGIN
  -- Get the highest active bid
  SELECT * INTO v_winning_bid
  FROM lead_bids
  WHERE lead_id = p_lead_id 
    AND status = 'active'
  ORDER BY bid_amount DESC, created_at ASC
  LIMIT 1;
  
  IF v_winning_bid IS NOT NULL THEN
    -- Mark winning bid
    UPDATE lead_bids
    SET status = 'won'
    WHERE id = v_winning_bid.id;
    
    -- Mark other bids as lost
    UPDATE lead_bids
    SET status = 'outbid'
    WHERE lead_id = p_lead_id 
      AND id != v_winning_bid.id 
      AND status = 'active';
    
    -- Disable bidding on lead
    UPDATE leads
    SET bidding_enabled = false
    WHERE id = p_lead_id;
    
    v_result := json_build_object(
      'success', true,
      'winning_bid_id', v_winning_bid.id,
      'winning_provider_id', v_winning_bid.provider_id,
      'winning_amount', v_winning_bid.bid_amount
    );
  ELSE
    v_result := json_build_object(
      'success', false,
      'message', 'No active bids found'
    );
  END IF;
  
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.lead_bids IS 'Stores all bids placed by providers on leads';
COMMENT ON FUNCTION close_lead_bidding IS 'Closes bidding on a lead and determines the winner';
