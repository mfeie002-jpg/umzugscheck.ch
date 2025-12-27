/**
 * V9a - Main Pro Extended
 * 
 * Basiert auf detailliertem ChatGPT UX Feedback:
 * - 6 Schritte: Adressen → Details → Services → Extras/Datum → Firmen → Kontakt
 * - CH-konforme Zimmergrössen (1.5, 2.5, 3.5, etc.)
 * - Paket-Karten statt Slider für Services
 * - Vereinfachte Firmenauswahl mit Empfehlungen
 * - Sticky CTA auf Mobile
 * - Konsistente Preis-Story
 * - Funnel-Modus (reduzierte Navigation)
 */

import React, { useState, useMemo } from 'react';
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
  Info,
  CheckCircle,
  Building,
  Video,
  Lock,
  Trash2,
  Archive,
  Wrench,
  FileText,
  Users,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

const STEPS = [
  { id: 1, title: 'Adressen', shortTitle: 'Adressen' },
  { id: 2, title: 'Details', shortTitle: 'Details' },
  { id: 3, title: 'Service', shortTitle: 'Service' },
  { id: 4, title: 'Extras', shortTitle: 'Extras' },
  { id: 5, title: 'Firmen', shortTitle: 'Firmen' },
  { id: 6, title: 'Kontakt', shortTitle: 'Kontakt' },
];

// CH-konforme Zimmergrössen
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
  { value: 'EG', label: 'EG' },
  { value: '1', label: '1. OG' },
  { value: '2', label: '2. OG' },
  { value: '3', label: '3. OG' },
  { value: '4', label: '4. OG' },
  { value: '5+', label: '5+ OG' },
  { value: 'DG', label: 'Dachgesch.' },
];

const LIFT_OPTIONS = [
  { value: 'none', label: 'Kein Lift' },
  { value: 'normal', label: 'Lift vorhanden' },
  { value: 'cargo', label: 'Warenlift' },
];

// Service-Pakete statt Slider
const SERVICE_PACKAGES = [
  {
    id: 'basis',
    name: 'Basis',
    description: 'Sie packen selbst, wir transportieren',
    features: ['Transport', '2 Träger', 'Transportversicherung'],
    priceMultiplier: 0.7,
  },
  {
    id: 'standard',
    name: 'Standard',
    tag: 'Beliebt',
    description: 'Kompletter Umzug ohne Aufwand',
    features: ['Transport', '3 Träger', 'Möbelmontage', 'Vollversicherung'],
    priceMultiplier: 1.0,
  },
  {
    id: 'komfort',
    name: 'Komfort',
    tag: 'Empfohlen',
    description: 'Rundum-Sorglos inkl. Packservice',
    features: ['Alles aus Standard', 'Ein- & Auspacken', 'Kartonmaterial', 'Nachbetreuung'],
    priceMultiplier: 1.4,
  },
];

// Extras
const EXTRAS = [
  { id: 'packing', label: 'Ein- & Auspacken', price: 350, icon: Package },
  { id: 'cleaning', label: 'Endreinigung', price: 280, icon: Sparkles },
  { id: 'disposal', label: 'Entsorgung', price: 150, icon: Trash2 },
  { id: 'storage', label: 'Zwischenlagerung', price: 200, icon: Archive },
  { id: 'assembly', label: 'Möbelmontage', price: 180, icon: Wrench },
  { id: 'admin', label: 'Admin-Paket', price: 95, icon: FileText },
];

// Mock companies
const COMPANIES = [
  { id: '1', name: 'Züri Umzüge AG', rating: 4.9, reviews: 342, responseTime: '2h', verified: true, premium: true },
  { id: '2', name: 'SwissMove GmbH', rating: 4.8, reviews: 218, responseTime: '4h', verified: true, premium: false },
  { id: '3', name: 'Blitz Transporte', rating: 4.7, reviews: 156, responseTime: '3h', verified: true, premium: false },
  { id: '4', name: 'Profi Umzug Schweiz', rating: 4.6, reviews: 89, responseTime: '6h', verified: true, premium: false },
  { id: '5', name: 'Express Möbeltransport', rating: 4.5, reviews: 67, responseTime: '8h', verified: false, premium: false },
];

export const V9aFeedbackBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  // Step 1: Adressen
  const [fromZip, setFromZip] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toZip, setToZip] = useState('');
  const [toCity, setToCity] = useState('');
  const [rooms, setRooms] = useState('3.5');
  
  // Step 2: Details
  const [floor, setFloor] = useState('2');
  const [lift, setLift] = useState('normal');
  const [videoScan, setVideoScan] = useState(false);
  
  // Step 3: Service
  const [selectedPackage, setSelectedPackage] = useState('standard');
  
  // Step 4: Extras & Datum
  const [moveDate, setMoveDate] = useState('');
  const [dateFlexible, setDateFlexible] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  
  // Step 5: Firmen
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['1', '2', '3']); // Default: Top 3
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  
  // Step 6: Kontakt
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const progress = (currentStep / STEPS.length) * 100;
  
  // Calculate price
  const basePrice = useMemo(() => {
    const roomValue = parseFloat(rooms) || 3;
    const floorValue = floor === 'EG' ? 0 : floor === 'DG' ? 5 : parseInt(floor) || 2;
    const liftBonus = lift === 'none' ? 1.15 : lift === 'cargo' ? 0.95 : 1;
    
    const base = 800 + (roomValue * 320) + (floorValue * 80);
    return Math.round(base * liftBonus);
  }, [rooms, floor, lift]);
  
  const packagePrice = useMemo(() => {
    const pkg = SERVICE_PACKAGES.find(p => p.id === selectedPackage);
    return Math.round(basePrice * (pkg?.priceMultiplier || 1));
  }, [basePrice, selectedPackage]);
  
  const extrasTotal = useMemo(() => {
    return selectedExtras.reduce((sum, id) => {
      const extra = EXTRAS.find(e => e.id === id);
      return sum + (extra?.price || 0);
    }, 0);
  }, [selectedExtras]);
  
  const totalPrice = packagePrice + extrasTotal;
  const savedAmount = Math.round(totalPrice * 0.25);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return fromZip && toZip && rooms;
      case 2: return floor && lift;
      case 3: return selectedPackage;
      case 4: return true;
      case 5: return selectedCompanies.length >= 1;
      case 6: return name && email && consent;
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
        return prev.filter(c => c !== id);
      } else if (prev.length < 5) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const useRecommendations = () => {
    setSelectedCompanies(['1', '2', '3']);
  };

  // Completion Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Anfrage gesendet!</h1>
          <p className="text-muted-foreground mb-6">
            Sie erhalten in Kürze Offerten von {selectedCompanies.length} Umzugsfirmen.
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
                <div className="text-2xl font-bold text-green-600">0 CHF</div>
                <div className="text-xs text-muted-foreground">Kosten</div>
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
              <span>Ihre Daten sind sicher & werden nur an ausgewählte Firmen weitergegeben</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-32 md:pb-24">
      {/* Funnel Header - Minimiert */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
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
              V9.a Pro
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators - Hidden on mobile for clean funnel */}
          <div className="hidden sm:flex justify-between mt-3">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  step.id === currentStep
                    ? 'text-primary font-medium'
                    : step.id < currentStep
                    ? 'text-primary/60'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step.id < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id === currentStep
                    ? 'bg-primary/20 text-primary border border-primary'
                    : 'bg-muted'
                }`}>
                  {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
                </div>
                <span>{step.shortTitle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Step 1: Adressen + Wohnungsgrösse */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">In 3 Minuten zur Umzugs-Offerte</h1>
              <p className="text-muted-foreground">
                Kostenlos & unverbindlich • Keine Registrierung nötig
              </p>
            </div>
            
            {/* Addresses */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-primary" />
                    Von (Auszugsort)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="PLZ"
                      value={fromZip}
                      onChange={(e) => setFromZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      className="w-24"
                      maxLength={4}
                    />
                    <Input
                      placeholder="Ort"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Home className="h-4 w-4 text-green-600" />
                    Nach (Einzugsort)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="PLZ"
                      value={toZip}
                      onChange={(e) => setToZip(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      inputMode="numeric"
                      className="w-24"
                      maxLength={4}
                    />
                    <Input
                      placeholder="Ort"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
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
            
            {/* Sofort-Schätzung */}
            {fromZip && toZip && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Sofort-Schätzung
                      </div>
                      <div className="text-xl font-bold">
                        CHF {basePrice.toLocaleString('de-CH')} – {Math.round(basePrice * 1.4).toLocaleString('de-CH')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Marktpreis für {rooms} Zimmer
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="text-xs gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        4.8/5
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Trust signals */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" /> Versichert
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" /> Geprüfte Firmen
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> Antwort in 24h
              </span>
            </div>
          </div>
        )}

        {/* Step 2: Details (Stockwerk, Lift, Video-Scan) */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Noch ein paar Details</h1>
              <p className="text-muted-foreground">
                Für eine genauere Schätzung
              </p>
            </div>
            
            {/* Video-Scan Option */}
            <Card className={`border-2 ${videoScan ? 'border-primary bg-primary/5' : 'border-dashed'}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Video className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">KI Video-Scan</span>
                      <Badge variant="secondary" className="text-xs">Optional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      60-Sek.-Video für noch genaueren Fixpreis
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Lock className="h-3 w-3" />
                      Video wird nur zur Berechnung genutzt und danach gelöscht
                    </div>
                    <Button 
                      variant={videoScan ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setVideoScan(!videoScan)}
                    >
                      {videoScan ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Aktiviert
                        </>
                      ) : (
                        'Video-Scan aktivieren'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Stockwerk */}
            <Card>
              <CardContent className="p-5">
                <Label className="text-sm font-medium mb-3 block">
                  In welchem Stockwerk wohnen Sie?
                </Label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {FLOOR_OPTIONS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setFloor(f.value)}
                      className={`p-2.5 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                        floor === f.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Lift */}
            <Card>
              <CardContent className="p-5">
                <Label className="text-sm font-medium mb-3 block">
                  Lift vorhanden?
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {LIFT_OPTIONS.map((l) => (
                    <button
                      key={l.value}
                      onClick={() => setLift(l.value)}
                      className={`p-3 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                        lift === l.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Price Update */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Ihr Fixpreis</div>
                    <div className="text-xl font-bold">CHF {packagePrice.toLocaleString('de-CH')}</div>
                  </div>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    CHF {savedAmount} gespart
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Services (Paket-Karten) */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Wählen Sie Ihr Service-Level</h1>
              <p className="text-muted-foreground">
                Sie können später anpassen
              </p>
            </div>
            
            {/* Service Packages als Karten */}
            <div className="space-y-3">
              {SERVICE_PACKAGES.map((pkg) => {
                const pkgPrice = Math.round(basePrice * pkg.priceMultiplier);
                const isSelected = selectedPackage === pkg.id;
                const priceDiff = pkgPrice - packagePrice;
                
                return (
                  <Card 
                    key={pkg.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-2 border-primary bg-primary/5 shadow-md' 
                        : 'border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-lg">{pkg.name}</span>
                            {pkg.tag && (
                              <Badge variant={pkg.id === 'komfort' ? 'default' : 'secondary'} className="text-xs">
                                {pkg.tag}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {pkg.features.map((f, i) => (
                              <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full flex items-center gap-1">
                                <Check className="h-3 w-3 text-primary" />
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right pl-4">
                          <div className="text-lg font-bold">CHF {pkgPrice.toLocaleString('de-CH')}</div>
                          {priceDiff !== 0 && selectedPackage && (
                            <div className={`text-xs ${priceDiff > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                              {priceDiff > 0 ? '+' : ''}{priceDiff.toLocaleString('de-CH')}
                            </div>
                          )}
                          <div className={`mt-2 w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto ${
                            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                          }`}>
                            {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Extras & Datum */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Datum & Extras</h1>
              <p className="text-muted-foreground">
                Optional – Sie können alles mit 1 Klick abwählen
              </p>
            </div>
            
            {/* Datum */}
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
                  className="w-full"
                />
                
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="flexible"
                    checked={dateFlexible}
                    onCheckedChange={(checked) => setDateFlexible(checked as boolean)}
                  />
                  <div>
                    <label htmlFor="flexible" className="text-sm font-medium cursor-pointer">
                      ±3 Tage flexibel
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Wir planen um Ihren Wunschtermin – günstiger bei freien Slots
                    </p>
                  </div>
                </div>
                
                {dateFlexible && (
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    Bis zu 15% sparen möglich
                  </Badge>
                )}
              </CardContent>
            </Card>
            
            {/* Extras Grid */}
            <Card>
              <CardContent className="p-5">
                <Label className="text-sm font-medium mb-3 block">
                  Zusatzleistungen (optional)
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {EXTRAS.map((extra) => {
                    const isSelected = selectedExtras.includes(extra.id);
                    const Icon = extra.icon;
                    
                    return (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          isSelected 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <Icon className={`h-4 w-4 mt-0.5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{extra.label}</div>
                            <div className="text-xs text-primary">+CHF {extra.price}</div>
                          </div>
                          <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                          }`}>
                            {isSelected && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Price Breakdown */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Basis ({SERVICE_PACKAGES.find(p => p.id === selectedPackage)?.name})</span>
                  <span>CHF {packagePrice.toLocaleString('de-CH')}</span>
                </div>
                {extrasTotal > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extras</span>
                    <span>+CHF {extrasTotal.toLocaleString('de-CH')}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Fixpreis</span>
                  <span>CHF {totalPrice.toLocaleString('de-CH')}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 5: Firmenauswahl */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Passende Umzugsfirmen</h1>
              <p className="text-muted-foreground">
                Wir empfehlen 3 Firmen (beste Passung). Sie können bis zu 5 wählen.
              </p>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button 
                variant={selectedCompanies.length === 3 && selectedCompanies.includes('1') ? "default" : "outline"} 
                size="sm"
                onClick={useRecommendations}
                className="flex-1"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Empfehlung übernehmen
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedCompanies([])}
              >
                Alle abwählen
              </Button>
            </div>
            
            {/* Company List */}
            <div className="space-y-3">
              {COMPANIES.slice(0, showAllCompanies ? COMPANIES.length : 3).map((company, index) => {
                const isSelected = selectedCompanies.includes(company.id);
                
                return (
                  <Card 
                    key={company.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-2 border-primary bg-primary/5' 
                        : 'border hover:border-primary/50'
                    }`}
                    onClick={() => toggleCompany(company.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                        }`}>
                          {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        
                        {/* Company Logo Placeholder */}
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <Building className="h-5 w-5 text-muted-foreground" />
                        </div>
                        
                        {/* Company Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{company.name}</span>
                            {company.premium && (
                              <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">
                                Premium
                              </Badge>
                            )}
                            {company.verified && (
                              <Shield className="h-3.5 w-3.5 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                            <span className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              {company.rating} ({company.reviews})
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Antwort in {company.responseTime}
                            </span>
                          </div>
                        </div>
                        
                        {/* Rank indicator for top 3 */}
                        {index < 3 && (
                          <Badge variant="outline" className="text-xs">
                            #{index + 1}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {/* Show more/less */}
            {COMPANIES.length > 3 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full"
                onClick={() => setShowAllCompanies(!showAllCompanies)}
              >
                {showAllCompanies ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Weniger anzeigen
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-1" />
                    {COMPANIES.length - 3} weitere anzeigen
                  </>
                )}
              </Button>
            )}
            
            {/* Selection Info */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
              <span className="text-muted-foreground">Ausgewählt:</span>
              <span className="font-medium">
                {selectedCompanies.length} von max. 5 Firmen
              </span>
            </div>
          </div>
        )}

        {/* Step 6: Kontakt */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Fast geschafft!</h1>
              <p className="text-muted-foreground">
                Wohin sollen wir die Offerten senden?
              </p>
            </div>
            
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-primary" />
                    Ihr Name
                  </Label>
                  <Input
                    placeholder="Max Muster"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Mail className="h-4 w-4 text-primary" />
                    E-Mail
                  </Label>
                  <Input
                    type="email"
                    placeholder="max@beispiel.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4 text-primary" />
                    Telefon (optional)
                  </Label>
                  <Input
                    type="tel"
                    placeholder="+41 79 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nur für Rückfragen zu Ihrer Anfrage
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary */}
            <Card className="bg-muted/30">
              <CardContent className="p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Umzug</span>
                  <span>{fromZip} → {toZip}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wohnung</span>
                  <span>{rooms} Zimmer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span>{SERVICE_PACKAGES.find(p => p.id === selectedPackage)?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Firmen</span>
                  <span>{selectedCompanies.length} ausgewählt</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Fixpreis</span>
                  <span>CHF {totalPrice.toLocaleString('de-CH')}</span>
                </div>
              </CardContent>
            </Card>
            
            {/* Consent */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
              />
              <label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer">
                Ich akzeptiere die AGB und Datenschutzbestimmungen. Meine Daten werden nur an die ausgewählten Firmen weitergegeben.
              </label>
            </div>
            
            {/* Trust */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" /> SSL verschlüsselt
              </span>
              <span className="flex items-center gap-1">
                <Lock className="h-3 w-3" /> Keine Weitergabe an Dritte
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border p-4">
        <div className="max-w-2xl mx-auto">
          {/* Price reminder on mobile */}
          {currentStep >= 3 && currentStep < 6 && (
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-muted-foreground">Fixpreis</span>
              <span className="font-bold">CHF {totalPrice.toLocaleString('de-CH')}</span>
            </div>
          )}
          
          <Button
            size="lg"
            className="w-full h-12 text-base font-semibold"
            onClick={currentStep === 6 ? handleSubmit : handleNext}
            disabled={!canProceed() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Wird gesendet...
              </>
            ) : currentStep === 6 ? (
              <>
                Anfrage an {selectedCompanies.length} Firmen senden
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            ) : currentStep === 1 ? (
              <>
                Fixpreis berechnen
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            ) : currentStep === 5 ? (
              <>
                {selectedCompanies.length >= 1 
                  ? `Mit ${selectedCompanies.length} Firmen fortfahren`
                  : 'Bitte mindestens 1 Firma wählen'
                }
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            ) : (
              <>
                Weiter
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
          
          <p className="text-center text-xs text-muted-foreground mt-2">
            Kostenlos & unverbindlich • Keine Registrierung nötig
          </p>
        </div>
      </div>
    </div>
  );
};

export default V9aFeedbackBased;
