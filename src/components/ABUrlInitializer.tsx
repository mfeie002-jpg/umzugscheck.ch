/**
 * A/B URL Initializer
 * 
 * Reads A/B test variants from URL params and applies them to contexts.
 * Used by the A/B Comparison Lab to control variants via iframe URLs.
 * 
 * Parameters:
 * - ab-homepage: A, B, or C
 * - ab-nav: V1-V17 (navigation variant)
 * - ab-social: A-AB (Social Proof variant - 28 total)
 * - ab-flow: Flow variant ID (e.g., 'v9a', 'swiss-premium') - CTAs will navigate here
 * - ab-lab: 1 (hides the A/B toggle for lab mode)
 */

import { useEffect, memo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHomepageAB, HomepageVariant } from '@/contexts/HomepageABContext';
import { useNavigationAB } from '@/contexts/NavigationABContext';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';

// Map V1-V17 to actual variant IDs
const NAV_ID_MAP: Record<string, string> = {
  'V1': 'ultimate',
  'V2': 'variant-b',
  'V3': 'variant-c',
  'V4': 'variant-d',
  'V5': 'variant-e',
  'V6': 'variant-f',
  'V7': 'variant-g',
  'V8': 'variant-h',
  'V9': 'variant-i',
  'V10': 'variant-j',
  'V11': 'variant-k',
  'V12': 'variant-l',
  'V13': 'variant-m',
  'V14': 'variant-n',
  'V15': 'variant-o',
  'V16': 'variant-p',
  'V17': 'variant-17',
};

// All valid Social Proof variants (A-AB = 28 variants)
const VALID_SOCIAL_VARIANTS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  'AA', 'AB'
] as const;

type SocialProofVariant = typeof VALID_SOCIAL_VARIANTS[number];

export const ABUrlInitializer = memo(function ABUrlInitializer() {
  const [searchParams] = useSearchParams();
  
  // Get contexts
  const { setVariant: setHomepage } = useHomepageAB();
  const { setVariant: setNavigation } = useNavigationAB();
  const { setVariant: setSocialProof } = useSocialProofAB();
  
  // Read URL params
  const homepageParam = searchParams.get('ab-homepage');
  const navParam = searchParams.get('ab-nav');
  const socialParam = searchParams.get('ab-social');
  
  // Apply URL params to contexts on mount
  useEffect(() => {
    if (homepageParam && ['A', 'B', 'C'].includes(homepageParam)) {
      setHomepage(homepageParam as HomepageVariant);
    }
  }, [homepageParam, setHomepage]);
  
  useEffect(() => {
    if (navParam) {
      const navId = NAV_ID_MAP[navParam.toUpperCase()];
      if (navId) {
        setNavigation(navId);
      }
    }
  }, [navParam, setNavigation]);
  
  useEffect(() => {
    // Support all 28 variants: A-Z plus AA, AB
    if (socialParam && VALID_SOCIAL_VARIANTS.includes(socialParam.toUpperCase() as SocialProofVariant)) {
      setSocialProof(socialParam.toUpperCase() as SocialProofVariant);
    }
  }, [socialParam, setSocialProof]);
  
  return null;
});

/**
 * Check if we're in A/B Lab mode (should hide toggle)
 */
export function useIsABLabMode(): boolean {
  const [searchParams] = useSearchParams();
  return searchParams.get('ab-lab') === '1';
}

/**
 * Get the target flow from URL params (for CTAs to use)
 * Re-exported from useTargetFlow hook for convenience
 */
export { useTargetFlow, getFlowPath, FLOW_PATH_MAP } from '@/hooks/useTargetFlow';
