/**
 * V6.e Thinking Mode - ChatGPT Thinking Mode Feedback
 * 
 * Thinking Mode Feedback implementiert:
 * 1. ✅ Funnel-Mode auf Mobile: Bottom-Nav + Floating + ausblenden
 * 2. ✅ Sticky Footer CTA mit Safe-Area Padding
 * 3. ✅ Datumsformat de-CH konsistent (01. März 2026)
 * 4. ✅ CTA-Wording fixen ("Fixpreis reservieren" statt "Buchen")
 * 5. ✅ Video-Step: Privacy + Nutzen glasklar + Skip als Secondary
 * 6. ✅ Service-Step: Slider ODER Cards (nicht beides)
 * 7. ✅ Preis-Step: "Was ist drin?" sofort sichtbar
 * 8. ✅ Trust-Beweise konkretisieren (Anzahl + Quelle)
 * 9. ✅ Adress-Qualität erhöhen (Strasse optional)
 * 10. ✅ Ablenkungen reduzieren (clean funnel)
 */

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Package,
  Truck,
  Users,
  Home,
  Loader2,
  FileText,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Lock,
  TrendingUp,
  Info,
  Zap
} from 'lucide-react';

// ============= CONSTANTS =============
const STEPS = [
  { id: 1, title: 'Details', cta: 'Weiter' },
  { id: 2, title: 'Video-Scan', cta: 'Weiter' },
  { id: 3, title: 'Service-Level', cta: 'Weiter' },
  { id: 4, title: 'Ihr Preis', cta: 'Weiter zur Reservierung' },
  { id: 5, title: 'Reservieren', cta: 'Fixpreis reservieren' },
];

// Single control: Cards only (not slider + cards)
const SERVICE_LEVELS = [
  { 
    id: 'basic', 
    name: 'Transport', 
    price: 'ab CHF 490', 
    includes: ['Transporter', '2 Träger', 'Versicherung'],
    popular: false 
  },
  { 
    id: 'comfort', 
    name: 'Komfort', 
    price: 'ab CHF 1\'490', 
    includes: ['Transporter', '3 Träger', 'Verpackung', 'Montage', 'Versicherung'],
    popular: true 
  },
  { 
    id: 'premium', 
    name: 'Premium', 
    price: 'ab CHF 2\'990', 
    includes: ['Alles inkl.', 'Einpacken', 'Auspacken', 'Reinigung', 'Vollversicherung'],
    popular: false 
  },
];

// Format date in Swiss German format
const formatDateDeCH = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-CH', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

export default function V6eThinkingMode() {
  const { isCaptureMode, captureStep } = useCaptureMode();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fromPLZ: '',
    fromCity: '',
    fromStreet: '',
    toPLZ: '',
    toCity: '',
    toStreet: '',
    moveDate: '',
    rooms: '3.5',
    serviceLevel: 'comfort',
    videoUploaded: false,
    name: '',
    email: '',
    phone: '',
    privacy: false,
  });

  const [calculatedPrice, setCalculatedPrice] = useState(1890);

  // Capture mode sync
  useEffect(() => {
    if (isCaptureMode && captureStep) {
      setCurrentStep(Math.min(captureStep, STEPS.length));
    }
  }, [isCaptureMode, captureStep]);

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsComplete(true);
  };

  const progressPercent = (currentStep / STEPS.length) * 100;

  // ============= STEP 1: DETAILS =============
  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Umzugsdetails</h2>
        <p className="text-muted-foreground text-sm mt-1">Ihr Fixpreis in unter 10 Minuten</p>
      </div>

      {/* Trust - konkret mit Quelle (Feedback #8) */}
      <div className="flex justify-center gap-3 flex-wrap">
        <Badge variant="secondary" className="gap-1 py-1">
          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          4.8/5 • 1'247 Google Reviews
        </Badge>
        <Badge variant="secondary" className="gap-1 py-1">
          <Shield className="h-3 w-3 text-green-600" />
          CHF 50'000 Allianz-versichert
        </Badge>
      </div>

      {/* Adressen */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Von PLZ *</label>
              <Input
                placeholder="8000"
                value={formData.fromPLZ}
                onChange={(e) => updateField('fromPLZ', e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Ort</label>
              <Input
                placeholder="Zürich"
                value={formData.fromCity}
                onChange={(e) => updateField('fromCity', e.target.value)}
              />
            </div>
          </div>
          
          {/* Strasse optional - Feedback #9 */}
          <div>
            <label className="text-xs font-medium text-muted-foreground">Strasse (optional)</label>
            <Input
              placeholder="Bahnhofstrasse 1"
              value={formData.fromStreet}
              onChange={(e) => updateField('fromStreet', e.target.value)}
            />
          </div>

          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Nach PLZ *</label>
                <Input
                  placeholder="3000"
                  value={formData.toPLZ}
                  onChange={(e) => updateField('toPLZ', e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Ort</label>
                <Input
                  placeholder="Bern"
                  value={formData.toCity}
                  onChange={(e) => updateField('toCity', e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Datum - de-CH Format (Feedback #3) */}
      <div>
        <label className="text-xs font-medium text-muted-foreground">Umzugsdatum *</label>
        <Input
          type="date"
          value={formData.moveDate}
          onChange={(e) => updateField('moveDate', e.target.value)}
        />
        {formData.moveDate && (
          <p className="text-xs text-muted-foreground mt-1">
            → {formatDateDeCH(formData.moveDate)}
          </p>
        )}
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">Wohnungsgrösse *</label>
        <select
          value={formData.rooms}
          onChange={(e) => updateField('rooms', e.target.value)}
          className="w-full h-10 px-3 rounded-md border border-input bg-background"
        >
          {['1', '1.5', '2', '2.5', '3', '3.5', '4', '4.5', '5', '5+'].map(r => (
            <option key={r} value={r}>{r} Zimmer</option>
          ))}
        </select>
      </div>
    </div>
  );

  // ============= STEP 2: VIDEO-SCAN =============
  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Video-Inventar</h2>
        <p className="text-muted-foreground text-sm mt-1">Für Ihren garantierten Fixpreis</p>
      </div>

      {/* Nutzen glasklar (Feedback #5) */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
            <Video className="h-8 w-8 text-primary" />
          </div>
          
          <div>
            <h3 className="font-semibold text-lg">Warum Video?</h3>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1 text-left max-w-xs mx-auto">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" /> Fixpreis wird 100% verbindlich
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" /> Keine Rückfragen oder Überraschungen
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" /> Schnellere Bearbeitung
              </li>
            </ul>
          </div>

          <div className="flex gap-2 justify-center">
            <Button className="gap-2">
              <Camera className="h-4 w-4" /> Aufnehmen
            </Button>
            <Button variant="outline" className="gap-2">
              <Upload className="h-4 w-4" /> Hochladen
            </Button>
          </div>

          {/* Privacy glasklar (Feedback #5) */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-background/50 rounded-lg p-2">
            <Lock className="h-3 w-3" />
            <span>Video nur zur Kalkulation – keine Weitergabe, nach 30 Tagen gelöscht</span>
          </div>
        </CardContent>
      </Card>

      {/* Skip als echte Secondary Option (Feedback #5) */}
      <Button 
        variant="secondary" 
        className="w-full"
        onClick={handleNext}
      >
        Ohne Video fortfahren (Richtpreis)
      </Button>
    </div>
  );

  // ============= STEP 3: SERVICE-LEVEL (Cards only, no slider) =============
  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Service-Level wählen</h2>
        <p className="text-muted-foreground text-sm mt-1">Was sollen wir übernehmen?</p>
      </div>

      {/* Cards ONLY - no slider confusion (Feedback #6) */}
      <div className="space-y-3">
        {SERVICE_LEVELS.map(level => (
          <Card 
            key={level.id}
            className={`cursor-pointer transition-all ${
              formData.serviceLevel === level.id 
                ? 'ring-2 ring-primary border-primary' 
                : 'hover:border-primary/50'
            }`}
            onClick={() => updateField('serviceLevel', level.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{level.name}</span>
                    {level.popular && (
                      <Badge className="text-xs">Beliebt</Badge>
                    )}
                  </div>
                  <p className="text-sm font-medium text-primary mt-1">{level.price}</p>
                  <ul className="text-xs text-muted-foreground mt-2 space-y-0.5">
                    {level.includes.map((item, i) => (
                      <li key={i} className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-600" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                {formData.serviceLevel === level.id && (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // ============= STEP 4: PREIS (Was ist drin? sofort sichtbar) =============
  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Ihr Fixpreis</h2>
      </div>

      {/* Preis prominent */}
      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Ihr kalkulierter Preis</p>
          <p className="text-4xl font-bold text-primary mt-2">
            CHF {calculatedPrice.toLocaleString('de-CH')}
          </p>
          <p className="text-xs text-muted-foreground mt-1">inkl. MwSt. & Versicherung</p>
        </CardContent>
      </Card>

      {/* Was ist drin? SOFORT sichtbar (Feedback #7) */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Info className="h-4 w-4" /> Was ist drin?
          </h3>
          <ul className="text-sm mt-3 space-y-2">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" /> Transporter mit Fahrer
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" /> 3 professionelle Träger
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" /> Verpackungsmaterial & Montage
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" /> CHF 50'000 Versicherung
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" /> 24h kostenlos stornierbar
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
    </div>
  );

  // ============= STEP 5: RESERVIEREN (CTA-Wording fix) =============
  const renderStep5 = () => (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Fixpreis reservieren</h2>
        <p className="text-muted-foreground text-sm mt-1">24h kostenlos stornierbar</p>
      </div>

      {/* Zusammenfassung */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">
                {formData.fromPLZ} → {formData.toPLZ}
              </p>
              {formData.moveDate && (
                <p className="text-xs text-muted-foreground">
                  {formatDateDeCH(formData.moveDate)}
                </p>
              )}
            </div>
            <p className="text-xl font-bold text-primary">
              CHF {calculatedPrice.toLocaleString('de-CH')}
            </p>
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
          <p className="text-xs text-muted-foreground mt-1">
            Keine Spam-Anrufe, maximal 1 Partner.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          checked={formData.privacy}
          onCheckedChange={(checked) => updateField('privacy', !!checked)}
        />
        <p className="text-xs text-muted-foreground">
          Ich akzeptiere die <a href="#" className="text-primary">AGB</a> und{' '}
          <a href="#" className="text-primary">Datenschutz</a>.
        </p>
      </div>

      {/* Status nach Submit */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200">
        <CardContent className="p-3 flex items-center gap-3">
          <Zap className="h-5 w-5 text-blue-600" />
          <p className="text-sm">
            <strong>Nächster Schritt:</strong> Wir bestätigen Verfügbarkeit bis max. 2h.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  // ============= SUCCESS =============
  const renderSuccess = () => (
    <div className="text-center space-y-6 py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center"
      >
        <CheckCircle2 className="h-10 w-10 text-green-600" />
      </motion.div>
      
      <div>
        <h2 className="text-2xl font-bold">Reservierung bestätigt!</h2>
        <p className="text-muted-foreground mt-2">
          Wir melden uns innerhalb von 2 Stunden.
        </p>
      </div>

      <Card className="bg-muted/50 text-left">
        <CardContent className="p-4">
          <p className="text-sm font-medium mb-2">Ihre Reservierung:</p>
          <p className="text-sm text-muted-foreground">
            {formData.fromPLZ} → {formData.toPLZ}<br />
            {formatDateDeCH(formData.moveDate)}<br />
            <strong>CHF {calculatedPrice.toLocaleString('de-CH')}</strong> (Fixpreis)
          </p>
        </CardContent>
      </Card>

      <Button onClick={() => window.location.href = '/'}>
        Zurück zur Startseite
      </Button>
    </div>
  );

  const renderCurrentStep = () => {
    if (isComplete) return renderSuccess();
    
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Clean Header - Funnel Mode (Feedback #1, #10) */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-lg">Umzugscheck.ch</span>
            <Badge variant="outline" className="text-xs">V6.e Thinking</Badge>
          </div>
        </div>
      </header>

      {/* Progress */}
      {!isComplete && (
        <div className="bg-muted/30 border-b">
          <div className="container max-w-2xl mx-auto px-4 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Schritt {currentStep}/{STEPS.length}</span>
              <span className="text-muted-foreground">{STEPS[currentStep - 1]?.title}</span>
            </div>
            <Progress value={progressPercent} className="h-1.5 mt-2" />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container max-w-2xl mx-auto px-4 py-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky Footer - Safe Area Padding (Feedback #2) */}
      {!isComplete && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="container max-w-2xl mx-auto flex gap-3">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <Button 
              onClick={handleNext}
              disabled={isSubmitting || (currentStep === 5 && !formData.privacy)}
              className="flex-1 gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Wird reserviert...
                </>
              ) : (
                <>
                  {STEPS[currentStep - 1]?.cta}
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
