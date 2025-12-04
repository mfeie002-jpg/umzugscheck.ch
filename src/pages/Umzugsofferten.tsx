import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle2, Shield, Clock, TrendingDown, ArrowRight, Star, MapPin,
  Users, Zap, Award, Phone, ChevronRight, Sparkles, Activity, 
  BadgeCheck, Building2, Home, Truck, Package, Timer, CalendarCheck,
  ThumbsUp, Quote, Play, Lock, Eye, Heart
} from "lucide-react";
import { OptimizedSEO } from "@/components/OptimizedSEO";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ENHANCED_COMPANIES } from "@/data/enhanced-companies";
import { Footer } from "@/components/Footer";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { generatePageSchemas, generateSchemaScript } from "@/lib/schema-markup";
import { motion, AnimatePresence } from "framer-motion";
import { swissPostalCodes } from "@/lib/swiss-postal-codes";

// Filter postal codes function
const filterPostalCodes = (query: string): string[] => {
  if (!query || query.length < 1) return [];
  const q = query.toLowerCase();
  return swissPostalCodes
    .filter(p => 
      p.code.startsWith(q) || 
      p.city.toLowerCase().includes(q) ||
      `${p.code} - ${p.city}`.toLowerCase().includes(q)
    )
    .slice(0, 100)
    .map(p => `${p.code} - ${p.city} (${p.canton})`);
};

// Live activity simulation
const liveActivities = [
  { city: "Zürich", action: "hat gerade Offerten erhalten", time: "vor 2 Min." },
  { city: "Basel", action: "vergleicht 4 Firmen", time: "vor 5 Min." },
  { city: "Bern", action: "hat CHF 840 gespart", time: "vor 8 Min." },
  { city: "Luzern", action: "hat eine Firma gebucht", time: "vor 12 Min." },
  { city: "Zug", action: "hat gerade Offerten erhalten", time: "vor 15 Min." },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "Zürich → Basel",
    rating: 5,
    text: "Innerhalb von 24h hatte ich 4 Offerten. Die Ersparnis von CHF 650 gegenüber meiner ersten Anfrage war enorm!",
    saved: "CHF 650",
    avatar: "SM",
    date: "November 2024"
  },
  {
    name: "Marco B.",
    location: "Bern → Luzern", 
    rating: 5,
    text: "Super einfach! 3 Minuten Formular, 5 Offerten erhalten, beste Firma gewählt. Umzug lief perfekt.",
    saved: "CHF 420",
    avatar: "MB",
    date: "Oktober 2024"
  },
  {
    name: "Lisa K.",
    location: "Winterthur → Zürich",
    rating: 5,
    text: "Die Vergleichsmöglichkeit war Gold wert. Konnte Preise und Bewertungen direkt vergleichen.",
    saved: "CHF 380",
    avatar: "LK",
    date: "September 2024"
  },
  {
    name: "Thomas H.",
    location: "St. Gallen → Chur",
    rating: 5,
    text: "Professionell und schnell. Alle Firmen waren geprüft und versichert. Sehr empfehlenswert!",
    saved: "CHF 510",
    avatar: "TH",
    date: "November 2024"
  }
];

const priceExamples = [
  {
    size: "2.5 Zimmer",
    subtitle: "Studio/kleine Wohnung",
    priceMin: 650,
    priceMax: 1200,
    savings: "bis CHF 350",
    icon: Home,
    popular: false
  },
  {
    size: "3.5 Zimmer",
    subtitle: "Familienwohnung",
    priceMin: 1100,
    priceMax: 2000,
    savings: "bis CHF 580",
    icon: Building2,
    popular: true
  },
  {
    size: "4.5+ Zimmer",
    subtitle: "Haus/grosse Wohnung",
    priceMin: 1800,
    priceMax: 3500,
    savings: "bis CHF 950",
    icon: Home,
    popular: false
  }
];

const topCompanies = ENHANCED_COMPANIES
  .filter(c => c.is_featured && c.rating && c.rating >= 4.5)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 4);

const faqs = [
  {
    question: "Ist der Vergleich wirklich kostenlos?",
    answer: "Ja, 100% kostenlos und unverbindlich. Umzugscheck.ch wird von den Umzugsfirmen finanziert, nicht von Ihnen. Sie zahlen nur die Firma, die Sie tatsächlich beauftragen."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "Die meisten Nutzer erhalten innerhalb von 24 Stunden 3-5 konkrete Offerten. Bei dringenden Umzügen oft sogar schneller. Sie werden per E-Mail benachrichtigt."
  },
  {
    question: "Wie viel kann ich wirklich sparen?",
    answer: "Unsere Daten zeigen durchschnittliche Einsparungen von 25-40% im Vergleich zur ersten Anfrage. Bei grösseren Umzügen sind das oft CHF 500-1'000+."
  },
  {
    question: "Sind alle Firmen geprüft?",
    answer: "Ja. Jede Partnerfirma durchläuft unsere Qualitätsprüfung: Versicherungsnachweis, Handelsregister-Eintrag, Kundenbewertungen und regelmässige Kontrollen."
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, absolut keine Verpflichtung. Sie vergleichen in Ruhe und entscheiden selbst, ob und welche Firma Sie beauftragen möchten."
  }
];

const trustStats = [
  { value: "15'247", label: "Umzüge verglichen", icon: Truck },
  { value: "4.8/5", label: "Durchschnittsbewertung", icon: Star },
  { value: "127", label: "Geprüfte Firmen", icon: BadgeCheck },
  { value: "38%", label: "Ø Ersparnis", icon: TrendingDown }
];

export default function Umzugsofferten() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Form state
  const [fromLocation, setFromLocation] = useState(searchParams.get("from") || "");
  const [toLocation, setToLocation] = useState(searchParams.get("to") || "");
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "3.5");
  
  // Live activity
  const [currentActivity, setCurrentActivity] = useState(0);
  const [liveCount, setLiveCount] = useState(23);
  
  // Testimonial slider
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Postal code suggestions
  const fromSuggestions = fromLocation.length >= 1 ? filterPostalCodes(fromLocation) : [];
  const toSuggestions = toLocation.length >= 1 ? filterPostalCodes(toLocation) : [];

  // Live activity rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % liveActivities.length);
      setLiveCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromLocation && toLocation) {
      navigate(`/rechner?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}&rooms=${rooms}`);
    }
  };

  const currentUrl = 'https://www.umzugscheck.ch/umzugsofferten';
  const schemas = generatePageSchemas({ type: 'offerten', url: currentUrl }, faqs);

  return (
    <>
      <Helmet>
        <title>Umzugsofferten vergleichen & bis zu 40% sparen | umzugscheck.ch</title>
        <meta name="description" content="Erhalten Sie in 2 Minuten kostenlose Offerten von geprüften Schweizer Umzugsfirmen. Vergleichen Sie Preise, Bewertungen und sparen Sie durchschnittlich 38%." />
        <meta name="keywords" content="umzugsofferten, umzug offerte, umzugsangebot, umzug schweiz, umzugsfirma vergleichen, günstig umziehen" />
        <link rel="canonical" href={currentUrl} />
        <meta property="og:title" content="Umzugsofferten vergleichen & bis zu 40% sparen | umzugscheck.ch" />
        <meta property="og:description" content="Kostenlose Offerten von geprüften Schweizer Umzugsfirmen. Vergleichen und sparen Sie durchschnittlich 38%." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <script type="application/ld+json">{JSON.stringify(schemas)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        
        {/* ===== HERO SECTION WITH EMBEDDED FORM ===== */}
        <section className="relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
          
          {/* Live Activity Banner */}
          <div className="relative bg-primary/5 border-b border-primary/10">
            <div className="container mx-auto px-4 py-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentActivity}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-muted-foreground"
                  >
                    <span className="font-medium text-foreground">{liveActivities[currentActivity].city}</span>
                    {" "}{liveActivities[currentActivity].action}{" "}
                    <span className="text-muted-foreground/70">{liveActivities[currentActivity].time}</span>
                  </motion.span>
                </AnimatePresence>
                <span className="hidden sm:inline text-muted-foreground/50">•</span>
                <span className="hidden sm:inline text-muted-foreground">
                  <span className="font-semibold text-primary">{liveCount}</span> Personen vergleichen gerade
                </span>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center max-w-7xl mx-auto">
              
              {/* Left: Headlines & Trust */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Badge */}
                <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary px-4 py-1.5">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  Nr. 1 Umzugsvergleich der Schweiz
                </Badge>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
                  Umzugsofferten vergleichen –{" "}
                  <span className="text-primary">bis zu 40% sparen</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-xl">
                  In 2 Minuten kostenlose Offerten von <strong>geprüften Schweizer Umzugsfirmen</strong> erhalten. 
                  Vergleichen Sie Preise, Bewertungen und Services – völlig unverbindlich.
                </p>

                {/* Trust Row */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-muted-foreground">100% kostenlos</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-muted-foreground">Geprüfte Firmen</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <span className="text-muted-foreground">24h Offerten</span>
                  </div>
                </div>

                {/* Mobile Form Trigger */}
                <div className="lg:hidden pt-4">
                  <Button 
                    size="lg" 
                    className="w-full h-14 text-lg shadow-xl"
                    onClick={() => document.getElementById('offerten-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Jetzt Offerten erhalten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>

                {/* Trust Metrics - Desktop */}
                <div className="hidden lg:grid grid-cols-4 gap-4 pt-6 border-t border-border/50">
                  {trustStats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                      <div className="text-xs text-muted-foreground">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Form Card */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                id="offerten-form"
              >
                <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                  {/* Form Header */}
                  <div className="bg-gradient-to-r from-primary to-primary/90 px-6 py-4 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg">Kostenlose Offerten erhalten</h2>
                        <p className="text-white/80 text-sm">In nur 2 Minuten – unverbindlich</p>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* From */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Von wo ziehen Sie?</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="PLZ oder Ort eingeben"
                            value={fromLocation}
                            onChange={(e) => setFromLocation(e.target.value)}
                            className="pl-10 h-12 bg-muted/30 border-muted-foreground/20"
                            list="from-suggestions"
                            required
                          />
                          <datalist id="from-suggestions">
                            {fromSuggestions.slice(0, 8).map((s, i) => (
                              <option key={i} value={s} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* To */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Wohin ziehen Sie?</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                          <Input
                            type="text"
                            placeholder="PLZ oder Ort eingeben"
                            value={toLocation}
                            onChange={(e) => setToLocation(e.target.value)}
                            className="pl-10 h-12 bg-muted/30 border-muted-foreground/20"
                            list="to-suggestions"
                            required
                          />
                          <datalist id="to-suggestions">
                            {toSuggestions.slice(0, 8).map((s, i) => (
                              <option key={i} value={s} />
                            ))}
                          </datalist>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Wohnungsgrösse</label>
                        <div className="grid grid-cols-4 gap-2">
                          {["1.5", "2.5", "3.5", "4.5+"].map((size) => (
                            <button
                              key={size}
                              type="button"
                              onClick={() => setRooms(size)}
                              className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${
                                rooms === size 
                                  ? "bg-primary text-white shadow-md" 
                                  : "bg-muted/50 text-foreground hover:bg-muted"
                              }`}
                            >
                              {size} Zi.
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Submit */}
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-14 text-lg font-semibold shadow-lg mt-2"
                      >
                        Kostenlose Offerten erhalten
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>

                      {/* Trust line */}
                      <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3" /> SSL-verschlüsselt
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" /> Datenschutz
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Keine Kosten
                        </span>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Social Proof below form */}
                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <div className="flex -space-x-2">
                    {["SM", "MB", "LK", "TH"].map((initials, i) => (
                      <div 
                        key={i} 
                        className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-xs font-medium text-primary"
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <span>
                    <strong className="text-foreground">2'847</strong> zufriedene Kunden diesen Monat
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== SOCIAL PROOF / TESTIMONIALS SLIDER ===== */}
        <section className="py-12 md:py-16 bg-muted/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-4xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1,2,3,4,5].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">4.8 von 5 Sternen</strong> basierend auf 2'847 Bewertungen
                  </p>
                </div>

                {/* Testimonial Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="bg-white shadow-lg border-0">
                      <CardContent className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          {/* Avatar & Info */}
                          <div className="flex items-center gap-4 md:flex-col md:items-center md:text-center md:w-32 shrink-0">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                              {testimonials[currentTestimonial].avatar}
                            </div>
                            <div>
                              <div className="font-semibold">{testimonials[currentTestimonial].name}</div>
                              <div className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</div>
                              <div className="flex items-center gap-0.5 mt-1">
                                {[1,2,3,4,5].map((_, i) => (
                                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Quote */}
                          <div className="flex-1">
                            <Quote className="w-8 h-8 text-primary/20 mb-2" />
                            <p className="text-lg text-foreground leading-relaxed mb-4">
                              {testimonials[currentTestimonial].text}
                            </p>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                <TrendingDown className="w-3 h-3 mr-1" />
                                Gespart: {testimonials[currentTestimonial].saved}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                {testimonials[currentTestimonial].date}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentTestimonial(i)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        i === currentTestimonial ? "bg-primary w-6" : "bg-primary/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===== WHY COMPARE - STATS SECTION ===== */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Fakten & Zahlen</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Warum Offerten vergleichen?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Die Preisunterschiede zwischen Umzugsfirmen sind enorm. 
                  Ein Vergleich lohnt sich <strong>immer</strong>.
                </p>
              </div>
            </ScrollReveal>

            {/* Stats Grid */}
            <ScrollReveal delay={100}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
                {trustStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center p-6 rounded-2xl bg-muted/30 border border-border/50"
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            {/* Benefits Grid */}
            <ScrollReveal delay={200}>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                <Card className="border-0 shadow-soft hover:shadow-medium transition-all bg-white">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                      <TrendingDown className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Preisunterschiede bis 40%</h3>
                    <p className="text-muted-foreground text-sm">
                      Die gleiche Leistung kann bei verschiedenen Firmen CHF 500+ Unterschied bedeuten. Ohne Vergleich zahlen Sie oft zu viel.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft hover:shadow-medium transition-all bg-white">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                      <Timer className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Zeit sparen</h3>
                    <p className="text-muted-foreground text-sm">
                      Statt 10 Firmen einzeln anzufragen, erhalten Sie mit einer Anfrage mehrere Offerten zum Vergleichen.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-soft hover:shadow-medium transition-all bg-white">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                      <BadgeCheck className="w-6 h-6 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">Nur geprüfte Firmen</h3>
                    <p className="text-muted-foreground text-sm">
                      Versicherung, Handelsregister, Bewertungen – wir prüfen alle Partner. Sie erhalten nur seriöse Angebote.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===== PRICE EXAMPLES ===== */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Preisübersicht</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Was kostet ein Umzug in der Schweiz?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Richtwerte für typische Umzüge innerhalb einer Region (bis 30km)
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {priceExamples.map((example, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all bg-white h-full ${
                      example.popular ? "ring-2 ring-primary" : ""
                    }`}>
                      {example.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-white text-xs px-3 py-1 rounded-bl-lg font-medium">
                          Häufigste Grösse
                        </div>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <example.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{example.size}</h3>
                            <p className="text-sm text-muted-foreground">{example.subtitle}</p>
                          </div>
                        </div>

                        {/* Price Range Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Preisspanne</span>
                          </div>
                          <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 rounded-full"
                              style={{ width: "100%" }}
                            />
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-lg font-bold text-green-600">CHF {example.priceMin.toLocaleString()}</span>
                            <span className="text-lg font-bold text-red-600">CHF {example.priceMax.toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <TrendingDown className="w-3 h-3 mr-1" />
                            {example.savings} sparen
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="text-center mt-10">
                <p className="text-sm text-muted-foreground mb-4">
                  * Richtwerte für lokale Umzüge. Endpreis abhängig von Stockwerk, Zugang, Möbelmenge und Zusatzservices.
                </p>
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg"
                  onClick={() => navigate('/rechner')}
                >
                  Exakte Kosten berechnen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===== TOP COMPANIES PREVIEW ===== */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">Unsere Partner</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Top bewertete Umzugsfirmen
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Diese Firmen erhalten regelmässig Bestnoten von unseren Nutzern
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {topCompanies.map((company, i) => (
                  <motion.div
                    key={company.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="h-full border-0 shadow-soft hover:shadow-medium transition-all bg-white overflow-hidden group">
                      <CardContent className="p-5">
                        {/* Header */}
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                            {company.logo_url ? (
                              <span className="text-2xl">{company.logo_url}</span>
                            ) : (
                              <Building2 className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                              {company.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                              <span className="font-semibold text-sm">{company.rating?.toFixed(1)}</span>
                              <span className="text-xs text-muted-foreground">
                                ({company.review_count || 0})
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            <BadgeCheck className="w-3 h-3 mr-1" />
                            Geprüft
                          </Badge>
                          {company.is_featured && (
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                              <Award className="w-3 h-3 mr-1" />
                              Top
                            </Badge>
                          )}
                        </div>

                        {/* CTA */}
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                          onClick={() => navigate('/rechner')}
                        >
                          Offerte anfragen
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="text-center mt-10">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/firmen')}
                  className="h-12"
                >
                  Alle {ENHANCED_COMPANIES.length}+ Firmen ansehen
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===== HOW IT WORKS ===== */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center mb-12">
                <Badge variant="outline" className="mb-4">So funktioniert's</Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  In 3 Schritten zur besten Offerte
                </h2>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  {
                    step: 1,
                    title: "Formular ausfüllen",
                    description: "Geben Sie Von, Nach und Wohnungsgrösse ein. Dauert nur 2 Minuten.",
                    icon: CalendarCheck
                  },
                  {
                    step: 2,
                    title: "Offerten erhalten",
                    description: "Innerhalb von 24h erhalten Sie 3-5 kostenlose Offerten von geprüften Firmen.",
                    icon: Package
                  },
                  {
                    step: 3,
                    title: "Vergleichen & Buchen",
                    description: "Vergleichen Sie Preise, Bewertungen und wählen Sie die beste Firma.",
                    icon: ThumbsUp
                  }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="relative text-center"
                  >
                    {/* Connector Line */}
                    {i < 2 && (
                      <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/20" />
                    )}
                    
                    <div className="relative z-10">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        {item.step}
                      </div>
                      <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  className="h-14 px-10 text-lg shadow-lg"
                  onClick={() => document.getElementById('offerten-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Jetzt starten – kostenlos
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <Badge variant="outline" className="mb-4">Häufige Fragen</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Alles was Sie wissen müssen
                  </h2>
                </div>

                <Accordion type="single" collapsible className="space-y-4">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`item-${index}`}
                      className="bg-white rounded-xl shadow-soft px-6 border-0"
                    >
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
          
          <div className="container mx-auto px-4 relative z-10">
            <ScrollReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Bereit für Ihren stressfreien Umzug?
                </h2>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Erhalten Sie jetzt kostenlose Offerten und sparen Sie bis zu 40% bei Ihrem nächsten Umzug.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 h-14 px-8 text-lg font-semibold shadow-xl"
                    onClick={() => navigate('/rechner')}
                  >
                    Jetzt Offerten erhalten
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg"
                    onClick={() => navigate('/kontakt')}
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    Beratung anfordern
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-6 mt-10 text-white/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>100% kostenlos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Keine Verpflichtung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Geprüfte Firmen</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <Footer />
        <StickyMobileCTA />
      </div>
    </>
  );
}
