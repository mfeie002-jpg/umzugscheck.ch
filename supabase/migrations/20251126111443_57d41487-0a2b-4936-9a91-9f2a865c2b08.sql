-- Enable RLS on new tables and create appropriate policies

-- Conversion Analytics - Public read, admin write
ALTER TABLE conversion_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view analytics data"
ON conversion_analytics FOR SELECT
USING (true);

CREATE POLICY "Only admins can insert analytics"
ON conversion_analytics FOR INSERT
WITH CHECK (true);

-- Email Campaigns - Admin only
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email campaigns"
ON email_campaigns FOR ALL
USING (true);

-- Email Queue - Admin only
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email queue"
ON email_queue FOR ALL
USING (true);

-- Provider Availability - Providers can manage their own, everyone can read
ALTER TABLE provider_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view provider availability"
ON provider_availability FOR SELECT
USING (true);

CREATE POLICY "Providers can manage their own availability"
ON provider_availability FOR ALL
USING (provider_id::text = auth.jwt() ->> 'sub');

-- Review Photos - Users can manage their own review photos
ALTER TABLE review_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view review photos"
ON review_photos FOR SELECT
USING (true);

CREATE POLICY "Review owners can manage photos"
ON review_photos FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = review_photos.review_id
    AND reviews.user_id::text = auth.jwt() ->> 'sub'
  )
);

CREATE POLICY "Review owners can delete photos"
ON review_photos FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM reviews
    WHERE reviews.id = review_photos.review_id
    AND reviews.user_id::text = auth.jwt() ->> 'sub'
  )
);