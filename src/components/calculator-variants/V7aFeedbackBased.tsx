/**
 * V7a Feedback-Based - SwissMove (90s) Optimized
 * 
 * ChatGPT Pro Feedback implementiert:
 * - Timer als "Expectation Setter"
 * - Save/Resume + Auto-Advance bei Auswahl
 * - CTA immer sichtbar
 * - "Eingaben bleiben gespeichert" Hinweis
 * - Schnellpfad (nur PLZ + Datum + Zimmer)
 * - Loading States für bessere UX
 * - Klare Zurück/Weiter Navigation
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Shield, CheckCircle2, Lock, MapPin, User, Mail, Phone, Clock, Save, ChevronLeft, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Adressen' },
  { id: 2, title: 'Details' },
  { id: 3, title: 'Kontakt' },
];

const STORAGE_KEY = 'v7a-form-data';

function ProgressHeader({ step, total, title, onBack }: { step: number; total: number; title: string; onBack?: () => void }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b pb-4 pt-4 px-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {step > 1 && onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <span className="text-sm text-muted-foreground">Schritt {step}/{total}</span>
        </div>
        <Progress value={pct} className="h-2" />
      </div>
    </div>
  );
}

function TimeExpectation() {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold">Dauer: ca. 90 Sekunden</p>
          <p className="text-sm text-muted-foreground">
            Wir fragen nur das Nötigste. Deine Eingaben bleiben erhalten.
          </p>
        </div>
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
          <Save className="h-4 w-4 text-primary" />
          <span className="font-medium">Auto-Speichern</span>
        </div>
      </div>
    </div>
  );
}

function StickyFooterCTA({
  primaryLabel, onPrimary, disabled, hint, secondaryLabel, onSecondary, isLoading,
}: {
  primaryLabel: string; onPrimary: () => void; disabled?: boolean; hint?: string;
  secondaryLabel?: string; onSecondary?: () => void; isLoading?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur border-t safe-area-inset-bottom">
      <div className="max-w-md mx-auto p-4 space-y-2">
        {hint && <p className="text-center text-sm text-muted-foreground">{hint}</p>}
        <div className="flex gap-2">
          {secondaryLabel && onSecondary && (
            <Button 
              variant="outline" 
              onClick={onSecondary} 
              className="h-14 px-6"
              disabled={isLoading}
            >
              <ChevronLeft className="h-5 w-5 mr-1" />
              {secondaryLabel}
            </Button>
          )}
          <Button 
            onClick={onPrimary} 
            disabled={disabled || isLoading} 
            className="flex-1 h-14 text-lg font-semibold gap-2" 
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Wird geladen...
              </>
            ) : (
              <>
                {primaryLabel}
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
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

export const V7aFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fromZip: '', toZip: '', rooms: '', moveDate: '', name: '', email: '', phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch {}
    }
  }, []);

  // Auto-save on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Auto-advance when rooms selected
  const handleRoomSelect = (room: string) => {
    updateField('rooms', room);
    // Auto-advance after short delay
    setTimeout(() => {
      if (formData.fromZip.length >= 4 && formData.toZip.length >= 4) {
        setCurrentStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300);
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.fromZip.length < 4) newErrors.fromZip = 'Gültige PLZ eingeben';
    if (formData.toZip.length < 4) newErrors.toZip = 'Gültige PLZ eingeben';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentStep === 3 && validateStep3()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsSubmitted(true);
        localStorage.removeItem(STORAGE_KEY);
      }, 1500);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Geschafft! 🎉</h2>
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
        onBack={currentStep > 1 ? handleBack : undefined}
      />

      <div className="max-w-md mx-auto p-4 pt-6">
        {currentStep === 1 && (
          <>
            <TimeExpectation />
            <TrustBar />
          </>
        )}

        <Card>
          <CardContent className="pt-6 space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Deine Anfrage wird gesendet...</p>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <>
                    <div className="text-center mb-4">
                      <h1 className="text-xl font-bold mb-2">Wohin ziehst du?</h1>
                    </div>

                    <Field label="Von PLZ" name="fromZip" value={formData.fromZip}
                      onChange={(v) => updateField('fromZip', v)} placeholder="z.B. 8001"
                      inputMode="numeric" autoComplete="postal-code" error={errors.fromZip} icon={MapPin} />

                    <Field label="Nach PLZ" name="toZip" value={formData.toZip}
                      onChange={(v) => updateField('toZip', v)} placeholder="z.B. 3011"
                      inputMode="numeric" autoComplete="postal-code" error={errors.toZip} icon={MapPin} />

                    <Field label="Umzugsdatum (optional)" name="moveDate" type="date"
                      value={formData.moveDate} onChange={(v) => updateField('moveDate', v)} />
                  </>
                )}

                {currentStep === 2 && (
                  <>
                    <div className="text-center mb-4">
                      <h1 className="text-xl font-bold mb-2">Wie gross ist die Wohnung?</h1>
                      <p className="text-sm text-muted-foreground">Tipp: Wähle und es geht automatisch weiter</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: '1', label: '1 Zimmer', desc: 'Studio' },
                        { value: '2', label: '2 Zimmer', desc: 'Klein' },
                        { value: '3', label: '3 Zimmer', desc: 'Mittel' },
                        { value: '4', label: '4 Zimmer', desc: 'Gross' },
                        { value: '5', label: '5 Zimmer', desc: 'Sehr gross' },
                        { value: '6+', label: '6+ Zimmer', desc: 'Villa/Haus' },
                      ].map((r) => (
                        <Button
                          key={r.value}
                          variant={formData.rooms === r.value ? 'default' : 'outline'}
                          onClick={() => handleRoomSelect(r.value)}
                          className="h-20 flex flex-col"
                        >
                          <span className="text-lg font-bold">{r.value}</span>
                          <span className="text-xs opacity-70">{r.desc}</span>
                        </Button>
                      ))}
                    </div>
                  </>
                )}

                {currentStep === 3 && (
                  <>
                    <div className="text-center mb-4">
                      <h1 className="text-xl font-bold mb-2">Fast fertig!</h1>
                      <p className="text-sm text-muted-foreground">Wohin sollen wir die Offerten senden?</p>
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
                      Mit Klick auf "Kostenlos Offerten erhalten" erlaubst du uns, deine Anfrage an geprüfte Umzugsfirmen weiterzugeben.
                    </p>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <StickyFooterCTA
        primaryLabel={currentStep === 3 ? 'Kostenlos Offerten erhalten' : 'Weiter'}
        onPrimary={handleNext}
        disabled={currentStep === 1 ? formData.fromZip.length < 4 || formData.toZip.length < 4 : false}
        hint="Unverbindlich • Kostenlos • Auto-Speichern aktiv"
        secondaryLabel={currentStep > 1 ? 'Zurück' : undefined}
        onSecondary={currentStep > 1 ? handleBack : undefined}
        isLoading={isLoading}
      />
    </div>
  );
};

export default V7aFeedbackBased;
