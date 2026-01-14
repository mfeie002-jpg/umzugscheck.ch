-- Add AI feedback columns to landing_page_versions for ChatGPT/Gemini feedback tracking
ALTER TABLE public.landing_page_versions 
ADD COLUMN IF NOT EXISTS ai_feedback TEXT,
ADD COLUMN IF NOT EXISTS ai_feedback_source TEXT,
ADD COLUMN IF NOT EXISTS ai_feedback_date TIMESTAMP WITH TIME ZONE;

-- Add comment for clarity
COMMENT ON COLUMN public.landing_page_versions.ai_feedback IS 'AI feedback from ChatGPT, Gemini, Claude etc.';
COMMENT ON COLUMN public.landing_page_versions.ai_feedback_source IS 'Source of AI feedback: chatgpt, gemini, claude, etc.';
COMMENT ON COLUMN public.landing_page_versions.ai_feedback_date IS 'When the AI feedback was added';