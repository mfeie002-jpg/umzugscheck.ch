/**
 * God Mode Calculator V3
 * 
 * The ultimate moving experience with a single 0-100 Control-Delegation Slider.
 * Minimal decisions, maximum automation, absolute trust.
 */

import { useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Shield, Clock, CheckCircle, Star, Crown, Diamond,
  MapPin, Calendar, User, Mail, Phone, Package, Truck,
  Sparkles, Brush, Trash2, Warehouse, Key, FileCheck,
  ArrowRight, ArrowLeft, Eye, Lock, Heart, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Service tiers based on 0-100 slider
const serviceTiers = [
  {
    range: [0, 20],
    id: "budget",
    name: "Budget & Control",
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
    name: "Smart Mover",
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

// Trust signals
const trustSignals = [
  { icon: Shield, label: "Vollkasko-Versicherung", detail: "Bis CHF 100'000" },
  { icon: Lock, label: "Fixpreis-Garantie", detail: "Keine Überraschungen" },
  { icon: Clock, label: "Pünktlichkeits-Garantie", detail: "Oder 20% Rabatt" },
  { icon: Star, label: "4.9/5 Sterne", detail: "15'000+ Umzüge" },
  { icon: Award, label: "Geprüfte Teams", detail: "Background-Check" },
  { icon: FileCheck, label: "Foto-Protokoll", detail: "Vor & nach" },
];

// Apartment sizes with multipliers
const apartmentSizes = [
  { id: "studio", label: "Studio", multiplier: 0.5 },
  { id: "2zi", label: "2 Zi.", multiplier: 0.7 },
  { id: "3zi", label: "3 Zi.", multiplier: 1.0 },
  { id: "4zi", label: "4 Zi.", multiplier: 1.4 },
  { id: "5zi", label: "5+ Zi.", multiplier: 2.0 },
];

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

type Step = "slider" | "details" | "confirm" | "contact";
const steps: Step[] = ["slider", "details", "confirm", "contact"];

export const GodModeCalculator = memo(function GodModeCalculator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("slider");
  
  const [formData, setFormData] = useState<FormData>({
    fromLocation: "",
    toLocation: "",
    apartmentSize: "3zi",
    controlLevel: 50, // Default to middle
    moveDate: "",
    name: "",
    email: "",
    phone: "",
    privacyAccepted: false,
  });

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Get current tier based on slider
  const currentTier = useMemo(() => {
    return serviceTiers.find(tier => 
      formData.controlLevel >= tier.range[0] && formData.controlLevel <= tier.range[1]
    ) || serviceTiers[2];
  }, [formData.controlLevel]);

  // Calculate price
  const calculatedPrice = useMemo(() => {
    const size = apartmentSizes.find(s => s.id === formData.apartmentSize);
    const multiplier = size?.multiplier || 1;
    return {
      from: Math.round(currentTier.priceRange.from * multiplier),
      to: Math.round(currentTier.priceRange.to * multiplier),
    };
  }, [currentTier, formData.apartmentSize]);

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case "slider":
        return true;
      case "details":
        return formData.fromLocation && formData.toLocation && formData.moveDate;
      case "confirm":
        return true;
      case "contact":
        return formData.name && formData.email && formData.phone && formData.privacyAccepted;
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

  const handleSubmit = () => {
    localStorage.setItem("umzugscheck_godmode_v3", JSON.stringify({
      ...formData,
      tier: currentTier.id,
      estimatedPrice: calculatedPrice,
      submittedAt: new Date().toISOString(),
    }));
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
            className="space-y-10"
          >
            {/* Hero */}
            <div className="text-center space-y-4">
              <Badge className="bg-gradient-to-r from-violet-500/20 to-amber-500/20 text-foreground border-violet-500/30 px-4 py-2">
                <Zap className="w-3.5 h-3.5 mr-2" />
                One Slider. Alles geregelt.
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                Wie viel wollen Sie <span className="bg-gradient-to-r from-violet-400 to-amber-400 bg-clip-text text-transparent">selbst machen?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Schieben Sie den Regler. Wir kümmern uns um den Rest.
              </p>
            </div>

            {/* The Slider */}
            <div className="max-w-3xl mx-auto space-y-8">
              {/* Tier Display */}
              <div className={cn(
                "p-8 rounded-3xl bg-gradient-to-br border transition-all duration-500",
                currentTier.color,
                "border-white/20"
              )}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
                      <TierIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{currentTier.name}</h3>
                      <p className="text-white/80">{currentTier.tagline}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-white">
                      CHF {calculatedPrice.from.toLocaleString()}
                    </div>
                    <p className="text-white/60 text-sm">ab • 3-Zimmer</p>
                  </div>
                </div>

                {/* What's included */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-wider mb-2">Inklusive</p>
                    <ul className="space-y-1.5">
                      {currentTier.included.slice(0, 4).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-white text-sm">
                          <CheckCircle className="w-4 h-4 text-white/80 shrink-0" />
                          {item}
                        </li>
                      ))}
                      {currentTier.included.length > 4 && (
                        <li className="text-white/60 text-sm">
                          + {currentTier.included.length - 4} weitere
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
              </div>

              {/* Slider Control */}
              <div className="space-y-4 px-4">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Ich mache mehr</span>
                  <span className="font-mono text-lg text-foreground">{formData.controlLevel}%</span>
                  <span>Ihr macht mehr</span>
                </div>
                <Slider
                  value={[formData.controlLevel]}
                  onValueChange={(v) => updateFormData("controlLevel", v[0])}
                  min={0}
                  max={100}
                  step={1}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground/60">
                  {serviceTiers.map((tier) => (
                    <span 
                      key={tier.id}
                      className={cn(
                        "transition-colors",
                        currentTier.id === tier.id && "text-primary font-medium"
                      )}
                    >
                      {tier.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick size selector */}
              <div className="flex justify-center gap-2">
                {apartmentSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => updateFormData("apartmentSize", size.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm transition-all",
                      formData.apartmentSize === size.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    )}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {trustSignals.slice(0, 4).map((signal, idx) => {
                const Icon = signal.icon;
                return (
                  <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="w-4 h-4 text-primary" />
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
                    <p className="text-2xl font-bold">CHF {calculatedPrice.from.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">– {calculatedPrice.to.toLocaleString()}</p>
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
              {/* Trust Dashboard Preview */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {trustSignals.map((signal, idx) => {
                  const Icon = signal.icon;
                  return (
                    <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border text-center">
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="font-medium text-sm">{signal.label}</p>
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

            <div className="max-w-lg mx-auto space-y-5">
              <div className="space-y-2">
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

              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="ihre@email.ch"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/30 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/30 border-border"
                  />
                </div>
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
                      CHF {calculatedPrice.from.toLocaleString()} – {calculatedPrice.to.toLocaleString()}
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
    <div className="min-h-[85vh] rounded-3xl bg-gradient-to-b from-background via-background to-muted/20 border border-border p-6 md:p-10 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-amber-500/5 pointer-events-none" />
      
      {/* Progress */}
      <div className="max-w-4xl mx-auto mb-8 relative">
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

      {/* Navigation */}
      <div className="max-w-4xl mx-auto mt-10 flex items-center justify-between relative">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </Button>

        {currentStep === "contact" ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            size="lg"
            className="bg-gradient-to-r from-violet-500 to-amber-500 hover:from-violet-600 hover:to-amber-600 text-white gap-2 shadow-lg"
          >
            Jetzt buchen
            <Zap className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="lg"
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            Weiter
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
});
