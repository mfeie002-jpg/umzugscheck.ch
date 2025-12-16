import { useState, memo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, Video, Camera, 
  MapPin, Home, Calendar, User, Mail, Phone, TrendingDown, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { useABTest } from "@/hooks/use-ab-test";
import { EnhancedProgressIndicator, ProgressMessage } from "./EnhancedProgressIndicator";
import { validateField, emailSchema, postalCodeSchema, nameSchema, phoneSchema } from "@/lib/form-validation";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import analytics from "@/lib/analytics";

const swissPostalCodes = [
  { code: "8001", city: "Zürich" },
  { code: "8002", city: "Zürich" },
  { code: "3000", city: "Bern" },
  { code: "3011", city: "Bern" },
  { code: "4000", city: "Basel" },
  { code: "6000", city: "Luzern" },
  { code: "1200", city: "Genève" },
  { code: "9000", city: "St. Gallen" },
  { code: "8400", city: "Winterthur" },
];

const apartmentSizes = [
  { value: "studio", label: "Studio / 1 Zimmer", sqm: "bis 40m²" },
  { value: "1-1.5", label: "1 – 1.5 Zimmer", sqm: "40-50m²" },
  { value: "2-2.5", label: "2 – 2.5 Zimmer", sqm: "50-65m²" },
  { value: "3-3.5", label: "3 – 3.5 Zimmer", sqm: "65-85m²" },
  { value: "4-4.5", label: "4 – 4.5 Zimmer", sqm: "85-110m²" },
  { value: "5+", label: "5+ Zimmer / Haus", sqm: "110m²+" },
  { value: "office", label: "Büro / Firma", sqm: "variabel" },
];

const services = [
  { id: "umzug", label: "Umzug", description: "Transport & Ein-/Ausladen", default: true, priceAdd: 0 },
  { id: "reinigung", label: "Reinigung", description: "Endreinigung der alten Wohnung", priceAdd: 350 },
  { id: "entsorgung", label: "Entsorgung", description: "Sperrmüll & Möbelentsorgung", priceAdd: 200 },
  { id: "maler", label: "Malerarbeiten", description: "Streichen der alten Wohnung", priceAdd: 450 },
  { id: "lagerung", label: "Lagerung", description: "Zwischenlagerung Ihrer Möbel", priceAdd: 150 },
];

// Price estimation based on apartment size
const getPriceEstimate = (size: string, selectedServices: string[]) => {
  const basePrices: Record<string, { min: number; max: number }> = {
    "studio": { min: 480, max: 680 },
    "1-1.5": { min: 580, max: 850 },
    "2-2.5": { min: 780, max: 1200 },
    "3-3.5": { min: 980, max: 1600 },
    "4-4.5": { min: 1400, max: 2200 },
    "5+": { min: 1800, max: 3200 },
    "office": { min: 2500, max: 5000 },
  };
  
  const base = basePrices[size] || { min: 800, max: 1500 };
  const servicesExtra = selectedServices.reduce((sum, sId) => {
    const service = services.find(s => s.id === sId);
    return sum + (service?.priceAdd || 0);
  }, 0);
  
  return {
    min: base.min + servicesExtra,
    max: base.max + servicesExtra,
  };
};

interface FormData {
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  selectedServices: string[];
  moveDate: string;
  name: string;
  email: string;
  phone: string;
  useVideoAI: boolean;
  privacyAccepted: boolean;
}

interface FieldErrors {
  fromLocation?: string;
  toLocation?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export const MultiStepCalculator = memo(function MultiStepCalculator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fromLocation: "",
    toLocation: "",
    apartmentSize: "",
    selectedServices: ["umzug"],
    moveDate: "",
    name: "",
    email: "",
    phone: "",
    useVideoAI: false,
    privacyAccepted: false,
  });

  // A/B Test for submit button
  const { variant: submitVariant, trackConversion: trackSubmit } = useABTest('calculator_submit');
  
  const getSubmitButtonText = () => {
    switch (submitVariant) {
      case 'variant_a': return 'Jetzt kostenlos Offerten erhalten';
      case 'variant_b': return 'Angebote vergleichen';
      default: return 'Jetzt Offerten anfordern (kostenlos)';
    }
  };

  const totalSteps = 3;

  const updateFormData = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(s => s !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fromLocation.trim() !== "" && formData.toLocation.trim() !== "";
      case 2:
        return formData.apartmentSize !== "" && formData.selectedServices.length > 0;
      case 3:
        return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.privacyAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    const params = new URLSearchParams({
      from: formData.fromLocation,
      to: formData.toLocation,
      size: formData.apartmentSize,
      services: formData.selectedServices.join(","),
      name: formData.name,
      email: formData.email,
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.moveDate && { date: formData.moveDate }),
      ...(formData.useVideoAI && { videoAI: "true" }),
    });
    // Track A/B test conversion
    trackSubmit('form_submit');
    navigate(`/umzugsofferten?${params.toString()}`);
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">
            Schritt {currentStep} von {totalSteps}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            Kostenlos & unverbindlich
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="flex gap-1.5">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                step <= currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
        
        {/* Step Labels */}
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Start & Ziel</span>
          <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Details</span>
          <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Kontakt</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Location */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold">Wohin geht Ihr Umzug?</h3>
                <p className="text-sm text-muted-foreground">
                  Geben Sie Start- und Zielort ein
                </p>
              </div>

              <div className="space-y-3">
                <ValidatedInput
                  schema={postalCodeSchema}
                  value={formData.fromLocation}
                  onValueChange={(v) => updateFormData("fromLocation", v)}
                  label="Von (PLZ oder Ort)"
                  icon={<MapPin className="w-4 h-4 text-primary" />}
                  placeholder="z.B. 8001 oder Zürich"
                  list="from-suggestions"
                />
                <datalist id="from-suggestions">
                  {swissPostalCodes.map((p) => (
                    <option key={`from-${p.code}`} value={`${p.code} ${p.city}`} />
                  ))}
                </datalist>

                <ValidatedInput
                  schema={postalCodeSchema}
                  value={formData.toLocation}
                  onValueChange={(v) => updateFormData("toLocation", v)}
                  label="Nach (PLZ oder Ort)"
                  icon={<MapPin className="w-4 h-4 text-secondary" />}
                  placeholder="z.B. 3011 oder Bern"
                  list="to-suggestions"
                />
                <datalist id="to-suggestions">
                  {swissPostalCodes.map((p) => (
                    <option key={`to-${p.code}`} value={`${p.code} ${p.city}`} />
                  ))}
                </datalist>
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">Wohnungsgrösse & Leistungen</h3>
                <p className="text-sm text-muted-foreground">
                  Was soll alles erledigt werden?
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Home className="w-4 h-4 text-primary" />
                    Wohnungsgrösse
                  </label>
                  <Select 
                    value={formData.apartmentSize} 
                    onValueChange={(v) => updateFormData("apartmentSize", v)}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {apartmentSizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          <span>{size.label}</span>
                          <span className="ml-2 text-muted-foreground text-xs">({size.sqm})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Live Price Estimate */}
                {formData.apartmentSize && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">
                          Geschätzte Kosten
                        </p>
                        <p className="text-xl font-bold text-green-800 dark:text-green-300">
                          CHF {getPriceEstimate(formData.apartmentSize, formData.selectedServices).min.toLocaleString()}
                          {" – "}
                          {getPriceEstimate(formData.apartmentSize, formData.selectedServices).max.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs font-medium">bis 40% sparen</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-green-600/80 dark:text-green-400/80 mt-2">
                      * Unverbindliche Schätzung. Exakte Preise erhalten Sie mit den Offerten.
                    </p>
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium">Gewünschte Leistungen</label>
                  <div className="grid grid-cols-1 gap-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => toggleService(service.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                          formData.selectedServices.includes(service.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/30'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          formData.selectedServices.includes(service.id)
                            ? 'bg-primary border-primary'
                            : 'border-border'
                        }`}>
                          {formData.selectedServices.includes(service.id) && (
                            <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium">{service.label}</p>
                          <p className="text-xs text-muted-foreground truncate">{service.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">Fast geschafft!</h3>
                <p className="text-sm text-muted-foreground">
                  Wohin sollen wir die Offerten senden?
                </p>
              </div>

              <div className="space-y-3">
                <ValidatedInput
                  schema={nameSchema}
                  value={formData.name}
                  onValueChange={(v) => updateFormData("name", v)}
                  label="Name *"
                  icon={<User className="w-4 h-4 text-primary" />}
                  placeholder="Ihr vollständiger Name"
                />

                <ValidatedInput
                  schema={emailSchema}
                  value={formData.email}
                  onValueChange={(v) => updateFormData("email", v)}
                  label="E-Mail *"
                  icon={<Mail className="w-4 h-4 text-primary" />}
                  placeholder="ihre@email.ch"
                  type="email"
                />

                <ValidatedInput
                  schema={phoneSchema}
                  value={formData.phone}
                  onValueChange={(v) => updateFormData("phone", v)}
                  label="Telefon (optional)"
                  icon={<Phone className="w-4 h-4 text-muted-foreground" />}
                  placeholder="+41 79 123 45 67"
                  type="tel"
                  showSuccessIcon={false}
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Umzugsdatum (optional)
                  </label>
                  <Input
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => updateFormData("moveDate", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                </div>

                {/* Video AI Option */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20">
                  <button
                    type="button"
                    onClick={() => updateFormData("useVideoAI", !formData.useVideoAI)}
                    className="flex items-start gap-3 w-full text-left"
                  >
                    <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border ${
                      formData.useVideoAI ? 'bg-primary border-primary' : 'border-border bg-background'
                    }`}>
                      {formData.useVideoAI && <CheckCircle className="w-3.5 h-3.5 text-primary-foreground" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium flex items-center gap-2">
                        <Video className="w-4 h-4 text-primary" />
                        KI Video-Analyse nutzen
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Video hochladen & KI berechnet automatisch Volumen und Aufwand
                      </p>
                    </div>
                  </button>
                </div>

                {/* Privacy Checkbox */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="privacy" className="text-xs text-muted-foreground cursor-pointer">
                    Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> und 
                    bin einverstanden, dass meine Daten zur Angebotseinholung weitergegeben werden.
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-12 rounded-xl px-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Zurück
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary-hover"
            >
              Weiter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1 h-14 rounded-xl bg-secondary hover:bg-secondary/90 font-bold text-base shadow-cta"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              {getSubmitButtonText()}
            </Button>
          )}
        </div>

        {/* Alternative Video CTA */}
        {currentStep === 1 && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">oder</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full h-11 rounded-xl border-primary/30 hover:bg-primary/5 font-medium"
              onClick={() => navigate('/umzugsrechner?tab=ai')}
            >
              <Video className="w-4 h-4 mr-2 text-primary" />
              Video hochladen & KI berechnet
            </Button>
          </>
        )}
      </div>

      {/* Trust Footer */}
      <div className="bg-muted/30 px-6 py-3 border-t border-border">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingDown className="w-3.5 h-3.5 text-green-500" />
            Bis 40% sparen
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            100% kostenlos
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5 text-primary" />
            SSL verschlüsselt
          </div>
        </div>
      </div>
    </div>
  );
});
