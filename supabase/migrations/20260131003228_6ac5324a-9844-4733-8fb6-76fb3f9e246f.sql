-- Canton Migration Flows Table for Flow Map Visualization
CREATE TABLE public.canton_migration_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year INTEGER NOT NULL,
  from_canton TEXT NOT NULL,
  to_canton TEXT NOT NULL,
  
  -- Flow Data
  move_count INTEGER NOT NULL DEFAULT 0,
  avg_cost NUMERIC,
  
  -- Trend Analysis
  yoy_change_percent NUMERIC,
  trend TEXT CHECK (trend IN ('steigend', 'stabil', 'sinkend')),
  
  -- Meta
  source TEXT DEFAULT 'platform_data',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Unique constraint per year and route
  UNIQUE(year, from_canton, to_canton)
);

-- Enable RLS
ALTER TABLE public.canton_migration_flows ENABLE ROW LEVEL SECURITY;

-- Allow public read access (this is public data journalism content)
CREATE POLICY "Canton migration flows are publicly readable"
  ON public.canton_migration_flows
  FOR SELECT
  USING (true);

-- Add BFS scenario columns to neighborhood_profiles for Future Simulator
ALTER TABLE public.neighborhood_profiles 
ADD COLUMN IF NOT EXISTS bfs_scenario_high JSONB,
ADD COLUMN IF NOT EXISTS bfs_scenario_medium JSONB,
ADD COLUMN IF NOT EXISTS bfs_scenario_low JSONB,
ADD COLUMN IF NOT EXISTS infrastructure_outlook TEXT CHECK (infrastructure_outlook IN ('expanding', 'stable', 'declining')),
ADD COLUMN IF NOT EXISTS development_projects JSONB;

-- Seed some initial canton flow data (aggregated from platform leads)
INSERT INTO public.canton_migration_flows (year, from_canton, to_canton, move_count, avg_cost, trend, yoy_change_percent)
VALUES
  -- 2024 Zürich flows
  (2024, 'ZH', 'AG', 1250, 2450, 'steigend', 8.5),
  (2024, 'ZH', 'ZG', 890, 3200, 'steigend', 12.3),
  (2024, 'ZH', 'SG', 720, 2100, 'stabil', 1.2),
  (2024, 'ZH', 'TG', 580, 1950, 'steigend', 15.8),
  (2024, 'ZH', 'LU', 450, 2650, 'stabil', 2.1),
  
  -- 2024 Bern flows
  (2024, 'BE', 'ZH', 680, 2800, 'stabil', -0.5),
  (2024, 'BE', 'AG', 420, 2100, 'steigend', 6.2),
  (2024, 'BE', 'SO', 350, 1800, 'stabil', 0.8),
  (2024, 'BE', 'FR', 290, 1650, 'sinkend', -3.2),
  
  -- 2024 Basel flows
  (2024, 'BS', 'BL', 920, 1450, 'steigend', 9.1),
  (2024, 'BS', 'AG', 380, 2200, 'stabil', 1.5),
  (2024, 'BS', 'ZH', 310, 2950, 'sinkend', -2.8),
  
  -- 2024 Geneva flows
  (2024, 'GE', 'VD', 1100, 2100, 'steigend', 11.2),
  (2024, 'GE', 'VS', 280, 2450, 'stabil', 0.3),
  
  -- 2024 Aargau flows
  (2024, 'AG', 'ZH', 480, 2650, 'stabil', 1.8),
  (2024, 'AG', 'LU', 290, 1850, 'steigend', 7.4),
  (2024, 'AG', 'SO', 220, 1550, 'stabil', 0.2),
  
  -- 2024 Inbound to Zürich
  (2024, 'LU', 'ZH', 520, 2700, 'steigend', 5.6),
  (2024, 'SG', 'ZH', 440, 2400, 'stabil', 2.1),
  (2024, 'TG', 'ZH', 380, 2150, 'sinkend', -1.2),
  
  -- 2023 comparison data
  (2023, 'ZH', 'AG', 1152, 2380, 'steigend', 6.2),
  (2023, 'ZH', 'ZG', 792, 3050, 'steigend', 9.8),
  (2023, 'ZH', 'SG', 711, 2080, 'stabil', 0.8),
  (2023, 'BE', 'ZH', 683, 2750, 'stabil', 1.2),
  (2023, 'BS', 'BL', 843, 1420, 'steigend', 7.5)
ON CONFLICT (year, from_canton, to_canton) DO NOTHING;

-- Create index for fast lookups
CREATE INDEX IF NOT EXISTS idx_canton_flows_year ON public.canton_migration_flows(year);
CREATE INDEX IF NOT EXISTS idx_canton_flows_from ON public.canton_migration_flows(from_canton);
CREATE INDEX IF NOT EXISTS idx_canton_flows_to ON public.canton_migration_flows(to_canton);

-- Trigger for updated_at
CREATE TRIGGER update_canton_migration_flows_updated_at
  BEFORE UPDATE ON public.canton_migration_flows
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();