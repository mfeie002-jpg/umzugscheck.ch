/**
 * V2.b - ChatGPT Optimized (Premium Full-Journey)
 * 
 * Based on ChatGPT Agent V2.b Feedback:
 * 1. ✅ Address Auto-Completion (PLZ suggestions)
 * 2. ✅ Separate data and size steps
 * 3. ✅ Personal package recommendation
 * 4. ✅ Package comparison simplification (tooltips)
 * 5. ✅ Info tooltips for additional services
 * 6. ✅ Calendar date picker with flex options
 * 7. ✅ Extended progress display with step names
 * 8. ✅ Phone number optional with explanation
 * 9. ✅ Testimonials and trust seals
 * 10. ✅ Price range explanations
 */

import { useState, memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Shield, CheckCircle, Check, Star,
  MapPin, Package, Home, Building2, Truck, HelpCircle, User, Mail,
  Calendar, Clock, Info, Phone, Sparkles, Users, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useInitialStep } from "@/hooks/use-initial-step";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Swiss PLZ Database (simplified for autocomplete)
const SWISS_PLZ = [
  { plz: "8000", city: "Zürich" },
  { plz: "8001", city: "Zürich" },
  { plz: "8002", city: "Zürich" },
  { plz: "8003", city: "Zürich" },
  { plz: "8004", city: "Zürich" },
  { plz: "8005", city: "Zürich" },
  { plz: "8006", city: "Zürich" },
  { plz: "8008", city: "Zürich" },
  { plz: "8032", city: "Zürich" },
  { plz: "8037", city: "Zürich" },
  { plz: "8038", city: "Zürich" },
  { plz: "8041", city: "Zürich" },
  { plz: "8044", city: "Zürich" },
  { plz: "8045", city: "Zürich" },
  { plz: "8046", city: "Zürich" },
  { plz: "8047", city: "Zürich" },
  { plz: "8048", city: "Zürich" },
  { plz: "8049", city: "Zürich" },
  { plz: "8050", city: "Zürich" },
  { plz: "8051", city: "Zürich" },
  { plz: "8052", city: "Zürich" },
  { plz: "8053", city: "Zürich" },
  { plz: "8055", city: "Zürich" },
  { plz: "8057", city: "Zürich" },
  { plz: "8064", city: "Zürich" },
  { plz: "3000", city: "Bern" },
  { plz: "3001", city: "Bern" },
  { plz: "3004", city: "Bern" },
  { plz: "3006", city: "Bern" },
  { plz: "3007", city: "Bern" },
  { plz: "3008", city: "Bern" },
  { plz: "3010", city: "Bern" },
  { plz: "3011", city: "Bern" },
  { plz: "3012", city: "Bern" },
  { plz: "3013", city: "Bern" },
  { plz: "3014", city: "Bern" },
  { plz: "3015", city: "Bern" },
  { plz: "3018", city: "Bern" },
  { plz: "3027", city: "Bern" },
  { plz: "4000", city: "Basel" },
  { plz: "4001", city: "Basel" },
  { plz: "4051", city: "Basel" },
  { plz: "4052", city: "Basel" },
  { plz: "4053", city: "Basel" },
  { plz: "4054", city: "Basel" },
  { plz: "4055", city: "Basel" },
  { plz: "4056", city: "Basel" },
  { plz: "4057", city: "Basel" },
  { plz: "4058", city: "Basel" },
  { plz: "1200", city: "Genève" },
  { plz: "1201", city: "Genève" },
  { plz: "1202", city: "Genève" },
  { plz: "1203", city: "Genève" },
  { plz: "1204", city: "Genève" },
  { plz: "1205", city: "Genève" },
  { plz: "1206", city: "Genève" },
  { plz: "6000", city: "Luzern" },
  { plz: "6003", city: "Luzern" },
  { plz: "6004", city: "Luzern" },
  { plz: "6005", city: "Luzern" },
  { plz: "6006", city: "Luzern" },
  { plz: "9000", city: "St. Gallen" },
  { plz: "9001", city: "St. Gallen" },
  { plz: "9006", city: "St. Gallen" },
  { plz: "9008", city: "St. Gallen" },
  { plz: "5000", city: "Aarau" },
  { plz: "5001", city: "Aarau" },
  { plz: "2000", city: "Neuchâtel" },
  { plz: "1000", city: "Lausanne" },
  { plz: "1003", city: "Lausanne" },
  { plz: "1004", city: "Lausanne" },
  { plz: "1005", city: "Lausanne" },
  { plz: "1006", city: "Lausanne" },
  { plz: "1007", city: "Lausanne" },
  { plz: "8400", city: "Winterthur" },
  { plz: "8401", city: "Winterthur" },
  { plz: "8404", city: "Winterthur" },
  { plz: "8406", city: "Winterthur" },
];

const MOVE_TYPES = [
  { id: "privat", label: "Privatumzug", icon: Home, description: "Wohnung, Haus oder WG" },
  { id: "firma", label: "Firmenumzug", icon: Building2, description: "Büro, Gewerbe, Praxis" },
];

// 6-Step Flow based on feedback
const STEPS = [
  { id: 1, name: "Umzugsart", icon: Home },
  { id: 2, name: "Von & Nach", icon: MapPin },
  { id: 3, name: "Paket", icon: Package },
  { id: 4, name: "Extras", icon: Sparkles },
  { id: 5, name: "Termin", icon: Calendar },
  { id: 6, name: "Kontakt", icon: User },
];

const APARTMENT_SIZES = [
  { value: "studio", label: "Studio", rooms: 1 },
  { value: "1-1.5", label: "1-1.5 Zi.", rooms: 1.5 },
  { value: "2-2.5", label: "2-2.5 Zi.", rooms: 2.5 },
  { value: "3-3.5", label: "3-3.5 Zi.", rooms: 3.5 },
  { value: "4-4.5", label: "4-4.5 Zi.", rooms: 4.5 },
  { value: "5+", label: "5+ Zi.", rooms: 6 },
];

const PACKAGES = [
  { 
    id: "diy", 
    label: "DIY", 
    priceRange: "CHF 200-400",
    description: "Sie packen selbst",
    features: ["Transport", "2 Umzugshelfer"],
    notIncluded: ["Verpackung", "Montage", "Reinigung"],
    tooltip: "Ideal für kleine Umzüge oder wenn Sie selbst packen möchten"
  },
  { 
    id: "standard", 
    label: "Standard", 
    priceRange: "CHF 800-1'500",
    description: "Unser beliebtestes Paket",
    badge: "Beliebt",
    features: ["Transport", "Ein-/Auspacken", "Möbelmontage"],
    notIncluded: ["Reinigung"],
    tooltip: "Das beste Preis-Leistungs-Verhältnis für die meisten Umzüge",
    recommended: true
  },
  { 
    id: "premium", 
    label: "Premium", 
    priceRange: "CHF 1'500-3'000",
    description: "Rundum-Sorglos",
    features: ["Transport", "Ein-/Auspacken", "Möbelmontage", "Reinigung alte Wohnung"],
    notIncluded: [],
    tooltip: "Kompletter Service inkl. Endreinigung mit Abnahmegarantie"
  },
  { 
    id: "allinclusive", 
    label: "All-Inclusive", 
    priceRange: "CHF 3'000-6'000",
    description: "Premium + Extras",
    features: ["Alles aus Premium", "Zwischenlagerung", "Handwerker", "Koordination"],
    notIncluded: [],
    tooltip: "Der VIP-Service: Wir kümmern uns um absolut alles"
  },
];

const EXTRAS = [
  { 
    id: "lagerung", 
    label: "Zwischenlagerung", 
    price: "+CHF 150/Monat",
    icon: Package,
    tooltip: "Sichere Lagerung Ihrer Möbel in klimatisierten Räumen"
  },
  { 
    id: "klavier", 
    label: "Klavier/Flügel", 
    price: "+CHF 300-800",
    icon: Sparkles,
    tooltip: "Spezialtransport durch zertifizierte Klaviertransporteure"
  },
  { 
    id: "haustier", 
    label: "Haustiertransport", 
    price: "+CHF 50-150",
    icon: HelpCircle,
    tooltip: "Sicherer Transport Ihrer Haustiere zum neuen Zuhause"
  },
  { 
    id: "kunst", 
    label: "Kunst & Antiquitäten", 
    price: "+CHF 200-500",
    icon: Award,
    tooltip: "Spezialverpackung für wertvolle und empfindliche Gegenstände"
  },
  { 
    id: "entsorgung", 
    label: "Entsorgung", 
    price: "+CHF 100-300",
    icon: Truck,
    tooltip: "Professionelle Entsorgung von Sperrmüll und alten Möbeln"
  },
];

const FLEXIBILITY_OPTIONS = [
  { id: "fixed", label: "Nur dieser Tag", discount: null },
  { id: "flex2", label: "± 2-3 Tage", discount: "5-10% günstiger" },
  { id: "flex7", label: "± 1 Woche", discount: "10-15% günstiger" },
];

const TESTIMONIALS = [
  { name: "Lukas M.", city: "Zürich", text: "Reibungsloser Umzug, top Service!", rating: 5 },
  { name: "Sarah K.", city: "Bern", text: "Sehr professionell und pünktlich.", rating: 5 },
  { name: "Marco T.", city: "Basel", text: "Preis-Leistung stimmt, gerne wieder!", rating: 5 },
];

export const V2bOptimized = memo(function V2bOptimized() {
  const navigate = useNavigate();
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [formData, setFormData] = useState({
    moveType: "",
    fromLocation: "",
    toLocation: "",
    apartmentSize: "",
    selectedPackage: "",
    extras: [] as string[],
    moveDate: "",
    flexibility: "fixed",
    name: "",
    email: "",
    phone: "",
    privacyAccepted: false,
  });

  // PLZ Autocomplete
  const fromSuggestions = useMemo(() => {
    if (formData.fromLocation.length < 2) return [];
    return SWISS_PLZ.filter(p => 
      p.plz.startsWith(formData.fromLocation) || 
      p.city.toLowerCase().includes(formData.fromLocation.toLowerCase())
    ).slice(0, 5);
  }, [formData.fromLocation]);

  const toSuggestions = useMemo(() => {
    if (formData.toLocation.length < 2) return [];
    return SWISS_PLZ.filter(p => 
      p.plz.startsWith(formData.toLocation) || 
      p.city.toLowerCase().includes(formData.toLocation.toLowerCase())
    ).slice(0, 5);
  }, [formData.toLocation]);

  // Recommended package based on size
  const recommendedPackage = useMemo(() => {
    const size = APARTMENT_SIZES.find(s => s.value === formData.apartmentSize);
    if (!size) return "standard";
    if (size.rooms <= 2) return "diy";
    if (size.rooms <= 4) return "standard";
    return "premium";
  }, [formData.apartmentSize]);

  // Estimated price calculation
  const estimatedPrice = useMemo(() => {
    const pkg = PACKAGES.find(p => p.id === formData.selectedPackage);
    if (!pkg) return null;
    
    const baseMin = parseInt(pkg.priceRange.replace(/[^0-9]/g, '').split('').slice(0, 3).join(''));
    const baseMax = parseInt(pkg.priceRange.replace(/[^0-9]/g, '').split('').slice(-4).join(''));
    
    let extrasMin = 0;
    let extrasMax = 0;
    formData.extras.forEach(extId => {
      const ext = EXTRAS.find(e => e.id === extId);
      if (ext) {
        const priceMatch = ext.price.match(/\d+/g);
        if (priceMatch) {
          extrasMin += parseInt(priceMatch[0]);
          extrasMax += parseInt(priceMatch[priceMatch.length - 1]);
        }
      }
    });

    return {
      min: baseMin + extrasMin,
      max: baseMax + extrasMax
    };
  }, [formData.selectedPackage, formData.extras]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.moveType !== "";
      case 2: return formData.fromLocation && formData.toLocation && formData.apartmentSize;
      case 3: return formData.selectedPackage !== "";
      case 4: return true; // Extras are optional
      case 5: return formData.moveDate !== "";
      case 6: return formData.name && formData.email && formData.privacyAccepted;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/umzugsofferten-bestaetigung');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleExtra = (extraId: string) => {
    setFormData(prev => ({
      ...prev,
      extras: prev.extras.includes(extraId)
        ? prev.extras.filter(id => id !== extraId)
        : [...prev.extras, extraId]
    }));
  };

  return (
    <TooltipProvider>
      <div className="w-full max-w-2xl mx-auto">
        {/* Trust Badges - Top */}
        <div className="flex items-center justify-center gap-4 mb-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-primary" />
            <span>100% kostenlos</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>4.9/5 Sterne</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-primary" />
            <span>15'000+ Umzüge</span>
          </div>
        </div>

        {/* OPTIMIZED: Extended Progress with Step Names */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-border" />
            <motion.div 
              className="absolute top-5 left-0 h-0.5 bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentStep - 1) / 5) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
            
            {STEPS.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="relative z-10 flex flex-col items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isCompleted 
                        ? "bg-primary border-primary" 
                        : isCurrent 
                          ? "bg-background border-primary" 
                          : "bg-background border-border"
                    }`}
                    initial={false}
                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {isCompleted ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <StepIcon className={`w-4 h-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`} />
                    )}
                  </motion.div>
                  <span className={`text-[10px] mt-1.5 font-medium text-center max-w-[60px] ${
                    isCurrent ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {step.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          <AnimatePresence mode="wait">
            {/* Step 1: Move Type */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Ihr Umzug. Perfekt organisiert.
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Was für einen Umzug planen Sie?
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {MOVE_TYPES.map((type, index) => {
                    const Icon = type.icon;
                    const isSelected = formData.moveType === type.id;
                    
                    return (
                      <motion.button
                        key={type.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setFormData({ ...formData, moveType: type.id })}
                        className={`relative p-6 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/5 shadow-md"
                            : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${
                          isSelected ? "bg-primary/20" : "bg-muted"
                        }`}>
                          <Icon className={`w-7 h-7 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                        </div>
                        <h3 className="font-semibold text-foreground text-lg">{type.label}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{type.description}</p>
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-4 right-4"
                          >
                            <CheckCircle className="w-6 h-6 text-primary" />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Location (OPTIMIZED with Autocomplete) */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Wohin geht die Reise?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Ihre Umzugsdetails
                  </p>
                </div>

                <div className="space-y-5">
                  {/* From Location with Autocomplete */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Von (PLZ/Ort)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={formData.fromLocation}
                          onChange={(e) => {
                            setFormData({ ...formData, fromLocation: e.target.value });
                            setShowFromSuggestions(true);
                          }}
                          onFocus={() => setShowFromSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                          placeholder="8000 Zürich"
                          className="pl-10"
                        />
                      </div>
                      {/* Autocomplete Dropdown */}
                      {showFromSuggestions && fromSuggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                        >
                          {fromSuggestions.map(s => (
                            <button
                              key={s.plz}
                              onClick={() => {
                                setFormData({ ...formData, fromLocation: `${s.plz} ${s.city}` });
                                setShowFromSuggestions(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-muted text-sm flex items-center gap-2"
                            >
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="font-medium">{s.plz}</span>
                              <span className="text-muted-foreground">{s.city}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    
                    <div className="relative">
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Nach (PLZ/Ort)
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                        <Input
                          value={formData.toLocation}
                          onChange={(e) => {
                            setFormData({ ...formData, toLocation: e.target.value });
                            setShowToSuggestions(true);
                          }}
                          onFocus={() => setShowToSuggestions(true)}
                          onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                          placeholder="3000 Bern"
                          className="pl-10"
                        />
                      </div>
                      {showToSuggestions && toSuggestions.length > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                        >
                          {toSuggestions.map(s => (
                            <button
                              key={s.plz}
                              onClick={() => {
                                setFormData({ ...formData, toLocation: `${s.plz} ${s.city}` });
                                setShowToSuggestions(false);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-muted text-sm flex items-center gap-2"
                            >
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="font-medium">{s.plz}</span>
                              <span className="text-muted-foreground">{s.city}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Apartment Size */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Wohnungsgrösse
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {APARTMENT_SIZES.map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setFormData({ ...formData, apartmentSize: size.value })}
                          className={`py-3 px-2 rounded-xl text-sm font-medium border-2 transition-all ${
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

            {/* Step 3: Package Selection (OPTIMIZED with Tooltips & Recommendation) */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Wählen Sie Ihr Paket
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Basierend auf Ihrer Wohnungsgrösse empfehlen wir: <span className="font-semibold text-primary">{PACKAGES.find(p => p.id === recommendedPackage)?.label}</span>
                  </p>
                </div>

                <div className="space-y-3">
                  {PACKAGES.map((pkg, index) => {
                    const isSelected = formData.selectedPackage === pkg.id;
                    const isRecommended = pkg.id === recommendedPackage;
                    
                    return (
                      <motion.div
                        key={pkg.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <button
                          onClick={() => setFormData({ ...formData, selectedPackage: pkg.id })}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                            isSelected
                              ? "border-primary bg-primary/5 shadow-md"
                              : isRecommended
                                ? "border-primary/50 bg-primary/5"
                                : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{pkg.label}</h3>
                                {pkg.badge && (
                                  <Badge className="bg-primary text-primary-foreground text-[10px]">
                                    {pkg.badge}
                                  </Badge>
                                )}
                                {isRecommended && !pkg.badge && (
                                  <Badge variant="outline" className="text-[10px] border-primary text-primary">
                                    Empfohlen
                                  </Badge>
                                )}
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-[250px]">
                                    <p className="text-sm">{pkg.tooltip}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </div>
                              <p className="text-sm text-muted-foreground">{pkg.description}</p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {pkg.features.slice(0, 3).map(f => (
                                  <span key={f} className="text-[10px] bg-muted px-2 py-0.5 rounded">
                                    ✓ {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-foreground">{pkg.priceRange}</span>
                              {isSelected && (
                                <CheckCircle className="w-5 h-5 text-primary mt-2 ml-auto" />
                              )}
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Price Explanation */}
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Wie entstehen die Preisspannen?</span> Die Kosten hängen ab von: Distanz, Stockwerk, Lift, Möbelmenge und gewählten Extras. Nach Ihrer Anfrage erhalten Sie verbindliche Festpreise.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Extras (OPTIMIZED with Info Tooltips) */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Zusatzleistungen
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Optional – für Ihren perfekten Umzug
                  </p>
                </div>

                <div className="space-y-3">
                  {EXTRAS.map((extra, index) => {
                    const Icon = extra.icon;
                    const isSelected = formData.extras.includes(extra.id);
                    
                    return (
                      <motion.button
                        key={extra.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => toggleExtra(extra.id)}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? "bg-primary/20" : "bg-muted"
                          }`}>
                            <Icon className={`w-5 h-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{extra.label}</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-[200px]">
                                  <p className="text-xs">{extra.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            <span className="text-sm text-muted-foreground">{extra.price}</span>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? "border-primary bg-primary" : "border-border"
                        }`}>
                          {isSelected && <Check className="w-4 h-4 text-primary-foreground" />}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Running Total */}
                {estimatedPrice && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Geschätzte Kosten:</span>
                      <span className="font-bold text-foreground">
                        CHF {estimatedPrice.min.toLocaleString()}'–{estimatedPrice.max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 5: Date (OPTIMIZED with Calendar & Flex Options) */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Wann möchten Sie umziehen?
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Wählen Sie Ihren Wunschtermin
                  </p>
                </div>

                <div className="space-y-5">
                  {/* Date Input */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Umzugsdatum
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={formData.moveDate}
                        onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
                        className="pl-10"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {/* Flexibility Options */}
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Flexibilität
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {FLEXIBILITY_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setFormData({ ...formData, flexibility: opt.id })}
                          className={`p-3 rounded-xl border-2 text-center transition-all ${
                            formData.flexibility === opt.id
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <span className="font-medium text-sm block">{opt.label}</span>
                          {opt.discount && (
                            <span className="text-[10px] text-primary block mt-1">{opt.discount}</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Flexible Termine ermöglichen günstigere Angebote
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Contact (OPTIMIZED with Testimonials) */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Fast geschafft!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Wohin sollen wir die Offerten senden?
                  </p>
                </div>

                {/* Summary */}
                <div className="bg-muted/50 rounded-xl p-4 mb-5">
                  <h3 className="font-semibold text-sm mb-2">Ihre Anfrage:</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-muted-foreground">Von:</span> {formData.fromLocation}</div>
                    <div><span className="text-muted-foreground">Nach:</span> {formData.toLocation}</div>
                    <div><span className="text-muted-foreground">Grösse:</span> {formData.apartmentSize}</div>
                    <div><span className="text-muted-foreground">Paket:</span> {PACKAGES.find(p => p.id === formData.selectedPackage)?.label}</div>
                    {estimatedPrice && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Geschätzt:</span>{' '}
                        <span className="font-semibold">CHF {estimatedPrice.min.toLocaleString()}'–{estimatedPrice.max.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Max Muster"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">E-Mail *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="max@beispiel.ch"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">
                      Telefon <span className="text-muted-foreground font-normal">(optional – nur für Rückfragen)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+41 79 123 45 67"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg bg-muted/30 border border-border">
                    <input
                      type="checkbox"
                      checked={formData.privacyAccepted}
                      onChange={(e) => setFormData({ ...formData, privacyAccepted: e.target.checked })}
                      className="mt-1"
                    />
                    <span className="text-xs text-muted-foreground">
                      Ich akzeptiere die{' '}
                      <a href="/datenschutz" target="_blank" className="text-primary underline">Datenschutzbestimmungen</a>{' '}
                      und erhalte unverbindliche Offerten von max. 3 geprüften Partnern. Kein Spam.
                    </span>
                  </label>
                </div>

                {/* Testimonials */}
                <div className="mt-5 pt-5 border-t border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">Das sagen unsere Kunden:</span>
                  </div>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {TESTIMONIALS.map((t, i) => (
                      <div key={i} className="min-w-[180px] p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground italic mb-2">"{t.text}"</p>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-medium">{t.name}</span>
                          <span className="text-xs text-muted-foreground">– {t.city}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
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
              className="gap-2 min-w-[160px]"
              size="lg"
            >
              {currentStep === 6 ? "Offerten anfordern" : "Weiter"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <Badge variant="outline" className="text-xs gap-1">
            <Shield className="w-3 h-3" />
            SSL verschlüsselt
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <Award className="w-3 h-3" />
            ASTAG geprüft
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            <CheckCircle className="w-3 h-3" />
            Schweizer Datenschutz
          </Badge>
        </div>
      </div>
    </TooltipProvider>
  );
});

export default V2bOptimized;
