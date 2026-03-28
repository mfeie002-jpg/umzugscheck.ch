import { trackConversion } from '@/lib/conversionTracker';

export const useCtaTracking = () => {
  const trackCta = (ctaName: string, ctaLocation: string, additionalData?: Record<string, any>) => {
    trackConversion('cta_click', {
      cta_name: ctaName,
      cta_location: ctaLocation,
      ...additionalData,
    });
  };

  return { trackCta };
};

// Standalone function for use in components without hooks
export const trackCtaClick = (ctaName: string, ctaLocation: string, additionalData?: Record<string, any>) => {
  trackConversion('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
    ...additionalData,
  });
};
