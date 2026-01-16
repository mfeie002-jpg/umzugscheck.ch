/**
 * Swiss-Specific Form Validators
 * 
 * Validates Swiss formats for:
 * - PLZ (Postleitzahl: 1000-9999)
 * - Phone numbers (Swiss mobile/landline)
 * - Email
 * - Names
 * - Move dates
 */

import { z } from "zod";

// Swiss PLZ: 4 digits, 1000-9999
export const swissPlzSchema = z
  .string()
  .regex(/^[1-9]\d{3}$/, "Bitte geben Sie eine gültige PLZ ein (z.B. 8001)")
  .transform(val => val.trim());

// Swiss phone: +41 or 0 prefix
export const swissPhoneSchema = z
  .string()
  .transform(val => val.replace(/\s/g, '').replace(/-/g, ''))
  .refine(
    val => /^(\+41|0041|0)[1-9]\d{8}$/.test(val),
    "Bitte geben Sie eine gültige Schweizer Telefonnummer ein"
  );

// Email with common typo detection
const commonDomainTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'hotmal.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'yahooo.com': 'yahoo.com',
};

export const emailSchema = z
  .string()
  .email("Bitte geben Sie eine gültige E-Mail-Adresse ein")
  .transform(val => val.toLowerCase().trim())
  .refine(val => {
    const domain = val.split('@')[1];
    return !commonDomainTypos[domain];
  }, val => {
    const domain = val.split('@')[1];
    const suggestion = commonDomainTypos[domain];
    return { message: `Meinten Sie ${val.replace(domain, suggestion)}?` };
  });

// Name validation (min 2 chars, no numbers)
export const nameSchema = z
  .string()
  .min(2, "Name muss mindestens 2 Zeichen haben")
  .max(100, "Name ist zu lang")
  .regex(/^[a-zA-ZäöüÄÖÜàéèêëïîôùûçñ\s\-'.]+$/, "Name enthält ungültige Zeichen");

// Move date validation (must be in future, within 6 months)
export const moveDateSchema = z
  .string()
  .refine(val => {
    const date = new Date(val);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return date >= now;
  }, "Das Umzugsdatum muss in der Zukunft liegen")
  .refine(val => {
    const date = new Date(val);
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 12);
    return date <= sixMonthsFromNow;
  }, "Bitte wählen Sie ein Datum innerhalb der nächsten 12 Monate");

// Room count validation
export const roomCountSchema = z
  .number()
  .min(1, "Mindestens 1 Zimmer")
  .max(20, "Maximal 20 Zimmer")
  .or(z.string().transform(val => parseFloat(val)))
  .pipe(z.number().min(1).max(20));

// Combined lead form schema
export const leadFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: swissPhoneSchema.optional(),
  fromPlz: swissPlzSchema,
  toPlz: swissPlzSchema,
  moveDate: moveDateSchema.optional(),
  rooms: roomCountSchema.optional(),
  message: z.string().max(1000).optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// Real-time validation helpers
export const validateSwissPlz = (value: string): { valid: boolean; error?: string } => {
  const result = swissPlzSchema.safeParse(value);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
};

export const validateSwissPhone = (value: string): { valid: boolean; error?: string } => {
  if (!value) return { valid: true }; // Optional
  const result = swissPhoneSchema.safeParse(value);
  return result.success 
    ? { valid: true } 
    : { valid: false, error: result.error.errors[0]?.message };
};

export const validateEmail = (value: string): { valid: boolean; error?: string; suggestion?: string } => {
  const result = emailSchema.safeParse(value);
  if (result.success) return { valid: true };
  
  const error = result.error.errors[0];
  if (error?.message.startsWith('Meinten Sie')) {
    return { valid: false, suggestion: error.message };
  }
  return { valid: false, error: error?.message };
};

// Format helpers
export const formatSwissPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('41')) {
    return `+41 ${cleaned.slice(2, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};

export const formatPlz = (plz: string): string => {
  return plz.replace(/\D/g, '').slice(0, 4);
};
