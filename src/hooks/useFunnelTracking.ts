import { useCallback, useEffect, useRef } from 'react';

interface FunnelEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
}

interface FunnelTrackingOptions {
  funnelName: string;
  debug?: boolean;
}

// Use existing Window type - gtag and dataLayer are already defined

export const useFunnelTracking = (options: FunnelTrackingOptions) => {
  const { funnelName, debug = process.env.NODE_ENV === 'development' } = options;
  const sessionId = useRef<string>(
    typeof window !== 'undefined' 
      ? sessionStorage.getItem('funnel_session_id') || Math.random().toString(36).substring(7)
      : ''
  );
  const events = useRef<FunnelEvent[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('funnel_session_id', sessionId.current);
    }
  }, []);

  const track = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    const fullEventName = `${funnelName}_${eventName}`;
    const timestamp = Date.now();

    const event: FunnelEvent = {
      name: fullEventName,
      properties: {
        ...properties,
        session_id: sessionId.current,
        funnel_name: funnelName,
      },
      timestamp,
    };

    events.current.push(event);

    // Send to GA4
    if ((window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', fullEventName, event.properties);
    }

    // Push to dataLayer for GTM
    const win = window as Window & { dataLayer?: unknown[] };
    if (win.dataLayer) {
      win.dataLayer.push({
        event: fullEventName,
        ...event.properties,
      });
    }

    if (debug) {
      console.log(`[Funnel: ${funnelName}]`, eventName, properties);
    }
  }, [funnelName, debug]);

  const trackStep = useCallback((step: number, stepName: string, properties?: Record<string, unknown>) => {
    track('step_view', {
      step_number: step,
      step_name: stepName,
      ...properties,
    });
  }, [track]);

  const trackStepComplete = useCallback((step: number, stepName: string, properties?: Record<string, unknown>) => {
    track('step_complete', {
      step_number: step,
      step_name: stepName,
      ...properties,
    });
  }, [track]);

  const trackCTAClick = useCallback((ctaName: string, ctaLocation: string, properties?: Record<string, unknown>) => {
    track('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      ...properties,
    });
  }, [track]);

  const trackFormStart = useCallback((formName: string, properties?: Record<string, unknown>) => {
    track('form_start', {
      form_name: formName,
      ...properties,
    });
  }, [track]);

  const trackFormSubmit = useCallback((formName: string, success: boolean, properties?: Record<string, unknown>) => {
    track(success ? 'form_submit_success' : 'form_submit_error', {
      form_name: formName,
      ...properties,
    });
  }, [track]);

  const trackDropoff = useCallback((step: number, reason?: string, properties?: Record<string, unknown>) => {
    track('dropoff', {
      step_number: step,
      reason,
      ...properties,
    });
  }, [track]);

  const trackConversion = useCallback((conversionType: string, value?: number, properties?: Record<string, unknown>) => {
    track('conversion', {
      conversion_type: conversionType,
      conversion_value: value,
      ...properties,
    });

    // Also send as GA4 conversion event
    const win = window as Window & { gtag?: (...args: unknown[]) => void };
    if (win.gtag) {
      win.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID', // Replace with actual conversion ID
        value: value,
        currency: 'CHF',
        ...properties,
      });
    }
  }, [track]);

  const getSessionEvents = useCallback(() => {
    return events.current;
  }, []);

  return {
    track,
    trackStep,
    trackStepComplete,
    trackCTAClick,
    trackFormStart,
    trackFormSubmit,
    trackDropoff,
    trackConversion,
    getSessionEvents,
    sessionId: sessionId.current,
  };
};

// Standard event names for consistency
export const FUNNEL_EVENTS = {
  // Wizard events
  WIZARD_START: 'wizard_start',
  WIZARD_STEP_VIEW: 'wizard_step_view',
  WIZARD_STEP_COMPLETE: 'wizard_step_complete',
  WIZARD_BACK: 'wizard_back',
  WIZARD_SUBMIT: 'wizard_submit',
  WIZARD_SUCCESS: 'wizard_success',
  WIZARD_ERROR: 'wizard_error',
  
  // CTA events
  CTA_CLICK: 'cta_click',
  CTA_HOVER: 'cta_hover',
  
  // Form events
  FORM_START: 'form_start',
  FORM_FIELD_FOCUS: 'form_field_focus',
  FORM_FIELD_COMPLETE: 'form_field_complete',
  FORM_VALIDATION_ERROR: 'form_validation_error',
  FORM_SUBMIT: 'form_submit',
  
  // Company events
  COMPANY_VIEW: 'company_view',
  COMPANY_CLICK: 'company_click',
  COMPANY_REQUEST: 'company_request',
  
  // Calculator events
  CALCULATOR_START: 'calculator_start',
  CALCULATOR_RESULT: 'calculator_result',
  
  // Conversion events
  LEAD_CREATED: 'lead_created',
  OFFER_RECEIVED: 'offer_received',
  OFFER_CLICKED: 'offer_clicked',
  BOOKING_STARTED: 'booking_started',
  BOOKING_COMPLETED: 'booking_completed',
};

export default useFunnelTracking;
