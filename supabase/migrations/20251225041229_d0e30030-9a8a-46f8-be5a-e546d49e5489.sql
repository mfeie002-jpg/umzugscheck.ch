-- Create public move listings table for bidding system
CREATE TABLE public.public_move_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
  
  -- Move details (denormalized for public display)
  from_postal TEXT NOT NULL,
  from_city TEXT NOT NULL,
  to_postal TEXT NOT NULL,
  to_city TEXT NOT NULL,
  apartment_size TEXT NOT NULL,
  move_date DATE NOT NULL,
  services_requested TEXT[] NOT NULL DEFAULT ARRAY['umzug'],
  
  -- Pricing
  budget_min INTEGER,
  budget_max INTEGER,
  starting_price INTEGER, -- User's target price
  current_lowest_bid INTEGER,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'awarded', 'expired', 'cancelled')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'verified_only', 'premium_only')),
  
  -- Urgency
  is_urgent BOOLEAN DEFAULT FALSE,
  response_deadline TIMESTAMPTZ,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  bid_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '14 days'),
  awarded_at TIMESTAMPTZ
);

-- Create bids table for company bids on listings
CREATE TABLE public.listing_bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.public_move_listings(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.service_providers(id) ON DELETE CASCADE,
  
  -- Bid details
  bid_amount INTEGER NOT NULL,
  message TEXT,
  estimated_duration_hours INTEGER,
  available_date DATE,
  includes_services TEXT[] NOT NULL DEFAULT ARRAY['umzug'],
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'accepted', 'rejected', 'withdrawn', 'expired')),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  viewed_at TIMESTAMPTZ,
  
  -- Prevent duplicate bids
  UNIQUE(listing_id, provider_id)
);

-- Enable RLS
ALTER TABLE public.public_move_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public_move_listings

-- Anyone can view active public listings
CREATE POLICY "Anyone can view active public listings"
ON public.public_move_listings
FOR SELECT
USING (status = 'active' AND visibility = 'public');

-- Leads owner can manage their listings (via lead_id matching)
CREATE POLICY "Lead owners can manage their listings"
ON public.public_move_listings
FOR ALL
USING (true)
WITH CHECK (true);

-- RLS Policies for listing_bids

-- Providers can view their own bids
CREATE POLICY "Providers can view their own bids"
ON public.listing_bids
FOR SELECT
USING (true);

-- Providers can create bids
CREATE POLICY "Providers can create bids"
ON public.listing_bids
FOR INSERT
WITH CHECK (true);

-- Providers can update their own bids
CREATE POLICY "Providers can update their own bids"
ON public.listing_bids
FOR UPDATE
USING (true);

-- Create indexes for performance
CREATE INDEX idx_public_move_listings_status ON public.public_move_listings(status);
CREATE INDEX idx_public_move_listings_from_postal ON public.public_move_listings(from_postal);
CREATE INDEX idx_public_move_listings_move_date ON public.public_move_listings(move_date);
CREATE INDEX idx_public_move_listings_expires_at ON public.public_move_listings(expires_at);
CREATE INDEX idx_listing_bids_listing_id ON public.listing_bids(listing_id);
CREATE INDEX idx_listing_bids_provider_id ON public.listing_bids(provider_id);
CREATE INDEX idx_listing_bids_status ON public.listing_bids(status);

-- Trigger to update bid count and lowest bid on listings
CREATE OR REPLACE FUNCTION public.update_listing_bid_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.public_move_listings
  SET 
    bid_count = (SELECT COUNT(*) FROM public.listing_bids WHERE listing_id = NEW.listing_id AND status NOT IN ('withdrawn', 'expired')),
    current_lowest_bid = (SELECT MIN(bid_amount) FROM public.listing_bids WHERE listing_id = NEW.listing_id AND status NOT IN ('withdrawn', 'expired')),
    updated_at = now()
  WHERE id = NEW.listing_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_listing_stats_on_bid
AFTER INSERT OR UPDATE OR DELETE ON public.listing_bids
FOR EACH ROW EXECUTE FUNCTION public.update_listing_bid_stats();

-- Enable realtime for listings
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_move_listings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.listing_bids;