import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseSessionTimeoutOptions {
  timeoutMs?: number;
  warningMs?: number;
  onWarning?: () => void;
  onTimeout?: () => void;
}

/**
 * Hook to manage session timeout for security.
 * Automatically logs out users after inactivity.
 */
export const useSessionTimeout = ({
  timeoutMs = 30 * 60 * 1000, // 30 minutes
  warningMs = 5 * 60 * 1000, // 5 minutes before timeout
  onWarning,
  onTimeout
}: UseSessionTimeoutOptions = {}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
  }, []);

  const handleTimeout = useCallback(async () => {
    clearTimers();
    onTimeout?.();
    
    // Sign out the user
    await supabase.auth.signOut();
  }, [clearTimers, onTimeout]);

  const handleWarning = useCallback(() => {
    onWarning?.();
  }, [onWarning]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    clearTimers();

    // Set warning timer
    warningRef.current = setTimeout(handleWarning, timeoutMs - warningMs);

    // Set timeout timer
    timeoutRef.current = setTimeout(handleTimeout, timeoutMs);
  }, [clearTimers, handleWarning, handleTimeout, timeoutMs, warningMs]);

  const extendSession = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  useEffect(() => {
    // Only activate for authenticated users
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        resetTimer();
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        resetTimer();
      } else {
        clearTimers();
      }
    });

    // Reset timer on user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => {
      const now = Date.now();
      // Throttle activity detection to avoid excessive resets
      if (now - lastActivityRef.current > 60000) { // 1 minute throttle
        resetTimer();
      }
    };

    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      clearTimers();
      subscription.unsubscribe();
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [resetTimer, clearTimers]);

  return { extendSession, resetTimer };
};
