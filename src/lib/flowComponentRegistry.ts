/**
 * Auto-generated Flow Component Registry
 * 
 * This file provides automatic component resolution for all flow variants.
 * When you add a new variant to SUB_VARIANT_CONFIGS in flowConfigs.ts,
 * you MUST also add the component mapping here.
 * 
 * For a fully automatic solution in the future, consider:
 * - Dynamic imports based on naming convention
 * - A build-time script that generates this file
 */

import { lazy, ComponentType, LazyExoticComponent } from 'react';

// Import all calculator variant components
import {
  // V1 variants
  V1aFeedbackBased,
  V1bFeedbackBased,
  V1cFeedbackBased,
  V1dFeedbackBased,
  V1eFeedbackBased,
  V1fStickyCTATrust,
  V1gInputUX,
  // V2 variants
  V2aProgressEnhanced,
  V2bFeedbackBased,
  V2cTrustFocused,
  V2dFeedbackBased,
  V2eExperimental,
  V2fFeedbackBased,
  // V3 variants - Base Versions Only
  V3aMobileFirst,
  V3bSwipeNavigation,
  V3cBottomSheet,
  V3dThumbZone,
  V3eFullscreen,
  // V4 variants
  V4aUrgencyBased,
  V4bSocialProof,
  V4cValueFirst,
  V4dGamified,
  V4eMinimalFriction,
  V4fFeedbackBased,
  // V5 variants
  V5aHighContrast,
  V5bScreenReader,
  V5cKeyboardNav,
  V5dFeedbackBased,
  V5eReducedMotion,
  V5fFeedbackBased,
  // V6 variants
  V6aFeedbackBased,
  V6bChatGPT,
  V6cGemini,
  V6fUltimate,
  V6dDeepResearch,
  V6eThinkingMode,
  // V7 variants
  V7aFeedbackBased,
  // V8 variants
  V8aFeedbackBased,
  // V9 variants
  V9aFeedbackBased,
  V9bFeedbackBased,
  V9cFeedbackBased,
  V9dFeedbackBased,
  V9ZeroFrictionFlow,
  // Ultimate variants
  UltimateV7Flow,
  UltimateBest36Flow,
  GoldenFlowV10,
  V2ArchetypFlow,
  UltimateChFlow,
  // Swiss Premium Flows
  SwissLightningFlow,
  SwissPremiumChoiceFlow,
  SwissConciergeHybridFlow,
  // Multi variants
  MultiAFeedbackBased,
  // ChatGPT Flows
  ChatGPTFlow1ZeroFriction,
  ChatGPTFlow2SocialProof,
  ChatGPTFlow3GuidedChat,
} from '@/components/calculator-variants';

import { MultiStepCalculator } from '@/components/homepage/MultiStepCalculator';
import { VideoFirstCalculator } from '@/components/video-first-v4/VideoFirstCalculator';
import { MarketplaceWizard } from '@/components/marketplace-v5/MarketplaceWizard';
import { UltimateWizard } from '@/components/ultimate-v6/UltimateWizard';
import { SwissMoveWizard } from '@/components/swissmove-v7/SwissMoveWizard';
import { DecisionFreeWizard } from '@/components/decisionfree-v8/DecisionFreeWizard';
import { ZeroFrictionWizard } from '@/components/zerofriction-v9/ZeroFrictionWizard';
/**
 * Complete mapping of all flow variant IDs to their components
 * 
 * IMPORTANT: When adding a new flow variant:
 * 1. Add it to SUB_VARIANT_CONFIGS in src/data/flowConfigs.ts
 * 2. Create the component in src/components/calculator-variants/
 * 3. Export it from src/components/calculator-variants/index.ts
 * 4. Add the mapping here
 */
export const FLOW_COMPONENT_REGISTRY: Record<string, ComponentType> = {
  // ========== V1 - Control Flow ==========
  'umzugsofferten-v1': MultiStepCalculator,
  'v1': MultiStepCalculator,
  'v1a': V1aFeedbackBased,
  'v1b': V1bFeedbackBased,
  'v1c': V1cFeedbackBased,
  'v1d': V1dFeedbackBased,
  'v1e': V1eFeedbackBased,
  
  // ========== V2 - Premium Full-Journey ==========
  'umzugsofferten-v2': V2aProgressEnhanced,
  'v2': V2aProgressEnhanced,
  'v2a': V2aProgressEnhanced,
  'v2b': V2bFeedbackBased,
  'v2c': V2cTrustFocused,
  'v2d': V2dFeedbackBased,
  'v2e': V2eExperimental,
  'v2f': V2fFeedbackBased,
  
  // ========== V3 - Mobile-First (Base Versions Only) ==========
  'umzugsofferten-v3': V3aMobileFirst,
  'v3': V3aMobileFirst,
  'v3a': V3aMobileFirst,
  'v3b': V3bSwipeNavigation,
  'v3c': V3cBottomSheet,
  'v3d': V3dThumbZone,
  'v3e': V3eFullscreen,
  
  // ========== V4 - Video-First AI ==========
  // Baseline should match /umzugsofferten-v4 (VideoFirstCalculator), not the V4a test variant.
  'umzugsofferten-v4': VideoFirstCalculator,
  'v4': VideoFirstCalculator,
  'v4a': V4aUrgencyBased,
  'v4b': V4bSocialProof,
  'v4c': V4cValueFirst,
  'v4d': V4dGamified,
  'v4e': V4eMinimalFriction,
  'v4f': V4fFeedbackBased,
  
  // ========== V5 - Marketplace Wizard ==========
  // Baseline uses actual MarketplaceWizard, not accessibility variants
  'umzugsofferten-v5': MarketplaceWizard,
  'v5': MarketplaceWizard,
  'v5a': V5aHighContrast,
  'v5b': V5bScreenReader,
  'v5c': V5cKeyboardNav,
  'v5d': V5dFeedbackBased,
  'v5e': V5eReducedMotion,
  'v5f': V5fFeedbackBased,
  
  // ========== V6 - Ultimate (6-Tier) ==========
  // Baseline uses actual UltimateWizard
  'umzugsofferten-v6': UltimateWizard,
  'v6': UltimateWizard,
  'v6a': V6aFeedbackBased,
  'v6b': V6bChatGPT,
  'v6c': V6cGemini,
  'v6d': V6dDeepResearch,
  'v6e': V6eThinkingMode,
  'v6f': V6fUltimate,
  
  // ========== V7 - SwissMove (90s) ==========
  // Baseline uses actual SwissMoveWizard
  'umzugsofferten-v7': SwissMoveWizard,
  'v7': SwissMoveWizard,
  'v7a': V7aFeedbackBased,
  
  // ========== V8 - Decision-Free ==========
  // Baseline uses actual DecisionFreeWizard
  'umzugsofferten-v8': DecisionFreeWizard,
  'v8': DecisionFreeWizard,
  'v8a': V8aFeedbackBased,
  
  // ========== V9 - Zero Friction ⭐ ==========
  // Baseline uses actual ZeroFrictionWizard
  'umzugsofferten-v9': ZeroFrictionWizard,
  'v9': ZeroFrictionWizard,
  'v9a': V9aFeedbackBased,
  'v9b': V9bFeedbackBased,
  'v9c': V9cFeedbackBased,
  'v9d': V9dFeedbackBased,
  'v9-zero-friction': V9ZeroFrictionFlow,
  
  // ========== Ultimate - Combined Best Practices ==========
  'ultimate-v7': UltimateV7Flow,
  'ultimate-best36': UltimateBest36Flow,
  'golden-flow-v10': GoldenFlowV10,
  
  // ========== Swiss Premium Flows ==========
  'swiss-lightning': SwissLightningFlow,
  'swiss-premium-choice': SwissPremiumChoiceFlow,
  'swiss-concierge-hybrid': SwissConciergeHybridFlow,
  
  // ========== Multi - Combined ==========
  'multi-a': MultiAFeedbackBased,
  
  // ========== ChatGPT Optimized Flows ==========
  'chatgpt-flow-1': ChatGPTFlow1ZeroFriction,
  'chatgpt-flow-2': ChatGPTFlow2SocialProof,
  'chatgpt-flow-3': ChatGPTFlow3GuidedChat,
  
  // ========== V1f/V1g - New Feedback Variants ==========
  'v1f': V1fStickyCTATrust,
  'v1g': V1gInputUX,
  
  // ========== V2 Archetyp & Ultimate CH ==========
  'v2-archetyp': V2ArchetypFlow,
  'ultimate-ch': UltimateChFlow,
  
  // ========== Main Config Aliases ==========
  'umzugsofferten-v2e': V2eExperimental,
  'umzugsofferten-ultimate-best36': UltimateBest36Flow,
};

/**
 * Get a component for a flow variant ID
 * Returns undefined if not found
 */
export function getFlowComponent(variantId: string): ComponentType | undefined {
  return FLOW_COMPONENT_REGISTRY[variantId.toLowerCase()];
}

/**
 * Check if a flow variant has a registered component
 */
export function hasFlowComponent(variantId: string): boolean {
  return variantId.toLowerCase() in FLOW_COMPONENT_REGISTRY;
}

/**
 * Get all registered flow variant IDs
 */
export function getAllRegisteredVariants(): string[] {
  return Object.keys(FLOW_COMPONENT_REGISTRY);
}

/**
 * Validate that all variants in SUB_VARIANT_CONFIGS have components
 * Call this in development to catch missing components early
 */
export function validateComponentRegistry(subVariantConfigs: Record<string, unknown>): string[] {
  const missingComponents: string[] = [];
  
  for (const variantId of Object.keys(subVariantConfigs)) {
    if (!hasFlowComponent(variantId)) {
      missingComponents.push(variantId);
    }
  }
  
  return missingComponents;
}
