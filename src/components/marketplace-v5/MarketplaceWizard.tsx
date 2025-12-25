import { useState, useCallback } from "react";
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
  Minus
} from "lucide-react";

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
    name: "DIY",
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
    tagline: "Der beliebteste Umzug",
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
    name: "Schnippen",
    tagline: "Wir machen alles",
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

export const MarketplaceWizard = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Progress Header */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Schritt {currentStepIndex + 1} von {STEP_ORDER.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% abgeschlossen</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: Location */}
          {currentStep === "location" && (
            <motion.div
              key="location"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <Badge className="bg-primary/10 text-primary">Schritt 1</Badge>
                <h1 className="text-2xl md:text-3xl font-bold">Wohin zügeln Sie?</h1>
                <p className="text-muted-foreground">Geben Sie Start- und Zieladresse an.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* From */}
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <MapPin className="w-5 h-5" />
                      Auszug (Von)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">PLZ</Label>
                        <Input 
                          placeholder="8000" 
                          value={locationData.fromPlz}
                          onChange={(e) => setLocationData({...locationData, fromPlz: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Ort</Label>
                        <Input 
                          placeholder="Zürich"
                          value={locationData.fromCity}
                          onChange={(e) => setLocationData({...locationData, fromCity: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Stockwerk</Label>
                        <Input 
                          type="number" 
                          min="0"
                          value={locationData.fromFloor}
                          onChange={(e) => setLocationData({...locationData, fromFloor: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Checkbox 
                          id="fromLift"
                          checked={locationData.fromElevator}
                          onCheckedChange={(checked) => setLocationData({...locationData, fromElevator: !!checked})}
                        />
                        <Label htmlFor="fromLift" className="text-sm">Lift vorhanden</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* To */}
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-2 text-green-600 font-semibold">
                      <Home className="w-5 h-5" />
                      Einzug (Nach)
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">PLZ</Label>
                        <Input 
                          placeholder="3000"
                          value={locationData.toPlz}
                          onChange={(e) => setLocationData({...locationData, toPlz: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Ort</Label>
                        <Input 
                          placeholder="Bern"
                          value={locationData.toCity}
                          onChange={(e) => setLocationData({...locationData, toCity: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Stockwerk</Label>
                        <Input 
                          type="number"
                          min="0"
                          value={locationData.toFloor}
                          onChange={(e) => setLocationData({...locationData, toFloor: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-6">
                        <Checkbox 
                          id="toLift"
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
              <Card>
                <CardContent className="p-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Wunschtermin</Label>
                      <Input 
                        type="date"
                        value={locationData.moveDate}
                        onChange={(e) => setLocationData({...locationData, moveDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label>Anzahl Zimmer</Label>
                      <RadioGroup 
                        value={locationData.rooms} 
                        onValueChange={(val) => setLocationData({...locationData, rooms: val})}
                        className="flex gap-2"
                      >
                        {["1", "2", "3", "4", "5+"].map((r) => (
                          <div key={r} className="flex items-center">
                            <RadioGroupItem value={r} id={`room-${r}`} className="sr-only" />
                            <Label 
                              htmlFor={`room-${r}`}
                              className={`px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                                locationData.rooms === r 
                                  ? 'bg-primary text-primary-foreground border-primary' 
                                  : 'bg-muted/50 hover:bg-muted'
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

              <div className="flex justify-end">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <Badge className="bg-primary/10 text-primary">Schritt 2</Badge>
                <h1 className="text-2xl md:text-3xl font-bold">Wählen Sie Ihr Service-Level</h1>
                <p className="text-muted-foreground">Von DIY bis Full-Service – Sie entscheiden.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
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
                      <Badge className="absolute -top-2.5 right-4 bg-primary">Beliebt</Badge>
                    )}
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          selectedService === level.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}>
                          <level.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold">{level.name}</h3>
                          <p className="text-xs text-muted-foreground">{level.tagline}</p>
                        </div>
                      </div>
                      <ul className="space-y-2">
                        {level.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-between">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <Badge className="bg-primary/10 text-primary">Schritt 3</Badge>
                <h1 className="text-2xl md:text-3xl font-bold">Was wird gezügelt?</h1>
                <p className="text-muted-foreground">Video hochladen oder Inventar angeben.</p>
              </div>

              {/* Mode Toggle */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg bg-muted p-1">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      inventoryMode === "video" ? 'bg-background shadow' : ''
                    }`}
                    onClick={() => setInventoryMode("video")}
                  >
                    <Video className="w-4 h-4 inline mr-2" />
                    Video-Upload
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      inventoryMode === "checklist" ? 'bg-background shadow' : ''
                    }`}
                    onClick={() => setInventoryMode("checklist")}
                  >
                    <ClipboardCheck className="w-4 h-4 inline mr-2" />
                    Checkliste
                  </button>
                </div>
              </div>

              {inventoryMode === "video" ? (
                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="p-8 text-center space-y-4">
                    {!videoUploaded ? (
                      <>
                        <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                          <Camera className="w-10 h-10 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">Video-Rundgang hochladen</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Filmen Sie jeden Raum kurz ab (1-3 Min total). Unsere KI erkennt Möbel automatisch.
                          </p>
                        </div>
                        {videoUploading ? (
                          <div className="space-y-2 max-w-xs mx-auto">
                            <Progress value={videoProgress} className="h-2" />
                            <p className="text-sm text-muted-foreground">Wird hochgeladen... {Math.round(videoProgress)}%</p>
                          </div>
                        ) : (
                          <Button onClick={handleVideoUpload}>
                            <Upload className="w-4 h-4 mr-2" />
                            Video auswählen
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                          <CheckCircle2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">Video hochgeladen!</h3>
                          <p className="text-sm text-muted-foreground">
                            Geschätztes Volumen: ~{calculateVolume()}m³ (Konfidenz: 85%)
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {inventory.map((item) => (
                        <div key={item.id} className="flex flex-col items-center p-3 rounded-lg bg-muted/50">
                          <item.icon className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm font-medium text-center mb-2">{item.name}</span>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="icon" 
                              variant="outline" 
                              className="h-7 w-7"
                              onClick={() => updateInventoryCount(item.id, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-6 text-center font-semibold">{item.count}</span>
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

              <div className="flex justify-between">
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <Badge className="bg-green-500/10 text-green-600">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  {offers.length} Angebote gefunden
                </Badge>
                <h1 className="text-2xl md:text-3xl font-bold">Ihre Fixpreis-Offerten</h1>
                <p className="text-muted-foreground">
                  {calculateVolume()}m³ • {SERVICE_LEVELS.find(s => s.id === selectedService)?.name} • {locationData.moveDate || "Flexibles Datum"}
                </p>
              </div>

              <div className="space-y-4">
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
                    <CardContent className="p-4 md:p-5">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Partner Info */}
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                            {offer.logo}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{offer.partner}</h3>
                              {offer.badge && (
                                <Badge variant={offer.recommended ? "default" : "secondary"} className="text-xs">
                                  {offer.badge}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              {offer.rating} ({offer.reviews})
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-2xl font-bold">CHF {offer.price.toLocaleString()}</div>
                          <p className="text-xs text-green-600 font-medium">Fixpreis inkl. MwSt.</p>
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
                              <h4 className="text-sm font-semibold mb-2">Preisaufschlüsselung</h4>
                              <div className="space-y-1 text-sm">
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
                              <h4 className="text-sm font-semibold mb-2">Inklusive</h4>
                              <ul className="space-y-1 text-sm">
                                {offer.features.map((f, i) => (
                                  <li key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
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
                ))}
              </div>

              <div className="flex justify-between">
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
                </Button>
                <Button size="lg" onClick={goNext} disabled={!selectedOffer}>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <Badge className="bg-primary/10 text-primary">Schritt 5</Badge>
                <h1 className="text-2xl md:text-3xl font-bold">Buchung abschliessen</h1>
                <p className="text-muted-foreground">Fast geschafft! Noch ein paar Angaben.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Contact Form */}
                <Card>
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-semibold">Ihre Kontaktdaten</h3>
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label>Name</Label>
                        <Input 
                          placeholder="Vor- und Nachname"
                          value={contactData.name}
                          onChange={(e) => setContactData({...contactData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>E-Mail</Label>
                        <Input 
                          type="email"
                          placeholder="ihre@email.ch"
                          value={contactData.email}
                          onChange={(e) => setContactData({...contactData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Telefon</Label>
                        <Input 
                          type="tel"
                          placeholder="+41 79 123 45 67"
                          value={contactData.phone}
                          onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Summary */}
                <Card className="bg-muted/50">
                  <CardContent className="p-5 space-y-4">
                    <h3 className="font-semibold">Ihre Buchung</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Partner</span>
                        <span className="font-medium">{selectedOfferData.partner}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Termin</span>
                        <span className="font-medium">{locationData.moveDate || "Flexibel"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Service</span>
                        <span className="font-medium">{SERVICE_LEVELS.find(s => s.id === selectedService)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Route</span>
                        <span className="font-medium">{locationData.fromPlz} → {locationData.toPlz}</span>
                      </div>
                      <hr />
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-primary">CHF {selectedOfferData.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox 
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(c) => setTermsAccepted(!!c)}
                      />
                      <Label htmlFor="terms" className="text-xs text-muted-foreground leading-tight">
                        Ich akzeptiere die AGB und Datenschutzbestimmungen und bestätige die Buchung.
                      </Label>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div>
                      <p className="font-semibold">Sichere Zahlung via Stripe</p>
                      <p className="text-xs text-muted-foreground">Kredit-/Debitkarte • TWINT kommt bald</p>
                    </div>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto"
                    onClick={goNext}
                    disabled={!termsAccepted || !contactData.name || !contactData.email}
                  >
                    Jetzt buchen – CHF {selectedOfferData.price.toLocaleString()}
                  </Button>
                </CardContent>
              </Card>

              <div className="flex justify-start">
                <Button variant="ghost" onClick={goBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Zurück
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
              className="text-center space-y-6 py-8"
            >
              <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-2xl md:text-3xl font-bold">Buchung bestätigt!</h1>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Vielen Dank! Sie erhalten in Kürze eine Bestätigung per E-Mail. 
                  Ihr Umzugspartner wird sich 2 Tage vor dem Termin melden.
                </p>
              </div>

              <Card className="max-w-md mx-auto">
                <CardContent className="p-5 space-y-3 text-left">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Buchungsnummer</span>
                    <span className="font-mono font-bold">UCH-2024-{Math.floor(Math.random() * 9000 + 1000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Umzugstermin</span>
                    <span className="font-semibold">{locationData.moveDate || "Wird bestätigt"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Partner</span>
                    <span className="font-semibold">{selectedOfferData?.partner}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total bezahlt</span>
                    <span className="font-bold text-primary">CHF {selectedOfferData?.price.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                {[
                  { icon: Mail, title: "E-Mail Bestätigung", desc: "In wenigen Minuten" },
                  { icon: MessageSquare, title: "Partner kontaktiert Sie", desc: "2 Tage vor Umzug" },
                  { icon: ClipboardCheck, title: "Checkliste verfügbar", desc: "In Ihrem Dashboard" },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 text-left">
                    <item.icon className="w-6 h-6 text-primary mb-2" />
                    <h4 className="font-semibold text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust Footer */}
      <div className="border-t bg-muted/30 py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Fixpreis-Garantie
            </span>
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              4.9/5 (2,340+ Bewertungen)
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Geprüfte Partner
            </span>
            <span className="flex items-center gap-2">
              <Handshake className="w-4 h-4" />
              Swiss Made
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
