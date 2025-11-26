-- Enhanced Review System with Photo Upload
ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS photos TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS service_ratings JSONB DEFAULT '{}'::jsonb;

-- Provider Profile Enhancements
ALTER TABLE service_providers
ADD COLUMN IF NOT EXISTS profile_gallery TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS team_members JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS booking_calendar_url TEXT,
ADD COLUMN IF NOT EXISTS working_hours JSONB DEFAULT '{}'::jsonb;

-- Analytics Tracking Table
CREATE TABLE IF NOT EXISTS conversion_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  city TEXT NOT NULL,
  service TEXT NOT NULL,
  source_page TEXT,
  conversion_type TEXT NOT NULL, -- 'lead_created', 'quote_requested', 'company_contacted'
  lead_id UUID REFERENCES leads(id),
  company_id UUID REFERENCES service_providers(id),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_conversion_analytics_city ON conversion_analytics(city);
CREATE INDEX IF NOT EXISTS idx_conversion_analytics_service ON conversion_analytics(service);
CREATE INDEX IF NOT EXISTS idx_conversion_analytics_created_at ON conversion_analytics(created_at);

-- Email Automation Tables
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  name TEXT NOT NULL,
  campaign_type TEXT NOT NULL, -- 'welcome', 'reminder', 'follow_up', 'review_request'
  subject TEXT NOT NULL,
  body_template TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  trigger_delay_hours INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  sent_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS email_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  scheduled_for TIMESTAMPTZ NOT NULL,
  campaign_id UUID REFERENCES email_campaigns(id),
  recipient_email TEXT NOT NULL,
  recipient_name TEXT,
  lead_id UUID REFERENCES leads(id),
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_email_queue_scheduled ON email_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);

-- Provider Availability Calendar
CREATE TABLE IF NOT EXISTS provider_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES service_providers(id) NOT NULL,
  date DATE NOT NULL,
  slots_available INT DEFAULT 0,
  slots_booked INT DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(provider_id, date)
);

CREATE INDEX IF NOT EXISTS idx_provider_availability_date ON provider_availability(date);
CREATE INDEX IF NOT EXISTS idx_provider_availability_provider ON provider_availability(provider_id);

-- Review Photos Storage Reference
CREATE TABLE IF NOT EXISTS review_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  display_order INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_review_photos_review ON review_photos(review_id);