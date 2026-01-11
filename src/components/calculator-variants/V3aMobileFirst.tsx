/**
 * V3a - Mobile-First Base
 * Focus: Touch-optimized, large targets, bottom-sheet patterns
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
import { ArrowRight, ArrowLeft, Smartphone, Check, MapPin, Calendar, Package, User, Mail, Phone } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Umzugsart', shortTitle: 'Art' },
  { id: 2, title: 'Details', shortTitle: 'Details' },
  { id: 3, title: 'Services', shortTitle: 'Services' },
  { id: 4, title: 'Kontakt', shortTitle: 'Kontakt' },
];

const MOVE_TYPES = [
  { id: 'private', label: 'Privatumzug' },
  { id: 'business', label: 'Firmenumzug' },
  { id: 'senior', label: 'Seniorenumzug' },
];

const SERVICES = [
  { id: 'packing', label: 'Ein- und Auspacken' },
  { id: 'furniture', label: 'Möbelmontage' },
  { id: 'cleaning', label: 'Endreinigung' },
  { id: 'storage', label: 'Zwischenlagerung' },
];

export const V3aMobileFirst: React.FC = () => {
  const initialStep = useInitialStep(1);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedType, setSelectedType] = useState<string>(isCaptureMode ? 'private' : '');
  const [fromLocation, setFromLocation] = useState(isCaptureMode ? demoData.fromLocation : '');
  const [toLocation, setToLocation] = useState(isCaptureMode ? demoData.toLocation : '');
  const [moveDate, setMoveDate] = useState(isCaptureMode ? demoData.moveDate : '');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    isCaptureMode ? new Set(['packing', 'cleaning']) : new Set()
  );
  const [name, setName] = useState(isCaptureMode ? demoData.name : '');
  const [email, setEmail] = useState(isCaptureMode ? demoData.email : '');
  const [phone, setPhone] = useState(isCaptureMode ? demoData.phone : '');
  
  const progress = (currentStep / STEPS.length) * 100;

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) next.delete(serviceId);
      else next.add(serviceId);
      return next;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3">
            {MOVE_TYPES.map((type) => (
              <TouchOption
                key={type.id}
                label={type.label}
                selected={selectedType === type.id}
                onSelect={() => setSelectedType(type.id)}
              />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-500" />
                Von (Abholadresse)
              </Label>
              <Input
                placeholder="z.B. 8048 Zürich"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-red-500" />
                Nach (Lieferadresse)
              </Label>
              <Input
                placeholder="z.B. 3011 Bern"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Umzugsdatum
              </Label>
              <Input
                type="date"
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
                className="h-12"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              Wählen Sie optionale Services:
            </p>
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all",
                  selectedServices.has(service.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Checkbox
                  checked={selectedServices.has(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
                <span className="font-medium">{service.label}</span>
              </label>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                placeholder="Ihr vollständiger Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
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
                className="h-12"
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
                className="h-12"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Mobile-optimized sticky header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Schritt {currentStep} von {STEPS.length}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Smartphone className="h-3 w-3" />
            <span>V3a Mobile-First</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step pills - scrollable on mobile */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 -mx-4 px-4">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground'
                  : step.id < currentStep
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.id < currentStep ? (
                <Check className="h-3 w-3" />
              ) : (
                step.shortTitle
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content area - optimized for thumb reach */}
      <div className="p-4">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">
            {STEPS[currentStep - 1].title}
          </h2>
          {renderStepContent()}
        </Card>
      </div>

      {/* Fixed bottom navigation - thumb-friendly */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Zurück
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1 h-14"
            onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
          >
            {currentStep === STEPS.length ? 'Absenden' : 'Weiter'}
            {currentStep < STEPS.length && <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

const TouchOption: React.FC<{ 
  label: string; 
  selected?: boolean;
  onSelect: () => void;
}> = ({ label, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all active:scale-[0.98] ${
      selected
        ? 'border-primary bg-primary/5 text-primary'
        : 'border-border hover:border-primary/50'
    }`}
  >
    {label}
  </button>
);

export default V3aMobileFirst;
