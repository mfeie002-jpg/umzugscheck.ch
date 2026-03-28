import { supabase } from "@/integrations/supabase/client";

export type MonetizationEventType = 
  | "LEAD_ASSIGNED"
  | "PROFILE_VIEW" 
  | "WEBSITE_CLICK"
  | "CALL_CLICK"
  | "SPONSORED_IMPRESSION";

export interface MonetizationEvent {
  companyId: string;
  eventType: MonetizationEventType;
  relatedPage?: string;
  leadId?: string;
  metadata?: Record<string, any>;
}

/**
 * Log monetization events for tracking and billing purposes
 */
export async function logMonetizationEvent(event: MonetizationEvent): Promise<void> {
  try {
    // For now, we're just logging to provider_click_events table
    // In production, you'd expand this to handle different event types
    
    if (event.eventType === "PROFILE_VIEW" || 
        event.eventType === "WEBSITE_CLICK" || 
        event.eventType === "CALL_CLICK") {
      
      // Log click event (CPC model)
      const { error } = await supabase
        .from('provider_click_events')
        .insert({
          provider_id: event.companyId,
          event_type: event.eventType.toLowerCase(),
          price_chf: 0, // Price will be calculated by backend based on provider settings
          referer: event.relatedPage || window.location.pathname,
          user_agent: navigator.userAgent,
        });

      if (error) {
        console.error('Error logging monetization event:', error);
      }
    }
    
    // Lead assignment events are handled by the lead creation flow
    // which already logs to lead_transactions
    
  } catch (error) {
    console.error('Error in logMonetizationEvent:', error);
  }
}

/**
 * Track a company profile view for CPC billing
 */
export async function trackProfileView(companyId: string): Promise<void> {
  await logMonetizationEvent({
    companyId,
    eventType: "PROFILE_VIEW",
    relatedPage: window.location.pathname,
  });
}

/**
 * Track a website click for CPC billing
 */
export async function trackWebsiteClick(companyId: string): Promise<void> {
  await logMonetizationEvent({
    companyId,
    eventType: "WEBSITE_CLICK",
    relatedPage: window.location.pathname,
  });
}

/**
 * Track a call button click for CPC billing
 */
export async function trackCallClick(companyId: string): Promise<void> {
  await logMonetizationEvent({
    companyId,
    eventType: "CALL_CLICK",
    relatedPage: window.location.pathname,
  });
}

/**
 * Calculate ad score for sponsored ranking
 * adScore = (maxBidCHF or cplPriceCHF) * qualityScore
 */
export function calculateAdScore(
  bidAmount: number,
  qualityScore: number
): number {
  return bidAmount * qualityScore;
}

/**
 * Calculate quality score based on company metrics
 * Returns a score from 0.0 to 1.0
 */
export function calculateQualityScore(company: {
  rating?: number;
  review_count?: number;
  profile_completeness?: number;
}): number {
  const ratingScore = company.rating ? company.rating / 5 : 0;
  const reviewScore = company.review_count 
    ? Math.min(Math.log10(company.review_count + 1) / 3, 1) 
    : 0;
  const profileScore = company.profile_completeness || 0;
  
  // Weighted average
  return (ratingScore * 0.4 + reviewScore * 0.3 + profileScore * 0.3);
}