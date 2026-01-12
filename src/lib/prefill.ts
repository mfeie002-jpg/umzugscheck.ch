/**
 * Prefill Bridge - Robuste uc_prefill Logik
 * 
 * Standardisiertes Schema für LocalStorage Prefill:
 * - from: PLZ oder "PLZ Ort"
 * - to: PLZ oder "PLZ Ort"
 * - size: Wohnungsgrösse (optional)
 * - service: Service-Typ (optional)
 * - source: Herkunft ("home-hero", "landing", "canton-xxx")
 * - createdAt: Timestamp
 */

export interface PrefillData {
  from?: string;
  to?: string;
  size?: string;
  service?: string;
  services?: string[];
  source: string;
  createdAt: number;
  timestamp?: number; // Legacy support
}

export interface ParsedPrefill {
  fromPLZ: string;
  fromCity: string;
  toPLZ: string;
  toCity: string;
  size?: string;
  service?: string;
  services?: string[];
  source: string;
  isValid: boolean;
  isComplete: boolean;
  age: number;
}

const PREFILL_KEY = 'uc_prefill';
const MAX_AGE_DAYS = 7;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

/**
 * Parse PLZ/Ort String
 * Handles: "8000", "8000 Zürich", "Zürich 8000", "Zürich"
 */
function parsePLZOrt(value: string): { plz: string; city: string } {
  if (!value) return { plz: '', city: '' };
  
  const trimmed = value.trim();
  
  // Match Swiss PLZ (4 digits)
  const plzMatch = trimmed.match(/\b(\d{4})\b/);
  const plz = plzMatch ? plzMatch[1] : '';
  
  // Remove PLZ to get city
  const city = trimmed.replace(/\b\d{4}\b/, '').trim();
  
  return { plz, city };
}

/**
 * Get prefill data from localStorage
 */
export function getPrefill(): ParsedPrefill | null {
  try {
    const raw = localStorage.getItem(PREFILL_KEY);
    if (!raw) return null;
    
    const data: PrefillData = JSON.parse(raw);
    
    // Support both createdAt and timestamp (legacy)
    const timestamp = data.createdAt || data.timestamp || 0;
    const age = Date.now() - timestamp;
    
    // Check if expired
    if (age > MAX_AGE_MS) {
      clearPrefill();
      return null;
    }
    
    const fromParsed = parsePLZOrt(data.from || '');
    const toParsed = parsePLZOrt(data.to || '');
    
    const isValid = !!(fromParsed.plz || fromParsed.city || toParsed.plz || toParsed.city);
    const isComplete = !!(fromParsed.plz && toParsed.plz);
    
    return {
      fromPLZ: fromParsed.plz,
      fromCity: fromParsed.city,
      toPLZ: toParsed.plz,
      toCity: toParsed.city,
      size: data.size,
      service: data.service,
      services: data.services,
      source: data.source || 'unknown',
      isValid,
      isComplete,
      age,
    };
  } catch {
    return null;
  }
}

/**
 * Set prefill data to localStorage
 */
export function setPrefill(data: Omit<PrefillData, 'createdAt'>): void {
  try {
    const prefill: PrefillData = {
      ...data,
      createdAt: Date.now(),
      timestamp: Date.now(), // Legacy support
    };
    localStorage.setItem(PREFILL_KEY, JSON.stringify(prefill));
  } catch {
    // Silent fail
  }
}

/**
 * Clear prefill data
 */
export function clearPrefill(): void {
  try {
    localStorage.removeItem(PREFILL_KEY);
  } catch {
    // Silent fail
  }
}

/**
 * Check if prefill exists and is valid
 */
export function hasPrefill(): boolean {
  const prefill = getPrefill();
  return prefill?.isValid ?? false;
}

/**
 * Get human-readable source name
 */
export function getSourceLabel(source: string): string {
  if (source === 'home-hero') return 'Startseite';
  if (source.includes('landing')) return 'Landingpage';
  if (source.includes('canton') || source.includes('bern') || source.includes('zurich')) {
    return 'Regionale Seite';
  }
  return 'Vorherige Eingabe';
}
