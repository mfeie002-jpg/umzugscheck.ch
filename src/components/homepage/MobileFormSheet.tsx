import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, ArrowLeft, Shield, CheckCircle, MapPin, Home, User, Mail, Phone, Calendar, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

interface MobileFormSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const apartmentSizes = [
  { value: "studio", label: "Studio / 1 Zimmer" },
  { value: "1-1.5", label: "1 – 1.5 Zimmer" },
  { value: "2-2.5", label: "2 – 2.5 Zimmer" },
  { value: "3-3.5", label: "3 – 3.5 Zimmer" },
  { value: "4-4.5", label: "4 – 4.5 Zimmer" },
  { value: "5+", label: "5+ Zimmer / Haus" },
];

const services = [
  { id: "umzug", label: "Umzug" },
  { id: "reinigung", label: "Reinigung" },
  { id: "entsorgung", label: "Entsorgung" },
  { id: "lagerung", label: "Lagerung" },
];

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
}

export const MobileFormSheet = memo(function MobileFormSheet({ isOpen, onClose }: MobileFormSheetProps) {
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
    privacyAccepted: false,
  });

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
        return formData.apartmentSize !== "";
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
      name: formData.name,
      email: formData.email,
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.moveDate && { date: formData.moveDate }),
    });
    navigate(`/umzugsofferten?${params.toString()}`);
    onClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    onClose();
  };

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
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl z-50 max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-border rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 pb-4 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Schritt {currentStep} von 3</p>
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
            <div className="flex-1 overflow-y-auto px-5 py-5">
              <AnimatePresence mode="wait">
                {/* Step 1 */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold">Wohin geht's?</h3>
                      <p className="text-sm text-muted-foreground">Start- und Zielort angeben</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <MapPin className="w-4 h-4 text-primary" /> Von
                        </label>
                        <Input
                          placeholder="PLZ oder Ort"
                          value={formData.fromLocation}
                          onChange={(e) => updateFormData("fromLocation", e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <MapPin className="w-4 h-4 text-secondary" /> Nach
                        </label>
                        <Input
                          placeholder="PLZ oder Ort"
                          value={formData.toLocation}
                          onChange={(e) => updateFormData("toLocation", e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      {/* Quick room selector for micro-conversion */}
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <Home className="w-4 h-4 text-muted-foreground" /> Grösse (optional)
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {["1-2", "3-3.5", "4-4.5", "5+"].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => updateFormData("apartmentSize", size)}
                              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                formData.apartmentSize === size
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {size} Zi.
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2 */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold">Details zum Umzug</h3>
                      <p className="text-sm text-muted-foreground">Grösse & gewünschte Services</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <Home className="w-4 h-4 text-primary" /> Wohnungsgrösse
                        </label>
                        <Select value={formData.apartmentSize} onValueChange={(v) => updateFormData("apartmentSize", v)}>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Bitte wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            {apartmentSizes.map(size => (
                              <SelectItem key={size.value} value={size.value}>{size.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Leistungen</label>
                        <div className="flex flex-wrap gap-2">
                          {services.map(service => (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => toggleService(service.id)}
                              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                formData.selectedServices.includes(service.id)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                            >
                              {service.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <Calendar className="w-4 h-4 text-muted-foreground" /> Datum (optional)
                        </label>
                        <Input
                          type="date"
                          value={formData.moveDate}
                          onChange={(e) => updateFormData("moveDate", e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3 */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold">Fast geschafft!</h3>
                      <p className="text-sm text-muted-foreground">Wohin sollen die Offerten?</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <User className="w-4 h-4 text-primary" /> Name *
                        </label>
                        <Input
                          placeholder="Ihr Name"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <Mail className="w-4 h-4 text-primary" /> E-Mail *
                        </label>
                        <Input
                          type="email"
                          placeholder="ihre@email.ch"
                          value={formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium flex items-center gap-2 mb-1.5">
                          <Phone className="w-4 h-4 text-muted-foreground" /> Telefon (optional)
                        </label>
                        <Input
                          type="tel"
                          placeholder="+41 79 123 45 67"
                          value={formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          className="h-12 rounded-xl"
                        />
                      </div>

                      <div className="flex items-start gap-3 pt-2">
                        <Checkbox
                          id="privacy-mobile"
                          checked={formData.privacyAccepted}
                          onCheckedChange={(checked) => updateFormData("privacyAccepted", !!checked)}
                          className="mt-0.5"
                        />
                        <label htmlFor="privacy-mobile" className="text-xs text-muted-foreground">
                          Ich akzeptiere die <a href="/datenschutz" className="text-primary">Datenschutzerklärung</a> und bin einverstanden, dass meine Daten zur Angebotseinholung weitergegeben werden.
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer with buttons */}
            <div className="px-5 py-4 border-t border-border bg-card safe-area-bottom">
              <div className="flex gap-3">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => prev - 1)}
                    className="h-12 rounded-xl px-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    disabled={!canProceed()}
                    className="flex-1 h-12 rounded-xl bg-primary"
                  >
                    Weiter
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={!canProceed()}
                    className="flex-1 h-12 rounded-xl bg-secondary hover:bg-secondary/90 shadow-cta"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Preise vergleichen
                  </Button>
                )}
              </div>
              
              <div className="flex items-center justify-center gap-1.5 mt-3 text-xs text-muted-foreground">
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
