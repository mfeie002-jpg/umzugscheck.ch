
-- Create video_surveys table for persisting video analysis results
CREATE TABLE public.video_surveys (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  service_type text NOT NULL DEFAULT 'umzug',
  frames_count integer,
  analysis_json jsonb,
  confidence numeric(3,2),
  gclid text,
  gbraid text,
  wbraid text,
  fbclid text,
  landing_path text,
  city text,
  zip text,
  phone text,
  email text,
  status text NOT NULL DEFAULT 'completed',
  lead_id uuid
);

-- Enable Row Level Security
ALTER TABLE public.video_surveys ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form submissions)
CREATE POLICY "Allow anonymous inserts on video_surveys"
  ON public.video_surveys
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admins) to read and update
CREATE POLICY "Authenticated users can read video_surveys"
  ON public.video_surveys
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update video_surveys"
  ON public.video_surveys
  FOR UPDATE
  TO authenticated
  USING (true);
