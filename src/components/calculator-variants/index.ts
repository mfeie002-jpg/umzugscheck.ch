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
export { V1bFeedbackBased } from './V1bFeedbackBased';
export { V1cFeedbackBased } from './V1cFeedbackBased';
export { V1dFeedbackBased } from './V1dFeedbackBased';
export { V1eFeedbackBased } from './V1eFeedbackBased';
export { V1fStickyCTATrust } from './V1fStickyCTATrust';
export { V1gInputUX } from './V1gInputUX';

// V2 Variants (UX-Optimized)
export { V2aProgressEnhanced } from './V2aProgressEnhanced';
export { V2bFeedbackBased } from './V2bFeedbackBased';
export { V2cArchetypCalculator } from './V2cArchetypCalculator';
export { V2cTrustFocused } from './V2cTrustFocused';
export { V2dFeedbackBased } from './V2dFeedbackBased';
export { V2eExperimental } from './V2eExperimental';
export { V2fFeedbackBased } from './V2fFeedbackBased';

// V3 Variants (Mobile-First) - Only Base Versions
export { V3aMobileFirst } from './V3aMobileFirst';
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
export { V4fFeedbackBased } from './V4fFeedbackBased';

// V5 Variants (Accessibility-Focused)
export { V5aHighContrast } from './V5aHighContrast';
export { V5bScreenReader } from './V5bScreenReader';
export { V5cKeyboardNav } from './V5cKeyboardNav';
export { V5dLargeText } from './V5dLargeText';
export { V5dFeedbackBased } from './V5dFeedbackBased';
export { V5eReducedMotion } from './V5eReducedMotion';
export { V5fFeedbackBased } from './V5fFeedbackBased';

// V6 Variants (Ultimate 6-Tier)
export { V6aFeedbackBased } from './V6aFeedbackBased';
export { V6bChatGPT } from './V6bChatGPT';
export { V6cGemini } from './V6cGemini';
export { default as V6fUltimate } from './V6fUltimate';
export { default as V6dDeepResearch } from './V6dDeepResearch';
export { default as V6eThinkingMode } from './V6eThinkingMode';

// V7 Variants (SwissMove 90s)
export { V7aFeedbackBased } from './V7aFeedbackBased';

// V8 Variants (Decision-Free)
export { V8aFeedbackBased } from './V8aFeedbackBased';

// V9 Variants (Main Pro Extended)
export { V9aFeedbackBased } from './V9aFeedbackBased';
export { V9bFeedbackBased } from './V9bFeedbackBased';
export { V9cFeedbackBased } from './V9cFeedbackBased';
export { V9dFeedbackBased } from './V9dFeedbackBased';
export { default as V9ZeroFrictionFlow } from './V9ZeroFrictionFlow';

// Ultimate Variants (Combined Best Practices)
export { UltimateV7Flow } from './UltimateV7Flow';
export { default as UltimateBest36Flow } from './UltimateBest36Flow';
export { default as GoldenFlowV10 } from './GoldenFlowV10';
export { default as V2ArchetypFlow } from './V2ArchetypFlow';
export { default as UltimateChFlow } from './UltimateChFlow';

// Swiss Premium Flows
export { default as SwissLightningFlow } from './SwissLightningFlow';
export { default as SwissPremiumChoiceFlow } from './SwissPremiumChoiceFlow';
export { default as SwissConciergeHybridFlow } from './SwissConciergeHybridFlow';

// Multi Variants (ChatGPT Pro)
export { MultiAFeedbackBased } from './MultiAFeedbackBased';

// ChatGPT Optimized Flows (NEW)
export { ChatGPTFlow1ZeroFriction } from './ChatGPTFlow1ZeroFriction';
export { ChatGPTFlow2SocialProof } from './ChatGPTFlow2SocialProof';
export { ChatGPTFlow3GuidedChat } from './ChatGPTFlow3GuidedChat';

// Variant Registry with step counts for dynamic capture
export const VARIANT_REGISTRY: Record<string, { 
  component: string; 
  stepCount: number;
  label: string;
}> = {
  // V1 - Control Flow
  'v1': { component: 'V1aFeedbackBased', stepCount: 2, label: 'V1 Control (Baseline)' },
  'v1a': { component: 'V1aFeedbackBased', stepCount: 2, label: 'V1a Control (Feedback)' },
  'v1b': { component: 'V1bFeedbackBased', stepCount: 4, label: 'V1b ChatGPT Agent' },
  'v1c': { component: 'V1cFeedbackBased', stepCount: 4, label: 'V1c Archetyp (Strategic)' },
  'v1d': { component: 'V1dFeedbackBased', stepCount: 4, label: 'V1d Optimized Funnel' },
  'v1e': { component: 'V1eFeedbackBased', stepCount: 4, label: 'V1e Trust Enhanced' },
  'v1f': { component: 'V1fStickyCTATrust', stepCount: 2, label: 'V1f Sticky CTA + Trust Pills ⭐' },
  'v1g': { component: 'V1gInputUX', stepCount: 2, label: 'V1g Input UX + Validation ⭐' },
  // V2 - UX Optimized (Gemini/ChatGPT Feedback Series)
  'v2': { component: 'V2aProgressEnhanced', stepCount: 4, label: 'V2 Baseline' },
  'v2a': { component: 'V2aProgressEnhanced', stepCount: 4, label: 'V2a Gemini Feedback' },
  'v2b': { component: 'V2bFeedbackBased', stepCount: 6, label: 'V2b ChatGPT Agent' },
  'v2c': { component: 'V2cArchetypCalculator', stepCount: 6, label: 'V2c Archetyp (Strategic)' },
  'v2d': { component: 'V2dFeedbackBased', stepCount: 6, label: 'V2d ChatGPT Pro' },
  'v2e': { component: 'V2eExperimental', stepCount: 6, label: 'V2e Chat Funnel ⭐' },
  'v2f': { component: 'V2fFeedbackBased', stepCount: 3, label: 'V2f Premium (Feedback)' },
  // V3 - Mobile-First (Base Versions Only)
  'v3': { component: 'V3aMobileFirst', stepCount: 4, label: 'V3 Mobile-First' },
  'v3a': { component: 'V3aMobileFirst', stepCount: 4, label: 'V3a Mobile First' },
  'v3b': { component: 'V3bSwipeNavigation', stepCount: 4, label: 'V3b Swipe Navigation' },
  'v3c': { component: 'V3cBottomSheet', stepCount: 4, label: 'V3c Bottom Sheet' },
  'v3d': { component: 'V3dThumbZone', stepCount: 3, label: 'V3d Thumb Zone' },
  'v3e': { component: 'V3eFullscreen', stepCount: 3, label: 'V3e Fullscreen' },
  // V4 - Conversion-Focused
  'v4': { component: 'V4aUrgencyBased', stepCount: 4, label: 'V4 Conversion' },
  'v4a': { component: 'V4aUrgencyBased', stepCount: 4, label: 'V4a Urgency Based' },
  'v4b': { component: 'V4bSocialProof', stepCount: 3, label: 'V4b Social Proof' },
  'v4c': { component: 'V4cValueFirst', stepCount: 3, label: 'V4c Value First' },
  'v4d': { component: 'V4dGamified', stepCount: 4, label: 'V4d Gamified' },
  'v4e': { component: 'V4eMinimalFriction', stepCount: 2, label: 'V4e Minimal Friction' },
  'v4f': { component: 'V4fFeedbackBased', stepCount: 3, label: 'V4f Video-First (Feedback)' },
  // V5 - Accessibility-Focused
  'v5': { component: 'V5aHighContrast', stepCount: 4, label: 'V5 Accessibility' },
  'v5a': { component: 'V5aHighContrast', stepCount: 4, label: 'V5a High Contrast' },
  'v5b': { component: 'V5bScreenReader', stepCount: 3, label: 'V5b Screen Reader' },
  'v5c': { component: 'V5cKeyboardNav', stepCount: 3, label: 'V5c Keyboard Nav' },
  'v5d-legacy': { component: 'V5dLargeText', stepCount: 3, label: 'V5d Large Text' },
  'v5d': { component: 'V5dFeedbackBased', stepCount: 5, label: 'V5d ChatGPT Feedback' },
  'v5e': { component: 'V5eReducedMotion', stepCount: 3, label: 'V5e Reduced Motion' },
  'v5f': { component: 'V5fFeedbackBased', stepCount: 3, label: 'V5f Marketplace (Feedback)' },
  // V6 - Ultimate 6-Tier
  'v6': { component: 'V6aFeedbackBased', stepCount: 3, label: 'V6 Ultimate' },
  'v6a': { component: 'V6aFeedbackBased', stepCount: 3, label: 'V6a Ultimate (Baseline)' },
  'v6b': { component: 'V6bChatGPT', stepCount: 5, label: 'V6b ChatGPT Feedback' },
  'v6c': { component: 'V6cGemini', stepCount: 6, label: 'V6c Gemini "God Mode"' },
  'v6d': { component: 'V6dDeepResearch', stepCount: 5, label: 'V6d Deep Research' },
  'v6e': { component: 'V6eThinkingMode', stepCount: 5, label: 'V6e Thinking Mode' },
  'v6f': { component: 'V6fUltimate', stepCount: 5, label: 'V6f Ultimate (Best of All)' },
  // V7 - SwissMove 90s
  'v7': { component: 'V7aFeedbackBased', stepCount: 3, label: 'V7 SwissMove' },
  'v7a': { component: 'V7aFeedbackBased', stepCount: 3, label: 'V7a SwissMove (Feedback)' },
  // V8 - Decision-Free
  'v8': { component: 'V8aFeedbackBased', stepCount: 2, label: 'V8 Decision-Free' },
  'v8a': { component: 'V8aFeedbackBased', stepCount: 2, label: 'V8a Decision-Free (Feedback)' },
  // V9 - Main Pro Extended
  'v9': { component: 'V9aFeedbackBased', stepCount: 6, label: 'V9 Main Pro' },
  'v9a': { component: 'V9aFeedbackBased', stepCount: 6, label: 'V9a Main Pro Ext' },
  'v9b': { component: 'V9bFeedbackBased', stepCount: 5, label: 'V9b Main Agent' },
  'v9c': { component: 'V9cFeedbackBased', stepCount: 5, label: 'V9c Zero Friction Optimized' },
  'v9d': { component: 'V9dFeedbackBased', stepCount: 9, label: 'V9d Main Gemini' },
  // Multi - ChatGPT Pro
  'multi-a': { component: 'MultiAFeedbackBased', stepCount: 3, label: 'Multi.a ChatGPT Pro' },
  // Ultimate - Combined Best Practices
  'ultimate-v7': { component: 'UltimateV7Flow', stepCount: 5, label: 'Ultimate V7 (95/100)' },
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
