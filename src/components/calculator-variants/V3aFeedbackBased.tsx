/**
 * V3a - ChatGPT Thinking Feedback Variante
 * 
 * Basiert auf detaillierter ChatGPT UX-Analyse mit:
 * 
 * TOP 10 FIXES IMPLEMENTIERT:
 * 1. Wording "Buchung" → "Anfrage/Offerten" überall
 * 2. Mobile CTA-Zone geschützt (keine Overlaps)
 * 3. Funnel-Layout entschlackt (keine Navigation im Flow)
 * 4. Step 1 = One Decision (Slider fokussiert)
 * 5. Desktop CTA immer sichtbar (sticky)
 * 6. Preis-Kommunikation klar ("Preisindikator", Range)
 * 7. Trust-Stack erweitert (Testimonials, Partner-Hinweis)
 * 8. Datum flexibilisiert (Fixdatum vs Flexibel)
 * 9. Lead-Qualität ohne Friction (optional Details)
 * 10. Danke-Seite Erwartungsmanagement
 * 
 * Quick Wins Copy:
 * - Step 1: "In 60 Sekunden zu bis zu 5 Offerten"
 * - Step 3: "Was passiert nach der Anfrage?"
 * - Step 4 CTA: "Gratis Offerten erhalten"
 * - Step 4 Subline: "Max. 5 geprüfte Umzugsfirmen • kostenlos & unverbindlich • keine Werbung"
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
  ArrowLeftRight,
  Award,
  Users,
  Lock
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

// Trust testimonials
const TESTIMONIALS = [
  { name: "M. Keller", location: "Zürich", text: "Schnell, günstig, professionell!", rating: 5 },
  { name: "S. Brunner", location: "Bern", text: "Super Service, klare Empfehlung.", rating: 5 },
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
  const [isSubmitted, setIsSubmitted] = useState(false);
  
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
    } else if (currentStep === STEPS.length && canProceed()) {
      // Submit
      setIsSubmitted(true);
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

  // Success/Thank you screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">Anfrage gesendet!</h1>
              <p className="text-muted-foreground">
                Vielen Dank, {name}. Ihre Anfrage wurde erfolgreich übermittelt.
              </p>
            </div>
            
            {/* Expectations - What happens now */}
            <div className="text-left space-y-3 bg-muted/50 rounded-lg p-4">
              <h3 className="font-semibold text-sm">Was passiert jetzt?</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <span className="font-medium">Bestätigung per E-Mail</span>
                    <span className="text-muted-foreground"> – in wenigen Minuten</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <span className="font-medium">3–5 Offerten</span>
                    <span className="text-muted-foreground"> – innerhalb von 24h</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <span className="font-medium">Sie vergleichen & entscheiden</span>
                    <span className="text-muted-foreground"> – unverbindlich</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Bei Fragen erreichen Sie uns unter info@umzugscheck.ch
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 pb-28">
      {/* Clean header with progress - NO navigation links */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {/* Quick Win Badge */}
          <div className="flex items-center justify-between mb-2">
            <Badge variant="secondary" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              In 60 Sekunden zu bis zu 5 Offerten
            </Badge>
            <Badge variant="outline" className="text-xs">
              V3.a
            </Badge>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Schritt {currentStep} von {STEPS.length}
            </span>
            <span className="text-xs text-muted-foreground">
              Kostenlos & unverbindlich
            </span>
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
        
        {/* Step 1: Service Selection - ONE DECISION focus */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Wie viel möchten Sie delegieren?</h1>
              <p className="text-muted-foreground">
                Ziehen Sie den Regler – wir matchen Sie mit passenden Firmen
              </p>
            </div>
            
            {/* Rating badge at start - Trust */}
            <div className="flex justify-center">
              <Badge variant="outline" className="gap-1 px-3 py-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">4.9/5</span>
                <span className="text-muted-foreground">• 15'247 Bewertungen</span>
              </Badge>
            </div>
            
            {/* Delegation Slider - Primary Action */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {/* Slider labels */}
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      Ich mache mehr selbst
                    </span>
                    <span className="flex items-center gap-1">
                      Team übernimmt mehr
                      <Truck className="h-4 w-4" />
                    </span>
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
                  
                  {/* Service level indicators - clickable */}
                  <div className="grid grid-cols-5 gap-1 text-[10px] text-center text-muted-foreground">
                    {[
                      { label: 'Budget', min: 10 },
                      { label: 'Basis', min: 30 },
                      { label: 'Standard', min: 50 },
                      { label: 'Komfort', min: 70 },
                      { label: 'Premium', min: 90 },
                    ].map((tier) => (
                      <button
                        key={tier.label}
                        onClick={() => setDelegation(tier.min)}
                        className={`py-1 rounded transition-colors ${
                          delegation >= tier.min ? 'text-primary font-medium bg-primary/5' : ''
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Room Selection - Secondary decision */}
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
                      className={`p-3 rounded-lg border-2 text-center font-medium transition-all min-h-[48px] min-w-[48px] ${
                        rooms === room.value
                          ? 'border-primary bg-primary/10 text-primary ring-2 ring-primary ring-offset-2'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {room.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Price Preview - Clear "Preisindikator" */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="h-3 w-3" />
                      Geschätzter Preisrahmen
                    </div>
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
                      <Lock className="h-3 w-3" />
                      Keine versteckten Kosten
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Trust signals row */}
            <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3 text-green-600" />
                Vollkasko-Versicherung
              </div>
              <div className="flex items-center gap-1">
                <Award className="h-3 w-3 text-green-600" />
                85+ geprüfte Firmen
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 text-green-600" />
                200'000+ Umzüge
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Details - Minimal, 3 fields */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Wohin geht Ihr Umzug?</h1>
              <p className="text-muted-foreground">
                3 Angaben. Mehr brauchen wir nicht.
              </p>
            </div>
            
            {/* Addresses - stacked for full visibility */}
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
                    className="text-muted-foreground min-h-[48px] min-w-[48px]"
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
                    placeholder="TT.MM.JJJJ"
                  />
                )}
                
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="flexible"
                    checked={dateFlexible}
                    onCheckedChange={(checked) => setDateFlexible(checked as boolean)}
                    className="h-5 w-5"
                  />
                  <label htmlFor="flexible" className="text-sm cursor-pointer">
                    Termin noch offen / flexibel
                  </label>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Kein fixes Datum? Kein Problem – die Firmen melden sich mit verfügbaren Terminen.
                </p>
              </CardContent>
            </Card>
            
            {/* Summary reminder */}
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
              <span className="text-muted-foreground">Ihre Auswahl:</span>
              <span className="font-medium">{getRoomLabel()} • {getDelegationLabel()}</span>
            </div>
          </div>
        )}

        {/* Step 3: "Was passiert nach der Anfrage?" - NOT "Buchung" */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Was passiert nach der Anfrage?</h1>
              <p className="text-muted-foreground">
                So geht's weiter – transparent und unverbindlich
              </p>
            </div>
            
            {/* Process steps */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { 
                      icon: Mail, 
                      title: 'Bestätigung per E-Mail',
                      desc: 'Sie erhalten sofort eine Bestätigung Ihrer Anfrage'
                    },
                    { 
                      icon: Truck, 
                      title: 'Anfrage an geprüfte Firmen',
                      desc: 'Max. 5 passende Umzugsfirmen erhalten Ihre Anfrage'
                    },
                    { 
                      icon: Package, 
                      title: 'Offerten erhalten',
                      desc: 'Innerhalb von 24h erhalten Sie unverbindliche Offerten'
                    },
                    { 
                      icon: CheckCircle, 
                      title: 'Sie entscheiden frei',
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
                { icon: Star, label: '4.9/5 Bewertung' },
                { icon: Check, label: 'Geprüfte Teams' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
            </div>
            
            {/* Testimonials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TESTIMONIALS.map((t, i) => (
                <Card key={i} className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex mb-2">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm italic mb-2">"{t.text}"</p>
                    <p className="text-xs text-muted-foreground">{t.name}, {t.location}</p>
                  </CardContent>
                </Card>
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

        {/* Step 4: Contact - CTA "Gratis Offerten erhalten" */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Letzte Angaben 🎉</h1>
              <p className="text-muted-foreground">
                Wohin dürfen wir die Offerten senden?
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
                      (optional – für Rückfragen)
                    </span>
                  </Label>
                  <Input
                    type="tel"
                    placeholder="079 123 45 67"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Nur für Rückfragen der Umzugsfirmen – keine Werbeanrufe
                  </p>
                </div>
                
                {/* Consent - larger, clearer */}
                <div className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-colors ${
                  consent ? 'border-primary bg-primary/5' : 'border-muted'
                }`}>
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(checked) => setConsent(checked as boolean)}
                    className="mt-0.5 h-5 w-5"
                  />
                  <label htmlFor="consent" className="text-sm cursor-pointer">
                    <span className="font-medium">Ich akzeptiere die Datenschutzerklärung</span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ihre Daten werden ausschliesslich an max. 5 passende Umzugsfirmen weitergeleitet. 
                      <strong> Keine Werbung, kein Newsletter, kein Spam.</strong>
                    </p>
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
            
            {/* Trust microcopy - Quick Win */}
            <div className="text-center text-xs text-muted-foreground space-y-1">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  Max. 5 geprüfte Umzugsfirmen
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  Kostenlos & unverbindlich
                </span>
                <span className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-600" />
                  Keine Werbung
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom navigation - Protected CTA zone */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="max-w-2xl mx-auto flex gap-3">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              className="h-14 min-h-[48px] min-w-[48px]"
              onClick={handleBack}
              aria-label="Zurück zum vorherigen Schritt"
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
                Gratis Offerten erhalten
              </>
            ) : currentStep === 1 ? (
              <>
                Offerten vergleichen
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            ) : currentStep === 2 ? (
              <>
                Zusammenfassung anzeigen
                <ArrowRight className="h-5 w-5 ml-2" />
              </>
            ) : (
              <>
                Kontaktdaten eingeben
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
