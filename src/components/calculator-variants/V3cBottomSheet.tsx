/**
 * V3c - Bottom Sheet Pattern
 * Focus: Native app-like bottom sheet interactions
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
import { ChevronUp, Layers, MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Umzugsart', icon: '🏠' },
  { id: 2, title: 'Adressen', icon: '📍' },
  { id: 3, title: 'Services', icon: '🔧' },
  { id: 4, title: 'Kontakt', icon: '📞' },
];

const MOVE_TYPES = [
  { id: 'private', emoji: '🏠', label: 'Privatumzug', desc: 'Wohnung oder Haus' },
  { id: 'business', emoji: '🏢', label: 'Firmenumzug', desc: 'Büro oder Geschäft' },
  { id: 'senior', emoji: '👴', label: 'Seniorenumzug', desc: 'Mit extra Betreuung' },
];

const SERVICES = [
  { id: 'packing', label: 'Ein- und Auspacken' },
  { id: 'furniture', label: 'Möbelmontage' },
  { id: 'cleaning', label: 'Endreinigung' },
];

export const V3cBottomSheet: React.FC = () => {
  const initialStep = useInitialStep(1);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [sheetExpanded, setSheetExpanded] = useState(true);
  
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
          <div className="space-y-4">
            {MOVE_TYPES.map((type) => (
              <SheetOption
                key={type.id}
                emoji={type.emoji}
                label={type.label}
                desc={type.desc}
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
                <Calendar className="h-4 w-4" />
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
            <p className="text-sm text-muted-foreground">Wählen Sie optionale Services:</p>
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer",
                  selectedServices.has(service.id)
                    ? "border-primary bg-primary/5"
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
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      {/* Background content preview */}
      <div className="p-4 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Umzugsrechner</h1>
          <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
            <Layers className="h-3 w-3" />
            <span>V3c Sheet</span>
          </div>
        </div>
        
        {/* Progress overview */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`text-center p-3 rounded-xl transition-all ${
                step.id === currentStep
                  ? 'bg-primary text-primary-foreground scale-105'
                  : step.id < currentStep
                  ? 'bg-primary/20'
                  : 'bg-muted'
              }`}
            >
              <div className="text-2xl mb-1">{step.icon}</div>
              <div className="text-xs font-medium truncate">{step.title}</div>
            </div>
          ))}
        </div>

        <Progress value={progress} className="h-2" />
      </div>

      {/* Bottom Sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-2xl transition-all duration-300 ${
          sheetExpanded ? 'h-[70vh]' : 'h-24'
        }`}
      >
        {/* Sheet handle */}
        <div
          className="flex justify-center py-3 cursor-pointer"
          onClick={() => setSheetExpanded(!sheetExpanded)}
        >
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Sheet header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold">
              {STEPS[currentStep - 1].title}
            </h2>
            <p className="text-sm text-muted-foreground">
              Schritt {currentStep} von {STEPS.length}
            </p>
          </div>
          <button
            className="p-2 hover:bg-muted rounded-full"
            onClick={() => setSheetExpanded(!sheetExpanded)}
          >
            <ChevronUp className={`h-5 w-5 transition-transform ${sheetExpanded ? '' : 'rotate-180'}`} />
          </button>
        </div>

        {/* Sheet content */}
        {sheetExpanded && (
          <div className="p-6 overflow-y-auto h-[calc(70vh-180px)]">
            {renderStepContent()}
          </div>
        )}

        {/* Sheet footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Zurück
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
            >
              {currentStep === STEPS.length ? 'Absenden' : 'Weiter'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SheetOption: React.FC<{
  emoji: string;
  label: string;
  desc: string;
  selected?: boolean;
  onSelect: () => void;
}> = ({ emoji, label, desc, selected, onSelect }) => (
  <button
    onClick={onSelect}
    className={cn(
      "w-full p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all active:scale-[0.98]",
      selected
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50'
    )}
  >
    <span className="text-3xl">{emoji}</span>
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
  </button>
);

export default V3cBottomSheet;
