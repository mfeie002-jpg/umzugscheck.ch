-- Create storage bucket for flow screenshots if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('flow-screenshots', 'flow-screenshots', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public read access
CREATE POLICY "Flow screenshots are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'flow-screenshots');

-- Create policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload flow screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'flow-screenshots' AND auth.role() = 'authenticated');

-- Create policy for service role to upload (edge functions)
CREATE POLICY "Service role can manage flow screenshots"
ON storage.objects
FOR ALL
USING (bucket_id = 'flow-screenshots');