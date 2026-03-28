/**
 * VisionStickyCTA - DISABLED for stakeholder pages
 * These pages are internal/investor facing, not customer facing
 * The CTA was confusing since visitors are not customers seeking quotes
 */

import { memo } from "react";

export const VisionStickyCTA = memo(function VisionStickyCTA() {
  // Disabled - stakeholder pages don't need customer CTAs
  return null;
});
