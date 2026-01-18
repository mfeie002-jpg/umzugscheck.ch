/**
 * UnifiedHero - Homepage-Style Hero für alle Landingpages
 * 
 * Verwendet auf:
 * - /umzugsfirmen/:city (CityMovers)
 * - /umzugsfirmen/kanton-:slug (RegionArchetypPage)
 * - Service-Pages
 * 
 * NOW INCLUDES Video/Form Tabs like Homepage!
 * - Both options are easily accessible
 * - Not intimidating for users scared of video upload
 */

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, ArrowRight, Star, CheckCircle, Users, 
  Sparkles, Camera, TrendingUp, Shield, Video, FileText, Upload, Phone, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { swissPostalCodes, PostalCodeEntry } from "@/lib/swiss-postal-codes";

interface UnifiedHeroProps {
  // Core content
  title: string;
  titleAccent?: string;
  subtitle: string;
  
  // Location context
  locationName: string;
  locationShort?: string;
  
  // Stats
  stats?: {
    rating?: number;
    reviewCount?: number;
    providerCount?: number;
    activeUsers?: number;
  };
  
  // Visual
  backgroundImage: string;
  
  // Prefill for calculator
  prefillFrom?: string;
  
  // Type for styling variations
  variant?: 'city' | 'canton' | 'service' | 'home';
  
  // Show video option (default true)
  showVideoOption?: boolean;
}

export const UnifiedHero = ({
  title,
  titleAccent,
  subtitle,
  locationName,
  locationShort,
  stats = {
    rating: 4.8,
    reviewCount: 2847,
    providerCount: 200,
    activeUsers: 12
  },
  backgroundImage,
  prefillFrom = "",
  variant = 'city',
  showVideoOption = true
}: UnifiedHeroProps) => {
  const navigate = useNavigate();
  const [fromQuery, setFromQuery] = useState(prefillFrom || locationName);
  const [toQuery, setToQuery] = useState("");
  const [fromSelected, setFromSelected] = useState<PostalCodeEntry | null>(null);
  const [toSelected, setToSelected] = useState<PostalCodeEntry | null>(null);
  const [liveCount, setLiveCount] = useState(stats.activeUsers || 12);

  // Live counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filterPostalCodes = (query: string): PostalCodeEntry[] => {
    if (!query || query.trim().length < 1) {
      return swissPostalCodes.slice(0, 20);
    }
    const lowerQuery = query.toLowerCase().trim();
    return swissPostalCodes
      .filter(entry => 
        entry.code.startsWith(lowerQuery) || 
        entry.city.toLowerCase().startsWith(lowerQuery) ||
        entry.city.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 50);
  };

  const handleFromChange = (value: string) => {
    setFromQuery(value);
    const match = value.match(/^(\d{4})\s*-\s*(.+)$/);
    if (match) {
      const [, code, city] = match;
      const entry = swissPostalCodes.find(e => e.code === code && e.city === city.trim());
      if (entry) setFromSelected(entry);
    } else {
      const directMatch = swissPostalCodes.find(e => e.code === value.trim());
      if (directMatch) setFromSelected(directMatch);
      else setFromSelected(null);
    }
  };

  const handleToChange = (value: string) => {
    setToQuery(value);
    const match = value.match(/^(\d{4})\s*-\s*(.+)$/);
    if (match) {
      const [, code, city] = match;
      const entry = swissPostalCodes.find(e => e.code === code && e.city === city.trim());
      if (entry) setToSelected(entry);
    } else {
      const directMatch = swissPostalCodes.find(e => e.code === value.trim());
      if (directMatch) setToSelected(directMatch);
      else setToSelected(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fromAddress = fromSelected 
      ? `${fromSelected.code} ${fromSelected.city}`
      : fromQuery;
    const toAddress = toSelected 
      ? `${toSelected.code} ${toSelected.city}`
      : toQuery;
    
    if (fromAddress && toAddress) {
      navigate(`/rechner?from=${encodeURIComponent(fromAddress)}&to=${encodeURIComponent(toAddress)}`);
    } else {
      navigate('/umzugsofferten');
    }
  };

  return (
    <section className="relative min-h-[75vh] md:min-h-[80vh] flex items-center overflow-hidden">
      {/* Background Image with Homepage-style Light Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage}
          alt={`Umzugsfirmen in ${locationName} vergleichen`}
          className="w-full h-full object-cover scale-105"
          loading="eager"
          fetchPriority="high"
        />
        {/* Light Overlay - same as Homepage */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/98 to-background/80 md:via-background/95 md:to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-background/40 md:via-transparent md:to-background/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Column - Text Content */}
          <div className="text-left">
            {/* Feature Badges - Like Homepage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-secondary" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-secondary uppercase tracking-wide">BIS 40% SPAREN</div>
                  <div className="text-xs text-muted-foreground">durch Vergleich</div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2.5 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-primary uppercase tracking-wide">SCHWEIZER INNOVATION</div>
                  <div className="text-xs text-muted-foreground">KI Video-Rechner</div>
                </div>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight"
            >
              {title}
              {titleAccent && (
                <>
                  <br className="hidden sm:block" />
                  <span className="text-primary"> {titleAccent}</span>
                </>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base md:text-lg lg:text-xl text-muted-foreground mb-6 max-w-xl"
            >
              {subtitle}
            </motion.p>

            {/* Trust Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <div className="inline-flex items-center gap-1.5 bg-green-500/15 px-3 py-1.5 rounded-full text-sm text-green-700 dark:text-green-400 font-semibold border border-green-500/20">
                <TrendingUp className="w-4 h-4" />
                <span>Bis 40% günstiger</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full text-sm text-primary font-semibold border border-primary/20">
                <Camera className="w-4 h-4" />
                <span>Video-Analyse</span>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-muted px-3 py-1.5 rounded-full text-sm text-muted-foreground border border-border">
                <CheckCircle className="w-4 h-4" />
                <span>{stats.providerCount}+ Firmen</span>
              </div>
            </motion.div>

            {/* Live Signal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="inline-flex items-center gap-2 bg-muted/80 backdrop-blur-sm rounded-full px-4 py-2 border border-border mb-6"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {liveCount} Personen vergleichen gerade {variant === 'canton' ? 'im Kanton' : 'in'} {locationName}
              </span>
            </motion.div>

            {/* Mobile CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:hidden"
            >
              <Button 
                size="lg"
                onClick={() => navigate('/umzugsofferten')}
                className="w-full h-14 text-base font-bold gradient-cta text-white shadow-strong"
              >
                Kostenlos Offerten erhalten
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Right Column - Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-5 md:p-6 max-w-md mx-auto">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-foreground mb-1">
                  Wie möchten Sie starten?
                </h2>
                <p className="text-sm text-muted-foreground">
                  Wählen Sie Ihre bevorzugte Methode
                </p>
              </div>

              {/* Tabs - Form default, Video as option */}
              <Tabs defaultValue="form" className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted/50 mb-4">
                  <TabsTrigger 
                    value="form" 
                    className="text-sm font-medium gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white h-full rounded-lg"
                  >
                    <FileText className="h-4 w-4" />
                    Formular
                  </TabsTrigger>
                  {showVideoOption && (
                    <TabsTrigger 
                      value="video" 
                      className="text-sm font-medium gap-1.5 data-[state=active]:bg-secondary data-[state=active]:text-white h-full rounded-lg"
                    >
                      <Video className="h-4 w-4" />
                      Video/Fotos
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-secondary/20 text-secondary rounded font-normal">
                        NEU
                      </span>
                    </TabsTrigger>
                  )}
                </TabsList>
                
                {/* Video Tab */}
                {showVideoOption && (
                  <TabsContent value="video" className="space-y-3">
                    <Link to="/video-offerte" className="block">
                      <div className="relative group cursor-pointer">
                        <div className="border-2 border-secondary/40 hover:border-secondary rounded-xl p-5 text-center transition-all bg-gradient-to-br from-secondary/5 to-secondary/10 hover:from-secondary/10 hover:to-secondary/15">
                          <div className="flex items-center justify-center gap-3 mb-3">
                            <div className="w-11 h-11 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Video className="h-5 w-5 text-secondary" />
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-secondary/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Upload className="h-5 w-5 text-secondary" />
                            </div>
                          </div>
                          <p className="font-semibold text-sm text-foreground mb-1">
                            Video oder Fotos hochladen
                          </p>
                          <p className="text-xs text-muted-foreground mb-2">
                            KI analysiert & berechnet automatisch
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Schneller
                            </span>
                            <span className="inline-flex items-center gap-1 text-secondary font-medium bg-secondary/10 px-2 py-1 rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              Genauer
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    {/* Privacy reassurance */}
                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground">
                      <Shield className="h-3 w-3 text-primary" />
                      <span>100% sicher · Nur für Ihre Offerte</span>
                    </div>
                  </TabsContent>
                )}
                
                {/* Form Tab - with Video Hint */}
                <TabsContent value="form" className="space-y-3">
                  {/* Video Hint Banner */}
                  {showVideoOption && (
                    <Link to="/video-offerte" className="block group">
                      <div className="flex items-center gap-3 p-2.5 bg-secondary/10 hover:bg-secondary/15 rounded-lg border border-secondary/20 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center flex-shrink-0">
                          <Video className="h-4 w-4 text-secondary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">Schneller mit Video?</p>
                          <p className="text-[10px] text-muted-foreground">KI berechnet automatisch</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-secondary group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                      </div>
                    </Link>
                  )}
                  
                  <p className="text-xs text-muted-foreground text-center">
                    Schritt 1 von 4 · Dauer ca. 2 Minuten
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Von (PLZ oder Ort)
                      </label>
                      <Input
                        type="text"
                        placeholder={`z.B. 8001 oder ${locationName}`}
                        value={fromQuery}
                        onChange={(e) => handleFromChange(e.target.value)}
                        list="heroFromPostalList"
                        className="h-11 text-base border-border bg-white"
                      />
                      <datalist id="heroFromPostalList">
                        {filterPostalCodes(fromQuery).map((entry) => (
                          <option 
                            key={`${entry.code}-${entry.city}`} 
                            value={`${entry.code} - ${entry.city}`}
                          />
                        ))}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Nach (PLZ oder Ort)
                      </label>
                      <Input
                        type="text"
                        placeholder="z.B. 3011 oder Bern"
                        value={toQuery}
                        onChange={(e) => handleToChange(e.target.value)}
                        list="heroToPostalList"
                        className="h-11 text-base border-border bg-white"
                      />
                      <datalist id="heroToPostalList">
                        {filterPostalCodes(toQuery).map((entry) => (
                          <option 
                            key={`${entry.code}-${entry.city}`} 
                            value={`${entry.code} - ${entry.city}`}
                          />
                        ))}
                      </datalist>
                    </div>

                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full h-12 text-base font-bold gradient-cta text-white shadow-strong"
                    >
                      Preise jetzt vergleichen
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              {/* Trust Row */}
              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  Kostenlos
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  Unverbindlich
                </span>
                <span className="flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-green-600" />
                  Datenschutz
                </span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-white/70 text-center mt-4 max-w-md mx-auto">
              Umzugscheck.ch ist ein Vergleichs- & Vermittlungsservice. Die Durchführung erfolgt durch geprüfte Partnerfirmen.
            </p>
          </motion.div>
        </div>

        {/* Bottom Trust Row - Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hidden lg:flex items-center justify-center gap-6 mt-8 text-white"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Kostenlos</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>Unverbindlich</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span>{stats.rating}/5 Bewertung</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>24h Offerten</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
