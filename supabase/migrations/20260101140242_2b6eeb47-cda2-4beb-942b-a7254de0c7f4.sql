-- Create table to persist flow feature scores with improvement tracking
CREATE TABLE public.flow_feature_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id TEXT NOT NULL,
  run_number INTEGER NOT NULL DEFAULT 1,
  
  -- Individual feature flags (28 features)
  has_astag BOOLEAN DEFAULT false,
  has_swiss_quality BOOLEAN DEFAULT false,
  has_rating_badge BOOLEAN DEFAULT false,
  has_free_label BOOLEAN DEFAULT true,
  has_trust_pills BOOLEAN DEFAULT false,
  has_sticky_cta BOOLEAN DEFAULT false,
  has_clear_cta_label BOOLEAN DEFAULT true,
  has_progress_indicator BOOLEAN DEFAULT false,
  has_micro_feedback BOOLEAN DEFAULT false,
  has_safe_area BOOLEAN DEFAULT false,
  has_touch_targets BOOLEAN DEFAULT true,
  has_responsive_layout BOOLEAN DEFAULT true,
  has_bottom_sheet BOOLEAN DEFAULT false,
  has_progress_bar BOOLEAN DEFAULT false,
  has_validation BOOLEAN DEFAULT true,
  has_animations BOOLEAN DEFAULT false,
  has_auto_advance BOOLEAN DEFAULT false,
  has_price_preview BOOLEAN DEFAULT false,
  has_meta_tags BOOLEAN DEFAULT true,
  has_structured_data BOOLEAN DEFAULT false,
  has_canonical_url BOOLEAN DEFAULT true,
  has_semantic_html BOOLEAN DEFAULT true,
  has_lazy_loading BOOLEAN DEFAULT true,
  has_image_optimization BOOLEAN DEFAULT false,
  has_code_splitting BOOLEAN DEFAULT true,
  has_aria_labels BOOLEAN DEFAULT false,
  has_keyboard_navigation BOOLEAN DEFAULT true,
  has_contrast_compliance BOOLEAN DEFAULT true,
  
  -- Calculated scores
  overall_score INTEGER NOT NULL DEFAULT 0,
  trust_score INTEGER NOT NULL DEFAULT 0,
  cta_score INTEGER NOT NULL DEFAULT 0,
  mobile_score INTEGER NOT NULL DEFAULT 0,
  ux_score INTEGER NOT NULL DEFAULT 0,
  seo_score INTEGER NOT NULL DEFAULT 0,
  performance_score INTEGER NOT NULL DEFAULT 0,
  accessibility_score INTEGER NOT NULL DEFAULT 0,
  conversion_score INTEGER NOT NULL DEFAULT 0,
  
  -- Tracking
  issues_count INTEGER NOT NULL DEFAULT 0,
  fixed_issues_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Unique constraint per flow per run
  UNIQUE(flow_id, run_number)
);

-- Create improvement history table
CREATE TABLE public.flow_improvement_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id TEXT NOT NULL,
  run_number INTEGER NOT NULL,
  previous_score INTEGER,
  current_score INTEGER NOT NULL,
  score_delta INTEGER NOT NULL DEFAULT 0,
  fixed_issues JSONB DEFAULT '[]'::jsonb,
  new_issues JSONB DEFAULT '[]'::jsonb,
  category_changes JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.flow_feature_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_improvement_history ENABLE ROW LEVEL SECURITY;

-- RLS policies - Allow authenticated users to manage
CREATE POLICY "Authenticated users can manage flow scores"
ON public.flow_feature_scores FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view flow scores"
ON public.flow_feature_scores FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can manage improvement history"
ON public.flow_improvement_history FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can view improvement history"
ON public.flow_improvement_history FOR SELECT
USING (true);

-- Function to calculate scores from features
CREATE OR REPLACE FUNCTION public.calculate_flow_scores()
RETURNS TRIGGER AS $$
BEGIN
  -- Trust Score (max 100)
  NEW.trust_score := 
    CASE WHEN NEW.has_astag THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_swiss_quality THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_rating_badge THEN 20 ELSE 0 END +
    CASE WHEN NEW.has_free_label THEN 15 ELSE 0 END +
    CASE WHEN NEW.has_trust_pills THEN 15 ELSE 0 END;
  
  -- CTA Score
  NEW.cta_score := 
    CASE WHEN NEW.has_sticky_cta THEN 35 ELSE 0 END +
    CASE WHEN NEW.has_clear_cta_label THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_progress_indicator THEN 20 ELSE 0 END +
    CASE WHEN NEW.has_micro_feedback THEN 20 ELSE 0 END;
  
  -- Mobile Score
  NEW.mobile_score := 
    CASE WHEN NEW.has_safe_area THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_touch_targets THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_responsive_layout THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_bottom_sheet THEN 25 ELSE 0 END;
  
  -- UX Score
  NEW.ux_score := 
    CASE WHEN NEW.has_progress_bar THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_validation THEN 25 ELSE 0 END +
    CASE WHEN NEW.has_animations THEN 20 ELSE 0 END +
    CASE WHEN NEW.has_auto_advance THEN 15 ELSE 0 END +
    CASE WHEN NEW.has_price_preview THEN 15 ELSE 0 END;
  
  -- SEO Score
  NEW.seo_score := 
    CASE WHEN NEW.has_meta_tags THEN 30 ELSE 0 END +
    CASE WHEN NEW.has_structured_data THEN 30 ELSE 0 END +
    CASE WHEN NEW.has_canonical_url THEN 20 ELSE 0 END +
    CASE WHEN NEW.has_semantic_html THEN 20 ELSE 0 END;
  
  -- Performance Score
  NEW.performance_score := 
    CASE WHEN NEW.has_lazy_loading THEN 35 ELSE 0 END +
    CASE WHEN NEW.has_image_optimization THEN 35 ELSE 0 END +
    CASE WHEN NEW.has_code_splitting THEN 30 ELSE 0 END;
  
  -- Accessibility Score
  NEW.accessibility_score := 
    CASE WHEN NEW.has_aria_labels THEN 40 ELSE 0 END +
    CASE WHEN NEW.has_keyboard_navigation THEN 35 ELSE 0 END +
    CASE WHEN NEW.has_contrast_compliance THEN 25 ELSE 0 END;
  
  -- Conversion Score (weighted average of trust, cta, mobile)
  NEW.conversion_score := ROUND((NEW.trust_score * 0.3 + NEW.cta_score * 0.4 + NEW.mobile_score * 0.3));
  
  -- Overall Score (weighted average of all categories)
  NEW.overall_score := ROUND(
    NEW.trust_score * 0.15 +
    NEW.cta_score * 0.20 +
    NEW.mobile_score * 0.15 +
    NEW.ux_score * 0.10 +
    NEW.conversion_score * 0.10 +
    NEW.seo_score * 0.10 +
    NEW.performance_score * 0.10 +
    NEW.accessibility_score * 0.10
  );
  
  -- Count issues (features that are false)
  NEW.issues_count := 28 - (
    CASE WHEN NEW.has_astag THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_swiss_quality THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_rating_badge THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_free_label THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_trust_pills THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_sticky_cta THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_clear_cta_label THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_progress_indicator THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_micro_feedback THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_safe_area THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_touch_targets THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_responsive_layout THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_bottom_sheet THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_progress_bar THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_validation THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_animations THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_auto_advance THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_price_preview THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_meta_tags THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_structured_data THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_canonical_url THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_semantic_html THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_lazy_loading THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_image_optimization THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_code_splitting THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_aria_labels THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_keyboard_navigation THEN 1 ELSE 0 END +
    CASE WHEN NEW.has_contrast_compliance THEN 1 ELSE 0 END
  );
  
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger
CREATE TRIGGER calculate_flow_scores_trigger
BEFORE INSERT OR UPDATE ON public.flow_feature_scores
FOR EACH ROW
EXECUTE FUNCTION public.calculate_flow_scores();

-- Add indexes for performance
CREATE INDEX idx_flow_feature_scores_flow_id ON public.flow_feature_scores(flow_id);
CREATE INDEX idx_flow_feature_scores_run_number ON public.flow_feature_scores(run_number DESC);
CREATE INDEX idx_flow_improvement_history_flow_id ON public.flow_improvement_history(flow_id);
CREATE INDEX idx_flow_improvement_history_created_at ON public.flow_improvement_history(created_at DESC);