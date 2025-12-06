import { useState, useCallback } from 'react';
import { 
  isValidEmail, 
  isValidSwissPhone, 
  isValidSwissPostalCode,
  sanitizeInput 
} from '@/lib/security';

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationRules {
  required?: boolean;
  email?: boolean;
  phone?: boolean;
  postalCode?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

type FieldRules = Record<string, ValidationRules>;

/**
 * Hook for secure input validation with sanitization.
 */
export const useInputValidation = <T extends Record<string, string>>(
  initialValues: T,
  rules: FieldRules
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((field: string, value: string): string | null => {
    const fieldRules = rules[field];
    if (!fieldRules) return null;

    const trimmedValue = value.trim();

    if (fieldRules.required && !trimmedValue) {
      return 'Dieses Feld ist erforderlich';
    }

    if (trimmedValue) {
      if (fieldRules.email && !isValidEmail(trimmedValue)) {
        return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
      }

      if (fieldRules.phone && !isValidSwissPhone(trimmedValue)) {
        return 'Bitte geben Sie eine gültige Schweizer Telefonnummer ein';
      }

      if (fieldRules.postalCode && !isValidSwissPostalCode(trimmedValue)) {
        return 'Bitte geben Sie eine gültige Postleitzahl ein (4 Ziffern)';
      }

      if (fieldRules.minLength && trimmedValue.length < fieldRules.minLength) {
        return `Mindestens ${fieldRules.minLength} Zeichen erforderlich`;
      }

      if (fieldRules.maxLength && trimmedValue.length > fieldRules.maxLength) {
        return `Maximal ${fieldRules.maxLength} Zeichen erlaubt`;
      }

      if (fieldRules.pattern && !fieldRules.pattern.test(trimmedValue)) {
        return 'Ungültiges Format';
      }

      if (fieldRules.custom) {
        return fieldRules.custom(trimmedValue);
      }
    }

    return null;
  }, [rules]);

  const handleChange = useCallback((field: keyof T, value: string) => {
    // Sanitize input
    const sanitized = sanitizeInput(value);
    
    setValues(prev => ({ ...prev, [field]: sanitized }));
    
    // Validate on change if field was touched
    if (touched[field as string]) {
      const error = validateField(field as string, sanitized);
      setErrors(prev => ({
        ...prev,
        [field]: error || ''
      }));
    }
  }, [touched, validateField]);

  const handleBlur = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    const error = validateField(field as string, values[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error || ''
    }));
  }, [validateField, values]);

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};
    let isValid = true;

    for (const field of Object.keys(rules)) {
      newTouched[field] = true;
      const error = validateField(field, values[field as keyof T] || '');
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    }

    setTouched(newTouched);
    setErrors(newErrors);
    return isValid;
  }, [rules, validateField, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const getFieldProps = useCallback((field: keyof T) => ({
    value: values[field],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
      handleChange(field, e.target.value),
    onBlur: () => handleBlur(field),
    'aria-invalid': !!errors[field as string],
    'aria-describedby': errors[field as string] ? `${String(field)}-error` : undefined
  }), [values, errors, handleChange, handleBlur]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    getFieldProps,
    isValid: Object.keys(errors).every(key => !errors[key])
  };
};
