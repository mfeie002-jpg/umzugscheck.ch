/**
 * V4a - Urgency-Based Conversion
 * Focus: Scarcity, time pressure, immediate action triggers
 * 
 * Supports capture mode with step-specific content:
 * - Step 1: Move type selection
 * - Step 2: Details (from/to, date)
 * - Step 3: Services selection
 * - Step 4: Contact form
 */

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Users, AlertTriangle, Zap, TrendingUp, MapPin, Calendar, Package, User, Mail, Phone, ArrowLeft, Check } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import { cn } from '@/lib/utils';

const TOTAL_STEPS = 4;

const MOVE_TYPES = [
  { id: 'private', label: 'Privatumzug', badge: 'Beliebteste Wahl', badgeColor: 'green' as const },
  { id: 'business', label: 'Firmenumzug', badge: '2 heute gebucht', badgeColor: 'blue' as const },
  { id: 'express', label: 'Express-Umzug', badge: 'Nur noch 1 Platz!', badgeColor: 'red' as const, urgent: true },
];

const SERVICES = [
  { id: 'packing', label: 'Ein- und Auspacken', price: '+CHF 150' },
  { id: 'furniture', label: 'Möbelmontage', price: '+CHF 80' },
  { id: 'cleaning', label: 'Endreinigung', price: '+CHF 200' },
  { id: 'storage', label: 'Zwischenlagerung', price: '+CHF 50/Tag' },
];

export const V4aUrgencyBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [timeLeft, setTimeLeft] = useState(892); // 14:52 minutes
  const [activeUsers, setActiveUsers] = useState(23);
  
  // Form state
  const [selectedMoveType, setSelectedMoveType] = useState<string>(isCaptureMode ? 'private' : '');
  const [fromLocation, setFromLocation] = useState(isCaptureMode ? demoData.fromLocation : '');
  const [toLocation, setToLocation] = useState(isCaptureMode ? demoData.toLocation : '');
  const [moveDate, setMoveDate] = useState(isCaptureMode ? demoData.moveDate : '');
  const [selectedServices, setSelectedServices] = useState<Set<string>>(
    isCaptureMode ? new Set(['packing', 'cleaning']) : new Set()
  );
  const [name, setName] = useState(isCaptureMode ? demoData.name : '');
  const [email, setEmail] = useState(isCaptureMode ? demoData.email : '');
  const [phone, setPhone] = useState(isCaptureMode ? demoData.phone : '');
  
  const progress = (currentStep / TOTAL_STEPS) * 100;

  // Countdown timer (disabled in capture mode)
  useEffect(() => {
    if (isCaptureMode) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isCaptureMode]);

  // Fluctuating active users (disabled in capture mode)
  useEffect(() => {
    if (isCaptureMode) return;
    const timer = setInterval(() => {
      setActiveUsers((prev) => prev + Math.floor(Math.random() * 3) - 1);
    }, 5000);
    return () => clearInterval(timer);
  }, [isCaptureMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => {
      const next = new Set(prev);
      if (next.has(serviceId)) {
        next.delete(serviceId);
      } else {
        next.add(serviceId);
      }
      return next;
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Schritt 1: Umzugsart wählen
            </h2>
            <div className="space-y-3">
              {MOVE_TYPES.map((type) => (
                <UrgencyOption
                  key={type.id}
                  label={type.label}
                  badge={type.badge}
                  badgeColor={type.badgeColor}
                  selected={selectedMoveType === type.id}
                  urgent={type.urgent}
                  onSelect={() => setSelectedMoveType(type.id)}
                />
              ))}
            </div>
          </Card>
        );
        
      case 2:
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Schritt 2: Umzugsdetails
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-500" />
                  Von (Abholadresse)
                </Label>
                <Input
                  id="from"
                  placeholder="z.B. 8048 Zürich"
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" />
                  Nach (Lieferadresse)
                </Label>
                <Input
                  id="to"
                  placeholder="z.B. 3011 Bern"
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Umzugsdatum
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                />
              </div>
            </div>
          </Card>
        );
        
      case 3:
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Schritt 3: Zusatzservices
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Wählen Sie optionale Services für Ihren Umzug:
            </p>
            <div className="space-y-3">
              {SERVICES.map((service) => (
                <label
                  key={service.id}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                    selectedServices.has(service.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedServices.has(service.id)}
                      onCheckedChange={() => toggleService(service.id)}
                    />
                    <span className="font-medium">{service.label}</span>
                  </div>
                  <span className="text-sm text-primary font-medium">{service.price}</span>
                </label>
              ))}
            </div>
          </Card>
        );
        
      case 4:
        return (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Schritt 4: Kontaktdaten
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Name
                </Label>
                <Input
                  id="name"
                  placeholder="Ihr vollständiger Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  E-Mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ihre@email.ch"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Telefon
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+41 79 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            
            {/* Summary */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Zusammenfassung:</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ {MOVE_TYPES.find(t => t.id === selectedMoveType)?.label || 'Privatumzug'}</li>
                {fromLocation && <li>✓ Von: {fromLocation}</li>}
                {toLocation && <li>✓ Nach: {toLocation}</li>}
                {moveDate && <li>✓ Datum: {moveDate}</li>}
                {selectedServices.size > 0 && (
                  <li>✓ {selectedServices.size} Zusatzservice(s)</li>
                )}
              </ul>
            </div>
          </Card>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Urgency header */}
      <div className="sticky top-0 z-50 bg-destructive/10 border-b border-destructive/20 px-4 py-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-destructive">
            <Clock className="h-4 w-4 animate-pulse" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            <span className="text-destructive/80">Rabatt läuft ab</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{activeUsers} aktiv</span>
          </div>
        </div>
      </div>

      {/* Badge */}
      <div className="flex justify-center py-2">
        <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-3 py-1 rounded-full">
          <Zap className="h-3 w-3" />
          <span>V4a Urgency • Schritt {currentStep}/{TOTAL_STEPS}</span>
        </div>
      </div>

      <div className="p-4 pb-32">
        {/* Flash offer banner */}
        <Card className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30 p-4 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-700 dark:text-amber-400">
                🔥 Exklusiv: 15% Rabatt für die nächsten {Math.ceil(timeLeft / 60)} Minuten
              </p>
              <p className="text-sm text-amber-600/80 dark:text-amber-500/80">
                Nur noch 3 Plätze für diese Woche verfügbar
              </p>
            </div>
          </div>
        </Card>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Schritt {currentStep} von {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step content */}
        {renderStepContent()}

        {/* Social proof ticker */}
        <div className="mt-4 overflow-hidden">
          <div className="animate-scroll-left whitespace-nowrap text-sm text-muted-foreground">
            <span className="mx-4">✓ Max aus Zürich hat gerade gebucht</span>
            <span className="mx-4">✓ 156 Offerten heute verschickt</span>
            <span className="mx-4">✓ Anna aus Bern spart CHF 420</span>
            <span className="mx-4">✓ Durchschnittlich 3.2 Offerten pro Anfrage</span>
          </div>
        </div>
      </div>

      {/* Fixed footer with navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))] z-40">
        <div className="flex gap-3 max-w-lg mx-auto">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="min-h-[48px]"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Zurück
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1 min-h-[48px] bg-gradient-to-r from-primary to-primary/80"
            onClick={handleNext}
          >
            {currentStep === TOTAL_STEPS ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Offerten anfordern
              </>
            ) : (
              <>
                Jetzt 15% Rabatt sichern →
              </>
            )}
          </Button>
        </div>
        <p className="text-center text-xs text-muted-foreground mt-2">
          ⚡ Über 2'400 erfolgreiche Umzüge
        </p>
      </div>
    </div>
  );
};

const UrgencyOption: React.FC<{
  label: string;
  badge: string;
  badgeColor: 'green' | 'blue' | 'red';
  selected?: boolean;
  urgent?: boolean;
  onSelect: () => void;
}> = ({ label, badge, badgeColor, selected, urgent, onSelect }) => {
  const colors = {
    green: 'bg-green-500/10 text-green-600',
    blue: 'bg-blue-500/10 text-blue-600',
    red: 'bg-red-500/10 text-red-600 animate-pulse',
  };

  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full p-4 rounded-xl border-2 text-left transition-all min-h-[56px]",
        selected
          ? 'border-primary bg-primary/5'
          : urgent
          ? 'border-red-500/50 bg-red-500/5 hover:border-red-500'
          : 'border-border hover:border-primary/50'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            selected ? "border-primary bg-primary" : "border-muted-foreground"
          )}>
            {selected && <Check className="h-3 w-3 text-white" />}
          </div>
          <span className="font-medium">{label}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${colors[badgeColor]}`}>
          {badge}
        </span>
      </div>
    </button>
  );
};

export default V4aUrgencyBased;
