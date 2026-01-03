/**
 * V6a Feedback-Based - Ultimate (6-Tier) Optimized
 * 
 * ChatGPT Pro Feedback implementiert:
 * - Mobile: max 3 Pakete sichtbar, Card-Snap statt Tabellen
 * - "Nur Gratis-Offerten" als Exit
 * - Empfohlen + Default vorausgewählt
 * - Preis-/Paket-Details nach Lead
 * 
 * Uses shared components for consistency across all flows
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Check, MapPin, User, Mail, Phone } from 'lucide-react';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { 
  ProgressHeader, 
  TrustBar, 
  StickyFooterCTA, 
  FormField,
  SuccessState 
} from './shared';

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
      className={`min-w-[260px] snap-start rounded-2xl border p-4 text-left transition-all min-h-[180px] ${
        selected ? 'border-primary bg-primary/5 ring-2 ring-primary' : 'border-border'
      }`}
      aria-pressed={selected}
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
            <Check className="h-4 w-4 text-primary flex-shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <p className="text-lg font-bold text-primary">{tier.price}</p>
    </button>
  );
}

export const V6aFeedbackBased: React.FC = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (isCaptureMode && captureStep !== null && captureStep >= 1 && captureStep <= 3) {
      return captureStep;
    }
    return 1;
  });
  
  const [formData, setFormData] = useState(() => ({
    fromZip: isCaptureMode ? demoData.fromPostal : '',
    toZip: isCaptureMode ? demoData.toPostal : '',
    rooms: isCaptureMode ? '3' : '',
    name: isCaptureMode ? demoData.name : '',
    email: isCaptureMode ? demoData.email : '',
    phone: isCaptureMode ? demoData.phone : '',
  }));
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
    const selectedTierData = TIERS.find(t => t.id === selectedTier);
    return (
      <SuccessState
        title="Anfrage gesendet!"
        description={
          selectedTier 
            ? `Du erhältst ${selectedTierData?.title}-Offerten.`
            : 'Du erhältst unverbindliche Offerten von unseren Partnern.'
        }
      />
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
        {currentStep === 1 && <TrustBar compact />}

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
              className="w-full h-11"
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

                  <FormField 
                    label="Von PLZ" 
                    name="fromZip" 
                    value={formData.fromZip}
                    onChange={(v) => updateField('fromZip', v)} 
                    placeholder="z.B. 8001"
                    inputMode="numeric" 
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
                    error={errors.toZip} 
                    icon={MapPin} 
                  />

                  <div className="space-y-2">
                    <label className="text-base font-medium">Zimmer</label>
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
