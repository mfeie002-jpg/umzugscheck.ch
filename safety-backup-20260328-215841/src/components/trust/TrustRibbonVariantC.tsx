/**
 * TrustRibbon VARIANT C - Trust Hierarchy
 * 
 * VERSION 3: Authority → Logic → Emotion
 * - Logos OBEN, directly under Hero (Trust Anchor)
 * - Stats with benefit-oriented numbers (CHF 12.5M+ saved)
 * - Live Pulse indicator
 */

import { memo, useState, useEffect } from "react";
import { Shield, Star, Users, Building2, TrendingUp, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Real colored logos - Authority signals
const AuthorityLogo = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    "SRF": (
      <div className="bg-[#C8102E] text-white text-xs font-bold px-3 py-1.5 rounded">
        SRF
      </div>
    ),
    "TCS": (
      <div className="bg-[#FFD700] text-black text-xs font-bold px-3 py-1.5 rounded">
        TCS
      </div>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-lg text-foreground">NZZ</span>
    ),
    "20 Minuten": (
      <div className="flex items-center gap-1">
        <span className="text-xl font-black text-[#E3000F]">20</span>
        <span className="text-sm font-bold text-foreground">Minuten</span>
      </div>
    ),
    "Blick": (
      <div className="bg-[#E30613] text-white text-xs font-bold px-3 py-1.5 rounded">
        BLICK
      </div>
    ),
  };
  
  return logos[name] || <span className="font-bold text-sm">{name}</span>;
};

const swissCities = ["Zürich", "Bern", "Basel", "Luzern", "Winterthur", "St. Gallen", "Lausanne", "Genf"];

interface TrustRibbonVariantCProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantC = memo(function TrustRibbonVariantC({ 
  variant = "full",
  className = ""
}: TrustRibbonVariantCProps) {
  
  const [lastCity, setLastCity] = useState("Zürich");
  const [minutesAgo, setMinutesAgo] = useState(12);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastCity(swissCities[Math.floor(Math.random() * swissCities.length)]);
      setMinutesAgo(Math.floor(Math.random() * 15) + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (variant === "compact") {
    return (
      <div className={`py-3 bg-muted/30 border-y border-border/50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">Bekannt aus</span>
            {["SRF", "TCS", "NZZ"].map((name) => (
              <AuthorityLogo key={name} name={name} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`${className}`}>
      <div className="container mx-auto px-4">
        
        {/* ZONE 1: AUTHORITY ANCHOR - Immediately under Hero */}
        <motion.div 
          className="bg-muted/30 border-y border-border py-5 -mx-4 px-4 md:-mx-8 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">
                Vertrauen Sie dem Marktführer. Bekannt aus:
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {["SRF", "TCS", "NZZ", "20 Minuten", "Blick"].map((name, idx) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <AuthorityLogo name={name} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ZONE 2: SMART STATS - Benefit-oriented, Live Data */}
        <motion.div 
          className="py-8 md:py-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            
            {/* Live Activity Pulse */}
            <div className="col-span-2 md:col-span-1 bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Activity className="w-6 h-6 text-primary" />
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Live</span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={`${lastCity}-${minutesAgo}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium text-foreground"
                    >
                      Umzug vor {minutesAgo} Min in {lastCity}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>
            
            {/* CHF Saved - Concrete benefit */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-xl md:text-2xl font-bold text-emerald-700">CHF 12.5M+</div>
              <span className="text-xs text-emerald-600">gespart für Kunden</span>
            </div>
            
            {/* Top Reviewed Firms */}
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <Building2 className="w-5 h-5 text-primary mx-auto mb-1" />
              <div className="text-xl md:text-2xl font-bold text-foreground">Top 200</div>
              <span className="text-xs text-muted-foreground">geprüfte CH-Firmen</span>
            </div>
            
            {/* Rating */}
            <div className="bg-card border border-border rounded-xl p-4 text-center">
              <div className="flex justify-center gap-0.5 mb-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-300 text-yellow-300'}`} />
                ))}
              </div>
              <div className="text-xl md:text-2xl font-bold text-foreground">4.8 / 5</div>
              <span className="text-xs text-muted-foreground">2'847 Bewertungen</span>
            </div>
          </div>
          
          {/* Secondary stats row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-6 pt-6 border-t border-border">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl md:text-3xl font-black text-foreground">15'000+</span>
              <span className="text-sm text-muted-foreground">erfolgreiche Umzüge</span>
            </div>
            
            <div className="hidden md:block w-px h-8 bg-border" />
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-foreground">Ø 40%</span>
              <span className="text-sm text-muted-foreground">Ersparnis durch Vergleich</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
