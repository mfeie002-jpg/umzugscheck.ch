/**
 * V1.e MultiStepCalculator - Enhanced Trust & Transparency
 * 
 * Based on V1.d + UX Analysis improvements:
 * 1. Trust badges on Step 1
 * 2. Social proof elements throughout
 * 3. Process timeline showing what happens after submit
 * 4. Enhanced progress indicators
 * 5. "Already X moves completed" counter
 */

import { useState, memo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, 
  MapPin, TrendingDown, Calendar, User, Mail, Phone,
  Sparkles, Clock, Edit2, Users, Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate, useLocation } from "react-router-dom";
import { useABTest } from "@/hooks/use-ab-test";
import { getUcCaptureParams, getTomorrowISODate, getDefaultCaptureContact } from "@/lib/uc-capture";
import { postalCodeSchema, emailSchema, nameSchema, phoneSchema } from "@/lib/form-validation";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { CaptureReadySentinel } from "@/components/CaptureReadySentinel";
import { VisualRoomSelector } from "@/components/homepage/VisualRoomSelector";
import { MoveTypeInitialStepV1e } from "./MoveTypeInitialStepV1e";
import { ServicePackageSelectorV1e } from "./ServicePackageSelectorV1e";
import { SubmitOptionsCardV1e } from "./SubmitOptionsCardV1e";
import { TrustBadges } from "./TrustBadges";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getCantonFromZip } from "@/lib/zip-to-canton";
import { getCantonConfig } from "@/lib/cantonConfigMap";
import { CompanyComparisonTable } from "@/components/homepage/CompanyComparisonTable";

const FORM_STORAGE_KEY = "umzugscheck_form_data_v1e";

const swissPostalCodes = [
  { code: "8001", city: "Zürich" },
  { code: "8002", city: "Zürich" },
  { code: "8003", city: "Zürich" },
  { code: "8048", city: "Zürich" },
  { code: "3000", city: "Bern" },
  { code: "3011", city: "Bern" },
  { code: "4000", city: "Basel" },
  { code: "6000", city: "Luzern" },
  { code: "1200", city: "Genève" },
  { code: "1000", city: "Lausanne" },
  { code: "9000", city: "St. Gallen" },
  { code: "8400", city: "Winterthur" },
];

const packageToServices: Record<string, string[]> = {
  "basic": ["umzug"],
  "comfort": ["umzug", "einpacken", "auspacken"],
  "premium": ["umzug", "einpacken", "auspacken", "reinigung"],
};

const getPriceEstimate = (size: string, packageId: string, addOns: string[]) => {
  const basePrices: Record<string, { min: number; max: number }> = {
    "studio": { min: 480, max: 680 },
    "1-1.5": { min: 580, max: 850 },
    "2-2.5": { min: 780, max: 1200 },
    "3-3.5": { min: 980, max: 1600 },
    "4-4.5": { min: 1400, max: 2200 },
    "5+": { min: 1800, max: 3200 },
    "office": { min: 2500, max: 5000 },
  };
  
  const packageMultipliers: Record<string, number> = {
    "basic": 1,
    "comfort": 1.4,
    "premium": 1.8,
  };
  
  const addOnPrices: Record<string, number> = {
    "entsorgung": 200,
    "lagerung": 150,
  };
  
  const base = basePrices[size] || { min: 800, max: 1500 };
  const multiplier = packageMultipliers[packageId] || 1;
  const addOnTotal = addOns.reduce((sum, id) => sum + (addOnPrices[id] || 0), 0);
  
  return {
    min: Math.round(base.min * multiplier + addOnTotal),
    max: Math.round(base.max * multiplier + addOnTotal),
  };
};

const getCompanyPrice = (size: string, priceLevel: string) => {
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
  const multiplier = priceLevel === "günstig" ? 0.85 : priceLevel === "premium" ? 1.25 : 1;
  
  return {
    min: Math.round(base.min * multiplier),
    max: Math.round(base.max * multiplier),
  };
};

interface FormData {
  moveType: string;
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  selectedPackage: string;
  selectedAddOns: string[];
  moveDate: string;
  moveDateFlexible: boolean;
  name: string;
  email: string;
  phone: string;
  privacyAccepted: boolean;
  selectedCompanies: string[];
  submitOption: "direct" | "publish" | "both";
}

export const MultiStepCalculatorV1e = memo(function MultiStepCalculatorV1e() {
  const navigate = useNavigate();
  const location = useLocation();
  const contactFieldsRef = useRef<HTMLDivElement>(null);
  
  const captureParams = getUcCaptureParams(location.search);
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (captureParams.enabled && captureParams.step) {
      return captureParams.step;
    }
    return 1;
  });
  
  const [formData, setFormData] = useState<FormData>(() => {
    if (captureParams.enabled) {
      const contact = getDefaultCaptureContact();
      return {
        moveType: "wohnung",
        fromLocation: "8048 Zürich",
        toLocation: "3011 Bern",
        apartmentSize: "3-3.5",
        selectedPackage: "comfort",
        selectedAddOns: [],
        moveDate: getTomorrowISODate(),
        moveDateFlexible: false,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        privacyAccepted: true,
        selectedCompanies: ["demo-1", "demo-2", "demo-3"],
        submitOption: "both" as const,
      };
    }
    
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          moveType: parsed.moveType || "",
          fromLocation: parsed.fromLocation || "",
          toLocation: parsed.toLocation || "",
          apartmentSize: parsed.apartmentSize || "",
          selectedPackage: parsed.selectedPackage || "basic",
          selectedAddOns: parsed.selectedAddOns || [],
          moveDate: parsed.moveDate || "",
          moveDateFlexible: parsed.moveDateFlexible || false,
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          privacyAccepted: false,
          selectedCompanies: [],
          submitOption: (parsed.submitOption as "direct" | "publish" | "both") || "both",
        };
      }
    } catch (e) {
      console.error("Error loading form data:", e);
    }
    return {
      moveType: "",
      fromLocation: "",
      toLocation: "",
      apartmentSize: "",
      selectedPackage: "basic",
      selectedAddOns: [],
      moveDate: "",
      moveDateFlexible: false,
      name: "",
      email: "",
      phone: "",
      privacyAccepted: false,
      selectedCompanies: [],
      submitOption: "both" as const,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
        moveType: formData.moveType,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        apartmentSize: formData.apartmentSize,
        selectedPackage: formData.selectedPackage,
        selectedAddOns: formData.selectedAddOns,
        moveDate: formData.moveDate,
        moveDateFlexible: formData.moveDateFlexible,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        submitOption: formData.submitOption,
      }));
    } catch (e) {
      console.error("Error saving form data:", e);
    }
  }, [formData]);

  const { trackConversion: trackSubmit } = useABTest('calculator_submit');
  
  const totalSteps = 4;
  
  const serviceIdToCompanyService: Record<string, string[]> = {
    "umzug": ["Umzug", "Firmenumzug"],
    "einpacken": ["Packservice"],
    "auspacken": ["Packservice"],
    "reinigung": ["Reinigung"],
    "entsorgung": ["Entsorgung"],
    "lagerung": ["Lagerung"],
  };

  const getMatchingCompanies = () => {
    const fromZip = formData.fromLocation.split(" ")[0] || "";
    const cantonSlug = getCantonFromZip(fromZip);
    
    let companies: typeof DEMO_COMPANIES = [];
    
    if (cantonSlug) {
      const cantonConfig = getCantonConfig(cantonSlug);
      if (cantonConfig && cantonConfig.companies && cantonConfig.companies.length > 0) {
        companies = cantonConfig.companies.map((c, idx) => ({
          id: `${cantonSlug}-${idx}`,
          name: c.name,
          company_name: c.name,
          rating: c.rating,
          review_count: c.reviews,
          price_level: c.priceLevel as "günstig" | "fair" | "premium",
          is_featured: c.sponsored,
          services_offered: ["Umzug", "Reinigung", "Packservice", "Entsorgung", "Lagerung"],
          service_areas: [cantonConfig.name],
          cantons_served: [cantonSlug],
          logo_url: null,
          short_description: c.badge || `Professionelle Umzugsfirma in ${cantonConfig.name}`,
          quality_score: c.rating * 20,
          slug: c.name.toLowerCase().replace(/\s+/g, '-'),
          profile_completeness: 85,
          conversion_rate: 25,
          response_time_avg_hours: 2,
        }));
      }
    }
    
    if (companies.length === 0) {
      const region = formData.fromLocation.split(" ").pop() || "";
      companies = getCompaniesByRegion(region);
      if (companies.length < 5) companies = DEMO_COMPANIES;
    }
    
    return [...companies].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.rating - a.rating;
    }).slice(0, 12);
  };

  useEffect(() => {
    if (currentStep === 3 && formData.selectedCompanies.length === 0) {
      const companies = getMatchingCompanies();
      const recommended = companies
        .filter(c => c.is_featured || c.rating >= 4.5)
        .slice(0, 3)
        .map(c => c.id);
      
      if (recommended.length < 3) {
        const additional = companies
          .filter(c => !recommended.includes(c.id))
          .slice(0, 3 - recommended.length)
          .map(c => c.id);
        recommended.push(...additional);
      }
      
      if (recommended.length > 0) {
        setFormData(prev => ({ ...prev, selectedCompanies: recommended }));
      }
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === 4 && formData.submitOption && contactFieldsRef.current) {
      setTimeout(() => {
        contactFieldsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    }
  }, [formData.submitOption, currentStep]);

  const updateFormData = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleCompany = (companyId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter(id => id !== companyId)
        : [...prev.selectedCompanies, companyId]
    }));
  };

  const toggleAddOn = (addOnId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAddOns: prev.selectedAddOns.includes(addOnId)
        ? prev.selectedAddOns.filter(id => id !== addOnId)
        : [...prev.selectedAddOns, addOnId]
    }));
  };

  const getSelectedServices = () => {
    const packageServices = packageToServices[formData.selectedPackage] || ["umzug"];
    return [...packageServices, ...formData.selectedAddOns];
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.moveType !== "";
      case 2:
        return formData.fromLocation.trim() !== "" && 
               formData.toLocation.trim() !== "" && 
               formData.apartmentSize !== "" &&
               (formData.moveDate !== "" || formData.moveDateFlexible);
      case 3: return formData.selectedCompanies.length >= 3;
      case 4:
        return formData.name.trim() !== "" && 
               formData.email.trim() !== "" && 
               formData.privacyAccepted;
      default: return false;
    }
  };

  const getCtaText = () => {
    switch (currentStep) {
      case 1: return "Weiter: Kosten schätzen";
      case 2:
        if (!formData.fromLocation || !formData.toLocation) return "Bitte PLZ/Ort eingeben";
        if (!formData.apartmentSize) return "Bitte Wohnungsgrösse wählen";
        if (!formData.moveDate && !formData.moveDateFlexible) return "Bitte Datum angeben";
        return "Weiter zu Firmen";
      case 3:
        if (formData.selectedCompanies.length < 3) {
          return `Noch ${3 - formData.selectedCompanies.length} Firma(en) wählen`;
        }
        return `Mit ${formData.selectedCompanies.length} Firmen weiter`;
      case 4:
        if (!formData.name) return "Bitte Namen eingeben";
        if (!formData.email) return "Bitte E-Mail eingeben";
        if (!formData.privacyAccepted) return "Bitte Datenschutz akzeptieren";
        return "Offerten kostenlos erhalten";
      default: return "Weiter";
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    const priceEstimate = getPriceEstimate(formData.apartmentSize, formData.selectedPackage, formData.selectedAddOns);
    
    const params = new URLSearchParams({
      type: formData.moveType,
      from: formData.fromLocation,
      to: formData.toLocation,
      size: formData.apartmentSize,
      services: getSelectedServices().join(","),
      companies: formData.selectedCompanies.join(","),
      name: formData.name,
      email: formData.email,
      submitOption: formData.submitOption,
      priceMin: priceEstimate.min.toString(),
      priceMax: priceEstimate.max.toString(),
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.moveDate && { date: formData.moveDate }),
      ...(formData.moveDateFlexible && { dateFlexible: "true" }),
    });
    
    trackSubmit('form_submit');
    localStorage.removeItem(FORM_STORAGE_KEY);
    navigate(`/umzugsofferten/bestaetigung?${params.toString()}`);
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const matchingCompanies = getMatchingCompanies();
  const priceEstimate = getPriceEstimate(formData.apartmentSize, formData.selectedPackage, formData.selectedAddOns);

  return (
    <div className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden max-w-full overflow-x-hidden">
      {/* Header with Progress + Social Proof */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground">
            Schritt {currentStep} von {totalSteps}
          </span>
          <div className="flex items-center gap-3">
            {/* Live counter social proof */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Users className="w-3 h-3 text-secondary" />
              <span>12'547 Umzüge vermittelt</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kostenlos & unverbindlich</span>
              <span className="sm:hidden">Kostenlos</span>
            </div>
          </div>
        </div>
        
        <ol className="flex gap-1.5" role="list">
          {[1, 2, 3, 4].map((step) => (
            <li
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                step <= currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </ol>
        
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Typ</span>
          <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Details</span>
          <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Firmen</span>
          <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Kontakt</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 pb-24 md:pb-6">
        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <MoveTypeInitialStepV1e
                value={formData.moveType}
                onChange={(v) => {
                  updateFormData("moveType", v);
                  setTimeout(() => setCurrentStep(2), 300);
                }}
              />
            </motion.div>
          )}

          {/* Step 2 */}
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
                <h3 className="text-lg font-bold">Ihr Umzug im Detail</h3>
                <p className="text-sm text-muted-foreground">Von wo nach wo? Was brauchen Sie?</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <ValidatedInput
                  schema={postalCodeSchema}
                  value={formData.fromLocation}
                  onValueChange={(v) => updateFormData("fromLocation", v)}
                  label="Von"
                  icon={<MapPin className="w-4 h-4 text-primary" />}
                  placeholder="PLZ Ort"
                  list="from-suggestions-v1e"
                />
                <ValidatedInput
                  schema={postalCodeSchema}
                  value={formData.toLocation}
                  onValueChange={(v) => updateFormData("toLocation", v)}
                  label="Nach"
                  icon={<MapPin className="w-4 h-4 text-secondary" />}
                  placeholder="PLZ Ort"
                  list="to-suggestions-v1e"
                />
              </div>
              <datalist id="from-suggestions-v1e">
                {swissPostalCodes.map((p) => (
                  <option key={`from-${p.code}`} value={`${p.code} ${p.city}`} />
                ))}
              </datalist>
              <datalist id="to-suggestions-v1e">
                {swissPostalCodes.map((p) => (
                  <option key={`to-${p.code}`} value={`${p.code} ${p.city}`} />
                ))}
              </datalist>

              <VisualRoomSelector
                value={formData.apartmentSize}
                onChange={(v) => updateFormData("apartmentSize", v)}
              />

              {formData.apartmentSize && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-green-700 dark:text-green-400 font-medium">Geschätzt</p>
                      <p className="text-lg font-bold text-green-800 dark:text-green-300">
                        CHF {priceEstimate.min.toLocaleString()}–{priceEstimate.max.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-medium">bis 40% sparen</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Umzugsdatum (oder Zeitraum)
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id="date-flexible-v1e"
                    checked={formData.moveDateFlexible}
                    onCheckedChange={(checked) => {
                      updateFormData("moveDateFlexible", !!checked);
                      if (checked) updateFormData("moveDate", "");
                    }}
                    className="h-4 w-4"
                  />
                  <label htmlFor="date-flexible-v1e" className="text-[12px] text-muted-foreground cursor-pointer">
                    Termin noch offen / flexibel
                  </label>
                </div>
                {!formData.moveDateFlexible && (
                  <Input
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => updateFormData("moveDate", e.target.value)}
                    className="h-10 rounded-xl"
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}
              </div>

              <ServicePackageSelectorV1e
                selectedPackage={formData.selectedPackage}
                selectedAddOns={formData.selectedAddOns}
                onPackageChange={(pkgId) => updateFormData("selectedPackage", pkgId)}
                onAddOnToggle={toggleAddOn}
              />
            </motion.div>
          )}

          {/* Step 3 */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {formData.selectedCompanies.length >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-secondary/10 border border-secondary/30"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-secondary">
                        Wir senden Ihre Anfrage an {formData.selectedCompanies.length} geprüfte Firmen
                      </p>
                      <p className="text-[11px] text-muted-foreground">Empfohlen vorausgewählt</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleNext}
                      className="bg-secondary hover:bg-secondary/90 shrink-0"
                    >
                      Weiter
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground mt-2 transition-colors"
                  >
                    <Edit2 className="w-3 h-3" />
                    Auswahl ändern
                  </button>
                </motion.div>
              )}

              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-2">
                  <Sparkles className="w-3 h-3" />
                  Firmen vergleichen
                </span>
                <h3 className="text-lg font-bold">
                  {formData.selectedCompanies.length >= 3 ? (
                    <><span className="text-secondary">{formData.selectedCompanies.length} Firmen</span> ausgewählt</>
                  ) : (
                    <>Wählen Sie <span className="text-secondary">mind. 3 Firmen</span></>
                  )}
                </h3>
                <p className="text-[11px] text-muted-foreground/80 mt-1 italic">
                  💡 Firmen mit „Empfohlen" basieren auf Bewertungen, Verfügbarkeit & Nähe
                </p>
              </div>

              <CompanyComparisonTable
                companies={matchingCompanies}
                selectedCompanies={formData.selectedCompanies}
                selectedServices={getSelectedServices()}
                serviceIdToCompanyService={serviceIdToCompanyService}
                apartmentSize={formData.apartmentSize}
                onToggleCompany={toggleCompany}
                getCompanyPrice={getCompanyPrice}
              />
            </motion.div>
          )}

          {/* Step 4 */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center mb-2">
                <h3 className="text-lg font-bold">Fast geschafft!</h3>
                <p className="text-sm text-muted-foreground">
                  Wie sollen Firmen Ihnen Offerten senden?
                </p>
              </div>

              <SubmitOptionsCardV1e
                value={formData.submitOption}
                onChange={(v) => updateFormData("submitOption", v)}
                selectedCompaniesCount={formData.selectedCompanies.length}
                estimatedPrice={priceEstimate}
              />

              <div ref={contactFieldsRef} className="space-y-3">
                <ValidatedInput
                  schema={nameSchema}
                  value={formData.name}
                  onValueChange={(v) => updateFormData("name", v)}
                  label="Name *"
                  icon={<User className="w-4 h-4 text-primary" />}
                  placeholder="Ihr Name"
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

                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="privacy-v1e"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                    className="mt-0.5 h-5 w-5"
                  />
                  <label htmlFor="privacy-v1e" className="text-[11px] text-muted-foreground cursor-pointer leading-relaxed">
                    Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> und 
                    bin einverstanden, dass meine Daten zur Offerteneinholung an die ausgewählten Firmen weitergegeben werden.
                  </label>
                </div>
                
                {/* Enhanced trust box with social proof */}
                <div className="flex items-start gap-2 mt-2 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                  <div className="text-xs">
                    <span className="font-medium text-green-700 dark:text-green-300">Ihre Daten sind sicher:</span>{" "}
                    <span className="text-green-600 dark:text-green-400">
                      Keine Werbeanrufe · Nur an ausgewählte Firmen · 100% unverbindlich
                    </span>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-green-200 dark:border-green-800">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-green-600 dark:text-green-400">
                        Bereits 12'547 erfolgreiche Vermittlungen
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Sticky CTA */}
      <div className="fixed md:relative bottom-0 left-0 right-0 md:bottom-auto
                      bg-card/98 backdrop-blur-lg border-t border-border/50 
                      shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:shadow-none
                      p-4 md:px-6 md:py-4 md:border-t md:border-border
                      pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-4
                      z-40">
        <div className="max-w-6xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="h-12 md:h-11 rounded-xl px-4 min-w-[90px]"
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
              className="flex-1 h-12 md:h-11 rounded-xl bg-primary hover:bg-primary-hover text-base font-semibold disabled:opacity-50"
            >
              {getCtaText()}
              {canProceed() && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          ) : (
            <div className="flex-1 flex flex-col items-center">
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="w-full h-12 rounded-xl bg-secondary hover:bg-secondary/90 font-bold text-base shadow-cta disabled:opacity-50"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {getCtaText()}
              </Button>
              <p className="text-[11px] text-muted-foreground mt-2 text-center">
                ✓ 100% kostenlos & unverbindlich
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Trust Footer with full badges */}
      <div className="hidden md:block bg-muted/30 px-6 py-3 border-t border-border">
        <TrustBadges variant="compact" />
      </div>
      
      <CaptureReadySentinel 
        step={currentStep} 
        flow="v1e" 
        isReady={true}
        metadata={{ variant: "v1e-trust-enhanced" }}
      />
    </div>
  );
});
