import React, { Suspense, lazy, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PageLoadingFallback } from '@/components/ui/loading-fallback';
import { VARIANT_REGISTRY } from '@/components/calculator-variants';

// Main flow loaders - these are the REAL production flows
const mainFlowLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  'v2': () => import('@/components/premium-v2/PremiumCalculator').then(m => ({ default: m.PremiumCalculator })),
  'v3': () => import('@/components/god-mode-v3/GodModeCalculator').then(m => ({ default: m.GodModeCalculator })),
  'v4': () => import('@/components/video-first-v4/VideoFirstCalculator').then(m => ({ default: m.VideoFirstCalculator })),
  'v5': () => import('@/components/marketplace-v5/MarketplaceWizard').then(m => ({ default: m.MarketplaceWizard })),
  'v6': () => import('@/components/ultimate-v6/UltimateWizard').then(m => ({ default: m.UltimateWizard })),
  'v7': () => import('@/components/swissmove-v7/SwissMoveWizard').then(m => ({ default: m.SwissMoveWizard })),
  'v8': () => import('@/components/decisionfree-v8/DecisionFreeWizard').then(m => ({ default: m.DecisionFreeWizard })),
  'v9': () => import('@/components/zerofriction-v9/ZeroFrictionWizard').then(m => ({ default: m.ZeroFrictionWizard })),
};

// Sub-variant component loaders (feedback-based variants like v1a, v2f, v3g, etc.)
const subVariantLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  // V1 Variants
  'V1aFeedbackBased': () => import('@/components/calculator-variants/V1aFeedbackBased').then(m => ({ default: m.V1aFeedbackBased })),
  'V1bFeedbackBased': () => import('@/components/calculator-variants/V1bFeedbackBased').then(m => ({ default: m.V1bFeedbackBased })),
  'V1cFeedbackBased': () => import('@/components/calculator-variants/V1cFeedbackBased').then(m => ({ default: m.V1cFeedbackBased })),
  // V2 Variants
  'V2aProgressEnhanced': () => import('@/components/calculator-variants/V2aProgressEnhanced').then(m => ({ default: m.V2aProgressEnhanced })),
  'V2bFeedbackBased': () => import('@/components/calculator-variants/V2bFeedbackBased').then(m => ({ default: m.V2bFeedbackBased })),
  'V2cArchetypCalculator': () => import('@/components/calculator-variants/V2cArchetypCalculator').then(m => ({ default: m.V2cArchetypCalculator })),
  'V2cTrustFocused': () => import('@/components/calculator-variants/V2cTrustFocused').then(m => ({ default: m.V2cTrustFocused })),
  'V2dFeedbackBased': () => import('@/components/calculator-variants/V2dFeedbackBased').then(m => ({ default: m.V2dFeedbackBased })),
  'V2eExperimental': () => import('@/components/calculator-variants/V2eExperimental').then(m => ({ default: m.V2eExperimental })),
  'V2fFeedbackBased': () => import('@/components/calculator-variants/V2fFeedbackBased').then(m => ({ default: m.V2fFeedbackBased })),
  // V3 Variants - Base Versions Only
  'V3aMobileFirst': () => import('@/components/calculator-variants/V3aMobileFirst').then(m => ({ default: m.V3aMobileFirst })),
  'V3bSwipeNavigation': () => import('@/components/calculator-variants/V3bSwipeNavigation').then(m => ({ default: m.V3bSwipeNavigation })),
  'V3cBottomSheet': () => import('@/components/calculator-variants/V3cBottomSheet').then(m => ({ default: m.V3cBottomSheet })),
  'V3dThumbZone': () => import('@/components/calculator-variants/V3dThumbZone').then(m => ({ default: m.V3dThumbZone })),
  'V3eFullscreen': () => import('@/components/calculator-variants/V3eFullscreen').then(m => ({ default: m.V3eFullscreen })),
  // V4 Variants
  'V4aUrgencyBased': () => import('@/components/calculator-variants/V4aUrgencyBased').then(m => ({ default: m.V4aUrgencyBased })),
  'V4bSocialProof': () => import('@/components/calculator-variants/V4bSocialProof').then(m => ({ default: m.V4bSocialProof })),
  'V4cValueFirst': () => import('@/components/calculator-variants/V4cValueFirst').then(m => ({ default: m.V4cValueFirst })),
  'V4dGamified': () => import('@/components/calculator-variants/V4dGamified').then(m => ({ default: m.V4dGamified })),
  'V4eMinimalFriction': () => import('@/components/calculator-variants/V4eMinimalFriction').then(m => ({ default: m.V4eMinimalFriction })),
  'V4fFeedbackBased': () => import('@/components/calculator-variants/V4fFeedbackBased').then(m => ({ default: m.V4fFeedbackBased })),
  // V5 Variants
  'V5aHighContrast': () => import('@/components/calculator-variants/V5aHighContrast').then(m => ({ default: m.V5aHighContrast })),
  'V5bScreenReader': () => import('@/components/calculator-variants/V5bScreenReader').then(m => ({ default: m.V5bScreenReader })),
  'V5cKeyboardNav': () => import('@/components/calculator-variants/V5cKeyboardNav').then(m => ({ default: m.V5cKeyboardNav })),
  'V5dFeedbackBased': () => import('@/components/calculator-variants/V5dFeedbackBased').then(m => ({ default: m.V5dFeedbackBased })),
  'V5eReducedMotion': () => import('@/components/calculator-variants/V5eReducedMotion').then(m => ({ default: m.V5eReducedMotion })),
  'V5fFeedbackBased': () => import('@/components/calculator-variants/V5fFeedbackBased').then(m => ({ default: m.V5fFeedbackBased })),
  // V6 Variants
  'V6aFeedbackBased': () => import('@/components/calculator-variants/V6aFeedbackBased').then(m => ({ default: m.V6aFeedbackBased })),
  // V7 Variants
  'V7aFeedbackBased': () => import('@/components/calculator-variants/V7aFeedbackBased').then(m => ({ default: m.V7aFeedbackBased })),
  // V8 Variants
  'V8aFeedbackBased': () => import('@/components/calculator-variants/V8aFeedbackBased').then(m => ({ default: m.V8aFeedbackBased })),
  // V9 Variants
  'V9aFeedbackBased': () => import('@/components/calculator-variants/V9aFeedbackBased').then(m => ({ default: m.V9aFeedbackBased })),
  'V9bFeedbackBased': () => import('@/components/calculator-variants/V9bFeedbackBased').then(m => ({ default: m.V9bFeedbackBased })),
  'V9cFeedbackBased': () => import('@/components/calculator-variants/V9cFeedbackBased').then(m => ({ default: m.V9cFeedbackBased })),
  'V9dFeedbackBased': () => import('@/components/calculator-variants/V9dFeedbackBased').then(m => ({ default: m.V9dFeedbackBased })),
  // Multi Variants
  'MultiAFeedbackBased': () => import('@/components/calculator-variants/MultiAFeedbackBased').then(m => ({ default: m.MultiAFeedbackBased })),
};

/**
 * Dynamic Umzugsofferten Route Handler
 * 
 * Handles both main flows (v2, v3, v4...) and sub-variants (v2a, v3b, v9d...)
 * 
 * Main flows (v2, v3, etc.) load the production calculators:
 * - v2 → PremiumCalculator
 * - v3 → GodModeCalculator
 * - v4 → VideoFirstCalculator
 * - etc.
 * 
 * Sub-variants (v2a, v3b, etc.) load feedback-based variants from VARIANT_REGISTRY
 * 
 * Usage: /umzugsofferten-:variant (e.g., /umzugsofferten-v3, /umzugsofferten-v3a)
 */
const UmzugsoffertenDynamic: React.FC = () => {
  const { variant } = useParams<{ variant: string }>();
  
  // Normalize variant ID (lowercase, handle different formats)
  const normalizedVariant = useMemo(() => {
    if (!variant) return null;
    return variant.toLowerCase();
  }, [variant]);
  
  // Check if this is a main flow (v2, v3, v4, etc.) vs sub-variant (v2a, v3b, etc.)
  const isMainFlow = useMemo(() => {
    if (!normalizedVariant) return false;
    // Main flows are: v2, v3, v4, v5, v6, v7, v8, v9 (single digit after 'v')
    return /^v[2-9]$/.test(normalizedVariant);
  }, [normalizedVariant]);
  
  // Get the lazy-loaded component
  const Component = useMemo(() => {
    if (!normalizedVariant) return null;
    
    // For main flows, use the main flow loaders
    if (isMainFlow && mainFlowLoaders[normalizedVariant]) {
      console.log(`[UmzugsoffertenDynamic] Loading main flow: ${normalizedVariant}`);
      return lazy(mainFlowLoaders[normalizedVariant]);
    }
    
    // For sub-variants, use VARIANT_REGISTRY
    const registryEntry = VARIANT_REGISTRY[normalizedVariant];
    if (registryEntry) {
      const loader = subVariantLoaders[registryEntry.component];
      if (loader) {
        console.log(`[UmzugsoffertenDynamic] Loading sub-variant: ${normalizedVariant} → ${registryEntry.component}`);
        return lazy(loader);
      }
      console.warn(`No loader found for component: ${registryEntry.component}`);
    }
    
    return null;
  }, [normalizedVariant, isMainFlow]);
  
  // If variant not found, redirect to main umzugsofferten
  if (!Component) {
    console.warn(`[UmzugsoffertenDynamic] Variant not found: ${variant}, redirecting to /umzugsofferten`);
    return <Navigate to="/umzugsofferten" replace />;
  }
  
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      <Component />
    </Suspense>
  );
};

export default UmzugsoffertenDynamic;

// Export for type checking
export { UmzugsoffertenDynamic };
