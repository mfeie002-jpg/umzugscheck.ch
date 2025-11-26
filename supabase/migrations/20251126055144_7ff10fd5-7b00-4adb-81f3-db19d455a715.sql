-- Extend service_providers table with monetization fields
ALTER TABLE public.service_providers
ADD COLUMN IF NOT EXISTS cpl_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cpc_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS call_tracking_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS cpl_price_chf DECIMAL(10,2) DEFAULT 25.00,
ADD COLUMN IF NOT EXISTS cpc_price_chf DECIMAL(10,2) DEFAULT 1.50,
ADD COLUMN IF NOT EXISTS call_price_chf DECIMAL(10,2) DEFAULT 5.00,
ADD COLUMN IF NOT EXISTS bidding_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS max_bid_chf DECIMAL(10,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS daily_budget_chf DECIMAL(10,2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS daily_budget_remaining_chf DECIMAL(10,2) DEFAULT 100.00,
ADD COLUMN IF NOT EXISTS quality_score DECIMAL(3,2) DEFAULT 0.50,
ADD COLUMN IF NOT EXISTS profile_completeness DECIMAL(3,2) DEFAULT 0.00;

-- Add comment explaining monetization model
COMMENT ON COLUMN public.service_providers.cpl_enabled IS 'Cost Per Lead model enabled';
COMMENT ON COLUMN public.service_providers.cpc_enabled IS 'Cost Per Click model enabled';
COMMENT ON COLUMN public.service_providers.quality_score IS 'Quality score for ad ranking (0.0-1.0)';
COMMENT ON COLUMN public.service_providers.profile_completeness IS 'Profile completeness score (0.0-1.0)';

-- Create index for fast sponsored company lookups
CREATE INDEX IF NOT EXISTS idx_providers_bidding ON public.service_providers(bidding_active, sponsored_tier) 
WHERE bidding_active = true OR sponsored_tier > 0;