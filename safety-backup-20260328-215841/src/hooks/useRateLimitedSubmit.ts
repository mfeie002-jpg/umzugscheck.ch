import { useState, useCallback, useRef } from 'react';

interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  cooldownMs: number;
}

interface RateLimitState {
  isBlocked: boolean;
  remainingAttempts: number;
  cooldownEndsAt: number | null;
  timeUntilReset: number | null;
}

const defaultConfig: RateLimitConfig = {
  maxAttempts: 3,
  windowMs: 60000, // 1 minute
  cooldownMs: 30000, // 30 seconds cooldown after exceeding limit
};

export function useRateLimitedSubmit(config: Partial<RateLimitConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config };
  const attemptsRef = useRef<number[]>([]);
  const cooldownRef = useRef<number | null>(null);
  
  const [state, setState] = useState<RateLimitState>({
    isBlocked: false,
    remainingAttempts: finalConfig.maxAttempts,
    cooldownEndsAt: null,
    timeUntilReset: null,
  });

  const updateState = useCallback(() => {
    const now = Date.now();
    
    // Check if in cooldown
    if (cooldownRef.current && now < cooldownRef.current) {
      setState({
        isBlocked: true,
        remainingAttempts: 0,
        cooldownEndsAt: cooldownRef.current,
        timeUntilReset: Math.ceil((cooldownRef.current - now) / 1000),
      });
      return false;
    }
    
    // Clear cooldown if expired
    if (cooldownRef.current && now >= cooldownRef.current) {
      cooldownRef.current = null;
      attemptsRef.current = [];
    }
    
    // Clean up old attempts outside the window
    attemptsRef.current = attemptsRef.current.filter(
      (timestamp) => now - timestamp < finalConfig.windowMs
    );
    
    const remaining = finalConfig.maxAttempts - attemptsRef.current.length;
    
    setState({
      isBlocked: remaining <= 0,
      remainingAttempts: Math.max(0, remaining),
      cooldownEndsAt: null,
      timeUntilReset: attemptsRef.current.length > 0 
        ? Math.ceil((attemptsRef.current[0] + finalConfig.windowMs - now) / 1000)
        : null,
    });
    
    return remaining > 0;
  }, [finalConfig.maxAttempts, finalConfig.windowMs]);

  const recordAttempt = useCallback(() => {
    const now = Date.now();
    
    // Check cooldown first
    if (cooldownRef.current && now < cooldownRef.current) {
      updateState();
      return false;
    }
    
    // Clean up old attempts
    attemptsRef.current = attemptsRef.current.filter(
      (timestamp) => now - timestamp < finalConfig.windowMs
    );
    
    // Check if we have attempts remaining
    if (attemptsRef.current.length >= finalConfig.maxAttempts) {
      // Start cooldown
      cooldownRef.current = now + finalConfig.cooldownMs;
      updateState();
      return false;
    }
    
    // Record this attempt
    attemptsRef.current.push(now);
    updateState();
    return true;
  }, [finalConfig.maxAttempts, finalConfig.windowMs, finalConfig.cooldownMs, updateState]);

  const canSubmit = useCallback(() => {
    return updateState();
  }, [updateState]);

  const reset = useCallback(() => {
    attemptsRef.current = [];
    cooldownRef.current = null;
    setState({
      isBlocked: false,
      remainingAttempts: finalConfig.maxAttempts,
      cooldownEndsAt: null,
      timeUntilReset: null,
    });
  }, [finalConfig.maxAttempts]);

  return {
    state,
    recordAttempt,
    canSubmit,
    reset,
  };
}
