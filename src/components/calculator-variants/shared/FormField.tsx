/**
 * FormField - Consistent input field for all flows
 * 
 * Features:
 * - Label with proper association
 * - Optional icon on left side
 * - Error state with destructive border
 * - Min height h-12 (48px) for touch targets
 * - Consistent text size
 * - Real-time validation support
 */

import React, { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  icon?: React.ElementType;
  disabled?: boolean;
  required?: boolean;
  validate?: (value: string) => string | null;
  showValidation?: boolean;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error: externalError,
  autoComplete,
  inputMode,
  icon: Icon,
  disabled,
  required,
  validate,
  showValidation = true,
}: FormFieldProps) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  
  const error = externalError || internalError;
  const isValid = touched && !error && value.length > 0;

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setInternalError(validationError);
    }
  }, [validate, value]);

  const handleChange = useCallback((newValue: string) => {
    onChange(newValue);
    // Clear error on change if it was previously set
    if (internalError && validate) {
      const validationError = validate(newValue);
      setInternalError(validationError);
    }
  }, [onChange, internalError, validate]);

  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={cn(
            "h-12 text-base pr-10",
            Icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            isValid && showValidation && "border-green-500 focus-visible:ring-green-500"
          )}
        />
        {/* Validation indicator */}
        {showValidation && touched && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : error ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : null}
          </div>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="text-sm text-destructive flex items-center gap-1" role="alert">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
