/**
 * V2f Feedback-Based - Premium Full-Journey Optimized
 * 
 * ChatGPT Pro Feedback implementiert:
 * - "Free first" (Gratis Offerten) als Default
 * - Premium später als Upgrade nach Lead
 * - 6 Steps → 3 Steps reduziert
 * - Klarer Benefit-Stack
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle2, Lock, MapPin, User, Mail, Phone, ArrowLeft, Send, Sparkles, Zap, Clock } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Umzugsdetails' },
  { id: 2, title: 'Kontakt' },
  { id: 3, title: 'Bestätigung' },
];

function ProgressHeader({ step, total, title }: { step: number; total: number; title: string }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b pb-4 pt-4 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{title}</h2>
          <span className="text-sm text-muted-foreground">Schritt {step}/{total}</span>
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
          <span className="font-medium">Unverbindlich</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          <span className="font-medium">Geprüfte Firmen</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          <span className="font-medium">DSG/DSGVO</span>
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
        <Button onClick={onPrimary} disabled={disabled} className="w-full h-14 text-lg font-semibold" size="lg">
          {primaryLabel}
        </Button>
        {secondaryLabel && onSecondary && (
          <Button variant="ghost" onClick={onSecondary} className="w-full">{secondaryLabel}</Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label, name, type = 'text', value, onChange, placeholder, error, autoComplete, inputMode, icon: Icon,
}: {
  label: string; name: string; type?: string; value: string; onChange: (v: string) => void;
  placeholder?: string; error?: string; autoComplete?: string; inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-base font-medium">{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />}
        <Input
          id={name} name={name} type={type} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoComplete={autoComplete} inputMode={inputMode}
          className={`h-12 text-base ${Icon ? 'pl-10' : ''} ${error ? 'border-destructive' : ''}`}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export const V2fFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fromZip: '', toZip: '', rooms: '', name: '', email: '', phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
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
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2 && validateStep2()) setCurrentStep(3);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Step 3: Bestätigung mit Premium Upsell
  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card>
            <CardContent className="pt-8 pb-8 text-center space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Anfrage gesendet!</h2>
                <p className="text-muted-foreground">
                  Du erhältst in Kürze unverbindliche Offerten.
                </p>
              </div>

              {!showPremiumUpsell ? (
                <Button 
                  variant="outline" 
                  onClick={() => setShowPremiumUpsell(true)}
                  className="w-full"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Premium-Optionen anzeigen
                </Button>
              ) : (
                <div className="space-y-4 text-left">
                  <h3 className="font-semibold text-center">Premium Upgrade (optional)</h3>
                  
                  <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Express-Matching</p>
                        <p className="text-sm text-muted-foreground">Offerten in 2 Stunden statt 24h</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Priorisierte Anfrage</p>
                        <p className="text-sm text-muted-foreground">Deine Anfrage wird bevorzugt</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    Premium aktivieren – CHF 19
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground">
                    Nein danke, Gratis reicht
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <ProgressHeader step={currentStep} total={STEPS.length} title={STEPS[currentStep - 1].title} />

      <div className="max-w-md mx-auto p-4 pt-6">
        <TrustBar />

        <Card>
          <CardContent className="pt-6 space-y-6">
            {currentStep === 1 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Gratis Offerten erhalten</h1>
                  <p className="text-muted-foreground">Vergleiche Preise von geprüften Firmen</p>
                </div>

                <Field label="Von PLZ" name="fromZip" value={formData.fromZip}
                  onChange={(v) => updateField('fromZip', v)} placeholder="z.B. 8001"
                  inputMode="numeric" autoComplete="postal-code" error={errors.fromZip} icon={MapPin} />

                <Field label="Nach PLZ" name="toZip" value={formData.toZip}
                  onChange={(v) => updateField('toZip', v)} placeholder="z.B. 3011"
                  inputMode="numeric" autoComplete="postal-code" error={errors.toZip} icon={MapPin} />

                <div className="space-y-2">
                  <Label className="text-base font-medium">Wohnungsgrösse</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2', '3', '4', '5', '6+'].map((r) => (
                      <Button
                        key={r}
                        variant={formData.rooms === r ? 'default' : 'outline'}
                        onClick={() => updateField('rooms', r)}
                        className="h-12"
                      >
                        {r} Zi.
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-primary/5 rounded-xl p-4">
                  <p className="text-sm font-medium text-center">
                    ✓ 3+ Offerten in 24h • ✓ 100% unverbindlich • ✓ Schweizer Firmen
                  </p>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold mb-2">Fast geschafft!</h1>
                  <p className="text-muted-foreground">Wohin sollen wir die Offerten senden?</p>
                </div>

                <Field label="Name" name="name" value={formData.name}
                  onChange={(v) => updateField('name', v)} placeholder="Vor- und Nachname"
                  autoComplete="name" error={errors.name} icon={User} />

                <Field label="E-Mail" name="email" type="email" value={formData.email}
                  onChange={(v) => updateField('email', v)} placeholder="ihre@email.ch"
                  autoComplete="email" inputMode="email" error={errors.email} icon={Mail} />

                <Field label="Telefon" name="phone" type="tel" value={formData.phone}
                  onChange={(v) => updateField('phone', v)} placeholder="079 123 45 67"
                  autoComplete="tel" inputMode="tel" error={errors.phone} icon={Phone} />

                <p className="text-xs text-muted-foreground">
                  Mit Klick auf "Offerten erhalten" erlaubst du uns, deine Anfrage an geprüfte Umzugsfirmen weiterzugeben.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <StickyFooterCTA
        primaryLabel={currentStep === 2 ? 'Gratis Offerten erhalten' : 'Weiter'}
        onPrimary={handleNext}
        disabled={currentStep === 1 ? formData.fromZip.length < 4 || formData.toZip.length < 4 : false}
        hint="Gratis • Unverbindlich • Premium später optional"
        secondaryLabel={currentStep > 1 ? 'Zurück' : undefined}
        onSecondary={currentStep > 1 ? handleBack : undefined}
      />
    </div>
  );
};

export default V2fFeedbackBased;
