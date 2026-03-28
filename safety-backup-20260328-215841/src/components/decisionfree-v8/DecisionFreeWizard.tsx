import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  MapPin, Home, Truck, Users, Package, Sparkles, 
  Shield, Star, Clock, Lock, Check, ChevronRight, ChevronLeft,
  MessageCircle, Phone, ArrowRight, Zap, Heart, Award,
  Camera, Bell, FileText, Brain, Scan, Building2, 
  CreditCard, Calendar, User, Mail, CheckCircle2, Gift,
  Eye, Video, Bot, Headphones
} from 'lucide-react';
import { CountUp } from '@/components/ui/animated-counter';
import { useCaptureMode } from "@/hooks/use-capture-mode";

type Step = 'welcome' | 'scan' | 'proposal' | 'confirm' | 'dashboard' | 'moving-day';

interface MoveData {
  fromPostal: string;
  fromCity: string;
  toPostal: string;
  toCity: string;
  propertySize: 'studio' | '2room' | '3room' | '4room' | 'house';
  moveDate: string;
  serviceTier: number;
  scanComplete: boolean;
  inventoryItems: number;
  estimatedVolume: number;
  contact: { name: string; email: string; phone: string };
  extras: {
    cleaning: boolean;
    disposal: boolean;
    storage: boolean;
    halteverbot: boolean;
    eumzug: boolean;
  };
}

const PROPERTY_SIZES = [
  { value: 'studio', label: 'Studio', icon: '🏠', volume: 15, typicalItems: 35 },
  { value: '2room', label: '2-Zi', icon: '🏘️', volume: 25, typicalItems: 65 },
  { value: '3room', label: '3.5-Zi', icon: '🏡', volume: 35, typicalItems: 95 },
  { value: '4room', label: '4-5 Zi', icon: '🏛️', volume: 50, typicalItems: 140 },
  { value: 'house', label: 'Haus', icon: '🏰', volume: 80, typicalItems: 220 }
];

const SERVICE_TIERS = [
  { value: 0, name: 'Self-Service', description: 'Du packst, wir transportieren', multiplier: 0.4 },
  { value: 50, name: 'Hybrid', description: 'Du packst, wir tragen & montieren', multiplier: 1.0 },
  { value: 80, name: 'Komfort', description: 'Rundum-sorglos Paket', multiplier: 2.2, recommended: true },
  { value: 100, name: 'White Glove', description: 'Schlüssel abgeben, fertig', multiplier: 4.5 }
];

const CREW_MEMBERS = [
  { id: 1, name: 'Marc K.', role: 'Teamleiter', rating: 4.9, languages: ['DE', 'IT'], photo: '👨‍💼' },
  { id: 2, name: 'Nina S.', role: 'Spezialistin', rating: 5.0, languages: ['DE', 'FR'], photo: '👩‍🔧' },
  { id: 3, name: 'Lukas W.', role: 'Umzugsprofi', rating: 4.8, languages: ['DE', 'EN'], photo: '👷' }
];

export const DecisionFreeWizard = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  const [step, setStep] = useState<Step>('welcome');
  const [moveData, setMoveData] = useState<MoveData>({
    fromPostal: '',
    fromCity: '',
    toPostal: '',
    toCity: '',
    propertySize: '3room',
    moveDate: '',
    serviceTier: 80,
    scanComplete: false,
    inventoryItems: 0,
    estimatedVolume: 0,
    contact: { name: '', email: '', phone: '' },
    extras: {
      cleaning: true, // Default ON
      disposal: false,
      storage: false,
      halteverbot: true, // Auto-detected
      eumzug: true // Auto-enabled
    }
  });
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [conciergeActive, setConciergeActive] = useState(false);
  const [trackingProgress, setTrackingProgress] = useState(0);

  // Capture mode: jump to step and prefill data
  useEffect(() => {
    if (isCaptureMode && captureStep !== null) {
      const stepMap: Record<number, Step> = { 1: 'welcome', 2: 'scan', 3: 'proposal', 4: 'confirm', 5: 'dashboard', 6: 'moving-day' };
      const targetStep = stepMap[captureStep];
      if (targetStep) {
        setStep(targetStep);
        setMoveData({
          fromPostal: demoData.fromPostal,
          fromCity: demoData.fromCity,
          toPostal: demoData.toPostal,
          toCity: demoData.toCity,
          propertySize: '3room',
          moveDate: demoData.moveDate,
          serviceTier: demoData.serviceLevel,
          scanComplete: captureStep >= 3,
          inventoryItems: 95,
          estimatedVolume: 35,
          contact: { name: demoData.name, email: demoData.email, phone: demoData.phone },
          extras: { cleaning: true, disposal: false, storage: false, halteverbot: true, eumzug: true }
        });
      }
    }
  }, [isCaptureMode, captureStep, demoData]);

  // Calculate price based on AI analysis
  const calculatePrice = () => {
    const property = PROPERTY_SIZES.find(p => p.value === moveData.propertySize);
    const tier = SERVICE_TIERS.find(t => t.value === moveData.serviceTier);
    if (!property || !tier) return { total: 0, breakdown: {} };

    const baseVolume = moveData.scanComplete ? moveData.estimatedVolume : property.volume;
    const baseRate = 48;
    const basePrice = Math.round(baseVolume * baseRate * tier.multiplier);
    
    const breakdown: Record<string, number> = {
      transport: Math.round(basePrice * 0.30),
      crew: Math.round(basePrice * 0.40),
      versicherung: Math.round(basePrice * 0.10),
      material: Math.round(basePrice * 0.08)
    };

    if (moveData.extras.cleaning) {
      breakdown.reinigung = 480;
    }
    if (moveData.extras.disposal) {
      breakdown.entsorgung = 280;
    }
    if (moveData.extras.halteverbot) {
      breakdown.halteverbot = 80;
    }

    const total = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
    return { total, breakdown };
  };

  const price = calculatePrice();

  // Simulate AI video scan
  const startVideoScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          const property = PROPERTY_SIZES.find(p => p.value === moveData.propertySize);
          setMoveData(prev => ({
            ...prev,
            scanComplete: true,
            inventoryItems: property?.typicalItems || 95,
            estimatedVolume: (property?.volume || 35) + Math.round(Math.random() * 10 - 5)
          }));
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  // Simulate moving day tracking
  useEffect(() => {
    if (step === 'moving-day') {
      const interval = setInterval(() => {
        setTrackingProgress(prev => Math.min(prev + Math.random() * 3, 100));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [step]);

  const stepProgress = {
    'welcome': 15,
    'scan': 35,
    'proposal': 60,
    'confirm': 85,
    'dashboard': 95,
    'moving-day': 100
  };

  const renderWelcome = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Hero */}
      <div className="text-center space-y-4">
        <Badge variant="secondary" className="bg-primary/10 text-primary mb-2">
          <Brain className="h-3 w-3 mr-1" />
          KI-gestütztes Relocation Operating System
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Wir übernehmen <span className="text-primary">alles</span>.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Keine Entscheidungen. Keine Listen. Keine Sorgen.
          <br />
          Unser System analysiert, plant und führt Ihren Umzug vollständig aus.
        </p>
      </div>

      {/* Minimal Input Form */}
      <Card className="max-w-lg mx-auto border-2 border-primary/20 shadow-xl">
        <CardHeader className="text-center pb-2">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Bot className="h-4 w-4" />
            Ihr persönlicher Move Concierge wird aktiviert
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* From/To - The only required input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Von
              </Label>
              <Input
                placeholder="PLZ (z.B. 8001)"
                value={moveData.fromPostal}
                onChange={(e) => setMoveData({ ...moveData, fromPostal: e.target.value })}
                className="h-12 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-destructive" />
                Nach
              </Label>
              <Input
                placeholder="PLZ (z.B. 3011)"
                value={moveData.toPostal}
                onChange={(e) => setMoveData({ ...moveData, toPostal: e.target.value })}
                className="h-12 text-lg"
              />
            </div>
          </div>

          {/* Property Size - Visual Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Wohnungsgrösse (wird durch KI-Scan präzisiert)</Label>
            <div className="grid grid-cols-5 gap-2">
              {PROPERTY_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setMoveData({ ...moveData, propertySize: size.value as any })}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    moveData.propertySize === size.value
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

          {/* AI Estimate Banner */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">KI-Schätzung basierend auf 450'000+ Umzügen</div>
                <div className="text-3xl font-bold text-primary mt-1">
                  CHF <CountUp end={Math.round(price.total * 0.85)} duration={800} />–<CountUp end={price.total} duration={800} />
                </div>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
                  <Lock className="h-3 w-3 mr-1" />
                  Festpreis-Garantie
                </Badge>
              </div>
            </div>
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg"
            onClick={() => setStep('scan')}
            disabled={!moveData.fromPostal || !moveData.toPostal}
          >
            <Camera className="mr-2 h-5 w-5" />
            Video-Scan starten
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Keine Formulare, keine Listen – unsere KI erkennt Ihr Inventar automatisch
          </p>
        </CardContent>
      </Card>

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          <span>Vollkasko ohne Selbstbehalt</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>4.9/5 (3'200+ Bewertungen)</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-primary" />
          <span>Abnahmegarantie inkl.</span>
        </div>
      </div>

      {/* Competitive Advantage */}
      <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto pt-8">
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">❌</div>
            <h3 className="font-semibold text-sm">Klassische Firma</h3>
            <p className="text-xs text-muted-foreground mt-1">5+ Offerten vergleichen, selbst koordinieren</p>
          </CardContent>
        </Card>
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">❌</div>
            <h3 className="font-semibold text-sm">Vermittlungsplattform</h3>
            <p className="text-xs text-muted-foreground mt-1">"Spam" durch Partner, keine Verantwortung</p>
          </CardContent>
        </Card>
        <Card className="border-primary border-2 bg-primary/5">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">✅</div>
            <h3 className="font-semibold text-sm text-primary">Unser System</h3>
            <p className="text-xs text-muted-foreground mt-1">Ein Ansprechpartner, volle Verantwortung</p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );

  const renderScan = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8 max-w-2xl mx-auto"
    >
      <Button variant="ghost" onClick={() => setStep('welcome')} className="mb-4">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Zurück
      </Button>

      <div className="text-center space-y-2">
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          <Scan className="h-3 w-3 mr-1" />
          Computer Vision Technologie
        </Badge>
        <h2 className="text-3xl font-bold">KI-Inventarisierung</h2>
        <p className="text-muted-foreground">
          Filmen Sie einmal durch Ihre Wohnung – unsere KI erkennt alles automatisch
        </p>
      </div>

      <Card className="border-2 border-dashed border-primary/30">
        <CardContent className="p-8 text-center space-y-6">
          {!isScanning && !moveData.scanComplete && (
            <>
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Video className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Video-Scan starten</h3>
                <p className="text-sm text-muted-foreground">
                  Gehen Sie durch jeden Raum. Die KI erkennt Möbel, schätzt Volumen und identifiziert Sonderobjekte.
                </p>
              </div>
              <Button size="lg" onClick={startVideoScan}>
                <Camera className="mr-2 h-5 w-5" />
                Scan beginnen
              </Button>
              <Button variant="ghost" onClick={() => {
                setMoveData(prev => ({ ...prev, scanComplete: true, inventoryItems: 95, estimatedVolume: 35 }));
              }}>
                Überspringen (manuelle Schätzung)
              </Button>
            </>
          )}

          {isScanning && (
            <>
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-pulse">
                <Scan className="h-12 w-12 text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">KI analysiert...</h3>
                <Progress value={scanProgress} className="h-3" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Möbel erkennen</span>
                  <span>Volumen berechnen</span>
                  <span>Montageaufwand</span>
                </div>
              </div>
            </>
          )}

          {moveData.scanComplete && (
            <>
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-green-600">Scan abgeschlossen!</h3>
                <div className="grid grid-cols-2 gap-4 text-left">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">{moveData.inventoryItems}</div>
                      <div className="text-sm text-muted-foreground">Erkannte Objekte</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-primary">{moveData.estimatedVolume} m³</div>
                      <div className="text-sm text-muted-foreground">Geschätztes Volumen</div>
                    </CardContent>
                  </Card>
                </div>
                <div className="text-sm text-muted-foreground bg-yellow-500/10 p-3 rounded-lg">
                  ⚠️ Erkannt: 1x Klavier (Spezialtransport empfohlen)
                </div>
              </div>
              <Button size="lg" onClick={() => setStep('proposal')}>
                Weiter zum Angebot
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Trust: Yembo-style */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Powered by Computer Vision • Genauigkeit: 97.3% • Keine manuelle Eingabe nötig</p>
      </div>
    </motion.div>
  );

  const renderProposal = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8"
    >
      <Button variant="ghost" onClick={() => setStep('scan')} className="mb-4">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Zurück
      </Button>

      <div className="text-center space-y-2">
        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
          <Sparkles className="h-3 w-3 mr-1" />
          Ihr optimales Paket
        </Badge>
        <h2 className="text-3xl font-bold">Wir haben für Sie verglichen</h2>
        <p className="text-muted-foreground">
          Basierend auf Ihrem Scan empfehlen wir folgendes Festpreis-Paket
        </p>
      </div>

      {/* Recommended Package */}
      <Card className="max-w-2xl mx-auto border-2 border-primary shadow-xl">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <Badge className="bg-primary mb-2">Empfohlen</Badge>
              <h3 className="text-2xl font-bold">Komfort-Paket</h3>
              <p className="text-muted-foreground">Rundum-sorglos – Sie geben nur den Schlüssel ab</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">
                CHF {price.total.toLocaleString('de-CH')}
              </div>
              <div className="text-sm text-muted-foreground">Festpreis, inkl. MwSt.</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* What's Included */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Im Paket enthalten
              </h4>
              <ul className="space-y-1 text-sm">
                {[
                  'Professionelle Crew (3-4 Personen)',
                  'Vollständiger Packservice',
                  'Transport im geschlossenen LKW',
                  'Möbel-De- und Remontage',
                  'Premium-Versicherung (keine Selbstbeteiligung)',
                  'Kartonmiete inklusive',
                  'Abnahmegarantie für Endreinigung'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-green-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Automatisch organisiert</h4>
              <div className="space-y-2">
                {[
                  { label: 'Halteverbotszone beantragt', icon: Building2, included: moveData.extras.halteverbot },
                  { label: 'eUmzugCH Anmeldung vorbereitet', icon: FileText, included: moveData.extras.eumzug },
                  { label: 'Endreinigung mit Garantie', icon: Sparkles, included: moveData.extras.cleaning }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-2 p-2 rounded-lg ${item.included ? 'bg-green-500/10' : 'bg-muted/50'}`}>
                    <item.icon className={`h-4 w-4 ${item.included ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <span className="text-sm">{item.label}</span>
                    {item.included && <Badge variant="outline" className="ml-auto text-xs">Inkl.</Badge>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Breakdown (expandable) */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Preisaufschlüsselung</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {Object.entries(price.breakdown).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-muted-foreground capitalize">{key}</span>
                  <span>CHF {value.toLocaleString('de-CH')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crew Preview */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Ihre Crew</h4>
            <div className="flex gap-4">
              {CREW_MEMBERS.map((member) => (
                <div key={member.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <div className="text-2xl">{member.photo}</div>
                  <div>
                    <div className="font-medium text-sm">{member.name}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      {member.rating}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col gap-4">
          <Button size="lg" className="w-full h-14 text-lg" onClick={() => setStep('confirm')}>
            Dieses Paket buchen
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            100% Geld-zurück-Garantie • Zahlung erst nach erfolgreichem Umzug möglich
          </p>
        </CardFooter>
      </Card>

      {/* Alternative Options (collapsed) */}
      <div className="max-w-2xl mx-auto">
        <details className="group">
          <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground flex items-center gap-2">
            <ChevronRight className="h-4 w-4 group-open:rotate-90 transition-transform" />
            Andere Service-Level anzeigen
          </summary>
          <div className="grid grid-cols-3 gap-4 mt-4">
            {SERVICE_TIERS.filter(t => t.value !== 80).map((tier) => (
              <Card key={tier.value} className="border hover:border-primary/50 cursor-pointer" onClick={() => setMoveData({ ...moveData, serviceTier: tier.value })}>
                <CardContent className="p-4 text-center">
                  <div className="font-semibold">{tier.name}</div>
                  <div className="text-xs text-muted-foreground mb-2">{tier.description}</div>
                  <div className="text-lg font-bold text-primary">
                    CHF {Math.round(price.total * tier.multiplier / 2.2).toLocaleString('de-CH')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </details>
      </div>
    </motion.div>
  );

  const renderConfirm = () => (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-8 max-w-xl mx-auto"
    >
      <Button variant="ghost" onClick={() => setStep('proposal')} className="mb-4">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Zurück
      </Button>

      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Fast geschafft!</h2>
        <p className="text-muted-foreground">Noch Ihre Kontaktdaten und der Termin</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Date Selection - Enhanced */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Calendar className="h-5 w-5 text-primary" />
              Wann soll der Umzug stattfinden?
            </Label>
            <div className="space-y-3">
              {/* Quick date options */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Nächste Woche', days: 7 },
                  { label: 'In 2 Wochen', days: 14 },
                  { label: 'Nächster Monat', days: 30 },
                  { label: 'In 3 Monaten', days: 90 },
                ].map((option) => {
                  const targetDate = new Date();
                  targetDate.setDate(targetDate.getDate() + option.days);
                  const dateStr = targetDate.toISOString().split('T')[0];
                  return (
                    <Button
                      key={option.label}
                      variant={moveData.moveDate === dateStr ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setMoveData({ ...moveData, moveDate: dateStr })}
                      className="justify-start text-xs h-10"
                    >
                      <Clock className="h-3 w-3 mr-2" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
              
              {/* Date input with manual entry support */}
              <div className="relative">
                <Input
                  type="date"
                  value={moveData.moveDate}
                  onChange={(e) => setMoveData({ ...moveData, moveDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="h-12 text-base"
                  aria-label="Umzugsdatum auswählen"
                />
                {moveData.moveDate && (
                  <Badge 
                    variant="secondary" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs pointer-events-none"
                  >
                    {new Date(moveData.moveDate).toLocaleDateString('de-CH', { 
                      weekday: 'short', 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                💡 Sie können das Datum auch direkt eintippen oder aus dem Kalender wählen
              </p>
            </div>
          </div>

          {/* Contact - Improved Labels */}
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Ihre Kontaktdaten</h3>
            
            <div className="space-y-2">
              <Label htmlFor="v8-name" className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-primary" />
                Vor- und Nachname
              </Label>
              <Input
                id="v8-name"
                placeholder="z.B. Hans Muster"
                value={moveData.contact.name}
                onChange={(e) => setMoveData({ ...moveData, contact: { ...moveData.contact, name: e.target.value } })}
                className="h-12"
                autoComplete="name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="v8-email" className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-primary" />
                E-Mail-Adresse
              </Label>
              <Input
                id="v8-email"
                type="email"
                placeholder="hans.muster@beispiel.ch"
                value={moveData.contact.email}
                onChange={(e) => setMoveData({ ...moveData, contact: { ...moveData.contact, email: e.target.value } })}
                className="h-12"
                autoComplete="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="v8-phone" className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                Telefonnummer (Mobil bevorzugt)
              </Label>
              <Input
                id="v8-phone"
                type="tel"
                placeholder="+41 79 123 45 67"
                value={moveData.contact.phone}
                onChange={(e) => setMoveData({ ...moveData, contact: { ...moveData.contact, phone: e.target.value } })}
                className="h-12"
                autoComplete="tel"
              />
              <p className="text-xs text-muted-foreground">
                Wir rufen Sie nur bei Rückfragen an – kein Spam!
              </p>
            </div>
          </div>

          {/* Payment Options */}
          <div className="space-y-3">
            <Label>Zahlungsart</Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary cursor-pointer bg-primary/5">
                <input type="radio" name="payment" defaultChecked className="sr-only" />
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium text-sm">Nach dem Umzug</div>
                  <div className="text-xs text-muted-foreground">Standard</div>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-border cursor-pointer hover:border-primary/50">
                <input type="radio" name="payment" className="sr-only" />
                <Gift className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-sm">Jetzt zahlen</div>
                  <div className="text-xs text-green-600">8% Rabatt</div>
                </div>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between">
              <span>Komfort-Paket</span>
              <span className="font-bold">CHF {price.total.toLocaleString('de-CH')}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{moveData.fromPostal} → {moveData.toPostal}</span>
              <span>{moveData.moveDate || 'Datum wählen'}</span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Checkbox id="terms" defaultChecked />
            <label htmlFor="terms" className="text-xs text-muted-foreground">
              Ich akzeptiere die AGB und Datenschutzerklärung. Die Plattform garantiert für alle Schäden.
            </label>
          </div>

          <Button 
            size="lg" 
            className="w-full h-14 text-lg"
            onClick={() => setStep('dashboard')}
            disabled={!moveData.moveDate || !moveData.contact.name || !moveData.contact.email}
          >
            <Lock className="mr-2 h-5 w-5" />
            Verbindlich buchen – CHF {price.total.toLocaleString('de-CH')}
          </Button>
        </CardContent>
      </Card>

      {/* Trust */}
      <div className="flex justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Shield className="h-3 w-3" /> Escrow-Zahlung</span>
        <span className="flex items-center gap-1"><Lock className="h-3 w-3" /> SSL-verschlüsselt</span>
        <span className="flex items-center gap-1"><Award className="h-3 w-3" /> Storno bis 48h vorher</span>
      </div>
    </motion.div>
  );

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="space-y-8"
    >
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold">Buchung bestätigt!</h2>
        <p className="text-muted-foreground">
          Willkommen, {moveData.contact.name}. Ihr Move Concierge ist aktiv.
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Status Card */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Status
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-primary">8</div>
              <div>
                <div className="font-medium">Tage bis zum Umzug</div>
                <div className="text-sm text-muted-foreground">{moveData.moveDate}</div>
              </div>
            </div>
            <Progress value={75} className="h-2" />
            <div className="space-y-2">
              {[
                { label: 'Buchung bestätigt', done: true },
                { label: 'Crew zugewiesen', done: true },
                { label: 'Kartons unterwegs', done: false },
                { label: 'Halteverbot genehmigt', done: false },
                { label: 'Umzugstag', done: false }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  {item.done ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className={item.done ? 'text-muted-foreground line-through' : ''}>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crew Card */}
        <Card>
          <CardHeader>
            <h3 className="font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Ihre Crew
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {CREW_MEMBERS.map((member) => (
              <div key={member.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="text-3xl">{member.photo}</div>
                <div className="flex-1">
                  <div className="font-medium">{member.name}</div>
                  <div className="text-sm text-muted-foreground">{member.role}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-3 w-3 text-yellow-500" />
                    {member.rating}
                  </div>
                  <div className="text-xs text-muted-foreground">{member.languages.join(', ')}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Nachricht senden
            </Button>
          </CardContent>
        </Card>

        {/* Concierge Card */}
        <Card className="md:col-span-2 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Headphones className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Ihr Move Concierge</h3>
              <p className="text-sm text-muted-foreground">
                Bei Fragen sind wir 24/7 für Sie da. Der Concierge kümmert sich um alle Details.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Phone className="h-4 w-4" />
              </Button>
              <Button>
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat öffnen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demo Button */}
      <div className="text-center">
        <Button variant="outline" onClick={() => setStep('moving-day')}>
          <Truck className="mr-2 h-4 w-4" />
          Umzugstag simulieren (Demo)
        </Button>
      </div>
    </motion.div>
  );

  const renderMovingDay = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <Button variant="ghost" onClick={() => setStep('dashboard')} className="mb-4">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Zurück zum Dashboard
      </Button>

      <div className="text-center space-y-2">
        <Badge variant="secondary" className="bg-green-500/10 text-green-600">
          <Truck className="h-3 w-3 mr-1 animate-pulse" />
          LIVE
        </Badge>
        <h2 className="text-3xl font-bold">Umzug läuft!</h2>
      </div>

      {/* Live Map Placeholder */}
      <Card className="max-w-3xl mx-auto">
        <CardContent className="p-0">
          <div className="h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              {/* Simulated map grid */}
              <div className="grid grid-cols-8 grid-rows-6 h-full">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-gray-300" />
                ))}
              </div>
            </div>
            <div className="relative z-10 flex items-center gap-8">
              <div className="text-center">
                <MapPin className="h-8 w-8 text-primary mx-auto" />
                <div className="text-sm font-medium mt-1">{moveData.fromPostal}</div>
              </div>
              <Truck className="h-12 w-12 text-primary animate-bounce" />
              <div className="text-center">
                <MapPin className="h-8 w-8 text-destructive mx-auto" />
                <div className="text-sm font-medium mt-1">{moveData.toPostal}</div>
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Fortschritt</div>
              <div className="text-sm font-medium">{Math.round(trackingProgress)}%</div>
            </div>
            <Progress value={trackingProgress} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-green-600">✓ Beladen</span>
              <span className={trackingProgress > 40 ? 'text-green-600' : 'text-muted-foreground'}>
                {trackingProgress > 40 ? '✓' : '○'} Transport
              </span>
              <span className={trackingProgress > 80 ? 'text-green-600' : 'text-muted-foreground'}>
                {trackingProgress > 80 ? '✓' : '○'} Entladen
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Updates */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Live Updates
          </h3>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { time: '10:45', text: 'Crew ist gestartet', icon: '🚚' },
            { time: '11:02', text: 'Autobahnauffahrt erreicht', icon: '🛣️' },
            { time: '11:23', text: 'Kurze Pause (15 Min.)', icon: '☕' },
            { time: '11:40', text: 'Ankunft in ca. 25 Minuten', icon: '📍' }
          ].map((update, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-2xl">{update.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium">{update.text}</div>
              </div>
              <div className="text-xs text-muted-foreground">{update.time}</div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat mit Marc (Teamleiter)
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="font-bold text-lg">Decision-Free</span>
              <Badge variant="outline" className="ml-2 text-xs">V8</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Progress value={stepProgress[step]} className="w-32 h-2 hidden md:block" />
            <Button variant="ghost" size="sm">
              <Headphones className="h-4 w-4 mr-2" />
              Support
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {step === 'welcome' && renderWelcome()}
          {step === 'scan' && renderScan()}
          {step === 'proposal' && renderProposal()}
          {step === 'confirm' && renderConfirm()}
          {step === 'dashboard' && renderDashboard()}
          {step === 'moving-day' && renderMovingDay()}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <div className="flex justify-center gap-6 mb-4">
            <span className="flex items-center gap-1"><Shield className="h-4 w-4" /> Plattform-Garantie</span>
            <span className="flex items-center gap-1"><Lock className="h-4 w-4" /> Escrow-Zahlung</span>
            <span className="flex items-center gap-1"><Award className="h-4 w-4" /> Schweizer Qualität</span>
          </div>
          <p>V8 – Decision-Free Moving System • Powered by Computer Vision & AI</p>
        </div>
      </footer>
    </div>
  );
};
