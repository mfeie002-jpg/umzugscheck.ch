/**
 * Flow Engine Validators
 * 
 * Pre-built Zod schemas for common Swiss form fields.
 */

import { z } from 'zod';

// Swiss PLZ (4 digits)
export const plzSchema = z.string()
  .min(4, 'Bitte 4-stellige PLZ eingeben')
  .max(4, 'PLZ muss 4 Stellen haben')
  .regex(/^\d{4}$/, 'Bitte gültige Schweizer PLZ eingeben');

// Swiss phone (with country code support)
export const phoneSchema = z.string()
  .min(10, 'Telefonnummer zu kurz')
  .regex(/^(\+41|0041|0)?[1-9]\d{8,9}$/, 'Bitte gültige Schweizer Telefonnummer eingeben');

// Email
export const emailSchema = z.string()
  .email('Bitte gültige E-Mail eingeben')
  .max(255, 'E-Mail zu lang');

// Name
export const nameSchema = z.string()
  .min(2, 'Name zu kurz')
  .max(100, 'Name zu lang')
  .regex(/^[a-zA-ZäöüÄÖÜéèêàâîôûçß\s\-']+$/, 'Bitte gültigen Namen eingeben');

// Date (not in past)
export const futureDateSchema = z.string()
  .refine((val) => {
    if (!val) return false;
    const date = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, 'Datum darf nicht in der Vergangenheit liegen');

// Rooms (0.5 to 10)
export const roomsSchema = z.string()
  .refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0.5 && num <= 10;
  }, 'Bitte Zimmerzahl zwischen 0.5 und 10 wählen');

// Required text
export const requiredTextSchema = z.string()
  .min(1, 'Dieses Feld ist erforderlich')
  .max(500, 'Text zu lang');

// Optional with default
export const optionalTextSchema = z.string().optional();

// Number range factory
export const numberRangeSchema = (min: number, max: number, message?: string) => 
  z.number()
    .min(min, message || `Wert muss mindestens ${min} sein`)
    .max(max, message || `Wert darf maximal ${max} sein`);

// Checkbox/consent
export const consentSchema = z.boolean()
  .refine((val) => val === true, 'Bitte bestätigen Sie die Bedingungen');

// Export all validators as object for easy access
export const validators = {
  plz: plzSchema,
  phone: phoneSchema,
  email: emailSchema,
  name: nameSchema,
  futureDate: futureDateSchema,
  rooms: roomsSchema,
  required: requiredTextSchema,
  optional: optionalTextSchema,
  numberRange: numberRangeSchema,
  consent: consentSchema,
};

export default validators;
