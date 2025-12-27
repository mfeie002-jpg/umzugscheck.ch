/**
 * V9.D - Archetyp Wizard
 * 
 * Implements the strategic analysis recommendations:
 * - Prio 1: Google Places Autocomplete (simulated with enhanced UX)
 * - Prio 2: Mobile Input Modes & Keyboard Hygiene
 * - Prio 3: Result Teasing (Glimp-Methode)
 * - Prio 7: Trust Badges Above the Fold
 * - Prio 8: Sticky CTA on Mobile
 * - Prio 9: Labor Illusion Loading Animation
 * - Prio 10: Swissness Wording
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Shield,
  Star,
  Lock,
  Award,
  Zap,
  Home,
  Building,
  ChevronRight,
  Loader2,
  Check,
  Info,
  AlertCircle,
  TrendingDown,
  Search,
  Users,
  Clock,
  Phone,
  Mail,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCaptureMode } from "@/hooks/use-capture-mode";

// ============================================
// TYPES & STEP CONFIGURATION (Single Source of Truth)
// ============================================

// Step configuration - add/remove steps here and everything updates automatically
const STEP_CONFIG = [
  { id: 'address-from', label: 'Start', showInProgress: true },
  { id: 'address-to', label: 'Ziel', showInProgress: true },
  { id: 'details', label: 'Details', showInProgress: true },
  { id: 'analyzing', label: 'Analyse', showInProgress: false }, // Overlay, not in progress
  { id: 'result-teasing', label: 'Firmen', showInProgress: true },
  { id: 'contact', label: 'Kontakt', showInProgress: true },
  { id: 'success', label: 'Fertig', showInProgress: false }, // End state, not in progress
] as const;

// Auto-generate types from config
type WizardStep = typeof STEP_CONFIG[number]['id'];

// Auto-filter user-facing steps for progress indicator
const USER_FACING_STEPS = STEP_CONFIG.filter(s => s.showInProgress).map(s => s.id);
const ALL_STEPS = STEP_CONFIG.map(s => s.id);

interface MoveData {
  fromZip: string;
  fromCity: string;
  fromStreet: string;
  toZip: string;
  toCity: string;
  toStreet: string;
  rooms: number;
  floor: number;
  hasElevator: boolean;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

interface MatchedCompany {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  priceLevel: 'günstig' | 'fair' | 'premium';
  responseTime: string;
}

// ============================================
// CONSTANTS - Swissness Wording (Prio 10)
// ============================================

const SWISS_CITIES: Record<string, string> = {
  '8001': 'Zürich', '8002': 'Zürich', '8003': 'Zürich', '8004': 'Zürich', '8005': 'Zürich',
  '8006': 'Zürich', '8008': 'Zürich', '8032': 'Zürich', '8037': 'Zürich', '8038': 'Zürich',
  '3011': 'Bern', '3012': 'Bern', '3013': 'Bern', '3014': 'Bern', '3018': 'Bern',
  '4001': 'Basel', '4051': 'Basel', '4052': 'Basel', '4053': 'Basel', '4055': 'Basel',
  '6003': 'Luzern', '6004': 'Luzern', '6005': 'Luzern', '6006': 'Luzern',
  '9000': 'St. Gallen', '9001': 'St. Gallen', '9008': 'St. Gallen',
  '5000': 'Aarau', '5001': 'Aarau', '5004': 'Aarau',
  '8400': 'Winterthur', '8401': 'Winterthur', '8402': 'Winterthur',
  '6300': 'Zug', '6301': 'Zug', '6302': 'Zug',
  '8600': 'Dübendorf', '8610': 'Uster', '8620': 'Wetzikon',
  '8700': 'Küsnacht', '8702': 'Zollikon', '8703': 'Erlenbach',
  '8800': 'Thalwil', '8802': 'Kilchberg', '8804': 'Au',
  '8810': 'Horgen', '8820': 'Wädenswil',
};

const DEMO_COMPANIES: MatchedCompany[] = [
  { id: '1', name: 'Premium Zügel AG', logo: '🏆', rating: 4.9, reviewCount: 247, priceLevel: 'premium', responseTime: '< 2 Std.' },
  { id: '2', name: 'SwissMove GmbH', logo: '🚚', rating: 4.7, reviewCount: 189, priceLevel: 'fair', responseTime: '< 4 Std.' },
  { id: '3', name: 'Express Zügle', logo: '⚡', rating: 4.6, reviewCount: 156, priceLevel: 'günstig', responseTime: '< 1 Std.' },
  { id: '4', name: 'Komfort Umzüge', logo: '✨', rating: 4.8, reviewCount: 203, priceLevel: 'fair', responseTime: '< 3 Std.' },
];

const ANALYSIS_STEPS = [
  { label: 'Prüfe Route...', icon: MapPin, duration: 800 },
  { label: 'Analysiere Distanz...', icon: TrendingDown, duration: 600 },
  { label: 'Filtere Partner in deiner Region...', icon: Users, duration: 900 },
  { label: 'Berechne Bestpreis...', icon: Sparkles, duration: 700 },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Trust Badges Above the Fold (Prio 7)
const TrustBadgesInline = () => (
  <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
    <span className="flex items-center gap-1">
      <Shield className="h-3.5 w-3.5 text-green-600" />
      100% Fixpreis
    </span>
    <span className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 text-amber-500" />
      4.9/5 Bewertung
    </span>
    <span className="flex items-center gap-1">
      <Lock className="h-3.5 w-3.5 text-blue-600" />
      Keine Spam-Anrufe
    </span>
  </div>
);

// Progress indicator with Swiss styling
const StepProgress = ({ current, total }: { current: number; total: number }) => (
  <div className="mb-6">
    <div className="flex items-center justify-center gap-2 mb-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            index < current ? "w-8 bg-primary" :
            index === current ? "w-10 bg-primary" :
            "w-6 bg-muted"
          )}
        />
      ))}
    </div>
    <p className="text-center text-xs text-muted-foreground">
      Schritt {current + 1} von {total}
    </p>
  </div>
);

// Sticky CTA for Mobile (Prio 8)
const StickyCTA = ({ 
  onClick, 
  disabled, 
  children 
}: { 
  onClick: () => void; 
  disabled?: boolean; 
  children: React.ReactNode;
}) => (
  <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border z-50 sm:hidden">
    <Button 
      className="w-full h-12 text-base font-semibold"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  </div>
);

// Address Autocomplete Simulation (Prio 1 - simplified version)
const AddressInput = ({
  label,
  placeholder,
  zipValue,
  cityValue,
  streetValue,
  onZipChange,
  onStreetChange,
  icon: Icon,
  iconColor,
  error,
}: {
  label: string;
  placeholder: string;
  zipValue: string;
  cityValue: string;
  streetValue: string;
  onZipChange: (zip: string, city: string) => void;
  onStreetChange: (street: string) => void;
  icon: typeof MapPin;
  iconColor: string;
  error?: string;
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleZipInput = (value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    const city = SWISS_CITIES[numericValue] || '';
    onZipChange(numericValue, city);
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Icon className={cn("h-4 w-4", iconColor)} />
        {label}
      </Label>
      
      {/* PLZ Input with numeric keyboard (Prio 2) */}
      <div className="grid grid-cols-3 gap-2">
        <div className="col-span-1">
          <Input
            placeholder="PLZ"
            value={zipValue}
            onChange={(e) => handleZipInput(e.target.value)}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            className={cn(
              "h-12 text-lg font-medium text-center",
              error && "border-destructive focus-visible:ring-destructive"
            )}
          />
        </div>
        <div className="col-span-2">
          <Input
            placeholder={cityValue || "Ort"}
            value={cityValue}
            disabled
            className="h-12 text-lg bg-muted/50"
          />
        </div>
      </div>
      
      {/* Street with autocomplete hint */}
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={streetValue}
          onChange={(e) => onStreetChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="h-12 pr-10"
          autoCapitalize="words"
        />
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        
        {/* Autocomplete simulation */}
        {showSuggestions && streetValue.length > 2 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="p-2 text-xs text-muted-foreground bg-muted/50">
              <Sparkles className="inline h-3 w-3 mr-1" />
              Vorschläge werden geladen...
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
      
      {zipValue.length === 4 && cityValue && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <Check className="h-3.5 w-3.5" />
          {cityValue} erkannt
        </div>
      )}
    </div>
  );
};

// Labor Illusion Animation (Prio 9)
const AnalyzingOverlay = ({ onComplete }: { onComplete: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let totalTime = 0;
    const timers: NodeJS.Timeout[] = [];

    ANALYSIS_STEPS.forEach((step, index) => {
      totalTime += step.duration;
      timers.push(
        setTimeout(() => {
          setCurrentStep(index);
          setProgress(((index + 1) / ANALYSIS_STEPS.length) * 100);
        }, totalTime - step.duration)
      );
    });

    timers.push(
      setTimeout(() => {
        onComplete();
      }, totalTime + 500)
    );

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <div className="text-center px-6 max-w-sm">
        <div className="mb-6">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full border-4 border-primary/20"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {ANALYSIS_STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isComplete = index < currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0.5 }}
                animate={{ 
                  opacity: isActive || isComplete ? 1 : 0.5,
                  scale: isActive ? 1.05 : 1,
                }}
                className={cn(
                  "flex items-center gap-3 text-left p-3 rounded-lg transition-colors",
                  isActive && "bg-primary/10",
                  isComplete && "text-green-600"
                )}
              >
                {isComplete ? (
                  <Check className="h-5 w-5 text-green-600 shrink-0" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                ) : (
                  <StepIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <span className={cn(
                  "text-sm font-medium",
                  isComplete && "text-green-600",
                  isActive && "text-foreground"
                )}>
                  {step.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-6">
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </motion.div>
  );
};

// Result Teasing Component (Prio 3 - Glimp-Methode)
const ResultTeasing = ({ 
  companies, 
  onReveal 
}: { 
  companies: MatchedCompany[];
  onReveal: () => void;
}) => {
  const [isRevealing, setIsRevealing] = useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="secondary" className="mb-3 bg-green-100 text-green-700 border-green-200">
          <Check className="h-3 w-3 mr-1" />
          Analyse abgeschlossen
        </Badge>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Wir haben {companies.length} passende Partner gefunden!
        </h2>
        <p className="text-muted-foreground text-sm">
          Diese Zügelfirmen sind in deiner Region verfügbar
        </p>
      </div>

      {/* Blurred company cards */}
      <div className="space-y-3 relative">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className={cn(
              "p-4 rounded-xl border border-border bg-card",
              "filter blur-[6px] select-none pointer-events-none"
            )}>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{company.logo}</div>
                <div className="flex-1">
                  <p className="font-semibold">{company.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>{company.rating}</span>
                    <span>({company.reviewCount} Bewertungen)</span>
                  </div>
                </div>
                <Badge variant="outline">{company.priceLevel}</Badge>
              </div>
            </div>
            
            {/* Overlay hint */}
            {index === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Details freischalten</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA to reveal */}
      <div className="space-y-4">
        <Button 
          className="w-full h-14 text-lg font-semibold"
          onClick={() => {
            setIsRevealing(true);
            setTimeout(onReveal, 300);
          }}
          disabled={isRevealing}
        >
          {isRevealing ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Eye className="h-5 w-5 mr-2" />
          )}
          Offerten ansehen
        </Button>
        
        <p className="text-center text-xs text-muted-foreground">
          Kostenlos & unverbindlich • Keine Spam-Anrufe
        </p>
        
        <TrustBadgesInline />
      </div>
    </div>
  );
};

// ============================================
// MAIN WIZARD COMPONENT
// ============================================

export function ArchetypWizardV9D() {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();

  const getInitialStep = (): WizardStep => {
    if (!isCaptureMode || !captureStep) return 'address-from';
    const stepMap: Record<number, WizardStep> = {
      1: 'address-from',
      2: 'address-to',
      3: 'details',
      4: 'result-teasing',
      5: 'contact',
      6: 'success',
    };
    return stepMap[captureStep] || 'address-from';
  };

  const [step, setStep] = useState<WizardStep>(getInitialStep());
  const [showAnalyzing, setShowAnalyzing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [moveData, setMoveData] = useState<MoveData>(() => {
    if (isCaptureMode) {
      return {
        fromZip: demoData.fromPostal,
        fromCity: demoData.fromCity,
        fromStreet: 'Bahnhofstrasse 10',
        toZip: demoData.toPostal,
        toCity: demoData.toCity,
        toStreet: 'Bundesplatz 5',
        rooms: demoData.rooms,
        floor: demoData.floor,
        hasElevator: demoData.hasElevator,
        contact: {
          name: demoData.name,
          email: demoData.email,
          phone: demoData.phone,
        },
      };
    }

    return {
      fromZip: '',
      fromCity: '',
      fromStreet: '',
      toZip: '',
      toCity: '',
      toStreet: '',
      rooms: 3,
      floor: 2,
      hasElevator: true,
      contact: { name: '', email: '', phone: '' },
    };
  });

  // Validation
  const isValidSwissZip = (zip: string): boolean => /^[1-9][0-9]{3}$/.test(zip);

  const validateStep = (currentStep: WizardStep): boolean => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 'address-from':
        if (!moveData.fromZip || moveData.fromZip.length !== 4) {
          errors.fromZip = 'Bitte gib eine gültige PLZ ein';
        } else if (!isValidSwissZip(moveData.fromZip)) {
          errors.fromZip = 'Ungültige Schweizer PLZ';
        }
        break;
      case 'address-to':
        if (!moveData.toZip || moveData.toZip.length !== 4) {
          errors.toZip = 'Bitte gib eine gültige PLZ ein';
        } else if (!isValidSwissZip(moveData.toZip)) {
          errors.toZip = 'Ungültige Schweizer PLZ';
        }
        break;
      case 'contact':
        if (!moveData.contact.name.trim()) {
          errors.name = 'Name ist erforderlich';
        }
        if (!moveData.contact.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(moveData.contact.email)) {
          errors.email = 'Gültige E-Mail ist erforderlich';
        }
        if (!moveData.contact.phone.trim() || moveData.contact.phone.replace(/\D/g, '').length < 9) {
          errors.phone = 'Gültige Telefonnummer ist erforderlich';
        }
        break;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;

    const currentIndex = ALL_STEPS.indexOf(step);
    
    if (step === 'details') {
      setShowAnalyzing(true);
      return;
    }
    
    if (currentIndex < ALL_STEPS.length - 1) {
      setStep(ALL_STEPS[currentIndex + 1]);
    }
  };

  const goBack = () => {
    // For back navigation, skip non-user-facing steps
    const currentIndex = USER_FACING_STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(USER_FACING_STEPS[currentIndex - 1]);
    }
  };

  const handleAnalyzingComplete = useCallback(() => {
    setShowAnalyzing(false);
    setStep('result-teasing');
  }, []);

  const handleSubmit = async () => {
    if (!validateStep('contact')) return;

    toast.success("Anfrage erfolgreich gesendet!", {
      description: "Du erhältst in Kürze Offerten per E-Mail."
    });
    setStep('success');
  };

  // Auto-calculated from STEP_CONFIG
  const stepIndex = USER_FACING_STEPS.indexOf(step);
  const totalSteps = USER_FACING_STEPS.length;

  return (
    <>
      {/* Labor Illusion Overlay (Prio 9) */}
      <AnimatePresence>
        {showAnalyzing && (
          <AnalyzingOverlay onComplete={handleAnalyzingComplete} />
        )}
      </AnimatePresence>

      <div className="w-full max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
            <Zap className="h-3 w-3 mr-1" />
            Archetyp V9.D
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {step === 'success' ? 'Geschafft! 🎉' : 'Zügel-Offerten in 60 Sekunden'}
          </h1>
          <p className="text-muted-foreground">
            {step === 'success' 
              ? 'Deine Anfrage ist unterwegs' 
              : 'Fixpreis • Keine versteckten Kosten • Schweizer Qualität'}
          </p>
        </div>

        {step !== 'success' && step !== 'result-teasing' && !showAnalyzing && (
          <StepProgress current={stepIndex} total={totalSteps} />
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: FROM Address (Progressive Disclosure - Prio 5) */}
          {step === 'address-from' && (
            <motion.div
              key="address-from"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-semibold">Von wo zügelst du?</h2>
                    <p className="text-sm text-muted-foreground">Dein aktueller Wohnort</p>
                  </div>

                  <AddressInput
                    label="Aktuelle Adresse"
                    placeholder="Strasse & Hausnummer"
                    zipValue={moveData.fromZip}
                    cityValue={moveData.fromCity}
                    streetValue={moveData.fromStreet}
                    onZipChange={(zip, city) => setMoveData(prev => ({ ...prev, fromZip: zip, fromCity: city }))}
                    onStreetChange={(street) => setMoveData(prev => ({ ...prev, fromStreet: street }))}
                    icon={MapPin}
                    iconColor="text-red-500"
                    error={validationErrors.fromZip}
                  />

                  <Button 
                    className="w-full h-14 text-lg font-semibold hidden sm:flex"
                    onClick={goNext}
                    disabled={!moveData.fromZip || moveData.fromZip.length !== 4}
                  >
                    Weiter
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  <TrustBadgesInline />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: TO Address */}
          {step === 'address-to' && (
            <motion.div
              key="address-to"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-semibold">Wohin zügelst du?</h2>
                    <p className="text-sm text-muted-foreground">Dein neuer Wohnort</p>
                  </div>

                  <AddressInput
                    label="Neue Adresse"
                    placeholder="Strasse & Hausnummer"
                    zipValue={moveData.toZip}
                    cityValue={moveData.toCity}
                    streetValue={moveData.toStreet}
                    onZipChange={(zip, city) => setMoveData(prev => ({ ...prev, toZip: zip, toCity: city }))}
                    onStreetChange={(street) => setMoveData(prev => ({ ...prev, toStreet: street }))}
                    icon={MapPin}
                    iconColor="text-green-500"
                    error={validationErrors.toZip}
                  />

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={goBack} className="flex-1 h-12">
                      Zurück
                    </Button>
                    <Button 
                      className="flex-1 h-12 hidden sm:flex"
                      onClick={goNext}
                      disabled={!moveData.toZip || moveData.toZip.length !== 4}
                    >
                      Weiter
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Details */}
          {step === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center mb-2">
                    <h2 className="text-lg font-semibold">Kurze Details</h2>
                    <p className="text-sm text-muted-foreground">Für eine genaue Offerte</p>
                  </div>

                  {/* Room selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Home className="h-4 w-4" />
                      Zimmerzahl
                    </Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((rooms) => (
                        <Button
                          key={rooms}
                          type="button"
                          variant={moveData.rooms === rooms ? "default" : "outline"}
                          className={cn("h-12 text-lg font-medium")}
                          onClick={() => setMoveData(prev => ({ ...prev, rooms }))}
                        >
                          {rooms}{rooms === 6 ? '+' : ''}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Floor selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Stockwerk
                    </Label>
                    <div className="grid grid-cols-5 gap-2">
                      {[0, 1, 2, 3, 4].map((floor) => (
                        <Button
                          key={floor}
                          type="button"
                          variant={moveData.floor === floor ? "default" : "outline"}
                          className="h-10"
                          onClick={() => setMoveData(prev => ({ ...prev, floor }))}
                        >
                          {floor === 0 ? 'EG' : `${floor}.`}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Conditional: Elevator only if floor > 0 (Prio 6) */}
                  {moveData.floor > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-3"
                    >
                      <Label className="text-sm font-medium">Lift vorhanden?</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={moveData.hasElevator ? "default" : "outline"}
                          onClick={() => setMoveData(prev => ({ ...prev, hasElevator: true }))}
                          className="h-12"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Ja
                        </Button>
                        <Button
                          type="button"
                          variant={!moveData.hasElevator ? "default" : "outline"}
                          onClick={() => setMoveData(prev => ({ ...prev, hasElevator: false }))}
                          className="h-12"
                        >
                          Nein
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={goBack} className="flex-1 h-12">
                      Zurück
                    </Button>
                    <Button 
                      className="flex-1 h-12 hidden sm:flex"
                      onClick={goNext}
                    >
                      Partner finden
                      <Search className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: Result Teasing (Prio 3) */}
          {step === 'result-teasing' && (
            <motion.div
              key="result-teasing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-2 border-green-200 shadow-lg">
                <CardContent className="p-6">
                  <ResultTeasing 
                    companies={DEMO_COMPANIES}
                    onReveal={() => setStep('contact')}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 5: Contact Form */}
          {step === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardContent className="p-6 space-y-6">
                  <div className="text-center mb-2">
                    <Badge variant="secondary" className="mb-2 bg-green-100 text-green-700">
                      {DEMO_COMPANIES.length} Partner gefunden
                    </Badge>
                    <h2 className="text-lg font-semibold">Wohin sollen wir die Offerten senden?</h2>
                    <p className="text-sm text-muted-foreground">
                      Deine Daten werden nur an max. 5 Partner weitergegeben
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name
                      </Label>
                      <Input
                        placeholder="Max Muster"
                        value={moveData.contact.name}
                        onChange={(e) => setMoveData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, name: e.target.value }
                        }))}
                        autoCapitalize="words"
                        autoComplete="name"
                        className={cn("h-12", validationErrors.name && "border-destructive")}
                      />
                      {validationErrors.name && (
                        <p className="text-xs text-destructive">{validationErrors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        E-Mail
                      </Label>
                      <Input
                        type="email"
                        placeholder="max@beispiel.ch"
                        value={moveData.contact.email}
                        onChange={(e) => setMoveData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, email: e.target.value }
                        }))}
                        autoComplete="email"
                        className={cn("h-12", validationErrors.email && "border-destructive")}
                      />
                      {validationErrors.email && (
                        <p className="text-xs text-destructive">{validationErrors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefon
                      </Label>
                      <Input
                        type="tel"
                        placeholder="079 123 45 67"
                        value={moveData.contact.phone}
                        onChange={(e) => setMoveData(prev => ({ 
                          ...prev, 
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                        inputMode="tel"
                        autoComplete="tel"
                        className={cn("h-12", validationErrors.phone && "border-destructive")}
                      />
                      {validationErrors.phone && (
                        <p className="text-xs text-destructive">{validationErrors.phone}</p>
                      )}
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Für Rückfragen der Zügelfirma – keine Spam-Anrufe
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={goBack} className="flex-1 h-12">
                      Zurück
                    </Button>
                    <Button 
                      className="flex-1 h-14 text-lg font-semibold hidden sm:flex"
                      onClick={handleSubmit}
                    >
                      Offerten erhalten
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>

                  <TrustBadgesInline />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* SUCCESS */}
          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-2 border-green-200 shadow-lg">
                <CardContent className="p-8 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Anfrage erfolgreich!
                    </h2>
                    <p className="text-muted-foreground">
                      Du erhältst in Kürze bis zu 5 Offerten per E-Mail
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Route:</span>
                      <span className="font-medium">{moveData.fromCity} → {moveData.toCity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Zimmer:</span>
                      <span className="font-medium">{moveData.rooms}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">E-Mail:</span>
                      <span className="font-medium">{moveData.contact.email}</span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Durchschnittliche Antwortzeit: 2-4 Stunden</span>
                    </div>
                    <TrustBadgesInline />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky CTA for Mobile (Prio 8) */}
      {step !== 'success' && step !== 'result-teasing' && !showAnalyzing && (
        <StickyCTA
          onClick={step === 'contact' ? handleSubmit : goNext}
          disabled={
            (step === 'address-from' && (!moveData.fromZip || moveData.fromZip.length !== 4)) ||
            (step === 'address-to' && (!moveData.toZip || moveData.toZip.length !== 4))
          }
        >
          {step === 'details' ? (
            <>
              Partner finden
              <Search className="ml-2 h-5 w-5" />
            </>
          ) : step === 'contact' ? (
            <>
              Offerten erhalten
              <ChevronRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Weiter
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </StickyCTA>
      )}

      {/* Mobile bottom spacing for sticky CTA */}
      {step !== 'success' && step !== 'result-teasing' && !showAnalyzing && (
        <div className="h-20 sm:hidden" />
      )}
    </>
  );
}
