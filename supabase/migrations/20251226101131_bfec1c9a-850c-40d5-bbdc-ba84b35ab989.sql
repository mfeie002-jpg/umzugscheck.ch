-- Create table for flow feedback variants (A, B, C, D per flow)
CREATE TABLE public.flow_feedback_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id TEXT NOT NULL,
  variant_name TEXT NOT NULL CHECK (variant_name IN ('A', 'B', 'C', 'D', 'E', 'F')),
  variant_label TEXT NOT NULL,
  prompt TEXT NOT NULL,
  zip_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'done', 'error')),
  result_json JSONB,
  output_flow_id TEXT,
  error_message TEXT,
  executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(flow_id, variant_name)
);

-- Enable RLS
ALTER TABLE public.flow_feedback_variants ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (admin only table)
CREATE POLICY "Allow all for authenticated users" 
ON public.flow_feedback_variants 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_flow_feedback_variants_updated_at
BEFORE UPDATE ON public.flow_feedback_variants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add index for faster lookups
CREATE INDEX idx_flow_feedback_variants_flow_id ON public.flow_feedback_variants(flow_id);
CREATE INDEX idx_flow_feedback_variants_status ON public.flow_feedback_variants(status);