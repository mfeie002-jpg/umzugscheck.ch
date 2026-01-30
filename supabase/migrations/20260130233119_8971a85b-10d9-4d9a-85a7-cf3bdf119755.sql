-- Review Sentiments Table (AI-analyzed review data)
CREATE TABLE public.review_sentiments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES public.service_providers(id) ON DELETE SET NULL,
  
  -- Sentiment Scores (-1.0 to +1.0)
  overall_sentiment NUMERIC CHECK (overall_sentiment >= -1 AND overall_sentiment <= 1),
  
  -- Category Scores (0-10)
  punctuality_score NUMERIC CHECK (punctuality_score >= 0 AND punctuality_score <= 10),
  professionalism_score NUMERIC CHECK (professionalism_score >= 0 AND professionalism_score <= 10),
  value_for_money_score NUMERIC CHECK (value_for_money_score >= 0 AND value_for_money_score <= 10),
  communication_score NUMERIC CHECK (communication_score >= 0 AND communication_score <= 10),
  care_with_items_score NUMERIC CHECK (care_with_items_score >= 0 AND care_with_items_score <= 10),
  
  -- Extracted Keywords
  positive_keywords TEXT[],
  negative_keywords TEXT[],
  
  -- Analysis Meta
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  model_version TEXT DEFAULT 'gemini-3-flash-preview',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Provider Sentiment Summary (Aggregated scores)
CREATE TABLE public.provider_sentiment_summary (
  provider_id UUID PRIMARY KEY REFERENCES public.service_providers(id) ON DELETE CASCADE,
  total_reviews_analyzed INTEGER DEFAULT 0,
  avg_sentiment NUMERIC,
  
  -- Category Averages (0-10)
  punctuality_avg NUMERIC,
  professionalism_avg NUMERIC,
  value_avg NUMERIC,
  communication_avg NUMERIC,
  care_avg NUMERIC,
  
  -- Top Keywords (JSONB for flexibility)
  top_positive_keywords JSONB DEFAULT '[]',
  top_negative_keywords JSONB DEFAULT '[]',
  
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.review_sentiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_sentiment_summary ENABLE ROW LEVEL SECURITY;

-- Review Sentiments: Public read (for transparency)
CREATE POLICY "Anyone can view review sentiments"
ON public.review_sentiments
FOR SELECT
USING (true);

-- Review Sentiments: Only service role can insert/update
CREATE POLICY "Service role can manage review sentiments"
ON public.review_sentiments
FOR ALL
USING (auth.role() = 'service_role');

-- Provider Sentiment Summary: Public read
CREATE POLICY "Anyone can view provider sentiment summaries"
ON public.provider_sentiment_summary
FOR SELECT
USING (true);

-- Provider Sentiment Summary: Only service role can modify
CREATE POLICY "Service role can manage provider summaries"
ON public.provider_sentiment_summary
FOR ALL
USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX idx_review_sentiments_provider_id ON public.review_sentiments(provider_id);
CREATE INDEX idx_review_sentiments_review_id ON public.review_sentiments(review_id);
CREATE INDEX idx_review_sentiments_analyzed_at ON public.review_sentiments(analyzed_at);

-- Function to update provider summary after new sentiment analysis
CREATE OR REPLACE FUNCTION public.update_provider_sentiment_summary()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO provider_sentiment_summary (
    provider_id,
    total_reviews_analyzed,
    avg_sentiment,
    punctuality_avg,
    professionalism_avg,
    value_avg,
    communication_avg,
    care_avg,
    last_updated
  )
  SELECT
    NEW.provider_id,
    COUNT(*),
    AVG(overall_sentiment),
    AVG(punctuality_score),
    AVG(professionalism_score),
    AVG(value_for_money_score),
    AVG(communication_score),
    AVG(care_with_items_score),
    now()
  FROM review_sentiments
  WHERE provider_id = NEW.provider_id
  GROUP BY provider_id
  ON CONFLICT (provider_id) DO UPDATE SET
    total_reviews_analyzed = EXCLUDED.total_reviews_analyzed,
    avg_sentiment = EXCLUDED.avg_sentiment,
    punctuality_avg = EXCLUDED.punctuality_avg,
    professionalism_avg = EXCLUDED.professionalism_avg,
    value_avg = EXCLUDED.value_avg,
    communication_avg = EXCLUDED.communication_avg,
    care_avg = EXCLUDED.care_avg,
    last_updated = now();
  
  RETURN NEW;
END;
$$;

-- Trigger to auto-update summary
CREATE TRIGGER update_sentiment_summary_on_insert
AFTER INSERT ON public.review_sentiments
FOR EACH ROW
EXECUTE FUNCTION public.update_provider_sentiment_summary();