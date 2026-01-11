/**
 * V4c - Value-First Approach
 * Focus: Show savings/benefits before asking for information
 * 
 * Capture Mode Support: Distinct content per step
 */

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Gift, Percent, Clock, Shield, Calculator, ChevronRight, MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { cn } from '@/lib/utils';

const MOVE_TYPES = [
  { id: 'private', label: 'Privatumzug', saving: 'CHF 480' },
  { id: 'business', label: 'Firmenumzug', saving: 'CHF 1,200' },
];

const SERVICES = [
  { id: 'packing', label: 'Ein- und Auspacken', saving: '+CHF 80' },
  { id: 'furniture', label: 'Möbelmontage', saving: '+CHF 40' },
  { id: 'cleaning', label: 'Endreinigung', saving: '+CHF 120' },
];

export const V4cValueFirst: React.FC = () => {
  const initialStep = useInitialStep(0);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [estimatedSaving, setEstimatedSaving] = useState(450);
  const [selectedType, setSelectedType] = useState<string>(isCaptureMode ? 'private' : '');
  const [fromLocation, setFromLocation] = useState(isCaptureMode ? demoData.fromLocation : '');
  const [toLocation, setToLocation] = useState(isCaptureMode ? demoData.toLocation : '');
  const [moveDate, setMoveDate] = useState(isCaptureMode ? demoData.moveDate : '');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    isCaptureMode ? new Set(['packing']) : new Set()
  );
  const [name, setName] = useState(isCaptureMode ? demoData.name : '');
  const [email, setEmail] = useState(isCaptureMode ? demoData.email : '');
  const [phone, setPhone] = useState(isCaptureMode ? demoData.phone : '');
  
  const progress = (currentStep / 4) * 100;

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  // Value proposition step (step 0)
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
        <div className="p-4">
          <div className="flex items-center justify-center gap-1 text-xs text-primary mb-4">
            <Calculator className="h-3 w-3" />
            <span>V4c Value-First</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Sparen Sie durchschnittlich</h1>
            <div className="text-5xl font-bold text-primary mb-2">CHF {estimatedSaving}</div>
            <p className="text-muted-foreground">bei Ihrem Umzug mit unserem Vergleich</p>
          </div>

          <div className="grid gap-3 mb-8">
            <ValueCard icon={<Percent className="h-6 w-6 text-green-500" />} title="Bis zu 40% günstiger" description="Im Vergleich zu Einzelanfragen" />
            <ValueCard icon={<Clock className="h-6 w-6 text-blue-500" />} title="3+ Offerten in 24h" description="Schnell und unkompliziert" />
            <ValueCard icon={<Shield className="h-6 w-6 text-purple-500" />} title="100% kostenlos" description="Keine versteckten Gebühren" />
            <ValueCard icon={<Gift className="h-6 w-6 text-amber-500" />} title="Exklusive Rabatte" description="Nur über unsere Plattform" />
          </div>

          <Card className="p-4 bg-primary/5 border-primary/20 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calculator className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Schnellrechner</p>
                <p className="text-sm text-muted-foreground">In 2 Minuten zu Ihrer persönlichen Ersparnis</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </Card>

          <Button size="lg" className="w-full h-14 text-lg" onClick={() => setCurrentStep(1)}>
            Jetzt Ersparnis berechnen
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">Über 15,000 zufriedene Kunden</p>
        </div>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3 mb-6">
            {MOVE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left transition-all",
                  selectedType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{type.label}</span>
                  <span className="text-sm text-green-600">Ø {type.saving} gespart</span>
                </div>
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Von
              </Label>
              <Input
                placeholder="z.B. 8048 Zürich"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                Nach
              </Label>
              <Input
                placeholder="z.B. 3011 Bern"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Datum
              </Label>
              <Input
                type="date"
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3 mb-6">
            <p className="text-sm text-muted-foreground">Zusätzliche Ersparnisse möglich:</p>
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer",
                  selectedServices.has(service.id)
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedServices.has(service.id)}
                    onCheckedChange={() => toggleService(service.id)}
                  />
                  <span>{service.label}</span>
                </div>
                <span className="text-sm text-green-600">{service.saving}</span>
              </label>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                placeholder="Ihr Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                E-Mail
              </Label>
              <Input
                type="email"
                placeholder="ihre@email.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Telefon
              </Label>
              <Input
                type="tel"
                placeholder="+41 79 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Umzugsart';
      case 2: return 'Adressen';
      case 3: return 'Zusatzservices';
      case 4: return 'Kontaktdaten';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Savings reminder header */}
      <div className="sticky top-0 z-50 bg-green-500/10 border-b border-green-500/20 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-400">
              Ihre potenzielle Ersparnis: <strong>CHF {estimatedSaving}</strong>
            </span>
          </div>
          <div className="text-xs text-primary">V4c Value</div>
        </div>
      </div>

      <div className="p-4 pb-24">
        <Progress value={progress} className="h-2 mb-6" />

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            Schritt {currentStep}: {getStepTitle()}
          </h2>

          {renderStepContent()}

          <Button
            size="lg"
            className="w-full"
            onClick={() => setCurrentStep(Math.min(currentStep + 1, 4))}
          >
            {currentStep === 4 ? 'Offerten anfordern' : 'Weiter zur Ersparnis'}
          </Button>
          
          {currentStep > 1 && (
            <Button
              variant="ghost"
              className="w-full mt-2"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Zurück
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

const ValueCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <Card className="p-4 flex items-center gap-4">
    <div className="flex-shrink-0">{icon}</div>
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  </Card>
);

export default V4cValueFirst;
