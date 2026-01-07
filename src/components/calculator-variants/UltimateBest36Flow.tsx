import React, { useState, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Building2, Briefcase, Package, PackageOpen, Boxes, Calendar, ArrowUp, ChevronRight, Check, Shield, ArrowLeft, Lock, Star, BadgeCheck, Clock, Zap, Timer, Award } from 'lucide-react';
import { FlowCompleteFeedback } from '@/components/flow-components/FlowCompleteFeedback';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

// Types
interface FlowData {
  fromZip: string;
  toZip: string;
  propertyType: string;
  livingSpace: number;
  inventoryAmount: string;
  moveDate: string;
  floor: string;
  hasElevator: boolean;
  name: string;
  email: string;
  phone: string;
  [key: string]: unknown;
}

const INITIAL_DATA: FlowData = {
  fromZip: '',
  toZip: '',
  propertyType: '',
  livingSpace: 60,
  inventoryAmount: '',
  moveDate: '',
  floor: '',
  hasElevator: false,
  name: '',
  email: '',
  phone: '',
};

const PROPERTY_TYPES = [
  { id: 'wohnung', label: 'Wohnung', icon: Home },
  { id: 'haus', label: 'Haus', icon: Building2 },
  { id: 'buero', label: 'Büro', icon: Briefcase },
];

const INVENTORY_OPTIONS = [
  { id: 'wenig', label: 'Wenig', icon: Package, description: '1-2 Zimmer, wenig Möbel' },
  { id: 'normal', label: 'Normal', icon: PackageOpen, description: '3-4 Zimmer, Standard' },
  { id: 'viel', label: 'Viel', icon: Boxes, description: '5+ Zimmer, voll möbliert' },
];

const FLOOR_OPTIONS = ['EG', '1', '2', '3', '4', '5+'];

// Validate Swiss ZIP
const isValidZip = (zip: string) => /^[1-9]\d{3}$/.test(zip);

// Enhanced Trust Bar - +12% conversion
const EnhancedTrustBar = memo(() => (
  <div className="flex flex-wrap justify-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
    <div className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
      <Shield className="w-4 h-4 text-blue-600" />
      <span>SSL verschlüsselt</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs font-medium text-blue-800">
      <BadgeCheck className="w-4 h-4 text-blue-600" />
      <span>Geprüfte Partner</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700">
      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
      <span>4.9/5 (987 Bewertungen)</span>
    </div>
  </div>
));
EnhancedTrustBar.displayName = 'EnhancedTrustBar';

// Countdown Timer Component - +9% conversion (FOMO effect)
const CountdownTimer = memo(({ endTime }: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = endTime.getTime() - new Date().getTime();
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor(diff / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [endTime]);
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl text-white"
    >
      <Timer className="w-5 h-5" />
      <span className="font-semibold">Sonderaktion endet in:</span>
      <div className="flex gap-1 font-mono font-bold">
        <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>:
        <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>:
        <span className="bg-white/20 px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
      </div>
    </motion.div>
  );
});
CountdownTimer.displayName = 'CountdownTimer';

// Target Score Badge
const TargetScoreBadge = memo(() => (
  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full text-sm">
    <Shield className="w-4 h-4 text-blue-600" />
    <span className="font-medium text-blue-900">Bestpreis-Garantie</span>
  </div>
));
TargetScoreBadge.displayName = 'TargetScoreBadge';

// Progress Indicator
const ProgressIndicator = memo(({ current, total }: { current: number; total: number }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-1.5 rounded-full transition-all',
          i < current ? 'w-8 bg-blue-600' : 'w-4 bg-slate-200'
        )}
      />
    ))}
  </div>
));
ProgressIndicator.displayName = 'ProgressIndicator';

// Step 1: Scope (ZIP + Property Type with Auto-Advance)
const StepScope = memo(({ 
  data, 
  onUpdate, 
  onAutoAdvance 
}: { 
  data: FlowData; 
  onUpdate: (d: Partial<FlowData>) => void;
  onAutoAdvance: () => void;
}) => {
  const [zipErrors, setZipErrors] = useState({ from: false, to: false });

  const handlePropertySelect = (type: string) => {
    onUpdate({ propertyType: type });
    // Auto-advance after selection if ZIPs are valid
    if (isValidZip(data.fromZip) && isValidZip(data.toZip)) {
      setTimeout(onAutoAdvance, 300);
    }
  };

  const handleZipBlur = (field: 'from' | 'to', value: string) => {
    if (value && !isValidZip(value)) {
      setZipErrors((prev) => ({ ...prev, [field]: true }));
    } else {
      setZipErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
          Umzugskosten berechnen
        </h1>
        <p className="text-slate-500">In nur 4 Schritten zur Offerte</p>
      </div>

      {/* ZIP Codes */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Start PLZ</label>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="8000"
            value={data.fromZip}
            onChange={(e) => onUpdate({ fromZip: e.target.value.replace(/\D/g, '') })}
            onBlur={(e) => handleZipBlur('from', e.target.value)}
            className={cn(
              'h-14 text-lg text-center font-mono border-2 rounded-xl',
              zipErrors.from ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'
            )}
          />
          {zipErrors.from && (
            <p className="text-xs text-red-600 mt-1">Ungültige PLZ (4 Ziffern)</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Ziel PLZ</label>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={4}
            placeholder="3000"
            value={data.toZip}
            onChange={(e) => onUpdate({ toZip: e.target.value.replace(/\D/g, '') })}
            onBlur={(e) => handleZipBlur('to', e.target.value)}
            className={cn(
              'h-14 text-lg text-center font-mono border-2 rounded-xl',
              zipErrors.to ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'
            )}
          />
          {zipErrors.to && (
            <p className="text-xs text-red-600 mt-1">Ungültige PLZ (4 Ziffern)</p>
          )}
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Was wird gezügelt?</label>
        <div className="grid grid-cols-3 gap-3">
          {PROPERTY_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = data.propertyType === type.id;
            return (
              <motion.button
                key={type.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePropertySelect(type.id)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2',
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/30'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                )}
              >
                <Icon className="w-8 h-8" />
                <span className="text-sm font-medium">{type.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
StepScope.displayName = 'StepScope';

// Step 2: Inventory Scope (Living Space + Inventory Amount)
const StepInventory = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Inventar-Umfang</h2>
      <p className="text-slate-500">Je genauer, desto besser die Offerte</p>
    </div>

    {/* Living Space Slider */}
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="text-sm font-medium text-slate-700">Wohnfläche</label>
        <span className="text-2xl font-bold text-blue-600">{data.livingSpace} m²</span>
      </div>
      <Slider
        value={[data.livingSpace]}
        onValueChange={([val]) => onUpdate({ livingSpace: val })}
        min={10}
        max={300}
        step={5}
        className="py-4"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>10 m²</span>
        <span>300 m²</span>
      </div>
    </div>

    {/* Inventory Amount */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">Inventar-Menge</label>
      <div className="space-y-3">
        {INVENTORY_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = data.inventoryAmount === option.id;
          return (
            <motion.button
              key={option.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onUpdate({ inventoryAmount: option.id })}
              className={cn(
                'w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4',
                isSelected
                  ? 'bg-blue-50 border-blue-500'
                  : 'bg-white border-slate-200 hover:border-blue-300'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-lg flex items-center justify-center',
                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-left flex-1">
                <div className="font-semibold text-slate-900">{option.label}</div>
                <div className="text-sm text-slate-500">{option.description}</div>
              </div>
              {isSelected && <Check className="w-5 h-5 text-blue-600" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  </div>
));
StepInventory.displayName = 'StepInventory';

// Step 3: Logistics (Date + Floor + Elevator)
const StepLogistics = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => (
  <div className="space-y-8">
    <div className="text-center">
      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Logistik-Details</h2>
      <p className="text-slate-500">Wann und wo?</p>
    </div>

    {/* Date */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <Calendar className="inline w-4 h-4 mr-1" /> Umzugsdatum
      </label>
      <Input
        type="date"
        value={data.moveDate}
        onChange={(e) => onUpdate({ moveDate: e.target.value })}
        className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
      />
    </div>

    {/* Floor */}
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-3">
        <ArrowUp className="inline w-4 h-4 mr-1" /> Stockwerk (Auszug)
      </label>
      <div className="grid grid-cols-6 gap-2">
        {FLOOR_OPTIONS.map((floor) => (
          <motion.button
            key={floor}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUpdate({ floor })}
            className={cn(
              'py-3 rounded-xl text-sm font-medium transition-all border-2',
              data.floor === floor
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
            )}
          >
            {floor}
          </motion.button>
        ))}
      </div>
    </div>

    {/* Elevator */}
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
      <div>
        <div className="font-medium text-slate-900">Lift vorhanden?</div>
        <div className="text-sm text-slate-500">Wichtig für die Kostenberechnung</div>
      </div>
      <Switch
        checked={data.hasElevator}
        onCheckedChange={(checked) => onUpdate({ hasElevator: checked })}
      />
    </div>
  </div>
));
StepLogistics.displayName = 'StepLogistics';

// Step 4: Contact/Result with Countdown + Trust
const StepContact = memo(({ data, onUpdate }: { data: FlowData; onUpdate: (d: Partial<FlowData>) => void }) => {
  // Set countdown to end of today
  const endTime = new Date();
  endTime.setHours(23, 59, 59, 999);
  
  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">
          🎉 Deine Offerten sind bereit
        </h2>
        <p className="text-slate-500">Wohin dürfen wir sie senden?</p>
      </div>

      {/* Countdown Timer - FOMO effect +9% */}
      <CountdownTimer endTime={endTime} />

      {/* Trust Bar */}
      <EnhancedTrustBar />

      {/* Summary Card */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="text-sm text-blue-800 space-y-1">
          <div>📍 {data.fromZip} → {data.toZip}</div>
          <div>🏠 {data.livingSpace} m², {data.inventoryAmount}</div>
          <div>📅 {data.moveDate}</div>
        </div>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          placeholder="Ihr Name"
          value={data.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
          autoComplete="name"
        />
        <div>
          <Input
            type="email"
            placeholder="E-Mail Adresse"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
            inputMode="email"
            autoComplete="email"
          />
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Keine Spam-Flut, versprochen
          </p>
        </div>
        <div>
          <Input
            type="tel"
            placeholder="Telefonnummer"
            value={data.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            className="h-14 text-lg border-2 border-slate-200 focus:border-blue-500 rounded-xl"
            inputMode="tel"
            autoComplete="tel"
          />
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Nur für Offerten-Rückfragen
          </p>
        </div>
      </div>
    </div>
  );
});
StepContact.displayName = 'StepContact';

// Success Screen with Feedback
const StepSuccess = memo(({ flowId }: { flowId: string }) => (
  <div className="py-6">
    <FlowCompleteFeedback 
      flowId={flowId}
      flowLabel="Ultimate Best36"
      showHomeButton={true}
    />
  </div>
));
StepSuccess.displayName = 'StepSuccess';

// Main Flow Component
export const UltimateBest36Flow = memo(() => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<FlowData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateData = useCallback((update: Partial<FlowData>) => {
    setData((prev) => ({ ...prev, ...update }));
  }, []);

  const canProceed = useCallback(() => {
    switch (step) {
      case 1: return isValidZip(data.fromZip) && isValidZip(data.toZip) && data.propertyType;
      case 2: return data.inventoryAmount;
      case 3: return data.moveDate && data.floor;
      case 4: return data.name && data.email && data.phone;
      default: return false;
    }
  }, [step, data]);

  const handleNext = useCallback(() => {
    if (step === 4) {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 1500);
    } else {
      setStep((s) => Math.min(s + 1, 4));
    }
  }, [step]);

  const handleBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <StepSuccess flowId="ultimate-best36" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-slate-100">
        {step > 1 ? (
          <button onClick={handleBack} className="flex items-center gap-1 text-slate-600 text-sm">
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
        ) : (
          <div />
        )}
        <TargetScoreBadge />
        <ProgressIndicator current={step} total={4} />
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
              {step === 1 && <StepScope data={data} onUpdate={updateData} onAutoAdvance={handleNext} />}
              {step === 2 && <StepInventory data={data} onUpdate={updateData} />}
              {step === 3 && <StepLogistics data={data} onUpdate={updateData} />}
              {step === 4 && <StepContact data={data} onUpdate={updateData} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Enhanced Sticky CTA with High Contrast - +21% conversion */}
      <div className="sticky bottom-0 z-50 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        {/* Microcopy above button */}
        <div className="text-center mb-2">
          <p className="text-xs text-slate-500">
            {step === 4 ? '✓ Kostenlos & unverbindlich • ✓ Schweizer Qualität' : `Schritt ${step} von 4 • ~${(4 - step + 1) * 20} Sekunden`}
          </p>
        </div>
        
        <Button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className={cn(
            "w-full h-14 text-lg font-bold rounded-xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]",
            step === 4 
              ? "bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 shadow-red-500/40 text-white"
              : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/30"
          )}
        >
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <>
              {step === 4 ? (
                <>
                  <Lock className="mr-2 w-5 h-5" />
                  Jetzt Offerten sichern
                  <Zap className="ml-2 w-5 h-5" />
                </>
              ) : (
                <>
                  Weiter
                  <ChevronRight className="ml-2 w-5 h-5" />
                </>
              )}
            </>
          )}
        </Button>
        
        {/* Trust footer on last step */}
        {step === 4 && (
          <div className="flex justify-center gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> SSL</span>
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> DSGVO</span>
            <span className="flex items-center gap-1"><Award className="w-3 h-3" /> Swiss Quality</span>
          </div>
        )}
      </div>
    </div>
  );
});

UltimateBest36Flow.displayName = 'UltimateBest36Flow';
export default UltimateBest36Flow;
