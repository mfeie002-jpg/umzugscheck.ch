/**
 * Enhanced Form Validation Components
 * Real-time validation with Swiss-specific rules
 */
import { memo, useState, useCallback, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Swiss validation rules
const SWISS_PLZ_REGEX = /^[1-9]\d{3}$/;
const SWISS_PHONE_REGEX = /^(\+41|0041|0)[1-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ValidationResult {
  isValid: boolean;
  error?: string;
  suggestion?: string;
}

// Validation functions
export const validateSwissPlz = (value: string): ValidationResult => {
  const cleaned = value.replace(/\s/g, '');
  if (!cleaned) return { isValid: false, error: 'PLZ ist erforderlich' };
  if (!SWISS_PLZ_REGEX.test(cleaned)) {
    return { isValid: false, error: 'Bitte gültige Schweizer PLZ eingeben (z.B. 8001)' };
  }
  return { isValid: true };
};

export const validateSwissPhone = (value: string): ValidationResult => {
  const cleaned = value.replace(/[\s\-\(\)]/g, '');
  if (!cleaned) return { isValid: false, error: 'Telefonnummer ist erforderlich' };
  if (!SWISS_PHONE_REGEX.test(cleaned)) {
    return { isValid: false, error: 'Bitte gültige Schweizer Telefonnummer eingeben' };
  }
  return { isValid: true };
};

export const validateEmail = (value: string): ValidationResult => {
  if (!value) return { isValid: false, error: 'E-Mail ist erforderlich' };
  if (!EMAIL_REGEX.test(value)) {
    return { isValid: false, error: 'Bitte gültige E-Mail-Adresse eingeben' };
  }
  
  // Common typo detection
  const commonTypos: Record<string, string> = {
    'gmial.com': 'gmail.com',
    'gmai.com': 'gmail.com',
    'hotmai.com': 'hotmail.com',
    'outloo.com': 'outlook.com',
  };
  
  const domain = value.split('@')[1]?.toLowerCase();
  if (domain && commonTypos[domain]) {
    return { 
      isValid: true, 
      suggestion: `Meinten Sie ${value.split('@')[0]}@${commonTypos[domain]}?`
    };
  }
  
  return { isValid: true };
};

export const validateName = (value: string): ValidationResult => {
  if (!value || value.trim().length < 2) {
    return { isValid: false, error: 'Name ist erforderlich (min. 2 Zeichen)' };
  }
  if (/\d/.test(value)) {
    return { isValid: false, error: 'Name darf keine Zahlen enthalten' };
  }
  return { isValid: true };
};

// Validated Input Component
interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  validationType?: 'plz' | 'phone' | 'email' | 'name' | 'custom';
  customValidator?: (value: string) => ValidationResult;
  showValidation?: boolean;
  onValidChange?: (isValid: boolean) => void;
  label?: string;
  hint?: string;
}

export const ValidatedInputEnhanced = forwardRef<HTMLInputElement, ValidatedInputProps>(
  function ValidatedInputEnhanced({
    validationType = 'custom',
    customValidator,
    showValidation = true,
    onValidChange,
    label,
    hint,
    className,
    value,
    onChange,
    onBlur,
    ...props
  }, ref) {
    const [touched, setTouched] = useState(false);
    const [validation, setValidation] = useState<ValidationResult>({ isValid: false });
    
    const validate = useCallback((val: string): ValidationResult => {
      switch (validationType) {
        case 'plz': return validateSwissPlz(val);
        case 'phone': return validateSwissPhone(val);
        case 'email': return validateEmail(val);
        case 'name': return validateName(val);
        case 'custom': return customValidator?.(val) || { isValid: true };
        default: return { isValid: true };
      }
    }, [validationType, customValidator]);
    
    useEffect(() => {
      const result = validate(String(value || ''));
      setValidation(result);
      onValidChange?.(result.isValid);
    }, [value, validate, onValidChange]);
    
    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setTouched(true);
      onBlur?.(e);
    }, [onBlur]);
    
    const showError = touched && !validation.isValid && validation.error;
    const showSuccess = touched && validation.isValid && String(value || '').length > 0;
    const showSuggestion = validation.suggestion;
    
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            {label}
            {hint && (
              <span className="text-xs text-muted-foreground font-normal">({hint})</span>
            )}
          </label>
        )}
        
        <div className="relative">
          <Input
            ref={ref}
            value={value}
            onChange={onChange}
            onBlur={handleBlur}
            className={cn(
              "pr-10 transition-colors",
              showError && "border-destructive focus-visible:ring-destructive/50",
              showSuccess && "border-green-500 focus-visible:ring-green-500/50",
              className
            )}
            aria-invalid={showError ? 'true' : 'false'}
            aria-describedby={showError ? `${props.id}-error` : undefined}
            {...props}
          />
          
          {/* Validation Icon */}
          <AnimatePresence mode="wait">
            {showValidation && touched && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showSuccess ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : showError ? (
                  <AlertCircle className="w-5 h-5 text-destructive" />
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Error/Suggestion Messages */}
        <AnimatePresence mode="wait">
          {showError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              id={`${props.id}-error`}
              className="text-xs text-destructive flex items-center gap-1"
              role="alert"
            >
              <AlertCircle className="w-3 h-3" />
              {validation.error}
            </motion.p>
          )}
          
          {showSuggestion && !showError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1"
            >
              <Info className="w-3 h-3" />
              {validation.suggestion}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

// Form validation hook
export const useFormValidation = (validationRules: Record<string, (value: string) => ValidationResult>) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const validateField = useCallback((name: string, value: string) => {
    const rule = validationRules[name];
    if (!rule) return true;
    
    const result = rule(value);
    setErrors(prev => ({
      ...prev,
      [name]: result.error || ''
    }));
    return result.isValid;
  }, [validationRules]);
  
  const touchField = useCallback((name: string) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  const validateAll = useCallback((values: Record<string, string>) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    Object.entries(validationRules).forEach(([name, rule]) => {
      const result = rule(values[name] || '');
      if (!result.isValid) {
        newErrors[name] = result.error || 'Ungültig';
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
    return isValid;
  }, [validationRules]);
  
  const getFieldProps = useCallback((name: string) => ({
    error: touched[name] ? errors[name] : undefined,
    onBlur: () => touchField(name)
  }), [errors, touched, touchField]);
  
  return {
    errors,
    touched,
    validateField,
    touchField,
    validateAll,
    getFieldProps,
    isValid: Object.values(errors).every(e => !e)
  };
};

export default ValidatedInputEnhanced;
