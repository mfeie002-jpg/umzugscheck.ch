/**
 * Swiss Data Validation Library
 * 
 * Provides validation functions for Swiss-specific data formats:
 * - PLZ (4-digit postal codes, cannot start with 0)
 * - Phone numbers (various Swiss formats)
 * - IBAN (Swiss bank accounts)
 */

/**
 * Validates Swiss postal code (PLZ)
 * Swiss PLZ are 4 digits, cannot start with 0
 * Range: 1000-9999
 */
export function validateSwissPLZ(plz: string): { valid: boolean; error?: string } {
  if (!plz || plz.trim() === '') {
    return { valid: false, error: 'Bitte PLZ eingeben' };
  }
  
  const cleaned = plz.trim();
  
  // Must be exactly 4 digits
  if (!/^\d{4}$/.test(cleaned)) {
    return { valid: false, error: 'Bitte eine 4-stellige PLZ eingeben' };
  }
  
  // Cannot start with 0 (Swiss PLZ range is 1000-9999)
  if (cleaned.startsWith('0')) {
    return { valid: false, error: 'Schweizer PLZ beginnt nicht mit 0' };
  }
  
  const numericPLZ = parseInt(cleaned, 10);
  if (numericPLZ < 1000 || numericPLZ > 9999) {
    return { valid: false, error: 'Bitte gültige Schweizer PLZ eingeben (1000-9999)' };
  }
  
  return { valid: true };
}

/**
 * Validates Swiss phone number
 * Accepts formats: 079 123 45 67, +41791234567, 0041 79..., etc.
 * Returns normalized E.164 format: +41XXXXXXXXX
 */
export function validateSwissPhone(phone: string): { 
  valid: boolean; 
  normalized?: string; 
  error?: string 
} {
  if (!phone || phone.trim() === '') {
    return { valid: false, error: 'Bitte Telefonnummer eingeben' };
  }
  
  // Remove all non-digit characters except leading +
  let cleaned = phone.trim();
  const hasPlus = cleaned.startsWith('+');
  cleaned = cleaned.replace(/[^\d]/g, '');
  
  // Handle different formats
  // 0791234567 -> Swiss mobile
  // 41791234567 -> Swiss with country code (no +)
  // 0041791234567 -> Swiss with 00 prefix
  
  // Remove leading 00 (international prefix)
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  }
  
  // If starts with 41, it's already country code
  if (cleaned.startsWith('41')) {
    cleaned = cleaned.substring(2);
  }
  
  // Remove leading 0 for Swiss format
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Now should be 9 digits (Swiss number without country code)
  if (cleaned.length !== 9) {
    return { 
      valid: false, 
      error: 'Bitte gültige Schweizer Telefonnummer eingeben' 
    };
  }
  
  // Swiss mobile numbers start with 7 (mobile) or 2/3/4/5/6/8 (landline)
  const firstDigit = cleaned.charAt(0);
  if (!['2', '3', '4', '5', '6', '7', '8'].includes(firstDigit)) {
    return { 
      valid: false, 
      error: 'Keine gültige Schweizer Vorwahl' 
    };
  }
  
  // Return normalized E.164 format
  return { 
    valid: true, 
    normalized: `+41${cleaned}` 
  };
}

/**
 * Validates Swiss email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Bitte E-Mail-Adresse eingeben' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { valid: false, error: 'Bitte gültige E-Mail-Adresse eingeben' };
  }
  
  return { valid: true };
}

/**
 * Validates name (min 2 characters)
 */
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Bitte Name eingeben' };
  }
  
  if (name.trim().length < 2) {
    return { valid: false, error: 'Name muss mindestens 2 Zeichen haben' };
  }
  
  return { valid: true };
}

/**
 * Hook to detect if device is mobile based on viewport width
 */
export function isMobileViewport(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Hook to detect if device is a touch device
 */
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
