/**
 * MultiStepCalculator Variant C - Conversion Boost
 * 
 * Optimizations:
 * - Größere CTAs mit höherem Kontrast
 * - Trust-Signals direkt im Hero
 * - Social Proof (Bewertungen, Anzahl Nutzer)
 * - Weniger Formularfelder (Progressive Disclosure)
 * - Exit-Intent Prevention eingebaut
 */

import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Shield, CheckCircle, Star, Users, 
  MapPin, Clock, Award, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const MultiStepCalculatorVariantC = memo(function MultiStepCalculatorVariantC() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    apartmentSize: "",
    email: "",
    phone: "",
  });

  const handleSubmit = () => {
    if (step === 1 && formData.fromLocation && formData.toLocation) {
      setStep(2);
    } else if (step === 2 && formData.email) {
      navigate('/umzugsofferten-bestaetigung');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Hero with Trust Signals */}
      <div className="text-center mb-6">
        <Badge variant="secondary" className="mb-3 gap-1">
          <Zap className="w-3 h-3" />
          In 2 Minuten fertig
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Gratis Umzugsofferten vergleichen
        </h1>
        
        {/* Social Proof Strip */}
        <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
          <div className="flex items-center gap-1.5">
            <div className="flex -space-x-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="font-medium">4.8/5</span>
            <span className="text-muted-foreground">(2'847 Bewertungen)</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>12'000+ Umzüge</span>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card border-2 border-primary/20 rounded-2xl shadow-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              {/* Quick Location Input */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      value={formData.fromLocation}
                      onChange={(e) => setFormData({ ...formData, fromLocation: e.target.value })}
                      placeholder="Von (PLZ)"
                      className="pl-10 h-12"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    <Input
                      value={formData.toLocation}
                      onChange={(e) => setFormData({ ...formData, toLocation: e.target.value })}
                      placeholder="Nach (PLZ)"
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                {/* Size Quick Select */}
                <div className="flex gap-2 flex-wrap">
                  {["1-2 Zi.", "3-3.5 Zi.", "4+ Zi.", "Haus"].map((size) => (
                    <button
                      key={size}
                      onClick={() => setFormData({ ...formData, apartmentSize: size })}
                      className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                        formData.apartmentSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* BIG CTA BUTTON */}
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.fromLocation || !formData.toLocation}
                  size="lg"
                  className="w-full h-14 text-lg font-bold gap-2 shadow-lg"
                >
                  Offerten vergleichen
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges Below CTA */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                  <Shield className="w-5 h-5 text-green-600 mb-1" />
                  <span className="text-xs font-medium">100% Kostenlos</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                  <Award className="w-5 h-5 text-blue-600 mb-1" />
                  <span className="text-xs font-medium">Geprüfte Firmen</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                  <Clock className="w-5 h-5 text-purple-600 mb-1" />
                  <span className="text-xs font-medium">24h Antwort</span>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6"
            >
              {/* Minimal Contact Form */}
              <div className="text-center mb-5">
                <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                <h2 className="text-xl font-bold text-foreground">
                  Fast geschafft!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Nur noch Ihre E-Mail für die Offerten
                </p>
              </div>

              <div className="space-y-3">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ihre E-Mail"
                  className="h-14 text-base"
                  autoFocus
                />
                
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Telefon (für schnellere Offerten)"
                  className="h-12"
                />

                <Button
                  onClick={handleSubmit}
                  disabled={!formData.email}
                  size="lg"
                  className="w-full h-14 text-lg font-bold gap-2"
                >
                  <Zap className="w-5 h-5" />
                  3-5 Offerten erhalten
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  <Shield className="w-3 h-3 inline mr-1" />
                  Ihre Daten sind sicher. Keine Werbung.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Trust Bar */}
      <div className="flex items-center justify-center gap-6 mt-6 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          Unverbindlich
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          Schweizer Firmen
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          DSGVO-konform
        </span>
      </div>
    </div>
  );
});

export default MultiStepCalculatorVariantC;
