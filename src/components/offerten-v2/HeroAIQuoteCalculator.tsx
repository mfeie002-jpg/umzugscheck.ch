/**
 * HeroAIQuoteCalculator - Main hero section with AI-powered calculator
 * Features: 3-step calculator, real-time price estimation, lead capture
 * 
 * OPTIMIZATIONS:
 * 1. Enhanced gradient background with subtle pattern
 * 2. Improved calculator card with glass morphism
 * 3. Better step indicator with pulse animation
 * 4. Enhanced form fields with better focus states
 * 5. Animated price estimation display
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
  ArrowRight, 
  Sparkles,
  MapPin,
  Home,
  Calendar,
  User,
  Mail,
  Phone,
  Lock,
  TrendingUp,
  Loader2
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
    <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-primary/5" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left: Headlines & Benefits */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 lg:pr-8 lg:pt-4"
          >
            <Badge 
              variant="secondary" 
              className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 text-sm font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              KI-gestützte Preisschätzung
            </Badge>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
              Umzugsofferten mit KI vergleichen – 
              <span className="text-primary block mt-1"> schnell, fair & transparent.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Unser smarter Umzugsrechner schätzt Ihre Umzugskosten in Sekunden, 
              findet passende Schweizer Umzugsfirmen und hilft Ihnen, bis zu 40 % zu sparen.
            </p>
            
            <ul className="space-y-4 pt-2">
              {[
                "Nur geprüfte Schweizer Umzugsfirmen",
                "KI-basierte Preisindikation in Echtzeit",
                "100 % kostenlos & unverbindlich",
              ].map((benefit, i) => (
                <motion.li 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 text-foreground"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="font-medium">{benefit}</span>
                </motion.li>
              ))}
            </ul>
            
            <div className="hidden lg:block pt-4">
              <a 
                href="#preisbeispiele" 
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2 transition-colors group"
              >
                Nur Preise ansehen
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.div>
          
          {/* Right: Calculator Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-2xl border border-border/50 bg-card/80 backdrop-blur-xl rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                {/* Card Header */}
                <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Calculator className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-foreground">Umzugsrechner</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[1, 2, 3].map((step) => (
                        <div
                          key={step}
                          className={`relative w-10 h-1.5 rounded-full transition-all duration-300 ${
                            state.step >= step ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          {state.step === step && (
                            <motion.div
                              layoutId="activeStep"
                              className="absolute inset-0 bg-primary rounded-full"
                              initial={false}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Move Parameters */}
                    {state.step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <h3 className="font-semibold text-lg text-foreground">Umzugsdetails</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fromPLZ" className="text-sm font-medium">Von (PLZ)</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="fromPLZ"
                                placeholder="8000"
                                value={state.fromPLZ}
                                onChange={(e) => updateState({ fromPLZ: e.target.value })}
                                className="pl-10 h-11 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20"
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
                                className="pl-10 h-11 bg-background/50 border-border/60 focus:border-primary focus:ring-primary/20"
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
                            <SelectTrigger id="wohnungsgroesse" className="h-11 bg-background/50 border-border/60">
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
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Stockwerk (Von)</Label>
                            <Select
                              value={state.stockwerkVon}
                              onValueChange={(v) => updateState({ stockwerkVon: v })}
                            >
                              <SelectTrigger className="h-11 bg-background/50 border-border/60">
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
                            <div className="flex items-center gap-2 pt-1">
                              <Switch
                                id="liftVon"
                                checked={state.liftVon}
                                onCheckedChange={(c) => updateState({ liftVon: c })}
                                className="data-[state=checked]:bg-primary"
                              />
                              <Label htmlFor="liftVon" className="text-xs text-muted-foreground cursor-pointer">
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
                              <SelectTrigger className="h-11 bg-background/50 border-border/60">
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
                            <div className="flex items-center gap-2 pt-1">
                              <Switch
                                id="liftNach"
                                checked={state.liftNach}
                                onCheckedChange={(c) => updateState({ liftNach: c })}
                                className="data-[state=checked]:bg-primary"
                              />
                              <Label htmlFor="liftNach" className="text-xs text-muted-foreground cursor-pointer">
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
                              className="pl-10 h-11 bg-background/50 border-border/60"
                            />
                          </div>
                        </div>
                        
                        <Button
                          className="w-full h-12 text-base font-semibold mt-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
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
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-foreground">Zusatzservices & Priorität</h3>
                          <button 
                            onClick={() => updateState({ step: 1 })}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            ← Zurück
                          </button>
                        </div>
                        
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Zusatzleistungen</Label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { key: "reinigung", label: "Reinigung", icon: "🧹" },
                              { key: "verpackung", label: "Verpackung", icon: "📦" },
                              { key: "moebellift", label: "Möbellift", icon: "🏗️" },
                              { key: "lagerung", label: "Lagerung", icon: "🏠" },
                            ].map((service) => (
                              <div
                                key={service.key}
                                onClick={() => updateState({ [service.key]: !state[service.key as keyof CalculatorState] })}
                                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                  state[service.key as keyof CalculatorState]
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : "border-border/60 hover:border-primary/40 bg-background/50"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="text-lg">{service.icon}</span>
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
                            className="grid grid-cols-3 gap-3"
                          >
                            {[
                              { value: "guenstig", label: "Günstig", desc: "Bester Preis" },
                              { value: "preis-leistung", label: "Preis-Leistung", desc: "Empfohlen" },
                              { value: "premium", label: "Premium", desc: "Top Service" },
                            ].map((option) => (
                              <div key={option.value} className="relative">
                                <RadioGroupItem
                                  value={option.value}
                                  id={option.value}
                                  className="peer sr-only"
                                />
                                <Label
                                  htmlFor={option.value}
                                  className={`block p-3 rounded-xl border-2 cursor-pointer transition-all text-center ${
                                    state.prioritaet === option.value
                                      ? "border-primary bg-primary/5"
                                      : "border-border/60 hover:border-primary/40 bg-background/50"
                                  }`}
                                >
                                  <span className="block text-sm font-medium">{option.label}</span>
                                  <span className="block text-xs text-muted-foreground mt-0.5">{option.desc}</span>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </div>
                        
                        {/* Price Preview */}
                        {priceEstimate && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-4 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20"
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">Geschätzte Kosten</span>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                              CHF {priceEstimate.min.toLocaleString("de-CH")} – {priceEstimate.max.toLocaleString("de-CH")}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Basierend auf ähnlichen Umzügen in Ihrer Region
                            </p>
                          </motion.div>
                        )}
                        
                        <Button
                          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                          size="lg"
                          onClick={() => updateState({ step: 3 })}
                        >
                          Weiter zu Kontaktdaten
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </motion.div>
                    )}
                    
                    {/* Step 3: Contact Details */}
                    {state.step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-5"
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-lg text-foreground">Kontaktdaten</h3>
                          <button 
                            onClick={() => updateState({ step: 2 })}
                            className="text-sm text-muted-foreground hover:text-foreground"
                          >
                            ← Zurück
                          </button>
                        </div>
                        
                        {/* Final Price Display */}
                        {priceEstimate && (
                          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-50/50 border border-green-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-sm text-green-700 font-medium">Ihre Preisspanne</span>
                                <div className="text-xl font-bold text-green-800">
                                  CHF {priceEstimate.min.toLocaleString("de-CH")} – {priceEstimate.max.toLocaleString("de-CH")}
                                </div>
                              </div>
                              <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="name"
                                placeholder="Ihr Name"
                                value={state.name}
                                onChange={(e) => updateState({ name: e.target.value })}
                                className="pl-10 h-11 bg-background/50 border-border/60"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">E-Mail</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="email"
                                type="email"
                                placeholder="ihre@email.ch"
                                value={state.email}
                                onChange={(e) => updateState({ email: e.target.value })}
                                className="pl-10 h-11 bg-background/50 border-border/60"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="phone" className="text-sm font-medium">Telefon</Label>
                            <div className="relative">
                              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="+41 79 123 45 67"
                                value={state.phone}
                                onChange={(e) => updateState({ phone: e.target.value })}
                                className="pl-10 h-11 bg-background/50 border-border/60"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                          size="lg"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Wird gesendet...
                            </>
                          ) : (
                            <>
                              Offerten erhalten
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </>
                          )}
                        </Button>
                        
                        {/* Trust Micro-copy */}
                        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50">
                          <Lock className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Ihre Daten werden nur an passende Umzugsfirmen weitergegeben. 
                            Keine Werbung, keine Weitergabe an Dritte. 
                            <span className="font-medium"> Datenschutz nach Schweizer Standard.</span>
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
