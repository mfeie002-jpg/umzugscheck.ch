/**
 * V6a Feedback-Based - Ultimate (6-Tier) Optimized
 * 
 * ChatGPT Pro Feedback implementiert:
 * - Mobile: max 3 Pakete sichtbar, Card-Snap statt Tabellen
 * - "Nur Gratis-Offerten" als Exit
 * - Empfohlen + Default vorausgewählt
 * - Preis-/Paket-Details nach Lead
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle2, Lock, MapPin, User, Mail, Phone, Star, Check } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Details' },
  { id: 2, title: 'Paket' },
  { id: 3, title: 'Kontakt' },
];

const TIERS = [
  { 
    id: 'basic', 
    title: 'Basic', 
    subtitle: 'Transport only',
    features: ['Transporter', '2 Träger', 'Grundversicherung'],
    price: 'ab CHF 490'
  },
  { 
    id: 'comfort', 
    title: 'Comfort', 
    subtitle: 'Beliebteste Wahl',
    features: ['Transporter', '3 Träger', 'Möbelschutz', 'Vollversicherung'],
    price: 'ab CHF 890',
    recommended: true 
  },
  { 
    id: 'premium', 
    title: 'Premium', 
    subtitle: 'Rundum-Sorglos',
    features: ['Transporter', '4 Träger', 'Ein-/Auspacken', 'Möbelmontage', 'Vollversicherung'],
    price: 'ab CHF 1\'490'
  },
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
  primaryLabel, onPrimary, disabled, hint, secondaryLabel, onSecondary,
}: {
  primaryLabel: string; onPrimary: () => void; disabled?: boolean; hint?: string;
  secondaryLabel?: string; onSecondary?: () => void;
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

function TierCard({ 
  tier, 
  selected, 
  onSelect 
}: { 
  tier: typeof TIERS[0]; 
  selected: boolean; 
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`min-w-[260px] snap-start rounded-2xl border p-4 text-left transition-all ${
        selected ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold">{tier.title}</h3>
        {tier.recommended && (
          <Badge className="bg-primary text-primary-foreground">
            <Star className="h-3 w-3 mr-1" />
            Empfohlen
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-4">{tier.subtitle}</p>
      
      <ul className="space-y-2 mb-4">
        {tier.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-primary" />
            {f}
          </li>
        ))}
      </ul>

      <p className="text-lg font-bold text-primary">{tier.price}</p>
    </button>
  );
}

export const V6aFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fromZip: '', toZip: '', rooms: '', name: '', email: '', phone: '',
  });
  const [selectedTier, setSelectedTier] = useState<string>('comfort'); // Default empfohlen
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Name eingeben';
    if (!formData.email.includes('@')) newErrors.email = 'Gültige E-Mail eingeben';
    if (formData.phone.length < 8) newErrors.phone = 'Gültige Telefonnummer eingeben';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) setIsSubmitted(true);
  };

  const handleSkipToContact = () => {
    setSelectedTier('');
    setCurrentStep(3);
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
              {selectedTier 
                ? `Du erhältst ${TIERS.find(t => t.id === selectedTier)?.title}-Offerten.`
                : 'Du erhältst unverbindliche Offerten von unseren Partnern.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <ProgressHeader step={currentStep} total={STEPS.length} title={STEPS[currentStep - 1].title} />

      <div className="max-w-md mx-auto p-4 pt-6">
        {currentStep === 1 && <TrustBar />}

        {currentStep === 2 ? (
          // Tier Selection - Horizontal Snap Scroll
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-xl font-bold mb-2">Wähle dein Paket</h1>
              <p className="text-sm text-muted-foreground">
                Swipe um alle Optionen zu sehen
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
              {TIERS.map((tier) => (
                <TierCard
                  key={tier.id}
                  tier={tier}
                  selected={selectedTier === tier.id}
                  onSelect={() => setSelectedTier(tier.id)}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              onClick={handleSkipToContact}
              className="w-full"
            >
              Nur Gratis-Offerten (ohne Paketwahl)
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="text-center mb-4">
                    <h1 className="text-xl font-bold mb-2">Umzugsdetails</h1>
                  </div>

                  <Field label="Von PLZ" name="fromZip" value={formData.fromZip}
                    onChange={(v) => updateField('fromZip', v)} placeholder="z.B. 8001"
                    inputMode="numeric" error={errors.fromZip} icon={MapPin} />

                  <Field label="Nach PLZ" name="toZip" value={formData.toZip}
                    onChange={(v) => updateField('toZip', v)} placeholder="z.B. 3011"
                    inputMode="numeric" error={errors.toZip} icon={MapPin} />

                  <div className="space-y-2">
                    <Label className="text-base font-medium">Zimmer</Label>
                    <div className="grid grid-cols-4 gap-2">
                      {['1', '2', '3', '4', '5', '6+'].map((r) => (
                        <Button
                          key={r}
                          variant={formData.rooms === r ? 'default' : 'outline'}
                          onClick={() => updateField('rooms', r)}
                          className="h-12"
                        >
                          {r}
                        </Button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {currentStep === 3 && (
                <>
                  <div className="text-center mb-4">
                    <h1 className="text-xl font-bold mb-2">Kontaktdaten</h1>
                    {selectedTier && (
                      <Badge variant="secondary" className="mt-2">
                        {TIERS.find(t => t.id === selectedTier)?.title} gewählt
                      </Badge>
                    )}
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
                    Mit Klick auf "Offerten erhalten" erlaubst du uns, deine Anfrage weiterzugeben.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <StickyFooterCTA
        primaryLabel={currentStep === 3 ? 'Offerten erhalten' : 'Weiter'}
        onPrimary={handleNext}
        disabled={currentStep === 1 ? formData.fromZip.length < 4 || formData.toZip.length < 4 : false}
        hint="Unverbindlich • Kostenlos • Geprüfte Partner"
        secondaryLabel="Zurück"
        onSecondary={handleBack}
      />
    </div>
  );
};

export default V6aFeedbackBased;
