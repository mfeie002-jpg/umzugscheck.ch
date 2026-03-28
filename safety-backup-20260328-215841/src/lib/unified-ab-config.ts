/**
 * Unified A/B Testing Configuration
 * 
 * SINGLE SOURCE OF TRUTH for all A/B tests:
 * - Navigation Variants (Nav UI)
 * - Flow Variants (Offerten Funnel)
 * 
 * All components should use this config through useUnifiedAB hook.
 */

import { NAV_VARIANTS, type NavConfig, type NavVariant, VARIANT_ULTIMATE } from './navigation-variants';

// =====================================================
// STORAGE KEYS - Single source of truth
// =====================================================
export const AB_STORAGE_KEYS = {
  // Navigation
  NAV_VARIANT: 'nav-variant',
  NAV_AB_ACTIVE: 'nav_ab_active',
  
  // Flow (Offerten funnel)  
  FLOW_VARIANT: 'flow_ab_variant',
  FLOW_AB_ACTIVE: 'flow_ab_active',
  
  // User/Session tracking
  AB_USER_ID: 'ab_user_id',
  AB_SESSION_ID: 'ab_session_id',
} as const;

// =====================================================
// FLOW VARIANTS - All available flows
// =====================================================
export interface FlowVariant {
  id: string;
  name: string;
  path: string;
  description?: string;
}

export const FLOW_VARIANTS: Record<string, FlowVariant> = {
  // Main control - this is the DEFAULT
  control: { id: 'umzugsofferten', name: 'Control', path: '/umzugsofferten', description: 'Standard Control Flow' },
  
  // V1 Family - Control Flow
  v1: { id: 'umzugsofferten-v1', name: 'V1 Control', path: '/umzugsofferten-v1', description: 'V1 Control Flow' },
  v1a: { id: 'umzugsofferten-v1a', name: 'V1a Feedback', path: '/umzugsofferten-v1a', description: 'V1a Control Feedback' },
  v1b: { id: 'umzugsofferten-v1b', name: 'V1b ChatGPT', path: '/umzugsofferten-v1b', description: 'V1b ChatGPT Agent' },
  v1c: { id: 'umzugsofferten-v1c', name: 'V1c Strategic', path: '/umzugsofferten-v1c', description: 'V1c Archetyp Strategic' },
  v1d: { id: 'umzugsofferten-v1d', name: 'V1d Optimized', path: '/umzugsofferten-v1d', description: 'V1d Optimized Funnel' },
  v1e: { id: 'umzugsofferten-v1e', name: 'V1e Trust', path: '/umzugsofferten-v1e', description: 'V1e Trust Enhanced' },
  v1f: { id: 'umzugsofferten-v1f', name: 'V1f Sticky CTA', path: '/umzugsofferten-v1f', description: 'V1f Sticky CTA + Trust' },
  v1g: { id: 'umzugsofferten-v1g', name: 'V1g Input UX', path: '/umzugsofferten-v1g', description: 'V1g Input UX + Validation' },
  
  // V2 Family - Premium Full-Journey
  v2: { id: 'umzugsofferten-v2', name: 'V2 Premium', path: '/umzugsofferten-v2', description: 'Premium Full-Journey' },
  v2a: { id: 'umzugsofferten-v2a', name: 'V2a Progress', path: '/umzugsofferten-v2a', description: 'V2a Progress Enhanced' },
  v2b: { id: 'umzugsofferten-v2b', name: 'V2b Simplified', path: '/umzugsofferten-v2b', description: 'V2b Simplified Labels' },
  v2e: { id: 'umzugsofferten-v2e', name: 'V2e Chat', path: '/umzugsofferten-v2e', description: 'V2e Chat Funnel Enhanced' },
  
  // V3 Family - God Mode Mobile-First
  v3: { id: 'umzugsofferten-v3', name: 'V3 God Mode', path: '/umzugsofferten-v3', description: 'God Mode Flow' },
  v3a: { id: 'umzugsofferten-v3a', name: 'V3a Mobile', path: '/umzugsofferten-v3a', description: 'V3a Mobile First' },
  v3b: { id: 'umzugsofferten-v3b', name: 'V3b Swipe', path: '/umzugsofferten-v3b', description: 'V3b Swipe Navigation' },
  v3c: { id: 'umzugsofferten-v3c', name: 'V3c Bottom Sheet', path: '/umzugsofferten-v3c', description: 'V3c Bottom Sheet' },
  v3d: { id: 'umzugsofferten-v3d', name: 'V3d Thumb Zone', path: '/umzugsofferten-v3d', description: 'V3d Thumb Zone' },
  v3e: { id: 'umzugsofferten-v3e', name: 'V3e Fullscreen', path: '/umzugsofferten-v3e', description: 'V3e Fullscreen' },
  
  // V4 Family - Video-First
  v4: { id: 'umzugsofferten-v4', name: 'V4 Video AI', path: '/umzugsofferten-v4', description: 'Video AI Flow' },
  v4a: { id: 'umzugsofferten-v4a', name: 'V4a Urgency', path: '/umzugsofferten-v4a', description: 'V4a Urgency Based' },
  v4b: { id: 'umzugsofferten-v4b', name: 'V4b Social', path: '/umzugsofferten-v4b', description: 'V4b Social Proof' },
  v4c: { id: 'umzugsofferten-v4c', name: 'V4c Value', path: '/umzugsofferten-v4c', description: 'V4c Value First' },
  v4d: { id: 'umzugsofferten-v4d', name: 'V4d Gamified', path: '/umzugsofferten-v4d', description: 'V4d Gamified' },
  v4e: { id: 'umzugsofferten-v4e', name: 'V4e Minimal', path: '/umzugsofferten-v4e', description: 'V4e Minimal Friction' },
  
  // V5 Family - Marketplace
  v5: { id: 'umzugsofferten-v5', name: 'V5 Marketplace', path: '/umzugsofferten-v5', description: 'Marketplace Flow' },
  v5a: { id: 'umzugsofferten-v5a', name: 'V5a Contrast', path: '/umzugsofferten-v5a', description: 'V5a High Contrast' },
  v5b: { id: 'umzugsofferten-v5b', name: 'V5b Screen Reader', path: '/umzugsofferten-v5b', description: 'V5b Screen Reader' },
  v5c: { id: 'umzugsofferten-v5c', name: 'V5c Keyboard', path: '/umzugsofferten-v5c', description: 'V5c Keyboard Nav' },
  v5d: { id: 'umzugsofferten-v5d', name: 'V5d ChatGPT', path: '/umzugsofferten-v5d', description: 'V5d ChatGPT Feedback' },
  v5e: { id: 'umzugsofferten-v5e', name: 'V5e Motion', path: '/umzugsofferten-v5e', description: 'V5e Reduced Motion' },
  
  // V6 Family - Ultimate
  v6: { id: 'umzugsofferten-v6', name: 'V6 Ultimate', path: '/umzugsofferten-v6', description: 'Ultimate Flow' },
  
  // V7 Family - SwissMove
  v7: { id: 'umzugsofferten-v7', name: 'V7 SwissMove', path: '/umzugsofferten-v7', description: 'SwissMove Flow' },
  
  // V8 Family - Decision-Free
  v8: { id: 'umzugsofferten-v8', name: 'V8 Decision-Free', path: '/umzugsofferten-v8', description: 'Decision-Free Flow' },
  
  // V9 Family - Zero Friction
  v9: { id: 'umzugsofferten-v9', name: 'V9 Zero Friction', path: '/umzugsofferten-v9', description: 'Zero Friction Flow' },
  v9a: { id: 'umzugsofferten-v9a', name: 'V9a Variant', path: '/umzugsofferten-v9a', description: 'V9a Zero Friction Variant' },
  v9b: { id: 'umzugsofferten-v9b', name: 'V9b Variant', path: '/umzugsofferten-v9b', description: 'V9b Zero Friction Variant' },
  v9c: { id: 'umzugsofferten-v9c', name: 'V9c Variant', path: '/umzugsofferten-v9c', description: 'V9c Zero Friction Variant' },
  v9d: { id: 'umzugsofferten-v9d', name: 'V9d Variant', path: '/umzugsofferten-v9d', description: 'V9d Zero Friction Variant' },
  
  // Special flows
  ultimate: { 
    id: 'umzugsofferten-ultimate-best36', 
    name: 'Ultimate Best36', 
    path: '/umzugsofferten-ultimate-best36',
    description: 'Best of 36 variants combined'
  },
} as const;

export type FlowVariantKey = keyof typeof FLOW_VARIANTS;

// Default variants - use main /umzugsofferten route
export const DEFAULT_NAV = VARIANT_ULTIMATE;
export const DEFAULT_FLOW = FLOW_VARIANTS.control;

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

// Get or create user ID (persistent across sessions)
export const getOrCreateUserId = (): string => {
  if (typeof window === 'undefined') return generateUserId();
  
  let userId = localStorage.getItem(AB_STORAGE_KEYS.AB_USER_ID);
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem(AB_STORAGE_KEYS.AB_USER_ID, userId);
  }
  return userId;
};

// Get or create session ID (per browser session)
export const getOrCreateSessionId = (): string => {
  if (typeof window === 'undefined') return generateSessionId();
  
  let sessionId = sessionStorage.getItem(AB_STORAGE_KEYS.AB_SESSION_ID);
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(AB_STORAGE_KEYS.AB_SESSION_ID, sessionId);
  }
  return sessionId;
};

// =====================================================
// HASHING / BUCKETING (stable assignment)
// =====================================================
const hashToIndex = (input: string, modulo: number): number => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return modulo === 0 ? 0 : hash % modulo;
};

// =====================================================
// NAVIGATION A/B FUNCTIONS
// =====================================================

export const getNavVariant = (): NavConfig => {
  if (typeof window === 'undefined') return DEFAULT_NAV;

  // Check URL param first
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('nav');
  if (urlVariant) {
    const found = NAV_VARIANTS.find(v => v.id === urlVariant);
    if (found) {
      localStorage.setItem(AB_STORAGE_KEYS.NAV_VARIANT, urlVariant);
      return found;
    }
  }

  // Then check localStorage
  const stored = localStorage.getItem(AB_STORAGE_KEYS.NAV_VARIANT);
  if (stored) {
    const found = NAV_VARIANTS.find(v => v.id === stored);
    if (found) return found;
  }

  // If A/B is active and there's no assignment yet, assign a stable variant per user.
  if (isNavABActive()) {
    const userId = getOrCreateUserId();
    const index = hashToIndex(userId, NAV_VARIANTS.length);
    const selected = NAV_VARIANTS[index] ?? DEFAULT_NAV;
    localStorage.setItem(AB_STORAGE_KEYS.NAV_VARIANT, selected.id);
    return selected;
  }

  return DEFAULT_NAV;
};

export const setNavVariant = (variantId: NavVariant): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AB_STORAGE_KEYS.NAV_VARIANT, variantId);

  // New unified event
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'nav', variantId } }));
  // Backwards-compat for older listeners
  window.dispatchEvent(new CustomEvent('nav-variant-changed', { detail: variantId }));
};

export const isNavABActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  // Default OFF unless explicitly enabled.
  return localStorage.getItem(AB_STORAGE_KEYS.NAV_AB_ACTIVE) === 'true';
};

export const setNavABActive = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AB_STORAGE_KEYS.NAV_AB_ACTIVE, active.toString());
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'nav-toggle', active } }));
};

export const resetNavAB = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AB_STORAGE_KEYS.NAV_VARIANT);
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'nav-reset' } }));
};

// =====================================================
// FLOW A/B FUNCTIONS
// =====================================================

export const getFlowVariant = (): FlowVariant => {
  if (typeof window === 'undefined') return DEFAULT_FLOW;

  // Check URL param first
  const urlParams = new URLSearchParams(window.location.search);
  const urlVariant = urlParams.get('flow');
  if (urlVariant) {
    const found = Object.values(FLOW_VARIANTS).find(
      v => v.id === urlVariant || v.path === `/${urlVariant}`
    );
    if (found) {
      localStorage.setItem(AB_STORAGE_KEYS.FLOW_VARIANT, found.id);
      return found;
    }
  }

  // Then check localStorage
  const stored = localStorage.getItem(AB_STORAGE_KEYS.FLOW_VARIANT);
  if (stored) {
    const found = Object.values(FLOW_VARIANTS).find(v => v.id === stored);
    if (found) return found;
  }

  // If A/B is active and there's no assignment yet, assign a stable variant per user.
  if (isFlowABActive()) {
    const userId = getOrCreateUserId();
    const variants = Object.values(FLOW_VARIANTS);
    const index = hashToIndex(userId, variants.length);
    const selected = variants[index] ?? DEFAULT_FLOW;
    localStorage.setItem(AB_STORAGE_KEYS.FLOW_VARIANT, selected.id);
    return selected;
  }

  return DEFAULT_FLOW;
};

export const setFlowVariant = (variantId: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AB_STORAGE_KEYS.FLOW_VARIANT, variantId);
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'flow', variantId } }));
};

export const isFlowABActive = (): boolean => {
  if (typeof window === 'undefined') return false;
  // Default OFF unless explicitly enabled.
  return localStorage.getItem(AB_STORAGE_KEYS.FLOW_AB_ACTIVE) === 'true';
};

export const setFlowABActive = (active: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AB_STORAGE_KEYS.FLOW_AB_ACTIVE, active.toString());
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'flow-toggle', active } }));
};

export const resetFlowAB = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AB_STORAGE_KEYS.FLOW_VARIANT);
  window.dispatchEvent(new CustomEvent('ab-state-changed', { detail: { type: 'flow-reset' } }));
};

// Random assignment for A/B testing
export const assignRandomFlowVariant = (): FlowVariant => {
  const variants = Object.values(FLOW_VARIANTS);
  const randomIndex = Math.floor(Math.random() * variants.length);
  const selected = variants[randomIndex];
  setFlowVariant(selected.id);
  return selected;
};

// =====================================================
// UNIFIED STATE
// =====================================================

export interface UnifiedABState {
  navVariant: NavConfig;
  flowVariant: FlowVariant;
  navABActive: boolean;
  flowABActive: boolean;
  flowPath: string;
}

export const getUnifiedABState = (): UnifiedABState => {
  const navVariant = getNavVariant();
  const flowVariant = getFlowVariant();
  
  return {
    navVariant,
    flowVariant,
    navABActive: isNavABActive(),
    flowABActive: isFlowABActive(),
    flowPath: flowVariant.path,
  };
};

// Get current flow path (for CTAs)
export const getCurrentFlowPath = (): string => {
  return getFlowVariant().path;
};

// =====================================================
// RESET ALL
// =====================================================

export const resetAllAB = (): void => {
  resetNavAB();
  resetFlowAB();
};
