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
  // V7 variants
  V7aFeedbackBased,
  // V8 variants
  V8aFeedbackBased,
  // V9 variants
  V9aFeedbackBased,
  V9bFeedbackBased,
  V9cFeedbackBased,
  V9dFeedbackBased,
  // Ultimate variants
  UltimateV7Flow,
  // Multi variants
  MultiAFeedbackBased,
} from '@/components/calculator-variants';

import { MultiStepCalculator } from '@/components/homepage/MultiStepCalculator';

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
  'umzugsofferten-v4': V4aUrgencyBased,
  'v4': V4aUrgencyBased,
  'v4a': V4aUrgencyBased,
  'v4b': V4bSocialProof,
  'v4c': V4cValueFirst,
  'v4d': V4dGamified,
  'v4e': V4eMinimalFriction,
  'v4f': V4fFeedbackBased,
  
  // ========== V5 - Marketplace Wizard ==========
  'umzugsofferten-v5': V5aHighContrast,
  'v5': V5aHighContrast,
  'v5a': V5aHighContrast,
  'v5b': V5bScreenReader,
  'v5c': V5cKeyboardNav,
  'v5d': V5dFeedbackBased,
  'v5e': V5eReducedMotion,
  'v5f': V5fFeedbackBased,
  
  // ========== V6 - Ultimate (6-Tier) ==========
  'umzugsofferten-v6': V6aFeedbackBased,
  'v6': V6aFeedbackBased,
  'v6a': V6aFeedbackBased,
  
  // ========== V7 - SwissMove (90s) ==========
  'umzugsofferten-v7': V7aFeedbackBased,
  'v7': V7aFeedbackBased,
  'v7a': V7aFeedbackBased,
  
  // ========== V8 - Decision-Free ==========
  'umzugsofferten-v8': V8aFeedbackBased,
  'v8': V8aFeedbackBased,
  'v8a': V8aFeedbackBased,
  
  // ========== V9 - Zero Friction ⭐ ==========
  'umzugsofferten-v9': V9aFeedbackBased,
  'v9': V9aFeedbackBased,
  'v9a': V9aFeedbackBased,
  'v9b': V9bFeedbackBased,
  'v9c': V9cFeedbackBased,
  'v9d': V9dFeedbackBased,
  
  // ========== Ultimate - Combined Best Practices ==========
  'ultimate-v7': UltimateV7Flow,
  
  // ========== Multi - Combined ==========
  'multi-a': MultiAFeedbackBased,
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
