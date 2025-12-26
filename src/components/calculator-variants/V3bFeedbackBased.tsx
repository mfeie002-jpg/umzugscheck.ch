/**
 * V3bFeedbackBased - Feedback-basierte Variante
 * 
 * Basiert auf ChatGPT UX-Analyse mit Fokus auf:
 * - Transparente Preislogik mit Erklärungen
 * - Slider mit klaren Labels und Tooltips
 * - Sticky Mobile CTA
 * - Progress Bar mit Schritt-Titeln
 * - Größere Checkbox mit klarem Datenschutz
 * - Inline-Validierung
 * - Testimonials für Trust
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CalendarIcon,
  Shield,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  User,
  Info,
  Truck,
  Package,
  Sparkles,
  Home,
  Quote,
  HelpCircle
} from "lucide-react";

// Service tiers with clear descriptions
const SERVICE_TIERS = [
  { 
    id: "budget", 
    name: "Budget & Control", 
    percent: 20, 
    price: 1490,
    description: "Sie packen selbst, wir transportieren",
    includes: ["Transport", "Basisversicherung"]
  },
  { 
    id: "smart", 
    name: "Smart Mover", 
    percent: 40, 
    price: 1990,
    description: "Wir helfen beim Ein- und Ausladen",
    includes: ["Transport", "Ein-/Ausladen", "Basisversicherung"]
  },
  { 
    id: "comfort", 
    name: "Comfort", 
    percent: 60, 
    price: 2490,
    description: "Wir übernehmen das Packen",
    includes: ["Transport", "Packen", "Ein-/Ausladen", "Vollkasko"]
  },
  { 
    id: "premium", 
    name: "Premium", 
    percent: 80, 
    price: 2990,
    description: "Rundum-Sorglos inkl. Reinigung",
    includes: ["Transport", "Packen", "Ein-/Ausladen", "Reinigung", "Vollkasko"]
  },
  { 
    id: "whitglove", 
    name: "White Glove", 
    percent: 100, 
    price: 3990,
    description: "Komplettservice mit Koordination",
    includes: ["Alles inklusive", "Persönlicher Koordinator", "Möbelmontage"]
  },
];

const ROOM_OPTIONS = [
  { id: "studio", label: "Studio", rooms: 1 },
  { id: "2zi", label: "2 Zi.", rooms: 2 },
  { id: "3zi", label: "3 Zi.", rooms: 3 },
  { id: "4zi", label: "4 Zi.", rooms: 4 },
  { id: "5zi", label: "5+ Zi.", rooms: 5 },
];

// Testimonials for trust
const TESTIMONIALS = [
  { name: "M. Keller", location: "Zürich", text: "Schneller Umzug, fairer Preis!", rating: 5 },
  { name: "S. Brunner", location: "Bern", text: "Sehr professionell und pünktlich.", rating: 5 },
];

// Step configuration with titles
const STEPS = [
  { num: 1, title: "Service wählen", icon: Package },
  { num: 2, title: "Details eingeben", icon: MapPin },
  { num: 3, title: "Plan prüfen", icon: Check },
  { num: 4, title: "Absenden", icon: Truck },
];

export function V3bFeedbackBased() {
  const [currentStep, setCurrentStep] = useState(1);
  const [sliderValue, setSliderValue] = useState([60]);
  const [selectedRooms, setSelectedRooms] = useState("3zi");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [moveDate, setMoveDate] = useState<Date>();
  const [flexibleDate, setFlexibleDate] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [skipStep3, setSkipStep3] = useState(false);

  // Get current service tier based on slider
  const getCurrentTier = () => {
    const value = sliderValue[0];
    return SERVICE_TIERS.reduce((prev, curr) => 
      Math.abs(curr.percent - value) < Math.abs(prev.percent - value) ? curr : prev
    );
  };

  const currentTier = getCurrentTier();
  const selectedRoom = ROOM_OPTIONS.find(r => r.id === selectedRooms);

  // Calculate price based on rooms and tier
  const calculatePrice = () => {
    const basePrice = currentTier.price;
    const roomMultiplier = selectedRoom ? selectedRoom.rooms * 0.15 + 0.7 : 1;
    return Math.round(basePrice * roomMultiplier);
  };

  const price = calculatePrice();

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 2) {
      if (!fromAddress.trim()) newErrors.fromAddress = "Bitte Startadresse eingeben";
      if (!toAddress.trim()) newErrors.toAddress = "Bitte Zieladresse eingeben";
      if (!moveDate && !flexibleDate) newErrors.moveDate = "Bitte Datum wählen oder 'flexibel' ankreuzen";
    }
    
    if (step === 4) {
      if (!name.trim()) newErrors.name = "Bitte Name eingeben";
      if (!email.trim() || !email.includes("@")) newErrors.email = "Bitte gültige E-Mail eingeben";
      if (!phone.trim() || phone.length < 10) newErrors.phone = "Bitte gültige Telefonnummer eingeben";
      if (!consent) newErrors.consent = "Bitte Datenschutz akzeptieren";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2 && skipStep3) {
        setCurrentStep(4);
      } else {
        setCurrentStep(prev => Math.min(prev + 1, 4));
      }
    }
  };

  const prevStep = () => {
    if (currentStep === 4 && skipStep3) {
      setCurrentStep(2);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      console.log("Form submitted:", { 
        tier: currentTier, 
        rooms: selectedRooms, 
        fromAddress, 
        toAddress, 
        moveDate, 
        name, 
        email, 
        phone 
      });
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        {/* Progress Bar with Step Titles */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = currentStep === step.num;
                const isCompleted = currentStep > step.num;
                const isSkipped = step.num === 3 && skipStep3 && currentStep > 3;
                
                return (
                  <div key={step.num} className="flex items-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => step.num < currentStep && setCurrentStep(step.num)}
                          disabled={step.num > currentStep}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
                            isActive && "bg-primary text-primary-foreground",
                            isCompleted && "bg-primary/20 text-primary cursor-pointer hover:bg-primary/30",
                            isSkipped && "bg-muted text-muted-foreground line-through",
                            !isActive && !isCompleted && !isSkipped && "text-muted-foreground"
                          )}
                        >
                          <span className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold",
                            isActive ? "bg-primary-foreground/20" : isCompleted ? "bg-primary/30" : "bg-muted"
                          )}>
                            {isCompleted ? <Check className="h-3 w-3" /> : step.num}
                          </span>
                          <Icon className="h-4 w-4" />
                          <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{step.title}</p>
                      </TooltipContent>
                    </Tooltip>
                    {idx < STEPS.length - 1 && (
                      <ArrowRight className="h-4 w-4 mx-1 text-muted-foreground hidden sm:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
          <AnimatePresence mode="wait">
            {/* Step 1: Service Selection */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Wie viel möchten Sie selbst machen?
                  </h1>
                  <p className="text-muted-foreground">
                    Wählen Sie Ihren Service-Level – wir passen den Preis transparent an
                  </p>
                </div>

                {/* Slider with Clear Labels */}
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Ich mache mehr
                        </span>
                        <span className="flex items-center gap-1">
                          Umzugsteam übernimmt mehr
                          <Truck className="h-4 w-4" />
                        </span>
                      </div>
                      
                      <Slider
                        value={sliderValue}
                        onValueChange={setSliderValue}
                        max={100}
                        step={20}
                        className="py-4"
                      />
                      
                      {/* Tier Labels under Slider */}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        {SERVICE_TIERS.map(tier => (
                          <Tooltip key={tier.id}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => setSliderValue([tier.percent])}
                                className={cn(
                                  "px-2 py-1 rounded transition-colors",
                                  currentTier.id === tier.id && "bg-primary/10 text-primary font-medium"
                                )}
                              >
                                {tier.percent}%
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-medium">{tier.name}</p>
                              <p className="text-xs">{tier.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    </div>

                    {/* Current Tier Info */}
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <Badge className="mb-1">{currentTier.name}</Badge>
                          <p className="text-sm text-muted-foreground">{currentTier.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">CHF {price.toLocaleString()}</p>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button className="text-xs text-muted-foreground flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                Wie berechnet?
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <p>Basispreis für {currentTier.name} (CHF {currentTier.price}) angepasst an Ihre Wohnungsgröße ({selectedRoom?.label}). Der finale Preis kann je nach Distanz und Stockwerk leicht variieren.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentTier.includes.map(item => (
                          <Badge key={item} variant="secondary" className="text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Room Selection */}
                    <div>
                      <Label className="text-sm mb-2 block">Wohnungsgröße</Label>
                      <div className="flex flex-wrap gap-2">
                        {ROOM_OPTIONS.map(room => (
                          <Button
                            key={room.id}
                            variant={selectedRooms === room.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedRooms(room.id)}
                          >
                            <Home className="h-3 w-3 mr-1" />
                            {room.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4 text-green-600" />
                    Vollkasko-Versicherung
                  </div>
                  <div className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-600" />
                    Fixpreis-Garantie
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-600" />
                    Pünktlichkeits-Garantie
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    4.9/5 Sterne
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Die wichtigsten Details
                  </h1>
                  <p className="text-muted-foreground">
                    Nur 3 Angaben – mehr brauchen wir nicht
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    {/* Address Inputs - Stacked on Mobile */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="from" className="flex items-center gap-1 mb-2">
                          <MapPin className="h-4 w-4" />
                          Von (PLZ + Ort)
                        </Label>
                        <Input
                          id="from"
                          value={fromAddress}
                          onChange={(e) => setFromAddress(e.target.value)}
                          placeholder="z.B. 8048 Zürich"
                          className={cn(errors.fromAddress && "border-destructive")}
                        />
                        {errors.fromAddress && (
                          <p className="text-xs text-destructive mt-1">{errors.fromAddress}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Postleitzahl und Ort genügen
                        </p>
                      </div>

                      <div>
                        <Label htmlFor="to" className="flex items-center gap-1 mb-2">
                          <MapPin className="h-4 w-4" />
                          Nach (PLZ + Ort)
                        </Label>
                        <Input
                          id="to"
                          value={toAddress}
                          onChange={(e) => setToAddress(e.target.value)}
                          placeholder="z.B. 3011 Bern"
                          className={cn(errors.toAddress && "border-destructive")}
                        />
                        {errors.toAddress && (
                          <p className="text-xs text-destructive mt-1">{errors.toAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* Date Selection */}
                    <div>
                      <Label className="flex items-center gap-1 mb-2">
                        <CalendarIcon className="h-4 w-4" />
                        Wunschtermin
                      </Label>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal flex-1",
                                !moveDate && "text-muted-foreground",
                                errors.moveDate && "border-destructive"
                              )}
                              disabled={flexibleDate}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {moveDate ? format(moveDate, "PPP", { locale: de }) : "Datum wählen"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={moveDate}
                              onSelect={setMoveDate}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="flexible"
                            checked={flexibleDate}
                            onCheckedChange={(checked) => setFlexibleDate(checked as boolean)}
                          />
                          <Label htmlFor="flexible" className="text-sm cursor-pointer">
                            Termin noch offen/flexibel
                          </Label>
                        </div>
                      </div>
                      {errors.moveDate && (
                        <p className="text-xs text-destructive mt-1">{errors.moveDate}</p>
                      )}
                    </div>

                    {/* Skip Step 3 Option */}
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Checkbox
                        id="skip3"
                        checked={skipStep3}
                        onCheckedChange={(checked) => setSkipStep3(checked as boolean)}
                      />
                      <Label htmlFor="skip3" className="text-sm cursor-pointer">
                        Übersicht überspringen, direkt zu Kontaktdaten
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Summary */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{currentTier.name} • {selectedRoom?.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {fromAddress || "Von"} → {toAddress || "Nach"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">CHF {price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Richtpreis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Confirmation/Overview */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Ihr Umzugsplan
                  </h1>
                  <p className="text-muted-foreground">
                    Übersicht und was als Nächstes passiert
                  </p>
                </div>

                {/* Summary Card */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Service</p>
                        <p className="font-medium">{currentTier.name}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Wohnung</p>
                        <p className="font-medium">{selectedRoom?.label}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Von</p>
                        <p className="font-medium">{fromAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Nach</p>
                        <p className="font-medium">{toAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Termin</p>
                        <p className="font-medium">
                          {flexibleDate ? "Flexibel" : moveDate ? format(moveDate, "PPP", { locale: de }) : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Preis</p>
                        <p className="font-medium text-primary">CHF {price.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* What Happens Next */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Was passiert nach dem Absenden?
                    </h3>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">1</div>
                        <div>
                          <p className="font-medium">Bestätigung per E-Mail</p>
                          <p className="text-sm text-muted-foreground">Sofort nach Absenden</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">2</div>
                        <div>
                          <p className="font-medium">Offerten von geprüften Firmen</p>
                          <p className="text-sm text-muted-foreground">Innerhalb von 24 Stunden</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">3</div>
                        <div>
                          <p className="font-medium">Sie entscheiden</p>
                          <p className="text-sm text-muted-foreground">Vergleichen und beste Firma wählen</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Testimonials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {TESTIMONIALS.map((t, idx) => (
                    <Card key={idx} className="bg-muted/50">
                      <CardContent className="py-4">
                        <Quote className="h-4 w-4 text-muted-foreground mb-2" />
                        <p className="text-sm italic mb-2">"{t.text}"</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">{t.name}, {t.location}</p>
                          <div className="flex">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 4: Contact */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Fast geschafft!
                  </h1>
                  <p className="text-muted-foreground">
                    Nur noch Ihre Kontaktdaten für die Offerten
                  </p>
                </div>

                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-1 mb-2">
                        <User className="h-4 w-4" />
                        Name
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ihr vollständiger Name"
                        className={cn(errors.name && "border-destructive")}
                      />
                      {errors.name && (
                        <p className="text-xs text-destructive mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-1 mb-2">
                        <Mail className="h-4 w-4" />
                        E-Mail
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ihre@email.ch"
                        className={cn(errors.email && "border-destructive")}
                      />
                      {errors.email && (
                        <p className="text-xs text-destructive mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-1 mb-2">
                        <Phone className="h-4 w-4" />
                        Telefon
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Für Rückfragen der Umzugsfirmen – keine Werbeanrufe!</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="079 123 45 67"
                        className={cn(errors.phone && "border-destructive")}
                      />
                      {errors.phone && (
                        <p className="text-xs text-destructive mt-1">{errors.phone}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Nur für Rückfragen der Umzugsfirmen
                      </p>
                    </div>

                    {/* Large Consent Checkbox */}
                    <div className={cn(
                      "flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors",
                      consent ? "border-primary bg-primary/5" : "border-muted",
                      errors.consent && "border-destructive"
                    )}>
                      <Checkbox
                        id="consent"
                        checked={consent}
                        onCheckedChange={(checked) => setConsent(checked as boolean)}
                        className="mt-1 h-5 w-5"
                      />
                      <div>
                        <Label htmlFor="consent" className="cursor-pointer font-medium">
                          Ich akzeptiere die Datenschutzbestimmungen
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          Ihre Daten werden nur an passende Umzugsfirmen weitergeleitet. 
                          <strong> Keine Werbung, keine Newsletter.</strong>
                        </p>
                      </div>
                    </div>
                    {errors.consent && (
                      <p className="text-xs text-destructive">{errors.consent}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Final Summary */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <p className="font-medium">{currentTier.name} • {selectedRoom?.label}</p>
                        <p className="text-muted-foreground">{fromAddress} → {toAddress}</p>
                        <p className="text-muted-foreground">
                          {flexibleDate ? "Termin flexibel" : moveDate ? format(moveDate, "PPP", { locale: de }) : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">CHF {price.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">
                          Richtpreis (finale Offerte kann leicht abweichen)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between mt-8">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            )}
            <div className="ml-auto">
              {currentStep < 4 ? (
                <Button onClick={nextStep} size="lg">
                  Weiter
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} size="lg" className="bg-primary hover:bg-primary/90">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Kostenlos Offerten erhalten
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden z-50">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button variant="outline" onClick={prevStep} className="flex-shrink-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="flex-1">
                Weiter
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90">
                <Sparkles className="h-4 w-4 mr-2" />
                Kostenlos Offerten erhalten
              </Button>
            )}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-2">
            Kostenlos & unverbindlich • Keine Werbung
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
}