/**
 * Calculator Variants - Export Hub
 * 
 * All flow variants organized by version number:
 * - V2.a-e: UX-optimized variants
 * - V3.a-e: Mobile-first variants
 * - V4.a-e: Conversion-focused variants
 * - V5.a-e: Accessibility-focused variants
 * 
 * Each variant exports its step count for dynamic capture
 */

import { SUB_VARIANT_CONFIGS, getFlowStepCount } from '@/data/flowConfigs';

// V1 Variants (Control Flow)
export { V1aFeedbackBased } from './V1aFeedbackBased';

// V2 Variants (UX-Optimized)
export { V2aProgressEnhanced } from './V2aProgressEnhanced';
export { V2bSimplifiedLabels } from './V2bSimplifiedLabels';
export { V2cTrustFocused } from './V2cTrustFocused';
export { V2dSpeedOptimized } from './V2dSpeedOptimized';
export { V2eExperimental } from './V2eExperimental';
export { V2fFeedbackBased } from './V2fFeedbackBased';

// V3 Variants (Mobile-First)
export { V3aMobileFirst } from './V3aMobileFirst';
export { V3aFeedbackBased } from './V3aFeedbackBased';
export { V3bFeedbackBased } from './V3bFeedbackBased';
export { V3bSwipeNavigation } from './V3bSwipeNavigation';
export { V3gFeedbackBased } from './V3gFeedbackBased';
export { V3cBottomSheet } from './V3cBottomSheet';
export { V3dThumbZone } from './V3dThumbZone';
export { V3eFullscreen } from './V3eFullscreen';

// V4 Variants (Conversion-Focused)
export { V4aUrgencyBased } from './V4aUrgencyBased';
export { V4bSocialProof } from './V4bSocialProof';
export { V4cValueFirst } from './V4cValueFirst';
export { V4dGamified } from './V4dGamified';
export { V4eMinimalFriction } from './V4eMinimalFriction';
export { V4fFeedbackBased } from './V4fFeedbackBased';

// V5 Variants (Accessibility-Focused)
export { V5aHighContrast } from './V5aHighContrast';
export { V5bScreenReader } from './V5bScreenReader';
export { V5cKeyboardNav } from './V5cKeyboardNav';
export { V5dLargeText } from './V5dLargeText';
export { V5eReducedMotion } from './V5eReducedMotion';
export { V5fFeedbackBased } from './V5fFeedbackBased';

// V6 Variants (Ultimate 6-Tier)
export { V6aFeedbackBased } from './V6aFeedbackBased';

// V7 Variants (SwissMove 90s)
export { V7aFeedbackBased } from './V7aFeedbackBased';

// V8 Variants (Decision-Free)
export { V8aFeedbackBased } from './V8aFeedbackBased';

// V9 Variants (Main Pro Extended)
export { V9aFeedbackBased } from './V9aFeedbackBased';
export { V9bFeedbackBased } from './V9bFeedbackBased';
export { V9cFeedbackBased } from './V9cFeedbackBased';
export { V9dFeedbackBased } from './V9dFeedbackBased';

// Multi Variants (ChatGPT Pro)
export { MultiAFeedbackBased } from './MultiAFeedbackBased';

// Variant Registry with step counts for dynamic capture
export const VARIANT_REGISTRY: Record<string, { 
  component: string; 
  stepCount: number;
  label: string;
}> = {
  // V1 - Control Flow
  'v1a': { component: 'V1aFeedbackBased', stepCount: 2, label: 'V1a Control (Feedback)' },
  // V2 - UX Optimized
  'v2a': { component: 'V2aProgressEnhanced', stepCount: 4, label: 'V2a Progress Enhanced' },
  'v2b': { component: 'V2bSimplifiedLabels', stepCount: 4, label: 'V2b Simplified Labels' },
  'v2c': { component: 'V2cTrustFocused', stepCount: 4, label: 'V2c Trust Focused' },
  'v2d': { component: 'V2dSpeedOptimized', stepCount: 3, label: 'V2d Speed Optimized' },
  'v2e': { component: 'V2eExperimental', stepCount: 3, label: 'V2e Experimental' },
  'v2f': { component: 'V2fFeedbackBased', stepCount: 3, label: 'V2f Premium (Feedback)' },
  // V3 - Mobile-First
  'v3a': { component: 'V3aMobileFirst', stepCount: 4, label: 'V3a Mobile First' },
  'v3a-pro': { component: 'V3aFeedbackBased', stepCount: 4, label: 'V3a Pro (Feedback)' },
  'v3b-feedback': { component: 'V3bFeedbackBased', stepCount: 4, label: 'V3b Feedback Based' },
  'v3b': { component: 'V3bSwipeNavigation', stepCount: 4, label: 'V3b Swipe Navigation' },
  'v3g': { component: 'V3gFeedbackBased', stepCount: 4, label: 'V3g Feedback Based' },
  'v3c': { component: 'V3cBottomSheet', stepCount: 4, label: 'V3c Bottom Sheet' },
  'v3d': { component: 'V3dThumbZone', stepCount: 3, label: 'V3d Thumb Zone' },
  'v3e': { component: 'V3eFullscreen', stepCount: 3, label: 'V3e Fullscreen' },
  // V4 - Conversion-Focused
  'v4a': { component: 'V4aUrgencyBased', stepCount: 4, label: 'V4a Urgency Based' },
  'v4b': { component: 'V4bSocialProof', stepCount: 3, label: 'V4b Social Proof' },
  'v4c': { component: 'V4cValueFirst', stepCount: 3, label: 'V4c Value First' },
  'v4d': { component: 'V4dGamified', stepCount: 4, label: 'V4d Gamified' },
  'v4e': { component: 'V4eMinimalFriction', stepCount: 2, label: 'V4e Minimal Friction' },
  'v4f': { component: 'V4fFeedbackBased', stepCount: 3, label: 'V4f Video-First (Feedback)' },
  // V5 - Accessibility-Focused
  'v5a': { component: 'V5aHighContrast', stepCount: 4, label: 'V5a High Contrast' },
  'v5b': { component: 'V5bScreenReader', stepCount: 3, label: 'V5b Screen Reader' },
  'v5c': { component: 'V5cKeyboardNav', stepCount: 3, label: 'V5c Keyboard Nav' },
  'v5d': { component: 'V5dLargeText', stepCount: 3, label: 'V5d Large Text' },
  'v5e': { component: 'V5eReducedMotion', stepCount: 3, label: 'V5e Reduced Motion' },
  'v5f': { component: 'V5fFeedbackBased', stepCount: 3, label: 'V5f Marketplace (Feedback)' },
  // V6 - Ultimate 6-Tier
  'v6a': { component: 'V6aFeedbackBased', stepCount: 3, label: 'V6a Ultimate (Feedback)' },
  // V7 - SwissMove 90s
  'v7a': { component: 'V7aFeedbackBased', stepCount: 3, label: 'V7a SwissMove (Feedback)' },
  // V8 - Decision-Free
  'v8a': { component: 'V8aFeedbackBased', stepCount: 2, label: 'V8a Decision-Free (Feedback)' },
  // V9 - Main Pro Extended
  'v9a': { component: 'V9aFeedbackBased', stepCount: 6, label: 'V9a Main Pro Ext' },
  'v9b': { component: 'V9bFeedbackBased', stepCount: 5, label: 'V9b Main Agent' },
  'v9c': { component: 'V9cFeedbackBased', stepCount: 6, label: 'V9c Zero Friction Optimized' },
  'v9d': { component: 'V9dFeedbackBased', stepCount: 9, label: 'V9d Main Gemini' },
  // Multi - ChatGPT Pro
  'multi-a': { component: 'MultiAFeedbackBased', stepCount: 3, label: 'Multi.a ChatGPT Pro' },
};

// Get step count for a variant
export const getVariantStepCount = (variantId: string): number => {
  const normalizedId = variantId.toLowerCase().replace('v', '');
  const variant = VARIANT_REGISTRY[`v${normalizedId}`] || VARIANT_REGISTRY[variantId];
  return variant?.stepCount || 4;
};

// Get all variants with their step counts
export const getAllVariantsWithSteps = () => {
  return Object.entries(VARIANT_REGISTRY).map(([id, config]) => ({
    id,
    ...config,
  }));
};

// Re-export flow config functions for convenience
export { SUB_VARIANT_CONFIGS, getFlowStepCount } from '@/data/flowConfigs';
