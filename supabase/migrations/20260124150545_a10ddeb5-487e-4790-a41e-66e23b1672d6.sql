-- Create table for webhook logging to debug Zapier issues
CREATE TABLE public.ai_task_webhook_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  payload JSONB,
  success BOOLEAN NOT NULL DEFAULT false,
  error_message TEXT,
  response_data JSONB,
  source_ip TEXT
);

-- Enable RLS but allow public access for edge function
ALTER TABLE public.ai_task_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Policy for edge function to insert logs (no auth required)
CREATE POLICY "Allow insert from edge functions" 
ON public.ai_task_webhook_logs 
FOR INSERT 
WITH CHECK (true);

-- Policy for admin to read logs
CREATE POLICY "Allow select for authenticated users" 
ON public.ai_task_webhook_logs 
FOR SELECT 
USING (true);

-- Add index for faster queries
CREATE INDEX idx_webhook_logs_created_at ON public.ai_task_webhook_logs(created_at DESC);
CREATE INDEX idx_webhook_logs_endpoint ON public.ai_task_webhook_logs(endpoint);