import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, 
  Calendar, 
  Home, 
  Shield, 
  CheckCircle2, 
  Users, 
  ChevronDown,
  ChevronUp,
  Star,
  Phone,
  Mail,
  User,
  Building,
  Truck,
  Package,
  Clock,
  ArrowLeft
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
  moveDate: string;
  rooms: string;
  floor: string;
  hasLift: boolean | null;
  services: string[];
  name: string;
  email: string;
  phone: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================
const STEPS = [
  { id: 1, title: 'Umzugsdetails', icon: MapPin },
  { id: 2, title: 'Services', icon: Package },
  { id: 3, title: 'Kontakt', icon: User },
];

const ROOM_OPTIONS = ['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5.5', '6+'];

const FLOOR_OPTIONS = ['EG', '1', '2', '3', '4', '5+'];

const SERVICE_OPTIONS = [
  { id: 'transport', label: 'Transport', icon: Truck, included: true },
  { id: 'packing', label: 'Ein-/Auspacken', icon: Package },
  { id: 'furniture', label: 'Möbelmontage', icon: Building },
  { id: 'cleaning', label: 'Endreinigung', icon: Star },
  { id: 'storage', label: 'Zwischenlagerung', icon: Home },
];

const SWISS_CITIES: Record<string, string> = {
  '8000': 'Zürich',
  '8001': 'Zürich',
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
  '3015': 'Bern',
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
  '1208': 'Genève',
  '1209': 'Genève',
  '6000': 'Luzern',
  '6003': 'Luzern',
  '6004': 'Luzern',
  '6005': 'Luzern',
  '6006': 'Luzern',
  '9000': 'St. Gallen',
  '9008': 'St. Gallen',
  '9010': 'St. Gallen',
  '9011': 'St. Gallen',
  '9012': 'St. Gallen',
  '5000': 'Aarau',
  '5001': 'Aarau',
  '5004': 'Aarau',
  '6300': 'Zug',
  '6301': 'Zug',
  '6302': 'Zug',
  '6330': 'Cham',
  '8400': 'Winterthur',
  '8401': 'Winterthur',
  '8402': 'Winterthur',
  '8404': 'Winterthur',
  '8405': 'Winterthur',
  '8406': 'Winterthur',
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ProgressHeader({ step, total, title }: { step: number; total: number; title: string }) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
      <div className="mx-auto max-w-md px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground">
              Schritt {step} von {total}
            </p>
          </div>
          <div className="text-right">
            <span className="text-sm font-semibold text-primary">{pct}%</span>
          </div>
        </div>
        <Progress value={pct} className="mt-2 h-1.5" />
      </div>
    </div>
  );
}

function TrustBar() {
  return (
    <div className="bg-muted/50 border-b border-border">
      <div className="mx-auto max-w-md px-4 py-2.5">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Unverbindlich</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Geprüfte Firmen</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">CH-Partner</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  inputMode,
  icon: Icon,
}: {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  autoComplete?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  icon?: React.ElementType;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          className={cn(
            'h-12 rounded-xl text-base',
            Icon && 'pl-10',
            error && 'border-destructive focus-visible:ring-destructive'
          )}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
  className,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'h-11 px-4 rounded-xl border-2 text-sm font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border bg-background text-foreground hover:border-primary/50',
        className
      )}
    >
      {children}
    </button>
  );
}

function ServiceCard({
  service,
  selected,
  onToggle,
}: {
  service: typeof SERVICE_OPTIONS[0];
  selected: boolean;
  onToggle: () => void;
}) {
  const Icon = service.icon;
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={service.included}
      className={cn(
        'relative flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all w-full',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        service.included
          ? 'border-primary/30 bg-primary/5 cursor-default'
          : selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-background hover:border-primary/50'
      )}
    >
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-lg',
          selected || service.included ? 'bg-primary/20' : 'bg-muted'
        )}
      >
        <Icon className={cn('h-5 w-5', selected || service.included ? 'text-primary' : 'text-muted-foreground')} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground">{service.label}</p>
        {service.included && (
          <p className="text-xs text-muted-foreground">Inklusive</p>
        )}
      </div>
      {!service.included && (
        <Checkbox checked={selected} className="h-5 w-5" />
      )}
      {service.included && (
        <Badge variant="secondary" className="text-xs">
          Inkl.
        </Badge>
      )}
    </button>
  );
}

function ReviewCard({
  items,
  onEdit,
}: {
  items: { label: string; value: string }[];
  onEdit: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-3">
        <p className="font-semibold text-foreground">Deine Angaben</p>
        <Button variant="ghost" size="sm" onClick={onEdit} className="text-primary h-8">
          Bearbeiten
        </Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.label}</span>
            <span className="font-medium text-foreground">{item.value}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

function Step1Details({
  data,
  onChange,
  errors,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
}) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Auto-fill city from PLZ
  React.useEffect(() => {
    if (data.fromZip.length >= 4) {
      const city = SWISS_CITIES[data.fromZip];
      if (city && data.fromCity !== city) {
        onChange({ fromCity: city });
      }
    }
  }, [data.fromZip]);

  React.useEffect(() => {
    if (data.toZip.length >= 4) {
      const city = SWISS_CITIES[data.toZip];
      if (city && data.toCity !== city) {
        onChange({ toCity: city });
      }
    }
  }, [data.toZip]);

  return (
    <div className="space-y-6 pb-32">
      {/* Main inputs */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="Von (PLZ)"
            name="fromZip"
            value={data.fromZip}
            onChange={(v) => onChange({ fromZip: v.replace(/\D/g, '').slice(0, 4) })}
            placeholder="8000"
            inputMode="numeric"
            autoComplete="postal-code"
            error={errors.fromZip}
            icon={MapPin}
          />
          <FormField
            label="Nach (PLZ)"
            name="toZip"
            value={data.toZip}
            onChange={(v) => onChange({ toZip: v.replace(/\D/g, '').slice(0, 4) })}
            placeholder="3000"
            inputMode="numeric"
            autoComplete="postal-code"
            error={errors.toZip}
            icon={MapPin}
          />
        </div>

        {/* City display */}
        {(data.fromCity || data.toCity) && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {data.fromCity && <span>{data.fromCity}</span>}
            {data.fromCity && data.toCity && <span>→</span>}
            {data.toCity && <span>{data.toCity}</span>}
          </div>
        )}

        <FormField
          label="Umzugsdatum"
          name="moveDate"
          type="date"
          value={data.moveDate}
          onChange={(v) => onChange({ moveDate: v })}
          error={errors.moveDate}
          icon={Calendar}
        />

        {/* Room selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Wohnungsgrösse (Zimmer)</Label>
          <div className="flex flex-wrap gap-2">
            {ROOM_OPTIONS.map((room) => (
              <OptionButton
                key={room}
                selected={data.rooms === room}
                onClick={() => onChange({ rooms: room })}
              >
                {room}
              </OptionButton>
            ))}
          </div>
          {errors.rooms && <p className="text-xs text-destructive">{errors.rooms}</p>}
        </div>
      </div>

      {/* Advanced options */}
      <div className="border rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <span className="font-medium">Mehr Details (optional)</span>
          {showAdvanced ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>
        
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 pt-0 space-y-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Optional – hilft für genauere Offerten.
                </p>

                {/* Floor selection */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Stockwerk (Von)</Label>
                  <div className="flex flex-wrap gap-2">
                    {FLOOR_OPTIONS.map((floor) => (
                      <OptionButton
                        key={floor}
                        selected={data.floor === floor}
                        onClick={() => onChange({ floor: floor })}
                      >
                        {floor}
                      </OptionButton>
                    ))}
                    <OptionButton
                      selected={data.floor === 'unknown'}
                      onClick={() => onChange({ floor: 'unknown' })}
                      className="text-muted-foreground"
                    >
                      Weiss nicht
                    </OptionButton>
                  </div>
                </div>

                {/* Lift */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Lift vorhanden?</Label>
                  <div className="flex gap-2">
                    <OptionButton
                      selected={data.hasLift === true}
                      onClick={() => onChange({ hasLift: true })}
                    >
                      Ja
                    </OptionButton>
                    <OptionButton
                      selected={data.hasLift === false}
                      onClick={() => onChange({ hasLift: false })}
                    >
                      Nein
                    </OptionButton>
                    <OptionButton
                      selected={data.hasLift === null}
                      onClick={() => onChange({ hasLift: null })}
                      className="text-muted-foreground"
                    >
                      Weiss nicht
                    </OptionButton>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Trust message */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Du erhältst mehrere unverbindliche Offerten von geprüften Schweizer Umzugsfirmen.
        </p>
      </div>
    </div>
  );
}

function Step2Services({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
}) {
  const toggleService = (serviceId: string) => {
    const current = data.services;
    const updated = current.includes(serviceId)
      ? current.filter((s) => s !== serviceId)
      : [...current, serviceId];
    onChange({ services: updated });
  };

  return (
    <div className="space-y-6 pb-32">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-foreground">Gewünschte Services</h2>
        <p className="text-sm text-muted-foreground">
          Transport ist immer inklusive. Wähle optionale Zusatzleistungen.
        </p>
      </div>

      <div className="space-y-3">
        {SERVICE_OPTIONS.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={data.services.includes(service.id)}
            onToggle={() => toggleService(service.id)}
          />
        ))}
      </div>

      {/* Quick summary */}
      <Card className="p-4 bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Ausgewählt</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Transport{data.services.length > 0 && ` + ${data.services.length} Extras`}
        </p>
      </Card>
    </div>
  );
}

function Step3Contact({
  data,
  onChange,
  errors,
  onBack,
}: {
  data: FormData;
  onChange: (updates: Partial<FormData>) => void;
  errors: Record<string, string>;
  onBack: () => void;
}) {
  // Build review items
  const reviewItems = useMemo(() => {
    const items: { label: string; value: string }[] = [];
    
    if (data.fromCity && data.toCity) {
      items.push({ label: 'Route', value: `${data.fromCity} → ${data.toCity}` });
    } else if (data.fromZip && data.toZip) {
      items.push({ label: 'Route', value: `${data.fromZip} → ${data.toZip}` });
    }
    
    if (data.moveDate) {
      const date = new Date(data.moveDate);
      items.push({ 
        label: 'Datum', 
        value: date.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    }
    
    if (data.rooms) {
      items.push({ label: 'Grösse', value: `${data.rooms} Zimmer` });
    }
    
    const serviceCount = data.services.length;
    items.push({ 
      label: 'Services', 
      value: `Transport${serviceCount > 0 ? ` + ${serviceCount} Extras` : ''}` 
    });
    
    return items;
  }, [data]);

  return (
    <div className="space-y-6 pb-32">
      {/* Review card */}
      <ReviewCard items={reviewItems} onEdit={onBack} />

      {/* Contact form */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Kontaktdaten</h2>
        
        <FormField
          label="Name"
          name="name"
          value={data.name}
          onChange={(v) => onChange({ name: v })}
          placeholder="Max Muster"
          autoComplete="name"
          error={errors.name}
          icon={User}
        />
        
        <FormField
          label="E-Mail"
          name="email"
          type="email"
          value={data.email}
          onChange={(v) => onChange({ email: v })}
          placeholder="max@beispiel.ch"
          autoComplete="email"
          inputMode="email"
          error={errors.email}
          icon={Mail}
        />
        
        <FormField
          label="Telefon"
          name="phone"
          type="tel"
          value={data.phone}
          onChange={(v) => onChange({ phone: v.replace(/[^\d+\s]/g, '') })}
          placeholder="+41 79 123 45 67"
          autoComplete="tel"
          inputMode="tel"
          error={errors.phone}
          icon={Phone}
        />
      </div>

      {/* Consent text */}
      <div className="p-4 rounded-xl bg-muted/50 border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Mit Klick auf "Offerten erhalten" erlaubst du uns, deine Anfrage an passende, 
          geprüfte Umzugsfirmen zur Offertstellung weiterzugeben. 
          <strong className="text-foreground"> Kein Abo, keine Verpflichtung.</strong>
        </p>
      </div>

      {/* Data protection */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Daten werden nur an ausgewählte CH-Partner weitergegeben (DSG/DSGVO)</span>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const MultiAFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fromZip: '',
    fromCity: '',
    toZip: '',
    toCity: '',
    moveDate: '',
    rooms: '',
    floor: '',
    hasLift: null,
    services: ['transport'],
    name: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors for updated fields
    const updatedKeys = Object.keys(updates);
    setErrors((prev) => {
      const next = { ...prev };
      updatedKeys.forEach((key) => delete next[key]);
      return next;
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.fromZip || formData.fromZip.length < 4) {
        newErrors.fromZip = 'PLZ eingeben';
      }
      if (!formData.toZip || formData.toZip.length < 4) {
        newErrors.toZip = 'PLZ eingeben';
      }
      if (!formData.moveDate) {
        newErrors.moveDate = 'Datum wählen';
      }
      if (!formData.rooms) {
        newErrors.rooms = 'Bitte wählen';
      }
    }

    if (step === 3) {
      if (!formData.name || formData.name.trim().length < 2) {
        newErrors.name = 'Name eingeben';
      }
      if (!formData.email || !formData.email.includes('@')) {
        newErrors.email = 'Gültige E-Mail eingeben';
      }
      if (!formData.phone || formData.phone.replace(/\D/g, '').length < 8) {
        newErrors.phone = 'Telefonnummer eingeben';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length) {
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
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const canContinue = useMemo(() => {
    if (currentStep === 1) {
      return (
        formData.fromZip.length >= 4 &&
        formData.toZip.length >= 4 &&
        formData.moveDate &&
        formData.rooms
      );
    }
    if (currentStep === 2) {
      return true; // Services are optional (transport is always included)
    }
    if (currentStep === 3) {
      return (
        formData.name.trim().length >= 2 &&
        formData.email.includes('@') &&
        formData.phone.replace(/\D/g, '').length >= 8
      );
    }
    return false;
  }, [currentStep, formData]);

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4 max-w-sm"
        >
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Anfrage gesendet!</h1>
          <p className="text-muted-foreground">
            Du erhältst in Kürze unverbindliche Offerten von geprüften Umzugsfirmen per E-Mail.
          </p>
          <div className="pt-4">
            <Badge variant="secondary" className="text-sm">
              Durchschnittlich 3 Offerten in 24h
            </Badge>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentStepData = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Header */}
      <ProgressHeader
        step={currentStep}
        total={STEPS.length}
        title={currentStepData.title}
      />

      {/* Trust Bar */}
      <TrustBar />

      {/* Back button */}
      {currentStep > 1 && (
        <div className="mx-auto max-w-md px-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Zurück
          </Button>
        </div>
      )}

      {/* Content */}
      <div className="mx-auto max-w-md px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && (
              <Step1Details
                data={formData}
                onChange={updateFormData}
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <Step2Services
                data={formData}
                onChange={updateFormData}
              />
            )}
            {currentStep === 3 && (
              <Step3Contact
                data={formData}
                onChange={updateFormData}
                errors={errors}
                onBack={handleBack}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Footer CTA */}
      <StickyFooterCTA
        primaryLabel={
          currentStep === STEPS.length
            ? isSubmitting
              ? 'Wird gesendet...'
              : 'Offerten erhalten'
            : 'Weiter'
        }
        onPrimary={currentStep === STEPS.length ? handleSubmit : handleNext}
        disabled={!canContinue || isSubmitting}
        hint={
          currentStep === STEPS.length
            ? 'Unverbindlich • Kostenlos • Geprüfte Partner'
            : undefined
        }
      />
    </div>
  );
};

export default MultiAFeedbackBased;
