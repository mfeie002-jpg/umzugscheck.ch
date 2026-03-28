import { z } from 'zod';

/**
 * Centralized form validation schemas using Zod
 * Provides consistent validation across all forms
 */

// Custom error messages in German
const errorMessages = {
  required: "Dieses Feld ist erforderlich",
  email: "Bitte gültige E-Mail-Adresse eingeben",
  phone: "Bitte gültige Telefonnummer eingeben",
  minLength: (min: number) => `Mindestens ${min} Zeichen erforderlich`,
  maxLength: (max: number) => `Maximal ${max} Zeichen erlaubt`,
  postalCode: "Bitte gültige Postleitzahl eingeben",
  date: "Bitte gültiges Datum wählen",
};

// Swiss phone number regex
const swissPhoneRegex = /^(\+41|0041|0)?[\s]?[1-9][\d\s]{7,}$/;

// Basic schemas
export const emailSchema = z
  .string()
  .trim()
  .min(1, errorMessages.required)
  .email(errorMessages.email)
  .max(255, errorMessages.maxLength(255));

export const phoneSchema = z
  .string()
  .trim()
  .optional()
  .refine(
    (val) => !val || swissPhoneRegex.test(val.replace(/[\s\-\(\)]/g, '')),
    errorMessages.phone
  );

export const phoneRequiredSchema = z
  .string()
  .trim()
  .min(1, errorMessages.required)
  .refine(
    (val) => swissPhoneRegex.test(val.replace(/[\s\-\(\)]/g, '')),
    errorMessages.phone
  );

export const nameSchema = z
  .string()
  .trim()
  .min(2, errorMessages.minLength(2))
  .max(100, errorMessages.maxLength(100));

export const postalCodeSchema = z
  .string()
  .trim()
  .min(1, errorMessages.required)
  .refine((val) => {
    // Either a 4-digit Swiss postal code or a city name (at least 2 chars)
    const postalMatch = val.match(/\d{4}/);
    return postalMatch !== null || val.length >= 2;
  }, errorMessages.postalCode);

// Multi-step calculator form schema
export const calculatorStep1Schema = z.object({
  fromLocation: postalCodeSchema,
  toLocation: postalCodeSchema,
});

export const calculatorStep2Schema = z.object({
  apartmentSize: z.string().min(1, "Bitte Wohnungsgrösse wählen"),
  selectedServices: z.array(z.string()).min(1, "Bitte mindestens einen Service wählen"),
});

export const calculatorStep3Schema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  moveDate: z.string().optional(),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Bitte Datenschutzerklärung akzeptieren" }),
  }),
});

// Full calculator form schema
export const calculatorFormSchema = z.object({
  fromLocation: postalCodeSchema,
  toLocation: postalCodeSchema,
  apartmentSize: z.string().min(1, "Bitte Wohnungsgrösse wählen"),
  selectedServices: z.array(z.string()).min(1, "Bitte mindestens einen Service wählen"),
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  moveDate: z.string().optional(),
  useVideoAI: z.boolean().optional(),
  privacyAccepted: z.literal(true, {
    errorMap: () => ({ message: "Bitte Datenschutzerklärung akzeptieren" }),
  }),
});

// Lead form schema (for Umzugsofferten page)
export const leadFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  fromPostal: postalCodeSchema,
  fromCity: z.string().min(1, errorMessages.required),
  toPostal: postalCodeSchema,
  toCity: z.string().min(1, errorMessages.required),
  moveDate: z.string().optional(),
  comments: z.string().max(1000, errorMessages.maxLength(1000)).optional(),
});

// Contact form schema
export const contactFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().trim().min(10, errorMessages.minLength(10)).max(1000, errorMessages.maxLength(1000)),
});

// Partner application form schema
export const partnerApplicationSchema = z.object({
  companyName: z.string().trim().min(2, errorMessages.minLength(2)).max(200, errorMessages.maxLength(200)),
  contactName: nameSchema,
  email: emailSchema,
  phone: phoneRequiredSchema,
  website: z.string().url("Bitte gültige URL eingeben").optional().or(z.literal('')),
  services: z.array(z.string()).min(1, "Bitte mindestens einen Service wählen"),
  regions: z.array(z.string()).min(1, "Bitte mindestens eine Region wählen"),
  message: z.string().max(1000, errorMessages.maxLength(1000)).optional(),
});

// Type exports
export type CalculatorFormData = z.infer<typeof calculatorFormSchema>;
export type LeadFormData = z.infer<typeof leadFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type PartnerApplicationData = z.infer<typeof partnerApplicationSchema>;

// Validation helper functions
export const validateField = <T extends z.ZodType>(
  schema: T,
  value: unknown
): { success: boolean; error?: string } => {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true };
  }
  return { success: false, error: result.error.errors[0]?.message };
};

export const validateForm = <T extends z.ZodType>(
  schema: T,
  data: unknown
): { success: boolean; errors?: Record<string, string> } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true };
  }
  
  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return { success: false, errors };
};

// Sanitization helpers
export const sanitizeInput = (value: string): string => {
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .slice(0, 1000); // Limit length
};

export const sanitizeEmail = (value: string): string => {
  return value.trim().toLowerCase().slice(0, 255);
};

export const sanitizePhone = (value: string): string => {
  return value.replace(/[^\d\s\+\-\(\)]/g, '').slice(0, 20);
};
