/**
 * MarketplaceWizard V5.b - Funnel Layout & Step Engine
 * 
 * V5.b Improvements:
 * - Dedicated funnel mode: no main navigation, no distractions
 * - Sticky bottom CTA per step (always visible)
 * - Consistent step logic with localStorage persistence
 * - Minimal header: Logo + Progress + Help
 * - Decision-free funnel design
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Video, 
  Upload, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Package,
  Truck,
  Camera,
  Star,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  Loader2,
  Sofa,
  Box,
  Monitor,
  Refrigerator,
  Bed,
  CreditCard,
  MessageSquare,
  ClipboardCheck,
  Crown,
  Award,
  Plus,
  Minus,
  HelpCircle,
  X
} from "lucide-react";
import { StickyFooterCTA } from "@/components/calculator-variants/shared/StickyFooterCTA";

type WizardStep = "location" | "service" | "inventory" | "offers" | "booking" | "confirmation";

interface LocationData {
  fromPlz: string;
  fromCity: string;
  fromFloor: number;
  fromElevator: boolean;
  toPlz: string;
  toCity: string;
  toFloor: number;
  toElevator: boolean;
  moveDate: string;
  rooms: string;
}

interface ServiceLevel {
  id: string;
  name: string;
  tagline: string;
  icon: any;
  price_multiplier: number;
  features: string[];
  popular?: boolean;
}

interface InventoryItem {
  id: string;
  name: string;
  icon: any;
  count: number;
  volume: number;
}

interface PartnerOffer {
  id: string;
  partner: string;
  logo: string;
  rating: number;
  reviews: number;
  price: number;
  breakdown: { label: string; amount: number }[];
  features: string[];
  availability: string;
  badge?: string;
  recommended?: boolean;
}

const SERVICE_LEVELS: ServiceLevel[] = [
  {
    id: "diy",
    name: "Basis",
    tagline: "Sie packen, wir transportieren",
    icon: Package,
    price_multiplier: 1.0,
    features: [
      "Transport + Träger",
      "Grundversicherung",
      "Flexible Termine",
    ],
  },
  {
    id: "komfort",
    name: "Komfort",
    tagline: "Meist gewählt – bestes Preis/Leistung",
    icon: Truck,
    price_multiplier: 1.25,
    features: [
      "Transport + Träger",
      "Möbelmontage/-demontage",
      "Packmaterial inkl.",
      "Erweiterte Versicherung",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Wir machen alles für Sie",
    icon: Crown,
    price_multiplier: 1.6,
    features: [
      "Kompletter Packservice",
      "Möbelmontage inkl.",
      "Endreinigung/Abnahme",
      "Priorität & Koordination",
      "Vollkasko-Versicherung",
    ],
  },
];

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: "sofa", name: "Sofa/Couch", icon: Sofa, count: 0, volume: 1.5 },
  { id: "bed", name: "Bett", icon: Bed, count: 0, volume: 1.2 },
  { id: "wardrobe", name: "Kleiderschrank", icon: Box, count: 0, volume: 2.0 },
  { id: "desk", name: "Schreibtisch", icon: Monitor, count: 0, volume: 0.8 },
  { id: "table", name: "Esstisch", icon: Box, count: 0, volume: 0.6 },
  { id: "fridge", name: "Kühlschrank", icon: Refrigerator, count: 0, volume: 0.8 },
  { id: "washer", name: "Waschmaschine", icon: Box, count: 0, volume: 0.5 },
  { id: "boxes", name: "Umzugskartons", icon: Box, count: 0, volume: 0.05 },
];

const STEP_ORDER: WizardStep[] = ["location", "service", "inventory", "offers", "booking", "confirmation"];
const TOTAL_STEPS = 5; // Don't count confirmation as a "step" in progress

const STEP_CONFIG = {
  location: { number: 1, title: "Route", cta: "Weiter zu Service" },
  service: { number: 2, title: "Service", cta: "Weiter zu Inventar" },
  inventory: { number: 3, title: "Inventar", cta: "Offerten anzeigen" },
  offers: { number: 4, title: "Offerten", cta: "Diese Offerte wählen" },
  booking: { number: 5, title: "Buchung", cta: "Jetzt verbindlich buchen" },
  confirmation: { number: 6, title: "Bestätigt", cta: "" },
};

const STORAGE_KEY = 'uc-wizard-v5b-state';

export const MarketplaceWizardV5b = () => {
  // Load persisted state
  const loadPersistedState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load wizard state:', e);
    }
    return null;
  }, []);

  const savedState = loadPersistedState();
  
  const [currentStep, setCurrentStep] = useState<WizardStep>(savedState?.currentStep || "location");
  const [locationData, setLocationData] = useState<LocationData>(savedState?.locationData || {
    fromPlz: "",
    fromCity: "",
    fromFloor: 0,
    fromElevator: false,
    toPlz: "",
    toCity: "",
    toFloor: 0,
    toElevator: false,
    moveDate: "",
    rooms: "3",
  });
  const [selectedService, setSelectedService] = useState<string>(savedState?.selectedService || "komfort");
  const [inventory, setInventory] = useState<InventoryItem[]>(savedState?.inventory || DEFAULT_INVENTORY);
  const [inventoryMode, setInventoryMode] = useState<"video" | "checklist">("video");
  const [videoUploaded, setVideoUploaded] = useState(savedState?.videoUploaded || false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(savedState?.selectedOffer || null);
  const [contactData, setContactData] = useState(savedState?.contactData || { name: "", email: "", phone: "" });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist state on changes
  useEffect(() => {
    if (currentStep !== "confirmation") {
      const state = {
        currentStep,
        locationData,
        selectedService,
        inventory,
        videoUploaded,
        selectedOffer,
        contactData,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [currentStep, locationData, selectedService, inventory, videoUploaded, selectedOffer, contactData]);

  // Clear state on confirmation
  useEffect(() => {
    if (currentStep === "confirmation") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentStep]);

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const stepConfig = STEP_CONFIG[currentStep];
  const progress = currentStep === "confirmation" ? 100 : ((stepConfig.number) / TOTAL_STEPS) * 100;

  // Calculate volume estimate
  const calculateVolume = useCallback(() => {
    const baseVolume = parseInt(locationData.rooms) * 8;
    const inventoryVolume = inventory.reduce((sum, item) => sum + item.count * item.volume, 0);
    return Math.max(baseVolume, inventoryVolume > 0 ? inventoryVolume : baseVolume);
  }, [locationData.rooms, inventory]);

  // Generate partner offers
  const offers = useMemo((): PartnerOffer[] => {
    const volume = calculateVolume();
    const serviceMultiplier = SERVICE_LEVELS.find(s => s.id === selectedService)?.price_multiplier || 1;
    const floorSurcharge = (locationData.fromFloor + locationData.toFloor) * 25;
    const elevatorDiscount = (locationData.fromElevator ? -50 : 0) + (locationData.toElevator ? -50 : 0);

    const partners = [
      { name: "SwissMove AG", rating: 4.9, reviews: 423, baseRate: 35, badge: "Empfohlen", recommended: true },
      { name: "ZüriZügel", rating: 4.7, reviews: 189, baseRate: 32, badge: "Günstig" },
      { name: "Premium Transporte", rating: 5.0, reviews: 87, baseRate: 42, badge: "Premium" },
      { name: "Bernmover GmbH", rating: 4.6, reviews: 312, baseRate: 30 },
      { name: "Express Umzüge", rating: 4.5, reviews: 156, baseRate: 28 },
    ];

    return partners.map((p, i) => {
      const basePrice = Math.round(volume * p.baseRate * serviceMultiplier);
      const totalPrice = basePrice + floorSurcharge + elevatorDiscount;
      
      return {
        id: `offer-${i}`,
        partner: p.name,
        logo: p.name.charAt(0),
        rating: p.rating,
        reviews: p.reviews,
        price: Math.max(totalPrice, 500),
        breakdown: [
          { label: "Grundpreis", amount: basePrice },
          { label: "Etagenzuschlag", amount: floorSurcharge },
          { label: "Lift-Rabatt", amount: elevatorDiscount },
        ],
        features: SERVICE_LEVELS.find(s => s.id === selectedService)?.features || [],
        availability: "Verfügbar am Wunschtermin",
        badge: p.badge,
        recommended: p.recommended,
      };
    }).sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0));
  }, [calculateVolume, selectedService, locationData]);

  const selectedOfferData = offers.find(o => o.id === selectedOffer);

  const updateInventoryCount = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, count: Math.max(0, item.count + delta) } : item
    ));
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Validation per step
  const isStepValid = useMemo(() => {
    switch (currentStep) {
      case "location":
        return locationData.fromPlz.length >= 4 && locationData.toPlz.length >= 4;
      case "service":
        return !!selectedService;
      case "inventory":
        return true; // Always allow to proceed
      case "offers":
        return !!selectedOffer;
      case "booking":
        return termsAccepted && contactData.name.length >= 2 && contactData.email.includes('@');
      default:
        return true;
    }
  }, [currentStep, locationData, selectedService, selectedOffer, termsAccepted, contactData]);

  const handlePrimaryCTA = () => {
    if (currentStep === "booking") {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        goNext();
      }, 1500);
    } else {
      goNext();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex flex-col">
      {/* Minimal Funnel Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Back button or Logo */}
            {currentStepIndex > 0 && currentStep !== "confirmation" ? (
              <button onClick={goBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Zurück</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">UC</span>
                </div>
                <span className="font-semibold text-sm hidden sm:inline">Umzugscheck</span>
              </div>
            )}

            {/* Step indicator */}
            {currentStep !== "confirmation" && (
              <div className="flex-1 max-w-xs mx-4">
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="font-medium">{stepConfig.title}</span>
                  <span className="text-muted-foreground">({stepConfig.number}/{TOTAL_STEPS})</span>
                </div>
                <Progress value={progress} className="h-1.5 mt-1" />
              </div>
            )}

            {/* Help */}
            <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Hilfe</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-32">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <AnimatePresence mode="wait">
            {/* STEP 1: Location */}
            {currentStep === "location" && (
              <motion.div
                key="location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-xl sm:text-2xl font-bold">Wohin zügeln Sie?</h1>
                  <p className="text-sm text-muted-foreground">Start- und Zieladresse eingeben.</p>
                </div>

                {/* From */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <MapPin className="w-4 h-4" />
                      Von (Auszug)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">PLZ *</Label>
                        <Input 
                          placeholder="8000" 
                          value={locationData.fromPlz}
                          onChange={(e) => setLocationData({...locationData, fromPlz: e.target.value})}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Ort</Label>
                        <Input 
                          placeholder="Zürich"
                          value={locationData.fromCity}
                          onChange={(e) => setLocationData({...locationData, fromCity: e.target.value})}
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Stockwerk:</Label>
                        <div className="flex items-center">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => setLocationData({...locationData, fromFloor: Math.max(0, locationData.fromFloor - 1)})}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <div className="h-8 w-10 flex items-center justify-center border-y bg-muted/30 text-sm font-medium">
                            {locationData.fromFloor}
                          </div>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => setLocationData({...locationData, fromFloor: locationData.fromFloor + 1})}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="fromLift"
                          checked={locationData.fromElevator}
                          onCheckedChange={(checked) => setLocationData({...locationData, fromElevator: !!checked})}
                        />
                        <Label htmlFor="fromLift" className="text-sm cursor-pointer">Lift</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* To */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                      <Home className="w-4 h-4" />
                      Nach (Einzug)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs">PLZ *</Label>
                        <Input 
                          placeholder="3000"
                          value={locationData.toPlz}
                          onChange={(e) => setLocationData({...locationData, toPlz: e.target.value})}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Ort</Label>
                        <Input 
                          placeholder="Bern"
                          value={locationData.toCity}
                          onChange={(e) => setLocationData({...locationData, toCity: e.target.value})}
                          className="h-11"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs">Stockwerk:</Label>
                        <div className="flex items-center">
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => setLocationData({...locationData, toFloor: Math.max(0, locationData.toFloor - 1)})}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <div className="h-8 w-10 flex items-center justify-center border-y bg-muted/30 text-sm font-medium">
                            {locationData.toFloor}
                          </div>
                          <Button 
                            size="icon" 
                            variant="outline" 
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => setLocationData({...locationData, toFloor: locationData.toFloor + 1})}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox 
                          id="toLift"
                          checked={locationData.toElevator}
                          onCheckedChange={(checked) => setLocationData({...locationData, toElevator: !!checked})}
                        />
                        <Label htmlFor="toLift" className="text-sm cursor-pointer">Lift</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Date & Rooms */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Wunschtermin
                        </Label>
                        <Input 
                          type="date"
                          value={locationData.moveDate}
                          onChange={(e) => setLocationData({...locationData, moveDate: e.target.value})}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Zimmer</Label>
                        <div className="flex gap-1">
                          {["1", "2", "3", "4", "5+"].map((r) => (
                            <button
                              key={r}
                              className={`flex-1 h-11 rounded-md border text-sm font-medium transition-all ${
                                locationData.rooms === r 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'bg-muted/50 hover:bg-muted border-border'
                              }`}
                              onClick={() => setLocationData({...locationData, rooms: r})}
                            >
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Signal */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Kostenlos & unverbindlich
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500" />
                    4.9/5 Bewertung
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Service Level */}
            {currentStep === "service" && (
              <motion.div
                key="service"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-xl sm:text-2xl font-bold">Welches Service-Level?</h1>
                  <p className="text-sm text-muted-foreground">Wählen Sie Ihren Wunsch-Service.</p>
                </div>

                <div className="space-y-3">
                  {SERVICE_LEVELS.map((level) => (
                    <Card 
                      key={level.id}
                      className={`relative cursor-pointer transition-all ${
                        selectedService === level.id 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setSelectedService(level.id)}
                    >
                      {level.popular && (
                        <Badge className="absolute -top-2.5 left-4 bg-primary">Empfohlen</Badge>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            selectedService === level.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                          }`}>
                            <level.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{level.name}</h3>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{level.tagline}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {level.features.slice(0, 3).map((f, i) => (
                                <span key={i} className="inline-flex items-center gap-1 text-xs bg-muted/50 px-2 py-0.5 rounded">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  {f}
                                </span>
                              ))}
                              {level.features.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{level.features.length - 3} mehr</span>
                              )}
                            </div>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            selectedService === level.id ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                          }`}>
                            {selectedService === level.id && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  Nicht sicher? "Komfort" ist für 78% aller Umzüge die beste Wahl.
                </p>
              </motion.div>
            )}

            {/* STEP 3: Inventory */}
            {currentStep === "inventory" && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-xl sm:text-2xl font-bold">Was wird gezügelt?</h1>
                  <p className="text-sm text-muted-foreground">Video (schneller) oder Checkliste wählen.</p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center">
                  <div className="inline-flex rounded-lg bg-muted p-1">
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        inventoryMode === "video" ? 'bg-background shadow' : ''
                      }`}
                      onClick={() => setInventoryMode("video")}
                    >
                      <Video className="w-4 h-4" />
                      Video
                      <Badge variant="secondary" className="text-[10px] px-1.5">Schnell</Badge>
                    </button>
                    <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                        inventoryMode === "checklist" ? 'bg-background shadow' : ''
                      }`}
                      onClick={() => setInventoryMode("checklist")}
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      Checkliste
                    </button>
                  </div>
                </div>

                {inventoryMode === "video" ? (
                  <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                    <CardContent className="p-6 text-center space-y-4">
                      {!videoUploaded ? (
                        <>
                          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                            <Camera className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Video-Rundgang</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                              60-90 Sek. filmen. Unsere KI erkennt Möbel automatisch.
                            </p>
                          </div>
                          <Button onClick={() => setVideoUploaded(true)}>
                            <Upload className="w-4 h-4 mr-2" />
                            Video hochladen
                          </Button>
                          <button 
                            onClick={() => setInventoryMode("checklist")}
                            className="block w-full text-sm text-muted-foreground hover:text-foreground"
                          >
                            Oder manuell ausfüllen →
                          </button>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold">Video hochgeladen!</h3>
                            <p className="text-sm text-muted-foreground">
                              Geschätztes Volumen: ~{calculateVolume()}m³
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-3">
                        {inventory.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                              <item.icon className="w-5 h-5 text-muted-foreground" />
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7"
                                onClick={() => updateInventoryCount(item.id, -1)}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-6 text-center text-sm font-semibold">{item.count}</span>
                              <Button 
                                size="icon" 
                                variant="outline" 
                                className="h-7 w-7"
                                onClick={() => updateInventoryCount(item.id, 1)}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 p-3 bg-primary/5 rounded-lg text-center">
                        <span className="text-sm text-muted-foreground">Geschätztes Volumen: </span>
                        <span className="font-bold text-primary">~{calculateVolume()}m³</span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* STEP 4: Offers */}
            {currentStep === "offers" && (
              <motion.div
                key="offers"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <Badge className="bg-green-500/10 text-green-600">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    {offers.length} Fixpreis-Offerten
                  </Badge>
                  <h1 className="text-xl sm:text-2xl font-bold">Ihre Offerten</h1>
                  <p className="text-sm text-muted-foreground">
                    {calculateVolume()}m³ • {SERVICE_LEVELS.find(s => s.id === selectedService)?.name} • {locationData.fromPlz} → {locationData.toPlz}
                  </p>
                </div>

                <div className="space-y-3">
                  {offers.map((offer) => (
                    <Card 
                      key={offer.id}
                      className={`cursor-pointer transition-all ${
                        selectedOffer === offer.id 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : offer.recommended 
                            ? 'border-primary/50' 
                            : 'hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedOffer(offer.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {offer.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm">{offer.partner}</h3>
                              {offer.badge && (
                                <Badge variant={offer.recommended ? "default" : "secondary"} className="text-[10px]">
                                  {offer.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {offer.rating} ({offer.reviews} Bewertungen)
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold">CHF {offer.price.toLocaleString()}</div>
                            <p className="text-[10px] text-green-600 font-medium">Fixpreis inkl. MwSt.</p>
                          </div>
                        </div>

                        {selectedOffer === offer.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t space-y-3"
                          >
                            <div>
                              <h4 className="text-xs font-semibold mb-1.5">Warum dieser Preis?</h4>
                              <div className="space-y-1 text-xs">
                                {offer.breakdown.map((b, i) => (
                                  <div key={i} className="flex justify-between">
                                    <span className="text-muted-foreground">{b.label}</span>
                                    <span className={b.amount < 0 ? 'text-green-600' : ''}>
                                      {b.amount >= 0 ? '+' : ''}{b.amount} CHF
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-semibold mb-1.5">Inklusive</h4>
                              <div className="flex flex-wrap gap-1">
                                {offer.features.map((f, i) => (
                                  <span key={i} className="inline-flex items-center gap-1 text-[10px] bg-muted px-1.5 py-0.5 rounded">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-green-500" />
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: Booking */}
            {currentStep === "booking" && selectedOfferData && (
              <motion.div
                key="booking"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <h1 className="text-xl sm:text-2xl font-bold">Fast geschafft!</h1>
                  <p className="text-sm text-muted-foreground">Noch Ihre Kontaktdaten, dann ist die Buchung komplett.</p>
                </div>

                {/* Selected Offer Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {selectedOfferData.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{selectedOfferData.partner}</h3>
                          <p className="text-xs text-muted-foreground">{locationData.moveDate || "Flexibles Datum"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">CHF {selectedOfferData.price.toLocaleString()}</div>
                        <p className="text-[10px] text-green-600">Fixpreis</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card>
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">Ihre Kontaktdaten</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label className="text-xs">Name *</Label>
                        <Input 
                          placeholder="Vor- und Nachname"
                          value={contactData.name}
                          onChange={(e) => setContactData({...contactData, name: e.target.value})}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">E-Mail *</Label>
                        <Input 
                          type="email"
                          placeholder="ihre@email.ch"
                          value={contactData.email}
                          onChange={(e) => setContactData({...contactData, email: e.target.value})}
                          className="h-11"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Telefon (optional)</Label>
                        <Input 
                          type="tel"
                          placeholder="+41 79 123 45 67"
                          value={contactData.phone}
                          onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                          className="h-11"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox 
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(c) => setTermsAccepted(!!c)}
                      />
                      <Label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
                        Ich akzeptiere die AGB und Datenschutzbestimmungen.
                      </Label>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust */}
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    Daten nur an gewählte Firma
                  </span>
                  <span className="flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5" />
                    Sichere Zahlung
                  </span>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Confirmation */}
            {currentStep === "confirmation" && (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6 py-8"
              >
                <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Buchung bestätigt!</h1>
                  <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    Sie erhalten in Kürze eine E-Mail-Bestätigung. Ihr Partner meldet sich 2 Tage vor dem Termin.
                  </p>
                </div>

                <Card className="max-w-sm mx-auto">
                  <CardContent className="p-4 space-y-2 text-left text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Buchungsnummer</span>
                      <span className="font-mono font-bold">UCH-{Math.floor(Math.random() * 9000 + 1000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Termin</span>
                      <span className="font-semibold">{locationData.moveDate || "Wird bestätigt"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Partner</span>
                      <span className="font-semibold">{selectedOfferData?.partner}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-semibold">Total</span>
                      <span className="font-bold text-primary">CHF {selectedOfferData?.price.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <Mail className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-[10px]">E-Mail Bestätigung</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <MessageSquare className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-[10px]">Partner meldet sich</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <ClipboardCheck className="w-5 h-5 text-primary mx-auto mb-1" />
                    <p className="text-[10px]">Checkliste verfügbar</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Sticky Footer CTA */}
      {currentStep !== "confirmation" && (
        <StickyFooterCTA
          primaryLabel={stepConfig.cta}
          onPrimary={handlePrimaryCTA}
          disabled={!isStepValid}
          loading={isSubmitting}
          secondaryLabel={currentStepIndex > 0 ? "Zurück" : undefined}
          onSecondary={currentStepIndex > 0 ? goBack : undefined}
          hint={currentStep === "booking" ? `Fixpreis: CHF ${selectedOfferData?.price.toLocaleString()}` : undefined}
        />
      )}
    </div>
  );
};

export default MarketplaceWizardV5b;
