-- Add ranking position field to service_providers table
ALTER TABLE service_providers 
ADD COLUMN IF NOT EXISTS ranking_position INTEGER,
ADD COLUMN IF NOT EXISTS featured_position INTEGER;

-- Create index for faster ranking queries
CREATE INDEX IF NOT EXISTS idx_service_providers_ranking 
ON service_providers(ranking_position) 
WHERE ranking_position IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_service_providers_featured 
ON service_providers(featured_position) 
WHERE is_featured = true AND featured_position IS NOT NULL;

-- Comment the columns
COMMENT ON COLUMN service_providers.ranking_position IS 'Overall ranking position for best companies list (lower = better)';
COMMENT ON COLUMN service_providers.featured_position IS 'Position in featured/sponsored list (lower = better)';