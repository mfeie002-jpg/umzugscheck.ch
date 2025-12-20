import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  MapPin, 
  Calendar, 
  Home, 
  Package, 
  Trash2, 
  Sparkles, 
  Building, 
  Car,
  Phone,
  Mail,
  User,
  Shield,
  Star,
  Clock,
  Upload,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdvancedSEO } from '@/components/seo/AdvancedSEO';

// Types
interface WizardData {
  // Step 1: Move Basics
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  moveDate: string;
  homeSize: string;
  
  // Step 2: Services
  packingService: boolean;
  cleaningService: boolean;
  disposalService: boolean;
  storageService: boolean;
  furnitureLift: boolean;
  assemblyService: boolean;
  
  // Step 3: Accessibility
  fromFloor: string;
  fromHasLift: boolean;
  toFloor: string;
  toHasLift: boolean;
  parkingFrom: string;
  parkingTo: string;
  specialItems: string;
  
  // Step 4: Contact
  name: string;
  email: string;
  phone: string;
  comments: string;
  acceptPrivacy: boolean;
  acceptMarketing: boolean;
  
  // Optional AI data
  aiEstimate?: {
    volumeM3?: number;
    itemCount?: number;
    priceMin?: number;
    priceMax?: number;
  };
}

const STORAGE_KEY = 'umzugscheck_wizard_data';

const homeSizeOptions = [
  { value: '1', label: '1 Zimmer', rooms: 1 },
  { value: '1.5', label: '1.5 Zimmer', rooms: 1.5 },
  { value: '2', label: '2 Zimmer', rooms: 2 },
  { value: '2.5', label: '2.5 Zimmer', rooms: 2.5 },
  { value: '3', label: '3 Zimmer', rooms: 3 },
  { value: '3.5', label: '3.5 Zimmer', rooms: 3.5 },
  { value: '4', label: '4 Zimmer', rooms: 4 },
  { value: '4.5', label: '4.5 Zimmer', rooms: 4.5 },
  { value: '5', label: '5 Zimmer', rooms: 5 },
  { value: '5.5', label: '5.5 Zimmer', rooms: 5.5 },
  { value: '6+', label: '6+ Zimmer', rooms: 6 },
];

const floorOptions = [
  { value: 'eg', label: 'Erdgeschoss' },
  { value: '1', label: '1. Stock' },
  { value: '2', label: '2. Stock' },
  { value: '3', label: '3. Stock' },
  { value: '4', label: '4. Stock' },
  { value: '5+', label: '5+ Stock' },
];

const parkingOptions = [
  { value: 'direct', label: 'Direkt vor dem Haus' },
  { value: 'near', label: 'In der Nähe (< 50m)' },
  { value: 'far', label: 'Weiter entfernt (> 50m)' },
  { value: 'unknown', label: 'Weiss nicht' },
];

const initialData: WizardData = {
  fromPostal: '',
  fromCity: '',
  toPostal: '',
  toCity: '',
  moveDate: '',
  homeSize: '',
  packingService: false,
  cleaningService: false,
  disposalService: false,
  storageService: false,
  furnitureLift: false,
  assemblyService: false,
  fromFloor: '',
  fromHasLift: false,
  toFloor: '',
  toHasLift: false,
  parkingFrom: '',
  parkingTo: '',
  specialItems: '',
  name: '',
  email: '',
  phone: '',
  comments: '',
  acceptPrivacy: false,
  acceptMarketing: false,
};

const Vergleich: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAIUpload, setShowAIUpload] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState<{ min: number; max: number } | null>(null);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData((prev) => ({ ...prev, ...parsed }));
      } catch {
        // Invalid data, ignore
      }
    }

    // Track wizard start
    trackEvent('wizard_start');
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  // Calculate estimated price after step 2
  useEffect(() => {
    if (currentStep >= 2 && data.homeSize) {
      const rooms = parseFloat(data.homeSize) || 2;
      const basePrice = rooms * 400;
      const servicesMultiplier = 
        (data.packingService ? 0.25 : 0) +
        (data.cleaningService ? 0.15 : 0) +
        (data.disposalService ? 0.1 : 0) +
        (data.storageService ? 0.2 : 0) +
        (data.furnitureLift ? 0.15 : 0) +
        (data.assemblyService ? 0.1 : 0);
      
      const min = Math.round(basePrice * (1 + servicesMultiplier) * 0.8);
      const max = Math.round(basePrice * (1 + servicesMultiplier) * 1.4);
      setEstimatedPrice({ min, max });
    }
  }, [currentStep, data.homeSize, data.packingService, data.cleaningService, data.disposalService, data.storageService, data.furnitureLift, data.assemblyService]);

  const trackEvent = useCallback((eventName: string, eventData?: Record<string, unknown>) => {
    // GA4 / Analytics tracking
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', eventName, eventData);
    }
    
    // Console log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Funnel Event] ${eventName}`, eventData);
    }
  }, []);

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.fromPostal && data.toPostal && data.moveDate && data.homeSize);
      case 2:
        return true; // Services are optional
      case 3:
        return !!(data.fromFloor && data.toFloor);
      case 4:
        return !!(data.name && data.email && data.phone && data.acceptPrivacy);
      default:
        return true;
    }
  }, [data]);

  const nextStep = useCallback(() => {
    if (!validateStep(currentStep)) {
      toast({
        title: 'Bitte füllen Sie alle Pflichtfelder aus',
        variant: 'destructive',
      });
      return;
    }

    trackEvent(`wizard_step_${currentStep}_complete`, { step: currentStep });
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  }, [currentStep, validateStep, toast, trackEvent]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: 'Bitte füllen Sie alle Pflichtfelder aus',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    trackEvent('wizard_submit_start');

    try {
      const calculatorInput = {
        fromPostal: data.fromPostal,
        fromCity: data.fromCity,
        toPostal: data.toPostal,
        toCity: data.toCity,
        moveDate: data.moveDate,
        homeSize: data.homeSize,
        services: {
          packing: data.packingService,
          cleaning: data.cleaningService,
          disposal: data.disposalService,
          storage: data.storageService,
          furnitureLift: data.furnitureLift,
          assembly: data.assemblyService,
        },
        accessibility: {
          fromFloor: data.fromFloor,
          fromHasLift: data.fromHasLift,
          toFloor: data.toFloor,
          toHasLift: data.toHasLift,
          parkingFrom: data.parkingFrom,
          parkingTo: data.parkingTo,
          specialItems: data.specialItems,
        },
      };

      const calculatorOutput = {
        priceMin: estimatedPrice?.min || 0,
        priceMax: estimatedPrice?.max || 0,
        aiEstimate: data.aiEstimate,
      };

      const { error } = await supabase.from('leads').insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        from_postal: data.fromPostal,
        from_city: data.fromCity || 'Unbekannt',
        to_postal: data.toPostal,
        to_city: data.toCity || 'Unbekannt',
        move_date: data.moveDate,
        calculator_type: 'vergleich_wizard',
        calculator_input: calculatorInput,
        calculator_output: calculatorOutput,
        comments: data.comments,
        lead_source: 'vergleich_wizard',
      });

      if (error) throw error;

      // Clear saved data
      localStorage.removeItem(STORAGE_KEY);

      trackEvent('wizard_submit_success', { 
        priceMin: estimatedPrice?.min,
        priceMax: estimatedPrice?.max,
      });

      setCurrentStep(5); // Go to confirmation

    } catch (error) {
      console.error('Submit error:', error);
      trackEvent('wizard_submit_error');
      toast({
        title: 'Fehler beim Absenden',
        description: 'Bitte versuchen Sie es erneut oder kontaktieren Sie uns.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          Schritt {currentStep} von {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}% abgeschlossen
        </span>
      </div>
      <Progress value={progress} className="h-2" />
      
      <div className="flex justify-between mt-4">
        {['Umzugsdaten', 'Services', 'Zugang', 'Kontakt', 'Fertig'].map((label, index) => (
          <div 
            key={label}
            className={`flex flex-col items-center ${index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1 transition-colors ${
                index + 1 < currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : index + 1 === currentStep 
                    ? 'bg-primary/20 text-primary border-2 border-primary' 
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1 < currentStep ? <Check className="w-4 h-4" /> : index + 1}
            </div>
            <span className="text-xs hidden sm:block">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Wohin geht Ihr Umzug?</h2>
        <p className="text-muted-foreground">
          Geben Sie Ihre Umzugsdaten ein, um passende Angebote zu erhalten.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* From Location */}
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="font-semibold">Von</span>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fromPostal">PLZ *</Label>
                <Input
                  id="fromPostal"
                  placeholder="z.B. 8001"
                  value={data.fromPostal}
                  onChange={(e) => updateData({ fromPostal: e.target.value })}
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="fromCity">Ort (optional)</Label>
                <Input
                  id="fromCity"
                  placeholder="z.B. Zürich"
                  value={data.fromCity}
                  onChange={(e) => updateData({ fromCity: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* To Location */}
        <Card className="border-2 hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="font-semibold">Nach</span>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="toPostal">PLZ *</Label>
                <Input
                  id="toPostal"
                  placeholder="z.B. 3011"
                  value={data.toPostal}
                  onChange={(e) => updateData({ toPostal: e.target.value })}
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="toCity">Ort (optional)</Label>
                <Input
                  id="toCity"
                  placeholder="z.B. Bern"
                  value={data.toCity}
                  onChange={(e) => updateData({ toCity: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date and Size */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="moveDate" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Umzugsdatum *
          </Label>
          <Input
            id="moveDate"
            type="date"
            value={data.moveDate}
            onChange={(e) => updateData({ moveDate: e.target.value })}
            min={new Date().toISOString().split('T')[0]}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="homeSize" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Wohnungsgrösse *
          </Label>
          <select
            id="homeSize"
            value={data.homeSize}
            onChange={(e) => updateData({ homeSize: e.target.value })}
            className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">Bitte wählen...</option>
            {homeSizeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Welche Services benötigen Sie?</h2>
        <p className="text-muted-foreground">
          Wählen Sie optionale Zusatzleistungen für Ihren Umzug.
        </p>
      </div>

      {/* Show estimated price */}
      {estimatedPrice && (
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Geschätzte Kosten:</span>
              <span className="text-xl font-bold text-primary">
                CHF {estimatedPrice.min.toLocaleString()} – {estimatedPrice.max.toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Basierend auf Ihren Angaben. Finale Offerten können abweichen.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {[
          { key: 'packingService', icon: Package, label: 'Packservice', desc: 'Professionelles Ein- und Auspacken' },
          { key: 'cleaningService', icon: Sparkles, label: 'Reinigung', desc: 'End- oder Umzugsreinigung' },
          { key: 'disposalService', icon: Trash2, label: 'Entsorgung', desc: 'Sperrmüll & Altmöbel entsorgen' },
          { key: 'storageService', icon: Building, label: 'Lagerung', desc: 'Zwischenlagerung Ihrer Möbel' },
          { key: 'furnitureLift', icon: Building, label: 'Möbellift', desc: 'Aussenlift für grosse Möbel' },
          { key: 'assemblyService', icon: Package, label: 'Möbelmontage', desc: 'Ab- und Aufbau von Möbeln' },
        ].map(({ key, icon: Icon, label, desc }) => (
          <Card 
            key={key}
            className={`cursor-pointer transition-all border-2 ${
              data[key as keyof WizardData] ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
            }`}
            onClick={() => updateData({ [key]: !data[key as keyof WizardData] })}
          >
            <CardContent className="py-4 flex items-start gap-4">
              <Checkbox 
                checked={data[key as keyof WizardData] as boolean} 
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="font-medium">{label}</span>
                </div>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Optional AI Upload */}
      <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
        <CardContent className="py-6">
          <div 
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowAIUpload(!showAIUpload)}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Genauere Schätzung mit KI (optional)</p>
                <p className="text-sm text-muted-foreground">
                  Laden Sie ein kurzes Video Ihrer Wohnung hoch
                </p>
              </div>
            </div>
            <ArrowRight className={`w-5 h-5 transition-transform ${showAIUpload ? 'rotate-90' : ''}`} />
          </div>
          
          {showAIUpload && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm mb-3">
                Ein 30–60 Sekunden Video Ihrer Räume hilft uns, das Volumen genauer zu schätzen.
              </p>
              <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Video hierher ziehen oder klicken zum Auswählen
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Max. 100MB · MP4, MOV, WebM
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                🔒 Ihre Daten werden verschlüsselt übertragen und nach der Analyse gelöscht.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Zugänglichkeit</h2>
        <p className="text-muted-foreground">
          Diese Informationen helfen bei der genauen Preiskalkulation.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* From Location Details */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Auszugsadresse
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fromFloor">Stockwerk *</Label>
                <select
                  id="fromFloor"
                  value={data.fromFloor}
                  onChange={(e) => updateData({ fromFloor: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Bitte wählen...</option>
                  {floorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="fromHasLift"
                  checked={data.fromHasLift}
                  onCheckedChange={(checked) => updateData({ fromHasLift: !!checked })}
                />
                <Label htmlFor="fromHasLift">Lift vorhanden</Label>
              </div>
              <div>
                <Label htmlFor="parkingFrom">Parkiermöglichkeit</Label>
                <select
                  id="parkingFrom"
                  value={data.parkingFrom}
                  onChange={(e) => updateData({ parkingFrom: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Bitte wählen...</option>
                  {parkingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* To Location Details */}
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              Einzugsadresse
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="toFloor">Stockwerk *</Label>
                <select
                  id="toFloor"
                  value={data.toFloor}
                  onChange={(e) => updateData({ toFloor: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Bitte wählen...</option>
                  {floorOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="toHasLift"
                  checked={data.toHasLift}
                  onCheckedChange={(checked) => updateData({ toHasLift: !!checked })}
                />
                <Label htmlFor="toHasLift">Lift vorhanden</Label>
              </div>
              <div>
                <Label htmlFor="parkingTo">Parkiermöglichkeit</Label>
                <select
                  id="parkingTo"
                  value={data.parkingTo}
                  onChange={(e) => updateData({ parkingTo: e.target.value })}
                  className="mt-2 w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Bitte wählen...</option>
                  {parkingOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Special Items */}
      <div>
        <Label htmlFor="specialItems" className="flex items-center gap-2">
          <Package className="w-4 h-4" />
          Besondere Gegenstände (optional)
        </Label>
        <Textarea
          id="specialItems"
          placeholder="z.B. Klavier, Aquarium, Tresor, antike Möbel..."
          value={data.specialItems}
          onChange={(e) => updateData({ specialItems: e.target.value })}
          className="mt-2"
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Fast geschafft!</h2>
        <p className="text-muted-foreground">
          Ihre Kontaktdaten für die Offerten.
        </p>
      </div>

      {/* Trust Badges */}
      <Card className="bg-muted/50 border-none mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>100% Kostenlos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              <span>Geprüfte Firmen</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <span>Ø 4.8/5 Bewertung</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span>Offerten in 24h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Ihr Name *
          </Label>
          <Input
            id="name"
            placeholder="Vorname Nachname"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Telefon *
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="079 123 45 67"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            className="mt-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          E-Mail *
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="ihre@email.ch"
          value={data.email}
          onChange={(e) => updateData({ email: e.target.value })}
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="comments">Anmerkungen (optional)</Label>
        <Textarea
          id="comments"
          placeholder="Zusätzliche Informationen für die Umzugsfirmen..."
          value={data.comments}
          onChange={(e) => updateData({ comments: e.target.value })}
          className="mt-2"
          rows={3}
        />
      </div>

      <div className="space-y-3 pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="acceptPrivacy"
            checked={data.acceptPrivacy}
            onCheckedChange={(checked) => updateData({ acceptPrivacy: !!checked })}
          />
          <Label htmlFor="acceptPrivacy" className="text-sm leading-relaxed">
            Ich akzeptiere die <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a> und 
            die <a href="/agb" className="text-primary hover:underline">AGB</a>. *
          </Label>
        </div>
        <div className="flex items-start space-x-2">
          <Checkbox 
            id="acceptMarketing"
            checked={data.acceptMarketing}
            onCheckedChange={(checked) => updateData({ acceptMarketing: !!checked })}
          />
          <Label htmlFor="acceptMarketing" className="text-sm text-muted-foreground leading-relaxed">
            Ich möchte gelegentlich Tipps und Angebote per E-Mail erhalten (optional).
          </Label>
        </div>
      </div>

      {/* What happens next */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-4">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Was passiert nach dem Absenden?
          </h4>
          <ol className="text-sm space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-medium text-primary">1.</span>
              Wir prüfen Ihre Anfrage und matchen Sie mit passenden Firmen.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-primary">2.</span>
              Sie erhalten innerhalb von 24h bis zu 5 unverbindliche Offerten.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium text-primary">3.</span>
              Sie vergleichen in Ruhe und wählen Ihr bestes Angebot.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep5 = () => (
    <div className="text-center py-12 animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 className="w-10 h-10 text-primary" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4">Vielen Dank!</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
        Ihre Anfrage wurde erfolgreich übermittelt. Sie erhalten in Kürze passende Offerten.
      </p>

      <Card className="max-w-md mx-auto mb-8">
        <CardContent className="py-6">
          <h3 className="font-semibold mb-4">So geht es weiter:</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Bestätigung per E-Mail</p>
                <p className="text-sm text-muted-foreground">Sie erhalten in wenigen Minuten eine Bestätigung.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Offerten in 24 Stunden</p>
                <p className="text-sm text-muted-foreground">Bis zu 5 passende Umzugsfirmen melden sich bei Ihnen.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Sie entscheiden</p>
                <p className="text-sm text-muted-foreground">Vergleichen Sie die Angebote und wählen Sie Ihren Favoriten.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={() => navigate('/')} variant="outline" size="lg">
          Zur Startseite
        </Button>
        <Button onClick={() => navigate('/umzugsfirmen')} size="lg">
          Umzugsfirmen ansehen
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <AdvancedSEO
        title="Umzugsofferten vergleichen - Kostenlos & Unverbindlich"
        description="Vergleichen Sie jetzt kostenlos bis zu 5 Umzugsofferten von geprüften Schweizer Umzugsfirmen. Sparen Sie bis zu 40% bei Ihrem Umzug."
        keywords={['Umzugsofferten', 'Umzug vergleichen', 'Umzugsfirma Schweiz', 'Umzugskosten']}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'Offerten vergleichen', url: '/vergleich' },
        ]}
      />

      <div className="min-h-screen bg-muted/30 py-8 md:py-12">
        <div className="container max-w-3xl">
          {/* Back button */}
          {currentStep > 1 && currentStep < 5 && (
            <Button 
              variant="ghost" 
              onClick={prevStep}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>
          )}

          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              {currentStep < 5 && renderStepIndicator()}

              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}

              {/* Navigation Buttons */}
              {currentStep < 5 && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button 
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Zurück
                  </Button>

                  {currentStep < 4 ? (
                    <Button onClick={nextStep} className="gap-2">
                      Weiter
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="gap-2 bg-secondary hover:bg-secondary/90"
                    >
                      {isSubmitting ? (
                        <>Wird gesendet...</>
                      ) : (
                        <>
                          Kostenlos Offerten erhalten
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Footer */}
          {currentStep < 5 && (
            <div className="text-center mt-6 text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                100% kostenlos & unverbindlich · Ihre Daten sind sicher
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Vergleich;
