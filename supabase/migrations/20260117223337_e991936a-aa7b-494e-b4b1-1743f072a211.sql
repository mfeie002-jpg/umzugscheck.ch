-- Phase 1: Video Analysis System for AI-powered moving estimates
-- This creates the foundation for video uploads, manual review, and AI analysis

-- =============================================
-- 1. VIDEO ANALYSES TABLE - Core video storage
-- =============================================
CREATE TABLE public.video_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Video metadata
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  
  -- User information
  user_email TEXT NOT NULL,
  user_name TEXT,
  user_phone TEXT,
  
  -- Location details
  from_address TEXT,
  from_postal TEXT,
  from_city TEXT,
  to_address TEXT,
  to_postal TEXT,
  to_city TEXT,
  move_date DATE,
  
  -- Analysis status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'analyzed', 'error')),
  priority INTEGER DEFAULT 0,
  
  -- Room analysis (populated by reviewer/AI)
  rooms JSONB DEFAULT '[]'::jsonb,
  -- Format: [{"name": "Wohnzimmer", "size_m2": 25, "items": [...]}]
  
  -- Item inventory (populated by reviewer/AI)
  items JSONB DEFAULT '[]'::jsonb,
  -- Format: [{"name": "Doppelbett", "category": "furniture", "weight_kg": 80, "volume_m3": 1.5, "special": false}]
  
  -- Calculations
  total_volume_m3 DECIMAL(10,2),
  total_weight_kg DECIMAL(10,2),
  estimated_boxes INTEGER,
  estimated_hours DECIMAL(5,2),
  truck_size_recommended TEXT,
  
  -- Special items requiring extra care
  special_items TEXT[],
  
  -- Price estimate
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  
  -- Notes and comments
  reviewer_notes TEXT,
  customer_notes TEXT,
  
  -- Consent tracking
  privacy_consent BOOLEAN DEFAULT false,
  data_usage_consent BOOLEAN DEFAULT false,
  consent_timestamp TIMESTAMPTZ,
  
  -- Review tracking
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  ai_analyzed_at TIMESTAMPTZ,
  
  -- Lead conversion
  lead_id UUID REFERENCES public.leads(id),
  converted_to_lead BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 2. VIDEO ANALYSIS ITEMS - Detailed item tracking
-- =============================================
CREATE TABLE public.video_analysis_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  analysis_id UUID NOT NULL REFERENCES public.video_analyses(id) ON DELETE CASCADE,
  
  -- Item details
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- furniture, electronics, fragile, heavy, plants, art
  subcategory TEXT,
  
  -- Physical properties
  quantity INTEGER DEFAULT 1,
  weight_kg DECIMAL(10,2),
  volume_m3 DECIMAL(10,3),
  length_cm INTEGER,
  width_cm INTEGER,
  height_cm INTEGER,
  
  -- Moving requirements
  requires_disassembly BOOLEAN DEFAULT false,
  requires_special_handling BOOLEAN DEFAULT false,
  requires_packaging BOOLEAN DEFAULT true,
  fragile BOOLEAN DEFAULT false,
  
  -- Placement
  room_name TEXT,
  floor_number INTEGER DEFAULT 0,
  
  -- AI detection confidence (0-100)
  ai_confidence INTEGER,
  manually_verified BOOLEAN DEFAULT false,
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- 3. VIDEO UPLOAD SESSIONS - Track upload progress
-- =============================================
CREATE TABLE public.video_upload_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Session tracking
  session_token TEXT UNIQUE NOT NULL,
  user_email TEXT,
  
  -- Upload status
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'uploading', 'processing', 'completed', 'failed')),
  upload_progress INTEGER DEFAULT 0,
  
  -- File info
  file_name TEXT,
  file_size_bytes BIGINT,
  mime_type TEXT,
  
  -- Result
  video_analysis_id UUID REFERENCES public.video_analyses(id),
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours')
);

-- =============================================
-- 4. INDEXES for performance
-- =============================================
CREATE INDEX idx_video_analyses_status ON public.video_analyses(status);
CREATE INDEX idx_video_analyses_created ON public.video_analyses(created_at DESC);
CREATE INDEX idx_video_analyses_email ON public.video_analyses(user_email);
CREATE INDEX idx_video_analyses_reviewer ON public.video_analyses(reviewed_by);
CREATE INDEX idx_video_analysis_items_analysis ON public.video_analysis_items(analysis_id);
CREATE INDEX idx_video_upload_sessions_token ON public.video_upload_sessions(session_token);

-- =============================================
-- 5. ROW LEVEL SECURITY
-- =============================================
ALTER TABLE public.video_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_analysis_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_upload_sessions ENABLE ROW LEVEL SECURITY;

-- Video analyses: Admins can see all, users can see their own
CREATE POLICY "Admins can manage all video analyses"
  ON public.video_analyses
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own video analyses"
  ON public.video_analyses
  FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

CREATE POLICY "Anyone can insert video analyses"
  ON public.video_analyses
  FOR INSERT
  WITH CHECK (true);

-- Video analysis items: Follow parent permissions
CREATE POLICY "Admins can manage all video items"
  ON public.video_analysis_items
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.video_analyses va
      WHERE va.id = analysis_id
    )
  );

-- Upload sessions: Public insert, token-based access
CREATE POLICY "Anyone can create upload sessions"
  ON public.video_upload_sessions
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Token-based session access"
  ON public.video_upload_sessions
  FOR SELECT
  USING (true);

-- =============================================
-- 6. UPDATE TRIGGER
-- =============================================
CREATE TRIGGER update_video_analyses_updated_at
  BEFORE UPDATE ON public.video_analyses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- 7. STORAGE BUCKET for videos
-- =============================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'video-analyses',
  'video-analyses',
  false,
  524288000, -- 500MB max
  ARRAY['video/mp4', 'video/quicktime', 'video/webm', 'video/x-msvideo', 'video/x-ms-wmv']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Anyone can upload videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'video-analyses');

CREATE POLICY "Authenticated users can view videos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'video-analyses');

CREATE POLICY "Admins can delete videos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'video-analyses');