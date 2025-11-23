-- Remove the old price_level check constraint and allow actual price ranges
ALTER TABLE companies DROP CONSTRAINT IF EXISTS companies_price_level_check;

-- Add a new constraint that allows actual price information
ALTER TABLE companies ADD CONSTRAINT companies_price_level_check 
CHECK (price_level IS NULL OR length(price_level) > 0);