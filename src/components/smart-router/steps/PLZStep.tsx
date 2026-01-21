/**
 * Step 1: PLZ Entry
 * Single input field - minimal cognitive load (Hick's Law)
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SmartRouterData } from '../types';

interface PLZStepProps {
  formData: SmartRouterData;
  onUpdate: (updates: Partial<SmartRouterData>) => void;
  onNext: () => void;
}

// Simple Swiss PLZ validation (4 digits, 1000-9999)
const isValidSwissPLZ = (plz: string): boolean => {
  const num = parseInt(plz, 10);
  return /^\d{4}$/.test(plz) && num >= 1000 && num <= 9999;
};

// Simple city lookup (can be enhanced with API)
const getCityFromPLZ = (plz: string): string => {
  const cityMap: Record<string, string> = {
    '8000': 'Zürich',
    '8001': 'Zürich',
    '8002': 'Zürich',
    '8003': 'Zürich',
    '8004': 'Zürich',
    '8005': 'Zürich',
    '3000': 'Bern',
    '3001': 'Bern',
    '4000': 'Basel',
    '4001': 'Basel',
    '1000': 'Lausanne',
    '1200': 'Genève',
    '6000': 'Luzern',
    '9000': 'St. Gallen',
  };
  return cityMap[plz] || '';
};

export function PLZStep({ formData, onUpdate, onNext }: PLZStepProps) {
  const [error, setError] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setError(null);
    
    const city = getCityFromPLZ(value);
    onUpdate({ fromPLZ: value, fromCity: city });
  }, [onUpdate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromPLZ) {
      setError('Bitte geben Sie Ihre Postleitzahl ein');
      return;
    }
    
    if (!isValidSwissPLZ(formData.fromPLZ)) {
      setError('Bitte geben Sie eine gültige Schweizer PLZ ein (1000-9999)');
      return;
    }
    
    onNext();
  }, [formData.fromPLZ, onNext]);

  const isValid = isValidSwissPLZ(formData.fromPLZ);

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="w-full max-w-md mx-auto"
    >
      {/* Single PLZ Input - Hero-sized */}
      <div className="relative">
        <div 
          className={`
            relative flex items-center gap-3 p-4 sm:p-5 rounded-2xl border-2 
            bg-background shadow-lg transition-all duration-200
            ${isFocused ? 'border-primary shadow-primary/20' : 'border-border'}
            ${error ? 'border-destructive' : ''}
          `}
        >
          <MapPin className="h-6 w-6 text-primary shrink-0" />
          
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ihre PLZ"
            value={formData.fromPLZ}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="border-0 p-0 text-2xl sm:text-3xl font-semibold h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
            autoFocus
            aria-label="Postleitzahl des aktuellen Wohnorts"
          />
          
          <Button
            type="submit"
            size="lg"
            disabled={!isValid}
            className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-xl p-0"
            aria-label="Weiter"
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* City preview */}
        {formData.fromCity && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-7 left-4 text-sm text-muted-foreground"
          >
            📍 {formData.fromCity}
          </motion.p>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-sm text-destructive text-center"
        >
          {error}
        </motion.p>
      )}
      
      {/* Helper text */}
      <p className="mt-10 text-center text-sm text-muted-foreground">
        Wo ziehen Sie aktuell weg?
      </p>
    </motion.form>
  );
}
