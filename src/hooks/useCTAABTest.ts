/**
 * CTA Button A/B Testing Hook
 * Step 5.5 - Test different CTA text/colors
 */
import { useState, useEffect, useCallback } from 'react';

// CTA variants for A/B testing
const CTA_VARIANTS = {
  default: {
    text: 'Offerten vergleichen',
    subtext: 'Kostenlos & unverbindlich',
    color: 'default' as const,
  },
  urgency: {
    text: 'Jetzt vergleichen',
    subtext: 'Nur noch 3 Termine diese Woche',
    color: 'urgent' as const,
  },
  benefit: {
    text: 'Bis 40% sparen',
    subtext: 'In 2 Minuten Offerten erhalten',
    color: 'benefit' as const,
  },
  social: {
    text: 'Wie 15\'000+ andere',
    subtext: 'Jetzt kostenlos vergleichen',
    color: 'social' as const,
  },
} as const;

type CTAVariantKey = keyof typeof CTA_VARIANTS;
type CTAVariant = typeof CTA_VARIANTS[CTAVariantKey];

const STORAGE_KEY = 'cta_ab_variant';

export const useCTAABTest = () => {
  const [variant, setVariant] = useState<CTAVariantKey>('default');
  const [ctaConfig, setCtaConfig] = useState<CTAVariant>(CTA_VARIANTS.default);

  useEffect(() => {
    // Check for existing assignment
    const stored = localStorage.getItem(STORAGE_KEY) as CTAVariantKey | null;
    
    if (stored && CTA_VARIANTS[stored]) {
      setVariant(stored);
      setCtaConfig(CTA_VARIANTS[stored]);
    } else {
      // Random assignment
      const keys = Object.keys(CTA_VARIANTS) as CTAVariantKey[];
      const randomKey = keys[Math.floor(Math.random() * keys.length)];
      localStorage.setItem(STORAGE_KEY, randomKey);
      setVariant(randomKey);
      setCtaConfig(CTA_VARIANTS[randomKey]);
    }
  }, []);

  const trackClick = useCallback((location: string) => {
    // Track CTA click for analytics
    const event = {
      type: 'cta_click',
      variant,
      location,
      timestamp: new Date().toISOString(),
    };
    
    // Store in localStorage for batch upload
    const events = JSON.parse(localStorage.getItem('cta_events') || '[]');
    events.push(event);
    localStorage.setItem('cta_events', JSON.stringify(events.slice(-100)));
    
    console.log('CTA Click tracked:', event);
  }, [variant]);

  return {
    variant,
    text: ctaConfig.text,
    subtext: ctaConfig.subtext,
    color: ctaConfig.color,
    trackClick,
    allVariants: CTA_VARIANTS,
  };
};

export { CTA_VARIANTS };
export type { CTAVariantKey, CTAVariant };
