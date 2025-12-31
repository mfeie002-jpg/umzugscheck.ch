/**
 * V3g - Feedback-Based Optimization
 * 
 * Based on comprehensive ChatGPT UX analysis with these key fixes:
 * 1. Consistent "Sie" language (no informal "Ihr")
 * 2. Clear slider labels with delegation percentage explanation
 * 3. Mobile-first stacked layouts (no side-by-side inputs on mobile)
 * 4. CTA "Kostenlos Offerten erhalten" instead of "Jetzt buchen"
 * 5. Price shown as "Preisrahmen" not contradictory "Fixpreis + Range"
 * 6. Flexible date option ("Termin noch offen")
 * 7. Step 3 messaging aligned with "Offertenvergleich" not "Buchung"
 * 8. Trust microcopy directly under CTA
 * 9. Phone field with explanation
 * 10. No overlays/banners blocking CTAs
 */

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Shield, 
  Clock, 
  Star,
  Mail,
  Phone,
  User,
  MapPin,
  Calendar,
  Home,
  Package,
  Sparkles,
  Lock,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Service wählen', shortTitle: 'Service' },
  { id: 2, title: 'Details', shortTitle: 'Details' },
  { id: 3, title: 'So geht\'s weiter', shortTitle: 'Ablauf' },
  { id: 4, title: 'Kontakt', shortTitle: 'Kontakt' },
];

const ROOM_OPTIONS = [
  { value: 'studio', label: 'Studio' },
  { value: '2', label: '2 Zi.' },
  { value: '3', label: '3 Zi.' },
  { value: '4', label: '4 Zi.' },
  { value: '5', label: '5 Zi.' },
  { value: '6+', label: '6+ Zi.' },
];

interface FormData {
  delegation: number;
  rooms: string;
  fromCity: string;
  fromPostal: string;
  toCity: string;
  toPostal: string;
  moveDate: string;
  dateFlexible: boolean;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export const V3gFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    delegation: 65,
    rooms: '3',
    fromCity: '',
    fromPostal: '',
    toCity: '',
    toPostal: '',
    moveDate: '',
    dateFlexible: false,
    name: '',
    email: '',
    phone: '',
    consent: false,
  });

  const progress = (currentStep / STEPS.length) * 100;

  // Calculate price based on delegation and rooms
  const basePrice = parseInt(formData.rooms) * 800 || 2400;
  const delegationMultiplier = 0.5 + (formData.delegation / 100);
  const priceMin = Math.round(basePrice * delegationMultiplier);
  const priceMax = Math.round(priceMin * 1.4);

  const getDelegationLabel = (value: number) => {
    if (value <= 30) return 'Budget & Kontrolle';
    if (value <= 50) return 'Ausgewogen';
    if (value <= 70) return 'Komfort';
    if (value <= 85) return 'Premium';
    return 'White Glove';
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.rooms !== '';
      case 2:
        return (formData.fromPostal && formData.toPostal) && (formData.moveDate || formData.dateFlexible);
      case 3:
        return true;
      case 4:
        return formData.name && formData.email && formData.consent;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-32">
      {/* Clean header - no overlays, no distractions */}
      <div className="sticky top-0 z-50 bg-background/98 backdrop-blur-md border-b border-border/50 px-4 py-3 shadow-sm">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-foreground">
              {currentStep}/{STEPS.length} – {STEPS[currentStep - 1].title}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>V3g Optimiert</span>
            </div>
          </div>
          <Progress value={progress} className="h-2 bg-muted" />
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 py-6 max-w-lg mx-auto">
        
        {/* Step 1: Service Selection with Clear Slider */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Wie viel möchten Sie delegieren?
              </h1>
              <p className="text-muted-foreground">
                Je mehr Sie delegieren, desto mehr Leistungen sind enthalten.
              </p>
            </div>

            {/* Service Package Card */}
            <Card className="p-5 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {getDelegationLabel(formData.delegation)}
                  </span>
                  <h3 className="text-lg font-semibold text-foreground">
                    {formData.delegation}% Delegation
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Preisrahmen</span>
                  <div className="text-xl font-bold text-foreground">
                    CHF {priceMin.toLocaleString('de-CH')}–{priceMax.toLocaleString('de-CH')}
                  </div>
                </div>
              </div>

              {/* Clear Slider with proper labels */}
              <div className="space-y-3">
                <Slider
                  value={[formData.delegation]}
                  onValueChange={([value]) => updateFormData('delegation', value)}
                  min={10}
                  max={100}
                  step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Ich mache mehr selbst</span>
                  <span>Team übernimmt mehr</span>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2 bg-muted/50 p-2 rounded-lg">
                  <HelpCircle className="h-3 w-3 inline mr-1" />
                  {formData.delegation}% = Das Umzugsteam übernimmt {formData.delegation}% der Arbeit
                </p>
              </div>

              {/* Included services based on delegation */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-xs font-medium text-muted-foreground">Inklusive:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <ServiceBadge label="Transport" included />
                  <ServiceBadge label="Möbelschutz" included />
                  {formData.delegation >= 40 && <ServiceBadge label="Montage" included />}
                  {formData.delegation >= 60 && <ServiceBadge label="Einpacken" included />}
                  {formData.delegation >= 80 && <ServiceBadge label="Reinigung" included />}
                  {formData.delegation >= 90 && <ServiceBadge label="Schlüsselübergabe" included />}
                </div>
              </div>
            </Card>

            {/* Room selection with proper label */}
            <div className="space-y-3">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Home className="h-4 w-4 text-muted-foreground" />
                Wohnungsgrösse
              </Label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {ROOM_OPTIONS.map((room) => (
                  <button
                    key={room.value}
                    onClick={() => updateFormData('rooms', room.value)}
                    className={`p-3 rounded-xl border-2 text-center font-medium transition-all active:scale-95 ${
                      formData.rooms === room.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {room.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 mt-6">
              <TrustBadge icon={Shield} label="Vollkasko" />
              <TrustBadge icon={Clock} label="Pünktlich" />
              <TrustBadge icon={Star} label="4.9/5" />
            </div>
          </div>
        )}

        {/* Step 2: Details - Stacked Mobile Layout */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                3 Felder. Mehr brauchen wir nicht.
              </h1>
              <p className="text-muted-foreground">
                Von wo nach wo? Und wann?
              </p>
            </div>

            {/* Stacked address inputs for mobile */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  Von (Auszugsadresse)
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="PLZ"
                    value={formData.fromPostal}
                    onChange={(e) => updateFormData('fromPostal', e.target.value)}
                    className="w-24 h-12 text-base"
                    maxLength={4}
                  />
                  <Input
                    placeholder="Ort"
                    value={formData.fromCity}
                    onChange={(e) => updateFormData('fromCity', e.target.value)}
                    className="flex-1 h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Nach (Einzugsadresse)
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="PLZ"
                    value={formData.toPostal}
                    onChange={(e) => updateFormData('toPostal', e.target.value)}
                    className="w-24 h-12 text-base"
                    maxLength={4}
                  />
                  <Input
                    placeholder="Ort"
                    value={formData.toCity}
                    onChange={(e) => updateFormData('toCity', e.target.value)}
                    className="flex-1 h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  Wunschtermin
                </Label>
                <Input
                  type="date"
                  value={formData.moveDate}
                  onChange={(e) => updateFormData('moveDate', e.target.value)}
                  className="h-12 text-base"
                  disabled={formData.dateFlexible}
                />
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id="dateFlexible"
                    checked={formData.dateFlexible}
                    onCheckedChange={(checked) => updateFormData('dateFlexible', checked)}
                  />
                  <Label htmlFor="dateFlexible" className="text-sm text-muted-foreground cursor-pointer">
                    Termin noch offen / flexibel
                  </Label>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <Card className="p-4 bg-muted/30 border-dashed">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground">Ihr Paket</span>
                  <p className="font-medium text-foreground">
                    {getDelegationLabel(formData.delegation)} • {formData.rooms} Zimmer
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Preisrahmen</span>
                  <p className="font-semibold text-foreground">
                    CHF {priceMin.toLocaleString('de-CH')}–{priceMax.toLocaleString('de-CH')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 3: "So geht's weiter" - Not "Buchung" */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                So geht's weiter
              </h1>
              <p className="text-muted-foreground">
                Sie erhalten Offerten und entscheiden selbst.
              </p>
            </div>

            {/* Process steps - aligned with "Offertenvergleich" */}
            <Card className="p-5 space-y-4">
              <ProcessStep 
                number={1} 
                title="Bestätigung per E-Mail" 
                description="Sie erhalten sofort eine Bestätigung Ihrer Anfrage."
              />
              <ProcessStep 
                number={2} 
                title="Anfrage an geprüfte Firmen" 
                description="Ihre Anfrage geht an passende, verifizierte Umzugsfirmen in Ihrer Region."
              />
              <ProcessStep 
                number={3} 
                title="Offerten erhalten & vergleichen" 
                description="Sie erhalten 3–5 unverbindliche Offerten innerhalb von 24h."
              />
              <ProcessStep 
                number={4} 
                title="Sie entscheiden" 
                description="Wählen Sie die beste Offerte – ohne Verpflichtung."
              />
            </Card>

            {/* Trust grid */}
            <div className="grid grid-cols-2 gap-3">
              <TrustCard 
                icon={Shield} 
                title="Vollkasko-Versicherung" 
                description="Alle Firmen sind vollversichert"
              />
              <TrustCard 
                icon={CheckCircle2} 
                title="Geprüfte Teams" 
                description="Background-Check & Referenzen"
              />
              <TrustCard 
                icon={Star} 
                title="4.9/5 Bewertung" 
                description="Über 2'000 Kundenbewertungen"
              />
              <TrustCard 
                icon={Lock} 
                title="Datenschutz" 
                description="SSL verschlüsselt, DSGVO-konform"
              />
            </div>

            {/* Summary - ensure all data is shown */}
            <Card className="p-4 bg-primary/5 border-primary/20">
              <h4 className="font-semibold text-foreground mb-3">Ihre Anfrage</h4>
              <div className="space-y-2 text-sm">
                <SummaryRow label="Wohnung" value={`${formData.rooms} Zimmer`} />
                <SummaryRow label="Delegation" value={`${formData.delegation}% (${getDelegationLabel(formData.delegation)})`} />
                <SummaryRow 
                  label="Route" 
                  value={formData.fromPostal && formData.toPostal 
                    ? `${formData.fromPostal} ${formData.fromCity} → ${formData.toPostal} ${formData.toCity}` 
                    : '–'
                  } 
                />
                <SummaryRow 
                  label="Termin" 
                  value={formData.dateFlexible ? 'Flexibel' : formData.moveDate || '–'} 
                />
                <SummaryRow label="Preisrahmen" value={`CHF ${priceMin.toLocaleString('de-CH')}–${priceMax.toLocaleString('de-CH')}`} />
              </div>
            </Card>
          </div>
        )}

        {/* Step 4: Contact - CTA "Kostenlos Offerten erhalten" */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Letzte Hürde 🎉
              </h1>
              <p className="text-muted-foreground">
                Ihre Kontaktdaten für die Offerten.
              </p>
            </div>

            {/* Contact form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Name
                </Label>
                <Input
                  placeholder="Ihr Name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  E-Mail
                </Label>
                <Input
                  type="email"
                  placeholder="ihre@email.ch"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  Telefon 
                  <span className="text-xs text-muted-foreground font-normal">(für Rückfragen der Umzugsfirmen)</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="079 123 45 67"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              <div className="flex items-start gap-3 pt-2">
                <Checkbox
                  id="consent"
                  checked={formData.consent}
                  onCheckedChange={(checked) => updateFormData('consent', checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="consent" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
                  Ich akzeptiere die{" "}
                  <Link
                    to="/agb"
                    className="text-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AGB
                  </Link>{" "}
                  und{" "}
                  <Link
                    to="/datenschutz"
                    className="text-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Datenschutzbestimmungen
                  </Link>.
                </Label>
              </div>
            </div>

            {/* Final Summary - ensure no empty fields */}
            <Card className="p-4 bg-muted/30 border-dashed">
              <h4 className="font-medium text-foreground mb-2 text-sm">Zusammenfassung</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span>Wohnung:</span>
                <span className="font-medium text-foreground">{formData.rooms} Zimmer</span>
                <span>Route:</span>
                <span className="font-medium text-foreground">
                  {formData.fromPostal || '–'} → {formData.toPostal || '–'}
                </span>
                <span>Termin:</span>
                <span className="font-medium text-foreground">
                  {formData.dateFlexible ? 'Flexibel' : formData.moveDate || '–'}
                </span>
                <span>Delegation:</span>
                <span className="font-medium text-foreground">{formData.delegation}%</span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Fixed bottom navigation - clean, no overlays */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-md border-t border-border/50 p-4 safe-area-inset-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-lg mx-auto">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                size="lg"
                className="h-14 px-4"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <Button
              size="lg"
              className="flex-1 h-14 text-base font-semibold"
              onClick={() => setCurrentStep(Math.min(currentStep + 1, STEPS.length))}
              disabled={!canProceed()}
            >
              {currentStep === STEPS.length ? (
                <>Kostenlos Offerten erhalten</>
              ) : (
                <>
                  Weiter
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
          
          {/* Trust microcopy under CTA - only on final step */}
          {currentStep === STEPS.length && (
            <p className="text-xs text-center text-muted-foreground mt-3">
              <Lock className="h-3 w-3 inline mr-1" />
              Kostenlos & unverbindlich. Keine Newsletter. Daten nur an passende Umzugsfirmen.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components

const ServiceBadge: React.FC<{ label: string; included: boolean }> = ({ label, included }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${
    included 
      ? 'bg-primary/10 text-primary' 
      : 'bg-muted text-muted-foreground'
  }`}>
    {included && <Check className="h-3 w-3 inline mr-1" />}
    {label}
  </span>
);

const TrustBadge: React.FC<{ icon: any; label: string }> = ({ icon: Icon, label }) => (
  <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-center">
    <Icon className="h-4 w-4 text-primary mx-auto" />
    <span className="text-xs font-medium text-foreground">{label}</span>
  </div>
);

const TrustCard: React.FC<{ icon: any; title: string; description: string }> = ({ 
  icon: Icon, 
  title, 
  description 
}) => (
  <Card className="p-3 text-center">
    <Icon className="h-5 w-5 text-primary mx-auto mb-2" />
    <h4 className="text-xs font-semibold text-foreground">{title}</h4>
    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
  </Card>
);

const ProcessStep: React.FC<{ number: number; title: string; description: string }> = ({ 
  number, 
  title, 
  description 
}) => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
      {number}
    </div>
    <div>
      <h4 className="font-medium text-foreground">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const SummaryRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="font-medium text-foreground">{value}</span>
  </div>
);

export default V3gFeedbackBased;
