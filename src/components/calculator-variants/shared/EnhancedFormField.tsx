/**
 * EnhancedFormField - Improved input field with better UX
 * 
 * Features:
 * - Inline validation on blur
 * - Mobile-optimized inputMode/enterKeyHint
 * - Debounced onChange for autocomplete triggers
 * - Clear error state with accessible aria
 * - Min 48px touch target
 */

import React, { useState, useCallback, useId, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface EnhancedFormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  /** Validate on blur - return error message or undefined */
  validate?: (value: string) => string | undefined;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url';
  enterKeyHint?: 'enter' | 'done' | 'go' | 'next' | 'previous' | 'search' | 'send';
  icon?: React.ElementType;
  required?: boolean;
  disabled?: boolean;
  /** Debounce delay for onChange (ms) */
  debounceMs?: number;
  className?: string;
}

function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
}

export function EnhancedFormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  validate,
  placeholder,
  autoComplete,
  inputMode,
  enterKeyHint,
  icon: Icon,
  required,
  disabled,
  debounceMs = 0,
  className,
}: EnhancedFormFieldProps) {
  const id = useId();
  const errId = `${id}-err`;
  const [error, setError] = useState<string>();
  const [touched, setTouched] = useState(false);

  const handleChange = useCallback((newValue: string) => {
    onChange(newValue);
    // Clear error while typing
    if (error && touched) {
      setError(undefined);
    }
  }, [onChange, error, touched]);

  const debouncedChange = useDebouncedCallback(handleChange, debounceMs);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
    }
  }, [validate, value]);

  const actualChange = debounceMs > 0 ? debouncedChange : handleChange;

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
        )}
        
        <Input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={(e) => actualChange(e.target.value)}
          onBlur={handleBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          enterKeyHint={enterKeyHint}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errId : undefined}
          className={cn(
            'h-12 text-base rounded-xl transition-colors',
            Icon && 'pl-10',
            error && touched && 'border-destructive focus-visible:ring-destructive'
          )}
        />
      </div>
      
      {error && touched && (
        <p id={errId} className="text-xs text-destructive flex items-center gap-1" role="alert">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
