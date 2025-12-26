-- Create table for custom flow configurations (V1.a, V1.b, etc.)
CREATE TABLE public.custom_flow_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  path TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-gray-500',
  description TEXT,
  steps JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.custom_flow_configs ENABLE ROW LEVEL SECURITY;

-- Allow all operations (admin table)
CREATE POLICY "Allow all for custom_flow_configs" 
ON public.custom_flow_configs 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_custom_flow_configs_updated_at
BEFORE UPDATE ON public.custom_flow_configs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index
CREATE INDEX idx_custom_flow_configs_flow_id ON public.custom_flow_configs(flow_id);