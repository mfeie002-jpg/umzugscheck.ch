/**
 * V2 Archetyp Flow - "Best of Best" Calculator
 * 
 * Basiert auf der strategischen Marktanalyse für den Schweizer Umzugsmarkt:
 * 
 * 4 ARCHETYPEN-ORIENTIERT:
 * 1. Sicherheits-Sucher (Security-Seeker): Trust-First, Garantien, Zertifikate
 * 2. Effizienz-Maximierer (Efficiency-Maximizer): Speed, AI-Video, One-Click
 * 3. Preis-Jäger (Value-Hunter): Spar-Rechner, Transparenz, DIY-Optionen
 * 4. Chaos-Manager (Overwhelmed Parent): Checklisten, Save & Continue, Struktur
 * 
 * 6-SCHRITTE SWISS FRAMEWORK:
 * 1. Smart Location & Intent-Filter (Geolocation)
 * 2. Flex-Date Matrix & Yield Management (Timing)
 * 3. KI-Video & Raum-Presets (Inventar)
 * 4. Integrierte Abnahmegarantie (Services)
 * 5. Badges & OTP Verification (Trust)
 * 6. Dashboard & Experten-Call (Nurturing)
 * 
 * SWISSNESS-FOKUS:
 * - Zügeltage-Integration (März, September Peaks)
 * - Abnahmegarantie für Endreinigung
 * - ASTAG-Zertifizierung
 * - CH-Datenschutz (nDSG)
 * - Schweizer Wording (Zügeln, Offerte)
 * 
 * MOVU-DIFFERENZIERUNG:
 * - KI-Video-Inventar statt manueller Listen
 * - Preisgarantie statt Schätzungen
 * - Holistisches Ökosystem statt Transport-Fokus
 * - Zertifizierte Swissness statt "geprüfte Partner"
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Shield, 
  Clock, 
  Star, 
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Home,
  Truck,
  Package,
  Sparkles,
  Building,
  Lock,
  Trash2,
  Archive,
  Wrench,
  Sofa,
  Bed,
  Tv,
  Refrigerator,
  UtensilsCrossed,
  Armchair,
  Lamp,
  BookOpen,
  Dumbbell,
  Bike,
  Box,
  Plus,
  Minus,
  ChevronRight,
  Loader2,
  Eye,
  CheckCircle2,
  Search,
  Award,
  Users,
  Heart,
  Zap,
  DollarSign,
  Brain,
  Video,
  Save,
  ListChecks,
  AlertTriangle,
  Info,
  CalendarDays,
  TrendingDown,
  Percent,
  Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInitialStep } from '@/hooks/use-initial-step';

// 6-Schritte Framework nach Strategic Analysis
const STEPS = [
  { id: 1, label: 'Einstieg', subtitle: 'Smart Location', icon: MapPin },
  { id: 2, label: 'Timing', subtitle: 'Flex-Date', icon: Calendar },
  { id: 3, label: 'Inventar', subtitle: 'KI-Erfassung', icon: Package },
  { id: 4, label: 'Services', subtitle: 'Abnahmegarantie', icon: Sparkles },
  { id: 5, label: 'Vertrauen', subtitle: 'Trust & Badges', icon: Shield },
  { id: 6, label: 'Ergebnis', subtitle: 'Dashboard', icon: CheckCircle2 },
];

// Archetypen-Definition aus Strategic Analysis
const ARCHETYPES = {
  security: { 
    name: 'Sicherheits-Sucher', 
    icon: Shield, 
    color: 'blue',
    needs: ['Garantien', 'Zertifikate', 'Versicherung'],
    trigger: 'Fixpreis-Garantie'
  },
  efficiency: { 
    name: 'Effizienz-Maximierer', 
    icon: Zap, 
    color: 'green',
    needs: ['Speed', 'Full-Service', 'One-Click'],
    trigger: 'In 2 Minuten fertig'
  },
  value: { 
    name: 'Preis-Jäger', 
    icon: DollarSign, 
    color: 'orange',
    needs: ['Transparenz', 'Spar-Optionen', 'Vergleich'],
    trigger: 'Bis zu 40% sparen'
  },
  overwhelmed: { 
    name: 'Chaos-Manager', 
    icon: Brain, 
    color: 'purple',
    needs: ['Struktur', 'Checklisten', 'Erinnerungen'],
    trigger: 'Wir denken an alles'
  }
};

// Schweizer Zügeltage (Saisonalität)
const ZUEGELTAGE_2025 = [
  { date: '2025-03-31', label: 'Zügeltag März', surge: 1.35 },
  { date: '2025-06-30', label: 'Zügeltag Juni', surge: 1.25 },
  { date: '2025-09-30', label: 'Zügeltag Sept.', surge: 1.4 },
  { date: '2025-12-31', label: 'Jahresende', surge: 1.15 },
];

// Visuelles Inventar mit Icons (Gamification)
const INVENTORY_ITEMS = [
  { id: 'sofa', label: 'Sofa', icon: Sofa, category: 'wohnzimmer', volume: 1.8 },
  { id: 'armchair', label: 'Sessel', icon: Armchair, category: 'wohnzimmer', volume: 0.5 },
  { id: 'tv', label: 'TV/Möbel', icon: Tv, category: 'wohnzimmer', volume: 0.8 },
  { id: 'bookshelf', label: 'Regal', icon: BookOpen, category: 'wohnzimmer', volume: 0.6 },
  { id: 'bed', label: 'Bett', icon: Bed, category: 'schlafzimmer', volume: 2.5 },
  { id: 'wardrobe', label: 'Schrank', icon: Package, category: 'schlafzimmer', volume: 2.0 },
  { id: 'desk', label: 'Pult', icon: Lamp, category: 'schlafzimmer', volume: 0.5 },
  { id: 'fridge', label: 'Kühlschrank', icon: Refrigerator, category: 'kueche', volume: 0.8 },
  { id: 'washer', label: 'Waschm.', icon: Archive, category: 'kueche', volume: 0.6 },
  { id: 'table', label: 'Esstisch', icon: UtensilsCrossed, category: 'kueche', volume: 0.8 },
  { id: 'boxes', label: 'Kartons', icon: Box, category: 'sonstiges', volume: 0.05, defaultCount: 10 },
  { id: 'bike', label: 'Velo', icon: Bike, category: 'sonstiges', volume: 0.3 },
];

// Services mit Abnahmegarantie
const SERVICES = [
  { 
    id: 'cleaning', 
    label: 'Endreinigung', 
    description: 'Mit Abnahmegarantie', 
    icon: Sparkles, 
    popular: true,
    archetyp: 'security',
    priceFrom: 350,
    guarantee: true
  },
  { 
    id: 'packing', 
    label: 'Packservice', 
    description: 'Professionell verpackt', 
    icon: Package, 
    popular: true,
    archetyp: 'efficiency',
    priceFrom: 200
  },
  { 
    id: 'disposal', 
    label: 'Entsorgung', 
    description: 'Altmöbel entsorgen', 
    icon: Trash2,
    archetyp: 'value',
    priceFrom: 150
  },
  { 
    id: 'storage', 
    label: 'Lagerung', 
    description: 'Sichere Zwischenlagerung', 
    icon: Archive,
    archetyp: 'overwhelmed',
    priceFrom: 99
  },
  { 
    id: 'assembly', 
    label: 'Montage', 
    description: 'Möbel ab-/aufbauen', 
    icon: Wrench,
    archetyp: 'efficiency',
    priceFrom: 120
  },
];

// Room presets (Raum-Presets für Chaos-Manager)
const ROOM_PRESETS: Record<string, Record<string, number>> = {
  '1': { sofa: 1, bed: 1, boxes: 8, desk: 1 },
  '1.5': { sofa: 1, bed: 1, boxes: 10, desk: 1, bookshelf: 1 },
  '2': { sofa: 1, bed: 1, boxes: 15, desk: 1, wardrobe: 1, table: 1 },
  '2.5': { sofa: 1, armchair: 1, bed: 1, boxes: 18, wardrobe: 1, table: 1, bookshelf: 1 },
  '3': { sofa: 1, armchair: 1, bed: 2, boxes: 25, wardrobe: 2, table: 1, tv: 1, fridge: 1 },
  '3.5': { sofa: 1, armchair: 2, bed: 2, boxes: 30, wardrobe: 2, table: 1, tv: 1, fridge: 1, washer: 1 },
  '4': { sofa: 2, armchair: 2, bed: 2, boxes: 35, wardrobe: 3, table: 1, tv: 2, fridge: 1, washer: 1, bookshelf: 2 },
  '4.5': { sofa: 2, armchair: 2, bed: 3, boxes: 40, wardrobe: 3, table: 1, tv: 2, fridge: 1, washer: 1, bookshelf: 2, desk: 1 },
  '5+': { sofa: 2, armchair: 3, bed: 3, boxes: 50, wardrobe: 4, table: 1, tv: 2, fridge: 1, washer: 1, bookshelf: 3, desk: 2 },
};

// Mock matched companies
const MATCHED_COMPANIES = [
  { id: '1', name: 'Züri Zügel AG', rating: 4.9, reviews: 234, astag: true, guarantee: true, priceRange: '1\'890 - 2\'340' },
  { id: '2', name: 'SwissMove Pro', rating: 4.8, reviews: 187, astag: true, guarantee: true, priceRange: '2\'150 - 2\'580' },
  { id: '3', name: 'Blitz Transport', rating: 4.7, reviews: 156, astag: true, guarantee: false, priceRange: '1\'780 - 2\'100' },
];

export const V2cArchetypCalculator: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [detectedArchetype, setDetectedArchetype] = useState<keyof typeof ARCHETYPES | null>(null);
  
  // Step 1: Smart Location & Intent
  const [moveType, setMoveType] = useState<'privat' | 'firma' | ''>('');
  const [fromZip, setFromZip] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [fromFloor, setFromFloor] = useState('');
  const [fromHasLift, setFromHasLift] = useState<boolean | null>(null);
  const [toZip, setToZip] = useState('');
  const [toCity, setToCity] = useState('');
  const [toFloor, setToFloor] = useState('');
  const [toHasLift, setToHasLift] = useState<boolean | null>(null);
  
  // Step 2: Flex-Date Matrix
  const [moveDate, setMoveDate] = useState('');
  const [dateFlexibility, setDateFlexibility] = useState<'exact' | 'flexible3' | 'flexible7' | 'unknown'>('exact');
  
  // Step 3: Inventar (Tri-Modal)
  const [inventoryMode, setInventoryMode] = useState<'preset' | 'manual' | 'video'>('preset');
  const [rooms, setRooms] = useState('');
  const [inventory, setInventory] = useState<Record<string, number>>({});
  
  // Step 4: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [wantDIY, setWantDIY] = useState(false);
  
  // Step 5: Trust & Contact
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  // Step 6: Results
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [savedProgress, setSavedProgress] = useState(false);

  // Archetype Detection based on behavior
  useEffect(() => {
    // Simple heuristics for archetype detection
    if (selectedServices.includes('cleaning') && fromHasLift !== null) {
      setDetectedArchetype('security');
    } else if (inventoryMode === 'video') {
      setDetectedArchetype('efficiency');
    } else if (wantDIY || dateFlexibility !== 'exact') {
      setDetectedArchetype('value');
    } else if (inventoryMode === 'preset') {
      setDetectedArchetype('overwhelmed');
    }
  }, [selectedServices, fromHasLift, inventoryMode, wantDIY, dateFlexibility]);

  // Calculate estimated volume
  const estimatedVolume = useMemo(() => {
    return Object.entries(inventory).reduce((acc, [itemId, count]) => {
      const item = INVENTORY_ITEMS.find(i => i.id === itemId);
      return acc + (item?.volume || 0) * count;
    }, 0);
  }, [inventory]);

  // Check if date is a Zügeltag
  const isZugeltag = useMemo(() => {
    const found = ZUEGELTAGE_2025.find(z => z.date === moveDate);
    return found || null;
  }, [moveDate]);

  // Calculate price estimate
  const priceEstimate = useMemo(() => {
    const basePrice = 500;
    const volumePrice = estimatedVolume * 50;
    const floorSurcharge = (parseInt(fromFloor) || 0) > 2 && !fromHasLift ? 200 : 0;
    const servicePrice = selectedServices.reduce((acc, sId) => {
      const service = SERVICES.find(s => s.id === sId);
      return acc + (service?.priceFrom || 0);
    }, 0);
    const flexDiscount = dateFlexibility === 'flexible7' ? 0.15 : dateFlexibility === 'flexible3' ? 0.08 : 0;
    const diyDiscount = wantDIY ? 0.12 : 0;
    const surgeMultiplier = isZugeltag?.surge || 1;

    const subtotal = (basePrice + volumePrice + floorSurcharge + servicePrice) * surgeMultiplier;
    const discount = subtotal * (flexDiscount + diyDiscount);
    
    return {
      subtotal: Math.round(subtotal),
      discount: Math.round(discount),
      total: Math.round(subtotal - discount),
      savings: Math.round(discount)
    };
  }, [estimatedVolume, fromFloor, fromHasLift, selectedServices, dateFlexibility, wantDIY, isZugeltag]);

  // Load room preset
  const loadRoomPreset = (roomCount: string) => {
    setRooms(roomCount);
    const preset = ROOM_PRESETS[roomCount] || ROOM_PRESETS['3'];
    setInventory(preset);
  };

  // Progress calculation
  const progress = (currentStep / STEPS.length) * 100;

  // Navigation
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Start analysis (Labor Illusion)
  const startAnalysis = () => {
    setIsAnalyzing(true);
    const phases = [
      'Analysiere Ihre Anforderungen...',
      'Vergleiche 54 zertifizierte Umzugsfirmen...',
      'Berechne optimale Preise...',
      'Prüfe Verfügbarkeit für Ihr Datum...',
      'Erstelle personalisierte Offerten...'
    ];
    
    let phase = 0;
    const interval = setInterval(() => {
      phase++;
      setAnalysisPhase(phase);
      if (phase >= phases.length) {
        clearInterval(interval);
        setTimeout(() => {
          setIsAnalyzing(false);
          setShowResults(true);
        }, 800);
      }
    }, 900);
  };

  // Save progress (for Chaos-Manager)
  const saveProgress = () => {
    setSavedProgress(true);
    // In real app: save to localStorage or DB
  };

  return (
    <div className="relative">
      {/* Trust Bar - Always visible (Security-Seeker) */}
      <div className="bg-muted/50 border-b py-2 mb-4 rounded-t-lg">
        <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap px-4">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium">ASTAG zertifiziert</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="h-4 w-4 text-yellow-500" />
            <span>Abnahmegarantie</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-green-600" />
            <span>CH Datenschutz</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span>4.8/5 (2\'340+ Bewertungen)</span>
          </div>
        </div>
      </div>

      {/* Archetype Detection Badge */}
      {detectedArchetype && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 right-2 z-10"
        >
          <Badge variant="outline" className="bg-background/80 backdrop-blur text-xs">
            {React.createElement(ARCHETYPES[detectedArchetype].icon, { className: 'h-3 w-3 mr-1 inline' })}
            {ARCHETYPES[detectedArchetype].trigger}
          </Badge>
        </motion.div>
      )}

      {/* Progress Steps - Visual (6-Step Framework) */}
      <div className="mb-6 px-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            Schritt {currentStep} von {STEPS.length}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs gap-1 h-6"
            onClick={saveProgress}
          >
            <Save className="h-3 w-3" />
            Speichern
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-2">
          {STEPS.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index + 1 === currentStep;
            const isCompleted = index + 1 < currentStep;
            
            return (
              <div 
                key={step.id}
                className={`flex flex-col items-center ${
                  isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground/40'
                }`}
              >
                <div className={`
                  w-6 h-6 rounded-full flex items-center justify-center text-xs
                  ${isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-green-600 text-white' : 'bg-muted'}
                `}>
                  {isCompleted ? <Check className="h-3 w-3" /> : <StepIcon className="h-3 w-3" />}
                </div>
                <span className="text-[10px] mt-1 hidden sm:block">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Smart Location & Intent */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Wohin zügeln Sie?</h2>
                  <p className="text-muted-foreground text-sm mt-1">Smart Location Intelligence für präzise Offerten</p>
                </div>

                {/* Intent Segmentation */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'privat', label: 'Privatumzug', icon: Home, desc: 'Wohnung / Haus' },
                    { value: 'firma', label: 'Firmenumzug', icon: Building, desc: 'Büro / Gewerbe' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setMoveType(option.value as 'privat' | 'firma')}
                      className={`
                        p-4 rounded-xl border-2 transition-all text-left
                        ${moveType === option.value 
                          ? 'border-primary bg-primary/5' 
                          : 'border-muted hover:border-primary/50'}
                      `}
                    >
                      <option.icon className={`h-6 w-6 mb-2 ${moveType === option.value ? 'text-primary' : 'text-muted-foreground'}`} />
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-muted-foreground">{option.desc}</div>
                    </button>
                  ))}
                </div>

                {/* From Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-primary" />
                      Von
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="PLZ"
                        value={fromZip}
                        onChange={(e) => setFromZip(e.target.value)}
                        className="text-center"
                        maxLength={4}
                      />
                      <Input
                        placeholder="Ort"
                        value={fromCity}
                        onChange={(e) => setFromCity(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Stock</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={fromFloor}
                          onChange={(e) => setFromFloor(e.target.value)}
                          className="text-center"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Lift?</Label>
                        <div className="flex gap-1 mt-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={fromHasLift === true ? 'default' : 'outline'}
                            onClick={() => setFromHasLift(true)}
                            className="flex-1"
                          >
                            Ja
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={fromHasLift === false ? 'default' : 'outline'}
                            onClick={() => setFromHasLift(false)}
                            className="flex-1"
                          >
                            Nein
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* To Address */}
                  <div className="space-y-4 p-4 bg-muted/30 rounded-xl">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="h-4 w-4 text-green-600" />
                      Nach
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        inputMode="numeric"
                        placeholder="PLZ"
                        value={toZip}
                        onChange={(e) => setToZip(e.target.value)}
                        className="text-center"
                        maxLength={4}
                      />
                      <Input
                        placeholder="Ort"
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Stock</Label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="0"
                          value={toFloor}
                          onChange={(e) => setToFloor(e.target.value)}
                          className="text-center"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Lift?</Label>
                        <div className="flex gap-1 mt-1">
                          <Button
                            type="button"
                            size="sm"
                            variant={toHasLift === true ? 'default' : 'outline'}
                            onClick={() => setToHasLift(true)}
                            className="flex-1"
                          >
                            Ja
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant={toHasLift === false ? 'default' : 'outline'}
                            onClick={() => setToHasLift(false)}
                            className="flex-1"
                          >
                            Nein
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={nextStep} 
                  className="w-full gap-2"
                  size="lg"
                  disabled={!moveType || !fromZip || !toZip}
                >
                  Weiter zum Datum
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* STEP 2: Flex-Date Matrix */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Wann möchten Sie zügeln?</h2>
                  <p className="text-muted-foreground text-sm mt-1">Flex-Date für beste Preise</p>
                </div>

                {/* Date Input */}
                <div className="space-y-2">
                  <Label>Umzugsdatum</Label>
                  <Input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="text-center"
                  />
                  
                  {/* Zügeltag Warning */}
                  {isZugeltag && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm"
                    >
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div>
                        <span className="font-medium text-yellow-800 dark:text-yellow-200">
                          {isZugeltag.label}: Hohe Nachfrage
                        </span>
                        <p className="text-yellow-700 dark:text-yellow-300 text-xs mt-0.5">
                          Preise sind ca. {Math.round((isZugeltag.surge - 1) * 100)}% höher. 
                          Mit Flex-Date können Sie bis zu 20% sparen!
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Flexibility Options (Value-Hunter) */}
                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Flexibilität
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'exact', label: 'Fixer Termin', icon: Calendar, discount: 0 },
                      { value: 'flexible3', label: '± 3 Tage', icon: CalendarDays, discount: 8 },
                      { value: 'flexible7', label: '± 7 Tage', icon: CalendarDays, discount: 15 },
                      { value: 'unknown', label: 'Noch unsicher', icon: Calendar, discount: 0 },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setDateFlexibility(option.value as any)}
                        className={`
                          p-3 rounded-lg border-2 transition-all text-left relative
                          ${dateFlexibility === option.value 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          <option.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{option.label}</span>
                        </div>
                        {option.discount > 0 && (
                          <Badge variant="secondary" className="absolute -top-2 -right-2 text-xs bg-green-100 text-green-700">
                            -{option.discount}%
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    className="flex-1 gap-2"
                    size="lg"
                    disabled={!moveDate && dateFlexibility !== 'unknown'}
                  >
                    Weiter zum Inventar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Tri-Modal Inventory */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Was wird gezügelt?</h2>
                  <p className="text-muted-foreground text-sm mt-1">Tri-modale Erfassung für präzise Preise</p>
                </div>

                {/* Mode Selection */}
                <Tabs value={inventoryMode} onValueChange={(v) => setInventoryMode(v as any)}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="preset" className="gap-1 text-xs sm:text-sm">
                      <Home className="h-3 w-3 sm:h-4 sm:w-4" />
                      Zimmer
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="gap-1 text-xs sm:text-sm">
                      <ListChecks className="h-3 w-3 sm:h-4 sm:w-4" />
                      Manuell
                    </TabsTrigger>
                    <TabsTrigger value="video" className="gap-1 text-xs sm:text-sm">
                      <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                      KI-Video
                    </TabsTrigger>
                  </TabsList>

                  {/* Preset Mode (Chaos-Manager) */}
                  <TabsContent value="preset" className="space-y-4 mt-4">
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {Object.keys(ROOM_PRESETS).map(roomCount => (
                        <button
                          key={roomCount}
                          onClick={() => loadRoomPreset(roomCount)}
                          className={`
                            p-3 rounded-lg border-2 transition-all
                            ${rooms === roomCount 
                              ? 'border-primary bg-primary/5' 
                              : 'border-muted hover:border-primary/50'}
                          `}
                        >
                          <div className="text-lg font-bold">{roomCount}</div>
                          <div className="text-xs text-muted-foreground">Zimmer</div>
                        </button>
                      ))}
                    </div>
                    
                    {rooms && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-sm text-green-700 dark:text-green-300"
                      >
                        <CheckCircle2 className="h-4 w-4 inline mr-2" />
                        Standard-Inventar für {rooms}-Zimmer-Wohnung geladen. 
                        Geschätztes Volumen: <strong>{estimatedVolume.toFixed(1)} m³</strong>
                      </motion.div>
                    )}
                  </TabsContent>

                  {/* Manual Mode (Value-Hunter) */}
                  <TabsContent value="manual" className="space-y-4 mt-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {INVENTORY_ITEMS.map(item => {
                        const count = inventory[item.id] || 0;
                        const ItemIcon = item.icon;
                        
                        return (
                          <div 
                            key={item.id}
                            className="p-2 border rounded-lg text-center"
                          >
                            <ItemIcon className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                            <div className="text-xs font-medium truncate">{item.label}</div>
                            <div className="flex items-center justify-center gap-1 mt-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setInventory(prev => ({
                                  ...prev,
                                  [item.id]: Math.max(0, (prev[item.id] || 0) - 1)
                                }))}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="text-sm font-bold w-6">{count}</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => setInventory(prev => ({
                                  ...prev,
                                  [item.id]: (prev[item.id] || 0) + 1
                                }))}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </TabsContent>

                  {/* Video Mode (Efficiency-Maximizer) */}
                  <TabsContent value="video" className="mt-4">
                    <div className="text-center p-8 border-2 border-dashed rounded-xl space-y-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Video className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold">KI Video-Inventar</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Filmen Sie Ihre Wohnung - unsere KI erkennt automatisch alle Möbel
                        </p>
                      </div>
                      <Button size="lg" className="gap-2">
                        <Video className="h-4 w-4" />
                        Video starten
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Empfohlen für Preisgarantie • 2 Min. Aufnahmezeit
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* Volume Display */}
                {estimatedVolume > 0 && (
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">Geschätztes Volumen:</span>
                    <span className="font-bold text-lg">{estimatedVolume.toFixed(1)} m³</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    className="flex-1 gap-2"
                    size="lg"
                    disabled={estimatedVolume === 0 && inventoryMode !== 'video'}
                  >
                    Weiter zu Services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: Services with Abnahmegarantie */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Zusatzservices</h2>
                  <p className="text-muted-foreground text-sm mt-1">Alles aus einer Hand - mit Abnahmegarantie</p>
                </div>

                <div className="space-y-3">
                  {SERVICES.map(service => {
                    const isSelected = selectedServices.includes(service.id);
                    const ServiceIcon = service.icon;
                    
                    return (
                      <button
                        key={service.id}
                        onClick={() => {
                          setSelectedServices(prev => 
                            isSelected 
                              ? prev.filter(s => s !== service.id)
                              : [...prev, service.id]
                          );
                        }}
                        className={`
                          w-full p-4 rounded-xl border-2 transition-all text-left relative
                          ${isSelected ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/50'}
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center
                            ${isSelected ? 'bg-primary text-white' : 'bg-muted'}
                          `}>
                            <ServiceIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{service.label}</span>
                              {service.popular && (
                                <Badge variant="secondary" className="text-xs">Beliebt</Badge>
                              )}
                              {service.guarantee && (
                                <Badge className="text-xs bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                  <Shield className="h-3 w-3 mr-1" />
                                  Garantie
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{service.description}</p>
                            <p className="text-xs text-primary mt-1">ab CHF {service.priceFrom}</p>
                          </div>
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'bg-primary border-primary' : 'border-muted'}
                          `}>
                            {isSelected && <Check className="h-4 w-4 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* DIY Option (Value-Hunter) */}
                <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                  <Checkbox
                    id="diy"
                    checked={wantDIY}
                    onCheckedChange={(checked) => setWantDIY(checked === true)}
                  />
                  <Label htmlFor="diy" className="flex-1 cursor-pointer">
                    <div className="font-medium">Ich helfe selbst mit</div>
                    <p className="text-xs text-muted-foreground">Beim Tragen unterstützen = bis zu 12% sparen</p>
                  </Label>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">-12%</Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    className="flex-1 gap-2"
                    size="lg"
                  >
                    Weiter zu Kontakt
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Trust & Contact */}
            {currentStep === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold">Fast geschafft!</h2>
                  <p className="text-muted-foreground text-sm mt-1">Nur noch Ihre Kontaktdaten für die Offerten</p>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-2 p-4 bg-muted/30 rounded-xl text-center text-xs">
                  <div>
                    <Lock className="h-5 w-5 mx-auto text-green-600 mb-1" />
                    <div className="font-medium">SSL Verschlüsselt</div>
                  </div>
                  <div>
                    <Shield className="h-5 w-5 mx-auto text-blue-600 mb-1" />
                    <div className="font-medium">CH Datenschutz</div>
                  </div>
                  <div>
                    <Users className="h-5 w-5 mx-auto text-yellow-600 mb-1" />
                    <div className="font-medium">Max. 3 Firmen</div>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Max Muster"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="max@beispiel.ch"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="079 123 45 67"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <Checkbox
                      id="terms"
                      checked={acceptTerms}
                      onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                    />
                    <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer">
                      Ich akzeptiere die AGB und Datenschutzbestimmungen. 
                      Meine Daten werden nur an max. 3 geprüfte Umzugsfirmen weitergegeben.
                    </Label>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="text-center text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    34 Personen aus {fromCity || 'Zürich'} haben heute Offerten angefordert
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Zurück
                  </Button>
                  <Button 
                    onClick={() => {
                      nextStep();
                      startAnalysis();
                    }} 
                    className="flex-1 gap-2"
                    size="lg"
                    disabled={!name || !email || !phone || !acceptTerms}
                  >
                    Kostenlose Offerten erhalten
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 6: Results Dashboard */}
            {currentStep === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Labor Illusion - Analyzing */}
                {isAnalyzing && (
                  <div className="text-center py-12 space-y-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                      <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold mb-2">Suche die besten Angebote...</h2>
                      <p className="text-muted-foreground text-sm">
                        {[
                          'Analysiere Ihre Anforderungen...',
                          'Vergleiche 54 zertifizierte Firmen...',
                          'Berechne optimale Preise...',
                          'Prüfe Verfügbarkeit...',
                          'Erstelle personalisierte Offerten...'
                        ][Math.min(analysisPhase, 4)]}
                      </p>
                    </div>
                    <Progress value={(analysisPhase / 5) * 100} className="max-w-xs mx-auto" />
                  </div>
                )}

                {/* Results */}
                {showResults && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold">Ihre Offerten sind bereit!</h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        3 passende Firmen wurden gefunden
                      </p>
                    </div>

                    {/* Price Summary */}
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Geschätzter Preis</span>
                          <span className="font-medium">CHF {priceEstimate.subtotal.toLocaleString()}</span>
                        </div>
                        {priceEstimate.savings > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span className="flex items-center gap-1">
                              <Percent className="h-3 w-3" />
                              Ihre Ersparnis
                            </span>
                            <span className="font-medium">- CHF {priceEstimate.savings.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-lg font-bold border-t pt-2">
                          <span>Endpreis ab</span>
                          <span className="text-primary">CHF {priceEstimate.total.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Matched Companies */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">Passende Umzugsfirmen:</h3>
                      {MATCHED_COMPANIES.map((company, index) => (
                        <div key={company.id} className="p-4 border rounded-xl flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                            {index === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                            {index === 1 && <Star className="h-6 w-6 text-gray-400" />}
                            {index === 2 && <Star className="h-6 w-6 text-amber-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{company.name}</span>
                              {company.astag && (
                                <Badge variant="outline" className="text-xs">ASTAG</Badge>
                              )}
                              {company.guarantee && (
                                <Badge className="text-xs bg-green-100 text-green-700">Garantie</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{company.rating}</span>
                              <span>({company.reviews} Bewertungen)</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted-foreground">ab</div>
                            <div className="font-bold text-primary">CHF {company.priceRange.split(' - ')[0]}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Next Steps */}
                    <div className="p-4 bg-muted/30 rounded-xl space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <ListChecks className="h-4 w-4" />
                        Nächste Schritte:
                      </h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-2">
                          <Check className="h-3 w-3 text-green-600" />
                          E-Mail-Bestätigung prüfen
                        </li>
                        <li className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          Offerten innerhalb 24h erwarten
                        </li>
                        <li className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          Ggf. Rückruf vereinbaren
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Saved Progress Toast */}
      <AnimatePresence>
        {savedProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-50"
          >
            <Check className="h-4 w-4" />
            Fortschritt gespeichert - Link per E-Mail gesendet
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default V2cArchetypCalculator;
