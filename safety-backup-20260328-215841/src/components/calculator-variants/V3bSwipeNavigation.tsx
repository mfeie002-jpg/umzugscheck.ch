/**
 * V3b - Swipe Navigation (Quick Win Enhanced)
 * Focus: Gesture-based navigation + Button alternatives + Clear instructions
 * 
 * Capture Mode Support: Distinct content per step
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Hand, ArrowLeft, ArrowRight, Smartphone, MapPin, Calendar, Package, User, Mail, Phone } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, title: 'Umzugsart wählen' },
  { id: 2, title: 'Adressen & Grösse' },
  { id: 3, title: 'Zusatzleistungen' },
  { id: 4, title: 'Ihre Kontaktdaten' },
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
];

export const V3bSwipeNavigation: React.FC = () => {
  const initialStep = useInitialStep(1);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showHint, setShowHint] = useState(!isCaptureMode);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  
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

  useEffect(() => {
    if (isCaptureMode) return;
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, [isCaptureMode]);

  const goNext = () => {
    if (currentStep < STEPS.length) {
      setSwipeDirection('left');
      setCurrentStep(currentStep + 1);
      setShowHint(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setSwipeDirection('right');
      setCurrentStep(currentStep - 1);
      setShowHint(false);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goBack,
    trackMouse: false,
    trackTouch: true,
  });

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
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  "w-full p-4 rounded-xl border-2 text-left font-medium transition-all",
                  selectedType === type.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                {type.label}
              </button>
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
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
          <div className="space-y-3">
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer",
                  selectedServices.has(service.id)
                    ? "border-primary bg-primary/5"
                    : "border-border"
                )}
              >
                <Checkbox
                  checked={selectedServices.has(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                />
                <span>{service.label}</span>
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

  return (
    <div className="min-h-screen bg-background" {...handlers}>
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            Schritt {currentStep} von {STEPS.length}
          </span>
          <div className="flex items-center gap-1 text-xs text-primary">
            <Smartphone className="h-3 w-3" />
            <span>V3b Swipe</span>
          </div>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Instruction Hint */}
      <AnimatePresence>
        {showHint && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-primary/10 border border-primary/20 rounded-lg mx-4 mt-4 p-3"
          >
            <div className="flex items-center gap-3">
              <motion.div animate={{ x: [-5, 5, -5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Hand className="h-5 w-5 text-primary" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium">Navigation</p>
                <p className="text-xs text-muted-foreground">Wischen oder Buttons nutzen</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowHint(false)}>OK</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step content */}
      <div className="p-4 pb-28">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={currentStep === 1}
              className={currentStep === 1 ? 'opacity-30' : ''}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <h2 className="text-xl font-semibold text-center flex-1 mx-4">
              {STEPS[currentStep - 1].title}
            </h2>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goNext}
              disabled={currentStep === STEPS.length}
              className={currentStep === STEPS.length ? 'opacity-30' : ''}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {STEPS.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`h-3 rounded-full transition-all ${
                  step.id === currentStep
                    ? 'w-8 bg-primary'
                    : step.id < currentStep
                    ? 'w-3 bg-primary/50'
                    : 'w-3 bg-muted'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: swipeDirection === 'left' ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: swipeDirection === 'left' ? -50 : 50 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button variant="outline" className="flex-1 h-14" size="lg" onClick={goBack}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              Zurück
            </Button>
          )}
          <Button 
            className={`h-14 ${currentStep > 1 ? 'flex-1' : 'w-full'}`} 
            size="lg"
            onClick={currentStep === STEPS.length ? undefined : goNext}
          >
            {currentStep === STEPS.length ? 'Offerten anfordern' : 'Weiter'}
            {currentStep < STEPS.length && <ArrowRight className="h-5 w-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default V3bSwipeNavigation;
