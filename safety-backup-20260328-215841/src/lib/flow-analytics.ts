/**
 * Flow Analytics - Standardized event tracking for conversion funnels
 */

import { supabase } from '@/integrations/supabase/client';

// Standard event types for funnel tracking
export type FlowEventType = 
  | 'flow_start'
  | 'step_view'
  | 'step_complete'
  | 'flow_submit'
  | 'flow_success'
  | 'flow_error'
  | 'flow_abandon';

interface FlowEvent {
  eventType: FlowEventType;
  flowId: string;
  flowVariant?: string;
  step?: number;
  stepName?: string;
  metadata?: Record<string, unknown>;
}

// Generate or retrieve session ID
const getFlowSessionId = (): string => {
  const key = 'umzugscheck_flow_session';
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = `fs_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

/**
 * Track a flow event
 */
export const trackFlowEvent = async (event: FlowEvent): Promise<void> => {
  const sessionId = getFlowSessionId();
  const timestamp = new Date().toISOString();

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[FlowAnalytics]', event.eventType, {
      flow: event.flowId,
      step: event.step,
      stepName: event.stepName,
      sessionId,
    });
  }

  // Send to GA4 if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event.eventType, {
      flow_id: event.flowId,
      flow_variant: event.flowVariant,
      step_number: event.step,
      step_name: event.stepName,
      session_id: sessionId,
      ...event.metadata,
    });
  }

  // Send to GTM dataLayer if available
  if (typeof window !== 'undefined' && (window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: event.eventType,
      flowId: event.flowId,
      flowVariant: event.flowVariant,
      stepNumber: event.step,
      stepName: event.stepName,
      sessionId,
      timestamp,
      ...event.metadata,
    });
  }

  // Store in Supabase for analytics (non-blocking)
  try {
    await supabase.from('conversion_analytics').insert({
      conversion_type: event.eventType,
      source_page: window.location.pathname,
      city: event.metadata?.fromCity as string || 'unknown',
      service: event.flowId,
      metadata: {
        session_id: sessionId,
        flow_variant: event.flowVariant,
        step: event.step,
        step_name: event.stepName,
        user_agent: navigator.userAgent,
        timestamp,
        ...event.metadata,
      },
    });
  } catch (error) {
    // Don't block on analytics errors
    console.error('[FlowAnalytics] Error storing event:', error);
  }
};

// Convenience functions for common events
export const trackFlowStart = (flowId: string, metadata?: Record<string, unknown>) =>
  trackFlowEvent({ eventType: 'flow_start', flowId, step: 1, metadata });

export const trackStepView = (flowId: string, step: number, stepName: string, metadata?: Record<string, unknown>) =>
  trackFlowEvent({ eventType: 'step_view', flowId, step, stepName, metadata });

export const trackStepComplete = (flowId: string, step: number, stepName: string, metadata?: Record<string, unknown>) =>
  trackFlowEvent({ eventType: 'step_complete', flowId, step, stepName, metadata });

export const trackFlowSubmit = (flowId: string, metadata?: Record<string, unknown>) =>
  trackFlowEvent({ eventType: 'flow_submit', flowId, metadata });

export const trackFlowSuccess = (flowId: string, leadId: string, metadata?: Record<string, unknown>) =>
  trackFlowEvent({ eventType: 'flow_success', flowId, metadata: { lead_id: leadId, ...metadata } });

export const trackFlowError = (flowId: string, errorCode: string, metadata?: Record<string, unknown>) =>
  trackFlowEvent({ eventType: 'flow_error', flowId, metadata: { error_code: errorCode, ...metadata } });

// Step name constants for Golden Flow
export const GOLDEN_FLOW_STEPS = {
  1: 'addresses',
  2: 'details',
  3: 'services',
  4: 'contact',
} as const;

export const GOLDEN_FLOW_ID = 'golden-flow-v10';
