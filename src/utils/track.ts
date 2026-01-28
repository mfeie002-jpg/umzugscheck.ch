import { trackEvent, trackConversion } from "@/lib/analytics";

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

export function track(eventName: TrackingEvent, params?: Record<string, unknown>) {
  trackEvent(eventName, params);
}

export { trackConversion };
