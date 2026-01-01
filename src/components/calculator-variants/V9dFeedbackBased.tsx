/**
 * V9d - Main Gemini (Archetyp-Flow)
 * 
 * Basiert auf detailliertem Gemini UX Feedback - "Strategische Neuausrichtung":
 * - Progressive Disclosure: Eine Frage pro Screen
 * - Result Teasing: Unscharfe Ergebnisse vor Kontaktformular
 * - Labor Illusion: Animierte "Analyse läuft" Phase
 * - Visuelles Inventar mit Icons (Gamification)
 * - Swissness: CH-spezifisches Wording (Zügeln, Offerte)
 * - Mobile Input Modes: Numerische Tastatur, Autocomplete
 * - Conditional Logic: Intelligente Fragen
 * - Trust Badges above the fold
 * - Micro-Commitments: Einfacher Einstieg
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
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
  Users
} from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

// Progressive Disclosure: Mehr, kleinere Steps
const STEPS = [
  { id: 1, label: 'Start' },
  { id: 2, label: 'Von' },
  { id: 3, label: 'Nach' },
  { id: 4, label: 'Wann' },
  { id: 5, label: 'Wohnung' },
  { id: 6, label: 'Inventar' },
  { id: 7, label: 'Services' },
  { id: 8, label: 'Ergebnis' },
  { id: 9, label: 'Kontakt' },
];

// Swissness: CH-konforme Zimmergrössen
const ROOM_OPTIONS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6+'];

// Visuelles Inventar mit Icons
const INVENTORY_ITEMS = [
  { id: 'sofa', label: 'Sofa', icon: Sofa, category: 'wohnzimmer' },
  { id: 'armchair', label: 'Sessel', icon: Armchair, category: 'wohnzimmer' },
  { id: 'tv', label: 'TV/Möbel', icon: Tv, category: 'wohnzimmer' },
  { id: 'bookshelf', label: 'Regal', icon: BookOpen, category: 'wohnzimmer' },
  { id: 'bed', label: 'Bett', icon: Bed, category: 'schlafzimmer' },
  { id: 'wardrobe', label: 'Schrank', icon: Package, category: 'schlafzimmer' },
  { id: 'desk', label: 'Pult', icon: Lamp, category: 'schlafzimmer' },
  { id: 'fridge', label: 'Kühlschrank', icon: Refrigerator, category: 'kueche' },
  { id: 'washer', label: 'Waschm.', icon: Archive, category: 'kueche' },
  { id: 'table', label: 'Esstisch', icon: UtensilsCrossed, category: 'kueche' },
  { id: 'boxes', label: 'Kartons', icon: Box, category: 'sonstiges', defaultCount: 10 },
  { id: 'bike', label: 'Velo', icon: Bike, category: 'sonstiges' },
];

const SERVICES = [
  { id: 'packing', label: 'Packservice', description: 'Wir packen für dich', icon: Package, popular: true },
  { id: 'cleaning', label: 'Endreinigung', description: 'Mit Abnahmegarantie', icon: Sparkles, popular: true },
  { id: 'disposal', label: 'Entsorgung', description: 'Altmöbel entsorgen', icon: Trash2 },
  { id: 'storage', label: 'Lagerung', description: 'Zwischenlagerung', icon: Archive },
  { id: 'assembly', label: 'Montage', description: 'Möbel ab-/aufbauen', icon: Wrench },
];

// Mock companies for Result Teasing
const MATCHED_COMPANIES = [
  { id: '1', name: 'Züri Zügel AG', rating: 4.9, price: 'ab CHF 1\'890' },
  { id: '2', name: 'SwissMove', rating: 4.8, price: 'ab CHF 2\'150' },
  { id: '3', name: 'Blitz Transport', rating: 4.7, price: 'ab CHF 1\'780' },
];

export const V9dFeedbackBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  // Step 1: Micro-Commitment (Privat/Firma)
  const [moveType, setMoveType] = useState<'privat' | 'firma' | ''>('');
  
  // Step 2 & 3: Adressen (Progressive Disclosure)
  const [fromZip, setFromZip] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toZip, setToZip] = useState('');
  const [toCity, setToCity] = useState('');
  
  // Step 4: Datum
  const [moveDate, setMoveDate] = useState('');
  const [dateFlexible, setDateFlexible] = useState<'exact' | 'flexible' | 'unknown' | ''>('');
  
  // Step 5: Wohnung (Conditional Logic)
  const [rooms, setRooms] = useState('');
  const [floor, setFloor] = useState('');
  const [hasLift, setHasLift] = useState<boolean | null>(null);
  
  // Step 6: Visuelles Inventar
  const [inventory, setInventory] = useState<Record<string, number>>({});
  
  // Step 7: Services
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  
  // Step 8: Result Teasing (Labor Illusion)
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  // Step 9: Kontakt
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress = (currentStep / STEPS.length) * 100;

  // Labor Illusion Animation
  const analysisSteps = [
    { text: 'Prüfe Region...', icon: MapPin },
    { text: 'Berechne Volumen...', icon: Box },
    { text: 'Filtere Zügelpartner...', icon: Users },
    { text: 'Berechne Bestpreis...', icon: Award },
  ];

  useEffect(() => {
    if (isAnalyzing && analysisStep < analysisSteps.length) {
      const timer = setTimeout(() => {
        setAnalysisStep(prev => prev + 1);
      }, 700);
      return () => clearTimeout(timer);
    } else if (isAnalyzing && analysisStep >= analysisSteps.length) {
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResults(true);
      }, 500);
    }
  }, [isAnalyzing, analysisStep]);

  // Smart Defaults für Inventar basierend auf Zimmerzahl
  useEffect(() => {
    if (rooms && Object.keys(inventory).length === 0) {
      const roomCount = parseFloat(rooms) || 2;
      const defaults: Record<string, number> = {
        boxes: Math.round(roomCount * 8),
        bed: Math.min(Math.ceil(roomCount / 2), 3),
        wardrobe: Math.min(Math.ceil(roomCount / 2), 3),
        sofa: 1,
        table: 1,
        fridge: 1,
      };
      setInventory(defaults);
    }
  }, [rooms]);

  // Calculate price estimate
  const priceEstimate = useMemo(() => {
    const roomValue = parseFloat(rooms) || 3;
    const floorValue = floor === 'eg' ? 0 : parseInt(floor) || 2;
    const liftFactor = hasLift ? 1 : 1.15;
    const inventoryCount = Object.values(inventory).reduce((a, b) => a + b, 0);
    const servicesFactor = 1 + (selectedServices.length * 0.15);
    
    const base = 800 + (roomValue * 280) + (floorValue * 60) + (inventoryCount * 15);
    return Math.round(base * liftFactor * servicesFactor);
  }, [rooms, floor, hasLift, inventory, selectedServices]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return moveType !== '';
      case 2: return fromZip.length === 4;
      case 3: return toZip.length === 4;
      case 4: return dateFlexible !== '';
      case 5: return rooms && floor && (floor === 'eg' || hasLift !== null);
      case 6: return Object.values(inventory).some(v => v > 0);
      case 7: return true;
      case 8: return showResults;
      case 9: return name && email && consent;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 7) {
      // Start Labor Illusion
      setCurrentStep(8);
      setIsAnalyzing(true);
      setAnalysisStep(0);
    } else if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      if (currentStep === 8) {
        setShowResults(false);
        setIsAnalyzing(false);
      }
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsComplete(true);
    }, 1500);
  };

  const updateInventory = (id: string, delta: number) => {
    setInventory(prev => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta)
    }));
  };

  // Completion Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Merci vielmal!</h1>
          <p className="text-muted-foreground mb-6">
            Du erhältst in Kürze unverbindliche Offerten von 3 geprüften Zügelpartnern.
          </p>
          
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Offerten</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-xs text-muted-foreground">Antwortzeit</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">CHF 0</div>
                <div className="text-xs text-muted-foreground">Für dich</div>
              </div>
            </div>
          </Card>
          
          <div className="text-left space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span>Bestätigung an {email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <span>Keine Weitergabe an Dritte</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 overflow-x-hidden max-w-full">
      {/* Minimal Header - Fixed Progress Indicator */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            {currentStep > 1 ? (
              <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0 min-h-[44px] min-w-[44px]">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : (
              <div className="w-11" />
            )}
            <span className="text-sm font-medium text-muted-foreground">
              Schritt {Math.min(currentStep, STEPS.length)} von {STEPS.length}
            </span>
            <Badge variant="secondary" className="text-xs">V9.d</Badge>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 py-8 pb-32">
        
        {/* Step 1: Micro-Commitment */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Zügeln leicht gemacht</h1>
              <p className="text-muted-foreground">
                In 2 Minuten zu 3 unverbindlichen Offerten
              </p>
            </div>
            
            {/* Trust Badges Above the Fold */}
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3.5 w-3.5 text-green-600" />
                Geprüft
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-yellow-500" />
                4.8/5
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                12'000+ Umzüge
              </span>
            </div>
            
            {/* Micro-Commitment: Einfache Wahl */}
            <div className="space-y-3">
              <p className="text-center text-sm font-medium">Was möchtest du zügeln?</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setMoveType('privat')}
                  className={`p-6 rounded-xl border-2 text-center transition-all ${
                    moveType === 'privat'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Home className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <span className="font-medium">Privatumzug</span>
                </button>
                <button
                  onClick={() => setMoveType('firma')}
                  className={`p-6 rounded-xl border-2 text-center transition-all ${
                    moveType === 'firma'
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <span className="font-medium">Firmenumzug</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Von wo? (Progressive Disclosure) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Von wo zügelst du?</h1>
              <p className="text-muted-foreground text-sm">Dein aktueller Wohnort</p>
            </div>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input
                    placeholder="PLZ eingeben"
                    value={fromZip}
                    onChange={(e) => setFromZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="postal-code"
                    className="pl-10 h-14 text-lg"
                    maxLength={4}
                  />
                </div>
                {fromZip.length === 4 && (
                  <Input
                    placeholder="Ort (optional)"
                    value={fromCity}
                    onChange={(e) => setFromCity(e.target.value)}
                    autoCapitalize="words"
                    className="h-12"
                  />
                )}
              </CardContent>
            </Card>
            
            {fromZip.length === 4 && (
              <div className="flex items-center justify-center gap-2 text-sm text-green-600 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4" />
                <span>PLZ erkannt</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Nach wo? */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Wohin geht's?</h1>
              <p className="text-muted-foreground text-sm">Dein neuer Wohnort</p>
            </div>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600" />
                  <Input
                    placeholder="PLZ eingeben"
                    value={toZip}
                    onChange={(e) => setToZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    autoComplete="postal-code"
                    className="pl-10 h-14 text-lg"
                    maxLength={4}
                  />
                </div>
                {toZip.length === 4 && (
                  <Input
                    placeholder="Ort (optional)"
                    value={toCity}
                    onChange={(e) => setToCity(e.target.value)}
                    autoCapitalize="words"
                    className="h-12"
                  />
                )}
              </CardContent>
            </Card>
            
            {fromZip && toZip.length === 4 && (
              <div className="text-center text-sm text-muted-foreground animate-in fade-in">
                <span className="font-medium">{fromZip}</span>
                <ArrowRight className="h-4 w-4 inline mx-2" />
                <span className="font-medium">{toZip}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Wann? */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Wann möchtest du zügeln?</h1>
              <p className="text-muted-foreground text-sm">Flexibilität kann bis 15% sparen</p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setDateFlexible('exact')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  dateFlexible === 'exact'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">Festes Datum</div>
                <p className="text-sm text-muted-foreground">Ich weiss genau wann</p>
              </button>
              
              <button
                onClick={() => setDateFlexible('flexible')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  dateFlexible === 'flexible'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">Flexibel ±3 Tage</span>
                  <Badge variant="secondary" className="text-xs text-green-600 bg-green-50">Spart Geld</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Ich bin flexibel</p>
              </button>
              
              <button
                onClick={() => setDateFlexible('unknown')}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  dateFlexible === 'unknown'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="font-medium">Noch unklar</div>
                <p className="text-sm text-muted-foreground">Ich informiere mich erst</p>
              </button>
            </div>
            
            {(dateFlexible === 'exact' || dateFlexible === 'flexible') && (
              <Card className="animate-in fade-in">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Wunschtermin
                  </Label>
                  <Input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12"
                  />
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 5: Wohnung (Conditional Logic) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Deine Wohnung</h1>
              <p className="text-muted-foreground text-sm">Für eine genaue Schätzung</p>
            </div>
            
            {/* Zimmer */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-3 block">Anzahl Zimmer</Label>
                <div className="flex flex-wrap gap-2">
                  {ROOM_OPTIONS.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRooms(r)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        rooms === r
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Stockwerk */}
            <Card>
              <CardContent className="p-4">
                <Label className="text-sm font-medium mb-3 block">Stockwerk</Label>
                <div className="flex flex-wrap gap-2">
                  {['eg', '1', '2', '3', '4', '5+'].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFloor(f);
                        if (f === 'eg') setHasLift(null);
                      }}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        floor === f
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {f === 'eg' ? 'EG' : f === '5+' ? '5+' : `${f}. OG`}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Lift - Conditional Logic: Nur wenn nicht EG */}
            {floor && floor !== 'eg' && (
              <Card className="animate-in fade-in">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-3 block">Lift vorhanden?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setHasLift(true)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        hasLift === true
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">Ja</span>
                    </button>
                    <button
                      onClick={() => setHasLift(false)}
                      className={`p-3 rounded-lg border-2 text-center transition-all ${
                        hasLift === false
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="font-medium">Nein</span>
                      <div className="text-xs text-muted-foreground">+15%</div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 6: Visuelles Inventar (Gamification) */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Was wird gezügelt?</h1>
              <p className="text-muted-foreground text-sm">Tippe auf die Gegenstände</p>
            </div>
            
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-3">
                  {INVENTORY_ITEMS.map((item) => {
                    const count = inventory[item.id] || 0;
                    const Icon = item.icon;
                    
                    return (
                      <div
                        key={item.id}
                        className={`relative p-3 rounded-xl border-2 text-center transition-all ${
                          count > 0
                            ? 'border-primary bg-primary/5'
                            : 'border-border'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-1 ${count > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                        <div className="text-xs font-medium truncate">{item.label}</div>
                        
                        <div className="flex items-center justify-center gap-1 mt-2">
                          <button
                            onClick={() => updateInventory(item.id, -1)}
                            className="w-6 h-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80"
                            disabled={count === 0}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-bold">{count}</span>
                          <button
                            onClick={() => updateInventory(item.id, 1)}
                            className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {Object.values(inventory).some(v => v > 0) && (
              <div className="text-center text-sm text-muted-foreground animate-in fade-in">
                {Object.values(inventory).reduce((a, b) => a + b, 0)} Gegenstände ausgewählt
              </div>
            )}
          </div>
        )}

        {/* Step 7: Services */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Zusätzliche Services?</h1>
              <p className="text-muted-foreground text-sm">Optional – alles abwählbar</p>
            </div>
            
            <div className="space-y-3">
              {SERVICES.map((service) => {
                const isSelected = selectedServices.includes(service.id);
                const Icon = service.icon;
                
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedServices(prev => 
                      isSelected ? prev.filter(s => s !== service.id) : [...prev, service.id]
                    )}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Icon className={`h-5 w-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{service.label}</span>
                        {service.popular && (
                          <Badge variant="secondary" className="text-xs">Beliebt</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setSelectedServices([])}
              className="w-full text-center text-sm text-muted-foreground hover:text-foreground"
            >
              Keine Zusatzservices
            </button>
          </div>
        )}

        {/* Step 8: Result Teasing (Labor Illusion) */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-in fade-in">
            {isAnalyzing && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-6" />
                <h2 className="text-xl font-bold mb-6">Analyse läuft...</h2>
                <div className="space-y-3 max-w-xs mx-auto">
                  {analysisSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isComplete = index < analysisStep;
                    const isCurrent = index === analysisStep;
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                          isComplete ? 'bg-green-50 text-green-700' : isCurrent ? 'bg-primary/5' : 'opacity-40'
                        }`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Icon className={`h-5 w-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                        )}
                        <span className="text-sm font-medium">{step.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            {showResults && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-3 text-green-600 bg-green-50">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    3 Partner gefunden
                  </Badge>
                  <h1 className="text-2xl font-bold mb-2">Deine Offerten sind bereit!</h1>
                  <p className="text-muted-foreground text-sm">
                    Entsperre die Details mit deinen Kontaktdaten
                  </p>
                </div>
                
                {/* Blurred Results (Result Teasing) */}
                <div className="space-y-3 relative">
                  {MATCHED_COMPANIES.map((company) => (
                    <Card key={company.id} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center gap-4 blur-sm select-none">
                        <div className="w-12 h-12 rounded-lg bg-muted" />
                        <div className="flex-1">
                          <div className="font-medium">{company.name}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {company.rating}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">{company.price}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm rounded-xl">
                    <div className="text-center">
                      <Eye className="h-8 w-8 mx-auto text-primary mb-2" />
                      <p className="text-sm font-medium">Preise freischalten</p>
                    </div>
                  </div>
                </div>
                
                {/* Price Estimate */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-muted-foreground">Geschätzter Preis</div>
                    <div className="text-2xl font-bold">
                      CHF {priceEstimate.toLocaleString('de-CH')} – {Math.round(priceEstimate * 1.3).toLocaleString('de-CH')}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Step 9: Kontakt */}
        {currentStep === 9 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Wohin die Offerten?</h1>
              <p className="text-muted-foreground text-sm">
                Du erhältst 3 unverbindliche Offerten
              </p>
            </div>
            
            <Card>
              <CardContent className="p-5 space-y-4">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Name</Label>
                  <Input
                    placeholder="Dein Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoCapitalize="words"
                    autoComplete="name"
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">E-Mail</Label>
                  <Input
                    type="email"
                    placeholder="deine@email.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="h-12"
                  />
                </div>
                
                <div>
                  <Label className="text-sm font-medium mb-2 block">Telefon (optional)</Label>
                  <Input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    className="h-12"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Nur für Rückfragen der Zügelpartner
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Consent mit Swissness */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                Ich akzeptiere die AGB und Datenschutzbestimmungen. Meine Daten werden nur an max. 5 ausgewählte Zügelpartner weitergegeben. Keine Werbung durch Dritte.
              </label>
            </div>
            
            {/* Trust */}
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" /> SSL
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> Datenschutz CH
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky CTA - Always visible, clear action text */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
        <div className="max-w-lg mx-auto space-y-2">
          <Button
            size="lg"
            className="w-full h-14 text-base font-semibold rounded-xl min-h-[56px]"
            onClick={currentStep === 9 ? handleSubmit : handleNext}
            disabled={!canProceed() || isSubmitting || (currentStep === 8 && isAnalyzing)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Wird gesendet...
              </>
            ) : currentStep === 9 ? (
              <>
                Jetzt unverbindlich anfragen
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            ) : currentStep === 8 ? (
              <>
                Preise freischalten
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            ) : (
              <>
                Weiter zu {STEPS[currentStep]?.label || 'nächster Schritt'}
                <ChevronRight className="h-5 w-5 ml-1" />
              </>
            )}
          </Button>
          {/* Trust Microcopy below CTA */}
          <p className="text-xs text-center text-muted-foreground">
            100% kostenlos & unverbindlich • Keine Registrierung
          </p>
        </div>
      </div>
    </div>
  );
};

export default V9dFeedbackBased;
