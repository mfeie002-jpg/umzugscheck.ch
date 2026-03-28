/**
 * Smart Form Validation Components
 * Inline validation with helpful Swiss-specific messages
 * Real-time feedback as user types
 */

import { memo, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Validation states
type ValidationState = 'idle' | 'validating' | 'valid' | 'invalid' | 'warning';

interface ValidationResult {
  state: ValidationState;
  message?: string;
  suggestion?: string;
}

interface SmartInputProps {
  value: string;
  onChange: (value: string) => void;
  validate: (value: string) => ValidationResult | Promise<ValidationResult>;
  label: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  helpText?: string;
  className?: string;
  icon?: ReactNode;
  debounceMs?: number;
}

export const SmartInput = memo(function SmartInput({
  value,
  onChange,
  validate,
  label,
  placeholder,
  type = 'text',
  required = false,
  helpText,
  className,
  icon,
  debounceMs = 300
}: SmartInputProps) {
  const [validation, setValidation] = useState<ValidationResult>({ state: 'idle' });
  const [isFocused, setIsFocused] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);

  const handleChange = useCallback(async (newValue: string) => {
    onChange(newValue);
    
    if (!newValue && !required) {
      setValidation({ state: 'idle' });
      return;
    }

    setValidation({ state: 'validating' });

    // Debounce validation
    const timeoutId = setTimeout(async () => {
      const result = await validate(newValue);
      setValidation(result);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [onChange, validate, required, debounceMs]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setHasBlurred(true);
  }, []);

  const showValidation = hasBlurred || validation.state === 'valid';

  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <input
          type={type}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            'w-full px-4 py-3 rounded-lg border bg-background transition-all duration-200',
            'focus:outline-none focus:ring-2',
            icon && 'pl-10',
            validation.state === 'valid' && showValidation && 'border-green-500 focus:ring-green-500/20',
            validation.state === 'invalid' && showValidation && 'border-destructive focus:ring-destructive/20',
            validation.state === 'warning' && showValidation && 'border-yellow-500 focus:ring-yellow-500/20',
            validation.state === 'idle' && 'border-border focus:ring-primary/20 focus:border-primary',
            validation.state === 'validating' && 'border-primary/50'
          )}
        />
        
        {/* Validation indicator */}
        <AnimatePresence mode="wait">
          {showValidation && validation.state !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {validation.state === 'validating' && (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              )}
              {validation.state === 'valid' && (
                <Check className="w-5 h-5 text-green-500" />
              )}
              {validation.state === 'invalid' && (
                <AlertCircle className="w-5 h-5 text-destructive" />
              )}
              {validation.state === 'warning' && (
                <Info className="w-5 h-5 text-yellow-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Validation message */}
      <AnimatePresence>
        {showValidation && validation.message && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              'text-sm',
              validation.state === 'valid' && 'text-green-600',
              validation.state === 'invalid' && 'text-destructive',
              validation.state === 'warning' && 'text-yellow-600'
            )}
          >
            {validation.message}
          </motion.p>
        )}
        
        {/* Suggestion */}
        {showValidation && validation.suggestion && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground"
          >
            💡 {validation.suggestion}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Help text */}
      {helpText && !validation.message && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </div>
  );
});

// Swiss-specific validators
export const swissValidators = {
  plz: (value: string): ValidationResult => {
    if (!value) return { state: 'idle' };
    
    const cleaned = value.replace(/\s/g, '');
    
    if (!/^\d+$/.test(cleaned)) {
      return {
        state: 'invalid',
        message: 'PLZ darf nur Zahlen enthalten'
      };
    }
    
    if (cleaned.length < 4) {
      return {
        state: 'validating',
        message: 'PLZ eingeben...'
      };
    }
    
    if (cleaned.length !== 4) {
      return {
        state: 'invalid',
        message: 'Schweizer PLZ hat 4 Ziffern'
      };
    }

    const num = parseInt(cleaned);
    if (num < 1000 || num > 9658) {
      return {
        state: 'invalid',
        message: 'Ungültige Schweizer PLZ',
        suggestion: 'PLZ-Bereich: 1000-9658'
      };
    }

    return {
      state: 'valid',
      message: 'Gültige PLZ ✓'
    };
  },

  email: (value: string): ValidationResult => {
    if (!value) return { state: 'idle' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      return {
        state: 'invalid',
        message: 'Bitte gültige E-Mail eingeben'
      };
    }

    // Check for common typos
    const domain = value.split('@')[1]?.toLowerCase();
    const typoMap: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmal.com': 'gmail.com',
      'gamil.com': 'gmail.com',
      'hotmal.com': 'hotmail.com',
      'outlok.com': 'outlook.com'
    };

    if (typoMap[domain]) {
      return {
        state: 'warning',
        message: `Meinten Sie @${typoMap[domain]}?`,
        suggestion: `Korrektur: ${value.replace(domain, typoMap[domain])}`
      };
    }

    return {
      state: 'valid',
      message: 'E-Mail gültig ✓'
    };
  },

  phone: (value: string): ValidationResult => {
    if (!value) return { state: 'idle' };
    
    const cleaned = value.replace(/[\s\-\(\)]/g, '');
    
    // Swiss mobile: 07x xxx xx xx
    // Swiss landline: 0xx xxx xx xx
    const swissRegex = /^(\+41|0041|0)?[1-9]\d{8}$/;
    
    if (!swissRegex.test(cleaned)) {
      if (cleaned.length < 10) {
        return {
          state: 'validating',
          message: 'Nummer eingeben...'
        };
      }
      return {
        state: 'invalid',
        message: 'Bitte gültige Schweizer Nummer eingeben',
        suggestion: 'Format: 079 123 45 67'
      };
    }

    return {
      state: 'valid',
      message: 'Telefonnummer gültig ✓'
    };
  },

  name: (value: string): ValidationResult => {
    if (!value) return { state: 'idle' };
    
    if (value.length < 2) {
      return {
        state: 'invalid',
        message: 'Name zu kurz'
      };
    }

    if (!/^[a-zA-ZäöüÄÖÜéèêàâîôûç\s\-']+$/.test(value)) {
      return {
        state: 'warning',
        message: 'Name enthält ungewöhnliche Zeichen'
      };
    }

    return {
      state: 'valid',
      message: 'Name gültig ✓'
    };
  },

  rooms: (value: string): ValidationResult => {
    if (!value) return { state: 'idle' };
    
    const num = parseFloat(value.replace(',', '.'));
    
    if (isNaN(num) || num < 1) {
      return {
        state: 'invalid',
        message: 'Bitte Zimmerzahl eingeben'
      };
    }

    if (num > 10) {
      return {
        state: 'warning',
        message: 'Grosser Umzug - wir empfehlen telefonische Beratung',
        suggestion: 'Rufen Sie uns an: 044 XXX XX XX'
      };
    }

    return {
      state: 'valid',
      message: `${num} Zimmer ✓`
    };
  }
};

// Form-level validation summary
interface ValidationSummaryProps {
  errors: string[];
  warnings: string[];
  className?: string;
}

export const ValidationSummary = memo(function ValidationSummary({
  errors,
  warnings,
  className
}: ValidationSummaryProps) {
  if (errors.length === 0 && warnings.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('space-y-2', className)}
    >
      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm font-medium text-destructive flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {errors.length} {errors.length === 1 ? 'Fehler' : 'Fehler'} gefunden
          </p>
          <ul className="mt-1 text-sm text-destructive/80 list-disc list-inside">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      {warnings.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
          <p className="text-sm font-medium text-yellow-600 flex items-center gap-2">
            <Info className="w-4 h-4" />
            {warnings.length} {warnings.length === 1 ? 'Hinweis' : 'Hinweise'}
          </p>
          <ul className="mt-1 text-sm text-yellow-600/80 list-disc list-inside">
            {warnings.map((warning, i) => (
              <li key={i}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
});
