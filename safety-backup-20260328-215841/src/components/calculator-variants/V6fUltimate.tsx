/**
 * V6.f Ultimate - The Definitive Flow
 * 
 * Kombination der besten Elemente aus V6a-V6e:
 * 
 * Von V6a: ✅ Card-Snap Tiers (Mobile-optimiert)
 * Von V6b: ✅ Tooltips, Testimonials, Timeline, Progress-Gamification
 * Von V6c: ✅ Permission Priming, Labor Illusion, Social Proof, Explainable AI
 * Von V6d: ✅ Mobile-First, frühe Trust-Signale, dynamische CTAs, Summary
 * Von V6e: ✅ de-CH Datum, "Was ist drin?" prominent, Clean Funnel, Privacy klar
 * 
 * UNIQUE V6f Features:
 * - Enclosed Checkout (keine Ablenkung)
 * - Sticky Footer mit Safe-Area
 * - 4-Tier Service (sweet spot: nicht zu viel, nicht zu wenig)
 * - Kombinierte Trust-Signale mit Quellen
 * - Video-Scan mit Permission Priming + Privacy-First
 * - Labor Illusion für wahrgenommenen Wert
 * - After-Sales Timeline für Vertrauen
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
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
  ChevronRight,
  ChevronLeft,
  Upload,
  Camera,
  Package,
  Truck,
  Users,
  Home,
  Loader2,
  FileText,
  Calendar,
  CheckCircle2,
  Lock,
  TrendingUp,
  Info,
  Zap,
  Eye,
  Sparkles,
  MessageCircle,
  Building2
} from 'lucide-react';

// ============= CONSTANTS =============
const STEPS = [
  { id: 1, title: 'Details', icon: MapPin, cta: 'Weiter: Service wählen' },
  { id: 2, title: 'Service', icon: Package, cta: 'Weiter: Video-Scan' },
  { id: 3, title: 'Video', icon: Video, cta: 'Weiter: Preis berechnen' },
  { id: 4, title: 'Preis', icon: FileText, cta: 'Fixpreis reservieren' },
  { id: 5, title: 'Kontakt', icon: CheckCircle2, cta: 'Kostenlos Offerten erhalten' },
];

// 4-Tier Service Model (Sweet Spot aus V6a + V6c)
const SERVICE_TIERS = [
  { 
    id: 'basic',
    name: 'Transport',
    subtitle: 'Sie packen, wir fahren',
    price: 490,
    selfPercent: 80,
    features: ['Transporter + 2 Träger', 'Grundversicherung CHF 10\'000'],
    color: 'bg-slate-50',
  },
  { 
    id: 'standard',
    name: 'Standard',
    subtitle: 'Beliebte Wahl',
    price: 990,
    selfPercent: 50,
    features: ['Transporter + 3 Träger', 'Verpackungsmaterial', 'Möbelschutz', 'Versicherung CHF 30\'000'],
    color: 'bg-blue-50',
    popular: true,
  },
  { 
    id: 'comfort',
    name: 'Komfort',
    subtitle: 'Empfohlen',
    price: 1490,
    selfPercent: 20,
    features: ['Transporter + 4 Träger', 'Ein-/Auspacken', 'Möbelmontage', 'Vollversicherung CHF 50\'000'],
    color: 'bg-primary/10',
    recommended: true,
  },
  { 
    id: 'premium',
    name: 'Premium',
    subtitle: 'Rundum-Sorglos',
    price: 2490,
    selfPercent: 0,
    features: ['Alles inklusive', 'Reinigung', 'Entsorgung', 'Priority Support', 'Hotel bei Verzögerung'],
    color: 'bg-amber-50',
  },
];

const TESTIMONIALS = [
  { name: 'Sandra M.', city: 'Zürich', text: 'Über 600 CHF gespart!', rating: 5 },
  { name: 'Thomas K.', city: 'Bern', text: 'Fixpreis hat gestimmt.', rating: 5 },
  { name: 'Anna L.', city: 'Basel', text: 'Super einfach mit Video-Scan.', rating: 5 },
];

const TIMELINE = [
  { day: 'Jetzt', title: 'Buchung', icon: CheckCircle2 },
  { day: 'T-14', title: 'Planung', icon: Calendar },
  { day: 'T-0', title: 'Umzug', icon: Truck },
  { day: 'T+7', title: 'Feedback', icon: MessageCircle },
];

// Swiss date format
const formatDateDeCH = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-CH', { day: '2-digit', month: 'long', year: 'numeric' });
};

// ============= SUB COMPONENTS =============

// Enclosed Header (keine Navigation - V6c/V6e)
function FunnelHeader({ step, total }: { step: number; total: number }) {
  const progress = Math.round((step / total) * 100);
  
  return (
    <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="max-w-lg mx-auto px-4 py-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-bold text-sm">Umzugscheck.ch</span>
          </div>
          <Badge variant="secondary">{step}/{total}</Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Progress value={progress} className="h-2 flex-1" />
          <span className="text-xs font-medium text-primary">{progress}%</span>
        </div>
        
        {/* Step Icons */}
        <div className="flex justify-between mt-3">
          {STEPS.map((s) => {
            const Icon = s.icon;
            const isActive = s.id === step;
            const isComplete = s.id < step;
            return (
              <div key={s.id} className="flex flex-col items-center">
                <div className={`
                  w-7 h-7 rounded-full flex items-center justify-center transition-all
                  ${isComplete ? 'bg-primary text-primary-foreground' : 
                    isActive ? 'bg-primary/20 text-primary ring-2 ring-primary' : 
                    'bg-muted text-muted-foreground'}
                `}>
                  {isComplete ? <Check className="h-3 w-3" /> : <Icon className="h-3 w-3" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Combined Trust Bar (V6b + V6d + V6e)
function TrustBar() {
  return (
    <div className="bg-gradient-to-r from-green-50 via-background to-green-50 dark:from-green-950/20 dark:to-green-950/20 border-y py-2 mb-4">
      <div className="flex flex-wrap justify-center gap-3 text-xs">
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
          <span className="font-medium">4.9/5 (2'340 Google)</span>
        </span>
        <span className="flex items-center gap-1">
          <Shield className="h-3.5 w-3.5 text-green-600" />
          <span className="font-medium">CHF 50'000 Allianz</span>
        </span>
        <span className="flex items-center gap-1">
          <Award className="h-3.5 w-3.5 text-red-600" />
          <span className="font-medium">Swiss Made</span>
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5 text-blue-600" />
          <span className="font-medium">Fixpreis-Garantie</span>
        </span>
      </div>
    </div>
  );
}

// Sticky Footer CTA (V6c + V6e)
function StickyFooter({ 
  label, 
  onClick, 
  onBack, 
  disabled, 
  loading, 
  showBack 
}: { 
  label: string; 
  onClick: () => void; 
  onBack?: () => void; 
  disabled?: boolean; 
  loading?: boolean; 
  showBack?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t safe-area-pb">
      <div className="max-w-lg mx-auto px-4 py-3 space-y-2">
        <div className="flex gap-3">
          {showBack && onBack && (
            <Button variant="outline" onClick={onBack} className="shrink-0">
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
            <Lock className="h-3 w-3" /> Keine Spam-Anrufe
          </span>
        </div>
      </div>
    </div>
  );
}

// Labor Illusion Animation (V6c)
function ComputingPrice({ onComplete }: { onComplete: (price: number) => void }) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Analysiere Volumen...');
  
  const messages = [
    'Analysiere Volumen...',
    'Berechne Distanz...',
    'Prüfe Verfügbarkeit...',
    'Optimiere Preis...',
    'Finalisiere Fixpreis...'
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + 2;
        const msgIndex = Math.min(Math.floor((next / 100) * messages.length), messages.length - 1);
        setMessage(messages[msgIndex]);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => onComplete(1890), 300);
          return 100;
        }
        return next;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);
  
  return (
    <div className="text-center space-y-6 py-12">
      <motion.div 
        className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <Sparkles className="h-10 w-10 text-primary" />
      </motion.div>
      
      <div>
        <h2 className="text-xl font-bold mb-2">Berechne Ihren Fixpreis</h2>
        <p className="text-muted-foreground">{message}</p>
      </div>
      
      <div className="max-w-xs mx-auto">
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground mt-2">{progress}%</p>
      </div>
    </div>
  );
}

// Main Component
export default function V6fUltimate() {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showComputing, setShowComputing] = useState(false);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    fromPLZ: isCaptureMode ? demoData.fromPostal : '',
    toPLZ: isCaptureMode ? demoData.toPostal : '',
    moveDate: isCaptureMode ? demoData.moveDate : '',
    rooms: '3.5',
    tier: 'comfort',
    videoUploaded: false,
    name: isCaptureMode ? demoData.name : '',
    email: isCaptureMode ? demoData.email : '',
    phone: isCaptureMode ? demoData.phone : '',
    privacy: false,
  });

  useEffect(() => {
    if (isCaptureMode && captureStep) {
      setCurrentStep(Math.min(captureStep, STEPS.length));
    }
  }, [isCaptureMode, captureStep]);

  const selectedTier = SERVICE_TIERS.find(t => t.id === formData.tier);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 3 && !calculatedPrice) {
      setShowComputing(true);
      return;
    }
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const handlePriceComputed = (price: number) => {
    setCalculatedPrice(price);
    setShowComputing(false);
    setCurrentStep(4);
  };

  // ============= STEP 1: DETAILS (Mobile-First + Trust früh) =============
  const renderStep1 = () => (
    <div className="space-y-4">
      <TrustBar />
      
      <div className="text-center">
        <h2 className="text-xl font-bold">Wenige Angaben zum Umzug</h2>
        <p className="text-sm text-muted-foreground">Fixpreis in unter 3 Minuten</p>
      </div>

      {/* Social Proof (V6c + V6d) */}
      <Card className="bg-muted/50 border-none">
        <CardContent className="p-3 flex items-center gap-3">
          <div className="flex -space-x-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-6 h-6 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                <User className="h-3 w-3 text-primary" />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            <strong>47 Personen</strong> in Ihrer Region haben diese Woche gebucht
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Von PLZ *</label>
          <Input
            placeholder="8000"
            value={formData.fromPLZ}
            onChange={(e) => updateField('fromPLZ', e.target.value)}
            inputMode="numeric"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Nach PLZ *</label>
          <Input
            placeholder="3000"
            value={formData.toPLZ}
            onChange={(e) => updateField('toPLZ', e.target.value)}
            inputMode="numeric"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Umzugsdatum *</label>
        <Input
          type="date"
          value={formData.moveDate}
          onChange={(e) => updateField('moveDate', e.target.value)}
        />
        {formData.moveDate && (
          <p className="text-xs text-muted-foreground mt-1">→ {formatDateDeCH(formData.moveDate)}</p>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Wohnungsgrösse *</label>
        <div className="grid grid-cols-4 gap-2 mt-1">
          {['1.5', '2.5', '3.5', '4.5', '5+'].map(r => (
            <Button
              key={r}
              variant={formData.rooms === r ? 'default' : 'outline'}
              onClick={() => updateField('rooms', r)}
              className="h-10"
            >
              {r}
            </Button>
          ))}
        </div>
      </div>

      {/* Testimonial (V6b) */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div>
              <p className="text-sm italic">"{TESTIMONIALS[0].text}"</p>
              <p className="text-xs text-muted-foreground mt-1">
                – {TESTIMONIALS[0].name}, {TESTIMONIALS[0].city}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============= STEP 2: SERVICE (Card-Snap + Slider Visual) =============
  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Service-Level wählen</h2>
        <p className="text-sm text-muted-foreground">Wie viel sollen wir übernehmen?</p>
      </div>

      {/* Card-Snap Scroll (V6a) */}
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 px-4">
        {SERVICE_TIERS.map((tier) => (
          <Card
            key={tier.id}
            className={`min-w-[240px] snap-start cursor-pointer transition-all ${tier.color} ${
              formData.tier === tier.id ? 'ring-2 ring-primary border-primary shadow-lg' : ''
            }`}
            onClick={() => updateField('tier', tier.id)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{tier.name}</h3>
                    {tier.recommended && (
                      <Badge className="text-xs"><Star className="h-2.5 w-2.5 mr-0.5" />Empfohlen</Badge>
                    )}
                    {tier.popular && !tier.recommended && (
                      <Badge variant="secondary" className="text-xs">Beliebt</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{tier.subtitle}</p>
                </div>
              </div>
              
              {/* Self vs We Visual (V6c) */}
              <div className="my-3">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Sie: {tier.selfPercent}%</span>
                  <span>Wir: {100 - tier.selfPercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-amber-400" style={{ width: `${tier.selfPercent}%` }} />
                  <div className="bg-green-500" style={{ width: `${100 - tier.selfPercent}%` }} />
                </div>
              </div>

              <ul className="space-y-1 mb-3">
                {tier.features.slice(0, 3).map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs">
                    <Check className="h-3 w-3 text-green-600 shrink-0" />{f}
                  </li>
                ))}
              </ul>

              <p className="text-lg font-bold text-primary">ab CHF {tier.price.toLocaleString('de-CH')}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Social Proof (V6c) */}
      <p className="text-xs text-center text-muted-foreground">
        <Users className="h-3.5 w-3.5 inline mr-1" />
        <strong>62%</strong> wählen "{selectedTier?.name}" in Ihrer Region
      </p>
    </div>
  );

  // ============= STEP 3: VIDEO (Permission Priming + Privacy) =============
  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Inventar-Scan</h2>
        <p className="text-sm text-muted-foreground">Für Ihren garantierten Fixpreis</p>
      </div>

      {/* Permission Priming (V6c) */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-5 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Zeigen Sie uns Ihre Wohnung</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Für die <strong>100% Preisgarantie</strong>
            </p>
          </div>

          <ul className="text-sm text-left space-y-2 max-w-xs mx-auto">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <span>KI erkennt alle Gegenstände automatisch</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
              <span>Nur 2 Min. statt 20 Min. Klicken</span>
            </li>
            <li className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-green-600 shrink-0" />
              <span>Video verschlüsselt, nach 7 Tagen gelöscht</span>
            </li>
          </ul>

          <div className="flex gap-2 justify-center">
            <Button className="gap-2" onClick={() => updateField('videoUploaded', true)}>
              <Camera className="h-4 w-4" /> Aufnehmen
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => updateField('videoUploaded', true)}>
              <Upload className="h-4 w-4" /> Hochladen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skip als Secondary (V6e) */}
      <Button variant="secondary" className="w-full" onClick={handleNext}>
        Ohne Video fortfahren (Richtpreis)
      </Button>

      {formData.videoUploaded && (
        <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
          <CardContent className="p-3 flex items-center gap-3">
            <Eye className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm font-medium">Video hochgeladen</p>
              <p className="text-xs text-muted-foreground">KI analysiert Ihren Hausrat...</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </CardContent>
        </Card>
      )}
    </div>
  );

  // ============= STEP 4: PREIS (Was ist drin + Labor Illusion) =============
  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Ihr Fixpreis</h2>
      </div>

      {/* Price Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Kalkulierter Preis</p>
          <p className="text-4xl font-bold text-primary mt-2">
            CHF {(calculatedPrice || 1890).toLocaleString('de-CH')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">inkl. MwSt. & Versicherung</p>
        </CardContent>
      </Card>

      {/* Was ist drin? (V6e) */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold flex items-center gap-2 mb-3">
            <Info className="h-4 w-4" /> Was ist inklusive?
          </h3>
          <ul className="text-sm space-y-2">
            {selectedTier?.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600 shrink-0" />{f}
              </li>
            ))}
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600 shrink-0" />24h kostenlos stornierbar
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Garantien */}
      <div className="flex gap-2 flex-wrap justify-center">
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3" /> Fixpreis-Garantie
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Clock className="h-3 w-3" /> 24h Storno
        </Badge>
        <Badge variant="outline" className="gap-1">
          <Award className="h-3 w-3" /> Geprüfte Partner
        </Badge>
      </div>

      {/* Timeline (V6b) */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-3">So geht es weiter:</h4>
          <div className="flex justify-between">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                  <t.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs font-medium">{t.title}</p>
                <p className="text-xs text-muted-foreground">{t.day}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============= STEP 5: KONTAKT (Summary + Privacy klar) =============
  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-bold">Fast geschafft!</h2>
        <p className="text-sm text-muted-foreground">Ihre Daten für die Offerten</p>
      </div>

      {/* Summary (V6d) */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">{formData.fromPLZ} → {formData.toPLZ}</p>
              {formData.moveDate && (
                <p className="text-xs text-muted-foreground">{formatDateDeCH(formData.moveDate)}</p>
              )}
              <p className="text-xs text-muted-foreground">{selectedTier?.name} Paket</p>
            </div>
            <p className="text-xl font-bold text-primary">CHF {(calculatedPrice || 1890).toLocaleString('de-CH')}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Name *</label>
          <Input
            placeholder="Max Muster"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">E-Mail *</label>
          <Input
            type="email"
            placeholder="max@beispiel.ch"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">Telefon (optional)</label>
          <Input
            type="tel"
            placeholder="+41 79 123 45 67"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">Nur für Rückfragen, keine Weitergabe.</p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          checked={formData.privacy}
          onCheckedChange={(checked) => updateField('privacy', !!checked)}
        />
        <p className="text-xs text-muted-foreground">
          Ich akzeptiere die <a href="#" className="text-primary underline">AGB</a> und{' '}
          <a href="#" className="text-primary underline">Datenschutzerklärung</a>.
        </p>
      </div>

      <Card className="bg-green-50 dark:bg-green-950/30 border-green-200">
        <CardContent className="p-3 flex items-center gap-3">
          <Shield className="h-5 w-5 text-green-600 shrink-0" />
          <div className="text-sm">
            <strong>Ihre Privatsphäre ist uns wichtig.</strong>
            <p className="text-xs text-muted-foreground">Max. 3 geprüfte Partner, keine Massenanrufe.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // ============= SUCCESS (V6b Timeline + Cross-Sell) =============
  const renderSuccess = () => (
    <div className="text-center space-y-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </motion.div>
      
      <div>
        <h2 className="text-2xl font-bold">Anfrage gesendet!</h2>
        <p className="text-muted-foreground">
          Sie erhalten innerhalb von 2 Stunden bis zu 3 Offerten.
        </p>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4 text-left">
          <h3 className="font-medium mb-2">Zusammenfassung:</h3>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Route: {formData.fromPLZ} → {formData.toPLZ}</li>
            <li>• Datum: {formatDateDeCH(formData.moveDate)}</li>
            <li>• Paket: {selectedTier?.name}</li>
            <li>• Fixpreis: CHF {(calculatedPrice || 1890).toLocaleString('de-CH')}</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3">Nächste Schritte:</h4>
          <div className="flex justify-between text-center">
            {TIMELINE.map((t, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  <t.icon className="h-5 w-5" />
                </div>
                <p className="text-xs font-medium">{t.title}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button variant="outline" className="gap-2">
        <Building2 className="h-4 w-4" />
        Umzugsfirmen in Ihrer Region ansehen
      </Button>
    </div>
  );

  // ============= RENDER =============
  if (isComplete) {
    return (
      <div className="min-h-screen bg-background">
        <FunnelHeader step={STEPS.length} total={STEPS.length} />
        <div className="max-w-lg mx-auto p-4">{renderSuccess()}</div>
      </div>
    );
  }

  if (showComputing) {
    return (
      <div className="min-h-screen bg-background">
        <FunnelHeader step={currentStep} total={STEPS.length} />
        <div className="max-w-lg mx-auto p-4">
          <ComputingPrice onComplete={handlePriceComputed} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      <FunnelHeader step={currentStep} total={STEPS.length} />
      
      <div className="max-w-lg mx-auto p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}
          </motion.div>
        </AnimatePresence>
      </div>

      <StickyFooter
        label={currentStep === 5 ? 'Kostenlos Offerten erhalten' : STEPS[currentStep - 1].cta}
        onClick={handleNext}
        onBack={handleBack}
        showBack={currentStep > 1}
        loading={isSubmitting}
        disabled={
          (currentStep === 1 && (!formData.fromPLZ || !formData.toPLZ || !formData.moveDate)) ||
          (currentStep === 5 && (!formData.name || !formData.email || !formData.privacy))
        }
      />
    </div>
  );
}
