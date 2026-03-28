/**
 * Backend Health Check Hook
 * Periodically pings the backend to detect infrastructure issues
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type BackendStatus = 'online' | 'offline' | 'checking' | 'degraded';

interface BackendHealth {
  status: BackendStatus;
  lastChecked: Date | null;
  latencyMs: number | null;
  error: string | null;
  checkNow: () => Promise<void>;
}

const PING_INTERVAL_MS = 30000; // 30 seconds
const TIMEOUT_MS = 8000; // 8 seconds timeout
const DEGRADED_THRESHOLD_MS = 3000; // >3s = degraded

export function useBackendHealth(): BackendHealth {
  const [status, setStatus] = useState<BackendStatus>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setStatus('checking');
    const start = performance.now();

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), TIMEOUT_MS);
      });

      // Simple read-only query that should always work
      const queryPromise = supabase
        .from('flow_versions')
        .select('id')
        .limit(1);

      // Race between query and timeout
      const { error: queryError } = await Promise.race([queryPromise, timeoutPromise]);

      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setLastChecked(new Date());

      if (queryError) {
        // Query error but connection worked
        if (queryError.message?.includes('does not exist')) {
          // Table doesn't exist - still means backend is reachable
          setStatus('online');
          setError(null);
        } else {
          setStatus('degraded');
          setError(queryError.message);
        }
      } else if (elapsed > DEGRADED_THRESHOLD_MS) {
        // Slow but working
        setStatus('degraded');
        setError(`Langsame Antwort: ${elapsed}ms`);
      } else {
        setStatus('online');
        setError(null);
      }
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setLatencyMs(elapsed);
      setLastChecked(new Date());
      setStatus('offline');
      
      if (err instanceof Error) {
        if (err.message === 'Timeout') {
          setError('Verbindungs-Timeout');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Keine Verbindung zum Backend');
        } else {
          setError(err.message);
        }
      } else {
        setError('Unbekannter Fehler');
      }
    }
  }, []);

  // Initial check + periodic polling
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, PING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [checkHealth]);

  return {
    status,
    lastChecked,
    latencyMs,
    error,
    checkNow: checkHealth,
  };
}
