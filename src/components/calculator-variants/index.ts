/**
 * Calculator Variants - Export Hub
 * 
 * All flow variants organized by version number:
 * - V2.a-e: UX-optimized variants
 * - V3.a-e: Mobile-first variants (to be added)
 * - V4.a-e: Conversion-focused variants (to be added)
 */

// V2 Variants (UX-Optimized)
export { V2aProgressEnhanced } from './V2aProgressEnhanced';
export { V2bSimplifiedLabels } from './V2bSimplifiedLabels';
export { V2cTrustFocused } from './V2cTrustFocused';
export { V2dSpeedOptimized } from './V2dSpeedOptimized';
export { V2eExperimental } from './V2eExperimental';

// Variant Registry for dynamic loading
export const VARIANT_REGISTRY: Record<string, string> = {
  '2a': 'V2aProgressEnhanced',
  '2b': 'V2bSimplifiedLabels',
  '2c': 'V2cTrustFocused',
  '2d': 'V2dSpeedOptimized',
  '2e': 'V2eExperimental',
};
