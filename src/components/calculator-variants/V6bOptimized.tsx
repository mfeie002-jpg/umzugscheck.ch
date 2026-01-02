/**
 * V6.b Optimized - Ultimate Extended Version
 * 
 * Basiert auf V6.a mit weiteren Optimierungen:
 * - Placeholder für V6.b spezifische Änderungen
 * - Erbt alle V6.a Optimierungen
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion, AnimatePresence } from 'framer-motion';
import { useCaptureMode } from '@/hooks/use-capture-mode';
import {
  Star,
  Check,
  MapPin,
  User,
  Mail,
  Phone,
  Video,
  Shield,
  Award,
  Clock,
  Info,
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera,
  Sparkles,
  Package,
  Truck,
  Users,
  Home,
  Loader2,
  FileText,
  Calendar,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Building2,
  Timer
} from 'lucide-react';

// ============= CONSTANTS =============
const STEPS = [
  { id: 1, title: 'Details', icon: MapPin, shortTitle: 'Von/Nach' },
  { id: 2, title: 'Inventar', icon: Video, shortTitle: 'Scan' },
  { id: 3, title: 'Paket', icon: Package, shortTitle: 'Service' },
  { id: 4, title: 'Preis', icon: FileText, shortTitle: 'Offerte' },
  { id: 5, title: 'Buchen', icon: CheckCircle2, shortTitle: 'Fertig' },
];

const SERVICE_TIERS = [
  { 
    id: 'transport', 
    title: 'Transport Only',
    subtitle: 'Sie packen, wir fahren',
    selfPercent: 80,
    price: 'ab CHF 490',
    features: ['Transporter + Fahrer', '2 Träger', 'Grundversicherung'],
    notIncluded: ['Verpackung', 'Möbelmontage', 'Einpacken'],
    color: 'bg-slate-100',
  },
  { 
    id: 'diy-plus', 
    title: 'DIY Plus',
    subtitle: 'Etwas Unterstützung',
    selfPercent: 60,
    price: 'ab CHF 690',
    features: ['Transporter + Fahrer', '2 Träger', 'Verpackungsmaterial', 'Grundversicherung'],
    notIncluded: ['Möbelmontage', 'Einpacken'],
    color: 'bg-blue-50',
  },
  { 
    id: 'hybrid', 
    title: 'Hybrid',
    subtitle: 'Halbe-Halbe',
    selfPercent: 40,
    price: 'ab CHF 990',
    features: ['Transporter', '3 Träger', 'Möbelschutz', 'Teilmontage', 'Vollversicherung'],
    notIncluded: ['Komplettes Einpacken'],
    color: 'bg-green-50',
  },
  { 
    id: 'komfort', 
    title: 'Komfort',
    subtitle: 'Beliebte Wahl',
    selfPercent: 25,
    price: 'ab CHF 1\'490',
    features: ['4 Träger', 'Einpackservice', 'Möbelmontage', 'Vollversicherung', 'Entsorgung Basic'],
    notIncluded: [],
    popular: true,
    color: 'bg-emerald-50',
  },
  { 
    id: 'premium', 
    title: 'Premium',
    subtitle: 'Rundum-Sorglos',
    selfPercent: 10,
    price: 'ab CHF 2\'490',
    features: ['5 Träger', 'Einpackservice', 'Möbelmontage', 'Endreinigung', 'Entsorgung inkl.'],
    notIncluded: [],
    color: 'bg-purple-50',
  },
  { 
    id: 'ultimate', 
    title: 'Ultimate',
    subtitle: 'Alles inklusive',
    selfPercent: 0,
    price: 'ab CHF 3\'990',
    features: ['6+ Träger', 'Full Service', 'Einlagerung 1 Monat', 'Handwerker', 'Concierge'],
    notIncluded: [],
    color: 'bg-amber-50',
  },
];

// ============= TYPES =============
interface FormData {
  fromPlz: string;
  toPlz: string;
  moveDate: string;
  rooms: string;
  fromFloor: string;
  toFloor: string;
  hasLiftFrom: boolean;
  hasLiftTo: boolean;
  videoUploaded: boolean;
  skipVideo: boolean;
  selectedTier: string;
  name: string;
  email: string;
  phone: string;
  agreeTerms: boolean;
  crossSellCleaning: boolean;
  crossSellStorage: boolean;
  crossSellHandyman: boolean;
}

interface ValidationErrors {
  [key: string]: string;
}

// ============= MAIN COMPONENT =============
export function V6bOptimized() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fromPlz: '',
    toPlz: '',
    moveDate: '',
    rooms: '3.5',
    fromFloor: 'EG',
    toFloor: '1',
    hasLiftFrom: false,
    hasLiftTo: true,
    videoUploaded: false,
    skipVideo: false,
    selectedTier: 'komfort',
    name: '',
    email: '',
    phone: '',
    agreeTerms: false,
    crossSellCleaning: false,
    crossSellStorage: false,
    crossSellHandyman: false,
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { isCaptureMode } = useCaptureMode();
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768;

  // Progress calculation with gamification
  const progressPercent = Math.round(((step - 1) / (STEPS.length - 1)) * 100);
  const getMotivationalText = () => {
    if (step === 1) return 'Los geht\'s! 🚀';
    if (step === 2) return 'Super, weiter so!';
    if (step === 3) return 'Fast geschafft!';
    if (step === 4) return 'Gleich fertig!';
    return 'Geschafft! 🎉';
  };

  // Validation
  const validateField = (field: string, value: string): string => {
    switch (field) {
      case 'fromPlz':
      case 'toPlz':
        if (!value) return 'PLZ erforderlich';
        if (!/^\d{4}$/.test(value)) return 'Schweizer PLZ (4 Ziffern)';
        return '';
      case 'email':
        if (!value) return 'E-Mail erforderlich';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Ungültige E-Mail';
        return '';
      case 'phone':
        if (!value) return 'Telefon erforderlich';
        if (!/^[\d\s+()-]{10,}$/.test(value)) return 'Ungültige Telefonnummer';
        return '';
      case 'name':
        if (!value) return 'Name erforderlich';
        if (value.length < 2) return 'Mindestens 2 Zeichen';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (typeof value === 'string') {
      const error = validateField(field, value);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!(formData.fromPlz && formData.toPlz && formData.moveDate && 
                  !errors.fromPlz && !errors.toPlz);
      case 2:
        return formData.videoUploaded || formData.skipVideo;
      case 3:
        return !!formData.selectedTier;
      case 4:
        return true;
      case 5:
        return !!(formData.name && formData.email && formData.phone && formData.agreeTerms &&
                  !errors.name && !errors.email && !errors.phone);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < STEPS.length && canProceed()) {
      setStep(prev => prev + 1);
    } else if (step === STEPS.length && canProceed()) {
      setIsSubmitted(true);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  // Calculate price based on tier
  const calculatePrice = () => {
    const tier = SERVICE_TIERS.find(t => t.id === formData.selectedTier);
    const basePrice = {
      'transport': 490,
      'diy-plus': 690,
      'hybrid': 990,
      'komfort': 1490,
      'premium': 2490,
      'ultimate': 3990,
    }[formData.selectedTier] || 1490;
    
    // Add cross-sell prices
    let total = basePrice;
    if (formData.crossSellCleaning) total += 350;
    if (formData.crossSellStorage) total += 150;
    if (formData.crossSellHandyman) total += 200;
    
    return total;
  };

  // ============= RENDER TRUST SIGNALS =============
  const renderTrustSignals = () => (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 bg-green-50 border-green-200">
        <Shield className="w-4 h-4 text-green-600" />
        <span className="text-xs">TÜV geprüft</span>
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 bg-red-50 border-red-200">
        <Award className="w-4 h-4 text-red-600" />
        <span className="text-xs">Swiss Made</span>
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 bg-yellow-50 border-yellow-200">
        <Star className="w-4 h-4 text-yellow-600 fill-yellow-400" />
        <span className="text-xs">4.8/5 (2\'847)</span>
      </Badge>
      <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 border-blue-200">
        <Users className="w-4 h-4 text-blue-600" />
        <span className="text-xs">15\'000+ Umzüge</span>
      </Badge>
    </div>
  );

  // ============= RENDER PROGRESS =============
  const renderProgress = () => (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Schritt {step} von {STEPS.length}
        </span>
        <span className="text-sm font-medium text-primary">
          {getMotivationalText()}
        </span>
      </div>
      <Progress value={progressPercent} className="h-2" />
      <div className="flex justify-between mt-3">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = s.id === step;
          const isCompleted = s.id < step;
          return (
            <div key={s.id} className="flex flex-col items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center transition-all
                ${isActive ? 'bg-primary text-primary-foreground scale-110' : ''}
                ${isCompleted ? 'bg-green-500 text-white' : ''}
                ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
              `}>
                {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'font-medium text-primary' : 'text-muted-foreground'}`}>
                {s.shortTitle}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );

  // ============= STEP 1: DETAILS =============
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">Willkommen zum Umzugs-Erlebnis</h1>
        <p className="text-muted-foreground">
          Wenige Angaben – in unter 10 Minuten zum Fixpreis
        </p>
      </div>

      {renderTrustSignals()}

      <div className="grid gap-4">
        {/* From PLZ */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Von wo? <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="PLZ eingeben"
              value={formData.fromPlz}
              onChange={(e) => handleInputChange('fromPlz', e.target.value)}
              className={errors.fromPlz ? 'border-destructive' : ''}
              maxLength={4}
            />
            {errors.fromPlz && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.fromPlz}
              </p>
            )}
          </div>
        </div>

        {/* To PLZ */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Wohin? <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="PLZ eingeben"
              value={formData.toPlz}
              onChange={(e) => handleInputChange('toPlz', e.target.value)}
              className={errors.toPlz ? 'border-destructive' : ''}
              maxLength={4}
            />
            {errors.toPlz && (
              <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.toPlz}
              </p>
            )}
          </div>
        </div>

        {/* Move Date */}
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Wunschtermin <span className="text-destructive">*</span>
          </label>
          <Input
            type="date"
            value={formData.moveDate}
            onChange={(e) => handleInputChange('moveDate', e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        {/* Rooms */}
        <div>
          <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
            Zimmerzahl
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Schweizer Zählweise: Küche, Bad, Korridor nicht gezählt</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <select
            value={formData.rooms}
            onChange={(e) => handleInputChange('rooms', e.target.value)}
            className="w-full h-10 px-3 rounded-md border border-input bg-background"
          >
            {['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6+'].map(r => (
              <option key={r} value={r}>{r} Zimmer</option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick trust */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground mt-4">
        <div className="flex flex-col items-center gap-1">
          <Shield className="w-5 h-5 text-green-600" />
          <span>Versicherung inkl.</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Clock className="w-5 h-5 text-blue-600" />
          <span>&lt; 2 Std. Antwort</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Award className="w-5 h-5 text-amber-600" />
          <span>Fixpreis Garantie</span>
        </div>
      </div>
    </div>
  );

  // ============= STEP 2: VIDEO SCAN =============
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-2">Video-Inventar-Scan</h2>
        <p className="text-muted-foreground">
          Unsere KI erkennt automatisch Ihr Inventar
        </p>
      </div>

      {/* Video explanation */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Wie funktioniert's?</h3>
              <p className="text-xs text-muted-foreground">
                Filmen Sie langsam durch Ihre Räume (ca. 30 Sek/Raum). 
                Unsere KI erkennt Möbel und Gegenstände automatisch.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy notice */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm mb-1">Datenschutz</h3>
              <p className="text-xs text-muted-foreground">
                Videos werden verschlüsselt übertragen und nach 48h automatisch gelöscht.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upload area */}
      <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30">
        {formData.videoUploaded ? (
          <div className="text-green-600">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-2" />
            <p className="font-medium">Video hochgeladen!</p>
          </div>
        ) : (
          <>
            <Video className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <div className="space-y-3">
              <Button 
                onClick={() => handleInputChange('videoUploaded', true)}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Video auswählen
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleInputChange('videoUploaded', true)}
                className="gap-2 ml-2"
              >
                <Camera className="w-4 h-4" />
                Jetzt aufnehmen
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Skip option - prominent */}
      <Button
        variant="secondary"
        onClick={() => handleInputChange('skipVideo', true)}
        className="w-full gap-2"
      >
        <ChevronRight className="w-4 h-4" />
        Überspringen (manuelle Checkliste)
      </Button>
    </div>
  );

  // ============= STEP 3: SERVICE TIERS =============
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-2">Wie viel möchten Sie selbst machen?</h2>
        <p className="text-muted-foreground">
          Wählen Sie Ihr Service-Level
        </p>
      </div>

      <div className="grid gap-3">
        {SERVICE_TIERS.map((tier) => (
          <TooltipProvider key={tier.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card 
                  className={`cursor-pointer transition-all ${
                    formData.selectedTier === tier.id 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  } ${tier.color}`}
                  onClick={() => handleInputChange('selectedTier', tier.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{tier.title}</h3>
                          {tier.popular && (
                            <Badge className="bg-primary text-primary-foreground text-xs">
                              Beliebt
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{tier.price}</p>
                        <p className="text-xs text-muted-foreground">
                          Sie: {tier.selfPercent}%
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent side="left" className="max-w-xs">
                <div className="space-y-2">
                  <p className="font-medium">Inklusivleistungen:</p>
                  <ul className="text-xs space-y-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <Check className="w-3 h-3 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {tier.notIncluded.length > 0 && (
                    <>
                      <p className="font-medium mt-2">Nicht enthalten:</p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        {tier.notIncluded.map((f, i) => (
                          <li key={i}>• {f}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );

  // ============= STEP 4: PRICE =============
  const renderStep4 = () => {
    const price = calculatePrice();
    const selectedTier = SERVICE_TIERS.find(t => t.id === formData.selectedTier);
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-4">
          <h2 className="text-xl font-bold mb-2">Ihr Fixpreis</h2>
          <p className="text-muted-foreground">
            Transparent und verbindlich
          </p>
        </div>

        {/* Price display */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Ihr Paket: {selectedTier?.title}</p>
            <p className="text-4xl font-bold text-primary mb-2">
              CHF {price.toLocaleString('de-CH')}
            </p>
            <p className="text-sm text-muted-foreground">
              inkl. MwSt. und Vollversicherung
            </p>
          </CardContent>
        </Card>

        {/* Price breakdown */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-medium mb-3">Preisaufschlüsselung</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Grundpreis ({selectedTier?.title})</span>
                <span>CHF {selectedTier?.price.replace('ab CHF ', '')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Distanz ({formData.fromPlz} → {formData.toPlz})</span>
                <span>inkl.</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Volumen ({formData.rooms} Zimmer)</span>
                <span>inkl.</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Versicherung (CHF 100'000)</span>
                <span>inkl.</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guarantees */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Preisgarantie</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>24h Storno möglich</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Versicherungsschutz</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-500" />
            <span>Geprüfte Partner</span>
          </div>
        </div>
      </div>
    );
  };

  // ============= STEP 5: BOOKING =============
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold mb-2">Buchung abschliessen</h2>
        <p className="text-muted-foreground">
          24h kostenlos stornierbar
        </p>
      </div>

      {/* Contact form */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="Max Muster"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">
            E-Mail <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            placeholder="max@muster.ch"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
            Telefon <span className="text-destructive">*</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nur für Rückfragen zur Buchung</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </label>
          <Input
            type="tel"
            placeholder="+41 79 123 45 67"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={errors.phone ? 'border-destructive' : ''}
          />
          {errors.phone && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Cross-sell */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <h3 className="font-medium mb-3">Zusatzservices (optional)</h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={formData.crossSellCleaning}
                onCheckedChange={(c) => handleInputChange('crossSellCleaning', !!c)}
              />
              <div className="flex-1">
                <span className="text-sm">Endreinigung</span>
                <p className="text-xs text-muted-foreground">Professionelle Reinigung</p>
              </div>
              <span className="text-sm font-medium">+CHF 350</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={formData.crossSellStorage}
                onCheckedChange={(c) => handleInputChange('crossSellStorage', !!c)}
              />
              <div className="flex-1">
                <span className="text-sm">Einlagerung</span>
                <p className="text-xs text-muted-foreground">1 Monat gratis</p>
              </div>
              <span className="text-sm font-medium">+CHF 150/Mt</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={formData.crossSellHandyman}
                onCheckedChange={(c) => handleInputChange('crossSellHandyman', !!c)}
              />
              <div className="flex-1">
                <span className="text-sm">Handwerker</span>
                <p className="text-xs text-muted-foreground">Lampen, Bilder, etc.</p>
              </div>
              <span className="text-sm font-medium">+CHF 200</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <label className="flex items-start gap-3 cursor-pointer">
        <Checkbox
          checked={formData.agreeTerms}
          onCheckedChange={(c) => handleInputChange('agreeTerms', !!c)}
          className="mt-1"
        />
        <span className="text-sm text-muted-foreground">
          Ich akzeptiere die <a href="#" className="text-primary underline">AGB</a> und{' '}
          <a href="#" className="text-primary underline">Datenschutzerklärung</a>
        </span>
      </label>
    </div>
  );

  // ============= SUCCESS =============
  const renderSuccess = () => (
    <div className="space-y-6 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-2">Buchung bestätigt! 🎉</h2>
        <p className="text-muted-foreground">
          Bestätigung an {formData.email} gesendet
        </p>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-3 text-left">Ihr Umzugs-Fahrplan</h3>
          <div className="space-y-3">
            {[
              { day: 'T-30', title: 'Heute', desc: 'Buchung bestätigt', done: true },
              { day: 'T-21', title: 'In 9 Tagen', desc: 'Video-Scan (falls gewählt)', done: false },
              { day: 'T-14', title: 'In 16 Tagen', desc: 'Finale Bestätigung', done: false },
              { day: 'T-3', title: '3 Tage vor', desc: 'Crew-Details erhalten', done: false },
              { day: 'T-0', title: formData.moveDate, desc: 'Umzugstag!', done: false },
              { day: 'T+7', title: 'Nach 1 Woche', desc: 'Feedback-Einladung', done: false },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-left">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.done ? 'bg-green-100' : 'bg-muted'
                }`}>
                  {item.done ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <span className="text-xs font-medium">{item.day}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full gap-2">
        <MessageCircle className="w-4 h-4" />
        Zum Dashboard
      </Button>
    </div>
  );

  // ============= MAIN RENDER =============
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-lg mx-auto">
          {renderSuccess()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto p-4 pb-24">
        {renderProgress()}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
            {step === 5 && renderStep5()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Footer CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 shadow-lg">
        <div className="max-w-lg mx-auto flex gap-3">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack} className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Zurück
            </Button>
          )}
          <Button 
            onClick={handleNext} 
            className="flex-1 gap-2"
            disabled={!canProceed()}
          >
            {step === STEPS.length ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Verbindlich buchen
              </>
            ) : (
              <>
                Weiter
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        {/* Trust micro-text */}
        <div className="max-w-lg mx-auto mt-2 flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            SSL verschlüsselt
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3" />
            Swiss Made
          </span>
        </div>
      </div>
    </div>
  );
}
