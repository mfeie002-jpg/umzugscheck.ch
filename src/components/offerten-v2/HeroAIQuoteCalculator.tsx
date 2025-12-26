/**
 * HeroAIQuoteCalculator - Conversion-First 4-Step Funnel V3
 * 
 * CORE PRINCIPLE: This funnel is a guided process, not a form.
 * - One decision per screen
 * - Clear progress at all times
 * - No pricing pressure early
 * - No ambiguity about "what happens next"
 * 
 * V3 FEATURES:
 * - Consent-gated analytics
 * - PII-safe event tracking
 * - Rage click detection
 * - Field interaction tracking
 * - Error handling with tracking
 */

import { useState, useCallback, useEffect, useRef } from "react";
import heroMovingCouple from "@/assets/hero-moving-couple.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle2, 
  Calculator, 
  ArrowRight, 
  Sparkles,
  MapPin,
  User,
  Mail,
  Phone,
  Lock,
  Loader2,
  Shield,
  Clock,
  Star,
  Award,
  Check,
  HelpCircle,
  Building2,
  Users,
  Package,
  Trash2,
  Sofa
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAnalytics } from "@/lib/analytics";
import { useRageClick } from "@/hooks/useRageClick";
import { motion, AnimatePresence } from "framer-motion";
// VideoInventoryAnalysis removed - feature available but not in main funnel

interface CalculatorState {
  step: number;
  fromPLZ: string;
  fromOrt: string;
  toPLZ: string;
  toOrt: string;
  wohnungsgroesse: string;
  kundentyp: "privat" | "firma";
  // Additional services
  reinigung: boolean;
  montage: boolean;
  entsorgung: boolean;
  name: string;
  email: string;
  phone: string;
}

const initialState: CalculatorState = {
  step: 1,
  fromPLZ: "",
  fromOrt: "",
  toPLZ: "",
  toOrt: "",
  wohnungsgroesse: "",
  kundentyp: "privat",
  reinigung: false,
  montage: false,
  entsorgung: false,
  name: "",
  email: "",
  phone: "",
};

// Step names for analytics - optimized 4 steps (merged inventory+services)
const STEP_NAMES = ['standort', 'wohnungsgroesse', 'zusatzleistungen', 'kontaktdaten'] as const;

// Floating label input component with field tracking
const FloatingLabelInput = ({ 
  value, 
  onChange, 
  label,
  type = "text",
  icon: Icon,
  isValid,
  error,
  helpText,
  autoFocus,
  onFieldFocus
}: { 
  value: string; 
  onChange: (v: string) => void; 
  label: string;
  type?: string;
  icon?: any;
  isValid?: boolean;
  error?: boolean;
  helpText?: string;
  autoFocus?: boolean;
  onFieldFocus?: () => void;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const [showHelp, setShowHelp] = useState(false);
  
  const handleFocus = () => {
    setIsFocused(true);
    onFieldFocus?.();
  };
  
  return (
    <motion.div 
      className="relative"
      animate={error ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary via-blue-500 to-primary opacity-0"
        animate={isFocused ? { opacity: 0.5 } : { opacity: 0 }}
        style={{ backgroundSize: "200% 200%" }}
      />
      
      <div className="relative bg-background rounded-lg">
        {Icon && (
          <motion.div
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10"
            animate={{ scale: isFocused ? 1.1 : 1 }}
          >
            <Icon className={`w-4 h-4 transition-colors ${
              isFocused ? "text-primary" : "text-muted-foreground"
            }`} />
          </motion.div>
        )}
        
        <motion.label
          className={`absolute left-${Icon ? '10' : '3'} pointer-events-none transition-all duration-200 ${
            isFocused || hasValue 
              ? "text-xs text-primary -top-2 bg-background px-1" 
              : "text-sm text-muted-foreground top-1/2 -translate-y-1/2"
          }`}
          animate={isFocused || hasValue ? { y: 0, scale: 0.85 } : { y: "-50%", scale: 1 }}
        >
          {label}
        </motion.label>
        
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          className={`${Icon ? "pl-10" : ""} pr-16 h-11 sm:h-12 text-base transition-all duration-300 bg-transparent ${
            isFocused ? "ring-2 ring-primary/30 border-primary" : ""
          } ${error ? "border-red-500 ring-2 ring-red-200" : ""}`}
        />
        
        {helpText && (
          <div className="absolute right-10 top-1/2 -translate-y-1/2">
            <motion.button
              type="button"
              className="text-muted-foreground hover:text-primary transition-colors"
              onMouseEnter={() => setShowHelp(true)}
              onMouseLeave={() => setShowHelp(false)}
              whileHover={{ scale: 1.1 }}
            >
              <HelpCircle className="w-4 h-4" />
            </motion.button>
            <AnimatePresence>
              {showHelp && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.95 }}
                  className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-card border border-border rounded-lg shadow-lg text-xs text-muted-foreground z-50"
                >
                  {helpText}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
        <AnimatePresence>
          {isValid && value && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="w-3 h-3 text-green-600" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Trust badge carousel
const trustBadges = [
  { icon: Shield, text: "SSL Verschlüsselt" },
  { icon: Clock, text: "24h Antwortzeit" },
  { icon: Star, text: "4.8/5 Bewertung" },
  { icon: Award, text: "Top Service 2024" },
];

const TrustBadgeCarousel = () => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % trustBadges.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 pt-3 sm:pt-4">
      {trustBadges.map((badge, i) => (
        <motion.div
          key={badge.text}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: i === index ? 1.05 : 1,
            y: i === index ? -2 : 0
          }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -2 }}
          className={`flex items-center gap-1.5 sm:gap-2 bg-card/50 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border text-xs sm:text-sm transition-colors ${
            i === index ? "border-primary/50 bg-primary/5" : "border-border/50"
          }`}
        >
          <badge.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${i === index ? "text-primary" : "text-muted-foreground"}`} />
          <span className="text-muted-foreground hidden xs:inline">{badge.text}</span>
        </motion.div>
      ))}
    </div>
  );
};

// Recently completed badge
const RecentlyCompletedBadge = () => {
  const [count, setCount] = useState(127);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setCount(prev => prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-50 text-blue-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm border border-blue-200"
      animate={{ scale: [1, 1.02, 1] }}
      transition={{ duration: 0.3 }}
      key={count}
    >
      <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      <span><strong>{count}</strong> Anfragen heute</span>
    </motion.div>
  );
};

// Step content configuration
interface StepConfig {
  headline: string;
  subline?: string;
  ctaText: string;
  microcopy: string | null;
}

const stepConfig: Record<number, StepConfig> = {
  1: {
    headline: "Wo ziehen Sie um?",
    ctaText: "Weiter",
    microcopy: "Ihre Angaben dienen nur zur groben Einschätzung."
  },
  2: {
    headline: "Wie gross ist Ihre Wohnung?",
    ctaText: "Weiter",
    microcopy: "Eine grobe Angabe genügt – Details klären wir später."
  },
  3: {
    headline: "Zusätzliche Leistungen?",
    subline: "Optional – Sie können später alles anpassen.",
    ctaText: "Weiter zu den Offerten",
    microcopy: null
  },
  4: {
    headline: "Fast fertig!",
    subline: "Sie erhalten 3–5 Offerten von geprüften Firmen.",
    ctaText: "Jetzt kostenlose Offerten erhalten",
    microcopy: "Keine Weitergabe · Kein Spam · 100% unverbindlich"
  }
};

export default function HeroAIQuoteCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeUsers, setActiveUsers] = useState(47);
  const [showCelebration, setShowCelebration] = useState(false);
  const [stepStartTime, setStepStartTime] = useState<number>(Date.now());
  const [isThankYou, setIsThankYou] = useState(false);
  const [prefillSource, setPrefillSource] = useState<string>('direct');
  const { toast } = useToast();
  const analytics = useAnalytics();
  
  // Rage click detection for primary CTAs
  const rageClick = useRageClick({ 
    element: 'primary_cta', 
    step: state.step 
  });
  
  // Track which fields have been interacted with (once only)
  const interactedFields = useRef<Set<string>>(new Set());
  
  // Track page view and load prefill data
  useEffect(() => {
    // Check for prefill source from homepage or region forms
    let source = 'direct';
    try {
      const prefillRaw = localStorage.getItem('uc_prefill');
      if (prefillRaw) {
        const prefill = JSON.parse(prefillRaw);
        const isRecent = Date.now() - prefill.timestamp < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          source = prefill.source || 'homepage';
          setPrefillSource(source);
          
          // Handle "from" location - simpler parsing
          if (prefill.from) {
            const fromValue = prefill.from.trim();
            // Extract PLZ (first 4 digits)
            const fromPLZMatch = fromValue.match(/(\d{4})/);
            if (fromPLZMatch) {
              updateState({ fromPLZ: fromPLZMatch[1] });
            }
            // Extract city name (after PLZ or the whole string if no PLZ)
            const fromCityPart = fromValue.replace(/^\d{4}\s*/, '').trim();
            if (fromCityPart) {
              updateState({ fromOrt: fromCityPart });
            }
          }
          
          // Handle "to" location - simpler parsing
          if (prefill.to) {
            const toValue = prefill.to.trim();
            const toPLZMatch = toValue.match(/(\d{4})/);
            if (toPLZMatch) {
              updateState({ toPLZ: toPLZMatch[1] });
            }
            const toCityPart = toValue.replace(/^\d{4}\s*/, '').trim();
            if (toCityPart) {
              updateState({ toOrt: toCityPart });
            }
          }
          
          // Handle apartment size
          if (prefill.size) {
            updateState({ wohnungsgroesse: prefill.size });
          }
          
          // Handle services
          if (prefill.services && Array.isArray(prefill.services)) {
            const serviceMapping: Record<string, keyof CalculatorState> = {
              'reinigung': 'reinigung',
              'montage': 'montage',
              'entsorgung': 'entsorgung',
            };
            prefill.services.forEach((svc: string) => {
              if (serviceMapping[svc]) {
                updateState({ [serviceMapping[svc]]: true });
              }
            });
          }
          
          // If data was prefilled, auto-advance to step 2 (skip location entry)
          if (prefill.from && prefill.to) {
            // Auto skip to step 2 since location is filled
            setTimeout(() => updateState({ step: 2 }), 100);
          }
        }
      }
    } catch (e) {
      analytics.trackError('umzugsofferten', null, 'prefill');
    }
    
    // Track page view and first step
    analytics.trackPageView('umzugsofferten', source);
    analytics.trackStepStarted(1, STEP_NAMES[0], 'funnel');
  }, []);
  
  // Track confirmation viewed when thank you state is shown
  useEffect(() => {
    if (isThankYou) {
      analytics.trackLeadConfirmationViewed();
    }
  }, [isThankYou, analytics]);
  
  // Simulate active users
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUsers(prev => {
        const change = Math.random() > 0.5 ? 1 : -1;
        return Math.min(Math.max(prev + change, 35), 65);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
  
  // Track field interaction (once per field per session)
  const trackFieldInteraction = useCallback((field: string) => {
    const key = `${state.step}-${field}`;
    if (!interactedFields.current.has(key)) {
      interactedFields.current.add(key);
      analytics.trackFieldInteracted(state.step, field);
    }
  }, [state.step, analytics]);
  
  const handleServiceToggle = useCallback((serviceKey: string) => {
    const currentValue = state[serviceKey as keyof CalculatorState] as boolean;
    const newValue = !currentValue;
    updateState({ [serviceKey]: newValue });
    analytics.trackServiceToggled(3, serviceKey, newValue ? 'on' : 'off');
  }, [state, updateState, analytics]);
  
  const goToNextStep = (nextStep: number) => {
    const durationMs = Date.now() - stepStartTime;
    
    // Track step completion with duration
    analytics.trackStepCompleted(state.step, STEP_NAMES[state.step - 1], 'funnel', durationMs);
    
    // Track rage click on continue
    rageClick.trackClick();
    
    setShowCelebration(true);
    setTimeout(() => {
      updateState({ step: nextStep });
      setStepStartTime(Date.now());
      rageClick.reset();
      
      if (nextStep <= 4) {
        analytics.trackStepStarted(nextStep, STEP_NAMES[nextStep - 1], 'funnel');
      }
      
      setShowCelebration(false);
    }, 400);
  };

  const handleSubmit = async () => {
    // Track rage click on submit
    rageClick.trackClick();
    
    if (!state.name || !state.email || !state.phone) {
      toast({
        title: "Bitte füllen Sie alle Felder aus",
        description: "Name, E-Mail und Telefon sind erforderlich.",
        variant: "destructive",
      });
      analytics.trackError('umzugsofferten', 4, 'validation');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const servicesCount = [state.reinigung, state.montage, state.entsorgung].filter(Boolean).length;
      
      // Track lead submitted with SAFE payload only (no PII)
      analytics.trackLeadSubmitted({
        calculatorType: 'full',
        servicesCount,
        hasServices: servicesCount > 0,
        source: prefillSource
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Complete final step
      const durationMs = Date.now() - stepStartTime;
      analytics.trackStepCompleted(4, STEP_NAMES[3], 'funnel', durationMs);
      
      setIsSubmitting(false);
      setIsThankYou(true);
    } catch (error) {
      analytics.trackError('umzugsofferten', 4, 'submit');
      setIsSubmitting(false);
      toast({
        title: "Fehler beim Senden",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    }
  };
  
  // Validation helpers
  const canProceedStep1 = state.fromPLZ.length >= 4 && state.toPLZ.length >= 4;
  const canProceedStep2 = state.wohnungsgroesse !== "";
  const isEmailValid = state.email.includes("@") && state.email.includes(".");
  const isPhoneValid = state.phone.length >= 10;
  const canSubmit = state.name.length >= 2 && isEmailValid && isPhoneValid;
  
  // Thank you state
  if (isThankYou) {
    return (
      <section className="relative py-8 sm:py-12 md:py-20 lg:py-24 overflow-hidden min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-2xl relative z-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Vielen Dank – Ihre Anfrage wurde versendet
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-border/50 text-left mb-8"
          >
            <h2 className="font-semibold text-lg mb-4 text-foreground">Was passiert als Nächstes?</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Heute</p>
                  <p className="text-sm text-muted-foreground">Anfrage wird geprüft</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Innerhalb 24–48h</p>
                  <p className="text-sm text-muted-foreground">3–5 passende Offerten erhalten</p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Danach</p>
                  <p className="text-sm text-muted-foreground">Anbieter vergleichen & auswählen</p>
                </div>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button variant="outline" className="gap-2">
              <Package className="w-4 h-4" />
              Umzugscheckliste herunterladen
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }
  
  const currentStep = stepConfig[state.step as keyof typeof stepConfig];
  
  return (
    <section className="relative py-8 sm:py-12 md:py-20 lg:py-24 overflow-hidden min-h-[85vh] flex items-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroMovingCouple})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-red-50/20" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(0 0 0) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
          {/* Left: Headlines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Live activity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm border border-green-200">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-green-500"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span><strong>{activeUsers}</strong> Personen online</span>
              </div>
              <RecentlyCompletedBadge />
            </motion.div>
            
            {/* Page header - conversion-first */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4 leading-tight">
              In 2 Minuten zu passenden{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-blue-600 bg-clip-text text-transparent">
                Umzugsofferten
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 font-medium">
              Kostenlos · Unverbindlich · Schweizweit
            </p>
            
            {/* Key benefits */}
            <div className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start mb-6 sm:mb-8">
              {[
                { icon: CheckCircle2, text: "Nur geprüfte Firmen" },
                { icon: Shield, text: "100% kostenlos" },
                { icon: Clock, text: "3–5 Offerten in 24h" },
              ].map((benefit, i) => (
                <motion.div
                  key={benefit.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-xs sm:text-sm"
                >
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-600" />
                  </div>
                  <span className="text-foreground font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>
            
            <TrustBadgeCarousel />
          </motion.div>
          
          {/* Right: Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white border-border/50 shadow-2xl shadow-primary/10 overflow-hidden relative">
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-blue-500 to-primary opacity-20"
                style={{ padding: "1px" }}
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
              
              <CardContent className="p-4 sm:p-6 md:p-8 relative">
                {/* Header with step indicator */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                    >
                      <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </motion.div>
                    <div>
                  <h2 className="font-bold text-base sm:text-lg text-foreground">Offerten Anfrage</h2>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">
                        Schritt {state.step} von 4
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Step progress bar - 4 steps */}
                <div className="flex gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                  {[1, 2, 3, 4].map((step) => (
                    <motion.div
                      key={step}
                      className={`h-1.5 flex-1 rounded-full overflow-hidden ${
                        step <= state.step ? "bg-primary" : "bg-muted"
                      }`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: step * 0.1 }}
                    >
                      {step === state.step && (
                        <motion.div
                          className="h-full bg-white/30"
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* Step headline */}
                <motion.div 
                  key={`headline-${state.step}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 sm:mb-6"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
                    {currentStep.headline}
                  </h3>
                  {currentStep.subline && (
                    <p className="text-sm text-muted-foreground">{currentStep.subline}</p>
                  )}
                </motion.div>
                
                {/* Calculator steps */}
                <AnimatePresence mode="wait">
                  {/* STEP 1 - STANDORT */}
                  {state.step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FloatingLabelInput
                        value={state.fromPLZ}
                        onChange={(v) => updateState({ fromPLZ: v })}
                        label="Umzug von"
                        icon={MapPin}
                        isValid={state.fromPLZ.length >= 4}
                        autoFocus
                        helpText="Geben Sie die Postleitzahl oder den Ortsnamen ein"
                        onFieldFocus={() => trackFieldInteraction('from')}
                      />
                      <FloatingLabelInput
                        value={state.toPLZ}
                        onChange={(v) => updateState({ toPLZ: v })}
                        label="Umzug nach"
                        icon={MapPin}
                        isValid={state.toPLZ.length >= 4}
                        helpText="Zieladresse Ihres Umzugs"
                        onFieldFocus={() => trackFieldInteraction('to')}
                      />
                      
                      {/* Microcopy */}
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        {currentStep.microcopy}
                      </p>
                      
                      <Button
                        onClick={() => goToNextStep(2)}
                        disabled={!canProceedStep1}
                        className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold gap-2"
                      >
                        {currentStep.ctaText}
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  )}
                  
                  {/* STEP 2 - WOHNUNGSGRÖSSE */}
                  {state.step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Customer type toggle */}
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          variant={state.kundentyp === "privat" ? "default" : "outline"}
                          className="flex-1 gap-2"
                          onClick={() => updateState({ kundentyp: "privat" })}
                        >
                          <Users className="w-4 h-4" />
                          Privat
                        </Button>
                        <Button
                          type="button"
                          variant={state.kundentyp === "firma" ? "default" : "outline"}
                          className="flex-1 gap-2"
                          onClick={() => updateState({ kundentyp: "firma" })}
                        >
                          <Building2 className="w-4 h-4" />
                          Firma
                        </Button>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          {state.kundentyp === "privat" ? "Wohnungsgrösse" : "Bürogrösse"}
                        </Label>
                        <Select
                          value={state.wohnungsgroesse}
                          onValueChange={(v) => updateState({ wohnungsgroesse: v })}
                        >
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder={state.kundentyp === "privat" ? "Anzahl Zimmer wählen" : "Bürogrösse wählen"} />
                          </SelectTrigger>
                          <SelectContent>
                            {state.kundentyp === "privat" ? (
                              <>
                                <SelectItem value="1.5">1–1.5 Zimmer (Studio)</SelectItem>
                                <SelectItem value="2.5">2–2.5 Zimmer</SelectItem>
                                <SelectItem value="3.5">3–3.5 Zimmer</SelectItem>
                                <SelectItem value="4.5">4–4.5 Zimmer</SelectItem>
                                <SelectItem value="5.5">5–5.5 Zimmer</SelectItem>
                                <SelectItem value="6.5">6+ Zimmer / Haus</SelectItem>
                              </>
                            ) : (
                              <>
                                <SelectItem value="small">Kleines Büro (bis 50m²)</SelectItem>
                                <SelectItem value="medium">Mittleres Büro (50–150m²)</SelectItem>
                                <SelectItem value="large">Grosses Büro (150–500m²)</SelectItem>
                                <SelectItem value="xlarge">Sehr gross (500m²+)</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Microcopy */}
                      <p className="text-xs text-muted-foreground text-center pt-2">
                        {currentStep.microcopy}
                      </p>
                      
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => updateState({ step: 1 })}
                          className="flex-1"
                        >
                          Zurück
                        </Button>
                        <Button
                          onClick={() => goToNextStep(3)}
                          disabled={!canProceedStep2}
                          className="flex-1 gap-2"
                        >
                          {currentStep.ctaText}
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* STEP 3 - ZUSATZSERVICES (merged, simplified) */}
                  {state.step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="space-y-3">
                        {[
                          { key: "reinigung", label: "Endreinigung", icon: Sparkles, desc: "Besenreine Übergabe" },
                          { key: "montage", label: "Möbelmontage", icon: Sofa, desc: "Auf- und Abbau" },
                          { key: "entsorgung", label: "Entsorgung", icon: Trash2, desc: "Sperrgut entsorgen" },
                        ].map((service) => (
                          <motion.div
                            key={service.key}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all ${
                              state[service.key as keyof CalculatorState]
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => handleServiceToggle(service.key)}
                          >
                            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                              state[service.key as keyof CalculatorState]
                                ? "bg-primary/10"
                                : "bg-muted"
                            }`}>
                              <service.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                state[service.key as keyof CalculatorState]
                                  ? "text-primary"
                                  : "text-muted-foreground"
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground text-sm sm:text-base">{service.label}</p>
                              <p className="text-xs text-muted-foreground">{service.desc}</p>
                            </div>
                            <Switch
                              checked={state[service.key as keyof CalculatorState] as boolean}
                              className="pointer-events-none"
                            />
                          </motion.div>
                        ))}
                      </div>
                      
                      <p className="text-xs text-muted-foreground text-center">
                        Alle Optionen können später angepasst werden.
                      </p>
                      
                      <div className="flex gap-3 pt-2">
                        <Button
                          variant="outline"
                          onClick={() => updateState({ step: 2 })}
                          className="flex-1"
                        >
                          Zurück
                        </Button>
                        <Button
                          onClick={() => goToNextStep(4)}
                          className="flex-1 gap-2"
                        >
                          {currentStep.ctaText}
                          <ArrowRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* STEP 4 - KONTAKTDATEN */}
                  {state.step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <FloatingLabelInput
                        value={state.name}
                        onChange={(v) => updateState({ name: v })}
                        label="Vor- und Nachname"
                        icon={User}
                        isValid={state.name.length >= 2}
                        autoFocus
                      />
                      
                      <FloatingLabelInput
                        value={state.phone}
                        onChange={(v) => updateState({ phone: v })}
                        label="Telefonnummer"
                        type="tel"
                        icon={Phone}
                        isValid={isPhoneValid}
                        error={state.phone.length > 0 && !isPhoneValid}
                      />
                      
                      <FloatingLabelInput
                        value={state.email}
                        onChange={(v) => updateState({ email: v })}
                        label="E-Mail-Adresse"
                        type="email"
                        icon={Mail}
                        isValid={isEmailValid}
                        error={state.email.length > 0 && !isEmailValid}
                        helpText="Ihre Offerten werden per E-Mail gesendet"
                      />
                      
                      {/* Process expectation */}
                      <div className="flex items-start gap-2 text-xs text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>Sie erhalten innerhalb von 24h 3–5 Offerten. Keine Anrufe, keine Verpflichtungen.</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="w-3 h-3" />
                        <span>{currentStep.microcopy}</span>
                      </div>
                      
                      {/* Buttons - Sticky on mobile */}
                      <div className="flex gap-3 
                                      md:relative md:bg-transparent md:p-0
                                      sticky bottom-0 left-0 right-0 -mx-4 sm:-mx-6 md:mx-0 px-4 sm:px-6 md:px-0 py-3 md:py-0
                                      bg-card/98 backdrop-blur-lg border-t border-border/30 md:border-0
                                      shadow-[0_-4px_16px_rgba(0,0,0,0.06)] md:shadow-none
                                      pb-[calc(0.75rem+env(safe-area-inset-bottom))] md:pb-0">
                        <Button
                          variant="outline"
                          onClick={() => updateState({ step: 3 })}
                          className="flex-1 h-12 md:h-11"
                        >
                          Zurück
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={!canSubmit || isSubmitting}
                          className="flex-1 h-12 md:h-11 gap-2 font-semibold"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Wird gesendet...
                            </>
                          ) : (
                            <>
                              Offerten erhalten
                              <CheckCircle2 className="w-5 h-5" />
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-32 h-32 rounded-full bg-green-500/20 flex items-center justify-center"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
