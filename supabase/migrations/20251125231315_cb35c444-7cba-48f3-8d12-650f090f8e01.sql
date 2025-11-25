-- Security fix: Make review-photos storage bucket private
UPDATE storage.buckets 
SET public = false 
WHERE id = 'review-photos';

-- Security fix: Remove overly permissive RLS policy on lead_quality_factors
DROP POLICY IF EXISTS "Anyone can view lead quality factors" ON lead_quality_factors;

-- Ensure we still have the proper restricted policy
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'lead_quality_factors' 
    AND policyname = 'Authorized view lead quality'
  ) THEN
    CREATE POLICY "Authorized view lead quality"
    ON lead_quality_factors FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_roles.user_id = auth.uid()
        AND user_roles.role = 'admin'
      )
      OR
      EXISTS (
        SELECT 1 FROM leads
        WHERE leads.id = lead_quality_factors.lead_id
        AND auth.uid()::text = ANY(
          SELECT unnest(assigned_provider_ids)
        )
      )
    );
  END IF;
END $$;

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Authenticated users can upload review photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view review photos they uploaded" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all review photos" ON storage.objects;
DROP POLICY IF EXISTS "Public can view approved review photos" ON storage.objects;

-- Add storage policies for review photos with proper access control
CREATE POLICY "Authenticated users can upload review photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'review-photos');

CREATE POLICY "Users can view review photos they uploaded"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'review-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all review photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'review-photos' 
  AND EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_roles.user_id = auth.uid()
    AND user_roles.role = 'admin'
  )
);

CREATE POLICY "Public can view approved review photos"
ON storage.objects FOR SELECT
TO anon
USING (
  bucket_id = 'review-photos'
  AND EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.photos @> ARRAY[storage.objects.name]
  )
);