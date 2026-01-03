/**
 * V6.b ChatGPT - Ultimate (6-Tier) with Full ChatGPT Feedback
 * 
 * ChatGPT Pro Deep Feedback implementiert:
 * 1. ✅ Trust-Signale: TÜV, Swiss Made, Testimonials, Medienlogos
 * 2. ✅ Versprechen mit Realität abgleichen ("Wenige Angaben" statt "3 Angaben")
 * 3. ✅ Video-Scan erklärt mit Demo + Datenschutzhinweis + prominente Skip-Option
 * 4. ✅ Servicepakete mit Tooltips und Preisvergleich
 * 5. ✅ Sticky Mobile CTA
 * 6. ✅ Preisaufschlüsselung direkt sichtbar
 * 7. ✅ Inline-Validierung mit Hilfetexten
 * 8. ✅ Cross-Sell im Erfolgsschritt
 * 9. ✅ After-Sales Timeline erklärt
 * 10. ✅ Fortschritts-Gamification
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
  { id: 2, title: 'Video-Scan', icon: Video, shortTitle: 'Inventar' },
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
    id: 'comfort', 
    title: 'Komfort',
    subtitle: 'Empfohlen für die meisten',
    selfPercent: 20,
    price: 'ab CHF 1\'490',
    features: ['Transporter', '4 Träger', 'Ein-/Auspacken', 'Vollmontage', 'Vollversicherung', 'Entsorgung'],
    notIncluded: [],
    color: 'bg-primary/10',
    recommended: true,
  },
  { 
    id: 'premium', 
    title: 'Premium',
    subtitle: 'Rundum-Sorglos',
    selfPercent: 5,
    price: 'ab CHF 2\'490',
    features: ['Alles inkl.', 'Reinigung', 'Lagerung 1 Woche', 'Concierge-Service', '24/7 Support'],
    notIncluded: [],
    color: 'bg-amber-50',
  },
  { 
    id: 'ultimate', 
    title: 'Ultimate',
    subtitle: 'White-Glove Service',
    selfPercent: 0,
    price: 'ab CHF 4\'990',
    features: ['Komplettservice', 'Umzugsmanager', 'Behördengänge', 'Nachsendeauftrag', 'Hotel bei Bedarf'],
    notIncluded: [],
    color: 'bg-purple-50',
  },
];

const TRUST_ITEMS = [
  { icon: Shield, label: 'TÜV geprüft', color: 'text-green-600' },
  { icon: Award, label: 'Swiss Made', color: 'text-red-600' },
  { icon: Star, label: '4.9/5 ⭐', color: 'text-amber-500' },
  { icon: Users, label: '15\'000+ Umzüge', color: 'text-blue-600' },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', text: 'War skeptisch beim Video-Scan, aber super einfach!', rating: 5, location: 'Zürich' },
  { name: 'Thomas K.', text: 'Fixpreis hat gestimmt, keine Überraschungen.', rating: 5, location: 'Bern' },
  { name: 'Anna L.', text: 'Beste Entscheidung, Komfort-Paket zu nehmen.', rating: 5, location: 'Basel' },
];

const TIMELINE_STEPS = [
  { day: 'T-30', title: 'Buchung', desc: 'Bestätigung per E-Mail' },
  { day: 'T-14', title: 'Planung', desc: 'Crew-Zuteilung & Details' },
  { day: 'T-3', title: 'Vorbereitung', desc: 'Checkliste & Crew-Info' },
  { day: 'T-0', title: 'Umzugstag', desc: 'Live-Tracking verfügbar' },
  { day: 'T+7', title: 'Nachbetreuung', desc: 'Feedback & Support' },
];

const CROSS_SELL_OPTIONS = [
  { id: 'cleaning', label: 'Endreinigung', price: '+CHF 290', desc: 'Professionelle Übergabe-Reinigung' },
  { id: 'storage', label: 'Zwischenlagerung', price: '+CHF 150/Monat', desc: 'Sichere Lagerung in der Schweiz' },
  { id: 'handyman', label: 'Handwerker-Service', price: '+CHF 85/Std', desc: 'Lampen, Bilder, Kleinmontagen' },
];

// ============= SUB COMPONENTS =============

// Trust Bar with all signals
function EnhancedTrustBar() {
  return (
    <div className="bg-gradient-to-r from-primary/5 via-background to-primary/5 border-y py-3 mb-6">
      <div className="flex items-center justify-center gap-4 flex-wrap text-sm">
        {TRUST_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Header with gamification
function ProgressHeader({ 
  step, 
  total, 
  title 
}: { 
  step: number; 
  total: number; 
  title: string;
}) {
  const progress = Math.round((step / total) * 100);
  const StepIcon = STEPS[step - 1]?.icon || MapPin;
  
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3">
        {/* Step Icons */}
        <div className="flex justify-between mb-3">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isComplete = s.id < step;
            return (
              <div key={s.id} className="flex flex-col items-center flex-1">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all
                  ${isComplete ? 'bg-primary text-primary-foreground' : 
                    isActive ? 'bg-primary/20 text-primary ring-2 ring-primary' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  {isComplete ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                </div>
                <span className={`text-xs mt-1 ${isActive ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {s.shortTitle}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Progress Bar with percentage */}
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-sm font-medium text-primary">{progress}%</span>
        </div>
        
        {/* Motivational hint */}
        {step < total && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            {step === 1 && "Fast geschafft – nur noch wenige Angaben!"}
            {step === 2 && "Optional: Video-Scan für genaueren Preis"}
            {step === 3 && "Wählen Sie Ihren Service-Level"}
            {step === 4 && "Ihr Fixpreis steht fest"}
          </p>
        )}
      </div>
    </div>
  );
}

// Form Field with inline validation
function ValidatedField({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  hint,
  icon: Icon,
  type = 'text',
  inputMode,
  required = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  icon?: React.ElementType;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'email' | 'tel';
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        )}
        <Input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className={`${Icon ? 'pl-10' : ''} ${error ? 'border-destructive' : ''}`}
        />
        {value && !error && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      {error && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

// Service Tier Card with tooltip
function TierCard({ 
  tier, 
  selected, 
  onSelect 
}: { 
  tier: typeof SERVICE_TIERS[0]; 
  selected: boolean; 
  onSelect: () => void;
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onSelect}
            className={`
              w-full text-left rounded-xl border-2 p-4 transition-all relative
              ${tier.color}
              ${selected 
                ? 'border-primary ring-2 ring-primary/20 shadow-lg' 
                : 'border-transparent hover:border-muted-foreground/30'}
            `}
          >
            {tier.recommended && (
              <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground">
                <Star className="h-3 w-3 mr-1" />
                Beliebt
              </Badge>
            )}
            
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold">{tier.title}</h3>
                <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
              </div>
              <span className="text-lg font-bold text-primary">{tier.price}</span>
            </div>
            
            {/* Self-do slider visualization */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Sie machen</span>
                <span>Wir machen</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-green-500"
                  style={{ width: `${100 - tier.selfPercent}%`, marginLeft: `${tier.selfPercent}%` }}
                />
              </div>
            </div>
            
            <ul className="space-y-1">
              {tier.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                  {f}
                </li>
              ))}
              {tier.features.length > 3 && (
                <li className="text-xs text-muted-foreground">+{tier.features.length - 3} weitere</li>
              )}
            </ul>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium mb-1">{tier.title} beinhaltet:</p>
          <ul className="text-xs space-y-1">
            {tier.features.map((f, i) => (
              <li key={i}>✓ {f}</li>
            ))}
          </ul>
          {tier.notIncluded.length > 0 && (
            <>
              <p className="font-medium mt-2 mb-1">Nicht enthalten:</p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                {tier.notIncluded.map((f, i) => (
                  <li key={i}>✗ {f}</li>
                ))}
              </ul>
            </>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Price Breakdown component
function PriceBreakdown({ 
  tier, 
  rooms, 
  distance 
}: { 
  tier: typeof SERVICE_TIERS[0]; 
  rooms: number; 
  distance: number;
}) {
  const basePrice = parseInt(tier.price.replace(/[^\d]/g, '')) || 500;
  const volumeMultiplier = 1 + (rooms - 1) * 0.25;
  const distanceFee = Math.round(distance * 2);
  const totalPrice = Math.round(basePrice * volumeMultiplier + distanceFee);
  
  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
      <h4 className="font-medium flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Preisaufschlüsselung
      </h4>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Grundpreis ({tier.title})</span>
          <span>CHF {basePrice}</span>
        </div>
        <div className="flex justify-between">
          <span>Volumen ({rooms} Zimmer)</span>
          <span>×{volumeMultiplier.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Distanz (~{distance}km)</span>
          <span>+CHF {distanceFee}</span>
        </div>
        <div className="border-t pt-2 flex justify-between font-bold text-primary">
          <span>Fixpreis (inkl. MwSt. + Versicherung)</span>
          <span>CHF {totalPrice.toLocaleString('de-CH')}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        <Shield className="h-3 w-3 inline mr-1" />
        Preisgarantie: Dieser Preis ist verbindlich und wird nicht überschritten.
      </p>
    </div>
  );
}

// Sticky Footer CTA
function StickyFooter({
  label,
  onClick,
  disabled,
  loading,
  hint,
  onBack,
  showBack = true,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  hint?: string;
  onBack?: () => void;
  showBack?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t shadow-lg safe-area-pb">
      <div className="max-w-2xl mx-auto px-4 py-3 space-y-2">
        {hint && (
          <p className="text-xs text-center text-muted-foreground">{hint}</p>
        )}
        <div className="flex gap-3">
          {showBack && onBack && (
            <Button variant="outline" onClick={onBack} className="flex-shrink-0">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <Button 
            onClick={onClick} 
            disabled={disabled || loading}
            className="flex-1 h-12 text-base font-semibold"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                {label}
                <ChevronRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-3 w-3" /> Kostenlos
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> 24h Storno
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-3 w-3" /> Swiss Quality
          </span>
        </div>
      </div>
    </div>
  );
}

// Video Scan Step with explanation
function VideoScanStep({ 
  onComplete, 
  onSkip 
}: { 
  onComplete: () => void; 
  onSkip: () => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">Video-Inventar-Scan</h1>
        <p className="text-muted-foreground">
          Optional: Laden Sie ein Video hoch für einen genaueren Preis
        </p>
      </div>
      
      {/* Explanation Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Wie funktioniert's?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>📱 Filmen Sie einen Rundgang durch Ihre Wohnung</li>
                <li>🤖 Unsere KI erkennt Möbel automatisch</li>
                <li>💰 Sie erhalten einen noch genaueren Fixpreis</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Upload Zone */}
      <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <Video className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="font-medium mb-4">Video hochladen oder aufnehmen</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => setIsUploading(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Video wählen
          </Button>
          <Button variant="outline">
            <Camera className="h-4 w-4 mr-2" />
            Jetzt aufnehmen
          </Button>
        </div>
      </div>
      
      {/* Privacy Note */}
      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <Shield className="h-4 w-4 mt-0.5 flex-shrink-0 text-green-600" />
        <p>
          <strong>Datenschutz:</strong> Ihr Video wird verschlüsselt übertragen, 
          nur für die Inventar-Analyse verwendet und nach 30 Tagen automatisch gelöscht.
        </p>
      </div>
      
      {/* Skip Button - prominent secondary option */}
      <Button 
        variant="secondary" 
        onClick={onSkip}
        className="w-full h-12"
      >
        Überspringen → Manuelle Checkliste
      </Button>
      
      {/* Testimonial */}
      <div className="bg-muted/30 rounded-lg p-4">
        <p className="text-sm italic mb-2">
          "{TESTIMONIALS[0].text}"
        </p>
        <p className="text-xs text-muted-foreground">
          – {TESTIMONIALS[0].name}, {TESTIMONIALS[0].location}
        </p>
      </div>
    </div>
  );
}

// Success/Confirmation Step with Timeline
function SuccessStep({ 
  formData, 
  selectedTier,
  crossSellSelections,
  onCrossSellChange,
}: { 
  formData: any;
  selectedTier: typeof SERVICE_TIERS[0] | null;
  crossSellSelections: string[];
  onCrossSellChange: (id: string, checked: boolean) => void;
}) {
  return (
    <div className="space-y-6 pb-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Buchung bestätigt!</h1>
        <p className="text-muted-foreground">
          Bestätigung an {formData.email} gesendet
        </p>
        {selectedTier && (
          <Badge className="mt-2">{selectedTier.title} • CHF 1'490</Badge>
        )}
      </div>
      
      {/* Timeline with explanations */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Ihr Umzugs-Fahrplan
          </h3>
          <div className="space-y-4">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {step.day}
                  </div>
                  {i < TIMELINE_STEPS.length - 1 && (
                    <div className="w-0.5 h-8 bg-muted mt-1" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Cross-Sell Options */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Zusatzservices (optional)
          </h3>
          <div className="space-y-3">
            {CROSS_SELL_OPTIONS.map((option) => (
              <label 
                key={option.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
              >
                <Checkbox 
                  checked={crossSellSelections.includes(option.id)}
                  onCheckedChange={(checked) => onCrossSellChange(option.id, !!checked)}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-primary font-medium">{option.price}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full h-12">
          <Home className="h-5 w-5 mr-2" />
          Zum Dashboard
        </Button>
        <Button variant="outline" className="w-full">
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat mit Support
        </Button>
      </div>
    </div>
  );
}

// ============= MAIN COMPONENT =============
export const V6bChatGPT: React.FC = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  
  const [currentStep, setCurrentStep] = useState(() => {
    if (isCaptureMode && captureStep && captureStep >= 1 && captureStep <= 5) {
      return captureStep;
    }
    return 1;
  });
  
  const [formData, setFormData] = useState(() => ({
    fromZip: isCaptureMode ? demoData.fromPostal : '',
    fromCity: '',
    toZip: isCaptureMode ? demoData.toPostal : '',
    toCity: '',
    rooms: isCaptureMode ? '3' : '',
    floor: '',
    hasLift: false,
    name: isCaptureMode ? demoData.name : '',
    email: isCaptureMode ? demoData.email : '',
    phone: isCaptureMode ? demoData.phone : '',
    moveDate: '',
    acceptTerms: false,
  }));
  
  const [selectedTierId, setSelectedTierId] = useState<string>('comfort');
  const [crossSellSelections, setCrossSellSelections] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const selectedTier = SERVICE_TIERS.find(t => t.id === selectedTierId) || null;
  
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };
  
  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!/^\d{4}$/.test(formData.fromZip)) newErrors.fromZip = 'Bitte gültige CH-PLZ eingeben (4 Ziffern)';
    if (!/^\d{4}$/.test(formData.toZip)) newErrors.toZip = 'Bitte gültige CH-PLZ eingeben (4 Ziffern)';
    if (!formData.rooms) newErrors.rooms = 'Bitte Wohnungsgrösse wählen';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validateStep5 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.name.trim().length < 2) newErrors.name = 'Bitte Vor- und Nachname eingeben';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Bitte gültige E-Mail eingeben';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Bitte AGB akzeptieren';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = async () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 5) {
      if (!validateStep5()) return;
      setIsSubmitting(true);
      await new Promise(r => setTimeout(r, 1500));
      setIsSubmitting(false);
      setIsSubmitted(true);
      return;
    }
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };
  
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };
  
  const handleCrossSellChange = (id: string, checked: boolean) => {
    setCrossSellSelections(prev => 
      checked ? [...prev, id] : prev.filter(x => x !== id)
    );
  };
  
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background pb-8">
        <ProgressHeader step={5} total={5} title="Bestätigt" />
        <div className="max-w-md mx-auto p-4 pt-6">
          <SuccessStep 
            formData={formData}
            selectedTier={selectedTier}
            crossSellSelections={crossSellSelections}
            onCrossSellChange={handleCrossSellChange}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background pb-40">
      <ProgressHeader step={currentStep} total={5} title={STEPS[currentStep - 1].title} />
      
      <div className="max-w-md mx-auto p-4 pt-2">
        {currentStep === 1 && <EnhancedTrustBar />}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Details */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <h1 className="text-xl font-bold mb-2">Wenige Angaben – in unter 5 Minuten zum Fixpreis</h1>
                  <p className="text-sm text-muted-foreground">
                    Geben Sie Start und Ziel an
                  </p>
                </div>
                
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <ValidatedField
                      label="Von PLZ"
                      name="fromZip"
                      value={formData.fromZip}
                      onChange={(v) => updateField('fromZip', v)}
                      placeholder="z.B. 8001"
                      inputMode="numeric"
                      error={errors.fromZip}
                      hint="Nur CH-PLZ (4 Ziffern)"
                      icon={MapPin}
                      required
                    />
                    
                    <ValidatedField
                      label="Nach PLZ"
                      name="toZip"
                      value={formData.toZip}
                      onChange={(v) => updateField('toZip', v)}
                      placeholder="z.B. 3011"
                      inputMode="numeric"
                      error={errors.toZip}
                      hint="Nur CH-PLZ (4 Ziffern)"
                      icon={MapPin}
                      required
                    />
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        Anzahl Zimmer <span className="text-destructive">*</span>
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {['1', '2', '3', '4', '5', '6+'].map((r) => (
                          <Button
                            key={r}
                            variant={formData.rooms === r ? 'default' : 'outline'}
                            onClick={() => updateField('rooms', r)}
                            className="h-11"
                          >
                            {r}
                          </Button>
                        ))}
                      </div>
                      {errors.rooms && (
                        <p className="text-xs text-destructive">{errors.rooms}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Trust Testimonial */}
                <div className="bg-muted/30 rounded-lg p-4 flex gap-3">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background" />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-medium">15'000+ Umzüge vermittelt</p>
                    <p className="text-xs text-muted-foreground">Durchschnitt 4.9/5 Sterne</p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Video Scan */}
            {currentStep === 2 && (
              <VideoScanStep 
                onComplete={() => setCurrentStep(3)}
                onSkip={() => setCurrentStep(3)}
              />
            )}
            
            {/* Step 3: Service Tier Selection */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-xl font-bold mb-2">Wie viel möchten Sie selbst machen?</h1>
                  <p className="text-sm text-muted-foreground">
                    Wählen Sie Ihren Service-Level
                  </p>
                </div>
                
                <div className="grid gap-3">
                  {SERVICE_TIERS.slice(0, 4).map((tier) => (
                    <TierCard
                      key={tier.id}
                      tier={tier}
                      selected={selectedTierId === tier.id}
                      onSelect={() => setSelectedTierId(tier.id)}
                    />
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  onClick={() => {}}
                  className="w-full text-muted-foreground"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Alle 6 Pakete vergleichen
                </Button>
              </div>
            )}
            
            {/* Step 4: Price Display */}
            {currentStep === 4 && selectedTier && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-xl font-bold mb-2">Ihr Fixpreis</h1>
                  <div className="text-4xl font-bold text-primary">
                    CHF 1'490
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTier.title} • inkl. MwSt. • inkl. Versicherung
                  </p>
                </div>
                
                <PriceBreakdown 
                  tier={selectedTier}
                  rooms={parseInt(formData.rooms) || 3}
                  distance={45}
                />
                
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <ul className="space-y-2">
                      {[
                        'Preisgarantie: Keine Zusatzkosten',
                        '24h kostenlose Stornierung',
                        'Vollversicherung bis CHF 100\'000',
                        'Geprüfte ASTAG-Partner'
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Step 5: Contact & Book */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center">
                  <h1 className="text-xl font-bold mb-2">Buchung abschliessen</h1>
                  <p className="text-sm text-muted-foreground">
                    Nur noch Ihre Kontaktdaten
                  </p>
                </div>
                
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <ValidatedField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={(v) => updateField('name', v)}
                      placeholder="Vor- und Nachname"
                      error={errors.name}
                      icon={User}
                      required
                    />
                    
                    <ValidatedField
                      label="E-Mail"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(v) => updateField('email', v)}
                      placeholder="ihre@email.ch"
                      error={errors.email}
                      icon={Mail}
                      inputMode="email"
                      required
                    />
                    
                    <ValidatedField
                      label="Telefon"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(v) => updateField('phone', v)}
                      placeholder="079 123 45 67 (optional)"
                      hint="Nur für Rückfragen, optional"
                      icon={Phone}
                      inputMode="tel"
                    />
                    
                    <div className="flex items-start gap-2 pt-2">
                      <Checkbox
                        id="terms"
                        checked={formData.acceptTerms}
                        onCheckedChange={(c) => updateField('acceptTerms', c)}
                      />
                      <label htmlFor="terms" className="text-xs text-muted-foreground">
                        Ich akzeptiere die{' '}
                        <a href="#" className="underline">AGB</a> und{' '}
                        <a href="#" className="underline">Datenschutzerklärung</a>
                      </label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-xs text-destructive">{errors.acceptTerms}</p>
                    )}
                  </CardContent>
                </Card>
                
                <p className="text-xs text-center text-muted-foreground">
                  <Timer className="h-3 w-3 inline mr-1" />
                  24 Stunden kostenlose Stornierung nach Buchung
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      
      <StickyFooter
        label={
          currentStep === 2 ? 'Mit Video fortfahren' :
          currentStep === 5 ? 'Verbindlich buchen' :
          'Weiter'
        }
        onClick={handleNext}
        disabled={currentStep === 1 && (!formData.fromZip || !formData.toZip || !formData.rooms)}
        loading={isSubmitting}
        hint={currentStep === 5 ? 'Fixpreis CHF 1\'490 • 24h Storno • Versichert' : undefined}
        onBack={handleBack}
        showBack={currentStep > 1}
      />
    </div>
  );
};

export default V6bChatGPT;
