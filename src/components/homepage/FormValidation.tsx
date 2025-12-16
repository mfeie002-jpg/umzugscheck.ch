import { memo, useState, useCallback } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ValidationRule {
  validate: (value: string) => boolean;
  message: string;
}

export interface FieldValidation {
  isValid: boolean;
  isTouched: boolean;
  error: string | null;
}

/**
 * Form validation utilities and components
 * Provides real-time field validation with visual feedback
 */

// Common validation rules
export const validationRules = {
  required: (message = "Dieses Feld ist erforderlich"): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),
  
  minLength: (length: number, message?: string): ValidationRule => ({
    validate: (value) => value.trim().length >= length,
    message: message || `Mindestens ${length} Zeichen erforderlich`,
  }),
  
  maxLength: (length: number, message?: string): ValidationRule => ({
    validate: (value) => value.trim().length <= length,
    message: message || `Maximal ${length} Zeichen erlaubt`,
  }),
  
  email: (message = "Bitte gültige E-Mail-Adresse eingeben"): ValidationRule => ({
    validate: (value) => {
      if (!value.trim()) return true; // Let required rule handle empty
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value.trim());
    },
    message,
  }),
  
  phone: (message = "Bitte gültige Telefonnummer eingeben"): ValidationRule => ({
    validate: (value) => {
      if (!value.trim()) return true; // Optional field
      // Swiss phone number format
      const phoneRegex = /^(\+41|0041|0)?[\s]?[1-9][\d\s]{7,}$/;
      return phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''));
    },
    message,
  }),
  
  postalCode: (message = "Bitte gültige PLZ eingeben"): ValidationRule => ({
    validate: (value) => {
      if (!value.trim()) return true;
      // Swiss postal code: 4 digits
      const postalRegex = /^\d{4}$/;
      const extracted = value.match(/\d{4}/);
      return extracted !== null || value.trim().length >= 2;
    },
    message,
  }),
};

// Validation hook
export const useFieldValidation = (rules: ValidationRule[]) => {
  const [state, setState] = useState<FieldValidation>({
    isValid: true,
    isTouched: false,
    error: null,
  });

  const validate = useCallback((value: string): boolean => {
    for (const rule of rules) {
      if (!rule.validate(value)) {
        setState({ isValid: false, isTouched: true, error: rule.message });
        return false;
      }
    }
    setState({ isValid: true, isTouched: true, error: null });
    return true;
  }, [rules]);

  const touch = useCallback(() => {
    setState(prev => ({ ...prev, isTouched: true }));
  }, []);

  const reset = useCallback(() => {
    setState({ isValid: true, isTouched: false, error: null });
  }, []);

  return { state, validate, touch, reset };
};

// Validation feedback component
interface ValidationFeedbackProps {
  validation: FieldValidation;
  className?: string;
}

export const ValidationFeedback = memo(function ValidationFeedback({
  validation,
  className,
}: ValidationFeedbackProps) {
  if (!validation.isTouched) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 text-xs mt-1.5 transition-all duration-200",
        validation.isValid ? "text-green-600" : "text-destructive",
        className
      )}
    >
      {validation.isValid ? (
        <>
          <CheckCircle className="w-3.5 h-3.5" />
          <span>Gültig</span>
        </>
      ) : (
        <>
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{validation.error}</span>
        </>
      )}
    </div>
  );
});

// Input wrapper with validation styling
interface ValidatedInputProps {
  validation: FieldValidation;
  children: React.ReactNode;
  className?: string;
}

export const ValidatedInputWrapper = memo(function ValidatedInputWrapper({
  validation,
  children,
  className,
}: ValidatedInputProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "transition-all duration-200",
          validation.isTouched && !validation.isValid && "[&_input]:border-destructive [&_input]:focus-visible:ring-destructive/50"
        )}
      >
        {children}
      </div>
      <ValidationFeedback validation={validation} />
    </div>
  );
});
