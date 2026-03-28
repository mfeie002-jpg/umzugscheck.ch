/**
 * MultiStepCalculator Variant Component
 * 
 * A configurable multi-step calculator that adapts based on the flow variant.
 * Wraps the original MultiStepCalculator with variant-specific configuration.
 */

import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, 
  MapPin, Package, Sparkles, Brush, Trash2, Warehouse,
  Info, Star, Clock, User, Mail, Phone, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { postalCodeSchema, emailSchema, nameSchema, phoneSchema } from "@/lib/form-validation";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { MoveTypeInitialStep } from "./MoveTypeInitialStep";
import { DEMO_COMPANIES } from "@/data/companies";
import { type FlowVariantConfig } from "@/lib/flow-variants";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Storage key for form persistence
const FORM_STORAGE_KEY = "umzugscheck_form_data_variant";

const swissPostalCodes = [
  { code: "8001", city: "Zürich" },
  { code: "8002", city: "Zürich" },
  { code: "3000", city: "Bern" },
  { code: "4000", city: "Basel" },
  { code: "6000", city: "Luzern" },
];

const services = [
  { id: "umzug", label: "Umzug (Basis)", icon: <Package className="w-4 h-4" />, priceAdd: 0, default: true },
  { id: "einpacken", label: "Einpack-Service", icon: <Package className="w-4 h-4" />, priceAdd: 400, highlight: true },
  { id: "auspacken", label: "Auspack-Service", icon: <Sparkles className="w-4 h-4" />, priceAdd: 300 },
  { id: "reinigung", label: "Endreinigung", icon: <Brush className="w-4 h-4" />, priceAdd: 350 },
  { id: "entsorgung", label: "Entsorgung", icon: <Trash2 className="w-4 h-4" />, priceAdd: 200 },
  { id: "lagerung", label: "Zwischenlagerung", icon: <Warehouse className="w-4 h-4" />, priceAdd: 150 },
];

const apartmentSizes = [
  { id: "studio", label: "Studio", rooms: "1" },
  { id: "1-1.5", label: "1-1.5 Zi.", rooms: "1-2" },
  { id: "2-2.5", label: "2-2.5 Zi.", rooms: "2-3" },
  { id: "3-3.5", label: "3-3.5 Zi.", rooms: "3-4" },
  { id: "4-4.5", label: "4-4.5 Zi.", rooms: "4-5" },
  { id: "5+", label: "5+ Zi.", rooms: "5+" },
];

interface FormData {
  moveType: string;
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  selectedServices: string[];
  moveDate: string;
  name: string;
  email: string;
  phone: string;
  privacyAccepted: boolean;
  selectedCompanies: string[];
  submitOption: "direct" | "publish" | "both";
}

interface MultiStepCalculatorVariantProps {
  variant: FlowVariantConfig;
}

export const MultiStepCalculatorVariant = memo(function MultiStepCalculatorVariant({ 
  variant 
}: MultiStepCalculatorVariantProps) {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  const [formData, setFormData] = useState<FormData>({
    moveType: "",
    fromLocation: "",
    toLocation: "",
    apartmentSize: "",
    selectedServices: ["umzug"],
    moveDate: "",
    name: "",
    email: "",
    phone: "",
    privacyAccepted: false,
    selectedCompanies: [],
    submitOption: variant.defaultSubmitOption,
  });

  const totalSteps = variant.steps.length;
  const currentStep = variant.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / totalSteps) * 100;

  const updateFormData = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    if (serviceId === "umzug") return;
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(s => s !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'moveType':
        return formData.moveType !== "";
      case 'location':
        return formData.fromLocation && formData.toLocation && formData.apartmentSize;
      case 'services':
        return formData.selectedServices.length > 0;
      case 'pricing':
        return true;
      case 'companies':
        return variant.companySelectionMode === 'none' || formData.selectedCompanies.length > 0;
      case 'summary':
        return true;
      case 'contact':
        return formData.name && formData.email && formData.phone && formData.privacyAccepted;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Store form data and navigate to confirmation
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
      ...formData,
      variant: variant.id,
      submittedAt: new Date().toISOString(),
    }));
    navigate('/umzugsofferten-bestaetigung');
  };

  // Progress indicator component based on variant style
  const ProgressIndicator = () => {
    switch (variant.progressStyle) {
      case 'bar':
        return (
          <div className="mb-6">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Schritt {currentStepIndex + 1} von {totalSteps}
            </p>
          </div>
        );
      case 'steps':
        return (
          <div className="flex justify-center gap-2 mb-6">
            {variant.steps.map((step, idx) => (
              <div 
                key={step} 
                className={cn(
                  "flex items-center gap-2",
                  idx <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  idx < currentStepIndex ? "bg-primary text-primary-foreground" :
                  idx === currentStepIndex ? "bg-primary text-primary-foreground" :
                  "bg-muted text-muted-foreground"
                )}>
                  {idx < currentStepIndex ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </div>
                {idx < variant.steps.length - 1 && (
                  <div className={cn(
                    "w-8 h-0.5",
                    idx < currentStepIndex ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            ))}
          </div>
        );
      case 'minimal':
        return (
          <p className="text-center text-sm text-muted-foreground mb-4">
            {currentStepIndex + 1}/{totalSteps}
          </p>
        );
      case 'dots':
      default:
        return (
          <div className="flex justify-center gap-2 mb-6">
            {variant.steps.map((_, idx) => (
              <div 
                key={idx} 
                className={cn(
                  "w-2 h-2 rounded-full transition-colors",
                  idx <= currentStepIndex ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>
        );
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 'moveType':
        return (
          <div className="space-y-6">
            <MoveTypeInitialStep 
              value={formData.moveType} 
              onChange={(type) => {
                updateFormData('moveType', type);
                // Auto-advance after selection
                setTimeout(() => handleNext(), 300);
              }} 
            />
          </div>
        );

      case 'location':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Woher & Wohin?</h2>
              <p className="text-muted-foreground text-sm">Geben Sie Ihre Adressen ein</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Von (PLZ/Ort)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="z.B. 8001 Zürich"
                    value={formData.fromLocation}
                    onChange={(e) => updateFormData('fromLocation', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Nach (PLZ/Ort)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="z.B. 3000 Bern"
                    value={formData.toLocation}
                    onChange={(e) => updateFormData('toLocation', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-3 block">Wohnungsgrösse</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {apartmentSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => updateFormData('apartmentSize', size.id)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all",
                      formData.apartmentSize === size.id
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="text-sm font-medium">{size.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Services selection (combined with location in this variant) */}
            <div>
              <label className="text-sm font-medium mb-3 block">Zusätzliche Services</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {services.filter(s => s.id !== 'umzug').map((service) => (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all flex items-center gap-2",
                      formData.selectedServices.includes(service.id)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {service.icon}
                    <span className="text-sm">{service.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Welche Services benötigen Sie?</h2>
              <p className="text-muted-foreground text-sm">Wählen Sie alle gewünschten Leistungen</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  disabled={service.id === 'umzug'}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all",
                    formData.selectedServices.includes(service.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50",
                    service.id === 'umzug' && "opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {service.icon}
                    <div>
                      <div className="font-medium">{service.label}</div>
                      {service.priceAdd > 0 && (
                        <div className="text-xs text-muted-foreground">+CHF {service.priceAdd}</div>
                      )}
                    </div>
                    {formData.selectedServices.includes(service.id) && (
                      <CheckCircle className="w-5 h-5 text-primary ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        const basePrices: Record<string, { min: number; max: number }> = {
          "studio": { min: 480, max: 680 },
          "1-1.5": { min: 580, max: 850 },
          "2-2.5": { min: 780, max: 1200 },
          "3-3.5": { min: 980, max: 1600 },
          "4-4.5": { min: 1400, max: 2200 },
          "5+": { min: 1800, max: 3200 },
        };
        const base = basePrices[formData.apartmentSize] || { min: 800, max: 1500 };
        const servicesExtra = formData.selectedServices.reduce((sum, sId) => {
          const service = services.find(s => s.id === sId);
          return sum + (service?.priceAdd || 0);
        }, 0);
        const totalMin = base.min + servicesExtra;
        const totalMax = base.max + servicesExtra;

        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Ihre geschätzten Kosten</h2>
              <p className="text-muted-foreground text-sm">Basierend auf Ihren Angaben</p>
            </div>
            
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-8 text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                CHF {totalMin.toLocaleString()} – {totalMax.toLocaleString()}
              </div>
              <p className="text-muted-foreground text-sm">
                Unverbindliche Schätzung • Exakte Preise in den Offerten
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <h3 className="font-medium mb-2">Ihre Auswahl:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• {apartmentSizes.find(s => s.id === formData.apartmentSize)?.label || 'Wohnung'}</li>
                <li>• {formData.fromLocation} → {formData.toLocation}</li>
                <li>• {formData.selectedServices.length} Service(s) ausgewählt</li>
              </ul>
            </div>
          </div>
        );

      case 'companies':
        if (variant.companySelectionMode === 'none') {
          return null;
        }
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Wählen Sie Ihre Favoriten</h2>
              <p className="text-muted-foreground text-sm">
                {variant.companySelectionMode === 'single' 
                  ? 'Wählen Sie eine Firma'
                  : `Wählen Sie bis zu ${variant.maxCompanySelections} Firmen`}
              </p>
            </div>
            <div className="space-y-3">
              {DEMO_COMPANIES.slice(0, 5).map((company) => (
                <button
                  key={company.id}
                  onClick={() => {
                    if (variant.companySelectionMode === 'single') {
                      updateFormData('selectedCompanies', [company.id]);
                    } else {
                      const isSelected = formData.selectedCompanies.includes(company.id);
                      if (isSelected) {
                        updateFormData('selectedCompanies', 
                          formData.selectedCompanies.filter(id => id !== company.id)
                        );
                      } else if (formData.selectedCompanies.length < variant.maxCompanySelections) {
                        updateFormData('selectedCompanies', 
                          [...formData.selectedCompanies, company.id]
                        );
                      }
                    }
                  }}
                  className={cn(
                    "w-full p-4 rounded-lg border text-left transition-all",
                    formData.selectedCompanies.includes(company.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{company.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {company.rating} ({company.review_count} Bewertungen)
                      </div>
                    </div>
                    {formData.selectedCompanies.includes(company.id) && (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 'summary':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Ihre Anfrage im Überblick</h2>
              <p className="text-muted-foreground text-sm">Prüfen Sie Ihre Angaben</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Von:</span>
                  <p className="font-medium">{formData.fromLocation}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nach:</span>
                  <p className="font-medium">{formData.toLocation}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Wohnung:</span>
                  <p className="font-medium">{apartmentSizes.find(s => s.id === formData.apartmentSize)?.label}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Services:</span>
                  <p className="font-medium">{formData.selectedServices.length}</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Fast geschafft!</h2>
              <p className="text-muted-foreground text-sm">Wohin sollen wir Ihre Offerten senden?</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Ihr Name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="ihre@email.ch"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+41 79 000 00 00"
                    value={formData.phone}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-2 pt-2">
                <Checkbox
                  id="privacy"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => updateFormData('privacyAccepted', !!checked)}
                />
                <label htmlFor="privacy" className="text-xs text-muted-foreground leading-relaxed">
                  Ich akzeptiere die Datenschutzbestimmungen und stimme zu, dass meine Daten zur Vermittlung 
                  von Umzugsofferten verwendet werden.
                </label>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div className={cn(
      "rounded-xl border bg-card shadow-lg",
      variant.cardStyle === 'flat' && "shadow-none",
      variant.cardStyle === 'bordered' && "shadow-none border-2"
    )}>
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {variant.headline}
          </h1>
          <p className="text-muted-foreground">
            {variant.subheadline}
          </p>
        </div>

        {/* Progress */}
        {variant.showProgressBar && <ProgressIndicator />}

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStepIndex === 0}
            className={currentStepIndex === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück
          </Button>

          {isLastStep ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="min-w-[200px]"
            >
              {variant.ctaText}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Weiter
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Trust badges */}
        {variant.trustBadges && (
          <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>100% kostenlos</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Unverbindlich</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>~2 Min.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});
