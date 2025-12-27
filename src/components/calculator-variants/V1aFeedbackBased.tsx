/**
 * V1a Feedback-Based - Control Flow Optimized
 * 
 * ChatGPT Pro Feedback implementiert:
 * - Sticky CTA immer sichtbar
 * - Form-Friction reduziert (nur PLZ + Datum)
 * - Trust direkt vor Dateneingabe
 * - 4 Steps → 2 Steps (Umzugsdetails → Kontakt)
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle2, Lock, MapPin, Calendar, User, Mail, Phone, ArrowLeft, Send } from 'lucide-react';
import { useCaptureMode } from '@/hooks/use-capture-mode';

const STEPS = [
  { id: 1, title: 'Umzugsdetails' },
  { id: 2, title: 'Kontakt' },
];

// Reusable Components
function ProgressHeader({ step, total, title }: { step: number; total: number; title: string }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b pb-4 pt-4 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">
            Schritt {step}/{total}
          </span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <div className="bg-muted/50 rounded-xl p-4 mb-6">
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Unverbindlich</p>
            <p className="text-xs text-muted-foreground">keine Pflicht</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Geprüfte Firmen</p>
            <p className="text-xs text-muted-foreground">CH-Partner</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <div>
            <p className="font-medium">Datenschutz</p>
            <p className="text-xs text-muted-foreground">DSG/DSGVO</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StickyFooterCTA({
  primaryLabel,
  onPrimary,
  disabled,
  hint,
  secondaryLabel,
  onSecondary,
}: {
  primaryLabel: string;
  onPrimary: () => void;
  disabled?: boolean;
  hint?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t safe-area-inset-bottom">
      <div className="max-w-md mx-auto p-4 space-y-2">
        {hint && <p className="text-center text-sm text-muted-foreground">{hint}</p>}
        <Button
          onClick={onPrimary}
          disabled={disabled}
          className="w-full h-14 text-lg font-semibold"
          size="lg"
        >
          {primaryLabel}
        </Button>
        {secondaryLabel && onSecondary && (
          <Button
            variant="ghost"
            onClick={onSecondary}
            className="w-full"
          >
            {secondaryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  inputMode,
  icon: Icon,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base font-medium">{label}</Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={`h-12 text-base ${Icon ? 'pl-10' : ''} ${error ? 'border-destructive' : ''}`}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export const V1aFeedbackBased: React.FC = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  
  // Initialize step from capture mode or default to 1
  const [currentStep, setCurrentStep] = useState(() => {
    if (isCaptureMode && captureStep !== null && captureStep >= 1 && captureStep <= 2) {
      return captureStep;
    }
    return 1;
  });
  
  // Initialize form data - use demo data in capture mode
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

  // Update step when capture params change
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
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Anfrage gesendet!</h2>
            <p className="text-muted-foreground">
              Du erhältst in Kürze unverbindliche Offerten von geprüften Umzugsfirmen.
            </p>
          </CardContent>
        </Card>
      </div>
    );
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

                <Field
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

                <Field
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

                <Field
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

                <Field
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={(v) => updateField('name', v)}
                  placeholder="Vor- und Nachname"
                  autoComplete="name"
                  error={errors.name}
                  icon={User}
                />

                <Field
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

                <Field
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
