-- Create a function to notify the edge function when flow_versions changes
CREATE OR REPLACE FUNCTION public.notify_flow_version_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  payload jsonb;
BEGIN
  -- Build payload with flow_id
  payload := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'flow_id', COALESCE(NEW.flow_id, OLD.flow_id),
    'version_id', COALESCE(NEW.id, OLD.id),
    'timestamp', now()
  );
  
  -- Use pg_net to call the edge function asynchronously
  -- This requires the pg_net extension which is enabled by default in Supabase
  PERFORM net.http_post(
    url := current_setting('app.supabase_url', true) || '/functions/v1/trigger-flow-analysis',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.supabase_service_role_key', true)
    ),
    body := payload
  );
  
  RETURN COALESCE(NEW, OLD);
EXCEPTION
  WHEN OTHERS THEN
    -- Log but don't fail the transaction
    RAISE WARNING 'Failed to trigger flow analysis: %', SQLERRM;
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create the trigger on flow_versions table
DROP TRIGGER IF EXISTS trigger_flow_analysis_on_change ON public.flow_versions;

CREATE TRIGGER trigger_flow_analysis_on_change
AFTER INSERT OR UPDATE ON public.flow_versions
FOR EACH ROW
EXECUTE FUNCTION public.notify_flow_version_change();