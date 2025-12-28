import React, { Suspense, lazy, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { PageLoadingFallback } from '@/components/ui/loading-fallback';
import { VARIANT_REGISTRY } from '@/components/calculator-variants';

// Dynamic component loader map
const componentLoaders: Record<string, () => Promise<{ default: React.ComponentType }>> = {
  // V1 Variants
  'V1aFeedbackBased': () => import('@/components/calculator-variants/V1aFeedbackBased').then(m => ({ default: m.V1aFeedbackBased })),
  'V1bFeedbackBased': () => import('@/components/calculator-variants/V1bFeedbackBased').then(m => ({ default: m.V1bFeedbackBased })),
  'V1cFeedbackBased': () => import('@/components/calculator-variants/V1cFeedbackBased').then(m => ({ default: m.V1cFeedbackBased })),
  // V2 Variants
  'V2aProgressEnhanced': () => import('@/components/calculator-variants/V2aProgressEnhanced').then(m => ({ default: m.V2aProgressEnhanced })),
  'V2bSimplifiedLabels': () => import('@/components/calculator-variants/V2bSimplifiedLabels').then(m => ({ default: m.V2bSimplifiedLabels })),
  'V2cTrustFocused': () => import('@/components/calculator-variants/V2cTrustFocused').then(m => ({ default: m.V2cTrustFocused })),
  'V2dSpeedOptimized': () => import('@/components/calculator-variants/V2dSpeedOptimized').then(m => ({ default: m.V2dSpeedOptimized })),
  'V2eExperimental': () => import('@/components/calculator-variants/V2eExperimental').then(m => ({ default: m.V2eExperimental })),
  'V2fFeedbackBased': () => import('@/components/calculator-variants/V2fFeedbackBased').then(m => ({ default: m.V2fFeedbackBased })),
  // V3 Variants
  'V3aMobileFirst': () => import('@/components/calculator-variants/V3aMobileFirst').then(m => ({ default: m.V3aMobileFirst })),
  'V3aFeedbackBased': () => import('@/components/calculator-variants/V3aFeedbackBased').then(m => ({ default: m.V3aFeedbackBased })),
  'V3bFeedbackBased': () => import('@/components/calculator-variants/V3bFeedbackBased').then(m => ({ default: m.V3bFeedbackBased })),
  'V3bSwipeNavigation': () => import('@/components/calculator-variants/V3bSwipeNavigation').then(m => ({ default: m.V3bSwipeNavigation })),
  'V3gFeedbackBased': () => import('@/components/calculator-variants/V3gFeedbackBased').then(m => ({ default: m.V3gFeedbackBased })),
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
  'V5dLargeText': () => import('@/components/calculator-variants/V5dLargeText').then(m => ({ default: m.V5dLargeText })),
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
 * Automatically loads the correct calculator variant based on URL parameter.
 * Falls back to /umzugsofferten if variant not found.
 * 
 * Usage: /umzugsofferten-:variant (e.g., /umzugsofferten-v3a, /umzugsofferten-v9d)
 */
const UmzugsoffertenDynamic: React.FC = () => {
  const { variant } = useParams<{ variant: string }>();
  
  // Normalize variant ID (lowercase, handle different formats)
  const normalizedVariant = useMemo(() => {
    if (!variant) return null;
    const lower = variant.toLowerCase();
    // Handle formats: v3a, v3a-pro, multi-a
    return lower;
  }, [variant]);
  
  // Look up the component in registry
  const registryEntry = useMemo(() => {
    if (!normalizedVariant) return null;
    return VARIANT_REGISTRY[normalizedVariant];
  }, [normalizedVariant]);
  
  // Get the lazy-loaded component
  const Component = useMemo(() => {
    if (!registryEntry) return null;
    const loader = componentLoaders[registryEntry.component];
    if (!loader) {
      console.warn(`No loader found for component: ${registryEntry.component}`);
      return null;
    }
    return lazy(loader);
  }, [registryEntry]);
  
  // If variant not found, redirect to main umzugsofferten
  if (!Component) {
    console.warn(`Variant not found: ${variant}, redirecting to /umzugsofferten`);
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
