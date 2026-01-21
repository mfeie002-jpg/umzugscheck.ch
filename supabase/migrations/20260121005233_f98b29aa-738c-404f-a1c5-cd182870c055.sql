-- Add provider_id column to reviews for service_providers relationship
ALTER TABLE public.reviews 
ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.service_providers(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON public.reviews(provider_id);