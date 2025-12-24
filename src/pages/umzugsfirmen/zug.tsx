import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/homepage/Header";
import { SimplifiedFooter } from "@/components/home/SimplifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Star, Shield, MapPin, Check, ArrowRight, Users, Clock, 
  Award, Sparkles, Truck, Package, Home, Trash2, Building2,
  Lock, Play, Phone, TrendingDown,
  FileText, CheckCircle, Sofa, Warehouse,
  ClipboardList, ChevronRight, MessageCircle,
  Crown, Banknote, ShieldCheck, CircleDollarSign,
  BadgeCheck, ThumbsUp, Video, Info, Gift
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=2000&q=80";

// ==================== DATA ====================

const cantons = [
  { value: "zug", label: "Zug", href: "/umzugsfirmen/zug" },
  { value: "zuerich", label: "Zürich", href: "/zuerich/umzugsfirmen" },
  { value: "bern", label: "Bern", href: "/bern/umzugsfirmen" },
  { value: "basel", label: "Basel", href: "/basel/umzugsfirmen" },
  { value: "luzern", label: "Luzern", href: "/luzern/umzugsfirmen" },
];

const companies = [
  {
    id: "zuger-umzuege",
    name: "Zuger Umzüge AG",
    rating: 4.9,
    reviewCount: 187,
    badges: ["Top Bewertung", "Lokal"],
    services: ["Privatumzug", "Reinigung", "Möbellift"],
    priceLevel: "Mittel",
    isPopular: true,
    responseTime: "< 2h",
  },
  {
    id: "happy-move-baar",
    name: "Happy Move Baar",
    rating: 4.7,
    reviewCount: 134,
    badges: ["Preis-Sieger"],
    services: ["Privatumzug", "Entsorgung", "Einlagerung"],
    priceLevel: "Günstig",
    isBestPrice: true,
    responseTime: "< 1h",
  },
  {
    id: "see-transporte",
    name: "See-Transporte Cham",
    rating: 4.8,
    reviewCount: 98,
    badges: ["Premium"],
    services: ["Firmenumzug", "Möbellift", "Reinigung"],
    priceLevel: "Premium",
    isPremium: true,
    responseTime: "< 4h",
  },
];

const priceExamples = [
  { size: "1.5 - 2.5 Zimmer", price: "CHF 550 – 900", subtext: "Studio / kleine Wohnung", icon: Home, savings: "bis CHF 360" },
  { size: "3.5 - 4.5 Zimmer", price: "CHF 770 – 1'200", subtext: "Familienwohnung", icon: Building2, savings: "bis CHF 480" },
  { size: "5+ Zimmer / Haus", price: "ab CHF 1'500", subtext: "Villa / Einfamilienhaus", icon: Home, savings: "bis CHF 600" },
];

const services = [
  { title: "Endreinigung", icon: Sparkles, description: "Wohnungsabnahme garantiert", link: "/services/reinigung" },
  { title: "Ein-/Auspackservice", icon: Package, description: "Professionelles Verpacken", link: "/services/packservice" },
  { title: "Möbelmontage", icon: Sofa, description: "Auf- & Abbau vor Ort", link: "/services/moebelmontage" },
  { title: "Möbellift", icon: Truck, description: "Für schwere Möbel", link: "/services/moebellift" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume in Zug", link: "/services/lagerung" },
  { title: "Entsorgung", icon: Trash2, description: "Fachgerechte Entsorgung", link: "/services/entsorgung" },
];

const howItWorks = [
  { step: 1, title: "Formular ausfüllen", description: "Start, Ziel & Wohnungsgrösse eingeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Angebote vergleichen", description: "3-5 Offerten kostenlos erhalten", icon: FileText, time: "24-48h" },
  { step: 3, title: "Umziehen & sparen", description: "Bestes Angebot wählen", icon: CheckCircle, time: "Ihr Termin" },
];

const testimonials = [
  {
    name: "Maria S.",
    location: "Zug → Baar",
    rating: 5,
    text: "Super unkompliziert! Innerhalb von 24h hatte ich 4 Angebote. Die Firma war top und CHF 400 günstiger als mein erstes Angebot.",
    date: "vor 3 Tagen",
    verified: true,
    savedAmount: 400,
  },
  {
    name: "Thomas K.",
    location: "Cham → Zug",
    rating: 5,
    text: "Perfekter Service! Umzug lief reibungslos, Endreinigung mit Abnahmegarantie war Gold wert.",
    date: "vor 1 Woche",
    verified: true,
    savedAmount: 320,
  },
  {
    name: "Sandra M.",
    location: "Rotkreuz → Steinhausen",
    rating: 5,
    text: "Der Vergleich hat sich gelohnt. Sehr professionelle Firmen, pünktlich und sorgfältig.",
    date: "vor 2 Wochen",
    verified: true,
    savedAmount: 280,
  },
];

const guarantees = [
  { title: "Kostenlos-Garantie", description: "100% gratis, keine versteckten Gebühren", icon: CircleDollarSign },
  { title: "Datenschutz-Garantie", description: "Schweizer Hosting, DSGVO-konform", icon: ShieldCheck },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte & versicherte Firmen", icon: BadgeCheck },
  { title: "Zufriedenheits-Garantie", description: "Wir helfen bei Problemen", icon: ThumbsUp },
];

const faqs = [
  {
    question: "Wie erhalte ich kostenlose Offerten?",
    answer: "Füllen Sie unser Online-Formular aus (dauert nur 2 Minuten). Innerhalb von 24-48 Stunden erhalten Sie 3-5 unverbindliche Angebote von geprüften Umzugsfirmen in Zug direkt per E-Mail.",
  },
  {
    question: "Was kostet ein Umzug im Kanton Zug?",
    answer: "Die Kosten variieren je nach Wohnungsgrösse, Etage und Distanz. Ein 2-Zimmer-Umzug innerhalb Zug kostet ca. CHF 550-900, ein 4-Zimmer-Umzug ca. CHF 770-1'200. Mit unserem Vergleich sparen Sie bis zu 40%.",
  },
  {
    question: "Sind die Angebote wirklich gratis und unverbindlich?",
    answer: "Ja, absolut! Das Einholen der Offerten ist 100% kostenlos und unverbindlich. Sie entscheiden selbst, ob und welches Angebot Sie annehmen möchten.",
  },
  {
    question: "Wie früh sollte ich buchen?",
    answer: "Wir empfehlen 4-8 Wochen Vorlauf. Zur Hochsaison (April-September) oder bei Monatsende-Umzügen sind 8-12 Wochen ratsam.",
  },
  {
    question: "Sind die Umzugsfirmen versichert?",
    answer: "Ja! Alle unsere Partnerfirmen sind vollständig versichert (Haftpflicht & Transportversicherung). Bei Schäden sind Sie abgesichert.",
  },
];

const nearbyMunicipalities = [
  { name: "Umzug Baar", href: "/baar/umzugsfirmen" },
  { name: "Umzug Cham", href: "/cham/umzugsfirmen" },
  { name: "Umzug Rotkreuz", href: "/rotkreuz/umzugsfirmen" },
  { name: "Umzug Steinhausen", href: "/steinhausen/umzugsfirmen" },
  { name: "Umzug Hünenberg", href: "/huenenberg/umzugsfirmen" },
];

const trustBadges = [
  { name: "Swiss Made", icon: Shield },
  { name: "SSL Encrypted", icon: Lock },
  { name: "Geprüft", icon: BadgeCheck },
];

// ==================== COMPONENTS ====================

const AnimatedCounter = ({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, end, duration]);
  
  return <span ref={ref}>{count.toLocaleString('de-CH')}{suffix}</span>;
};

const FormProgress = ({ fields }: { fields: { from: string; to: string; size: string } }) => {
  const filledCount = [fields.from, fields.to, fields.size].filter(Boolean).length;
  const percentage = (filledCount / 3) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Fortschritt</span>
        <span>{filledCount}/3 Felder</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
};

const QuickPriceEstimate = ({ size }: { size: string }) => {
  if (!size) return null;
  
  const estimates: Record<string, { min: number; max: number; savings: number }> = {
    "1-2": { min: 550, max: 900, savings: 360 },
    "2.5-3": { min: 650, max: 1000, savings: 400 },
    "3.5-4": { min: 770, max: 1200, savings: 480 },
    "4.5-5": { min: 1100, max: 1600, savings: 520 },
    "5+": { min: 1500, max: 2500, savings: 600 },
  };
  
  const estimate = estimates[size];
  if (!estimate) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      className="bg-green-50 border border-green-200 rounded-lg p-3 mt-3"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-green-700 font-medium">Geschätzte Kosten</p>
          <p className="text-lg font-bold text-green-800">
            CHF {estimate.min.toLocaleString()} – {estimate.max.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-green-700">Potenzielle Ersparnis</p>
          <p className="text-sm font-bold text-green-600">bis CHF {estimate.savings}</p>
        </div>
      </div>
    </motion.div>
  );
};

const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/41791234567?text=Hallo,%20ich%20möchte%20eine%20Umzugsofferte%20für%20Zug"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 2, type: "spring" }}
    className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group"
  >
    <MessageCircle className="w-7 h-7 text-white" />
    <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
      WhatsApp Chat
    </span>
  </motion.a>
);

// ==================== MAIN PAGE ====================

const ZugLandingPage = () => {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(23);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("zug");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(15, Math.min(40, prev + Math.floor(Math.random() * 7) - 3)));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({
      from: fromLocation,
      to: toLocation,
      size: apartmentSize,
      source: "zug-landing",
      timestamp: Date.now(),
    }));
    navigate("/umzugsofferten");
  };

  const handleCantonChange = (value: string) => {
    setSelectedCanton(value);
    const canton = cantons.find(c => c.value === value);
    if (canton && value !== "zug") navigate(canton.href);
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Umzugscheck.ch - Kanton Zug",
        "description": "Vergleiche 30+ geprüfte Umzugsfirmen im Kanton Zug. Kostenlose Offerten für Zug, Baar, Cham & Rotkreuz.",
        "areaServed": { "@type": "Place", "name": "Kanton Zug, Schweiz" },
        "priceRange": "CHF 550 - CHF 3000",
        "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "2847" }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang="de-CH" />
        <title>Umzug Zug – Jetzt gratis Umzugsfirma finden | Bis 40% sparen</title>
        <meta name="description" content="Vergleiche 30+ geprüfte Umzugsfirmen im Kanton Zug ✓ Kostenlose Offerten ✓ Zug, Baar, Cham & Rotkreuz ✓ Bis zu 40% sparen!" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen/zug" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <main>
        {/* 1. HERO SECTION */}
        <section className="relative min-h-[92vh] flex items-center overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${HERO_BG})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/80 to-primary/40" />
          </div>

          <div className="container relative z-10 px-4 py-12 md:py-16">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center lg:text-left"
              >
                <div className="inline-flex items-center gap-2 mb-4">
                  <Select value={selectedCanton} onValueChange={handleCantonChange}>
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {cantons.map((canton) => (
                        <SelectItem key={canton.value} value={canton.value}>
                          {canton.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="font-bold">{liveViewers}</span> Personen vergleichen gerade
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Umzug Zug – <br className="hidden md:block" />
                  <span className="text-secondary">Jetzt gratis vergleichen</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Vergleichen Sie <strong>30+ geprüfte Umzugsfirmen</strong> aus Zug, Baar, Cham & Rotkreuz.
                  <span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span>
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      <AnimatedCounter end={2847} suffix="+" />
                    </div>
                    <div className="text-xs text-white/60">Bewertungen</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      <AnimatedCounter end={30} suffix="+" />
                    </div>
                    <div className="text-xs text-white/60">Firmen</div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-6 h-6 fill-amber-400" />
                    4.8
                    <span className="text-xs text-white/60 font-normal ml-1">/ 5</span>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  {trustBadges.map((badge) => (
                    <div key={badge.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80">
                      <badge.icon className="w-3.5 h-3.5" />
                      {badge.name}
                    </div>
                  ))}
                </div>

                <div className="lg:hidden space-y-3">
                  <Button 
                    asChild
                    size="lg" 
                    className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)]"
                  >
                    <Link to="/umzugsofferten">
                      Jetzt Offerten anfordern
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    100% kostenlos & unverbindlich
                  </p>
                </div>
              </motion.div>

              {/* Right: Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Jetzt gratis vergleichen
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        In 2 Minuten zu 3-5 unverbindlichen Offerten
                      </p>
                    </div>

                    <FormProgress fields={{ from: fromLocation, to: toLocation, size: apartmentSize }} />

                    <form onSubmit={handleFormSubmit} className="space-y-4 mt-4">
                      <div>
                        <Label htmlFor="from" className="text-sm font-medium flex items-center gap-1">
                          Von (PLZ oder Ort)
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground" /></TooltipTrigger>
                              <TooltipContent>Ihr aktueller Wohnort</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </Label>
                        <Input
                          id="from"
                          placeholder="z.B. 6300 Zug"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          className="mt-1.5 h-12"
                          autoFocus
                        />
                      </div>

                      <div>
                        <Label htmlFor="to" className="text-sm font-medium">Nach (PLZ oder Ort)</Label>
                        <Input
                          id="to"
                          placeholder="z.B. 6340 Baar"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          className="mt-1.5 h-12"
                        />
                      </div>

                      <div>
                        <Label htmlFor="size" className="text-sm font-medium">Wohnungsgrösse</Label>
                        <Select value={apartmentSize} onValueChange={setApartmentSize}>
                          <SelectTrigger className="mt-1.5 h-12">
                            <SelectValue placeholder="Bitte wählen..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="1-2">1-2 Zimmer</SelectItem>
                            <SelectItem value="2.5-3">2.5-3 Zimmer</SelectItem>
                            <SelectItem value="3.5-4">3.5-4 Zimmer</SelectItem>
                            <SelectItem value="4.5-5">4.5-5 Zimmer</SelectItem>
                            <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <QuickPriceEstimate size={apartmentSize} />

                      <Button 
                        type="submit"
                        size="lg" 
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)] group"
                      >
                        Jetzt Offerten anfordern
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>

                    <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-border">
                      {["Kostenlos", "Unverbindlich", "Geprüfte Firmen"].map((item) => (
                        <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Check className="w-4 h-4 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-muted-foreground">
                      <Lock className="w-3 h-3" />
                      Schweizer Hosting · SSL verschlüsselt
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. TRUST STATS BAR */}
        <section className="py-6 bg-muted/40 border-y border-border">
          <div className="container px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm font-bold">4.8/5</span>
                <span className="text-xs text-muted-foreground">(<AnimatedCounter end={2847} /> Bewertungen)</span>
              </div>

              <div className="hidden md:block h-6 w-px bg-border" />

              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-bold"><AnimatedCounter end={30} />+</span>
                <span className="text-muted-foreground">Firmen in Zug</span>
              </div>

              <div className="hidden md:block h-6 w-px bg-border" />

              <div className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-primary" />
                <span className="font-bold"><AnimatedCounter end={15000} />+</span>
                <span className="text-muted-foreground">vermittelte Umzüge</span>
              </div>

              <div className="hidden md:block h-6 w-px bg-border" />

              <div className="flex items-center gap-2 text-sm">
                <TrendingDown className="w-4 h-4 text-green-600" />
                <span className="font-bold text-green-600">Ø 35%</span>
                <span className="text-muted-foreground">Ersparnis</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIALS */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="outline" className="mb-4">
                <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                Kundenstimmen
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Das sagen unsere Kunden</h2>
              <p className="text-muted-foreground">Über 2'800 zufriedene Kunden im Kanton Zug</p>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-card border border-border rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-lg font-bold text-primary">{testimonials[activeTestimonial].name[0]}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{testimonials[activeTestimonial].name}</span>
                        {testimonials[activeTestimonial].verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-3 h-3" />
                        {testimonials[activeTestimonial].location}
                        <span>•</span>
                        {testimonials[activeTestimonial].date}
                      </div>
                      <div className="flex mb-3">
                        {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground italic">"{testimonials[activeTestimonial].text}"</p>
                      {testimonials[activeTestimonial].savedAmount && (
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          <TrendingDown className="w-3.5 h-3.5" />
                          CHF {testimonials[activeTestimonial].savedAmount} gespart
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonial(idx)}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === activeTestimonial ? 'bg-primary' : 'bg-border'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. TOP COMPANIES */}
        <section className="py-14 md:py-18 bg-muted/20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="secondary" className="mb-4">
                <Crown className="w-3 h-3 mr-1" />
                Unsere Top-Partner
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Top Umzugsfirmen im Kanton Zug</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">Geprüfte & versicherte Anbieter mit lokaler Erfahrung</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-xl transition-all relative overflow-hidden ${company.isPopular ? 'border-primary/50 ring-1 ring-primary/20' : ''}`}>
                    {company.isPopular && (
                      <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold rounded-bl-lg">
                        Beliebt
                      </div>
                    )}
                    {company.isBestPrice && (
                      <div className="absolute top-0 right-0 bg-green-600 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                        Preis-Tipp
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Truck className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                          <span className="font-bold">{company.rating}</span>
                          <span className="text-xs text-muted-foreground">({company.reviewCount})</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2">{company.name}</h3>
                      
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {company.badges.map((badge) => (
                          <Badge key={badge} variant="secondary" className="text-xs">{badge}</Badge>
                        ))}
                      </div>
                      
                      <div className="text-xs text-muted-foreground mb-4 space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Antwortzeit: {company.responseTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <Banknote className="w-3 h-3" />
                          Preislevel: {company.priceLevel}
                        </div>
                      </div>
                      
                      <Button asChild className="w-full group" variant="outline">
                        <Link to="/umzugsofferten">
                          Offerte ansehen
                          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/umzugsofferten">
                  Alle 30+ Firmen vergleichen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. PRICING */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="outline" className="mb-4">
                <Banknote className="w-3 h-3 mr-1" />
                Preisübersicht
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Was kostet ein Umzug in Zug?</h2>
              <p className="text-muted-foreground">Typische Preise inkl. Transport, Träger & Material</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {priceExamples.map((item, index) => (
                <motion.div
                  key={item.size}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-all border-border/50 hover:border-primary/30 relative overflow-hidden group">
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        {item.savings}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <item.icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-1">{item.size}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{item.subtext}</p>
                      <p className="text-2xl font-bold text-secondary">{item.price}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-muted-foreground mb-6">* Richtwerte für Umzüge innerhalb des Kantons Zug</p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/umzugsofferten">Jetzt exakten Preis berechnen</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 6. SERVICES */}
        <section className="py-14 md:py-18 bg-muted/20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="secondary" className="mb-4">Zusatzservices</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Beliebte Services in Zug</h2>
              <p className="text-muted-foreground">Alles aus einer Hand</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={service.link}>
                    <Card className="h-full hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer group">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                          <service.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto shrink-0 group-hover:translate-x-1 group-hover:text-primary transition-all" />
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. AI VIDEO CTA */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden border-2 border-primary/20">
                <div className="grid md:grid-cols-2 items-center">
                  <div className="p-8">
                    <Badge className="bg-primary/10 text-primary mb-4">
                      <Video className="w-3 h-3 mr-1" />
                      NEU: Smart Video-Analyse
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Kostenvoranschlag per Video</h2>
                    <p className="text-muted-foreground mb-6">
                      Filmen Sie einfach Ihre Wohnung ab – unser System analysiert automatisch das Umzugsvolumen und liefert einen präzisen Kostenvoranschlag.
                    </p>
                    <div className="space-y-2 mb-6">
                      {["30 Sekunden Video genügt", "Präziser als manuelle Schätzung", "100% kostenlos"].map((item) => (
                        <div key={item} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to="/umzugsofferten">
                        <Play className="mr-2 w-4 h-4" />
                        Video-Analyse starten
                      </Link>
                    </Button>
                  </div>
                  <div className="bg-gradient-to-br from-primary/20 to-secondary/20 h-full min-h-[250px] flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* 8. HOW IT WORKS */}
        <section className="py-14 md:py-18 bg-muted/20">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="outline" className="mb-4">So funktioniert's</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">In 3 Schritten zur Offerte</h2>
              <p className="text-muted-foreground">Einfach, schnell und 100% kostenlos</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="text-center relative"
                >
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}
                  
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative">
                    <step.icon className="w-10 h-10 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {step.time}
                  </Badge>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/umzugsofferten">
                  Jetzt starten – 100% kostenlos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 9. GUARANTEES */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="secondary" className="mb-4">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Unsere Garantien
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Ihre Sicherheit ist uns wichtig</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {guarantees.map((guarantee, index) => (
                <motion.div
                  key={guarantee.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all border-green-200 bg-green-50/50">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <guarantee.icon className="w-7 h-7 text-green-600" />
                      </div>
                      <h3 className="font-bold text-base mb-2">{guarantee.title}</h3>
                      <p className="text-sm text-muted-foreground">{guarantee.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. LOCAL SEO CONTENT */}
        <section className="py-14 md:py-18 bg-gradient-to-br from-blue-50/50 to-slate-50/50">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4">
                  <MapPin className="w-3 h-3 mr-1" />
                  Lokales Wissen
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Umziehen im Kanton Zug</h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Der Kanton Zug gehört zu den beliebtesten Wohnregionen der Schweiz. Mit seiner zentralen Lage, 
                    niedrigen Steuern und hohen Lebensqualität zieht er jährlich tausende Zu- und Wegzüger an. 
                    Die Städte <strong>Zug, Baar, Cham</strong> und <strong>Rotkreuz</strong> bieten eine 
                    perfekte Mischung aus urbanem Leben und Naturerholung am Zugersee.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    Besonderheiten beim Umziehen in Zug: Die historische Altstadt erfordert oft spezielle 
                    Bewilligungen, der Möbellift ist bei den vielen Altbauten unverzichtbar, und zur 
                    Monatsende-Hochsaison sind die besten Firmen früh ausgebucht.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 11. FAQ */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Häufige Fragen</h2>
            </motion.div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AccordionItem value={`item-${index}`} className="border border-border rounded-xl px-6 bg-card">
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* SEO Links */}
        <section className="py-10 bg-muted/30 border-t border-border">
          <div className="container px-4">
            <h3 className="font-semibold text-lg mb-4 text-center">Umzugsfirmen in der Nähe</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {nearbyMunicipalities.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 12. FINAL CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-white/20 text-white border-white/30 mb-6">
                <Gift className="w-3 h-3 mr-1" />
                Jetzt gratis starten
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Bereit für Ihren Umzug?</h2>
              <p className="text-lg text-primary-foreground/85 mb-8 max-w-xl mx-auto">
                30+ geprüfte Firmen · Bis 40% sparen · 100% gratis
              </p>
              
              <Button 
                asChild
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 shadow-xl"
              >
                <Link to="/umzugsofferten">
                  Jetzt Offerten anfordern
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-primary-foreground/80">
                {["Keine versteckten Kosten", "100% unverbindlich", "Schweizer Datenschutz"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <WhatsAppButton />

      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-card/98 backdrop-blur-xl border-t border-border p-3 shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">Bis 40% sparen</p>
                <p className="text-xs text-muted-foreground">30+ geprüfte Firmen</p>
              </div>
              <Button 
                asChild
                size="lg" 
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shrink-0"
              >
                <Link to="/umzugsofferten">
                  Gratis Offerten
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZugLandingPage;
