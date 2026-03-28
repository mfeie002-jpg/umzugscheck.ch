ALTER TABLE public.ai_task_queue DROP CONSTRAINT ai_task_queue_agent_check;
ALTER TABLE public.ai_task_queue ADD CONSTRAINT ai_task_queue_agent_check CHECK (agent IN ('codex', 'copilot', 'openclaw'));