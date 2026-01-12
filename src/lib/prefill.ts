/**
 * Prefill Bridge - Robuste uc_prefill Logik
 * 
 * Standardisiertes Schema für LocalStorage Prefill:
 * - from: PLZ oder "PLZ Ort"
 * - to: PLZ oder "PLZ Ort"
 * - size: Wohnungsgrösse (optional)
 * - service: Service-Typ (optional)
 * - source: Herkunft ("home-hero", "landing", "canton-xxx", "service-xxx")
 * - createdAt: Timestamp
 * 
 * Context-Aware Features:
 * - Detects service pages (reinigung, entsorgung, etc.)
 * - Detects canton pages (zurich, bern, etc.)
 * - Auto-applies relevant defaults based on source
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
  // Context-aware fields
  autoSelectServices?: string[];
  cantonCode?: string;
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
  // Context-aware fields
  autoSelectServices: string[];
  cantonCode?: string;
  isServicePage: boolean;
  isCantonPage: boolean;
}

const PREFILL_KEY = 'uc_prefill';
const MAX_AGE_DAYS = 7;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

// Service mappings for auto-selection
const SERVICE_MAPPINGS: Record<string, string[]> = {
  'reinigung': ['reinigung'],
  'cleaning': ['reinigung'],
  'entsorgung': ['entsorgung'],
  'disposal': ['entsorgung'],
  'lagerung': ['lagerung'],
  'storage': ['lagerung'],
  'montage': ['montage'],
  'klavier': ['klavier'],
  'piano': ['klavier'],
  'firmenumzug': ['firmenumzug'],
  'business': ['firmenumzug'],
};

// Canton mappings for geo-targeting
const CANTON_MAPPINGS: Record<string, string> = {
  'zurich': 'ZH',
  'zuerich': 'ZH',
  'zh': 'ZH',
  'bern': 'BE',
  'be': 'BE',
  'basel': 'BS',
  'bs': 'BS',
  'aargau': 'AG',
  'ag': 'AG',
  'luzern': 'LU',
  'lu': 'LU',
  'stgallen': 'SG',
  'sg': 'SG',
  'genf': 'GE',
  'geneva': 'GE',
  'ge': 'GE',
  'waadt': 'VD',
  'vaud': 'VD',
  'vd': 'VD',
};

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
 * Detect auto-select services from source
 */
function detectAutoServices(source: string): string[] {
  const services: string[] = [];
  const sourceLower = source.toLowerCase();
  
  for (const [key, values] of Object.entries(SERVICE_MAPPINGS)) {
    if (sourceLower.includes(key)) {
      services.push(...values);
    }
  }
  
  return [...new Set(services)]; // Remove duplicates
}

/**
 * Detect canton code from source
 */
function detectCantonCode(source: string): string | undefined {
  const sourceLower = source.toLowerCase();
  
  for (const [key, code] of Object.entries(CANTON_MAPPINGS)) {
    if (sourceLower.includes(key)) {
      return code;
    }
  }
  
  return undefined;
}

/**
 * Get prefill data from localStorage (context-aware)
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
    
    // Context-aware detection
    const source = data.source || 'unknown';
    const autoSelectServices = data.autoSelectServices || detectAutoServices(source);
    const cantonCode = data.cantonCode || detectCantonCode(source);
    
    return {
      fromPLZ: fromParsed.plz,
      fromCity: fromParsed.city,
      toPLZ: toParsed.plz,
      toCity: toParsed.city,
      size: data.size,
      service: data.service,
      services: data.services,
      source,
      isValid,
      isComplete,
      age,
      autoSelectServices,
      cantonCode,
      isServicePage: autoSelectServices.length > 0,
      isCantonPage: !!cantonCode,
    };
  } catch {
    return null;
  }
}

/**
 * Set prefill data to localStorage (with context)
 */
export function setPrefill(data: Omit<PrefillData, 'createdAt'>): void {
  try {
    const prefill: PrefillData = {
      ...data,
      createdAt: Date.now(),
      timestamp: Date.now(), // Legacy support
      // Auto-detect context from source
      autoSelectServices: data.autoSelectServices || detectAutoServices(data.source),
      cantonCode: data.cantonCode || detectCantonCode(data.source),
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
  if (source === 'home-hero' || source === 'homepage') return 'Startseite';
  if (source.includes('landing')) return 'Landingpage';
  if (source.includes('reinigung')) return 'Reinigungsseite';
  if (source.includes('entsorgung')) return 'Entsorgungsseite';
  if (source.includes('firmenumzug')) return 'Firmenumzug';
  if (source.includes('canton') || source.includes('bern') || source.includes('zurich')) {
    return 'Regionale Seite';
  }
  return 'Vorherige Eingabe';
}
