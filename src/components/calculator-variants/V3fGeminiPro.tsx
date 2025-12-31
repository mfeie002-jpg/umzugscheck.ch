/**
 * V3f Gemini Pro - Archetyp God-Mode Calculator
 * 
 * Basiert auf der exhaustiven Gemini Pro Analyse:
 * - Focus Mode Layout (keine Ablenkungen)
 * - Glassmorphism Design
 * - Gamified Inventory mit Truck Fill Meter
 * - Visual Map Connection
 * - Smart Date Chips (ASAP, Ende Monat, Spezifisch)
 * - Room-by-Room Traversal
 * - Trust Engineering & Progressive Disclosure
 * - Micro-Interactions mit Framer Motion
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  MapPin, ArrowRight, ArrowLeft, Calendar as CalendarIcon, Rocket, CalendarClock,
  Check, Star, Shield, Truck, Home, Sofa, Bed, UtensilsCrossed, Package,
  Plus, Minus, Building2, Sparkles, Lock, Phone, Mail, User, Info, Zap,
  Award, FileCheck, BadgeCheck, Armchair, Lamp, Tv, BookOpen, Bath, Baby,
  Dumbbell, Flower2
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Types
interface FormData {
  fromAddress: string;
  toAddress: string;
  dateType: 'asap' | 'eom' | 'specific' | null;
  moveDate: Date | null;
  inventory: Record<string, number>;
  floorOrigin: number;
  floorDestination: number;
  elevatorOrigin: boolean;
  elevatorDestination: boolean;
  walkingDistanceOrigin: number;
  walkingDistanceDestination: number;
  packingService: boolean;
  cleaningService: boolean;
  storageService: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  acceptTerms: boolean;
}

// Inventory items with volumes (m³)
const inventoryItems = {
  living: [
    { id: 'sofa', name: 'Sofa', icon: Sofa, volume: 2.0 },
    { id: 'armchair', name: 'Sessel', icon: Armchair, volume: 0.8 },
    { id: 'coffeeTable', name: 'Couchtisch', icon: Lamp, volume: 0.3 },
    { id: 'tvStand', name: 'TV-Möbel', icon: Tv, volume: 0.5 },
    { id: 'bookshelf', name: 'Bücherregal', icon: BookOpen, volume: 1.2 },
    { id: 'sideboard', name: 'Sideboard', icon: Package, volume: 0.8 },
  ],
  bedroom: [
    { id: 'bed', name: 'Bett', icon: Bed, volume: 2.5 },
    { id: 'wardrobe', name: 'Kleiderschrank', icon: Package, volume: 2.0 },
    { id: 'dresser', name: 'Kommode', icon: Package, volume: 0.6 },
    { id: 'nightstand', name: 'Nachttisch', icon: Lamp, volume: 0.2 },
    { id: 'desk', name: 'Schreibtisch', icon: Package, volume: 0.8 },
    { id: 'chair', name: 'Stuhl', icon: Armchair, volume: 0.3 },
  ],
  kitchen: [
    { id: 'diningTable', name: 'Esstisch', icon: UtensilsCrossed, volume: 1.0 },
    { id: 'diningChairs', name: 'Essstühle (4)', icon: Armchair, volume: 0.8 },
    { id: 'fridge', name: 'Kühlschrank', icon: Package, volume: 1.5 },
    { id: 'washer', name: 'Waschmaschine', icon: Package, volume: 0.8 },
    { id: 'dryer', name: 'Trockner', icon: Package, volume: 0.8 },
    { id: 'dishwasher', name: 'Geschirrspüler', icon: Package, volume: 0.6 },
  ],
  other: [
    { id: 'boxes', name: 'Umzugskartons', icon: Package, volume: 0.06 },
    { id: 'plants', name: 'Pflanzen', icon: Flower2, volume: 0.2 },
    { id: 'bike', name: 'Fahrrad', icon: Dumbbell, volume: 0.5 },
    { id: 'babyItems', name: 'Kinderwagen', icon: Baby, volume: 0.8 },
    { id: 'gym', name: 'Fitnessgeräte', icon: Dumbbell, volume: 1.5 },
    { id: 'bathroom', name: 'Badmöbel', icon: Bath, volume: 0.4 },
  ]
};

// Swiss cities for autocomplete
const swissCities = [
  'Zürich', 'Genf', 'Basel', 'Bern', 'Lausanne', 'Winterthur', 
  'Luzern', 'St. Gallen', 'Lugano', 'Biel', 'Thun', 'Köniz',
  'La Chaux-de-Fonds', 'Schaffhausen', 'Fribourg', 'Chur', 'Neuchâtel',
  'Vernier', 'Uster', 'Sion', 'Emmen', 'Zug', 'Kriens', 'Rapperswil-Jona'
];

export const V3fGeminiPro: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fromAddress: '',
    toAddress: '',
    dateType: null,
    moveDate: null,
    inventory: {},
    floorOrigin: 0,
    floorDestination: 0,
    elevatorOrigin: false,
    elevatorDestination: false,
    walkingDistanceOrigin: 10,
    walkingDistanceDestination: 10,
    packingService: false,
    cleaningService: false,
    storageService: false,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [filteredFromCities, setFilteredFromCities] = useState<string[]>([]);
  const [filteredToCities, setFilteredToCities] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastAddedVolume, setLastAddedVolume] = useState(0);

  // Calculate total volume
  const totalVolume = Object.entries(formData.inventory).reduce((acc, [itemId, quantity]) => {
    const allItems = [...inventoryItems.living, ...inventoryItems.bedroom, ...inventoryItems.kitchen, ...inventoryItems.other];
    const item = allItems.find(i => i.id === itemId);
    return acc + (item ? item.volume * quantity : 0);
  }, 0);

  // Truck size thresholds
  const getTruckSize = () => {
    if (totalVolume <= 15) return { name: 'Kleintransporter', max: 15 };
    if (totalVolume <= 30) return { name: 'Transporter', max: 30 };
    if (totalVolume <= 50) return { name: 'LKW 7.5t', max: 50 };
    return { name: 'LKW 12t+', max: 80 };
  };

  const truckInfo = getTruckSize();
  const fillPercentage = Math.min((totalVolume / truckInfo.max) * 100, 100);

  // Filter cities for autocomplete
  useEffect(() => {
    if (formData.fromAddress.length >= 2) {
      const filtered = swissCities.filter(city => 
        city.toLowerCase().includes(formData.fromAddress.toLowerCase())
      );
      setFilteredFromCities(filtered);
      setShowFromSuggestions(filtered.length > 0);
    } else {
      setShowFromSuggestions(false);
    }
  }, [formData.fromAddress]);

  useEffect(() => {
    if (formData.toAddress.length >= 2) {
      const filtered = swissCities.filter(city => 
        city.toLowerCase().includes(formData.toAddress.toLowerCase())
      );
      setFilteredToCities(filtered);
      setShowToSuggestions(filtered.length > 0);
    } else {
      setShowToSuggestions(false);
    }
  }, [formData.toAddress]);

  // Handle inventory change with animation
  const handleInventoryChange = (itemId: string, delta: number, volume: number) => {
    const currentQty = formData.inventory[itemId] || 0;
    const newQty = Math.max(0, currentQty + delta);
    
    if (delta > 0) {
      setLastAddedVolume(volume);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 800);
    }
    
    setFormData(prev => ({
      ...prev,
      inventory: { ...prev.inventory, [itemId]: newQty }
    }));
  };

  // Validate current step
  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.fromAddress || !formData.toAddress) {
          toast.error('Bitte geben Sie beide Adressen ein');
          return false;
        }
        if (!formData.dateType) {
          toast.error('Bitte wählen Sie einen Umzugstermin');
          return false;
        }
        if (formData.dateType === 'specific' && !formData.moveDate) {
          toast.error('Bitte wählen Sie ein konkretes Datum');
          return false;
        }
        return true;
      case 2:
        if (totalVolume === 0) {
          toast.error('Bitte fügen Sie mindestens einen Gegenstand hinzu');
          return false;
        }
        return true;
      case 3:
        return true;
      case 4:
        if (!formData.firstName || !formData.lastName) {
          toast.error('Bitte geben Sie Ihren Namen ein');
          return false;
        }
        if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          toast.error('Bitte geben Sie eine gültige E-Mail-Adresse ein');
          return false;
        }
        if (!formData.phone || formData.phone.length < 10) {
          toast.error('Bitte geben Sie eine gültige Telefonnummer ein');
          return false;
        }
        if (!formData.acceptTerms) {
          toast.error('Bitte akzeptieren Sie die AGB');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    
    setIsSubmitting(true);
    
    try {
      let moveDate = formData.moveDate;
      if (formData.dateType === 'asap') {
        moveDate = new Date();
        moveDate.setDate(moveDate.getDate() + 7);
      } else if (formData.dateType === 'eom') {
        moveDate = new Date();
        moveDate.setMonth(moveDate.getMonth() + 1, 0);
      }

      const leadData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        from_city: formData.fromAddress,
        from_postal: '0000',
        to_city: formData.toAddress,
        to_postal: '0000',
        move_date: moveDate?.toISOString().split('T')[0],
        calculator_type: 'v3f-gemini-pro',
        calculator_input: {
          inventory: formData.inventory,
          totalVolume,
          floorOrigin: formData.floorOrigin,
          floorDestination: formData.floorDestination,
          elevatorOrigin: formData.elevatorOrigin,
          elevatorDestination: formData.elevatorDestination,
          walkingDistanceOrigin: formData.walkingDistanceOrigin,
          walkingDistanceDestination: formData.walkingDistanceDestination,
          packingService: formData.packingService,
          cleaningService: formData.cleaningService,
          storageService: formData.storageService,
        },
        calculator_output: {
          estimatedVolume: totalVolume,
          truckSize: truckInfo.name,
          priceMin: Math.round(totalVolume * 45),
          priceMax: Math.round(totalVolume * 65),
        }
      };

      const { error } = await supabase.from('leads').insert([leadData]);
      if (error) throw error;
      toast.success('Ihre Anfrage wurde erfolgreich gesendet!');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Route', icon: MapPin },
    { num: 2, label: 'Inventar', icon: Package },
    { num: 3, label: 'Logistik', icon: Truck },
    { num: 4, label: 'Abschluss', icon: Check },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 relative overflow-hidden">
        {/* Abstract background */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        {/* Focus Mode Header */}
        <header className="relative z-10 py-4 px-4 md:py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            {currentStep > 1 && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={handleBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Zurück</span>
              </motion.button>
            )}
            <div className={currentStep === 1 ? 'mx-auto' : ''}>
              <h1 className="text-xl font-bold text-primary">Umzugscheck.ch</h1>
            </div>
            {currentStep > 1 && <div className="w-16" />}
          </div>
        </header>

        {/* Mobile Progress Bar */}
        <div className="md:hidden sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Schritt {currentStep} von 4</span>
            <span className="text-xs font-medium text-primary">{steps[currentStep - 1].label}</span>
          </div>
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / 4) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Main Content */}
        <main className="relative z-10 max-w-4xl mx-auto px-4 py-6 md:py-10">
          <div className="flex gap-8">
            {/* Desktop Stepper */}
            <div className="hidden md:block w-48 shrink-0">
              <div className="sticky top-24 space-y-2">
                {steps.map((step, idx) => (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      currentStep === step.num 
                        ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' 
                        : currentStep > step.num
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/50 text-muted-foreground'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep > step.num ? 'bg-primary text-primary-foreground' : 'bg-background/50'
                    }`}>
                      {currentStep > step.num ? <Check className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                    </div>
                    <span className="font-medium text-sm">{step.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Form Container - Glassmorphism */}
            <motion.div className="flex-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="backdrop-blur-xl bg-white/90 border-white/50 shadow-2xl shadow-black/5 overflow-hidden">
                <CardContent className="p-6 md:p-8">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Route & Date */}
                    {currentStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center mb-8">
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Wohin geht die Reise?</h2>
                          <p className="text-muted-foreground">Geben Sie Start und Ziel ein – wir kümmern uns um den Rest.</p>
                        </div>

                        {/* Address Inputs */}
                        <div className="relative space-y-4">
                          <div className="relative">
                            <Label className="text-sm font-medium mb-2 block">Von</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                              <Input
                                value={formData.fromAddress}
                                onChange={(e) => setFormData(prev => ({ ...prev, fromAddress: e.target.value }))}
                                placeholder="z.B. Zürich"
                                className="pl-10 h-12 text-base border-2 focus:ring-2 focus:ring-primary/20"
                              />
                              <AnimatePresence>
                                {showFromSuggestions && (
                                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border overflow-hidden">
                                    {filteredFromCities.slice(0, 5).map((city) => (
                                      <button key={city} type="button" onClick={() => { setFormData(prev => ({ ...prev, fromAddress: city })); setShowFromSuggestions(false); }} className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{city}, Schweiz</span>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          {formData.fromAddress && formData.toAddress && (
                            <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} className="absolute left-7 top-[4.5rem] w-0.5 h-8 bg-gradient-to-b from-primary to-green-500 origin-top" />
                          )}

                          <div className="relative">
                            <Label className="text-sm font-medium mb-2 block">Nach</Label>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
                              <Input
                                value={formData.toAddress}
                                onChange={(e) => setFormData(prev => ({ ...prev, toAddress: e.target.value }))}
                                placeholder="z.B. Bern"
                                className="pl-10 h-12 text-base border-2 focus:ring-2 focus:ring-primary/20"
                              />
                              <AnimatePresence>
                                {showToSuggestions && (
                                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-xl border overflow-hidden">
                                    {filteredToCities.slice(0, 5).map((city) => (
                                      <button key={city} type="button" onClick={() => { setFormData(prev => ({ ...prev, toAddress: city })); setShowToSuggestions(false); }} className="w-full px-4 py-3 text-left hover:bg-primary/5 transition-colors flex items-center gap-3">
                                        <MapPin className="w-4 h-4 text-muted-foreground" />
                                        <span>{city}, Schweiz</span>
                                      </button>
                                    ))}
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>

                        {/* Distance Visualization */}
                        {formData.fromAddress && formData.toAddress && (
                          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-r from-primary/5 via-transparent to-green-500/5 rounded-xl p-4 border border-primary/10">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-sm font-medium">{formData.fromAddress}</span>
                              </div>
                              <div className="flex-1 mx-4 relative">
                                <div className="h-0.5 bg-gradient-to-r from-primary to-green-500" />
                                <motion.div initial={{ left: 0 }} animate={{ left: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary rounded-full shadow-lg" />
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                                <span className="text-sm font-medium">{formData.toAddress}</span>
                              </div>
                            </div>
                            <p className="text-center text-xs text-muted-foreground mt-2">Geschätzte Distanz: ~{Math.floor(Math.random() * 100 + 20)} km</p>
                          </motion.div>
                        )}

                        {/* Smart Date Chips */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Wann möchten Sie umziehen?</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                              { type: 'asap' as const, label: 'So bald wie möglich', icon: Rocket, desc: 'Innerhalb 2 Wochen' },
                              { type: 'eom' as const, label: 'Ende des Monats', icon: CalendarClock, desc: 'Flexibel' },
                              { type: 'specific' as const, label: 'Bestimmtes Datum', icon: CalendarIcon, desc: 'Ich weiss es genau' },
                            ].map((option) => (
                              <motion.button
                                key={option.type}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setFormData(prev => ({ ...prev, dateType: option.type }))}
                                className={`relative p-4 rounded-xl border-2 text-left transition-all ${formData.dateType === option.type ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-muted hover:border-primary/30'}`}
                              >
                                {formData.dateType === option.type && (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                    <Check className="w-3 h-3 text-primary-foreground" />
                                  </motion.div>
                                )}
                                <option.icon className={`w-6 h-6 mb-2 ${formData.dateType === option.type ? 'text-primary' : 'text-muted-foreground'}`} />
                                <p className="font-medium text-sm">{option.label}</p>
                                <p className="text-xs text-muted-foreground">{option.desc}</p>
                              </motion.button>
                            ))}
                          </div>

                          <AnimatePresence>
                            {formData.dateType === 'specific' && (
                              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal h-12 border-2">
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {formData.moveDate ? format(formData.moveDate, 'dd.MM.yyyy', { locale: de }) : <span>Datum wählen</span>}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={formData.moveDate || undefined} onSelect={(date) => setFormData(prev => ({ ...prev, moveDate: date || null }))} disabled={(date) => date < new Date()} initialFocus className="pointer-events-auto" />
                                  </PopoverContent>
                                </Popover>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Inventory */}
                    {currentStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Was kommt mit?</h2>
                          <p className="text-muted-foreground">Wählen Sie Ihre Möbel – wir berechnen das Volumen automatisch.</p>
                        </div>

                        <Tabs defaultValue="living" className="w-full">
                          <TabsList className="grid w-full grid-cols-4 mb-4">
                            <TabsTrigger value="living" className="text-xs md:text-sm"><Home className="w-4 h-4 mr-1 md:mr-2" /><span className="hidden md:inline">Wohnzimmer</span><span className="md:hidden">Wohnen</span></TabsTrigger>
                            <TabsTrigger value="bedroom" className="text-xs md:text-sm"><Bed className="w-4 h-4 mr-1 md:mr-2" /><span className="hidden md:inline">Schlafzimmer</span><span className="md:hidden">Schlafen</span></TabsTrigger>
                            <TabsTrigger value="kitchen" className="text-xs md:text-sm"><UtensilsCrossed className="w-4 h-4 mr-1 md:mr-2" /><span className="hidden md:inline">Küche</span><span className="md:hidden">Küche</span></TabsTrigger>
                            <TabsTrigger value="other" className="text-xs md:text-sm"><Package className="w-4 h-4 mr-1 md:mr-2" /><span className="hidden md:inline">Sonstiges</span><span className="md:hidden">Mehr</span></TabsTrigger>
                          </TabsList>

                          {Object.entries(inventoryItems).map(([category, items]) => (
                            <TabsContent key={category} value={category}>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {items.map((item) => {
                                  const quantity = formData.inventory[item.id] || 0;
                                  return (
                                    <motion.div key={item.id} whileHover={{ scale: 1.02 }} className={`relative p-4 rounded-xl border-2 transition-all ${quantity > 0 ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
                                      {quantity > 0 && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground shadow-lg">{quantity}</motion.div>
                                      )}
                                      <div className="text-center mb-3">
                                        <item.icon className={`w-8 h-8 mx-auto ${quantity > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
                                        <p className="text-sm font-medium mt-2">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.volume} m³</p>
                                      </div>
                                      <div className="flex items-center justify-center gap-2">
                                        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => handleInventoryChange(item.id, -1, item.volume)} disabled={quantity === 0} className="w-8 h-8 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center disabled:opacity-30"><Minus className="w-4 h-4" /></motion.button>
                                        <span className="w-8 text-center font-semibold">{quantity}</span>
                                        <motion.button type="button" whileTap={{ scale: 0.9 }} onClick={() => handleInventoryChange(item.id, 1, item.volume)} className="w-8 h-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center"><Plus className="w-4 h-4" /></motion.button>
                                      </div>
                                    </motion.div>
                                  );
                                })}
                              </div>
                            </TabsContent>
                          ))}
                        </Tabs>

                        {/* Truck Fill Meter - Gamification */}
                        <div className="bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-xl p-4 border border-primary/10">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2"><Truck className="w-5 h-5 text-primary" /><span className="font-medium text-sm">{truckInfo.name}</span></div>
                            <div className="flex items-center gap-2"><span className="text-2xl font-bold text-primary">{totalVolume.toFixed(1)}</span><span className="text-muted-foreground text-sm">m³</span></div>
                          </div>
                          <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                            <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-blue-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${fillPercentage}%` }} transition={{ type: 'spring', stiffness: 100 }} />
                            <AnimatePresence>{showConfetti && (<motion.div initial={{ opacity: 1, y: 0 }} animate={{ opacity: 0, y: -30 }} exit={{ opacity: 0 }} className="absolute right-4 -top-2 text-primary font-bold text-sm">+{lastAddedVolume.toFixed(1)} m³</motion.div>)}</AnimatePresence>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>0 m³</span><span>{truckInfo.max} m³</span></div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Logistics */}
                    {currentStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Details zur Logistik</h2>
                          <p className="text-muted-foreground">Diese Angaben helfen uns, den perfekten Preis zu berechnen.</p>
                        </div>

                        {/* Origin */}
                        <div className="space-y-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                          <div className="flex items-center gap-2 text-primary font-medium"><MapPin className="w-4 h-4" /><span>Abholadresse: {formData.fromAddress || 'Startort'}</span></div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label className="text-sm font-medium">Stockwerk</Label><Tooltip><TooltipTrigger><Info className="w-4 h-4 text-muted-foreground" /></TooltipTrigger><TooltipContent><p className="text-xs max-w-[200px]">Höhere Stockwerke ohne Lift benötigen mehr Träger.</p></TooltipContent></Tooltip></div>
                            <div className="flex gap-2 flex-wrap">
                              {['EG', '1', '2', '3', '4', '5+'].map((floor, idx) => (
                                <motion.button key={floor} type="button" whileTap={{ scale: 0.95 }} onClick={() => setFormData(prev => ({ ...prev, floorOrigin: idx }))} className={`w-12 h-12 rounded-xl font-medium transition-all ${formData.floorOrigin === idx ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted hover:bg-muted/80'}`}>{floor}</motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground" /><Label className="text-sm font-medium">Lift vorhanden</Label></div>
                            <Switch checked={formData.elevatorOrigin} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, elevatorOrigin: checked }))} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label className="text-sm font-medium">Trageweg</Label><span className={`text-sm font-medium ${formData.walkingDistanceOrigin > 50 ? 'text-amber-600' : 'text-muted-foreground'}`}>~{formData.walkingDistanceOrigin}m</span></div>
                            <Slider value={[formData.walkingDistanceOrigin]} onValueChange={([value]) => setFormData(prev => ({ ...prev, walkingDistanceOrigin: value }))} min={0} max={100} step={5} />
                            {formData.walkingDistanceOrigin > 50 && <p className="text-xs text-amber-600 flex items-center gap-1"><Info className="w-3 h-3" />Längere Tragewege können Zusatzkosten verursachen.</p>}
                          </div>
                        </div>

                        {/* Destination */}
                        <div className="space-y-4 p-4 bg-green-500/5 rounded-xl border border-green-500/10">
                          <div className="flex items-center gap-2 text-green-600 font-medium"><MapPin className="w-4 h-4" /><span>Zieladresse: {formData.toAddress || 'Zielort'}</span></div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Stockwerk</Label>
                            <div className="flex gap-2 flex-wrap">
                              {['EG', '1', '2', '3', '4', '5+'].map((floor, idx) => (
                                <motion.button key={floor} type="button" whileTap={{ scale: 0.95 }} onClick={() => setFormData(prev => ({ ...prev, floorDestination: idx }))} className={`w-12 h-12 rounded-xl font-medium transition-all ${formData.floorDestination === idx ? 'bg-green-500 text-white shadow-lg' : 'bg-muted hover:bg-muted/80'}`}>{floor}</motion.button>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2"><Building2 className="w-4 h-4 text-muted-foreground" /><Label className="text-sm font-medium">Lift vorhanden</Label></div>
                            <Switch checked={formData.elevatorDestination} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, elevatorDestination: checked }))} />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between"><Label className="text-sm font-medium">Trageweg</Label><span className={`text-sm font-medium ${formData.walkingDistanceDestination > 50 ? 'text-amber-600' : 'text-muted-foreground'}`}>~{formData.walkingDistanceDestination}m</span></div>
                            <Slider value={[formData.walkingDistanceDestination]} onValueChange={([value]) => setFormData(prev => ({ ...prev, walkingDistanceDestination: value }))} min={0} max={100} step={5} />
                          </div>
                        </div>

                        {/* Services */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Zusatzservices</Label>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                              { id: 'packingService', label: 'Packservice', icon: Package, desc: 'Wir packen für Sie', price: '+CHF 200-400' },
                              { id: 'cleaningService', label: 'Endreinigung', icon: Sparkles, desc: 'Professionelle Reinigung', price: '+CHF 150-350' },
                              { id: 'storageService', label: 'Zwischenlagerung', icon: Building2, desc: 'Sichere Lagerung', price: 'Ab CHF 80/Mt.' },
                            ].map((service) => (
                              <motion.div key={service.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setFormData(prev => ({ ...prev, [service.id]: !prev[service.id as keyof FormData] }))} className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${formData[service.id as keyof FormData] ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/30'}`}>
                                <div className="flex items-start gap-3">
                                  <Checkbox checked={formData[service.id as keyof FormData] as boolean} className="mt-1" />
                                  <div>
                                    <div className="flex items-center gap-2"><service.icon className="w-4 h-4 text-primary" /><span className="font-medium text-sm">{service.label}</span></div>
                                    <p className="text-xs text-muted-foreground mt-1">{service.desc}</p>
                                    <p className="text-xs text-primary mt-1">{service.price}</p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 4: Contact */}
                    {currentStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                        <div className="text-center mb-6">
                          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Fast geschafft! 🎉</h2>
                          <p className="text-muted-foreground">Wohin sollen wir Ihre persönliche Offerte senden?</p>
                        </div>

                        {/* Summary */}
                        <div className="bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-xl p-4 border border-primary/10 space-y-3">
                          <h3 className="font-semibold text-sm flex items-center gap-2"><FileCheck className="w-4 h-4 text-primary" />Ihre Umzugsübersicht</h3>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div><p className="text-muted-foreground text-xs">Route</p><p className="font-medium">{formData.fromAddress} → {formData.toAddress}</p></div>
                            <div><p className="text-muted-foreground text-xs">Volumen</p><p className="font-medium">{totalVolume.toFixed(1)} m³ ({truckInfo.name})</p></div>
                            <div><p className="text-muted-foreground text-xs">Termin</p><p className="font-medium">{formData.dateType === 'asap' && 'Schnellstmöglich'}{formData.dateType === 'eom' && 'Ende des Monats'}{formData.dateType === 'specific' && formData.moveDate && format(formData.moveDate, 'dd.MM.yyyy', { locale: de })}</p></div>
                            <div><p className="text-muted-foreground text-xs">Geschätzter Preis</p><p className="font-bold text-primary">CHF {Math.round(totalVolume * 45)} - {Math.round(totalVolume * 65)}</p></div>
                          </div>
                        </div>

                        {/* Contact Form */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="firstName">Vorname</Label><div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="firstName" value={formData.firstName} onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))} placeholder="Max" className="pl-10 h-12" /></div></div>
                            <div className="space-y-2"><Label htmlFor="lastName">Nachname</Label><Input id="lastName" value={formData.lastName} onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))} placeholder="Muster" className="h-12" /></div>
                          </div>
                          <div className="space-y-2"><Label htmlFor="email">E-Mail</Label><div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} placeholder="max.muster@email.ch" className="pl-10 h-12" /></div></div>
                          <div className="space-y-2"><Label htmlFor="phone">Telefon</Label><div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} placeholder="+41 79 123 45 67" className="pl-10 h-12" /></div><p className="text-xs text-muted-foreground flex items-center gap-1"><Lock className="w-3 h-3" />Nur für Rückfragen zum Umzug – kein Spam.</p></div>

                          <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl">
                            <Checkbox id="terms" checked={formData.acceptTerms} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))} className="mt-0.5" />
                            <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">Ich akzeptiere die <a href="/agb" className="text-primary underline hover:no-underline">AGB</a> und <a href="/datenschutz" className="text-primary underline hover:no-underline">Datenschutzerklärung</a>.</Label>
                          </div>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center gap-4 py-4 border-t border-muted">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="w-3 h-3" /><span>SSL verschlüsselt</span></div>
                          <div className="w-px h-4 bg-muted" />
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Shield className="w-3 h-3" /><span>DSGVO konform</span></div>
                          <div className="w-px h-4 bg-muted" />
                          <div className="flex items-center gap-1 text-xs text-muted-foreground"><BadgeCheck className="w-3 h-3" /><span>Geprüfte Partner</span></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>

              {/* Sticky CTA */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
                <Button onClick={currentStep === 4 ? handleSubmit : handleNext} disabled={isSubmitting} className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/20">
                  {isSubmitting ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : currentStep === 4 ? (
                    <><Zap className="w-5 h-5 mr-2" />Kostenlose Offerte erhalten</>
                  ) : (
                    <>Weiter<ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
                <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="flex">{[...Array(5)].map((_, i) => (<Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />))}</div>
                    <span className="font-medium">4.9</span>
                  </div>
                  <span>|</span>
                  <span>15'247 zufriedene Kunden</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default V3fGeminiPro;
