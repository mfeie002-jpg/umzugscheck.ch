/**
 * Conversion Event Tracking
 * Centralized event tracking for all conversion-critical actions
 */
import { supabase } from "@/integrations/supabase/client";

export type ConversionEventType = 
  | 'page_view'
  | 'cta_click'
  | 'form_start'
  | 'form_step_complete'
  | 'form_submit'
  | 'company_view'
  | 'company_call'
  | 'company_quote_request'
  | 'calculator_start'
  | 'calculator_complete'
  | 'exit_intent_shown'
  | 'exit_intent_converted'
  | 'scroll_depth'
  | 'time_on_page';

interface ConversionEventData {
  event_type: ConversionEventType;
  page_path: string;
  city?: string;
  service?: string;
  company_id?: string;
  metadata?: Record<string, any>;
}

// Session tracking
let sessionId: string | null = null;
const getSessionId = (): string => {
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return sessionId;
};

// Track conversion event
export const trackConversionEvent = async (data: ConversionEventData): Promise<void> => {
  const { event_type, page_path, city, service, company_id, metadata } = data;
  
  // Always log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Conversion]', event_type, { page_path, city, service, company_id, metadata });
  }
  
  // Send to Supabase analytics table
  try {
    await supabase.from('conversion_analytics').insert({
      conversion_type: event_type,
      source_page: page_path,
      city: city || 'unknown',
      service: service || 'umzug',
      company_id: company_id || null,
      metadata: {
        ...metadata,
        session_id: getSessionId(),
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        screen_width: window.innerWidth,
        referrer: document.referrer || 'direct'
      }
    });
  } catch (error) {
    // Silent fail - don't block user experience
    console.warn('[Conversion] Failed to track event:', error);
  }
  
  // Also send to Google Analytics if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', event_type, {
      page_path,
      city,
      service,
      company_id,
      ...metadata
    });
  }
};

// Convenience methods for common events
export const trackCTAClick = (ctaName: string, pagePath: string, metadata?: Record<string, any>) => {
  trackConversionEvent({
    event_type: 'cta_click',
    page_path: pagePath,
    metadata: { cta_name: ctaName, ...metadata }
  });
};

export const trackFormStart = (formName: string, pagePath: string) => {
  trackConversionEvent({
    event_type: 'form_start',
    page_path: pagePath,
    metadata: { form_name: formName }
  });
};

export const trackFormStepComplete = (formName: string, step: number, stepName: string, pagePath: string) => {
  trackConversionEvent({
    event_type: 'form_step_complete',
    page_path: pagePath,
    metadata: { form_name: formName, step, step_name: stepName }
  });
};

export const trackFormSubmit = (formName: string, pagePath: string, city?: string, service?: string) => {
  trackConversionEvent({
    event_type: 'form_submit',
    page_path: pagePath,
    city,
    service,
    metadata: { form_name: formName }
  });
};

export const trackCompanyView = (companyId: string, companyName: string, pagePath: string, city?: string) => {
  trackConversionEvent({
    event_type: 'company_view',
    page_path: pagePath,
    company_id: companyId,
    city,
    metadata: { company_name: companyName }
  });
};

export const trackCompanyCall = (companyId: string, companyName: string, pagePath: string) => {
  trackConversionEvent({
    event_type: 'company_call',
    page_path: pagePath,
    company_id: companyId,
    metadata: { company_name: companyName }
  });
};

export const trackCompanyQuoteRequest = (companyId: string, companyName: string, pagePath: string, city?: string) => {
  trackConversionEvent({
    event_type: 'company_quote_request',
    page_path: pagePath,
    company_id: companyId,
    city,
    metadata: { company_name: companyName }
  });
};

export const trackCalculatorStart = (calculatorType: string, pagePath: string) => {
  trackConversionEvent({
    event_type: 'calculator_start',
    page_path: pagePath,
    metadata: { calculator_type: calculatorType }
  });
};

export const trackCalculatorComplete = (calculatorType: string, pagePath: string, priceMin?: number, priceMax?: number) => {
  trackConversionEvent({
    event_type: 'calculator_complete',
    page_path: pagePath,
    metadata: { calculator_type: calculatorType, price_min: priceMin, price_max: priceMax }
  });
};

export const trackScrollDepth = (depth: number, pagePath: string) => {
  trackConversionEvent({
    event_type: 'scroll_depth',
    page_path: pagePath,
    metadata: { depth_percent: depth }
  });
};

export const trackTimeOnPage = (seconds: number, pagePath: string) => {
  trackConversionEvent({
    event_type: 'time_on_page',
    page_path: pagePath,
    metadata: { time_seconds: seconds }
  });
};

export const trackPageView = (pageName: string, metadata?: Record<string, any>) => {
  trackConversionEvent({
    event_type: 'page_view',
    page_path: window.location.pathname,
    metadata: { page_name: pageName, ...metadata }
  });
};

// React hook for tracking
export const useConversionTracking = () => {
  return {
    trackPageView,
    trackCTAClick,
    trackFormStart,
    trackFormStepComplete,
    trackFormSubmit,
    trackCompanyView,
    trackCompanyCall,
    trackCompanyQuoteRequest,
    trackCalculatorStart,
    trackCalculatorComplete,
    trackScrollDepth,
    trackTimeOnPage,
    trackConversionEvent
  };
};
