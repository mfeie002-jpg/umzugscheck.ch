-- Create storage bucket for screenshots archive
INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots-archive', 'screenshots-archive', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Public read access for screenshots"
ON storage.objects FOR SELECT
USING (bucket_id = 'screenshots-archive');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload screenshots"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'screenshots-archive' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated users can delete screenshots"
ON storage.objects FOR DELETE
USING (bucket_id = 'screenshots-archive' AND auth.role() = 'authenticated');