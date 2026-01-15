/**
 * Zug V1 Landing Page
 * Temu-inspired, conversion-optimized landing page for Umzugsfirmen in Zug
 * 
 * Features:
 * - Sticky urgency top bar with countdown
 * - Hero with CTA and mini form
 * - Trust badges & social proof
 * - Services grid
 * - "So funktioniert's" 3-step flow
 * - Regional stats & highlights
 * - Benefits/USP section
 * - Countdown offer section
 * - Customer testimonials
 * - FAQ with schema markup
 * - Multiple strategic CTAs
 */

import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, Shield, Star, Clock, CheckCircle2, Gift, Users, 
  TrendingDown, Home, Building2, Sparkles, Trash2, Box, Package,
  ClipboardList, FileText, PiggyBank, Phone, MessageCircle,
  ChevronDown, ChevronUp, MapPin, Award, Zap, Heart, Timer,
  Calculator, Truck, ThumbsUp, BadgeCheck, Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ============================================
// CONSTANTS & DATA
// ============================================

const COUNTDOWN_INITIAL = 4 * 60 + 59; // 4:59 minutes

const TRUST_BADGES = [
  { icon: Shield, label: "Geprüfte Partner", color: "text-emerald-500" },
  { icon: Star, label: "4.8/5 Sterne", color: "text-amber-500" },
  { icon: BadgeCheck, label: "100% Gratis", color: "text-primary" },
];

const MINI_REVIEWS = [
  { text: "Super einfach – wir sparten CHF 200!", author: "Anna K.", location: "Zug", rating: 5 },
  { text: "Schnell, freundlich und günstig!", author: "Markus S.", location: "Baar", rating: 5 },
  { text: "Top Service, sehr empfehlenswert.", author: "Lisa M.", location: "Cham", rating: 5 },
];

const SERVICES = [
  { icon: Home, title: "Privatumzug", description: "Stressfrei zügeln mit Profis", href: "/privatumzug", color: "from-primary to-primary/70" },
  { icon: Building2, title: "Firmenumzug", description: "Büro & Geschäftsumzug", href: "/firmenumzug", color: "from-blue-500 to-blue-400" },
  { icon: Sparkles, title: "Reinigung", description: "Endreinigung mit Garantie", href: "/reinigung", color: "from-emerald-500 to-emerald-400" },
  { icon: Trash2, title: "Entsorgung", description: "Räumung & Entrümpelung", href: "/entsorgung-raeumung", color: "from-orange-500 to-orange-400" },
  { icon: Box, title: "Einlagerung", description: "Sichere Lagerboxen", href: "/einlagerung", color: "from-violet-500 to-violet-400" },
  { icon: Package, title: "Packservice", description: "Professionelles Einpacken", href: "/packservice", color: "from-rose-500 to-rose-400" },
];

const STEPS = [
  { number: 1, icon: ClipboardList, title: "Anfrage stellen", description: "Online Formular in 2 Minuten ausfüllen" },
  { number: 2, icon: FileText, title: "Offerten erhalten", description: "Sie bekommen 3 Angebote von Umzugsfirmen in Zug" },
  { number: 3, icon: PiggyBank, title: "Vergleichen & Sparen", description: "Angebot auswählen & bis 40% sparen" },
];

const REGIONAL_STATS = [
  { icon: Package, value: "97", label: "Umzüge letzte Woche", suffix: "" },
  { icon: Users, value: "1'500+", label: "Nutzer aus Zug in 2025", suffix: "" },
  { icon: TrendingDown, value: "CHF 200", label: "Ø Ersparnis pro Umzug", suffix: "" },
  { icon: Shield, value: "25", label: "Zertifizierte Partner", suffix: "" },
];

const BENEFITS = [
  { icon: BadgeCheck, title: "Geprüfte Umzugsfirmen", description: "Nur qualitätsgeprüfte Unternehmen – für sorgenfreies Zügeln" },
  { icon: TrendingDown, title: "Bis 40% sparen", description: "Preise direkt vergleichen und das beste Angebot wählen" },
  { icon: Gift, title: "Gratis & unverbindlich", description: "Offertenanfrage kostenfrei – kein Risiko, keine Verpflichtung" },
  { icon: Shield, title: "Versicherung & Garantie", description: "Versicherter Umzug, inkl. Abnahmegarantie bei Reinigung" },
  { icon: Phone, title: "Persönlicher Service", description: "Beratung vor, während und nach dem Umzug" },
];

const TESTIMONIALS = [
  { 
    text: "Umzug lief reibungslos, sehr empfehlenswert – habe CHF 250 gespart!", 
    author: "Max M.", 
    location: "Baar",
    rating: 5,
    date: "vor 3 Tagen"
  },
  { 
    text: "Innert 24h hatte ich 3 super Offerten. Einfacher geht's nicht!", 
    author: "Sandra K.", 
    location: "Zug",
    rating: 5,
    date: "vor 1 Woche"
  },
  { 
    text: "Die Firma war pünktlich, freundlich und hat alles sicher transportiert.", 
    author: "Peter H.", 
    location: "Cham",
    rating: 5,
    date: "vor 2 Wochen"
  },
  { 
    text: "Endlich ein Service der hält was er verspricht. Top!", 
    author: "Maria L.", 
    location: "Steinhausen",
    rating: 5,
    date: "vor 3 Wochen"
  },
];

const FAQS = [
  {
    question: "Was kostet eine Umzugsfirma in Zug?",
    answer: "Die Kosten für einen Umzug in Zug variieren je nach Wohnungsgrösse, Distanz und gewünschten Services. Eine 2-Zimmer-Wohnung kostet ca. CHF 600-1'200, eine 4-Zimmer-Wohnung CHF 1'200-2'500. Mit unserem Vergleich sparen Sie durchschnittlich CHF 200."
  },
  {
    question: "Wie früh sollte ich meinen Umzug planen?",
    answer: "Wir empfehlen, mindestens 4-6 Wochen vor dem Umzugstermin Offerten einzuholen. In der Hochsaison (Frühling/Sommer) besser 8 Wochen. Kurzfristige Umzüge sind aber auch möglich."
  },
  {
    question: "Sind die Offerten wirklich unverbindlich?",
    answer: "Ja, 100%. Sie erhalten bis zu 3 Offerten von geprüften Umzugsfirmen aus Zug. Sie entscheiden selbst, ob und mit welcher Firma Sie den Umzug durchführen. Kein Kleingedrucktes, keine versteckten Kosten."
  },
  {
    question: "Welche Umzugsservices werden angeboten?",
    answer: "Unsere Partner bieten Privatumzüge, Firmenumzüge, Seniorenumzüge, Packservice, Möbelmontage, Endreinigung mit Abnahmegarantie, Entsorgung und Einlagerung an. Alles aus einer Hand."
  },
  {
    question: "Wie werden die Umzugsfirmen geprüft?",
    answer: "Alle Partner durchlaufen einen Qualitätscheck: Gewerbebewilligung, Versicherungsnachweis, Referenzen und regelmässige Kundenbewertungen. Nur Firmen mit mindestens 4 Sternen bleiben im Netzwerk."
  },
];

// ============================================
// COMPONENTS
// ============================================

// Sticky Top Bar with Countdown
const StickyTopBar = () => {
  const [countdown, setCountdown] = useState(COUNTDOWN_INITIAL);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : COUNTDOWN_INITIAL));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  if (!isVisible) return null;

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-secondary via-secondary to-orange-500 text-white py-2.5 px-4 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base">
        <span className="animate-bounce">🎉</span>
        <span className="font-bold">Heute CHF 150 sparen!</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:inline">3 Umzugsfirmen aus Zug verfügbar</span>
        <div className="flex items-center gap-1.5 bg-white/20 rounded-full px-3 py-1">
          <Timer className="w-4 h-4" />
          <span className="font-mono font-bold tabular-nums">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Hero Section
const HeroSection = () => {
  const [fromPLZ, setFromPLZ] = useState("");
  const [toPLZ, setToPLZ] = useState("");

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center overflow-hidden pt-16 sm:pt-20">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-emerald-500/5" />
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=1920')] bg-cover bg-center opacity-[0.03]" />
      
      {/* Floating elements */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute top-32 right-10 hidden lg:block"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/10 backdrop-blur-sm flex items-center justify-center">
          <Truck className="w-10 h-10 text-secondary" />
        </div>
      </motion.div>
      
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        className="absolute bottom-40 left-10 hidden lg:block"
      >
        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 backdrop-blur-sm flex items-center justify-center">
          <Shield className="w-8 h-8 text-emerald-500" />
        </div>
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust badge above headline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
          >
            <BadgeCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-semibold text-emerald-700">25 geprüfte Umzugsfirmen im Kanton Zug</span>
          </motion.div>

          {/* H1 */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 leading-tight"
          >
            Umzugsfirma in Zug finden – 
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"> Gratis Offerten</span> & bis 40% sparen
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            Vergleichen Sie 3 geprüfte Umzugsfirmen in Zug. 
            <span className="font-semibold text-foreground"> Kostenlos, unverbindlich & sicher.</span>
          </motion.p>

          {/* Mini Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl shadow-primary/10 border border-primary/10 max-w-2xl mx-auto mb-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input 
                  placeholder="Von PLZ (z.B. 6300)"
                  value={fromPLZ}
                  onChange={(e) => setFromPLZ(e.target.value)}
                  className="pl-10 h-12 sm:h-14 text-base border-2 border-primary/20 focus:border-primary rounded-xl"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                <Input 
                  placeholder="Nach PLZ"
                  value={toPLZ}
                  onChange={(e) => setToPLZ(e.target.value)}
                  className="pl-10 h-12 sm:h-14 text-base border-2 border-primary/20 focus:border-primary rounded-xl"
                />
              </div>
              <Link to="/umzugsofferten" className="w-full">
                <Button 
                  size="lg" 
                  className="w-full h-12 sm:h-14 text-base sm:text-lg font-bold bg-gradient-to-r from-secondary via-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary shadow-lg shadow-secondary/30 rounded-xl group"
                >
                  Jetzt Offerten
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            
            {/* Trust line under form */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-primary/10">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>100% kostenlos</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>Dauert nur 2 Min.</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground hidden sm:flex">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Unverbindlich</span>
              </div>
            </div>
          </motion.div>

          {/* CTA Button (alternative) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="sm:hidden"
          >
            <Link to="/umzugsofferten">
              <Button 
                size="lg" 
                className="w-full h-16 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-xl shadow-secondary/30 rounded-2xl group"
              >
                <Gift className="w-5 h-5 mr-2" />
                Jetzt kostenlose Offerten erhalten
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Trust Badges Section
const TrustSection = () => (
  <section className="py-8 bg-gradient-to-r from-primary/5 via-transparent to-emerald-500/5 border-y border-primary/10">
    <div className="container mx-auto px-4">
      {/* Trust Badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-6">
        {TRUST_BADGES.map((badge, i) => (
          <motion.div 
            key={badge.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <badge.icon className={cn("w-5 h-5", badge.color)} />
            <span className="font-semibold text-foreground">{badge.label}</span>
          </motion.div>
        ))}
      </div>

      {/* Mini Reviews Carousel */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {MINI_REVIEWS.map((review, i) => (
          <motion.div
            key={review.author}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary/10 shadow-sm"
          >
            <div className="flex">
              {Array.from({ length: review.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-foreground">"{review.text}"</span>
            <span className="text-xs text-muted-foreground">– {review.author}, {review.location}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Services Grid
const ServicesGrid = () => (
  <section className="py-16 sm:py-20">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Alle Umzugsservices in Zug
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Von Privatumzug bis Endreinigung – alles aus einer Hand
        </p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {SERVICES.map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
          >
            <Link 
              to={service.href}
              className="group block p-5 sm:p-6 bg-white rounded-2xl border-2 border-transparent hover:border-primary/20 shadow-lg shadow-primary/5 hover:shadow-xl hover:shadow-primary/10 transition-all"
            >
              <div className={cn(
                "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg",
                service.color
              )}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">{service.title}</h3>
              <p className="text-sm text-muted-foreground">{service.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// How It Works Section
const HowItWorksSection = () => (
  <section className="py-16 sm:py-20 bg-gradient-to-b from-muted/30 to-background">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          So funktioniert's
        </h2>
        <p className="text-muted-foreground text-lg">
          In 3 einfachen Schritten zum besten Angebot
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            viewport={{ once: true }}
            className="relative text-center"
          >
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div className="hidden sm:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-primary/10" />
            )}
            
            {/* Step number */}
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-4 shadow-xl shadow-primary/25">
              <step.icon className="w-9 h-9 text-white" />
              <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-secondary text-white text-sm font-bold flex items-center justify-center shadow-lg">
                {step.number}
              </span>
            </div>
            
            <h3 className="font-bold text-xl mb-2">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link to="/umzugsofferten">
          <Button size="lg" className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-lg shadow-secondary/30 group">
            Jetzt Anfrage starten
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-3">Kostenlos & unverbindlich • Dauert nur 2 Minuten</p>
      </motion.div>
    </div>
  </section>
);

// Regional Stats Section
const RegionalStatsSection = () => (
  <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">
          Umzugscheck in Zug – Die Zahlen sprechen für sich
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {REGIONAL_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-sm"
          >
            <stat.icon className="w-8 h-8 mx-auto mb-3 text-white/80" />
            <div className="text-3xl sm:text-4xl font-extrabold mb-1">{stat.value}</div>
            <div className="text-sm text-white/70">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// Benefits Section
const BenefitsSection = () => (
  <section className="py-16 sm:py-20">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
          Warum Umzugscheck?
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Ihr Vorteil bei der Suche nach der besten Umzugsfirma in Zug
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {BENEFITS.map((benefit, i) => (
          <motion.div
            key={benefit.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-gradient-to-br from-white to-muted/30 border border-primary/10 shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center mb-4">
              <benefit.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
            <p className="text-muted-foreground text-sm">{benefit.description}</p>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12 p-8 rounded-3xl bg-gradient-to-r from-primary/5 to-emerald-500/5 border border-primary/10"
      >
        <p className="text-lg font-semibold mb-4">Überzeugt? Starten Sie jetzt Ihre Anfrage und profitieren Sie noch heute.</p>
        <Link to="/umzugsofferten">
          <Button size="lg" className="h-14 px-8 text-lg font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-lg shadow-secondary/30 group">
            Anfrage starten
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

// Countdown Offer Section
const CountdownOfferSection = () => {
  const [countdown, setCountdown] = useState(COUNTDOWN_INITIAL);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : COUNTDOWN_INITIAL));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-orange-500 via-secondary to-orange-500 text-white overflow-hidden relative">
      {/* Animated background */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 bg-[radial-gradient(circle,white_0%,transparent_70%)]"
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full mb-6"
          >
            <Zap className="w-5 h-5" />
            <span className="font-bold">Nur für kurze Zeit!</span>
          </motion.div>
          
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-4">
            ⚡ 20% Rabatt auf Ihren Umzug in Zug!
          </h2>
          
          <p className="text-lg sm:text-xl mb-6 text-white/90">
            Angebot endet in:
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[80px]">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold">{String(minutes).padStart(2, '0')}</div>
              <div className="text-sm text-white/70">Minuten</div>
            </div>
            <div className="text-4xl font-bold">:</div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 min-w-[80px]">
              <div className="text-4xl sm:text-5xl font-mono font-extrabold">{String(seconds).padStart(2, '0')}</div>
              <div className="text-sm text-white/70">Sekunden</div>
            </div>
          </div>
          
          <Link to="/umzugsofferten">
            <Button 
              size="lg" 
              className="h-16 px-10 text-xl font-bold bg-white text-secondary hover:bg-white/90 shadow-2xl group"
            >
              <Gift className="w-6 h-6 mr-2" />
              Rabatt sichern
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <p className="text-sm text-white/70 mt-4">
            Jetzt Offerte anfordern und CHF 150 Gutschein erhalten
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Section
const TestimonialsSection = () => (
  <section className="py-16 sm:py-20 bg-muted/30">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span className="font-bold text-lg">4.8/5</span>
          <span className="text-muted-foreground">basierend auf 120 Bewertungen</span>
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Was unsere Kunden sagen
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {TESTIMONIALS.map((testimonial, i) => (
          <motion.div
            key={testimonial.author}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-white shadow-lg border border-primary/10"
          >
            <div className="flex mb-3">
              {Array.from({ length: testimonial.rating }).map((_, j) => (
                <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <p className="text-foreground mb-4">"{testimonial.text}"</p>
            <div className="flex items-center justify-between text-sm">
              <div>
                <span className="font-semibold">{testimonial.author}</span>
                <span className="text-muted-foreground">, {testimonial.location}</span>
              </div>
              <span className="text-xs text-muted-foreground">{testimonial.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

// FAQ Section
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Häufige Fragen zum Umzug in Zug
          </h2>
          <p className="text-muted-foreground text-lg">
            Alles was Sie wissen müssen
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {FAQS.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="border border-primary/10 rounded-2xl overflow-hidden bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
              >
                <span className="font-semibold text-lg pr-4">{faq.question}</span>
                {openIndex === i ? (
                  <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => (
  <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white">
    <div className="container mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-6">
          Bereit für Ihren Umzug in Zug?
        </h2>
        <p className="text-lg sm:text-xl mb-8 text-white/90">
          Fordern Sie jetzt Ihre gratis Offerten an und sparen Sie bis zu 40% bei Ihrem Umzug.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/umzugsofferten">
            <Button 
              size="lg" 
              className="h-16 px-10 text-xl font-bold bg-white text-primary hover:bg-white/90 shadow-2xl group"
            >
              Kostenlose Offerten erhalten
              <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>100% Kostenlos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Unverbindlich</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>In 2 Minuten erledigt</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

// Sticky Mobile CTA
const StickyMobileCTA = () => (
  <motion.div 
    initial={{ y: 100 }}
    animate={{ y: 0 }}
    className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-primary/10 shadow-2xl shadow-black/10 p-3 safe-area-pb"
  >
    <Link to="/umzugsofferten" className="block">
      <Button 
        className="w-full h-14 text-base font-bold bg-gradient-to-r from-secondary to-secondary/90 shadow-lg shadow-secondary/30 group"
      >
        <Gift className="w-5 h-5 mr-2" />
        Gratis Umzugsofferten sichern
        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </Link>
  </motion.div>
);

// Chat Bubble
const ChatBubble = () => (
  <motion.button
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 2 }}
    whileHover={{ scale: 1.1 }}
    className="fixed bottom-20 lg:bottom-6 right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/30 flex items-center justify-center"
    title="Fragen? Wir helfen!"
  >
    <MessageCircle className="w-6 h-6" />
  </motion.button>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function ZugV1LandingPage() {
  return (
    <>
      <Helmet>
        <title>Umzugsfirma Zug finden – Kostenlos Offerten vergleichen | umzugscheck.ch</title>
        <meta 
          name="description" 
          content="Umzug in Zug geplant? ✔️ Kostenlose Offerten von geprüften Umzugsfirmen einholen und bis 40% sparen. ✅ Jetzt Umzugsangebot sichern!" 
        />
        <meta name="keywords" content="Umzugsfirma Zug, Umzug Zug, Zügelunternehmen Zug, Umzugsofferte Zug, Umzug Kanton Zug" />
        <link rel="canonical" href="https://umzugscheck.ch/umzugsfirmen/zug-v1" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Umzugsfirma in Zug finden – Gratis Offerten & bis 40% sparen" />
        <meta property="og:description" content="Vergleichen Sie 3 geprüfte Umzugsfirmen in Zug. Kostenlos, unverbindlich & sicher." />
        <meta property="og:type" content="website" />
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": FAQS.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })}
        </script>
        
        {/* LocalBusiness Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "Umzugscheck.ch - Umzugsfirmen Zug",
            "description": "Vergleichsportal für Umzugsfirmen im Kanton Zug",
            "areaServed": {
              "@type": "AdministrativeArea",
              "name": "Kanton Zug"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "120"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background pb-20 lg:pb-0">
        <StickyTopBar />
        <HeroSection />
        <TrustSection />
        <ServicesGrid />
        <HowItWorksSection />
        <RegionalStatsSection />
        <BenefitsSection />
        <CountdownOfferSection />
        <TestimonialsSection />
        <FAQSection />
        <FinalCTASection />
        <StickyMobileCTA />
        <ChatBubble />
      </div>
    </>
  );
}
