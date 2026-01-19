/**
 * GoldenFlowStep1 - Addresses (Zero Friction Entry)
 * 
 * Goal: Get user started in <5 seconds with instant price preview
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { GoldenFlowData, GoldenFlowPriceEstimate } from '../types';
import { SWISS_POSTAL_CODES, BASE_PRICES } from '../constants';
import { GoldenFlowTrustBar } from '../components/GoldenFlowTrustBar';
import { GoldenFlowPricePreview } from '../components/GoldenFlowPricePreview';

interface GoldenFlowStep1Props {
  formData: GoldenFlowData;
  priceEstimate: GoldenFlowPriceEstimate | null;
  onUpdate: (data: Partial<GoldenFlowData>) => void;
  onNext: () => void;
}

export function GoldenFlowStep1({ formData, priceEstimate, onUpdate, onNext }: GoldenFlowStep1Props) {
  const [fromSuggestions, setFromSuggestions] = useState<typeof SWISS_POSTAL_CODES>([]);
  const [toSuggestions, setToSuggestions] = useState<typeof SWISS_POSTAL_CODES>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  
  const isValid = formData.fromPLZ.length === 4 && formData.toPLZ.length === 4;
  
  // Handle PLZ input with autocomplete
  const handlePLZChange = (field: 'fromPLZ' | 'toPLZ', value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    
    // Find city from postal code
    const match = SWISS_POSTAL_CODES.find(p => p.code === numericValue);
    const cityField = field === 'fromPLZ' ? 'fromCity' : 'toCity';
    
    onUpdate({
      [field]: numericValue,
      [cityField]: match?.city || '',
    });
    
    // Show suggestions
    if (numericValue.length >= 2) {
      const matches = SWISS_POSTAL_CODES.filter(p => 
        p.code.startsWith(numericValue) || p.city.toLowerCase().includes(numericValue.toLowerCase())
      ).slice(0, 5);
      
      if (field === 'fromPLZ') {
        setFromSuggestions(matches);
        setShowFromSuggestions(matches.length > 0);
      } else {
        setToSuggestions(matches);
        setShowToSuggestions(matches.length > 0);
      }
    } else {
      if (field === 'fromPLZ') setShowFromSuggestions(false);
      else setShowToSuggestions(false);
    }
  };
  
  const selectSuggestion = (field: 'fromPLZ' | 'toPLZ', code: string, city: string) => {
    const cityField = field === 'fromPLZ' ? 'fromCity' : 'toCity';
    onUpdate({ [field]: code, [cityField]: city });
    if (field === 'fromPLZ') setShowFromSuggestions(false);
    else setShowToSuggestions(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Hero text */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Umzug planen in 60 Sekunden
        </h2>
        <p className="text-muted-foreground">
          Vergleichen Sie kostenlos bis zu 5 Offerten von geprüften Schweizer Firmen
        </p>
      </div>
      
      {/* Address inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* From PLZ */}
        <div className="relative">
          <Label htmlFor="fromPLZ" className="text-sm font-medium flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary" />
            Von (PLZ)
          </Label>
          <div className="relative">
            <Input
              id="fromPLZ"
              type="text"
              inputMode="numeric"
              placeholder="z.B. 8001"
              value={formData.fromPLZ}
              onChange={(e) => handlePLZChange('fromPLZ', e.target.value)}
              onFocus={() => formData.fromPLZ.length >= 2 && setShowFromSuggestions(fromSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowFromSuggestions(false), 150)}
              className="h-12 text-lg"
              autoComplete="off"
            />
            {formData.fromCity && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {formData.fromCity}
              </span>
            )}
          </div>
          
          {/* Suggestions dropdown */}
          {showFromSuggestions && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
              {fromSuggestions.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex justify-between"
                  onMouseDown={() => selectSuggestion('fromPLZ', s.code, s.city)}
                >
                  <span className="font-medium">{s.code}</span>
                  <span className="text-muted-foreground">{s.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* To PLZ */}
        <div className="relative">
          <Label htmlFor="toPLZ" className="text-sm font-medium flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-secondary" />
            Nach (PLZ)
          </Label>
          <div className="relative">
            <Input
              id="toPLZ"
              type="text"
              inputMode="numeric"
              placeholder="z.B. 3011"
              value={formData.toPLZ}
              onChange={(e) => handlePLZChange('toPLZ', e.target.value)}
              onFocus={() => formData.toPLZ.length >= 2 && setShowToSuggestions(toSuggestions.length > 0)}
              onBlur={() => setTimeout(() => setShowToSuggestions(false), 150)}
              className="h-12 text-lg"
              autoComplete="off"
            />
            {formData.toCity && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {formData.toCity}
              </span>
            )}
          </div>
          
          {/* Suggestions dropdown */}
          {showToSuggestions && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg overflow-hidden">
              {toSuggestions.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex justify-between"
                  onMouseDown={() => selectSuggestion('toPLZ', s.code, s.city)}
                >
                  <span className="font-medium">{s.code}</span>
                  <span className="text-muted-foreground">{s.city}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Price preview (shows after both PLZs entered) */}
      {priceEstimate && (
        <GoldenFlowPricePreview estimate={priceEstimate} />
      )}
      
      {/* CTA Button */}
      <Button
        onClick={onNext}
        disabled={!isValid}
        size="lg"
        className="w-full h-14 text-lg font-semibold gap-2 bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg"
      >
        {priceEstimate ? (
          <>
            Weiter zu Details
            <ArrowRight className="h-5 w-5" />
          </>
        ) : (
          <>
            <Sparkles className="h-5 w-5" />
            Preis berechnen
          </>
        )}
      </Button>
      
      {/* Trust bar */}
      <GoldenFlowTrustBar variant="compact" />
    </motion.div>
  );
}
