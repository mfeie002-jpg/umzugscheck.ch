-- Landing Pages table (City/Canton pages)
CREATE TABLE public.landing_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_type TEXT NOT NULL DEFAULT 'city', -- 'city', 'canton', 'regional'
  slug TEXT NOT NULL UNIQUE, -- e.g., 'umzugsfirmen-zuerich'
  url_path TEXT NOT NULL, -- e.g., '/umzugsfirmen/zuerich'
  display_name TEXT NOT NULL, -- e.g., 'Umzugsfirmen Zürich'
  canton_code TEXT, -- e.g., 'ZH'
  city_name TEXT, -- e.g., 'Zürich'
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0, -- for sorting/importance
  tags TEXT[] DEFAULT '{}',
  custom_instructions TEXT, -- additional AI instructions for this page
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Landing Page Versions (screenshots, HTML snapshots)
CREATE TABLE public.landing_page_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  version_name TEXT, -- optional name like 'v1.2-mobile-optimized'
  desktop_screenshot_url TEXT,
  mobile_screenshot_url TEXT,
  html_snapshot TEXT, -- full HTML
  rendered_html TEXT, -- rendered DOM
  markdown_content TEXT, -- LLM-ready markdown
  meta_data JSONB DEFAULT '{}', -- title, description, h1, etc.
  seo_issues JSONB DEFAULT '[]', -- detected SEO issues
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT -- who created this version
);

-- Landing Page Analyses (AI reviews, scores)
CREATE TABLE public.landing_page_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  landing_page_id UUID NOT NULL REFERENCES public.landing_pages(id) ON DELETE CASCADE,
  version_id UUID REFERENCES public.landing_page_versions(id) ON DELETE SET NULL,
  run_type TEXT DEFAULT 'manual', -- 'manual', 'scheduled', 'auto'
  status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
  
  -- Scores
  overall_score INTEGER DEFAULT 0,
  seo_score INTEGER DEFAULT 0,
  mobile_score INTEGER DEFAULT 0,
  performance_score INTEGER DEFAULT 0,
  conversion_score INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 0,
  ux_score INTEGER DEFAULT 0,
  accessibility_score INTEGER DEFAULT 0,
  
  -- AI Analysis
  ai_summary TEXT,
  ai_recommendations JSONB DEFAULT '[]',
  strengths JSONB DEFAULT '[]',
  quick_wins JSONB DEFAULT '[]',
  issues JSONB DEFAULT '[]',
  
  -- ChatGPT Feedback (user can paste)
  chatgpt_feedback TEXT,
  chatgpt_feedback_date TIMESTAMP WITH TIME ZONE,
  
  -- Competitor comparison
  competitor_comparison JSONB DEFAULT '{}',
  
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Landing Page Comparison (side-by-side)
CREATE TABLE public.landing_page_comparisons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  version_a_id UUID NOT NULL REFERENCES public.landing_page_versions(id) ON DELETE CASCADE,
  version_b_id UUID NOT NULL REFERENCES public.landing_page_versions(id) ON DELETE CASCADE,
  comparison_type TEXT DEFAULT 'visual', -- 'visual', 'seo', 'performance'
  diff_data JSONB DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.landing_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_page_comparisons ENABLE ROW LEVEL SECURITY;

-- Public read policies (admin tool)
CREATE POLICY "Allow all operations on landing_pages" ON public.landing_pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on landing_page_versions" ON public.landing_page_versions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on landing_page_analyses" ON public.landing_page_analyses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on landing_page_comparisons" ON public.landing_page_comparisons FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_landing_pages_page_type ON public.landing_pages(page_type);
CREATE INDEX idx_landing_pages_canton ON public.landing_pages(canton_code);
CREATE INDEX idx_landing_page_versions_page_id ON public.landing_page_versions(landing_page_id);
CREATE INDEX idx_landing_page_analyses_page_id ON public.landing_page_analyses(landing_page_id);

-- Trigger for updated_at
CREATE TRIGGER update_landing_pages_updated_at
  BEFORE UPDATE ON public.landing_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default Swiss city/canton pages
INSERT INTO public.landing_pages (page_type, slug, url_path, display_name, canton_code, city_name, priority) VALUES
  ('canton', 'umzugsfirmen-zuerich', '/umzugsfirmen/zuerich', 'Umzugsfirmen Zürich', 'ZH', 'Zürich', 100),
  ('canton', 'umzugsfirmen-bern', '/umzugsfirmen/bern', 'Umzugsfirmen Bern', 'BE', 'Bern', 90),
  ('canton', 'umzugsfirmen-basel', '/umzugsfirmen/basel', 'Umzugsfirmen Basel', 'BS', 'Basel', 85),
  ('canton', 'umzugsfirmen-luzern', '/umzugsfirmen/luzern', 'Umzugsfirmen Luzern', 'LU', 'Luzern', 80),
  ('canton', 'umzugsfirmen-aargau', '/umzugsfirmen/aargau', 'Umzugsfirmen Aargau', 'AG', 'Aarau', 75),
  ('canton', 'umzugsfirmen-st-gallen', '/umzugsfirmen/st-gallen', 'Umzugsfirmen St. Gallen', 'SG', 'St. Gallen', 70),
  ('canton', 'umzugsfirmen-genf', '/umzugsfirmen/genf', 'Umzugsfirmen Genf', 'GE', 'Genf', 65),
  ('canton', 'umzugsfirmen-lausanne', '/umzugsfirmen/lausanne', 'Umzugsfirmen Lausanne', 'VD', 'Lausanne', 60),
  ('regional', 'beste-umzugsfirma', '/beste-umzugsfirma', 'Beste Umzugsfirma Schweiz', NULL, NULL, 95),
  ('regional', 'guenstige-umzugsfirma', '/guenstige-umzugsfirma', 'Günstige Umzugsfirma', NULL, NULL, 93);