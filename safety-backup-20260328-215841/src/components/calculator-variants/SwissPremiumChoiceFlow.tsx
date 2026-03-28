/**
 * Swiss Premium Choice Flow - 3 Steps with Package Selection
 * Route: /umzugsofferten/swiss-premium-choice
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  FlowStepShell, StickyCtaBar, ReviewReceipt, useFlowState, TrustBarMini, FlowCompleteFeedback 
} from '@/components/flow-components';
import { MapPin, Calendar, Home, User, Mail, Phone, Package, CheckCircle2, Send, Star, Sparkles, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwissPremiumFormData {
  [key: string]: unknown;
  fromZip: string; toZip: string; moveDate: string; rooms: string;
  floor: string; hasLift: boolean; heavyItems: boolean;
  selectedPackage: 'basic' | 'recommended' | 'premium';
  name: string; email: string; phone: string; notes: string; privacy: boolean;
}

const INITIAL_DATA: SwissPremiumFormData = {
  fromZip: '', toZip: '', moveDate: '', rooms: '', floor: 'EG', hasLift: false, heavyItems: false,
  selectedPackage: 'recommended',
  name: '', email: '', phone: '', notes: '', privacy: false,
};

const ROOMS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6+'];

const PACKAGES = [
  {
    id: 'basic' as const,
    name: 'Basic',
    icon: Package,
    forWhom: 'Für preisbewusste Umzüge',
    benefits: ['Transport & Fahrer', 'Grundversicherung', 'Flexible Termine'],
    multiplier: 0.8,
  },
  {
    id: 'recommended' as const,
    name: 'Empfohlen',
    icon: Star,
    forWhom: 'Für stressfreie Umzüge',
    benefits: ['Alles aus Basic', 'Möbelmontage inklusive', 'Verpackungsmaterial'],
    multiplier: 1.0,
    recommended: true,
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    icon: Crown,
    forWhom: 'Für maximalen Komfort',
    benefits: ['Alles aus Empfohlen', 'Ein- & Auspacken', 'Endreinigung'],
    multiplier: 1.4,
  },
];

export const SwissPremiumChoiceFlow: React.FC = () => {
  const [state, actions] = useFlowState<SwissPremiumFormData>({
    storageKey: 'swiss-premium-choice-flow',
    initialData: INITIAL_DATA,
    totalSteps: 3,
  });

  const { formData, currentStep, isSubmitting } = state;
  const basePrice = (parseFloat(formData.rooms) || 2) * 450;
  const packageMultiplier = PACKAGES.find(p => p.id === formData.selectedPackage)?.multiplier || 1;
  const price = { 
    min: Math.round(basePrice * packageMultiplier * 0.85), 
    max: Math.round(basePrice * packageMultiplier * 1.25) 
  };
  
  const isStep1Valid = formData.fromZip.length >= 4 && formData.toZip.length >= 4 && formData.rooms;
  const isStep2Valid = !!formData.selectedPackage;
  const isStep3Valid = formData.name && formData.email.includes('@') && formData.phone.length >= 9 && formData.privacy;

  const handleSubmit = async () => {
    actions.setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    actions.setComplete();
    console.log('Swiss Premium Choice submitted:', formData);
  };

  if (state.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <div className="max-w-md w-full space-y-6">
          <Card className="text-center">
            <CardContent className="pt-8 pb-6 space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </motion.div>
              <h2 className="text-2xl font-bold">Anfrage erfolgreich!</h2>
              <p className="text-muted-foreground">Ihr {PACKAGES.find(p => p.id === formData.selectedPackage)?.name}-Paket wurde angefragt.</p>
            </CardContent>
          </Card>
          
          <FlowCompleteFeedback
            flowId="swiss-premium-choice"
            flowLabel="Swiss Premium Choice 💎"
            onComplete={() => window.location.href = '/'}
            onSkip={() => window.location.href = '/'}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <FlowStepShell
        title={currentStep === 1 ? "Ihr Umzug" : currentStep === 2 ? "Wählen Sie Ihr Paket" : "Fast geschafft!"}
        subtitle={currentStep === 1 ? "Wohin soll es gehen?" : currentStep === 2 ? "Passen Sie den Service an Ihre Bedürfnisse an" : "Ihre Kontaktdaten für die Offerten"}
        currentStep={currentStep}
        totalSteps={3}
        onBack={() => actions.prevStep()}
        hasStickyCta
      >
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />Von (PLZ)</Label>
                <Input inputMode="numeric" maxLength={4} placeholder="8000" value={formData.fromZip} onChange={e => actions.updateField('fromZip', e.target.value)} className="h-12 text-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />Nach (PLZ)</Label>
                <Input inputMode="numeric" maxLength={4} placeholder="3000" value={formData.toZip} onChange={e => actions.updateField('toZip', e.target.value)} className="h-12 text-lg" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" />Umzugsdatum</Label>
              <Input type="date" value={formData.moveDate} onChange={e => actions.updateField('moveDate', e.target.value)} className="h-12 text-lg" min={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Home className="h-4 w-4 text-primary" />Zimmer</Label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {ROOMS.map(r => (
                  <Button key={r} type="button" variant={formData.rooms === r ? 'default' : 'outline'} className={cn("h-11", formData.rooms === r && "ring-2 ring-primary")} onClick={() => actions.updateField('rooms', r)}>{r}</Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="heavyItems" checked={formData.heavyItems} onCheckedChange={c => actions.updateField('heavyItems', c as boolean)} />
              <Label htmlFor="heavyItems" className="text-sm">Schwere Gegenstände (Klavier, Tresor, etc.)</Label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {PACKAGES.map((pkg) => {
              const Icon = pkg.icon;
              const isSelected = formData.selectedPackage === pkg.id;
              const pkgPrice = { 
                min: Math.round(basePrice * pkg.multiplier * 0.85), 
                max: Math.round(basePrice * pkg.multiplier * 1.25) 
              };
              return (
                <motion.div
                  key={pkg.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "cursor-pointer transition-all relative overflow-hidden",
                      isSelected ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:border-primary/50",
                      pkg.recommended && "border-primary/30"
                    )}
                    onClick={() => actions.updateField('selectedPackage', pkg.id)}
                  >
                    {pkg.recommended && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                        Beliebt
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                          isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                        )}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h3 className="font-semibold text-lg">{pkg.name}</h3>
                            <span className="text-sm font-medium text-primary">CHF {pkgPrice.min}–{pkgPrice.max}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{pkg.forWhom}</p>
                          <ul className="space-y-1">
                            {pkg.benefits.map((b, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0",
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                        )}>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary-foreground" />}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
            <p className="text-xs text-center text-muted-foreground mt-4">Änderbar später • Kostenlos & unverbindlich</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <ReviewReceipt
              items={[
                { label: 'Von', value: formData.fromZip, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
                { label: 'Nach', value: formData.toZip, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
                { label: 'Datum', value: formData.moveDate || 'Flexibel', icon: <Calendar className="h-4 w-4" />, editStep: 1 },
                { label: 'Zimmer', value: formData.rooms, icon: <Home className="h-4 w-4" />, editStep: 1 },
                { label: 'Paket', value: PACKAGES.find(p => p.id === formData.selectedPackage)?.name || '', icon: <Package className="h-4 w-4" />, editStep: 2 },
              ]}
              onEdit={(step) => actions.goToStep(step || 1)}
              priceRange={price}
              variant="highlighted"
            />
            <div className="space-y-3">
              <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input placeholder="Vor- und Nachname" value={formData.name} onChange={e => actions.updateField('name', e.target.value)} className="h-14 pl-11 text-lg" />{formData.name && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />}</div>
              <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input type="email" inputMode="email" placeholder="E-Mail" value={formData.email} onChange={e => actions.updateField('email', e.target.value)} className="h-14 pl-11 text-lg" />{formData.email.includes('@') && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />}</div>
              <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /><Input type="tel" inputMode="tel" placeholder="Telefon" value={formData.phone} onChange={e => actions.updateField('phone', e.target.value)} className="h-14 pl-11 text-lg" />{formData.phone.length >= 9 && <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />}</div>
            </div>
            <div className="flex items-start gap-3">
              <Checkbox id="privacy" checked={formData.privacy} onCheckedChange={c => actions.updateField('privacy', c as boolean)} className="mt-1" />
              <Label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed">Ich akzeptiere die <a href="/datenschutz" className="text-primary underline">Datenschutzerklärung</a>.</Label>
            </div>
          </div>
        )}
      </FlowStepShell>

      <StickyCtaBar
        ctaText={currentStep === 3 ? "Offerten anfordern" : "Weiter"}
        onCtaClick={currentStep === 3 ? handleSubmit : () => actions.nextStep()}
        disabled={currentStep === 1 ? !isStep1Valid : currentStep === 2 ? !isStep2Valid : !isStep3Valid}
        isLoading={isSubmitting}
        showBack={currentStep > 1}
        onBack={() => actions.prevStep()}
        currentStep={currentStep}
        totalSteps={3}
        ctaIcon={currentStep === 3 ? <Send className="h-5 w-5" /> : undefined}
      />
    </>
  );
};

export default SwissPremiumChoiceFlow;
