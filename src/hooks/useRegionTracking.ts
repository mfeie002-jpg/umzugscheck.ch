/**
 * useRegionTracking Hook
 * Provides comprehensive analytics tracking for region pages
 */

import { useEffect, useRef, useCallback } from 'react';
import { 
  RegionTrackingContext, 
  useRegionAnalytics,
  trackPillarPageView 
} from '@/lib/region-analytics';

interface UseRegionTrackingOptions {
  context: RegionTrackingContext;
  autoTrackPageView?: boolean;
  autoTrackScrollDepth?: boolean;
  autoTrackTimeSpent?: boolean;
}

export function useRegionTracking(options: UseRegionTrackingOptions) {
  const { 
    context, 
    autoTrackPageView = true, 
    autoTrackScrollDepth = true, 
    autoTrackTimeSpent = true 
  } = options;
  
  const analytics = useRegionAnalytics(context);
  const startTime = useRef(Date.now());
  const scrollDepthsTracked = useRef(new Set<number>());

  // Track page view on mount
  useEffect(() => {
    if (autoTrackPageView) {
      analytics.trackPageView();
    }
  }, [autoTrackPageView, context.regionSlug]);

  // Track scroll depth
  useEffect(() => {
    if (!autoTrackScrollDepth) return;

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      const depths: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];
      
      for (const depth of depths) {
        if (scrollPercent >= depth && !scrollDepthsTracked.current.has(depth)) {
          scrollDepthsTracked.current.add(depth);
          analytics.trackScrollDepth(depth);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [autoTrackScrollDepth, analytics]);

  // Track time spent on unmount
  useEffect(() => {
    if (!autoTrackTimeSpent) return;

    return () => {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      analytics.trackTimeSpent(timeSpent);
    };
  }, [autoTrackTimeSpent, context.regionSlug]);

  // Wrapped track functions with context
  const trackCTAClick = useCallback((ctaType: 'hero' | 'sticky' | 'inline') => {
    analytics.trackCTAClick(ctaType);
  }, [analytics]);

  const trackCompanyClick = useCallback((
    companyId: string, 
    companyName: string, 
    position: number, 
    isSponsored: boolean = false
  ) => {
    analytics.trackCompanyClick(companyId, companyName, position, isSponsored);
  }, [analytics]);

  const trackInternalLink = useCallback((toRegion: string) => {
    analytics.trackInternalLink(toRegion);
  }, [analytics]);

  const trackFAQOpen = useCallback((questionIndex: number) => {
    analytics.trackFAQOpen(questionIndex);
  }, [analytics]);

  const trackServiceClick = useCallback((serviceSlug: string) => {
    analytics.trackServiceClick(serviceSlug);
  }, [analytics]);

  const trackOfferteStart = useCallback((source: 'hero' | 'cta' | 'company') => {
    analytics.trackOfferteStart(source);
  }, [analytics]);

  const trackOfferteSubmit = useCallback((companiesSelected: number) => {
    analytics.trackOfferteSubmit(companiesSelected);
  }, [analytics]);

  return {
    trackCTAClick,
    trackCompanyClick,
    trackInternalLink,
    trackFAQOpen,
    trackServiceClick,
    trackOfferteStart,
    trackOfferteSubmit,
    context,
  };
}

/**
 * Hook for pillar page tracking
 */
export function usePillarPageTracking() {
  const startTime = useRef(Date.now());
  const scrollDepthsTracked = useRef(new Set<number>());

  useEffect(() => {
    trackPillarPageView();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      const depths: (25 | 50 | 75 | 100)[] = [25, 50, 75, 100];
      
      for (const depth of depths) {
        if (scrollPercent >= depth && !scrollDepthsTracked.current.has(depth)) {
          scrollDepthsTracked.current.add(depth);
          // Track scroll depth for pillar page
          import('@/lib/analytics-tracking').then(({ trackEvent }) => {
            trackEvent({
              name: 'pillar_scroll_depth',
              category: 'engagement',
              properties: { depth },
            });
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const trackRegionCardClick = useCallback((regionSlug: string, position: number) => {
    import('@/lib/analytics-tracking').then(({ trackEvent }) => {
      trackEvent({
        name: 'pillar_region_clicked',
        category: 'navigation',
        properties: { 
          region: regionSlug, 
          position 
        },
      });
    });
  }, []);

  const trackCTAClick = useCallback((ctaType: string) => {
    import('@/lib/analytics-tracking').then(({ EngagementEvents }) => {
      EngagementEvents.ctaClicked({
        ctaName: `pillar_${ctaType}`,
        location: 'umzugsfirmen-schweiz',
      });
    });
  }, []);

  return {
    trackRegionCardClick,
    trackCTAClick,
  };
}
