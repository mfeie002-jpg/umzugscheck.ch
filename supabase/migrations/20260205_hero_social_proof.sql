-- Migration: Hero Social Proof System
-- Purpose: Real-time session tracking and lead activity for homepage social proof
-- Author: System
-- Date: 2026-02-05

-- ========================================
-- 1) ACTIVE SESSIONS TABLE
-- ========================================
-- Tracks anonymous user sessions for "X Personen online" counter

CREATE TABLE IF NOT EXISTS public.active_sessions (
  session_id text PRIMARY KEY,
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for fast time-based queries
CREATE INDEX IF NOT EXISTS active_sessions_last_seen_idx
  ON public.active_sessions (last_seen DESC);

-- Auto-cleanup trigger: delete sessions older than 10 minutes
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS trigger AS $$
BEGIN
  DELETE FROM public.active_sessions
  WHERE last_seen < now() - interval '10 minutes';
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_cleanup_old_sessions
  AFTER INSERT OR UPDATE ON public.active_sessions
  EXECUTE FUNCTION cleanup_old_sessions();

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: anon can upsert their own session
CREATE POLICY "anon_upsert_active_sessions_insert"
  ON public.active_sessions
  FOR INSERT
  TO anon
  WITH CHECK (char_length(session_id) >= 10);

CREATE POLICY "anon_upsert_active_sessions_update"
  ON public.active_sessions
  FOR UPDATE
  TO anon
  USING (TRUE)
  WITH CHECK (char_length(session_id) >= 10);

-- No direct select for anon (aggregated data only via RPC)
