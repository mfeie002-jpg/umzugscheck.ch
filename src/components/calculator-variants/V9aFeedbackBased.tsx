/**
 * V9a - Gemini Archetyp Flow
 * 
 * Basiert auf dem umfassenden Gemini UX-Audit mit 10 Kernoptimierungen:
 * 
 * 1. Google Places Autocomplete (simuliert mit Smart-Input)
 * 2. Mobile Input Modes (inputMode="numeric", type="tel")
 * 3. Result Teasing (Glimp-Methode) - Unscharfe Ergebnisse vor Lead-Capture
 * 4. Visuelles Inventar (Gamification) - Icon-Grid statt Listen
 * 5. Progressive Disclosure - Ein Screen = Eine Frage
 * 6. Conditional Logic - Lift-Frage nur wenn Etage > EG
 * 7. Trust Badges "Above the Fold" - Direkt beim CTA
 * 8. Sticky CTA auf Mobile - Immer erreichbar
 * 9. Lade-Animation (Labor Illusion) - Wertschätzung steigern
 * 10. "Swissness" im Wording - Zügeln, Offerte, etc.
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
  CheckCircle,
  Building,
  Lock,
  Trash2,
  Archive,
  Loader2,
  Sofa,
  Bed,
  UtensilsCrossed,
  Bath,
  Briefcase,
  Box,
  Plus,
  Minus,
  ChevronUp,
  Search,
  Users
} from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

// Progressive Disclosure: 7 fokussierte Schritte
const STEPS = [
  { id: 1, title: 'Von wo?', shortTitle: 'Start' },
  { id: 2, title: 'Nach wo?', shortTitle: 'Ziel' },
  { id: 3, title: 'Wohnung', shortTitle: 'Grösse' },
  { id: 4, title: 'Inventar', shortTitle: 'Möbel' },
  { id: 5, title: 'Service', shortTitle: 'Paket' },
  { id: 6, title: 'Firmen', shortTitle: 'Auswahl' },
  { id: 7, title: 'Kontakt', shortTitle: 'Daten' },
];

// CH-konforme Zimmergrössen (Swissness)
const ROOM_OPTIONS = [
  { value: '1', label: '1 Zi.' },
  { value: '1.5', label: '1.5 Zi.' },
  { value: '2', label: '2 Zi.' },
  { value: '2.5', label: '2.5 Zi.' },
  { value: '3', label: '3 Zi.' },
  { value: '3.5', label: '3.5 Zi.' },
  { value: '4', label: '4 Zi.' },
  { value: '4.5', label: '4.5 Zi.' },
  { value: '5', label: '5 Zi.' },
  { value: '5.5', label: '5.5 Zi.' },
  { value: '6+', label: '6+ Zi.' },
];

const FLOOR_OPTIONS = [
  { value: 'EG', label: 'Erdgeschoss' },
  { value: '1', label: '1. Stock' },
  { value: '2', label: '2. Stock' },
  { value: '3', label: '3. Stock' },
  { value: '4', label: '4. Stock' },
  { value: '5+', label: '5+ Stock' },
];

// Visuelles Inventar mit Icons (Gamification)
const INVENTORY_ITEMS = [
  { id: 'sofa', icon: Sofa, label: 'Sofa', volume: 2.5 },
  { id: 'bed', icon: Bed, label: 'Bett', volume: 2.0 },
  { id: 'wardrobe', icon: Archive, label: 'Schrank', volume: 3.0 },
  { id: 'table', icon: UtensilsCrossed, label: 'Esstisch', volume: 1.5 },
  { id: 'desk', icon: Briefcase, label: 'Schreibtisch', volume: 1.2 },
  { id: 'boxes', icon: Box, label: 'Umzugskisten', volume: 0.1 },
];

// Service-Pakete
const SERVICE_PACKAGES = [
  {
    id: 'basis',
    name: 'Basis',
    description: 'Sie packen, wir zügeln',
    features: ['Transport', '2 Zügelhelfer', 'Basisversicherung'],
    priceMultiplier: 0.7,
  },
  {
    id: 'standard',
    name: 'Standard',
    tag: 'Beliebt',
    description: 'Komplettes Zügeln ohne Stress',
    features: ['Transport', '3 Zügelhelfer', 'Möbelmontage', 'Vollversicherung'],
    priceMultiplier: 1.0,
  },
  {
    id: 'komfort',
    name: 'Komfort',
    tag: 'Empfohlen',
    description: 'Rundum-Sorglos mit Packservice',
    features: ['Alles aus Standard', 'Ein- & Auspacken', 'Verpackungsmaterial', 'Nachbetreuung'],
    priceMultiplier: 1.4,
  },
];

// Mock Firmen für Result Teasing
const COMPANIES = [
  { id: '1', name: 'Züri Zügel AG', rating: 4.9, reviews: 342, responseTime: '2h', premium: true },
  { id: '2', name: 'SwissMove GmbH', rating: 4.8, reviews: 218, responseTime: '4h', premium: false },
  { id: '3', name: 'Profi Transport', rating: 4.7, reviews: 156, responseTime: '3h', premium: false },
  { id: '4', name: 'Express Zügel', rating: 4.6, reviews: 89, responseTime: '6h', premium: false },
];

// Schweizer PLZ Autocomplete Simulation
const SWISS_CITIES: Record<string, string> = {
  '8000': 'Zürich',
  '8001': 'Zürich',
  '8002': 'Zürich',
  '8003': 'Zürich',
  '8004': 'Zürich',
  '8005': 'Zürich',
  '8006': 'Zürich',
  '8008': 'Zürich',
  '8032': 'Zürich',
  '8037': 'Zürich',
  '8038': 'Zürich',
  '8041': 'Zürich',
  '8044': 'Zürich',
  '8045': 'Zürich',
  '8046': 'Zürich',
  '8047': 'Zürich',
  '8048': 'Zürich',
  '8049': 'Zürich',
  '8050': 'Zürich',
  '8051': 'Zürich',
  '8052': 'Zürich',
  '8053': 'Zürich',
  '8055': 'Zürich',
  '8057': 'Zürich',
  '8064': 'Zürich',
  '3000': 'Bern',
  '3001': 'Bern',
  '3004': 'Bern',
  '3005': 'Bern',
  '3006': 'Bern',
  '3007': 'Bern',
  '3008': 'Bern',
  '3010': 'Bern',
  '3011': 'Bern',
  '3012': 'Bern',
  '3013': 'Bern',
  '3014': 'Bern',
  '3018': 'Bern',
  '4000': 'Basel',
  '4001': 'Basel',
  '4051': 'Basel',
  '4052': 'Basel',
  '4053': 'Basel',
  '4054': 'Basel',
  '4055': 'Basel',
  '4056': 'Basel',
  '4057': 'Basel',
  '4058': 'Basel',
  '1000': 'Lausanne',
  '1003': 'Lausanne',
  '1004': 'Lausanne',
  '1005': 'Lausanne',
  '1006': 'Lausanne',
  '1007': 'Lausanne',
  '1010': 'Lausanne',
  '1200': 'Genève',
  '1201': 'Genève',
  '1202': 'Genève',
  '1203': 'Genève',
  '1204': 'Genève',
  '1205': 'Genève',
  '1206': 'Genève',
  '1207': 'Genève',
  '6000': 'Luzern',
  '6003': 'Luzern',
  '6004': 'Luzern',
  '6005': 'Luzern',
  '6006': 'Luzern',
  '9000': 'St. Gallen',
  '9001': 'St. Gallen',
  '5000': 'Aarau',
  '5001': 'Aarau',
  '8400': 'Winterthur',
  '8401': 'Winterthur',
  '8404': 'Winterthur',
  '8405': 'Winterthur',
  '8406': 'Winterthur',
};

export const V9aFeedbackBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  // Step 1: Von wo? (Progressive Disclosure)
  const [fromZip, setFromZip] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [fromFloor, setFromFloor] = useState('');
  const [fromLift, setFromLift] = useState<boolean | null>(null);
  
  // Step 2: Nach wo?
  const [toZip, setToZip] = useState('');
  const [toCity, setToCity] = useState('');
  const [toFloor, setToFloor] = useState('');
  const [toLift, setToLift] = useState<boolean | null>(null);
  
  // Step 3: Wohnung
  const [rooms, setRooms] = useState('3.5');
  const [moveDate, setMoveDate] = useState('');
  const [dateFlexible, setDateFlexible] = useState(false);
  
  // Step 4: Inventar (Gamification)
  const [inventory, setInventory] = useState<Record<string, number>>({
    sofa: 1,
    bed: 2,
    wardrobe: 2,
    table: 1,
    desk: 1,
    boxes: 20,
  });
  
  // Step 5: Service
  const [selectedPackage, setSelectedPackage] = useState('standard');
  const [addCleaning, setAddCleaning] = useState(false);
  
  // Step 6: Firmen (Result Teasing)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['1', '2', '3']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  
  // Step 7: Kontakt
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const progress = (currentStep / STEPS.length) * 100;
  
  // Auto-fill city from PLZ (Google Places Simulation)
  useEffect(() => {
    if (fromZip.length === 4 && SWISS_CITIES[fromZip]) {
      setFromCity(SWISS_CITIES[fromZip]);
    }
  }, [fromZip]);
  
  useEffect(() => {
    if (toZip.length === 4 && SWISS_CITIES[toZip]) {
      setToCity(SWISS_CITIES[toZip]);
    }
  }, [toZip]);
  
  // Calculate volume from inventory
  const totalVolume = useMemo(() => {
    return Object.entries(inventory).reduce((sum, [id, count]) => {
      const item = INVENTORY_ITEMS.find(i => i.id === id);
      return sum + (item?.volume || 0) * count;
    }, 0);
  }, [inventory]);
  
  // Calculate price
  const basePrice = useMemo(() => {
    const roomValue = parseFloat(rooms) || 3;
    const volumeBonus = totalVolume * 15;
    const floorCost = (parseInt(fromFloor) || 0) * 40 + (parseInt(toFloor) || 0) * 40;
    const liftDiscount = (fromLift ? -50 : 0) + (toLift ? -50 : 0);
    
    return Math.round(800 + (roomValue * 280) + volumeBonus + floorCost + liftDiscount);
  }, [rooms, totalVolume, fromFloor, toFloor, fromLift, toLift]);
  
  const packagePrice = useMemo(() => {
    const pkg = SERVICE_PACKAGES.find(p => p.id === selectedPackage);
    const base = Math.round(basePrice * (pkg?.priceMultiplier || 1));
    return addCleaning ? base + 380 : base;
  }, [basePrice, selectedPackage, addCleaning]);

  // Conditional Logic: Lift-Frage nur wenn Etage > EG
  const showFromLift = fromFloor && fromFloor !== 'EG';
  const showToLift = toFloor && toFloor !== 'EG';

  const canProceed = () => {
    switch (currentStep) {
      case 1: return fromZip.length === 4 && fromFloor;
      case 2: return toZip.length === 4 && toFloor;
      case 3: return rooms;
      case 4: return totalVolume > 0;
      case 5: return selectedPackage;
      case 6: return selectedCompanies.length >= 1 && analysisComplete;
      case 7: return name && email && phone && consent;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      // Labor Illusion bei Step 5 -> 6
      if (currentStep === 5) {
        setIsAnalyzing(true);
        setCurrentStep(6);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Simulierte Analyse mit Fortschritt
        setTimeout(() => setAnalysisComplete(true), 2500);
        setTimeout(() => setIsAnalyzing(false), 3000);
      } else {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (currentStep === 6) {
        setAnalysisComplete(false);
      }
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

  const toggleCompany = (id: string) => {
    setSelectedCompanies(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      } else if (prev.length < 4) {
        return [...prev, id];
      }
      return prev;
    });
  };

  // Success Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Offerten-Anfrage gesendet!</h1>
          <p className="text-muted-foreground mb-6">
            {selectedCompanies.length} geprüfte Zügelfirmen erhalten Ihre Anfrage.
          </p>
          
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{selectedCompanies.length}</div>
                <div className="text-xs text-muted-foreground">Firmen</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-xs text-muted-foreground">Antwortzeit</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">CHF 0</div>
                <div className="text-xs text-muted-foreground">Ihre Kosten</div>
              </div>
            </div>
          </Card>
          
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <span>Bestätigung an {email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span>Daten nur an ausgewählte Firmen</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Lock className="h-4 w-4 text-primary" />
              <span>Kein Spam, keine Weitergabe</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-32 md:pb-24">
      {/* Minimaler Funnel Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {currentStep > 1 && (
                <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <span className="text-sm font-medium">
                {currentStep} / {STEPS.length}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              V9.a Gemini
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto px-4 py-6">
        
        {/* Step 1: Von wo? (Progressive Disclosure) */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Von wo zügeln Sie?</h1>
              <p className="text-muted-foreground text-sm">
                Auszugsadresse angeben
              </p>
            </div>
            
            {/* PLZ mit Autocomplete-Simulation */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Postleitzahl
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="z.B. 8001"
                      value={fromZip}
                      onChange={(e) => setFromZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="text-lg h-12"
                      maxLength={4}
                    />
                    {fromCity && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {fromCity}
                      </div>
                    )}
                  </div>
                  {fromZip.length === 4 && !SWISS_CITIES[fromZip] && (
                    <Input
                      placeholder="Ort eingeben"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
                
                {/* Stockwerk */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Stockwerk</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {FLOOR_OPTIONS.map((floor) => (
                      <button
                        key={floor.value}
                        onClick={() => setFromFloor(floor.value)}
                        className={`p-2.5 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                          fromFloor === floor.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {floor.value === 'EG' ? 'EG' : floor.value}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Conditional Logic: Lift nur wenn Etage > EG */}
                {showFromLift && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-sm font-medium">Lift vorhanden?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setFromLift(true)}
                        className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                          fromLift === true
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Building className="h-5 w-5 mx-auto mb-1" />
                        Ja, Lift
                      </button>
                      <button
                        onClick={() => setFromLift(false)}
                        className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                          fromLift === false
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <ChevronUp className="h-5 w-5 mx-auto mb-1" />
                        Kein Lift
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Trust Badges Above the Fold */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-600" /> Versichert
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" /> Geprüfte Firmen
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-green-600" /> Datensicher
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Nach wo? */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Wohin zügeln Sie?</h1>
              <p className="text-muted-foreground text-sm">
                Einzugsadresse angeben
              </p>
            </div>
            
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Home className="h-4 w-4 text-green-600" />
                    Postleitzahl
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="z.B. 3000"
                      value={toZip}
                      onChange={(e) => setToZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="text-lg h-12"
                      maxLength={4}
                    />
                    {toCity && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        {toCity}
                      </div>
                    )}
                  </div>
                  {toZip.length === 4 && !SWISS_CITIES[toZip] && (
                    <Input
                      placeholder="Ort eingeben"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="mt-2"
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Stockwerk</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {FLOOR_OPTIONS.map((floor) => (
                      <button
                        key={floor.value}
                        onClick={() => setToFloor(floor.value)}
                        className={`p-2.5 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                          toFloor === floor.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        {floor.value === 'EG' ? 'EG' : floor.value}
                      </button>
                    ))}
                  </div>
                </div>
                
                {showToLift && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-sm font-medium">Lift vorhanden?</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setToLift(true)}
                        className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                          toLift === true
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Building className="h-5 w-5 mx-auto mb-1" />
                        Ja, Lift
                      </button>
                      <button
                        onClick={() => setToLift(false)}
                        className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                          toLift === false
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <ChevronUp className="h-5 w-5 mx-auto mb-1" />
                        Kein Lift
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Route Summary */}
            {fromCity && toCity && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{fromCity}</span>
                <ArrowRight className="h-4 w-4" />
                <Home className="h-4 w-4" />
                <span>{toCity}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Wohnung & Termin */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Ihre Wohnung</h1>
              <p className="text-muted-foreground text-sm">
                Grösse und Wunschtermin
              </p>
            </div>
            
            {/* CH-konforme Zimmergrösse */}
            <Card>
              <CardContent className="p-5">
                <Label className="text-sm font-medium mb-3 block">
                  Wohnungsgrösse (z.B. 3.5-Zimmer)
                </Label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {ROOM_OPTIONS.map((room) => (
                    <button
                      key={room.value}
                      onClick={() => setRooms(room.value)}
                      className={`p-2.5 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                        rooms === room.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Termin */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  Wunschtermin
                </Label>
                
                {!dateFlexible && (
                  <Input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="h-12"
                  />
                )}
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="flexible"
                    checked={dateFlexible}
                    onCheckedChange={(checked) => setDateFlexible(checked as boolean)}
                  />
                  <label htmlFor="flexible" className="text-sm cursor-pointer">
                    Termin flexibel / noch offen
                  </label>
                </div>
              </CardContent>
            </Card>
            
            {/* Erste Schätzung */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Erste Schätzung</div>
                    <div className="text-xl font-bold">
                      CHF {basePrice.toLocaleString('de-CH')} – {Math.round(basePrice * 1.4).toLocaleString('de-CH')}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    4.8
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Inventar (Gamification) */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Was wird gezügelt?</h1>
              <p className="text-muted-foreground text-sm">
                Tippen Sie auf die Icons
              </p>
            </div>
            
            {/* Icon-Grid Inventar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {INVENTORY_ITEMS.map((item) => (
                <Card key={item.id} className={`transition-all ${
                  inventory[item.id] > 0 ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                }`}>
                  <CardContent className="p-4 text-center">
                    <item.icon className={`h-8 w-8 mx-auto mb-2 ${
                      inventory[item.id] > 0 ? 'text-primary' : 'text-muted-foreground'
                    }`} />
                    <div className="text-sm font-medium mb-2">{item.label}</div>
                    
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => updateInventory(item.id, -1)}
                        disabled={inventory[item.id] === 0}
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center disabled:opacity-30 hover:bg-muted-foreground/20 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-bold text-lg">
                        {inventory[item.id] || 0}
                      </span>
                      <button
                        onClick={() => updateInventory(item.id, item.id === 'boxes' ? 5 : 1)}
                        className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Volume Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Geschätztes Volumen</div>
                    <div className="text-lg font-bold">{totalVolume.toFixed(1)} m³</div>
                  </div>
                  <Badge variant="secondary">
                    {totalVolume < 15 ? 'Kleiner Umzug' : totalVolume < 30 ? 'Mittlerer Umzug' : 'Grosser Umzug'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Service-Paket */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Welches Paket?</h1>
              <p className="text-muted-foreground text-sm">
                Wählen Sie Ihren Service-Level
              </p>
            </div>
            
            {/* Service Cards */}
            <div className="space-y-3">
              {SERVICE_PACKAGES.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${
                    selectedPackage === pkg.id 
                      ? 'ring-2 ring-primary bg-primary/5' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{pkg.name}</span>
                          {pkg.tag && (
                            <Badge variant="secondary" className="text-xs">{pkg.tag}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackage === pkg.id ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}>
                        {selectedPackage === pkg.id && <Check className="h-3 w-3 text-primary-foreground" />}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.features.map((f, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{f}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Add-On: Reinigung mit Abnahmegarantie */}
            <Card className={`cursor-pointer transition-all ${
              addCleaning ? 'ring-2 ring-primary bg-primary/5' : ''
            }`} onClick={() => setAddCleaning(!addCleaning)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${addCleaning ? 'bg-primary/20' : 'bg-muted'}`}>
                      <Sparkles className={`h-5 w-5 ${addCleaning ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="font-medium">Endreinigung mit Abnahmegarantie</div>
                      <div className="text-sm text-muted-foreground">+ CHF 380</div>
                    </div>
                  </div>
                  <Checkbox checked={addCleaning} />
                </div>
              </CardContent>
            </Card>
            
            {/* Price Preview */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Geschätzter Preis</div>
                    <div className="text-2xl font-bold text-primary">
                      CHF {packagePrice.toLocaleString('de-CH')}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Ersparnis möglich</div>
                    <div className="text-sm font-medium text-green-600">bis 25%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 6: Firmen (Result Teasing + Labor Illusion) */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Passende Zügelfirmen</h1>
              <p className="text-muted-foreground text-sm">
                {isAnalyzing ? 'Analyse läuft...' : `${COMPANIES.length} Firmen in Ihrer Region`}
              </p>
            </div>
            
            {/* Labor Illusion - Analyseprozess */}
            {isAnalyzing && (
              <Card className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {[
                      { label: 'Prüfe Region...', delay: 0 },
                      { label: 'Filtere verfügbare Firmen...', delay: 800 },
                      { label: 'Berechne Bestpreise...', delay: 1600 },
                    ].map((step, i) => (
                      <div 
                        key={i}
                        className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4"
                        style={{ animationDelay: `${step.delay}ms` }}
                      >
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary-foreground" />
                        </div>
                        <span className="text-sm">{step.label}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 mt-4">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">Finalisiere...</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Result Teasing - Firmen (unscharf bis ausgewählt) */}
            {!isAnalyzing && (
              <div className="space-y-3">
                {COMPANIES.map((company) => (
                  <Card 
                    key={company.id}
                    className={`cursor-pointer transition-all ${
                      selectedCompanies.includes(company.id) 
                        ? 'ring-2 ring-primary' 
                        : 'opacity-75 hover:opacity-100'
                    }`}
                    onClick={() => toggleCompany(company.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            company.premium ? 'bg-yellow-100' : 'bg-muted'
                          }`}>
                            <Truck className={`h-6 w-6 ${company.premium ? 'text-yellow-600' : 'text-muted-foreground'}`} />
                          </div>
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {company.name}
                              {company.premium && <Badge className="text-xs bg-yellow-100 text-yellow-700">Premium</Badge>}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {company.rating} ({company.reviews})
                              <span className="text-xs">• Antwort in {company.responseTime}</span>
                            </div>
                          </div>
                        </div>
                        <Checkbox checked={selectedCompanies.includes(company.id)} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Selection Summary */}
            {!isAnalyzing && analysisComplete && (
              <div className="text-center text-sm text-muted-foreground">
                <Users className="h-4 w-4 inline mr-1" />
                {selectedCompanies.length} Firma{selectedCompanies.length !== 1 ? 'n' : ''} ausgewählt (max. 4)
              </div>
            )}
          </div>
        )}

        {/* Step 7: Kontakt */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Fast geschafft!</h1>
              <p className="text-muted-foreground text-sm">
                Wohin sollen wir die Offerten senden?
              </p>
            </div>
            
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    placeholder="Ihr Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoCapitalize="words"
                    autoComplete="name"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4" />
                    E-Mail
                  </Label>
                  <Input
                    type="email"
                    placeholder="ihre@email.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className="h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4" />
                    Telefon
                    <span className="text-xs text-muted-foreground font-normal">(für Rückfragen)</span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="079 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    inputMode="tel"
                    autoComplete="tel"
                    className="h-12"
                  />
                </div>
                
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
                    Ich akzeptiere die AGB und Datenschutzbestimmungen. Meine Daten werden nur an die ausgewählten {selectedCompanies.length} Firmen weitergegeben.
                  </label>
                </div>
              </CardContent>
            </Card>
            
            {/* Anti-Spam Promise */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg flex items-start gap-3 border border-blue-100 dark:border-blue-900">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900 dark:text-blue-100 leading-relaxed">
                <strong>Kein Spam-Versprechen:</strong> Ihre Anfrage wird nur an die {selectedCompanies.length} ausgewählten Firmen gesendet. Keine Weitergabe an Dritte.
              </div>
            </div>
            
            {/* Final Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Route:</span>
                    <div className="font-medium">{fromCity} → {toCity}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Paket:</span>
                    <div className="font-medium">{SERVICE_PACKAGES.find(p => p.id === selectedPackage)?.name}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Geschätzt:</span>
                    <div className="font-medium">CHF {packagePrice.toLocaleString('de-CH')}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Firmen:</span>
                    <div className="font-medium">{selectedCompanies.length} ausgewählt</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Sticky CTA auf Mobile */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t border-border pb-[calc(1rem+env(safe-area-inset-bottom))] z-50">
        <div className="max-w-xl mx-auto">
          {currentStep === STEPS.length ? (
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
              className="w-full h-14 text-lg font-bold shadow-lg"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sende Anfrage...
                </>
              ) : (
                <>
                  Kostenlos Offerten erhalten
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || (currentStep === 6 && isAnalyzing)}
              className="w-full h-14 text-lg font-bold shadow-lg"
              size="lg"
            >
              {currentStep === 6 && isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analysiere...
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
          
          {/* Trust Micro-Copy unter CTA */}
          <div className="flex justify-center gap-4 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3" /> Kostenlos
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" /> Unverbindlich
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default V9aFeedbackBased;
