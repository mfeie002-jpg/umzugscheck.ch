/**
 * Track utility for CTA and form events
 * Provides typed wrapper around analytics
 */

export type TrackingEvent =
  | "cta_call_click"
  | "cta_whatsapp_click"
  | "cta_quote_click"
  | "cta_callback_request"
  | "quote_start"
  | "quote_step1_submit"
  | "quote_submit"
  | "form_started"
  | "form_completed"
  | "package_selected"
  | "lead_submitted";

/**
 * Track a custom event
 * Uses gtag if available, otherwise logs to console
 */
export function track(eventName: TrackingEvent, params?: Record<string, unknown>) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Track]', eventName, params);
  }
  
  // Send to GA4 if available
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, params);
  }
}

/**
 * Track a conversion event
 */
export function trackConversion(conversionType: string, params?: Record<string, unknown>) {
  track('lead_submitted', { conversion_type: conversionType, ...params });
}
