/**
 * V5.d - ChatGPT Feedback Based (Gemini Agent New)
 * 
 * Key improvements from feedback:
 * - Sticky CTA on mobile (always visible)
 * - Clearer service level names ("Schnippen" → "Full Service")
 * - Consistent progress (5 steps, not 4/6 confusion)
 * - Volume feedback in inventory
 * - Trust signals throughout
 * - Better microcopy & error states
 * - Storno/guarantee info at checkout
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowRight, ArrowLeft, Check, Package, Truck, Star, 
  Shield, Clock, MapPin, Calendar, Home, Building2, 
  Users, Phone, Mail, User, ChevronDown, ChevronUp,
  Video, List, Plus, Minus, Info, Lock, AlertCircle
} from 'lucide-react';
import { useInitialStep } from '@/hooks/use-initial-step';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 1, label: 'Adressen', description: 'Von & Nach' },
  { id: 2, label: 'Service', description: 'Ihr Level' },
  { id: 3, label: 'Inventar', description: 'Was kommt mit' },
  { id: 4, label: 'Offerten', description: 'Vergleichen' },
  { id: 5, label: 'Kontakt', description: 'Abschliessen' },
];

interface FormData {
  fromPlz: string;
  fromCity: string;
  fromFloor: number;
  fromLift: boolean;
  toPlz: string;
  toCity: string;
  toFloor: number;
  toLift: boolean;
  moveDate: string;
  rooms: string;
  serviceLevel: 'diy' | 'comfort' | 'fullservice';
  inventory: Record<string, number>;
  selectedOffer: string | null;
  name: string;
  email: string;
  phone: string;
  agbAccepted: boolean;
}

const DEFAULT_INVENTORY = {
  'Sofa/Couch': 1,
  'Bett': 1,
  'Kleiderschrank': 1,
  'Schreibtisch': 0,
  'Esstisch': 1,
  'Stühle': 4,
  'Kühlschrank': 1,
  'Waschmaschine': 1,
  'Umzugskartons': 20,
};

const MOCK_OFFERS = [
  {
    id: 'swissmove',
    name: 'SwissMove AG',
    rating: 4.9,
    reviews: 847,
    price: 1250,
    badge: 'Empfohlen',
    badgeColor: 'bg-primary text-primary-foreground',
  },
  {
    id: 'alphalog',
    name: 'Alpha Logistik',
    rating: 4.7,
    reviews: 523,
    price: 1080,
    badge: 'Günstig',
    badgeColor: 'bg-green-600 text-white',
  },
  {
    id: 'premiumzug',
    name: 'Premium Umzug',
    rating: 4.8,
    reviews: 312,
    price: 1450,
    badge: null,
    badgeColor: '',
  },
];

// Volume calculation helper
const calculateVolume = (inventory: Record<string, number>): number => {
  const volumeMap: Record<string, number> = {
    'Sofa/Couch': 2.5,
    'Bett': 2.0,
    'Kleiderschrank': 1.8,
    'Schreibtisch': 0.8,
    'Esstisch': 1.2,
    'Stühle': 0.2,
    'Kühlschrank': 0.8,
    'Waschmaschine': 0.6,
    'Umzugskartons': 0.06,
  };
  return Object.entries(inventory).reduce((sum, [item, count]) => {
    return sum + (volumeMap[item] || 0.5) * count;
  }, 0);
};

export const V5dFeedbackBased: React.FC = () => {
  const initialStep = useInitialStep(1);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [formData, setFormData] = useState<FormData>({
    fromPlz: '',
    fromCity: '',
    fromFloor: 0,
    fromLift: false,
    toPlz: '',
    toCity: '',
    toFloor: 0,
    toLift: false,
    moveDate: '',
    rooms: '3.5',
    serviceLevel: 'comfort',
    inventory: { ...DEFAULT_INVENTORY },
    selectedOffer: null,
    name: '',
    email: '',
    phone: '',
    agbAccepted: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [inventoryMode, setInventoryMode] = useState<'list' | 'video'>('list');

  const progress = (currentStep / STEPS.length) * 100;
  const volume = calculateVolume(formData.inventory);

  // Validate current step
  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!formData.fromPlz) newErrors.fromPlz = 'PLZ erforderlich';
      if (!formData.fromCity) newErrors.fromCity = 'Ort erforderlich';
      if (!formData.toPlz) newErrors.toPlz = 'PLZ erforderlich';
      if (!formData.toCity) newErrors.toCity = 'Ort erforderlich';
    } else if (currentStep === 4) {
      if (!formData.selectedOffer) newErrors.selectedOffer = 'Bitte wählen Sie eine Offerte';
    } else if (currentStep === 5) {
      if (!formData.name) newErrors.name = 'Name erforderlich';
      if (!formData.email) newErrors.email = 'E-Mail erforderlich';
      if (!formData.phone) newErrors.phone = 'Telefon für Rückfragen empfohlen';
      if (!formData.agbAccepted) newErrors.agb = 'Bitte bestätigen Sie die AGB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const updateInventory = (item: string, delta: number) => {
    setFormData(prev => ({
      ...prev,
      inventory: {
        ...prev.inventory,
        [item]: Math.max(0, (prev.inventory[item] || 0) + delta),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header with Progress */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Schritt {currentStep} von {STEPS.length}
            </span>
            <span className="text-sm font-semibold text-primary">
              {progress.toFixed(0)}% abgeschlossen
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {/* Step labels - desktop only */}
          <div className="hidden md:flex justify-between mt-3">
            {STEPS.map((step) => (
              <div 
                key={step.id}
                className={cn(
                  "text-xs text-center transition-colors",
                  step.id === currentStep 
                    ? "text-primary font-semibold" 
                    : step.id < currentStep 
                    ? "text-muted-foreground" 
                    : "text-muted-foreground/50"
                )}
              >
                <div className="flex items-center gap-1">
                  {step.id < currentStep && <Check className="h-3 w-3 text-green-600" />}
                  <span>{step.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Trust Bar - visible on step 1 */}
      {currentStep === 1 && (
        <div className="bg-muted/50 border-b py-2 px-4">
          <div className="max-w-2xl mx-auto flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="h-3 w-3 text-green-600" />
              Fixpreis-Garantie
            </span>
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-yellow-500" />
              4.9/5 (2'340+ Bewertungen)
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-primary" />
              Geprüfte Partner
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {currentStep === 1 && (
              <Step1Addresses 
                formData={formData} 
                setFormData={setFormData} 
                errors={errors}
              />
            )}
            {currentStep === 2 && (
              <Step2ServiceLevel 
                formData={formData} 
                setFormData={setFormData}
              />
            )}
            {currentStep === 3 && (
              <Step3Inventory 
                formData={formData}
                setFormData={setFormData}
                inventoryMode={inventoryMode}
                setInventoryMode={setInventoryMode}
                updateInventory={updateInventory}
                volume={volume}
              />
            )}
            {currentStep === 4 && (
              <Step4Offers 
                formData={formData}
                setFormData={setFormData}
                volume={volume}
                errors={errors}
              />
            )}
            {currentStep === 5 && (
              <Step5Contact 
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Sticky CTA Footer - ALWAYS visible on mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-t shadow-lg safe-area-inset-bottom">
        <div className="max-w-2xl mx-auto p-4 space-y-2">
          {/* Contextual hint */}
          {currentStep === 4 && !formData.selectedOffer && (
            <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Info className="h-4 w-4" />
              Bitte wählen Sie eine Offerte
            </p>
          )}
          {currentStep === 5 && (
            <p className="text-center text-xs text-muted-foreground">
              <Lock className="h-3 w-3 inline mr-1" />
              Sichere Zahlung via Stripe · Kostenlose Stornierung bis 48h vorher
            </p>
          )}
          
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex-1 h-12"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={currentStep === 4 && !formData.selectedOffer}
              className={cn(
                "h-12 font-semibold",
                currentStep === 1 ? "w-full" : "flex-1"
              )}
            >
              {currentStep === 5 ? (
                <>Jetzt buchen</>
              ) : currentStep === 3 ? (
                <>Offerten anzeigen</>
              ) : (
                <>Weiter</>
              )}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 1: Addresses
const Step1Addresses: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-foreground">Wohin zügeln Sie?</h2>
      <p className="text-muted-foreground mt-1">
        In 2 Minuten zu Ihrem Fixpreis-Angebot
      </p>
    </div>

    {/* From Address */}
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-primary font-semibold">
        <MapPin className="h-4 w-4" />
        <span>Auszug (Von)</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="fromPlz">PLZ *</Label>
          <Input
            id="fromPlz"
            value={formData.fromPlz}
            onChange={(e) => setFormData(prev => ({ ...prev, fromPlz: e.target.value }))}
            placeholder="8000"
            className={errors.fromPlz ? 'border-destructive' : ''}
          />
          {errors.fromPlz && (
            <p className="text-xs text-destructive mt-1">{errors.fromPlz}</p>
          )}
        </div>
        <div>
          <Label htmlFor="fromCity">Ort *</Label>
          <Input
            id="fromCity"
            value={formData.fromCity}
            onChange={(e) => setFormData(prev => ({ ...prev, fromCity: e.target.value }))}
            placeholder="Zürich"
            className={errors.fromCity ? 'border-destructive' : ''}
          />
          {errors.fromCity && (
            <p className="text-xs text-destructive mt-1">{errors.fromCity}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Stockwerk</Label>
          <div className="flex items-center gap-2 mt-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setFormData(prev => ({ ...prev, fromFloor: Math.max(0, prev.fromFloor - 1) }))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{formData.fromFloor}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setFormData(prev => ({ ...prev, fromFloor: prev.fromFloor + 1 }))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted">
            <Checkbox
              checked={formData.fromLift}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, fromLift: !!checked }))}
            />
            <span className="text-sm">Lift vorhanden</span>
          </label>
        </div>
      </div>
    </Card>

    {/* To Address */}
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-primary font-semibold">
        <MapPin className="h-4 w-4" />
        <span>Einzug (Nach)</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="toPlz">PLZ *</Label>
          <Input
            id="toPlz"
            value={formData.toPlz}
            onChange={(e) => setFormData(prev => ({ ...prev, toPlz: e.target.value }))}
            placeholder="3000"
            className={errors.toPlz ? 'border-destructive' : ''}
          />
          {errors.toPlz && (
            <p className="text-xs text-destructive mt-1">{errors.toPlz}</p>
          )}
        </div>
        <div>
          <Label htmlFor="toCity">Ort *</Label>
          <Input
            id="toCity"
            value={formData.toCity}
            onChange={(e) => setFormData(prev => ({ ...prev, toCity: e.target.value }))}
            placeholder="Bern"
            className={errors.toCity ? 'border-destructive' : ''}
          />
          {errors.toCity && (
            <p className="text-xs text-destructive mt-1">{errors.toCity}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Stockwerk</Label>
          <div className="flex items-center gap-2 mt-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setFormData(prev => ({ ...prev, toFloor: Math.max(0, prev.toFloor - 1) }))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{formData.toFloor}</span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-10 w-10"
              onClick={() => setFormData(prev => ({ ...prev, toFloor: prev.toFloor + 1 }))}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-muted">
            <Checkbox
              checked={formData.toLift}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, toLift: !!checked }))}
            />
            <span className="text-sm">Lift vorhanden</span>
          </label>
        </div>
      </div>
    </Card>

    {/* Date & Rooms */}
    <Card className="p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="moveDate">Wunschtermin</Label>
          <Input
            id="moveDate"
            type="date"
            value={formData.moveDate}
            onChange={(e) => setFormData(prev => ({ ...prev, moveDate: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="rooms">Zimmerzahl</Label>
          <select
            id="rooms"
            value={formData.rooms}
            onChange={(e) => setFormData(prev => ({ ...prev, rooms: e.target.value }))}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="1">1 Zimmer</option>
            <option value="1.5">1.5 Zimmer</option>
            <option value="2">2 Zimmer</option>
            <option value="2.5">2.5 Zimmer</option>
            <option value="3">3 Zimmer</option>
            <option value="3.5">3.5 Zimmer</option>
            <option value="4">4 Zimmer</option>
            <option value="4.5">4.5 Zimmer</option>
            <option value="5+">5+ Zimmer</option>
          </select>
        </div>
      </div>
    </Card>
  </div>
);

// Step 2: Service Level
const Step2ServiceLevel: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}> = ({ formData, setFormData }) => {
  const services = [
    {
      id: 'diy',
      name: 'Basis',
      subtitle: 'Sie packen, wir transportieren',
      price: 'ab CHF 600',
      features: ['Transport', 'Be-/Entladung', 'Grundversicherung'],
      icon: Package,
    },
    {
      id: 'comfort',
      name: 'Komfort',
      subtitle: 'Die beliebteste Wahl',
      price: 'ab CHF 1\'000',
      features: ['Alles aus Basis', '+ Ein-/Auspacken', '+ Möbelschutz', '+ Premiumversicherung'],
      icon: Truck,
      badge: 'Beliebt',
    },
    {
      id: 'fullservice',
      name: 'Full Service',
      subtitle: 'Wir machen alles',
      price: 'ab CHF 1\'500',
      features: ['Alles aus Komfort', '+ Kompletter Packservice', '+ Möbelmontage', '+ Endreinigung'],
      icon: Star,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Welchen Service wünschen Sie?</h2>
        <p className="text-muted-foreground mt-1">
          Wählen Sie das passende Paket für Ihren Umzug
        </p>
      </div>

      <div className="space-y-4">
        {services.map((service) => {
          const Icon = service.icon;
          const isSelected = formData.serviceLevel === service.id;
          
          return (
            <Card
              key={service.id}
              className={cn(
                "p-4 cursor-pointer transition-all relative",
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:border-primary/50"
              )}
              onClick={() => setFormData(prev => ({ 
                ...prev, 
                serviceLevel: service.id as FormData['serviceLevel'] 
              }))}
            >
              {service.badge && (
                <span className="absolute -top-2 right-4 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  {service.badge}
                </span>
              )}
              
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-full shrink-0",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                  <Icon className="h-5 w-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <span className="text-sm font-medium text-primary">{service.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{service.subtitle}</p>
                  <ul className="text-sm space-y-1">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={cn(
                  "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <Info className="h-3 w-3 inline mr-1" />
        "Komfort" ist das meistgewählte Paket – ideales Preis-Leistungs-Verhältnis
      </p>
    </div>
  );
};

// Step 3: Inventory
const Step3Inventory: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  inventoryMode: 'list' | 'video';
  setInventoryMode: (mode: 'list' | 'video') => void;
  updateInventory: (item: string, delta: number) => void;
  volume: number;
}> = ({ formData, inventoryMode, setInventoryMode, updateInventory, volume }) => (
  <div className="space-y-6">
    <div className="text-center mb-6">
      <h2 className="text-2xl font-bold text-foreground">Was wird gezügelt?</h2>
      <p className="text-muted-foreground mt-1">
        Video hochladen oder Inventar angeben
      </p>
    </div>

    {/* Mode Toggle */}
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      <button
        type="button"
        onClick={() => setInventoryMode('list')}
        className={cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2",
          inventoryMode === 'list' 
            ? "bg-background shadow text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List className="h-4 w-4" />
        Checkliste
      </button>
      <button
        type="button"
        onClick={() => setInventoryMode('video')}
        className={cn(
          "flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2",
          inventoryMode === 'video' 
            ? "bg-background shadow text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Video className="h-4 w-4" />
        Video-Scan
      </button>
    </div>

    {inventoryMode === 'video' ? (
      <Card className="p-6 text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <Video className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold">Video-Scan (Empfohlen)</h3>
        <p className="text-sm text-muted-foreground">
          Filmen Sie einmal durch Ihre Wohnung. Unser System erfasst automatisch 
          das Volumen – in nur 60-90 Sekunden.
        </p>
        <Button className="w-full">
          <Video className="h-4 w-4 mr-2" />
          Video aufnehmen oder hochladen
        </Button>
        <p className="text-xs text-muted-foreground">
          Spart Zeit und liefert präzisere Fixpreise
        </p>
      </Card>
    ) : (
      <div className="space-y-3">
        {Object.entries(formData.inventory).map(([item, count]) => (
          <Card key={item} className="p-3 flex items-center justify-between">
            <span className="font-medium">{item}</span>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateInventory(item, -1)}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-6 text-center font-medium">{count}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => updateInventory(item, 1)}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    )}

    {/* Volume Indicator */}
    <Card className="p-4 bg-muted/50">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Geschätztes Volumen</span>
        <span className="font-semibold text-lg">~{volume.toFixed(0)} m³</span>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Truck className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all"
            style={{ width: `${Math.min(100, (volume / 40) * 100)}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {volume < 15 ? 'Kleiner LKW' : volume < 30 ? 'Mittlerer LKW' : 'Grosser LKW'}
        </span>
      </div>
    </Card>
  </div>
);

// Step 4: Offers
const Step4Offers: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  volume: number;
  errors: Record<string, string>;
}> = ({ formData, setFormData, volume, errors }) => {
  const [expandedOffer, setExpandedOffer] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Ihre Fixpreis-Offerten</h2>
        <p className="text-muted-foreground mt-1">
          {MOCK_OFFERS.length} geprüfte Angebote für Ihren Umzug
        </p>
      </div>

      {/* Summary Chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="bg-muted px-3 py-1 rounded-full text-xs">~{volume.toFixed(0)} m³</span>
        <span className="bg-muted px-3 py-1 rounded-full text-xs capitalize">
          {formData.serviceLevel === 'fullservice' ? 'Full Service' : formData.serviceLevel}
        </span>
        <span className="bg-muted px-3 py-1 rounded-full text-xs">
          {formData.moveDate || 'Flexibel'}
        </span>
      </div>

      {errors.selectedOffer && (
        <div className="flex items-center justify-center gap-2 text-destructive text-sm">
          <AlertCircle className="h-4 w-4" />
          {errors.selectedOffer}
        </div>
      )}

      {/* Offer Cards */}
      <div className="space-y-4">
        {MOCK_OFFERS.map((offer) => {
          const isSelected = formData.selectedOffer === offer.id;
          const isExpanded = expandedOffer === offer.id;

          return (
            <Card
              key={offer.id}
              className={cn(
                "p-4 cursor-pointer transition-all",
                isSelected 
                  ? "ring-2 ring-primary bg-primary/5" 
                  : "hover:border-primary/50"
              )}
              onClick={() => setFormData(prev => ({ ...prev, selectedOffer: offer.id }))}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold">{offer.name[0]}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{offer.name}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                        <span>{offer.rating}</span>
                        <span className="text-muted-foreground">({offer.reviews})</span>
                      </div>
                    </div>
                    {offer.badge && (
                      <span className={cn("text-xs px-2 py-0.5 rounded-full", offer.badgeColor)}>
                        {offer.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold">CHF {offer.price.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground block">Fixpreis inkl. MwSt.</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedOffer(isExpanded ? null : offer.id);
                      }}
                    >
                      {isExpanded ? (
                        <>Weniger <ChevronUp className="h-4 w-4 ml-1" /></>
                      ) : (
                        <>Details <ChevronDown className="h-4 w-4 ml-1" /></>
                      )}
                    </Button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 mt-3 border-t space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Grundpreis</span>
                            <span>CHF {(offer.price * 0.85).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Etagenzuschlag</span>
                            <span>CHF {(offer.price * 0.1).toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>Lift-Rabatt</span>
                            <span>- CHF {(offer.price * 0.05).toFixed(0)}</span>
                          </div>
                          <div className="flex items-center gap-2 pt-2">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-xs">Vollversicherung inklusive</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={cn(
                  "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center mt-1",
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                )}>
                  {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Alle Preise sind Fixpreise – keine versteckten Kosten
      </p>
    </div>
  );
};

// Step 5: Contact & Booking
const Step5Contact: React.FC<{
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  errors: Record<string, string>;
}> = ({ formData, setFormData, errors }) => {
  const selectedOffer = MOCK_OFFERS.find(o => o.id === formData.selectedOffer);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Fast geschafft!</h2>
        <p className="text-muted-foreground mt-1">
          Noch ein paar Angaben zur Buchung
        </p>
      </div>

      {/* Booking Summary */}
      {selectedOffer && (
        <Card className="p-4 bg-muted/50">
          <h3 className="font-semibold mb-2">Ihre Buchung</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Partner</span>
              <span className="font-medium">{selectedOffer.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Route</span>
              <span>{formData.fromPlz} → {formData.toPlz}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service</span>
              <span className="capitalize">
                {formData.serviceLevel === 'fullservice' ? 'Full Service' : formData.serviceLevel}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-lg">CHF {selectedOffer.price.toLocaleString()}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Contact Form */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold">Ihre Kontaktdaten</h3>
        
        <div>
          <Label htmlFor="name">Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Max Muster"
              className={cn("pl-10", errors.name && "border-destructive")}
            />
          </div>
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="email">E-Mail *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="max.muster@example.ch"
              className={cn("pl-10", errors.email && "border-destructive")}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Telefon</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+41 79 123 45 67"
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Nur für Rückfragen zur Buchung – keine Werbung
          </p>
        </div>
      </Card>

      {/* AGB Checkbox */}
      <label className={cn(
        "flex items-start gap-3 p-4 rounded-lg border cursor-pointer",
        errors.agb ? "border-destructive" : "border-border"
      )}>
        <Checkbox
          checked={formData.agbAccepted}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, agbAccepted: !!checked }))}
          className="mt-0.5"
        />
        <span className="text-sm">
          Ich akzeptiere die{' '}
          <a href="/agb" className="text-primary underline">AGB</a>{' '}
          und{' '}
          <a href="/datenschutz" className="text-primary underline">Datenschutzerklärung</a>
        </span>
      </label>
      {errors.agb && <p className="text-xs text-destructive">{errors.agb}</p>}

      {/* Trust & Payment Info */}
      <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-green-800 dark:text-green-200">Sichere Buchung</p>
            <p className="text-green-700 dark:text-green-300 mt-1">
              Zahlung via Stripe · Kostenlose Stornierung bis 48h vor dem Umzug · 
              Ihre Daten werden nur an {selectedOffer?.name || 'die Umzugsfirma'} übermittelt
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default V5dFeedbackBased;
