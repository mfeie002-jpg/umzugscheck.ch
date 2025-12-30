/**
 * MultiStepCalculatorV1b - Optimized calculator with ChatGPT V1 Analysis improvements
 * 
 * Improvements implemented:
 * 1. Marketing blocks condensed (in parent page)
 * 2. Service selection simplified - show only popular first
 * 3. PLZ autocomplete enhanced with more cities
 * 4. Sticky CTA on mobile (already present, enhanced)
 * 5. Company pre-selection explanation added
 * 6. Tooltips for offer methods (info icons)
 * 7. Visual CTA differentiation (primary blue, secondary gray)
 * 8. Reduced company card info density
 * 9. Real-time contact validation (using ValidatedInput)
 * 10. Visual selection confirmation in Step 1 (checkmark + hint)
 */

import { useState, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, Video, 
  MapPin, TrendingDown, Package, Sparkles, Brush, Trash2, Warehouse,
  Plus, Minus, Info, Clock, User, Mail, Phone, Calendar,
  AlertCircle, HelpCircle
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
import { MoveTypeInitialStepV1b } from "./MoveTypeInitialStepV1b";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";
import { getCantonFromZip } from "@/lib/zip-to-canton";
import { getCantonConfig } from "@/lib/cantonConfigMap";
import { CompanyComparisonTableV1b } from "./CompanyComparisonTableV1b";
import { PackageSavingsCard } from "@/components/homepage/PackageSavingsCard";
import { SubmitOptionsCardV1b } from "./SubmitOptionsCardV1b";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Storage key for form persistence
const FORM_STORAGE_KEY = "umzugscheck_form_data_v1b";

// Enhanced Swiss postal codes - ChatGPT Rec #3
const swissPostalCodes = [
  { code: "8001", city: "Zürich" },
  { code: "8002", city: "Zürich" },
  { code: "8003", city: "Zürich" },
  { code: "8004", city: "Zürich" },
  { code: "8005", city: "Zürich" },
  { code: "8006", city: "Zürich" },
  { code: "8008", city: "Zürich" },
  { code: "8032", city: "Zürich" },
  { code: "8037", city: "Zürich" },
  { code: "8038", city: "Zürich" },
  { code: "8041", city: "Zürich" },
  { code: "8044", city: "Zürich" },
  { code: "8045", city: "Zürich" },
  { code: "8046", city: "Zürich" },
  { code: "8047", city: "Zürich" },
  { code: "8048", city: "Zürich" },
  { code: "8049", city: "Zürich" },
  { code: "8050", city: "Zürich" },
  { code: "8051", city: "Zürich" },
  { code: "8052", city: "Zürich" },
  { code: "8053", city: "Zürich" },
  { code: "8055", city: "Zürich" },
  { code: "8057", city: "Zürich" },
  { code: "8064", city: "Zürich" },
  { code: "3000", city: "Bern" },
  { code: "3001", city: "Bern" },
  { code: "3004", city: "Bern" },
  { code: "3005", city: "Bern" },
  { code: "3006", city: "Bern" },
  { code: "3007", city: "Bern" },
  { code: "3008", city: "Bern" },
  { code: "3010", city: "Bern" },
  { code: "3011", city: "Bern" },
  { code: "3012", city: "Bern" },
  { code: "3013", city: "Bern" },
  { code: "3014", city: "Bern" },
  { code: "3015", city: "Bern" },
  { code: "3018", city: "Bern" },
  { code: "3027", city: "Bern" },
  { code: "4000", city: "Basel" },
  { code: "4001", city: "Basel" },
  { code: "4051", city: "Basel" },
  { code: "4052", city: "Basel" },
  { code: "4053", city: "Basel" },
  { code: "4054", city: "Basel" },
  { code: "4055", city: "Basel" },
  { code: "4056", city: "Basel" },
  { code: "4057", city: "Basel" },
  { code: "4058", city: "Basel" },
  { code: "6000", city: "Luzern" },
  { code: "6002", city: "Luzern" },
  { code: "6003", city: "Luzern" },
  { code: "6004", city: "Luzern" },
  { code: "6005", city: "Luzern" },
  { code: "6006", city: "Luzern" },
  { code: "6010", city: "Luzern" },
  { code: "6014", city: "Luzern" },
  { code: "6015", city: "Luzern" },
  { code: "1200", city: "Genève" },
  { code: "1201", city: "Genève" },
  { code: "1202", city: "Genève" },
  { code: "1203", city: "Genève" },
  { code: "1204", city: "Genève" },
  { code: "1205", city: "Genève" },
  { code: "1206", city: "Genève" },
  { code: "1207", city: "Genève" },
  { code: "1208", city: "Genève" },
  { code: "1209", city: "Genève" },
  { code: "9000", city: "St. Gallen" },
  { code: "9001", city: "St. Gallen" },
  { code: "9008", city: "St. Gallen" },
  { code: "9010", city: "St. Gallen" },
  { code: "9011", city: "St. Gallen" },
  { code: "9012", city: "St. Gallen" },
  { code: "9014", city: "St. Gallen" },
  { code: "9015", city: "St. Gallen" },
  { code: "9016", city: "St. Gallen" },
  { code: "8400", city: "Winterthur" },
  { code: "8401", city: "Winterthur" },
  { code: "8402", city: "Winterthur" },
  { code: "8404", city: "Winterthur" },
  { code: "8405", city: "Winterthur" },
  { code: "8406", city: "Winterthur" },
  { code: "8408", city: "Winterthur" },
  { code: "8409", city: "Winterthur" },
  { code: "8410", city: "Winterthur" },
  { code: "5000", city: "Aarau" },
  { code: "5001", city: "Aarau" },
  { code: "5004", city: "Aarau" },
  { code: "6300", city: "Zug" },
  { code: "6301", city: "Zug" },
  { code: "6302", city: "Zug" },
  { code: "6303", city: "Zug" },
  { code: "6312", city: "Steinhausen" },
  { code: "6330", city: "Cham" },
  { code: "6331", city: "Hünenberg" },
  { code: "6332", city: "Hagendorn" },
  { code: "6340", city: "Baar" },
  { code: "6343", city: "Rotkreuz" },
];

// Services with detailed info
const services = [
  { 
    id: "umzug", 
    label: "Umzug (Basis)", 
    description: "Ihr kompletter Umzug: Transport aller Möbel & Gegenstände.",
    priceRange: "Inkl.",
    details: "Der Basis-Umzugsservice umfasst den kompletten Transport Ihrer Einrichtung.",
    benefits: ["Erfahrene 2-3 Mann Teams", "Schutzverpackung", "Versicherter Transport"],
    icon: <Package className="w-4 h-4" />,
    priceAdd: 0,
    popular: true,
    default: true,
  },
  { 
    id: "einpacken", 
    label: "Einpack-Service", 
    description: "Wir packen alles bruchsicher für Sie ein.",
    priceRange: "+CHF 300–500",
    details: "Professionelles Einpacken aller Gegenstände in Kartons.",
    benefits: ["Spart 1–2 Tage Arbeit", "Bruchsicheres Verpacken", "Material inklusive"],
    icon: <Package className="w-4 h-4" />,
    priceAdd: 400,
    popular: true,
    highlight: true,
  },
  { 
    id: "auspacken", 
    label: "Auspack-Service", 
    description: "Sofort einzugsbereit am neuen Ort.",
    priceRange: "+CHF 200–400",
    details: "Wir packen alle Kartons am neuen Ort aus.",
    benefits: ["Sofort einzugsbereit", "Kartonentsorgung inklusive"],
    icon: <Sparkles className="w-4 h-4" />,
    priceAdd: 300,
    popular: true,
    highlight: true,
  },
  { 
    id: "reinigung", 
    label: "Endreinigung", 
    description: "Abgabereinigung mit Abnahmegarantie.",
    priceRange: "+CHF 250–450",
    details: "Professionelle Endreinigung nach Schweizer Standard.",
    benefits: ["Abnahmegarantie", "Alle Räume inkl. Küche & Bad"],
    icon: <Brush className="w-4 h-4" />,
    priceAdd: 350,
    popular: true,
  },
  { 
    id: "entsorgung", 
    label: "Entsorgung", 
    description: "Alte Möbel, Sperrmüll fachgerecht entsorgen.",
    priceRange: "+CHF 150–300",
    details: "Fachgerechte Entsorgung von Sperrmüll.",
    benefits: ["Umweltgerechte Entsorgung", "Keine Selbstfahrt nötig"],
    icon: <Trash2 className="w-4 h-4" />,
    priceAdd: 200,
    popular: false,
  },
  { 
    id: "lagerung", 
    label: "Zwischenlagerung", 
    description: "Sichere Lagerung Ihrer Möbel.",
    priceRange: "+CHF 100–200/Mt",
    details: "Sichere, klimatisierte Lagerung.",
    benefits: ["Klimatisierte Räume", "24/7 Überwachung"],
    icon: <Warehouse className="w-4 h-4" />,
    priceAdd: 150,
    popular: false,
  },
];

// Price estimation
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

// ServiceCard component - ChatGPT Rec #2: Simplified
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
          ? "border-primary bg-primary/5"
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
        className={`w-full flex items-center gap-2.5 p-3 text-left cursor-pointer ${
          service.id === "umzug" ? "cursor-default" : ""
        }`}
        aria-disabled={service.id === "umzug"}
      >
        {/* Larger checkbox - ChatGPT Rec #10 */}
        <div
          className={`w-5 h-5 rounded flex items-center justify-center border-2 shrink-0 ${
            isSelected
              ? "bg-primary border-primary"
              : "border-border"
          }`}
        >
          {isSelected && (
            <CheckCircle className="w-4 h-4 text-primary-foreground" />
          )}
        </div>

        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            isSelected ? "bg-primary/20" : "bg-muted"
          }`}
        >
          {service.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-semibold truncate">{service.label}</p>
            {(service as any).highlight && (
              <span className="text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 px-1.5 py-0.5 rounded-full font-bold shrink-0">
                💡 Tipp
              </span>
            )}
            {service.popular && !(service as any).highlight && (
              <span className="text-[9px] bg-secondary/20 text-secondary px-1.5 py-0.5 rounded-full font-medium shrink-0">
                Beliebt
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {service.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium ${(service as any).highlight ? 'text-secondary' : 'text-primary'}`}>
            {service.priceRange}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            className={`p-1 rounded-full transition-colors ${isExpanded ? 'bg-primary/20' : 'hover:bg-muted'}`}
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
            <div className="px-4 pb-3 pt-1 border-t border-border/50 mx-3">
              <div className="flex items-start gap-2 mb-2 mt-2">
                <Info className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {service.details}
                </p>
              </div>
              
              <div className="space-y-1.5">
                {service.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="w-3 h-3 text-green-500 shrink-0 mt-0.5" />
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

// Room size options
const roomSizes = [
  { value: "studio", label: "Studio", sublabel: "1 Zimmer", icon: "🏠" },
  { value: "2-2.5", label: "2–2.5 Zi.", sublabel: "50-65m²", icon: "🏠" },
  { value: "3-3.5", label: "3–3.5 Zi.", sublabel: "65-85m²", icon: "🏠" },
  { value: "4-4.5", label: "4–4.5 Zi.", sublabel: "85-110m²", icon: "🏡" },
  { value: "5+", label: "5+ Zi.", sublabel: "Haus", icon: "🏡" },
];

interface FormData {
  moveType: string;
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  selectedServices: string[];
  moveDate: string;
  flexibleDate: boolean;
  name: string;
  email: string;
  phone: string;
  useVideoAI: boolean;
  privacyAccepted: boolean;
  selectedCompanies: string[];
  submitOption: "direct" | "publish" | "both";
}

export const MultiStepCalculatorV1b = memo(function MultiStepCalculatorV1b() {
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
  const [showMoreServices, setShowMoreServices] = useState(false);
  
  const [formData, setFormData] = useState<FormData>(() => {
    if (captureParams.enabled) {
      const contact = getDefaultCaptureContact();
      return {
        moveType: "wohnung",
        fromLocation: "8048 Zürich",
        toLocation: "6332 Hagendorn",
        apartmentSize: "2-2.5",
        selectedServices: ["umzug", "einpacken"],
        moveDate: getTomorrowISODate(),
        flexibleDate: false,
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
          ...parsed,
          privacyAccepted: false,
          selectedCompanies: [],
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
      flexibleDate: false,
      name: "",
      email: "",
      phone: "",
      useVideoAI: false,
      privacyAccepted: false,
      selectedCompanies: [],
      submitOption: "both" as const,
    };
  });

  // Persist form data
  useEffect(() => {
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error("Error saving form data:", e);
    }
  }, [formData]);

  const { variant: submitVariant, trackConversion: trackSubmit } = useABTest('calculator_submit_v1b');
  
  const getSubmitButtonText = () => {
    switch (submitVariant) {
      case 'variant_a': return 'Jetzt Offerten erhalten';
      case 'variant_b': return 'Kostenlos Offerten anfordern';
      default: return 'Offerten anfordern';
    }
  };

  const totalSteps = 4;
  
  // Auto-select recommended companies
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

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.moveType !== "";
      case 2:
        return formData.fromLocation.trim() !== "" && 
               formData.toLocation.trim() !== "" && 
               formData.apartmentSize !== "" &&
               formData.selectedServices.length > 0 &&
               (formData.moveDate !== "" || formData.flexibleDate);
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
      ...(formData.flexibleDate && { flexibleDate: "true" }),
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
    <TooltipProvider>
      {/* Prevent horizontal overflow on mobile */}
      <div className="bg-card rounded-2xl border border-border shadow-premium overflow-hidden max-w-full">
        {/* Header with Progress - Enhanced contrast for active step */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 px-4 sm:px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Schritt {currentStep} von {totalSteps}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kostenlos & unverbindlich</span>
              <span className="sm:hidden">100% kostenlos</span>
            </div>
          </div>
          
          {/* Progress bar - Enhanced active step contrast */}
          <ol className="flex gap-1.5" role="list" aria-label="Fortschritt">
            {[
              { step: 1, label: "Typ" },
              { step: 2, label: "Details" },
              { step: 3, label: "Firmen" },
              { step: 4, label: "Kontakt" },
            ].map(({ step, label }) => (
              <li
                key={step}
                className={`h-2.5 flex-1 rounded-full transition-colors duration-300 ${
                  step === currentStep 
                    ? 'bg-primary ring-2 ring-primary/30 ring-offset-1'
                    : step < currentStep 
                      ? 'bg-primary/70' 
                      : 'bg-border'
                }`}
                role="listitem"
                aria-current={step === currentStep ? "step" : undefined}
                aria-label={`Schritt ${step}: ${label}`}
              />
            ))}
          </ol>
          
          {/* Step labels with enhanced active state */}
          <div className="flex justify-between mt-2 text-xs">
            {[
              { step: 1, label: "Typ" },
              { step: 2, label: "Details" },
              { step: 3, label: "Firmen" },
              { step: 4, label: "Kontakt" },
            ].map(({ step, label }) => (
              <span 
                key={step}
                className={`transition-colors ${
                  step === currentStep 
                    ? 'text-primary font-bold' 
                    : step < currentStep 
                      ? 'text-primary/70 font-medium'
                      : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Form Content */}
        {/* Form Content - Prevent horizontal overflow */}
        <div className="p-4 sm:p-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Move Type - ChatGPT Rec #10: Visual confirmation */}
            {currentStep === 1 && (
              <motion.div
                key="step1-movetype"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                <MoveTypeInitialStepV1b
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
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold">Ihr Umzug im Detail</h3>
                  <p className="text-sm text-muted-foreground">
                    Von wo nach wo? Was brauchen Sie?
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Location Inputs with enhanced autocomplete */}
                  <div className="grid grid-cols-2 gap-3">
                    <ValidatedInput
                      schema={postalCodeSchema}
                      value={formData.fromLocation}
                      onValueChange={(v) => updateFormData("fromLocation", v)}
                      label="Von"
                      icon={<MapPin className="w-4 h-4 text-primary" />}
                      placeholder="PLZ/Ort"
                      list="from-suggestions-v1b"
                      inputMode="text"
                      autoComplete="postal-code"
                    />
                    <ValidatedInput
                      schema={postalCodeSchema}
                      value={formData.toLocation}
                      onValueChange={(v) => updateFormData("toLocation", v)}
                      label="Nach"
                      icon={<MapPin className="w-4 h-4 text-secondary" />}
                      placeholder="PLZ/Ort"
                      list="to-suggestions-v1b"
                      inputMode="text"
                      autoComplete="postal-code"
                    />
                  </div>
                  <datalist id="from-suggestions-v1b">
                    {swissPostalCodes.map((p) => (
                      <option key={`from-${p.code}`} value={`${p.code} ${p.city}`} />
                    ))}
                  </datalist>
                  <datalist id="to-suggestions-v1b">
                    {swissPostalCodes.map((p) => (
                      <option key={`to-${p.code}`} value={`${p.code} ${p.city}`} />
                    ))}
                  </datalist>

                  {/* Room Size Selector - Simplified grid */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      🏠 Wohnungsgrösse
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {roomSizes.map((size) => (
                        <button
                          key={size.value}
                          type="button"
                          onClick={() => updateFormData("apartmentSize", size.value)}
                          className={`p-3 rounded-xl border-2 transition-all text-center ${
                            formData.apartmentSize === size.value
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="text-lg mb-1">{size.icon}</div>
                          <div className="text-xs font-semibold">{size.label}</div>
                          <div className="text-[10px] text-muted-foreground">{size.sublabel}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Estimate */}
                  {formData.apartmentSize && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-green-700 dark:text-green-400 font-medium">
                            Geschätzt
                          </p>
                          <p className="text-lg font-bold text-green-800 dark:text-green-300">
                            CHF {getPriceEstimate(formData.apartmentSize, formData.selectedServices).min.toLocaleString()}–{getPriceEstimate(formData.apartmentSize, formData.selectedServices).max.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <TrendingDown className="w-4 h-4" />
                          <span className="text-xs font-medium">bis 40% sparen</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Move Date with flexible option */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Umzugsdatum
                      {!formData.moveDate && !formData.flexibleDate && (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Pflichtfeld
                        </span>
                      )}
                    </label>
                    <Input
                      type="date"
                      value={formData.moveDate}
                      onChange={(e) => updateFormData("moveDate", e.target.value)}
                      className={`h-11 rounded-xl ${!formData.moveDate && !formData.flexibleDate ? 'border-amber-400' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                      disabled={formData.flexibleDate}
                    />
                    {/* Flexible date option */}
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="flexibleDate"
                        checked={formData.flexibleDate}
                        onCheckedChange={(checked) => {
                          updateFormData("flexibleDate", !!checked);
                          if (checked) updateFormData("moveDate", "");
                        }}
                        className="h-4 w-4"
                      />
                      <label htmlFor="flexibleDate" className="text-xs text-muted-foreground cursor-pointer">
                        Termin noch offen / flexibel
                      </label>
                    </div>
                  </div>

                  {/* KI Video-Analyzer - ChatGPT Rec #7: Different styling */}
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => updateFormData("useVideoAI", !formData.useVideoAI)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.useVideoAI
                        ? "border-secondary bg-secondary/10"
                        : "border-muted bg-muted/30 hover:border-muted-foreground/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        formData.useVideoAI ? "bg-secondary text-secondary-foreground" : "bg-muted"
                      }`}>
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold">🤖 KI Video-Analyse</p>
                          <span className="text-[9px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full font-medium">
                            NEU
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Filmen Sie Ihre Wohnung – KI erstellt das Inventar
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

                  {/* Services - ChatGPT Rec #2: Simplified */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Welche Leistungen brauchen Sie?</label>
                      <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Plus className="w-2.5 h-2.5" />
                        Details
                      </span>
                    </div>
                    
                    {/* Popular services */}
                    <div className="space-y-2">
                      {services.filter(s => s.popular).map((service) => {
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
                    
                    {/* Less popular services - collapsible */}
                    {services.filter(s => !s.popular).length > 0 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setShowMoreServices(!showMoreServices)}
                          className="w-full flex items-center justify-center gap-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showMoreServices ? (
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
                          {showMoreServices && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="space-y-2 overflow-hidden"
                            >
                              {services.filter(s => !s.popular).map((service) => {
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
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    )}

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

            {/* Step 3: Company Ranking - ChatGPT Rec #5, #8 */}
            {currentStep === 3 && (
              <motion.div
                key="step3-companies"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Header with pre-selection explanation */}
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
                  <p className="text-sm text-muted-foreground">
                    Empfohlen vorausgewählt – jederzeit änderbar
                  </p>
                  {/* ChatGPT Rec #5: Explain pre-selection criteria */}
                  <p className="text-xs text-muted-foreground/80 mt-1 italic">
                    💡 Empfohlen basierend auf Bewertungen, Verfügbarkeit & Nähe zu Ihrem Standort
                  </p>
                </div>

                {/* Selection status */}
                {formData.selectedCompanies.length >= 3 && (
                  <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                      ✓ {formData.selectedCompanies.length} Firmen ausgewählt – Vergleich bereit!
                    </span>
                  </div>
                )}

                {/* Company Comparison Table - ChatGPT Rec #8: Reduced info density */}
                <CompanyComparisonTableV1b
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

            {/* Step 4: Contact - ChatGPT Rec #6, #9 */}
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
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    Wie möchten Sie Offerten erhalten?
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p className="text-sm">Wählen Sie, ob Sie direkt von den ausgewählten Firmen kontaktiert werden möchten, oder ob Sie eine öffentliche Ausschreibung erstellen wollen.</p>
                      </TooltipContent>
                    </Tooltip>
                  </p>
                </div>

                {/* Submit Options - ChatGPT Rec #6: Tooltips added */}
                <SubmitOptionsCardV1b
                  value={formData.submitOption}
                  onChange={(v) => updateFormData("submitOption", v)}
                  selectedCompaniesCount={formData.selectedCompanies.length}
                  estimatedPrice={getPriceEstimate(formData.apartmentSize, formData.selectedServices)}
                />

                {/* Contact form - ChatGPT Rec #9: Real-time validation */}
                <div className="space-y-3">
                  <ValidatedInput
                    schema={nameSchema}
                    value={formData.name}
                    onValueChange={(v) => updateFormData("name", v)}
                    label="Name *"
                    icon={<User className="w-4 h-4 text-primary" />}
                    placeholder="Ihr Name"
                    autoComplete="name"
                  />

                  <ValidatedInput
                    schema={emailSchema}
                    value={formData.email}
                    onValueChange={(v) => updateFormData("email", v)}
                    label="E-Mail *"
                    icon={<Mail className="w-4 h-4 text-primary" />}
                    placeholder="ihre@email.ch"
                    type="email"
                    autoComplete="email"
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
                    autoComplete="tel"
                    showSuccessIcon={false}
                  />

                  {/* Privacy */}
                  <div className="flex items-start gap-2.5">
                    <Checkbox
                      id="privacy-v1b"
                      checked={formData.privacyAccepted}
                      onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                      className="mt-0.5 h-5 w-5"
                    />
                    <label htmlFor="privacy-v1b" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                      Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> und 
                      bin einverstanden, dass meine Daten zur Offerteneinholung weitergegeben werden.
                    </label>
                  </div>
                  
                  {/* Trust reassurance */}
                  <div className="flex items-start gap-2 mt-2 p-3 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
                    <div className="text-xs">
                      <span className="font-medium text-green-700 dark:text-green-300">Ihre Daten sind sicher:</span>{" "}
                      <span className="text-green-600 dark:text-green-400">
                        Keine Werbeanrufe · Nur an ausgewählte Firmen · 100% unverbindlich
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons - ChatGPT Rec #4: Sticky on mobile */}
          <div className="flex gap-3 mt-6 md:relative md:bg-transparent md:shadow-none md:border-0 md:p-0
                          sticky bottom-0 left-0 right-0 -mx-6 px-6 py-4 
                          bg-card/98 backdrop-blur-lg border-t border-border/50 
                          shadow-[0_-4px_20px_rgba(0,0,0,0.08)]
                          pb-[calc(1rem+env(safe-area-inset-bottom))]
                          md:pb-0 md:shadow-none z-30">
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
                className="flex-1 h-12 md:h-11 rounded-xl bg-primary hover:bg-primary-hover text-base font-semibold"
              >
                {currentStep === 3 
                  ? `Mit ${formData.selectedCompanies.length || "0"} Firmen weiter` 
                  : "Weiter"
                }
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
          
          {/* Trust badges - Consistent across desktop and mobile */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-green-500" />
              Kein Spam
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-green-500" />
              100% kostenlos
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-primary" />
              Antwort in 24h
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-primary" />
              SSL verschlüsselt
            </span>
          </div>

          {/* Alternative Video CTA - ChatGPT Rec #7: Different color */}
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
                variant="ghost"
                className="w-full h-11 rounded-xl border border-muted bg-muted/20 hover:bg-muted/50 font-medium text-sm text-muted-foreground hover:text-foreground"
                onClick={() => navigate('/umzugsrechner?tab=ai')}
              >
                <Video className="w-4 h-4 mr-2" />
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
        
        <CaptureReadySentinel 
          step={currentStep} 
          flow="v1b" 
          isReady={true}
          metadata={{ variant: "v1b-chatgpt" }}
        />
      </div>
    </TooltipProvider>
  );
});
