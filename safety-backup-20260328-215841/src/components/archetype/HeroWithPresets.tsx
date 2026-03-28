/**
 * HERO WITH PRESETS
 * 
 * Gold Standard shared hero component for all archetype pages:
 * - Canton pages
 * - City pages
 * - Service + Canton pages
 * - Service + City pages
 * 
 * Features:
 * - Segmented toggle (Innerhalb/Nach/Von)
 * - Pre-filled location context
 * - Optional service preselection
 * - Trust microbar
 * - Mobile-optimized
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  MapPin, ArrowRight, Star, CheckCircle, Users, 
  Shield, Clock, ChevronDown, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PageType = 'canton' | 'city' | 'serviceCanton' | 'serviceCity';
type MoveDirection = 'within' | 'to' | 'from';

interface HeroWithPresetsProps {
  pageType: PageType;
  placeName: string;
  placeSlug: string;
  
  // SEO
  h1: string;
  subtitle: string;
  
  // Stats
  stats: {
    providerCount: number;
    reviewCount: number;
    avgRating: number;
    activeUsersBase?: number;
  };
  
  // Visual
  backgroundImage?: string;
  
  // Canton-specific
  cantonName?: string;
  citiesInCanton?: Array<{ name: string; slug: string }>;
  
  // City-specific
  quartiere?: string[];
  
  // Service-specific
  serviceName?: string;
  serviceSlug?: string;
}

export const HeroWithPresets = ({
  pageType,
  placeName,
  placeSlug,
  h1,
  subtitle,
  stats,
  backgroundImage,
  cantonName,
  citiesInCanton = [],
  quartiere = [],
  serviceName,
  serviceSlug,
}: HeroWithPresetsProps) => {
  const navigate = useNavigate();
  
  // Form state
  const [moveDirection, setMoveDirection] = useState<MoveDirection>('within');
  const [fromValue, setFromValue] = useState('');
  const [toValue, setToValue] = useState('');
  
  // Live counter
  const [liveCount, setLiveCount] = useState(stats.activeUsersBase || 12);
  
  // Determine if this is a canton or city context
  const isCanton = pageType === 'canton' || pageType === 'serviceCanton';
  const isService = pageType === 'serviceCanton' || pageType === 'serviceCity';
  const locationPrefix = isCanton ? 'im Kanton' : 'in';
  
  // Update prefill based on direction
  useEffect(() => {
    if (moveDirection === 'within') {
      setFromValue(placeName);
      setToValue('');
    } else if (moveDirection === 'to') {
      setFromValue('');
      setToValue(placeName);
    } else if (moveDirection === 'from') {
      setFromValue(placeName);
      setToValue('');
    }
  }, [moveDirection, placeName]);
  
  // Live counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(prev => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (fromValue) params.set('from', fromValue);
    if (toValue) params.set('to', toValue);
    params.set('placeContext', placeName);
    params.set('pageType', pageType);
    params.set('placeSlug', placeSlug);
    if (serviceSlug) params.set('service', serviceSlug);
    
    navigate(`/umzugsofferten?${params.toString()}`);
  };
  
  const scrollToPreise = () => {
    const element = document.getElementById('preise');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Direction labels based on page type
  const directionLabels = isCanton 
    ? {
        within: `Innerhalb Kanton ${placeName}`,
        to: `Nach Kanton ${placeName}`,
        from: `Von Kanton ${placeName}`,
      }
    : {
        within: `Innerhalb ${placeName}`,
        to: `Nach ${placeName}`,
        from: `Von ${placeName}`,
      };

  return (
    <section 
      id="offerten"
      className="relative min-h-[75vh] md:min-h-[80vh] flex items-center overflow-hidden scroll-mt-16"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        {backgroundImage ? (
          <img 
            src={backgroundImage}
            alt={`Umzug ${locationPrefix} ${placeName}`}
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-8 md:py-16">
        {/* Service Badge (if service page) */}
        {isService && serviceName && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-3 border border-primary/30"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Service: {serviceName}</span>
          </motion.div>
        )}

        {/* Live Signal */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isService ? 0.1 : 0 }}
          className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 border border-green-400/30"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
          </span>
          <span className="text-sm">
            {liveCount} Personen vergleichen gerade {locationPrefix} {placeName}
          </span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 max-w-4xl"
        >
          {h1}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl"
        >
          {subtitle}
        </motion.p>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 md:gap-6 mb-8 text-white"
        >
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{stats.avgRating}</span>
            <span className="text-white/80 text-sm">Bewertung</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-white" />
            <span className="font-semibold">{stats.reviewCount.toLocaleString('de-CH')}+</span>
            <span className="text-white/80 text-sm">Bewertungen</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="font-semibold">{stats.providerCount}+</span>
            <span className="text-white/80 text-sm">Firmen</span>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card/95 backdrop-blur-sm border border-border/50 rounded-2xl p-4 md:p-6 shadow-xl max-w-2xl"
        >
          {/* Direction Toggle */}
          <div className="flex flex-wrap gap-2 mb-4">
            {(['within', 'to', 'from'] as MoveDirection[]).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => setMoveDirection(direction)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all",
                  moveDirection === direction
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-muted-foreground"
                )}
              >
                {directionLabels[direction]}
              </button>
            ))}
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {/* Von */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Von (Startort)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <Input
                  type="text"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  placeholder="PLZ oder Ort"
                  className="pl-10 h-12 text-base"
                  readOnly={moveDirection === 'from' || moveDirection === 'within'}
                />
              </div>
            </div>

            {/* Nach */}
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Nach (Zielort)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={toValue}
                  onChange={(e) => setToValue(e.target.value)}
                  placeholder="Wohin ziehen Sie?"
                  className="pl-10 h-12 text-base"
                  readOnly={moveDirection === 'to'}
                />
              </div>
            </div>
          </div>

          {/* Canton: Gemeinde Chips */}
          {isCanton && moveDirection === 'within' && citiesInCanton.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Beliebte Gemeinden:</p>
              <div className="flex flex-wrap gap-2">
                {citiesInCanton.slice(0, 6).map((city) => (
                  <button
                    key={city.slug}
                    type="button"
                    onClick={() => setFromValue(city.name)}
                    className={cn(
                      "px-3 py-1.5 text-xs rounded-full border transition-all",
                      fromValue === city.name
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 hover:bg-muted border-border"
                    )}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* City: Quartier Chips */}
          {!isCanton && quartiere.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Quartiere in {placeName}:</p>
              <div className="flex flex-wrap gap-2">
                {quartiere.slice(0, 4).map((quartier) => (
                  <span
                    key={quartier}
                    className="px-3 py-1.5 text-xs rounded-full bg-muted/50 border border-border text-muted-foreground"
                  >
                    {quartier}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90"
          >
            Gratis Offerten erhalten
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          {/* Micro Trust */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-green-600" />
              100% Kostenlos
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Unverbindlich
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-green-600" />
              Offerten in 24–48h
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-green-600" />
              Bis zu 40% sparen
            </span>
          </div>

          {/* Secondary CTA */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={scrollToPreise}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Preise {locationPrefix} {placeName} ansehen
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </motion.form>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-white/60 mt-4 max-w-2xl"
        >
          Umzugscheck.ch ist ein Vergleichs- & Vermittlungsservice. 
          Die Durchführung erfolgt durch geprüfte Partnerfirmen.
        </motion.p>
      </div>
    </section>
  );
};
