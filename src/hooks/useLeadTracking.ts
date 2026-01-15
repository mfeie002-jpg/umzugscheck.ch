/**
 * LEAD TRACKING HOOK
 * 
 * Tracks user journey through the funnel:
 * - Page views (landing pages, calculators)
 * - Form interactions (starts, completions)
 * - Conversions (lead submissions)
 */

import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type TrackingEventType = 
  | 'page_view'
  | 'form_view'
  | 'form_start'
  | 'form_step'
  | 'form_complete'
  | 'lead_submit'
  | 'company_view'
  | 'company_click'
  | 'cta_click'
  | 'exit_intent_shown'
  | 'exit_intent_click';

interface TrackingEvent {
  event_type: TrackingEventType;
  page_path: string;
  metadata?: Record<string, any>;
}

interface UseLeadTrackingOptions {
  pagePath?: string;
  pageType?: 'canton' | 'city' | 'calculator' | 'funnel' | 'pillar';
  regionName?: string;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  const key = 'umzugscheck_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
};

export const useLeadTracking = (options: UseLeadTrackingOptions = {}) => {
  const { pagePath, pageType, regionName } = options;
  const sessionId = useRef(getSessionId());
  const hasTrackedPageView = useRef(false);

  // Track event to conversion_analytics table
  const trackEvent = useCallback(async (event: TrackingEvent) => {
    try {
      const { error } = await supabase.from('conversion_analytics').insert({
        conversion_type: event.event_type,
        source_page: event.page_path || pagePath || window.location.pathname,
        city: regionName || 'unknown',
        service: pageType || 'general',
        metadata: {
          ...event.metadata,
          session_id: sessionId.current,
          timestamp: new Date().toISOString(),
          user_agent: navigator.userAgent,
          referrer: document.referrer,
        },
      });

      if (error) {
        console.warn('Lead tracking error:', error);
      }
    } catch (err) {
      console.warn('Lead tracking failed:', err);
    }
  }, [pagePath, pageType, regionName]);

  // Track page view on mount (once per page)
  useEffect(() => {
    if (!hasTrackedPageView.current && pagePath) {
      hasTrackedPageView.current = true;
      trackEvent({
        event_type: 'page_view',
        page_path: pagePath,
        metadata: { page_type: pageType, region: regionName },
      });
    }
  }, [pagePath, pageType, regionName, trackEvent]);

  // Convenience methods
  const trackFormView = useCallback((formId: string) => {
    trackEvent({
      event_type: 'form_view',
      page_path: pagePath || window.location.pathname,
      metadata: { form_id: formId },
    });
  }, [trackEvent, pagePath]);

  const trackFormStart = useCallback((formId: string, step?: number) => {
    trackEvent({
      event_type: 'form_start',
      page_path: pagePath || window.location.pathname,
      metadata: { form_id: formId, step },
    });
  }, [trackEvent, pagePath]);

  const trackFormStep = useCallback((formId: string, step: number, stepName?: string) => {
    trackEvent({
      event_type: 'form_step',
      page_path: pagePath || window.location.pathname,
      metadata: { form_id: formId, step, step_name: stepName },
    });
  }, [trackEvent, pagePath]);

  const trackFormComplete = useCallback((formId: string, data?: Record<string, any>) => {
    trackEvent({
      event_type: 'form_complete',
      page_path: pagePath || window.location.pathname,
      metadata: { form_id: formId, ...data },
    });
  }, [trackEvent, pagePath]);

  const trackLeadSubmit = useCallback((leadData: Record<string, any>) => {
    trackEvent({
      event_type: 'lead_submit',
      page_path: pagePath || window.location.pathname,
      metadata: leadData,
    });
  }, [trackEvent, pagePath]);

  const trackCompanyView = useCallback((companyId: string, companyName: string) => {
    trackEvent({
      event_type: 'company_view',
      page_path: pagePath || window.location.pathname,
      metadata: { company_id: companyId, company_name: companyName },
    });
  }, [trackEvent, pagePath]);

  const trackCompanyClick = useCallback((companyId: string, companyName: string, action: string) => {
    trackEvent({
      event_type: 'company_click',
      page_path: pagePath || window.location.pathname,
      metadata: { company_id: companyId, company_name: companyName, action },
    });
  }, [trackEvent, pagePath]);

  const trackCTAClick = useCallback((ctaId: string, ctaText: string) => {
    trackEvent({
      event_type: 'cta_click',
      page_path: pagePath || window.location.pathname,
      metadata: { cta_id: ctaId, cta_text: ctaText },
    });
  }, [trackEvent, pagePath]);

  const trackExitIntent = useCallback((action: 'shown' | 'click') => {
    trackEvent({
      event_type: action === 'shown' ? 'exit_intent_shown' : 'exit_intent_click',
      page_path: pagePath || window.location.pathname,
    });
  }, [trackEvent, pagePath]);

  return {
    trackEvent,
    trackFormView,
    trackFormStart,
    trackFormStep,
    trackFormComplete,
    trackLeadSubmit,
    trackCompanyView,
    trackCompanyClick,
    trackCTAClick,
    trackExitIntent,
    sessionId: sessionId.current,
  };
};

export default useLeadTracking;
