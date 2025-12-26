/**
 * Calculator Variants - Export Hub
 * 
 * All flow variants organized by version number:
 * - V2.a-e: UX-optimized variants
 * - V3.a-e: Mobile-first variants
 * - V4.a-e: Conversion-focused variants
 * - V5.a-e: Accessibility-focused variants
 */

// V2 Variants (UX-Optimized)
export { V2aProgressEnhanced } from './V2aProgressEnhanced';
export { V2bSimplifiedLabels } from './V2bSimplifiedLabels';
export { V2cTrustFocused } from './V2cTrustFocused';
export { V2dSpeedOptimized } from './V2dSpeedOptimized';
export { V2eExperimental } from './V2eExperimental';

// V3 Variants (Mobile-First)
export { V3aMobileFirst } from './V3aMobileFirst';
export { V3aFeedbackBased } from './V3aFeedbackBased';
export { V3bSwipeNavigation } from './V3bSwipeNavigation';
export { V3cBottomSheet } from './V3cBottomSheet';
export { V3dThumbZone } from './V3dThumbZone';
export { V3eFullscreen } from './V3eFullscreen';

// V4 Variants (Conversion-Focused)
export { V4aUrgencyBased } from './V4aUrgencyBased';
export { V4bSocialProof } from './V4bSocialProof';
export { V4cValueFirst } from './V4cValueFirst';
export { V4dGamified } from './V4dGamified';
export { V4eMinimalFriction } from './V4eMinimalFriction';

// V5 Variants (Accessibility-Focused)
export { V5aHighContrast } from './V5aHighContrast';
export { V5bScreenReader } from './V5bScreenReader';
export { V5cKeyboardNav } from './V5cKeyboardNav';
export { V5dLargeText } from './V5dLargeText';
export { V5eReducedMotion } from './V5eReducedMotion';

// Variant Registry for dynamic loading
export const VARIANT_REGISTRY: Record<string, string> = {
  // V2 - UX Optimized
  '2a': 'V2aProgressEnhanced',
  '2b': 'V2bSimplifiedLabels',
  '2c': 'V2cTrustFocused',
  '2d': 'V2dSpeedOptimized',
  '2e': 'V2eExperimental',
  // V3 - Mobile-First
  '3a': 'V3aMobileFirst',
  '3a-feedback': 'V3aFeedbackBased',
  '3b': 'V3bSwipeNavigation',
  '3c': 'V3cBottomSheet',
  '3d': 'V3dThumbZone',
  '3e': 'V3eFullscreen',
  // V4 - Conversion-Focused
  '4a': 'V4aUrgencyBased',
  '4b': 'V4bSocialProof',
  '4c': 'V4cValueFirst',
  '4d': 'V4dGamified',
  '4e': 'V4eMinimalFriction',
  // V5 - Accessibility-Focused
  '5a': 'V5aHighContrast',
  '5b': 'V5bScreenReader',
  '5c': 'V5cKeyboardNav',
  '5d': 'V5dLargeText',
  '5e': 'V5eReducedMotion',
};
