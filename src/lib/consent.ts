/**
 * Consent Management for Analytics & Cookies
 * 
 * Stores user consent preferences in localStorage
 * Gates all analytics tracking based on consent status
 */

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  timestamp: number;
}

const CONSENT_KEY = 'uc_consent';
const DEBUG_KEY = 'uc_debug';

// Default consent - necessary only, analytics requires explicit opt-in
const defaultConsent: ConsentPreferences = {
  necessary: true,
  analytics: false,
  timestamp: 0
};

export function getConsent(): ConsentPreferences {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not read consent preferences');
  }
  return defaultConsent;
}

export function setConsent(preferences: Partial<ConsentPreferences>): void {
  try {
    const current = getConsent();
    const updated: ConsentPreferences = {
      ...current,
      ...preferences,
      timestamp: Date.now()
    };
    localStorage.setItem(CONSENT_KEY, JSON.stringify(updated));
    
    // Dispatch event for listeners
    window.dispatchEvent(new CustomEvent('consent-updated', { detail: updated }));
  } catch (e) {
    console.warn('Could not save consent preferences');
  }
}

export function acceptAll(): void {
  setConsent({ necessary: true, analytics: true });
}

export function acceptNecessaryOnly(): void {
  setConsent({ necessary: true, analytics: false });
}

export function hasAnalyticsConsent(): boolean {
  return getConsent().analytics === true;
}

export function hasConsentBeenGiven(): boolean {
  return getConsent().timestamp > 0;
}

// Debug mode utilities
export function isDebugMode(): boolean {
  try {
    return localStorage.getItem(DEBUG_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setDebugMode(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.setItem(DEBUG_KEY, 'true');
    } else {
      localStorage.removeItem(DEBUG_KEY);
    }
  } catch {
    // Ignore
  }
}

// Event log for debug overlay
interface DebugEvent {
  event: string;
  payload: Record<string, any>;
  timestamp: number;
}

const debugEvents: DebugEvent[] = [];
const MAX_DEBUG_EVENTS = 50;

export function logDebugEvent(event: string, payload: Record<string, any>): void {
  debugEvents.unshift({
    event,
    payload,
    timestamp: Date.now()
  });
  
  // Keep only last N events
  if (debugEvents.length > MAX_DEBUG_EVENTS) {
    debugEvents.pop();
  }
  
  // Dispatch for debug overlay
  window.dispatchEvent(new CustomEvent('debug-event', { 
    detail: { event, payload } 
  }));
}

export function getDebugEvents(): DebugEvent[] {
  return [...debugEvents];
}

export function clearDebugEvents(): void {
  debugEvents.length = 0;
}
