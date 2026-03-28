/**
 * Analytics Event Tracking
 * 
 * Centralized analytics for conversion funnel tracking.
 * Supports: GTM, GA4, custom events, Supabase logging
 */

// Event categories
export type EventCategory = 
  | 'funnel'
  | 'navigation'
  | 'engagement'
  | 'conversion'
  | 'error'
  | 'performance';

// Funnel-specific events
export type FunnelEvent =
  | 'funnel_start'
  | 'funnel_step_view'
  | 'funnel_step_complete'
  | 'funnel_form_focus'
  | 'funnel_form_error'
  | 'funnel_submit'
  | 'funnel_success'
  | 'funnel_abandon';

// Conversion events
export type ConversionEvent =
  | 'lead_form_start'
  | 'lead_form_complete'
  | 'company_card_view'
  | 'company_card_click'
  | 'company_call_click'
  | 'company_offerte_click'
  | 'calculator_start'
  | 'calculator_complete'
  | 'cta_click';

type AnalyticsEvent = FunnelEvent | ConversionEvent;

interface EventPayload {
  event: AnalyticsEvent;
  category: EventCategory;
  label?: string;
  value?: number;
  [key: string]: unknown;
}

// Check if GTM/GA4 is available
const hasGTM = () => typeof window !== 'undefined' && !!(window as any).dataLayer;
const hasGA4 = () => typeof window !== 'undefined' && !!(window as any).gtag;

// Push to dataLayer (GTM)
const pushToDataLayer = (payload: EventPayload) => {
  if (hasGTM()) {
    (window as any).dataLayer.push({
      event: payload.event,
      eventCategory: payload.category,
      eventLabel: payload.label,
      eventValue: payload.value,
      ...payload,
    });
  }
};

// Send to GA4
const sendToGA4 = (payload: EventPayload) => {
  if (hasGA4()) {
    (window as any).gtag('event', payload.event, {
      event_category: payload.category,
      event_label: payload.label,
      value: payload.value,
      ...payload,
    });
  }
};

// Main tracking function
export const trackEvent = (payload: EventPayload) => {
  // Log in dev
  if (import.meta.env.DEV) {
    console.log('[Analytics]', payload.event, payload);
  }

  // Send to all available platforms
  pushToDataLayer(payload);
  sendToGA4(payload);
};

// ============================================================================
// FUNNEL TRACKING
// ============================================================================

export const trackFunnelStart = (funnelName: string, source?: string) => {
  trackEvent({
    event: 'funnel_start',
    category: 'funnel',
    label: funnelName,
    funnel_name: funnelName,
    source: source || 'direct',
    timestamp: Date.now(),
  });
};

export const trackFunnelStep = (
  funnelName: string, 
  stepNumber: number, 
  stepName: string,
  timeOnPreviousStep?: number
) => {
  trackEvent({
    event: 'funnel_step_view',
    category: 'funnel',
    label: `${funnelName}:${stepName}`,
    value: stepNumber,
    funnel_name: funnelName,
    step_number: stepNumber,
    step_name: stepName,
    time_on_previous_step: timeOnPreviousStep,
  });
};

export const trackFunnelComplete = (
  funnelName: string, 
  stepNumber: number,
  formData?: Record<string, unknown>
) => {
  trackEvent({
    event: 'funnel_step_complete',
    category: 'funnel',
    label: `${funnelName}:step_${stepNumber}`,
    value: stepNumber,
    funnel_name: funnelName,
    step_completed: stepNumber,
    // Don't track PII, only metadata
    has_phone: !!formData?.phone,
    has_email: !!formData?.email,
    rooms: formData?.rooms,
    service_type: formData?.serviceType,
  });
};

export const trackFunnelSubmit = (
  funnelName: string,
  totalSteps: number,
  totalTimeMs: number
) => {
  trackEvent({
    event: 'funnel_submit',
    category: 'conversion',
    label: funnelName,
    value: totalSteps,
    funnel_name: funnelName,
    total_steps: totalSteps,
    total_time_seconds: Math.round(totalTimeMs / 1000),
  });
};

export const trackFunnelSuccess = (
  funnelName: string,
  estimateId?: string
) => {
  trackEvent({
    event: 'funnel_success',
    category: 'conversion',
    label: funnelName,
    funnel_name: funnelName,
    estimate_id: estimateId,
  });
};

export const trackFunnelAbandon = (
  funnelName: string,
  abandonedAtStep: number,
  timeSpentMs: number
) => {
  trackEvent({
    event: 'funnel_abandon',
    category: 'funnel',
    label: `${funnelName}:step_${abandonedAtStep}`,
    value: abandonedAtStep,
    funnel_name: funnelName,
    abandoned_at_step: abandonedAtStep,
    time_spent_seconds: Math.round(timeSpentMs / 1000),
  });
};

// ============================================================================
// CONVERSION TRACKING
// ============================================================================

export const trackCTAClick = (ctaName: string, location: string) => {
  trackEvent({
    event: 'cta_click',
    category: 'conversion',
    label: ctaName,
    cta_name: ctaName,
    cta_location: location,
  });
};

export const trackCompanyCardClick = (
  companyId: string, 
  companyName: string,
  action: 'view' | 'offerte' | 'call' | 'website'
) => {
  const eventMap: Record<string, ConversionEvent> = {
    view: 'company_card_view',
    offerte: 'company_offerte_click',
    call: 'company_call_click',
    website: 'company_card_click',
  };

  trackEvent({
    event: eventMap[action],
    category: 'conversion',
    label: companyName,
    company_id: companyId,
    company_name: companyName,
    action,
  });
};

export const trackCalculator = (
  calculatorType: string,
  action: 'start' | 'complete',
  estimatedPrice?: { min: number; max: number }
) => {
  trackEvent({
    event: action === 'start' ? 'calculator_start' : 'calculator_complete',
    category: 'conversion',
    label: calculatorType,
    calculator_type: calculatorType,
    ...(estimatedPrice && {
      price_min: estimatedPrice.min,
      price_max: estimatedPrice.max,
    }),
  });
};

// ============================================================================
// FORM TRACKING
// ============================================================================

export const trackFormFocus = (formName: string, fieldName: string) => {
  trackEvent({
    event: 'funnel_form_focus',
    category: 'engagement',
    label: `${formName}:${fieldName}`,
    form_name: formName,
    field_name: fieldName,
  });
};

export const trackFormError = (formName: string, fieldName: string, errorType: string) => {
  trackEvent({
    event: 'funnel_form_error',
    category: 'error',
    label: `${formName}:${fieldName}:${errorType}`,
    form_name: formName,
    field_name: fieldName,
    error_type: errorType,
  });
};

// ============================================================================
// PERFORMANCE TRACKING
// ============================================================================

export const trackPagePerformance = (metrics: {
  lcp?: number;
  fcp?: number;
  cls?: number;
  ttfb?: number;
  fid?: number;
}) => {
  trackEvent({
    event: 'funnel_step_view' as FunnelEvent, // Reuse for perf
    category: 'performance',
    label: window.location.pathname,
    ...metrics,
  });
};
