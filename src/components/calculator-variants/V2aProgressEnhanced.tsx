/**
 * V2.a - Enhanced Progress Visualization
 * 
 * Optimizations:
 * - Animated step indicators with icons
 * - Completion checkmarks
 * - Step names visible in progress bar
 * - Micro-animations on step change
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, Check,
  MapPin, Package, Home, Building2, Truck, HelpCircle, User, Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useInitialStep } from "@/hooks/use-initial-step";

const MOVE_TYPES = [
  { id: "wohnung", label: "Wohnung", icon: Home, description: "1-5+ Zimmer Wohnung" },
  { id: "haus", label: "Haus", icon: Building2, description: "Einfamilienhaus, Villa" },
  { id: "buero", label: "Büro/Firma", icon: Truck, description: "Geschäftsumzug" },
  { id: "andere", label: "Andere", icon: HelpCircle, description: "Spezialtransport" },
];

const STEPS = [
  { id: 1, name: "Typ", icon: Home },
  { id: 2, name: "Ort", icon: MapPin },
  { id: 3, name: "Services", icon: Package },
  { id: 4, name: "Kontakt", icon: User },
];

const APARTMENT_SIZES = [
  { value: "studio", label: "Studio" },
  { value: "1-1.5", label: "1-1.5 Zi." },
  { value: "2-2.5", label: "2-2.5 Zi." },
  { value: "3-3.5", label: "3-3.5 Zi." },
  { value: "4-4.5", label: "4-4.5 Zi." },
  { value: "5+", label: "5+ Zi." },
];

export const V2aProgressEnhanced = memo(function V2aProgressEnhanced() {
  const navigate = useNavigate();
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState({
    moveType: "",
    fromLocation: "",
    toLocation: "",
    apartmentSize: "",
    name: "",
    email: "",
    phone: "",
    privacyAccepted: false,
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.moveType !== "";
      case 2: return formData.fromLocation && formData.toLocation && formData.apartmentSize;
      case 3: return true;
      case 4: return formData.name && formData.email && formData.privacyAccepted;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/umzugsofferten-bestaetigung');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ENHANCED: Animated Step Progress with Icons */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
          <motion.div 
            className="absolute top-5 left-0 h-0.5 bg-primary"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
          
          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-col items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isCompleted 
                      ? "bg-primary border-primary" 
                      : isCurrent 
                        ? "bg-background border-primary" 
                        : "bg-background border-border"
                  }`}
                  initial={false}
                  animate={{ scale: isCurrent ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-5 h-5 text-primary-foreground" />
                    </motion.div>
                  ) : (
                    <StepIcon className={`w-4 h-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                  )}
                </motion.div>
                <span className={`text-xs mt-2 font-medium ${
                  isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Move Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <motion.h2 
                  className="text-xl font-bold text-foreground mb-2"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Was möchten Sie umziehen?
                </motion.h2>
                <p className="text-sm text-muted-foreground">
                  Bitte wählen Sie Ihren Umzugstyp
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {MOVE_TYPES.map((type, index) => {
                  const Icon = type.icon;
                  const isSelected = formData.moveType === type.id;
                  
                  return (
                    <motion.button
                      key={type.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setFormData({ ...formData, moveType: type.id })}
                      className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                        isSelected ? "bg-primary/20" : "bg-muted"
                      }`}>
                        <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <h3 className="font-semibold text-foreground">{type.label}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3"
                        >
                          <CheckCircle className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>100% kostenlos & unverbindlich</span>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Wohin geht die Reise?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Geben Sie Start und Ziel ein
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Von (PLZ/Ort)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.fromLocation}
                        onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                        placeholder="8000 Zürich"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Nach (PLZ/Ort)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                      <Input
                        value={formData.toLocation}
                        onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                        placeholder="3000 Bern"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Wohnungsgrösse
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {APARTMENT_SIZES.map((size) => (
                      <button
                        key={size.value}
                        onClick={() => setFormData({ ...formData, apartmentSize: size.value })}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border-2 transition-all ${
                          formData.apartmentSize === size.value
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Services */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Zusätzliche Services
                </h2>
                <p className="text-sm text-muted-foreground">
                  Optional – überspringen möglich
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "umzug", label: "Umzug (Basis)", desc: "Transport & Einladen", included: true },
                  { id: "einpacken", label: "Einpack-Service", desc: "Wir packen für Sie", price: "+CHF 300-500" },
                  { id: "reinigung", label: "Endreinigung", desc: "Abgabe-Reinigung", price: "+CHF 250-450" },
                  { id: "entsorgung", label: "Entsorgung", desc: "Sperrmüll entsorgen", price: "+CHF 150-300" },
                ].map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{service.label}</p>
                        <p className="text-xs text-muted-foreground">{service.desc}</p>
                      </div>
                    </div>
                    {service.included ? (
                      <Badge variant="secondary">Inkl.</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">{service.price}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Fast geschafft!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Wohin sollen wir die Offerten senden?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Max Muster"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">E-Mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="max@beispiel.ch"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Telefon (optional)</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+41 79 123 45 67"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                    className="mt-1"
                  />
                  <span className="text-xs text-muted-foreground">
                    Ich akzeptiere die Datenschutzbestimmungen und erhalte unverbindliche Offerten.
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="p-4 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Zurück
            </Button>
          ) : (
            <div />
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2 min-w-[140px]"
            size="lg"
          >
            {currentStep === 4 ? "Offerten erhalten" : "Weiter"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default V2aProgressEnhanced;
