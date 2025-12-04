import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  CheckCircle2, Shield, Clock, TrendingDown, ArrowRight, Star, MapPin,
  Users, Zap, Award, ChevronRight, ChevronLeft, Check,
  BadgeCheck, Building2, Home, Truck, Timer, 
  ThumbsUp, Quote, MessageCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ENHANCED_COMPANIES } from "@/data/enhanced-companies";

import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { generatePageSchemas } from "@/lib/schema-markup";
import { motion, AnimatePresence } from "framer-motion";
import { swissPostalCodes } from "@/lib/swiss-postal-codes";
import { LiveActivityBadge } from "@/components/home/LiveActivityBadge";
import heroFamilyMoving from "@/assets/hero-family-moving.jpg";

// Filter postal codes
const filterPostalCodes = (query: string) => {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.toLowerCase();
  return swissPostalCodes
    .filter(entry => 
      entry.code.includes(query) || 
      entry.city.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 100);
};

// Testimonials data
const testimonials = [
  {
    name: "Sarah M.",
    location: "Zürich → Basel",
    rating: 5,
    text: "Innerhalb von 24h hatte ich 4 Offerten. Die Ersparnis von CHF 650 war enorm!",
    saved: "CHF 650",
    avatar: "SM"
  },
  {
    name: "Marco B.",
    location: "Bern → Luzern", 
    rating: 5,
    text: "Super einfach! 3 Minuten Formular, 5 Offerten erhalten, beste Firma gewählt.",
    saved: "CHF 420",
    avatar: "MB"
  },
  {
    name: "Lisa K.",
    location: "Winterthur → Zürich",
    rating: 5,
    text: "Die Vergleichsmöglichkeit war Gold wert. Konnte Preise direkt vergleichen.",
    saved: "CHF 380",
    avatar: "LK"
  }
];

// FAQ data
const faqs = [
  {
    question: "Ist der Vergleich wirklich kostenlos?",
    answer: "Ja, 100% kostenlos und unverbindlich. Umzugscheck.ch wird von den Umzugsfirmen finanziert, nicht von Ihnen."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "Die meisten Nutzer erhalten innerhalb von 24 Stunden 3-5 konkrete Offerten per E-Mail."
  },
  {
    question: "Wie viel kann ich wirklich sparen?",
    answer: "Unsere Daten zeigen durchschnittliche Einsparungen von 25-40%. Bei grösseren Umzügen oft CHF 500-1000+."
  },
  {
    question: "Sind alle Firmen geprüft?",
    answer: "Ja. Jede Partnerfirma durchläuft unsere Qualitätsprüfung: Versicherungsnachweis, Handelsregister-Eintrag und Bewertungen."
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, absolut keine Verpflichtung. Sie vergleichen in Ruhe und entscheiden selbst."
  }
];

// Regions
const regions = [
  { name: "Zürich", slug: "zuerich", count: 42 },
  { name: "Bern", slug: "bern", count: 28 },
  { name: "Basel", slug: "basel", count: 24 },
  { name: "Luzern", slug: "luzern", count: 18 },
  { name: "Aargau", slug: "aargau", count: 22 },
  { name: "St. Gallen", slug: "st-gallen", count: 16 },
  { name: "Zug", slug: "zug", count: 12 },
  { name: "Schwyz", slug: "schwyz", count: 8 },
  { name: "Thurgau", slug: "thurgau", count: 10 },
  { name: "Solothurn", slug: "solothurn", count: 11 },
  { name: "Graubünden", slug: "graubuenden", count: 9 },
  { name: "Wallis", slug: "wallis", count: 14 }
];

// Top companies
const topCompanies = ENHANCED_COMPANIES
  .filter(c => c.is_featured && c.rating && c.rating >= 4.5)
  .sort((a, b) => (b.rating || 0) - (a.rating || 0))
  .slice(0, 3);

export default function Umzugsofferten() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Form state
  const [fromPostal, setFromPostal] = useState(searchParams.get("from") || "");
  const [toPostal, setToPostal] = useState(searchParams.get("to") || "");
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "");
  
  // Testimonial slider
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Memoize filtered results
  const fromOptions = useMemo(() => filterPostalCodes(fromPostal), [fromPostal]);
  const toOptions = useMemo(() => filterPostalCodes(toPostal), [toPostal]);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromPostal) params.set("from", fromPostal);
    if (toPostal) params.set("to", toPostal);
    if (rooms) params.set("rooms", rooms);
    navigate(`/rechner?${params.toString()}`);
  };

  const nextTestimonial = () => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const currentUrl = "https://www.umzugscheck.ch/umzugsofferten";
  const schemas = generatePageSchemas({ type: "offerten", url: currentUrl }, faqs);

  return (
    <>
      <Helmet>
        <title>Umzugsofferten vergleichen & bis zu 40% sparen | umzugscheck.ch</title>
        <meta name="description" content="Gratis Offerten von geprüften Schweizer Umzugsfirmen – schnell, transparent und unverbindlich. Vergleichen und sparen Sie bis zu 40%." />
        <link rel="canonical" href={currentUrl} />
        <script type="application/ld+json">{JSON.stringify(schemas)}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background">
        
        {/* ===== HERO SECTION - Matching Homepage Style ===== */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroFamilyMoving})` }}
          />
          
          {/* Gradient Overlays - Same as Homepage */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/60" />
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
              backgroundSize: "32px 32px"
            }} />
          </div>
          
          {/* Content Container */}
          <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              
              {/* Left Column - Text & CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Floating Badge - Same as Homepage */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: [0, -8, 0]
                  }}
                  transition={{ 
                    opacity: { delay: 0.2, duration: 0.5 },
                    scale: { delay: 0.2, duration: 0.5 },
                    y: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-flex items-center gap-3 px-5 py-3 bg-white rounded-2xl shadow-medium border border-border"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                    <Check className="h-6 w-6 text-white stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Offerten vergleichen</p>
                    <p className="text-sm font-bold text-foreground">Bis zu 40% sparen</p>
                  </div>
                </motion.div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  <span className="text-foreground">Umzugsofferten vergleichen.</span>
                  <span className="block text-primary mt-2">Kostenlos & unverbindlich.</span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Wir <span className="inline-flex items-center gap-1 text-secondary font-semibold"><CheckCircle2 className="h-5 w-5" />checken</span> für Sie: 
                  Gratis Offerten von geprüften Schweizer Umzugsfirmen – schnell, transparent und unverbindlich.
                </p>
                
                {/* Trust Metrics Row */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 fill-swiss-gold text-swiss-gold" />
                    <span className="font-bold text-foreground">4.8/5</span>
                    <span className="text-foreground/60">Bewertung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    <span className="font-bold text-foreground">15'000+</span>
                    <span className="text-foreground/60">Umzüge gecheckt</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    <span className="text-foreground/60">100% kostenlos</span>
                  </div>
                </div>
                
                {/* Live Activity Badge */}
                <div className="pt-2">
                  <LiveActivityBadge />
                </div>
                
                {/* Desktop CTAs */}
                <div className="hidden lg:flex items-center gap-4 pt-2">
                  <Button 
                    size="lg" 
                    className="h-12 lg:h-14 px-5 lg:px-8 text-base lg:text-lg font-semibold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all"
                    onClick={() => document.getElementById("offerten-form")?.scrollIntoView({ behavior: "smooth" })}
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Jetzt Offerten erhalten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Link to="/umzugsrechner">
                    <Button size="lg" variant="secondary" className="h-12 lg:h-14 px-5 lg:px-8 text-base lg:text-lg font-semibold">
                      Kosten berechnen
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Right Column - Form Card - Floating */}
              <motion.div
                id="offerten-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ 
                  opacity: 1, 
                  y: [0, -10, 0]
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 0.2 },
                  y: { delay: 0.8, duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="bg-card rounded-2xl shadow-xl border border-border p-6 sm:p-8">
                  <div className="space-y-5">
                    {/* Form Header */}
                    <div className="text-center space-y-2">
                      <div className="inline-flex items-center gap-2 text-sm text-primary font-semibold">
                        <Clock className="h-4 w-4" />
                        In 2 Minuten zum Vergleich
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                        Kostenlos Offerten erhalten
                      </h2>
                    </div>
                    
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="from" className="text-foreground font-medium text-sm">Von (PLZ oder Ort)</Label>
                        <Input
                          id="from"
                          list="from-options"
                          placeholder="z.B. 8001 oder Zürich"
                          value={fromPostal}
                          onChange={(e) => setFromPostal(e.target.value)}
                          className="h-12 text-base bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          autoComplete="off"
                          required
                        />
                        <datalist id="from-options">
                          {fromOptions.map((option) => (
                            <option key={`from-${option.code}`} value={`${option.code} - ${option.city} (${option.canton})`} />
                          ))}
                        </datalist>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="to" className="text-foreground font-medium text-sm">Nach (PLZ oder Ort)</Label>
                        <Input
                          id="to"
                          list="to-options"
                          placeholder="z.B. 3011 oder Bern"
                          value={toPostal}
                          onChange={(e) => setToPostal(e.target.value)}
                          className="h-12 text-base bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          autoComplete="off"
                          required
                        />
                        <datalist id="to-options">
                          {toOptions.map((option) => (
                            <option key={`to-${option.code}`} value={`${option.code} - ${option.city} (${option.canton})`} />
                          ))}
                        </datalist>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="rooms" className="text-foreground font-medium text-sm">Wohnungsgrösse</Label>
                        <Select value={rooms} onValueChange={setRooms}>
                          <SelectTrigger className="h-12 text-base bg-background border-border/60">
                            <SelectValue placeholder="Wählen Sie..." />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            <SelectItem value="1">1 - 1.5 Zimmer</SelectItem>
                            <SelectItem value="2">2 - 2.5 Zimmer</SelectItem>
                            <SelectItem value="3">3 - 3.5 Zimmer</SelectItem>
                            <SelectItem value="4">4 - 4.5 Zimmer</SelectItem>
                            <SelectItem value="5">5+ Zimmer / Haus</SelectItem>
                            <SelectItem value="office">Büro / Firma</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all animate-pulse-subtle group"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="hidden sm:inline">Jetzt Offerten erhalten</span>
                        <span className="sm:hidden">Offerten erhalten</span>
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                    
                    {/* Trust Microcopy */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-sm text-foreground/60">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Kostenlos
                      </span>
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        Unverbindlich
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Shield className="h-4 w-4 text-secondary" />
                        Datenschutz
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Mobile CTAs */}
                <div className="flex flex-col gap-3 mt-6 lg:hidden">
                  <Link to="/umzugsrechner" className="w-full">
                    <Button size="lg" variant="outline" className="w-full h-11 text-sm font-semibold border-2 hover:bg-primary/5">
                      Kosten berechnen
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ===== TRUST BAR ===== */}
        <section className="border-y border-border bg-muted/30 py-6">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-5 h-5 text-primary" />
                <span className="font-medium">Geprüfte Firmen</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span className="font-medium">100% kostenlos</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-primary" />
                <span className="font-medium">Bis zu 40% sparen</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-500" />
                <span className="font-medium">Offerten in 24h</span>
              </div>
            </div>
          </div>
        </section>

        {/* ===== TESTIMONIALS SLIDER ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Das sagen unsere Kunden</h2>
                <div className="flex items-center justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-muted-foreground">4.8/5 Bewertung</span>
                </div>
              </div>

              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                            {testimonials[currentTestimonial].avatar}
                          </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <Quote className="w-8 h-8 text-primary/20 mb-2 mx-auto md:mx-0" />
                          <p className="text-lg text-foreground mb-4">
                            "{testimonials[currentTestimonial].text}"
                          </p>
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <div>
                              <p className="font-semibold">{testimonials[currentTestimonial].name}</p>
                              <p className="text-sm text-muted-foreground">{testimonials[currentTestimonial].location}</p>
                            </div>
                            <Badge variant="secondary" className="w-fit mx-auto md:mx-0">
                              Gespart: {testimonials[currentTestimonial].saved}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button variant="outline" size="icon" onClick={prevTestimonial}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex gap-2">
                    {testimonials.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentTestimonial(i)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          i === currentTestimonial ? "bg-primary w-6" : "bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                  <Button variant="outline" size="icon" onClick={nextTestimonial}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== BENEFITS SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Warum Offerten vergleichen?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Sparen Sie Zeit und Geld mit unserem kostenlosen Vergleichsservice
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: TrendingDown, title: "Preisvorteil", desc: "Sparen Sie durchschnittlich 25-40% durch Vergleichen mehrerer Angebote" },
                { icon: Timer, title: "Schnelle Terminfindung", desc: "Erhalten Sie innerhalb von 24h konkrete Offerten mit Terminen" },
                { icon: BadgeCheck, title: "Seriöse Anbieter", desc: "Alle Firmen sind geprüft, versichert und haben positive Bewertungen" },
                { icon: ThumbsUp, title: "Bessere Qualität", desc: "Vergleichen Sie nicht nur Preise, sondern auch Leistungen und Bewertungen" }
              ].map((item, i) => (
                <Card key={i} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ===== PROCESS SECTION ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">So einfach geht's</h2>
              <p className="text-muted-foreground">In 3 Schritten zu Ihren Umzugsofferten</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: 1, title: "Formular ausfüllen", desc: "Geben Sie Start, Ziel und Wohnungsgrösse ein – dauert nur 2 Minuten", icon: Home },
                { step: 2, title: "Offerten erhalten", desc: "Erhalten Sie innerhalb von 24h bis zu 5 unverbindliche Offerten per E-Mail", icon: Truck },
                { step: 3, title: "Beste Firma wählen", desc: "Vergleichen Sie Preise, Bewertungen und wählen Sie Ihren Favoriten", icon: Award }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-primary/10" />
                  )}
                  <div className="text-center">
                    <div className="relative inline-flex">
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <item.icon className="w-10 h-10 text-primary" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {item.step}
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== TOP PARTNERS SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Top-bewertete Umzugsfirmen</h2>
              <p className="text-muted-foreground">Unsere bestbewerteten Partner</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {topCompanies.map((company, i) => (
                <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{company.name}</h3>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{company.rating}</span>
                          <span className="text-muted-foreground text-sm">({company.review_count} Bewertungen)</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      Professionelle Umzugsfirma mit langjähriger Erfahrung in der Schweiz.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to={`/umzugsfirmen/${company.slug}`}>
                          Firma ansehen
                        </Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link to={`/rechner?company=${company.id}`}>
                          Offerte anfordern
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" size="lg" asChild>
                <Link to="/umzugsfirmen">
                  Alle Firmen anzeigen
                  <ChevronRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ===== REGIONAL SECTION ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Umzugsfirmen in Ihrer Region</h2>
              <p className="text-muted-foreground">Finden Sie lokale Umzugsexperten</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
              {regions.map((region, i) => (
                <Link
                  key={i}
                  to={`/${region.slug}`}
                  className="group p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all text-center"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 group-hover:bg-primary/20 transition-colors">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <p className="font-medium text-sm">{region.name}</p>
                  <p className="text-xs text-muted-foreground">{region.count} Firmen</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== FAQ SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Häufige Fragen</h2>
                <p className="text-muted-foreground">Alles was Sie wissen müssen</p>
              </div>

              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-card border rounded-xl px-6">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ===== PRICE EXAMPLES SECTION ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Was kostet ein Umzug in der Schweiz?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Durchschnittliche Umzugskosten je nach Wohnungsgrösse – basierend auf über 15'000 Umzügen
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { size: "2.5 Zimmer", subtitle: "Studio/kleine Wohnung", min: 650, max: 1200, savings: "bis CHF 350" },
                { size: "3.5 Zimmer", subtitle: "Familienwohnung", min: 1100, max: 2000, savings: "bis CHF 580", popular: true },
                { size: "4.5+ Zimmer", subtitle: "Haus/grosse Wohnung", min: 1800, max: 3500, savings: "bis CHF 950" }
              ].map((item, i) => (
                <Card key={i} className={`p-6 relative ${item.popular ? "border-primary shadow-lg" : ""}`}>
                  {item.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Beliebt</Badge>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1">{item.size}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{item.subtitle}</p>
                    <div className="text-3xl font-bold text-primary mb-2">
                      CHF {item.min.toLocaleString()} - {item.max.toLocaleString()}
                    </div>
                    <p className="text-sm text-green-600 font-medium">Ersparnis {item.savings}</p>
                  </div>
                </Card>
              ))}
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              * Preise variieren je nach Distanz, Stockwerk und Zusatzleistungen
            </p>
          </div>
        </section>

        {/* ===== STATISTICS SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { value: "15'247", label: "Umzüge verglichen", icon: Truck },
                { value: "4.8/5", label: "Durchschnittsbewertung", icon: Star },
                { value: "127+", label: "Geprüfte Umzugsfirmen", icon: BadgeCheck },
                { value: "38%", label: "Durchschnittliche Ersparnis", icon: TrendingDown }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== SEO CONTENT SECTION ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose prose-slate">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Umzugsofferten vergleichen: So finden Sie die beste Umzugsfirma
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Warum lohnt sich ein Umzugsvergleich?</h3>
                  <p className="text-muted-foreground mb-4">
                    Ein Umzug in der Schweiz kann schnell teuer werden. Die Preise variieren stark zwischen 
                    verschiedenen Umzugsfirmen – oft um 30-40%. Durch einen kostenlosen Vergleich mehrerer 
                    Offerten sparen Sie nicht nur Geld, sondern finden auch die Firma, die am besten zu 
                    Ihren Bedürfnissen passt.
                  </p>
                  <p className="text-muted-foreground">
                    Bei umzugscheck.ch vergleichen Sie Angebote von geprüften Schweizer Umzugsfirmen. 
                    Alle Partner sind versichert, im Handelsregister eingetragen und haben positive 
                    Kundenbewertungen.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">So funktioniert der Offerten-Vergleich</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Füllen Sie das kurze Formular mit Start, Ziel und Wohnungsgrösse aus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Erhalten Sie innerhalb von 24 Stunden bis zu 5 unverbindliche Offerten</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Vergleichen Sie Preise, Leistungen und Kundenbewertungen</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>Wählen Sie die beste Firma für Ihren Umzug – ohne Verpflichtung</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== INTERNAL LINKS SECTION ===== */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Weitere Umzugs-Services</h2>
              <p className="text-muted-foreground">Entdecken Sie alle Möglichkeiten rund um Ihren Umzug</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
              {[
                { title: "Umzugsrechner", desc: "Kosten sofort berechnen", link: "/rechner", icon: Users },
                { title: "Reinigung", desc: "Endreinigung & Abgabe", link: "/reinigung", icon: Home },
                { title: "Entsorgung", desc: "Möbel & Sperrgut entsorgen", link: "/entsorgung", icon: Truck },
                { title: "Firmenumzug", desc: "Büro & Geschäft umziehen", link: "/firmenumzug", icon: Building2 }
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.link}
                  className="group flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/50 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold group-hover:text-primary transition-colors">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ===== UMZUG TIPPS SECTION ===== */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
                5 Tipps für einen günstigen Umzug
              </h2>
              
              <div className="space-y-4">
                {[
                  { num: 1, title: "Offerten vergleichen", text: "Holen Sie mindestens 3-5 Offerten ein und vergleichen Sie nicht nur Preise, sondern auch Leistungen und Bewertungen." },
                  { num: 2, title: "Flexible Termine wählen", text: "Umzüge unter der Woche oder Mitte des Monats sind oft günstiger als an Wochenenden oder zum Monatsersten." },
                  { num: 3, title: "Selbst vorarbeiten", text: "Packen Sie selbst, entsorgen Sie Unnötiges vorab und bauen Sie Möbel ab – das spart Arbeitsstunden." },
                  { num: 4, title: "Früh planen", text: "Buchen Sie 4-6 Wochen im Voraus für bessere Preise und mehr Auswahl bei den Terminen." },
                  { num: 5, title: "Versicherung prüfen", text: "Achten Sie auf ausreichenden Versicherungsschutz und klären Sie Haftungsfragen vor dem Umzug." }
                ].map((tip, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl bg-muted/30">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0">
                      {tip.num}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground">{tip.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" asChild>
                  <Link to="/ratgeber">
                    Mehr Umzugstipps im Ratgeber
                    <ChevronRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA SECTION ===== */}
        <section className="py-16 md:py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                Jetzt kostenlose Umzugsofferten vergleichen
              </h2>
              <p className="text-lg text-primary-foreground/80 mb-8">
                Sparen Sie Zeit und Geld mit unserem kostenlosen Vergleichsservice. 
                Unverbindlich und ohne versteckte Kosten.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="h-14 px-8 text-lg"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Offerten erhalten
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 text-lg border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                  asChild
                >
                  <Link to="/rechner">
                    Zum Preisrechner
                  </Link>
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/60 mt-6">
                Bereits über 15'000 erfolgreiche Umzüge verglichen
              </p>
            </div>
          </div>
        </section>

        {/* Live Chat Button */}
        <div className="fixed bottom-20 md:bottom-6 right-4 z-40">
          <Button 
            size="lg" 
            className="rounded-full w-14 h-14 shadow-xl"
            asChild
          >
            <Link to="/kontakt">
              <MessageCircle className="w-6 h-6" />
            </Link>
          </Button>
        </div>

        
        <StickyMobileCTA />
      </div>
    </>
  );
}
