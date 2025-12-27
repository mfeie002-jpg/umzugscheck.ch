-- Create export_jobs table for tracking background exports
CREATE TABLE public.export_jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_type TEXT NOT NULL DEFAULT 'all_flows',
  status TEXT NOT NULL DEFAULT 'pending', -- pending, running, completed, failed
  progress INTEGER DEFAULT 0,
  progress_message TEXT,
  include_sub_variants BOOLEAN DEFAULT true,
  config JSONB DEFAULT '{}',
  download_url TEXT,
  file_size_bytes BIGINT,
  error_message TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by TEXT
);

-- Enable RLS
ALTER TABLE public.export_jobs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read export jobs (admin feature)
CREATE POLICY "Anyone can view export jobs"
ON public.export_jobs FOR SELECT USING (true);

-- Allow anyone to insert export jobs
CREATE POLICY "Anyone can create export jobs"
ON public.export_jobs FOR INSERT WITH CHECK (true);

-- Allow anyone to update export jobs
CREATE POLICY "Anyone can update export jobs"
ON public.export_jobs FOR UPDATE USING (true);

-- Create storage bucket for exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('flow-exports', 'flow-exports', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for flow-exports bucket
CREATE POLICY "Anyone can view flow exports"
ON storage.objects FOR SELECT
USING (bucket_id = 'flow-exports');

CREATE POLICY "Service role can upload exports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'flow-exports');

CREATE POLICY "Service role can update exports"
ON storage.objects FOR UPDATE
USING (bucket_id = 'flow-exports');

CREATE POLICY "Service role can delete exports"
ON storage.objects FOR DELETE
USING (bucket_id = 'flow-exports');

-- Index for faster queries
CREATE INDEX idx_export_jobs_status ON public.export_jobs(status);
CREATE INDEX idx_export_jobs_created_at ON public.export_jobs(created_at DESC);