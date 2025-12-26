/**
 * V3a - Feedback-Based Optimized
 * Based on ChatGPT UX Analysis Feedback
 * 
 * Key Improvements Implemented:
 * 1. No PWA banner during funnel (clean focus)
 * 2. Transparent price logic with explanations
 * 3. Slider with clear labels and tooltips
 * 4. PLZ autocomplete simulation with validation
 * 5. Skippable Step 3 with integrated trust signals
 * 6. Larger checkbox and clearer privacy text
 * 7. Mobile sticky CTA button
 * 8. Progress bar with clickable step titles
 * 9. Inline error messages and feedback
 * 10. Customer testimonials and trust indicators
 */

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Shield, 
  Clock, 
  Star, 
  Truck,
  Info,
  MapPin,
  Calendar,
  User,
  Mail,
  Phone,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Award,
  Lock
} from 'lucide-react';

// Service levels with clear pricing
const SERVICE_LEVELS = [
  { 
    id: 'budget', 
    name: 'Budget & Control', 
    percentage: 20,
    description: 'Sie packen & tragen selbst',
    basePrice: 990,
    features: ['Transport', 'LKW inkl.']
  },
  { 
    id: 'smart', 
    name: 'Smart Mover', 
    percentage: 40,
    description: 'Wir helfen beim Tragen',
    basePrice: 1490,
    features: ['Transport', '2 Umzugshelfer', 'Grundausstattung']
  },
  { 
    id: 'comfort', 
    name: 'Comfort', 
    percentage: 60,
    description: 'Wir packen Küche & Bad',
    basePrice: 2490,
    features: ['Transport', '3 Umzugshelfer', 'Teilverpackung', 'Möbelschutz']
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    percentage: 80,
    description: 'Wir übernehmen fast alles',
    basePrice: 2990,
    features: ['Transport', '4 Umzugshelfer', 'Vollverpackung', 'Endreinigung', 'Koordination']
  },
  { 
    id: 'whiteglove', 
    name: 'White Glove', 
    percentage: 100,
    description: 'Rundum-Sorglos-Paket',
    basePrice: 4490,
    features: ['Transport', '5+ Umzugshelfer', 'Alles inklusive', 'Concierge-Service', 'Möbelmontage']
  },
];

const APARTMENT_SIZES = [
  { id: 'studio', label: 'Studio', rooms: '1 Zi.', factor: 0.6 },
  { id: '2zi', label: '2 Zimmer', rooms: '2 Zi.', factor: 0.8 },
  { id: '3zi', label: '3 Zimmer', rooms: '3 Zi.', factor: 1.0 },
  { id: '4zi', label: '4 Zimmer', rooms: '4 Zi.', factor: 1.3 },
  { id: '5plus', label: '5+ Zimmer', rooms: '5+ Zi.', factor: 1.6 },
];

const STEPS = [
  { id: 1, title: 'Service wählen', shortTitle: 'Service', icon: Sparkles },
  { id: 2, title: 'Details', shortTitle: 'Details', icon: MapPin },
  { id: 3, title: 'Überprüfen', shortTitle: 'Check', icon: Check },
  { id: 4, title: 'Kontakt', shortTitle: 'Kontakt', icon: User },
];

const TESTIMONIALS = [
  { name: 'Marco S.', location: 'Zürich', text: 'Schneller Umzug, top Preis!', rating: 5 },
  { name: 'Sandra M.', location: 'Bern', text: 'Sehr professionell und pünktlich.', rating: 5 },
  { name: 'Thomas K.', location: 'Basel', text: 'Alles wie versprochen!', rating: 5 },
];

// Form validation
interface FormErrors {
  fromPLZ?: string;
  toPLZ?: string;
  date?: string;
  name?: string;
  email?: string;
  phone?: string;
  consent?: string;
}

export const V3aFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sliderValue, setSliderValue] = useState([60]); // Default to Comfort
  const [selectedSize, setSelectedSize] = useState('3zi');
  const [formData, setFormData] = useState({
    fromPLZ: '',
    fromCity: '',
    toPLZ: '',
    toCity: '',
    date: '',
    name: '',
    email: '',
    phone: '',
    consent: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const progress = (currentStep / STEPS.length) * 100;
  
  // Calculate current service level based on slider
  const currentService = SERVICE_LEVELS.reduce((prev, curr) => {
    return Math.abs(curr.percentage - sliderValue[0]) < Math.abs(prev.percentage - sliderValue[0]) ? curr : prev;
  });

  // Calculate price based on apartment size and service
  const apartmentFactor = APARTMENT_SIZES.find(s => s.id === selectedSize)?.factor || 1;
  const calculatedPrice = Math.round(currentService.basePrice * apartmentFactor);
  const priceRange = {
    min: calculatedPrice,
    max: Math.round(calculatedPrice * 1.15) // +15% for distance/floor factors
  };

  // PLZ to city mapping (simulated autocomplete)
  const plzToCity: Record<string, string> = {
    '8000': 'Zürich',
    '8001': 'Zürich',
    '8002': 'Zürich',
    '8003': 'Zürich',
    '8004': 'Zürich',
    '8005': 'Zürich',
    '3000': 'Bern',
    '3001': 'Bern',
    '4000': 'Basel',
    '4001': 'Basel',
    '6000': 'Luzern',
    '9000': 'St. Gallen',
    '1000': 'Lausanne',
    '1200': 'Genève',
  };

  const handlePLZChange = (field: 'fromPLZ' | 'toPLZ', value: string) => {
    const numericValue = value.replace(/\D/g, '').slice(0, 4);
    const cityField = field === 'fromPLZ' ? 'fromCity' : 'toCity';
    const city = plzToCity[numericValue] || '';
    
    setFormData(prev => ({
      ...prev,
      [field]: numericValue,
      [cityField]: city
    }));
    
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};
    
    if (step === 2) {
      if (!formData.fromPLZ || formData.fromPLZ.length !== 4) {
        newErrors.fromPLZ = 'Bitte geben Sie eine gültige PLZ ein';
      }
      if (!formData.toPLZ || formData.toPLZ.length !== 4) {
        newErrors.toPLZ = 'Bitte geben Sie eine gültige PLZ ein';
      }
      if (!formData.date) {
        newErrors.date = 'Bitte wählen Sie ein Datum';
      }
    }
    
    if (step === 4) {
      if (!formData.name || formData.name.length < 2) {
        newErrors.name = 'Bitte geben Sie Ihren Namen ein';
      }
      if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Bitte geben Sie eine gültige E-Mail ein';
      }
      if (!formData.phone || formData.phone.length < 10) {
        newErrors.phone = 'Bitte geben Sie eine gültige Telefonnummer ein';
      }
      if (!formData.consent) {
        newErrors.consent = 'Bitte stimmen Sie den Bedingungen zu';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(Math.min(currentStep + 1, STEPS.length));
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  const handleSkipStep = () => {
    if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-28">
        {/* Clean header without PWA banner */}
        <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
          <div className="max-w-2xl mx-auto px-4 py-3">
            {/* Progress with step titles */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Schritt {currentStep} von {STEPS.length}
              </span>
              <Badge variant="secondary" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                V3.a Feedback-Optimiert
              </Badge>
            </div>
            <Progress value={progress} className="h-2 mb-3" />
            
            {/* Clickable step pills with tooltips */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
              {STEPS.map((step) => (
                <Tooltip key={step.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => handleStepClick(step.id)}
                      disabled={step.id > currentStep}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        step.id === currentStep
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : step.id < currentStep
                          ? 'bg-primary/20 text-primary cursor-pointer hover:bg-primary/30'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      {step.id < currentStep ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <step.icon className="h-3 w-3" />
                      )}
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">{step.shortTitle}</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{step.title}</p>
                    {step.id < currentStep && <p className="text-xs text-muted-foreground">Klicken zum Bearbeiten</p>}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-2xl mx-auto p-4">
          {/* Step 1: Service Selection with Clear Slider */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Wie viel wollen Sie selbst machen?
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Schieben Sie den Regler, um Ihren idealen Service-Level zu wählen.
                </p>

                {/* Enhanced Slider with Labels */}
                <div className="mb-8">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Ich mache mehr</span>
                    <span>Ihr macht mehr</span>
                  </div>
                  
                  <Slider
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    max={100}
                    step={20}
                    className="mb-4"
                  />
                  
                  {/* Slider scale labels */}
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    {SERVICE_LEVELS.map(level => (
                      <Tooltip key={level.id}>
                        <TooltipTrigger asChild>
                          <span className={`cursor-help ${
                            level.id === currentService.id ? 'text-primary font-medium' : ''
                          }`}>
                            {level.percentage}%
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-medium">{level.name}</p>
                          <p className="text-xs">{level.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>

                {/* Apartment Size Selection */}
                <div className="mb-6">
                  <Label className="text-sm font-medium mb-3 block">Wohnungsgrösse</Label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {APARTMENT_SIZES.map(size => (
                      <button
                        key={size.id}
                        onClick={() => setSelectedSize(size.id)}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          selectedSize === size.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <span className="text-sm font-medium block">{size.rooms}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service Card with Clear Pricing */}
                <Card className={`p-4 border-2 ${
                  currentService.id === 'premium' ? 'border-primary bg-primary/5' : 'border-border'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{currentService.name}</h3>
                        {currentService.id === 'premium' && (
                          <Badge className="bg-primary/20 text-primary">Beliebt</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{currentService.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        CHF {calculatedPrice.toLocaleString()}
                      </div>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="text-xs text-muted-foreground cursor-help flex items-center justify-end gap-1">
                            <Info className="h-3 w-3" />
                            Richtpreis
                          </span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Der endgültige Preis (CHF {priceRange.min.toLocaleString()} – {priceRange.max.toLocaleString()}) hängt von Entfernung und Stockwerk ab.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  
                  {/* Service features */}
                  <div className="flex flex-wrap gap-2">
                    {currentService.features.map(feature => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        <Check className="h-3 w-3 mr-1" />
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </Card>
              </Card>

              {/* Trust Signals - integrated in Step 1 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <TrustBadge icon={Shield} label="Vollkasko" sublabel="Versicherung" />
                <TrustBadge icon={Award} label="Fixpreis" sublabel="Garantie" />
                <TrustBadge icon={Clock} label="Pünktlich" sublabel="Garantiert" />
                <TrustBadge icon={Star} label="4.9/5" sublabel="Bewertung" />
              </div>
            </div>
          )}

          {/* Step 2: Address & Date with Validation */}
          {currentStep === 2 && (
            <Card className="p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Die wichtigsten Details
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Nur 3 Angaben – schnell erledigt!
              </p>

              <div className="space-y-4">
                {/* From Address */}
                <div>
                  <Label htmlFor="fromPLZ" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Von wo ziehen Sie um?
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="fromPLZ"
                        placeholder="PLZ"
                        value={formData.fromPLZ}
                        onChange={(e) => handlePLZChange('fromPLZ', e.target.value)}
                        onBlur={() => handleBlur('fromPLZ')}
                        className={`text-lg h-12 ${errors.fromPLZ && touched.fromPLZ ? 'border-destructive' : ''}`}
                        maxLength={4}
                      />
                      {errors.fromPLZ && touched.fromPLZ && (
                        <div className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.fromPLZ}
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="Stadt"
                      value={formData.fromCity}
                      readOnly
                      className="flex-1 text-lg h-12 bg-muted/50"
                    />
                  </div>
                </div>

                {/* To Address */}
                <div className="mt-6">
                  <Label htmlFor="toPLZ" className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Wohin ziehen Sie?
                  </Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="toPLZ"
                        placeholder="PLZ"
                        value={formData.toPLZ}
                        onChange={(e) => handlePLZChange('toPLZ', e.target.value)}
                        onBlur={() => handleBlur('toPLZ')}
                        className={`text-lg h-12 ${errors.toPLZ && touched.toPLZ ? 'border-destructive' : ''}`}
                        maxLength={4}
                      />
                      {errors.toPLZ && touched.toPLZ && (
                        <div className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.toPLZ}
                        </div>
                      )}
                    </div>
                    <Input
                      placeholder="Stadt"
                      value={formData.toCity}
                      readOnly
                      className="flex-1 text-lg h-12 bg-muted/50"
                    />
                  </div>
                </div>

                {/* Date */}
                <div className="mt-6">
                  <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Wann möchten Sie umziehen?
                  </Label>
                  <div className="relative">
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      onBlur={() => handleBlur('date')}
                      className={`text-lg h-12 ${errors.date && touched.date ? 'border-destructive' : ''}`}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.date && touched.date && (
                      <div className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.date}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Das Datum ist flexibel – wir stimmen es mit Ihnen ab.
                  </p>
                </div>
              </div>

              {/* Mini Summary Card */}
              <Card className="mt-6 p-3 bg-muted/30">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>{currentService.name}</span>
                  </div>
                  <span className="font-semibold">CHF {calculatedPrice.toLocaleString()}</span>
                </div>
              </Card>
            </Card>
          )}

          {/* Step 3: Review (Skippable) */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold">
                    Ihr Umzugsplan
                  </h2>
                  <Button variant="ghost" size="sm" onClick={handleSkipStep} className="text-muted-foreground">
                    Überspringen
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{formData.fromCity || 'Start'} → {formData.toCity || 'Ziel'}</p>
                      <p className="text-sm text-muted-foreground">{formData.date || 'Datum wählen'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                    <Truck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{currentService.name}</p>
                      <p className="text-sm text-muted-foreground">{APARTMENT_SIZES.find(s => s.id === selectedSize)?.label}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="font-bold text-primary">CHF {calculatedPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Inklusive:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {currentService.features.map(feature => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Explanation Box */}
                <Card className="mt-6 p-4 border-primary/20 bg-primary/5">
                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-primary">Fixpreis-Garantie</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Der finale Preis (CHF {priceRange.min.toLocaleString()} – {priceRange.max.toLocaleString()}) wird nach der Besichtigung festgelegt. 
                        Die Spanne berücksichtigt Entfernung und Stockwerk.
                      </p>
                    </div>
                  </div>
                </Card>
              </Card>

              {/* What happens next */}
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Was passiert nach der Buchung?</h3>
                <div className="space-y-3">
                  <StepIndicator number={1} text="Sofortige Bestätigung per E-Mail" />
                  <StepIndicator number={2} text="Team-Zuweisung innerhalb 24 Stunden" />
                  <StepIndicator number={3} text="Umzug läuft automatisch – keine Nachfragen" />
                </div>
              </Card>

              {/* Testimonials */}
              <div className="grid grid-cols-3 gap-2">
                {TESTIMONIALS.map((t, i) => (
                  <Card key={i} className="p-3 text-center">
                    <div className="flex justify-center mb-1">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">„{t.text}"</p>
                    <p className="text-[10px] font-medium">{t.name}</p>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Contact with Clear Privacy */}
          {currentStep === 4 && (
            <Card className="p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                Letzte Hürde <span className="text-primary">🎉</span>
              </h2>
              <p className="text-muted-foreground text-sm mb-6">
                Geben Sie Ihre Kontaktdaten ein – wir melden uns innerhalb von 2 Stunden.
              </p>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      placeholder="Vor- und Nachname"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      onBlur={() => handleBlur('name')}
                      className={`text-lg h-12 ${errors.name && touched.name ? 'border-destructive' : ''}`}
                    />
                    {errors.name && touched.name && (
                      <div className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                      </div>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="mt-6">
                  <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                    <Mail className="h-4 w-4 text-primary" />
                    E-Mail
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="ihre@email.ch"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      onBlur={() => handleBlur('email')}
                      className={`text-lg h-12 ${errors.email && touched.email ? 'border-destructive' : ''}`}
                    />
                    {errors.email && touched.email && (
                      <div className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="mt-6">
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-primary" />
                    Telefon
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+41 79 123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      onBlur={() => handleBlur('phone')}
                      className={`text-lg h-12 ${errors.phone && touched.phone ? 'border-destructive' : ''}`}
                    />
                    {errors.phone && touched.phone && (
                      <div className="absolute -bottom-5 left-0 text-xs text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                      </div>
                    )}
                  </div>
                </div>

                {/* Large Checkbox with Clear Privacy */}
                <div className="mt-6 p-4 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, consent: checked as boolean }))}
                      className="h-6 w-6 mt-0.5"
                    />
                    <div>
                      <Label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                        Ich akzeptiere die <a href="#" className="text-primary underline">Datenschutzerklärung</a> und <a href="#" className="text-primary underline">AGB</a>.
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Keine Werbung – Ihre Daten bleiben in der Schweiz.
                      </p>
                    </div>
                  </div>
                  {errors.consent && (
                    <div className="mt-2 text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.consent}
                    </div>
                  )}
                </div>

                {/* Price Summary */}
                <Card className="mt-4 p-4 border-2 border-primary/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Ihre Offerte</p>
                      <p className="font-medium">{currentService.name} • {formData.fromCity || 'Start'} → {formData.toCity || 'Ziel'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Richtpreis</p>
                      <p className="text-xl font-bold text-primary">CHF {priceRange.min.toLocaleString()} – {priceRange.max.toLocaleString()}</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <p className="text-xs text-muted-foreground cursor-help flex items-center justify-end gap-1">
                            <Info className="h-3 w-3" />
                            Warum Spanne?
                          </p>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Abhängig von Entfernung und Stockwerk</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          )}
        </div>

        {/* Sticky Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border shadow-lg z-50">
          <div className="max-w-2xl mx-auto p-4 safe-area-inset-bottom">
            <div className="flex gap-3">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 px-6"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              )}
              <Button
                size="lg"
                className="flex-1 h-14 text-lg font-semibold"
                onClick={handleNext}
              >
                {currentStep === STEPS.length ? 'Jetzt buchen' : 'Weiter'}
                {currentStep < STEPS.length && <ArrowRight className="h-5 w-5 ml-2" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

// Helper Components
const TrustBadge: React.FC<{ icon: React.ElementType; label: string; sublabel: string }> = ({ icon: Icon, label, sublabel }) => (
  <Card className="p-3 text-center">
    <Icon className="h-5 w-5 mx-auto text-primary mb-1" />
    <p className="text-sm font-semibold">{label}</p>
    <p className="text-xs text-muted-foreground">{sublabel}</p>
  </Card>
);

const StepIndicator: React.FC<{ number: number; text: string }> = ({ number, text }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
      {number}
    </div>
    <p className="text-sm">{text}</p>
  </div>
);

export default V3aFeedbackBased;
