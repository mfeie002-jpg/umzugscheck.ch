import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Star, Shield, MapPin, Check, ArrowRight, Users, Clock, Award, Sparkles, Truck, Package, Home, Trash2, Building2,
  Lock, TrendingDown, FileText, CheckCircle, Sofa, Warehouse, ClipboardList, ChevronRight, MessageCircle,
  Crown, Banknote, ShieldCheck, CircleDollarSign, BadgeCheck, ThumbsUp, Video, Info, Gift, Phone, Mail, Globe, Timer
} from "lucide-react";

const HERO_BG = "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=2000&q=80";

// SEO-optimized meta data based on ChatGPT feedback
const SEO_META = {
  title: "Umzug Zürich – geprüfte Umzugsfirmen & bis 40% sparen | Umzugscheck",
  description: "Kostenlose Offerten von geprüften Umzugsfirmen in Zürich. Preise & Bewertungen vergleichen – stressfrei bis 40% sparen mit Umzugscheck.",
  canonical: "https://www.umzugscheck.ch/umzugsfirmen/zuerich",
  ogImage: "https://www.umzugscheck.ch/images/umzug-zuerich.jpg",
};

const cantons = [
  { value: "zuerich", label: "Zürich", href: "/umzugsfirmen/zuerich/v1" },
  { value: "bern", label: "Bern", href: "/umzugsfirmen/bern" },
  { value: "zug", label: "Zug", href: "/umzugsfirmen/zug" },
  { value: "basel", label: "Basel", href: "/umzugsfirmen/basel" },
  { value: "luzern", label: "Luzern", href: "/umzugsfirmen/luzern" },
  { value: "aargau", label: "Aargau", href: "/umzugsfirmen/aargau" },
];

const companies = [
  { id: "zuerich-umzug", name: "Zürich Umzug AG", rating: 4.9, reviewCount: 312, badges: ["Top Bewertung", "Lokal"], priceLevel: "Mittel", isPopular: true, responseTime: "< 2h" },
  { id: "limmat-transporte", name: "Limmat Transporte", rating: 4.8, reviewCount: 245, badges: ["Preis-Sieger"], priceLevel: "Günstig", isBestPrice: true, responseTime: "< 1h" },
  { id: "city-movers-zh", name: "City Movers Zürich", rating: 4.9, reviewCount: 198, badges: ["Premium", "Express"], priceLevel: "Premium", isPremium: true, responseTime: "< 3h" },
];

const priceExamples = [
  { size: "1.5 - 2.5 Zimmer", price: "CHF 800 – 1'500", subtext: "Studio / kleine Wohnung", icon: Home, savings: "bis CHF 600" },
  { size: "3.5 - 4.5 Zimmer", price: "CHF 1'200 – 2'000", subtext: "Familienwohnung", icon: Building2, savings: "bis CHF 800" },
  { size: "5+ Zimmer / Haus", price: "ab CHF 3'000", subtext: "Villa / Einfamilienhaus", icon: Home, savings: "bis CHF 1'200" },
];

const services = [
  { title: "Endreinigung", icon: Sparkles, description: "Mit Abnahmegarantie", link: "/services/reinigung" },
  { title: "Ein-/Auspackservice", icon: Package, description: "Professionelles Verpacken", link: "/services/packservice" },
  { title: "Möbelmontage", icon: Sofa, description: "Auf- & Abbau vor Ort", link: "/services/moebelmontage" },
  { title: "Möbellift", icon: Truck, description: "Für enge Treppenhäuser", link: "/services/moebellift" },
  { title: "Einlagerung", icon: Warehouse, description: "Sichere Lagerräume", link: "/services/lagerung" },
  { title: "Entsorgung", icon: Trash2, description: "Fachgerechte Entsorgung", link: "/services/entsorgung" },
];

const howItWorks = [
  { step: 1, title: "Anfrage ausfüllen", description: "Start, Ziel & Wohnungsgrösse eingeben", icon: ClipboardList, time: "30 Sek." },
  { step: 2, title: "Offerten vergleichen", description: "3-5 Festpreis-Angebote erhalten", icon: FileText, time: "24-48h" },
  { step: 3, title: "Über Umzugscheck buchen", description: "Bestes Angebot wählen & sparen", icon: CheckCircle, time: "Ihr Termin" },
];

const testimonials = [
  { name: "Thomas M.", location: "Zürich → Winterthur", rating: 5, text: "Perfekter Umzug! Die Firma war pünktlich, professionell und hat alles vorsichtig transportiert. CHF 620 gespart dank Vergleich.", date: "vor 3 Tagen", verified: true, savedAmount: 620 },
  { name: "Lisa K.", location: "Altstetten → Oerlikon", rating: 5, text: "Unkompliziert und transparent. 4 Offerten erhalten und die beste gewählt. Klare Empfehlung!", date: "vor 5 Tagen", verified: true, savedAmount: 480 },
  { name: "Marco S.", location: "Wallisellen → Zürich City", rating: 5, text: "Trotz Altstadt-Umzug alles reibungslos. Die Firma kannte sich bestens mit Halteverbotszonen aus.", date: "vor 1 Woche", verified: true, savedAmount: 550 },
];

const guarantees = [
  { title: "Kostenlos-Garantie", description: "100% gratis, keine versteckten Gebühren", icon: CircleDollarSign },
  { title: "Datenschutz-Garantie", description: "Schweizer Hosting, DSGVO-konform", icon: ShieldCheck },
  { title: "Qualitäts-Garantie", description: "Nur geprüfte & versicherte Firmen", icon: BadgeCheck },
  { title: "Durchführungs-Garantie", description: "Ihr Umzug findet garantiert statt", icon: ThumbsUp },
];

// SEO-optimized FAQs based on ChatGPT feedback
const faqs = [
  { 
    question: "Was kostet ein Umzug in Zürich?", 
    answer: "Die Umzugskosten hängen vom Umfang, der Distanz und weiteren Faktoren ab. Eine kleine Wohnung (1-2 Zimmer) kostet ca. CHF 800–1'500, größere Umzüge (4-5 Zimmer) ca. CHF 1'200–2'000. Der Schweizer Durchschnitt liegt bei ca. CHF 1'600 pro Umzug. Durch unseren Offertenvergleich sparen Kunden im Schnitt bis zu 40%." 
  },
  { 
    question: "Worauf muss ich bei einem Umzug in Zürich besonders achten?", 
    answer: "In Zürich sollten Sie frühzeitig eine Halteverbotszone für den Umzugstag beantragen (3–7 Tage Vorlauf bei der Stadtpolizei nötig). Planen Sie mind. 6–8 Wochen Vorlaufzeit ein, besonders zum Monatsende. Unsere Partner kennen die lokalen Gegebenheiten und helfen bei Parkplatz-Reservierungen." 
  },
  { 
    question: "Wie finde ich eine zuverlässige Umzugsfirma in Zürich?", 
    answer: "Achten Sie auf Kundenbewertungen, Versicherungsschutz und transparente Preise. Über Umzugscheck erhalten Sie Angebote von geprüften, lokal bewerteten Umzugsfirmen. Alle 80+ Partner sind vollständig versichert und durchlaufen unseren Qualitätscheck." 
  },
  { 
    question: "Bietet Umzugscheck auch Unterstützung bei der Reinigung oder Lagerung?", 
    answer: "Ja, viele unserer Zürcher Partner bieten Zusatzleistungen wie Endreinigung mit Abnahmegarantie, Möbellagerung, Verpackungsservice oder Möbelmontage an. Bei der Offertanfrage können Sie einfach angeben, welche Extras Sie benötigen." 
  },
  { 
    question: "Welche Vorteile haben lokale Umzugsfirmen in Zürich?", 
    answer: "Lokale Firmen kennen Verkehrssituationen, behördliche Abläufe und die schnellsten Routen. Kurze Anfahrtswege schonen die Umwelt und ermöglichen günstigere Preise. Zudem sind sie auch bei kurzfristigen Umzügen oft verfügbar." 
  },
];

const nearbyMunicipalities = [
  { name: "Umzug Winterthur", href: "/winterthur/umzugsfirmen" },
  { name: "Umzug Dübendorf", href: "/duebendorf/umzugsfirmen" },
  { name: "Umzug Uster", href: "/uster/umzugsfirmen" },
  { name: "Umzug Dietikon", href: "/dietikon/umzugsfirmen" },
  { name: "Umzug Kloten", href: "/kloten/umzugsfirmen" },
  { name: "Umzug Wallisellen", href: "/wallisellen/umzugsfirmen" },
];

const otherCantons = [
  { name: "Umzugsfirmen Bern", href: "/umzugsfirmen/bern" },
  { name: "Umzugsfirmen Basel", href: "/umzugsfirmen/basel" },
  { name: "Umzugsfirmen Luzern", href: "/umzugsfirmen/luzern" },
  { name: "Umzugsfirmen Aargau", href: "/umzugsfirmen/aargau" },
];

const trustBadges = [
  { name: "Swiss Made", icon: Shield },
  { name: "SSL Encrypted", icon: Lock },
  { name: "Geprüft", icon: BadgeCheck },
  { name: "4.8★ Bewertung", icon: Star },
];

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
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Fortschritt</span>
        <span>{filledCount}/3 Felder</span>
      </div>
      <Progress value={(filledCount / 3) * 100} className="h-2" />
    </div>
  );
};

const QuickPriceEstimate = ({ size }: { size: string }) => {
  if (!size) return null;
  const estimates: Record<string, { min: number; max: number; savings: number }> = {
    "1-2": { min: 800, max: 1500, savings: 600 },
    "2.5-3": { min: 1000, max: 1700, savings: 680 },
    "3.5-4": { min: 1200, max: 2000, savings: 800 },
    "4.5-5": { min: 1800, max: 2800, savings: 1000 },
    "5+": { min: 3000, max: 5000, savings: 1200 },
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
    href="https://wa.me/41791234567?text=Hallo,%20ich%20möchte%20eine%20Umzugsofferte%20für%20Zürich"
    target="_blank"
    rel="noopener noreferrer"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 2, type: "spring" }}
    className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all group"
  >
    <MessageCircle className="w-7 h-7 text-white" />
  </motion.a>
);

const ZuerichV1LandingPage = () => {
  const navigate = useNavigate();
  const [liveViewers, setLiveViewers] = useState(42);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("zuerich");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setLiveViewers(p => Math.max(30, Math.min(60, p + Math.floor(Math.random() * 7) - 3))), 3500);
    return () => clearInterval(i);
  }, []);
  
  useEffect(() => {
    const h = () => setShowStickyBar(window.scrollY > 700);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);
  
  useEffect(() => {
    const i = setInterval(() => setActiveTestimonial(p => (p + 1) % testimonials.length), 5000);
    return () => clearInterval(i);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("uc_prefill", JSON.stringify({
      from: fromLocation,
      to: toLocation,
      size: apartmentSize,
      source: "zuerich-v1-landing",
      timestamp: Date.now(),
    }));
    navigate("/umzugsofferten");
  };

  const handleCantonChange = (value: string) => {
    setSelectedCanton(value);
    const canton = cantons.find(c => c.value === value);
    if (canton && value !== "zuerich") navigate(canton.href);
  };

  // Enhanced Schema.org structured data based on ChatGPT feedback
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "name": "Umzugscheck.ch - Kanton Zürich",
        "description": "Vergleiche 80+ geprüfte Umzugsfirmen im Kanton Zürich. Kostenlose Offerten, transparente Preise, bis zu 40% sparen.",
        "url": SEO_META.canonical,
        "telephone": "+41 44 123 45 67",
        "areaServed": {
          "@type": "Place",
          "name": "Kanton Zürich, Schweiz"
        },
        "priceRange": "CHF 800 - CHF 6000",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "reviewCount": "4523",
          "bestRating": "5"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      },
      {
        "@type": "WebPage",
        "name": SEO_META.title,
        "description": SEO_META.description,
        "url": SEO_META.canonical,
        "isPartOf": {
          "@type": "WebSite",
          "name": "Umzugscheck.ch",
          "url": "https://www.umzugscheck.ch"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background" data-uc-capture-root="1">
      {/* SEO-optimized Helmet based on ChatGPT feedback */}
      <Helmet>
        <html lang="de-CH" />
        <title>{SEO_META.title}</title>
        <meta name="description" content={SEO_META.description} />
        <link rel="canonical" href={SEO_META.canonical} />
        
        {/* Open Graph Tags */}
        <meta property="og:title" content={SEO_META.title} />
        <meta property="og:description" content={SEO_META.description} />
        <meta property="og:image" content={SEO_META.ogImage} />
        <meta property="og:url" content={SEO_META.canonical} />
        <meta property="og:site_name" content="Umzugscheck" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="de_CH" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_META.title} />
        <meta name="twitter:description" content={SEO_META.description} />
        <meta name="twitter:image" content={SEO_META.ogImage} />
        
        {/* Schema.org JSON-LD */}
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
              {/* Left: Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center lg:text-left"
              >
                {/* Canton Selector */}
                <div className="inline-flex items-center gap-2 mb-4">
                  <Select value={selectedCanton} onValueChange={handleCantonChange}>
                    <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {cantons.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Live Viewers Badge */}
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

                {/* H1 Headline - SEO optimized */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight">
                  Umzug Zürich – <br className="hidden md:block" />
                  <span className="text-secondary">geprüfte Firmen & bis 40% sparen</span>
                </h1>

                {/* Sub-headline with USPs */}
                <p className="text-lg md:text-xl text-white/85 mb-6 max-w-xl mx-auto lg:mx-0">
                  Kostenlose Offerten von <strong>80+ geprüften Umzugsfirmen</strong> in Zürich.
                  Preise & Bewertungen vergleichen – <span className="text-green-400 font-semibold">stressfrei sparen.</span>
                </p>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8 max-w-lg mx-auto lg:mx-0">
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      <AnimatedCounter end={4523} suffix="+" />
                    </div>
                    <div className="text-xs text-white/60">Bewertungen</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-2xl md:text-3xl font-bold text-white">
                      <AnimatedCounter end={80} suffix="+" />
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
                  {trustBadges.map((b) => (
                    <div key={b.name} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs text-white/80">
                      <b.icon className="w-3.5 h-3.5" />
                      {b.name}
                    </div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="lg:hidden space-y-3">
                  <Button asChild size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6 shadow-[0_4px_20px_rgba(220,38,38,0.4)]">
                    <Link to="/umzugsofferten">
                      Kostenlos Offerten erhalten
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                  </Button>
                  <p className="text-white/60 text-sm flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    100% kostenlos & unverbindlich
                  </p>
                </div>
              </motion.div>

              {/* Right: Form Card (Desktop) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="hidden lg:block"
              >
                <Card className="bg-card/95 backdrop-blur-sm border-border/50 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <Badge className="bg-green-100 text-green-800 mb-3">
                        <Gift className="w-3 h-3 mr-1" />
                        100% Kostenlos
                      </Badge>
                      <h2 className="text-2xl font-bold">Jetzt Offerten erhalten</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        In 30 Sekunden 3-5 Festpreis-Angebote
                      </p>
                    </div>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="from">Von (PLZ oder Ort)</Label>
                        <Input
                          id="from"
                          value={fromLocation}
                          onChange={(e) => setFromLocation(e.target.value)}
                          placeholder="z.B. 8001 oder Zürich"
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="to">Nach (PLZ oder Ort)</Label>
                        <Input
                          id="to"
                          value={toLocation}
                          onChange={(e) => setToLocation(e.target.value)}
                          placeholder="z.B. 8400 Winterthur"
                          className="h-12"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="size">Wohnungsgrösse</Label>
                        <Select value={apartmentSize} onValueChange={setApartmentSize}>
                          <SelectTrigger id="size" className="h-12">
                            <SelectValue placeholder="Bitte wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-2">1-2 Zimmer</SelectItem>
                            <SelectItem value="2.5-3">2.5-3 Zimmer</SelectItem>
                            <SelectItem value="3.5-4">3.5-4 Zimmer</SelectItem>
                            <SelectItem value="4.5-5">4.5-5 Zimmer</SelectItem>
                            <SelectItem value="5+">5+ Zimmer / Haus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <QuickPriceEstimate size={apartmentSize} />
                      <FormProgress fields={{ from: fromLocation, to: toLocation, size: apartmentSize }} />

                      <Button type="submit" size="lg" className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg py-6">
                        Kostenlose Offerten erhalten
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        <Lock className="inline w-3 h-3 mr-1" />
                        Ihre Daten sind sicher. Keine Spam-Mails.
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 2. HOW IT WORKS */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">So funktioniert's</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">In 3 Schritten zum besten Angebot</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Vergleichen Sie kostenlos und unverbindlich – ohne Verpflichtungen
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative h-full text-center hover:shadow-lg transition-shadow">
                    <CardContent className="pt-8 pb-6">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground text-sm">{item.description}</p>
                      <Badge variant="secondary" className="mt-4">
                        <Timer className="w-3 h-3 mr-1" />
                        {item.time}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. ZURICH-SPECIFIC SEO CONTENT */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Umziehen in Zürich – stressfrei mit den richtigen Partnern</h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Zürich ist die grösste Stadt der Schweiz und ein attraktiver, aber auch anspruchsvoller Ort für Umzüge. 
                  Enge Stadtquartiere, begrenzte Parkplätze und behördliche Vorgaben erfordern eine gute Planung. 
                  <strong> In der Stadt Zürich muss eine temporäre Halteverbotszone je nach Gebiet 3–7 Tage im Voraus bei der Stadtpolizei beantragt werden</strong> – 
                  ein wichtiger Faktor, den Sie früh berücksichtigen sollten.
                </p>

                <div className="grid md:grid-cols-2 gap-8 my-8">
                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-primary" />
                      Umzugskosten in Zürich
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Durchschnittlich liegen die Umzugskosten in der Schweiz bei ca. <strong>CHF 1'600</strong> pro Umzug. 
                      Eine kleine 1–2-Zimmer-Wohnung innerhalb Zürich kostet etwa <strong>CHF 800–1'500</strong>, 
                      während ein grosser Umzug (5 Zimmer) mit <strong>CHF 3'000–6'000</strong> zu veranschlagen ist.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Regionale Vorteile
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Lokale Umzugsfirmen kennen Verkehrssituationen, behördliche Abläufe und die schnellsten Routen in Zürich. 
                      Kurze Anfahrtswege schonen die Umwelt und ermöglichen <strong>günstigere Preise</strong>.
                    </p>
                  </Card>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2 text-green-800">
                    <ShieldCheck className="w-5 h-5" />
                    Vertrauen und Sicherheit
                  </h3>
                  <ul className="space-y-2 text-green-800">
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>Alle 80+ Partner sind <strong>geprüft und versichert</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>Durchschnittliche Bewertung von <strong>4.8 von 5 Sternen</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 shrink-0 mt-0.5" />
                      <span><strong>Festpreis-Offerten</strong> – keine versteckten Kosten</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 shrink-0 mt-0.5" />
                      <span><strong>Durchführungsgarantie</strong> am vereinbarten Datum</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>Endreinigungen mit <strong>Abnahmegarantie</strong></span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PRICE EXAMPLES */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Preisbeispiele Zürich</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Was kostet ein Umzug in Zürich?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Transparente Preisbeispiele für Umzüge im Kanton Zürich
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {priceExamples.map((example, index) => (
                <motion.div
                  key={example.size}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                        <example.icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{example.size}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{example.subtext}</p>
                      <div className="text-2xl font-bold text-primary mb-2">{example.price}</div>
                      <Badge className="bg-green-100 text-green-800">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        Sparen: {example.savings}
                      </Badge>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link to="/umzugsofferten">
                  Genauen Preis berechnen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5. TESTIMONIALS */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Kundenstimmen</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Das sagen unsere Kunden in Zürich</h2>
              <div className="flex items-center justify-center gap-2 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-amber-400" />
                ))}
                <span className="text-foreground font-bold ml-2">4.8/5</span>
                <span className="text-muted-foreground">(4'523 Bewertungen)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                        </div>
                        {testimonial.verified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verifiziert
                          </Badge>
                        )}
                      </div>
                      {testimonial.savedAmount && (
                        <Badge className="mt-3 bg-green-100 text-green-800">
                          CHF {testimonial.savedAmount} gespart
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION with Schema.org */}
        <section className="py-16 md:py-20 bg-muted/30" id="faq">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Häufige Fragen</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">FAQ zum Umzug in Zürich</h2>
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="bg-card rounded-lg border px-6">
                    <AccordionTrigger className="text-left font-medium py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* 7. SERVICES */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4">Zusatzleistungen</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Alles aus einer Hand</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {services.map((service) => (
                <Card key={service.title} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-sm mb-1">{service.title}</h3>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 8. GUARANTEES */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unsere Garantien</h2>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {guarantees.map((guarantee) => (
                <Card key={guarantee.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                      <guarantee.icon className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="font-bold mb-2">{guarantee.title}</h3>
                    <p className="text-sm text-muted-foreground">{guarantee.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* 9. NEARBY LOCATIONS & INTERNAL LINKS */}
        <section className="py-16 md:py-20">
          <div className="container px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-xl font-bold mb-4">Umzüge in der Nähe</h3>
                <div className="flex flex-wrap gap-2">
                  {nearbyMunicipalities.map((m) => (
                    <Link key={m.name} to={m.href} className="text-sm px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors">
                      {m.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Weitere Kantone</h3>
                <div className="flex flex-wrap gap-2">
                  {otherCantons.map((c) => (
                    <Link key={c.name} to={c.href} className="text-sm px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 10. FINAL CTA */}
        <section className="py-16 md:py-20 bg-gradient-to-br from-primary to-primary/80 text-white">
          <div className="container px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Bereit für Ihren Umzug in Zürich?</h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Vergleichen Sie jetzt kostenlos 80+ geprüfte Umzugsfirmen und sparen Sie bis zu 40%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link to="/umzugsofferten">
                  Kostenlos Offerten erhalten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10">
                <Link to="/rechner/video">
                  <Video className="mr-2 w-5 h-5" />
                  Video-Analyse nutzen
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/60 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" />
              100% kostenlos & unverbindlich
            </p>
          </div>
        </section>
      </main>

      <WhatsAppButton />

      {/* Sticky Mobile CTA */}
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
                <p className="text-xs text-muted-foreground">80+ geprüfte Firmen in Zürich</p>
              </div>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold shrink-0">
                <Link to="/umzugsofferten">Gratis Offerten</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ZuerichV1LandingPage;
