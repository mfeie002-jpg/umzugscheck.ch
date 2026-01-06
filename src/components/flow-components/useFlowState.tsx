/**
 * useFlowState Hook - State Management for Flows
 * 
 * Features:
 * ✅ SessionStorage persistence (survives refresh)
 * ✅ Back/forward without data loss
 * ✅ Analytics event tracking
 * ✅ Error state handling
 */

import { useState, useCallback, useEffect, useMemo } from 'react';

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
  // Initialize state from sessionStorage or defaults
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
  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({
        currentStep: state.currentStep,
        formData: state.formData,
        isComplete: state.isComplete,
      }));
    } catch (e) {
      console.warn('Failed to persist flow state:', e);
    }
  }, [storageKey, state.currentStep, state.formData, state.isComplete]);

  // Track step views
  useEffect(() => {
    if (trackEvents) {
      trackEvent('step_view', { 
        step: state.currentStep, 
        totalSteps,
        flowId: storageKey 
      });
    }
  }, [state.currentStep, totalSteps, storageKey, trackEvents]);

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
