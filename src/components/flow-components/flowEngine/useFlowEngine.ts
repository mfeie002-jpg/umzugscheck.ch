/**
 * useFlowEngine Hook
 * 
 * Core engine that manages flow state, validation, and persistence.
 * Works with FlowDefinition to create type-safe, declarative flows.
 */

import { useState, useCallback, useEffect, useMemo } from 'react';
import { FlowDefinition, FlowRuntimeState, FlowFieldState, ReviewItem } from './types';

const STORAGE_PREFIX = 'flow_engine_';

// Initialize field state from definition
const initializeFields = (definition: FlowDefinition): Record<string, FlowFieldState> => {
  const fields: Record<string, FlowFieldState> = {};
  
  definition.steps.forEach(step => {
    step.fields.forEach(field => {
      fields[field.name] = {
        value: field.defaultValue ?? (field.type === 'toggle' ? false : ''),
        touched: false,
        error: null,
        isValid: !field.required, // Non-required fields start valid
      };
    });
  });
  
  return fields;
};

// Load state from sessionStorage
const loadState = (flowId: string, definition: FlowDefinition): FlowRuntimeState => {
  if (typeof window === 'undefined') {
    return createInitialState(definition);
  }
  
  try {
    const stored = sessionStorage.getItem(`${STORAGE_PREFIX}${flowId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        isSubmitting: false,
        submitError: null,
      };
    }
  } catch (e) {
    console.warn('[FlowEngine] Failed to load state:', e);
  }
  
  return createInitialState(definition);
};

// Create fresh initial state
const createInitialState = (definition: FlowDefinition): FlowRuntimeState => ({
  currentStep: 1,
  fields: initializeFields(definition),
  isSubmitting: false,
  submitError: null,
  isComplete: false,
  startedAt: Date.now(),
  lastUpdatedAt: Date.now(),
});

// Track analytics event
const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
  console.log(`[FlowEngine Analytics] ${eventName}`, data);
  // Future: window.gtag?.('event', eventName, data);
};

export interface FlowEngineActions {
  // Navigation
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Field updates
  setFieldValue: (fieldName: string, value: unknown) => void;
  setFieldTouched: (fieldName: string) => void;
  validateField: (fieldName: string) => boolean;
  validateCurrentStep: () => boolean;
  
  // Form state
  getFieldValue: <T = unknown>(fieldName: string) => T;
  getFieldError: (fieldName: string) => string | null;
  isFieldValid: (fieldName: string) => boolean;
  isFieldTouched: (fieldName: string) => boolean;
  
  // Submit
  setSubmitting: (isSubmitting: boolean) => void;
  setSubmitError: (error: string | null) => void;
  setComplete: () => void;
  
  // Utils
  reset: () => void;
  generateReviewItems: () => ReviewItem[];
  getFormData: () => Record<string, unknown>;
}

export function useFlowEngine(definition: FlowDefinition): [FlowRuntimeState, FlowEngineActions] {
  const [state, setState] = useState<FlowRuntimeState>(() => 
    loadState(definition.id, definition)
  );
  
  // Persist to sessionStorage
  useEffect(() => {
    if (state.isComplete) {
      // Clear on complete
      try {
        sessionStorage.removeItem(`${STORAGE_PREFIX}${definition.id}`);
      } catch (e) {
        // Ignore
      }
      return;
    }
    
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${definition.id}`, JSON.stringify({
        currentStep: state.currentStep,
        fields: state.fields,
        isComplete: state.isComplete,
        startedAt: state.startedAt,
        lastUpdatedAt: Date.now(),
      }));
    } catch (e) {
      console.warn('[FlowEngine] Failed to persist state:', e);
    }
  }, [definition.id, state.currentStep, state.fields, state.isComplete, state.startedAt]);
  
  // Track step views
  useEffect(() => {
    trackEvent('step_view', {
      flowId: definition.id,
      step: state.currentStep,
      totalSteps: definition.steps.length,
    });
  }, [state.currentStep, definition.id, definition.steps.length]);
  
  // Get field definition
  const getFieldDef = useCallback((fieldName: string) => {
    for (const step of definition.steps) {
      const field = step.fields.find(f => f.name === fieldName);
      if (field) return field;
    }
    return null;
  }, [definition.steps]);
  
  // Validate a single field
  const validateField = useCallback((fieldName: string): boolean => {
    const fieldDef = getFieldDef(fieldName);
    const fieldState = state.fields[fieldName];
    
    if (!fieldDef || !fieldState) return true;
    
    let error: string | null = null;
    const value = fieldState.value;
    
    // Required check
    if (fieldDef.required) {
      if (value === undefined || value === null || value === '' || 
          (Array.isArray(value) && value.length === 0)) {
        error = 'Dieses Feld ist erforderlich';
      }
    }
    
    // Schema validation
    if (!error && fieldDef.validation && value) {
      try {
        fieldDef.validation.parse(value);
      } catch (e: unknown) {
        if (e && typeof e === 'object' && 'errors' in e) {
          const zodError = e as { errors: Array<{ message: string }> };
          error = zodError.errors[0]?.message || 'Ungültige Eingabe';
        } else {
          error = 'Ungültige Eingabe';
        }
      }
    }
    
    setState(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: {
          ...prev.fields[fieldName],
          error,
          isValid: !error,
        },
      },
    }));
    
    if (error) {
      trackEvent('validation_error', { flowId: definition.id, field: fieldName, error });
    }
    
    return !error;
  }, [definition.id, getFieldDef, state.fields]);
  
  // Validate current step
  const validateCurrentStep = useCallback((): boolean => {
    const currentStepDef = definition.steps[state.currentStep - 1];
    if (!currentStepDef) return true;
    
    let allValid = true;
    
    currentStepDef.fields.forEach(field => {
      const isValid = validateField(field.name);
      if (!isValid) allValid = false;
    });
    
    return allValid;
  }, [definition.steps, state.currentStep, validateField]);
  
  // Actions
  const actions = useMemo<FlowEngineActions>(() => ({
    nextStep: () => {
      const isValid = validateCurrentStep();
      if (!isValid) return false;
      
      setState(prev => {
        const newStep = Math.min(prev.currentStep + 1, definition.steps.length);
        trackEvent('step_complete', {
          flowId: definition.id,
          step: prev.currentStep,
        });
        return { ...prev, currentStep: newStep };
      });
      return true;
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
        currentStep: Math.max(1, Math.min(step, definition.steps.length)),
      }));
    },
    
    setFieldValue: (fieldName: string, value: unknown) => {
      setState(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [fieldName]: {
            ...prev.fields[fieldName],
            value,
            error: null, // Clear error on change
          },
        },
        lastUpdatedAt: Date.now(),
      }));
    },
    
    setFieldTouched: (fieldName: string) => {
      setState(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [fieldName]: {
            ...prev.fields[fieldName],
            touched: true,
          },
        },
      }));
    },
    
    validateField,
    validateCurrentStep,
    
    getFieldValue: <T = unknown>(fieldName: string): T => {
      return state.fields[fieldName]?.value as T;
    },
    
    getFieldError: (fieldName: string) => {
      const field = state.fields[fieldName];
      return field?.touched ? field.error : null;
    },
    
    isFieldValid: (fieldName: string) => {
      return state.fields[fieldName]?.isValid ?? true;
    },
    
    isFieldTouched: (fieldName: string) => {
      return state.fields[fieldName]?.touched ?? false;
    },
    
    setSubmitting: (isSubmitting: boolean) => {
      setState(prev => ({ ...prev, isSubmitting }));
    },
    
    setSubmitError: (submitError: string | null) => {
      setState(prev => ({ ...prev, submitError }));
      if (submitError) {
        trackEvent('lead_submit_error', { flowId: definition.id, error: submitError });
      }
    },
    
    setComplete: () => {
      setState(prev => ({ ...prev, isComplete: true }));
      trackEvent('lead_submit_success', { flowId: definition.id });
    },
    
    reset: () => {
      setState(createInitialState(definition));
      try {
        sessionStorage.removeItem(`${STORAGE_PREFIX}${definition.id}`);
      } catch (e) {
        // Ignore
      }
    },
    
    generateReviewItems: (): ReviewItem[] => {
      const items: ReviewItem[] = [];
      
      definition.steps.forEach((step, stepIndex) => {
        step.fields.forEach(field => {
          const fieldState = state.fields[field.name];
          if (!fieldState || fieldState.value === undefined || fieldState.value === '') return;
          
          let displayValue = String(fieldState.value);
          
          // Format based on type
          if (field.type === 'date' && fieldState.value) {
            try {
              displayValue = new Date(fieldState.value as string).toLocaleDateString('de-CH');
            } catch {
              // Keep original
            }
          }
          
          if ((field.type === 'select' || field.type === 'card-select') && field.options) {
            const option = field.options.find(o => o.value === fieldState.value);
            displayValue = option?.label || displayValue;
          }
          
          if (field.type === 'multi-select' && Array.isArray(fieldState.value) && field.options) {
            displayValue = (fieldState.value as string[])
              .map(v => field.options?.find(o => o.value === v)?.label || v)
              .join(', ');
          }
          
          if (field.type === 'toggle') {
            displayValue = fieldState.value ? 'Ja' : 'Nein';
          }
          
          items.push({
            field: field.name,
            label: field.label,
            value: displayValue,
            icon: field.icon,
            editStep: stepIndex + 1,
          });
        });
      });
      
      return items;
    },
    
    getFormData: () => {
      const data: Record<string, unknown> = {};
      Object.entries(state.fields).forEach(([key, fieldState]) => {
        data[key] = fieldState.value;
      });
      return data;
    },
  }), [definition, state.fields, validateField, validateCurrentStep]);
  
  return [state, actions];
}

export default useFlowEngine;
