import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
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
  Play,
  Eye,
  MessageSquare,
  Zap,
  Crown,
  Award,
  Timer,
  Handshake,
  ClipboardCheck,
  CreditCard,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Scan,
  Target,
  TrendingUp,
  HeartHandshake,
  Sparkle
} from "lucide-react";

// Types
type WizardStep = "intro" | "scan" | "service" | "price" | "booking" | "dashboard";

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

// 6-Tier Service Architecture
const SERVICE_TIERS = [
  {
    level: 10,
    id: "transport-only",
    name: "Transport Only",
    tagline: "Sparmodell – Sie packen, wir fahren",
    icon: Truck,
    multiplier: 1.0,
    features: ["Transporter + Fahrer", "Grundversicherung", "Routenoptimierung"],
    userDoes: "Packen, tragen bis LKW",
    systemDoes: "Fahrer, Route, Dokumentation",
    target: "Studierende, Sparfüchse",
  },
  {
    level: 25,
    id: "diy-plus",
    name: "DIY Plus",
    tagline: "Unterstützung bei schweren Gegenständen",
    icon: Users,
    multiplier: 1.25,
    features: ["Transporter + 2 Helfer", "Werkzeug inkl.", "Verpackungsmaterial-Abholung"],
    userDoes: "Packen",
    systemDoes: "Tragen, verladen, Material",
    target: "Junges Paar, kleiner Haushalt",
  },
  {
    level: 40,
    id: "hybrid",
    name: "Hybrid",
    tagline: "Sie packen, wir machen den Rest",
    icon: Handshake,
    multiplier: 1.45,
    features: ["Transport + Montage", "Standard-Reinigung", "Halteverbotszone"],
    userDoes: "Persönliche Dinge packen",
    systemDoes: "Möbel ab-/aufbauen, transportieren, reinigen",
    target: "Familien mit Zeit",
    popular: true,
  },
  {
    level: 60,
    id: "komfort",
    name: "Komfort",
    tagline: "Rundum-Sorglos (ohne Entsorgung)",
    icon: Package,
    multiplier: 1.7,
    features: ["Alles aus Hybrid", "Professionelles Packen", "Ummeldungsassistent", "Post-Umleitung"],
    userDoes: "Wertsachen separieren",
    systemDoes: "Alles packen, koordinieren, Behördengänge",
    target: "Berufstätige mit wenig Zeit",
  },
  {
    level: 80,
    id: "premium",
    name: "Premium",
    tagline: "White-Glove ohne Dekoration",
    icon: Award,
    multiplier: 2.0,
    features: ["Alles aus Komfort", "Spezialtransporte", "Lagerung 1 Monat", "Garantieschein-Reinigung"],
    userDoes: "Schlüssel übergeben",
    systemDoes: "Alles + Spezialversicherung + QC",
    target: "Wertvolles Inventar",
  },
  {
    level: 100,
    id: "ultimate",
    name: "Ultimate",
    tagline: "Zero Involvement – Schnippen & fertig",
    icon: Crown,
    multiplier: 2.5,
    features: ["Alles aus Premium", "Interior-Setup", "Geräte anschliessen", "Erste-Nacht-Box", "7 Tage Concierge"],
    userDoes: "Nichts",
    systemDoes: "Planen, durchführen, einrichten, Nachsorge",
    target: "Manager, Expats, VIP",
  },
];

// Timeline phases
const TIMELINE_PHASES = [
  { day: "T-30", phase: "Erfassung", status: "active", icon: MapPin },
  { day: "T-21", phase: "Video-Scan", status: "pending", icon: Camera },
  { day: "T-14", phase: "Angebot", status: "pending", icon: FileText },
  { day: "T-10", phase: "Buchung", status: "pending", icon: CreditCard },
  { day: "T-7", phase: "Vorbereitung", status: "pending", icon: ClipboardCheck },
  { day: "T-3", phase: "Feinabstimmung", status: "pending", icon: Timer },
  { day: "T-0", phase: "Umzugstag", status: "pending", icon: Truck },
  { day: "T+1", phase: "Abnahme", status: "pending", icon: CheckCircle2 },
  { day: "T+7", phase: "Setup", status: "pending", icon: Home },
];

export const UltimateWizard = () => {
  const [step, setStep] = useState<WizardStep>("intro");
  const [sliderValue, setSliderValue] = useState([40]);
  const [location, setLocation] = useState<LocationData>({
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
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [volumeEstimate, setVolumeEstimate] = useState(0);
  const [confidence, setConfidence] = useState(0);
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    acceptTerms: false,
  });
  const [showBreakdown, setShowBreakdown] = useState(false);

  // Get current tier based on slider
  const getCurrentTier = useCallback(() => {
    const value = sliderValue[0];
    return SERVICE_TIERS.reduce((closest, tier) => {
      return Math.abs(tier.level - value) < Math.abs(closest.level - value) ? tier : closest;
    }, SERVICE_TIERS[0]);
  }, [sliderValue]);

  const currentTier = getCurrentTier();

  // Calculate price
  const calculatePrice = useCallback(() => {
    const baseVolume = volumeEstimate || parseInt(location.rooms) * 12;
    const basePrice = baseVolume * 85;
    const tierMultiplier = currentTier.multiplier;
    const floorSurcharge = (location.fromFloor + location.toFloor) * 25;
    const elevatorDiscount = (location.fromElevator ? -50 : 0) + (location.toElevator ? -50 : 0);
    
    const total = Math.round((basePrice * tierMultiplier) + floorSurcharge + elevatorDiscount);
    return Math.max(total, 590);
  }, [location, currentTier, volumeEstimate]);

  const price = calculatePrice();

  // Simulate video analysis
  const handleVideoUpload = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const estimatedVolume = parseInt(location.rooms) * 12 + Math.floor(Math.random() * 10);
    setVolumeEstimate(estimatedVolume);
    setConfidence(0.87 + Math.random() * 0.1);
    setIsAnalyzing(false);
    setAnalysisComplete(true);
  };

  // Steps
  const steps: { id: WizardStep; label: string; icon: any }[] = [
    { id: "intro", label: "Start", icon: MapPin },
    { id: "scan", label: "Video-Scan", icon: Camera },
    { id: "service", label: "Service-Level", icon: Zap },
    { id: "price", label: "Fixpreis", icon: CreditCard },
    { id: "booking", label: "Buchung", icon: CheckCircle2 },
    { id: "dashboard", label: "Dashboard", icon: Eye },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex].id);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex].id);
    }
  };

  // Render timeline
  const renderTimeline = () => (
    <div className="mb-6 overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max">
        {TIMELINE_PHASES.map((phase, index) => {
          const Icon = phase.icon;
          const isActive = index === 0;
          const isPast = false;
          
          return (
            <div
              key={phase.day}
              className={`flex flex-col items-center p-2 rounded-lg min-w-[70px] transition-all ${
                isActive ? "bg-primary/10 border border-primary/30" : "bg-muted/30"
              }`}
            >
              <span className="text-[10px] font-mono text-muted-foreground">{phase.day}</span>
              <Icon className={`h-4 w-4 my-1 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                {phase.phase}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // Render trust signals
  const renderTrustSignals = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {[
        { icon: Shield, label: "Versicherung inkl.", value: "CHF 50'000" },
        { icon: Clock, label: "Antwort", value: "< 2 Std." },
        { icon: Star, label: "Bewertung", value: "4.8/5" },
        { icon: CheckCircle2, label: "Garantie", value: "Fixpreis" },
      ].map((item, i) => (
        <div key={i} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
          <item.icon className="h-4 w-4 text-primary" />
          <div className="text-xs">
            <div className="font-medium">{item.value}</div>
            <div className="text-muted-foreground">{item.label}</div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Card className="overflow-hidden border-primary/10 shadow-lg">
      {/* Header with progress */}
      <CardHeader className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-primary" />
            <span className="font-semibold text-lg">God Mode Umzug</span>
            <Badge variant="secondary" className="text-xs">V6</Badge>
          </div>
          <Badge variant="outline" className="text-xs">
            {currentStepIndex + 1}/{steps.length}
          </Badge>
        </div>
        
        {/* Progress steps */}
        <div className="flex items-center gap-1">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === currentStepIndex;
            const isPast = i < currentStepIndex;
            
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  isActive ? "bg-primary text-primary-foreground" :
                  isPast ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-1 rounded ${
                    isPast ? "bg-primary/40" : "bg-muted"
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <AnimatePresence mode="wait">
          {/* STEP 1: INTRO */}
          {step === "intro" && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  Willkommen zum ultimativen Umzugserlebnis
                </h2>
                <p className="text-muted-foreground">
                  Nur 3 Angaben – den Rest erledigen wir. In unter 10 Minuten zum Fixpreis.
                </p>
              </div>

              {renderTimeline()}
              {renderTrustSignals()}

              {/* Location form */}
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      Von (PLZ)
                    </Label>
                    <Input
                      placeholder="8000"
                      value={location.fromPlz}
                      onChange={(e) => setLocation({ ...location, fromPlz: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      Nach (PLZ)
                    </Label>
                    <Input
                      placeholder="3000"
                      value={location.toPlz}
                      onChange={(e) => setLocation({ ...location, toPlz: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      Umzugsdatum
                    </Label>
                    <Input
                      type="date"
                      value={location.moveDate}
                      onChange={(e) => setLocation({ ...location, moveDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-primary" />
                      Zimmer
                    </Label>
                    <select
                      className="w-full h-10 rounded-md border border-input bg-background px-3"
                      value={location.rooms}
                      onChange={(e) => setLocation({ ...location, rooms: e.target.value })}
                    >
                      <option value="1">1 Zimmer</option>
                      <option value="2">2 Zimmer</option>
                      <option value="3">3 Zimmer</option>
                      <option value="4">4 Zimmer</option>
                      <option value="5">5 Zimmer</option>
                      <option value="6">6+ Zimmer</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-sm">Auszug</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Stock</Label>
                        <select
                          className="w-16 h-8 text-sm rounded border"
                          value={location.fromFloor}
                          onChange={(e) => setLocation({ ...location, fromFloor: parseInt(e.target.value) })}
                        >
                          {[0,1,2,3,4,5,6,7,8].map(f => (
                            <option key={f} value={f}>{f === 0 ? "EG" : f}</option>
                          ))}
                        </select>
                      </div>
                      <label className="flex items-center gap-1 text-xs">
                        <Checkbox
                          checked={location.fromElevator}
                          onCheckedChange={(c) => setLocation({ ...location, fromElevator: !!c })}
                        />
                        Lift
                      </label>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label className="text-sm">Einzug</Label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-xs text-muted-foreground">Stock</Label>
                        <select
                          className="w-16 h-8 text-sm rounded border"
                          value={location.toFloor}
                          onChange={(e) => setLocation({ ...location, toFloor: parseInt(e.target.value) })}
                        >
                          {[0,1,2,3,4,5,6,7,8].map(f => (
                            <option key={f} value={f}>{f === 0 ? "EG" : f}</option>
                          ))}
                        </select>
                      </div>
                      <label className="flex items-center gap-1 text-xs">
                        <Checkbox
                          checked={location.toElevator}
                          onCheckedChange={(c) => setLocation({ ...location, toElevator: !!c })}
                        />
                        Lift
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                size="lg"
                onClick={goNext}
                disabled={!location.fromPlz || !location.toPlz || !location.moveDate}
              >
                Weiter zum Video-Scan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}

          {/* STEP 2: VIDEO SCAN */}
          {step === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">
                  <Camera className="inline-block mr-2 h-6 w-6 text-primary" />
                  Video-Inventar-Scan
                </h2>
                <p className="text-muted-foreground">
                  Filmen Sie Ihr Zuhause einmal komplett – unsere KI erkennt alles automatisch.
                </p>
              </div>

              {!videoUploaded && !isAnalyzing && !analysisComplete && (
                <Card className="border-dashed border-2 border-primary/30 bg-primary/5">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Video hochladen</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Gehen Sie Raum für Raum durch. Max. 5 Minuten Video.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button
                        variant="default"
                        onClick={() => {
                          setVideoUploaded(true);
                          handleVideoUpload();
                        }}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Video auswählen
                      </Button>
                      <Button variant="outline">
                        <Camera className="mr-2 h-4 w-4" />
                        Jetzt aufnehmen
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      className="mt-4 text-sm"
                      onClick={() => {
                        setAnalysisComplete(true);
                        setVolumeEstimate(parseInt(location.rooms) * 12);
                        setConfidence(0.7);
                      }}
                    >
                      Überspringen (manuelle Checkliste)
                    </Button>
                  </CardContent>
                </Card>
              )}

              {isAnalyzing && (
                <Card className="bg-primary/5">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Brain className="h-10 w-10 text-primary animate-pulse" />
                    </div>
                    <h3 className="font-semibold mb-2">KI analysiert Video...</h3>
                    <Progress value={65} className="mb-4" />
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>✓ Räume erkannt: 4</p>
                      <p>✓ Möbel identifiziert: 23</p>
                      <p className="animate-pulse">→ Volumen berechnen...</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {analysisComplete && (
                <Card className="bg-green-500/5 border-green-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Analyse abgeschlossen</h3>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="bg-background rounded-lg p-3">
                            <div className="text-2xl font-bold text-primary">{volumeEstimate} m³</div>
                            <div className="text-xs text-muted-foreground">Geschätztes Volumen</div>
                          </div>
                          <div className="bg-background rounded-lg p-3">
                            <div className="text-2xl font-bold text-primary">{Math.round(confidence * 100)}%</div>
                            <div className="text-xs text-muted-foreground">Konfidenz</div>
                          </div>
                        </div>
                        <div className="mt-3 text-sm text-muted-foreground">
                          <span className="font-medium">Erkannt:</span> 4 Räume, 23 Möbelstücke, ~35 Kartons
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={goNext}
                  disabled={isAnalyzing}
                >
                  Weiter zur Service-Auswahl
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SERVICE LEVEL */}
          {step === "service" && (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-2">
                  Wie viel möchten Sie selbst machen?
                </h2>
                <p className="text-muted-foreground">
                  Verschieben Sie den Regler – wir passen alles automatisch an.
                </p>
              </div>

              {/* Main Slider */}
              <div className="bg-gradient-to-r from-muted/50 via-primary/5 to-muted/50 rounded-xl p-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-3">
                  <span>DIY</span>
                  <span>Hybrid</span>
                  <span>Full-Service</span>
                </div>
                
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  min={0}
                  max={100}
                  step={1}
                  className="mb-4"
                />

                {/* Current tier display */}
                <div className="text-center mt-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                    <currentTier.icon className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{currentTier.name}</span>
                    <Badge variant="secondary">{sliderValue[0]}%</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{currentTier.tagline}</p>
                </div>
              </div>

              {/* Tier cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {SERVICE_TIERS.map((tier) => {
                  const isActive = currentTier.id === tier.id;
                  const Icon = tier.icon;
                  
                  return (
                    <button
                      key={tier.id}
                      onClick={() => setSliderValue([tier.level])}
                      className={`p-3 rounded-lg text-left transition-all ${
                        isActive 
                          ? "bg-primary/10 border-2 border-primary" 
                          : "bg-muted/30 border border-transparent hover:border-muted-foreground/20"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        <span className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>
                          {tier.name}
                        </span>
                        {tier.popular && (
                          <Badge variant="secondary" className="text-[10px] px-1">Beliebt</Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{tier.tagline}</p>
                    </button>
                  );
                })}
              </div>

              {/* Current tier details */}
              <Card className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <currentTier.icon className="h-5 w-5 text-primary" />
                      {currentTier.name}
                    </h4>
                    <Badge>{currentTier.level}% Delegation</Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Inkludiert:</div>
                      <ul className="space-y-1">
                        {currentTier.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Sie machen:</div>
                      <p className="text-muted-foreground">{currentTier.userDoes}</p>
                      <div className="text-xs font-medium text-muted-foreground mt-2 mb-1">Wir machen:</div>
                      <p className="text-muted-foreground">{currentTier.systemDoes}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button className="flex-1" onClick={goNext}>
                  Fixpreis berechnen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: PRICE */}
          {step === "price" && (
            <motion.div
              key="price"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-2">Ihr Fixpreis</h2>
                <p className="text-muted-foreground">
                  Keine Überraschungen – garantiert.
                </p>
              </div>

              {/* Price card */}
              <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-primary/10">
                    <currentTier.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{currentTier.name}</span>
                  </div>
                  
                  <div className="text-5xl font-bold text-primary mb-2">
                    CHF {price.toLocaleString('de-CH')}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Fixpreis inkl. MwSt. & Versicherung
                  </p>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowBreakdown(!showBreakdown)}
                    className="mt-4"
                  >
                    {showBreakdown ? "Weniger anzeigen" : "Preisaufschlüsselung"}
                    {showBreakdown ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
                  </Button>

                  {showBreakdown && (
                    <div className="mt-4 text-left bg-background rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Basispreis ({volumeEstimate || parseInt(location.rooms) * 12} m³)</span>
                        <span>CHF {Math.round((volumeEstimate || parseInt(location.rooms) * 12) * 85)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Service-Level ({currentTier.name})</span>
                        <span>×{currentTier.multiplier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Etagenzuschlag ({location.fromFloor + location.toFloor} Stockwerke)</span>
                        <span>+CHF {(location.fromFloor + location.toFloor) * 25}</span>
                      </div>
                      {(location.fromElevator || location.toElevator) && (
                        <div className="flex justify-between text-green-600">
                          <span>Lift-Rabatt</span>
                          <span>-CHF {(location.fromElevator ? 50 : 0) + (location.toElevator ? 50 : 0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-2 border-t font-semibold">
                        <span>Total</span>
                        <span>CHF {price.toLocaleString('de-CH')}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, title: "Preisgarantie", desc: "Fixpreis ohne Nachforderungen" },
                  { icon: Clock, title: "24h Storno", desc: "Kostenlos stornierbar" },
                  { icon: CheckCircle2, title: "Versicherung", desc: "CHF 50'000 Deckung" },
                  { icon: Star, title: "Qualität", desc: "Nur geprüfte Partner" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                    <item.icon className="h-4 w-4 text-primary mt-0.5" />
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button className="flex-1" onClick={goNext}>
                  Jetzt buchen
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: BOOKING */}
          {step === "booking" && (
            <motion.div
              key="booking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold mb-2">Buchung abschliessen</h2>
                <p className="text-muted-foreground">
                  Mit einem Klick buchen und entspannen.
                </p>
              </div>

              {/* Summary */}
              <Card className="bg-muted/20">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Ihre Buchung</span>
                    <Badge variant="outline">{currentTier.name}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div><span className="text-muted-foreground">Von:</span> {location.fromPlz}</div>
                    <div><span className="text-muted-foreground">Nach:</span> {location.toPlz}</div>
                    <div><span className="text-muted-foreground">Datum:</span> {location.moveDate || "Flexibel"}</div>
                    <div><span className="text-muted-foreground">Volumen:</span> ~{volumeEstimate || parseInt(location.rooms) * 12} m³</div>
                  </div>
                  <div className="flex justify-between items-center mt-3 pt-3 border-t">
                    <span className="font-semibold">Fixpreis</span>
                    <span className="text-xl font-bold text-primary">CHF {price.toLocaleString('de-CH')}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Contact form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Name *</Label>
                  <Input
                    placeholder="Max Muster"
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>E-Mail *</Label>
                    <Input
                      type="email"
                      placeholder="max@beispiel.ch"
                      value={contactData.email}
                      onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Telefon</Label>
                    <Input
                      type="tel"
                      placeholder="+41 79 123 45 67"
                      value={contactData.phone}
                      onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <label className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg cursor-pointer">
                  <Checkbox
                    checked={contactData.acceptTerms}
                    onCheckedChange={(c) => setContactData({ ...contactData, acceptTerms: !!c })}
                    className="mt-0.5"
                  />
                  <span className="text-sm">
                    Ich akzeptiere die <a href="#" className="text-primary underline">AGB</a> und 
                    {" "}<a href="#" className="text-primary underline">Datenschutzerklärung</a>.
                    Die Buchung ist 24h kostenlos stornierbar.
                  </span>
                </label>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Zurück
                </Button>
                <Button 
                  className="flex-1" 
                  size="lg"
                  onClick={goNext}
                  disabled={!contactData.name || !contactData.email || !contactData.acceptTerms}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Verbindlich buchen
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: DASHBOARD */}
          {step === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Buchung bestätigt!</h2>
                <p className="text-muted-foreground">
                  Wir halten Sie proaktiv auf dem Laufenden.
                </p>
              </div>

              {/* Timeline */}
              <Card>
                <CardHeader className="pb-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Ihr Umzugs-Fahrplan
                  </h3>
                </CardHeader>
                <CardContent className="pt-0">
                  {renderTimeline()}
                </CardContent>
              </Card>

              {/* Trust Dashboard */}
              <div className="grid grid-cols-2 gap-3">
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Dokumente</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>✓ Buchungsbestätigung</li>
                      <li>✓ Versicherungsnachweis</li>
                      <li>○ Vertrag (in Bearbeitung)</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Ihr Team</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Crew-Infos werden 3 Tage vor dem Umzug bereitgestellt.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">Support</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-1 text-xs">
                      Chat öffnen
                    </Button>
                  </CardContent>
                </Card>
                <Card className="bg-muted/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardCheck className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">To-Dos</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>□ Nachsendeauftrag stellen</li>
                      <li>□ Ummelden vorbereiten</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <Info className="h-5 w-5 text-primary flex-shrink-0" />
                  <p className="text-sm">
                    Sie erhalten eine Bestätigungs-E-Mail an <strong>{contactData.email}</strong> mit allen Details.
                  </p>
                </CardContent>
              </Card>

              <Button className="w-full" size="lg" variant="outline">
                Zum Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
