/**
 * MultiStepCalculator Variant B - Mobile-First
 * 
 * Optimizations:
 * - Sticky CTA-Bar mit 'Weiter' und 'Zurück'-Buttons (immer sichtbar auf Mobile)
 * - Touch-optimierte CTAs (min. 48px)
 * - Thumb-Zone-optimiertes Layout
 * - Weniger Text, mehr visuelle Hierarchie
 * - Größere Touch-Targets
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, 
  MapPin, Package, Home, Building2, Truck, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const MOVE_TYPES = [
  { id: "wohnung", label: "Wohnung", icon: Home },
  { id: "haus", label: "Haus", icon: Building2 },
  { id: "buero", label: "Büro", icon: Truck },
];

const APARTMENT_SIZES = [
  { value: "1-1.5", label: "1-1.5 Zi." },
  { value: "2-2.5", label: "2-2.5 Zi." },
  { value: "3-3.5", label: "3-3.5 Zi." },
  { value: "4-4.5", label: "4-4.5 Zi." },
  { value: "5+", label: "5+ Zi." },
];

const TOTAL_STEPS = 3; // Simplified flow for mobile

export const MultiStepCalculatorVariantB = memo(function MultiStepCalculatorVariantB() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
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
      case 1: return formData.moveType && formData.apartmentSize;
      case 2: return formData.fromLocation && formData.toLocation;
      case 3: return formData.name && formData.email && formData.privacyAccepted;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/umzugsofferten-bestaetigung');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Minimal Progress Dots - Mobile Optimized */}
      <div className="flex justify-center gap-2 mb-4">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-2 rounded-full transition-all ${
              step === currentStep
                ? "w-8 bg-primary"
                : step < currentStep
                ? "w-2 bg-primary/60"
                : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Main Content - Full Width Mobile */}
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Move Type + Size (Combined for fewer steps) */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-lg font-bold text-foreground text-center mb-5">
                Was ziehen Sie um?
              </h2>

              {/* Move Type - Large Touch Targets */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {MOVE_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.moveType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, moveType: type.id })}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 min-h-[80px] transition-all active:scale-95 ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border active:border-primary/50"
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Apartment Size - Horizontal Scroll on Mobile */}
              <div>
                <p className="text-sm text-muted-foreground mb-3 text-center">Grösse</p>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 scrollbar-hide">
                  {APARTMENT_SIZES.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setFormData({ ...formData, apartmentSize: size.value })}
                      className={`py-3 px-4 rounded-full text-sm font-medium whitespace-nowrap border-2 transition-all active:scale-95 ${
                        formData.apartmentSize === size.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Locations */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-lg font-bold text-foreground text-center mb-5">
                Von → Nach
              </h2>

              <div className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={formData.fromLocation}
                    onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                    placeholder="Von: PLZ oder Ort"
                    className="pl-12 h-14 text-base"
                  />
                </div>
                
                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-border" />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                  <Input
                    value={formData.toLocation}
                    onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                    placeholder="Nach: PLZ oder Ort"
                    className="pl-12 h-14 text-base"
                  />
                </div>
              </div>

              {/* Trust */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Schweizer Umzugsfirmen</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <div className="text-center mb-5">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-2" />
                <h2 className="text-lg font-bold text-foreground">
                  Offerten erhalten
                </h2>
                <p className="text-sm text-muted-foreground">
                  3-5 Angebote in 24h
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Name"
                  className="h-14 text-base"
                />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="E-Mail"
                  className="h-14 text-base"
                />
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Telefon (optional)"
                  className="h-14 text-base"
                />

                <label className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <input
                    type="checkbox"
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                    className="mt-0.5 w-5 h-5"
                  />
                  <span className="text-xs text-muted-foreground">
                    Datenschutz akzeptieren & Offerten erhalten
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STICKY FOOTER CTA - Always Visible on Mobile */}
        <div className="sticky bottom-0 p-4 border-t border-border bg-background flex items-center gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              className="h-14 px-6"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 h-14 text-base font-semibold gap-2"
          >
            {currentStep === TOTAL_STEPS ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Offerten erhalten
              </>
            ) : (
              <>
                Weiter
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

export default MultiStepCalculatorVariantB;
