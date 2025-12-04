import { useState, useMemo, useEffect } from "react";
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
  Users, Zap, Award, ChevronRight, Check, Truck, Sparkles, Package,
  BadgeCheck, Building2, Home, Timer, ThumbsUp, Quote, Phone, Globe,
  FileText, Calculator, Trash2, Warehouse, HelpCircle
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ENHANCED_COMPANIES } from "@/data/enhanced-companies";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";
import { generatePageSchemas } from "@/lib/schema-markup";
import { motion } from "framer-motion";
import { swissPostalCodes } from "@/lib/swiss-postal-codes";
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
    id: "1",
    name: "Sandra K.",
    location: "Zürich → Basel",
    type: "Privatumzug 3.5-Zimmer",
    rating: 5,
    text: "Der Vergleich war unglaublich einfach. Innerhalb eines Tages hatte ich drei faire Offerten und konnte CHF 650 sparen!",
    saved: "CHF 650",
    verified: true
  },
  {
    id: "2",
    name: "Marco B.",
    location: "Bern → Luzern",
    type: "Privatumzug 4.5-Zimmer",
    rating: 5,
    text: "Super einfach! 3 Minuten Formular ausgefüllt, 5 Offerten erhalten. Die beste Firma war 40% günstiger als erwartet.",
    saved: "CHF 420",
    verified: true
  },
  {
    id: "3",
    name: "Lisa W.",
    location: "Winterthur → Zürich",
    type: "Privatumzug 2.5-Zimmer",
    rating: 5,
    text: "Die Vergleichsmöglichkeit war Gold wert. Konnte Preise direkt vergleichen und die beste Qualität wählen.",
    saved: "CHF 380",
    verified: true
  },
  {
    id: "4",
    name: "Thomas M.",
    location: "Basel",
    type: "Firmenumzug 15 Arbeitsplätze",
    rating: 5,
    text: "Als KMU-Inhaber war mir Zuverlässigkeit wichtig. Die vorgeschlagenen Firmen waren alle top – professionell und fair.",
    saved: "CHF 1'200",
    verified: true
  }
];

// FAQ data
const faqs = [
  {
    question: "Ist der Vergleich wirklich kostenlos?",
    answer: "Ja, 100% kostenlos und unverbindlich. Umzugscheck.ch wird von den Umzugsfirmen finanziert, nicht von Ihnen. Sie erhalten mehrere Offerten ohne jegliche Kosten."
  },
  {
    question: "Wie schnell erhalte ich Offerten?",
    answer: "Die meisten Nutzer erhalten innerhalb von 24 Stunden 3-5 konkrete Offerten per E-Mail. Bei dringenden Anfragen kann es auch schneller gehen."
  },
  {
    question: "Wie viel kann ich wirklich sparen?",
    answer: "Unsere Daten zeigen durchschnittliche Einsparungen von 25-40%. Bei grösseren Umzügen sparen Kunden oft CHF 500-1'500 im Vergleich zum erstbesten Angebot."
  },
  {
    question: "Sind alle Firmen geprüft?",
    answer: "Ja. Jede Partnerfirma durchläuft unsere strenge Qualitätsprüfung: Versicherungsnachweis, Handelsregister-Eintrag, Referenzen und laufende Kundenbewertungen."
  },
  {
    question: "Muss ich eine Offerte annehmen?",
    answer: "Nein, absolut keine Verpflichtung. Sie vergleichen in Ruhe alle Angebote und entscheiden selbst, ob und welche Firma Sie beauftragen möchten."
  }
];

// Regions
const regions = [
  { name: "Zürich", slug: "zuerich", count: 42, icon: "🏙️" },
  { name: "Bern", slug: "bern", count: 28, icon: "🏛️" },
  { name: "Basel", slug: "basel", count: 24, icon: "🌉" },
  { name: "Luzern", slug: "luzern", count: 18, icon: "⛰️" },
  { name: "Aargau", slug: "aargau", count: 22, icon: "🏘️" },
  { name: "St. Gallen", slug: "st-gallen", count: 16, icon: "📍" },
  { name: "Zug", slug: "zug", count: 12, icon: "💼" },
  { name: "Schwyz", slug: "schwyz", count: 8, icon: "🏔️" },
  { name: "Thurgau", slug: "thurgau", count: 10, icon: "🌳" },
  { name: "Solothurn", slug: "solothurn", count: 9, icon: "🏰" },
  { name: "Graubünden", slug: "graubuenden", count: 7, icon: "🎿" },
  { name: "Wallis", slug: "wallis", count: 11, icon: "🏔️" }
];

// Benefits
const benefits = [
  {
    icon: TrendingDown,
    title: "Preisvorteil",
    description: "Sparen Sie bis zu 40% durch direkten Preisvergleich mehrerer Anbieter.",
    color: "text-emerald-500",
    bgColor: "bg-emerald-50"
  },
  {
    icon: Clock,
    title: "Schnelle Terminfindung",
    description: "Verfügbarkeit und Termine direkt vergleichen – auch kurzfristig.",
    color: "text-primary",
    bgColor: "bg-primary/10"
  },
  {
    icon: Shield,
    title: "Seriöse Anbieter",
    description: "Nur geprüfte, versicherte Schweizer Umzugsfirmen mit Top-Bewertungen.",
    color: "text-secondary",
    bgColor: "bg-secondary/10"
  },
  {
    icon: Award,
    title: "Bessere Qualität",
    description: "Transparente Bewertungen helfen Ihnen, die beste Firma zu wählen.",
    color: "text-swiss-gold",
    bgColor: "bg-amber-50"
  }
];

// Price examples
const priceExamples = [
  {
    size: "2.5-Zimmer",
    priceRange: "CHF 650 – 950",
    details: "Ideal für Singles & Paare",
    popular: false
  },
  {
    size: "3.5-Zimmer",
    priceRange: "CHF 950 – 1'400",
    details: "Am häufigsten gewählt",
    popular: true
  },
  {
    size: "4.5+ Zimmer",
    priceRange: "CHF 1'400 – 2'200",
    details: "Für Familien & grössere Haushalte",
    popular: false
  }
];

// Services
const services = [
  { icon: Calculator, title: "Umzugsrechner", description: "Kosten sofort berechnen", href: "/umzugsrechner" },
  { icon: Sparkles, title: "Reinigung", description: "Endreinigung & Abgabe", href: "/reinigung" },
  { icon: Trash2, title: "Entsorgung", description: "Räumung & Entsorgung", href: "/entsorgung-raeumung" },
  { icon: Building2, title: "Firmenumzug", description: "Büro- & Geschäftsumzüge", href: "/firmenumzug" }
];

// Tips
const tips = [
  "Holen Sie mindestens 3 Offerten ein und vergleichen Sie nicht nur den Preis",
  "Planen Sie Ihren Umzug unter der Woche – Wochenenden sind oft teurer",
  "Entrümpeln Sie vor dem Umzug – weniger Volumen = tiefere Kosten",
  "Buchen Sie frühzeitig – besonders in der Hauptsaison (April-September)",
  "Fragen Sie nach Pauschalpreisen statt Stundentarifen für mehr Kostensicherheit"
];

export default function Umzugsofferten() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [fromPostal, setFromPostal] = useState(searchParams.get("from") || "");
  const [toPostal, setToPostal] = useState(searchParams.get("to") || "");
  const [rooms, setRooms] = useState(searchParams.get("rooms") || "");

  const fromOptions = useMemo(() => filterPostalCodes(fromPostal), [fromPostal]);
  const toOptions = useMemo(() => filterPostalCodes(toPostal), [toPostal]);

  const topCompanies = ENHANCED_COMPANIES.filter(c => c.rating >= 4.5).slice(0, 4);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fromPostal) params.set("from", fromPostal);
    if (toPostal) params.set("to", toPostal);
    if (rooms) params.set("rooms", rooms);
    navigate(`/rechner?${params.toString()}`);
  };

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Umzugsofferten vergleichen",
    "description": "Vergleichen Sie kostenlos Umzugsofferten von über 200 geprüften Schweizer Firmen.",
    "url": "https://umzugscheck.ch/umzugsofferten"
  };

  return (
    <>
      <Helmet>
        <title>Umzugsofferten vergleichen | Kostenlos & unverbindlich | Umzugscheck.ch</title>
        <meta name="description" content="Vergleichen Sie kostenlos Umzugsofferten von über 200 geprüften Schweizer Firmen. Bis zu 40% sparen. Unverbindlich in 2 Minuten." />
        <meta name="keywords" content="Umzugsofferten, Umzug Schweiz, Umzugsfirma vergleichen, Umzugskosten, günstig umziehen" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsofferten" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${heroFamilyMoving})` }}
          />
          
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/70" />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.15) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              
              {/* Left: Content */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Floating Badge */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                  transition={{ 
                    opacity: { delay: 0.2 },
                    y: { delay: 0.7, duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="inline-flex items-center gap-3 px-4 py-2.5 bg-white rounded-2xl shadow-medium border border-border"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary">
                    <Check className="h-5 w-5 text-white stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Wir checken für Sie</p>
                    <p className="text-sm font-bold text-foreground">200+ geprüfte Schweizer Firmen</p>
                  </div>
                </motion.div>
                
                {/* Main Headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  <span className="text-foreground">Umzugsofferten vergleichen.</span>
                  <span className="block text-secondary mt-2">Kostenlos & unverbindlich.</span>
                </h1>
                
                {/* Subheadline */}
                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                  Vergleichen Sie jetzt <span className="font-semibold text-foreground">über 200 geprüfte Schweizer Umzugsfirmen</span> und sparen Sie bis zu 40% – komplett kostenlos und ohne Verpflichtung.
                </p>
                
                {/* Trust Badges */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Geprüfte Firmen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                      <TrendingDown className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Bis 40% sparen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary/10">
                      <Shield className="h-4 w-4 text-secondary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">100% kostenlos</span>
                  </div>
                </div>

                {/* Desktop CTAs */}
                <div className="hidden lg:flex items-center gap-4 pt-4">
                  <Button 
                    size="lg" 
                    onClick={() => document.getElementById('hero-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="h-14 px-8 text-lg font-semibold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all"
                  >
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Jetzt Offerten erhalten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Link to="/umzugsrechner">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2">
                      <Calculator className="mr-2 h-5 w-5" />
                      Kosten berechnen
                    </Button>
                  </Link>
                </div>
              </motion.div>
              
              {/* Right: Form Card */}
              <motion.div 
                id="hero-form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm shadow-premium border-border/50 rounded-3xl overflow-hidden">
                  <div className="bg-gradient-to-r from-primary to-primary/90 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Kostenlose Offerten in 2 Minuten
                    </h2>
                    <p className="text-sm text-white/80">Unverbindlich vergleichen & sparen</p>
                  </div>
                  
                  <CardContent className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* From */}
                      <div className="space-y-2">
                        <Label htmlFor="from" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          Start-PLZ / Ort
                        </Label>
                        <Input
                          id="from"
                          placeholder="z.B. 8001 Zürich"
                          value={fromPostal}
                          onChange={(e) => setFromPostal(e.target.value)}
                          list="from-options"
                          className="h-12 text-base rounded-xl border-2 focus:border-primary"
                        />
                        <datalist id="from-options">
                          {fromOptions.map(opt => (
                            <option key={opt.code} value={`${opt.code} - ${opt.city} (${opt.canton})`} />
                          ))}
                        </datalist>
                      </div>
                      
                      {/* To */}
                      <div className="space-y-2">
                        <Label htmlFor="to" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-secondary" />
                          Ziel-PLZ / Ort
                        </Label>
                        <Input
                          id="to"
                          placeholder="z.B. 3011 Bern"
                          value={toPostal}
                          onChange={(e) => setToPostal(e.target.value)}
                          list="to-options"
                          className="h-12 text-base rounded-xl border-2 focus:border-primary"
                        />
                        <datalist id="to-options">
                          {toOptions.map(opt => (
                            <option key={opt.code} value={`${opt.code} - ${opt.city} (${opt.canton})`} />
                          ))}
                        </datalist>
                      </div>
                      
                      {/* Rooms */}
                      <div className="space-y-2">
                        <Label htmlFor="rooms" className="text-sm font-medium flex items-center gap-2">
                          <Home className="h-4 w-4 text-primary" />
                          Wohnungsgrösse
                        </Label>
                        <Select value={rooms} onValueChange={setRooms}>
                          <SelectTrigger className="h-12 text-base rounded-xl border-2">
                            <SelectValue placeholder="Anzahl Zimmer wählen" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1-Zimmer Studio</SelectItem>
                            <SelectItem value="2">2-Zimmer Wohnung</SelectItem>
                            <SelectItem value="2.5">2.5-Zimmer Wohnung</SelectItem>
                            <SelectItem value="3">3-Zimmer Wohnung</SelectItem>
                            <SelectItem value="3.5">3.5-Zimmer Wohnung</SelectItem>
                            <SelectItem value="4">4-Zimmer Wohnung</SelectItem>
                            <SelectItem value="4.5">4.5-Zimmer Wohnung</SelectItem>
                            <SelectItem value="5">5+ Zimmer / Haus</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Submit */}
                      <Button type="submit" size="lg" className="w-full h-14 text-lg font-bold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all rounded-xl">
                        Jetzt Offerten erhalten
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                      
                      {/* Trust line */}
                      <p className="text-xs text-center text-muted-foreground pt-2">
                        <Shield className="inline h-3 w-3 mr-1" />
                        100% kostenlos • Keine Verpflichtung • SSL-verschlüsselt
                      </p>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== STATS BAR ==================== */}
        <section className="py-6 bg-muted/50 border-y border-border">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
              {[
                { icon: Star, value: "4.8/5", label: "Bewertung", color: "text-swiss-gold" },
                { icon: Users, value: "15'000+", label: "Umzüge", color: "text-primary" },
                { icon: Shield, value: "200+", label: "Geprüfte Partner", color: "text-secondary" },
                { icon: CheckCircle2, value: "100%", label: "Kostenlos", color: "text-emerald-500" }
              ].map((stat, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <stat.icon className={`h-6 w-6 ${stat.color} ${stat.icon === Star ? 'fill-swiss-gold' : ''}`} />
                  <div>
                    <span className="font-bold text-foreground">{stat.value}</span>
                    <span className="text-muted-foreground ml-1.5 text-sm">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== BENEFITS SECTION ==================== */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Warum mit Umzugscheck.ch vergleichen?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Profitieren Sie von unserer unabhängigen Plattform – für einen stressfreien Umzug zum besten Preis.
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full p-6 hover:shadow-premium transition-shadow duration-300 border-border/50 rounded-2xl group">
                    <div className={`w-14 h-14 rounded-2xl ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <benefit.icon className={`h-7 w-7 ${benefit.color}`} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS SECTION ==================== */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Das sagen unsere Kunden
              </h2>
              <p className="text-muted-foreground text-lg">
                Echte Bewertungen von echten Umzügen in der Schweiz.
              </p>
            </motion.div>
            
            {/* Mobile Carousel */}
            <div className="md:hidden">
              <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent className="-ml-2">
                  {testimonials.map((t, idx) => (
                    <CarouselItem key={t.id} className="pl-2 basis-[85%]">
                      <Card className="h-full p-5 rounded-2xl border-border/50 shadow-premium">
                        <Quote className="h-6 w-6 text-primary/20 mb-3" />
                        <div className="flex gap-0.5 mb-3">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-swiss-gold text-swiss-gold" />
                          ))}
                        </div>
                        <p className="text-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                        {t.saved && (
                          <Badge className="bg-emerald-100 text-emerald-700 mb-3">
                            Gespart: {t.saved}
                          </Badge>
                        )}
                        <div className="border-t border-border pt-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground text-sm">{t.name}</span>
                            {t.verified && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                                Verifiziert
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{t.location}</div>
                          <div className="text-xs text-primary mt-0.5">{t.type}</div>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center gap-2 mt-4">
                  <CarouselPrevious className="static translate-y-0 h-8 w-8" />
                  <CarouselNext className="static translate-y-0 h-8 w-8" />
                </div>
              </Carousel>
            </div>
            
            {/* Desktop Grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((t, idx) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full p-5 rounded-2xl border-border/50 shadow-premium hover:shadow-lift transition-shadow">
                    <Quote className="h-6 w-6 text-primary/20 mb-3" />
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-swiss-gold text-swiss-gold" />
                      ))}
                    </div>
                    <p className="text-foreground text-sm leading-relaxed mb-4">"{t.text}"</p>
                    {t.saved && (
                      <Badge className="bg-emerald-100 text-emerald-700 mb-3">
                        Gespart: {t.saved}
                      </Badge>
                    )}
                    <div className="border-t border-border pt-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{t.name}</span>
                        {t.verified && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-700">
                            <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" />
                            Verifiziert
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">{t.location}</div>
                      <div className="text-xs text-primary mt-0.5">{t.type}</div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Average Rating */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 text-center"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-card rounded-full border border-border shadow-sm">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-swiss-gold text-swiss-gold" />
                  ))}
                </div>
                <span className="font-semibold text-foreground">4.8 von 5</span>
                <span className="text-muted-foreground text-sm hidden sm:inline">basierend auf 2'847 Bewertungen</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ==================== PROCESS SECTION ==================== */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                So einfach funktioniert's
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                In drei einfachen Schritten zu Ihrem besten Umzugsangebot.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { step: 1, icon: FileText, title: "Formular ausfüllen", description: "Geben Sie in nur 2 Minuten Ihre Umzugsdetails ein – kostenlos und unverbindlich." },
                { step: 2, icon: Truck, title: "Offerten erhalten", description: "Innerhalb von 24-48 Stunden erhalten Sie mehrere konkrete Angebote von geprüften Firmen." },
                { step: 3, icon: ThumbsUp, title: "Beste Firma wählen", description: "Vergleichen Sie Preise & Bewertungen und wählen Sie die beste Firma für Ihren Umzug." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="relative text-center"
                >
                  {/* Connector Line */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
                  )}
                  
                  {/* Step Number */}
                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-9 w-9 text-primary" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm shadow-cta">
                      {item.step}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto">{item.description}</p>
                </motion.div>
              ))}
            </div>
            
            {/* CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <Link to="/rechner">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all">
                  Jetzt starten – kostenlos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ==================== PRICE EXAMPLES ==================== */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Umzugskosten im Überblick
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Typische Preise für Umzüge innerhalb der Schweiz (lokal, ca. 20-30 km).
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {priceExamples.map((example, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`h-full p-6 rounded-2xl border-2 transition-all hover:shadow-premium ${
                    example.popular 
                      ? 'border-primary bg-primary/5 shadow-premium' 
                      : 'border-border/50 bg-card'
                  }`}>
                    {example.popular && (
                      <Badge className="bg-primary text-white mb-4">
                        <Star className="w-3 h-3 mr-1 fill-white" />
                        Beliebt
                      </Badge>
                    )}
                    <h3 className="text-xl font-bold text-foreground mb-2">{example.size}</h3>
                    <p className="text-3xl font-bold text-primary mb-2">{example.priceRange}</p>
                    <p className="text-sm text-muted-foreground mb-4">{example.details}</p>
                    <div className="flex items-center gap-2 text-sm text-emerald-600">
                      <TrendingDown className="h-4 w-4" />
                      <span>Mögliche Ersparnis: bis CHF 400</span>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <p className="text-center text-sm text-muted-foreground mt-8">
              * Richtpreise. Endpreis abhängig von Distanz, Stockwerk, Lift, Zusatzleistungen etc.
            </p>
          </div>
        </section>

        {/* ==================== TOP COMPANIES ==================== */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Top bewertete Umzugsfirmen
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Unsere bestbewerteten Partner für Ihren nächsten Umzug.
              </p>
            </motion.div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topCompanies.map((company, idx) => (
                <motion.div
                  key={company.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="h-full p-5 rounded-2xl border-border/50 hover:shadow-premium transition-all group">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground text-sm">{company.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-swiss-gold text-swiss-gold" />
                          <span className="text-sm font-medium">{company.rating}</span>
                          <span className="text-xs text-muted-foreground">({company.review_count})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {company.service_areas?.slice(0, 2).map((region, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <MapPin className="h-2.5 w-2.5 mr-1" />
                          {region}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/umzugsfirmen/${company.slug}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full text-xs">
                          Firma ansehen
                        </Button>
                      </Link>
                      <Link to="/rechner" className="flex-1">
                        <Button size="sm" className="w-full text-xs">
                          Offerte
                        </Button>
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center mt-10">
              <Link to="/umzugsfirmen">
                <Button variant="outline" size="lg" className="font-semibold">
                  Alle Firmen anzeigen
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* ==================== REGIONS ==================== */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Umzugsfirmen nach Region
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Finden Sie lokale Umzugspartner in Ihrer Region.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
              {regions.map((region, idx) => (
                <motion.div
                  key={region.slug}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.03 }}
                >
                  <Link to={`/${region.slug}/umzugsfirmen`}>
                    <Card className="p-4 rounded-xl border-border/50 hover:border-primary/30 hover:shadow-medium transition-all text-center group cursor-pointer">
                      <span className="text-2xl mb-2 block">{region.icon}</span>
                      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">{region.name}</h3>
                      <p className="text-xs text-muted-foreground">{region.count} Firmen</p>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SERVICES & TIPS ==================== */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Services */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  Weitere Services
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service, idx) => (
                    <Link key={idx} to={service.href}>
                      <Card className="p-5 rounded-xl border-border/50 hover:border-primary/30 hover:shadow-medium transition-all group h-full">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <service.icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </motion.div>
              
              {/* Tips */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                  5 Tipps für einen günstigen Umzug
                </h2>
                <div className="space-y-4">
                  {tips.map((tip, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">{idx + 1}</span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed pt-1">{tip}</p>
                    </div>
                  ))}
                </div>
                
                <Link to="/ratgeber" className="inline-flex items-center gap-2 mt-6 text-primary font-medium hover:underline">
                  Mehr Tipps im Ratgeber
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ==================== FAQ ==================== */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
                Häufig gestellte Fragen
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Alles, was Sie über unseren Offerten-Vergleich wissen müssen.
              </p>
            </motion.div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <AccordionItem value={`faq-${idx}`} className="bg-card border border-border/50 rounded-xl px-6 overflow-hidden">
                      <AccordionTrigger className="py-5 text-left font-semibold text-foreground hover:no-underline hover:text-primary">
                        <span className="flex items-center gap-3">
                          <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-muted-foreground leading-relaxed pl-8">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  </motion.div>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
          {/* Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px'
            }} />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
                Bereit für Ihren Umzug?
              </h2>
              <p className="text-lg text-white/80 mb-8">
                Vergleichen Sie jetzt kostenlos und unverbindlich Offerten von über 200 geprüften Schweizer Umzugsfirmen.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/rechner">
                  <Button size="lg" variant="secondary" className="h-14 px-8 text-lg font-bold bg-white text-primary hover:bg-white/90 shadow-lg">
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Jetzt Offerten erhalten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/umzugsrechner">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-2 border-white text-white hover:bg-white/10">
                    <Calculator className="mr-2 h-5 w-5" />
                    Kosten berechnen
                  </Button>
                </Link>
              </div>
              
              <p className="text-sm text-white/60 mt-6">
                Bereits über 15'000 erfolgreiche Umzüge verglichen • 100% kostenlos
              </p>
            </motion.div>
          </div>
        </section>

        <StickyMobileCTA />
      </div>
    </>
  );
}
