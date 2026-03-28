/**
 * V5f Feedback-Based - Marketplace Wizard Optimized
 * 
 * ChatGPT Pro Feedback implementiert:
 * - Top 3 empfohlen + "Mehr anzeigen"
 * - Klare CTA pro Karte und Sticky "Offerten anfragen"
 * - Anbieter-Trust: Bewertungen, geprüfte Partner
 * - Wizard führt klar (konsistente Zustände)
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle2, Lock, MapPin, User, Mail, Phone, Star, ChevronDown, Building2 } from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Details' },
  { id: 2, title: 'Firmen' },
  { id: 3, title: 'Kontakt' },
];

const PROVIDERS = [
  { id: '1', name: 'Züri Umzüge AG', rating: 4.9, reviews: 234, badges: ['Express', 'Versichert'], recommended: true },
  { id: '2', name: 'Swiss Move GmbH', rating: 4.8, reviews: 189, badges: ['Günstig', 'Erfahren'], recommended: true },
  { id: '3', name: 'ProfiZügel Bern', rating: 4.7, reviews: 156, badges: ['Premium', 'Möbelmontage'], recommended: true },
  { id: '4', name: 'City Umzug Basel', rating: 4.6, reviews: 98, badges: ['Lokal', 'Flexibel'] },
  { id: '5', name: 'Alpen Transport', rating: 4.5, reviews: 67, badges: ['Bergregionen'] },
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

function ProviderCard({ 
  provider, 
  selected, 
  onToggle 
}: { 
  provider: typeof PROVIDERS[0]; 
  selected: boolean; 
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-xl border p-4 transition-all ${
        selected ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-semibold">{provider.name}</p>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{provider.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({provider.reviews})</span>
            </div>
          </div>
        </div>
        {provider.recommended && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            Empfohlen
          </Badge>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {provider.badges.map((b) => (
          <Badge key={b} variant="outline" className="text-xs">
            {b}
          </Badge>
        ))}
        <Badge variant="outline" className="text-xs text-primary border-primary">
          ✓ Geprüft
        </Badge>
      </div>
    </button>
  );
}

export const V5fFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fromZip: '', toZip: '', rooms: '', name: '', email: '', phone: '',
  });
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [showAllProviders, setShowAllProviders] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const toggleProvider = (id: string) => {
    setSelectedProviders(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
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

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const displayedProviders = showAllProviders ? PROVIDERS : PROVIDERS.slice(0, 3);

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
              {selectedProviders.length > 0 
                ? `Du erhältst Offerten von ${selectedProviders.length} ausgewählten Firmen.`
                : 'Du erhältst Offerten von unseren besten Partnerfirmen.'}
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

            {currentStep === 2 && (
              <>
                <div className="text-center mb-4">
                  <h1 className="text-xl font-bold mb-2">Firmen wählen</h1>
                  <p className="text-sm text-muted-foreground">
                    Wähle Firmen für deine Offerten (optional)
                  </p>
                </div>

                <div className="space-y-3">
                  {displayedProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      selected={selectedProviders.includes(provider.id)}
                      onToggle={() => toggleProvider(provider.id)}
                    />
                  ))}
                </div>

                {!showAllProviders && PROVIDERS.length > 3 && (
                  <Button
                    variant="ghost"
                    onClick={() => setShowAllProviders(true)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Mehr Anbieter anzeigen ({PROVIDERS.length - 3})
                  </Button>
                )}

                <p className="text-xs text-muted-foreground text-center">
                  Keine Auswahl? Wir matchen dich automatisch mit den besten Firmen.
                </p>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="text-center mb-4">
                  <h1 className="text-xl font-bold mb-2">Kontaktdaten</h1>
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
                  Mit Klick auf "Offerten anfragen" erlaubst du uns, deine Anfrage weiterzugeben.
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <StickyFooterCTA
        primaryLabel={currentStep === 3 ? 'Offerten anfragen' : currentStep === 2 ? `Weiter${selectedProviders.length > 0 ? ` (${selectedProviders.length})` : ''}` : 'Weiter'}
        onPrimary={handleNext}
        disabled={currentStep === 1 ? formData.fromZip.length < 4 || formData.toZip.length < 4 : false}
        hint="Unverbindlich • Kostenlos • Geprüfte Partner"
        secondaryLabel="Zurück"
        onSecondary={handleBack}
      />
    </div>
  );
};

export default V5fFeedbackBased;
