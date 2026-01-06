/**
 * MarketplaceWizard V5.c - Archetype 2026: "Invisible Interface"
 * 
 * V5.c Features (based on strategic UX research):
 * - Glassmorphism design with Swiss Trust Minimalism
 * - AI Video Scan as primary option (scanner-first)
 * - Smart Presets: pre-filled inventory based on room count
 * - Dynamic pricing engine with instant estimates
 * - Micro-animations and morphing transitions
 * - Value-first: show price before asking for data
 */

import { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
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
  Calendar,
  MapPin,
  Home,
  Sparkles,
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
  Zap,
  Lock,
  TrendingUp,
  Building2,
  Navigation
} from "lucide-react";
import { StickyFooterCTA } from "@/components/calculator-variants/shared/StickyFooterCTA";

type WizardStep = "route" | "volume" | "offers" | "contact" | "success";

interface RouteData {
  fromPlz: string;
  fromCity: string;
  fromFloor: number;
  fromElevator: boolean;
  toPlz: string;
  toCity: string;
  toFloor: number;
  toElevator: boolean;
  moveDate: string;
  rooms: number;
  serviceLevel: "basis" | "komfort" | "premium";
}

interface InventoryPreset {
  rooms: number;
  volume: number;
  items: { name: string; count: number }[];
}

// Smart presets based on Swiss household data
const INVENTORY_PRESETS: InventoryPreset[] = [
  { rooms: 1.5, volume: 12, items: [{ name: "Sofa", count: 1 }, { name: "Bett", count: 1 }, { name: "Kartons", count: 15 }] },
  { rooms: 2.5, volume: 20, items: [{ name: "Sofa", count: 1 }, { name: "Bett", count: 1 }, { name: "Schrank", count: 1 }, { name: "Kartons", count: 25 }] },
  { rooms: 3.5, volume: 28, items: [{ name: "Sofa", count: 1 }, { name: "Bett", count: 2 }, { name: "Schränke", count: 2 }, { name: "Kartons", count: 35 }] },
  { rooms: 4.5, volume: 38, items: [{ name: "Sofas", count: 2 }, { name: "Betten", count: 3 }, { name: "Schränke", count: 3 }, { name: "Kartons", count: 50 }] },
  { rooms: 5.5, volume: 48, items: [{ name: "Sofas", count: 2 }, { name: "Betten", count: 4 }, { name: "Schränke", count: 4 }, { name: "Kartons", count: 60 }] },
];

const SERVICE_LEVELS = [
  { id: "basis", name: "Basis", multiplier: 1.0, desc: "Transport + Träger" },
  { id: "komfort", name: "Komfort", multiplier: 1.25, desc: "Inkl. Montage & Packmaterial", recommended: true },
  { id: "premium", name: "Premium", multiplier: 1.6, desc: "Full-Service + Reinigung" },
];

const STEP_ORDER: WizardStep[] = ["route", "volume", "offers", "contact", "success"];
const TOTAL_VISIBLE_STEPS = 4;

const STEP_CONFIG: Record<WizardStep, { number: number; title: string; cta: string }> = {
  route: { number: 1, title: "Route", cta: "Volumen schätzen" },
  volume: { number: 2, title: "Volumen", cta: "Preise anzeigen" },
  offers: { number: 3, title: "Offerten", cta: "Diese Offerte wählen" },
  contact: { number: 4, title: "Abschluss", cta: "Unverbindlich anfragen" },
  success: { number: 5, title: "Fertig", cta: "" },
};

const STORAGE_KEY = 'uc-wizard-v5c-state';

export const MarketplaceWizardV5c = () => {
  const loadState = useCallback(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  }, []);

  const saved = loadState();

  const [currentStep, setCurrentStep] = useState<WizardStep>(saved?.currentStep || "route");
  const [routeData, setRouteData] = useState<RouteData>(saved?.routeData || {
    fromPlz: "",
    fromCity: "",
    fromFloor: 0,
    fromElevator: false,
    toPlz: "",
    toCity: "",
    toFloor: 0,
    toElevator: false,
    moveDate: "",
    rooms: 3.5,
    serviceLevel: "komfort",
  });
  const [volumeMode, setVolumeMode] = useState<"auto" | "manual">("auto");
  const [customVolume, setCustomVolume] = useState(0);
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(saved?.selectedOffer || null);
  const [contactData, setContactData] = useState(saved?.contactData || { name: "", email: "", phone: "" });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Persist state
  useEffect(() => {
    if (currentStep !== "success") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentStep, routeData, selectedOffer, contactData
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentStep, routeData, selectedOffer, contactData]);

  const currentStepIndex = STEP_ORDER.indexOf(currentStep);
  const stepConfig = STEP_CONFIG[currentStep];
  const progress = currentStep === "success" ? 100 : ((stepConfig.number) / TOTAL_VISIBLE_STEPS) * 100;

  // Calculate volume from room preset or custom
  const estimatedVolume = useMemo(() => {
    if (volumeMode === "manual" && customVolume > 0) return customVolume;
    if (videoUploaded) return Math.round(routeData.rooms * 8.5);
    const preset = INVENTORY_PRESETS.find(p => p.rooms === routeData.rooms) || INVENTORY_PRESETS[2];
    return preset.volume;
  }, [routeData.rooms, volumeMode, customVolume, videoUploaded]);

  // Real-time price calculation
  const priceEstimate = useMemo(() => {
    const baseRate = 32; // CHF per m³
    const serviceMultiplier = SERVICE_LEVELS.find(s => s.id === routeData.serviceLevel)?.multiplier || 1;
    const floorSurcharge = (routeData.fromFloor + routeData.toFloor) * 25;
    const elevatorDiscount = (routeData.fromElevator ? -50 : 0) + (routeData.toElevator ? -50 : 0);
    
    const base = Math.round(estimatedVolume * baseRate * serviceMultiplier);
    const total = Math.max(base + floorSurcharge + elevatorDiscount, 500);
    
    return {
      min: Math.round(total * 0.85),
      max: Math.round(total * 1.15),
      avg: total,
    };
  }, [estimatedVolume, routeData]);

  // Generate offers
  const offers = useMemo(() => {
    const partners = [
      { name: "SwissMove AG", rating: 4.9, reviews: 423, priceOffset: 0, badge: "Empfohlen", recommended: true },
      { name: "ZüriZügel", rating: 4.7, reviews: 189, priceOffset: -80, badge: "Günstigster" },
      { name: "Premium Transporte", rating: 5.0, reviews: 87, priceOffset: 150, badge: "Bestbewertet" },
    ];

    return partners.map((p, i) => ({
      id: `offer-${i}`,
      partner: p.name,
      rating: p.rating,
      reviews: p.reviews,
      price: priceEstimate.avg + p.priceOffset,
      badge: p.badge,
      recommended: p.recommended,
      features: SERVICE_LEVELS.find(s => s.id === routeData.serviceLevel)?.desc || "",
    }));
  }, [priceEstimate, routeData.serviceLevel]);

  const selectedOfferData = offers.find(o => o.id === selectedOffer);

  const goNext = () => {
    const next = currentStepIndex + 1;
    if (next < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[next]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    const prev = currentStepIndex - 1;
    if (prev >= 0) {
      setCurrentStep(STEP_ORDER[prev]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isValid = useMemo(() => {
    switch (currentStep) {
      case "route": return routeData.fromPlz.length >= 4 && routeData.toPlz.length >= 4;
      case "volume": return true;
      case "offers": return !!selectedOffer;
      case "contact": return privacyAccepted && contactData.name.length >= 2 && contactData.email.includes('@');
      default: return true;
    }
  }, [currentStep, routeData, selectedOffer, privacyAccepted, contactData]);

  const handleSubmit = () => {
    if (currentStep === "contact") {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-background to-blue-50/30 flex flex-col">
      {/* Quick Win V5c: Intro Toast für neue Benutzer */}
      {currentStep === "route" && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-primary/95 text-primary-foreground px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm">
            <span className="animate-pulse">↵</span>
            <span>Drücken Sie Enter oder nutzen Sie die Buttons</span>
          </div>
        </div>
      )}

      {/* Glassmorphism Header mit verbesserter Sichtbarkeit */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {currentStepIndex > 0 && currentStep !== "success" ? (
              <button 
                onClick={goBack} 
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors touch-manipulation px-3 py-2 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only sm:not-sr-only">Zurück</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                  <Sparkles className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-sm hidden sm:block">Umzugscheck</span>
              </div>
            )}

            {currentStep !== "success" && (
              <div className="flex-1 max-w-[200px] mx-4">
                <div className="flex items-center justify-center gap-1.5 text-xs mb-1">
                  {STEP_ORDER.slice(0, 4).map((step, i) => (
                    <div 
                      key={step}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i < stepConfig.number ? 'bg-primary' : 'bg-muted'
                      } ${i === stepConfig.number - 1 ? 'w-4' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 pb-36">
        <div className="container mx-auto px-4 py-6 max-w-xl">
          <LayoutGroup>
            <AnimatePresence mode="wait">
              {/* STEP 1: Route */}
              {currentStep === "route" && (
                <motion.div
                  key="route"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Wohin geht's?</h1>
                    <p className="text-sm text-muted-foreground">Route eingeben – Rest übernehmen wir.</p>
                  </div>

                  {/* From Card */}
                  <Card className="overflow-hidden border-0 shadow-xl shadow-black/5 bg-background/80 backdrop-blur">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-primary font-medium text-sm">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        Auszug
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <Input 
                          placeholder="PLZ" 
                          value={routeData.fromPlz}
                          onChange={(e) => setRouteData({...routeData, fromPlz: e.target.value})}
                          className="col-span-2 h-12 text-center font-medium"
                        />
                        <Input 
                          placeholder="Ort"
                          value={routeData.fromCity}
                          onChange={(e) => setRouteData({...routeData, fromCity: e.target.value})}
                          className="col-span-3 h-12"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Stock:</span>
                            <div className="flex items-center bg-muted rounded-lg">
                              <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-l-lg transition-colors touch-manipulation"
                                onClick={() => setRouteData({...routeData, fromFloor: Math.max(0, routeData.fromFloor - 1)})}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-medium text-sm">{routeData.fromFloor}</span>
                              <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-r-lg transition-colors touch-manipulation"
                                onClick={() => setRouteData({...routeData, fromFloor: routeData.fromFloor + 1})}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox 
                            checked={routeData.fromElevator}
                            onCheckedChange={(c) => setRouteData({...routeData, fromElevator: !!c})}
                          />
                          <span className="text-sm">Lift</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arrow */}
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-b from-primary/10 to-green-500/10 flex items-center justify-center">
                      <Navigation className="w-5 h-5 text-primary rotate-180" />
                    </div>
                  </div>

                  {/* To Card */}
                  <Card className="overflow-hidden border-0 shadow-xl shadow-black/5 bg-background/80 backdrop-blur">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
                        <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Home className="w-3.5 h-3.5" />
                        </div>
                        Einzug
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <Input 
                          placeholder="PLZ" 
                          value={routeData.toPlz}
                          onChange={(e) => setRouteData({...routeData, toPlz: e.target.value})}
                          className="col-span-2 h-12 text-center font-medium"
                        />
                        <Input 
                          placeholder="Ort"
                          value={routeData.toCity}
                          onChange={(e) => setRouteData({...routeData, toCity: e.target.value})}
                          className="col-span-3 h-12"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Building2 className="w-4 h-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Stock:</span>
                            <div className="flex items-center bg-muted rounded-lg">
                              <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-l-lg transition-colors touch-manipulation"
                                onClick={() => setRouteData({...routeData, toFloor: Math.max(0, routeData.toFloor - 1)})}
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-medium text-sm">{routeData.toFloor}</span>
                              <button 
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted-foreground/10 rounded-r-lg transition-colors touch-manipulation"
                                onClick={() => setRouteData({...routeData, toFloor: routeData.toFloor + 1})}
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox 
                            checked={routeData.toElevator}
                            onCheckedChange={(c) => setRouteData({...routeData, toElevator: !!c})}
                          />
                          <span className="text-sm">Lift</span>
                        </label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Date */}
                  <Card className="border-0 shadow-xl shadow-black/5 bg-background/80 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <Label className="text-sm font-medium">Wunschtermin</Label>
                      </div>
                      <Input 
                        type="date"
                        value={routeData.moveDate}
                        onChange={(e) => setRouteData({...routeData, moveDate: e.target.value})}
                        className="h-12"
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* STEP 2: Volume */}
              {currentStep === "volume" && (
                <motion.div
                  key="volume"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Wie viel wird gezügelt?</h1>
                    <p className="text-sm text-muted-foreground">Wohnungsgröße wählen – wir schätzen das Volumen.</p>
                  </div>

                  {/* Room Slider */}
                  <Card className="border-0 shadow-xl shadow-black/5 bg-background/80 backdrop-blur overflow-hidden">
                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Wohnungsgröße</span>
                        <Badge variant="secondary" className="font-bold">{routeData.rooms} Zimmer</Badge>
                      </div>
                      <Slider
                        value={[routeData.rooms]}
                        onValueChange={([val]) => setRouteData({...routeData, rooms: val})}
                        min={1.5}
                        max={5.5}
                        step={0.5}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1.5 Zi</span>
                        <span>5.5 Zi</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Service Level */}
                  <Card className="border-0 shadow-xl shadow-black/5 bg-background/80 backdrop-blur">
                    <CardContent className="p-4 space-y-3">
                      <span className="text-sm font-medium">Service-Level</span>
                      <div className="grid grid-cols-3 gap-2">
                        {SERVICE_LEVELS.map((level) => (
                          <button
                            key={level.id}
                            className={`relative p-3 rounded-xl border-2 text-center transition-all touch-manipulation ${
                              routeData.serviceLevel === level.id 
                                ? 'border-primary bg-primary/5' 
                                : 'border-transparent bg-muted/50 hover:bg-muted'
                            }`}
                            onClick={() => setRouteData({...routeData, serviceLevel: level.id as any})}
                          >
                            {level.recommended && (
                              <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                <Badge className="text-[9px] px-1.5 py-0">Top</Badge>
                              </div>
                            )}
                            <span className="font-semibold text-sm">{level.name}</span>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{level.desc}</p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Video Option */}
                  <Card className={`border-2 transition-all ${videoUploaded ? 'border-green-500 bg-green-50' : 'border-dashed border-primary/30 bg-primary/5'}`}>
                    <CardContent className="p-5 text-center space-y-3">
                      {!videoUploaded ? (
                        <>
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto">
                            <Camera className="w-7 h-7 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm">Genauere Schätzung?</h3>
                            <p className="text-xs text-muted-foreground">60 Sek. Video = präzisere Preise</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setVideoUploaded(true)}>
                            <Video className="w-4 h-4 mr-1.5" />
                            Video hochladen
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center justify-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          <span className="font-medium text-green-700">Video analysiert!</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Live Estimate */}
                  <motion.div 
                    layout
                    className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="text-sm font-medium">Geschätzter Preis</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">CHF {priceEstimate.min.toLocaleString()} – {priceEstimate.max.toLocaleString()}</span>
                        <p className="text-[10px] text-muted-foreground">~{estimatedVolume}m³ • Fixpreis-Garantie</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* STEP 3: Offers */}
              {currentStep === "offers" && (
                <motion.div
                  key="offers"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  <div className="text-center space-y-1">
                    <Badge className="bg-green-500/10 text-green-600 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      3 Fixpreis-Offerten
                    </Badge>
                    <h1 className="text-2xl font-bold tracking-tight">Ihre Offerten</h1>
                    <p className="text-xs text-muted-foreground">
                      {routeData.fromPlz} → {routeData.toPlz} • ~{estimatedVolume}m³ • {SERVICE_LEVELS.find(s => s.id === routeData.serviceLevel)?.name}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {offers.map((offer, i) => (
                      <motion.div
                        key={offer.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Card 
                          className={`cursor-pointer transition-all border-0 shadow-xl shadow-black/5 ${
                            selectedOffer === offer.id 
                              ? 'ring-2 ring-primary bg-primary/5' 
                              : 'bg-background/80 backdrop-blur hover:shadow-2xl'
                          }`}
                          onClick={() => setSelectedOffer(offer.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold">
                                {offer.partner.charAt(0)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-sm truncate">{offer.partner}</h3>
                                  <Badge variant={offer.recommended ? "default" : "secondary"} className="text-[9px] shrink-0">
                                    {offer.badge}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                  {offer.rating} ({offer.reviews})
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold">CHF {offer.price.toLocaleString()}</div>
                                <p className="text-[10px] text-green-600 font-medium">Fixpreis</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      Geprüfte Partner
                    </span>
                    <span className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      Fixpreis-Garantie
                    </span>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: Contact */}
              {currentStep === "contact" && selectedOfferData && (
                <motion.div
                  key="contact"
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-5"
                >
                  <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Fast geschafft!</h1>
                    <p className="text-sm text-muted-foreground">Kontaktdaten für Ihre unverbindliche Anfrage.</p>
                  </div>

                  {/* Selected Offer */}
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-primary/5 to-transparent">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {selectedOfferData.partner.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{selectedOfferData.partner}</h3>
                          <p className="text-xs text-muted-foreground">{routeData.moveDate || "Termin flexibel"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold">CHF {selectedOfferData.price.toLocaleString()}</span>
                        <p className="text-[10px] text-green-600">Fixpreis</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Form */}
                  <Card className="border-0 shadow-xl shadow-black/5 bg-background/80 backdrop-blur">
                    <CardContent className="p-4 space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name *</Label>
                        <Input 
                          placeholder="Vor- und Nachname"
                          value={contactData.name}
                          onChange={(e) => setContactData({...contactData, name: e.target.value})}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">E-Mail *</Label>
                        <Input 
                          type="email"
                          placeholder="ihre@email.ch"
                          value={contactData.email}
                          onChange={(e) => setContactData({...contactData, email: e.target.value})}
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Telefon (optional)</Label>
                        <Input 
                          type="tel"
                          placeholder="+41 79 123 45 67"
                          value={contactData.phone}
                          onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                          className="h-12"
                        />
                      </div>

                      <div className="flex items-start gap-2 pt-2">
                        <Checkbox 
                          id="privacy"
                          checked={privacyAccepted}
                          onCheckedChange={(c) => setPrivacyAccepted(!!c)}
                        />
                        <Label htmlFor="privacy" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                          Ich akzeptiere die Datenschutzbestimmungen. Meine Daten werden nur an den gewählten Partner übermittelt.
                        </Label>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" />
                      SSL-verschlüsselt
                    </span>
                    <span className="flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" />
                      Server in Zürich
                    </span>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: Success */}
              {currentStep === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6 py-8"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto shadow-xl shadow-green-500/30"
                  >
                    <CheckCircle2 className="w-10 h-10 text-white" />
                  </motion.div>
                  
                  <div className="space-y-2">
                    <h1 className="text-2xl font-bold">Anfrage gesendet!</h1>
                    <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                      {selectedOfferData?.partner} meldet sich innerhalb von 24 Stunden bei Ihnen.
                    </p>
                  </div>

                  <Card className="max-w-sm mx-auto border-0 shadow-xl">
                    <CardContent className="p-4 space-y-2 text-left text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Referenz</span>
                        <span className="font-mono font-bold">UC-{Math.floor(Math.random() * 9000 + 1000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Partner</span>
                        <span className="font-semibold">{selectedOfferData?.partner}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-medium">Geschätzter Preis</span>
                        <span className="font-bold text-primary">CHF {selectedOfferData?.price.toLocaleString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                    {[
                      { icon: MessageSquare, label: "Partner meldet sich" },
                      { icon: Calendar, label: "Termin bestätigen" },
                      { icon: Truck, label: "Umzug genießen" },
                    ].map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-muted/50 text-center">
                        <item.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </LayoutGroup>
        </div>
      </main>

      {/* Sticky Footer */}
      {currentStep !== "success" && (
        <StickyFooterCTA
          primaryLabel={stepConfig.cta}
          onPrimary={handleSubmit}
          disabled={!isValid}
          loading={isSubmitting}
          secondaryLabel={currentStepIndex > 0 ? "Zurück" : undefined}
          onSecondary={currentStepIndex > 0 ? goBack : undefined}
          hint={currentStep === "offers" && selectedOfferData ? `Fixpreis: CHF ${selectedOfferData.price.toLocaleString()}` : undefined}
        />
      )}
    </div>
  );
};

export default MarketplaceWizardV5c;
