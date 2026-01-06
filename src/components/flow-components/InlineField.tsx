/**
 * InlineField Component - UX Compliance Checklist:
 * ✅ Mobile-first with large touch targets (h-12/h-14)
 * ✅ Inline validation after blur (not aggressive)
 * ✅ Visual feedback: error, success states
 * ✅ Proper inputMode for keyboards
 * ✅ Clear labels with required/optional indicators
 * ✅ Error messages disappear immediately on correction
 */

import React, { memo, useState, useCallback, InputHTMLAttributes, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InlineFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  /** Field label */
  label: string;
  /** Field name/id */
  name: string;
  /** Current value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Icon to show in field */
  icon?: ReactNode;
  /** Help text */
  helpText?: string;
  /** Is field required? */
  required?: boolean;
  /** Custom validation function (returns error message or empty string) */
  validate?: (value: string) => string;
  /** Size variant */
  fieldSize?: 'default' | 'lg';
  /** Show success state when valid */
  showSuccess?: boolean;
}

export const InlineField = memo(function InlineField({
  label,
  name,
  value,
  onChange,
  icon,
  helpText,
  required = false,
  validate,
  fieldSize = 'lg',
  showSuccess = true,
  className,
  ...inputProps
}: InlineFieldProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');

  // Validate on blur (not aggressive)
  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate && value) {
      const validationError = validate(value);
      setError(validationError);
    } else if (required && !value) {
      setError('Dieses Feld ist erforderlich');
    } else {
      setError('');
    }
  }, [validate, value, required]);

  // Clear error immediately when user types valid value
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    // Only clear error if touched and value becomes valid
    if (touched && error) {
      if (validate) {
        const validationError = validate(newValue);
        if (!validationError) setError('');
      } else if (required && newValue) {
        setError('');
      }
    }
  }, [onChange, touched, error, validate, required]);

  const hasError = touched && error;
  const isValid = touched && value && !error;
  const showValidState = showSuccess && isValid;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Label */}
      <Label 
        htmlFor={name} 
        className={cn(
          "text-sm sm:text-base font-medium flex items-center gap-2",
          hasError && "text-destructive"
        )}
      >
        {icon && <span className="text-primary">{icon}</span>}
        {label}
        {required && <span className="text-destructive">*</span>}
        {!required && <span className="text-muted-foreground text-xs">(optional)</span>}
      </Label>

      {/* Input with status icons */}
      <div className="relative">
        <Input
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            fieldSize === 'lg' ? "h-12 sm:h-14 text-base sm:text-lg" : "h-10 text-sm",
            "pr-10",
            hasError && "border-destructive focus-visible:ring-destructive",
            showValidState && "border-success focus-visible:ring-success"
          )}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${name}-error` : helpText ? `${name}-help` : undefined}
          {...inputProps}
        />
        
        {/* Status Icon */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <AnimatePresence mode="wait">
            {hasError && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <AlertCircle className="h-5 w-5 text-destructive" />
              </motion.div>
            )}
            {showValidState && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <CheckCircle2 className="h-5 w-5 text-success" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Error / Help Text */}
      <AnimatePresence mode="wait">
        {hasError && (
          <motion.p
            id={`${name}-error`}
            key="error"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm text-destructive flex items-center gap-1"
            role="alert"
          >
            <AlertCircle className="h-3.5 w-3.5" />
            {error}
          </motion.p>
        )}
        {!hasError && helpText && (
          <motion.p
            id={`${name}-help`}
            key="help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-muted-foreground flex items-center gap-1"
          >
            <HelpCircle className="h-3 w-3" />
            {helpText}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});

// Common validation functions
export const validators = {
  email: (value: string): string => {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
  },
  phone: (value: string): string => {
    if (!value) return '';
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length >= 9 ? '' : 'Bitte geben Sie eine gültige Telefonnummer ein';
  },
  plz: (value: string): string => {
    if (!value) return '';
    const plzRegex = /^[1-9]\d{3}$/;
    return plzRegex.test(value) ? '' : 'Bitte geben Sie eine gültige PLZ ein (z.B. 8000)';
  },
  required: (value: string): string => {
    return value.trim() ? '' : 'Dieses Feld ist erforderlich';
  },
};

export default InlineField;
