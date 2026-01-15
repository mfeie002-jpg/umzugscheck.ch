import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Shield, Star, Users, CheckCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RegionData, CANTONS, searchPlaces } from "@/data/regions-database";
import { setPrefill } from "@/lib/prefill";
import { RegionLiveCounter } from "./RegionLiveCounter";
import { MicroTrustRow } from "./shared/MicroTrustRow";
import { MobileCantonSheet } from "./MobileCantonSheet";

interface RegionHeroProps {
  region: RegionData;
  onRegionChange?: (slug: string) => void;
}

export const RegionHero = ({ region, onRegionChange }: RegionHeroProps) => {
  const navigate = useNavigate();
  const [fromValue, setFromValue] = useState(region.name);
  const [toValue, setToValue] = useState("");
  const [toSuggestions, setToSuggestions] = useState<Array<{ label: string; slug: string }>>([]);
  const [showToSuggestions, setShowToSuggestions] = useState(false);
  const [showCantonSelector, setShowCantonSelector] = useState(false);
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  // Prefill from location with region name
  useEffect(() => {
    setFromValue(region.name);
  }, [region.name]);

  // Handle "Nach" input with autocomplete
  const handleToChange = (value: string) => {
    setToValue(value);
    if (value.length >= 2) {
      const results = searchPlaces(value).slice(0, 5);
      setToSuggestions(results.map(p => ({ label: p.label, slug: p.slug })));
      setShowToSuggestions(true);
    } else {
      setShowToSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set prefill data
    setPrefill({
      from: fromValue,
      to: toValue,
      source: `region_${region.slug}`,
      cantonCode: region.short,
    });
    
    // Navigate to funnel
    navigate("/umzugsofferten");
  };

  return (
    <section className="relative min-h-[70vh] md:min-h-[75vh] flex items-center py-8 md:py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80&auto=format&fit=crop"
          alt={`Umzugsfirmen in ${region.name} - Professionelle Hilfe beim Umziehen`}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Canton Selector - Desktop Dropdown / Mobile Bottom Sheet */}
        <div className="mb-4 md:mb-6">
          {/* Desktop: Dropdown */}
          <div className="relative hidden md:inline-block">
            <button
              onClick={() => setShowCantonSelector(!showCantonSelector)}
              className="flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>{region.name} ({region.short})</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showCantonSelector ? 'rotate-180' : ''}`} />
            </button>
            
            {showCantonSelector && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-0 mt-2 bg-card border rounded-xl shadow-lg p-3 z-50 max-h-64 overflow-y-auto w-48"
              >
                {CANTONS.map(canton => (
                  <button
                    key={canton.slug}
                    onClick={() => {
                      onRegionChange?.(canton.slug);
                      setShowCantonSelector(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-accent transition-colors ${
                      canton.slug === region.slug ? 'bg-primary/10 text-primary font-medium' : ''
                    }`}
                  >
                    {canton.name} ({canton.short})
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Mobile: Opens Bottom Sheet */}
          <button
            onClick={() => setShowMobileSheet(true)}
            className="md:hidden flex items-center gap-2 text-sm text-white/90 hover:text-white transition-colors touch-manipulation py-2"
          >
            <MapPin className="w-4 h-4" />
            <span>{region.name} ({region.short})</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Mobile Bottom Sheet */}
          <MobileCantonSheet
            isOpen={showMobileSheet}
            onClose={() => setShowMobileSheet(false)}
            currentSlug={region.slug}
            onSelect={(slug) => onRegionChange?.(slug)}
          />
        </div>

        {/* Live Counter */}
        <RegionLiveCounter 
          region={region.name} 
          baseCount={region.stats.activeUsersBase} 
        />

        {/* Main Content */}
        <div className="max-w-4xl">
          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Umzugsfirmen {region.name}
            <span className="text-primary"> – Jetzt gratis vergleichen</span>
          </motion.h1>

          {/* Subline with Stats */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-white/90 mb-6"
          >
            Vergleichen Sie {region.stats.providerCount}+ geprüfte Umzugsfirmen in {region.name} 
            und erhalten Sie kostenlose Offerten.
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-wrap gap-4 md:gap-6 mb-8 text-white"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="font-semibold">{region.stats.avgRating}</span>
              <span className="text-white/80 text-sm">Bewertung</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white" />
              <span className="font-semibold">{region.stats.reviewCount.toLocaleString('de-CH')}+</span>
              <span className="text-white/80 text-sm">Bewertungen</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="font-semibold">{region.stats.providerCount}+</span>
              <span className="text-white/80 text-sm">Firmen</span>
            </div>
          </motion.div>

          {/* Mini Funnel Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border/50 rounded-2xl p-4 md:p-6 shadow-lg max-w-2xl"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Von (Prefilled) */}
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
                    inputMode="text"
                    autoCapitalize="words"
                  />
                </div>
              </div>

              {/* Nach */}
              <div className="relative">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Nach (Zielort)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={toValue}
                    onChange={(e) => handleToChange(e.target.value)}
                    onBlur={() => setTimeout(() => setShowToSuggestions(false), 200)}
                    placeholder="Wohin ziehen Sie?"
                    className="pl-10 h-12 text-base"
                    inputMode="text"
                    autoCapitalize="words"
                  />
                </div>
                
                {/* Autocomplete Suggestions */}
                {showToSuggestions && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 overflow-hidden">
                    {toSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setToValue(suggestion.label);
                          setShowToSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-accent transition-colors text-sm"
                      >
                        {suggestion.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              Jetzt Offerten anfordern
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Trust Badges */}
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
                <Star className="w-4 h-4 text-green-600" />
                Geprüfte Partner
              </span>
            </div>
          </motion.form>

          {/* Micro Trust Row */}
          <MicroTrustRow className="mt-6" />
        </div>
      </div>
    </section>
  );
};
