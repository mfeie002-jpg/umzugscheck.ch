/**
 * V3a - Feedback-Based Extended (Pro)
 * 
 * Based on ChatGPT UX analysis implementing:
 * - Consistent "Sie" addressing (no "Ihr" mixing)
 * - Clear slider labels with delegation explanation
 * - Mobile-stacked address inputs
 * - CTA "Kostenlos Offerten erhalten" instead of "Jetzt buchen"
 * - Price shown as "Preisrahmen" not conflicting "Fixpreis + Range"
 * - Flexible date option
 * - Step 3 as "So geht's weiter" not "Buchung"
 * - Trust microcopy under CTA
 * - Phone field explained
 */

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Shield, 
  Clock, 
  Star, 
  Phone,
  Mail,
  User,
  MapPin,
  Calendar,
  Home,
  Truck,
  Package,
  Sparkles,
  Info,
  CheckCircle,
  ArrowLeftRight
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

export const V3aFeedbackBased: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [delegation, setDelegation] = useState(65);
  const [rooms, setRooms] = useState('3');
  const [fromZip, setFromZip] = useState('');
  const [fromCity, setFromCity] = useState('');
  const [toZip, setToZip] = useState('');
  const [toCity, setToCity] = useState('');
  const [dateFlexible, setDateFlexible] = useState(false);
  const [moveDate, setMoveDate] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  
  const progress = (currentStep / STEPS.length) * 100;
  
  // Calculate price range based on delegation and rooms
  const roomMultiplier = { 'studio': 0.6, '2': 0.8, '3': 1, '4': 1.3, '5': 1.6, '6+': 2 };
  const basePrice = 1500 + (delegation / 100) * 2000;
  const priceMin = Math.round(basePrice * (roomMultiplier[rooms as keyof typeof roomMultiplier] || 1) / 10) * 10;
  const priceMax = Math.round(priceMin * 1.4 / 10) * 10;
  
  const getDelegationLabel = () => {
    if (delegation < 30) return 'Selbst organisiert';
    if (delegation < 50) return 'Basis-Service';
    if (delegation < 70) return 'Standard';
    if (delegation < 85) return 'Komfort';
    return 'Rundum-Sorglos';
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return rooms !== '';
      case 2: return fromZip && toZip;
      case 3: return true;
      case 4: return name && email && consent;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRoomLabel = () => {
    const room = ROOM_OPTIONS.find(r => r.value === rooms);
    return room ? room.label : '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-28">
      {/* Clean header with progress */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Schritt {currentStep} von {STEPS.length}
            </span>
            <Badge variant="secondary" className="text-xs">
              V3.a Pro
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step indicators */}
          <div className="flex justify-between mt-3">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-1 text-xs transition-colors ${
                  step.id === currentStep
                    ? 'text-primary font-medium'
                    : step.id < currentStep
                    ? 'text-primary/60'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  step.id < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id === currentStep
                    ? 'bg-primary/20 text-primary border border-primary'
                    : 'bg-muted'
                }`}>
                  {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
                </div>
                <span className="hidden sm:inline">{step.shortTitle}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        
        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Wie viel möchten Sie delegieren?</h1>
              <p className="text-muted-foreground">
                Je mehr Sie delegieren, desto mehr Leistungen sind enthalten
              </p>
            </div>
            
            {/* Delegation Slider */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Slider labels - consistent "Sie" addressing */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Ich mache mehr selbst</span>
                    <span>Team übernimmt mehr</span>
                  </div>
                  
                  <Slider
                    value={[delegation]}
                    onValueChange={(v) => setDelegation(v[0])}
                    min={10}
                    max={100}
                    step={5}
                    className="py-4"
                  />
                  
                  {/* Delegation explanation */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{delegation}%</div>
                    <div className="text-lg font-medium">{getDelegationLabel()}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Delegation an das Umzugsteam
                    </p>
                  </div>
                  
                  {/* Service level indicators */}
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-center text-muted-foreground">
                    <div className={delegation >= 10 ? 'text-primary font-medium' : ''}>Budget</div>
                    <div className={delegation >= 30 ? 'text-primary font-medium' : ''}>Basis</div>
                    <div className={delegation >= 50 ? 'text-primary font-medium' : ''}>Standard</div>
                    <div className={delegation >= 70 ? 'text-primary font-medium' : ''}>Komfort</div>
                    <div className={delegation >= 90 ? 'text-primary font-medium' : ''}>Premium</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Room Selection with Label */}
            <Card>
              <CardContent className="p-6">
                <Label className="text-sm font-medium mb-3 block">
                  Wohnungsgrösse
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {ROOM_OPTIONS.map((room) => (
                    <button
                      key={room.value}
                      onClick={() => setRooms(room.value)}
                      className={`p-3 rounded-lg border-2 text-center font-medium transition-all ${
                        rooms === room.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Price Preview - "Preisrahmen" not "Fixpreis" */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground">Geschätzter Preisrahmen</div>
                    <div className="text-xl font-bold">
                      CHF {priceMin.toLocaleString('de-CH')} – {priceMax.toLocaleString('de-CH')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getRoomLabel()} • {getDelegationLabel()}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className="text-xs gap-1">
                      <Shield className="h-3 w-3" />
                      Versichert
                    </Badge>
                    <Badge variant="outline" className="text-xs gap-1">
                      <Star className="h-3 w-3" />
                      4.8/5
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Details - Mobile stacked layout */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Wohin geht Ihr Umzug?</h1>
              <p className="text-muted-foreground">
                3 Angaben. Mehr brauchen wir nicht.
              </p>
            </div>
            
            {/* Addresses - stacked on mobile for full visibility */}
            <Card>
              <CardContent className="p-6 space-y-4">
                {/* From Address */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Von (Auszugsort)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="PLZ"
                      value={fromZip}
                      onChange={(e) => setFromZip(e.target.value)}
                      className="w-24"
                      maxLength={4}
                    />
                    <Input
                      placeholder="Stadt"
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                {/* Swap icon */}
                <div className="flex justify-center">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const tempZip = fromZip;
                      const tempCity = fromCity;
                      setFromZip(toZip);
                      setFromCity(toCity);
                      setToZip(tempZip);
                      setToCity(tempCity);
                    }}
                    className="text-muted-foreground"
                  >
                    <ArrowLeftRight className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* To Address */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-green-600" />
                    Nach (Einzugsort)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="PLZ"
                      value={toZip}
                      onChange={(e) => setToZip(e.target.value)}
                      className="w-24"
                      maxLength={4}
                    />
                    <Input
                      placeholder="Stadt"
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Date - with flexible option */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Wunschtermin
                </Label>
                
                {!dateFlexible && (
                  <Input
                    type="date"
                    value={moveDate}
                    onChange={(e) => setMoveDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                )}
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="flexible"
                    checked={dateFlexible}
                    onCheckedChange={(checked) => setDateFlexible(checked as boolean)}
                  />
                  <label htmlFor="flexible" className="text-sm cursor-pointer">
                    Termin noch offen / flexibel
                  </label>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary reminder */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
              <span className="text-muted-foreground">Ihre Auswahl:</span>
              <span className="font-medium">{getRoomLabel()} • {getDelegationLabel()}</span>
            </div>
          </div>
        )}

        {/* Step 3: "So geht's weiter" - not "Buchung" */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">So geht's weiter</h1>
              <p className="text-muted-foreground">
                Nach Ihrer Anfrage passiert Folgendes
              </p>
            </div>
            
            {/* Process steps - aligned with "Offerten vergleichen" messaging */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { 
                      icon: Mail, 
                      title: 'Bestätigung per E-Mail',
                      desc: 'Sie erhalten sofort eine Bestätigung'
                    },
                    { 
                      icon: Truck, 
                      title: 'Anfrage an geprüfte Firmen',
                      desc: '3–5 passende Umzugsfirmen erhalten Ihre Anfrage'
                    },
                    { 
                      icon: Package, 
                      title: 'Offerten erhalten',
                      desc: 'Innerhalb von 24h erhalten Sie unverbindliche Offerten'
                    },
                    { 
                      icon: CheckCircle, 
                      title: 'Sie entscheiden',
                      desc: 'Vergleichen Sie die Offerten und wählen Sie die beste'
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-sm text-muted-foreground">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Trust elements */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: 'Vollkasko versichert' },
                { icon: Clock, label: 'Pünktlichkeitsgarantie' },
                { icon: Star, label: '4.8/5 Bewertung' },
                { icon: Check, label: 'Geprüfte Teams' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route:</span>
                    <span className="font-medium">{fromZip || '—'} → {toZip || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wohnung:</span>
                    <span className="font-medium">{getRoomLabel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{getDelegationLabel()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="text-muted-foreground">Preisrahmen:</span>
                    <span className="font-bold text-primary">
                      CHF {priceMin.toLocaleString('de-CH')} – {priceMax.toLocaleString('de-CH')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 4: Contact - with trust microcopy */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Letzte Angaben 🎉</h1>
              <p className="text-muted-foreground">
                Wir brauchen nur noch Ihre Kontaktdaten
              </p>
            </div>
            
            {/* Contact Form */}
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Name
                  </Label>
                  <Input
                    placeholder="Ihr Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    E-Mail
                  </Label>
                  <Input
                    type="email"
                    placeholder="ihre@email.ch"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                {/* Phone with explanation */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Telefon
                    <span className="text-xs text-muted-foreground font-normal">
                      (für Rückfragen der Firmen)
                    </span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="079 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                
                {/* Consent */}
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label htmlFor="consent" className="text-xs text-muted-foreground cursor-pointer">
                    Ich akzeptiere die Datenschutzerklärung und bin damit einverstanden, 
                    dass meine Daten an passende Umzugsfirmen weitergeleitet werden.
                  </label>
                </div>
              </CardContent>
            </Card>
            
            {/* Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Route:</span>
                    <span>{fromZip} {fromCity} → {toZip} {toCity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Wohnung:</span>
                    <span>{getRoomLabel()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Termin:</span>
                    <span>{dateFlexible ? 'Flexibel' : moveDate || '—'}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="text-muted-foreground">Preisrahmen:</span>
                    <span className="font-bold">
                      CHF {priceMin.toLocaleString('de-CH')} – {priceMax.toLocaleString('de-CH')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trust microcopy - directly visible */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                Kostenlos & unverbindlich
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                Keine Newsletter
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3 text-green-600" />
                3–5 Offerten in 24h
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              className="h-14"
              onClick={handleBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Button
            size="lg"
            className="flex-1 h-14 text-base"
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === STEPS.length ? (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Kostenlos Offerten erhalten
              </>
            ) : (
              <>
                Weiter
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default V3aFeedbackBased;
