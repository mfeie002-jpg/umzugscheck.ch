-- Add conversion tracking columns to lead_transactions table
ALTER TABLE public.lead_transactions 
ADD COLUMN IF NOT EXISTS conversion_status text DEFAULT 'pending' CHECK (conversion_status IN ('pending', 'converted', 'lost', 'expired')),
ADD COLUMN IF NOT EXISTS conversion_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS actual_job_value numeric,
ADD COLUMN IF NOT EXISTS conversion_notes text,
ADD COLUMN IF NOT EXISTS lost_reason text,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Create index for faster conversion queries
CREATE INDEX IF NOT EXISTS idx_lead_transactions_conversion_status ON public.lead_transactions(conversion_status);
CREATE INDEX IF NOT EXISTS idx_lead_transactions_provider_conversion ON public.lead_transactions(provider_id, conversion_status);

-- Create function to update conversion tracking
CREATE OR REPLACE FUNCTION public.update_conversion_tracking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  
  -- If status changed to converted, set conversion_date if not already set
  IF NEW.conversion_status = 'converted' AND OLD.conversion_status != 'converted' AND NEW.conversion_date IS NULL THEN
    NEW.conversion_date = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for conversion tracking updates
DROP TRIGGER IF EXISTS update_conversion_tracking_trigger ON public.lead_transactions;
CREATE TRIGGER update_conversion_tracking_trigger
  BEFORE UPDATE ON public.lead_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_conversion_tracking();

-- Create view for conversion analytics
CREATE OR REPLACE VIEW public.provider_conversion_stats AS
SELECT 
  lt.provider_id,
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE lt.conversion_status = 'converted') as converted_leads,
  COUNT(*) FILTER (WHERE lt.conversion_status = 'lost') as lost_leads,
  COUNT(*) FILTER (WHERE lt.conversion_status = 'pending') as pending_leads,
  ROUND(
    COUNT(*) FILTER (WHERE lt.conversion_status = 'converted')::numeric / 
    NULLIF(COUNT(*) FILTER (WHERE lt.conversion_status IN ('converted', 'lost'))::numeric, 0) * 100, 
    2
  ) as conversion_rate,
  AVG(lt.actual_job_value) FILTER (WHERE lt.conversion_status = 'converted') as avg_job_value,
  AVG(EXTRACT(EPOCH FROM (lt.conversion_date - lt.purchased_at)) / 86400) FILTER (WHERE lt.conversion_status = 'converted') as avg_days_to_convert
FROM public.lead_transactions lt
GROUP BY lt.provider_id;

-- Create function to get conversion history for quality scoring
CREATE OR REPLACE FUNCTION public.get_provider_conversion_history(p_provider_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result jsonb;
BEGIN
  WITH conversion_data AS (
    SELECT 
      COUNT(*) as total_leads,
      COUNT(*) FILTER (WHERE conversion_status = 'converted') as converted_leads,
      
      -- By calculator type
      jsonb_object_agg(
        DISTINCT l.calculator_type,
        jsonb_build_object(
          'total', COUNT(*) FILTER (WHERE l.calculator_type = l.calculator_type),
          'converted', COUNT(*) FILTER (WHERE l.calculator_type = l.calculator_type AND lt.conversion_status = 'converted')
        )
      ) FILTER (WHERE l.calculator_type IS NOT NULL) as by_calculator_type,
      
      -- By canton
      jsonb_object_agg(
        DISTINCT SUBSTRING(l.from_postal FROM 1 FOR 1),
        jsonb_build_object(
          'total', COUNT(*) FILTER (WHERE SUBSTRING(l.from_postal FROM 1 FOR 1) = SUBSTRING(l.from_postal FROM 1 FOR 1)),
          'converted', COUNT(*) FILTER (WHERE SUBSTRING(l.from_postal FROM 1 FOR 1) = SUBSTRING(l.from_postal FROM 1 FOR 1) AND lt.conversion_status = 'converted')
        )
      ) FILTER (WHERE l.from_postal IS NOT NULL) as by_postal_prefix,
      
      AVG(EXTRACT(EPOCH FROM (lt.conversion_date - lt.purchased_at)) / 86400) FILTER (WHERE lt.conversion_status = 'converted') as avg_conversion_time_days
      
    FROM public.lead_transactions lt
    JOIN public.leads l ON lt.lead_id = l.id
    WHERE lt.provider_id = p_provider_id
      AND lt.conversion_status IN ('converted', 'lost')
  )
  SELECT jsonb_build_object(
    'total_leads', COALESCE(total_leads, 0),
    'converted_leads', COALESCE(converted_leads, 0),
    'avg_conversion_time_days', COALESCE(avg_conversion_time_days, 0),
    'by_calculator_type', COALESCE(by_calculator_type, '{}'::jsonb),
    'by_canton', COALESCE(by_postal_prefix, '{}'::jsonb)
  )
  INTO result
  FROM conversion_data;
  
  RETURN COALESCE(result, jsonb_build_object(
    'total_leads', 0,
    'converted_leads', 0,
    'avg_conversion_time_days', 0,
    'by_calculator_type', '{}'::jsonb,
    'by_canton', '{}'::jsonb
  ));
END;
$$;

COMMENT ON FUNCTION public.get_provider_conversion_history IS 'Returns conversion history data for a provider to feed into quality scoring algorithm';
