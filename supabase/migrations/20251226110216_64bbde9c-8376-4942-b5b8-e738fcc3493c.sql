-- Add new columns to existing flow_versions table for hierarchical flow management
ALTER TABLE public.flow_versions
  ADD COLUMN IF NOT EXISTS flow_code TEXT,
  ADD COLUMN IF NOT EXISTS flow_number INTEGER,
  ADD COLUMN IF NOT EXISTS variant_letter TEXT,
  ADD COLUMN IF NOT EXISTS adjustment_number INTEGER,
  ADD COLUMN IF NOT EXISTS parent_flow_code TEXT,
  ADD COLUMN IF NOT EXISTS config JSONB DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_ultimate BOOLEAN DEFAULT false;

-- Add unique constraint on flow_code (only if column was added successfully)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'flow_versions_flow_code_key'
  ) THEN
    ALTER TABLE public.flow_versions ADD CONSTRAINT flow_versions_flow_code_key UNIQUE (flow_code);
  END IF;
EXCEPTION WHEN duplicate_object THEN
  NULL;
END $$;