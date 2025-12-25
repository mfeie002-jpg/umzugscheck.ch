/**
 * Premium V2 Calculator
 * 
 * A luxury-styled multi-step calculator with package-based selection
 * and full-journey experience from decision to move-in.
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, ArrowLeft, Crown, Diamond, Sparkles, 
  Package, Brush, Trash2, Warehouse, Truck, Home,
  CheckCircle, Star, Clock, Shield, Zap, Phone,
  MapPin, Calendar, User, Mail, Building2, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

// Premium packages
const packages = [
  {
    id: "diy",
    name: "DIY",
    subtitle: "Nur Transport",
    icon: Truck,
    price: { from: 390, to: 690 },
    popular: false,
    features: [
      "Professioneller Transport",
      "Erfahrene Träger",
      "Basis-Versicherung",
    ],
    notIncluded: ["Einpacken", "Auspacken", "Reinigung", "Möbelmontage"],
  },
  {
    id: "standard",
    name: "Standard",
    subtitle: "Unser Klassiker",
    icon: Package,
    price: { from: 890, to: 1490 },
    popular: true,
    features: [
      "Alles aus DIY",
      "Möbel-Demontage & Montage",
      "Verpackungsmaterial",
      "Erweiterte Versicherung",
    ],
    notIncluded: ["Einpacken", "Auspacken", "Reinigung"],
  },
  {
    id: "premium",
    name: "Premium",
    subtitle: "Rundum sorglos",
    icon: Crown,
    price: { from: 1890, to: 2990 },
    popular: false,
    features: [
      "Alles aus Standard",
      "Professionelles Einpacken",
      "Auspacken am Zielort",
      "Kartonentsorgung",
      "Premium-Versicherung",
    ],
    notIncluded: ["Reinigung"],
  },
  {
    id: "allInclusive",
    name: "All-Inclusive",
    subtitle: "Finger schnipsen",
    icon: Diamond,
    price: { from: 3490, to: 5990 },
    popular: false,
    features: [
      "Alles aus Premium",
      "Endreinigung alte Wohnung",
      "Vorreinigung neue Wohnung",
      "Entsorgung / Entrümpelung",
      "Persönlicher Umzugsberater",
      "White-Glove Service",
    ],
    notIncluded: [],
  },
];

// Additional services
const additionalServices = [
  { id: "lagerung", label: "Zwischenlagerung", icon: Warehouse, price: 150, unit: "/Monat" },
  { id: "klaviertransport", label: "Klaviertransport", icon: Sparkles, price: 350 },
  { id: "kunsttransport", label: "Kunst & Antiquitäten", icon: Sparkles, price: 250 },
  { id: "haustiere", label: "Haustiertransport", icon: Sparkles, price: 80 },
  { id: "entsorgung", label: "Extra Entsorgung", icon: Trash2, price: 200 },
];

// Apartment sizes
const apartmentSizes = [
  { id: "studio", label: "Studio", rooms: "1 Zimmer", multiplier: 0.6 },
  { id: "2zi", label: "2 Zimmer", rooms: "2 Zi.", multiplier: 0.8 },
  { id: "3zi", label: "3 Zimmer", rooms: "3 Zi.", multiplier: 1 },
  { id: "4zi", label: "4 Zimmer", rooms: "4 Zi.", multiplier: 1.3 },
  { id: "5zi", label: "5 Zimmer", rooms: "5 Zi.", multiplier: 1.6 },
  { id: "6zi", label: "6+ Zimmer", rooms: "6+ Zi.", multiplier: 2 },
];

interface FormData {
  moveType: "private" | "business" | "";
  fromLocation: string;
  toLocation: string;
  apartmentSize: string;
  selectedPackage: string;
  additionalServices: string[];
  moveDate: string;
  flexibility: "exact" | "flexible" | "very_flexible";
  name: string;
  email: string;
  phone: string;
  comments: string;
  privacyAccepted: boolean;
}

type Step = "intro" | "details" | "package" | "extras" | "schedule" | "contact";

const steps: Step[] = ["intro", "details", "package", "extras", "schedule", "contact"];

export const PremiumCalculator = memo(function PremiumCalculator() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("intro");
  
  const [formData, setFormData] = useState<FormData>({
    moveType: "",
    fromLocation: "",
    toLocation: "",
    apartmentSize: "",
    selectedPackage: "",
    additionalServices: [],
    moveDate: "",
    flexibility: "flexible",
    name: "",
    email: "",
    phone: "",
    comments: "",
    privacyAccepted: false,
  });

  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const updateFormData = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleService = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter(s => s !== serviceId)
        : [...prev.additionalServices, serviceId]
    }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case "intro":
        return formData.moveType !== "";
      case "details":
        return formData.fromLocation && formData.toLocation && formData.apartmentSize;
      case "package":
        return formData.selectedPackage !== "";
      case "extras":
        return true;
      case "schedule":
        return formData.moveDate !== "";
      case "contact":
        return formData.name && formData.email && formData.phone && formData.privacyAccepted;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const idx = currentStepIndex;
    if (idx < steps.length - 1) {
      setCurrentStep(steps[idx + 1]);
    }
  };

  const handleBack = () => {
    const idx = currentStepIndex;
    if (idx > 0) {
      setCurrentStep(steps[idx - 1]);
    }
  };

  const handleSubmit = () => {
    localStorage.setItem("umzugscheck_premium_v2", JSON.stringify({
      ...formData,
      submittedAt: new Date().toISOString(),
    }));
    navigate('/umzugsofferten-bestaetigung');
  };

  // Calculate estimated price
  const calculatePrice = () => {
    const pkg = packages.find(p => p.id === formData.selectedPackage);
    if (!pkg) return { min: 0, max: 0 };
    
    const size = apartmentSizes.find(s => s.id === formData.apartmentSize);
    const multiplier = size?.multiplier || 1;
    
    const extrasPrice = formData.additionalServices.reduce((sum, sId) => {
      const service = additionalServices.find(s => s.id === sId);
      return sum + (service?.price || 0);
    }, 0);
    
    return {
      min: Math.round(pkg.price.from * multiplier + extrasPrice),
      max: Math.round(pkg.price.to * multiplier + extrasPrice),
    };
  };

  const renderStep = () => {
    switch (currentStep) {
      case "intro":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <Badge className="bg-primary/20 text-primary border-primary/30 px-4 py-1.5">
                <Diamond className="w-3 h-3 mr-1.5" />
                Premium Experience
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Ihr Umzug. <span className="text-primary">Perfekt organisiert.</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                Von der Entscheidung bis zum Einzug – wir kümmern uns um alles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <button
                onClick={() => {
                  updateFormData("moveType", "private");
                  setTimeout(handleNext, 200);
                }}
                className={cn(
                  "group p-8 rounded-2xl border-2 text-left transition-all duration-300",
                  "hover:border-primary hover:shadow-lg hover:shadow-primary/10",
                  formData.moveType === "private"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <Home className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Privatumzug</h3>
                <p className="text-muted-foreground text-sm">
                  Wohnung, Haus, WG – wir ziehen Sie stressfrei um
                </p>
              </button>

              <button
                onClick={() => {
                  updateFormData("moveType", "business");
                  setTimeout(handleNext, 200);
                }}
                className={cn(
                  "group p-8 rounded-2xl border-2 text-left transition-all duration-300",
                  "hover:border-primary hover:shadow-lg hover:shadow-primary/10",
                  formData.moveType === "business"
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                )}
              >
                <Building2 className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Firmenumzug</h3>
                <p className="text-muted-foreground text-sm">
                  Büro, Praxis, Geschäft – professionell & termingerecht
                </p>
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>100% kostenlos</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                <span>4.9/5 Sterne</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>15'000+ Umzüge</span>
              </div>
            </div>
          </motion.div>
        );

      case "details":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Wohin geht die Reise?</h2>
              <p className="text-muted-foreground">Ihre Umzugsdetails</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-sm font-medium">Von (PLZ / Ort)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="z.B. 8001 Zürich"
                    value={formData.fromLocation}
                    onChange={(e) => updateFormData("fromLocation", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nach (PLZ / Ort)</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="z.B. 3000 Bern"
                    value={formData.toLocation}
                    onChange={(e) => updateFormData("toLocation", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/50 border-border"
                  />
                </div>
              </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
              <label className="text-sm font-medium">Wohnungsgrösse</label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {apartmentSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => updateFormData("apartmentSize", size.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-center transition-all",
                      formData.apartmentSize === size.id
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className="font-semibold">{size.label}</div>
                    <div className="text-xs text-muted-foreground">{size.rooms}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case "package":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Wählen Sie Ihr Paket</h2>
              <p className="text-muted-foreground">Von DIY bis Full-Service</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {packages.map((pkg) => {
                const Icon = pkg.icon;
                const isSelected = formData.selectedPackage === pkg.id;
                
                return (
                  <button
                    key={pkg.id}
                    onClick={() => updateFormData("selectedPackage", pkg.id)}
                    className={cn(
                      "relative p-6 rounded-2xl border-2 text-left transition-all duration-300",
                      "hover:shadow-xl",
                      isSelected
                        ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground">
                        Beliebt
                      </Badge>
                    )}
                    
                    <Icon className={cn(
                      "w-8 h-8 mb-4",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )} />
                    
                    <h3 className="text-lg font-bold">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{pkg.subtitle}</p>
                    
                    <div className="text-2xl font-bold text-primary mb-4">
                      CHF {pkg.price.from.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground"> – {pkg.price.to.toLocaleString()}</span>
                    </div>

                    <ul className="space-y-2 text-sm">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {isSelected && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        );

      case "extras":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Zusatzleistungen</h2>
              <p className="text-muted-foreground">Optional – für Ihren perfekten Umzug</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {additionalServices.map((service) => {
                const Icon = service.icon;
                const isSelected = formData.additionalServices.includes(service.id);
                
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={cn(
                      "p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4",
                      isSelected
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card hover:border-primary/50"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{service.label}</div>
                      <div className="text-primary font-semibold">
                        +CHF {service.price}{service.unit || ""}
                      </div>
                    </div>
                    {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                  </button>
                );
              })}
            </div>

            {/* Price summary */}
            {formData.selectedPackage && (
              <div className="max-w-md mx-auto p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Geschätzte Kosten</p>
                  <div className="text-3xl font-bold text-primary">
                    CHF {calculatePrice().min.toLocaleString()} – {calculatePrice().max.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Exakte Preise in den Offerten
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        );

      case "schedule":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Wann soll es losgehen?</h2>
              <p className="text-muted-foreground">Ihr Wunschtermin</p>
            </div>

            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Umzugsdatum</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="date"
                    value={formData.moveDate}
                    onChange={(e) => updateFormData("moveDate", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/50 border-border"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Flexibilität</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "exact", label: "Exakt", desc: "Nur dieser Tag" },
                    { id: "flexible", label: "Flexibel", desc: "± 2-3 Tage" },
                    { id: "very_flexible", label: "Sehr flexibel", desc: "± 1 Woche" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => updateFormData("flexibility", opt.id as FormData["flexibility"])}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center transition-all",
                        formData.flexibility === opt.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:border-primary/50"
                      )}
                    >
                      <div className="font-medium">{opt.label}</div>
                      <div className="text-xs text-muted-foreground">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "contact":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold">Fast geschafft!</h2>
              <p className="text-muted-foreground">Wohin dürfen wir Ihre Offerten senden?</p>
            </div>

            <div className="max-w-lg mx-auto space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Vor- und Nachname"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">E-Mail</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="ihre@email.ch"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Telefon</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={formData.phone}
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    className="pl-12 h-14 text-lg bg-muted/50 border-border"
                  />
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="privacy"
                  checked={formData.privacyAccepted}
                  onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                  className="mt-1"
                />
                <label htmlFor="privacy" className="text-sm text-muted-foreground cursor-pointer">
                  Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> und stimme zu, dass meine Daten an Umzugsfirmen weitergegeben werden.
                </label>
              </div>
            </div>

            {/* Final price summary */}
            {formData.selectedPackage && (
              <div className="max-w-lg mx-auto p-6 rounded-2xl bg-card border border-border">
                <h3 className="font-semibold mb-4">Ihre Anfrage</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paket</span>
                    <span className="font-medium">{packages.find(p => p.id === formData.selectedPackage)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route</span>
                    <span className="font-medium">{formData.fromLocation} → {formData.toLocation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Grösse</span>
                    <span className="font-medium">{apartmentSizes.find(s => s.id === formData.apartmentSize)?.label}</span>
                  </div>
                  {formData.additionalServices.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extras</span>
                      <span className="font-medium">{formData.additionalServices.length} ausgewählt</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-medium">Geschätzt</span>
                      <span className="font-bold text-primary">
                        CHF {calculatePrice().min.toLocaleString()} – {calculatePrice().max.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="theme-premium-v2 min-h-[80vh] rounded-3xl bg-background border border-border p-6 md:p-10">
      {/* Progress bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-muted-foreground">
            Schritt {currentStepIndex + 1} von {steps.length}
          </span>
          <span className="text-xs text-primary font-medium">
            {Math.round(progress)}% abgeschlossen
          </span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-primary/80"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="max-w-4xl mx-auto mt-10 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStepIndex === 0}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück
        </Button>

        {currentStep === "contact" ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed()}
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground gap-2 shadow-cta"
          >
            Offerten anfordern
            <Zap className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            size="lg"
            className="bg-primary hover:bg-primary/90 gap-2"
          >
            Weiter
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
});
