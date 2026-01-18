/**
 * V9b - ChatGPT Pro Ext Flow
 * 
 * Basiert auf detailliertem ChatGPT UX-Feedback mit Top 10 Optimierungen:
 * 
 * 1. CH-konforme Zimmergrössen (2.5, 3.5, 4.5)
 * 2. Funnel-Modus: Navigation minimiert im Flow
 * 3. Video-Scan mit Privacy Trust Signals
 * 4. Service-Pakete als Karten statt Slider
 * 5. Sticky Price Bar auf Mobile
 * 6. Vereinfachte Firmenauswahl mit 3 Empfehlungen
 * 7. Preis-Konsistenz (Fixpreis durchgängig)
 * 8. CH Datum/Locale mit Flexibilitäts-Explanation
 * 9. Trust im Flow verstärkt
 * 10. Mobile-optimiert mit grossen Touch-Targets
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
  Package,
  Sparkles,
  CheckCircle2,
  Building,
  Lock,
  Trash2,
  Archive,
  Loader2,
  ChevronUp,
  Users,
  Award,
  Video,
  Info
} from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

// 5 fokussierte Steps (ChatGPT Feedback: klare Step-Konsistenz)
const STEPS = [
  { id: 1, title: 'Adressen', shortTitle: 'Von/Nach' },
  { id: 2, title: 'Details', shortTitle: 'Wohnung' },
  { id: 3, title: 'Services', shortTitle: 'Paket' },
  { id: 4, title: 'Extras & Datum', shortTitle: 'Extras' },
  { id: 5, title: 'Firmen & Kontakt', shortTitle: 'Absenden' },
];

// CH-konforme Zimmergrössen (Feedback #4)
const ROOM_OPTIONS = [
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3' },
  { value: '3.5', label: '3.5' },
  { value: '4', label: '4' },
  { value: '4.5', label: '4.5' },
  { value: '5', label: '5' },
  { value: '5.5', label: '5.5' },
  { value: '6+', label: '6+' },
];

const FLOOR_OPTIONS = [
  { value: 'EG', label: 'Erdgeschoss' },
  { value: '1', label: '1. Stock' },
  { value: '2', label: '2. Stock' },
  { value: '3', label: '3. Stock' },
  { value: '4', label: '4. Stock' },
  { value: '5+', label: '5+ Stock' },
];

// Service-Pakete als Karten (Feedback #10 - Slider → Karten)
const SERVICE_PACKAGES = [
  {
    id: 'basis',
    name: 'Basis',
    description: 'Sie packen, wir transportieren',
    features: ['Transport', '2 Zügelhelfer', 'Basisversicherung'],
    priceDelta: '- CHF 450',
    multiplier: 0.7,
  },
  {
    id: 'standard',
    name: 'Standard',
    tag: 'Beliebt',
    description: 'Komplettes Zügeln ohne Stress',
    features: ['Transport', '3 Zügelhelfer', 'Möbelmontage', 'Vollversicherung'],
    priceDelta: 'Inklusiv',
    multiplier: 1.0,
  },
  {
    id: 'komfort',
    name: 'Komfort',
    tag: 'Empfohlen',
    description: 'Rundum-Sorglos mit Packservice',
    features: ['Alles aus Standard', 'Ein- & Auspacken', 'Verpackungsmaterial', 'Nachbetreuung'],
    priceDelta: '+ CHF 650',
    multiplier: 1.35,
  },
];

// Extras (Feedback: nichts vorauswählen, nur "Beliebt"-Tag)
const EXTRAS = [
  { id: 'packing', label: 'Ein-/Auspacken', price: 320, popular: true },
  { id: 'cleaning', label: 'Endreinigung', price: 380, popular: true },
  { id: 'disposal', label: 'Entsorgung', price: 150 },
  { id: 'storage', label: 'Zwischenlagerung', price: 200 },
  { id: 'admin', label: 'Admin-Paket', price: 50 },
];

// Mock Firmen (Feedback #6: 3 Empfehlungen vorselektiert)
const COMPANIES = [
  { id: '1', name: 'Züri Zügel AG', rating: 4.9, reviews: 342, responseTime: '< 2h', recommended: true, premium: true },
  { id: '2', name: 'SwissMove GmbH', rating: 4.8, reviews: 218, responseTime: '< 4h', recommended: true },
  { id: '3', name: 'Profi Transport', rating: 4.7, reviews: 156, responseTime: '< 3h', recommended: true },
  { id: '4', name: 'Express Zügel', rating: 4.6, reviews: 89, responseTime: '< 6h' },
  { id: '5', name: 'Blitz Umzüge', rating: 4.5, reviews: 67, responseTime: '< 8h' },
];

// Schweizer PLZ Autocomplete
const SWISS_CITIES: Record<string, string> = {
  '8000': 'Zürich', '8001': 'Zürich', '8002': 'Zürich', '8003': 'Zürich',
  '8004': 'Zürich', '8005': 'Zürich', '8006': 'Zürich', '8008': 'Zürich',
  '8032': 'Zürich', '8037': 'Zürich', '8038': 'Zürich', '8041': 'Zürich',
  '8044': 'Zürich', '8045': 'Zürich', '8046': 'Zürich', '8047': 'Zürich',
  '8048': 'Zürich', '8049': 'Zürich', '8050': 'Zürich', '8400': 'Winterthur',
  '3000': 'Bern', '3001': 'Bern', '3004': 'Bern', '3005': 'Bern',
  '3006': 'Bern', '3007': 'Bern', '3008': 'Bern', '4000': 'Basel',
  '4001': 'Basel', '4051': 'Basel', '4052': 'Basel', '1000': 'Lausanne',
  '1200': 'Genève', '1201': 'Genève', '6000': 'Luzern', '9000': 'St. Gallen',
  '5000': 'Aarau', '6300': 'Zug', '6330': 'Cham',
};

export const V9bFeedbackBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  // Step 1: Adressen
  const [fromZip, setFromZip] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toZip, setToZip] = useState('');
  const [toCity, setToCity] = useState('');
  
  // Step 2: Details
  const [rooms, setRooms] = useState('3.5');
  const [fromFloor, setFromFloor] = useState('');
  const [toFloor, setToFloor] = useState('');
  const [fromLift, setFromLift] = useState<boolean | null>(null);
  const [toLift, setToLift] = useState<boolean | null>(null);
  const [showVideoScan, setShowVideoScan] = useState(false);
  
  // Step 3: Services
  const [selectedPackage, setSelectedPackage] = useState('standard');
  
  // Step 4: Extras & Datum
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [moveDate, setMoveDate] = useState('');
  const [dateFlexible, setDateFlexible] = useState(false);
  
  // Step 5: Firmen & Kontakt
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['1', '2', '3']); // Pre-selected recommendations
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const progress = (currentStep / STEPS.length) * 100;

  // Auto-fill city from PLZ
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

  // Conditional Lift
  const showFromLift = fromFloor && fromFloor !== 'EG';
  const showToLift = toFloor && toFloor !== 'EG';

  // Calculate Fixpreis (konsistent durchgängig - Feedback #7)
  const basePrice = useMemo(() => {
    const roomValue = parseFloat(rooms) || 3;
    const floorCost = (parseInt(fromFloor) || 0) * 40 + (parseInt(toFloor) || 0) * 40;
    const liftDiscount = (fromLift ? -50 : 0) + (toLift ? -50 : 0);
    return Math.round(900 + (roomValue * 280) + floorCost + liftDiscount);
  }, [rooms, fromFloor, toFloor, fromLift, toLift]);

  const packagePrice = useMemo(() => {
    const pkg = SERVICE_PACKAGES.find(p => p.id === selectedPackage);
    return Math.round(basePrice * (pkg?.multiplier || 1));
  }, [basePrice, selectedPackage]);

  const extrasPrice = useMemo(() => {
    return selectedExtras.reduce((sum, extraId) => {
      const extra = EXTRAS.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
  }, [selectedExtras]);

  const totalFixpreis = packagePrice + extrasPrice;
  
  // Savings calculation
  const marketPrice = Math.round(totalFixpreis * 1.25);
  const savings = marketPrice - totalFixpreis;

  const canProceed = () => {
    switch (currentStep) {
      case 1: return fromZip.length === 4 && toZip.length === 4;
      case 2: return rooms && fromFloor && toFloor && 
               (!showFromLift || fromLift !== null) && 
               (!showToLift || toLift !== null);
      case 3: return selectedPackage;
      case 4: return true; // Extras & Datum optional
      case 5: return selectedCompanies.length >= 1 && name && email && consent;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
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

  const toggleExtra = (id: string) => {
    setSelectedExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleCompany = (id: string) => {
    setSelectedCompanies(prev => {
      if (prev.includes(id)) {
        return prev.length > 1 ? prev.filter(c => c !== id) : prev;
      } else if (prev.length < 5) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const acceptRecommendations = () => {
    setSelectedCompanies(['1', '2', '3']);
  };

  // Success Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Anfrage gesendet!</h1>
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
                <div className="text-xs text-muted-foreground">Für Sie</div>
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
              <span>Keine Weitergabe an Dritte</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-36 md:pb-24 overflow-x-hidden max-w-full">
      {/* Minimaler Funnel Header (Feedback #2: Navigation minimieren) */}
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
                Schritt {currentStep} von {STEPS.length}
              </span>
            </div>
            <Badge variant="secondary" className="text-xs">
              V9.b ChatGPT
            </Badge>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-xl mx-auto px-4 py-6">
        
        {/* Step 1: Adressen (Feedback: PLZ mit Autocomplete) */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">In 3 Minuten zur Offerte</h1>
              <p className="text-muted-foreground text-sm">
                Von wo nach wo zügeln Sie?
              </p>
            </div>
            
            {/* Trust Badges Above the Fold (Feedback #9) */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground mb-6">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-600" /> Geprüfte Firmen
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-500" /> 4.8/5 Bewertung
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" /> 12'000+ Umzüge
              </span>
            </div>
            
            {/* Von */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Von (Auszugsort)
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="PLZ eingeben (z.B. 8001)"
                      value={fromZip}
                      onChange={(e) => setFromZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="text-lg h-12"
                      maxLength={4}
                    />
                    {fromCity && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
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
              </CardContent>
            </Card>
            
            {/* Nach */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Home className="h-4 w-4 text-green-600" />
                    Nach (Einzugsort)
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="PLZ eingeben (z.B. 3000)"
                      value={toZip}
                      onChange={(e) => setToZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      className="text-lg h-12"
                      maxLength={4}
                    />
                    {toCity && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" />
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
              </CardContent>
            </Card>
            
            {/* Route Summary */}
            {fromCity && toCity && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{fromCity}</span>
                <ArrowRight className="h-4 w-4" />
                <span className="font-medium">{toCity}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Details (Feedback: CH-Zimmer, Video-Scan Trust) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Ihre Wohnung</h1>
              <p className="text-muted-foreground text-sm">
                Wohnungsgrösse und Stockwerk
              </p>
            </div>
            
            {/* Optional: Video-Scan (Feedback #3: Privacy Trust) */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Video className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">Optional: 60-Sek.-Video</span>
                      <Badge variant="outline" className="text-xs">Genauer</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Präzisere Analyse = <span className="text-secondary font-medium">bis 40% sparen</span>. Video wird nur zur Berechnung genutzt.
                    </p>
                    {!showVideoScan ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowVideoScan(true)}
                        className="text-xs"
                      >
                        Video-Scan starten
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 text-green-600 text-sm">
                        <CheckCircle2 className="h-4 w-4" />
                        Video bereit
                      </div>
                    )}
                  </div>
                  <button 
                    className="text-muted-foreground hover:text-foreground p-1"
                    onClick={() => {}}
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              </CardContent>
            </Card>
            
            {/* CH-konforme Zimmergrösse (Feedback #4) */}
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
            
            {/* Stockwerk Von */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <Label className="text-sm font-medium">Stockwerk Auszug</Label>
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
                
                {showFromLift && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-sm">Lift vorhanden (Auszug)?</Label>
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
            
            {/* Stockwerk Nach */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <Label className="text-sm font-medium">Stockwerk Einzug</Label>
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
                
                {showToLift && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-sm">Lift vorhanden (Einzug)?</Label>
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
          </div>
        )}

        {/* Step 3: Services (Feedback #10: Paket-Karten statt Slider) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Wählen Sie Ihr Service-Level</h1>
              <p className="text-muted-foreground text-sm">
                Sie können später anpassen
              </p>
            </div>
            
            {/* Service-Pakete als Karten */}
            <div className="space-y-3">
              {SERVICE_PACKAGES.map((pkg) => (
                <Card 
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${
                    selectedPackage === pkg.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">{pkg.name}</span>
                          {pkg.tag && (
                            <Badge variant={pkg.tag === 'Empfohlen' ? 'default' : 'secondary'} className="text-xs">
                              {pkg.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${
                          pkg.priceDelta.includes('-') ? 'text-green-600' : 
                          pkg.priceDelta.includes('+') ? 'text-amber-600' : 'text-muted-foreground'
                        }`}>
                          {pkg.priceDelta}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {pkg.features.map((feature, i) => (
                        <span key={i} className="text-xs bg-muted px-2 py-1 rounded-md">
                          {feature}
                        </span>
                      ))}
                    </div>
                    {selectedPackage === pkg.id && (
                      <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Ihr Fixpreis:</span>
                        <span className="font-bold text-lg">CHF {packagePrice.toLocaleString('de-CH')}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Extras & Datum (Feedback: nichts vorauswählen, Flex-Explanation) */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Datum & Extras</h1>
              <p className="text-muted-foreground text-sm">
                Optional - Sie können alles anpassen
              </p>
            </div>
            
            {/* Datum (Feedback #8: CH Format + Flex Explanation) */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4 text-primary" />
                  Wunschtermin
                </Label>
                
                <Input
                  type="date"
                  value={moveDate}
                  onChange={(e) => setMoveDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-12"
                />
                
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="flexible"
                    checked={dateFlexible}
                    onCheckedChange={(checked) => setDateFlexible(checked as boolean)}
                  />
                  <div>
                    <label htmlFor="flexible" className="text-sm cursor-pointer font-medium">
                      ±3 Tage flexibel
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Wir planen um Ihren Wunschtermin – günstiger bei freien Slots (bis 15% Ersparnis)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Extras (Feedback: nichts vorauswählen, Beliebt-Tag) */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <Label className="text-sm font-medium">Zusatzleistungen (optional)</Label>
                <div className="grid gap-2">
                  {EXTRAS.map((extra) => (
                    <button
                      key={extra.id}
                      onClick={() => toggleExtra(extra.id)}
                      className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                        selectedExtras.includes(extra.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox checked={selectedExtras.includes(extra.id)} />
                        <span className="font-medium">{extra.label}</span>
                        {extra.popular && (
                          <Badge variant="secondary" className="text-xs">Beliebt</Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">+ CHF {extra.price}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Firmen & Kontakt (Feedback #6: Empfehlungen vorselektiert, Checkbox UI) */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold mb-2">Passende Umzugsfirmen</h1>
              <p className="text-muted-foreground text-sm">
                Wir empfehlen 3 Firmen (beste Passung). Sie können bis zu 5 wählen.
              </p>
            </div>
            
            {/* Quick Accept (Feedback: "Empfehlung übernehmen") */}
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={acceptRecommendations}
            >
              <Award className="h-4 w-4 mr-2" />
              Empfehlung übernehmen (3 Firmen)
            </Button>
            
            {/* Firmen-Liste mit Checkbox UI (Feedback: Checkbox statt Kreise) */}
            <div className="space-y-2">
              {COMPANIES.map((company) => (
                <Card 
                  key={company.id}
                  className={`cursor-pointer transition-all ${
                    selectedCompanies.includes(company.id)
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => toggleCompany(company.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Checkbox checked={selectedCompanies.includes(company.id)} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{company.name}</span>
                          {company.recommended && (
                            <Badge variant="secondary" className="text-xs">Empfohlen</Badge>
                          )}
                          {company.premium && (
                            <Badge variant="default" className="text-xs">Premium</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {company.rating}
                          </span>
                          <span>{company.reviews} Bewertungen</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {company.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              {selectedCompanies.length} von 5 Firmen ausgewählt
            </div>
            
            {/* Kontaktdaten */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <Label className="text-sm font-medium">Ihre Kontaktdaten</Label>
                
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="E-Mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="Telefon (optional)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      inputMode="tel"
                      className="pl-10 h-12"
                    />
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                  />
                  <label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer">
                    Ich akzeptiere die <a href="/datenschutz" className="underline">Datenschutzbestimmungen</a> und dass meine Daten an die ausgewählten Firmen weitergegeben werden.
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA (Feedback #5: Sticky Bar auf Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 z-40">
        <div className="max-w-xl mx-auto">
          {/* Price Summary (Feedback #7: Preis-Konsistenz, Breakdown) */}
          <div className="flex items-center justify-between mb-3 text-sm">
            <div>
              <span className="text-muted-foreground">Ihr Fixpreis: </span>
              <span className="font-bold text-lg">CHF {totalFixpreis.toLocaleString('de-CH')}</span>
              {extrasPrice > 0 && (
                <span className="text-xs text-muted-foreground ml-1">
                  (inkl. Extras CHF {extrasPrice})
                </span>
              )}
            </div>
            {savings > 0 && (
              <Badge variant="secondary" className="text-green-600">
                CHF {savings.toLocaleString('de-CH')} gespart
              </Badge>
            )}
          </div>
          
          {currentStep < STEPS.length ? (
            <Button 
              className="w-full h-12 text-lg" 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              {currentStep === STEPS.length - 1 ? 'Firmen wählen' : 'Weiter'}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button 
              className="w-full h-12 text-lg bg-green-600 hover:bg-green-700" 
              onClick={handleSubmit}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sende...
                </>
              ) : (
                <>
                  Anfrage an {selectedCompanies.length} Firmen senden
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          )}
          
          {/* Trust Microcopy */}
          <p className="text-xs text-center text-muted-foreground mt-2">
            Kostenlos & unverbindlich • Keine Registrierung nötig
          </p>
        </div>
      </div>
    </div>
  );
};

export default V9bFeedbackBased;
