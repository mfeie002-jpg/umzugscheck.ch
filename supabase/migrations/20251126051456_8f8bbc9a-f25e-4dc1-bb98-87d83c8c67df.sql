-- Fix security definer view by explicitly setting security invoker
DROP VIEW IF EXISTS provider_conversion_stats;

CREATE VIEW provider_conversion_stats
WITH (security_invoker = true)
AS
SELECT 
  provider_id,
  count(*) AS total_leads,
  count(*) FILTER (WHERE conversion_status = 'converted') AS converted_leads,
  count(*) FILTER (WHERE conversion_status = 'lost') AS lost_leads,
  count(*) FILTER (WHERE conversion_status = 'pending') AS pending_leads,
  round(count(*) FILTER (WHERE conversion_status = 'converted')::numeric / 
    NULLIF(count(*) FILTER (WHERE conversion_status IN ('converted', 'lost'))::numeric, 0) * 100, 2) AS conversion_rate,
  avg(actual_job_value) FILTER (WHERE conversion_status = 'converted') AS avg_job_value,
  avg(EXTRACT(epoch FROM conversion_date - purchased_at) / 86400) FILTER (WHERE conversion_status = 'converted') AS avg_days_to_convert
FROM lead_transactions
GROUP BY provider_id;