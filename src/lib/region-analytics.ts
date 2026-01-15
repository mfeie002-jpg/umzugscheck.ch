/**
 * Region-specific Analytics Tracking
 * Tracks all interactions on region and pillar pages for conversion optimization
 */

import analytics from './analytics';
import { trackEvent, EngagementEvents, ConversionEvents } from './analytics-tracking';

export interface RegionTrackingContext {
  regionSlug: string;
  regionName: string;
  cantonCode?: string;
  pageType: 'pillar' | 'region' | 'city';
}

// Session-scoped tracking to prevent duplicate events
const trackedEvents = new Set<string>();

function trackOncePerSession(key: string, trackFn: () => void) {
  if (trackedEvents.has(key)) return;
  trackedEvents.add(key);
  trackFn();
}

/**
 * Track region page view
 */
export function trackRegionPageView(context: RegionTrackingContext) {
  const key = `region_view:${context.regionSlug}`;
  trackOncePerSession(key, () => {
    analytics.trackPageView(`region_${context.pageType}`, context.regionSlug);
    
    trackEvent({
      name: 'region_page_viewed',
      category: 'navigation',
      properties: {
        region: context.regionName,
        canton: context.cantonCode || 'unknown',
        pageType: context.pageType,
      }
    });
  });
}

/**
 * Track pillar page view (Umzugsfirmen Schweiz hub)
 */
export function trackPillarPageView() {
  trackOncePerSession('pillar_view', () => {
    analytics.trackPageView('pillar_umzugsfirmen', '/umzugsfirmen-schweiz');
    
    trackEvent({
      name: 'pillar_page_viewed',
      category: 'navigation',
      properties: {
        page: 'umzugsfirmen-schweiz',
      }
    });
  });
}

/**
 * Track region CTA click (Offerten button on region pages)
 */
export function trackRegionCTAClick(context: RegionTrackingContext, ctaType: 'hero' | 'sticky' | 'inline') {
  EngagementEvents.ctaClicked({
    ctaName: `region_offerten_${ctaType}`,
    location: context.regionSlug,
  });
  
  trackEvent({
    name: 'region_cta_clicked',
    category: 'conversion',
    properties: {
      region: context.regionName,
      canton: context.cantonCode || 'unknown',
      ctaType,
    }
  });
}

/**
 * Track company card click on region page
 */
export function trackRegionCompanyClick(
  context: RegionTrackingContext, 
  companyId: string, 
  companyName: string,
  position: number,
  isSponsored: boolean
) {
  trackEvent({
    name: 'region_company_clicked',
    category: 'company',
    properties: {
      region: context.regionName,
      companyId,
      position,
      isSponsored,
    }
  });
  
  if (isSponsored) {
    trackEvent({
      name: 'sponsored_clicked',
      category: 'company',
      properties: {
        companyId,
        companyName,
        position,
      }
    });
  }
}

/**
 * Track internal link click (to another region)
 */
export function trackRegionInternalLink(fromRegion: string, toRegion: string) {
  trackEvent({
    name: 'region_internal_link',
    category: 'navigation',
    properties: {
      from: fromRegion,
      to: toRegion,
    }
  });
}

/**
 * Track FAQ interaction on region page
 */
export function trackRegionFAQOpen(context: RegionTrackingContext, questionIndex: number) {
  EngagementEvents.faqOpened(`region_${context.regionSlug}_q${questionIndex}`);
}

/**
 * Track service card click on region page
 */
export function trackRegionServiceClick(context: RegionTrackingContext, serviceSlug: string) {
  trackEvent({
    name: 'region_service_clicked',
    category: 'engagement',
    properties: {
      region: context.regionName,
      service: serviceSlug,
    }
  });
}

/**
 * Track scroll depth on region page
 */
export function trackRegionScrollDepth(context: RegionTrackingContext, depth: 25 | 50 | 75 | 100) {
  const key = `scroll_${context.regionSlug}_${depth}`;
  trackOncePerSession(key, () => {
    trackEvent({
      name: 'region_scroll_depth',
      category: 'engagement',
      properties: {
        region: context.regionName,
        depth,
      }
    });
  });
}

/**
 * Track offerte form start from region page
 */
export function trackRegionOfferteStart(context: RegionTrackingContext, source: 'hero' | 'cta' | 'company') {
  trackEvent({
    name: 'region_offerte_started',
    category: 'conversion',
    properties: {
      region: context.regionName,
      canton: context.cantonCode || 'unknown',
      source,
    }
  });
}

/**
 * Track offerte submission from region page
 */
export function trackRegionOfferteSubmit(context: RegionTrackingContext, companiesSelected: number) {
  ConversionEvents.offerteSubmitted({
    calculatorType: 'region_flow',
    fromCity: context.regionName,
    toCity: 'TBD',
    companiesSelected,
  });
  
  trackEvent({
    name: 'region_offerte_submitted',
    category: 'conversion',
    properties: {
      region: context.regionName,
      canton: context.cantonCode || 'unknown',
      companiesSelected,
    }
  });
}

/**
 * Track time spent on region page (call on unmount)
 */
export function trackRegionTimeSpent(context: RegionTrackingContext, seconds: number) {
  if (seconds < 3) return; // Ignore very short visits
  
  EngagementEvents.timeSpent({
    page: `region_${context.regionSlug}`,
    seconds,
  });
}

/**
 * Hook for tracking region page analytics
 */
export function useRegionAnalytics(context: RegionTrackingContext) {
  return {
    trackPageView: () => trackRegionPageView(context),
    trackCTAClick: (ctaType: 'hero' | 'sticky' | 'inline') => trackRegionCTAClick(context, ctaType),
    trackCompanyClick: (companyId: string, companyName: string, position: number, isSponsored: boolean) => 
      trackRegionCompanyClick(context, companyId, companyName, position, isSponsored),
    trackInternalLink: (toRegion: string) => trackRegionInternalLink(context.regionSlug, toRegion),
    trackFAQOpen: (questionIndex: number) => trackRegionFAQOpen(context, questionIndex),
    trackServiceClick: (serviceSlug: string) => trackRegionServiceClick(context, serviceSlug),
    trackScrollDepth: (depth: 25 | 50 | 75 | 100) => trackRegionScrollDepth(context, depth),
    trackOfferteStart: (source: 'hero' | 'cta' | 'company') => trackRegionOfferteStart(context, source),
    trackOfferteSubmit: (companiesSelected: number) => trackRegionOfferteSubmit(context, companiesSelected),
    trackTimeSpent: (seconds: number) => trackRegionTimeSpent(context, seconds),
  };
}
