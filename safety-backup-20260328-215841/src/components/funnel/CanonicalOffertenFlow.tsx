/**
 * Canonical 3-Step Lead Flow
 * 
 * Best-of V6a/V8a/V9 - Optimiert für höchste Conversion
 * 
 * Step 1: Details (Von/Nach, Zimmer, Datum)
 * Step 2: Paket & Services (3 Karten + Extras)
 * Step 3: Review & Kontakt (Zusammenfassung + Top 3 Firmen)
 * 
 * FEATURES:
 * - Context-aware prefill (service pages auto-select, canton pages geo-target)
 * - Swiss PLZ validation with regex /^[1-9]\d{3}$/
 * - inputMode="numeric" for PLZ fields
 * - text-base (16px) to prevent iOS zoom
 * - Large touch targets (min 44px)
 */

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Home, 
  Calendar, 
  Package, 
  Sparkles, 
  Crown,
  Check,
  Trash2,
  Wrench,
  Sofa,
  User,
  Mail,
  Phone,
  Shield,
  Star,
  Building2,
  ArrowRight,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FunnelStepShell } from './FunnelStepShell';
import { usePrefill } from '@/hooks/usePrefill';
import { validateSwissPLZ, validateEmail, validateName } from '@/lib/swiss-validation';
import { cn } from '@/lib/utils';

interface CanonicalFlowData {
  // Step 1
  fromPLZ: string;
  fromCity: string;
  toPLZ: string;
  toCity: string;
  roomSize: string;
  moveDate: string;
  dateFlexibility: 'exact' | 'flexible' | 'very_flexible';
  
  // Step 2
  packageLevel: 'basis' | 'standard' | 'komfort';
  extras: string[];
  
  // Step 3
  name: string;
  email: string;
  phone: string;
  acceptPrivacy: boolean;
}

// Validation errors state
interface ValidationErrors {
  fromPLZ?: string;
  toPLZ?: string;
  name?: string;
  email?: string;
}

const INITIAL_DATA: CanonicalFlowData = {
  fromPLZ: '',
  fromCity: '',
  toPLZ: '',
  toCity: '',
  roomSize: '',
  moveDate: '',
  dateFlexibility: 'flexible',
  packageLevel: 'standard',
  extras: [],
  name: '',
  email: '',
  phone: '',
  acceptPrivacy: false,
};

const ROOM_SIZES = [
  { value: '1', label: '1 Zimmer', icon: '🏠' },
  { value: '1.5', label: '1.5 Zimmer', icon: '🏠' },
  { value: '2', label: '2 Zimmer', icon: '🏡' },
  { value: '2.5', label: '2.5 Zimmer', icon: '🏡' },
  { value: '3', label: '3 Zimmer', icon: '🏘️' },
  { value: '3.5', label: '3.5 Zimmer', icon: '🏘️' },
  { value: '4', label: '4 Zimmer', icon: '🏰' },
  { value: '4.5', label: '4.5 Zimmer', icon: '🏰' },
  { value: '5+', label: '5+ Zimmer', icon: '🏛️' },
];

const PACKAGES = [
  {
    id: 'basis',
    name: 'Basis',
    description: 'Transport & Grundleistungen',
    icon: Package,
    features: ['Transport', 'Be-/Entladen', 'Schutzverpackung'],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Unser beliebtestes Paket',
    icon: Sparkles,
    features: ['Alles aus Basis', 'Ein-/Auspacken', 'Möbelmontage'],
    popular: true,
  },
  {
    id: 'komfort',
    name: 'Komfort',
    description: 'Rundum-Sorglos-Paket',
    icon: Crown,
    features: ['Alles aus Standard', 'Reinigung', 'Entsorgung'],
    popular: false,
  },
];

const EXTRAS = [
  { id: 'reinigung', label: 'Endreinigung', icon: Sparkles },
  { id: 'entsorgung', label: 'Entsorgung', icon: Trash2 },
  { id: 'montage', label: 'Möbelmontage', icon: Wrench },
  { id: 'lagerung', label: 'Zwischenlagerung', icon: Package },
  { id: 'klavier', label: 'Klaviertransport', icon: Sofa },
];

// Demo companies for preview
const TOP_COMPANIES = [
  { id: '1', name: 'Züri Umzüge AG', rating: 4.9, reviews: 234, priceLevel: 'fair' },
  { id: '2', name: 'Swiss Move Pro', rating: 4.8, reviews: 189, priceLevel: 'günstig' },
  { id: '3', name: 'Premium Relocations', rating: 4.7, reviews: 156, priceLevel: 'premium' },
];

export function CanonicalOffertenFlow() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<CanonicalFlowData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExtras, setShowExtras] = useState(false);
  
  // Prefill handling (context-aware)
  const { prefill, isPrefilled, sourceLabel, dismiss } = usePrefill({
    autoApply: true,
    onApply: (p) => {
      setData(prev => ({
        ...prev,
        fromPLZ: p.fromPLZ,
        fromCity: p.fromCity,
        toPLZ: p.toPLZ,
        toCity: p.toCity,
        roomSize: p.size || prev.roomSize,
        // Auto-select extras based on source (e.g., reinigung page)
        extras: p.autoSelectServices?.length 
          ? [...new Set([...prev.extras, ...p.autoSelectServices])]
          : prev.extras,
      }));
      
      // Auto-open extras if services were auto-selected
      if (p.autoSelectServices?.length) {
        setShowExtras(true);
      }
    },
  });
  
  const updateData = useCallback((updates: Partial<CanonicalFlowData>) => {
    setData(prev => ({ ...prev, ...updates }));
    // Clear related errors when field is updated
    if ('fromPLZ' in updates) setErrors(e => ({ ...e, fromPLZ: undefined }));
    if ('toPLZ' in updates) setErrors(e => ({ ...e, toPLZ: undefined }));
    if ('name' in updates) setErrors(e => ({ ...e, name: undefined }));
    if ('email' in updates) setErrors(e => ({ ...e, email: undefined }));
  }, []);
  
  // Swiss PLZ validation on blur
  const validatePLZField = useCallback((field: 'fromPLZ' | 'toPLZ', value: string) => {
    if (!value) return;
    const result = validateSwissPLZ(value);
    if (!result.valid) {
      setErrors(e => ({ ...e, [field]: result.error }));
    }
  }, []);
  
  const canProceed = useCallback((): boolean => {
    switch (step) {
      case 1:
        const fromValid = validateSwissPLZ(data.fromPLZ).valid;
        const toValid = validateSwissPLZ(data.toPLZ).valid;
        return fromValid && toValid && !!data.roomSize;
      case 2:
        return !!data.packageLevel;
      case 3:
        const nameValid = validateName(data.name).valid;
        const emailValid = validateEmail(data.email).valid;
        return nameValid && emailValid && data.acceptPrivacy;
      default:
        return false;
    }
  }, [step, data]);
  
  const getHint = useCallback((): string | null => {
    switch (step) {
      case 1:
        if (!data.fromPLZ) return 'Bitte Start-PLZ eingeben';
        if (!data.toPLZ) return 'Bitte Ziel-PLZ eingeben';
        if (!data.roomSize) return 'Bitte Wohnungsgrösse wählen';
        return null;
      case 3:
        if (!data.name) return 'Bitte Name eingeben';
        if (!data.email) return 'Bitte E-Mail eingeben';
        if (!data.acceptPrivacy) return 'Bitte Datenschutz akzeptieren';
        return null;
      default:
        return null;
    }
  }, [step, data]);
  
  const handleNext = useCallback(async () => {
    if (!canProceed()) return;
    
    if (step === 3) {
      setIsSubmitting(true);
      await new Promise(r => setTimeout(r, 1500));
      setIsSubmitting(false);
      setIsSubmitted(true);
      return;
    }
    
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, canProceed]);
  
  const handleBack = useCallback(() => {
    setStep(prev => Math.max(1, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Vielen Dank!</h1>
          <p className="text-muted-foreground mb-6">
            Ihre Anfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze 3-5 Offerten von geprüften Umzugsfirmen.
          </p>
          <div className="bg-muted/50 rounded-lg p-4 text-left mb-6">
            <h3 className="font-semibold mb-2">Was passiert als Nächstes?</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">1.</span>
                Wir leiten Ihre Anfrage an passende Firmen weiter
              </li>
              <li className="flex gap-2">
                <span className="text-primary">2.</span>
                Sie erhalten innerhalb 24h erste Offerten per E-Mail
              </li>
              <li className="flex gap-2">
                <span className="text-primary">3.</span>
                Vergleichen Sie in Ruhe und wählen Sie die beste Offerte
              </li>
            </ol>
          </div>
          <Button asChild>
            <a href="/">Zurück zur Startseite</a>
          </Button>
        </motion.div>
      </div>
    );
  }
  
  // Step titles
  const stepTitles: Record<number, { title: string; subtitle?: string }> = {
    1: { title: 'Wo ziehen Sie um?', subtitle: 'Wir finden die besten Firmen für Ihre Strecke' },
    2: { title: 'Welches Paket passt?', subtitle: 'Sie können später alles anpassen' },
    3: { title: 'Fast geschafft!', subtitle: 'Sie erhalten 3-5 unverbindliche Offerten' },
  };
  
  const currentStep = stepTitles[step];
  
  return (
    <FunnelStepShell
      step={step}
      totalSteps={3}
      stepTitle={currentStep.title}
      stepSubtitle={currentStep.subtitle}
      onNext={handleNext}
      onBack={step > 1 ? handleBack : undefined}
      canProceed={canProceed()}
      hint={getHint()}
      isSubmitting={isSubmitting}
      isLastStep={step === 3}
      ctaLabel={step === 3 ? 'Offerten erhalten' : 'Weiter'}
      prefillInfo={isPrefilled && step === 1 ? { label: sourceLabel, onEdit: dismiss } : null}
    >
      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Addresses with Swiss PLZ validation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                Von (PLZ/Ort) *
              </Label>
              <div className="flex gap-2">
                <div className="w-28">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="PLZ"
                    value={data.fromPLZ}
                    onChange={(e) => updateData({ fromPLZ: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    onBlur={(e) => validatePLZField('fromPLZ', e.target.value)}
                    className={cn(
                      "h-12 text-base",
                      errors.fromPLZ && "border-destructive focus:ring-destructive/20"
                    )}
                    maxLength={4}
                    enterKeyHint="next"
                    data-error={!!errors.fromPLZ}
                  />
                  {errors.fromPLZ && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.fromPLZ}
                    </p>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Ort"
                  value={data.fromCity}
                  onChange={(e) => updateData({ fromCity: e.target.value })}
                  className="flex-1 h-12 text-base"
                  enterKeyHint="next"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-600" />
                Nach (PLZ/Ort) *
              </Label>
              <div className="flex gap-2">
                <div className="w-28">
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="PLZ"
                    value={data.toPLZ}
                    onChange={(e) => updateData({ toPLZ: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                    onBlur={(e) => validatePLZField('toPLZ', e.target.value)}
                    className={cn(
                      "h-12 text-base",
                      errors.toPLZ && "border-destructive focus:ring-destructive/20"
                    )}
                    maxLength={4}
                    enterKeyHint="next"
                    data-error={!!errors.toPLZ}
                  />
                  {errors.toPLZ && (
                    <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.toPLZ}
                    </p>
                  )}
                </div>
                <Input
                  type="text"
                  placeholder="Ort"
                  value={data.toCity}
                  onChange={(e) => updateData({ toCity: e.target.value })}
                  className="flex-1 h-12 text-base"
                  enterKeyHint="next"
                />
              </div>
            </div>
          </div>
          
          {/* Room Size */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Wohnungsgrösse
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ROOM_SIZES.map((room) => (
                <button
                  key={room.value}
                  type="button"
                  onClick={() => updateData({ roomSize: room.value })}
                  className={cn(
                    "p-3 rounded-xl border-2 text-center transition-all min-h-[56px]",
                    data.roomSize === room.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <span className="text-lg">{room.icon}</span>
                  <span className="block text-xs font-medium mt-1">{room.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Move Date */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Umzugsdatum
              <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Input
              type="date"
              value={data.moveDate}
              onChange={(e) => updateData({ moveDate: e.target.value })}
              className="h-12"
              min={new Date().toISOString().split('T')[0]}
            />
            <div className="flex gap-2">
              {(['exact', 'flexible', 'very_flexible'] as const).map((flex) => (
                <button
                  key={flex}
                  type="button"
                  onClick={() => updateData({ dateFlexibility: flex })}
                  className={cn(
                    "flex-1 py-2 px-3 rounded-lg border text-sm transition-all",
                    data.dateFlexibility === flex
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {flex === 'exact' && 'Fixiert'}
                  {flex === 'flexible' && 'Flexibel'}
                  {flex === 'very_flexible' && 'Noch unsicher'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Step 2: Package & Services */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Package Selection */}
          <div className="grid gap-4">
            {PACKAGES.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                onClick={() => updateData({ packageLevel: pkg.id as any })}
                className={cn(
                  "relative p-4 rounded-xl border-2 text-left transition-all",
                  data.packageLevel === pkg.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 left-4 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                    Beliebt
                  </span>
                )}
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    data.packageLevel === pkg.id ? "bg-primary/20" : "bg-muted"
                  )}>
                    <pkg.icon className={cn(
                      "w-6 h-6",
                      data.packageLevel === pkg.id ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {pkg.features.map((f) => (
                        <span key={f} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    data.packageLevel === pkg.id ? "border-primary bg-primary" : "border-muted-foreground/30"
                  )}>
                    {data.packageLevel === pkg.id && (
                      <Check className="w-4 h-4 text-primary-foreground" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Extras (Collapsible) */}
          <Collapsible open={showExtras} onOpenChange={setShowExtras}>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span>{showExtras ? '−' : '+'}</span>
              Zusätzliche Services anzeigen
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                {EXTRAS.map((extra) => {
                  const isSelected = data.extras.includes(extra.id);
                  return (
                    <button
                      key={extra.id}
                      type="button"
                      onClick={() => {
                        updateData({
                          extras: isSelected
                            ? data.extras.filter(e => e !== extra.id)
                            : [...data.extras, extra.id]
                        });
                      }}
                      className={cn(
                        "p-3 rounded-xl border-2 text-center transition-all",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <extra.icon className={cn(
                        "w-5 h-5 mx-auto mb-1",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="text-sm font-medium">{extra.label}</span>
                    </button>
                  );
                })}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
      
      {/* Step 3: Review & Contact */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Ihre Anfrage</h3>
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-muted-foreground">Strecke:</span>
                <span className="font-medium">
                  {data.fromPLZ} {data.fromCity} → {data.toPLZ} {data.toCity}
                </span>
                <span className="text-muted-foreground">Grösse:</span>
                <span className="font-medium">{data.roomSize} Zimmer</span>
                <span className="text-muted-foreground">Paket:</span>
                <span className="font-medium capitalize">{data.packageLevel}</span>
                {data.moveDate && (
                  <>
                    <span className="text-muted-foreground">Datum:</span>
                    <span className="font-medium">{new Date(data.moveDate).toLocaleDateString('de-CH')}</span>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Top 3 Companies Preview */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Top 3 passende Firmen
            </h3>
            <div className="grid gap-2">
              {TOP_COMPANIES.map((company, i) => (
                <div
                  key={company.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <span className="font-medium">{company.name}</span>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {company.rating} ({company.reviews})
                      <span className="text-green-600">{company.priceLevel}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="space-y-4">
            <h3 className="font-semibold">Kontaktdaten</h3>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Name *
              </Label>
              <Input
                type="text"
                placeholder="Max Mustermann"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="h-12"
                autoComplete="name"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-Mail *
              </Label>
              <Input
                type="email"
                inputMode="email"
                placeholder="max@beispiel.ch"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className="h-12"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Telefon
                <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                type="tel"
                inputMode="tel"
                placeholder="+41 79 123 45 67"
                value={data.phone}
                onChange={(e) => updateData({ phone: e.target.value })}
                className="h-12"
                autoComplete="tel"
              />
            </div>
            
            {/* Privacy */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <Checkbox
                id="privacy"
                checked={data.acceptPrivacy}
                onCheckedChange={(checked) => updateData({ acceptPrivacy: !!checked })}
                className="mt-0.5"
              />
              <label htmlFor="privacy" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                Ich akzeptiere die <a href="/datenschutz" className="text-primary underline">Datenschutzerklärung</a> und stimme zu, dass meine Daten an passende Umzugsfirmen weitergeleitet werden.
              </label>
            </div>
            
            {/* Microcopy */}
            <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-green-600" />
                Keine Weitergabe
              </span>
              <span>•</span>
              <span>Kein Spam</span>
              <span>•</span>
              <span>100% unverbindlich</span>
            </div>
          </div>
        </div>
      )}
    </FunnelStepShell>
  );
}

export default CanonicalOffertenFlow;
