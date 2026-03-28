/**
 * A/B Wrapper for EnhancedTestimonials
 * Renders Variant A, B, C, D, or E based on context
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { EnhancedTestimonials } from '@/components/homepage/EnhancedTestimonials';
import { EnhancedTestimonialsVariantB } from '@/components/homepage/EnhancedTestimonialsVariantB';
import { EnhancedTestimonialsVariantC } from '@/components/homepage/EnhancedTestimonialsVariantC';
import { EnhancedTestimonialsVariantD } from '@/components/homepage/EnhancedTestimonialsVariantD';
import { EnhancedTestimonialsVariantE } from '@/components/homepage/EnhancedTestimonialsVariantE';

export const EnhancedTestimonialsAB = memo(function EnhancedTestimonialsAB() {
  const { variant } = useSocialProofAB();
  
  switch (variant) {
    case 'B':
      return <EnhancedTestimonialsVariantB />;
    case 'C':
      return <EnhancedTestimonialsVariantC />;
    case 'D':
      return <EnhancedTestimonialsVariantD />;
    case 'E':
      return <EnhancedTestimonialsVariantE />;
    default:
      return <EnhancedTestimonials />;
  }
});
