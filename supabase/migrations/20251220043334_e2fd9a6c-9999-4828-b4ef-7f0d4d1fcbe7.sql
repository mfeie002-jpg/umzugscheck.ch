-- Screenshot baselines and history for regression testing
CREATE TABLE public.screenshot_baselines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  dimension TEXT NOT NULL DEFAULT '1920x1080',
  image_base64 TEXT NOT NULL,
  threshold_percent NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Screenshot regression test results
CREATE TABLE public.screenshot_regression_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  baseline_id UUID NOT NULL REFERENCES public.screenshot_baselines(id) ON DELETE CASCADE,
  diff_percent NUMERIC(5,2) NOT NULL,
  new_image_base64 TEXT NOT NULL,
  diff_image_base64 TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'acknowledged')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Screenshot history for persistent storage
CREATE TABLE public.screenshot_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  url TEXT NOT NULL,
  dimension TEXT NOT NULL,
  image_base64 TEXT NOT NULL,
  is_full_page BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alert settings for regression tests
CREATE TABLE public.screenshot_alert_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  threshold_percent NUMERIC(5,2) NOT NULL DEFAULT 5.00,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_screenshot_baselines_url ON public.screenshot_baselines(url);
CREATE INDEX idx_screenshot_baselines_active ON public.screenshot_baselines(is_active);
CREATE INDEX idx_screenshot_regression_results_baseline ON public.screenshot_regression_results(baseline_id);
CREATE INDEX idx_screenshot_regression_results_status ON public.screenshot_regression_results(status);
CREATE INDEX idx_screenshot_history_url ON public.screenshot_history(url);
CREATE INDEX idx_screenshot_history_created ON public.screenshot_history(created_at DESC);

-- Enable RLS
ALTER TABLE public.screenshot_baselines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshot_regression_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshot_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screenshot_alert_settings ENABLE ROW LEVEL SECURITY;

-- Public read/write for admin usage (no auth required for internal tool)
CREATE POLICY "Allow all operations on screenshot_baselines" ON public.screenshot_baselines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on screenshot_regression_results" ON public.screenshot_regression_results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on screenshot_history" ON public.screenshot_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on screenshot_alert_settings" ON public.screenshot_alert_settings FOR ALL USING (true) WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_screenshot_baselines_updated_at
BEFORE UPDATE ON public.screenshot_baselines
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_screenshot_alert_settings_updated_at
BEFORE UPDATE ON public.screenshot_alert_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();