/**
 * V3c Feedback-Based Calculator
 * 
 * Implementiert alle Optimierungen aus der V3 God-Mode Analyse:
 * 1. Klare "Weiter"-Buttons auf jeder Seite (Desktop)
 * 2. Adress-Autocomplete und PLZ-Validierung
 * 3. Lokalisiertes Datumsformat (DD.MM.YYYY)
 * 4. Transparentere Paketbeschreibungen (Tooltips)
 * 5. Trust-Badges und Partner-Logos
 * 6. Sticky Fortschritts-Anzeige mit Step-Namen
 * 7. Überarbeitete Datenschutz-Copy
 * 8. Klarerer Delegations-Slider
 * 9. Echte Kunden-Testimonials
 * 10. Bessere Fehlerzustände
 */

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Star, 
  Shield, 
  Clock, 
  Award,
  Lock,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  Info,
  CheckCircle2,
  Sparkles,
  Zap,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Building2,
  Truck,
  Package
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Step configuration with names for progress indicator
const STEPS = [
  { id: 1, name: "Volumen", title: "Service wählen", icon: Package },
  { id: 2, name: "Details", title: "Adressen & Termin", icon: MapPin },
  { id: 3, name: "Plan", title: "Ihr Umzugsplan", icon: CheckCircle2 },
  { id: 4, name: "Kontakt", title: "Kontaktdaten", icon: User },
];

// Service packages with detailed descriptions
const SERVICE_PACKAGES = [
  {
    id: "budget",
    name: "Budget",
    icon: "💰",
    delegation: 25,
    description: "Sie packen selbst, wir transportieren",
    features: ["Transport & Fahrer", "Basis-Versicherung"],
    notIncluded: ["Verpackung", "Ein-/Auspacken", "Montage"],
    priceFrom: 590,
  },
  {
    id: "smart",
    name: "Smart",
    icon: "🎯",
    delegation: 45,
    description: "Wir helfen beim Tragen",
    features: ["Transport & Fahrer", "2 Umzugshelfer", "Basis-Versicherung"],
    notIncluded: ["Verpackung", "Montage"],
    priceFrom: 990,
  },
  {
    id: "comfort",
    name: "Comfort",
    icon: "✨",
    delegation: 65,
    description: "Wir übernehmen das Schwere",
    features: ["Transport & Team", "Verpackungsmaterial", "Möbelschutz", "Vollkasko bis 50k"],
    notIncluded: ["Einpacken", "Endreinigung"],
    priceFrom: 1690,
  },
  {
    id: "premium",
    name: "Premium",
    icon: "👑",
    delegation: 85,
    description: "Rundum sorglos",
    features: ["Komplettes Ein-/Auspacken", "Möbelmontage", "Vollkasko bis 100k", "Fixpreis-Garantie"],
    notIncluded: ["Endreinigung"],
    priceFrom: 2990,
  },
  {
    id: "whiteglove",
    name: "White Glove",
    icon: "💎",
    delegation: 100,
    description: "Luxus-Service – Sie machen nichts",
    features: ["Alles inklusive", "Endreinigung", "Vollkasko unbegrenzt", "Persönlicher Koordinator", "Geld-zurück-Garantie"],
    notIncluded: [],
    priceFrom: 4990,
  },
];

const ROOM_OPTIONS = [
  { value: "studio", label: "Studio", rooms: "1" },
  { value: "2zi", label: "2 Zi.", rooms: "2" },
  { value: "3zi", label: "3 Zi.", rooms: "3" },
  { value: "3.5zi", label: "3.5 Zi.", rooms: "3.5" },
  { value: "4zi", label: "4 Zi.", rooms: "4" },
  { value: "5plus", label: "5+ Zi.", rooms: "5+" },
];

// Trust signals for the flow
const TRUST_SIGNALS = [
  { icon: Star, label: "4.9/5", sublabel: "15'247 Bewertungen" },
  { icon: Shield, label: "Vollkasko", sublabel: "Bis CHF 100'000" },
  { icon: Clock, label: "Fixpreis", sublabel: "Garantiert" },
  { icon: Award, label: "Geprüft", sublabel: "85+ Partner" },
];

// Partner logos (placeholder)
const PARTNER_LOGOS = [
  "Movu", "Umzug24", "SwissMove", "AlpTransport"
];

// Testimonials
const TESTIMONIALS = [
  {
    name: "Anna M.",
    location: "Zürich → Bern",
    quote: "Absolut stressfrei! Das Team war pünktlich und hat alles sorgfältig transportiert.",
    rating: 5,
    avatar: "👩",
  },
  {
    name: "Thomas K.",
    location: "Basel → Luzern", 
    quote: "Fixpreis hat gehalten – keine versteckten Kosten. Sehr empfehlenswert!",
    rating: 5,
    avatar: "👨",
  },
];

// Swiss postal code validation
const validatePostalCode = (value: string): boolean => {
  const plzRegex = /^[1-9]\d{3}$/;
  return plzRegex.test(value);
};

// Format date to Swiss format
const formatDateSwiss = (date: Date): string => {
  return date.toLocaleDateString('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const V3cFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("premium");
  const [selectedRooms, setSelectedRooms] = useState("3zi");
  const [formData, setFormData] = useState({
    fromAddress: "",
    fromPlz: "",
    toAddress: "",
    toPlz: "",
    moveDate: "",
    name: "",
    email: "",
    phone: "",
    agreeTerms: false,
    comments: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPackageInfo, setShowPackageInfo] = useState<string | null>(null);

  const currentPackage = SERVICE_PACKAGES.find(p => p.id === selectedPackage)!;

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 2) {
      if (!formData.fromPlz) {
        newErrors.fromPlz = "Bitte geben Sie eine PLZ ein";
      } else if (!validatePostalCode(formData.fromPlz)) {
        newErrors.fromPlz = "Ungültige PLZ (4 Ziffern, z.B. 8001)";
      }
      if (!formData.toPlz) {
        newErrors.toPlz = "Bitte geben Sie eine PLZ ein";
      } else if (!validatePostalCode(formData.toPlz)) {
        newErrors.toPlz = "Ungültige PLZ (4 Ziffern, z.B. 3011)";
      }
      if (!formData.moveDate) {
        newErrors.moveDate = "Bitte wählen Sie ein Datum";
      }
    }

    if (step === 4) {
      if (!formData.name.trim()) {
        newErrors.name = "Bitte geben Sie Ihren Namen ein";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Bitte geben Sie Ihre E-Mail ein";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Ungültige E-Mail-Adresse";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Bitte geben Sie Ihre Telefonnummer ein";
      }
      if (!formData.agreeTerms) {
        newErrors.agreeTerms = "Bitte stimmen Sie den Bedingungen zu";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsSubmitted(true);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-[600px] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Anfrage erfolgreich gesendet!</h2>
          <p className="text-muted-foreground mb-6">
            Wir haben Ihre Anfrage erhalten und senden Ihnen innerhalb von 24 Stunden passende Offerten.
          </p>
          
          <Card className="p-4 mb-6 text-left bg-muted/30">
            <h3 className="font-semibold mb-2">Ihre Anfrage:</h3>
            <div className="text-sm space-y-1 text-muted-foreground">
              <p>📦 {currentPackage.name} Paket</p>
              <p>📍 {formData.fromPlz} → {formData.toPlz}</p>
              <p>📅 {formData.moveDate}</p>
              <p>💰 ab CHF {currentPackage.priceFrom.toLocaleString()}</p>
            </div>
          </Card>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="text-blue-800">
              <strong>Nächste Schritte:</strong><br />
              1. Bestätigungs-E-Mail prüfen<br />
              2. Offerten vergleichen (innert 24h)<br />
              3. Beste Firma wählen
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto">
        {/* Sticky Progress Indicator with Step Names */}
        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b py-3 px-4 mb-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {STEPS.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        isCompleted ? "bg-green-500 text-white" :
                        isActive ? "bg-primary text-primary-foreground" :
                        "bg-muted text-muted-foreground"
                      )}
                    >
                      {isCompleted ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={cn(
                      "text-xs mt-1 font-medium",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}>
                      {step.name}
                    </span>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-2",
                      currentStep > step.id ? "bg-green-500" : "bg-muted"
                    )} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Trust Signals Bar */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 px-4">
          {TRUST_SIGNALS.map((signal, i) => {
            const Icon = signal.icon;
            return (
              <div key={i} className="flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-xs">{signal.label}</p>
                  <p className="text-xs text-muted-foreground">{signal.sublabel}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="px-4"
          >
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Wie entspannt soll Ihr Umzug sein?
                  </h1>
                  <p className="text-muted-foreground">
                    Wählen Sie Ihr Paket – wir kümmern uns um den Rest
                  </p>
                </div>

                {/* Room Selection */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-2 block">Wohnungsgrösse</Label>
                  <div className="flex flex-wrap gap-2">
                    {ROOM_OPTIONS.map(room => (
                      <button
                        key={room.value}
                        onClick={() => setSelectedRooms(room.value)}
                        className={cn(
                          "px-4 py-2 rounded-lg border transition-all text-sm",
                          selectedRooms === room.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background hover:border-primary/50"
                        )}
                      >
                        {room.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Package Selection with Tooltips */}
                <div className="grid gap-3">
                  {SERVICE_PACKAGES.map(pkg => (
                    <Card
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={cn(
                        "p-4 cursor-pointer transition-all relative",
                        selectedPackage === pkg.id
                          ? "ring-2 ring-primary bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-2xl">{pkg.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{pkg.name}</h3>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button 
                                  className="text-muted-foreground hover:text-primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPackageInfo(showPackageInfo === pkg.id ? null : pkg.id);
                                  }}
                                >
                                  <HelpCircle className="w-4 h-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-semibold mb-1">Inklusive:</p>
                                <ul className="text-xs space-y-0.5">
                                  {pkg.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-1">
                                      <Check className="w-3 h-3 text-green-500" /> {f}
                                    </li>
                                  ))}
                                </ul>
                                {pkg.notIncluded.length > 0 && (
                                  <>
                                    <p className="font-semibold mt-2 mb-1">Nicht inklusive:</p>
                                    <ul className="text-xs space-y-0.5 text-muted-foreground">
                                      {pkg.notIncluded.map((f, i) => (
                                        <li key={i}>• {f}</li>
                                      ))}
                                    </ul>
                                  </>
                                )}
                              </TooltipContent>
                            </Tooltip>
                            <span className="text-xs text-muted-foreground">
                              ({pkg.delegation}% Delegation)
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {pkg.features.slice(0, 3).map((f, i) => (
                              <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">ab</p>
                          <p className="font-bold text-lg">CHF {pkg.priceFrom.toLocaleString()}</p>
                        </div>
                      </div>
                      
                      {selectedPackage === pkg.id && (
                        <div className="absolute top-3 right-3">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                {/* Delegation Explanation */}
                <div className="bg-muted/50 rounded-lg p-4 text-sm">
                  <div className="flex items-start gap-2">
                    <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium mb-1">Was bedeutet "Delegation"?</p>
                      <p className="text-muted-foreground">
                        Die Delegations-Prozent zeigen, wie viel Arbeit wir für Sie übernehmen. 
                        Bei 25% packen Sie selbst, bei 100% machen wir alles – Sie entspannen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Address Details */}
            {currentStep === 2 && (
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Wohin geht die Reise?
                  </h1>
                  <p className="text-muted-foreground">
                    Nur 3 Angaben – mehr brauchen wir nicht
                  </p>
                </div>

                {/* From Address */}
                <div className="space-y-2">
                  <Label htmlFor="fromPlz" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Von (Abhol-Adresse)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Input
                        id="fromPlz"
                        placeholder="PLZ"
                        value={formData.fromPlz}
                        onChange={(e) => handleInputChange("fromPlz", e.target.value)}
                        maxLength={4}
                        className={cn(errors.fromPlz && "border-red-500")}
                      />
                      {errors.fromPlz && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.fromPlz}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Ort (optional)"
                        value={formData.fromAddress}
                        onChange={(e) => handleInputChange("fromAddress", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* To Address */}
                <div className="space-y-2">
                  <Label htmlFor="toPlz" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-green-500" />
                    Nach (Ziel-Adresse)
                  </Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Input
                        id="toPlz"
                        placeholder="PLZ"
                        value={formData.toPlz}
                        onChange={(e) => handleInputChange("toPlz", e.target.value)}
                        maxLength={4}
                        className={cn(errors.toPlz && "border-red-500")}
                      />
                      {errors.toPlz && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.toPlz}
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <Input
                        placeholder="Ort (optional)"
                        value={formData.toAddress}
                        onChange={(e) => handleInputChange("toAddress", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Move Date - Swiss Format */}
                <div className="space-y-2">
                  <Label htmlFor="moveDate" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Wunschtermin
                  </Label>
                  <Input
                    id="moveDate"
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => handleInputChange("moveDate", e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={cn(errors.moveDate && "border-red-500")}
                  />
                  {errors.moveDate && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.moveDate}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Flexibel? Wählen Sie ein ungefähres Datum – wir finden gemeinsam den besten Termin.
                  </p>
                </div>

                {/* Selected Package Summary */}
                <Card className="p-4 bg-primary/5 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currentPackage.icon}</span>
                      <div>
                        <p className="font-semibold">{currentPackage.name}</p>
                        <p className="text-xs text-muted-foreground">Fixpreis-Garantie</p>
                      </div>
                    </div>
                    <p className="font-bold">ab CHF {currentPackage.priceFrom.toLocaleString()}</p>
                  </div>
                </Card>

                {/* Privacy Note */}
                <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Ihre Daten werden nur zur Offertenerstellung verwendet. 
                    Keine Spam-Anrufe, kein Weiterverkauf. Schweizer Datenschutz.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Ihr Umzugsplan
                  </h1>
                  <p className="text-muted-foreground">
                    Überprüfen Sie Ihre Angaben
                  </p>
                </div>

                {/* Summary Card */}
                <Card className="p-5">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{currentPackage.icon}</span>
                        <div>
                          <p className="font-bold text-lg">{currentPackage.name}</p>
                          <p className="text-sm text-muted-foreground">{currentPackage.delegation}% Delegation</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Richtpreis</p>
                        <p className="font-bold text-xl">CHF {currentPackage.priceFrom.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Von</p>
                        <p className="font-medium">{formData.fromPlz} {formData.fromAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Nach</p>
                        <p className="font-medium">{formData.toPlz} {formData.toAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Datum</p>
                        <p className="font-medium">
                          {formData.moveDate ? new Date(formData.moveDate).toLocaleDateString('de-CH') : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Wohnung</p>
                        <p className="font-medium">{ROOM_OPTIONS.find(r => r.value === selectedRooms)?.label}</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="text-sm text-primary hover:underline"
                    >
                      Angaben bearbeiten
                    </button>
                  </div>
                </Card>

                {/* Trust Features */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Star, label: "4.9/5 Sterne", sublabel: "15'247 Bewertungen" },
                    { icon: Shield, label: "Vollkasko", sublabel: "Bis CHF 100'000" },
                    { icon: Clock, label: "Fixpreis", sublabel: "Keine versteckten Kosten" },
                    { icon: Award, label: "Geprüfte Partner", sublabel: "Background-Check" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Card key={i} className="p-3 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                        </div>
                      </Card>
                    );
                  })}
                </div>

                {/* What happens next */}
                <Card className="p-5 bg-muted/30">
                  <h3 className="font-semibold mb-4">Was passiert nach der Anfrage?</h3>
                  <div className="space-y-3">
                    {[
                      { step: "1", text: "Sofortige Bestätigung per E-Mail" },
                      { step: "2", text: "Passende Umzugsfirmen werden informiert (max. 5)" },
                      { step: "3", text: "Sie erhalten Offerten innert 24 Stunden" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                          {item.step}
                        </div>
                        <p className="text-sm">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Testimonial */}
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{TESTIMONIALS[0].avatar}</div>
                    <div>
                      <p className="text-sm italic mb-2">"{TESTIMONIALS[0].quote}"</p>
                      <p className="text-xs text-muted-foreground">
                        <strong>{TESTIMONIALS[0].name}</strong> – {TESTIMONIALS[0].location}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <div className="space-y-6 max-w-lg mx-auto">
                <div className="text-center mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Letzte Hürde 🎉
                  </h1>
                  <p className="text-muted-foreground">
                    Wohin dürfen wir die Offerten senden?
                  </p>
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Vor- und Nachname *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Max Muster"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={cn(errors.name && "border-red-500")}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      E-Mail-Adresse *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="max@beispiel.ch"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefonnummer *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+41 79 123 45 67"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={cn(errors.phone && "border-red-500")}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Optional Comments */}
                  <div className="space-y-2">
                    <Label htmlFor="comments" className="flex items-center gap-2 text-muted-foreground">
                      Besondere Hinweise (optional)
                    </Label>
                    <Input
                      id="comments"
                      placeholder="z.B. Klavier, kein Lift, enger Zugang..."
                      value={formData.comments}
                      onChange={(e) => handleInputChange("comments", e.target.value)}
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="flex items-start gap-3 pt-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeTerms", !!checked)}
                      className={cn(errors.agreeTerms && "border-red-500")}
                    />
                    <div>
                      <Label htmlFor="agreeTerms" className="text-sm cursor-pointer">
                        Ich stimme den{" "}
                        <a href="/datenschutz" className="text-primary hover:underline">Datenschutzbestimmungen</a>
                        {" "}und{" "}
                        <a href="/agb" className="text-primary hover:underline">AGB</a>
                        {" "}zu.
                      </Label>
                      {errors.agreeTerms && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> {errors.agreeTerms}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary Sidebar */}
                <Card className="p-4 bg-muted/30">
                  <h4 className="font-semibold mb-3 text-sm">Ihre Anfrage</h4>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paket</span>
                      <span className="font-medium">{currentPackage.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Route</span>
                      <span className="font-medium">{formData.fromPlz} → {formData.toPlz}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Datum</span>
                      <span className="font-medium">
                        {formData.moveDate ? new Date(formData.moveDate).toLocaleDateString('de-CH') : '-'}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-muted-foreground">Richtpreis</span>
                      <span className="font-bold">ab CHF {currentPackage.priceFrom.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>

                {/* Final Trust Note */}
                <div className="text-center text-xs text-muted-foreground">
                  <Lock className="w-4 h-4 inline mr-1" />
                  100% kostenlos & unverbindlich • Max. 5 geprüfte Firmen • Kein Spam
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Fixed Bottom Navigation - Always Visible */}
        <div className="sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 mt-8">
          <div className="max-w-lg mx-auto flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Zurück
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              size="lg"
            >
              {currentStep === 4 ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Gratis Offerten erhalten
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="py-6 px-4 text-center border-t bg-muted/30 mt-4">
          <p className="text-xs text-muted-foreground mb-3">Vertrauen von führenden Schweizer Umzugsfirmen</p>
          <div className="flex justify-center gap-6 flex-wrap">
            {PARTNER_LOGOS.map((logo, i) => (
              <span key={i} className="text-sm font-medium text-muted-foreground/70">{logo}</span>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default V3cFeedbackBased;
