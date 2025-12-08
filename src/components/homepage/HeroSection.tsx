import { useState, useEffect, useRef, memo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CheckCircle, ArrowRight, Star, Shield, MapPin, Clock, TrendingUp, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { 
  PulsingBadge, 
  TypewriterHeadline, 
  AnimatedBackground, 
  GlowingButton, 
  SpotlightCard, 
  FloatingParticles, 
  MouseFollower,
  LiveDot,
  AnimatedCounter
} from "@/components/common";

// Swiss postal codes for autocomplete
const swissPostalCodes = [
  { code: "8001", city: "Zürich", canton: "ZH" },
  { code: "8002", city: "Zürich", canton: "ZH" },
  { code: "8003", city: "Zürich", canton: "ZH" },
  { code: "8004", city: "Zürich", canton: "ZH" },
  { code: "8005", city: "Zürich", canton: "ZH" },
  { code: "3000", city: "Bern", canton: "BE" },
  { code: "3011", city: "Bern", canton: "BE" },
  { code: "3012", city: "Bern", canton: "BE" },
  { code: "4000", city: "Basel", canton: "BS" },
  { code: "4001", city: "Basel", canton: "BS" },
  { code: "4051", city: "Basel", canton: "BS" },
  { code: "6000", city: "Luzern", canton: "LU" },
  { code: "6003", city: "Luzern", canton: "LU" },
  { code: "1200", city: "Genève", canton: "GE" },
  { code: "1201", city: "Genève", canton: "GE" },
  { code: "9000", city: "St. Gallen", canton: "SG" },
  { code: "5000", city: "Aarau", canton: "AG" },
  { code: "6300", city: "Zug", canton: "ZG" },
  { code: "8400", city: "Winterthur", canton: "ZH" },
  { code: "2500", city: "Biel/Bienne", canton: "BE" },
];

export const HeroSection = memo(function HeroSection() {
  const navigate = useNavigate();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [apartmentSize, setApartmentSize] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState<typeof swissPostalCodes>([]);
  const [toSuggestions, setToSuggestions] = useState<typeof swissPostalCodes>([]);
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [liveCount, setLiveCount] = useState(12);
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  });
  
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  // Simulate live activity
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filterSuggestions = (value: string) => {
    if (value.length < 2) return [];
    const lower = value.toLowerCase();
    return swissPostalCodes.filter(
      p => p.code.startsWith(value) || p.city.toLowerCase().includes(lower)
    ).slice(0, 5);
  };

  const handleFromChange = (value: string) => {
    setFromLocation(value);
    setFromSuggestions(filterSuggestions(value));
    setShowFromSuggestions(value.length >= 2);
  };

  const handleToChange = (value: string) => {
    setToLocation(value);
    setToSuggestions(filterSuggestions(value));
    setShowToSuggestions(value.length >= 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/umzugsofferten?from=${encodeURIComponent(fromLocation)}&to=${encodeURIComponent(toLocation)}&size=${encodeURIComponent(apartmentSize)}`);
  };

  return (
    <section ref={sectionRef} className="relative min-h-[75vh] sm:min-h-[80vh] md:min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Mouse Follower Effect - Desktop only */}
      <div className="hidden lg:block">
        <MouseFollower size={500} color="hsl(var(--primary) / 0.08)" />
      </div>
      
      {/* Floating Particles - hidden on mobile for performance */}
      <FloatingParticles count={25} color="bg-secondary/15" className="z-0 hidden lg:block" />
      
      {/* Animated Background with Particles - desktop only */}
      <div className="hidden lg:block">
        <AnimatedBackground variant="particles" className="absolute inset-0 z-0 opacity-20" />
      </div>
      
      {/* Parallax Background */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 md:scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80')",
          }}
        />
        {/* Gradient Overlays - stronger on mobile for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/98 to-background/80 md:via-background/95 md:to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/40 md:via-transparent md:to-background/30" />
        {/* Dotted Pattern - hidden on mobile */}
        <div 
          className="absolute inset-0 opacity-[0.02] hidden lg:block"
          style={{
            backgroundImage: "radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />
      </motion.div>

      <motion.div 
        className="container relative z-10 py-6 sm:py-8 md:py-12 lg:py-20 px-4 sm:px-5 md:px-6"
        style={{ y: contentY }}
      >
        <div className="grid lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3 sm:space-y-4 md:space-y-6 text-center lg:text-left"
          >
            {/* Badge with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 md:gap-3 bg-card/90 backdrop-blur-sm rounded-full px-2.5 sm:px-3 md:px-4 py-1.5 md:py-2 border border-border shadow-soft mx-auto lg:mx-0"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-secondary" />
              </div>
              <div className="text-[11px] sm:text-xs md:text-sm">
                <span className="font-medium">Wir checken für Sie</span>
                <span className="text-muted-foreground ml-1 md:ml-2 hidden sm:inline">• 200+ geprüfte Firmen</span>
              </div>
            </motion.div>

            {/* Headline */}
            <div className="space-y-0.5 sm:space-y-1 md:space-y-2">
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
                Umzugsfirmen vergleichen.
              </h1>
              <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.1]">
                <TypewriterHeadline 
                  words={["In wenigen Minuten.", "Einfach & schnell.", "100% kostenlos."]}
                  highlightClassName="text-secondary"
                />
              </h1>
            </div>

            {/* Subline */}
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Wir{" "}
              <span className="inline-flex items-center gap-0.5 sm:gap-1 bg-secondary/10 text-secondary px-1 sm:px-1.5 md:px-2 py-0.5 rounded-md font-medium text-[10px] sm:text-xs md:text-sm">
                <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
                checken
              </span>{" "}
              für Sie: AI-gestützte Analyse, geprüfte Partner, transparente Offerten.
            </p>

            {/* Trust Row - horizontal scroll on mobile */}
            <div className="flex flex-nowrap md:flex-wrap gap-1.5 sm:gap-2 md:gap-3 overflow-x-auto pb-1 md:pb-0 -mx-4 px-4 md:mx-0 md:px-0 justify-start lg:justify-start scrollbar-hide snap-x snap-mandatory">
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-card/90 backdrop-blur-sm rounded-lg md:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 border border-border flex-shrink-0 snap-start">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-swiss-gold fill-swiss-gold" />
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold whitespace-nowrap">4.8/5</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-card/90 backdrop-blur-sm rounded-lg md:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 border border-border flex-shrink-0 snap-start">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary" />
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold whitespace-nowrap">15'000+</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 bg-card/90 backdrop-blur-sm rounded-lg md:rounded-xl px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 border border-border flex-shrink-0 snap-start">
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-green-500" />
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold whitespace-nowrap">Kostenlos</span>
              </div>
            </div>

            {/* Live Badge */}
            <div className="flex items-center justify-center lg:justify-start">
              <PulsingBadge variant="success" pulse>
                <LiveDot color="green" size="sm" className="mr-1" />
                <span className="text-[10px] sm:text-xs md:text-sm">{liveCount} Offerten heute</span>
              </PulsingBadge>
            </div>

            {/* Additional Trust Badges - hidden on small mobile */}
            <div className="hidden md:flex flex-wrap gap-2 pt-1 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
                <Shield className="w-3 h-3" />
                SSL verschlüsselt
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
                <MapPin className="w-3 h-3" />
                Schweizweit
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1.5 rounded-full">
                <Clock className="w-3 h-3" />
                24-48h Antwort
              </span>
            </div>
          </motion.div>

          {/* Right - Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mt-2 sm:mt-4 lg:mt-0"
          >
            <SpotlightCard className="p-3.5 sm:p-5 md:p-6 lg:p-8" spotlightColor="rgba(198, 124, 62, 0.1)">
              {/* Form Header */}
              <div className="text-center mb-3 sm:mb-4 md:mb-6">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground mb-1 sm:mb-1.5 md:mb-2">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-secondary" />
                  In 2 Minuten zum Vergleich
                </div>
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">
                  Kostenlos Offerten erhalten
                </h2>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3 md:space-y-4">
                {/* From Location */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2 relative">
                  <label className="text-[11px] sm:text-xs md:text-sm font-medium">Von (PLZ oder Ort)</label>
                  <Input
                    placeholder="z.B. 8001 oder Zürich"
                    value={fromLocation}
                    onChange={(e) => handleFromChange(e.target.value)}
                    onFocus={() => setShowFromSuggestions(fromSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowFromSuggestions(false), 200)}
                    className="h-10 sm:h-11 md:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                  {showFromSuggestions && fromSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-xl shadow-medium overflow-hidden">
                      {fromSuggestions.map((s) => (
                        <button
                          key={s.code}
                          type="button"
                          className="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 flex items-center gap-2"
                          onClick={() => {
                            setFromLocation(`${s.code} ${s.city}`);
                            setShowFromSuggestions(false);
                          }}
                        >
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{s.code}</span>
                          <span className="text-muted-foreground">{s.city}</span>
                          <span className="text-xs text-muted-foreground ml-auto">{s.canton}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* To Location */}
                <div className="space-y-1 sm:space-y-1.5 md:space-y-2 relative">
                  <label className="text-[11px] sm:text-xs md:text-sm font-medium">Nach (PLZ oder Ort)</label>
                  <Input
                    placeholder="z.B. 3011 oder Bern"
                    value={toLocation}
                    onChange={(e) => handleToChange(e.target.value)}
                    onFocus={() => setShowToSuggestions(toSuggestions.length > 0)}
                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                    className="h-10 sm:h-11 md:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base"
                  />
                  {showToSuggestions && toSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg sm:rounded-xl shadow-medium overflow-hidden">
                      {toSuggestions.map((s) => (
                        <button
                          key={s.code}
                          type="button"
                          className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-left text-xs sm:text-sm hover:bg-muted/50 active:bg-muted flex items-center gap-2"
                          onClick={() => {
                            setToLocation(`${s.code} ${s.city}`);
                            setShowToSuggestions(false);
                          }}
                        >
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                          <span className="font-medium">{s.code}</span>
                          <span className="text-muted-foreground">{s.city}</span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground ml-auto">{s.canton}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
                  <label className="text-[11px] sm:text-xs md:text-sm font-medium">Wohnungsgrösse</label>
                  <Select value={apartmentSize} onValueChange={setApartmentSize}>
                    <SelectTrigger className="h-10 sm:h-11 md:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base">
                      <SelectValue placeholder="Bitte wählen..." />
                    </SelectTrigger>
                    <SelectContent className="z-50 bg-card border border-border shadow-lg">
                      <SelectItem value="1-1.5" className="py-2.5 sm:py-2">1 – 1.5 Zimmer</SelectItem>
                      <SelectItem value="2-2.5" className="py-2.5 sm:py-2">2 – 2.5 Zimmer</SelectItem>
                      <SelectItem value="3-3.5" className="py-2.5 sm:py-2">3 – 3.5 Zimmer</SelectItem>
                      <SelectItem value="4-4.5" className="py-2.5 sm:py-2">4 – 4.5 Zimmer</SelectItem>
                      <SelectItem value="5+" className="py-2.5 sm:py-2">5+ Zimmer / Haus</SelectItem>
                      <SelectItem value="office" className="py-2.5 sm:py-2">Büro / Firma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <GlowingButton
                  type="submit"
                  size="lg"
                  className="w-full h-11 sm:h-12 md:h-14 rounded-lg sm:rounded-xl bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-xs sm:text-sm md:text-base active:scale-[0.98] transition-transform"
                  glowColor="hsl(var(--secondary))"
                  glowIntensity="high"
                >
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                  <span className="hidden xs:inline">Jetzt checken lassen</span>
                  <span className="xs:hidden">Jetzt checken</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ml-1.5 sm:ml-2 group-hover:translate-x-1 transition-transform" />
                </GlowingButton>
              </form>

              {/* Trust Points */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 md:pt-6 border-t border-border">
                <div className="flex items-center gap-1 md:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-green-500" />
                  Kostenlos
                </div>
                <div className="flex items-center gap-1 md:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-green-500" />
                  Unverbindlich
                </div>
                <div className="flex items-center gap-1 md:gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
                  <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-primary" />
                  Datenschutz
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
});
