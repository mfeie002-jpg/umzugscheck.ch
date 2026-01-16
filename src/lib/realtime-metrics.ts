/**
 * REALTIME METRICS COLLECTION
 * 
 * Collects and reports metrics to Supabase for dashboard analysis.
 */

import { supabase } from '@/integrations/supabase/client';
import { webVitals } from './web-vitals';

interface MetricsPayload {
  type: 'page_view' | 'funnel_event' | 'conversion' | 'performance' | 'error';
  event_name: string;
  properties: Record<string, unknown>;
  session_id: string;
  user_agent: string;
  device_type: 'mobile' | 'tablet' | 'desktop';
  page_path: string;
  timestamp: number;
}

// Generate or retrieve session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('metrics_session_id');
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    sessionStorage.setItem('metrics_session_id', sessionId);
  }
  return sessionId;
};

// Detect device type
const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Queue for batching metrics
let metricsQueue: MetricsPayload[] = [];
let flushTimeout: NodeJS.Timeout | null = null;

// Flush metrics to backend
const flushMetrics = async () => {
  if (metricsQueue.length === 0) return;
  
  const batch = [...metricsQueue];
  metricsQueue = [];
  
  try {
    // Log to console in dev
    if (import.meta.env.DEV) {
      console.log('[Metrics] Flushing batch:', batch.length, 'events');
    }
    
    // Store in localStorage for now (can be sent to Supabase)
    const existing = JSON.parse(localStorage.getItem('metrics_buffer') || '[]');
    const updated = [...existing, ...batch].slice(-500); // Keep last 500
    localStorage.setItem('metrics_buffer', JSON.stringify(updated));
    
    // TODO: Send to Supabase conversion_analytics table
    // await supabase.from('conversion_analytics').insert(batch);
    
  } catch (error) {
    console.error('[Metrics] Flush failed:', error);
    // Re-add failed items to queue
    metricsQueue = [...batch, ...metricsQueue];
  }
};

// Schedule flush (debounced)
const scheduleFlush = () => {
  if (flushTimeout) clearTimeout(flushTimeout);
  flushTimeout = setTimeout(flushMetrics, 2000);
};

// Main tracking function
export const trackMetric = (
  type: MetricsPayload['type'],
  eventName: string,
  properties: Record<string, unknown> = {}
) => {
  const payload: MetricsPayload = {
    type,
    event_name: eventName,
    properties,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
    device_type: getDeviceType(),
    page_path: window.location.pathname,
    timestamp: Date.now(),
  };
  
  metricsQueue.push(payload);
  scheduleFlush();
  
  // Also push to dataLayer for GTM
  if ((window as any).dataLayer) {
    (window as any).dataLayer.push({
      event: eventName,
      ...properties,
    });
  }
};

// ============================================================================
// SPECIALIZED TRACKING FUNCTIONS
// ============================================================================

export const trackPageView = (pageName?: string) => {
  trackMetric('page_view', 'page_view', {
    page_name: pageName || document.title,
    referrer: document.referrer,
    viewport_width: window.innerWidth,
    viewport_height: window.innerHeight,
  });
};

export const trackFunnelStep = (
  funnelName: string,
  step: number,
  stepName: string,
  timeOnPreviousStep?: number
) => {
  trackMetric('funnel_event', 'funnel_step', {
    funnel_name: funnelName,
    step_number: step,
    step_name: stepName,
    time_on_previous_step_ms: timeOnPreviousStep,
  });
};

export const trackFunnelComplete = (
  funnelName: string,
  totalSteps: number,
  totalTimeMs: number
) => {
  trackMetric('conversion', 'funnel_complete', {
    funnel_name: funnelName,
    total_steps: totalSteps,
    total_time_seconds: Math.round(totalTimeMs / 1000),
  });
};

export const trackCTAClick = (ctaName: string, location: string) => {
  trackMetric('funnel_event', 'cta_click', {
    cta_name: ctaName,
    location,
  });
};

export const trackCompanyAction = (
  companyId: string,
  companyName: string,
  action: 'view' | 'offerte' | 'call' | 'website'
) => {
  trackMetric('conversion', 'company_action', {
    company_id: companyId,
    company_name: companyName,
    action,
  });
};

export const trackFormError = (
  formName: string,
  fieldName: string,
  errorType: string
) => {
  trackMetric('error', 'form_error', {
    form_name: formName,
    field_name: fieldName,
    error_type: errorType,
  });
};

export const trackPerformance = () => {
  const metrics = webVitals.getMetrics();
  if (metrics.lcp || metrics.fcp || metrics.cls) {
    trackMetric('performance', 'web_vitals', {
      lcp: metrics.lcp?.value,
      lcp_rating: metrics.lcp?.rating,
      fcp: metrics.fcp?.value,
      fcp_rating: metrics.fcp?.rating,
      cls: metrics.cls?.value,
      cls_rating: metrics.cls?.rating,
      ttfb: metrics.ttfb?.value,
      device_type: metrics.deviceType,
    });
  }
};

export const trackScrollDepth = (depth: number) => {
  trackMetric('funnel_event', 'scroll_depth', {
    depth_percent: depth,
  });
};

export const trackExitIntent = (triggered: boolean, page: string) => {
  trackMetric('funnel_event', 'exit_intent', {
    triggered,
    page,
  });
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export const getSessionMetrics = (): MetricsPayload[] => {
  return JSON.parse(localStorage.getItem('metrics_buffer') || '[]')
    .filter((m: MetricsPayload) => m.session_id === getSessionId());
};

export const getConversionFunnel = (funnelName: string) => {
  const sessionMetrics = getSessionMetrics();
  return sessionMetrics
    .filter(m => m.event_name === 'funnel_step' && m.properties.funnel_name === funnelName)
    .sort((a, b) => a.timestamp - b.timestamp);
};

// Initialize on load
export const initMetrics = () => {
  // Track initial page view
  trackPageView();
  
  // Track scroll depth
  let maxScroll = 0;
  const trackScroll = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = Math.round((scrollTop / docHeight) * 100);
    
    // Track at 25%, 50%, 75%, 90% thresholds
    [25, 50, 75, 90].forEach(threshold => {
      if (scrollPercent >= threshold && maxScroll < threshold) {
        trackScrollDepth(threshold);
      }
    });
    
    maxScroll = Math.max(maxScroll, scrollPercent);
  };
  
  window.addEventListener('scroll', trackScroll, { passive: true });
  
  // Track exit intent on desktop
  if (window.innerWidth >= 768) {
    document.addEventListener('mouseout', (e) => {
      if (e.clientY <= 0) {
        trackExitIntent(true, window.location.pathname);
      }
    });
  }
  
  // Track performance after load
  window.addEventListener('load', () => {
    setTimeout(trackPerformance, 3000);
  });
  
  // Flush on page hide
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      flushMetrics();
    }
  });
};
