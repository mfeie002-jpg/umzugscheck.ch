import { useState, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';
import { z } from 'zod';

interface ValidatedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  schema: z.ZodType;
  value: string;
  onValueChange: (value: string) => void;
  label?: string;
  icon?: React.ReactNode;
  showSuccessIcon?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceMs?: number;
}

export const ValidatedInput = memo(function ValidatedInput({
  schema,
  value,
  onValueChange,
  label,
  icon,
  showSuccessIcon = true,
  validateOnBlur = true,
  validateOnChange = true,
  debounceMs = 300,
  className,
  ...props
}: ValidatedInputProps) {
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Debounced validation
  useEffect(() => {
    if (!validateOnChange || !touched) return;
    
    setIsValidating(true);
    const timer = setTimeout(() => {
      const result = schema.safeParse(value);
      if (result.success) {
        setError(null);
        setIsValid(true);
      } else {
        setError(result.error.errors[0]?.message || 'Ungültige Eingabe');
        setIsValid(false);
      }
      setIsValidating(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, schema, validateOnChange, touched, debounceMs]);

  const handleBlur = useCallback(() => {
    setTouched(true);
    if (validateOnBlur) {
      const result = schema.safeParse(value);
      if (result.success) {
        setError(null);
        setIsValid(true);
      } else {
        setError(result.error.errors[0]?.message || 'Ungültige Eingabe');
        setIsValid(false);
      }
    }
  }, [value, schema, validateOnBlur]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(e.target.value);
    // Clear error on typing if previously invalid
    if (error && validateOnChange) {
      setError(null);
    }
  }, [onValueChange, error, validateOnChange]);

  const showError = touched && error && !isValidating;
  const showSuccess = touched && isValid && showSuccessIcon && value.length > 0;

  return (
    <div className="space-y-2">
      {/* Issue #4, #22, #41, #42, #45: Enhanced label with better visual hierarchy */}
      {label && (
        <label className="text-sm font-semibold flex items-center gap-2 text-foreground">
          {icon}
          <span>{label}</span>
        </label>
      )}
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            "h-14 rounded-xl pr-10 transition-colors text-base",
            showError && "border-destructive focus-visible:ring-destructive/30",
            showSuccess && "border-green-500 focus-visible:ring-green-500/30",
            className
          )}
          {...props}
        />
        
        {/* Status Icon */}
        <AnimatePresence mode="wait">
          {showError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <AlertCircle className="w-5 h-5 text-destructive" />
            </motion.div>
          )}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {showError && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -5 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -5 }}
            className="text-xs text-destructive flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
});
