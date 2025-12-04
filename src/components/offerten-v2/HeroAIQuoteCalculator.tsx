/**
 * HeroAIQuoteCalculator - Main hero section with AI-powered calculator
 * Features: 2-3 step calculator, real-time price estimation, lead capture
 */

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Calculator, 
  Shield, 
  ArrowRight, 
  Sparkles,
  MapPin,
  Home,
  Calendar,
  Package,
  User,
  Mail,
  Phone,
  Lock,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface CalculatorState {
  step: number;
  fromPLZ: string;
  fromOrt: string;
  toPLZ: string;
  toOrt: string;
  wohnungsgroesse: string;
  stockwerkVon: string;
  stockwerkNach: string;
  liftVon: boolean;
  liftNach: boolean;
  moveDate: string;
  reinigung: boolean;
  verpackung: boolean;
  moebellift: boolean;
  lagerung: boolean;
  prioritaet: "guenstig" | "preis-leistung" | "premium";
  flexibilitaet: "exakt" | "flexibel";
  name: string;
  email: string;
  phone: string;
  kontaktart: "email" | "telefon" | "beides";
}

const initialState: CalculatorState = {
  step: 1,
  fromPLZ: "",
  fromOrt: "",
  toPLZ: "",
  toOrt: "",
  wohnungsgroesse: "",
  stockwerkVon: "eg",
  stockwerkNach: "eg",
  liftVon: false,
  liftNach: false,
  moveDate: "",
  reinigung: false,
  verpackung: false,
  moebellift: false,
  lagerung: false,
  prioritaet: "preis-leistung",
  flexibilitaet: "flexibel",
  name: "",
  email: "",
  phone: "",
  kontaktart: "beides",
};

// Simulated AI price calculation (to be replaced with real API)
const calculatePrice = (state: CalculatorState): { min: number; max: number } | null => {
  if (!state.wohnungsgroesse) return null;
  
  const basePrice: Record<string, number> = {
    "1.5": 800,
    "2.5": 1200,
    "3.5": 1800,
    "4.5": 2400,
    "5.5": 3200,
    "6.5": 4000,
  };
  
  const base = basePrice[state.wohnungsgroesse] || 2000;
  let multiplier = 1;
  
  // Floor adjustments
  const floorVon = parseInt(state.stockwerkVon) || 0;
  const floorNach = parseInt(state.stockwerkNach) || 0;
  if (!state.liftVon && floorVon > 2) multiplier += 0.15;
  if (!state.liftNach && floorNach > 2) multiplier += 0.15;
  
  // Service adjustments
  if (state.reinigung) multiplier += 0.2;
  if (state.verpackung) multiplier += 0.25;
  if (state.moebellift) multiplier += 0.1;
  if (state.lagerung) multiplier += 0.15;
  
  // Priority adjustments
  if (state.prioritaet === "guenstig") multiplier *= 0.85;
  if (state.prioritaet === "premium") multiplier *= 1.3;
  
  const min = Math.round(base * multiplier * 0.9 / 50) * 50;
  const max = Math.round(base * multiplier * 1.2 / 50) * 50;
  
  return { min, max };
};

export default function HeroAIQuoteCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const priceEstimate = calculatePrice(state);
  
  const updateState = useCallback((updates: Partial<CalculatorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);
  
  const handleSubmit = async () => {
    if (!state.name || !state.email || !state.phone) {
      toast({
        title: "Bitte füllen Sie alle Felder aus",
        description: "Name, E-Mail und Telefon sind erforderlich.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Anfrage erfolgreich gesendet!",
      description: "Sie erhalten in Kürze passende Offerten per E-Mail.",
    });
    
    setIsSubmitting(false);
  };
  
  const canProceedToStep2 = state.fromPLZ && state.toPLZ && state.wohnungsgroesse;
  const canProceedToStep3 = canProceedToStep2;
  
  return (
    <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Headlines & Benefits */}
          <div className="space-y-6 lg:pr-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              KI-gestützte Preisschätzung
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
              Umzugsofferten mit KI vergleichen – 
              <span className="text-primary"> schnell, fair & transparent.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Unser smarter Umzugsrechner schätzt Ihre Umzugskosten in Sekunden, 
              findet passende Schweizer Umzugsfirmen und hilft Ihnen, bis zu 40 % zu sparen.
            </p>
            
            <ul className="space-y-3">
              {[
                "Nur geprüfte Schweizer Umzugsfirmen",
                "KI-basierte Preisindikation in Echtzeit",
                "100 % kostenlos & unverbindlich",
              ].map((benefit, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
            
            <div className="hidden lg:block pt-4">
              <a 
                href="#preisbeispiele" 
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 transition-colors"
              >
                Nur Preise ansehen
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Right: Calculator Card */}
          <Card className="shadow-2xl border-0 bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6 md:p-8">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Umzugsrechner</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`w-8 h-1.5 rounded-full transition-colors ${
                        state.step >= step ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Move Parameters */}
                {state.step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-lg text-foreground">Umzugsdetails</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="fromPLZ" className="text-sm font-medium">Von (PLZ)</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="fromPLZ"
                            placeholder="8000"
                            value={state.fromPLZ}
                            onChange={(e) => updateState({ fromPLZ: e.target.value })}
                            className="pl-9"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toPLZ" className="text-sm font-medium">Nach (PLZ)</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="toPLZ"
                            placeholder="6000"
                            value={state.toPLZ}
                            onChange={(e) => updateState({ toPLZ: e.target.value })}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wohnungsgroesse" className="text-sm font-medium">Wohnungsgrösse</Label>
                      <Select
                        value={state.wohnungsgroesse}
                        onValueChange={(v) => updateState({ wohnungsgroesse: v })}
                      >
                        <SelectTrigger id="wohnungsgroesse">
                          <Home className="w-4 h-4 mr-2 text-muted-foreground" />
                          <SelectValue placeholder="Anzahl Zimmer wählen" />
                        </SelectTrigger>
                        <SelectContent>
                          {["1.5", "2.5", "3.5", "4.5", "5.5", "6.5"].map((size) => (
                            <SelectItem key={size} value={size}>
                              {size} Zimmer
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Stockwerk (Von)</Label>
                        <Select
                          value={state.stockwerkVon}
                          onValueChange={(v) => updateState({ stockwerkVon: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eg">EG</SelectItem>
                            {[1, 2, 3, 4, 5, 6].map((f) => (
                              <SelectItem key={f} value={f.toString()}>
                                {f}. Stock
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="liftVon"
                            checked={state.liftVon}
                            onCheckedChange={(c) => updateState({ liftVon: c })}
                          />
                          <Label htmlFor="liftVon" className="text-xs text-muted-foreground">
                            Lift vorhanden
                          </Label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Stockwerk (Nach)</Label>
                        <Select
                          value={state.stockwerkNach}
                          onValueChange={(v) => updateState({ stockwerkNach: v })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="eg">EG</SelectItem>
                            {[1, 2, 3, 4, 5, 6].map((f) => (
                              <SelectItem key={f} value={f.toString()}>
                                {f}. Stock
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2">
                          <Switch
                            id="liftNach"
                            checked={state.liftNach}
                            onCheckedChange={(c) => updateState({ liftNach: c })}
                          />
                          <Label htmlFor="liftNach" className="text-xs text-muted-foreground">
                            Lift vorhanden
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="moveDate" className="text-sm font-medium">Umzugsdatum</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="moveDate"
                          type="date"
                          value={state.moveDate}
                          onChange={(e) => updateState({ moveDate: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <Button
                      className="w-full mt-4"
                      size="lg"
                      onClick={() => updateState({ step: 2 })}
                      disabled={!canProceedToStep2}
                    >
                      Weiter zu Optionen
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}
                
                {/* Step 2: Options */}
                {state.step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-lg text-foreground">Zusatzservices & Priorität</h3>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Zusatzleistungen</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { key: "reinigung", label: "Reinigung", icon: "🧹" },
                          { key: "verpackung", label: "Verpackung", icon: "📦" },
                          { key: "moebellift", label: "Möbellift", icon: "🏗️" },
                          { key: "lagerung", label: "Lagerung", icon: "🏠" },
                        ].map((service) => (
                          <div
                            key={service.key}
                            onClick={() => updateState({ [service.key]: !state[service.key as keyof CalculatorState] })}
                            className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              state[service.key as keyof CalculatorState]
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{service.icon}</span>
                              <span className="text-sm font-medium">{service.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Priorität</Label>
                      <RadioGroup
                        value={state.prioritaet}
                        onValueChange={(v) => updateState({ prioritaet: v as CalculatorState["prioritaet"] })}
                        className="grid grid-cols-3 gap-2"
                      >
                        {[
                          { value: "guenstig", label: "Günstig" },
                          { value: "preis-leistung", label: "Preis-Leistung" },
                          { value: "premium", label: "Premium" },
                        ].map((option) => (
                          <div key={option.value} className="relative">
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={option.value}
                              className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/30"
                            >
                              <span className="text-sm font-medium">{option.label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Terminflexibilität</Label>
                      <RadioGroup
                        value={state.flexibilitaet}
                        onValueChange={(v) => updateState({ flexibilitaet: v as CalculatorState["flexibilitaet"] })}
                        className="grid grid-cols-2 gap-2"
                      >
                        {[
                          { value: "exakt", label: "Exaktes Datum" },
                          { value: "flexibel", label: "Flexibel (±7 Tage)" },
                        ].map((option) => (
                          <div key={option.value} className="relative">
                            <RadioGroupItem
                              value={option.value}
                              id={`flex-${option.value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`flex-${option.value}`}
                              className="flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/30"
                            >
                              <span className="text-sm font-medium">{option.label}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    {/* Live Price Estimate */}
                    {priceEstimate && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-5 h-5 text-primary" />
                          <span className="font-semibold text-foreground">KI-Preisschätzung</span>
                        </div>
                        <div className="text-2xl font-bold text-foreground">
                          CHF {priceEstimate.min.toLocaleString("de-CH")} – {priceEstimate.max.toLocaleString("de-CH")}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Berechnet anhand ähnlicher Umzüge in Ihrer Region (unverbindliche Schätzung).
                        </p>
                        <ul className="mt-3 space-y-1">
                          <li className="flex items-center gap-2 text-xs text-foreground">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Inkl. Transport und Möbelmontage (je nach Anbieter)
                          </li>
                          <li className="flex items-center gap-2 text-xs text-foreground">
                            <CheckCircle2 className="w-3 h-3 text-green-500" />
                            Basierend auf realistischen Erfahrungswerten
                          </li>
                        </ul>
                      </motion.div>
                    )}
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => updateState({ step: 1 })}
                        className="flex-1"
                      >
                        Zurück
                      </Button>
                      <Button
                        className="flex-1"
                        size="lg"
                        onClick={() => updateState({ step: 3 })}
                        disabled={!canProceedToStep3}
                      >
                        Offerten anfordern
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Step 3: Contact Details */}
                {state.step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4"
                  >
                    <h3 className="font-semibold text-lg text-foreground">Ihre Kontaktdaten</h3>
                    
                    {priceEstimate && (
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                        <div className="text-sm text-muted-foreground">Geschätzte Kosten:</div>
                        <div className="text-xl font-bold text-foreground">
                          CHF {priceEstimate.min.toLocaleString("de-CH")} – {priceEstimate.max.toLocaleString("de-CH")}
                        </div>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          placeholder="Ihr vollständiger Name"
                          value={state.name}
                          onChange={(e) => updateState({ name: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">E-Mail *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="ihre@email.ch"
                          value={state.email}
                          onChange={(e) => updateState({ email: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">Telefon *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+41 79 123 45 67"
                          value={state.phone}
                          onChange={(e) => updateState({ phone: e.target.value })}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Bevorzugte Kontaktart</Label>
                      <RadioGroup
                        value={state.kontaktart}
                        onValueChange={(v) => updateState({ kontaktart: v as CalculatorState["kontaktart"] })}
                        className="grid grid-cols-3 gap-2"
                      >
                        {[
                          { value: "email", label: "E-Mail" },
                          { value: "telefon", label: "Telefon" },
                          { value: "beides", label: "Beides" },
                        ].map((option) => (
                          <div key={option.value} className="relative">
                            <RadioGroupItem
                              value={option.value}
                              id={`kontakt-${option.value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`kontakt-${option.value}`}
                              className="flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:border-primary/30 text-sm"
                            >
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        onClick={() => updateState({ step: 2 })}
                        className="flex-1"
                      >
                        Zurück
                      </Button>
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        size="lg"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="animate-spin mr-2">⏳</span>
                            Senden...
                          </>
                        ) : (
                          <>
                            Offerten erhalten
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {/* Trust Microcopy */}
                    <div className="flex items-start gap-2 pt-4 border-t border-border">
                      <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Ihre Daten werden nur an passende Umzugsfirmen weitergegeben. 
                        Keine Werbung, keine Weitergabe an Dritte. Datenschutz nach Schweizer Standard.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
