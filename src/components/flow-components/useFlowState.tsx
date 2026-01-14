/**
 * useFlowState Hook - State Management for Flows
 * 
 * Features:
 * ✅ SessionStorage persistence (survives refresh)
 * ✅ Back/forward without data loss
 * ✅ Analytics event tracking
 * ✅ Error state handling
 * ✅ Forced Render Mode support (for screenshot automation)
 */

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { getForcedRenderMode } from '@/hooks/use-forced-render-mode';

export interface FlowState<T> {
  currentStep: number;
  formData: T;
  isSubmitting: boolean;
  submitError: string | null;
  isComplete: boolean;
}

export interface FlowActions<T> {
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  updateField: <K extends keyof T>(field: K, value: T[K]) => void;
  updateFields: (updates: Partial<T>) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  setComplete: () => void;
  reset: () => void;
}

interface UseFlowStateOptions<T> {
  /** Unique key for sessionStorage */
  storageKey: string;
  /** Initial form data */
  initialData: T;
  /** Total number of steps */
  totalSteps: number;
  /** Track analytics events */
  trackEvents?: boolean;
}

// Analytics tracking helper
const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
  // Console log for development
  console.log(`[Flow Analytics] ${eventName}`, data);
  
  // Future: Send to analytics service
  // window.gtag?.('event', eventName, data);
};

export function useFlowState<T extends Record<string, unknown>>({
  storageKey,
  initialData,
  totalSteps,
  trackEvents = true,
}: UseFlowStateOptions<T>): [FlowState<T>, FlowActions<T>] {
  // Check for forced render mode (screenshot automation)
  // This is evaluated once on mount and cached
  const forcedRenderRef = useRef<ReturnType<typeof getForcedRenderMode> | null>(null);
  if (forcedRenderRef.current === null && typeof window !== 'undefined') {
    forcedRenderRef.current = getForcedRenderMode(window.location.search);
  }
  const forcedRender = forcedRenderRef.current;
  const isForcedRender = forcedRender?.isForcedRender ?? false;
  
  // Initialize state from sessionStorage or defaults
  // In FORCED RENDER MODE: NEVER restore from storage, use forced step
  const [state, setState] = useState<FlowState<T>>(() => {
    if (typeof window === 'undefined') {
      return {
        currentStep: 1,
        formData: initialData,
        isSubmitting: false,
        submitError: null,
        isComplete: false,
      };
    }

    // FORCED RENDER MODE: Skip storage restore, use forced step
    if (isForcedRender) {
      const forcedStep = forcedRender?.forcedStepIndex !== null
        ? Math.min(Math.max(1, (forcedRender.forcedStepIndex ?? 0) + 1), totalSteps)
        : 1;
      
      return {
        currentStep: forcedStep,
        formData: initialData,
        isSubmitting: false,
        submitError: null,
        isComplete: false,
      };
    }

    // Normal mode: Try to restore from sessionStorage
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...parsed,
          isSubmitting: false, // Reset on reload
          submitError: null,
        };
      }
    } catch (e) {
      console.warn('Failed to restore flow state:', e);
    }

    return {
      currentStep: 1,
      formData: initialData,
      isSubmitting: false,
      submitError: null,
      isComplete: false,
    };
  });

  // Persist to sessionStorage on changes
  // SKIP in forced render mode to prevent captures from affecting each other
  useEffect(() => {
    if (isForcedRender) return; // Don't persist in forced mode
    
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        currentStep: state.currentStep,
        formData: state.formData,
        isComplete: state.isComplete,
      }));
    } catch (e) {
      console.warn('Failed to persist flow state:', e);
    }
  }, [storageKey, state.currentStep, state.formData, state.isComplete, isForcedRender]);

  // Track step views
  // SKIP analytics in forced render mode
  useEffect(() => {
    if (isForcedRender) return; // No tracking in forced mode
    
    if (trackEvents) {
      trackEvent('step_view', { 
        step: state.currentStep, 
        totalSteps,
        flowId: storageKey 
      });
    }
  }, [state.currentStep, totalSteps, storageKey, trackEvents, isForcedRender]);

  // Actions
  const actions = useMemo<FlowActions<T>>(() => ({
    nextStep: () => {
      setState(prev => {
        const newStep = Math.min(prev.currentStep + 1, totalSteps);
        if (trackEvents && newStep !== prev.currentStep) {
          trackEvent('step_complete', { 
            step: prev.currentStep, 
            flowId: storageKey 
          });
        }
        return { ...prev, currentStep: newStep };
      });
    },

    prevStep: () => {
      setState(prev => ({
        ...prev,
        currentStep: Math.max(prev.currentStep - 1, 1),
      }));
    },

    goToStep: (step: number) => {
      setState(prev => ({
        ...prev,
        currentStep: Math.max(1, Math.min(step, totalSteps)),
      }));
    },

    updateField: <K extends keyof T>(field: K, value: T[K]) => {
      setState(prev => ({
        ...prev,
        formData: { ...prev.formData, [field]: value },
      }));
    },

    updateFields: (updates: Partial<T>) => {
      setState(prev => ({
        ...prev,
        formData: { ...prev.formData, ...updates },
      }));
    },

    setSubmitting: (isSubmitting: boolean) => {
      setState(prev => ({ ...prev, isSubmitting }));
    },

    setError: (submitError: string | null) => {
      setState(prev => ({ ...prev, submitError }));
      if (submitError && trackEvents) {
        trackEvent('lead_submit_error', { error: submitError, flowId: storageKey });
      }
    },

    setComplete: () => {
      setState(prev => ({ ...prev, isComplete: true }));
      if (trackEvents) {
        trackEvent('lead_submit_success', { flowId: storageKey });
      }
      // Clear from sessionStorage on complete
      try {
        sessionStorage.removeItem(storageKey);
      } catch (e) {
        // Ignore
      }
    },

    reset: () => {
      setState({
        currentStep: 1,
        formData: initialData,
        isSubmitting: false,
        submitError: null,
        isComplete: false,
      });
      try {
        sessionStorage.removeItem(storageKey);
      } catch (e) {
        // Ignore
      }
    },
  }), [totalSteps, storageKey, trackEvents, initialData]);

  return [state, actions];
}

export default useFlowState;
