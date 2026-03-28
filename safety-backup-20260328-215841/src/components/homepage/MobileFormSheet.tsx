import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, ArrowRight, ArrowLeft, Shield, CheckCircle, MapPin, Home, User, 
  Mail, Phone, Calendar, Video, Star, Clock, Award, TrendingDown,
  Package, Sparkles, Brush, Trash2, Warehouse, ChevronDown, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { DEMO_COMPANIES, getCompaniesByRegion } from "@/data/companies";

interface MobileFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const FORM_STORAGE_KEY = "umzugscheck_form_data";

const apartmentSizes = [
  { value: "studio", label: "Studio" },
  { value: "1-1.5", label: "1-1.5 Zi" },
  { value: "2-2.5", label: "2-2.5 Zi" },
  { value: "3-3.5", label: "3-3.5 Zi" },
  { value: "4-4.5", label: "4-4.5 Zi" },
  { value: "5+", label: "5+ Zi" },
];

const services = [
  { id: "umzug", label: "Umzug", icon: <Package className="w-3.5 h-3.5" />, price: "Inkl." },
  { id: "einpacken", label: "Einpacken", icon: <Package className="w-3.5 h-3.5" />, price: "+CHF 300-500" },
  { id: "auspacken", label: "Auspacken", icon: <Sparkles className="w-3.5 h-3.5" />, price: "+CHF 200-400" },
  { id: "reinigung", label: "Reinigung", icon: <Brush className="w-3.5 h-3.5" />, price: "+CHF 250-450" },
  { id: "entsorgung", label: "Entsorgung", icon: <Trash2 className="w-3.5 h-3.5" />, price: "+CHF 150-300" },
  { id: "lagerung", label: "Lagerung", icon: <Warehouse className="w-3.5 h-3.5" />, price: "+CHF 100/Mt" },
];

const getCompanyPrice = (size: string, priceLevel: string) => {
  const basePrices: Record<string, { min: number; max: number }> = {
    "studio": { min: 480, max: 680 },
    "1-1.5": { min: 580, max: 850 },
    "2-2.5": { min: 780, max: 1200 },
    "3-3.5": { min: 980, max: 1600 },
    "4-4.5": { min: 1400, max: 2200 },
    "5+": { min: 1800, max: 3200 },
  };
  
  const base = basePrices[size] || { min: 800, max: 1500 };
  const multiplier = priceLevel === "günstig" ? 0.85 : priceLevel === "premium" ? 1.25 : 1;
  
  return {
    min: Math.round(base.min * multiplier),
    max: Math.round(base.max * multiplier),
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
  privacyAccepted: boolean;
  selectedCompanies: string[];
}

export const MobileFormSheet = memo(function MobileFormSheet({ isOpen, onClose }: MobileFormSheetProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Load from localStorage
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const saved = localStorage.getItem(FORM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          fromLocation: parsed.fromLocation || "",
          toLocation: parsed.toLocation || "",
          apartmentSize: parsed.apartmentSize || "",
          selectedServices: parsed.selectedServices || ["umzug"],
          moveDate: parsed.moveDate || "",
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          privacyAccepted: false,
          selectedCompanies: [],
        };
      }
    } catch (e) {}
    return {
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
    };
  });

  // Persist form data
  useEffect(() => {
    if (!isOpen) return;
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({
        fromLocation: formData.fromLocation,
        toLocation: formData.toLocation,
        apartmentSize: formData.apartmentSize,
        selectedServices: formData.selectedServices,
        moveDate: formData.moveDate,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }));
    } catch (e) {}
  }, [formData, isOpen]);

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  const getMatchingCompanies = () => {
    const region = formData.fromLocation.split(" ").pop() || "";
    let companies = getCompaniesByRegion(region);
    if (companies.length < 5) companies = DEMO_COMPANIES;
    return [...companies].sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return b.rating - a.rating;
    }).slice(0, 6);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fromLocation.trim() !== "" && 
               formData.toLocation.trim() !== "" &&
               formData.apartmentSize !== "";
      case 2:
        return formData.selectedCompanies.length > 0;
      case 3:
        return formData.name.trim() !== "" && formData.email.trim() !== "" && formData.privacyAccepted;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    const params = new URLSearchParams({
      from: formData.fromLocation,
      to: formData.toLocation,
      size: formData.apartmentSize,
      services: formData.selectedServices.join(","),
      companies: formData.selectedCompanies.join(","),
      name: formData.name,
      email: formData.email,
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.moveDate && { date: formData.moveDate }),
    });
    localStorage.removeItem(FORM_STORAGE_KEY);
    navigate(`/umzugsofferten?${params.toString()}`);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

  const matchingCompanies = getMatchingCompanies();
  const totalSteps = 3; // Details → Companies → Contact

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[92vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-2 pb-1">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="px-4 pb-3 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] text-muted-foreground mb-1">Schritt {currentStep} von {totalSteps}</p>
                <div className="flex gap-1">
                  {[1, 2, 3].map(step => (
                    <div
                      key={step}
                      className={`h-1 w-8 rounded-full ${step <= currentStep ? 'bg-primary' : 'bg-border'}`}
                    />
                  ))}
                </div>
              </div>
              <button onClick={handleClose} className="p-2 -mr-2">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <AnimatePresence mode="wait">
                {/* Step 1: Details */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-3">
                      <h3 className="text-lg font-bold">Ihr Umzug</h3>
                      <p className="text-xs text-muted-foreground">Von wo nach wo?</p>
                    </div>

                    {/* Location */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-medium flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3 text-primary" /> Von
                        </label>
                        <Input
                          placeholder="PLZ/Ort"
                          value={formData.fromLocation}
                          onChange={(e) => updateFormData("fromLocation", e.target.value)}
                          className="h-10 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium flex items-center gap-1 mb-1">
                          <MapPin className="w-3 h-3 text-secondary" /> Nach
                        </label>
                        <Input
                          placeholder="PLZ/Ort"
                          value={formData.toLocation}
                          onChange={(e) => updateFormData("toLocation", e.target.value)}
                          className="h-10 rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    {/* Size */}
                    <div>
                      <label className="text-[10px] font-medium flex items-center gap-1 mb-1.5">
                        <Home className="w-3 h-3 text-muted-foreground" /> Grösse
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {apartmentSizes.map((size) => (
                          <button
                            key={size.value}
                            type="button"
                            onClick={() => updateFormData("apartmentSize", size.value)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                              formData.apartmentSize === size.value
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <label className="text-[10px] font-medium mb-1.5 block">Was brauchen Sie?</label>
                      <div className="grid grid-cols-2 gap-1.5">
                        {services.map(service => (
                          <button
                            key={service.id}
                            type="button"
                            onClick={() => toggleService(service.id)}
                            disabled={service.id === "umzug"}
                            className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all ${
                              formData.selectedServices.includes(service.id)
                                ? 'bg-primary/10 border-2 border-primary'
                                : 'bg-muted border-2 border-transparent'
                            }`}
                          >
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${
                              formData.selectedServices.includes(service.id) ? 'bg-primary/20' : 'bg-background'
                            }`}>
                              {service.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-medium truncate">{service.label}</p>
                              <p className="text-[8px] text-muted-foreground">{service.price}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Companies */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold">{matchingCompanies.length} passende Firmen</h3>
                      <p className="text-xs text-muted-foreground">Wählen Sie für Ihre Offerten</p>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex justify-around p-2 bg-green-50 dark:bg-green-950/30 rounded-xl">
                      <div className="text-center">
                        <p className="text-xs font-bold text-green-700 dark:text-green-400">bis 40%</p>
                        <p className="text-[8px] text-green-600/80">sparen</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-green-700 dark:text-green-400">24-48h</p>
                        <p className="text-[8px] text-green-600/80">Offerten</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-bold text-green-700 dark:text-green-400">100%</p>
                        <p className="text-[8px] text-green-600/80">gratis</p>
                      </div>
                    </div>

                    {/* Company List */}
                    <div className="space-y-2 max-h-[280px] overflow-y-auto">
                      {matchingCompanies.map((company, index) => {
                        const priceEst = getCompanyPrice(formData.apartmentSize, company.price_level);
                        const isSelected = formData.selectedCompanies.includes(company.id);

                        return (
                          <motion.button
                            key={company.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            type="button"
                            onClick={() => toggleCompany(company.id)}
                            className={`w-full p-2.5 rounded-xl border-2 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 ${
                                  isSelected ? "bg-primary border-primary" : "border-border"
                                }`}
                              >
                                {isSelected && <CheckCircle className="w-2.5 h-2.5 text-primary-foreground" />}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                  <span className="font-semibold text-xs truncate">{company.name}</span>
                                  {company.is_featured && (
                                    <Badge className="text-[7px] px-1 py-0 h-3 bg-primary/10 text-primary">Top</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                                  <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                                  <span>{company.rating}</span>
                                  <span>({company.review_count})</span>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-[10px] font-bold text-primary">
                                  CHF {priceEst.min}–{priceEst.max}
                                </p>
                              </div>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {formData.selectedCompanies.length > 0 && (
                      <p className="text-center text-xs text-green-600 font-medium">
                        ✓ {formData.selectedCompanies.length} Firma{formData.selectedCompanies.length > 1 ? "en" : ""} gewählt
                      </p>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Contact */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    <div className="text-center mb-2">
                      <h3 className="text-lg font-bold">Fast fertig!</h3>
                      <p className="text-xs text-muted-foreground">Wohin sollen die {formData.selectedCompanies.length} Offerten?</p>
                      <p className="text-[10px] text-green-600 mt-1 font-medium">→ Offerten in 24–48h per E-Mail</p>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[10px] font-medium flex items-center gap-1 mb-1">
                          <User className="w-3 h-3 text-primary" /> Name *
                        </label>
                        <Input
                          placeholder="Ihr Name"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          className="h-10 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium flex items-center gap-1 mb-1">
                          <Mail className="w-3 h-3 text-primary" /> E-Mail *
                        </label>
                        <Input
                          type="email"
                          placeholder="ihre@email.ch"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className="h-10 rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium flex items-center gap-1 mb-1">
                          <Phone className="w-3 h-3 text-muted-foreground" /> Telefon (optional)
                        </label>
                        <Input
                          type="tel"
                          placeholder="+41 79 123 45 67"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          className="h-10 rounded-xl text-sm"
                        />
                      </div>

                      <div className="flex items-start gap-2 pt-1">
                        <Checkbox
                          id="privacy-mobile"
                          checked={formData.privacyAccepted}
                          onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                          className="mt-0.5"
                        />
                        <label htmlFor="privacy-mobile" className="text-[9px] text-muted-foreground leading-relaxed">
                          Ich akzeptiere die <a href="/datenschutz" className="text-primary">Datenschutzerklärung</a>. <span className="text-green-600 font-medium">Keine Werbeanrufe.</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with buttons */}
            <div className="px-4 py-3 border-t border-border bg-card safe-area-bottom">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="h-11 rounded-xl px-3"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!canProceed()}
                    className="flex-1 h-11 rounded-xl bg-primary"
                  >
                    {currentStep === 2 ? `Mit ${formData.selectedCompanies.length} Firmen` : "Weiter"}
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="flex-1 h-11 rounded-xl bg-secondary hover:bg-secondary/90 shadow-cta font-bold"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Offerten erhalten
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-1.5 mt-2 text-[9px] text-muted-foreground">
                <Shield className="w-3 h-3" />
                Kostenlos & unverbindlich
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});
