/**
 * MultiStepCalculator Ultimate V2 - Best of All
 * 
 * Combines the best elements from all variants:
 * - From A: Card-based move type selection, clear progress indicator
 * - From B: Sticky CTA bar, large touch targets, minimal steps
 * - From C: Trust signals in hero, social proof, big CTAs
 * 
 * Ultimate optimizations:
 * - Only 3 steps (Move Type + Size → Location → Contact)
 * - Trust signals throughout
 * - Mobile-first with desktop enhancements
 * - Maximum conversion focus
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, Star, Users, 
  MapPin, Home, Building2, Truck, Zap, Award, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const MOVE_TYPES = [
  { id: "wohnung", label: "Wohnung", icon: Home, popular: true },
  { id: "haus", label: "Haus", icon: Building2 },
  { id: "buero", label: "Büro", icon: Truck },
];

const SIZES = [
  { value: "1-2", label: "1-2 Zi." },
  { value: "3-3.5", label: "3-3.5 Zi." },
  { value: "4-4.5", label: "4-4.5 Zi." },
  { value: "5+", label: "5+ Zi." },
];

const TOTAL_STEPS = 3;

export const MultiStepCalculatorUltimate = memo(function MultiStepCalculatorUltimate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    moveType: "",
    size: "",
    fromLocation: "",
    toLocation: "",
    email: "",
    phone: "",
    privacyAccepted: false,
  });

  const progress = (step / TOTAL_STEPS) * 100;

  const canProceed = () => {
    switch (step) {
      case 1: return formData.moveType && formData.size;
      case 2: return formData.fromLocation && formData.toLocation;
      case 3: return formData.email && formData.privacyAccepted;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      navigate('/umzugsofferten-bestaetigung');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Hero with Social Proof */}
      <div className="text-center mb-4">
        <Badge className="mb-2 bg-gradient-to-r from-primary to-orange-500 text-white border-0">
          <Zap className="w-3 h-3 mr-1" />
          Ultimate V2 - Optimiert
        </Badge>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Umzugsofferten in 90 Sekunden
        </h1>
        <div className="flex items-center justify-center gap-3 mt-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            4.8
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            12k+ Umzüge
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-medium">Schritt {step}/{TOTAL_STEPS}</span>
          <span className="text-muted-foreground">
            {step === 1 && "Umzugsart"}
            {step === 2 && "Strecke"}
            {step === 3 && "Kontakt"}
          </span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Type + Size */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              {/* Move Type Cards */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {MOVE_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.moveType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, moveType: type.id })}
                      className={`relative p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all active:scale-95 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {type.popular && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">
                          Beliebt
                        </span>
                      )}
                      <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-medium ${isSelected ? "text-primary" : ""}`}>
                        {type.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Size Pills */}
              <p className="text-sm text-muted-foreground mb-2 text-center">Grösse wählen</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {SIZES.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => setFormData({ ...formData, size: size.value })}
                    className={`py-2.5 px-5 rounded-full text-sm font-medium border-2 transition-all active:scale-95 ${
                      formData.size === size.value
                        ? "border-primary bg-primary text-primary-foreground shadow-md"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <h2 className="text-lg font-bold text-center mb-4">Wohin geht's?</h2>
              
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={formData.fromLocation}
                    onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                    placeholder="Von: PLZ oder Ort"
                    className="pl-12 h-14 text-base"
                  />
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

              {/* Trust Row */}
              <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Award className="w-4 h-4 text-blue-500" />
                  Geprüfte Firmen
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-green-500" />
                  Antwort in 24h
                </span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-5"
            >
              <div className="text-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <h2 className="text-lg font-bold">Offerten erhalten</h2>
                <p className="text-sm text-muted-foreground">3-5 Angebote in 24 Stunden</p>
              </div>

              <div className="space-y-3">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="E-Mail *"
                  className="h-14 text-base"
                />
                
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Telefon (optional)"
                  className="h-12"
                />

                <label className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                    className="mt-0.5 w-5 h-5 accent-primary"
                  />
                  <span className="text-xs text-muted-foreground">
                    Ich akzeptiere die Datenschutzbestimmungen
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sticky CTA Bar */}
        <div className="sticky bottom-0 p-4 border-t border-border bg-background/95 backdrop-blur-sm flex items-center gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="h-12 px-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 h-12 text-base font-semibold gap-2 shadow-lg"
          >
            {step === TOTAL_STEPS ? (
              <>
                <Zap className="w-5 h-5" />
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

      {/* Bottom Trust */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Shield className="w-3 h-3 text-green-500" />
          100% Kostenlos
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          Unverbindlich
        </span>
      </div>
    </div>
  );
});

export default MultiStepCalculatorUltimate;
