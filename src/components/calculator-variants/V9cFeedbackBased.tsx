import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, 
  Calendar, 
  Home, 
  Shield, 
  CheckCircle2, 
  Users, 
  HelpCircle,
  Star,
  Phone,
  Mail,
  User,
  Building,
  Truck,
  Package,
  Clock,
  ArrowLeft,
  ArrowUpDown,
  Filter,
  Sparkles,
  Lock,
  Info,
  Trash2,
  Sofa,
  Wrench,
  Award,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StickyFooterCTA } from '@/components/StickyFooterCTA';

// ============================================================================
// TYPES
// ============================================================================
interface FormData {
  fromZip: string;
  fromCity: string;
  toZip: string;
  toCity: string;
  rooms: string;
  floor: string;
  hasLift: boolean | null;
  moveDate: string;
  isFlexible: boolean;
  serviceLevel: 'basic' | 'standard' | 'comfort' | 'premium';
  extras: string[];
  selectedCompanies: string[];
  name: string;
  email: string;
  phone: string;
}

interface Company {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  location: string;
  priceFrom: number;
  tags: string[];
  responseTime: string;
  isSponsored?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const STEPS = [
  { id: 1, label: 'Adressen', icon: MapPin },
  { id: 2, label: 'Details', icon: Home },
  { id: 3, label: 'Services', icon: Package },
  { id: 4, label: 'Extras & Datum', icon: Calendar },
  { id: 5, label: 'Firmen', icon: Users },
];

const ROOM_OPTIONS = [
  { value: '1', label: '1', tooltip: '1-Zimmer-Wohnung (Studio)' },
  { value: '1.5', label: '1.5', tooltip: '1.5-Zimmer-Wohnung' },
  { value: '2', label: '2', tooltip: '2-Zimmer-Wohnung' },
  { value: '2.5', label: '2.5', tooltip: '2.5-Zimmer-Wohnung' },
  { value: '3', label: '3', tooltip: '3-Zimmer-Wohnung' },
  { value: '3.5', label: '3.5', tooltip: '3.5-Zimmer-Wohnung' },
  { value: '4', label: '4', tooltip: '4-Zimmer-Wohnung' },
  { value: '4.5', label: '4.5', tooltip: '4.5-Zimmer-Wohnung' },
  { value: '5', label: '5', tooltip: '5-Zimmer-Wohnung' },
  { value: '5.5', label: '5.5', tooltip: '5.5-Zimmer-Wohnung' },
  { value: '6+', label: '6+', tooltip: '6 oder mehr Zimmer / Haus' },
];

const FLOOR_OPTIONS = [
  { value: 'eg', label: 'EG', tooltip: 'Erdgeschoss / Parterre' },
  { value: '1', label: '1. OG', tooltip: '1. Obergeschoss' },
  { value: '2', label: '2. OG', tooltip: '2. Obergeschoss' },
  { value: '3', label: '3. OG', tooltip: '3. Obergeschoss' },
  { value: '4', label: '4. OG', tooltip: '4. Obergeschoss' },
  { value: '5+', label: '5+', tooltip: '5. Stock oder höher' },
];

const SERVICE_LEVELS = [
  {
    id: 'basic',
    name: 'Basis',
    description: 'Transport + 2 Träger',
    price: 800,
    features: ['Transport', '2 Träger', 'Basisversicherung'],
    icon: Truck,
  },
  {
    id: 'standard',
    name: 'Standard',
    description: 'Transport + 3 Träger + Demontage',
    price: 1200,
    features: ['Transport', '3 Träger', 'Möbeldemontage', 'Standardversicherung'],
    icon: Package,
    recommended: true,
  },
  {
    id: 'comfort',
    name: 'Komfort',
    description: 'Alles inklusive + Verpackung',
    price: 1800,
    features: ['Transport', '4 Träger', 'Demontage & Montage', 'Verpackung', 'Vollversicherung'],
    icon: Sofa,
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Rundum-Sorglos-Paket',
    price: 2500,
    features: ['Alles von Komfort', 'Ein-/Auspacken', 'Endreinigung', 'Persönlicher Koordinator'],
    icon: Award,
  },
];

const EXTRAS = [
  { id: 'packing', label: 'Ein- & Auspacken', price: 350, icon: Package, description: 'Wir packen alles für Sie' },
  { id: 'cleaning', label: 'Endreinigung', price: 280, icon: Sparkles, description: 'Professionelle Reinigung' },
  { id: 'disposal', label: 'Entsorgung', price: 150, icon: Trash2, description: 'Alte Möbel entsorgen' },
  { id: 'storage', label: 'Zwischenlagerung', price: 200, icon: Home, description: 'Bis zu 4 Wochen' },
  { id: 'assembly', label: 'Möbelmontage', price: 180, icon: Wrench, description: 'Auf-/Abbau aller Möbel' },
  { id: 'admin', label: 'Admin-Paket', price: 120, icon: Shield, description: 'Ummeldungen & Behördengänge' },
];

const COMPANIES: Company[] = [
  { id: '1', name: 'SwissMove Pro', rating: 4.9, reviewCount: 234, location: 'Zürich', priceFrom: 1650, tags: ['Express', 'Möbelmontage'], responseTime: '< 2h', isSponsored: true },
  { id: '2', name: 'Umzug Müller AG', rating: 4.8, reviewCount: 189, location: 'Bern', priceFrom: 1380, tags: ['Günstig', 'Erfahren'], responseTime: '< 4h' },
  { id: '3', name: 'ZügelExpress', rating: 4.7, reviewCount: 156, location: 'Basel', priceFrom: 1520, tags: ['Express', 'Wochenende'], responseTime: '< 1h' },
  { id: '4', name: 'Helvetia Umzüge', rating: 4.6, reviewCount: 98, location: 'Luzern', priceFrom: 1290, tags: ['Familienbetrieb'], responseTime: '< 6h' },
  { id: '5', name: 'TopMove GmbH', rating: 4.5, reviewCount: 67, location: 'Winterthur', priceFrom: 1450, tags: ['Versichert', 'Möbelmontage'], responseTime: '< 3h' },
];

const SWISS_CITIES: Record<string, string> = {
  '8000': 'Zürich', '8001': 'Zürich', '8004': 'Zürich', '8005': 'Zürich',
  '3000': 'Bern', '3001': 'Bern', '3004': 'Bern',
  '4000': 'Basel', '4001': 'Basel', '4051': 'Basel',
  '1000': 'Lausanne', '1003': 'Lausanne',
  '1200': 'Genève', '1201': 'Genève',
  '6000': 'Luzern', '6003': 'Luzern',
  '9000': 'St. Gallen',
  '5000': 'Aarau',
  '6300': 'Zug',
  '8400': 'Winterthur',
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ProgressHeader({ currentStep, steps }: { currentStep: number; steps: typeof STEPS }) {
  const pct = Math.round((currentStep / steps.length) * 100);
  
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
      <div className="mx-auto max-w-2xl px-4 py-3">
        {/* Step labels */}
        <div className="hidden sm:flex items-center justify-between mb-3">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const Icon = step.icon;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  'flex items-center gap-1.5 text-xs font-medium transition-colors',
                  isActive && 'text-primary',
                  isCompleted && 'text-muted-foreground',
                  !isActive && !isCompleted && 'text-muted-foreground/50'
                )}>
                  <div className={cn(
                    'w-6 h-6 rounded-full flex items-center justify-center text-xs',
                    isActive && 'bg-primary text-primary-foreground',
                    isCompleted && 'bg-primary/20 text-primary',
                    !isActive && !isCompleted && 'bg-muted text-muted-foreground'
                  )}>
                    {isCompleted ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.id}
                  </div>
                  <span className="hidden md:inline">{step.label}</span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={cn(
                    'w-8 lg:w-12 h-0.5 mx-2',
                    isCompleted ? 'bg-primary' : 'bg-border'
                  )} />
                )}
              </div>
            );
          })}
        </div>
        
        {/* Mobile: Simple progress */}
        <div className="sm:hidden flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{steps[currentStep - 1].label}</span>
          <span className="text-xs text-muted-foreground">Schritt {currentStep}/{steps.length}</span>
        </div>
        
        <Progress value={pct} className="h-1.5" />
      </div>
    </div>
  );
}

function TrustBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-3 px-4 bg-muted/30 border-b border-border text-xs">
      <div className="flex items-center gap-1.5">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">100% Fixpreis</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 text-amber-500" />
        <span className="text-muted-foreground">4.8/5 (2'340 Bewertungen)</span>
      </div>
      <div className="flex items-center gap-1.5">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Geprüfte Schweizer Firmen</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Lock className="h-4 w-4 text-primary" />
        <span className="text-muted-foreground">Sichere Datenübertragung</span>
      </div>
    </div>
  );
}

function FieldWithTooltip({
  label,
  tooltip,
  children,
  error,
}: {
  label: string;
  tooltip?: string;
  children: React.ReactNode;
  error?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium">{label}</Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  tooltip,
  disabled,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
}) {
  const button = (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'h-10 px-3 rounded-lg border-2 text-sm font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-background text-foreground hover:border-primary/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      {children}
    </button>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}

function PriceDisplay({ basePrice, extras, savings }: { basePrice: number; extras: number; savings?: number }) {
  const total = basePrice + extras;
  
  return (
    <Card className="p-4 bg-primary/5 border-primary/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">Ihr Fixpreis</span>
        {savings && savings > 0 && (
          <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
            CHF {savings} gespart
          </Badge>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">CHF {total.toLocaleString()}</span>
      </div>
      {extras > 0 && (
        <p className="text-xs text-muted-foreground mt-1">
          Basis CHF {basePrice.toLocaleString()} + Extras CHF {extras.toLocaleString()}
        </p>
      )}
    </Card>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function Step1Addresses({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  // Auto-fill city
  useEffect(() => {
    if (data.fromZip.length >= 4) {
      const city = SWISS_CITIES[data.fromZip];
      if (city) onChange({ fromCity: city });
    }
  }, [data.fromZip]);

  useEffect(() => {
    if (data.toZip.length >= 4) {
      const city = SWISS_CITIES[data.toZip];
      if (city) onChange({ toCity: city });
    }
  }, [data.toZip]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Wohin geht Ihr Umzug?</h2>
        <p className="text-sm text-muted-foreground">
          Geben Sie Start und Ziel an – Sie erhalten sofort eine Preisschätzung.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FieldWithTooltip 
          label="Von (PLZ)" 
          tooltip="Schweizer Postleitzahl Ihres aktuellen Wohnorts"
          error={errors.fromZip}
        >
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={data.fromZip}
              onChange={(e) => onChange({ fromZip: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="8000"
              inputMode="numeric"
              className={cn('h-12 pl-10 text-base', errors.fromZip && 'border-destructive')}
            />
          </div>
          {data.fromCity && <p className="text-xs text-muted-foreground">{data.fromCity}</p>}
        </FieldWithTooltip>

        <FieldWithTooltip 
          label="Nach (PLZ)" 
          tooltip="Schweizer Postleitzahl Ihres neuen Wohnorts"
          error={errors.toZip}
        >
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={data.toZip}
              onChange={(e) => onChange({ toZip: e.target.value.replace(/\D/g, '').slice(0, 4) })}
              placeholder="3000"
              inputMode="numeric"
              className={cn('h-12 pl-10 text-base', errors.toZip && 'border-destructive')}
            />
          </div>
          {data.toCity && <p className="text-xs text-muted-foreground">{data.toCity}</p>}
        </FieldWithTooltip>
      </div>

      <FieldWithTooltip
        label="Wohnungsgrösse"
        tooltip="Anzahl Zimmer gemäss Schweizer Standard (inkl. Wohnzimmer, ohne Küche/Bad)"
        error={errors.rooms}
      >
        <div className="flex flex-wrap gap-2">
          {ROOM_OPTIONS.map((room) => (
            <OptionButton
              key={room.value}
              selected={data.rooms === room.value}
              onClick={() => onChange({ rooms: room.value })}
              tooltip={room.tooltip}
            >
              {room.label}
            </OptionButton>
          ))}
        </div>
      </FieldWithTooltip>

      {/* Inline testimonial */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
        <div className="shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1 mb-1">
            {[1,2,3,4,5].map(i => <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
          </div>
          <p className="text-sm text-muted-foreground italic">
            "Super einfach und schnell! Innerhalb von 2 Stunden hatte ich 3 Offerten."
          </p>
          <p className="text-xs text-muted-foreground mt-1">– Sarah M., Zürich</p>
        </div>
      </div>
    </div>
  );
}

function Step2Details({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Details zu Ihrer Wohnung</h2>
        <p className="text-sm text-muted-foreground">
          Diese Angaben helfen uns, den Aufwand genauer einzuschätzen.
        </p>
      </div>

      <FieldWithTooltip
        label="Stockwerk (Auszugsadresse)"
        tooltip="EG = Erdgeschoss/Parterre. OG = Obergeschoss. Wichtig für die Kalkulation des Trageaufwands."
        error={errors.floor}
      >
        <div className="flex flex-wrap gap-2">
          {FLOOR_OPTIONS.map((floor) => (
            <OptionButton
              key={floor.value}
              selected={data.floor === floor.value}
              onClick={() => onChange({ floor: floor.value })}
              tooltip={floor.tooltip}
            >
              {floor.label}
            </OptionButton>
          ))}
        </div>
      </FieldWithTooltip>

      <FieldWithTooltip
        label="Lift vorhanden?"
        tooltip="Ein Personenlift erleichtert den Transport erheblich und kann den Preis um bis zu 20% senken."
      >
        <div className="flex gap-2">
          <OptionButton
            selected={data.hasLift === true}
            onClick={() => onChange({ hasLift: true })}
          >
            Ja, Lift vorhanden
          </OptionButton>
          <OptionButton
            selected={data.hasLift === false}
            onClick={() => onChange({ hasLift: false })}
          >
            Nein, kein Lift
          </OptionButton>
          <OptionButton
            selected={data.hasLift === null}
            onClick={() => onChange({ hasLift: null })}
          >
            Weiss nicht
          </OptionButton>
        </div>
      </FieldWithTooltip>

      {/* Info box about video scan */}
      <Card className="p-4 border-dashed">
        <div className="flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-1">Video-Scan für exakten Preis (optional)</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Filmen Sie Ihre Wohnung in 60 Sekunden – unsere KI erkennt automatisch Ihr Inventar.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Video wird nur zur Berechnung genutzt und sofort gelöscht</span>
            </div>
            <Button variant="outline" size="sm" className="mt-3">
              Video-Scan starten
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Step3Services({
  data,
  onChange,
  basePrice,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  basePrice: number;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Wählen Sie Ihr Service-Level</h2>
        <p className="text-sm text-muted-foreground">
          Von Basis bis Premium – Sie entscheiden, wie viel wir übernehmen.
        </p>
      </div>

      <div className="grid gap-3">
        {SERVICE_LEVELS.map((level) => {
          const Icon = level.icon;
          const isSelected = data.serviceLevel === level.id;
          
          return (
            <button
              key={level.id}
              type="button"
              onClick={() => onChange({ serviceLevel: level.id as FormData['serviceLevel'] })}
              className={cn(
                'relative flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              {level.recommended && (
                <Badge className="absolute -top-2 left-4 bg-primary text-primary-foreground text-xs">
                  Empfohlen
                </Badge>
              )}
              
              <div className={cn(
                'shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
                isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
              )}>
                <Icon className="h-6 w-6" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{level.name}</h3>
                  <span className="font-semibold text-primary">ab CHF {level.price}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{level.description}</p>
                <div className="flex flex-wrap gap-1">
                  {level.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className={cn(
                'shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center',
                isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
              )}>
                {isSelected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
              </div>
            </button>
          );
        })}
      </div>

      <PriceDisplay 
        basePrice={basePrice} 
        extras={0}
        savings={450}
      />
    </div>
  );
}

function Step4ExtrasDate({
  data,
  onChange,
  basePrice,
  extrasTotal,
  errors,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  basePrice: number;
  extrasTotal: number;
  errors: Record<string, string>;
}) {
  const toggleExtra = (extraId: string) => {
    const current = data.extras;
    const updated = current.includes(extraId)
      ? current.filter((e) => e !== extraId)
      : [...current, extraId];
    onChange({ extras: updated });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Datum & Zusatzleistungen</h2>
        <p className="text-sm text-muted-foreground">
          Wählen Sie Ihren Wunschtermin und optionale Extras.
        </p>
      </div>

      {/* Date selection */}
      <FieldWithTooltip
        label="Wunschtermin"
        tooltip="Flexible Termine können bis zu 15% günstiger sein"
        error={errors.moveDate}
      >
        <div className="space-y-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={data.moveDate}
              onChange={(e) => onChange({ moveDate: e.target.value })}
              className={cn('h-12 pl-10 text-base', errors.moveDate && 'border-destructive')}
            />
          </div>
          
          <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
            <Checkbox
              checked={data.isFlexible}
              onCheckedChange={(checked) => onChange({ isFlexible: !!checked })}
            />
            <div className="flex-1">
              <span className="text-sm font-medium">±3 Tage flexibel</span>
              <p className="text-xs text-muted-foreground">
                Wir planen um Ihren Wunschtermin – oft 10-15% günstiger!
              </p>
            </div>
            {data.isFlexible && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                -15%
              </Badge>
            )}
          </label>
        </div>
      </FieldWithTooltip>

      {/* Extras - NONE pre-selected as per recommendation */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Zusatzleistungen (optional)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  Alle Extras sind optional. Wählen Sie nur, was Sie wirklich brauchen.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {EXTRAS.map((extra) => {
            const Icon = extra.icon;
            const isSelected = data.extras.includes(extra.id);
            
            return (
              <button
                key={extra.id}
                type="button"
                onClick={() => toggleExtra(extra.id)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                <div className={cn(
                  'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                  isSelected ? 'bg-primary/20' : 'bg-muted'
                )}>
                  <Icon className={cn('h-5 w-5', isSelected ? 'text-primary' : 'text-muted-foreground')} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{extra.label}</span>
                    <span className="text-xs font-medium text-primary">+CHF {extra.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{extra.description}</p>
                </div>
                <Checkbox checked={isSelected} className="shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      <PriceDisplay 
        basePrice={basePrice} 
        extras={extrasTotal}
        savings={data.isFlexible ? Math.round((basePrice + extrasTotal) * 0.15) : undefined}
      />
    </div>
  );
}

function Step5Companies({
  data,
  onChange,
  sortBy,
  onSortChange,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}) {
  const toggleCompany = (companyId: string) => {
    const current = data.selectedCompanies;
    if (current.includes(companyId)) {
      onChange({ selectedCompanies: current.filter((c) => c !== companyId) });
    } else if (current.length < 5) {
      onChange({ selectedCompanies: [...current, companyId] });
    }
  };

  const sortedCompanies = useMemo(() => {
    const sorted = [...COMPANIES];
    switch (sortBy) {
      case 'price':
        return sorted.sort((a, b) => a.priceFrom - b.priceFrom);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'reviews':
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return sorted;
    }
  }, [sortBy]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Passende Umzugsfirmen</h2>
        <p className="text-sm text-muted-foreground">
          Wählen Sie 1-5 Firmen, von denen Sie Offerten erhalten möchten.
        </p>
      </div>

      {/* Sort & Filter */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{data.selectedCompanies.length}/5 ausgewählt</span>
        </div>
        
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-[180px] h-9">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sortieren" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Empfohlen</SelectItem>
            <SelectItem value="price">Günstigste zuerst</SelectItem>
            <SelectItem value="rating">Beste Bewertung</SelectItem>
            <SelectItem value="reviews">Meiste Bewertungen</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company list */}
      <div className="space-y-3">
        {sortedCompanies.map((company) => {
          const isSelected = data.selectedCompanies.includes(company.id);
          
          return (
            <button
              key={company.id}
              type="button"
              onClick={() => toggleCompany(company.id)}
              disabled={!isSelected && data.selectedCompanies.length >= 5}
              className={cn(
                'relative w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50',
                !isSelected && data.selectedCompanies.length >= 5 && 'opacity-50 cursor-not-allowed'
              )}
            >
              {company.isSponsored && (
                <Badge variant="outline" className="absolute top-2 right-2 text-xs">
                  Gesponsert
                </Badge>
              )}
              
              <div className="shrink-0 w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <Truck className="h-6 w-6 text-muted-foreground" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{company.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{company.rating}</span>
                    <span className="text-xs text-muted-foreground">({company.reviewCount})</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  <span>{company.location}</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>Antwort {company.responseTime}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {company.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-sm font-semibold text-primary mt-2">
                  ab CHF {company.priceFrom.toLocaleString()}
                </p>
              </div>
              
              <Checkbox checked={isSelected} className="shrink-0 mt-1" />
            </button>
          );
        })}
      </div>

      {/* Trust info */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border">
        <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Warum diese Firmen?</p>
          <p>
            Alle Firmen sind von uns geprüft, versichert und haben nachweislich positive 
            Kundenbewertungen. Die Reihenfolge basiert auf Verfügbarkeit, Bewertungen und 
            Erfahrung mit ähnlichen Umzügen.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step6Contact({
  data,
  onChange,
  errors,
  basePrice,
  extrasTotal,
  onBack,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
  basePrice: number;
  extrasTotal: number;
  onBack: () => void;
}) {
  const summary = useMemo(() => {
    const items = [];
    if (data.fromCity && data.toCity) {
      items.push({ label: 'Route', value: `${data.fromCity} → ${data.toCity}` });
    }
    if (data.rooms) {
      items.push({ label: 'Grösse', value: `${data.rooms} Zimmer` });
    }
    if (data.moveDate) {
      const date = new Date(data.moveDate);
      items.push({ label: 'Datum', value: date.toLocaleDateString('de-CH') });
    }
    const level = SERVICE_LEVELS.find(l => l.id === data.serviceLevel);
    if (level) {
      items.push({ label: 'Service', value: level.name });
    }
    if (data.extras.length > 0) {
      items.push({ label: 'Extras', value: `${data.extras.length} Zusatzleistungen` });
    }
    items.push({ label: 'Firmen', value: `${data.selectedCompanies.length} ausgewählt` });
    return items;
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Fast geschafft!</h2>
        <p className="text-sm text-muted-foreground">
          Geben Sie Ihre Kontaktdaten ein, um unverbindliche Offerten zu erhalten.
        </p>
      </div>

      {/* Summary card */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center justify-between mb-3">
          <span className="font-semibold">Ihre Anfrage</span>
          <Button variant="ghost" size="sm" onClick={onBack} className="h-8 text-primary">
            Bearbeiten
          </Button>
        </div>
        <div className="space-y-2 text-sm">
          {summary.map((item) => (
            <div key={item.label} className="flex justify-between">
              <span className="text-muted-foreground">{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t flex justify-between items-center">
          <span className="text-muted-foreground">Geschätzter Fixpreis</span>
          <span className="text-xl font-bold text-primary">
            CHF {(basePrice + extrasTotal).toLocaleString()}
          </span>
        </div>
      </Card>

      {/* Contact form */}
      <div className="space-y-4">
        <FieldWithTooltip label="Name" error={errors.name}>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Max Muster"
              autoComplete="name"
              className={cn('h-12 pl-10 text-base', errors.name && 'border-destructive')}
            />
          </div>
        </FieldWithTooltip>

        <FieldWithTooltip label="E-Mail" error={errors.email}>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              value={data.email}
              onChange={(e) => onChange({ email: e.target.value })}
              placeholder="max@beispiel.ch"
              autoComplete="email"
              inputMode="email"
              className={cn('h-12 pl-10 text-base', errors.email && 'border-destructive')}
            />
          </div>
        </FieldWithTooltip>

        <FieldWithTooltip label="Telefon" error={errors.phone}>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value.replace(/[^\d+\s]/g, '') })}
              placeholder="+41 79 123 45 67"
              autoComplete="tel"
              inputMode="tel"
              className={cn('h-12 pl-10 text-base', errors.phone && 'border-destructive')}
            />
          </div>
        </FieldWithTooltip>
      </div>

      {/* Consent & trust */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Mit Klick auf "Offerten erhalten" erlauben Sie uns, Ihre Anfrage an die ausgewählten 
          Umzugsfirmen zur Offertstellung weiterzugeben. <strong className="text-foreground">
          Kein Abo, keine Verpflichtung, kostenlos.</strong>
        </p>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Lock className="h-4 w-4 text-primary" />
          <span>Ihre Daten werden SSL-verschlüsselt übertragen und nicht an Dritte verkauft.</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const V9cFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [sortBy, setSortBy] = useState('recommended');
  const [formData, setFormData] = useState<FormData>({
    fromZip: '',
    fromCity: '',
    toZip: '',
    toCity: '',
    rooms: '',
    floor: '',
    hasLift: null,
    moveDate: '',
    isFlexible: false,
    serviceLevel: 'standard',
    extras: [], // NO pre-selection as per recommendation #5
    selectedCompanies: [],
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    const keys = Object.keys(updates);
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });
  };

  const basePrice = useMemo(() => {
    const level = SERVICE_LEVELS.find((l) => l.id === formData.serviceLevel);
    return level?.price || 1200;
  }, [formData.serviceLevel]);

  const extrasTotal = useMemo(() => {
    return formData.extras.reduce((sum, extraId) => {
      const extra = EXTRAS.find((e) => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
  }, [formData.extras]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fromZip || formData.fromZip.length < 4) {
        newErrors.fromZip = 'Bitte gültige PLZ eingeben';
      }
      if (!formData.toZip || formData.toZip.length < 4) {
        newErrors.toZip = 'Bitte gültige PLZ eingeben';
      }
      if (!formData.rooms) {
        newErrors.rooms = 'Bitte Wohnungsgrösse wählen';
      }
    }

    if (step === 4) {
      if (!formData.moveDate) {
        newErrors.moveDate = 'Bitte Datum wählen';
      }
    }

    if (step === 5) {
      if (formData.selectedCompanies.length === 0) {
        newErrors.companies = 'Bitte mindestens 1 Firma wählen';
      }
    }

    if (step === 6) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Bitte Namen eingeben';
      }
      if (!formData.email || !formData.email.includes('@')) {
        newErrors.email = 'Bitte gültige E-Mail eingeben';
      }
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 8) {
        newErrors.phone = 'Bitte Telefonnummer eingeben';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canContinue = useMemo(() => {
    switch (currentStep) {
      case 1:
        return formData.fromZip.length >= 4 && formData.toZip.length >= 4 && formData.rooms;
      case 2:
        return true; // Details are optional
      case 3:
        return true; // Service level has default
      case 4:
        return !!formData.moveDate;
      case 5:
        return formData.selectedCompanies.length > 0;
      case 6:
        return (
          formData.name.trim().length >= 2 &&
          formData.email.includes('@') &&
          formData.phone.replace(/\D/g, '').length >= 8
        );
      default:
        return false;
    }
  }, [currentStep, formData]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(6)) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-md"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold">Anfrage gesendet!</h1>
          <p className="text-muted-foreground">
            Sie erhalten in Kürze unverbindliche Offerten von {formData.selectedCompanies.length} ausgewählten 
            Umzugsfirmen per E-Mail an {formData.email}.
          </p>
          <div className="pt-4 space-y-2">
            <Badge variant="secondary">Durchschnittlich 3 Offerten in 24h</Badge>
            <p className="text-xs text-muted-foreground">
              Tipp: Laden Sie unsere Umzugs-Checkliste herunter!
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Map step 5 & 6 to the 5-step visual progress (companies + contact merged visually)
  const visualStep = currentStep <= 5 ? currentStep : 5;

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background pb-32">
        {/* Progress with labels */}
        <ProgressHeader currentStep={visualStep} steps={STEPS} />
        
        {/* Trust badges */}
        <TrustBadges />

        {/* Back button */}
        {currentStep > 1 && (
          <div className="mx-auto max-w-2xl px-4 pt-4">
            <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Zurück
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="mx-auto max-w-2xl px-4 py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentStep === 1 && (
                <Step1Addresses data={formData} onChange={updateFormData} errors={errors} />
              )}
              {currentStep === 2 && (
                <Step2Details data={formData} onChange={updateFormData} errors={errors} />
              )}
              {currentStep === 3 && (
                <Step3Services data={formData} onChange={updateFormData} basePrice={basePrice} />
              )}
              {currentStep === 4 && (
                <Step4ExtrasDate
                  data={formData}
                  onChange={updateFormData}
                  basePrice={basePrice}
                  extrasTotal={extrasTotal}
                  errors={errors}
                />
              )}
              {currentStep === 5 && (
                <Step5Companies
                  data={formData}
                  onChange={updateFormData}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                />
              )}
              {currentStep === 6 && (
                <Step6Contact
                  data={formData}
                  onChange={updateFormData}
                  errors={errors}
                  basePrice={basePrice}
                  extrasTotal={extrasTotal}
                  onBack={() => setCurrentStep(1)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sticky CTA */}
        <StickyFooterCTA
          primaryLabel={
            currentStep === 6
              ? isSubmitting
                ? 'Wird gesendet...'
                : 'Offerten erhalten'
              : currentStep === 5
              ? 'Weiter zu Kontakt'
              : 'Weiter'
          }
          onPrimary={currentStep === 6 ? handleSubmit : handleNext}
          disabled={!canContinue || isSubmitting}
          hint={
            currentStep === 6
              ? 'Kostenlos • Unverbindlich • Geprüfte Partner'
              : undefined
          }
        />
      </div>
    </TooltipProvider>
  );
};

export default V9cFeedbackBased;
