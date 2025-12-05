import { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Star, Shield, CheckCircle2, Clock, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import heroFamilyMoving from "@/assets/hero-family-moving.jpg";
import { LiveActivityBadge } from "@/components/home/LiveActivityBadge";
import { swissPostalCodes } from "@/lib/swiss-postal-codes";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
  const [rooms, setRooms] = useState("");
  const prefersReducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

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
    const params = new URLSearchParams();
    if (fromPostal) params.set("from", fromPostal);
    if (toPostal) params.set("to", toPostal);
    if (rooms) params.set("rooms", rooms);
    navigate(`/umzugsofferten?${params.toString()}`);
  };

  return (
    <section ref={sectionRef} className="relative min-h-[100svh] md:min-h-[85vh] flex items-center overflow-hidden">
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
          fetchPriority="high"
          decoding="sync"
          sizes="100vw"
          className="absolute inset-0 w-full h-full object-cover object-center"
          width={1920}
          height={1080}
        />
      </motion.div>
      
      {/* Gradient Overlay - stronger on mobile for readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 md:from-background/85 via-background/70 md:via-background/60 to-background/50 md:to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/50 md:from-background/40 via-transparent to-background/70 md:to-background/60" />
      
      {/* OPTION 1: Großes Checkmark LINKS neben der Headline */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 0.12, scale: 1, rotate: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute left-[2%] md:left-[5%] top-[30%] z-[1] pointer-events-none hidden md:block"
      >
        <Check className="w-[200px] h-[200px] lg:w-[280px] lg:h-[280px] text-primary stroke-[2]" />
      </motion.div>
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-30 hidden md:block">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      {/* Content Container */}
      <div className="container mx-auto px-4 py-6 md:py-20 lg:py-24 relative z-10">
        {/* Mobile: Form first, Desktop: Text first */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 items-center">
          
          {/* Left Column - Text & CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 md:space-y-6 order-2 lg:order-1"
          >
            {/* CHECK Badge - Brand Highlight - Floating - Hidden on small mobile */}
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
              className="hidden sm:inline-flex items-center gap-3 px-4 md:px-5 py-2 md:py-3 bg-white rounded-2xl shadow-medium border border-border"
            >
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary">
                <Check className="h-5 w-5 md:h-6 md:w-6 text-white stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Wir checken für Sie</p>
                <p className="text-sm font-bold text-foreground">200+ geprüfte Umzugsfirmen</p>
              </div>
            </motion.div>
            
            {/* Main Headline - Smaller on mobile */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-[1.15] tracking-tight">
              <span className="text-foreground">Umzugsfirmen vergleichen.</span>
              <span className="block text-primary mt-1 md:mt-2">In wenigen Minuten.</span>
            </h1>
            
            {/* Subheadline - Compact on mobile */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Wir <span className="inline-flex items-center gap-1 text-secondary font-semibold"><CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />checken</span> für Sie: 
              AI-gestützte Analyse, geprüfte Partner, transparente Offerten.
            </p>
            
            {/* Trust Metrics Row - 2 items on mobile, 3 on desktop */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm">
              <motion.div 
                className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Star className="h-4 w-4 md:h-5 md:w-5 fill-swiss-gold text-swiss-gold" />
                <span className="font-bold text-foreground">
                  <AnimatedCounter value={4.8} decimals={1} duration={1.5} />/5
                </span>
                <span className="text-foreground/60 hidden xs:inline">Bewertung</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-secondary" />
                <span className="font-bold text-foreground">
                  <AnimatedCounter value={15000} suffix="+" duration={2} />
                </span>
                <span className="text-foreground/60 hidden sm:inline">Umzüge</span>
              </motion.div>
              <motion.div 
                className="hidden sm:flex items-center gap-1.5 sm:gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-emerald-500" />
                <span className="font-bold text-foreground">
                  <AnimatedCounter value={100} suffix="%" duration={1} />
                </span>
                <span className="text-foreground/60">kostenlos</span>
              </motion.div>
            </div>
            
            {/* Live Activity Badge - Hidden on very small screens */}
            <div className="pt-1 md:pt-2 hidden sm:block">
              <LiveActivityBadge />
            </div>
            
            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4 pt-2">
              <Link to="/umzugsofferten">
                <Button size="lg" className="h-12 lg:h-14 px-5 lg:px-8 text-base lg:text-lg font-semibold shadow-cta hover:shadow-lift hover:-translate-y-0.5 transition-all">
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Jetzt checken lassen
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/umzugsrechner">
                <Button size="lg" variant="secondary" className="h-12 lg:h-14 px-5 lg:px-8 text-base lg:text-lg font-semibold">
                  Kosten berechnen
                </Button>
              </Link>
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
            <div className="bg-card rounded-xl md:rounded-2xl shadow-xl border border-border p-4 sm:p-6 md:p-8 relative overflow-visible">
              
              {/* OPTION 2: Checkmark-Ecke oben links im Calculator */}
              <motion.div
                initial={{ opacity: 0, x: -20, y: -20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.5 }}
                className="absolute -top-3 -left-3 z-20"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary shadow-lg flex items-center justify-center rotate-[-8deg]">
                  <Check className="w-7 h-7 md:w-8 md:h-8 text-white stroke-[3]" />
                </div>
              </motion.div>
              
              {/* OPTION 3: Animierter Checkmark-Ring um "In 2 Minuten" */}
              <div className="space-y-4 md:space-y-5">
                {/* Form Header */}
                <div className="text-center space-y-1 md:space-y-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10, delay: 0.8 }}
                      className="relative"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary stroke-[3]" />
                      </div>
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-primary"
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      />
                    </motion.div>
                    <span className="text-primary">
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 inline mr-1" />
                      In 2 Minuten zum Vergleich
                    </span>
                  </motion.div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                    Kostenlos Offerten erhalten
                  </h2>
                </div>
                
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                  <div className="space-y-1.5 md:space-y-2">
                    <Label htmlFor="from" className="text-foreground font-medium text-xs sm:text-sm">Von (PLZ oder Ort)</Label>
                    <Input
                      id="from"
                      list="from-options"
                      placeholder="z.B. 8001 oder Zürich"
                      value={fromPostal}
                      onChange={(e) => setFromPostal(e.target.value)}
                      className="h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      autoComplete="off"
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
                      className="h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-background border-border/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      autoComplete="off"
                      required
                    />
                    <datalist id="to-options">
                      {toOptions.map((option) => (
                        <option key={`to-${option.code}`} value={`${option.code} - ${option.city} (${option.canton})`} />
                      ))}
                    </datalist>
                  </div>
                  
                  <div className="space-y-1.5 md:space-y-2">
                    <Label htmlFor="rooms" className="text-foreground font-medium text-xs sm:text-sm">Wohnungsgrösse</Label>
                    <Select value={rooms} onValueChange={setRooms}>
                      <SelectTrigger className="h-10 sm:h-11 md:h-12 text-sm sm:text-base bg-background border-border/60">
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
                    className="w-full h-11 sm:h-12 md:h-14 text-sm sm:text-base md:text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all group"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Jetzt checken lassen
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
                
                {/* Trust Microcopy - Compact on mobile */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1 md:pt-2 text-xs sm:text-sm text-foreground/60">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
                    Kostenlos
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-500" />
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