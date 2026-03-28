/**
 * V1a Feedback-Based - Control Flow Optimized
 * 
 * Uses shared components for consistency across all flows
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { 
  ProgressHeader, 
  TrustBar, 
  StickyFooterCTA, 
  FormField,
  SuccessState 
} from './shared';

const STEPS = [
  { id: 1, title: 'Umzugsdetails' },
  { id: 2, title: 'Kontakt' },
];

export const V1aFeedbackBased: React.FC = () => {
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (isCaptureMode && captureStep !== null && captureStep >= 1 && captureStep <= 2) {
      setCurrentStep(captureStep);
    }
  }, [isCaptureMode, captureStep]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.fromZip.length < 4) newErrors.fromZip = 'Gültige PLZ eingeben';
    if (formData.toZip.length < 4) newErrors.toZip = 'Gültige PLZ eingeben';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Name eingeben';
    if (!formData.email.includes('@')) newErrors.email = 'Gültige E-Mail eingeben';
    if (formData.phone.length < 8) newErrors.phone = 'Gültige Telefonnummer eingeben';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (isSubmitted) {
    return <SuccessState />;
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <ProgressHeader 
        step={currentStep} 
        total={STEPS.length} 
        title={STEPS[currentStep - 1].title} 
      />

      <div className="max-w-md mx-auto p-4 pt-6">
        <TrustBar />

        <Card>
          <CardContent className="pt-6 space-y-6">
            {currentStep === 1 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Umzug planen</h1>
                  <p className="text-muted-foreground">
                    In 2 Minuten zu kostenlosen Offerten
                  </p>
                </div>

                <FormField
                  label="Von PLZ"
                  name="fromZip"
                  value={formData.fromZip}
                  onChange={(v) => updateField('fromZip', v)}
                  placeholder="z.B. 8001"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  error={errors.fromZip}
                  icon={MapPin}
                />

                <FormField
                  label="Nach PLZ"
                  name="toZip"
                  value={formData.toZip}
                  onChange={(v) => updateField('toZip', v)}
                  placeholder="z.B. 3011"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  error={errors.toZip}
                  icon={MapPin}
                />

                <FormField
                  label="Umzugsdatum (optional)"
                  name="moveDate"
                  type="date"
                  value={formData.moveDate}
                  onChange={(v) => updateField('moveDate', v)}
                  icon={Calendar}
                />

                <p className="text-sm text-muted-foreground text-center">
                  Du erhältst in der Regel mehrere unverbindliche Offerten von geprüften Umzugsfirmen.
                </p>
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

                <FormField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(v) => updateField('name', v)}
                  placeholder="Vor- und Nachname"
                  autoComplete="name"
                  error={errors.name}
                  icon={User}
                />

                <FormField
                  label="E-Mail"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(v) => updateField('email', v)}
                  placeholder="ihre@email.ch"
                  autoComplete="email"
                  inputMode="email"
                  error={errors.email}
                  icon={Mail}
                />

                <FormField
                  label="Telefon"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(v) => updateField('phone', v)}
                  placeholder="079 123 45 67"
                  autoComplete="tel"
                  inputMode="tel"
                  error={errors.phone}
                  icon={Phone}
                />

                <p className="text-xs text-muted-foreground">
                  Mit Klick auf "Offerten erhalten" erlaubst du uns, deine Anfrage an passende, 
                  geprüfte Umzugsfirmen zur Offertstellung weiterzugeben. Kein Abo, keine Verpflichtung.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <StickyFooterCTA
        primaryLabel={currentStep === 2 ? 'Offerten erhalten' : 'Weiter'}
        onPrimary={handleNext}
        disabled={currentStep === 1 ? formData.fromZip.length < 4 || formData.toZip.length < 4 : false}
        hint="Unverbindlich • Kostenlos • Geprüfte Partner"
        secondaryLabel={currentStep > 1 ? 'Zurück' : undefined}
        onSecondary={currentStep > 1 ? handleBack : undefined}
      />
    </div>
  );
};

export default V1aFeedbackBased;
