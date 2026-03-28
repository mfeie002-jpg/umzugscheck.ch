import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calculator, 
  MapPin, 
  Home, 
  Truck, 
  ArrowRight, 
  Sparkles,
  Clock,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const InstantQuoteWidget = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fromPostal: '',
    toPostal: '',
    rooms: '',
    floor: '',
    elevator: ''
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{ min: number; max: number } | null>(null);

  const handleCalculate = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const rooms = parseInt(formData.rooms) || 2;
      const floor = parseInt(formData.floor) || 0;
      const hasElevator = formData.elevator === 'yes';
      
      const basePrice = rooms * 350;
      const floorFactor = hasElevator ? 1 : (1 + floor * 0.1);
      
      const min = Math.round(basePrice * floorFactor * 0.85);
      const max = Math.round(basePrice * floorFactor * 1.15);
      
      setResult({ min, max });
      setIsCalculating(false);
      setStep(3);
    }, 1500);
  };

  const resetForm = () => {
    setStep(1);
    setResult(null);
    setFormData({
      fromPostal: '',
      toPostal: '',
      rooms: '',
      floor: '',
      elevator: ''
    });
  };

  return (
    <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-6 md:p-8 border border-primary/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Calculator className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Sofort-Preisrechner</h3>
          <p className="text-sm text-muted-foreground">In 30 Sekunden zum Preisüberblick</p>
        </div>
        <Badge variant="outline" className="ml-auto">
          <Sparkles className="h-3 w-3 mr-1" />
          KI-gestützt
        </Badge>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
              step >= s 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-muted-foreground'
            }`}>
              {step > s ? <CheckCircle className="h-4 w-4" /> : s}
            </div>
            {s < 3 && (
              <div className={`w-16 md:w-24 h-1 mx-2 rounded ${
                step > s ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  Von (PLZ)
                </Label>
                <Input
                  placeholder="z.B. 8001"
                  value={formData.fromPostal}
                  onChange={(e) => setFormData({ ...formData, fromPostal: e.target.value })}
                />
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  Nach (PLZ)
                </Label>
                <Input
                  placeholder="z.B. 3011"
                  value={formData.toPostal}
                  onChange={(e) => setFormData({ ...formData, toPostal: e.target.value })}
                />
              </div>
            </div>
            <Button 
              className="w-full"
              onClick={() => setStep(2)}
              disabled={!formData.fromPostal || !formData.toPostal}
            >
              Weiter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4" />
                  Zimmer
                </Label>
                <Select 
                  value={formData.rooms}
                  onValueChange={(v) => setFormData({ ...formData, rooms: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, '5+'].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r} Zimmer
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4" />
                  Stockwerk
                </Label>
                <Select 
                  value={formData.floor}
                  onValueChange={(v) => setFormData({ ...formData, floor: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    {['EG', '1', '2', '3', '4', '5', '5+'].map((f) => (
                      <SelectItem key={f} value={f}>
                        {f === 'EG' ? 'Erdgeschoss' : `${f}. Stock`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4" />
                  Lift
                </Label>
                <Select 
                  value={formData.elevator}
                  onValueChange={(v) => setFormData({ ...formData, elevator: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Ja</SelectItem>
                    <SelectItem value="no">Nein</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Zurück
              </Button>
              <Button 
                className="flex-1"
                onClick={handleCalculate}
                disabled={!formData.rooms || !formData.floor || !formData.elevator}
              >
                {isCalculating ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Berechne...
                  </>
                ) : (
                  <>
                    Preis berechnen
                    <Sparkles className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && result && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="p-6 bg-white rounded-xl shadow-lg">
              <div className="text-sm text-muted-foreground mb-2">
                Geschätzte Umzugskosten
              </div>
              <div className="text-4xl font-bold text-primary mb-2">
                CHF {result.min.toLocaleString()} - {result.max.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                Basierend auf aktuellen Marktpreisen
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="p-2 bg-muted/50 rounded-lg">
                <div className="font-semibold">{formData.fromPostal}</div>
                <div className="text-muted-foreground text-xs">Von</div>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <div className="font-semibold">{formData.rooms} Zi.</div>
                <div className="text-muted-foreground text-xs">Grösse</div>
              </div>
              <div className="p-2 bg-muted/50 rounded-lg">
                <div className="font-semibold">{formData.toPostal}</div>
                <div className="text-muted-foreground text-xs">Nach</div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={resetForm}>
                Neu berechnen
              </Button>
              <Button className="flex-1">
                Verbindliche Offerten erhalten
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              * Unverbindliche Schätzung. Erhalten Sie kostenlos verbindliche Offerten von geprüften Umzugsfirmen.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
