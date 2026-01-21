/**
 * Step 2: Qualification
 * Room count + destination PLZ (determines routing)
 */

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Home, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SmartRouterData, SMART_ROUTER_CONFIG } from '../types';

interface QualificationStepProps {
  formData: SmartRouterData;
  onUpdate: (updates: Partial<SmartRouterData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const ROOM_OPTIONS = [
  { value: 1.5, label: '1-1.5', display: '1.5' },
  { value: 2.5, label: '2-2.5', display: '2.5' },
  { value: 3.5, label: '3-3.5', display: '3.5' },
  { value: 4.5, label: '4-4.5', display: '4.5' },
  { value: 5.5, label: '5+', display: '5+' },
];

const isValidSwissPLZ = (plz: string): boolean => {
  const num = parseInt(plz, 10);
  return /^\d{4}$/.test(plz) && num >= 1000 && num <= 9999;
};

const getCityFromPLZ = (plz: string): string => {
  const cityMap: Record<string, string> = {
    '8000': 'Zürich', '8001': 'Zürich', '8002': 'Zürich',
    '3000': 'Bern', '3001': 'Bern',
    '4000': 'Basel', '4001': 'Basel',
    '1000': 'Lausanne', '1200': 'Genève',
    '6000': 'Luzern', '9000': 'St. Gallen',
  };
  return cityMap[plz] || '';
};

export function QualificationStep({ 
  formData, 
  onUpdate, 
  onNext, 
  onBack 
}: QualificationStepProps) {
  const [error, setError] = useState<string | null>(null);

  const handlePLZChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setError(null);
    const city = getCityFromPLZ(value);
    onUpdate({ toPLZ: value, toCity: city });
  }, [onUpdate]);

  const handleRoomSelect = useCallback((rooms: number) => {
    onUpdate({ rooms });
  }, [onUpdate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.toPLZ) {
      setError('Bitte geben Sie die Ziel-PLZ ein');
      return;
    }
    
    if (!isValidSwissPLZ(formData.toPLZ)) {
      setError('Bitte geben Sie eine gültige Schweizer PLZ ein');
      return;
    }
    
    onNext();
  }, [formData.toPLZ, onNext]);

  const isHighValue = formData.rooms > SMART_ROUTER_CONFIG.VIDEO_THRESHOLD_ROOMS;
  const isValid = isValidSwissPLZ(formData.toPLZ);

  return (
    <motion.form
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      onSubmit={handleSubmit}
      className="w-full max-w-lg mx-auto space-y-8"
    >
      {/* From → To Summary */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{formData.fromPLZ}</span>
        <span>→</span>
        <span className="text-primary">?</span>
      </div>

      {/* Destination PLZ */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Wohin ziehen Sie?
        </label>
        <div className="relative flex items-center gap-3 p-3 sm:p-4 rounded-xl border bg-background">
          <MapPin className="h-5 w-5 text-primary shrink-0" />
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Ziel-PLZ"
            value={formData.toPLZ}
            onChange={handlePLZChange}
            className="border-0 p-0 text-xl font-semibold h-auto focus-visible:ring-0"
            aria-label="Postleitzahl des Zielortes"
          />
          {formData.toCity && (
            <span className="text-sm text-muted-foreground shrink-0">
              {formData.toCity}
            </span>
          )}
        </div>
      </div>

      {/* Room Selection - Large touch targets */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Home className="h-4 w-4" />
          Wohnungsgrösse
        </label>
        <div className="grid grid-cols-5 gap-2">
          {ROOM_OPTIONS.map((option) => {
            const isSelected = formData.rooms === option.value;
            const showVideoHint = option.value > SMART_ROUTER_CONFIG.VIDEO_THRESHOLD_ROOMS;
            
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleRoomSelect(option.value)}
                className={`
                  relative p-3 sm:p-4 rounded-xl border-2 text-center transition-all
                  min-h-[60px] touch-manipulation
                  ${isSelected 
                    ? 'border-primary bg-primary/10 text-primary font-semibold' 
                    : 'border-border hover:border-primary/50'
                  }
                `}
                aria-pressed={isSelected}
              >
                <span className="text-lg font-medium">{option.display}</span>
                <span className="block text-xs text-muted-foreground">Zi.</span>
                
                {/* Video recommendation hint for large apartments */}
                {showVideoHint && isSelected && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full"
                  >
                    📹
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* High-value indicator */}
        {isHighValue && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-primary bg-primary/10 p-2 rounded-lg text-center"
          >
            💡 Für diese Wohnungsgrösse empfehlen wir die Video-Analyse für eine Festpreisgarantie
          </motion.p>
        )}
      </div>

      {/* Error */}
      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive text-center"
        >
          {error}
        </motion.p>
      )}

      {/* Navigation */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1 h-12"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Zurück
        </Button>
        <Button
          type="submit"
          disabled={!isValid}
          className="flex-1 h-12"
        >
          Weiter
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </motion.form>
  );
}
