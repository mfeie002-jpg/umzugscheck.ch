/**
 * Unified A/B Testing Configuration
 * 
 * Single source of truth for Navigation + Flow variants
 * All A/B tests go through this system
 */

import { NAV_VARIANTS, type NavConfig, type NavVariant } from './navigation-variants';

// =====================================================
// STORAGE KEYS - Single source of truth
// =====================================================
export const AB_STORAGE_KEYS = {
  // Navigation
  NAV_VARIANT: 'nav-variant',
  NAV_USER_ID: 'nav_ab_user_id',
  NAV_SESSION: 'nav_ab_session',
  NAV_ACTIVE: 'nav_ab_active',
  
  // Flow (Offerten funnel)
  FLOW_VARIANT: 'homepage_ab_variant',
  FLOW_USER_ID: 'homepage_ab_user_id',
  FLOW_SESSION: 'homepage_ab_session',
} as const;

// =====================================================
// FLOW VARIANTS
// =====================================================
export const FLOW_VARIANTS = {
  // Main flows (as routed in App.tsx)
  v1: { id: 'umzugsofferten-v1', name: 'V1 Control', path: '/umzugsofferten-v1' },
  v2: { id: 'umzugsofferten-v2', name: 'V2 Premium', path: '/umzugsofferten-v2' },
  v2e: { id: 'umzugsofferten-v2e', name: 'V2e Enhanced', path: '/umzugsofferten-v2e' },
  v3: { id: 'umzugsofferten-v3', name: 'V3 God Mode', path: '/umzugsofferten-v3' },
  v4: { id: 'umzugsofferten-v4', name: 'V4 Video AI', path: '/umzugsofferten-v4' },
  v5: { id: 'umzugsofferten-v5', name: 'V5 Marketplace', path: '/umzugsofferten-v5' },
  v6: { id: 'umzugsofferten-v6', name: 'V6 Ultimate', path: '/umzugsofferten-v6' },
  v7: { id: 'umzugsofferten-v7', name: 'V7 SwissMove', path: '/umzugsofferten-v7' },
  v8: { id: 'umzugsofferten-v8', name: 'V8 Decision-Free', path: '/umzugsofferten-v8' },
  v9: { id: 'umzugsofferten-v9', name: 'V9 Zero Friction', path: '/umzugsofferten-v9' },

  // Special “ultimate” route used in production/tests
  ultimate: {
    id: 'umzugsofferten-ultimate-best36',
    name: 'Ultimate Best36',
    path: '/umzugsofferten-ultimate-best36',
  },
} as const;

export type FlowVariantKey = keyof typeof FLOW_VARIANTS;

// Default flow when no A/B test active
export const DEFAULT_FLOW = FLOW_VARIANTS.v1;

// =====================================================
// COMBINED NAV + FLOW PAIRINGS
// For when we want Nav and Flow to work together
// =====================================================
export interface ABTestPairing {
  id: string;
  name: string;
  navVariant: NavVariant;
  flowVariant: FlowVariantKey;
  description: string;
}

export const AB_PAIRINGS: ABTestPairing[] = [
  {
    id: 'control',
    name: 'Control (Standard)',
    navVariant: 'ultimate',
    flowVariant: 'v1',
    description: 'Standard Navigation + V1 Flow',
  },
  {
    id: 'conversion-focus',
    name: 'Conversion Focus',
    navVariant: 'variant-j',
    flowVariant: 'v2e',
    description: 'Conversion-Killer Nav + Enhanced Flow',
  },
  {
    id: 'mobile-first',
    name: 'Mobile First',
    navVariant: 'variant-e',
    flowVariant: 'ultimate',
    description: 'Mobile-First Nav + Ultimate Flow',
  },
];

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Generate unique IDs
export const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

// Get or create user ID (persistent)
export const getOrCreateUserId = (key: string): string => {
  if (typeof window === 'undefined') return generateUserId();
  
  let userId = localStorage.getItem(key);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(key, userId);
  }
  return userId;
};

// Get or create session ID (per browser session)
export const getOrCreateSessionId = (key: string): string => {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = sessionStorage.getItem(key);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(key, sessionId);
  }
  return sessionId;
};

// =====================================================
// UNIFIED STATE GETTERS
// =====================================================

export interface UnifiedABState {
  navVariant: NavConfig;
  flowVariant: typeof FLOW_VARIANTS[FlowVariantKey];
  navABActive: boolean;
  flowPath: string;
}

export const getUnifiedABState = (): UnifiedABState => {
  if (typeof window === 'undefined') {
    return {
      navVariant: NAV_VARIANTS[0],
      flowVariant: DEFAULT_FLOW,
      navABActive: false,
      flowPath: DEFAULT_FLOW.path,
    };
  }
  
  // Get Navigation Variant
  const navId = localStorage.getItem(AB_STORAGE_KEYS.NAV_VARIANT);
  const navVariant = NAV_VARIANTS.find(v => v.id === navId) || NAV_VARIANTS[0];
  
  // Get Flow Variant
  const flowId = localStorage.getItem(AB_STORAGE_KEYS.FLOW_VARIANT);
  const flowVariant = Object.values(FLOW_VARIANTS).find(v => v.id === flowId) || DEFAULT_FLOW;
  
  // Check if Nav A/B is active
  const navABActive = localStorage.getItem(AB_STORAGE_KEYS.NAV_ACTIVE) !== 'false';
  
  return {
    navVariant,
    flowVariant,
    navABActive,
    flowPath: flowVariant.path,
  };
};

// =====================================================
// UNIFIED STATE SETTERS
// =====================================================

export const setNavVariant = (variantId: NavVariant): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AB_STORAGE_KEYS.NAV_VARIANT, variantId);
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'nav', variantId } }));
};

export const setFlowVariant = (variantId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AB_STORAGE_KEYS.FLOW_VARIANT, variantId);
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'flow', variantId } }));
};

export const setNavABActive = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AB_STORAGE_KEYS.NAV_ACTIVE, active.toString());
};

// =====================================================
// RESET FUNCTIONS
// =====================================================

export const resetNavAB = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AB_STORAGE_KEYS.NAV_VARIANT);
  localStorage.removeItem(AB_STORAGE_KEYS.NAV_USER_ID);
  sessionStorage.removeItem(AB_STORAGE_KEYS.NAV_SESSION);
};

export const resetFlowAB = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AB_STORAGE_KEYS.FLOW_VARIANT);
  localStorage.removeItem(AB_STORAGE_KEYS.FLOW_USER_ID);
  sessionStorage.removeItem(AB_STORAGE_KEYS.FLOW_SESSION);
};

export const resetAllAB = (): void => {
  resetNavAB();
  resetFlowAB();
};

// =====================================================
// GET CURRENT FLOW PATH (for CTAs)
// =====================================================

export const getCurrentFlowPath = (): string => {
  const state = getUnifiedABState();
  return state.flowPath;
};
