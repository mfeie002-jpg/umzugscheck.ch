import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Package, Truck, SprayCan, Warehouse, ChevronRight, Check, Shield, Lock, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Types
interface FlowData {
  fromLocation: string;
  toLocation: string;
  rooms: string;
  moveDate: string;
  services: string[];
  name: string;
  email: string;
  phone: string;
  [key: string]: unknown;
}

const INITIAL_DATA: FlowData = {
  fromLocation: '',
  toLocation: '',
  rooms: '',
  moveDate: '',
  services: [],
  name: '',
  email: '',
  phone: '',
};

const ROOM_OPTIONS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5+'];

const SERVICE_OPTIONS = [
  { id: 'montage', label: 'Möbelmontage', icon: Package, description: 'Auf- & Abbau' },
  { id: 'reinigung', label: 'Reinigung', icon: SprayCan, description: 'Endreinigung' },
  { id: 'lagerung', label: 'Lagerung', icon: Warehouse, description: 'Zwischenlager' },
];

// Progress Bar Component
const ProgressBar = memo(({ progress }: { progress: number }) => (
  <div className="w-full h-1.5 bg-slate-200 overflow-hidden">
    <motion.div
      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
  </div>
));
ProgressBar.displayName = 'ProgressBar';

// Trust Badges
const TrustBadges = memo(() => (
  <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
    <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-emerald-600" /> Geprüft</span>
    <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5 text-emerald-600" /> SSL</span>
    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-500" /> 4.8/5</span>
  </div>
));
TrustBadges.displayName = 'TrustBadges';

// Step 1: The Route (Combined Addresses)
const StepRoute = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        Vergleiche Umzugsfirmen in deiner Region
      </h1>
      <p className="text-slate-500">Starte mit deiner Route</p>
    </div>

    <div className="space-y-4">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
        <Input
          type="text"
          placeholder="Von (PLZ oder Ort)"
          value={data.fromLocation}
          onChange={(e) => onUpdate({ fromLocation: e.target.value })}
          className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-emerald-500 rounded-xl"
          inputMode="text"
        />
      </div>

      <div className="flex justify-center">
        <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500" />
      </div>

      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600" />
        <Input
          type="text"
          placeholder="Nach (PLZ oder Ort)"
          value={data.toLocation}
          onChange={(e) => onUpdate({ toLocation: e.target.value })}
          className="pl-12 h-14 text-lg border-2 border-slate-200 focus:border-teal-500 rounded-xl"
          inputMode="text"
        />
      </div>
    </div>

    <TrustBadges />
  </div>
));
StepRoute.displayName = 'StepRoute';

// Step 2: Details (Rooms + Date)
const StepDetails = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Details zum Umzug</h2>
      <p className="text-slate-500">Wohnungsgrösse und Datum</p>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">Anzahl Zimmer</label>
      <div className="grid grid-cols-5 gap-2">
        {ROOM_OPTIONS.map((room) => (
          <motion.button
            key={room}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdate({ rooms: room })}
            className={cn(
              'py-3 px-2 rounded-xl text-sm font-medium transition-all border-2',
              data.rooms === room
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30'
                : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
            )}
          >
            {room}
          </motion.button>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        <Calendar className="inline w-4 h-4 mr-1" /> Umzugsdatum
      </label>
      <Input
        type="date"
        value={data.moveDate}
        onChange={(e) => onUpdate({ moveDate: e.target.value })}
        className="h-14 text-lg border-2 border-slate-200 focus:border-emerald-500 rounded-xl"
      />
    </div>
  </div>
));
StepDetails.displayName = 'StepDetails';

// Step 3: Services
const StepServices = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => {
  const toggleService = (id: string) => {
    const current = data.services || [];
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    onUpdate({ services: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Zusätzliche Services</h2>
        <p className="text-slate-500">Optional, aber spart Zeit</p>
      </div>

      <div className="space-y-3">
        {SERVICE_OPTIONS.map((service) => {
          const isSelected = data.services?.includes(service.id);
          const Icon = service.icon;
          return (
            <motion.button
              key={service.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => toggleService(service.id)}
              className={cn(
                'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4',
                isSelected
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'bg-white border-slate-200 hover:border-emerald-300'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-600'
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-slate-900">{service.label}</div>
                <div className="text-sm text-slate-500">{service.description}</div>
              </div>
              {isSelected && <Check className="w-5 h-5 text-emerald-600" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});
StepServices.displayName = 'StepServices';

// Step 4: Labor Illusion (Matching Animation)
const StepMatching = memo(({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const phases = [
    'Suche passende Firmen...',
    'Prüfe Verfügbarkeit...',
    'Berechne beste Angebote...',
    'Match gefunden!'
  ];

  React.useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    phases.forEach((_, i) => {
      timers.push(setTimeout(() => setPhase(i), i * 1000));
    });
    timers.push(setTimeout(onComplete, 3500));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full"
      />
      
      <div className="space-y-4 text-center">
        {phases.map((text, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: phase >= i ? 1 : 0.3, x: 0 }}
            className={cn(
              'flex items-center gap-3 text-lg',
              phase >= i ? 'text-slate-900' : 'text-slate-400'
            )}
          >
            {phase > i ? (
              <Check className="w-5 h-5 text-emerald-600" />
            ) : phase === i ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="w-5 h-5 rounded-full bg-emerald-500"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-slate-200" />
            )}
            {text}
          </motion.div>
        ))}
      </div>
    </div>
  );
});
StepMatching.displayName = 'StepMatching';

// Step 5: Contact Form
const StepContact = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">🎉 Wir haben passende Firmen!</h2>
      <p className="text-slate-500">Wohin sollen wir die Offerten senden?</p>
    </div>

    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Ihr Name"
        value={data.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="h-14 text-lg border-2 border-slate-200 focus:border-emerald-500 rounded-xl"
      />
      <Input
        type="email"
        placeholder="E-Mail Adresse"
        value={data.email}
        onChange={(e) => onUpdate({ email: e.target.value })}
        className="h-14 text-lg border-2 border-slate-200 focus:border-emerald-500 rounded-xl"
        inputMode="email"
      />
      <div>
        <Input
          type="tel"
          placeholder="Telefonnummer"
          value={data.phone}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          className="h-14 text-lg border-2 border-slate-200 focus:border-emerald-500 rounded-xl"
          inputMode="tel"
        />
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          <Lock className="w-3 h-3" /> Nur für Offerten-Rückfragen
        </p>
      </div>
    </div>
  </div>
));
StepContact.displayName = 'StepContact';

// Success Screen
const StepSuccess = memo(() => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-12 space-y-6"
  >
    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
      <Check className="w-10 h-10 text-white" />
    </div>
    <h2 className="text-2xl font-bold text-slate-900">Anfrage erfolgreich!</h2>
    <p className="text-slate-600">Sie erhalten in Kürze bis zu 5 Offerten.</p>
    <TrustBadges />
  </motion.div>
));
StepSuccess.displayName = 'StepSuccess';

// Main Flow Component
export const V9ZeroFrictionFlow = memo(() => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FlowData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateData = useCallback((update: Partial<FlowData>) => {
    setData((prev) => ({ ...prev, ...update }));
  }, []);

  const canProceed = useCallback(() => {
    switch (step) {
      case 1: return data.fromLocation.length >= 2 && data.toLocation.length >= 2;
      case 2: return data.rooms && data.moveDate;
      case 3: return true; // Services optional
      case 4: return true; // Auto-advance
      case 5: return data.name && data.email && data.phone;
      default: return false;
    }
  }, [step, data]);

  const handleNext = useCallback(() => {
    if (step === 5) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } else {
      setStep((s) => Math.min(s + 1, 5));
    }
  }, [step]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const progress = (step / 5) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <StepSuccess />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex flex-col">
      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
        {step > 1 && step !== 4 ? (
          <button onClick={handleBack} className="flex items-center gap-1 text-slate-600 text-sm">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
        ) : (
          <div />
        )}
        <span className="text-sm text-slate-500">{step !== 4 && `${Math.round(progress)}% geschafft`}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <StepRoute data={data} onUpdate={updateData} />}
              {step === 2 && <StepDetails data={data} onUpdate={updateData} />}
              {step === 3 && <StepServices data={data} onUpdate={updateData} />}
              {step === 4 && <StepMatching onComplete={handleNext} />}
              {step === 5 && <StepContact data={data} onUpdate={updateData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky CTA */}
      {step !== 4 && (
        <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur border-t border-slate-100 safe-area-bottom">
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30"
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                {step === 5 ? 'Kostenlose Offerten erhalten' : 'Weiter'}
                <ChevronRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
});

V9ZeroFrictionFlow.displayName = 'V9ZeroFrictionFlow';
export default V9ZeroFrictionFlow;
