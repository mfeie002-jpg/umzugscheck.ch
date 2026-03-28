/**
 * V3d - Thumb Zone Optimized
 * Focus: All interactive elements in thumb-reachable areas
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
import { Check, ThumbsUp, MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Art' },
  { id: 2, title: 'Wo' },
  { id: 3, title: 'Was' },
  { id: 4, title: 'Wer' },
];

const MOVE_TYPES = [
  { id: 'private', label: 'Privatumzug', sublabel: 'Wohnung/Haus' },
  { id: 'business', label: 'Firmenumzug', sublabel: 'Büro/Geschäft' },
  { id: 'senior', label: 'Seniorenumzug', sublabel: 'Mit Betreuung' },
];

const SERVICES = [
  { id: 'packing', label: 'Ein- und Auspacken' },
  { id: 'furniture', label: 'Möbelmontage' },
  { id: 'cleaning', label: 'Endreinigung' },
];

export const V3dThumbZone: React.FC = () => {
  const initialStep = useInitialStep(1);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selectedType, setSelectedType] = useState<string | null>(isCaptureMode ? 'private' : null);
  const [fromLocation, setFromLocation] = useState(isCaptureMode ? demoData.fromLocation : '');
  const [toLocation, setToLocation] = useState(isCaptureMode ? demoData.toLocation : '');
  const [moveDate, setMoveDate] = useState(isCaptureMode ? demoData.moveDate : '');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    isCaptureMode ? new Set(['packing']) : new Set()
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

  const renderThumbZoneContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="grid grid-cols-1 gap-3">
            {MOVE_TYPES.map((type) => (
              <ThumbButton
                key={type.id}
                label={type.label}
                sublabel={type.sublabel}
                selected={selectedType === type.id}
                onClick={() => setSelectedType(type.id)}
              />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-green-500" />
                Von
              </Label>
              <Input
                placeholder="PLZ oder Ort"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-red-500" />
                Nach
              </Label>
              <Input
                placeholder="PLZ oder Ort"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                Datum
              </Label>
              <Input
                type="date"
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-3">
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer",
                  selectedServices.has(service.id)
                    ? "border-primary bg-primary/10"
                    : "border-border"
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
          <div className="space-y-3">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                Name
              </Label>
              <Input
                placeholder="Ihr Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                E-Mail
              </Label>
              <Input
                type="email"
                placeholder="ihre@email.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4" />
                Telefon
              </Label>
              <Input
                type="tel"
                placeholder="+41 79 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 text-lg"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Minimal top bar - non-interactive */}
      <div className="px-4 py-2 text-center border-b border-border">
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ThumbsUp className="h-3 w-3" />
          <span>V3d Thumb-Zone</span>
        </div>
      </div>

      {/* Content area - scrollable, non-critical */}
      <div className="flex-1 p-4 pb-48">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {currentStep === 1 && 'Welche Art Umzug?'}
            {currentStep === 2 && 'Von wo nach wo?'}
            {currentStep === 3 && 'Was brauchen Sie?'}
            {currentStep === 4 && 'Wie erreichen wir Sie?'}
          </h1>
          <p className="text-muted-foreground">
            Schritt {currentStep} von {STEPS.length}
          </p>
        </div>

        {/* Visual progress */}
        <div className="flex justify-center gap-3 mb-8">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-medium transition-all ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground scale-110'
                  : step.id < currentStep
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step.id < currentStep ? <Check className="h-5 w-5" /> : step.id}
            </div>
          ))}
        </div>

        {/* Info content */}
        <Card className="p-4 bg-muted/50">
          <p className="text-sm text-muted-foreground text-center">
            ℹ️ Alle Eingaben sind unten im Daumenbereich
          </p>
        </Card>
      </div>

      {/* THUMB ZONE - All interactive elements here */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <Progress value={progress} className="h-1" />
        
        <div className="p-4 space-y-3 max-h-[45vh] overflow-y-auto">
          {renderThumbZoneContent()}
        </div>

        {/* Navigation */}
        <div className="p-4 pt-2 flex gap-3 border-t border-border pb-[max(1rem,env(safe-area-inset-bottom))]">
          {currentStep > 1 ? (
            <>
              <Button
                variant="outline"
                size="lg"
                className="h-16 text-lg flex-1"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Zurück
              </Button>
              <Button
                size="lg"
                className="h-16 text-lg flex-[2]"
                onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
              >
                {currentStep === STEPS.length ? 'Absenden ✓' : 'Weiter →'}
              </Button>
            </>
          ) : (
            <Button
              size="lg"
              className="h-16 text-lg w-full"
              onClick={() => setCurrentStep(2)}
              disabled={!selectedType}
            >
              Weiter →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const ThumbButton: React.FC<{
  label: string;
  sublabel: string;
  selected?: boolean;
  onClick: () => void;
}> = ({ label, sublabel, selected, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full p-5 rounded-2xl border-2 text-left transition-all active:scale-[0.98]",
      selected
        ? 'border-primary bg-primary/10'
        : 'border-border'
    )}
  >
    <div className="font-semibold text-lg">{label}</div>
    <div className="text-sm text-muted-foreground">{sublabel}</div>
  </button>
);

export default V3dThumbZone;
