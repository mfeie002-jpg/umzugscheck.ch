import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Star, Shield, CheckCircle2, Clock, Check, TrendingDown, Trophy, Video, Upload, FileText, Phone, MessageCircle, Bot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import heroFamilyMoving from "@/assets/hero-family-moving.jpg";
import { LiveActivityBadge } from "@/components/home/LiveActivityBadge";
import { swissPostalCodes } from "@/lib/swiss-postal-codes";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { HeroGradient } from "@/components/common/HeroGradient";
import { GridPattern } from "@/components/common/GridPattern";
import { MagneticButton } from "@/components/common/MagneticButton";
import { isScreenshotRenderMode } from "@/lib/screenshot-render-mode";
import { useSmartAutofocus, useIsDesktop } from "@/hooks/useSmartAutofocus";
import { useABTest } from "@/hooks/use-ab-test";

// Animated Counter Component
const AnimatedCounter = ({ 
  value, 
  suffix = "", 
  decimals = 0,
  duration = 2 
}: { 
  value: number; 
  suffix?: string; 
  decimals?: number;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = easeOut * value;
        setCount(currentValue);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isInView, value, duration]);

  const formattedValue = decimals > 0 
    ? count.toFixed(decimals) 
    : Math.floor(count).toLocaleString("de-CH");

  return (
    <span ref={ref} className="tabular-nums">
      {formattedValue}{suffix}
    </span>
  );
};

// Filter postal codes based on query
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

export const PremiumHeroSection = () => {
  const navigate = useNavigate();
  const [fromPostal, setFromPostal] = useState("");
  const [toPostal, setToPostal] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  
  // Smart autofocus - only on desktop (>768px)
  const fromInputRef = useSmartAutofocus<HTMLInputElement>({ enabled: true });
  const isDesktop = useIsDesktop();
  
  // A/B Test for CTA button text
  const { variant: ctaVariant, trackConversion } = useABTest('hero_cta');
  
  // CTA button text based on A/B test variant
  const getCtaText = () => {
    switch (ctaVariant) {
      case 'variant_b':
        return 'Preise jetzt vergleichen';
      case 'variant_c':
        return 'Gratis Umzugs-Check starten';
      default:
        return 'Kostenlos Offerten erhalten';
    }
  };

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });

  // Transform scroll progress to parallax movement (slower than scroll)
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.85, 0.95]);

  // Memoize filtered results
  const fromOptions = useMemo(() => filterPostalCodes(fromPostal), [fromPostal]);
  const toOptions = useMemo(() => filterPostalCodes(toPostal), [toPostal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track A/B test conversion
    trackConversion('form_submit', 1);
    
    // Store prefill data in localStorage for funnel prefill
    const prefillData = {
      from: fromPostal,
      to: toPostal,
      source: "homepage",
      timestamp: Date.now(),
    };
    try {
      localStorage.setItem('uc_prefill', JSON.stringify(prefillData));
    } catch (e) {
      console.warn('Could not save prefill data');
    }
    
    const params = new URLSearchParams();
    if (fromPostal) params.set("from", fromPostal);
    if (toPostal) params.set("to", toPostal);
    navigate(`/umzugsofferten?${params.toString()}`);
  };

  // Use fixed height in screenshot mode to prevent vh/svh from exploding with tall viewports
  const screenshotMode = isScreenshotRenderMode();
  const heroHeightClass = screenshotMode
    ? "min-h-[700px]" // Fixed height for screenshots
    : "min-h-[90svh] sm:min-h-[85vh] md:min-h-[85vh]";

  return (
    <section ref={sectionRef} className={`relative ${heroHeightClass} flex items-center overflow-hidden pt-16 sm:pt-0`} style={{ position: 'relative' }}>
      {/* Background Image with Parallax Effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={prefersReducedMotion ? {} : { 
          y: backgroundY,
          scale: backgroundScale
        }}
      >
        <img 
          src={heroFamilyMoving}
          alt=""
          loading="eager"
          decoding="async"
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
      </motion.div>
      
      {/* Gradient Overlay - stronger on mobile for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 md:from-background/85 via-background/70 md:via-background/60 to-background/50 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 md:from-background/40 via-transparent to-background/70 md:to-background/60" />
      
      {/* Animated Floating Shapes - Verstärkter Hintergrund-Effekt */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Großer schwebender Kreis - Links oben - Primär */}
        <motion.div
          className="absolute top-[5%] left-[0%] w-48 h-48 md:w-72 md:h-72 rounded-full bg-primary/15 blur-3xl"
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Großer schwebender Kreis - Rechts oben - Secondary */}
        <motion.div
          className="absolute top-[15%] right-[5%] w-40 h-40 md:w-64 md:h-64 rounded-full bg-secondary/20 blur-3xl"
          animate={{
            y: [0, 25, 0],
            x: [0, -20, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        {/* Mittlerer Kreis - Unten links - Destructive/Rot */}
        <motion.div
          className="absolute bottom-[15%] left-[10%] w-32 h-32 md:w-48 md:h-48 rounded-full bg-destructive/15 blur-2xl"
          animate={{
            y: [0, -35, 0],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        {/* Mittlerer Kreis - Mitte rechts */}
        <motion.div
          className="absolute top-[50%] right-[20%] w-24 h-24 md:w-40 md:h-40 rounded-full bg-primary/10 blur-2xl"
          animate={{
            y: [0, 30, 0],
            x: [0, -15, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        
        {/* Kleiner Akzent-Kreis - Unten rechts */}
        <motion.div
          className="absolute bottom-[25%] right-[15%] w-20 h-20 md:w-32 md:h-32 rounded-full bg-secondary/15 blur-xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary/30"
            style={{
              left: `${10 + (i * 7) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
            }}
            animate={{
              y: [0, -40 - (i * 5), 0],
              x: [0, (i % 2 === 0 ? 15 : -15), 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 5 + (i % 4),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
        
        {/* Secondary Particles - Smaller */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`secondary-${i}`}
            className="absolute w-1 h-1 rounded-full bg-secondary/40"
            style={{
              left: `${5 + (i * 12) % 90}%`,
              top: `${20 + (i * 9) % 60}%`,
            }}
            animate={{
              y: [0, -30 - (i * 3), 0],
              opacity: [0.15, 0.5, 0.15],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.6,
            }}
          />
        ))}
      </div>
      
      {/* Grid Pattern Overlay */}
      <GridPattern className="hidden md:block" size={32} fade />
      
      {/* Content Container */}
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-8 md:py-20 lg:py-24 relative z-10">
        {/* Mobile: Form first, Desktop: Text first */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          
          {/* Left Column - Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6 order-2 lg:order-1"
          >
            {/* Dual USP Badges - Consistent Primary/Secondary colors */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {/* Savings Badge - Primary Blue */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-primary/10 rounded-xl sm:rounded-2xl shadow-soft border border-primary/30"
              >
                <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-primary">
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-primary uppercase tracking-wide">Bis 40% sparen</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">durch Vergleich</p>
                </div>
              </motion.div>

              {/* KI Video Badge - Secondary Red */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-secondary/10 rounded-xl sm:rounded-2xl shadow-soft border border-secondary/30"
              >
                <div className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-secondary">
                  <Video className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-secondary uppercase tracking-wide">Schweizer Innovation</p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">KI Video-Rechner</p>
                </div>
              </motion.div>
            </div>
            
            {/* Main Headline - Best Deal Focus */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] tracking-tight">
              <span className="text-foreground">Der beste Deal</span>
              <span className="block text-primary mt-1 md:mt-2">der ganzen Schweiz.</span>
            </h1>
            
            {/* Subheadline - Combined Value Proposition */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Unser <span className="inline-flex items-center gap-1 text-secondary font-semibold"><Video className="h-4 w-4" />KI-Rechner</span> analysiert 
              Ihren Umzug per Video – wir vergleichen <span className="font-semibold text-foreground">200+ Firmen</span> und finden 
              das <span className="inline-flex items-center gap-1 text-primary font-semibold"><Trophy className="h-4 w-4" />beste Angebot</span>.
            </p>
            
            {/* USP Pills - Consistent Primary/Secondary */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                <TrendingDown className="w-3 h-3" />
                Bis 40% günstiger
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-secondary/10 text-secondary px-3 py-1.5 rounded-full font-medium">
                <Video className="w-3 h-3" />
                Video-Analyse
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full font-medium">
                <CheckCircle2 className="w-3 h-3" />
                200+ Firmen
              </span>
            </div>
            
            {/* Live Activity Badge */}
            <div className="pt-1 md:pt-2 hidden sm:block">
              <LiveActivityBadge />
            </div>
            
            {/* Desktop CTA with MagneticButton */}
            <div className="hidden lg:flex items-center gap-4 pt-2">
              <MagneticButton strength={0.2}>
                <Link to="/video-offerte">
                  <Button size="lg" className="h-12 lg:h-14 px-5 lg:px-8 text-base lg:text-lg font-semibold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all bg-secondary hover:bg-secondary/90">
                    <Video className="mr-2 h-5 w-5" />
                    Video-Offerte starten
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
          
          {/* Right Column - Quick Quote Form - Shows FIRST on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0
            }}
            transition={{ 
              opacity: { duration: 0.5, delay: 0.1 }
            }}
            className="order-1 lg:order-2"
          >
            <div className="bg-card rounded-xl md:rounded-2xl shadow-xl border border-border p-4 sm:p-5 md:p-8 relative">
              <div className="space-y-3 sm:space-y-4 md:space-y-5">
                {/* Form Header - Friendly, not pushy */}
                <div className="text-center space-y-1 md:space-y-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                    Wie möchten Sie starten?
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Wählen Sie Ihre bevorzugte Methode
                  </p>
                </div>
                
                {/* 4 Options: Formular, Video, KI-Chat, WhatsApp - Clearly Clickable */}
                <Tabs defaultValue="form" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 h-auto p-2 bg-muted/30 rounded-2xl gap-2">
                    {/* Formular Tab - Primary Blue */}
                    <TabsTrigger 
                      value="form" 
                      className="relative flex flex-col items-center justify-center gap-1 py-3 px-2 text-[11px] sm:text-xs font-semibold rounded-xl border-2 cursor-pointer
                        border-primary/30 bg-white hover:border-primary hover:bg-primary/5
                        data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary data-[state=active]:shadow-lg data-[state=active]:scale-[1.02]
                        transition-all duration-200 active:scale-95"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary/10 data-[state=active]:bg-white/20 flex items-center justify-center">
                        <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary data-[state=active]:text-white" />
                      </div>
                      <span>Formular</span>
                    </TabsTrigger>
                    
                    {/* Video Tab - Secondary Orange */}
                    <TabsTrigger 
                      value="video" 
                      className="relative flex flex-col items-center justify-center gap-1 py-3 px-2 text-[11px] sm:text-xs font-semibold rounded-xl border-2 cursor-pointer
                        border-secondary/30 bg-white hover:border-secondary hover:bg-secondary/5
                        data-[state=active]:bg-secondary data-[state=active]:text-white data-[state=active]:border-secondary data-[state=active]:shadow-lg data-[state=active]:scale-[1.02]
                        transition-all duration-200 active:scale-95"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <Video className="h-4 w-4 sm:h-5 sm:w-5 text-secondary" />
                      </div>
                      <span>Video</span>
                    </TabsTrigger>
                    
                    {/* KI-Chat Tab - Violet with NEU badge */}
                    <TabsTrigger 
                      value="chat" 
                      className="relative flex flex-col items-center justify-center gap-1 py-3 px-2 text-[11px] sm:text-xs font-semibold rounded-xl border-2 cursor-pointer
                        border-violet-400/30 bg-white hover:border-violet-500 hover:bg-violet-50
                        data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:border-violet-600 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02]
                        transition-all duration-200 active:scale-95"
                    >
                      <span className="absolute -top-2 -right-1 px-1.5 py-0.5 text-[8px] bg-violet-600 text-white rounded-full font-bold shadow-sm z-10">
                        NEU
                      </span>
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-violet-100 flex items-center justify-center">
                        <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
                      </div>
                      <span>KI-Chat</span>
                    </TabsTrigger>
                    
                    {/* WhatsApp Tab - Green */}
                    <TabsTrigger 
                      value="whatsapp" 
                      className="relative flex flex-col items-center justify-center gap-1 py-3 px-2 text-[11px] sm:text-xs font-semibold rounded-xl border-2 cursor-pointer
                        border-green-400/30 bg-white hover:border-green-500 hover:bg-green-50
                        data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600 data-[state=active]:shadow-lg data-[state=active]:scale-[1.02]
                        transition-all duration-200 active:scale-95"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-green-100 flex items-center justify-center">
                        <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <span className="hidden sm:inline">WhatsApp</span>
                      <span className="sm:hidden">WA</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Video Tab - Friendly, not intimidating */}
                  <TabsContent value="video" className="mt-4 space-y-3">
                    <Link to="/video-offerte" className="block">
                      <div className="relative group cursor-pointer">
                        <div className="border-2 border-secondary/40 hover:border-secondary rounded-xl p-5 sm:p-6 text-center transition-all bg-gradient-to-br from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/15">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Video className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                            </div>
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                            </div>
                          </div>
                          <p className="font-semibold text-sm sm:text-base text-foreground mb-1">
                            Video oder Fotos hochladen
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Unsere KI analysiert & berechnet automatisch
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              Schneller
                            </span>
                            <span className="inline-flex items-center gap-1 text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              Genauer
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Privacy reassurance */}
                    <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 text-primary" />
                      <span>100% sicher · Nur für Ihre Offerte · Wird nicht gespeichert</span>
                    </div>
                    
                    {/* Secondary Options */}
                    <div className="flex items-center justify-center gap-3 pt-1 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">Direkt kontaktieren:</span>
                      <a 
                        href="https://wa.me/41445551234?text=Hallo%2C%20ich%20m%C3%B6chte%20eine%20Umzugsofferte"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        WhatsApp
                      </a>
                      <a 
                        href="tel:+41445551234"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        Anrufen
                      </a>
                    </div>
                  </TabsContent>
                  
                  {/* KI-Chat Tab - Conversational experience */}
                  <TabsContent value="chat" className="mt-4 space-y-3">
                    <Link to="/umzugsofferten-v2e" className="block">
                      <div className="relative group cursor-pointer">
                        <div className="border-2 border-violet-500/40 hover:border-violet-500 rounded-xl p-5 sm:p-6 text-center transition-all bg-gradient-to-br from-violet-500/5 to-violet-500/10 hover:from-violet-500/10 hover:to-violet-500/15">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-violet-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-violet-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                                <path d="M17 3a2.5 2.5 0 1 0 4 4" />
                              </svg>
                            </div>
                          </div>
                          <p className="font-semibold text-sm sm:text-base text-foreground mb-1">
                            Chat mit KI-Assistent
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Persönliche Beratung & Offerte in natürlichem Gespräch
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 text-violet-600 font-medium bg-violet-500/10 px-2 py-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              Persönlich
                            </span>
                            <span className="inline-flex items-center gap-1 text-violet-600 font-medium bg-violet-500/10 px-2 py-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              24/7 verfügbar
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 text-violet-600" />
                      <span>Schweizer Qualität · Kostenlos · Unverbindlich</span>
                    </div>
                  </TabsContent>
                  
                  {/* WhatsApp Tab - Direct contact */}
                  <TabsContent value="whatsapp" className="mt-4 space-y-3">
                    <a 
                      href="https://wa.me/41445551234?text=Hallo%2C%20ich%20m%C3%B6chte%20eine%20Umzugsofferte%20erhalten.%20Bitte%20kontaktieren%20Sie%20mich."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative group cursor-pointer">
                        <div className="border-2 border-green-500/40 hover:border-green-500 rounded-xl p-5 sm:p-6 text-center transition-all bg-gradient-to-br from-green-500/5 to-green-500/10 hover:from-green-500/10 hover:to-green-500/15">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <svg className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                              </svg>
                            </div>
                          </div>
                          <p className="font-semibold text-sm sm:text-base text-foreground mb-1">
                            Direkt via WhatsApp
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            Persönlicher Kontakt – Antwort in wenigen Minuten
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium bg-green-500/10 px-2 py-1 rounded-full">
                              <CheckCircle2 className="h-3 w-3" />
                              Sofort
                            </span>
                            <span className="inline-flex items-center gap-1 text-green-600 font-medium bg-green-500/10 px-2 py-1 rounded-full">
                              <Phone className="h-3 w-3" />
                              Persönlich
                            </span>
                          </div>
                        </div>
                      </div>
                    </a>
                    
                    <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                      <Shield className="h-3 w-3 text-green-600" />
                      <span>Direkte Antwort · Mo-Fr 8-18 Uhr · Sa 9-15 Uhr</span>
                    </div>
                    
                    {/* Alternative: Anrufen */}
                    <div className="flex items-center justify-center gap-3 pt-2 border-t border-border/50">
                      <span className="text-xs text-muted-foreground">Oder direkt anrufen:</span>
                      <a 
                        href="tel:+41445551234"
                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium"
                      >
                        <Phone className="h-3.5 w-3.5" />
                        +41 44 555 12 34
                      </a>
                    </div>
                  </TabsContent>
                  
                  {/* Form Tab - Default with Video Hint */}
                  <TabsContent value="form" className="mt-4 space-y-3 md:space-y-4">
                    {/* Video Hint Banner */}
                    <Link to="/video-offerte" className="block group">
                      <div className="flex items-center gap-3 p-2.5 bg-secondary/10 hover:bg-secondary/15 rounded-lg border border-secondary/20 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <Video className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">Schneller mit Video/Fotos?</p>
                          <p className="text-[10px] text-muted-foreground">KI berechnet automatisch – noch genauer!</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-secondary group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                      </div>
                    </Link>
                    
                    <div className="text-xs sm:text-sm text-muted-foreground text-center">
                      Schritt 1 von 4 · Dauer ca. 2 Minuten
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="from" className="text-foreground font-medium text-xs sm:text-sm">Von (PLZ oder Ort)</Label>
                        <Input
                          id="from"
                          ref={fromInputRef}
                          list="from-options"
                          placeholder="z.B. 8001 oder Zürich"
                          value={fromPostal}
                          onChange={(e) => setFromPostal(e.target.value)}
                          inputMode="text"
                          pattern="[0-9]*|[a-zA-ZäöüÄÖÜ\s-]+"
                          enterKeyHint="next"
                          className="h-10 sm:h-11 md:h-12 text-base bg-background border-2 border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          autoComplete="address-level2"
                          required
                        />
                        <datalist id="from-options">
                          {fromOptions.map((option) => (
                            <option key={`from-${option.code}`} value={`${option.code} - ${option.city} (${option.canton})`} />
                          ))}
                        </datalist>
                      </div>
                      
                      <div className="space-y-1.5 md:space-y-2">
                        <Label htmlFor="to" className="text-foreground font-medium text-xs sm:text-sm">Nach (PLZ oder Ort)</Label>
                        <Input
                          id="to"
                          list="to-options"
                          placeholder="z.B. 3011 oder Bern"
                          value={toPostal}
                          onChange={(e) => setToPostal(e.target.value)}
                          inputMode="text"
                          pattern="[0-9]*|[a-zA-ZäöüÄÖÜ\s-]+"
                          enterKeyHint="done"
                          className="h-10 sm:h-11 md:h-12 text-base bg-background border-2 border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                          autoComplete="address-level2"
                          required
                        />
                        <datalist id="to-options">
                          {toOptions.map((option) => (
                            <option key={`to-${option.code}`} value={`${option.code} - ${option.city} (${option.canton})`} />
                          ))}
                        </datalist>
                      </div>
                      
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group relative z-20 touch-manipulation"
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                        {getCtaText()}
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                
                {/* Trust Microcopy - Consistent Primary colors */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 md:pt-2 text-xs sm:text-sm text-foreground/60">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    Kostenlos
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                    Unverbindlich
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" />
                    Datenschutz
                  </span>
                </div>
              </div>
            </div>
            
            {/* Mobile: Scroll indicator */}
            <motion.div 
              className="flex flex-col items-center mt-4 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 8, 0] }}
              transition={{ 
                opacity: { delay: 1, duration: 0.5 },
                y: { delay: 1.5, duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <span className="text-xs text-muted-foreground mb-1">Mehr entdecken</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};