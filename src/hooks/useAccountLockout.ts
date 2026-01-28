import { useState, useCallback } from 'react';

interface LockoutState {
  attempts: number;
  lockedUntil: number | null;
  lastAttempt: number;
}

interface UseAccountLockoutOptions {
  maxAttempts?: number;
  lockoutDuration?: number; // in milliseconds
  attemptWindow?: number; // in milliseconds
}

const STORAGE_KEY = 'auth_lockout_state';

function getStoredState(): LockoutState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore parse errors
  }
  return { attempts: 0, lockedUntil: null, lastAttempt: 0 };
}

function storeState(state: LockoutState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function useAccountLockout(options: UseAccountLockoutOptions = {}) {
  const {
    maxAttempts = 5,
    lockoutDuration = 15 * 60 * 1000, // 15 minutes
    attemptWindow = 5 * 60 * 1000, // 5 minutes
  } = options;

  const [state, setState] = useState<LockoutState>(getStoredState);

  const isLocked = useCallback(() => {
    const now = Date.now();
    
    // Check if locked
    if (state.lockedUntil && now < state.lockedUntil) {
      return true;
    }
    
    // If lockout expired, reset
    if (state.lockedUntil && now >= state.lockedUntil) {
      const newState = { attempts: 0, lockedUntil: null, lastAttempt: 0 };
      setState(newState);
      storeState(newState);
    }
    
    return false;
  }, [state]);

  const getRemainingLockoutTime = useCallback(() => {
    if (!state.lockedUntil) return 0;
    const remaining = state.lockedUntil - Date.now();
    return remaining > 0 ? remaining : 0;
  }, [state]);

  const getRemainingAttempts = useCallback(() => {
    if (isLocked()) return 0;
    return Math.max(0, maxAttempts - state.attempts);
  }, [state, maxAttempts, isLocked]);

  const recordFailedAttempt = useCallback(() => {
    const now = Date.now();
    
    // Reset attempts if outside window
    let newAttempts = state.attempts;
    if (now - state.lastAttempt > attemptWindow) {
      newAttempts = 0;
    }
    
    newAttempts += 1;
    
    // Check if should lock
    const shouldLock = newAttempts >= maxAttempts;
    
    const newState: LockoutState = {
      attempts: newAttempts,
      lockedUntil: shouldLock ? now + lockoutDuration : null,
      lastAttempt: now,
    };
    
    setState(newState);
    storeState(newState);
    
    return {
      locked: shouldLock,
      remainingAttempts: Math.max(0, maxAttempts - newAttempts),
      lockoutDuration: shouldLock ? lockoutDuration : 0,
    };
  }, [state, maxAttempts, lockoutDuration, attemptWindow]);

  const recordSuccessfulAttempt = useCallback(() => {
    const newState: LockoutState = { attempts: 0, lockedUntil: null, lastAttempt: 0 };
    setState(newState);
    storeState(newState);
  }, []);

  const resetLockout = useCallback(() => {
    const newState: LockoutState = { attempts: 0, lockedUntil: null, lastAttempt: 0 };
    setState(newState);
    storeState(newState);
  }, []);

  const formatRemainingTime = useCallback((ms: number) => {
    const minutes = Math.ceil(ms / 60000);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours} Stunde${hours > 1 ? 'n' : ''} ${mins > 0 ? `und ${mins} Minute${mins > 1 ? 'n' : ''}` : ''}`;
    }
    return `${minutes} Minute${minutes > 1 ? 'n' : ''}`;
  }, []);

  return {
    isLocked,
    getRemainingLockoutTime,
    getRemainingAttempts,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    resetLockout,
    formatRemainingTime,
    attempts: state.attempts,
    maxAttempts,
  };
}
