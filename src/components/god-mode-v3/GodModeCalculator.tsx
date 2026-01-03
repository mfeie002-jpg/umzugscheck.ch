/**
 * God Mode Calculator V3.a
 * 
 * The ultimate moving experience with a single 0-100 Control-Delegation Slider.
 * Minimal decisions, maximum automation, absolute trust.
 * 
 * V3.a Improvements:
 * - Mobile-optimized slider with tier buttons
 * - Sticky bottom CTA on mobile
 * - Inline validation with feedback
 * - Loading state on submit
 * - LocalStorage persistence
 * - Improved copy and trust signals
 * - Edit functionality in confirmation step
 * - "ab CHF X" price psychology
 */

import { useState, memo, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, Clock, CheckCircle, Star, Crown, Diamond,
  MapPin, Calendar, User, Mail, Phone, Package, Truck,
  Sparkles, Brush, Trash2, Warehouse, Key, FileCheck,
  ArrowRight, ArrowLeft, Eye, Lock, Heart, Award, Edit3,
  Loader2, AlertCircle, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useCaptureMode } from "@/hooks/use-capture-mode";

// Service tiers based on 0-100 slider
const serviceTiers = [
  {
    range: [0, 20],
    id: "budget",
    name: "Budget",
    shortName: "💰",
    tagline: "Sie packen, wir fahren",
    icon: Truck,
    color: "from-slate-500 to-slate-600",
    included: [
      "Transport mit Profis",
      "Basis-Versicherung",
      "Termingarantie",
    ],
    userDoes: ["Packen", "Ein-/Ausladen helfen", "Möbelmontage", "Reinigung"],
    systemDoes: ["Fahrzeug & Team", "Route & Timing", "Versicherung"],
    targetUser: "Studenten, kleine Budgets, DIY-Fans",
    priceRange: { from: 290, to: 590 },
  },
  {
    range: [21, 40],
    id: "smart",
    name: "Smart",
    shortName: "🎯",
    tagline: "Das Beste aus beiden Welten",
    icon: Package,
    color: "from-blue-500 to-blue-600",
    included: [
      "Alles aus Budget",
      "Möbel-Demontage & Montage",
      "Verpackungsmaterial",
      "Ein-/Ausladen inklusive",
    ],
    userDoes: ["Kartons packen", "Reinigung"],
    systemDoes: ["Transport", "Möbel", "Material", "Koordination"],
    targetUser: "Paare, junge Familien, erste Wohnung",
    priceRange: { from: 690, to: 1290 },
  },
  {
    range: [41, 60],
    id: "comfort",
    name: "Comfort",
    shortName: "✨",
    tagline: "Lehnen Sie sich zurück",
    icon: Sparkles,
    color: "from-emerald-500 to-emerald-600",
    included: [
      "Alles aus Smart",
      "Professionelles Einpacken",
      "Auspacken auf Wunsch",
      "Kartonentsorgung",
    ],
    userDoes: ["Persönliches sortieren", "Anweisungen geben"],
    systemDoes: ["Packen", "Transport", "Montage", "Entsorgung"],
    targetUser: "Familien, Berufstätige, wenig Zeit",
    priceRange: { from: 1490, to: 2490 },
  },
  {
    range: [61, 80],
    id: "premium",
    name: "Premium",
    shortName: "👑",
    tagline: "Rundum sorglos",
    icon: Crown,
    color: "from-amber-500 to-amber-600",
    included: [
      "Alles aus Comfort",
      "Endreinigung alte Wohnung",
      "Koordination Schlüsselübergabe",
      "Ummelde-Checkliste erledigt",
      "Premium-Versicherung",
    ],
    userDoes: ["Einzug geniessen"],
    systemDoes: ["Alles. Wirklich alles."],
    targetUser: "Executives, Expats, High-Stress Jobs",
    priceRange: { from: 2990, to: 4490 },
  },
  {
    range: [81, 100],
    id: "whiteglove",
    name: "White Glove",
    shortName: "💎",
    tagline: "Finger schnipsen. Fertig.",
    icon: Diamond,
    color: "from-violet-500 to-violet-600",
    included: [
      "Alles aus Premium",
      "Persönlicher Umzugsberater",
      "Home-Ready Setup",
      "Erste-Nacht-Paket",
      "Kunst & Antiquitäten-Handling",
      "24/7 Concierge-Hotline",
      "Zero-Touch-Garantie",
    ],
    userDoes: ["Nichts. Absolut nichts."],
    systemDoes: ["Komplette Orchestrierung", "Proaktive Kommunikation", "Problemlösung bevor Sie es merken"],
    targetUser: "C-Level, Diplomaten, Ultra-Busy, 'Zeit > Geld'",
    priceRange: { from: 5990, to: 12990 },
  },
];

// Trust signals - more prominent
const trustSignals = [
  { icon: Star, label: "4.9/5 Sterne", detail: "15'247 Bewertungen", highlight: true },
  { icon: Shield, label: "Vollkasko", detail: "Bis CHF 100'000" },
  { icon: Lock, label: "Fixpreis", detail: "Keine Überraschungen" },
  { icon: Clock, label: "Pünktlich", detail: "Oder 20% Rabatt" },
  { icon: Award, label: "Geprüft", detail: "Background-Check" },
  { icon: FileCheck, label: "Protokoll", detail: "Vor & nach Fotos" },
];

// Apartment sizes with multipliers
const apartmentSizes = [
  { id: "studio", label: "Studio", multiplier: 0.5 },
  { id: "2zi", label: "2 Zi.", multiplier: 0.7 },
  { id: "3zi", label: "3 Zi.", multiplier: 1.0 },
  { id: "4zi", label: "4 Zi.", multiplier: 1.4 },
  { id: "5zi", label: "5+ Zi.", multiplier: 2.0 },
];

// Validation helpers
const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const validatePhone = (phone: string): boolean => {
  // Swiss phone format: +41 or 0 followed by digits
  const cleaned = phone.replace(/\s/g, '');
  return /^(\+41|0)[0-9]{9,10}$/.test(cleaned);
};

const formatPhone = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '');
  if (cleaned.startsWith('+41') && cleaned.length >= 12) {
    return `+41 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10)}`;
  }
  if (cleaned.startsWith('0') && cleaned.length >= 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  return phone;
};

interface FormData {
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  controlLevel: number;
  moveDate: string;
  name: string;
  email: string;
  phone: string;
  privacyAccepted: boolean;
}

interface ValidationState {
  email: 'idle' | 'valid' | 'invalid';
  phone: 'idle' | 'valid' | 'invalid';
}

type Step = "slider" | "details" | "confirm" | "contact";
const steps: Step[] = ["slider", "details", "confirm", "contact"];

const STORAGE_KEY = 'umzugscheck_godmode_v3a_draft';

export const GodModeCalculator = memo(function GodModeCalculator() {
  const navigate = useNavigate();
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  const [currentStep, setCurrentStep] = useState<Step>("slider");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({ email: 'idle', phone: 'idle' });
  
  const [formData, setFormData] = useState<FormData>(() => {
    // Try to restore from localStorage
    if (typeof window !== 'undefined' && !isCaptureMode) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            fromLocation: parsed.fromLocation || "",
            toLocation: parsed.toLocation || "",
            apartmentSize: parsed.apartmentSize || "3zi",
            controlLevel: parsed.controlLevel ?? 50,
            moveDate: parsed.moveDate || "",
            name: parsed.name || "",
            email: parsed.email || "",
            phone: parsed.phone || "",
            privacyAccepted: false, // Always reset privacy
          };
        } catch {}
      }
    }
    return {
      fromLocation: "",
      toLocation: "",
      apartmentSize: "3zi",
      controlLevel: 50,
      moveDate: "",
      name: "",
      email: "",
      phone: "",
      privacyAccepted: false,
    };
  });

  // Persist to localStorage on change
  useEffect(() => {
    if (!isCaptureMode && typeof window !== 'undefined') {
      const toSave = { ...formData, privacyAccepted: false };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    }
  }, [formData, isCaptureMode]);

  // Capture mode: jump to step and prefill data
  useEffect(() => {
    if (isCaptureMode && captureStep !== null) {
      const stepMap: Record<number, Step> = { 1: "slider", 2: "details", 3: "confirm", 4: "contact" };
      const targetStep = stepMap[captureStep];
      if (targetStep) {
        setCurrentStep(targetStep);
        setFormData({
          fromLocation: demoData.fromLocation,
          toLocation: demoData.toLocation,
          apartmentSize: demoData.apartmentSize,
          controlLevel: demoData.serviceLevel,
          moveDate: demoData.moveDate,
          name: demoData.name,
          email: demoData.email,
          phone: demoData.phone,
          privacyAccepted: demoData.privacyAccepted,
        });
        setValidation({ email: 'valid', phone: 'valid' });
      }
    }
  }, [isCaptureMode, captureStep, demoData]);

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Get current tier based on slider
  const currentTier = useMemo(() => {
    return serviceTiers.find(tier => 
      formData.controlLevel >= tier.range[0] && formData.controlLevel <= tier.range[1]
    ) || serviceTiers[2];
  }, [formData.controlLevel]);

  // Calculate price - show "ab" price
  const calculatedPrice = useMemo(() => {
    const size = apartmentSizes.find(s => s.id === formData.apartmentSize);
    const multiplier = size?.multiplier || 1;
    return {
      from: Math.round(currentTier.priceRange.from * multiplier),
      to: Math.round(currentTier.priceRange.to * multiplier),
    };
  }, [currentTier, formData.apartmentSize]);

  const updateFormData = useCallback(<K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Live validation
    if (field === 'email' && typeof value === 'string') {
      if (value.length === 0) {
        setValidation(v => ({ ...v, email: 'idle' }));
      } else {
        setValidation(v => ({ ...v, email: validateEmail(value) ? 'valid' : 'invalid' }));
      }
    }
    if (field === 'phone' && typeof value === 'string') {
      if (value.length === 0) {
        setValidation(v => ({ ...v, phone: 'idle' }));
      } else {
        setValidation(v => ({ ...v, phone: validatePhone(value) ? 'valid' : 'invalid' }));
      }
    }
  }, []);

  // Quick tier selection via buttons
  const selectTier = useCallback((tierId: string) => {
    const tier = serviceTiers.find(t => t.id === tierId);
    if (tier) {
      // Set to middle of tier range
      const middle = Math.round((tier.range[0] + tier.range[1]) / 2);
      updateFormData("controlLevel", middle);
    }
  }, [updateFormData]);

  const canProceed = () => {
    switch (currentStep) {
      case "slider":
        return true;
      case "details":
        return formData.fromLocation && formData.toLocation && formData.moveDate;
      case "confirm":
        return true;
      case "contact":
        return formData.name && 
               formData.email && 
               formData.phone && 
               formData.privacyAccepted &&
               validation.email === 'valid' &&
               validation.phone === 'valid';
      default:
        return false;
    }
  };

  const handleNext = () => {
    const idx = currentStepIndex;
    if (idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1]);
    }
  };

  const handleBack = () => {
    const idx = currentStepIndex;
    if (idx > 0) {
      setCurrentStep(steps[idx - 1]);
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    localStorage.setItem("umzugscheck_godmode_v3", JSON.stringify({
      ...formData,
      tier: currentTier.id,
      estimatedPrice: calculatedPrice,
      submittedAt: new Date().toISOString(),
    }));
    
    // Clear draft
    localStorage.removeItem(STORAGE_KEY);
    
    navigate('/umzugsofferten-bestaetigung');
  };

  const TierIcon = currentTier.icon;

  const renderStep = () => {
    switch (currentStep) {
      case "slider":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Hero - Improved copy */}
            <div className="text-center space-y-4">
              {/* Prominent trust signal */}
              <div className="flex items-center justify-center gap-2 text-amber-500">
                <Star className="w-5 h-5 fill-amber-500" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground text-sm">• 15'247 Bewertungen</span>
              </div>
              
              <Badge className="bg-gradient-to-r from-violet-500/20 to-amber-500/20 text-foreground border-violet-500/30 px-4 py-2">
                <Zap className="w-3.5 h-3.5 mr-2" />
                One Slider. Alles geregelt.
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Wie entspannt soll Ihr Umzug <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">sein?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Schieben Sie den Regler – wir kümmern uns um den Rest.
              </p>
            </div>

            {/* The Slider */}
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Tier Quick-Select Buttons (Mobile-friendly) - consistent visual indicators */}
              {/* Issue #2, #13: Fix horizontal scroll + consistent active state across devices */}
              <div className="flex justify-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 max-w-full scrollbar-hide">
                {serviceTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => selectTier(tier.id)}
                    className={cn(
                      "flex-shrink-0 px-3 sm:px-4 py-3 rounded-xl text-sm font-medium transition-all min-h-[52px] min-w-[52px] touch-manipulation border-2",
                      currentTier.id === tier.id
                        ? `bg-gradient-to-br ${tier.color} text-white shadow-lg scale-105 border-transparent ring-2 ring-offset-2 ring-offset-background ring-white/50`
                        : "bg-muted/50 text-muted-foreground hover:bg-muted active:scale-95 border-border hover:border-primary/30"
                    )}
                    aria-pressed={currentTier.id === tier.id}
                    aria-label={`${tier.name} Paket auswählen`}
                  >
                    <span className="text-lg mr-1">{tier.shortName}</span>
                    <span className="hidden sm:inline">{tier.name}</span>
                  </button>
                ))}
              </div>

              {/* Tier Display */}
              <motion.div 
                key={currentTier.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "p-6 md:p-8 rounded-3xl bg-gradient-to-br border transition-all duration-500",
                  currentTier.color,
                  "border-white/20"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                      <TierIcon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white">{currentTier.name}</h3>
                      <p className="text-white/80 text-sm md:text-base">{currentTier.tagline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                      ab CHF {calculatedPrice.from.toLocaleString('de-CH')}
                    </div>
                    <p className="text-white/60 text-sm md:text-sm">{apartmentSizes.find(s => s.id === formData.apartmentSize)?.label || '3-3.5 Zi.'} Wohnung</p>
                  </div>
                </div>

                {/* What's included */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Inklusive</p>
                    <ul className="space-y-1.5">
                      {currentTier.included.slice(0, 5).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white text-sm">
                          <CheckCircle className="w-4 h-4 text-white/80 shrink-0" />
                          {item}
                        </li>
                      ))}
                      {currentTier.included.length > 5 && (
                        <li className="text-white/60 text-sm cursor-pointer hover:text-white/80 transition-colors">
                          + {currentTier.included.length - 5} weitere anzeigen
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Sie machen</p>
                    <ul className="space-y-1.5">
                      {currentTier.userDoes.map((item, idx) => (
                        <li key={idx} className="text-white/80 text-sm">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Slider Control - Larger touch target with tooltip explanation */}
              <div className="space-y-4 px-2 md:px-4">
                <div className="flex justify-between text-sm text-muted-foreground items-center">
                  <span>💰 Günstiger</span>
                  <div className="flex flex-col items-center">
                    <span className="font-mono text-lg text-foreground">{formData.controlLevel}%</span>
                    <span className="text-xs text-muted-foreground/70">Delegation</span>
                  </div>
                  <span>🛋️ Sorgloser</span>
                </div>
                <p className="text-xs text-muted-foreground text-center -mt-2 mb-2">
                  Je höher der Wert, desto mehr übernehmen wir für Sie
                </p>
                <Slider
                  value={[formData.controlLevel]}
                  onValueChange={(v) => updateFormData("controlLevel", v[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="py-6 touch-manipulation [&_[role=slider]]:h-8 [&_[role=slider]]:w-8 [&_[role=slider]]:md:h-6 [&_[role=slider]]:md:w-6"
                />
              </div>

              {/* Issue #3: Quick size selector - larger touch targets (min 44x44px) */}
              <div className="flex justify-center gap-2 flex-wrap">
                {apartmentSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => updateFormData("apartmentSize", size.id)}
                    className={cn(
                      "px-5 py-3 rounded-full text-sm font-medium transition-all touch-manipulation min-h-[48px] min-w-[48px]",
                      formData.apartmentSize === size.id
                        ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted active:scale-95 border border-border"
                    )}
                    aria-pressed={formData.apartmentSize === size.id}
                    aria-label={`Wohnungsgrösse ${size.label} auswählen`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals - Compact */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-2">
              {trustSignals.slice(1, 5).map((signal, idx) => {
                const Icon = signal.icon;
                return (
                  <div key={idx} className="flex items-center gap-1.5 text-xs md:text-sm text-muted-foreground">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
                    <span>{signal.label}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        );

      case "details":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Die wichtigsten Details</h2>
              <p className="text-muted-foreground">3 Felder. Mehr brauchen wir nicht.</p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Von</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="PLZ oder Ort"
                      value={formData.fromLocation}
                      onChange={(e) => updateFormData("fromLocation", e.target.value)}
                      className="pl-12 h-14 text-lg bg-muted/30 border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nach</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="PLZ oder Ort"
                      value={formData.toLocation}
                      onChange={(e) => updateFormData("toLocation", e.target.value)}
                      className="pl-12 h-14 text-lg bg-muted/30 border-border"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Wunschtermin</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => updateFormData("moveDate", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/30 border-border"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {/* Summary card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                      currentTier.color
                    )}>
                      <TierIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{currentTier.name}</p>
                      <p className="text-sm text-muted-foreground">{formData.apartmentSize.toUpperCase()} Wohnung</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">ab CHF {calculatedPrice.from.toLocaleString('de-CH')}</p>
                    <p className="text-xs text-muted-foreground">Fixpreis-Garantie</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "confirm":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Ihr Umzugsplan</h2>
              <p className="text-muted-foreground">So sieht Ihr Umzug aus</p>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              {/* Editable Summary - consistent edit button position */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Ihre Angaben</h3>
                  <Button variant="ghost" size="sm" onClick={() => goToStep("slider")} className="gap-1.5 text-primary min-h-[44px] min-w-[44px]">
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Bearbeiten</span>
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Von</p>
                    <p className="font-medium">{formData.fromLocation || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Nach</p>
                    <p className="font-medium">{formData.toLocation || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Datum</p>
                    <p className="font-medium">{formData.moveDate ? new Date(formData.moveDate).toLocaleDateString('de-CH') : '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Wohnung</p>
                    <p className="font-medium">{apartmentSizes.find(s => s.id === formData.apartmentSize)?.label}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      currentTier.color
                    )}>
                      <TierIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold">{currentTier.name}</span>
                  </div>
                  <span className="text-xl font-bold text-primary">ab CHF {calculatedPrice.from.toLocaleString('de-CH')}</span>
                </div>
              </div>

              {/* Trust Dashboard Preview */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {trustSignals.map((signal, idx) => {
                  const Icon = signal.icon;
                  return (
                    <div key={idx} className="p-3 md:p-4 rounded-xl bg-muted/30 border border-border text-center">
                      <Icon className={cn("w-5 h-5 md:w-6 md:h-6 mx-auto mb-1.5", signal.highlight ? "text-amber-500" : "text-primary")} />
                      <p className="font-medium text-xs md:text-sm">{signal.label}</p>
                      <p className="text-xs text-muted-foreground">{signal.detail}</p>
                    </div>
                  );
                })}
              </div>

              {/* What happens next */}
              <div className="p-6 rounded-2xl bg-card border border-border space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Was passiert nach der Buchung?
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">1</div>
                    <div>
                      <p className="font-medium">Sofortige Bestätigung</p>
                      <p className="text-muted-foreground">Sie erhalten Ihre Buchung per E-Mail in unter 2 Minuten</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">2</div>
                    <div>
                      <p className="font-medium">Team-Zuweisung</p>
                      <p className="text-muted-foreground">Ihr persönliches Team wird innerhalb von 24h zugewiesen</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">3</div>
                    <div>
                      <p className="font-medium">Alles läuft automatisch</p>
                      <p className="text-muted-foreground">Sie werden proaktiv informiert. Kein Nachfragen nötig.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price guarantee */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 flex items-center gap-4">
                <Shield className="w-10 h-10 text-emerald-500 shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-600 dark:text-emerald-400">Fixpreis-Garantie</p>
                  <p className="text-sm text-muted-foreground">Der genannte Preis ist fix. Keine versteckten Kosten. Garantiert.</p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "contact":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Letzte Hürde 🎉</h2>
              <p className="text-muted-foreground">Wohin dürfen wir die Bestätigung senden?</p>
            </div>

            <div className="max-w-lg mx-auto space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-medium">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Vor- und Nachname"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/30 border-border"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="ihre@email.ch"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className={cn(
                      "pl-12 pr-12 h-14 text-lg bg-muted/30 border-border transition-colors",
                      validation.email === 'invalid' && "border-destructive focus-visible:ring-destructive",
                      validation.email === 'valid' && "border-emerald-500 focus-visible:ring-emerald-500"
                    )}
                  />
                  {validation.email === 'valid' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {validation.email === 'invalid' && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                  )}
                </div>
                {validation.email === 'invalid' && (
                  <p className="text-xs text-destructive">Bitte geben Sie eine gültige E-Mail-Adresse ein</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    onBlur={(e) => {
                      if (validation.phone === 'valid') {
                        updateFormData("phone", formatPhone(e.target.value));
                      }
                    }}
                    className={cn(
                      "pl-12 pr-12 h-14 text-lg bg-muted/30 border-border transition-colors",
                      validation.phone === 'invalid' && "border-destructive focus-visible:ring-destructive",
                      validation.phone === 'valid' && "border-emerald-500 focus-visible:ring-emerald-500"
                    )}
                  />
                  {validation.phone === 'valid' && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {validation.phone === 'invalid' && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
                  )}
                </div>
                {validation.phone === 'invalid' && (
                  <p className="text-xs text-destructive">Bitte geben Sie eine gültige Schweizer Telefonnummer ein</p>
                )}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="privacy"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
                  Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> und die <a href="/agb" className="text-primary hover:underline">AGB</a>.
                </label>
              </div>

              {/* Final summary */}
              <div className="p-6 rounded-2xl bg-card border border-border mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      currentTier.color
                    )}>
                      <TierIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold">{currentTier.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{formData.controlLevel}% Delegation</span>
                </div>
                <div className="space-y-2 text-sm border-t border-border pt-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route</span>
                    <span>{formData.fromLocation} → {formData.toLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Datum</span>
                    <span>{formData.moveDate ? new Date(formData.moveDate).toLocaleDateString('de-CH') : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wohnung</span>
                    <span>{apartmentSizes.find(s => s.id === formData.apartmentSize)?.label}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-border text-lg">
                    <span className="font-medium">Fixpreis</span>
                    <span className="font-bold text-primary">
                      ab CHF {calculatedPrice.from.toLocaleString('de-CH')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    // Issue #2: Prevent horizontal scroll with overflow-hidden + max-w-full
    <div className="min-h-[85vh] rounded-3xl bg-gradient-to-b from-background via-background to-muted/20 border border-border p-4 md:p-10 relative overflow-hidden pb-28 md:pb-10 max-w-full">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5 pointer-events-none" />
      
      {/* Progress */}
      <div className="max-w-4xl mx-auto mb-6 md:mb-8 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">
            {currentStepIndex + 1} / {steps.length}
          </span>
          <span className="text-xs font-medium">
            {currentStep === "slider" && "Service wählen"}
            {currentStep === "details" && "Details"}
            {currentStep === "confirm" && "Bestätigen"}
            {currentStep === "contact" && "Kontakt"}
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto relative">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Issue #8, #12: Desktop Navigation - consistent arrow icons, specific CTA text */}
      <div className="hidden md:flex max-w-4xl mx-auto mt-10 items-center justify-between relative">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className="gap-2 min-h-[44px] min-w-[100px]"
        >
          <ArrowLeft className="w-5 h-5" />
          Zurück
        </Button>

        {currentStep === "contact" ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-violet-500 to-amber-500 hover:from-violet-600 hover:to-amber-600 text-white gap-2 shadow-lg min-w-[200px] font-semibold"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Wird gesendet...
              </>
            ) : (
              <>
                Jetzt buchen
                <Zap className="w-5 h-5" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="lg"
            className="bg-primary hover:bg-primary/90 gap-2 font-semibold min-w-[200px]"
          >
            {/* Issue #12: Specific CTA text per step for better conversion */}
            {currentStep === "slider" && "Offerten vergleichen"}
            {currentStep === "details" && "Zusammenfassung anzeigen"}
            {currentStep === "confirm" && "Kontaktdaten eingeben"}
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* Issue #7, #8, #10, #12: Mobile Sticky Bottom Navigation - consistent icons, larger touch targets, better CTA text */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 safe-area-inset-bottom z-40">
        <div className="flex gap-3 items-center">
          {/* Issue #7, #10: Consistent back button with icon on all breakpoints, min 48px touch target */}
          {currentStepIndex > 0 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex-shrink-0 h-12 min-w-[48px] min-h-[48px] px-3 flex items-center justify-center gap-1.5"
              aria-label="Zurück zum vorherigen Schritt"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="sr-only sm:not-sr-only text-sm">Zurück</span>
            </Button>
          )}
          
          {currentStep === "contact" ? (
            <Button
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="flex-1 h-12 min-h-[48px] bg-gradient-to-r from-violet-500 to-amber-500 hover:from-violet-600 hover:to-amber-600 text-white gap-2 font-semibold"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  Jetzt buchen
                  <Zap className="w-5 h-5" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 h-12 min-h-[48px] bg-primary hover:bg-primary/90 gap-2 font-semibold"
            >
              {/* Issue #12: Specific CTA text per step */}
              {currentStep === "slider" && "Offerten vergleichen"}
              {currentStep === "details" && "Zusammenfassung anzeigen"}
              {currentStep === "confirm" && "Kontaktdaten eingeben"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
