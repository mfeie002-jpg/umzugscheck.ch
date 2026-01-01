/**
 * Ultimate Swiss Flow V7
 * 
 * Der ultimative Umzugs-Flow für den Schweizer Markt mit:
 * - 5 optimierte Steps
 * - Dynamischer Progress Indicator
 * - Sticky Footer mit CTA & Trust
 * - Visuelle Icon-Auswahlkarten
 * - Dual-Path Inventar
 * - Trust Badges am CTA
 * 
 * Flow-Code: ultimate-v7
 * Ziel-Score: 95/100
 */

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Home, 
  Building2, 
  Truck, 
  Package, 
  Sparkles, 
  Paintbrush, 
  Wrench, 
  Shield, 
  Star, 
  CheckCircle2, 
  User, 
  Mail, 
  Phone, 
  Loader2,
  ChevronUp,
  ChevronDown,
  Box,
  Sofa,
  Bed,
  Tv,
  Utensils,
  Shirt,
  BookOpen,
  Bike,
  Car,
  Dumbbell,
  Baby,
  TreePine,
  Zap,
  Clock,
  Lock,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ============= TYPES =============
interface FormData {
  // Step 1: Logistik & Datum
  fromAddress: string;
  fromPostal: string;
  fromCity: string;
  toAddress: string;
  toPostal: string;
  toCity: string;
  moveDate: string;
  
  // Step 2: Wohnungsdetails
  propertyType: 'wohnung' | 'haus' | 'buero' | '';
  rooms: number;
  floor: number;
  hasElevator: boolean | null;
  
  // Step 3: Inventar
  inventoryMode: 'quick' | 'detailed' | '';
  estimatedVolume: number;
  inventoryItems: Record<string, number>;
  
  // Step 4: Zusatzleistungen
  services: string[];
  
  // Step 5: Kontakt
  name: string;
  email: string;
  phone: string;
  agreeTerms: boolean;
}

const INITIAL_FORM_DATA: FormData = {
  fromAddress: '',
  fromPostal: '',
  fromCity: '',
  toAddress: '',
  toPostal: '',
  toCity: '',
  moveDate: '',
  propertyType: '',
  rooms: 0,
  floor: 0,
  hasElevator: null,
  inventoryMode: '',
  estimatedVolume: 0,
  inventoryItems: {},
  services: [],
  name: '',
  email: '',
  phone: '',
  agreeTerms: false,
};

const STEPS = [
  { id: 1, label: 'Logistik', shortLabel: 'Von/Nach' },
  { id: 2, label: 'Details', shortLabel: 'Wohnung' },
  { id: 3, label: 'Inventar', shortLabel: 'Möbel' },
  { id: 4, label: 'Services', shortLabel: 'Extras' },
  { id: 5, label: 'Kontakt', shortLabel: 'Fertig' },
];

// ============= ICON CARD COMPONENT =============
interface IconCardProps {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const IconCard = ({ icon, label, sublabel, selected, onClick, className }: IconCardProps) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
      "min-h-[100px] min-w-[100px] touch-manipulation",
      "hover:border-primary/50 hover:bg-primary/5",
      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
      selected 
        ? "border-primary bg-primary/10 shadow-md" 
        : "border-border bg-card",
      className
    )}
  >
    {selected && (
      <div className="absolute top-2 right-2">
        <CheckCircle2 className="h-5 w-5 text-primary" />
      </div>
    )}
    <div className={cn(
      "mb-2 p-2 rounded-full",
      selected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
    )}>
      {icon}
    </div>
    <span className={cn(
      "text-sm font-medium text-center",
      selected ? "text-primary" : "text-foreground"
    )}>
      {label}
    </span>
    {sublabel && (
      <span className="text-xs text-muted-foreground mt-0.5">{sublabel}</span>
    )}
  </button>
);

// ============= TRUST BADGE COMPONENT =============
const TrustBadgeInline = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
    <Icon className="h-3.5 w-3.5 text-primary" />
    <span>{text}</span>
  </div>
);

// ============= PROGRESS INDICATOR =============
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: { label: string; shortLabel: string }[];
}

const ProgressIndicator = ({ currentStep, totalSteps, labels }: ProgressIndicatorProps) => {
  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
  
  return (
    <div className="w-full">
      {/* Mobile: Simple progress */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            Schritt {currentStep} von {totalSteps}
          </span>
          <Badge variant="secondary" className="text-xs">
            {labels[currentStep - 1]?.shortLabel}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Desktop: Step indicators */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-3">
          {labels.map((step, index) => {
            const stepNum = index + 1;
            const isCompleted = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;
            
            return (
              <div 
                key={step.label} 
                className={cn(
                  "flex items-center gap-2",
                  stepNum !== labels.length && "flex-1"
                )}
              >
                <div className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all",
                  isCompleted && "bg-primary text-primary-foreground",
                  isCurrent && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                  !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                )}>
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : stepNum}
                </div>
                <span className={cn(
                  "text-sm font-medium hidden lg:block",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {step.label}
                </span>
                {stepNum !== labels.length && (
                  <div className={cn(
                    "flex-1 h-1 mx-2 rounded-full",
                    isCompleted ? "bg-primary" : "bg-muted"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============= STEP COMPONENTS =============

// Step 1: Logistik & Datum
const Step1Logistics = ({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Wohin geht Ihr Umzug?
        </h2>
        <p className="text-muted-foreground">
          Geben Sie Start- und Zieladresse ein
        </p>
      </div>
      
      {/* Von */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">Von</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Input
              placeholder="Strasse & Hausnummer"
              value={formData.fromAddress}
              onChange={(e) => updateFormData({ fromAddress: e.target.value })}
              className="h-12 text-base"
            />
          </div>
          <Input
            placeholder="PLZ"
            value={formData.fromPostal}
            onChange={(e) => updateFormData({ fromPostal: e.target.value })}
            className="h-12 text-base"
            maxLength={4}
          />
          <Input
            placeholder="Ort"
            value={formData.fromCity}
            onChange={(e) => updateFormData({ fromCity: e.target.value })}
            className="h-12 text-base"
          />
        </div>
      </div>
      
      {/* Nach */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <MapPin className="h-5 w-5" />
          <span className="font-semibold">Nach</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Input
              placeholder="Strasse & Hausnummer"
              value={formData.toAddress}
              onChange={(e) => updateFormData({ toAddress: e.target.value })}
              className="h-12 text-base"
            />
          </div>
          <Input
            placeholder="PLZ"
            value={formData.toPostal}
            onChange={(e) => updateFormData({ toPostal: e.target.value })}
            className="h-12 text-base"
            maxLength={4}
          />
          <Input
            placeholder="Ort"
            value={formData.toCity}
            onChange={(e) => updateFormData({ toCity: e.target.value })}
            className="h-12 text-base"
          />
        </div>
      </div>
      
      {/* Datum */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-primary">
          <Calendar className="h-5 w-5" />
          <span className="font-semibold">Umzugsdatum</span>
        </div>
        <Input
          type="date"
          value={formData.moveDate}
          onChange={(e) => updateFormData({ moveDate: e.target.value })}
          className="h-12 text-base"
          min={new Date().toISOString().split('T')[0]}
        />
      </div>
    </div>
  );
};

// Step 2: Wohnungsdetails
const Step2Details = ({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) => {
  const propertyTypes = [
    { value: 'wohnung', label: 'Wohnung', icon: <Home className="h-6 w-6" /> },
    { value: 'haus', label: 'Haus', icon: <Building2 className="h-6 w-6" /> },
    { value: 'buero', label: 'Büro', icon: <Building2 className="h-6 w-6" /> },
  ];
  
  const roomOptions = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6];
  const floorOptions = [
    { value: 0, label: 'EG' },
    { value: 1, label: '1. OG' },
    { value: 2, label: '2. OG' },
    { value: 3, label: '3. OG' },
    { value: 4, label: '4. OG' },
    { value: 5, label: '5.+ OG' },
  ];
  
  return (
    <div className="space-y-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Wohnungsdetails
        </h2>
        <p className="text-muted-foreground">
          Je genauer die Angaben, desto präziser die Offerten
        </p>
      </div>
      
      {/* Property Type */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Art der Immobilie</Label>
        <div className="grid grid-cols-3 gap-3">
          {propertyTypes.map((type) => (
            <IconCard
              key={type.value}
              icon={type.icon}
              label={type.label}
              selected={formData.propertyType === type.value}
              onClick={() => updateFormData({ propertyType: type.value as FormData['propertyType'] })}
            />
          ))}
        </div>
      </div>
      
      {/* Rooms */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Anzahl Zimmer</Label>
        <div className="flex flex-wrap gap-2">
          {roomOptions.map((room) => (
            <button
              key={room}
              type="button"
              onClick={() => updateFormData({ rooms: room })}
              className={cn(
                "min-w-[56px] h-12 px-4 rounded-lg border-2 font-medium transition-all touch-manipulation",
                formData.rooms === room
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {room}
            </button>
          ))}
        </div>
      </div>
      
      {/* Floor */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Stockwerk</Label>
        <div className="flex flex-wrap gap-2">
          {floorOptions.map((floor) => (
            <button
              key={floor.value}
              type="button"
              onClick={() => updateFormData({ floor: floor.value })}
              className={cn(
                "min-w-[64px] h-12 px-4 rounded-lg border-2 font-medium transition-all touch-manipulation",
                formData.floor === floor.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              {floor.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Elevator */}
      {formData.floor > 0 && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">Lift vorhanden?</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => updateFormData({ hasElevator: true })}
              className={cn(
                "h-14 rounded-lg border-2 font-medium transition-all touch-manipulation flex items-center justify-center gap-2",
                formData.hasElevator === true
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <CheckCircle2 className="h-5 w-5" />
              Ja
            </button>
            <button
              type="button"
              onClick={() => updateFormData({ hasElevator: false })}
              className={cn(
                "h-14 rounded-lg border-2 font-medium transition-all touch-manipulation",
                formData.hasElevator === false
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              Nein
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 3: Inventar
const Step3Inventory = ({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Calculate estimated volume based on rooms
  const calculateQuickVolume = useCallback((rooms: number) => {
    // Average: 10-15 m³ per room
    return Math.round(rooms * 12);
  }, []);
  
  const inventoryCategories = [
    { id: 'sofas', label: 'Sofas/Sessel', icon: Sofa, defaultCount: 2 },
    { id: 'beds', label: 'Betten', icon: Bed, defaultCount: 2 },
    { id: 'tables', label: 'Tische', icon: Box, defaultCount: 3 },
    { id: 'wardrobes', label: 'Schränke', icon: Shirt, defaultCount: 4 },
    { id: 'electronics', label: 'Elektronik', icon: Tv, defaultCount: 5 },
    { id: 'kitchen', label: 'Küche', icon: Utensils, defaultCount: 20 },
    { id: 'boxes', label: 'Umzugskartons', icon: Package, defaultCount: 30 },
    { id: 'books', label: 'Bücher/Ordner', icon: BookOpen, defaultCount: 10 },
  ];
  
  const selectQuickMode = () => {
    const volume = calculateQuickVolume(formData.rooms || 3);
    updateFormData({ 
      inventoryMode: 'quick', 
      estimatedVolume: volume 
    });
  };
  
  const selectDetailedMode = () => {
    // Pre-fill with default counts
    const defaultItems: Record<string, number> = {};
    inventoryCategories.forEach(cat => {
      defaultItems[cat.id] = cat.defaultCount;
    });
    updateFormData({ 
      inventoryMode: 'detailed',
      inventoryItems: defaultItems
    });
    setShowDetails(true);
  };
  
  const updateItemCount = (id: string, delta: number) => {
    const current = formData.inventoryItems[id] || 0;
    const newCount = Math.max(0, current + delta);
    updateFormData({
      inventoryItems: {
        ...formData.inventoryItems,
        [id]: newCount
      }
    });
  };
  
  // Calculate total volume from detailed items
  const detailedVolume = useMemo(() => {
    const volumePerItem: Record<string, number> = {
      sofas: 2,
      beds: 1.5,
      tables: 0.5,
      wardrobes: 1.5,
      electronics: 0.3,
      kitchen: 0.1,
      boxes: 0.06,
      books: 0.05,
    };
    
    let total = 0;
    Object.entries(formData.inventoryItems).forEach(([key, count]) => {
      total += (volumePerItem[key] || 0.1) * count;
    });
    return Math.round(total);
  }, [formData.inventoryItems]);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Umzugsgut erfassen
        </h2>
        <p className="text-muted-foreground">
          Wählen Sie zwischen Schnell-Schätzung oder detaillierter Liste
        </p>
      </div>
      
      {/* Mode Selection */}
      {!formData.inventoryMode && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={selectQuickMode}
            className="p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all text-left touch-manipulation"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Schnell-Schätzung</h3>
                <p className="text-sm text-muted-foreground">~5 Sekunden</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Basierend auf Ihrer Zimmeranzahl ({formData.rooms || 3} Zimmer ≈ {calculateQuickVolume(formData.rooms || 3)} m³)
            </p>
          </button>
          
          <button
            type="button"
            onClick={selectDetailedMode}
            className="p-6 rounded-xl border-2 border-border bg-card hover:border-primary/50 transition-all text-left touch-manipulation"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-full bg-secondary/10">
                <Package className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Detaillierte Liste</h3>
                <p className="text-sm text-muted-foreground">~2 Minuten</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Für genauere Offerten mit Fixpreis-Garantie
            </p>
          </button>
        </div>
      )}
      
      {/* Quick Mode Result */}
      {formData.inventoryMode === 'quick' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl bg-primary/5 border border-primary/20"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg">Geschätztes Volumen</h3>
              <p className="text-sm text-muted-foreground">
                Basierend auf {formData.rooms || 3}-Zimmer-Wohnung
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                ~{formData.estimatedVolume} m³
              </div>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFormData({ inventoryMode: '' })}
            className="mt-2"
          >
            Andere Methode wählen
          </Button>
        </motion.div>
      )}
      
      {/* Detailed Mode */}
      {formData.inventoryMode === 'detailed' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Volume Summary */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between">
            <span className="font-medium">Geschätztes Volumen:</span>
            <span className="text-2xl font-bold text-primary">~{detailedVolume} m³</span>
          </div>
          
          {/* Items List */}
          <div className="space-y-3">
            {inventoryCategories.map((cat) => {
              const Icon = cat.icon;
              const count = formData.inventoryItems[cat.id] || 0;
              
              return (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{cat.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateItemCount(cat.id, -1)}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted touch-manipulation"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{count}</span>
                    <button
                      type="button"
                      onClick={() => updateItemCount(cat.id, 1)}
                      className="w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-muted touch-manipulation"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFormData({ inventoryMode: '', inventoryItems: {} })}
          >
            Andere Methode wählen
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// Step 4: Zusatzleistungen
const Step4Services = ({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) => {
  const services = [
    { 
      id: 'packing', 
      label: 'Einpackservice', 
      description: 'Profis packen Ihre Sachen sicher ein',
      icon: Package,
      price: 'ab CHF 250'
    },
    { 
      id: 'cleaning', 
      label: 'Endreinigung', 
      description: 'Mit Abnahmegarantie',
      icon: Sparkles,
      price: 'ab CHF 300'
    },
    { 
      id: 'assembly', 
      label: 'Möbelmontage', 
      description: 'Auf- und Abbau Ihrer Möbel',
      icon: Wrench,
      price: 'ab CHF 80/h'
    },
    { 
      id: 'storage', 
      label: 'Zwischenlagerung', 
      description: 'Sichere Lagerung bis zum Einzug',
      icon: Box,
      price: 'ab CHF 100/Monat'
    },
    { 
      id: 'piano', 
      label: 'Klaviertransport', 
      description: 'Spezial-Transport für Instrumente',
      icon: Truck,
      price: 'ab CHF 350'
    },
    { 
      id: 'disposal', 
      label: 'Entsorgung', 
      description: 'Umweltgerechte Entsorgung alter Möbel',
      icon: TreePine,
      price: 'ab CHF 150'
    },
  ];
  
  const toggleService = (serviceId: string) => {
    const current = formData.services || [];
    const updated = current.includes(serviceId)
      ? current.filter(s => s !== serviceId)
      : [...current, serviceId];
    updateFormData({ services: updated });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Zusatzleistungen
        </h2>
        <p className="text-muted-foreground">
          Alles aus einer Hand – optional hinzubuchbar
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = formData.services.includes(service.id);
          
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => toggleService(service.id)}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all touch-manipulation",
                "hover:border-primary/50",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-card"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg shrink-0",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold">{service.label}</h3>
                    {isSelected && <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {service.description}
                  </p>
                  <p className="text-sm font-medium text-primary mt-1">
                    {service.price}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {formData.services.length === 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Sie können auch ohne Zusatzleistungen fortfahren
        </p>
      )}
    </div>
  );
};

// Step 5: Kontakt
const Step5Contact = ({ 
  formData, 
  updateFormData 
}: { 
  formData: FormData; 
  updateFormData: (updates: Partial<FormData>) => void;
}) => {
  // Build summary
  const summary = useMemo(() => {
    const items = [];
    
    if (formData.fromCity && formData.toCity) {
      items.push(`${formData.fromCity} → ${formData.toCity}`);
    }
    if (formData.moveDate) {
      items.push(new Date(formData.moveDate).toLocaleDateString('de-CH'));
    }
    if (formData.propertyType) {
      const types: Record<string, string> = {
        wohnung: 'Wohnung',
        haus: 'Haus',
        buero: 'Büro'
      };
      items.push(`${formData.rooms}-Zi. ${types[formData.propertyType]}`);
    }
    if (formData.estimatedVolume > 0 || Object.keys(formData.inventoryItems).length > 0) {
      const vol = formData.inventoryMode === 'detailed' 
        ? Object.values(formData.inventoryItems).reduce((a, b) => a + b, 0) 
        : formData.estimatedVolume;
      items.push(`~${vol} m³`);
    }
    if (formData.services.length > 0) {
      items.push(`${formData.services.length} Zusatzleistung${formData.services.length > 1 ? 'en' : ''}`);
    }
    
    return items;
  }, [formData]);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Fast geschafft!
        </h2>
        <p className="text-muted-foreground">
          Nur noch Ihre Kontaktdaten für die Offerten
        </p>
      </div>
      
      {/* Summary */}
      {summary.length > 0 && (
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <h3 className="font-semibold mb-2 text-sm">Ihre Anfrage:</h3>
          <div className="flex flex-wrap gap-2">
            {summary.map((item, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Contact Form */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-base font-medium">
            Name *
          </Label>
          <div className="relative mt-1.5">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              placeholder="Vor- und Nachname"
              value={formData.name}
              onChange={(e) => updateFormData({ name: e.target.value })}
              className="h-12 pl-10 text-base"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email" className="text-base font-medium">
            E-Mail *
          </Label>
          <div className="relative mt-1.5">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="ihre@email.ch"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              className="h-12 pl-10 text-base"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="phone" className="text-base font-medium">
            Telefon *
          </Label>
          <div className="relative mt-1.5">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+41 79 123 45 67"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              className="h-12 pl-10 text-base"
            />
          </div>
        </div>
      </div>
      
      {/* Terms */}
      <div className="flex items-start gap-3">
        <Checkbox
          id="terms"
          checked={formData.agreeTerms}
          onCheckedChange={(checked) => updateFormData({ agreeTerms: checked === true })}
          className="mt-0.5"
        />
        <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
          Ich akzeptiere die{' '}
          <a href="/agb" className="text-primary underline">AGB</a> und{' '}
          <a href="/datenschutz" className="text-primary underline">Datenschutzbestimmungen</a>
        </Label>
      </div>
      
      {/* Trust Signals */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm">100% Sicher & Unverbindlich</span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            SSL-verschlüsselt
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Keine versteckten Kosten
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5" />
            ASTAG-geprüfte Partner
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5" />
            4.8/5 bei 2'500+ Bewertungen
          </div>
        </div>
      </div>
    </div>
  );
};

// ============= MAIN COMPONENT =============
export const UltimateV7Flow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);
  
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1:
        return formData.fromPostal && formData.fromCity && formData.toPostal && formData.toCity && formData.moveDate;
      case 2:
        return formData.propertyType && formData.rooms > 0;
      case 3:
        return formData.inventoryMode !== '';
      case 4:
        return true; // Services are optional
      case 5:
        return formData.name && formData.email && formData.phone && formData.agreeTerms;
      default:
        return false;
    }
  }, [currentStep, formData]);
  
  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, canProceed]);
  
  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);
  
  const handleSubmit = useCallback(async () => {
    if (!canProceed()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Anfrage erfolgreich gesendet!', {
        description: 'Sie erhalten in Kürze bis zu 5 unverbindliche Offerten per E-Mail.'
      });
      
      // Reset form
      setFormData(INITIAL_FORM_DATA);
      setCurrentStep(1);
    } catch (error) {
      toast.error('Fehler beim Senden', {
        description: 'Bitte versuchen Sie es erneut.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [canProceed]);
  
  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 overflow-x-hidden">
      {/* Header with Progress */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <ProgressIndicator 
            currentStep={currentStep} 
            totalSteps={STEPS.length}
            labels={STEPS}
          />
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 pb-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && (
              <Step1Logistics formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <Step2Details formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 3 && (
              <Step3Inventory formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 4 && (
              <Step4Services formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 5 && (
              <Step5Contact formData={formData} updateFormData={updateFormData} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Sticky Footer with CTA & Trust */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
          {/* Trust Badges Row */}
          <div className="flex items-center justify-center gap-4 mb-3 text-xs text-muted-foreground">
            <TrustBadgeInline icon={Shield} text="Versichert" />
            <TrustBadgeInline icon={Lock} text="SSL-geschützt" />
            <TrustBadgeInline icon={Star} text="4.8/5 Sterne" />
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="min-h-[56px] px-6"
                disabled={isSubmitting}
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Zurück
              </Button>
            )}
            
            <Button
              size="lg"
              onClick={currentStep === STEPS.length ? handleSubmit : handleNext}
              disabled={!canProceed() || isSubmitting}
              className={cn(
                "flex-1 min-h-[56px] text-base font-semibold",
                currentStep === STEPS.length 
                  ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                  : ""
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Wird gesendet...
                </>
              ) : currentStep === STEPS.length ? (
                <>
                  Jetzt Offerten erhalten
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          {/* Microcopy */}
          <p className="text-center text-xs text-muted-foreground mt-2">
            100% kostenlos & unverbindlich • Keine Registrierung nötig
          </p>
        </div>
      </div>
    </div>
  );
};

export default UltimateV7Flow;
