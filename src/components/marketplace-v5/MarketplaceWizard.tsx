import { useState, useCallback, useEffect } from "react";
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
  Sparkles, 
  Clock, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Package,
  Truck,
  Users,
  Camera,
  Brain,
  Star,
  FileText,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  Building2,
  Loader2,
  Sofa,
  Box,
  Monitor,
  Refrigerator,
  Bed,
  ChevronUp,
  ChevronDown,
  CreditCard,
  MessageSquare,
  ClipboardCheck,
  Zap,
  Crown,
  Handshake,
  Timer,
  Award,
  X,
  Plus,
  Minus,
  Heart,
  ThumbsUp,
  BadgeCheck,
  Smile,
  HeartHandshake
} from "lucide-react";
import { useCaptureMode } from "@/hooks/use-capture-mode";

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
  emoji?: string;
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

// Trust signals & testimonials for emotional connection
const TRUST_SIGNALS = {
  rating: "4.9",
  reviews: "2'847",
  companies: "380+",
  savings: "40%",
  customers: "12'500+",
};

const MINI_TESTIMONIALS = [
  { text: "Super schnell und professionell!", name: "Sandra M.", city: "Zürich", rating: 5 },
  { text: "Bester Preis, super Service!", name: "Marco T.", city: "Basel", rating: 5 },
  { text: "Alles reibungslos geklappt.", name: "Anna K.", city: "Bern", rating: 5 },
];

const SERVICE_LEVELS: ServiceLevel[] = [
  {
    id: "diy",
    name: "DIY",
    tagline: "Sie packen, wir transportieren",
    icon: Package,
    price_multiplier: 1.0,
    emoji: "💪",
    features: [
      "Transport + Träger",
      "Grundversicherung",
      "Flexible Termine",
    ],
  },
  {
    id: "komfort",
    name: "Komfort",
    tagline: "Der beliebteste Umzug",
    icon: Truck,
    price_multiplier: 1.25,
    emoji: "⭐",
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
    name: "Schnippen",
    tagline: "Wir machen alles",
    icon: Crown,
    price_multiplier: 1.6,
    emoji: "👑",
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

// Step Titles with Emotional Copy
const STEP_CONTENT = {
  location: {
    badge: "Schritt 1",
    emoji: "🏠",
    title: "Wo geht die Reise hin?",
    subtitle: "Ihr neues Zuhause wartet bereits auf Sie!",
  },
  service: {
    badge: "Schritt 2",
    emoji: "✨",
    title: "Wie dürfen wir helfen?",
    subtitle: "Wählen Sie Ihr Wohlfühl-Paket – Sie haben die Kontrolle.",
  },
  inventory: {
    badge: "Schritt 3",
    emoji: "📦",
    title: "Was kommt alles mit?",
    subtitle: "Schnell erfasst, präzise geschätzt – keine Überraschungen.",
  },
  offers: {
    badge: "Ihre Angebote",
    emoji: "🎉",
    title: "Geschafft! Hier sind Ihre Angebote",
    subtitle: "Handverlesene Partner, garantierte Fixpreise.",
  },
  booking: {
    badge: "Fast geschafft!",
    emoji: "📝",
    title: "Nur noch ein paar Details",
    subtitle: "Wir kümmern uns um den Rest – versprochen!",
  },
  confirmation: {
    badge: "Erfolgreich!",
    emoji: "🎊",
    title: "Willkommen in der Umzugscheck-Familie!",
    subtitle: "Lehnen Sie sich zurück – wir haben alles im Griff.",
  },
};

export const MarketplaceWizard = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  const [currentStep, setCurrentStep] = useState<WizardStep>("location");
  const [locationData, setLocationData] = useState<LocationData>({
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
  const [selectedService, setSelectedService] = useState<string>("komfort");
  const [inventory, setInventory] = useState<InventoryItem[]>(DEFAULT_INVENTORY);
  const [inventoryMode, setInventoryMode] = useState<"video" | "checklist">("checklist");
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [contactData, setContactData] = useState({ name: "", email: "", phone: "" });
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Capture mode: jump to step and prefill data
  useEffect(() => {
    if (isCaptureMode && captureStep !== null) {
      const stepMap: Record<number, WizardStep> = { 1: "location", 2: "service", 3: "inventory", 4: "offers", 5: "booking", 6: "confirmation" };
      const targetStep = stepMap[captureStep];
      if (targetStep) {
        setCurrentStep(targetStep);
        setLocationData({
          fromPlz: demoData.fromPostal,
          fromCity: demoData.fromCity,
          fromFloor: demoData.floor,
          fromElevator: demoData.hasElevator,
          toPlz: demoData.toPostal,
          toCity: demoData.toCity,
          toFloor: 1,
          toElevator: true,
          moveDate: demoData.moveDate,
          rooms: String(demoData.rooms),
        });
        setContactData({ name: demoData.name, email: demoData.email, phone: demoData.phone });
        setTermsAccepted(demoData.privacyAccepted);
        if (captureStep >= 4) setSelectedOffer("offer-0");
      }
    }
  }, [isCaptureMode, captureStep, demoData]);

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / STEP_ORDER.length) * 100;

  // Calculate volume estimate
  const calculateVolume = () => {
    const baseVolume = parseInt(locationData.rooms) * 8; // ~8m³ per room
    const inventoryVolume = inventory.reduce((sum, item) => sum + item.count * item.volume, 0);
    return Math.max(baseVolume, inventoryVolume > 0 ? inventoryVolume : baseVolume);
  };

  // Generate partner offers
  const generateOffers = (): PartnerOffer[] => {
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
  };

  const handleVideoUpload = () => {
    setVideoUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setVideoUploading(false);
          setVideoUploaded(true);
        }, 500);
      }
      setVideoProgress(progress);
    }, 300);
  };

  const updateInventoryCount = (id: string, delta: number) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, count: Math.max(0, item.count + delta) } : item
    ));
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
    }
  };

  const offers = generateOffers();
  const selectedOfferData = offers.find(o => o.id === selectedOffer);

  const stepContent = STEP_CONTENT[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Enhanced Progress Header with Trust */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="max-w-3xl mx-auto">
            {/* Trust Micro-Bar (Mobile First) */}
            <div className="flex items-center justify-center gap-4 mb-3 text-xs">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <BadgeCheck className="w-3.5 h-3.5" /> Geprüft
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600 font-medium">
                <Star className="w-3.5 h-3.5 fill-current" /> {TRUST_SIGNALS.rating}
              </span>
              <span className="inline-flex items-center gap-1 text-primary font-medium">
                <Shield className="w-3.5 h-3.5" /> Fixpreis
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-foreground">
                {stepContent.emoji} {stepContent.badge}
              </span>
              <span className="text-xs text-muted-foreground">
                {Math.round(progress)}% geschafft!
              </span>
            </div>
            <Progress value={progress} className="h-2.5 bg-muted" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          {/* STEP 1: Location */}
          {currentStep === "location" && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Emotional Header */}
              <div className="text-center space-y-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-emerald-500/10 border border-primary/20"
                >
                  <span className="text-xl">{stepContent.emoji}</span>
                  <span className="text-sm font-semibold text-primary">{stepContent.badge}</span>
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {stepContent.title}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {stepContent.subtitle}
                </p>
              </div>

              {/* Mini Testimonial (Mobile) */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:hidden"
              >
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-amber-500/10 dark:to-emerald-500/10 border border-amber-200/50 dark:border-amber-500/20">
                  <div className="flex -space-x-2">
                    {["👩", "👨", "👩‍🦱"].map((emoji, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-white dark:bg-muted border-2 border-white dark:border-background flex items-center justify-center text-sm">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">
                      "{MINI_TESTIMONIALS[0].text}"
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {MINI_TESTIMONIALS[0].name} • {MINI_TESTIMONIALS[0].city}
                    </p>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                {/* From */}
                <Card className="border-2 border-primary/20 shadow-lg shadow-primary/5 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span>Von hier 📍</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">PLZ</Label>
                        <Input 
                          placeholder="8000"
                          className="h-12 text-base"
                          inputMode="numeric"
                          value={locationData.fromPlz}
                          onChange={(e) => setLocationData({...locationData, fromPlz: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Ort</Label>
                        <Input 
                          placeholder="Zürich"
                          className="h-12 text-base"
                          value={locationData.fromCity}
                          onChange={(e) => setLocationData({...locationData, fromCity: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Stockwerk</Label>
                        <Input 
                          type="number" 
                          min="0"
                          className="h-12 text-base"
                          inputMode="numeric"
                          value={locationData.fromFloor}
                          onChange={(e) => setLocationData({...locationData, fromFloor: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Checkbox 
                          id="fromLift"
                          className="h-5 w-5"
                          checked={locationData.fromElevator}
                          onCheckedChange={(checked) => setLocationData({...locationData, fromElevator: !!checked})}
                        />
                        <Label htmlFor="fromLift" className="text-sm">Lift vorhanden</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* To */}
                <Card className="border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/5 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-emerald-500 to-emerald-500/50" />
                  <CardContent className="p-4 md:p-5 space-y-4">
                    <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                        <Home className="w-4 h-4" />
                      </div>
                      <span>Nach hier 🏡</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">PLZ</Label>
                        <Input 
                          placeholder="3000"
                          className="h-12 text-base"
                          inputMode="numeric"
                          value={locationData.toPlz}
                          onChange={(e) => setLocationData({...locationData, toPlz: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Ort</Label>
                        <Input 
                          placeholder="Bern"
                          className="h-12 text-base"
                          value={locationData.toCity}
                          onChange={(e) => setLocationData({...locationData, toCity: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium">Stockwerk</Label>
                        <Input 
                          type="number"
                          min="0"
                          className="h-12 text-base"
                          inputMode="numeric"
                          value={locationData.toFloor}
                          onChange={(e) => setLocationData({...locationData, toFloor: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Checkbox 
                          id="toLift"
                          className="h-5 w-5"
                          checked={locationData.toElevator}
                          onCheckedChange={(checked) => setLocationData({...locationData, toElevator: !!checked})}
                        />
                        <Label htmlFor="toLift" className="text-sm">Lift vorhanden</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Date & Rooms */}
              <Card className="border shadow-sm">
                <CardContent className="p-4 md:p-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-medium flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        Wunschtermin
                      </Label>
                      <Input 
                        type="date"
                        className="h-12 text-base"
                        value={locationData.moveDate}
                        onChange={(e) => setLocationData({...locationData, moveDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-medium flex items-center gap-2">
                        <Home className="w-4 h-4 text-primary" />
                        Anzahl Zimmer
                      </Label>
                      <RadioGroup 
                        value={locationData.rooms} 
                        onValueChange={(val) => setLocationData({...locationData, rooms: val})}
                        className="flex flex-wrap gap-2"
                      >
                        {["1", "2", "3", "4", "5+"].map((r) => (
                          <div key={r} className="flex items-center">
                            <RadioGroupItem value={r} id={`room-${r}`} className="sr-only" />
                            <Label 
                              htmlFor={`room-${r}`}
                              className={`min-w-[48px] h-12 flex items-center justify-center rounded-xl border-2 cursor-pointer transition-all text-base font-semibold touch-manipulation ${
                                locationData.rooms === r 
                                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25' 
                                  : 'bg-muted/50 hover:bg-muted border-transparent'
                              }`}
                            >
                              {r}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sticky CTA (Mobile) */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t shadow-lg md:hidden z-30">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/25"
                  onClick={goNext} 
                  disabled={!locationData.fromPlz || !locationData.toPlz}
                >
                  Weiter zur Service-Auswahl
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  ✓ Kostenlos & unverbindlich
                </p>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex justify-end">
                <Button size="lg" onClick={goNext} disabled={!locationData.fromPlz || !locationData.toPlz}>
                  Weiter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Service Level */}
          {currentStep === "service" && (
            <motion.div
              key="service"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Emotional Header */}
              <div className="text-center space-y-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20"
                >
                  <span className="text-xl">{stepContent.emoji}</span>
                  <span className="text-sm font-semibold text-primary">{stepContent.badge}</span>
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  {stepContent.title}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {stepContent.subtitle}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {SERVICE_LEVELS.map((level, idx) => (
                  <motion.div
                    key={level.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      className={`relative cursor-pointer transition-all h-full touch-manipulation ${
                        selectedService === level.id 
                          ? 'border-2 border-primary ring-4 ring-primary/20 shadow-xl shadow-primary/10' 
                          : 'hover:border-primary/50 hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedService(level.id)}
                    >
                      {level.popular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg">
                          ⭐ Beliebt
                        </Badge>
                      )}
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                            selectedService === level.id 
                              ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg' 
                              : 'bg-muted'
                          }`}>
                            {level.emoji}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{level.name}</h3>
                            <p className="text-xs text-muted-foreground">{level.tagline}</p>
                          </div>
                        </div>
                        <ul className="space-y-2.5">
                          {level.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                        {selectedService === level.id && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-center gap-2 pt-2 text-primary font-semibold"
                          >
                            <BadgeCheck className="w-5 h-5" />
                            Ausgewählt
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center gap-4 py-2">
                <div className="flex -space-x-2">
                  {["👩", "👨", "👩‍🦱", "👨‍🦳"].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center text-sm">
                      {emoji}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{TRUST_SIGNALS.customers}</span> zufriedene Kunden
                </p>
              </div>

              {/* Sticky CTA (Mobile) */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t shadow-lg md:hidden z-30">
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" onClick={goBack} className="h-14">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 h-14 text-base font-semibold shadow-lg shadow-primary/25"
                    onClick={goNext}
                  >
                    Weiter zum Inventar
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex justify-between">
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
                <Button size="lg" onClick={goNext}>
                  Weiter
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Inventory */}
          {currentStep === "inventory" && (
            <motion.div
              key="inventory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Emotional Header */}
              <div className="text-center space-y-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-amber-500/10 border border-primary/20"
                >
                  <span className="text-xl">{stepContent.emoji}</span>
                  <span className="text-sm font-semibold text-primary">{stepContent.badge}</span>
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold">{stepContent.title}</h1>
                <p className="text-muted-foreground max-w-md mx-auto">{stepContent.subtitle}</p>
              </div>

              {/* Mode Toggle */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-xl bg-muted p-1.5 shadow-inner">
                  <button
                    className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all touch-manipulation ${
                      inventoryMode === "video" ? 'bg-background shadow-lg text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setInventoryMode("video")}
                  >
                    <Camera className="w-4 h-4 inline mr-2" />
                    Video 📹
                  </button>
                  <button
                    className={`px-5 py-3 rounded-lg text-sm font-semibold transition-all touch-manipulation ${
                      inventoryMode === "checklist" ? 'bg-background shadow-lg text-primary' : 'text-muted-foreground'
                    }`}
                    onClick={() => setInventoryMode("checklist")}
                  >
                    <ClipboardCheck className="w-4 h-4 inline mr-2" />
                    Liste ✏️
                  </button>
                </div>
              </div>

              {inventoryMode === "video" ? (
                <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-purple-500/5">
                  <CardContent className="p-6 md:p-8 text-center space-y-4">
                    {!videoUploaded ? (
                      <>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mx-auto">
                          <Camera className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">📹 Video-Rundgang hochladen</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Filmen Sie jeden Raum kurz ab – unsere KI erkennt alles automatisch!
                          </p>
                        </div>
                        {videoUploading ? (
                          <div className="space-y-2 max-w-xs mx-auto">
                            <Progress value={videoProgress} className="h-3" />
                            <p className="text-sm text-muted-foreground">🔄 Wird analysiert... {Math.round(videoProgress)}%</p>
                          </div>
                        ) : (
                          <Button size="lg" className="h-14 px-8" onClick={handleVideoUpload}>
                            <Upload className="w-5 h-5 mr-2" />
                            Video auswählen
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                          <CheckCircle2 className="w-10 h-10 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">✅ Video hochgeladen!</h3>
                          <p className="text-sm text-muted-foreground">
                            Geschätztes Volumen: <span className="font-bold text-primary">~{calculateVolume()}m³</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="shadow-lg">
                  <CardContent className="p-4 md:p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {inventory.map((item) => (
                        <div key={item.id} className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                          <item.icon className="w-8 h-8 text-primary/70 mb-2" />
                          <span className="text-sm font-medium text-center mb-3">{item.name}</span>
                          <div className="flex items-center gap-1">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-10 w-10 rounded-full touch-manipulation"
                              onClick={() => updateInventoryCount(item.id, -1)}
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="w-8 text-center font-bold text-lg">{item.count}</span>
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-10 w-10 rounded-full touch-manipulation"
                              onClick={() => updateInventoryCount(item.id, 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-emerald-500/10 rounded-xl text-center border border-primary/20">
                      <span className="text-sm text-muted-foreground">📦 Geschätztes Volumen: </span>
                      <span className="font-bold text-lg text-primary">~{calculateVolume()}m³</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Sticky CTA (Mobile) */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t shadow-lg md:hidden z-30">
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" onClick={goBack} className="h-14">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 h-14 text-base font-semibold shadow-lg shadow-primary/25"
                    onClick={goNext}
                  >
                    🎉 Offerten anzeigen
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex justify-between">
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
                <Button size="lg" onClick={goNext}>
                  Offerten anzeigen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Offers */}
          {currentStep === "offers" && (
            <motion.div
              key="offers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Emotional Header */}
              <div className="text-center space-y-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20"
                >
                  <span className="text-xl">{stepContent.emoji}</span>
                  <span className="text-sm font-semibold text-emerald-600">{offers.length} Angebote gefunden!</span>
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {stepContent.title}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {stepContent.subtitle}
                </p>
                
                {/* Summary Pills */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                    📦 {calculateVolume()}m³
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-purple-500/10 text-purple-600 px-3 py-1.5 rounded-full font-medium">
                    {SERVICE_LEVELS.find(s => s.id === selectedService)?.emoji} {SERVICE_LEVELS.find(s => s.id === selectedService)?.name}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs bg-emerald-500/10 text-emerald-600 px-3 py-1.5 rounded-full font-medium">
                    📅 {locationData.moveDate || "Flexibel"}
                  </span>
                </div>
              </div>

              {/* Celebration Mini-Banner */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-primary/5 dark:from-emerald-500/10 dark:to-primary/10 border border-emerald-200/50 dark:border-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xl shadow-lg">
                    🎉
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">Super! Sie haben bis zu {TRUST_SIGNALS.savings} gespart</p>
                    <p className="text-sm text-muted-foreground">Wählen Sie jetzt Ihren Favoriten aus</p>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-4">
                {offers.map((offer, idx) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all touch-manipulation ${
                        selectedOffer === offer.id 
                          ? 'border-2 border-primary ring-4 ring-primary/20 shadow-xl shadow-primary/10' 
                          : offer.recommended 
                            ? 'border-2 border-emerald-500/50 shadow-lg hover:shadow-xl' 
                            : 'hover:border-primary/30 hover:shadow-lg'
                      }`}
                      onClick={() => setSelectedOffer(offer.id)}
                    >
                      {offer.recommended && (
                        <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-t-lg" />
                      )}
                      <CardContent className="p-4 md:p-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                          {/* Partner Info */}
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold shadow-md ${
                              offer.recommended 
                                ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-white' 
                                : 'bg-gradient-to-br from-primary/10 to-primary/5 text-primary'
                            }`}>
                              {offer.logo}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="font-bold text-lg">{offer.partner}</h3>
                                {offer.badge && (
                                  <Badge className={`text-xs ${
                                    offer.recommended 
                                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm' 
                                      : 'bg-muted'
                                  }`}>
                                    {offer.recommended ? '⭐ ' : ''}{offer.badge}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(offer.rating) ? 'fill-current' : 'opacity-30'}`} />
                                  ))}
                                </div>
                                <span className="font-medium">{offer.rating}</span>
                                <span className="text-muted-foreground">({offer.reviews} Bewertungen)</span>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between md:block md:text-right">
                            <div>
                              <div className="text-2xl md:text-3xl font-bold text-foreground">CHF {offer.price.toLocaleString()}</div>
                              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 md:justify-end">
                                <Shield className="w-3 h-3" />
                                Fixpreis inkl. MwSt.
                              </p>
                            </div>
                            {selectedOffer === offer.id && (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="md:hidden"
                              >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                                  <CheckCircle2 className="w-5 h-5 text-white" />
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>

                        {/* Breakdown (expandable) */}
                        {selectedOffer === offer.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-4 pt-4 border-t"
                          >
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                  <FileText className="w-4 h-4 text-primary" />
                                  Preisaufschlüsselung
                                </h4>
                                <div className="space-y-1.5 text-sm">
                                  {offer.breakdown.map((b, i) => (
                                    <div key={i} className="flex justify-between py-1 border-b border-dashed border-muted last:border-0">
                                      <span className="text-muted-foreground">{b.label}</span>
                                      <span className={`font-medium ${b.amount < 0 ? 'text-emerald-600' : ''}`}>
                                        {b.amount >= 0 ? '+' : ''}{b.amount} CHF
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                  Inklusive
                                </h4>
                                <ul className="space-y-1.5 text-sm">
                                  {offer.features.map((f, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                      {f}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Sticky CTA (Mobile) */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t shadow-lg md:hidden z-30">
                <div className="flex gap-3">
                  <Button variant="ghost" size="lg" onClick={goBack} className="h-14">
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    className="flex-1 h-14 text-base font-semibold shadow-lg shadow-primary/25"
                    onClick={goNext}
                    disabled={!selectedOffer}
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Diese Offerte buchen
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  ✓ Fixpreis-Garantie • ✓ Kostenlose Stornierung
                </p>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex justify-between">
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
                <Button size="lg" onClick={goNext} disabled={!selectedOffer} className="shadow-lg">
                  <Heart className="w-4 h-4 mr-2" />
                  Diese Offerte buchen
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Booking */}
          {currentStep === "booking" && selectedOfferData && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Emotional Header */}
              <div className="text-center space-y-3">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-rose-500/10 border border-primary/20"
                >
                  <span className="text-xl">{stepContent.emoji}</span>
                  <span className="text-sm font-semibold text-primary">{stepContent.badge}</span>
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold">{stepContent.title}</h1>
                <p className="text-muted-foreground max-w-md mx-auto">{stepContent.subtitle}</p>
              </div>

              {/* Selected Partner Mini-Card */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="p-4 rounded-xl bg-gradient-to-r from-primary/5 to-emerald-500/5 border border-primary/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white text-lg font-bold shadow-lg">
                    {selectedOfferData.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{selectedOfferData.partner}</h3>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedOfferData.reviews} Bewertungen</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">CHF {selectedOfferData.price.toLocaleString()}</div>
                    <p className="text-xs text-emerald-600 font-medium">Fixpreis</p>
                  </div>
                </div>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Form */}
                <Card className="border-2 shadow-lg overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary to-primary/50" />
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Ihre Kontaktdaten
                    </h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Name *</Label>
                        <Input 
                          placeholder="Vor- und Nachname"
                          className="h-12 text-base"
                          value={contactData.name}
                          onChange={(e) => setContactData({...contactData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">E-Mail *</Label>
                        <Input 
                          type="email"
                          placeholder="ihre@email.ch"
                          className="h-12 text-base"
                          value={contactData.email}
                          onChange={(e) => setContactData({...contactData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm font-medium">Telefon (optional)</Label>
                        <Input 
                          type="tel"
                          placeholder="+41 79 123 45 67"
                          className="h-12 text-base"
                          value={contactData.phone}
                          onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="bg-gradient-to-br from-muted/50 to-muted/30 shadow-lg">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-primary" />
                      Ihre Buchungsübersicht
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> Partner
                        </span>
                        <span className="font-semibold">{selectedOfferData.partner}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Termin
                        </span>
                        <span className="font-semibold">{locationData.moveDate || "Flexibel"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Package className="w-4 h-4" /> Service
                        </span>
                        <span className="font-semibold">{SERVICE_LEVELS.find(s => s.id === selectedService)?.emoji} {SERVICE_LEVELS.find(s => s.id === selectedService)?.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Route
                        </span>
                        <span className="font-semibold">{locationData.fromPlz} → {locationData.toPlz}</span>
                      </div>
                      <div className="flex justify-between py-3 bg-primary/5 rounded-lg px-3 -mx-1">
                        <span className="font-bold text-lg">Total</span>
                        <span className="font-bold text-xl text-primary">CHF {selectedOfferData.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 pt-3 p-3 bg-background rounded-lg border">
                      <Checkbox 
                        id="terms"
                        className="h-5 w-5 mt-0.5"
                        checked={termsAccepted}
                        onCheckedChange={(c) => setTermsAccepted(!!c)}
                      />
                      <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                        Ich akzeptiere die <span className="text-primary underline">AGB</span> und <span className="text-primary underline">Datenschutzbestimmungen</span> und bestätige die Buchung.
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment CTA */}
              <Card className="border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-emerald-500/5 shadow-lg">
                <CardContent className="p-5 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white shadow-lg">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold">Sichere Zahlung via Stripe</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-2">
                        <Shield className="w-3 h-3" />
                        Kredit-/Debitkarte • TWINT • Apple Pay
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sticky CTA (Mobile) */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t shadow-lg md:hidden z-30">
                <Button 
                  size="lg" 
                  className="w-full h-14 text-base font-semibold shadow-lg shadow-primary/25"
                  onClick={goNext}
                  disabled={!termsAccepted || !contactData.name || !contactData.email}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Jetzt buchen – CHF {selectedOfferData.price.toLocaleString()}
                </Button>
                <div className="flex items-center justify-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Sicher</span>
                  <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Fixpreis</span>
                </div>
              </div>

              {/* Desktop CTA */}
              <div className="hidden md:flex justify-between items-center">
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg shadow-lg"
                  onClick={goNext}
                  disabled={!termsAccepted || !contactData.name || !contactData.email}
                >
                  Jetzt buchen – CHF {selectedOfferData.price.toLocaleString()}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: Confirmation */}
          {currentStep === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8 py-8"
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10, stiffness: 100 }}
                className="relative"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                {/* Celebration Particles */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {["🎉", "⭐", "🎊", "✨"].map((emoji, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0], 
                        scale: [0.5, 1.2, 0.8],
                        x: [0, (i % 2 === 0 ? 40 : -40) * (i + 1) * 0.5],
                        y: [0, -30 - i * 10],
                      }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1.5 }}
                      className="absolute text-2xl"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
              
              {/* Emotional Success Message */}
              <div className="space-y-3">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20"
                >
                  <span className="text-xl">{stepContent.emoji}</span>
                  <span className="text-sm font-semibold text-emerald-600">{stepContent.badge}</span>
                </motion.div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  {stepContent.title}
                </h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {stepContent.subtitle}
                </p>
              </div>

              {/* Booking Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="max-w-md mx-auto border-2 shadow-xl overflow-hidden">
                  <div className="h-2 bg-gradient-to-r from-emerald-400 via-primary to-emerald-400" />
                  <CardContent className="p-6 space-y-4 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Buchungsnummer</span>
                      <span className="font-mono font-bold text-primary bg-primary/10 px-3 py-1 rounded-lg">
                        UCH-2025-{Math.floor(Math.random() * 9000 + 1000)}
                      </span>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Calendar className="w-4 h-4" /> Umzugstermin
                        </span>
                        <span className="font-semibold">{locationData.moveDate || "Wird bestätigt"}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <Building2 className="w-4 h-4" /> Partner
                        </span>
                        <span className="font-semibold">{selectedOfferData?.partner}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-dashed">
                        <span className="text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> Route
                        </span>
                        <span className="font-semibold">{locationData.fromPlz} → {locationData.toPlz}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 bg-emerald-500/10 rounded-xl px-4 -mx-2">
                        <span className="font-bold text-lg flex items-center gap-2">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Bezahlt
                        </span>
                        <span className="font-bold text-xl text-emerald-600">CHF {selectedOfferData?.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto"
              >
                {[
                  { icon: Mail, emoji: "📧", title: "E-Mail Bestätigung", desc: "In wenigen Minuten", color: "from-primary/10 to-primary/5" },
                  { icon: Phone, emoji: "📞", title: "Partner kontaktiert Sie", desc: "2 Tage vor Umzug", color: "from-purple-500/10 to-purple-500/5" },
                  { icon: ClipboardCheck, emoji: "✅", title: "Checkliste verfügbar", desc: "In Ihrem Dashboard", color: "from-emerald-500/10 to-emerald-500/5" },
                ].map((item, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`p-5 rounded-xl bg-gradient-to-br ${item.color} border text-left hover:shadow-md transition-shadow`}
                  >
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Testimonial */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="max-w-md mx-auto p-4 rounded-xl bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-500/10 dark:to-amber-500/5 border border-amber-200/50 dark:border-amber-500/20"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">💬</div>
                  <div>
                    <p className="text-sm italic text-foreground">
                      "Alles super geklappt! Der Umzug war stressfrei und das Team sehr professionell."
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">— Sandra M., Zürich</p>
                    <div className="flex text-amber-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced Trust Footer */}
      <div className="border-t bg-gradient-to-r from-muted/50 via-muted/30 to-muted/50 py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm">
            <span className="flex items-center gap-2 font-medium">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              Fixpreis-Garantie
            </span>
            <span className="flex items-center gap-2 font-medium">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              {TRUST_SIGNALS.rating}/5 ({TRUST_SIGNALS.reviews}+ Bewertungen)
            </span>
            <span className="flex items-center gap-2 font-medium">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <BadgeCheck className="w-4 h-4 text-emerald-600" />
              </div>
              {TRUST_SIGNALS.companies} geprüfte Partner
            </span>
            <span className="flex items-center gap-2 font-medium">
              <div className="w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center">
                <HeartHandshake className="w-4 h-4 text-rose-500" />
              </div>
              Swiss Made 🇨🇭
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
