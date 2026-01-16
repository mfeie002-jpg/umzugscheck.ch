/**
 * A/B Wrapper for EnhancedTestimonials
 * Renders either Variant A or B based on context
 */

import { memo } from 'react';
import { useSocialProofAB } from '@/contexts/SocialProofABContext';
import { EnhancedTestimonials } from '@/components/homepage/EnhancedTestimonials';
import { EnhancedTestimonialsVariantB } from '@/components/homepage/EnhancedTestimonialsVariantB';

export const EnhancedTestimonialsAB = memo(function EnhancedTestimonialsAB() {
  const { variant } = useSocialProofAB();
  
  if (variant === 'B') {
    return <EnhancedTestimonialsVariantB />;
  }
  
  return <EnhancedTestimonials />;
});
