import { useState, useEffect, useRef, useCallback } from "react";
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
  Lock, Play, Phone, Zap, TrendingDown, Eye, Timer,
  FileText, CheckCircle, CalendarCheck, Sofa, Warehouse,
  ClipboardList, ChevronDown, MessageSquare, HeartHandshake,
  BadgeCheck, Flame, Gift, ThumbsUp, Quote, Calendar,
  AlertCircle, Info, Video, ChevronRight, X, MessageCircle,
  Crown, Percent, Target, Banknote, ShieldCheck, CircleDollarSign
} from "lucide-react";

// Hero background from Unsplash - Zug lakeside
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
    availability: "Verfügbar",
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
    availability: "Sofort verfügbar",
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
    availability: "Ab 20. Dez",
    isPremium: true,
    responseTime: "< 4h",
  },
  {
    id: "zentralschweiz-umzug",
    name: "Zentralschweiz Umzug",
    rating: 4.6,
    reviewCount: 156,
    badges: ["Regional"],
    services: ["Privatumzug", "Firmenumzug", "Lagerung"],
    priceLevel: "Mittel",
    availability: "Verfügbar",
    responseTime: "< 3h",
  },
];

const priceExamples = [
  { size: "1.5 - 2.5 Zimmer", price: "CHF 550 – 900", subtext: "Studio / kleine Wohnung", icon: Home, savings: "bis CHF 360" },
  { size: "3.5 - 4.5 Zimmer", price: "CHF 770 – 1'200", subtext: "Familienwohnung", icon: Building2, savings: "bis CHF 480" },
  { size: "5+ Zimmer / Haus", price: "ab CHF 1'500", subtext: "Villa / Einfamilienhaus", icon: Home, savings: "bis CHF 600" },
];

const services = [
  { title: "Endreinigung", icon: Sparkles, description: "Wohnungsabnahme garantiert", link: "/services/reinigung", popular: true },
  { title: "Ein-/Auspackservice", icon: Package, description: "Professionelles Verpacken", link: "/services/packservice" },
  { title: "Möbelmontage", icon: Sofa, description: "Auf- & Abbau vor Ort", link: "/services/moebelmontage" },
  { title: "Möbellift", icon: Truck, description: "Für schwere Möbel", link: "/services/moebellift", popular: true },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume in Zug", link: "/services/lagerung" },
  { title: "Entsorgung", icon: Trash2, description: "Fachgerechte Entsorgung", link: "/services/entsorgung" },
];

const howItWorks = [
  { step: 1, title: "Formular ausfüllen", description: "Start, Ziel & Wohnungsgrösse eingeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Angebote vergleichen", description: "3-5 Offerten kostenlos erhalten", icon: FileText, time: "24-48h" },
  { step: 3, title: "Umziehen & sparen", description: "Bestes Angebot wählen", icon: CheckCircle, time: "Ihr Wunschtermin" },
];

const usps = [
  { title: "Regionale Expertise", description: "Lokale Firmen kennen Zug bestens", icon: MapPin },
  { title: "AI-Video Analyse", description: "Kostenvoranschlag per Video", icon: Video },
  { title: "Schweizer Support", description: "Persönliche Beratung", icon: Phone },
  { title: "100% Gratis", description: "Keine versteckten Kosten", icon: HeartHandshake },
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
    text: "Perfekter Service! Umzug lief reibungslos, Endreinigung mit Abnahmegarantie war Gold wert. Kann ich nur empfehlen.",
    date: "vor 1 Woche",
    verified: true,
    savedAmount: 320,
  },
  {
    name: "Sandra M.",
    location: "Rotkreuz → Steinhausen",
    rating: 5,
    text: "Hatte anfangs Bedenken, aber der Vergleich hat sich gelohnt. Sehr professionelle Firmen, pünktlich und sorgfältig.",
    date: "vor 2 Wochen",
    verified: true,
    savedAmount: 280,
  },
];

const recentActivity = [
  { city: "Zug", action: "Offerte angefordert", time: "vor 2 Min." },
  { city: "Baar", action: "3 Angebote erhalten", time: "vor 5 Min." },
  { city: "Cham", action: "Umzug gebucht", time: "vor 12 Min." },
  { city: "Rotkreuz", action: "Offerte angefordert", time: "vor 18 Min." },
];

const guarantees = [
  { title: "Kostenlos-Garantie", description: "100% gratis, keine versteckten Gebühren", icon: CircleDollarSign },
  { title: "Datenschutz-Garantie", description: "Schweizer Hosting, DSGVO-konform", icon: ShieldCheck },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte & versicherte Firmen", icon: BadgeCheck },
  { title: "Zufriedenheits-Garantie", description: "Wir helfen bei Problemen", icon: ThumbsUp },
];

const comparisonData = [
  { feature: "Preisvergleich", us: true, direct: false },
  { feature: "Geprüfte Firmen", us: true, direct: "Unklar" },
  { feature: "Kostenlose Offerten", us: true, direct: true },
  { feature: "Bis 40% Ersparnis", us: true, direct: false },
  { feature: "Kundenbewertungen", us: true, direct: "Teilweise" },
  { feature: "Abnahmegarantie", us: true, direct: "Unklar" },
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
    answer: "Ja, absolut! Das Einholen der Offerten ist 100% kostenlos und unverbindlich. Sie entscheiden selbst, ob und welches Angebot Sie annehmen möchten. Es entstehen keine versteckten Kosten.",
  },
  {
    question: "Wie früh sollte ich in Zug buchen?",
    answer: "Wir empfehlen 4-8 Wochen Vorlauf. Zur Hochsaison (April-September) oder bei Monatsende-Umzügen sind 8-12 Wochen ratsam, da viele Firmen dann ausgebucht sind.",
  },
  {
    question: "Brauche ich eine Halteverbotszone in der Stadt Zug?",
    answer: "In der Altstadt und bei engen Quartieren ist eine Parkbewilligung oft nötig. Die meisten unserer Partnerfirmen übernehmen die Beantragung für Sie. Rechnen Sie mit ca. CHF 50-100 Gebühren.",
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
  { name: "Umzug Walchwil", href: "/walchwil/umzugsfirmen" },
];

const trustBadges = [
  { name: "Swiss Made", icon: Shield },
  { name: "SSL Encrypted", icon: Lock },
  { name: "DSGVO Konform", icon: ShieldCheck },
  { name: "Geprüft", icon: BadgeCheck },
];

// ==================== COMPONENTS ====================

// 1. Animated Counter Component
const AnimatedCounter = ({ end, suffix = "", prefix = "", duration = 2000 }: { 
  end: number; suffix?: string; prefix?: string; duration?: number 
}) => {
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
  
  return <span ref={ref}>{prefix}{count.toLocaleString('de-CH')}{suffix}</span>;
};

// 2. Live Activity Feed Component
const LiveActivityFeed = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % recentActivity.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
  
  const activity = recentActivity[currentIndex];
  
  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-2 text-sm"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-muted-foreground">
        <strong className="text-foreground">{activity.city}</strong>: {activity.action}
      </span>
      <span className="text-xs text-muted-foreground">({activity.time})</span>
    </motion.div>
  );
};

// 3. Testimonial Carousel
const TestimonialCarousel = () => {
  const [current, setCurrent] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg font-bold text-primary">{testimonials[current].name[0]}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{testimonials[current].name}</span>
                {testimonials[current].verified && (
                  <BadgeCheck className="w-4 h-4 text-blue-500" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <MapPin className="w-3 h-3" />
                {testimonials[current].location}
                <span>•</span>
                {testimonials[current].date}
              </div>
              <div className="flex mb-3">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-muted-foreground italic">"{testimonials[current].text}"</p>
              {testimonials[current].savedAmount && (
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  <TrendingDown className="w-3.5 h-3.5" />
                  CHF {testimonials[current].savedAmount} gespart
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === current ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
      </div>
    </div>
  );
};

// 4. WhatsApp Floating Button
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

// 5. Seasonal Banner
const SeasonalBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed) return null;
  
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-secondary via-secondary to-orange-500 text-white py-2.5 px-4 relative"
    >
      <div className="container mx-auto flex items-center justify-center gap-3 text-sm">
        <Flame className="w-4 h-4 animate-pulse" />
        <span className="font-medium">
          🎄 <strong>Winter-Aktion:</strong> Jetzt Offerte anfordern und <strong>10% Frühbucher-Rabatt</strong> sichern!
        </span>
        <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
          Nur noch 12 Tage
        </Badge>
        <button onClick={() => setDismissed(true)} className="absolute right-4 p-1 hover:bg-white/20 rounded">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

// 6. Form Progress Component  
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

// 7. Quick Price Estimate
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

  // Simulate live viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(15, Math.min(40, prev + Math.floor(Math.random() * 7) - 3)));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  // Sticky bar on scroll
  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

      {/* IMPROVEMENT 1: Seasonal Banner */}
      <SeasonalBanner />

      <Header />

      <main>
        {/* HERO SECTION */}
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
                {/* Canton Switcher */}
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

                {/* IMPROVEMENT 2: Enhanced Live Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-sm font-medium mb-6"
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  <span className="font-bold">{liveViewers}</span> Personen vergleichen gerade in Zug
                </motion.div>

                {/* H1 */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Umzug Zug – <br className="hidden md:block" />
                  <span className="text-secondary">Jetzt gratis vergleichen</span>
                </h1>

                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Vergleichen Sie <strong>30+ geprüfte Umzugsfirmen</strong> aus Zug, Baar, Cham & Rotkreuz.
                  <span className="text-green-400 font-semibold"> Bis zu 40% sparen.</span>
                </p>

                {/* IMPROVEMENT 3: Animated Stats Row */}
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

                {/* Trust Badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
                  {trustBadges.map((badge) => (
                    <div key={badge.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80">
                      <badge.icon className="w-3.5 h-3.5" />
                      {badge.name}
                    </div>
                  ))}
                </div>

                {/* Mobile CTA */}
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

              {/* Right: Enhanced Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <Card className="bg-white/[0.98] backdrop-blur-xl border-0 shadow-2xl rounded-2xl overflow-hidden">
                  <CardContent className="p-6 md:p-8">
                    {/* IMPROVEMENT 4: Live Activity Feed */}
                    <div className="mb-4 pb-4 border-b border-border">
                      <LiveActivityFeed />
                    </div>

                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-foreground mb-2">
                        Jetzt gratis vergleichen
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        In 2 Minuten zu 3-5 unverbindlichen Offerten
                      </p>
                    </div>

                    {/* IMPROVEMENT 5: Form Progress */}
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

                      {/* IMPROVEMENT 6: Quick Price Estimate */}
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

        {/* IMPROVEMENT 7: Enhanced Trust Bar with Animated Numbers */}
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
                <span className="text-xs text-muted-foreground">
                  (<AnimatedCounter end={2847} /> Bewertungen)
                </span>
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

        {/* IMPROVEMENT 8: Testimonials Section */}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Das sagen unsere Kunden
              </h2>
              <p className="text-muted-foreground">
                Über 2'800 zufriedene Kunden im Kanton Zug
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <TestimonialCarousel />
            </div>
          </div>
        </section>

        {/* TOP PROVIDERS */}
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
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Top Umzugsfirmen im Kanton Zug
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Geprüfte & versicherte Anbieter mit lokaler Erfahrung
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {companies.map((company, index) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group border-border/50 hover:border-secondary/30 relative overflow-hidden">
                    {/* IMPROVEMENT 9: Popular Badge */}
                    {company.isPopular && (
                      <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        🔥 Beliebt
                      </div>
                    )}
                    <CardContent className="p-5">
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {company.badges.map((badge) => (
                          <Badge 
                            key={badge} 
                            variant="secondary"
                            className={`text-xs ${
                              badge === "Top Bewertung" ? "bg-amber-100 text-amber-800" :
                              badge === "Preis-Sieger" ? "bg-green-100 text-green-800" :
                              badge === "Premium" ? "bg-purple-100 text-purple-800" :
                              "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </div>

                      <h3 className="font-bold text-lg mb-2 group-hover:text-secondary transition-colors">
                        {company.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(company.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{company.rating}</span>
                        <span className="text-xs text-muted-foreground">({company.reviewCount})</span>
                      </div>

                      {/* IMPROVEMENT 10: Response Time */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        Antwortzeit: {company.responseTime}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {company.services.slice(0, 3).map((service) => (
                          <span key={service} className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                            {service}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 text-sm text-green-600 mb-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {company.availability}
                      </div>

                      <Button variant="outline" className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary transition-all">
                        Offerte ansehen
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
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

        {/* IMPROVEMENT 11: Comparison Table */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="outline" className="mb-4">Warum Umzugscheck?</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Vergleichen lohnt sich
              </h2>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <Card className="overflow-hidden">
                <div className="grid grid-cols-3 bg-muted/50 p-4 font-semibold text-sm">
                  <div></div>
                  <div className="text-center text-primary">Umzugscheck.ch</div>
                  <div className="text-center text-muted-foreground">Direkt buchen</div>
                </div>
                {comparisonData.map((row, idx) => (
                  <div key={idx} className={`grid grid-cols-3 p-4 items-center ${idx % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <div className="text-sm font-medium">{row.feature}</div>
                    <div className="text-center">
                      {row.us === true ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {row.direct === true ? (
                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                      ) : row.direct === false ? (
                        <X className="w-5 h-5 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{row.direct}</span>
                      )}
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </section>

        {/* PRICING SECTION */}
        <section className="py-14 md:py-18 bg-muted/20">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Was kostet ein Umzug in Zug?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Typische Preise inkl. Transport, Träger & Material
              </p>
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
                    {/* IMPROVEMENT 12: Savings Badge */}
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
              <p className="text-sm text-muted-foreground mb-6 max-w-2xl mx-auto">
                * Richtwerte für Umzüge innerhalb des Kantons Zug. Mit Vergleich sparen Sie bis zu 40%.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/umzugsofferten">
                  <Target className="mr-2 w-5 h-5" />
                  Jetzt exakten Preis berechnen
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* POPULAR SERVICES */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="secondary" className="mb-4">Zusatzservices</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Beliebte Services in Zug
              </h2>
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
                    <Card className="h-full hover:shadow-lg transition-all hover:border-primary/30 cursor-pointer group relative overflow-hidden">
                      {/* IMPROVEMENT 13: Popular Tag */}
                      {service.popular && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-amber-100 text-amber-800 text-xs">
                            <Flame className="w-3 h-3 mr-1" />
                            Beliebt
                          </Badge>
                        </div>
                      )}
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

        {/* IMPROVEMENT 14: Video CTA Section */}
        <section className="py-14 md:py-18 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="overflow-hidden border-2 border-primary/20">
                <div className="grid md:grid-cols-2 items-center">
                  <div className="p-8">
                    <Badge className="bg-primary/10 text-primary mb-4">
                      <Video className="w-3 h-3 mr-1" />
                      NEU: AI-Video Analyse
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">
                      Kostenvoranschlag per Video
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Filmen Sie einfach Ihre Wohnung ab – unsere KI analysiert automatisch das Umzugsvolumen und liefert einen präzisen Kostenvoranschlag in Minuten.
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

        {/* HOW IT WORKS */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="outline" className="mb-4">So funktioniert's</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                In 3 Schritten zur Offerte
              </h2>
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
                  
                  <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative group-hover:scale-110 transition-transform">
                    <step.icon className="w-10 h-10 text-primary" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm mb-2">{step.description}</p>
                  {/* IMPROVEMENT 15: Time Indicator */}
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

        {/* IMPROVEMENT 16: Guarantees Section */}
        <section className="py-14 md:py-18 bg-muted/20">
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
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Ihre Sicherheit ist uns wichtig
              </h2>
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

        {/* WHY US */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Warum Umzugscheck.ch?
              </h2>
              <p className="text-muted-foreground">
                Die smarteste Art, Umzugsfirmen zu vergleichen
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {usps.map((usp, index) => (
                <motion.div
                  key={usp.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all border-border/50">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <usp.icon className="w-7 h-7 text-secondary" />
                      </div>
                      <h3 className="font-bold text-base mb-2">{usp.title}</h3>
                      <p className="text-sm text-muted-foreground">{usp.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPROVEMENT 17: Zug Local Info */}
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
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Umziehen im Kanton Zug
                </h2>
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
                    Monatsende-Hochsaison sind die besten Firmen früh ausgebucht. Mit unserem Vergleich 
                    finden Sie die passende lokale Umzugsfirma, die diese Besonderheiten kennt.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 md:py-18">
          <div className="container px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                Häufige Fragen
              </h2>
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
            <h3 className="font-semibold text-lg mb-4 text-center">
              Umzugsfirmen in der Nähe
            </h3>
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

        {/* IMPROVEMENT 18: Enhanced Final CTA */}
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Bereit für Ihren Umzug?
              </h2>
              <p className="text-lg text-primary-foreground/85 mb-8 max-w-xl mx-auto">
                30+ geprüfte Firmen · Bis 40% sparen · 100% gratis
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
              </div>

              {/* IMPROVEMENT 19: Trust Points */}
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-primary-foreground/80">
                {["Keine versteckten Kosten", "100% unverbindlich", "Schweizer Datenschutz", "24h Antwortzeit"].map((item) => (
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

      <SimplifiedFooter />

      {/* IMPROVEMENT 20: WhatsApp Button */}
      <WhatsAppButton />

      {/* Enhanced Sticky Mobile CTA */}
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
                <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {liveViewers} vergleichen gerade
                </div>
                <p className="text-sm font-bold">Bis 40% sparen</p>
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
