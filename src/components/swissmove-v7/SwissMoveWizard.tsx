import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, MapPin, Home, Truck, Users, Package, Sparkles, 
  Shield, Star, Clock, Lock, Check, ChevronRight, ChevronLeft,
  MessageCircle, Phone, Mail, ArrowRight, Zap, Heart, Award,
  Navigation, Camera, Bell, FileText, Settings, HelpCircle
} from 'lucide-react';
import { CountUp } from '@/components/ui/animated-counter';
import { useCaptureMode } from "@/hooks/use-capture-mode";

type Step = 'landing' | 'configure' | 'checkout' | 'dashboard' | 'tracking';

interface BookingData {
  moveDate: string;
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  propertySize: 'studio' | '2room' | '3room' | '4room' | 'house';
  serviceTier: number;
  addons: {
    packing: boolean;
    cleaning: boolean;
    assembly: boolean;
    disposal: boolean;
    storageDays: number;
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: 'after' | 'now' | 'installments';
}

const SERVICE_TIERS = [
  { 
    value: 0, 
    name: 'Selbstmacher', 
    label: 'DIY',
    description: 'Du packst und trägst – wir fahren',
    includes: ['Transporter mit Fahrer', 'Grundversicherung'],
    excludes: ['Träger', 'Packservice', 'Montage'],
    multiplier: 0.4
  },
  { 
    value: 30, 
    name: 'Entlastet', 
    label: 'Basis',
    description: 'Du packst – wir tragen und montieren',
    includes: ['Professionelle Crew (2-3 P.)', 'Transport', 'Möbelmontage', 'Versicherung'],
    excludes: ['Packservice', 'Endreinigung'],
    multiplier: 1.0
  },
  { 
    value: 70, 
    name: 'Komfort', 
    label: 'Beliebt',
    description: 'Rundum-sorglos – nur Wertsachen packst du',
    includes: ['Professionelle Crew (3-4 P.)', 'Packservice', 'Transport', 'Möbelmontage', 'Versicherung Plus'],
    excludes: ['Endreinigung', 'Entsorgung'],
    multiplier: 2.1,
    popular: true
  },
  { 
    value: 100, 
    name: 'White Glove', 
    label: 'Premium',
    description: 'Schlüssel abgeben – alles andere erledigen wir',
    includes: ['VIP Crew (4-5 P.)', 'Vollständiger Packservice', 'Transport', 'Möbelmontage', 'Endreinigung', 'Premium-Versicherung', 'Concierge-Service'],
    excludes: [],
    multiplier: 4.8
  }
];

const PROPERTY_SIZES = [
  { value: 'studio', label: 'Studio', icon: '🏠', volume: 15, rooms: '1' },
  { value: '2room', label: '2-Zi', icon: '🏠🏠', volume: 25, rooms: '2' },
  { value: '3room', label: '3-Zi', icon: '🏠🏠🏠', volume: 40, rooms: '3-4' },
  { value: '4room', label: '4+ Zi', icon: '🏠🏠🏠🏠', volume: 60, rooms: '4+' },
  { value: 'house', label: 'Haus', icon: '🏡', volume: 100, rooms: '5+' }
];

const ADDONS = [
  { key: 'packing', label: 'Packservice', price: 680, description: 'Profis packen alles sicher ein' },
  { key: 'cleaning', label: 'Endreinigung', price: 480, description: 'Abgabefertig gereinigt' },
  { key: 'assembly', label: 'Möbelmontage', price: 320, description: 'Ab- und Aufbau aller Möbel' },
  { key: 'disposal', label: 'Entsorgung', price: 280, description: 'Wir entsorgen Ungewolltes' }
];

const CREW_MEMBERS = [
  { id: 1, name: 'Marc Keller', role: 'Teamleiter', rating: 4.9, moves: 847, photo: '👨‍💼', specialties: ['Klaviere', 'Antiquitäten'] },
  { id: 2, name: 'Lukas Weber', role: 'Umzugshelfer', rating: 4.8, moves: 523, photo: '👷', specialties: ['Schwertransporte'] },
  { id: 3, name: 'Nina Schmid', role: 'Umzugshelferin', rating: 5.0, moves: 312, photo: '👩‍🔧', specialties: ['Verpackung', 'Organisation'] }
];

export const SwissMoveWizard = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  const [step, setStep] = useState<Step>('landing');
  const [booking, setBooking] = useState<BookingData>({
    moveDate: '',
    fromPostal: '',
    fromCity: '',
    toPostal: '',
    toCity: '',
    propertySize: '3room',
    serviceTier: 70,
    addons: {
      packing: false,
      cleaning: true,
      assembly: true,
      disposal: false,
      storageDays: 0
    },
    contact: { name: '', email: '', phone: '' },
    paymentMethod: 'after'
  });
  const [isBooked, setIsBooked] = useState(false);
  const [trackingProgress, setTrackingProgress] = useState(0);

  // Capture mode: jump to step and prefill data
  useEffect(() => {
    if (isCaptureMode && captureStep !== null) {
      const stepMap: Record<number, Step> = { 1: 'landing', 2: 'configure', 3: 'checkout', 4: 'dashboard', 5: 'tracking' };
      const targetStep = stepMap[captureStep];
      if (targetStep) {
        setStep(targetStep);
        setBooking({
          moveDate: demoData.moveDate,
          fromPostal: demoData.fromPostal,
          fromCity: demoData.fromCity,
          toPostal: demoData.toPostal,
          toCity: demoData.toCity,
          propertySize: '3room',
          serviceTier: demoData.serviceLevel,
          addons: { packing: true, cleaning: true, assembly: true, disposal: false, storageDays: 0 },
          contact: { name: demoData.name, email: demoData.email, phone: demoData.phone },
          paymentMethod: 'after'
        });
        if (captureStep >= 4) setIsBooked(true);
      }
    }
  }, [isCaptureMode, captureStep, demoData]);

  // Calculate price
  const calculatePrice = () => {
    const property = PROPERTY_SIZES.find(p => p.value === booking.propertySize);
    const tier = SERVICE_TIERS.find(t => t.value === booking.serviceTier);
    if (!property || !tier) return { base: 0, addons: 0, total: 0, breakdown: {} };

    const baseVolume = property.volume;
    const baseRate = 45; // CHF per m³
    const basePrice = Math.round(baseVolume * baseRate * tier.multiplier);
    
    let addonsTotal = 0;
    const breakdown: Record<string, number> = {
      transport: Math.round(basePrice * 0.35),
      personal: Math.round(basePrice * 0.45),
      versicherung: Math.round(basePrice * 0.08)
    };

    if (booking.addons.packing && tier.value < 70) {
      addonsTotal += 680;
      breakdown.packservice = 680;
    }
    if (booking.addons.cleaning) {
      addonsTotal += 480;
      breakdown.reinigung = 480;
    }
    if (booking.addons.assembly && tier.value < 30) {
      addonsTotal += 320;
      breakdown.montage = 320;
    }
    if (booking.addons.disposal) {
      addonsTotal += 280;
      breakdown.entsorgung = 280;
    }

    return {
      base: basePrice,
      addons: addonsTotal,
      total: basePrice + addonsTotal,
      breakdown
    };
  };

  const price = calculatePrice();
  const progress = step === 'landing' ? 20 : step === 'configure' ? 50 : step === 'checkout' ? 80 : 100;

  // Simulate tracking progress
  useEffect(() => {
    if (step === 'tracking') {
      const interval = setInterval(() => {
        setTrackingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 5;
        });
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const renderLanding = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Zap className="h-3 w-3 mr-1" />
          Schweizer Qualität
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Dein Umzug in <span className="text-primary">90 Sekunden</span> gebucht
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Ohne Stress. Ohne versteckte Kosten. Garantiert.
        </p>
      </div>

      {/* Quote Form */}
      <Card className="max-w-lg mx-auto border-2 border-primary/20 shadow-xl">
        <CardContent className="p-6 space-y-6">
          {/* Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Wann ziehst du um?
            </Label>
            <Input
              type="date"
              value={booking.moveDate}
              onChange={(e) => setBooking({ ...booking, moveDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="h-12"
            />
          </div>

          {/* From/To */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Von wo?
              </Label>
              <Input
                placeholder="PLZ oder Ort"
                value={booking.fromPostal}
                onChange={(e) => setBooking({ ...booking, fromPostal: e.target.value })}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-destructive" />
                Nach wo?
              </Label>
              <Input
                placeholder="PLZ oder Ort"
                value={booking.toPostal}
                onChange={(e) => setBooking({ ...booking, toPostal: e.target.value })}
                className="h-12"
              />
            </div>
          </div>

          {/* Property Size */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              Wie gross ist deine Wohnung?
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {PROPERTY_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setBooking({ ...booking, propertySize: size.value as any })}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    booking.propertySize === size.value
                      ? 'border-primary bg-primary/10 shadow-md'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-2xl mb-1">{size.icon}</div>
                  <div className="text-xs font-medium">{size.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Price Display */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 text-center">
            <div className="text-sm text-muted-foreground mb-1">Dein Preis</div>
            <div className="text-3xl font-bold text-primary">
              CHF <CountUp end={Math.round(price.total * 0.7)} duration={800} />–<CountUp end={price.total} duration={800} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">Fixpreis-Garantie</div>
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg"
            onClick={() => setStep('configure')}
            disabled={!booking.moveDate || !booking.fromPostal || !booking.toPostal}
          >
            Jetzt Service wählen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      {/* Trust Bar */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span>100% Geld-zurück-Garantie</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>4.9/5.0 (2'847 Bewertungen)</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <span>99.2% Pünktlichkeit</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <span>Sichere Zahlung</span>
        </div>
      </div>

      {/* How it Works */}
      <div className="pt-8">
        <h2 className="text-2xl font-bold text-center mb-8">So funktioniert's</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Calendar, title: 'Buchen', desc: 'In 90 Sekunden online' },
            { icon: Truck, title: 'Umziehen', desc: 'Wir kümmern uns um alles' },
            { icon: Heart, title: 'Geniessen', desc: 'Entspannt im neuen Zuhause' }
          ].map((item, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-muted/30">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderConfigure = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Wähle dein Service-Level</h2>
        <p className="text-muted-foreground">Wie viel möchtest du selbst machen?</p>
      </div>

      {/* Control-Delegation Slider Visual */}
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Du machst alles
          </span>
          <span className="flex items-center gap-1">
            Wir machen alles
            <Sparkles className="h-4 w-4" />
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={booking.serviceTier}
          onChange={(e) => setBooking({ ...booking, serviceTier: parseInt(e.target.value) })}
          className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-muted via-primary/50 to-primary"
          style={{
            background: `linear-gradient(to right, hsl(var(--muted)) 0%, hsl(var(--primary)) ${booking.serviceTier}%, hsl(var(--muted)) ${booking.serviceTier}%)`
          }}
        />
        <div className="flex justify-between mt-2">
          {SERVICE_TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => setBooking({ ...booking, serviceTier: tier.value })}
              className={`text-xs px-2 py-1 rounded transition-all ${
                booking.serviceTier === tier.value
                  ? 'bg-primary text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tier.value}%
            </button>
          ))}
        </div>
      </div>

      {/* Service Tier Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {SERVICE_TIERS.map((tier) => {
          const isSelected = booking.serviceTier === tier.value;
          const tierPrice = Math.round(price.base * tier.multiplier / SERVICE_TIERS.find(t => t.value === booking.serviceTier)!.multiplier);
          
          return (
            <Card 
              key={tier.value}
              className={`cursor-pointer transition-all relative ${
                isSelected 
                  ? 'border-2 border-primary shadow-lg ring-2 ring-primary/20' 
                  : 'border hover:border-primary/50 hover:shadow-md'
              }`}
              onClick={() => setBooking({ ...booking, serviceTier: tier.value })}
            >
              {tier.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                  73% wählen dies
                </Badge>
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{tier.label}</Badge>
                  {isSelected && <Check className="h-5 w-5 text-primary" />}
                </div>
                <h3 className="text-lg font-bold">{tier.name}</h3>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-primary">
                  CHF {tierPrice.toLocaleString("de-CH")}
                </div>
                <div className="space-y-1">
                  {tier.includes.slice(0, 4).map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add-ons */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h3 className="font-semibold text-lg">Zusatzleistungen (optional)</h3>
        <div className="grid grid-cols-2 gap-3">
          {ADDONS.map((addon) => (
            <label
              key={addon.key}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                booking.addons[addon.key as keyof typeof booking.addons]
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <Checkbox
                checked={booking.addons[addon.key as keyof typeof booking.addons] as boolean}
                onCheckedChange={(checked) => 
                  setBooking({ 
                    ...booking, 
                    addons: { ...booking.addons, [addon.key]: checked }
                  })
                }
              />
              <div className="flex-1">
                <div className="font-medium">{addon.label}</div>
                <div className="text-sm text-muted-foreground">{addon.description}</div>
                <div className="text-sm font-semibold text-primary mt-1">+CHF {addon.price}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Price Summary & CTA */}
      <div className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Gesamtpreis</div>
            <div className="text-3xl font-bold text-primary">
              CHF <CountUp end={price.total} duration={500} />
            </div>
          </div>
          <Button size="lg" onClick={() => setStep('checkout')}>
            Weiter zur Buchung
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Inkl. MwSt. • Fixpreis-Garantie • Kostenlose Stornierung bis 48h vorher
        </div>
      </div>

      {/* Back Button */}
      <Button variant="ghost" onClick={() => setStep('landing')} className="mx-auto flex">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Zurück
      </Button>
    </motion.div>
  );

  const renderCheckout = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-bold text-center">Buchung abschliessen</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Summary */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Zusammenfassung</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>{booking.moveDate ? new Date(booking.moveDate).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{booking.fromPostal || '-'} → {booking.toPostal || '-'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span>{PROPERTY_SIZES.find(p => p.value === booking.propertySize)?.label}-Wohnung</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span>Service-Stufe {booking.serviceTier}</span>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              {Object.entries(price.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-muted-foreground capitalize">{key}</span>
                  <span>CHF {value.toLocaleString('de-CH')}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">CHF {price.total.toLocaleString('de-CH')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Payment */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="font-semibold">Deine Daten</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input 
                  placeholder="Max Muster"
                  value={booking.contact.name}
                  onChange={(e) => setBooking({ ...booking, contact: { ...booking.contact, name: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label>E-Mail</Label>
                <Input 
                  type="email"
                  placeholder="max@example.ch"
                  value={booking.contact.email}
                  onChange={(e) => setBooking({ ...booking, contact: { ...booking.contact, email: e.target.value }})}
                />
              </div>
              <div className="space-y-2">
                <Label>Telefon</Label>
                <Input 
                  type="tel"
                  placeholder="+41 79 123 45 67"
                  value={booking.contact.phone}
                  onChange={(e) => setBooking({ ...booking, contact: { ...booking.contact, phone: e.target.value }})}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">Zahlungsmethode</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { value: 'after', label: 'Nach dem Umzug zahlen', desc: 'Standard – keine Vorauszahlung' },
                { value: 'now', label: 'Jetzt zahlen & 8% sparen', desc: `Nur CHF ${Math.round(price.total * 0.92).toLocaleString('de-CH')}` },
                { value: 'installments', label: 'Ratenzahlung', desc: 'Nur für Stufe 100', disabled: booking.serviceTier < 100 }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    booking.paymentMethod === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  } ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={booking.paymentMethod === option.value}
                    onChange={() => !option.disabled && setBooking({ ...booking, paymentMethod: option.value as any })}
                    disabled={option.disabled}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">{option.desc}</div>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Terms & Book Button */}
      <div className="space-y-4">
        <div className="flex items-start gap-2 text-sm">
          <Checkbox id="terms" />
          <label htmlFor="terms" className="text-muted-foreground">
            Ich akzeptiere die <a href="#" className="text-primary underline">AGB</a> und habe die <a href="#" className="text-primary underline">Datenschutzerklärung</a> gelesen.
          </label>
        </div>

        <Button 
          size="lg" 
          className="w-full h-14 text-lg"
          onClick={() => {
            setIsBooked(true);
            setStep('dashboard');
          }}
        >
          <Lock className="mr-2 h-5 w-5" />
          Jetzt buchen – CHF {price.total.toLocaleString('de-CH')}
        </Button>

        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            100% Geld-zurück-Garantie
          </span>
          <span className="flex items-center gap-1">
            <Lock className="h-4 w-4" />
            SSL-verschlüsselt
          </span>
        </div>
      </div>

      <Button variant="ghost" onClick={() => setStep('configure')} className="mx-auto flex">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Zurück
      </Button>
    </motion.div>
  );

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Welcome */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Willkommen zurück, {booking.contact.name || 'Umzugsprofi'}!</h2>
        <p className="text-muted-foreground">Dein Umzug ist bestätigt</p>
      </div>

      {/* Booking Status Card */}
      <Card className="border-2 border-green-200 bg-green-50/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-green-600">Bestätigt ✓</Badge>
            <span className="text-sm text-muted-foreground">
              📅 In {Math.ceil((new Date(booking.moveDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} Tagen
            </span>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Move Details */}
            <div className="space-y-3">
              <h3 className="font-semibold">Umzugsdetails</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{booking.moveDate ? new Date(booking.moveDate).toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' }) : '-'}, 08:00 Uhr</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-green-600" />
                  <span>{booking.fromPostal} → {booking.toPostal}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-primary" />
                  <span>Service-Stufe {booking.serviceTier}</span>
                </div>
              </div>
            </div>

            {/* Crew */}
            <div className="space-y-3">
              <h3 className="font-semibold">Dein Team</h3>
              <div className="space-y-2">
                {CREW_MEMBERS.map((member) => (
                  <div key={member.id} className="flex items-center gap-3 p-2 rounded-lg bg-background">
                    <span className="text-2xl">{member.photo}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span>{member.rating}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Nachricht senden
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold">Deine Checkliste</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { done: true, label: 'Buchung bestätigt', date: 'Heute' },
              { done: true, label: 'Crew zugewiesen', date: 'Heute' },
              { done: false, label: 'Kartons werden geliefert', date: 'In 3 Tagen' },
              { done: false, label: 'Inventar-Scan (optional)', date: 'Vor Umzug' },
              { done: false, label: 'Umzugstag', date: booking.moveDate ? new Date(booking.moveDate).toLocaleDateString('de-CH') : '-' }
            ].map((item, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-lg ${item.done ? 'bg-green-50' : 'bg-muted/30'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  item.done ? 'bg-green-600 text-white' : 'border-2 border-muted-foreground/30'
                }`}>
                  {item.done && <Check className="h-4 w-4" />}
                </div>
                <div className="flex-1">
                  <span className={item.done ? 'line-through text-muted-foreground' : ''}>{item.label}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.date}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={() => setStep('tracking')}>
          <Navigation className="h-4 w-4 mr-2" />
          Live-Tracking testen
        </Button>
        <Button variant="ghost">
          <Settings className="h-4 w-4 mr-2" />
          Buchung ändern
        </Button>
        <Button variant="ghost">
          <HelpCircle className="h-4 w-4 mr-2" />
          Support
        </Button>
      </div>
    </motion.div>
  );

  const renderTracking = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      <div className="text-center space-y-2">
        <Badge className="bg-green-600">
          <span className="animate-pulse mr-2">●</span>
          LIVE
        </Badge>
        <h2 className="text-2xl font-bold">Dein Umzug läuft</h2>
      </div>

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-primary/20 to-primary/5 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Truck className="h-12 w-12 text-primary mx-auto mb-2 animate-bounce" />
              <p className="text-sm text-muted-foreground">Interaktive Karte</p>
              <p className="text-xs text-muted-foreground">(GPS-Tracking aktiv)</p>
            </div>
          </div>
          
          {/* Simulated Route */}
          <div className="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>{booking.fromPostal}</span>
              </div>
              <div className="flex-1 mx-4 h-1 bg-muted rounded relative overflow-hidden">
                <motion.div 
                  className="absolute inset-y-0 left-0 bg-primary rounded"
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(trackingProgress, 100)}%` }}
                />
                <Truck className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-primary" style={{ left: `${Math.min(trackingProgress, 95)}%` }} />
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-destructive" />
                <span>{booking.toPostal}</span>
              </div>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Ankunft in ca.</div>
            <div className="text-2xl font-bold text-primary">{Math.max(5, Math.round(45 - trackingProgress * 0.4))} Minuten</div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Fortschritt</span>
              <span className="text-primary font-bold">{Math.round(trackingProgress)}%</span>
            </div>
            <Progress value={trackingProgress} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm">
              <div className={trackingProgress >= 33 ? 'text-green-600' : 'text-muted-foreground'}>
                <Check className={`h-5 w-5 mx-auto mb-1 ${trackingProgress >= 33 ? '' : 'opacity-30'}`} />
                <span>Beladen</span>
              </div>
              <div className={trackingProgress >= 66 ? 'text-green-600' : 'text-muted-foreground'}>
                <Truck className={`h-5 w-5 mx-auto mb-1 ${trackingProgress >= 66 ? '' : 'opacity-30'}`} />
                <span>Transport</span>
              </div>
              <div className={trackingProgress >= 100 ? 'text-green-600' : 'text-muted-foreground'}>
                <Home className={`h-5 w-5 mx-auto mb-1 ${trackingProgress >= 100 ? '' : 'opacity-30'}`} />
                <span>Entladen</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card>
        <CardHeader>
          <h3 className="font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Live-Updates
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: '11:23', text: 'Pause beendet – weiter gehts!' },
              { time: '11:02', text: 'Autobahnauffahrt A1 Richtung Winterthur' },
              { time: '10:45', text: 'Crew hat gestartet 🚚' },
              { time: '10:30', text: 'Beladen abgeschlossen ✓' },
              { time: '08:00', text: 'Crew ist angekommen' }
            ].map((update, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className="text-muted-foreground font-mono">{update.time}</span>
                <span>{update.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <span className="text-2xl">👨‍💼</span>
            <div className="flex-1">
              <div className="font-medium">Chat mit Marc</div>
              <div className="text-sm text-muted-foreground">Teamleiter</div>
            </div>
            <Button>
              <MessageCircle className="h-4 w-4 mr-2" />
              Nachricht
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => setStep('dashboard')} className="mx-auto flex">
        <ChevronLeft className="mr-2 h-4 w-4" />
        Zurück zum Dashboard
      </Button>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8 px-4">
      {/* Header */}
      <header className="max-w-5xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">SwissMove</span>
          </div>
          
          {step !== 'landing' && (
            <div className="flex items-center gap-4">
              <Progress value={progress} className="w-32 h-2" />
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">DE</Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === 'landing' && renderLanding()}
          {step === 'configure' && renderConfigure()}
          {step === 'checkout' && renderCheckout()}
          {step === 'dashboard' && renderDashboard()}
          {step === 'tracking' && renderTracking()}
        </AnimatePresence>
      </main>
    </div>
  );
};
