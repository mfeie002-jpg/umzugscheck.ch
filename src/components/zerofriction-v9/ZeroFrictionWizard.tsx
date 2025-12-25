/**
 * V9 - Zero Friction Wizard
 * 
 * The ultimate moving experience: From "I need to move" to "It's done" in under 3 minutes.
 * 
 * Core Philosophy:
 * - Minimal input, maximum output
 * - AI does the thinking, user just confirms
 * - Every step reduces anxiety, not increases it
 * - Price transparency from second one
 * - One-click everything
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  ArrowRight,
  Sparkles,
  Video,
  Camera,
  CheckCircle,
  Clock,
  Shield,
  Star,
  Truck,
  Package,
  Brush,
  Trash2,
  Sofa,
  CalendarDays,
  Phone,
  Mail,
  User,
  CreditCard,
  Lock,
  Gift,
  TrendingDown,
  Zap,
  Home,
  Building,
  ChevronRight,
  ChevronDown,
  Play,
  Eye,
  MessageSquare,
  ThumbsUp,
  Award,
  Timer,
  Wallet,
  FileCheck,
  HeartHandshake,
  Loader2,
  Check,
  Info,
  AlertCircle,
  Banknote,
  Receipt,
  Users,
  Settings,
  LayoutGrid,
  List,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ============================================
// TYPES
// ============================================

type WizardStep = 
  | 'start'           // Just addresses - instant price range
  | 'refine'          // Optional: Video scan or quick details
  | 'service'         // Service level slider (0-100)
  | 'customize'       // Add-ons & date (smart defaults)
  | 'confirm'         // Summary + contact + pay
  | 'success';        // Booking confirmed + next steps

interface MoveData {
  fromZip: string;
  fromCity: string;
  toZip: string;
  toCity: string;
  rooms: number;
  floor: number;
  hasElevator: boolean;
  moveDate: string;
  flexibleDate: boolean;
  serviceLevel: number; // 0-100
  addons: {
    packing: boolean;
    cleaning: boolean;
    disposal: boolean;
    storage: boolean;
    furniture: boolean;
    admin: boolean; // eUmzug, Ummeldungen
  };
  videoScanned: boolean;
  inventoryItems: number;
  estimatedVolume: number; // m³
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  comments: string;
}

interface PriceBreakdown {
  transport: number;
  labor: number;
  packing: number;
  cleaning: number;
  disposal: number;
  storage: number;
  furniture: number;
  admin: number;
  insurance: number;
  total: number;
  savings: number;
}

// ============================================
// CONSTANTS
// ============================================

const SERVICE_TIERS = [
  { 
    level: 0, 
    name: "Self-Move", 
    emoji: "🚐",
    desc: "Du packst, wir fahren",
    includes: ["Transport", "Fahrer"],
    color: "bg-slate-100 border-slate-300",
    multiplier: 0.4
  },
  { 
    level: 25, 
    name: "Basis", 
    emoji: "📦",
    desc: "Transport + Träger",
    includes: ["Transport", "2 Träger", "Basisversicherung"],
    color: "bg-blue-50 border-blue-300",
    multiplier: 0.7
  },
  { 
    level: 50, 
    name: "Komfort", 
    emoji: "⭐",
    desc: "Wir machen das Schwere",
    includes: ["Transport", "3 Träger", "Möbelmontage", "Vollversicherung"],
    color: "bg-green-50 border-green-300",
    popular: true,
    multiplier: 1.0
  },
  { 
    level: 75, 
    name: "Premium", 
    emoji: "💎",
    desc: "Rundum-Sorglos",
    includes: ["Alles von Komfort", "Packen", "Auspacken", "Endreinigung"],
    color: "bg-purple-50 border-purple-300",
    multiplier: 1.8
  },
  { 
    level: 100, 
    name: "White Glove", 
    emoji: "👑",
    desc: "Fingerschnippen & fertig",
    includes: ["Komplettservice", "Concierge", "Ummeldungen", "Garantie"],
    color: "bg-amber-50 border-amber-300",
    multiplier: 3.2
  },
];

const ADDONS = [
  { id: 'packing', name: 'Ein- & Auspacken', icon: Package, price: 480, desc: 'Profis packen alles sicher ein' },
  { id: 'cleaning', name: 'Endreinigung', icon: Brush, price: 450, desc: 'Abnahmegarantie inklusive' },
  { id: 'disposal', name: 'Entsorgung', icon: Trash2, price: 280, desc: 'Wir nehmen mit, was weg muss' },
  { id: 'storage', name: 'Zwischenlagerung', icon: Building, price: 15, desc: 'Pro Tag, sichere Lagerbox' },
  { id: 'furniture', name: 'Möbelmontage', icon: Sofa, price: 320, desc: 'De- und Remontage' },
  { id: 'admin', name: 'Admin-Paket', icon: FileCheck, price: 150, desc: 'eUmzug, Ummeldungen, alles' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const calculatePrice = (data: MoveData): PriceBreakdown => {
  const basePrice = 800 + (data.rooms * 200) + (data.estimatedVolume * 15);
  const tier = SERVICE_TIERS.find(t => t.level <= data.serviceLevel) || SERVICE_TIERS[0];
  const tierMultiplier = tier.multiplier + ((data.serviceLevel - tier.level) / 100);
  
  const transport = Math.round(basePrice * 0.3 * tierMultiplier);
  const labor = Math.round(basePrice * 0.5 * tierMultiplier);
  const insurance = Math.round((transport + labor) * 0.05);
  
  const packing = data.addons.packing ? 480 : 0;
  const cleaning = data.addons.cleaning ? 450 : 0;
  const disposal = data.addons.disposal ? 280 : 0;
  const storage = data.addons.storage ? 15 * 7 : 0; // 1 week default
  const furniture = data.addons.furniture ? 320 : 0;
  const admin = data.addons.admin ? 150 : 0;
  
  const total = transport + labor + insurance + packing + cleaning + disposal + storage + furniture + admin;
  const marketPrice = total * 1.25; // Competitors charge ~25% more
  const savings = Math.round(marketPrice - total);
  
  return { transport, labor, packing, cleaning, disposal, storage, furniture, admin, insurance, total, savings };
};

const getEstimatedVolume = (rooms: number): number => {
  const volumeMap: Record<number, number> = {
    1: 15, 2: 25, 3: 35, 4: 45, 5: 55, 6: 70
  };
  return volumeMap[rooms] || 35;
};

const formatCHF = (amount: number): string => {
  return `CHF ${amount.toLocaleString('de-CH')}`;
};

// ============================================
// SUB-COMPONENTS
// ============================================

const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: string[] }) => (
  <div className="flex items-center justify-center gap-2 mb-6">
    {steps.map((_, index) => (
      <div
        key={index}
        className={cn(
          "h-2 rounded-full transition-all duration-300",
          index < currentStep ? "w-8 bg-primary" :
          index === currentStep ? "w-12 bg-primary" :
          "w-8 bg-muted"
        )}
      />
    ))}
  </div>
);

const TrustBar = () => (
  <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground py-3 border-t border-border/50">
    <span className="flex items-center gap-1">
      <Shield className="h-3.5 w-3.5 text-green-600" />
      100% Fixpreis
    </span>
    <span className="flex items-center gap-1">
      <Star className="h-3.5 w-3.5 text-amber-500" />
      4.9/5 (2'847 Bewertungen)
    </span>
    <span className="flex items-center gap-1">
      <Lock className="h-3.5 w-3.5 text-blue-600" />
      Sichere Zahlung
    </span>
    <span className="flex items-center gap-1">
      <Award className="h-3.5 w-3.5 text-purple-600" />
      Schweizer Qualität
    </span>
  </div>
);

const QuickPriceDisplay = ({ price, savings }: { price: number; savings: number }) => (
  <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">Ihr Fixpreis</p>
        <p className="text-3xl font-bold text-primary">{formatCHF(price)}</p>
      </div>
      <div className="text-right">
        <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          {formatCHF(savings)} gespart
        </Badge>
        <p className="text-xs text-muted-foreground mt-1">vs. Marktdurchschnitt</p>
      </div>
    </div>
  </div>
);

// ============================================
// MAIN WIZARD COMPONENT
// ============================================

export function ZeroFrictionWizard() {
  const [step, setStep] = useState<WizardStep>('start');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showVideoOption, setShowVideoOption] = useState(false);
  
  const [moveData, setMoveData] = useState<MoveData>({
    fromZip: '',
    fromCity: '',
    toZip: '',
    toCity: '',
    rooms: 3,
    floor: 2,
    hasElevator: true,
    moveDate: '',
    flexibleDate: true,
    serviceLevel: 50,
    addons: {
      packing: false,
      cleaning: true, // Smart default: most people need this
      disposal: false,
      storage: false,
      furniture: true, // Smart default
      admin: false,
    },
    videoScanned: false,
    inventoryItems: 0,
    estimatedVolume: 35,
    contact: { name: '', email: '', phone: '' },
    comments: '',
  });

  const [priceBreakdown, setPriceBreakdown] = useState<PriceBreakdown | null>(null);

  // Calculate price whenever relevant data changes
  useEffect(() => {
    if (moveData.fromZip && moveData.toZip) {
      const breakdown = calculatePrice(moveData);
      setPriceBreakdown(breakdown);
    }
  }, [moveData]);

  // Auto-fill city from ZIP (simplified)
  const handleZipChange = (field: 'fromZip' | 'toZip', value: string) => {
    setMoveData(prev => {
      const cityField = field === 'fromZip' ? 'fromCity' : 'toCity';
      const cities: Record<string, string> = {
        '8001': 'Zürich', '8002': 'Zürich', '8003': 'Zürich', '8004': 'Zürich',
        '3011': 'Bern', '3012': 'Bern', '3013': 'Bern',
        '4001': 'Basel', '4051': 'Basel', '4052': 'Basel',
        '6003': 'Luzern', '6004': 'Luzern', '6005': 'Luzern',
        '9000': 'St. Gallen', '9001': 'St. Gallen',
        '5000': 'Aarau', '5001': 'Aarau',
        '8400': 'Winterthur', '8401': 'Winterthur',
      };
      return {
        ...prev,
        [field]: value,
        [cityField]: cities[value] || prev[cityField],
        estimatedVolume: getEstimatedVolume(prev.rooms),
      };
    });
  };

  const handleServiceLevelChange = (value: number[]) => {
    setMoveData(prev => ({ ...prev, serviceLevel: value[0] }));
  };

  const handleAddonToggle = (addonId: string) => {
    setMoveData(prev => ({
      ...prev,
      addons: {
        ...prev.addons,
        [addonId]: !prev.addons[addonId as keyof typeof prev.addons],
      }
    }));
  };

  const handleSubmit = async () => {
    setIsCalculating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success("Buchung erfolgreich!", {
      description: "Sie erhalten in Kürze eine Bestätigung per E-Mail."
    });
    
    setStep('success');
    setIsCalculating(false);
  };

  const goNext = () => {
    const stepOrder: WizardStep[] = ['start', 'refine', 'service', 'customize', 'confirm', 'success'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex < stepOrder.length - 1) {
      setStep(stepOrder[currentIndex + 1]);
    }
  };

  const goBack = () => {
    const stepOrder: WizardStep[] = ['start', 'refine', 'service', 'customize', 'confirm', 'success'];
    const currentIndex = stepOrder.indexOf(step);
    if (currentIndex > 0) {
      setStep(stepOrder[currentIndex - 1]);
    }
  };

  const skipToConfirm = () => {
    setStep('confirm');
  };

  // Get current tier info
  const currentTier = SERVICE_TIERS.reduce((prev, curr) => 
    curr.level <= moveData.serviceLevel ? curr : prev
  , SERVICE_TIERS[0]);

  const stepTitles = ['Start', 'Details', 'Service', 'Extras', 'Buchen'];
  const stepIndex = ['start', 'refine', 'service', 'customize', 'confirm'].indexOf(step);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <Badge variant="secondary" className="mb-3 bg-primary/10 text-primary border-primary/20">
          <Zap className="h-3 w-3 mr-1" />
          Zero Friction Umzug
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
          {step === 'success' ? 'Geschafft! 🎉' : 'Umzug in 3 Minuten gebucht'}
        </h1>
        <p className="text-muted-foreground">
          {step === 'success' 
            ? 'Ihr Umzug ist bestätigt' 
            : 'Fixpreis • Keine versteckten Kosten • Schweizer Qualität'}
        </p>
      </div>

      {step !== 'success' && (
        <StepIndicator currentStep={stepIndex} steps={stepTitles} />
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1: START - Just addresses */}
        {step === 'start' && (
          <motion.div
            key="start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Address inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        Von (PLZ)
                      </Label>
                      <Input
                        placeholder="z.B. 8001"
                        value={moveData.fromZip}
                        onChange={(e) => handleZipChange('fromZip', e.target.value)}
                        className="text-lg h-12"
                        maxLength={4}
                      />
                      {moveData.fromCity && (
                        <p className="text-sm text-muted-foreground">{moveData.fromCity}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-500" />
                        Nach (PLZ)
                      </Label>
                      <Input
                        placeholder="z.B. 3011"
                        value={moveData.toZip}
                        onChange={(e) => handleZipChange('toZip', e.target.value)}
                        className="text-lg h-12"
                        maxLength={4}
                      />
                      {moveData.toCity && (
                        <p className="text-sm text-muted-foreground">{moveData.toCity}</p>
                      )}
                    </div>
                  </div>

                  {/* Quick room selector */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Wohnungsgrösse</Label>
                    <div className="grid grid-cols-6 gap-2">
                      {[1, 2, 3, 4, 5, 6].map((rooms) => (
                        <Button
                          key={rooms}
                          type="button"
                          variant={moveData.rooms === rooms ? "default" : "outline"}
                          className={cn(
                            "h-12 text-lg font-medium",
                            moveData.rooms === rooms && "ring-2 ring-primary ring-offset-2"
                          )}
                          onClick={() => setMoveData(prev => ({ 
                            ...prev, 
                            rooms,
                            estimatedVolume: getEstimatedVolume(rooms)
                          }))}
                        >
                          {rooms}{rooms === 6 ? '+' : ''}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      ~{moveData.estimatedVolume} m³ geschätzt
                    </p>
                  </div>

                  {/* Instant price preview */}
                  {moveData.fromZip && moveData.toZip && priceBreakdown && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-4"
                    >
                      <Separator />
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-green-600" />
                            <span className="font-medium text-green-800">Sofort-Schätzung</span>
                          </div>
                          <Badge className="bg-green-600">Live</Badge>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-3xl font-bold text-green-700">
                              {formatCHF(Math.round(priceBreakdown.total * 0.85))} - {formatCHF(Math.round(priceBreakdown.total * 1.15))}
                            </p>
                            <p className="text-sm text-green-600">
                              Je nach Service-Level & Extras
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-green-600">Marktpreis</p>
                            <p className="text-sm line-through text-muted-foreground">
                              {formatCHF(Math.round(priceBreakdown.total * 1.4))}
                            </p>
                          </div>
                        </div>
                      </div>

                      <Button 
                        className="w-full h-14 text-lg font-semibold"
                        onClick={goNext}
                      >
                        Weiter zum Fixpreis
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>

                      <p className="text-center text-xs text-muted-foreground">
                        Kostenlos & unverbindlich • Keine Registrierung nötig
                      </p>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
            <TrustBar />
          </motion.div>
        )}

        {/* STEP 2: REFINE - Video scan or quick details */}
        {step === 'refine' && (
          <motion.div
            key="refine"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-semibold mb-2">Genaueren Preis erhalten</h2>
                  <p className="text-muted-foreground text-sm">
                    Optional: Video-Scan für exakten Fixpreis
                  </p>
                </div>

                {/* Video scan option */}
                <div 
                  className={cn(
                    "border-2 rounded-xl p-5 cursor-pointer transition-all",
                    showVideoOption 
                      ? "border-primary bg-primary/5" 
                      : "border-dashed border-muted-foreground/30 hover:border-primary/50"
                  )}
                  onClick={() => setShowVideoOption(!showVideoOption)}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">KI Video-Scan</h3>
                        <Badge variant="secondary" className="text-xs">Empfohlen</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Filmen Sie Ihre Wohnung in 60 Sekunden. Unsere KI erkennt alle Möbel und berechnet den exakten Preis.
                      </p>
                      {showVideoOption && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mt-4 p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="flex items-center justify-center gap-4">
                            <Button variant="outline" className="flex-1">
                              <Camera className="h-4 w-4 mr-2" />
                              Kamera starten
                            </Button>
                            <Button variant="outline" className="flex-1">
                              <Video className="h-4 w-4 mr-2" />
                              Video hochladen
                            </Button>
                          </div>
                          <p className="text-xs text-center text-muted-foreground mt-3">
                            Ihre Daten werden verschlüsselt und nach der Analyse gelöscht
                          </p>
                        </motion.div>
                      )}
                    </div>
                    <div className="shrink-0">
                      <ChevronDown className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        showVideoOption && "rotate-180"
                      )} />
                    </div>
                  </div>
                </div>

                {/* Quick details as alternative */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-3 text-sm text-muted-foreground">
                      oder schnelle Details
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Stockwerk</Label>
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((floor) => (
                        <Button
                          key={floor}
                          type="button"
                          size="sm"
                          variant={moveData.floor === floor ? "default" : "outline"}
                          onClick={() => setMoveData(prev => ({ ...prev, floor }))}
                          className="flex-1"
                        >
                          {floor === 0 ? 'EG' : floor}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Lift vorhanden?</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={moveData.hasElevator ? "default" : "outline"}
                        onClick={() => setMoveData(prev => ({ ...prev, hasElevator: true }))}
                        className="flex-1"
                      >
                        Ja
                      </Button>
                      <Button
                        type="button"
                        variant={!moveData.hasElevator ? "default" : "outline"}
                        onClick={() => setMoveData(prev => ({ ...prev, hasElevator: false }))}
                        className="flex-1"
                      >
                        Nein
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Updated price with details */}
                {priceBreakdown && (
                  <QuickPriceDisplay 
                    price={priceBreakdown.total} 
                    savings={priceBreakdown.savings} 
                  />
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={goBack} className="flex-1">
                    Zurück
                  </Button>
                  <Button onClick={goNext} className="flex-[2]">
                    Service wählen
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 3: SERVICE - The 0-100 slider */}
        {step === 'service' && (
          <motion.div
            key="service"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-semibold mb-2">Wie viel übernehmen wir?</h2>
                  <p className="text-muted-foreground text-sm">
                    Schieben Sie den Regler – der Preis passt sich an
                  </p>
                </div>

                {/* Current tier display */}
                <div className={cn(
                  "rounded-xl p-4 border-2 transition-all",
                  currentTier.color
                )}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{currentTier.emoji}</span>
                      <div>
                        <h3 className="font-bold text-lg">{currentTier.name}</h3>
                        <p className="text-sm text-muted-foreground">{currentTier.desc}</p>
                      </div>
                    </div>
                    {currentTier.popular && (
                      <Badge className="bg-green-600">Beliebt</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {currentTier.includes.map((item, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* The magic slider */}
                <div className="space-y-4 py-4">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Ich mache mehr
                    </span>
                    <span className="flex items-center gap-1">
                      Ihr macht alles
                      <Users className="h-4 w-4" />
                    </span>
                  </div>
                  
                  <Slider
                    value={[moveData.serviceLevel]}
                    onValueChange={handleServiceLevelChange}
                    max={100}
                    step={5}
                    className="py-4"
                  />

                  <div className="flex justify-between">
                    {SERVICE_TIERS.map((tier) => (
                      <button
                        key={tier.level}
                        onClick={() => setMoveData(prev => ({ ...prev, serviceLevel: tier.level }))}
                        className={cn(
                          "text-xs px-2 py-1 rounded transition-all",
                          moveData.serviceLevel >= tier.level 
                            ? "text-primary font-medium" 
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {tier.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price update */}
                {priceBreakdown && (
                  <QuickPriceDisplay 
                    price={priceBreakdown.total} 
                    savings={priceBreakdown.savings} 
                  />
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={goBack} className="flex-1">
                    Zurück
                  </Button>
                  <Button onClick={goNext} className="flex-[2]">
                    Extras & Datum
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 4: CUSTOMIZE - Add-ons & date */}
        {step === 'customize' && (
          <motion.div
            key="customize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-semibold mb-2">Extras & Umzugsdatum</h2>
                  <p className="text-muted-foreground text-sm">
                    Wir haben die beliebtesten Optionen vorausgewählt
                  </p>
                </div>

                {/* Date picker */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Wunschtermin
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      type="date"
                      value={moveData.moveDate}
                      onChange={(e) => setMoveData(prev => ({ ...prev, moveDate: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2 px-3 border rounded-md">
                      <Switch
                        id="flexible"
                        checked={moveData.flexibleDate}
                        onCheckedChange={(checked) => setMoveData(prev => ({ ...prev, flexibleDate: checked }))}
                      />
                      <Label htmlFor="flexible" className="text-sm cursor-pointer">
                        ±3 Tage flexibel
                      </Label>
                    </div>
                  </div>
                  {moveData.flexibleDate && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Gift className="h-3 w-3" />
                      Flexibilität kann bis zu 15% sparen!
                    </p>
                  )}
                </div>

                <Separator />

                {/* Add-ons grid */}
                <div className="space-y-3">
                  <Label>Zusatzleistungen</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ADDONS.map((addon) => {
                      const isActive = moveData.addons[addon.id as keyof typeof moveData.addons];
                      const Icon = addon.icon;
                      return (
                        <div
                          key={addon.id}
                          onClick={() => handleAddonToggle(addon.id)}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all",
                            isActive 
                              ? "border-primary bg-primary/5" 
                              : "border-muted hover:border-primary/50"
                          )}
                        >
                          <div className={cn(
                            "p-2 rounded-lg",
                            isActive ? "bg-primary text-primary-foreground" : "bg-muted"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{addon.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{addon.desc}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={cn(
                              "text-sm font-medium",
                              isActive ? "text-primary" : "text-muted-foreground"
                            )}>
                              +{formatCHF(addon.price)}
                            </p>
                            <div className={cn(
                              "h-5 w-5 rounded-full border-2 flex items-center justify-center ml-auto",
                              isActive ? "border-primary bg-primary" : "border-muted-foreground/30"
                            )}>
                              {isActive && <Check className="h-3 w-3 text-primary-foreground" />}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Updated total */}
                {priceBreakdown && (
                  <QuickPriceDisplay 
                    price={priceBreakdown.total} 
                    savings={priceBreakdown.savings} 
                  />
                )}

                <div className="flex gap-3">
                  <Button variant="outline" onClick={goBack} className="flex-1">
                    Zurück
                  </Button>
                  <Button onClick={goNext} className="flex-[2]">
                    Zur Buchung
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 5: CONFIRM - Summary + contact + pay */}
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-6 space-y-6">
                <div className="text-center mb-2">
                  <h2 className="text-xl font-semibold mb-2">Fast geschafft!</h2>
                  <p className="text-muted-foreground text-sm">
                    Prüfen und buchen – Zahlung erst nach dem Umzug
                  </p>
                </div>

                {/* Summary card */}
                <div className="bg-muted/50 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Route</span>
                    <span className="font-medium">
                      {moveData.fromCity || moveData.fromZip} → {moveData.toCity || moveData.toZip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Wohnung</span>
                    <span className="font-medium">{moveData.rooms}-Zimmer</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Service</span>
                    <span className="font-medium">{currentTier.emoji} {currentTier.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Datum</span>
                    <span className="font-medium">
                      {moveData.moveDate || 'Flexibel'} {moveData.flexibleDate && '(±3 Tage)'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Fixpreis (inkl. MwSt.)</span>
                    <span className="text-xl font-bold text-primary">
                      {priceBreakdown && formatCHF(priceBreakdown.total)}
                    </span>
                  </div>
                </div>

                {/* Contact form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Name *
                      </Label>
                      <Input
                        placeholder="Ihr Name"
                        value={moveData.contact.name}
                        onChange={(e) => setMoveData(prev => ({
                          ...prev,
                          contact: { ...prev.contact, name: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Telefon
                      </Label>
                      <Input
                        type="tel"
                        placeholder="+41 79 123 45 67"
                        value={moveData.contact.phone}
                        onChange={(e) => setMoveData(prev => ({
                          ...prev,
                          contact: { ...prev.contact, phone: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-Mail *
                    </Label>
                    <Input
                      type="email"
                      placeholder="ihre@email.ch"
                      value={moveData.contact.email}
                      onChange={(e) => setMoveData(prev => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bemerkungen (optional)</Label>
                    <Textarea
                      placeholder="Besondere Wünsche, Zugangsinformationen..."
                      value={moveData.comments}
                      onChange={(e) => setMoveData(prev => ({ ...prev, comments: e.target.value }))}
                      className="resize-none"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Payment note */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-3">
                  <Wallet className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Zahlung nach dem Umzug</p>
                    <p className="text-xs text-green-600">
                      Sie zahlen erst, wenn Sie zufrieden sind. Rechnung, TWINT oder Karte.
                    </p>
                  </div>
                </div>

                {/* Submit button */}
                <Button 
                  className="w-full h-14 text-lg font-semibold"
                  onClick={handleSubmit}
                  disabled={!moveData.contact.name || !moveData.contact.email || isCalculating}
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Wird gebucht...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Verbindlich buchen
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Mit der Buchung akzeptieren Sie unsere{' '}
                  <a href="/agb" className="underline hover:text-primary">AGB</a> und{' '}
                  <a href="/datenschutz" className="underline hover:text-primary">Datenschutzerklärung</a>
                </p>

                <Button variant="ghost" onClick={goBack} className="w-full">
                  Zurück
                </Button>
              </CardContent>
            </Card>
            <TrustBar />
          </motion.div>
        )}

        {/* STEP 6: SUCCESS */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Card className="border-2 border-green-200 shadow-lg bg-gradient-to-b from-green-50 to-background">
              <CardContent className="p-8 text-center space-y-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-green-800 mb-2">
                    Buchung bestätigt!
                  </h2>
                  <p className="text-muted-foreground">
                    Bestätigung wurde an <strong>{moveData.contact.email}</strong> gesendet
                  </p>
                </div>

                <div className="bg-white rounded-xl p-4 border text-left space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Was passiert jetzt?
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <span>Wir bestätigen Ihren Termin innerhalb von 2 Stunden</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <span>3 Tage vor dem Umzug: Ihr persönlicher Ansprechpartner meldet sich</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <span>Am Umzugstag: Live-Tracking in Ihrer App</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" asChild>
                    <a href="/">Zur Startseite</a>
                  </Button>
                  <Button asChild>
                    <a href="/dashboard">Zum Dashboard</a>
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground">
                  Buchungsnummer: <strong className="font-mono">UC-2024-{Math.random().toString(36).substring(2, 8).toUpperCase()}</strong>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ZeroFrictionWizard;
