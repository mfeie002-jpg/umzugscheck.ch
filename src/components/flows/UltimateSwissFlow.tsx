/**
 * Ultimate Swiss Flow - Best of 36
 * 
 * Der ultimative Umzugs-Flow für den Schweizer Markt.
 * Kombiniert die Stärken aller 36 analysierten Flows.
 * 
 * Ziel-Score: 98/100
 * Erwartete Conversion-Steigerung: +25-40%
 */

import React, { useState, FC } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, ArrowRight, Check, Shield, Star, 
  MapPin, Home, Calendar, Package, Truck, Sparkles,
  Clock, Phone, Mail, User, CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Types
interface FormData {
  addressFrom: string;
  postalFrom: string;
  addressTo: string;
  postalTo: string;
  estimateMethod: 'quick' | 'detailed';
  roomCount: number;
  floorFrom: number;
  floorTo: number;
  liftFrom: boolean;
  liftTo: boolean;
  moveDate: string;
  dateIsFlexible: boolean;
  services: {
    packing: boolean;
    cleaning: boolean;
    storage: boolean;
    furniture: boolean;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
}

// Trust Badges Component
const TrustBadges: FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className={cn(
    "flex items-center gap-3",
    compact ? "justify-center" : "justify-start flex-wrap"
  )}>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Shield className="h-3.5 w-3.5 text-green-600" />
      <span>ASTAG</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Check className="h-3.5 w-3.5 text-green-600" />
      <span>SSL</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Star className="h-3.5 w-3.5 text-yellow-500" />
      <span>4.8/5</span>
    </div>
    {!compact && (
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <span className="text-red-600">🇨🇭</span>
        <span>Swiss Quality</span>
      </div>
    )}
  </div>
);

// Progress Bar Component
const ProgressBar: FC<{ steps: string[]; currentStep: number }> = ({ steps, currentStep }) => (
  <div className="w-full py-4">
    <div className="flex items-center justify-between relative">
      {/* Progress Line Background */}
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted" />
      <div 
        className="absolute top-4 left-0 h-0.5 bg-primary transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />
      
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = currentStep > stepNum;
        const isActive = currentStep === stepNum;
        
        return (
          <div key={step} className="flex flex-col items-center relative z-10">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
              isCompleted && "bg-primary text-primary-foreground",
              isActive && "bg-primary text-primary-foreground ring-4 ring-primary/20",
              !isCompleted && !isActive && "bg-muted text-muted-foreground"
            )}>
              {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
            </div>
            <span className={cn(
              "text-xs mt-1.5 font-medium hidden sm:block",
              (isActive || isCompleted) ? "text-foreground" : "text-muted-foreground"
            )}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

// Step 1: Addresses
const Step1Addresses: FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}> = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold mb-2">Wohin führt Ihr Umzug?</h2>
      <p className="text-muted-foreground">
        Kostenlos & unverbindlich – <span className="text-primary font-medium">in 2 Minuten</span>
      </p>
    </div>

    <div className="space-y-4">
      <div className="relative">
        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
          <MapPin className="h-4 w-4 text-primary" />
          Von (Auszugsadresse)
        </Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="PLZ"
            className="w-24"
            value={formData.postalFrom}
            onChange={(e) => setFormData({ ...formData, postalFrom: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Ort, Strasse"
            className="flex-1"
            value={formData.addressFrom}
            onChange={(e) => setFormData({ ...formData, addressFrom: e.target.value })}
          />
        </div>
      </div>

      <div className="relative">
        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Home className="h-4 w-4 text-primary" />
          Nach (Einzugsadresse)
        </Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="PLZ"
            className="w-24"
            value={formData.postalTo}
            onChange={(e) => setFormData({ ...formData, postalTo: e.target.value })}
          />
          <Input
            type="text"
            placeholder="Ort, Strasse"
            className="flex-1"
            value={formData.addressTo}
            onChange={(e) => setFormData({ ...formData, addressTo: e.target.value })}
          />
        </div>
      </div>
    </div>

    <p className="text-xs text-muted-foreground text-center">
      💡 Tipp: Genaue Adressen = präzisere Offerten
    </p>
  </div>
);

// Step 2: Details
const Step2Details: FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}> = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">Ihr Umzugsgut</h2>
      <p className="text-muted-foreground">Wählen Sie die passende Erfassung</p>
    </div>

    {/* Hybrid Selection */}
    <div className="flex bg-muted rounded-lg p-1 mb-6">
      <button
        type="button"
        onClick={() => setFormData({ ...formData, estimateMethod: 'quick' })}
        className={cn(
          "flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all",
          formData.estimateMethod === 'quick'
            ? "bg-background shadow text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        ⚡ Schnelle Schätzung
      </button>
      <button
        type="button"
        onClick={() => setFormData({ ...formData, estimateMethod: 'detailed' })}
        className={cn(
          "flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all",
          formData.estimateMethod === 'detailed'
            ? "bg-background shadow text-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        📋 Detaillierte Liste
      </button>
    </div>

    {formData.estimateMethod === 'quick' ? (
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block">Wohnungsgrösse</Label>
          <select
            value={formData.roomCount}
            onChange={(e) => setFormData({ ...formData, roomCount: Number(e.target.value) })}
            className="w-full px-4 py-3 rounded-md border bg-background text-base"
          >
            {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6].map(r => (
              <option key={r} value={r}>{r} Zimmer</option>
            ))}
            <option value={7}>Grösser als 6 Zimmer</option>
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            Für Effizienz-Maximierer: In 5 Sekunden zum Richtwert
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">Stockwerk (Von)</Label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3, 4, 5].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormData({ ...formData, floorFrom: f })}
                  className={cn(
                    "py-3 rounded-lg border text-sm font-medium transition-all",
                    formData.floorFrom === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  {f === 0 ? 'EG' : `${f}.`}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">Stockwerk (Nach)</Label>
            <div className="grid grid-cols-4 gap-2">
              {[0, 1, 2, 3, 4, 5].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormData({ ...formData, floorTo: f })}
                  className={cn(
                    "py-3 rounded-lg border text-sm font-medium transition-all",
                    formData.floorTo === f
                      ? "bg-primary text-primary-foreground border-primary"
                      : "hover:bg-muted/50"
                  )}
                >
                  {f === 0 ? 'EG' : `${f}.`}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <label className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
            formData.liftFrom ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
          )}>
            <Checkbox
              checked={formData.liftFrom}
              onCheckedChange={(checked) => setFormData({ ...formData, liftFrom: !!checked })}
            />
            <span className="text-sm">🛗 Lift (Von)</span>
          </label>
          <label className={cn(
            "flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
            formData.liftTo ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
          )}>
            <Checkbox
              checked={formData.liftTo}
              onCheckedChange={(checked) => setFormData({ ...formData, liftTo: !!checked })}
            />
            <span className="text-sm">🛗 Lift (Nach)</span>
          </label>
        </div>
      </div>
    ) : (
      <div className="bg-muted/50 rounded-lg p-6 text-center">
        <Package className="h-12 w-12 mx-auto text-primary mb-4" />
        <h3 className="font-semibold mb-2">Detaillierte Inventarliste</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Für Sicherheits-Sucher: Je genauer die Liste, desto präziser die Fixpreis-Offerte.
        </p>
        <p className="text-xs text-muted-foreground">
          [Inventarliste mit Kategorien: Wohnzimmer, Küche, Schlafzimmer, etc.]
        </p>
      </div>
    )}
  </div>
);

// Step 3: Services
const Step3Services: FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}> = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">Wann & wie umziehen?</h2>
      <p className="text-muted-foreground">Datum und Zusatzleistungen wählen</p>
    </div>

    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-primary" />
          Gewünschtes Umzugsdatum
        </Label>
        <Input
          type="date"
          value={formData.moveDate}
          onChange={(e) => setFormData({ ...formData, moveDate: e.target.value })}
          className="w-full"
        />
      </div>

      <label className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 cursor-pointer">
        <Checkbox
          checked={formData.dateIsFlexible}
          onCheckedChange={(checked) => setFormData({ ...formData, dateIsFlexible: !!checked })}
        />
        <div>
          <span className="text-sm font-medium">Datum ist flexibel</span>
          <span className="text-xs text-green-700 dark:text-green-400 block">
            💰 +/- 1 Woche für besseren Preis
          </span>
        </div>
      </label>
    </div>

    <div className="space-y-3">
      <Label className="text-sm font-medium block">Zusatzleistungen</Label>
      <p className="text-xs text-muted-foreground -mt-2 mb-3">
        Für Chaos-Manager: Geben Sie alle Sorgen ab
      </p>

      <div className="grid gap-2">
        {[
          { id: 'furniture', label: 'Möbel De-/Montage', icon: Truck },
          { id: 'packing', label: 'Ein- & Auspacken', icon: Package },
          { id: 'cleaning', label: 'Endreinigung mit Abnahmegarantie', icon: Sparkles, highlight: true },
          { id: 'storage', label: 'Möbellagerung', icon: Home },
        ].map((service) => (
          <label
            key={service.id}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
              formData.services[service.id as keyof typeof formData.services]
                ? "bg-primary/5 border-primary"
                : "hover:bg-muted/50",
              service.highlight && "ring-1 ring-green-500/50"
            )}
          >
            <Checkbox
              checked={formData.services[service.id as keyof typeof formData.services]}
              onCheckedChange={(checked) => setFormData({
                ...formData,
                services: { ...formData.services, [service.id]: !!checked }
              })}
            />
            <service.icon className="h-4 w-4 text-primary" />
            <span className="text-sm flex-1">{service.label}</span>
            {service.highlight && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Mit Garantie
              </Badge>
            )}
          </label>
        ))}
      </div>
    </div>
  </div>
);

// Step 4: Contact
const Step4Contact: FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}> = ({ formData, setFormData }) => (
  <div className="space-y-6 animate-in fade-in duration-300">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold mb-2">Fast geschafft! 🎉</h2>
      <p className="text-muted-foreground">
        Wohin dürfen wir Ihre kostenlosen Offerten senden?
      </p>
    </div>

    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
          <User className="h-4 w-4 text-primary" />
          Name
        </Label>
        <Input
          type="text"
          placeholder="Max Muster"
          value={formData.contact.name}
          onChange={(e) => setFormData({
            ...formData,
            contact: { ...formData.contact, name: e.target.value }
          })}
        />
      </div>

      <div>
        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Mail className="h-4 w-4 text-primary" />
          E-Mail
        </Label>
        <Input
          type="email"
          placeholder="max@beispiel.ch"
          value={formData.contact.email}
          onChange={(e) => setFormData({
            ...formData,
            contact: { ...formData.contact, email: e.target.value }
          })}
        />
      </div>

      <div>
        <Label className="text-sm font-medium flex items-center gap-2 mb-2">
          <Phone className="h-4 w-4 text-primary" />
          Telefon
        </Label>
        <Input
          type="tel"
          placeholder="+41 79 123 45 67"
          value={formData.contact.phone}
          onChange={(e) => setFormData({
            ...formData,
            contact: { ...formData.contact, phone: e.target.value }
          })}
        />
      </div>
    </div>

    {/* Summary */}
    <div className="bg-muted/50 rounded-lg p-4 mt-6">
      <h4 className="text-sm font-medium mb-2">Ihre Anfrage im Überblick:</h4>
      <div className="text-xs text-muted-foreground space-y-1">
        <p><span className="font-medium">Von:</span> {formData.postalFrom} {formData.addressFrom || 'N/A'}</p>
        <p><span className="font-medium">Nach:</span> {formData.postalTo} {formData.addressTo || 'N/A'}</p>
        <p><span className="font-medium">Umfang:</span> {formData.roomCount} Zimmer</p>
        <p><span className="font-medium">Datum:</span> {formData.moveDate} {formData.dateIsFlexible && '(flexibel)'}</p>
      </div>
    </div>

    <TrustBadges />
  </div>
);

// Confirmation Screen
const ConfirmationScreen: FC = () => (
  <div className="text-center py-8 animate-in fade-in duration-500">
    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/40 dark:to-emerald-900/30 flex items-center justify-center mx-auto mb-6 shadow-lg">
      <CheckCircle2 className="h-12 w-12 text-green-600" />
    </div>
    
    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
      Vielen Dank!
    </h2>
    <p className="text-muted-foreground mb-8 text-lg">
      Ihre Anfrage wurde erfolgreich übermittelt.
    </p>

    <div className="bg-gradient-to-br from-muted/50 to-muted/80 rounded-xl p-6 text-left max-w-md mx-auto border shadow-sm">
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
        <Clock className="h-5 w-5 text-primary" />
        Was passiert als Nächstes?
      </h3>
      <ol className="space-y-4 text-sm">
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow">1</span>
          <div>
            <p className="font-medium">Weiterleitung an Profis</p>
            <p className="text-muted-foreground text-xs">Wir leiten Ihre Anfrage an bis zu 5 geprüfte Umzugsfirmen weiter.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow">2</span>
          <div>
            <p className="font-medium">Offerten erhalten</p>
            <p className="text-muted-foreground text-xs">Die Firmen melden sich mit massgeschneiderten Offerten.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow">3</span>
          <div>
            <p className="font-medium">Vergleichen & Sparen</p>
            <p className="text-muted-foreground text-xs">Sie vergleichen und wählen das beste Angebot. 100% kostenlos!</p>
          </div>
        </li>
      </ol>
    </div>

    <div className="mt-8 flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        📧 Bestätigung wurde an Ihre E-Mail gesendet.
      </p>
      <TrustBadges />
    </div>
  </div>
);

// Main Component
export const UltimateSwissFlow: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    addressFrom: '',
    postalFrom: '',
    addressTo: '',
    postalTo: '',
    estimateMethod: 'quick',
    roomCount: 2.5,
    floorFrom: 1,
    floorTo: 1,
    liftFrom: false,
    liftTo: false,
    moveDate: new Date().toISOString().split('T')[0],
    dateIsFlexible: false,
    services: { packing: false, cleaning: false, storage: false, furniture: false },
    contact: { name: '', email: '', phone: '' },
  });

  const steps = ["Adressen", "Umfang", "Services", "Kontakt"];
  const totalSteps = steps.length;

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps + 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.postalFrom.length >= 4 && formData.postalTo.length >= 4;
      case 4:
        return (
          formData.contact.name.length > 1 &&
          formData.contact.email.includes('@') &&
          formData.contact.phone.length > 5
        );
      default:
        return true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare data for leads table
      const leadData = {
        name: formData.contact.name,
        email: formData.contact.email,
        phone: formData.contact.phone || null,
        from_postal: formData.postalFrom,
        from_city: formData.addressFrom || formData.postalFrom,
        to_postal: formData.postalTo,
        to_city: formData.addressTo || formData.postalTo,
        move_date: formData.moveDate || null,
        calculator_type: 'ultimate-best36',
        lead_source: 'ultimate-swiss-flow',
        calculator_input: {
          postalFrom: formData.postalFrom,
          postalTo: formData.postalTo,
          addressFrom: formData.addressFrom,
          addressTo: formData.addressTo,
          roomCount: formData.roomCount,
          floorFrom: formData.floorFrom,
          floorTo: formData.floorTo,
          liftFrom: formData.liftFrom,
          liftTo: formData.liftTo,
          services: formData.services,
          dateIsFlexible: formData.dateIsFlexible,
          estimateMethod: formData.estimateMethod,
        },
        calculator_output: {
          flowVersion: 'ultimate-best36',
          submittedAt: new Date().toISOString(),
        },
      };

      const { error } = await supabase.from('leads').insert(leadData);

      if (error) {
        console.error('Lead submission error:', error);
        toast.error('Fehler beim Absenden. Bitte versuchen Sie es erneut.');
        setIsSubmitting(false);
        return;
      }

      toast.success('Anfrage erfolgreich gesendet!');
      nextStep();
    } catch (err) {
      console.error('Submission error:', err);
      toast.error('Ein Fehler ist aufgetreten.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 overflow-x-hidden">
      <div className="max-w-xl mx-auto px-4 pb-52 sm:pb-44 md:pb-36">
        {/* Header */}
        <header className="py-6 text-center">
          <TrustBadges compact />
        </header>

        {/* Progress */}
        {currentStep <= totalSteps && (
          <ProgressBar steps={steps} currentStep={currentStep} />
        )}

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="mt-6">
          {currentStep === 1 && <Step1Addresses formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <Step2Details formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <Step3Services formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <Step4Contact formData={formData} setFormData={setFormData} />}
          {currentStep > totalSteps && <ConfirmationScreen />}
        </form>
      </div>

      {/* Sticky Footer CTA */}
      {currentStep <= totalSteps && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t shadow-lg">
          <div className="max-w-xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Zurück
                </Button>
              ) : (
                <TrustBadges compact />
              )}

              <div className="flex-1" />

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="gap-2 min-w-[120px]"
                >
                  Weiter
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="gap-2 min-w-[180px] bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>Wird gesendet...</>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Offerten erhalten
                    </>
                  )}
                </Button>
              )}
            </div>

            {currentStep === totalSteps && (
              <p className="text-xs text-muted-foreground text-center mt-3">
                100% kostenlos & unverbindlich · Ihre Daten sind sicher
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UltimateSwissFlow;
