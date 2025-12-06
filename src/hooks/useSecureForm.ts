import { useState, useCallback, useRef } from 'react';
import { rateLimiter, createHoneypot, sanitizeInput } from '@/lib/security';
import { toast } from 'sonner';

interface UseSecureFormOptions {
  formId: string;
  maxAttempts?: number;
  windowMs?: number;
  onRateLimited?: () => void;
}

interface SecureFormState {
  honeypot: { fieldName: string; value: string };
  isSubmitting: boolean;
  lastSubmitTime: number | null;
}

export const useSecureForm = ({
  formId,
  maxAttempts = 3,
  windowMs = 60 * 60 * 1000, // 1 hour
  onRateLimited
}: UseSecureFormOptions) => {
  const honeypotRef = useRef(createHoneypot());
  const [state, setState] = useState<SecureFormState>({
    honeypot: { fieldName: honeypotRef.current.fieldName, value: '' },
    isSubmitting: false,
    lastSubmitTime: null
  });

  const setHoneypotValue = useCallback((value: string) => {
    setState(prev => ({
      ...prev,
      honeypot: { ...prev.honeypot, value }
    }));
  }, []);

  const validateSubmission = useCallback((): { isValid: boolean; error?: string } => {
    // Check honeypot
    if (honeypotRef.current.isBot(state.honeypot.value)) {
      return { isValid: false, error: 'Bot detected' };
    }

    // Check rate limit
    if (!rateLimiter.isAllowed(formId, maxAttempts, windowMs)) {
      const remainingMs = rateLimiter.getRemainingTime(formId);
      const remainingMins = Math.ceil(remainingMs / 60000);
      onRateLimited?.();
      return { 
        isValid: false, 
        error: `Zu viele Anfragen. Bitte warten Sie ${remainingMins} Minuten.` 
      };
    }

    // Check minimum time between submissions (anti-automation)
    if (state.lastSubmitTime && Date.now() - state.lastSubmitTime < 2000) {
      return { isValid: false, error: 'Bitte warten Sie einen Moment.' };
    }

    return { isValid: true };
  }, [formId, maxAttempts, windowMs, state.honeypot.value, state.lastSubmitTime, onRateLimited]);

  const submitWithProtection = useCallback(async <T>(
    submitFn: () => Promise<T>
  ): Promise<T | null> => {
    const validation = validateSubmission();
    
    if (!validation.isValid) {
      if (validation.error && !validation.error.includes('Bot')) {
        toast.error(validation.error);
      }
      return null;
    }

    setState(prev => ({ ...prev, isSubmitting: true }));
    
    try {
      const result = await submitFn();
      setState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        lastSubmitTime: Date.now() 
      }));
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, isSubmitting: false }));
      throw error;
    }
  }, [validateSubmission]);

  const sanitize = useCallback((input: string) => sanitizeInput(input), []);

  return {
    honeypotFieldName: state.honeypot.fieldName,
    honeypotValue: state.honeypot.value,
    setHoneypotValue,
    isSubmitting: state.isSubmitting,
    validateSubmission,
    submitWithProtection,
    sanitize
  };
};
