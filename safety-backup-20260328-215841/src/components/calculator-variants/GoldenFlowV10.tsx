import React, { useState, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building2, MapPin, Sofa, Bed, ChefHat, Bath, Tv, Dumbbell, Calendar, Check, Shield, Lock, Award, Info, ArrowLeft } from 'lucide-react';
import { FlowCompleteFeedback } from '@/components/flow-components/FlowCompleteFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Types
interface FlowData {
  customerType: string;
  fromLocation: string;
  toLocation: string;
  rooms: string[];
  moveDate: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: unknown;
}

const INITIAL_DATA: FlowData = {
  customerType: '',
  fromLocation: '',
  toLocation: '',
  rooms: [],
  moveDate: '',
  name: '',
  email: '',
  phone: '',
};

const CUSTOMER_TYPES = [
  { id: 'privat', label: 'Privat', description: 'Privatumzug', icon: User },
  { id: 'firma', label: 'Firma', description: 'Geschäftsumzug', icon: Building2 },
];

const ROOM_TYPES = [
  { id: 'wohnzimmer', label: 'Wohnzimmer', icon: Sofa },
  { id: 'schlafzimmer', label: 'Schlafzimmer', icon: Bed },
  { id: 'kueche', label: 'Küche', icon: ChefHat },
  { id: 'bad', label: 'Bad', icon: Bath },
  { id: 'buero', label: 'Büro/Arbeit', icon: Tv },
  { id: 'fitness', label: 'Hobby/Fitness', icon: Dumbbell },
];

// Glassmorphism Card
const GlassCard = memo(({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn(
    'bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 shadow-xl',
    className
  )}>
    {children}
  </div>
));
GlassCard.displayName = 'GlassCard';

// Trust Badges
const TrustBadges = memo(() => (
  <div className="flex flex-wrap items-center justify-center gap-3">
    {[
      { icon: Award, label: 'TÜV geprüft', color: 'text-blue-600' },
      { icon: Shield, label: 'SSL verschlüsselt', color: 'text-emerald-600' },
      { icon: Lock, label: 'DSGVO konform', color: 'text-purple-600' },
    ].map((badge) => (
      <div key={badge.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 rounded-full text-xs font-medium">
        <badge.icon className={cn('w-3.5 h-3.5', badge.color)} />
        <span className="text-slate-700">{badge.label}</span>
      </div>
    ))}
  </div>
));
TrustBadges.displayName = 'TrustBadges';

// Step 1: Smart Start (Foot in Door)
const StepSmartStart = memo(({ data, onUpdate, onNext }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void; onNext: () => void }) => {
  const handleSelect = (type: string) => {
    onUpdate({ customerType: type });
    setTimeout(onNext, 400);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Für wen ist der Umzug?
        </h1>
        <p className="text-slate-500">Eine kurze Frage zum Start</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {CUSTOMER_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = data.customerType === type.id;
          return (
            <motion.button
              key={type.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98, y: 2 }}
              onClick={() => handleSelect(type.id)}
              className={cn(
                'p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3',
                isSelected
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-500 shadow-lg shadow-violet-500/30'
                  : 'bg-white/80 text-slate-700 border-white/50 hover:border-violet-200'
              )}
            >
              <div className={cn(
                'w-16 h-16 rounded-xl flex items-center justify-center',
                isSelected ? 'bg-white/20' : 'bg-violet-50'
              )}>
                <Icon className={cn('w-8 h-8', isSelected ? 'text-white' : 'text-violet-600')} />
              </div>
              <div className="text-center">
                <div className="font-bold text-lg">{type.label}</div>
                <div className={cn('text-sm', isSelected ? 'text-white/80' : 'text-slate-500')}>
                  {type.description}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <TrustBadges />
    </div>
  );
});
StepSmartStart.displayName = 'StepSmartStart';

// Step 2: The Route (V9 Logic)
const StepRoute = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Deine Route</h2>
      <p className="text-slate-500">Von wo nach wo?</p>
    </div>

    <GlassCard className="p-6 space-y-4">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-600" />
        <Input
          type="text"
          placeholder="Von (PLZ oder Ort)"
          value={data.fromLocation}
          onChange={(e) => onUpdate({ fromLocation: e.target.value })}
          className="pl-12 h-14 text-lg bg-white/50 border-2 border-white/50 focus:border-violet-500 rounded-xl"
        />
      </div>

      <div className="flex justify-center">
        <div className="w-px h-8 bg-gradient-to-b from-violet-500 to-purple-500" />
      </div>

      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600" />
        <Input
          type="text"
          placeholder="Nach (PLZ oder Ort)"
          value={data.toLocation}
          onChange={(e) => onUpdate({ toLocation: e.target.value })}
          className="pl-12 h-14 text-lg bg-white/50 border-2 border-white/50 focus:border-purple-500 rounded-xl"
        />
      </div>
    </GlassCard>
  </div>
));
StepRoute.displayName = 'StepRoute';

// Step 3: Visual Inventory (Icon Grid)
const StepInventory = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => {
  const toggleRoom = (id: string) => {
    const current = data.rooms || [];
    const updated = current.includes(id)
      ? current.filter((r) => r !== id)
      : [...current, id];
    onUpdate({ rooms: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Welche Räume?</h2>
        <p className="text-slate-500">Tippe auf alle zutreffenden</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ROOM_TYPES.map((room) => {
          const Icon = room.icon;
          const isSelected = data.rooms?.includes(room.id);
          return (
            <motion.button
              key={room.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleRoom(room.id)}
              className={cn(
                'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                isSelected
                  ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white border-violet-500'
                  : 'bg-white/80 text-slate-700 border-white/50 hover:border-violet-200'
              )}
            >
              <Icon className="w-7 h-7" />
              <span className="text-xs font-medium">{room.label}</span>
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
});
StepInventory.displayName = 'StepInventory';

// Step 4: Value Building (Summary + Date)
const StepValue = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Fast geschafft!</h2>
      <p className="text-slate-500">Nur noch das Datum</p>
    </div>

    {/* Value Card */}
    <GlassCard className="p-5">
      <div className="text-center mb-4">
        <div className="text-sm text-slate-500">Deine Anfrage im Wert von</div>
        <div className="text-3xl font-bold text-violet-600">CHF 200.-</div>
        <div className="text-xs text-slate-400">Vergleichswert der Offerten</div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">{data.customerType === 'firma' ? '🏢 Firma' : '👤 Privat'}</span>
        <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">📍 {data.fromLocation || '?'} → {data.toLocation || '?'}</span>
        <span className="px-2 py-1 bg-violet-100 text-violet-700 text-xs rounded-full">🏠 {data.rooms?.length || 0} Räume</span>
      </div>
    </GlassCard>

    {/* Date with tooltip */}
    <TooltipProvider>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <label className="text-sm font-medium text-slate-700">
            <Calendar className="inline w-4 h-4 mr-1" /> Umzugsdatum
          </label>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-slate-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Flexibles Datum = günstigere Angebote</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          type="date"
          value={data.moveDate}
          onChange={(e) => onUpdate({ moveDate: e.target.value })}
          className="h-14 text-lg bg-white/80 border-2 border-white/50 focus:border-violet-500 rounded-xl"
        />
      </div>
    </TooltipProvider>
  </div>
));
StepValue.displayName = 'StepValue';

// Step 5: Labor Illusion (V6c Logic)
const StepLabor = memo(({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  const phases = [
    { text: 'Analysiere Wegstrecke...', icon: '🗺️' },
    { text: 'Berechne Volumen...', icon: '📦' },
    { text: 'Identifiziere Top-Firmen...', icon: '🏆' },
    { text: 'Erstelle Offerten...', icon: '✨' },
  ];

  React.useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    phases.forEach((_, i) => {
      timers.push(setTimeout(() => setPhase(i), i * 1000));
    });
    timers.push(setTimeout(onComplete, 4500));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8">
      <motion.div
        animate={{ 
          boxShadow: ['0 0 20px rgba(139, 92, 246, 0.3)', '0 0 40px rgba(139, 92, 246, 0.6)', '0 0 20px rgba(139, 92, 246, 0.3)']
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-3 border-white/30 border-t-white rounded-full"
        />
      </motion.div>

      <GlassCard className="p-6 w-full max-w-sm">
        <div className="space-y-4">
          {phases.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: phase >= i ? 1 : 0.3, 
                x: 0,
              }}
              className="flex items-center gap-3"
            >
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all',
                phase > i ? 'bg-emerald-500 text-white' : phase === i ? 'bg-violet-500 text-white' : 'bg-slate-200'
              )}>
                {phase > i ? <Check className="w-4 h-4" /> : p.icon}
              </div>
              <span className={cn(
                'text-sm font-medium',
                phase >= i ? 'text-slate-900' : 'text-slate-400'
              )}>
                {p.text}
              </span>
            </motion.div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
});
StepLabor.displayName = 'StepLabor';

// Step 6: High-Trust Checkout
const StepCheckout = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
        🎉 Deine Offerten sind bereit!
      </h2>
      <p className="text-slate-500">Wohin dürfen wir sie senden?</p>
    </div>

    <GlassCard className="p-6 space-y-4">
      <Input
        type="text"
        placeholder="Ihr Name"
        value={data.name}
        onChange={(e) => onUpdate({ name: e.target.value })}
        className="h-14 text-lg bg-white/50 border-2 border-white/50 focus:border-violet-500 rounded-xl"
      />
      <Input
        type="email"
        placeholder="E-Mail Adresse"
        value={data.email}
        onChange={(e) => onUpdate({ email: e.target.value })}
        className="h-14 text-lg bg-white/50 border-2 border-white/50 focus:border-violet-500 rounded-xl"
        inputMode="email"
      />
      <Input
        type="tel"
        placeholder="Telefonnummer"
        value={data.phone}
        onChange={(e) => onUpdate({ phone: e.target.value })}
        className="h-14 text-lg bg-white/50 border-2 border-white/50 focus:border-violet-500 rounded-xl"
        inputMode="tel"
      />
    </GlassCard>

    <TrustBadges />
  </div>
));
StepCheckout.displayName = 'StepCheckout';

// Success Screen with Feedback
const StepSuccess = memo(({ flowId }: { flowId: string }) => (
  <div className="py-6">
    <FlowCompleteFeedback 
      flowId={flowId}
      flowLabel="Golden Flow V10"
      showHomeButton={true}
    />
  </div>
));
StepSuccess.displayName = 'StepSuccess';

// Main Flow Component
export const GoldenFlowV10 = memo(() => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FlowData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateData = useCallback((update: Partial<FlowData>) => {
    setData((prev) => ({ ...prev, ...update }));
  }, []);

  const canProceed = useCallback(() => {
    switch (step) {
      case 1: return data.customerType;
      case 2: return data.fromLocation.length >= 2 && data.toLocation.length >= 2;
      case 3: return data.rooms && data.rooms.length > 0;
      case 4: return data.moveDate;
      case 5: return true; // Auto
      case 6: return data.name && data.email && data.phone;
      default: return false;
    }
  }, [step, data]);

  const handleNext = useCallback(() => {
    if (step === 6) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } else {
      setStep((s) => Math.min(s + 1, 6));
    }
  }, [step]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const progress = (step / 6) * 100;

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex items-center justify-center p-4">
        <GlassCard className="w-full max-w-lg p-8">
          <StepSuccess flowId="golden-flow-v10" />
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-purple-50 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-white/50 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      {/* Header */}
      {step > 1 && step !== 5 && (
        <div className="px-4 py-3 flex items-center">
          <button onClick={handleBack} className="flex items-center gap-1 text-slate-600 text-sm">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
        </div>
      )}

      {/* Content - Thumb Zone Optimized (lower 60%) */}
      <div className="flex-1 flex items-end justify-center p-4 pb-32">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && <StepSmartStart data={data} onUpdate={updateData} onNext={handleNext} />}
              {step === 2 && <StepRoute data={data} onUpdate={updateData} />}
              {step === 3 && <StepInventory data={data} onUpdate={updateData} />}
              {step === 4 && <StepValue data={data} onUpdate={updateData} />}
              {step === 5 && <StepLabor onComplete={handleNext} />}
              {step === 6 && <StepCheckout data={data} onUpdate={updateData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky CTA */}
      {step !== 1 && step !== 5 && (
        <div className="sticky bottom-0 p-4 bg-white/80 backdrop-blur-xl border-t border-white/50 safe-area-bottom">
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className={cn(
              'w-full h-14 text-lg font-semibold rounded-xl transition-all',
              'bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700',
              'shadow-lg shadow-violet-500/30 active:scale-[0.98] active:shadow-md'
            )}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <span className="flex items-center gap-2">
                {step === 6 && <Lock className="w-4 h-4" />}
                {step === 6 ? 'Jetzt kostenlose Offerten ansehen' : 'Weiter'}
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
});

GoldenFlowV10.displayName = 'GoldenFlowV10';
export default GoldenFlowV10;
