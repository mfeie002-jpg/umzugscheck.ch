/**
 * V5a - High Contrast Accessibility
 * Focus: WCAG AAA compliance, maximum readability
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
import { Eye, Check, MapPin, Calendar, User, Mail, Phone } from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { useCaptureMode } from '@/hooks/use-capture-mode';

const STEPS = ['Umzugsart', 'Adressen', 'Services', 'Kontakt'];

const MOVE_TYPES = [
  { id: 'private', label: 'Privatumzug', description: 'Wohnung, Haus oder Zimmer' },
  { id: 'business', label: 'Firmenumzug', description: 'Büro, Geschäft oder Lager' },
  { id: 'senior', label: 'Seniorenumzug', description: 'Mit besonderer Betreuung' },
];

const SERVICES = [
  { id: 'packing', label: 'Ein- und Auspacken' },
  { id: 'furniture', label: 'Möbelmontage' },
  { id: 'cleaning', label: 'Endreinigung' },
];

export const V5aHighContrast: React.FC = () => {
  const initialStep = useInitialStep(1);
  const { isCaptureMode, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [selected, setSelected] = useState<string | null>(isCaptureMode ? 'private' : null);
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
          <div className="space-y-4" role="radiogroup" aria-label="Umzugsart auswählen">
            {MOVE_TYPES.map((type) => (
              <HighContrastOption
                key={type.id}
                id={type.id}
                label={type.label}
                description={type.description}
                selected={selected === type.id}
                onSelect={() => setSelected(type.id)}
              />
            ))}
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Von (Abholadresse)
              </Label>
              <Input
                placeholder="z.B. 8048 Zürich"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                className="h-14 text-lg border-4 border-black dark:border-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nach (Lieferadresse)
              </Label>
              <Input
                placeholder="z.B. 3011 Bern"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="h-14 text-lg border-4 border-black dark:border-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Umzugsdatum
              </Label>
              <Input
                type="date"
                value={moveDate}
                onChange={(e) => setMoveDate(e.target.value)}
                className="h-14 text-lg border-4 border-black dark:border-white"
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-lg">Wählen Sie optionale Zusatzleistungen:</p>
            {SERVICES.map((service) => (
              <label
                key={service.id}
                className={`flex items-center gap-4 p-4 border-4 cursor-pointer ${
                  selectedServices.has(service.id)
                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                    : 'border-black dark:border-white'
                }`}
              >
                <Checkbox
                  checked={selectedServices.has(service.id)}
                  onCheckedChange={() => toggleService(service.id)}
                  className="h-6 w-6 border-2"
                />
                <span className="text-xl font-bold">{service.label}</span>
              </label>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-lg font-bold flex items-center gap-2">
                <User className="h-5 w-5" />
                Ihr Name
              </Label>
              <Input
                placeholder="Vollständiger Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-14 text-lg border-4 border-black dark:border-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold flex items-center gap-2">
                <Mail className="h-5 w-5" />
                E-Mail-Adresse
              </Label>
              <Input
                type="email"
                placeholder="ihre@email.ch"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 text-lg border-4 border-black dark:border-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-lg font-bold flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Telefonnummer
              </Label>
              <Input
                type="tel"
                placeholder="+41 79 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-14 text-lg border-4 border-black dark:border-white"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const getStepQuestion = () => {
    switch (currentStep) {
      case 1: return 'Welche Art von Umzug planen Sie?';
      case 2: return 'Von wo nach wo ziehen Sie?';
      case 3: return 'Welche Zusatzleistungen benötigen Sie?';
      case 4: return 'Wie können wir Sie erreichen?';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-black focus:text-white"
      >
        Zum Hauptinhalt springen
      </a>

      <header className="border-b-4 border-black dark:border-white px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Umzugsrechner</h1>
          <div className="flex items-center gap-2 text-sm">
            <Eye className="h-4 w-4" />
            <span>V5a Kontrast</span>
          </div>
        </div>
      </header>

      <div className="px-6 py-4 border-b-2 border-black/20 dark:border-white/20">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">Schritt {currentStep} von {STEPS.length}</span>
          <span className="font-bold text-lg">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-4 bg-gray-300 dark:bg-gray-700" />
        <div className="flex justify-between mt-2">
          {STEPS.map((step, i) => (
            <span
              key={i}
              className={`text-sm font-medium ${
                i + 1 === currentStep
                  ? 'underline underline-offset-4 decoration-4'
                  : i + 1 < currentStep
                  ? 'text-black/60 dark:text-white/60'
                  : 'text-black/40 dark:text-white/40'
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      <main id="main-content" className="p-6">
        <Card className="p-6 border-4 border-black dark:border-white rounded-none">
          <h2 className="text-2xl font-bold mb-6 border-b-4 border-black dark:border-white pb-4">
            {getStepQuestion()}
          </h2>

          {renderStepContent()}

          <div className="mt-8 flex gap-4">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-16 text-xl font-bold border-4 border-black dark:border-white rounded-none hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                ← Zurück
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1 h-16 text-xl font-bold bg-black text-white dark:bg-white dark:text-black rounded-none hover:bg-black/80 dark:hover:bg-white/80"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
            >
              {currentStep === STEPS.length ? 'Absenden' : 'Weiter →'}
            </Button>
          </div>
        </Card>

        <div className="mt-6 p-4 border-2 border-black/50 dark:border-white/50">
          <p className="text-lg">
            <strong>Hilfe benötigt?</strong> Rufen Sie uns an: 0800 123 456
          </p>
        </div>
      </main>
    </div>
  );
};

const HighContrastOption: React.FC<{
  id: string;
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}> = ({ id, label, description, selected, onSelect }) => (
  <button
    role="radio"
    aria-checked={selected}
    onClick={onSelect}
    className={`w-full p-6 text-left border-4 transition-colors focus:outline-none focus:ring-4 focus:ring-black dark:focus:ring-white ${
      selected
        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
        : 'border-black dark:border-white hover:bg-black/10 dark:hover:bg-white/10'
    }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${
        selected
          ? 'border-white dark:border-black bg-white dark:bg-black'
          : 'border-black dark:border-white'
      }`}>
        {selected && <Check className="h-5 w-5 text-black dark:text-white" />}
      </div>
      <div>
        <div className="text-xl font-bold">{label}</div>
        <div className={`text-lg ${selected ? 'text-white/80 dark:text-black/80' : 'text-black/70 dark:text-white/70'}`}>
          {description}
        </div>
      </div>
    </div>
  </button>
);

export default V5aHighContrast;
