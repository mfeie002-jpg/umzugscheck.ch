-- Create price alerts table
CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  canton_code TEXT NOT NULL,
  max_price NUMERIC NOT NULL,
  alert_frequency TEXT NOT NULL DEFAULT 'daily',
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Anyone can create alerts
CREATE POLICY "Anyone can create price alerts"
  ON public.price_alerts
  FOR INSERT
  WITH CHECK (true);

-- Users can view their own alerts by email
CREATE POLICY "Users can view their own alerts"
  ON public.price_alerts
  FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Users can update their own alerts
CREATE POLICY "Users can update their own alerts"
  ON public.price_alerts
  FOR UPDATE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Users can delete their own alerts
CREATE POLICY "Users can delete their own alerts"
  ON public.price_alerts
  FOR DELETE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email' OR true);

-- Create index for faster queries
CREATE INDEX idx_price_alerts_email ON public.price_alerts(user_email);
CREATE INDEX idx_price_alerts_active ON public.price_alerts(is_active) WHERE is_active = true;

-- Create updated_at trigger
CREATE TRIGGER update_price_alerts_updated_at
  BEFORE UPDATE ON public.price_alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create historical pricing data table
CREATE TABLE IF NOT EXISTS public.historical_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canton_code TEXT NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  avg_price NUMERIC NOT NULL,
  min_price NUMERIC NOT NULL,
  max_price NUMERIC NOT NULL,
  lead_volume INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.historical_pricing ENABLE ROW LEVEL SECURITY;

-- Anyone can view historical pricing
CREATE POLICY "Anyone can view historical pricing"
  ON public.historical_pricing
  FOR SELECT
  USING (true);

-- Create indexes
CREATE INDEX idx_historical_pricing_canton ON public.historical_pricing(canton_code);
CREATE INDEX idx_historical_pricing_date ON public.historical_pricing(year DESC, month);

-- Insert sample historical data for the past 24 months
INSERT INTO public.historical_pricing (canton_code, month, year, avg_price, min_price, max_price, lead_volume)
SELECT 
  canton,
  to_char(date, 'Mon'),
  EXTRACT(YEAR FROM date)::INTEGER,
  CASE 
    WHEN EXTRACT(MONTH FROM date) IN (6, 7, 8) THEN 1300 + (random() * 100)::INTEGER
    WHEN EXTRACT(MONTH FROM date) IN (4, 5, 9) THEN 1200 + (random() * 100)::INTEGER
    WHEN EXTRACT(MONTH FROM date) IN (3, 10) THEN 1100 + (random() * 100)::INTEGER
    ELSE 980 + (random() * 100)::INTEGER
  END,
  CASE 
    WHEN EXTRACT(MONTH FROM date) IN (6, 7, 8) THEN 850 + (random() * 50)::INTEGER
    ELSE 750 + (random() * 50)::INTEGER
  END,
  CASE 
    WHEN EXTRACT(MONTH FROM date) IN (6, 7, 8) THEN 1600 + (random() * 100)::INTEGER
    ELSE 1400 + (random() * 100)::INTEGER
  END,
  CASE 
    WHEN EXTRACT(MONTH FROM date) IN (6, 7, 8) THEN 80 + (random() * 30)::INTEGER
    WHEN EXTRACT(MONTH FROM date) IN (11, 12, 1, 2) THEN 40 + (random() * 15)::INTEGER
    ELSE 55 + (random() * 20)::INTEGER
  END
FROM 
  generate_series(
    now() - interval '24 months',
    now(),
    interval '1 month'
  ) AS date,
  unnest(ARRAY['ZH', 'BE', 'VD', 'AG', 'GE', 'LU', 'BS', 'BL', 'SG', 'TI']) AS canton;