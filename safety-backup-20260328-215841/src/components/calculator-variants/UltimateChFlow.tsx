/**
 * Ultimate CH Flow ⭐⭐
 * Komplett Schweiz-optimiert mit Swiss Trust Intro
 * 5-Step Premium Experience für den Schweizer Markt
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, ArrowRight, ArrowLeft, MapPin, Home, Calendar, 
  Package, CheckCircle2, Star, Flag, Award, Clock,
  Truck, Users, Phone, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STEPS = [
  { id: 1, name: 'Start', description: 'Swiss Trust Intro' },
  { id: 2, name: 'Adressen', description: 'Von-Nach PLZ' },
  { id: 3, name: 'Details', description: 'CH-Zimmer, Datum' },
  { id: 4, name: 'Services', description: 'Pakete wählen' },
  { id: 5, name: 'Kontakt', description: 'Absenden' },
];

const SWISS_TRUST_BADGES = [
  { icon: Flag, label: '100% Schweizer Firmen', color: 'text-red-500' },
  { icon: Shield, label: 'Versicherte Transporte', color: 'text-blue-500' },
  { icon: Award, label: 'Geprüfte Qualität', color: 'text-amber-500' },
  { icon: Clock, label: 'Pünktlichkeitsgarantie', color: 'text-emerald-500' },
];

const CH_ROOM_SIZES = [
  { id: '1', label: '1 Zimmer', subtitle: 'Studio/Einzimmerwohnung', volume: '15-20 m³' },
  { id: '2', label: '2 Zimmer', subtitle: 'Kleine Wohnung', volume: '25-35 m³' },
  { id: '2.5', label: '2.5 Zimmer', subtitle: 'Kompakte Wohnung', volume: '30-40 m³' },
  { id: '3', label: '3 Zimmer', subtitle: 'Familienwohnung', volume: '40-50 m³' },
  { id: '3.5', label: '3.5 Zimmer', subtitle: 'Grosse Wohnung', volume: '45-55 m³' },
  { id: '4', label: '4 Zimmer', subtitle: 'Sehr gross', volume: '55-70 m³' },
  { id: '4.5+', label: '4.5+ Zimmer', subtitle: 'Haus/Villa', volume: '70+ m³' },
];

const SERVICE_PACKAGES = [
  {
    id: 'economy',
    name: 'Economy',
    price: 'ab CHF 490',
    description: 'Selbst packen, wir transportieren',
    features: ['Transport', 'Basisversicherung', 'Online-Tracking'],
    popular: false,
  },
  {
    id: 'standard',
    name: 'Standard',
    price: 'ab CHF 890',
    description: 'Der Schweizer Klassiker',
    features: ['Alles von Economy', 'Ein- & Ausladen', 'Möbelmontage', 'Vollkasko'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'ab CHF 1\'490',
    description: 'Rundum-Sorglos-Paket',
    features: ['Alles von Standard', 'Ein- & Auspacken', 'Endreinigung', 'Entsorgung'],
    popular: false,
  },
];

const UltimateChFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fromPLZ: '',
    fromCity: '',
    toPLZ: '',
    toCity: '',
    rooms: '',
    date: '',
    flexible: false,
    selectedPackage: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const progress = (currentStep / STEPS.length) * 100;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return true; // Trust intro always passable
      case 2: return formData.fromPLZ.length >= 4 && formData.toPLZ.length >= 4;
      case 3: return !!formData.rooms && !!formData.date;
      case 4: return !!formData.selectedPackage;
      default: return true;
    }
  };

  return (
    <div className="min-h-[700px] bg-gradient-to-b from-red-50/50 via-background to-muted/20">
      {/* Swiss-themed Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center">
                <span className="text-white text-lg font-bold">+</span>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-red-600 to-red-500 text-white border-0">
                Ultimate CH ⭐⭐
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              Schritt {currentStep} von {STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1.5 mt-2" />
        </div>
      </div>

      {/* Step Pills */}
      <div className="container mx-auto px-4 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {STEPS.map((step) => (
            <Badge
              key={step.id}
              variant={currentStep === step.id ? 'default' : currentStep > step.id ? 'secondary' : 'outline'}
              className={`whitespace-nowrap ${currentStep === step.id ? 'bg-red-500' : ''}`}
            >
              {step.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Step 1: Swiss Trust Intro */}
            {currentStep === 1 && (
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-white text-4xl font-bold">+</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Umzugsofferten aus der Schweiz
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  Vergleichen Sie kostenlos bis zu 5 Angebote von geprüften Schweizer Umzugsfirmen
                </p>
                
                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {SWISS_TRUST_BADGES.map((badge) => {
                    const Icon = badge.icon;
                    return (
                      <div key={badge.label} className="p-4 bg-white rounded-xl border shadow-sm">
                        <Icon className={`h-6 w-6 ${badge.color} mx-auto mb-2`} />
                        <p className="text-sm font-medium">{badge.label}</p>
                      </div>
                    );
                  })}
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-center gap-8 mb-8 p-4 bg-muted/50 rounded-xl">
                  <div>
                    <p className="text-3xl font-bold text-primary">15'000+</p>
                    <p className="text-sm text-muted-foreground">Umzüge vermittelt</p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="text-3xl font-bold text-primary">4.8</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="text-3xl font-bold text-primary">200+</p>
                    <p className="text-sm text-muted-foreground">Partner-Firmen</p>
                  </div>
                </div>
                
                <Button size="lg" className="h-14 px-8 text-lg bg-red-500 hover:bg-red-600" onClick={handleNext}>
                  Jetzt vergleichen
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Addresses */}
            {currentStep === 2 && (
              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-red-500" />
                    Umzugsroute in der Schweiz
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">Von (Aktuelle Adresse)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Input 
                        placeholder="PLZ"
                        value={formData.fromPLZ}
                        onChange={(e) => setFormData({...formData, fromPLZ: e.target.value})}
                        className="font-mono"
                        maxLength={4}
                      />
                      <Input 
                        placeholder="Ort"
                        value={formData.fromCity}
                        onChange={(e) => setFormData({...formData, fromCity: e.target.value})}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <ArrowRight className="h-5 w-5 text-red-500 rotate-90" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <Label className="text-sm font-medium">Nach (Neue Adresse)</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <Input 
                        placeholder="PLZ"
                        value={formData.toPLZ}
                        onChange={(e) => setFormData({...formData, toPLZ: e.target.value})}
                        className="font-mono"
                        maxLength={4}
                      />
                      <Input 
                        placeholder="Ort"
                        value={formData.toCity}
                        onChange={(e) => setFormData({...formData, toCity: e.target.value})}
                        className="col-span-2"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>Schweizweite Abdeckung - alle Kantone</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">Ihre Wohnung</h2>
                
                {/* CH Room Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {CH_ROOM_SIZES.map((room) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-all ${
                        formData.rooms === room.id 
                          ? 'ring-2 ring-red-500 bg-red-50' 
                          : 'hover:border-red-200'
                      }`}
                      onClick={() => setFormData({...formData, rooms: room.id})}
                    >
                      <CardContent className="p-4 text-center">
                        <Home className={`h-6 w-6 mx-auto mb-2 ${formData.rooms === room.id ? 'text-red-500' : 'text-muted-foreground'}`} />
                        <p className="font-bold">{room.label}</p>
                        <p className="text-xs text-muted-foreground">{room.subtitle}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">{room.volume}</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Date Selection */}
                <Card>
                  <CardContent className="p-4">
                    <Label className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-500" />
                      Wunschdatum
                    </Label>
                    <div className="flex items-center gap-4 mt-2">
                      <Input 
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        className="flex-1"
                      />
                      <Button
                        variant={formData.flexible ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFormData({...formData, flexible: !formData.flexible})}
                        className={formData.flexible ? 'bg-red-500' : ''}
                      >
                        Flexibel ±3 Tage
                      </Button>
                    </div>
                    {formData.flexible && (
                      <p className="text-sm text-emerald-600 mt-2">
                        ✓ Flexibilität kann bis zu 15% Rabatt bringen!
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Service Packages */}
            {currentStep === 4 && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-2">Wählen Sie Ihr Paket</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Alle Pakete inkl. Schweizer Qualitätsstandards
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {SERVICE_PACKAGES.map((pkg) => (
                    <Card 
                      key={pkg.id} 
                      className={`cursor-pointer transition-all ${
                        formData.selectedPackage === pkg.id 
                          ? 'ring-2 ring-red-500' 
                          : pkg.popular 
                            ? 'ring-1 ring-red-200' 
                            : ''
                      }`}
                      onClick={() => setFormData({...formData, selectedPackage: pkg.id})}
                    >
                      {pkg.popular && (
                        <div className="bg-red-500 text-white text-center py-1 text-sm font-medium">
                          Schweizer Favorit
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-bold text-xl">{pkg.name}</h3>
                        <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        <p className="text-2xl font-bold text-red-500 mt-3">{pkg.price}</p>
                        <ul className="mt-4 space-y-2">
                          {pkg.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button 
                          className={`w-full mt-4 ${formData.selectedPackage === pkg.id || pkg.popular ? 'bg-red-500 hover:bg-red-600' : ''}`}
                          variant={formData.selectedPackage === pkg.id ? 'default' : pkg.popular ? 'default' : 'outline'}
                        >
                          {formData.selectedPackage === pkg.id ? '✓ Ausgewählt' : 'Auswählen'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Contact */}
            {currentStep === 5 && (
              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-red-500" />
                    Ihre Kontaktdaten
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Für Ihre kostenlosen Umzugsofferten
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vorname</Label>
                      <Input 
                        placeholder="Max" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="mt-1" 
                      />
                    </div>
                    <div>
                      <Label>Nachname</Label>
                      <Input 
                        placeholder="Muster"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="mt-1" 
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      E-Mail
                    </Label>
                    <Input 
                      type="email" 
                      placeholder="max.muster@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="mt-1" 
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Telefon
                    </Label>
                    <Input 
                      type="tel" 
                      placeholder="079 123 45 67"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="mt-1" 
                    />
                  </div>
                  
                  {/* Summary Card */}
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Ihre Anfrage:</h4>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-muted-foreground">Route:</span> {formData.fromPLZ} → {formData.toPLZ}</p>
                        <p><span className="text-muted-foreground">Grösse:</span> {formData.rooms} Zimmer</p>
                        <p><span className="text-muted-foreground">Datum:</span> {formData.date} {formData.flexible && '(±3 Tage)'}</p>
                        <p><span className="text-muted-foreground">Paket:</span> {SERVICE_PACKAGES.find(p => p.id === formData.selectedPackage)?.name || '-'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                    <Shield className="h-4 w-4 shrink-0" />
                    <span>Schweizer Datenschutz - Ihre Daten bleiben in der Schweiz</span>
                  </div>
                  
                  <Button className="w-full h-14 text-lg bg-red-500 hover:bg-red-600" size="lg">
                    Kostenlose Offerten erhalten
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Navigation */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-xl border-t p-4">
        <div className="container mx-auto flex items-center justify-between max-w-lg">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Zurück
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Star className="h-4 w-4 text-amber-500" />
            <span>4.8/5 Bewertung</span>
          </div>
          
          {currentStep < STEPS.length && (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-red-500 hover:bg-red-600"
            >
              Weiter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UltimateChFlow;
