-- Add AI-specific columns to video_analyses table
ALTER TABLE public.video_analyses 
ADD COLUMN IF NOT EXISTS ai_summary TEXT,
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS analyzed_at TIMESTAMP WITH TIME ZONE;

-- Add AI detection columns to video_analysis_items
ALTER TABLE public.video_analysis_items
ADD COLUMN IF NOT EXISTS ai_detected BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(3,2);