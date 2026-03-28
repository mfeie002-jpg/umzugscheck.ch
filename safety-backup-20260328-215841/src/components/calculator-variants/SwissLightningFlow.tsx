/**
 * Swiss Lightning Flow - 2 Steps, 90 Seconds to Lead
 * Route: /umzugsofferten/swiss-lightning
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
import { MapPin, Calendar, Home, User, Mail, Phone, Edit2, Sparkles, CheckCircle2, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SwissLightningFormData {
  [key: string]: unknown;
  fromZip: string; toZip: string; moveDate: string; rooms: string;
  floor: string; hasLift: boolean;
  name: string; email: string; phone: string; privacy: boolean;
}

const INITIAL_DATA: SwissLightningFormData = {
  fromZip: '', toZip: '', moveDate: '', rooms: '', floor: 'EG', hasLift: false,
  name: '', email: '', phone: '', privacy: false,
};

const ROOMS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6+'];

export const SwissLightningFlow: React.FC = () => {
  const [state, actions] = useFlowState<SwissLightningFormData>({
    storageKey: 'swiss-lightning-flow',
    initialData: INITIAL_DATA,
    totalSteps: 2,
  });

  const { formData, currentStep, isSubmitting } = state;
  const price = { min: Math.round((parseFloat(formData.rooms) || 2) * 400 * 0.8), max: Math.round((parseFloat(formData.rooms) || 2) * 400 * 1.3) };
  
  const isStep1Valid = formData.fromZip.length >= 4 && formData.toZip.length >= 4 && formData.rooms;
  const isStep2Valid = formData.name && formData.email.includes('@') && formData.phone.length >= 9 && formData.privacy;

  const handleSubmit = async () => {
    actions.setSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    actions.setComplete();
    console.log('Swiss Lightning submitted:', formData);
  };

  if (state.isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/30 p-4">
        <div className="max-w-md w-full space-y-6">
          {/* Success Message */}
          <Card className="text-center">
            <CardContent className="pt-8 pb-6 space-y-4">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-16 h-16 mx-auto rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </motion.div>
              <h2 className="text-2xl font-bold">Anfrage erfolgreich!</h2>
              <p className="text-muted-foreground">Sie erhalten in Kürze bis zu 5 unverbindliche Offerten.</p>
            </CardContent>
          </Card>
          
          {/* Feedback Component */}
          <FlowCompleteFeedback
            flowId="swiss-lightning"
            flowLabel="Swiss Lightning ⚡"
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
        title={currentStep === 1 ? "Ihr Umzug in 90 Sekunden" : "Fast geschafft!"}
        subtitle={currentStep === 1 ? "Nur 2 Schritte zu kostenlosen Offerten" : "Ihre Kontaktdaten für die Offerten"}
        currentStep={currentStep}
        totalSteps={2}
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
            {formData.rooms && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm text-muted-foreground">Geschätzte Kosten</p><p className="text-2xl font-bold text-primary">CHF {price.min.toLocaleString()} – {price.max.toLocaleString()}</p></div>
                  <Sparkles className="h-8 w-8 text-primary/50" />
                </div>
              </motion.div>
            )}
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5">
            <ReviewReceipt
              items={[
                { label: 'Von', value: formData.fromZip, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
                { label: 'Nach', value: formData.toZip, icon: <MapPin className="h-4 w-4" />, editStep: 1 },
                { label: 'Datum', value: formData.moveDate || 'Flexibel', icon: <Calendar className="h-4 w-4" />, editStep: 1 },
                { label: 'Zimmer', value: formData.rooms, icon: <Home className="h-4 w-4" />, editStep: 1 },
              ]}
              onEdit={() => actions.goToStep(1)}
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
        ctaText={currentStep === 1 ? "Weiter" : "Offerten anfordern"}
        onCtaClick={currentStep === 1 ? () => actions.nextStep() : handleSubmit}
        disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
        isLoading={isSubmitting}
        showBack={currentStep > 1}
        onBack={() => actions.prevStep()}
        currentStep={currentStep}
        totalSteps={2}
        ctaIcon={currentStep === 2 ? <Send className="h-5 w-5" /> : undefined}
      />
    </>
  );
};

export default SwissLightningFlow;
