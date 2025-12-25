import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, Video, Camera, 
  MapPin, TrendingDown, Package, Sparkles, Brush, Trash2, Warehouse,
  Plus, Minus, Info, Star, Clock, Award, User, Mail, Phone, Calendar,
  Filter, List, LayoutGrid, Zap, Map, Users, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useABTest } from "@/hooks/use-ab-test";
import { getUcCaptureParams, getTomorrowISODate, getDefaultCaptureContact } from "@/lib/uc-capture";
import { postalCodeSchema, emailSchema, nameSchema, phoneSchema } from "@/lib/form-validation";
import { ValidatedInput } from "@/components/ui/ValidatedInput";
import { VisualRoomSelector } from "./VisualRoomSelector";
import { MoveTypeInitialStep } from "./MoveTypeInitialStep";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getCantonFromZip } from "@/lib/zip-to-canton";
import { getCantonConfig } from "@/lib/cantonConfigMap";
import { CompanyComparisonTable } from "./CompanyComparisonTable";
import { PackageSavingsCard } from "./PackageSavingsCard";
import { SubmitOptionsCard } from "./SubmitOptionsCard";

// Storage key for form persistence
const FORM_STORAGE_KEY = "umzugscheck_form_data";

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

// Enhanced services with detailed info - PACKING FIRST (most important upsell)
const services = [
  { 
    id: "umzug", 
    label: "Umzug (Basis)", 
    description: "Ihr kompletter Umzug: Transport aller Möbel & Gegenstände von A nach B, inkl. professionelles Ein- und Ausladen durch erfahrene Möbelpacker.",
    priceRange: "Inkl.",
    details: "Der Basis-Umzugsservice umfasst den kompletten Transport Ihrer Einrichtung. Unsere erfahrenen Teams schützen Ihre Möbel mit Decken und Gurten, tragen alles sicher raus und wieder rein.",
    benefits: ["Erfahrene 2-3 Mann Teams", "Schutzverpackung für empfindliche Möbel", "Versicherter Transport bis CHF 50'000"],
    icon: <Package className="w-4 h-4" />,
    priceAdd: 0,
    popular: true,
    default: true,
    bookingPercent: 100, // Everyone books this
  },
  { 
    id: "einpacken", 
    label: "Einpack-Service", 
    description: "Keine Lust auf Kartonpacken? Wir übernehmen das komplett – Geschirr, Kleidung, Bücher, alles bruchsicher verpackt.",
    priceRange: "+CHF 300–500",
    details: "Professionelles Einpacken aller Gegenstände in Kartons. Geschirr, Gläser, Bücher – alles wird fachgerecht und bruchsicher verpackt. Sie müssen keinen Finger rühren und sparen 1-2 Tage Stress!",
    benefits: ["Spart Ihnen 1–2 Tage Arbeit", "Bruchsicheres Verpacken durch Profis", "Kartonmaterial & Polsterung inklusive", "Perfekt bei Zeitmangel oder Rückenproblemen"],
    icon: <Package className="w-4 h-4" />,
    priceAdd: 400,
    popular: true,
    highlight: true,
    bookingPercent: 73, // 73% of users book this
  },
  { 
    id: "auspacken", 
    label: "Auspack-Service", 
    description: "Sofort einzugsbereit! Wir packen alle Kartons am Zielort aus und entsorgen das Verpackungsmaterial.",
    priceRange: "+CHF 200–400",
    details: "Wir packen alle Kartons am neuen Ort aus, stellen Dinge an den gewünschten Platz und entsorgen das Verpackungsmaterial. Sie können am Abend bereits entspannt ankommen!",
    benefits: ["Sofort einzugsbereit", "Kartonentsorgung inklusive", "Zeitersparnis von 1 Tag", "Stressfreier Start im neuen Zuhause"],
    icon: <Sparkles className="w-4 h-4" />,
    priceAdd: 300,
    popular: true,
    highlight: true,
    bookingPercent: 52, // 52% book this
  },
  { 
    id: "reinigung", 
    label: "Endreinigung", 
    description: "Professionelle Abgabereinigung der alten Wohnung nach CH-Standard – mit Abnahmegarantie vom Vermieter.",
    priceRange: "+CHF 250–450",
    details: "Professionelle Endreinigung nach Schweizer Standard. Inklusive Abnahmegarantie – falls der Vermieter nicht akzeptiert, reinigen wir kostenlos nach bis es passt!",
    benefits: ["Abnahmegarantie inklusive", "Alle Räume inkl. Küche & Bad", "Fenster innen & aussen", "Backofen & Kühlschrank gereinigt"],
    icon: <Brush className="w-4 h-4" />,
    priceAdd: 350,
    popular: true,
    bookingPercent: 45, // 45% book this
  },
  { 
    id: "entsorgung", 
    label: "Entsorgung", 
    description: "Alte Möbel, Sperrmüll oder Elektrogeräte? Wir entsorgen alles fachgerecht und umweltfreundlich.",
    priceRange: "+CHF 150–300",
    details: "Fachgerechte Entsorgung von Sperrmüll, alten Möbeln und Elektrogeräten. Umweltfreundlich und gesetzeskonform – Sie müssen nicht selbst zur Deponie fahren.",
    benefits: ["Umweltgerechte Entsorgung", "Keine Selbstfahrt zur Deponie nötig", "Elektrogeräte & Sondermüll inklusive"],
    icon: <Trash2 className="w-4 h-4" />,
    priceAdd: 200,
    popular: false,
    bookingPercent: 28, // 28% book this
  },
  { 
    id: "lagerung", 
    label: "Zwischenlagerung", 
    description: "Noch keine neue Wohnung bereit? Sichere, klimatisierte Lagerung Ihrer Möbel – flexibel von 1 Woche bis 12 Monate.",
    priceRange: "+CHF 100–200/Mt",
    details: "Sichere, klimatisierte Lagerung Ihrer Möbel und Gegenstände. Ideal bei Übergangszeiten, Renovierungen oder wenn die neue Wohnung noch nicht bereit ist.",
    benefits: ["Klimatisierte, saubere Räume", "24/7 Videoüberwachung & Alarm", "Flexible Laufzeit ohne Mindestdauer"],
    icon: <Warehouse className="w-4 h-4" />,
    priceAdd: 150,
    popular: false,
    bookingPercent: 12, // 12% book this
  },
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

// Company price estimate
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
  selectedServices: string[];
  moveDate: string;
  name: string;
  email: string;
  phone: string;
  useVideoAI: boolean;
  privacyAccepted: boolean;
  selectedCompanies: string[];
  submitOption: "direct" | "publish" | "both";
}

export const MultiStepCalculator = memo(function MultiStepCalculator() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for capture mode (for screenshot automation)
  const captureParams = getUcCaptureParams(location.search);
  
  const [currentStep, setCurrentStep] = useState(() => {
    // If in capture mode with a specific step, start at that step
    if (captureParams.enabled && captureParams.step) {
      return captureParams.step;
    }
    return 1;
  });
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [didAutoAdvance, setDidAutoAdvance] = useState(false);
  const [companyFilter, setCompanyFilter] = useState<"alle" | "günstig" | "top" | "schnell">("alle");
  const [showComparisonView, setShowComparisonView] = useState(false);
  
  const [formData, setFormData] = useState<FormData>(() => {
    // If in capture mode, use prefilled demo data
    if (captureParams.enabled) {
      const contact = getDefaultCaptureContact();
      return {
        moveType: "wohnung",
        fromLocation: "8048 Zürich",
        toLocation: "3011 Bern",
        apartmentSize: "3-3.5",
        selectedServices: ["umzug", "einpacken", "reinigung"],
        moveDate: getTomorrowISODate(),
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        useVideoAI: false,
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
          selectedServices: parsed.selectedServices || ["umzug"],
          moveDate: parsed.moveDate || "",
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          useVideoAI: parsed.useVideoAI || false,
          privacyAccepted: false, // Always reset privacy for security
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
      selectedServices: ["umzug"],
      moveDate: "",
      name: "",
      email: "",
      phone: "",
      useVideoAI: false,
      privacyAccepted: false,
      selectedCompanies: [],
      submitOption: "both" as const,
    };
  });

  // Persist form data to localStorage AND sync with uc_prefill for /umzugsofferten page
  useEffect(() => {
    try {
      // Save to main form storage
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
        moveType: formData.moveType,
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        apartmentSize: formData.apartmentSize,
        selectedServices: formData.selectedServices,
        moveDate: formData.moveDate,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        useVideoAI: formData.useVideoAI,
      }));
      
      // Also save to uc_prefill format for HeroAIQuoteCalculator on /umzugsofferten
      if (formData.fromLocation || formData.toLocation) {
        localStorage.setItem('uc_prefill', JSON.stringify({
          from: formData.fromLocation,
          to: formData.toLocation,
          size: formData.apartmentSize,
          services: formData.selectedServices,
          source: 'homepage',
          timestamp: Date.now(),
        }));
      }
    } catch (e) {
      console.error("Error saving form data:", e);
    }
  }, [formData]);

  // Prefill from URL (?from=&to=&size=&services=) or uc_prefill and auto-skip steps
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const from = params.get("from") || "";
      const to = params.get("to") || "";
      const size = params.get("size") || "";
      const servicesParam = params.get("services") || "";
      const servicesFromUrl = servicesParam
        ? servicesParam.split(",").map((s) => s.trim()).filter(Boolean)
        : null;

      const prefillRaw = localStorage.getItem("uc_prefill");
      const prefill = prefillRaw ? JSON.parse(prefillRaw) : null;

      const nextFrom = from || prefill?.from || "";
      const nextTo = to || prefill?.to || "";
      const nextSize = size || prefill?.size || "";

      const nextServices = servicesFromUrl || (Array.isArray(prefill?.services) ? prefill.services : null);

      if (nextFrom || nextTo || nextSize || nextServices) {
        setFormData((prev) => ({
          ...prev,
          // Move type is required for step 1, so set a safe default when we have prefill
          moveType: prev.moveType || "wohnung",
          fromLocation: nextFrom || prev.fromLocation,
          toLocation: nextTo || prev.toLocation,
          apartmentSize: nextSize || prev.apartmentSize,
          selectedServices: nextServices?.length ? Array.from(new Set(["umzug", ...nextServices])) : prev.selectedServices,
        }));

        // Skip the move-type click if prefilled
        setCurrentStep((prevStep) => (prevStep === 1 ? 2 : prevStep));
      }
    } catch {
      // ignore
    }
  }, [location.search]);

  // Auto-advance from step 2 -> step 3 ONLY when coming from URL prefill
  // Do NOT auto-advance when user is manually filling the form
  useEffect(() => {
    if (didAutoAdvance) return;
    if (currentStep !== 2) return;

    // Only auto-advance if we have prefill data from URL/localStorage
    // This prevents jumping away when user is still selecting services
    const params = new URLSearchParams(location.search);
    const hasUrlPrefill = params.get("from") || params.get("to") || params.get("size");
    
    if (!hasUrlPrefill) return; // Don't auto-advance for manual entry

    const ready =
      formData.fromLocation.trim() !== "" &&
      formData.toLocation.trim() !== "" &&
      formData.apartmentSize !== "" &&
      formData.selectedServices.length > 0;

    if (ready) {
      setDidAutoAdvance(true);
      setCurrentStep(3);
    }
  }, [currentStep, didAutoAdvance, formData, location.search]);

  // A/B Test for submit button
  const { variant: submitVariant, trackConversion: trackSubmit } = useABTest('calculator_submit');
  
  const getSubmitButtonText = () => {
    switch (submitVariant) {
      case 'variant_a': return 'Jetzt Offerten erhalten';
      case 'variant_b': return 'Kostenlos Offerten anfordern';
      default: return 'Offerten erhalten (kostenlos)';
    }
  };

  // 4 steps: MoveType → Location+Size+Services → CompanyRanking → Contact
  const totalSteps = 4;

  const updateFormData = (field: keyof FormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    // Can't deselect "umzug"
    if (serviceId === "umzug") return;
    
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(s => s !== serviceId)
        : [...prev.selectedServices, serviceId]
    }));
  };

  const toggleCompany = (companyId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter(id => id !== companyId)
        : [...prev.selectedCompanies, companyId]
    }));
  };

  // Map our service IDs to company service names
  const serviceIdToCompanyService: Record<string, string[]> = {
    "umzug": ["Umzug", "Firmenumzug"],
    "einpacken": ["Packservice"],
    "auspacken": ["Packservice"],
    "reinigung": ["Reinigung"],
    "entsorgung": ["Entsorgung"],
    "lagerung": ["Lagerung"],
  };

  // Get matching companies based on "from" ZIP code - using canton config
  const getMatchingCompanies = () => {
    // Extract ZIP from fromLocation (format: "8048 Zürich" or just "8048")
    const fromZip = formData.fromLocation.split(" ")[0] || "";
    const cantonSlug = getCantonFromZip(fromZip);
    
    let companies: typeof DEMO_COMPANIES = [];
    
    // Try to get companies from canton config first
    if (cantonSlug) {
      const cantonConfig = getCantonConfig(cantonSlug);
      if (cantonConfig && cantonConfig.companies && cantonConfig.companies.length > 0) {
        // Convert canton config companies to our format
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
    
    // Fallback: try region-based lookup or demo companies
    if (companies.length === 0) {
      const region = formData.fromLocation.split(" ").pop() || "";
      companies = getCompaniesByRegion(region);
      if (companies.length < 5) companies = DEMO_COMPANIES;
    }
    
    // Filter by selected services - company must offer ALL selected services
    const selectedServiceNames = formData.selectedServices
      .filter(s => s !== "umzug") // umzug is always included, don't filter by it
      .flatMap(serviceId => serviceIdToCompanyService[serviceId] || []);
    
    if (selectedServiceNames.length > 0) {
      companies = companies.filter(company => 
        selectedServiceNames.every(serviceName =>
          company.services_offered.some(offered => 
            offered.toLowerCase().includes(serviceName.toLowerCase())
          )
        )
      );
    }
    
    // Sort: Featured first, then by rating
    return [...companies].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.rating - a.rating;
    }).slice(0, 12);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.moveType !== "";
      case 2:
        return formData.fromLocation.trim() !== "" && 
               formData.toLocation.trim() !== "" && 
               formData.apartmentSize !== "" &&
               formData.selectedServices.length > 0 &&
               formData.moveDate !== ""; // Date is now required
      case 3:
        return formData.selectedCompanies.length >= 3;
      case 4:
        return formData.name.trim() !== "" && 
               formData.email.trim() !== "" && 
               formData.privacyAccepted;
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
    const priceEstimate = getPriceEstimate(formData.apartmentSize, formData.selectedServices);
    
    const params = new URLSearchParams({
      type: formData.moveType,
      from: formData.fromLocation,
      to: formData.toLocation,
      size: formData.apartmentSize,
      services: formData.selectedServices.join(","),
      companies: formData.selectedCompanies.join(","),
      name: formData.name,
      email: formData.email,
      submitOption: formData.submitOption,
      priceMin: priceEstimate.min.toString(),
      priceMax: priceEstimate.max.toString(),
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.moveDate && { date: formData.moveDate }),
      ...(formData.useVideoAI && { videoAI: "true" }),
    });
    
    trackSubmit('form_submit');
    
    // Clear storage after successful submit
    localStorage.removeItem(FORM_STORAGE_KEY);
    
    // Navigate with submitOption info - the receiving page will handle creating listings
    navigate(`/umzugsofferten/bestaetigung?${params.toString()}`);
  };

  const stepVariants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const matchingCompanies = getMatchingCompanies();

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
        
        <div className="flex gap-1.5">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                step <= currentStep ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
          <span className={currentStep >= 1 ? 'text-primary font-medium' : ''}>Typ</span>
          <span className={currentStep >= 2 ? 'text-primary font-medium' : ''}>Details</span>
          <span className={currentStep >= 3 ? 'text-primary font-medium' : ''}>Firmen</span>
          <span className={currentStep >= 4 ? 'text-primary font-medium' : ''}>Kontakt</span>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Move Type */}
          {currentStep === 1 && (
            <motion.div
              key="step1-movetype"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <MoveTypeInitialStep
                value={formData.moveType}
                onChange={(v) => {
                  updateFormData("moveType", v);
                  setTimeout(() => setCurrentStep(2), 300);
                }}
              />
            </motion.div>
          )}

          {/* Step 2: Location + Size + Services (Combined) */}
          {currentStep === 2 && (
            <motion.div
              key="step2-details"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold">Ihr Umzug im Detail</h3>
                <p className="text-sm text-muted-foreground">
                  Von wo nach wo? Was brauchen Sie?
                </p>
              </div>

              <div className="space-y-3">
                {/* Location Inputs */}
                <div className="grid grid-cols-2 gap-2">
                  <ValidatedInput
                    schema={postalCodeSchema}
                    value={formData.fromLocation}
                    onValueChange={(v) => updateFormData("fromLocation", v)}
                    label="Von"
                    icon={<MapPin className="w-4 h-4 text-primary" />}
                    placeholder="PLZ/Ort"
                    list="from-suggestions"
                    inputMode="text"
                  />
                  <ValidatedInput
                    schema={postalCodeSchema}
                    value={formData.toLocation}
                    onValueChange={(v) => updateFormData("toLocation", v)}
                    label="Nach"
                    icon={<MapPin className="w-4 h-4 text-secondary" />}
                    placeholder="PLZ/Ort"
                    list="to-suggestions"
                    inputMode="text"
                  />
                </div>
                <datalist id="from-suggestions">
                  {swissPostalCodes.map((p) => (
                    <option key={`from-${p.code}`} value={`${p.code} ${p.city}`} />
                  ))}
                </datalist>
                <datalist id="to-suggestions">
                  {swissPostalCodes.map((p) => (
                    <option key={`to-${p.code}`} value={`${p.code} ${p.city}`} />
                  ))}
                </datalist>

                {/* Room Size Selector */}
                <VisualRoomSelector
                  value={formData.apartmentSize}
                  onChange={(v) => updateFormData("apartmentSize", v)}
                />

                {/* Price Estimate */}
                {formData.apartmentSize && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-green-700 dark:text-green-400 font-medium">
                          Geschätzt
                        </p>
                        <p className="text-lg font-bold text-green-800 dark:text-green-300">
                          CHF {getPriceEstimate(formData.apartmentSize, formData.selectedServices).min.toLocaleString()}–{getPriceEstimate(formData.apartmentSize, formData.selectedServices).max.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-medium">bis 40% sparen</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Move Date - NOW REQUIRED */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Umzugsdatum *
                    {!formData.moveDate && (
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Pflichtfeld
                      </span>
                    )}
                  </label>
                  <Input
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => updateFormData("moveDate", e.target.value)}
                    className={`h-10 rounded-xl ${!formData.moveDate ? 'border-amber-400 focus:border-primary' : ''}`}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                {/* KI Video-Analyzer Promotion */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => updateFormData("useVideoAI", !formData.useVideoAI)}
                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.useVideoAI
                      ? "border-secondary bg-secondary/10"
                      : "border-primary/30 bg-gradient-to-r from-primary/5 to-secondary/5 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      formData.useVideoAI ? "bg-secondary text-secondary-foreground" : "bg-primary/20"
                    }`}>
                      <Video className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold">🤖 KI Video-Analyse</p>
                        <span className="text-[8px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full font-medium">
                          NEU
                        </span>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Filmen Sie Ihre Wohnung – unsere KI erstellt ein exaktes Inventar
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 ${
                        formData.useVideoAI ? "bg-secondary border-secondary" : "border-border"
                      }`}
                    >
                      {formData.useVideoAI && (
                        <CheckCircle className="w-3.5 h-3.5 text-secondary-foreground" />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Services with Expand */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Welche Leistungen brauchen Sie?</label>
                    <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Plus className="w-2.5 h-2.5" />
                      Details
                    </span>
                  </div>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                    {services.map((service) => {
                      const isSelected = formData.selectedServices.includes(service.id);
                      const isExpanded = expandedService === service.id;
                      
                      return (
                        <div
                          key={service.id}
                          className={`rounded-xl border-2 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          {/* Main Row */}
                          <div
                            role="button"
                            tabIndex={service.id === "umzug" ? -1 : 0}
                            onClick={() => toggleService(service.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                toggleService(service.id);
                              }
                            }}
                            className={`w-full flex items-center gap-2.5 p-2.5 text-left cursor-pointer ${
                              service.id === "umzug" ? "cursor-default" : ""
                            }`}
                            aria-disabled={service.id === "umzug"}
                          >
                            <div
                              className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 ${
                                isSelected
                                  ? "bg-primary border-primary"
                                  : "border-border"
                              }`}
                            >
                              {isSelected && (
                                <CheckCircle className="w-3 h-3 text-primary-foreground" />
                              )}
                            </div>

                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? "bg-primary/20" : "bg-muted"
                              }`}
                            >
                              {service.icon}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <p className="text-xs font-semibold truncate">{service.label}</p>
                                {(service as any).highlight && (
                                  <span className="text-[8px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold shrink-0 animate-pulse">
                                    💡 Tipp
                                  </span>
                                )}
                                {service.popular && !(service as any).highlight && (
                                  <span className="text-[8px] bg-secondary text-secondary-foreground px-1 py-0.5 rounded-full font-medium shrink-0">
                                    Beliebt
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {service.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className={`text-[10px] font-medium ${(service as any).highlight ? 'text-secondary' : 'text-primary'}`}>
                                {service.priceRange}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedService(isExpanded ? null : service.id);
                                }}
                                className={`p-0.5 rounded-full transition-colors ${isExpanded ? 'bg-primary/20' : 'hover:bg-muted'}`}
                                aria-label={isExpanded ? "Details ausblenden" : "Details anzeigen"}
                              >
                                {isExpanded ? (
                                  <Minus className="w-3.5 h-3.5 text-primary" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5 text-muted-foreground" />
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Expandable Details */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="px-3 pb-3 pt-1 border-t border-border/50 mx-2.5">
                                  <div className="flex items-start gap-1.5 mb-2 mt-1.5">
                                    <Info className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                      {service.details}
                                    </p>
                                  </div>
                                  
                                  <div className="space-y-1">
                                    {service.benefits.map((benefit, i) => (
                                      <div key={i} className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
                                        <CheckCircle className="w-2.5 h-2.5 text-green-500 shrink-0 mt-0.5" />
                                        <span>{benefit}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Package Savings Card */}
                  <PackageSavingsCard
                    services={services}
                    selectedServices={formData.selectedServices}
                    onSelectPackage={(serviceIds) => updateFormData("selectedServices", serviceIds)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Company Ranking with Filters, Comparison */}
          {currentStep === 3 && (
            <motion.div
              key="step3-companies"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {/* Header */}
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium mb-2">
                  <Sparkles className="w-3 h-3" />
                  Firmen vergleichen
                </span>
                <h3 className="text-lg font-bold">
                  Wählen Sie <span className="text-secondary">mind. 3 Firmen</span>
                </h3>
                <p className="text-xs text-muted-foreground">
                  Mehr Offerten = bessere Vergleichsmöglichkeit
                </p>
              </div>

              {/* Company Comparison Table with Filters */}
              <CompanyComparisonTable
                companies={matchingCompanies}
                selectedCompanies={formData.selectedCompanies}
                selectedServices={formData.selectedServices}
                serviceIdToCompanyService={serviceIdToCompanyService}
                apartmentSize={formData.apartmentSize}
                onToggleCompany={toggleCompany}
                getCompanyPrice={getCompanyPrice}
              />
            </motion.div>
          )}

          {/* Step 4: Contact */}
          {currentStep === 4 && (
            <motion.div
              key="step4-contact"
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
                  Wie möchten Sie Offerten erhalten?
                </p>
              </div>

              {/* Submit Options - Direct vs Publish vs Both */}
              <SubmitOptionsCard
                value={formData.submitOption}
                onChange={(v) => updateFormData("submitOption", v)}
                selectedCompaniesCount={formData.selectedCompanies.length}
                estimatedPrice={getPriceEstimate(formData.apartmentSize, formData.selectedServices)}
              />

              <div className="space-y-3">
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
                  inputMode="tel"
                  showSuccessIcon={false}
                />

                {/* Privacy */}
                <div className="flex items-start gap-2.5">
                  <Checkbox
                    id="privacy"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                    className="mt-0.5"
                  />
                  <label htmlFor="privacy" className="text-[10px] text-muted-foreground cursor-pointer leading-relaxed">
                    Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> und 
                    bin einverstanden, dass meine Daten zur Offerteneinholung weitergegeben werden. <span className="text-green-600 dark:text-green-400 font-medium">Keine Werbeanrufe.</span>
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
              className="h-11 rounded-xl px-4"
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
              className="flex-1 h-11 rounded-xl bg-primary hover:bg-primary-hover"
            >
              {currentStep === 3 ? `Mit ${formData.selectedCompanies.length || "0"} Firmen weiter` : "Weiter"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="flex-1 h-12 rounded-xl bg-secondary hover:bg-secondary/90 font-bold text-base shadow-cta"
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
              className="w-full h-10 rounded-xl border-primary/30 hover:bg-primary/5 font-medium text-sm"
              onClick={() => navigate('/umzugsrechner?tab=ai')}
            >
              <Video className="w-4 h-4 mr-2 text-primary" />
              Video hochladen & KI berechnet
            </Button>
          </>
        )}
      </div>

      {/* Trust Footer */}
      <div className="bg-muted/30 px-6 py-2.5 border-t border-border">
        <div className="flex flex-wrap justify-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <TrendingDown className="w-3 h-3 text-green-500" />
            Bis 40% sparen
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <CheckCircle className="w-3 h-3 text-green-500" />
            100% kostenlos
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <Shield className="w-3 h-3 text-primary" />
            SSL verschlüsselt
          </div>
        </div>
      </div>
    </div>
  );
});
