-- Enable realtime for flow_analysis_runs table to track progress
ALTER TABLE public.flow_analysis_runs REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.flow_analysis_runs;