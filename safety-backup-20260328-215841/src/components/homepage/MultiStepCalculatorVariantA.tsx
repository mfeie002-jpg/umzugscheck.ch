/**
 * MultiStepCalculator Variant A - UX Optimized
 * 
 * Based on ChatGPT Analysis (26.12.2025):
 * - Kartenansicht für Umzugstypen (Wohnung, Haus, Büro) mit Icons
 * - Sichtbare ProgressBar ('Schritt 1 von 4') ab Step 1
 * - Microcopy unter dem Titel für klare Anweisungen
 * - Option 'Andere' für nicht vorgesehene Umzugstypen
 * - Reduzierte Content-Dichte, weniger Marketing-Blöcke
 * - Klarere Fortschrittsanzeigen mit Textbeschreibung
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, 
  MapPin, Package, Home, Building2, Truck, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

// Move type cards with visual icons
const MOVE_TYPES = [
  { id: "wohnung", label: "Wohnung", icon: Home, description: "1-5+ Zimmer Wohnung" },
  { id: "haus", label: "Haus", icon: Building2, description: "Einfamilienhaus, Villa" },
  { id: "buero", label: "Büro/Firma", icon: Truck, description: "Geschäftsumzug" },
  { id: "andere", label: "Andere", icon: HelpCircle, description: "Spezialtransport, Lager" },
];

const APARTMENT_SIZES = [
  { value: "studio", label: "Studio" },
  { value: "1-1.5", label: "1-1.5 Zi." },
  { value: "2-2.5", label: "2-2.5 Zi." },
  { value: "3-3.5", label: "3-3.5 Zi." },
  { value: "4-4.5", label: "4-4.5 Zi." },
  { value: "5+", label: "5+ Zi." },
];

const TOTAL_STEPS = 4;

export const MultiStepCalculatorVariantA = memo(function MultiStepCalculatorVariantA() {
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

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.moveType !== "";
      case 2: return formData.fromLocation && formData.toLocation && formData.apartmentSize;
      case 3: return true; // Services optional
      case 4: return formData.name && formData.email && formData.privacyAccepted;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit
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
      {/* Enhanced Progress Bar with Step Text */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Schritt {currentStep} von {TOTAL_STEPS}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentStep === 1 && "Umzugstyp wählen"}
            {currentStep === 2 && "Details eingeben"}
            {currentStep === 3 && "Services wählen"}
            {currentStep === 4 && "Kontaktdaten"}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Main Card */}
      <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
        <AnimatePresence mode="wait">
          {/* Step 1: Move Type Selection with Cards */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Was möchten Sie umziehen?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Bitte wählen Sie Ihren Umzugstyp
                </p>
              </div>

              {/* Move Type Cards */}
              <div className="grid grid-cols-2 gap-4">
                {MOVE_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.moveType === type.id;
                  
                  return (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, moveType: type.id })}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
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
                        <CheckCircle className="w-5 h-5 text-primary absolute top-3 right-3" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>100% kostenlos & unverbindlich</span>
              </div>
            </motion.div>
          )}

          {/* Step 2: Location Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Wohin geht die Reise?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Geben Sie Start und Ziel Ihres Umzugs ein
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

          {/* Step 3: Services (Simplified) */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Welche Leistungen brauchen Sie?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Optional – Sie können auch nur den Basis-Umzug anfragen
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: "umzug", label: "Umzug (Basis)", desc: "Transport & Einladen", included: true },
                  { id: "einpacken", label: "Einpack-Service", desc: "Wir packen für Sie", price: "+CHF 300-500" },
                  { id: "reinigung", label: "Endreinigung", desc: "Abgabe-Reinigung", price: "+CHF 250-450" },
                  { id: "entsorgung", label: "Entsorgung", desc: "Sperrmüll entsorgen", price: "+CHF 150-300" },
                ].map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary/50 transition-all"
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
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Contact */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-foreground mb-2">
                  Fast geschafft!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Wohin dürfen wir die Offerten senden?
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Max Muster"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">E-Mail</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="max@beispiel.ch"
                  />
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
                    Ich akzeptiere die Datenschutzbestimmungen und erhalte unverbindliche Offerten von geprüften Umzugsfirmen.
                  </span>
                </label>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons - Sticky on Mobile */}
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
            {currentStep === TOTAL_STEPS ? "Offerten erhalten" : "Weiter"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

export default MultiStepCalculatorVariantA;
