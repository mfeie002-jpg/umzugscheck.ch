import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Video, 
  Upload, 
  Sparkles, 
  Clock, 
  Shield, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Zap,
  Star,
  Package,
  Truck,
  Users,
  Camera,
  Brain,
  TrendingUp,
  Award,
  FileText,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Home,
  Building2,
  Timer,
  Eye,
  ThumbsUp,
  Lock,
  Loader2
} from "lucide-react";
import { useCaptureMode } from "@/hooks/use-capture-mode";

type Step = "video" | "analyzing" | "offers" | "extras" | "booking" | "confirm";

interface Offer {
  id: string;
  company: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  eta: string;
  features: string[];
  badge?: string;
  recommended?: boolean;
}

const EXTRAS = [
  { id: "pack", name: "Packservice", desc: "Wir packen alles für Sie", price: 350, icon: Package },
  { id: "montage", name: "Möbelmontage", desc: "Abbau & Aufbau inklusive", price: 200, icon: Users },
  { id: "cleaning", name: "Endreinigung", desc: "Abgabefertige Wohnung", price: 280, icon: Sparkles },
  { id: "zone", name: "Halteverbotszone", desc: "Wir organisieren alles", price: 150, icon: MapPin },
  { id: "storage", name: "Zwischenlagerung", desc: "Bis zu 30 Tage", price: 180, icon: Building2 },
  { id: "insurance", name: "Premium-Versicherung", desc: "Vollkasko für Ihr Gut", price: 89, icon: Shield },
];

export const VideoFirstCalculator = () => {
  const { isCaptureMode, captureStep, demoData } = useCaptureMode();
  const [step, setStep] = useState<Step>("video");
  const [videoUploaded, setVideoUploaded] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    fromCity: "",
    toCity: "",
    moveDate: "",
    name: "",
    email: "",
    phone: "",
  });

  // Capture mode: jump to step and prefill data
  useEffect(() => {
    if (isCaptureMode && captureStep !== null) {
      const stepMap: Record<number, Step> = { 1: "video", 2: "analyzing", 3: "offers", 4: "extras", 5: "booking", 6: "confirm" };
      const targetStep = stepMap[captureStep];
      if (targetStep) {
        setStep(targetStep);
        setVideoUploaded(captureStep >= 2);
        setAnalysisProgress(captureStep >= 3 ? 100 : 0);
        setSelectedOffer(captureStep >= 4 ? "recommended" : null);
        setFormData({
          fromCity: demoData.fromCity,
          toCity: demoData.toCity,
          moveDate: demoData.moveDate,
          name: demoData.name,
          email: demoData.email,
          phone: demoData.phone,
        });
      }
    }
  }, [isCaptureMode, captureStep, demoData]);

  // Simulated offers based on "AI analysis"
  const offers: Offer[] = [
    {
      id: "budget",
      company: "Express Umzüge",
      rating: 4.6,
      reviews: 234,
      price: 890,
      originalPrice: 1100,
      eta: "Verfügbar am Wunschtermin",
      features: ["2 Umzugshelfer", "Transporter 20m³", "Grundversicherung"],
      badge: "Günstigste",
    },
    {
      id: "recommended",
      company: "ProMove Zürich",
      rating: 4.9,
      reviews: 512,
      price: 1290,
      originalPrice: 1500,
      eta: "Priorität - Flexible Termine",
      features: ["3 Umzugshelfer", "LKW 35m³", "Möbelschutz", "Vollversicherung"],
      badge: "Empfohlen",
      recommended: true,
    },
    {
      id: "premium",
      company: "Swiss Premium Moves",
      rating: 5.0,
      reviews: 189,
      price: 1890,
      originalPrice: 2200,
      eta: "VIP-Service verfügbar",
      features: ["4+ Umzugshelfer", "Grosser LKW", "Packservice", "Möbelmontage", "Vollkasko"],
      badge: "Full-Service",
    },
  ];

  const handleVideoUpload = () => {
    setVideoUploaded(true);
    setTimeout(() => {
      setStep("analyzing");
      // Simulate AI analysis
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setTimeout(() => setStep("offers"), 500);
        }
        setAnalysisProgress(Math.min(progress, 100));
      }, 300);
    }, 800);
  };

  const handleOfferSelect = (offerId: string) => {
    setSelectedOffer(offerId);
    setStep("extras");
  };

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  const calculateTotal = () => {
    const offer = offers.find(o => o.id === selectedOffer);
    const extrasTotal = selectedExtras.reduce((sum, id) => {
      const extra = EXTRAS.find(e => e.id === id);
      return sum + (extra?.price || 0);
    }, 0);
    return (offer?.price || 0) + extrasTotal;
  };

  const renderStep = () => {
    switch (step) {
      case "video":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <Badge className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                KI-gestützte Preisberechnung in 60 Sekunden
              </Badge>
              <h1 className="text-3xl md:text-4xl font-bold">
                Video hochladen. Fixpreis erhalten.
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Unsere KI analysiert Ihr Video und berechnet sofort den fairen Festpreis – 
                schneller und präziser als jeder Mitbewerber.
              </p>
            </div>

            {/* Video Upload Card */}
            <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 max-w-2xl mx-auto">
              <CardContent className="p-8">
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-lg">
                    <Video className="w-12 h-12 text-primary-foreground" />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      Filmen Sie Ihre Wohnung
                    </h3>
                    <p className="text-muted-foreground">
                      Ein kurzer Rundgang (1-2 Min) reicht – unsere KI erkennt automatisch 
                      Möbel, Volumen und Besonderheiten.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                      onClick={handleVideoUpload}
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Video hochladen
                    </Button>
                    <Button size="lg" variant="outline">
                      <Camera className="w-5 h-5 mr-2" />
                      Jetzt aufnehmen
                    </Button>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground pt-4 border-t">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4" />
                      SSL verschlüsselt
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="w-4 h-4" />
                      DSGVO-konform
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4" />
                      Wird nach Analyse gelöscht
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How it works */}
            <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Video, title: "1. Video aufnehmen", desc: "Kurzer Rundgang durch Ihre Wohnung" },
                { icon: Brain, title: "2. KI analysiert", desc: "Erkennung von Möbeln & Volumen in 60s" },
                { icon: FileText, title: "3. Fixpreise erhalten", desc: "3-5 verbindliche Angebote zum Vergleich" },
              ].map((item, i) => (
                <div key={i} className="text-center space-y-3">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h4 className="font-semibold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Trust Bar */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                4.9/5 (2,340 Bewertungen)
              </span>
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                15,000+ Umzüge
              </span>
              <span className="flex items-center gap-2">
                <Timer className="w-4 h-4" />
                Ø 47 Sekunden bis zum Preis
              </span>
            </div>
          </motion.div>
        );

      case "analyzing":
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-lg mx-auto text-center space-y-8 py-12"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto animate-pulse">
              <Brain className="w-12 h-12 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">KI analysiert Ihr Video...</h2>
              <p className="text-muted-foreground">
                Wir erkennen Möbel, berechnen das Volumen und erstellen Ihre Angebote.
              </p>
            </div>

            <div className="space-y-3">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${analysisProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {analysisProgress < 30 && "Räume werden erkannt..."}
                {analysisProgress >= 30 && analysisProgress < 60 && "Möbel werden katalogisiert..."}
                {analysisProgress >= 60 && analysisProgress < 90 && "Volumen wird berechnet..."}
                {analysisProgress >= 90 && "Angebote werden erstellt..."}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { label: "Räume", value: "4", done: analysisProgress > 25 },
                { label: "Möbelstücke", value: "42", done: analysisProgress > 50 },
                { label: "Volumen", value: "28m³", done: analysisProgress > 75 },
              ].map((item, i) => (
                <div key={i} className={`p-3 rounded-lg transition-all ${item.done ? 'bg-primary/10' : 'bg-muted/50'}`}>
                  <div className="text-xl font-bold">{item.done ? item.value : "..."}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        );

      case "offers":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                Analyse abgeschlossen
              </Badge>
              <h2 className="text-2xl font-bold">3 Fixpreis-Angebote für Sie</h2>
              <p className="text-muted-foreground">
                Basierend auf 28m³ Umzugsvolumen • 42 Möbelstücke erkannt
              </p>
            </div>

            {/* Quick Location Input */}
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Von</Label>
                    <Input 
                      placeholder="PLZ / Ort" 
                      value={formData.fromCity}
                      onChange={(e) => setFormData({...formData, fromCity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Nach</Label>
                    <Input 
                      placeholder="PLZ / Ort" 
                      value={formData.toCity}
                      onChange={(e) => setFormData({...formData, toCity: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Wunschtermin</Label>
                    <Input 
                      type="date" 
                      value={formData.moveDate}
                      onChange={(e) => setFormData({...formData, moveDate: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offers Grid */}
            <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {offers.map((offer) => (
                <Card 
                  key={offer.id}
                  className={`relative cursor-pointer transition-all hover:shadow-lg ${
                    offer.recommended 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleOfferSelect(offer.id)}
                >
                  {offer.badge && (
                    <Badge 
                      className={`absolute -top-2.5 left-4 ${
                        offer.recommended 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {offer.badge}
                    </Badge>
                  )}
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{offer.company}</h3>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{offer.rating}</span>
                        <span className="text-muted-foreground">({offer.reviews})</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">CHF {offer.price}</span>
                        <span className="text-sm text-muted-foreground line-through">
                          CHF {offer.originalPrice}
                        </span>
                      </div>
                      <p className="text-xs text-green-600 font-medium">
                        Fixpreis-Garantie
                      </p>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {offer.eta}
                    </div>

                    <ul className="space-y-1.5">
                      {offer.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${offer.recommended ? '' : 'variant-outline'}`}
                      variant={offer.recommended ? "default" : "outline"}
                    >
                      Auswählen
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Alle Preise sind verbindliche Fixpreise inkl. MwSt. • Keine versteckten Kosten
            </p>
          </motion.div>
        );

      case "extras":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-3xl mx-auto"
          >
            <Button variant="ghost" onClick={() => setStep("offers")} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück zu Angeboten
            </Button>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Zusatzleistungen hinzufügen</h2>
              <p className="text-muted-foreground">
                Machen Sie Ihren Umzug noch stressfreier – alles zum Fixpreis.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {EXTRAS.map((extra) => (
                <Card 
                  key={extra.id}
                  className={`cursor-pointer transition-all ${
                    selectedExtras.includes(extra.id) 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => toggleExtra(extra.id)}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      selectedExtras.includes(extra.id) ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <extra.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold">{extra.name}</h4>
                        <span className="font-semibold text-primary">+CHF {extra.price}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{extra.desc}</p>
                    </div>
                    <Checkbox 
                      checked={selectedExtras.includes(extra.id)}
                      className="mt-1"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Summary */}
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Ihr Gesamtpreis</p>
                    <p className="text-3xl font-bold">CHF {calculateTotal().toLocaleString()}</p>
                    <p className="text-xs text-green-600">Fixpreis-Garantie • Alles inklusive</p>
                  </div>
                  <Button size="lg" onClick={() => setStep("booking")}>
                    Weiter zur Buchung
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "booking":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-xl mx-auto"
          >
            <Button variant="ghost" onClick={() => setStep("extras")} className="mb-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Zurück
            </Button>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Fast geschafft!</h2>
              <p className="text-muted-foreground">
                Noch ein paar Details und Ihr Umzug ist gebucht.
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Von (Adresse)</Label>
                    <Input placeholder="Strasse, PLZ Ort" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nach (Adresse)</Label>
                    <Input placeholder="Strasse, PLZ Ort" />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Stockwerk (Von)</Label>
                    <Input type="number" placeholder="z.B. 3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Stockwerk (Nach)</Label>
                    <Input type="number" placeholder="z.B. 1" />
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold mb-3">Ihre Kontaktdaten</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input 
                        placeholder="Vor- und Nachname"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>E-Mail</Label>
                        <Input 
                          type="email" 
                          placeholder="ihre@email.ch"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Telefon</Label>
                        <Input 
                          type="tel" 
                          placeholder="+41 79 123 45 67"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Final Summary */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">Gesamtpreis (Fixpreis)</span>
                  <span className="text-2xl font-bold">CHF {calculateTotal().toLocaleString()}</span>
                </div>
                <Button size="lg" className="w-full" onClick={() => setStep("confirm")}>
                  <Lock className="w-4 h-4 mr-2" />
                  Verbindlich buchen
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-3">
                  Kostenlose Stornierung bis 48h vor Umzug
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );

      case "confirm":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 py-12 max-w-lg mx-auto"
          >
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Buchung bestätigt!</h2>
              <p className="text-muted-foreground">
                Ihr Umzug ist reserviert. Sie erhalten in Kürze eine Bestätigung per E-Mail.
              </p>
            </div>

            <Card className="text-left">
              <CardContent className="p-5 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buchungsnummer</span>
                  <span className="font-mono font-bold">UMZ-2024-7842</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Umzugstermin</span>
                  <span className="font-semibold">{formData.moveDate || "15. Februar 2024"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gesamtpreis</span>
                  <span className="font-bold text-primary">CHF {calculateTotal().toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <h4 className="font-semibold">Was passiert als Nächstes?</h4>
              <div className="grid gap-3 text-left">
                {[
                  { icon: Mail, text: "Bestätigung per E-Mail in wenigen Minuten" },
                  { icon: Phone, text: "Umzugsfirma meldet sich 2 Tage vorher" },
                  { icon: Truck, text: "Team kommt pünktlich am Umzugstag" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Progress Bar */}
      {step !== "video" && step !== "analyzing" && step !== "confirm" && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
              {["offers", "extras", "booking"].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === s 
                      ? 'bg-primary text-primary-foreground' 
                      : ["offers", "extras", "booking"].indexOf(step) > i
                        ? 'bg-green-500 text-white'
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {["offers", "extras", "booking"].indexOf(step) > i ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 2 && (
                    <div className={`w-16 sm:w-24 h-1 mx-2 rounded ${
                      ["offers", "extras", "booking"].indexOf(step) > i 
                        ? 'bg-green-500' 
                        : 'bg-muted'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
};
