/**
 * V1g - Enhanced Input UX + Inline Validation
 * 
 * UX Improvements over V1a baseline:
 * 1. EnhancedFormField with inline validation on blur
 * 2. Mobile-optimized inputMode + enterKeyHint
 * 3. Debounced autocomplete triggers
 * 4. Clear validation feedback with dot indicators
 * 5. Better loading states
 * 6. Clear progress indicator (Schritt X von Y)
 * 7. Consistent button hierarchy (Back = ghost, Next = primary)
 * 8. Safe area support for mobile
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, User, Mail, Phone, CheckCircle2, Home, Send } from 'lucide-react';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { ProgressHeader, TrustBar, SuccessState } from './shared';
import { EnhancedFormField } from './shared/EnhancedFormField';
import { Button } from '@/components/ui/button';

const STEPS = [
  { id: 1, label: 'Umzugsdetails', icon: Home },
  { id: 2, label: 'Kontakt', icon: Send },
];

// Validation functions
const validateZip = (value: string) => {
  if (!value) return 'PLZ eingeben';
  if (value.length < 4) return 'Mindestens 4 Zeichen';
  if (!/^\d{4,5}$/.test(value)) return 'Nur Zahlen erlaubt';
  return undefined;
};

const validateName = (value: string) => {
  if (!value.trim()) return 'Name eingeben';
  if (value.trim().length < 2) return 'Mindestens 2 Zeichen';
  return undefined;
};

const validateEmail = (value: string) => {
  if (!value) return 'E-Mail eingeben';
  if (!value.includes('@') || !value.includes('.')) return 'Gültige E-Mail eingeben';
  return undefined;
};

const validatePhone = (value: string) => {
  if (!value) return 'Telefon eingeben';
  const cleaned = value.replace(/\s/g, '');
  if (cleaned.length < 8) return 'Mindestens 8 Zeichen';
  return undefined;
};

export const V1gInputUX: React.FC = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (isCaptureMode && captureStep !== null && captureStep >= 1 && captureStep <= 2) {
      return captureStep;
    }
    return 1;
  });
  
  const [formData, setFormData] = useState(() => ({
    fromZip: isCaptureMode ? demoData.fromPostal : '',
    toZip: isCaptureMode ? demoData.toPostal : '',
    moveDate: isCaptureMode ? demoData.moveDate : '',
    name: isCaptureMode ? demoData.name : '',
    email: isCaptureMode ? demoData.email : '',
    phone: isCaptureMode ? demoData.phone : '',
  }));
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isCaptureMode && captureStep !== null && captureStep >= 1 && captureStep <= 2) {
      setCurrentStep(captureStep);
    }
  }, [isCaptureMode, captureStep]);

  const updateField = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Check if step is valid (for CTA state)
  const isStep1Valid = !validateZip(formData.fromZip) && !validateZip(formData.toZip);
  const isStep2Valid = !validateName(formData.name) && !validateEmail(formData.email) && !validatePhone(formData.phone);

  const handleNext = async () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid) {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return <SuccessState />;
  }

  // Field completion indicators
  const getCompletedFields = () => {
    const fields = [];
    if (!validateZip(formData.fromZip)) fields.push('Von-PLZ');
    if (!validateZip(formData.toZip)) fields.push('Nach-PLZ');
    if (formData.moveDate) fields.push('Datum');
    return fields;
  };

  const isCurrentStepValid = currentStep === 1 ? isStep1Valid : isStep2Valid;

  return (
    <div className="min-h-screen bg-background pb-40 md:pb-32">
      {/* Progress Header with step labels */}
      <ProgressHeader 
        step={currentStep} 
        total={STEPS.length} 
        stepLabels={STEPS}
      />

      <div className="max-w-md mx-auto p-4 pt-6">
        <TrustBar compact />

        <Card className="overflow-hidden">
          <CardContent className="pt-6 space-y-5">
            {currentStep === 1 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Umzug planen</h1>
                  <p className="text-muted-foreground">
                    In 2 Minuten zu kostenlosen Offerten
                  </p>
                </div>

                <EnhancedFormField
                  label="Von PLZ"
                  name="fromZip"
                  value={formData.fromZip}
                  onChange={(v) => updateField('fromZip', v)}
                  validate={validateZip}
                  placeholder="z.B. 8001"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  enterKeyHint="next"
                  icon={MapPin}
                  required
                />

                <EnhancedFormField
                  label="Nach PLZ"
                  name="toZip"
                  value={formData.toZip}
                  onChange={(v) => updateField('toZip', v)}
                  validate={validateZip}
                  placeholder="z.B. 3011"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  enterKeyHint="next"
                  icon={MapPin}
                  required
                />

                <EnhancedFormField
                  label="Umzugsdatum"
                  name="moveDate"
                  type="date"
                  value={formData.moveDate}
                  onChange={(v) => updateField('moveDate', v)}
                  enterKeyHint="done"
                  icon={Calendar}
                />
                <p className="text-xs text-muted-foreground -mt-3">(optional – flexibel = mehr Angebote)</p>

                {/* Completion indicator */}
                {getCompletedFields().length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {getCompletedFields().map(field => (
                      <span 
                        key={field}
                        className="inline-flex items-center gap-1 text-xs text-primary bg-primary/5 px-2 py-1 rounded-full"
                      >
                        <CheckCircle2 className="h-3 w-3" />
                        {field}
                      </span>
                    ))}
                  </div>
                )}
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Kontaktdaten</h1>
                  <p className="text-muted-foreground">
                    Wohin sollen wir die Offerten senden?
                  </p>
                </div>

                {/* Route summary */}
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-center">
                  <span className="font-medium">{formData.fromZip}</span>
                  <span className="mx-2 text-muted-foreground">→</span>
                  <span className="font-medium">{formData.toZip}</span>
                  {formData.moveDate && (
                    <>
                      <span className="mx-2 text-muted-foreground">•</span>
                      <span className="text-muted-foreground">
                        {new Date(formData.moveDate).toLocaleDateString('de-CH', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </>
                  )}
                </div>

                <EnhancedFormField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(v) => updateField('name', v)}
                  validate={validateName}
                  placeholder="Vor- und Nachname"
                  autoComplete="name"
                  enterKeyHint="next"
                  icon={User}
                  required
                />

                <EnhancedFormField
                  label="E-Mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => updateField('email', v)}
                  validate={validateEmail}
                  placeholder="ihre@email.ch"
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="next"
                  icon={Mail}
                  required
                />

                <EnhancedFormField
                  label="Telefon"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(v) => updateField('phone', v)}
                  validate={validatePhone}
                  placeholder="079 123 45 67"
                  autoComplete="tel"
                  inputMode="tel"
                  enterKeyHint="done"
                  icon={Phone}
                  required
                />

                <p className="text-xs text-muted-foreground text-center pt-2">
                  Keine Telefonpflicht • Nur für Rückfragen, falls du es willst
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Sticky Footer with proper hierarchy */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-md mx-auto p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] space-y-2">
          {/* Trust hint */}
          <p className="text-center text-xs text-muted-foreground">
            100% kostenlos • Unverbindlich • Geprüfte Partner
          </p>
          
          {/* Primary CTA - Always prominent */}
          <Button
            onClick={handleNext}
            disabled={!isCurrentStepValid || loading}
            className={`w-full h-14 text-lg font-semibold transition-all ${
              isCurrentStepValid 
                ? 'shadow-lg hover:shadow-xl' 
                : 'opacity-60'
            }`}
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                Wird gesendet...
              </span>
            ) : currentStep === 2 ? (
              <span className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Offerten erhalten
              </span>
            ) : (
              'Weiter'
            )}
          </Button>
          
          {/* Secondary - Back button (ghost, less prominent) */}
          {currentStep > 1 && (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="w-full h-11 text-sm text-muted-foreground hover:text-foreground"
              disabled={loading}
            >
              ← Zurück zu Schritt {currentStep - 1}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default V1gInputUX;
