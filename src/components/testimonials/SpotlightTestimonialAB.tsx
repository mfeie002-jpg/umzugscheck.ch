/**
 * A/B Wrapper for Spotlight Testimonial
 * 
 * Integrates with Social Proof A/B context to show:
 * - V1 (A): Original slider testimonials
 * - V2-V5 (B-E): New Spotlight Strategy
 */

import { memo } from "react";
import { useSocialProofAB } from "@/contexts/SocialProofABContext";
import { SpotlightTestimonial } from "./SpotlightTestimonial";

interface SpotlightTestimonialABProps {
  /** Fallback component for variant A */
  fallback?: React.ReactNode;
}

export const SpotlightTestimonialAB = memo(function SpotlightTestimonialAB({
  fallback,
}: SpotlightTestimonialABProps) {
  const { variant } = useSocialProofAB();
  
  // Variant A uses the fallback (original testimonials)
  if (variant === 'A' && fallback) {
    return <>{fallback}</>;
  }
  
  // All other variants use Spotlight Strategy
  return <SpotlightTestimonial variant="platform" />;
});

export default SpotlightTestimonialAB;
