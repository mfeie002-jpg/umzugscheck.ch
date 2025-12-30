/**
 * V1 Version - MultiStepCalculator with ChatGPT UX improvements
 * 
 * Improvements:
 * - #5: Pre-selection explanation for companies
 * - #7: Ghost variant for secondary video CTA
 * - Uses V1-specific MoveTypeInitialStepV1 and SubmitOptionsCardV1
 */

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
import { CaptureReadySentinel } from "@/components/CaptureReadySentinel";
import { VisualRoomSelector } from "@/components/homepage/VisualRoomSelector";
import { MoveTypeInitialStepV1 } from "./MoveTypeInitialStepV1";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getCantonFromZip } from "@/lib/zip-to-canton";
import { getCantonConfig } from "@/lib/cantonConfigMap";
import { CompanyComparisonTable } from "@/components/homepage/CompanyComparisonTable";
import { PackageSavingsCard } from "@/components/homepage/PackageSavingsCard";
import { SubmitOptionsCardV1 } from "./SubmitOptionsCardV1";

// Storage key for form persistence
const FORM_STORAGE_KEY = "umzugscheck_form_data_v1";

// Extended Swiss postal codes for better autocomplete (ChatGPT #1)
const swissPostalCodes = [
  // Zürich area
  { code: "8001", city: "Zürich" },
  { code: "8002", city: "Zürich" },
  { code: "8003", city: "Zürich" },
  { code: "8004", city: "Zürich" },
  { code: "8005", city: "Zürich" },
  { code: "8006", city: "Zürich" },
  { code: "8008", city: "Zürich" },
  { code: "8032", city: "Zürich" },
  { code: "8037", city: "Zürich" },
  { code: "8045", city: "Zürich" },
  { code: "8048", city: "Zürich" },
  { code: "8055", city: "Zürich" },
  { code: "8057", city: "Zürich" },
  // Bern area
  { code: "3000", city: "Bern" },
  { code: "3011", city: "Bern" },
  { code: "3012", city: "Bern" },
  { code: "3013", city: "Bern" },
  { code: "3014", city: "Bern" },
  { code: "3018", city: "Bern" },
  // Basel area
  { code: "4000", city: "Basel" },
  { code: "4001", city: "Basel" },
  { code: "4051", city: "Basel" },
  { code: "4052", city: "Basel" },
  { code: "4053", city: "Basel" },
  { code: "4055", city: "Basel" },
  // Luzern
  { code: "6000", city: "Luzern" },
  { code: "6003", city: "Luzern" },
  { code: "6004", city: "Luzern" },
  { code: "6005", city: "Luzern" },
  // Geneva
  { code: "1200", city: "Genève" },
  { code: "1201", city: "Genève" },
  { code: "1202", city: "Genève" },
  { code: "1203", city: "Genève" },
  { code: "1204", city: "Genève" },
  { code: "1205", city: "Genève" },
  // Lausanne
  { code: "1000", city: "Lausanne" },
  { code: "1003", city: "Lausanne" },
  { code: "1004", city: "Lausanne" },
  { code: "1005", city: "Lausanne" },
  // Other major cities
  { code: "9000", city: "St. Gallen" },
  { code: "9001", city: "St. Gallen" },
  { code: "8400", city: "Winterthur" },
  { code: "8401", city: "Winterthur" },
  { code: "5000", city: "Aarau" },
  { code: "5400", city: "Baden" },
  { code: "6900", city: "Lugano" },
  { code: "7000", city: "Chur" },
  { code: "2000", city: "Neuchâtel" },
  { code: "1700", city: "Fribourg" },
  { code: "8200", city: "Schaffhausen" },
  { code: "4600", city: "Olten" },
  { code: "2500", city: "Biel/Bienne" },
  { code: "3600", city: "Thun" },
  { code: "8500", city: "Frauenfeld" },
  { code: "8600", city: "Dübendorf" },
  { code: "8700", city: "Küsnacht" },
  { code: "8800", city: "Thalwil" },
  { code: "8810", city: "Horgen" },
  { code: "8820", city: "Wädenswil" },
  { code: "8610", city: "Uster" },
];

// Enhanced services with detailed info
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
    bookingPercent: 100,
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
    bookingPercent: 73,
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
    bookingPercent: 52,
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
    bookingPercent: 45,
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
    bookingPercent: 28,
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
    bookingPercent: 12,
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

// ServiceCard component
interface ServiceCardProps {
  service: typeof services[0];
  isSelected: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
}

function ServiceCard({ service, isSelected, isExpanded, onToggle, onExpand }: ServiceCardProps) {
  return (
    <div
      className={`rounded-xl border-2 transition-all ${
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-border hover:border-primary/30"
      }`}
    >
      <div
        role="button"
        tabIndex={service.id === "umzug" ? -1 : 0}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        // Enhanced: min-h-[60px] for better touch targets, improved padding
        className={`w-full flex items-center gap-3 p-3 sm:p-3.5 text-left cursor-pointer min-h-[60px] touch-manipulation active:bg-muted/30 ${
          service.id === "umzug" ? "cursor-default" : ""
        }`}
        aria-disabled={service.id === "umzug"}
      >
        {/* Enhanced: Larger checkbox for touch targets (24px) */}
        <div
          className={`w-6 h-6 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
            isSelected ? "bg-primary border-primary scale-105" : "border-border"
          }`}
        >
          {isSelected && <CheckCircle className="w-4 h-4 text-primary-foreground" />}
        </div>

        {/* Enhanced: Larger icon container (36px) */}
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            isSelected ? "bg-primary/20" : "bg-muted"
          }`}
        >
          {service.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Enhanced: Larger font (14px) for better readability */}
            <p className="text-sm font-semibold truncate">{service.label}</p>
            {(service as any).highlight && (
              <span className="text-[10px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold shrink-0 animate-pulse">
                💡 Tipp
              </span>
            )}
            {service.popular && !(service as any).highlight && (
              <span className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full font-medium shrink-0">
                Beliebt
              </span>
            )}
          </div>
          {/* Enhanced: Larger description (12px) for better readability */}
          <p className="text-xs text-muted-foreground truncate">
            {service.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium ${(service as any).highlight ? 'text-secondary' : 'text-primary'}`}>
            {service.priceRange}
          </span>
          {/* Enhanced: Larger expand button for touch targets (32px) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className={`p-1.5 rounded-full transition-colors touch-manipulation ${isExpanded ? 'bg-primary/20' : 'hover:bg-muted active:bg-muted'}`}
            aria-label={isExpanded ? "Details ausblenden" : "Details anzeigen"}
          >
            {isExpanded ? (
              <Minus className="w-4 h-4 text-primary" />
            ) : (
              <Plus className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

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
}

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

export const MultiStepCalculatorV1 = memo(function MultiStepCalculatorV1() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const captureParams = getUcCaptureParams(location.search);
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (captureParams.enabled && captureParams.step) {
      return captureParams.step;
    }
    return 1;
  });
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const [didAutoAdvance, setDidAutoAdvance] = useState(false);
  
  const [formData, setFormData] = useState<FormData>(() => {
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
      selectedServices: ["umzug"],
      moveDate: "",
      name: "",
      email: "",
      phone: "",
      useVideoAI: false,
      privacyAccepted: false,
      selectedCompanies: [],
      // Issue #6: "Beides" als Default vorausgewählt (beste Wahl)
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
        selectedServices: formData.selectedServices,
        moveDate: formData.moveDate,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        useVideoAI: formData.useVideoAI,
      }));
    } catch (e) {
      console.error("Error saving form data:", e);
    }
  }, [formData]);

  const { variant: submitVariant, trackConversion: trackSubmit } = useABTest('calculator_submit');
  
  const getSubmitButtonText = () => {
    switch (submitVariant) {
      case 'variant_a': return 'Jetzt Offerten erhalten';
      case 'variant_b': return 'Kostenlos Offerten anfordern';
      default: return 'Offerten erhalten (kostenlos)';
    }
  };

  const totalSteps = 4;
  
  // Map service IDs to company services
  const serviceIdToCompanyService: Record<string, string[]> = {
    "umzug": ["Umzug", "Firmenumzug"],
    "einpacken": ["Packservice"],
    "auspacken": ["Packservice"],
    "reinigung": ["Reinigung"],
    "entsorgung": ["Entsorgung"],
    "lagerung": ["Lagerung"],
  };

  // Get matching companies
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
    
    const selectedServiceNames = formData.selectedServices
      .filter(s => s !== "umzug")
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
    
    return [...companies].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.rating - a.rating;
    }).slice(0, 12);
  };

  // Auto-select recommended companies when entering step 3
  useEffect(() => {
    if (currentStep === 3 && formData.selectedCompanies.length === 0) {
      const companies = getMatchingCompanies();
      const recommended = companies
        .filter(c => c.is_featured || c.rating >= 4.5)
        .slice(0, 3)
        .map(c => c.id);
      
      if (recommended.length < 2) {
        const additional = companies
          .filter(c => !recommended.includes(c.id))
          .slice(0, 3 - recommended.length)
          .map(c => c.id);
        recommended.push(...additional);
      }
      
      if (recommended.length > 0) {
        setFormData(prev => ({
          ...prev,
          selectedCompanies: recommended
        }));
      }
    }
  }, [currentStep]);

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

  const toggleCompany = (companyId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCompanies: prev.selectedCompanies.includes(companyId)
        ? prev.selectedCompanies.filter(id => id !== companyId)
        : [...prev.selectedCompanies, companyId]
    }));
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
               formData.moveDate !== ""; // moveDate can be a date string or "flexible"
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
    localStorage.removeItem(FORM_STORAGE_KEY);
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
      {/* Issue #4, #7: Sticky Progress Header - bleibt beim Scrollen sichtbar */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 sm:px-6 py-4 border-b border-border sticky top-0 z-20">
        <div className="flex items-center justify-between mb-3">
          {/* Trust signal - nur EINMAL hier */}
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full shadow-sm min-h-[36px]">
            <Shield className="w-4 h-4" />
            <span>100% kostenlos</span>
          </div>
          {/* Issue #62: Clearer inactive step visibility */}
          <span className="text-sm font-bold text-foreground">
            Schritt {currentStep} von {totalSteps}
          </span>
        </div>
        
        {/* Issue #10: Verbesserte Progress-Leiste mit klarerem aktiven Schritt */}
        <div className="relative">
          <ol className="flex gap-2" role="list" aria-label="Fortschritt">
            {[
              { step: 1, label: "Typ" },
              { step: 2, label: "Details" },
              { step: 3, label: "Firmen" },
              { step: 4, label: "Kontakt" },
            ].map(({ step, label }) => (
              <li
                key={step}
                className={`h-3 flex-1 rounded-full transition-all duration-300 ${
                  step < currentStep 
                    ? 'bg-green-500' 
                    : step === currentStep 
                      ? 'bg-primary shadow-md ring-2 ring-primary/30' 
                      : 'bg-muted-foreground/20'
                }`}
                role="listitem"
                aria-current={step === currentStep ? "step" : undefined}
                aria-label={`Schritt ${step}: ${label}${step < currentStep ? " (abgeschlossen)" : step === currentStep ? " (aktuell)" : ""}`}
              />
            ))}
          </ol>
        </div>
        
        {/* Issue #10: Labels mit höherem Kontrast für aktiven Schritt */}
        <div className="flex justify-between mt-3">
          {[
            { step: 1, label: "Typ" },
            { step: 2, label: "Details" },
            { step: 3, label: "Firmen" },
            { step: 4, label: "Kontakt" },
          ].map(({ step, label }) => (
            <span 
              key={step}
              className={`flex items-center gap-1 transition-colors whitespace-nowrap ${
                step < currentStep 
                  ? 'text-green-600 dark:text-green-400 font-bold' 
                  : step === currentStep 
                    ? 'text-primary font-bold text-sm' 
                    : 'text-muted-foreground/60 font-medium'
              }`}
            >
              {step < currentStep && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
              <span className="text-xs sm:text-sm">{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Move Type - Using V1 component */}
          {currentStep === 1 && (
            <motion.div
              key="step1-movetype"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <MoveTypeInitialStepV1
                value={formData.moveType}
                onChange={(v) => {
                  updateFormData("moveType", v);
                  setTimeout(() => setCurrentStep(2), 300);
                }}
              />
            </motion.div>
          )}

          {/* Step 2: Location + Size + Services */}
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
              {/* Issue #38: Klare visuelle Hierarchie - Haupttitel grösser */}
              <div className="text-center mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-foreground">Ihr Umzug im Detail</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Von wo nach wo? Was brauchen Sie?
                </p>
              </div>

              <div className="space-y-3">
                {/* Location Inputs - ChatGPT #10: Mobile-freundliche Input mit Pattern */}
                <div className="grid grid-cols-2 gap-2">
                  <ValidatedInput
                    schema={postalCodeSchema}
                    value={formData.fromLocation}
                    onValueChange={(v) => updateFormData("fromLocation", v)}
                    label="Von"
                    icon={<MapPin className="w-4 h-4 text-primary" />}
                    placeholder="PLZ Ort"
                    list="from-suggestions-v1"
                    autoComplete="postal-code"
                  />
                  <ValidatedInput
                    schema={postalCodeSchema}
                    value={formData.toLocation}
                    onValueChange={(v) => updateFormData("toLocation", v)}
                    label="Nach"
                    icon={<MapPin className="w-4 h-4 text-secondary" />}
                    placeholder="PLZ Ort"
                    list="to-suggestions-v1"
                    autoComplete="postal-code"
                  />
                </div>
                <datalist id="from-suggestions-v1">
                  {swissPostalCodes.map((p) => (
                    <option key={`from-${p.code}`} value={`${p.code} ${p.city}`} />
                  ))}
                </datalist>
                <datalist id="to-suggestions-v1">
                  {swissPostalCodes.map((p) => (
                    <option key={`to-${p.code}`} value={`${p.code} ${p.city}`} />
                  ))}
                </datalist>

                {/* Room Size Selector */}
                <VisualRoomSelector
                  value={formData.apartmentSize}
                  onChange={(v) => updateFormData("apartmentSize", v)}
                />

                {/* Issue #13, #18, #25, #53: Enhanced price estimate - clearer CTA, NO overlap issues */}
                {formData.apartmentSize && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-700"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xs text-green-700 dark:text-green-400 font-medium uppercase tracking-wide mb-1">
                          Geschätzte Kosten
                        </p>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                          CHF {getPriceEstimate(formData.apartmentSize, formData.selectedServices).min.toLocaleString()}–{getPriceEstimate(formData.apartmentSize, formData.selectedServices).max.toLocaleString()}
                        </p>
                      </div>
                      {/* Issue #20: Prominentere Darstellung des Spar-Potenzials */}
                      <div className="flex items-center gap-2 text-sm sm:text-base text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-4 py-2.5 rounded-lg shrink-0 font-bold">
                        <TrendingDown className="w-5 h-5" />
                        <span>Bis 40% sparen!</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              {/* Issue #8, #17, #33, #57: Move Date - Swiss format, clear flexible option */}
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Umzugsdatum
                </label>
                
                {/* Issue #17, #30: Flexible option - clearer visual when selected */}
                <button
                  type="button"
                  onClick={() => updateFormData("moveDate", formData.moveDate === "flexible" ? "" : "flexible")}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all min-h-[60px] touch-manipulation ${
                    formData.moveDate === "flexible"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                      : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className={`w-6 h-6 rounded flex items-center justify-center border-2 shrink-0 ${
                    formData.moveDate === "flexible" ? "bg-green-500 border-green-500" : "border-muted-foreground/40"
                  }`}>
                    {formData.moveDate === "flexible" && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <span className="text-sm font-medium block">Termin noch offen / flexibel</span>
                    <span className="text-xs text-muted-foreground">💡 Erhöht Chance auf mehr Angebote</span>
                  </div>
                </button>

                {/* Issue #17: Date field HIDDEN when flexible is selected */}
                {formData.moveDate !== "flexible" && (
                  <div className="space-y-1">
                    <Input
                      type="date"
                      value={formData.moveDate}
                      onChange={(e) => updateFormData("moveDate", e.target.value)}
                      className={`h-14 rounded-xl text-base cursor-pointer ${!formData.moveDate ? 'border-amber-400 focus:border-primary' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                      placeholder="Datum wählen"
                    />
                    <p className="text-xs text-muted-foreground">Gewünschtes Datum (kann später geändert werden)</p>
                  </div>
                )}
              </div>

                {/* Issue #26, #37: KI Video-Analyzer mit klarer Nutzenargumentation */}
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => updateFormData("useVideoAI", !formData.useVideoAI)}
                  className={`p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[72px] touch-manipulation active:scale-[0.99] ${
                    formData.useVideoAI
                      ? "border-secondary bg-secondary/10"
                      : "border-dashed border-muted-foreground/30 hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      formData.useVideoAI ? "bg-secondary text-secondary-foreground" : "bg-muted"
                    }`}>
                      <Video className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold">KI Video-Analyse</p>
                        <span className="text-[9px] bg-secondary/80 text-secondary-foreground px-1.5 py-0.5 rounded font-medium shrink-0">
                          Optional
                        </span>
                      </div>
                      {/* Issue #26: Vorteile direkt sichtbar statt versteckt */}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        📱 Wohnung filmen → Genauere Preise
                      </p>
                      {/* Issue #26: Wichtigste Vorteile inline anzeigen */}
                      <div className="flex flex-wrap gap-2 mt-1.5 text-[10px]">
                        <span className="text-green-600 dark:text-green-400">✓ 30% genauere Schätzung</span>
                        <span className="text-green-600 dark:text-green-400">✓ Weniger Rückfragen</span>
                      </div>
                    </div>
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center border-2 shrink-0 ${
                        formData.useVideoAI ? "bg-secondary border-secondary" : "border-border"
                      }`}
                    >
                      {formData.useVideoAI && (
                        <CheckCircle className="w-4 h-4 text-secondary-foreground" />
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Issue #27, #38, #57: Services mit klarer visueller Hierarchie und prominenterem Details-Link */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-base font-semibold">Welche Leistungen brauchen Sie?</label>
                    <button
                      type="button"
                      onClick={() => setExpandedService(expandedService === "show-all" ? null : "show-all")}
                      className="text-xs text-primary hover:underline font-medium flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-primary/10 transition-colors min-h-[36px] touch-manipulation"
                    >
                      <Info className="w-3.5 h-3.5" />
                      Details
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {services.filter(s => s.popular || s.id === "umzug").map((service) => {
                      const isSelected = formData.selectedServices.includes(service.id);
                      const isExpanded = expandedService === service.id;
                      
                      return (
                        <ServiceCard 
                          key={service.id}
                          service={service}
                          isSelected={isSelected}
                          isExpanded={isExpanded}
                          onToggle={() => toggleService(service.id)}
                          onExpand={() => setExpandedService(isExpanded ? null : service.id)}
                        />
                      );
                    })}
                  </div>
                  
                  {services.filter(s => !s.popular && s.id !== "umzug").length > 0 && (
                    <>
                      <button
                        type="button"
                        onClick={() => setExpandedService(expandedService === "more-services" ? null : "more-services")}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {expandedService === "more-services" ? (
                          <>
                            <Minus className="w-3.5 h-3.5" />
                            Weniger anzeigen
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            Weitere Services anzeigen
                          </>
                        )}
                      </button>
                      
                      <AnimatePresence>
                        {expandedService === "more-services" && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-2 overflow-hidden"
                          >
                            {services.filter(s => !s.popular && s.id !== "umzug").map((service) => {
                              const isSelected = formData.selectedServices.includes(service.id);
                              const isServiceExpanded = expandedService === service.id;
                              
                              return (
                                <ServiceCard 
                                  key={service.id}
                                  service={service}
                                  isSelected={isSelected}
                                  isExpanded={isServiceExpanded}
                                  onToggle={() => toggleService(service.id)}
                                  onExpand={() => setExpandedService(isServiceExpanded ? null : service.id)}
                                />
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  )}

                  <PackageSavingsCard
                    services={services}
                    selectedServices={formData.selectedServices}
                    onSelectPackage={(serviceIds) => updateFormData("selectedServices", serviceIds)}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Company Ranking */}
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
              {/* Issue #7: NO redundant step indicators - just clear header */}
              <div className="text-center">
                <h3 className="text-xl font-bold mb-1">
                  {formData.selectedCompanies.length >= 3 ? (
                    <span className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                      {formData.selectedCompanies.length} Firmen ausgewählt
                    </span>
                  ) : (
                    <>Wählen Sie <span className="text-secondary">mind. 3 Firmen</span></>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formData.selectedCompanies.length > 0 
                    ? "Empfohlen vorausgewählt – jederzeit änderbar"
                    : "Mehr Offerten = bessere Vergleichsmöglichkeit"
                  }
                </p>
              </div>

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

          {/* Step 4: Contact - Using V1 component */}
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
              {/* Issue #11, #21: Single header - NO duplicate headlines */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">Fast geschafft!</h3>
              </div>

              <SubmitOptionsCardV1
                value={formData.submitOption}
                onChange={(v) => updateFormData("submitOption", v)}
                selectedCompaniesCount={formData.selectedCompanies.length}
                estimatedPrice={getPriceEstimate(formData.apartmentSize, formData.selectedServices)}
              />

              {/* Issue #8: Entfernt - redundanter Pflichtfeld-Text */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-5 h-5 text-primary" />
                  <h4 className="text-base font-bold text-foreground">Ihre Kontaktdaten</h4>
                </div>
                
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

                {/* Issue #8: Telefon-Feld mit klarem "(optional)"-Hinweis */}
                <div className="space-y-1.5">
                  <ValidatedInput
                    schema={phoneSchema}
                    value={formData.phone}
                    onValueChange={(v) => updateFormData("phone", v)}
                    label="Telefon (optional)"
                    icon={<Phone className="w-4 h-4 text-primary" />}
                    placeholder="+41 79 123 45 67"
                    type="tel"
                    inputMode="tel"
                    showSuccessIcon={false}
                    autoComplete="tel"
                  />
                  <p className="text-[11px] text-muted-foreground ml-1">
                    Für schnellere Rückfragen · Format: +41 79 oder 079
                  </p>
                </div>

                {/* Issue #23, #34: Grössere Checkbox mit klarerer Pflichtfeld-Kennzeichnung */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-border/50">
                  <Checkbox
                    id="privacy-v1"
                    checked={formData.privacyAccepted}
                    onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                    className="mt-0.5 h-6 w-6 shrink-0"
                  />
                  <label htmlFor="privacy-v1" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                    {/* Issue #7: Konsistente Link-Formatierung */}
                    Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline font-medium">Datenschutzerklärung</a> und 
                    bin einverstanden, dass meine Daten zur Offerteneinholung weitergegeben werden.
                    <span className="text-red-500 font-bold ml-1">*</span>
                  </label>
                </div>
                
                {/* Issue #45: Harmonisierte Datenschutz-Info ohne Widerspruch */}
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>
                    <strong>Sicher:</strong> Keine Werbeanrufe · Nur an gewählte Firmen · Jederzeit widerrufbar
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Issue #9, #12: Enhanced Sticky Navigation - IMMER sichtbar, höherer z-index */}
        <div className="flex gap-3 sm:gap-4 mt-6 
                        md:relative md:bg-transparent md:shadow-none md:border-0 md:p-0
                        fixed bottom-0 left-0 right-0 px-4 sm:px-6 py-5 sm:py-6
                        bg-card/98 backdrop-blur-xl border-t-2 border-primary/30
                        shadow-[0_-12px_40px_rgba(0,0,0,0.25)]
                        pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1.5rem))]
                        md:pb-0 md:shadow-none z-[100]">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              // Issue #8, #17, #24: Min 48px Touch-Target
              className="h-12 sm:h-[52px] md:h-12 rounded-xl px-3 sm:px-5 min-w-[70px] sm:min-w-[90px] text-sm sm:text-base font-semibold shrink-0 touch-manipulation active:scale-[0.97]"
              aria-label="Zurück zum vorherigen Schritt"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
              <span className="hidden xs:inline">Zurück</span>
            </Button>
          )}
          
          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!canProceed()}
              // Issue #16, #21, #35: Klarer CTA mit dynamischem Text, min 48px touch target
              className={`flex-1 h-12 sm:h-[52px] md:h-12 rounded-xl text-sm sm:text-base font-bold shadow-lg touch-manipulation active:scale-[0.97] transition-all ${
                canProceed() 
                  ? 'bg-primary hover:bg-primary/90' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
              }`}
              aria-label={currentStep === 3 
                ? `Mit ${formData.selectedCompanies.length || "0"} Firmen Offerten anfordern` 
                : "Zum nächsten Schritt weiter"
              }
            >
              {currentStep === 1 && "Weiter"}
              {/* Issue #12: Kontextbezogenerer CTA-Text */}
              {currentStep === 2 && (canProceed() ? "Firmen suchen" : "Felder ausfüllen")}
              {currentStep === 3 && (
                formData.selectedCompanies.length >= 3 
                  ? <><span className="hidden xs:inline">Weiter zu </span>Kontakt</>
                  : `Noch ${3 - formData.selectedCompanies.length} wählen`
              )}
              {canProceed() && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5" />}
            </Button>
          ) : (
            <div className="flex-1 flex flex-col items-center gap-2">
              {/* Issue #9: Bestätigungstext vor Submit */}
              <p className="text-xs text-muted-foreground text-center hidden xs:block">
                Mit Klick senden Sie Ihre Anfrage · 100% kostenlos & unverbindlich
              </p>
              {/* Issue #21: Klarer Submit-Button sichtbar und prominent */}
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={!canProceed()}
                className={`w-full h-12 sm:h-[52px] md:h-12 rounded-xl font-bold text-sm sm:text-base shadow-xl touch-manipulation active:scale-[0.97] transition-all ${
                  canProceed()
                    ? 'bg-secondary hover:bg-secondary/90'
                    : 'bg-muted text-muted-foreground cursor-not-allowed opacity-60'
                }`}
                aria-label={canProceed() ? "Offerten-Anfrage jetzt absenden" : "Bitte alle Pflichtfelder ausfüllen"}
              >
                {canProceed() ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                    <span className="hidden xs:inline">{getSubmitButtonText()}</span>
                    <span className="xs:hidden">Offerten anfordern</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
                    <span className="hidden xs:inline">Pflichtfelder ausfüllen</span>
                    <span className="xs:hidden">Felder ausfüllen</span>
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        {/* Issue #40, #43, #57: Much larger spacer for fixed footer on Mobile - prevents ALL content overlap */}
        <div className="h-[160px] sm:h-[140px] md:hidden" aria-hidden="true" />
        
        {/* Desktop: Trust-Footer */}
        <div className="hidden md:flex items-center justify-center gap-6 pt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-green-500" />
            Kein Spam
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-green-500" />
            100% unverbindlich
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            Antwort in 24h
          </span>
          <span className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            200+ geprüfte Firmen
          </span>
        </div>

        {/* Issue #9, #43: Video option LESS prominent - secondary action below trust signals */}
        {currentStep === 1 && (
          <div className="mt-4 pt-3 border-t border-border/50">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors group min-h-[44px] touch-manipulation"
              onClick={() => navigate('/umzugsrechner?tab=ai')}
              aria-label="Alternativ: Video hochladen für KI-Berechnung"
            >
              <Video className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="underline-offset-2 group-hover:underline">oder Video hochladen</span>
            </button>
          </div>
        )}
      </div>

      {/* Issue #2, #4: Reduzierter Trust-Footer - nur essenzielle, nicht-redundante Infos */}
      <div className="bg-muted/40 px-4 py-3 border-t border-border">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
            Bis 40% sparen
          </span>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Users className="w-4 h-4 text-secondary" />
            200+ Firmen
          </span>
        </div>
      </div>
      
      {/* Capture-ready sentinel */}
      <CaptureReadySentinel 
        step={currentStep} 
        flow="v1" 
        isReady={true}
        metadata={{ variant: "v1-chatgpt-improvements" }}
      />
    </div>
  );
});
