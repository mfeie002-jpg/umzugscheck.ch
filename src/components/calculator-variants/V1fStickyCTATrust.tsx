/**
 * V1f - Enhanced Sticky CTA + Step Trust Pills
 * 
 * UX Improvements over V1a baseline:
 * 1. EnhancedStickyCTA with micro-feedback (shows WHY disabled)
 * 2. StepTrustPills that change per step context
 * 3. WhyThis component for transparency
 * 4. Summary line above CTA
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { ProgressHeader, SuccessState } from './shared';
import { StepTrustPills } from './shared/StepTrustPills';
import { WhyThis } from './shared/WhyThis';
import { EnhancedStickyCTA } from './shared/EnhancedStickyCTA';
import { FormField } from './shared/FormField';

const STEPS = [
  { id: 1, title: 'Umzugsdetails', trustStep: 'addresses' as const },
  { id: 2, title: 'Kontakt', trustStep: 'contact' as const },
];

export const V1fStickyCTATrust: React.FC = () => {
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
  const [loading, setLoading] = useState(false);

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

  const handleNext = async () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setLoading(false);
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Compute disabled state with reason
  const getDisabledInfo = () => {
    if (currentStep === 1) {
      if (formData.fromZip.length < 4 && formData.toZip.length < 4) {
        return { disabled: true, hint: 'PLZ eingeben' };
      }
      if (formData.fromZip.length < 4) {
        return { disabled: true, hint: 'Von-PLZ fehlt' };
      }
      if (formData.toZip.length < 4) {
        return { disabled: true, hint: 'Nach-PLZ fehlt' };
      }
    }
    if (currentStep === 2) {
      if (!formData.name.trim()) {
        return { disabled: true, hint: 'Name eingeben' };
      }
      if (!formData.email.includes('@')) {
        return { disabled: true, hint: 'E-Mail eingeben' };
      }
      if (formData.phone.length < 8) {
        return { disabled: true, hint: 'Telefon eingeben' };
      }
    }
    return { disabled: false, hint: undefined };
  };

  const { disabled, hint } = getDisabledInfo();

  // Summary for CTA
  const getSummary = () => {
    if (currentStep === 2 && formData.fromZip && formData.toZip) {
      const dateStr = formData.moveDate 
        ? ` • ${new Date(formData.moveDate).toLocaleDateString('de-CH', { day: 'numeric', month: 'short' })}`
        : '';
      return `${formData.fromZip} → ${formData.toZip}${dateStr}`;
    }
    return undefined;
  };

  if (isSubmitted) {
    return <SuccessState />;
  }

  const currentTrustStep = STEPS[currentStep - 1].trustStep;

  return (
    <div className="min-h-screen bg-background pb-32">
      <ProgressHeader 
        step={currentStep} 
        total={STEPS.length} 
        title={STEPS[currentStep - 1].title} 
      />

      <div className="max-w-md mx-auto p-4 pt-6 space-y-4">
        {/* Step-specific trust pills */}
        <StepTrustPills stepId={currentTrustStep} />

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
                  required
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
                  required
                />

                <FormField
                  label="Umzugsdatum"
                  name="moveDate"
                  type="date"
                  value={formData.moveDate}
                  onChange={(v) => updateField('moveDate', v)}
                  icon={Calendar}
                />

                <WhyThis>
                  Mit deiner Postleitzahl finden wir Umzugsfirmen in deiner Region, 
                  die verfügbar sind und dir ein passendes Angebot erstellen können.
                </WhyThis>
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
                  required
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
                  required
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
                  required
                />

                <WhyThis triggerText="Was passiert mit meinen Daten?">
                  Deine Kontaktdaten werden ausschliesslich für die Offerten-Zustellung 
                  an geprüfte Schweizer Umzugsfirmen verwendet. Kein Spam, keine Weitergabe 
                  an Dritte, Abmeldung jederzeit möglich.
                </WhyThis>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <EnhancedStickyCTA
        primaryLabel={currentStep === 2 ? 'Offerten erhalten' : 'Weiter'}
        onPrimary={handleNext}
        primaryDisabled={disabled}
        primaryHint={hint}
        summaryLeft={getSummary()}
        secondaryLabel={currentStep > 1 ? 'Zurück' : undefined}
        onSecondary={currentStep > 1 ? handleBack : undefined}
        loading={loading}
      />
    </div>
  );
};

export default V1fStickyCTATrust;
