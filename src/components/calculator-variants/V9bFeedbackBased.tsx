/**
 * V9b - Main Agent (Feedback-basiert)
 * 
 * Basiert auf detailliertem Agent UX Feedback:
 * - 5 Schritte: Adressen → Details → Services → Extras/Datum → Firmen → Kontakt (inline)
 * - Progress-Indicator mit Beschriftungen
 * - Tooltips & Hilfetexte bei kritischen Feldern
 * - Kundenbewertungen & Zertifikate nahe CTAs
 * - Opt-out für vorausgewählte Extras (nichts vorausgewählt)
 * - Such-, Filter- und Sortierfunktionen bei Firmenliste
 * - Responsive Date-Picker
 * - Datensicherheit/Transparenz beim Video-Scan
 * - Fehler- und Validierungszustände sichtbar
 * - Funnel-Fokus: keine ablenkenden Elemente
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  HelpCircle,
  AlertCircle,
  ArrowUpDown,
  Filter,
  Award,
  Zap
} from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';

const STEPS = [
  { id: 1, title: 'Adressen', shortTitle: 'Adressen', description: 'Von/Nach + Grösse' },
  { id: 2, title: 'Details', shortTitle: 'Details', description: 'Stockwerk & Lift' },
  { id: 3, title: 'Service-Level', shortTitle: 'Service', description: 'Paket wählen' },
  { id: 4, title: 'Extras & Datum', shortTitle: 'Extras', description: 'Zusatzleistungen' },
  { id: 5, title: 'Firmenauswahl', shortTitle: 'Firmen', description: 'Offerten anfordern' },
];

// CH-konforme Zimmergrössen mit Tooltip
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
  { value: 'EG', label: 'EG / Parterre', tooltip: 'Erdgeschoss, kein Treppenaufwand' },
  { value: '1', label: '1. OG', tooltip: '1 Stockwerk über Erdgeschoss' },
  { value: '2', label: '2. OG', tooltip: '2 Stockwerke über Erdgeschoss' },
  { value: '3', label: '3. OG', tooltip: '3 Stockwerke über Erdgeschoss' },
  { value: '4', label: '4. OG', tooltip: '4 Stockwerke über Erdgeschoss' },
  { value: '5+', label: '5+ OG', tooltip: '5 oder mehr Stockwerke' },
  { value: 'DG', label: 'Dachgeschoss', tooltip: 'Unter dem Dach' },
];

const LIFT_OPTIONS = [
  { value: 'none', label: 'Kein Lift', price: '+15%' },
  { value: 'normal', label: 'Personenlift', price: '±0' },
  { value: 'cargo', label: 'Warenlift', price: '-5%' },
];

// Service-Pakete
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

// Extras - KEINE vorausgewählt (gemäss Feedback)
const EXTRAS = [
  { id: 'packing', label: 'Ein- & Auspacken', price: 350, icon: Package, popular: true },
  { id: 'cleaning', label: 'Endreinigung', price: 280, icon: Sparkles, popular: true },
  { id: 'disposal', label: 'Entsorgung', price: 150, icon: Trash2, popular: false },
  { id: 'storage', label: 'Zwischenlagerung', price: 200, icon: Archive, popular: false },
  { id: 'assembly', label: 'Möbelmontage', price: 180, icon: Wrench, popular: false },
  { id: 'admin', label: 'Admin-Paket', description: 'Ummeldungen, Post, etc.', price: 95, icon: FileText, popular: false },
];

// Mock companies mit mehr Daten für Sortierung/Filter
const COMPANIES = [
  { id: '1', name: 'Züri Umzüge AG', rating: 4.9, reviews: 342, responseTime: 2, region: 'Zürich', verified: true, premium: true, expressService: true, price: 'fair' },
  { id: '2', name: 'SwissMove GmbH', rating: 4.8, reviews: 218, responseTime: 4, region: 'Zürich', verified: true, premium: false, expressService: true, price: 'günstig' },
  { id: '3', name: 'Blitz Transporte', rating: 4.7, reviews: 156, responseTime: 3, region: 'Aargau', verified: true, premium: false, expressService: true, price: 'günstig' },
  { id: '4', name: 'Profi Umzug Schweiz', rating: 4.6, reviews: 89, responseTime: 6, region: 'Bern', verified: true, premium: false, expressService: false, price: 'premium' },
  { id: '5', name: 'Express Möbeltransport', rating: 4.5, reviews: 67, responseTime: 8, region: 'Basel', verified: true, premium: false, expressService: true, price: 'fair' },
];

// Fake customer reviews
const CUSTOMER_REVIEWS = [
  { name: 'M. Keller', location: 'Zürich', text: 'Schnell und zuverlässig!', rating: 5 },
  { name: 'S. Brunner', location: 'Bern', text: 'Sehr professionell, gerne wieder.', rating: 5 },
];

type SortOption = 'recommended' | 'rating' | 'reviews' | 'response';

export const V9bFeedbackBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  // Step 1: Adressen
  const [fromZip, setFromZip] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toZip, setToZip] = useState('');
  const [toCity, setToCity] = useState('');
  const [rooms, setRooms] = useState('');
  
  // Step 2: Details
  const [floor, setFloor] = useState('');
  const [lift, setLift] = useState('');
  const [videoScan, setVideoScan] = useState(false);
  
  // Step 3: Service
  const [selectedPackage, setSelectedPackage] = useState('standard');
  
  // Step 4: Extras & Datum
  const [moveDate, setMoveDate] = useState('');
  const [dateFlexible, setDateFlexible] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]); // KEINE vorausgewählt
  
  // Step 5: Firmen + Kontakt (kombiniert)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(['1', '2', '3']);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [filterExpress, setFilterExpress] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // Kontakt
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  
  // Validation states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const progress = (currentStep / STEPS.length) * 100;
  
  // Validation
  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'fromZip':
      case 'toZip':
        if (value && !/^\d{4}$/.test(value)) {
          newErrors[field] = 'Bitte gültige PLZ eingeben (4 Ziffern)';
        } else {
          delete newErrors[field];
        }
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors[field] = 'Bitte gültige E-Mail eingeben';
        } else {
          delete newErrors[field];
        }
        break;
      case 'name':
        if (value && value.length < 2) {
          newErrors[field] = 'Name zu kurz';
        } else {
          delete newErrors[field];
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };
  
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

  // Sorted & filtered companies
  const sortedCompanies = useMemo(() => {
    let filtered = [...COMPANIES];
    
    if (filterExpress) {
      filtered = filtered.filter(c => c.expressService);
    }
    
    switch (sortBy) {
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return filtered.sort((a, b) => b.reviews - a.reviews);
      case 'response':
        return filtered.sort((a, b) => a.responseTime - b.responseTime);
      default:
        // Recommended: combination of rating, reviews, and premium
        return filtered.sort((a, b) => {
          const scoreA = a.rating * 10 + (a.premium ? 5 : 0) + (a.reviews / 50);
          const scoreB = b.rating * 10 + (b.premium ? 5 : 0) + (b.reviews / 50);
          return scoreB - scoreA;
        });
    }
  }, [sortBy, filterExpress]);

  const canProceed = () => {
    switch (currentStep) {
      case 1: return fromZip.length === 4 && toZip.length === 4 && rooms && Object.keys(errors).length === 0;
      case 2: return floor && lift;
      case 3: return selectedPackage;
      case 4: return true;
      case 5: return selectedCompanies.length >= 1 && (!showContactForm || (name && email && consent));
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
      if (showContactForm) {
        setShowContactForm(false);
      } else {
        setCurrentStep(currentStep - 1);
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
            Sie erhalten in Kürze Offerten von {selectedCompanies.length} geprüften Umzugsfirmen.
          </p>
          
          <Card className="p-6 mb-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{selectedCompanies.length}</div>
                <div className="text-xs text-muted-foreground">Firmen</div>
              </div>
              <div>
                <div className="text-2xl font-bold">24h</div>
                <div className="text-xs text-muted-foreground">Ø Antwortzeit</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">0 CHF</div>
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
              <span>Ihre Daten werden nur an ausgewählte Firmen weitergegeben</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <FileText className="h-4 w-4 text-primary" />
              <span>Umzug-Checkliste per E-Mail zugestellt</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-32 md:pb-24">
        {/* Funnel Header - Minimiert, kein ablenkender Content */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {(currentStep > 1 || showContactForm) && (
                  <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 w-8 p-0">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                )}
                <span className="text-sm font-medium">
                  Schritt {currentStep} von {STEPS.length}
                </span>
              </div>
              <Badge variant="secondary" className="text-xs">
                V9.b Agent
              </Badge>
            </div>
            <Progress value={progress} className="h-2" />
            
            {/* Step indicators mit Labels - Desktop */}
            <div className="hidden sm:flex justify-between mt-3">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    step.id === currentStep
                      ? 'text-primary font-medium'
                      : step.id < currentStep
                      ? 'text-primary/60'
                      : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${
                    step.id < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.id === currentStep
                      ? 'bg-primary/20 text-primary border border-primary'
                      : 'bg-muted'
                  }`}>
                    {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
                  </div>
                  <div>
                    <div className="font-medium">{step.shortTitle}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Mobile: Current step label */}
            <div className="sm:hidden mt-2 text-center text-sm text-muted-foreground">
              {STEPS[currentStep - 1]?.title} • {STEPS[currentStep - 1]?.description}
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
              
              {/* Customer Review Snippet - Trust */}
              <div className="flex items-center justify-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-medium">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="font-medium ml-1">4.8/5</span>
                  </div>
                  <div className="text-muted-foreground text-xs">12'847+ erfolgreiche Umzüge</div>
                </div>
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
                      <div className="w-28">
                        <Input
                          placeholder="PLZ"
                          value={fromZip}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setFromZip(val);
                            validateField('fromZip', val);
                          }}
                          onBlur={() => handleBlur('fromZip')}
                          inputMode="numeric"
                          maxLength={4}
                          className={touched.fromZip && errors.fromZip ? 'border-destructive' : ''}
                        />
                        {touched.fromZip && errors.fromZip && (
                          <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.fromZip}
                          </p>
                        )}
                      </div>
                      <Input
                        placeholder="Ort (optional)"
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
                      <div className="w-28">
                        <Input
                          placeholder="PLZ"
                          value={toZip}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                            setToZip(val);
                            validateField('toZip', val);
                          }}
                          onBlur={() => handleBlur('toZip')}
                          inputMode="numeric"
                          maxLength={4}
                          className={touched.toZip && errors.toZip ? 'border-destructive' : ''}
                        />
                        {touched.toZip && errors.toZip && (
                          <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.toZip}
                          </p>
                        )}
                      </div>
                      <Input
                        placeholder="Ort (optional)"
                        value={toCity}
                        onChange={(e) => setToCity(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* CH-konforme Zimmergrösse mit Tooltip */}
              <Card>
                <CardContent className="p-5">
                  <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                    Wohnungsgrösse
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Schweizer Zimmerzählung: Küche/Bad nicht mitgezählt.</p>
                        <p>Beispiel: 3.5 Zi. = 3 Zimmer + Wohnbereich</p>
                      </TooltipContent>
                    </Tooltip>
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
                  {!rooms && touched.rooms && (
                    <p className="text-destructive text-xs mt-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Bitte Wohnungsgrösse wählen
                    </p>
                  )}
                </CardContent>
              </Card>
              
              {/* Sofort-Schätzung */}
              {fromZip.length === 4 && toZip.length === 4 && rooms && (
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          Live-Schätzung
                        </div>
                        <div className="text-xl font-bold">
                          CHF {basePrice.toLocaleString('de-CH')} – {Math.round(basePrice * 1.4).toLocaleString('de-CH')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Typischer Marktpreis für {rooms} Zimmer
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-green-600 bg-green-50">
                        <Award className="h-3 w-3 mr-1" />
                        Bis 25% sparen
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Trust signals - Zertifikate */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center text-center p-3 bg-muted/30 rounded-lg">
                  <Shield className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs font-medium">Vollversichert</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted/30 rounded-lg">
                  <Check className="h-5 w-5 text-green-600 mb-1" />
                  <span className="text-xs font-medium">Geprüfte Firmen</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-5 w-5 text-primary mb-1" />
                  <span className="text-xs font-medium">Antwort in 24h</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Details (Stockwerk, Lift, Video-Scan) */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Noch ein paar Details</h1>
                <p className="text-muted-foreground">
                  Für eine genauere Preisberechnung
                </p>
              </div>
              
              {/* Video-Scan Option mit Datenschutz-Info */}
              <Card className={`border-2 ${videoScan ? 'border-primary bg-primary/5' : 'border-dashed'}`}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">KI Video-Scan</span>
                        <Badge variant="outline" className="text-xs">Optional</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Filmen Sie Ihre Wohnung in 60 Sekunden für einen exakten Fixpreis.
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3 p-2 bg-muted/50 rounded">
                        <Lock className="h-3 w-3 flex-shrink-0" />
                        <span>Ihre Aufnahmen werden <strong>nur zur Preisberechnung</strong> genutzt und <strong>sofort gelöscht</strong>. Keine Speicherung.</span>
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
              
              {/* Stockwerk mit Tooltips */}
              <Card>
                <CardContent className="p-5">
                  <Label className="flex items-center gap-2 text-sm font-medium mb-3">
                    In welchem Stockwerk wohnen Sie?
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>EG = Erdgeschoss/Parterre (keine Treppen)</p>
                        <p>OG = Obergeschoss</p>
                      </TooltipContent>
                    </Tooltip>
                  </Label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {FLOOR_OPTIONS.map((f) => (
                      <Tooltip key={f.value}>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setFloor(f.value)}
                            className={`p-2.5 rounded-lg border-2 text-center text-sm font-medium transition-all ${
                              floor === f.value
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            {f.label}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{f.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Lift mit Preisindikator */}
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
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          lift === l.value
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="text-sm font-medium">{l.label}</div>
                        <div className="text-xs text-muted-foreground">{l.price}</div>
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
                      <div className="text-xs text-muted-foreground">Geschätzter Fixpreis</div>
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
                  const priceDiff = pkgPrice - Math.round(basePrice * 1.0); // Diff to Standard
                  
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
                            {pkg.id !== 'standard' && (
                              <div className={`text-xs ${priceDiff > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                {priceDiff > 0 ? '+' : ''}{priceDiff.toLocaleString('de-CH')} CHF
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
                  Alles optional – wählen Sie nur was Sie brauchen
                </p>
              </div>
              
              {/* Datum */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-primary" />
                    Wunschtermin
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Format: TT.MM.JJJJ</p>
                        <p>Flexible Termine können günstiger sein.</p>
                      </TooltipContent>
                    </Tooltip>
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
                      <Sparkles className="h-3 w-3 mr-1" />
                      Bis zu 15% sparen möglich
                    </Badge>
                  )}
                </CardContent>
              </Card>
              
              {/* Extras Grid - KEINE vorausgewählt */}
              <Card>
                <CardContent className="p-5">
                  <Label className="text-sm font-medium mb-1 block">
                    Zusatzleistungen (optional)
                  </Label>
                  <p className="text-xs text-muted-foreground mb-3">
                    Wählen Sie nur was Sie brauchen. Beliebt bei anderen Kunden markiert.
                  </p>
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
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium truncate">{extra.label}</span>
                                {extra.popular && (
                                  <Badge variant="outline" className="text-[10px] px-1 py-0">Beliebt</Badge>
                                )}
                              </div>
                              {extra.description && (
                                <div className="text-xs text-muted-foreground">{extra.description}</div>
                              )}
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
                      <span className="text-muted-foreground">Extras ({selectedExtras.length})</span>
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

          {/* Step 5: Firmenauswahl + Kontakt */}
          {currentStep === 5 && !showContactForm && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Passende Umzugsfirmen</h1>
                <p className="text-muted-foreground">
                  Wählen Sie 1–5 Firmen für Ihre Offerten
                </p>
              </div>
              
              {/* Filter & Sort Controls */}
              <div className="flex flex-wrap gap-2 items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant={filterExpress ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterExpress(!filterExpress)}
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    Express
                  </Button>
                </div>
                <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <ArrowUpDown className="h-3 w-3 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Empfohlen</SelectItem>
                    <SelectItem value="rating">Beste Bewertung</SelectItem>
                    <SelectItem value="reviews">Meiste Reviews</SelectItem>
                    <SelectItem value="response">Schnellste Antwort</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Company List */}
              <div className="space-y-3">
                {sortedCompanies.map((company, index) => {
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
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium">{company.name}</span>
                              {company.premium && (
                                <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">
                                  Premium
                                </Badge>
                              )}
                              {company.expressService && (
                                <Badge variant="outline" className="text-xs">
                                  <Zap className="h-2.5 w-2.5 mr-0.5" />
                                  Express
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
                                {company.responseTime}h Antwort
                              </span>
                              <span className="text-muted-foreground/60">{company.region}</span>
                            </div>
                          </div>
                          
                          {/* Price indicator */}
                          <Badge variant="outline" className="text-xs capitalize">
                            {company.price}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              
              {/* Selection Info */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                <span className="text-muted-foreground">Ausgewählt:</span>
                <span className="font-medium">
                  {selectedCompanies.length} von max. 5 Firmen
                </span>
              </div>
              
              {selectedCompanies.length === 0 && (
                <p className="text-destructive text-sm flex items-center gap-1 justify-center">
                  <AlertCircle className="h-4 w-4" />
                  Bitte wählen Sie mindestens 1 Firma (Empfehlung: 3)
                </p>
              )}
            </div>
          )}

          {/* Step 5: Kontakt Form (nach Firmenwahl) */}
          {currentStep === 5 && showContactForm && (
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
                      Ihr Name *
                    </Label>
                    <Input
                      placeholder="Max Muster"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        validateField('name', e.target.value);
                      }}
                      onBlur={() => handleBlur('name')}
                      className={touched.name && errors.name ? 'border-destructive' : ''}
                    />
                    {touched.name && errors.name && (
                      <p className="text-destructive text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="h-4 w-4 text-primary" />
                      E-Mail *
                    </Label>
                    <Input
                      type="email"
                      placeholder="max@beispiel.ch"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField('email', e.target.value);
                      }}
                      onBlur={() => handleBlur('email')}
                      className={touched.email && errors.email ? 'border-destructive' : ''}
                    />
                    {touched.email && errors.email && (
                      <p className="text-destructive text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
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
                  <div className="font-medium mb-2">Ihre Zusammenfassung</div>
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
                  Ich akzeptiere die AGB und Datenschutzbestimmungen. Meine Daten werden nur an die {selectedCompanies.length} ausgewählten Firmen weitergegeben.
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
            {currentStep >= 3 && currentStep < 5 && (
              <div className="flex justify-between items-center mb-2 text-sm">
                <span className="text-muted-foreground">Fixpreis</span>
                <span className="font-bold">CHF {totalPrice.toLocaleString('de-CH')}</span>
              </div>
            )}
            
            <Button
              size="lg"
              className="w-full h-12 text-base font-semibold"
              onClick={() => {
                if (currentStep === 5) {
                  if (!showContactForm) {
                    setShowContactForm(true);
                  } else {
                    handleSubmit();
                  }
                } else {
                  handleNext();
                }
              }}
              disabled={!canProceed() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                  Wird gesendet...
                </>
              ) : currentStep === 5 && showContactForm ? (
                <>
                  Anfrage an {selectedCompanies.length} Firmen senden
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              ) : currentStep === 5 ? (
                <>
                  {selectedCompanies.length >= 1 
                    ? `Weiter mit ${selectedCompanies.length} Firmen`
                    : 'Bitte mindestens 1 Firma wählen'
                  }
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              ) : currentStep === 1 ? (
                <>
                  Fixpreis berechnen
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
    </TooltipProvider>
  );
};

export default V9bFeedbackBased;
