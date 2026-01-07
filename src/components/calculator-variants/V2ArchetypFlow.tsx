/**
 * V2 Archetyp Flow ⭐⭐
 * 4 Kundentypen: Security/Efficiency/Value/Overwhelmed
 * Swiss Framework mit KI-Video Option
 * 6-Step Premium Experience
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Shield, Zap, Wallet, HelpCircle, ArrowRight, ArrowLeft, 
  MapPin, Home, Calendar, Package, Building2, CheckCircle2,
  Video, Star, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Customer archetypes based on Swiss moving psychology
const ARCHETYPES = [
  {
    id: 'security',
    label: 'Sicherheit',
    description: 'Ich möchte sicher sein, dass alles klappt',
    icon: Shield,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: ['Versicherter Transport', 'Erfahrene Teams', 'Garantierte Termine'],
  },
  {
    id: 'efficiency',
    label: 'Effizienz',
    description: 'Ich will schnell und unkompliziert umziehen',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    features: ['Express-Umzug möglich', 'Digitale Abwicklung', 'Alles aus einer Hand'],
  },
  {
    id: 'value',
    label: 'Preis-Leistung',
    description: 'Ich suche das beste Angebot',
    icon: Wallet,
    color: 'from-emerald-500 to-green-500',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    features: ['Preisvergleich', 'Transparente Kosten', 'Keine versteckten Gebühren'],
  },
  {
    id: 'overwhelmed',
    label: 'Rundum-Sorglos',
    description: 'Ich brauche Unterstützung bei allem',
    icon: HelpCircle,
    color: 'from-purple-500 to-violet-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: ['Full-Service Umzug', 'Persönliche Beratung', 'Ein- & Auspacken'],
  },
];

const STEPS = [
  { id: 1, name: 'Typ wählen', description: 'Ihr Umzugstyp' },
  { id: 2, name: 'Adressen', description: 'Von-Nach' },
  { id: 3, name: 'Details', description: 'Zimmer & Datum' },
  { id: 4, name: 'Services', description: 'Paket-Auswahl' },
  { id: 5, name: 'Firmen', description: 'Vergleich' },
  { id: 6, name: 'Kontakt', description: 'Absenden' },
];

const V2ArchetypFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fromPLZ: '',
    toPLZ: '',
    rooms: '',
    date: '',
    useVideo: false,
  });

  const progress = (currentStep / STEPS.length) * 100;
  const selectedType = ARCHETYPES.find(a => a.id === selectedArchetype);

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
      case 1: return !!selectedArchetype;
      case 2: return formData.fromPLZ.length >= 4 && formData.toPLZ.length >= 4;
      case 3: return !!formData.rooms && !!formData.date;
      default: return true;
    }
  };

  return (
    <div className="min-h-[700px] bg-gradient-to-b from-background to-muted/20">
      {/* Header with Archetype Badge */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-xl border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-0">
                V2 Archetyp ⭐⭐
              </Badge>
              {selectedType && (
                <Badge className={`${selectedType.bgColor} ${selectedType.borderColor} text-foreground`}>
                  <selectedType.icon className="h-3 w-3 mr-1" />
                  {selectedType.label}
                </Badge>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {currentStep}/{STEPS.length}
            </span>
          </div>
          <Progress value={progress} className="h-1 mt-2" />
        </div>
      </div>

      {/* Step Pills */}
      <div className="container mx-auto px-4 py-4 overflow-x-auto">
        <div className="flex gap-2">
          {STEPS.map((step) => (
            <Badge
              key={step.id}
              variant={currentStep === step.id ? 'default' : currentStep > step.id ? 'secondary' : 'outline'}
              className="whitespace-nowrap"
            >
              {step.id}. {step.name}
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
            {/* Step 1: Archetype Selection */}
            {currentStep === 1 && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">
                  Was ist Ihnen am wichtigsten?
                </h2>
                <p className="text-muted-foreground text-center mb-8">
                  Wir passen Ihre Erfahrung an Ihre Bedürfnisse an
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {ARCHETYPES.map((archetype) => {
                    const Icon = archetype.icon;
                    const isSelected = selectedArchetype === archetype.id;
                    return (
                      <Card
                        key={archetype.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                          isSelected ? `ring-2 ring-primary ${archetype.bgColor}` : 'hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedArchetype(archetype.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${archetype.color} flex items-center justify-center text-white shrink-0`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{archetype.label}</h3>
                              <p className="text-muted-foreground text-sm mb-3">{archetype.description}</p>
                              <div className="flex flex-wrap gap-2">
                                {archetype.features.map((feature) => (
                                  <Badge key={feature} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="h-6 w-6 text-primary shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Addresses */}
            {currentStep === 2 && (
              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Ihre Umzugsroute
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Von (PLZ)</Label>
                    <Input 
                      placeholder="z.B. 8001"
                      value={formData.fromPLZ}
                      onChange={(e) => setFormData({...formData, fromPLZ: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Nach (PLZ)</Label>
                    <Input 
                      placeholder="z.B. 3011"
                      value={formData.toPLZ}
                      onChange={(e) => setFormData({...formData, toPLZ: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Trust indicator */}
                  <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Schweizweite Abdeckung mit geprüften Partnern</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Details */}
            {currentStep === 3 && (
              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5 text-primary" />
                    Details zum Umzug
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Anzahl Zimmer</Label>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {['1-2', '3', '4', '5+'].map((room) => (
                        <Button
                          key={room}
                          variant={formData.rooms === room ? 'default' : 'outline'}
                          onClick={() => setFormData({...formData, rooms: room})}
                          className="h-12"
                        >
                          {room}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Umzugsdatum</Label>
                    <Input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Video Option */}
                  <Card 
                    className={`cursor-pointer transition-all ${formData.useVideo ? 'ring-2 ring-primary bg-primary/5' : ''}`}
                    onClick={() => setFormData({...formData, useVideo: !formData.useVideo})}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white">
                        <Video className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">Video-Analyse (Optional)</h4>
                        <p className="text-sm text-muted-foreground">
                          KI analysiert Ihr Inventar für genauere Offerten
                        </p>
                      </div>
                      <Badge variant={formData.useVideo ? 'default' : 'secondary'}>
                        {formData.useVideo ? 'Aktiviert' : 'Optional'}
                      </Badge>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Services */}
            {currentStep === 4 && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">Wählen Sie Ihr Paket</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { id: 'basic', name: 'Basis', price: 'ab CHF 490', features: ['Transport', 'Versicherung', 'Online-Buchung'] },
                    { id: 'standard', name: 'Standard', price: 'ab CHF 890', features: ['Alles von Basis', 'Ein- & Ausladen', 'Möbelmontage'], popular: true },
                    { id: 'premium', name: 'Premium', price: 'ab CHF 1\'490', features: ['Alles von Standard', 'Ein- & Auspacken', 'Endreinigung'] },
                  ].map((pkg) => (
                    <Card key={pkg.id} className={pkg.popular ? 'ring-2 ring-primary' : ''}>
                      {pkg.popular && (
                        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                          Beliebteste Wahl
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-bold text-xl">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-primary mt-2">{pkg.price}</p>
                        <ul className="mt-4 space-y-2">
                          {pkg.features.map((f) => (
                            <li key={f} className="flex items-center gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <Button className="w-full mt-4" variant={pkg.popular ? 'default' : 'outline'}>
                          Auswählen
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Companies */}
            {currentStep === 5 && (
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-6">Empfohlene Umzugsfirmen</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Swiss Move Pro', rating: 4.9, reviews: 234, price: 'ab CHF 890' },
                    { name: 'Express Umzüge AG', rating: 4.8, reviews: 189, price: 'ab CHF 790' },
                    { name: 'Zürich Movers', rating: 4.7, reviews: 156, price: 'ab CHF 850' },
                  ].map((company, i) => (
                    <Card key={company.name}>
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-xl">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold">{company.name}</h4>
                          <div className="flex items-center gap-2 text-sm">
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                            <span>{company.rating}</span>
                            <span className="text-muted-foreground">({company.reviews} Bewertungen)</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{company.price}</p>
                          <Button size="sm" className="mt-1">Auswählen</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 6: Contact */}
            {currentStep === 6 && (
              <Card className="max-w-lg mx-auto">
                <CardHeader>
                  <CardTitle>Fast geschafft!</CardTitle>
                  <p className="text-muted-foreground">
                    Ihre Kontaktdaten für die Offerten
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Vorname</Label>
                      <Input placeholder="Max" className="mt-1" />
                    </div>
                    <div>
                      <Label>Nachname</Label>
                      <Input placeholder="Muster" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label>E-Mail</Label>
                    <Input type="email" placeholder="max@example.ch" className="mt-1" />
                  </div>
                  <div>
                    <Label>Telefon</Label>
                    <Input type="tel" placeholder="079 123 45 67" className="mt-1" />
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                    <Shield className="h-4 w-4" />
                    <span>Ihre Daten sind 100% sicher und werden nicht weitergegeben</span>
                  </div>
                  
                  <Button className="w-full h-12 text-lg" size="lg">
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
            <Users className="h-4 w-4" />
            <span>127 Anfragen heute</span>
          </div>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentStep === STEPS.length ? 'Absenden' : 'Weiter'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default V2ArchetypFlow;
