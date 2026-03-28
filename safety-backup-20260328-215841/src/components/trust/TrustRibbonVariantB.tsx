/**
 * TrustRibbon VARIANT B - For A/B Testing
 * 
 * CHANGES vs A:
 * - Trust Anchor: Sleek monochrome logos strip, immediately validates
 * - Live Stats: "Ø Ersparnis heute: CHF 450" + "Letzter Umzug: 12 min ago"
 * - Premium, Apple-like design aesthetic
 */

import { memo, useState, useEffect } from "react";
import { Shield, Star, Users, Building2, TrendingUp, Clock, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Monochrome logos - premium, confident style (like Apple/Stripe)
const MonochromeLogo = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    "SRF": (
      <span className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">SRF</span>
    ),
    "TCS": (
      <span className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">TCS</span>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-base text-foreground/60 hover:text-foreground transition-colors tracking-tight">NZZ</span>
    ),
    "20 Minuten": (
      <span className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">20 Minuten</span>
    ),
    "Blick": (
      <span className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors uppercase">Blick</span>
    ),
    "Watson": (
      <span className="text-sm font-bold text-foreground/60 hover:text-foreground transition-colors">watson</span>
    ),
  };
  
  return logos[name] || <span className="font-bold text-sm text-foreground/60">{name}</span>;
};

// Live activity cities
const swissCities = ["Zürich", "Bern", "Basel", "Luzern", "Winterthur", "St. Gallen", "Lausanne", "Genf", "Aarau", "Thun"];

interface TrustRibbonVariantBProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbonVariantB = memo(function TrustRibbonVariantB({ 
  variant = "full",
  className = ""
}: TrustRibbonVariantBProps) {
  
  // Live activity simulation
  const [lastCity, setLastCity] = useState("Zürich");
  const [minutesAgo, setMinutesAgo] = useState(3);
  const [todaySavings, setTodaySavings] = useState(450);
  const [offersToday, setOffersToday] = useState(47);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastCity(swissCities[Math.floor(Math.random() * swissCities.length)]);
      setMinutesAgo(Math.floor(Math.random() * 12) + 1);
      setTodaySavings(Math.floor(Math.random() * 300) + 350);
      setOffersToday(prev => prev + Math.floor(Math.random() * 3));
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  if (variant === "compact") {
    return (
      <div className={`py-3 bg-muted/30 border-y border-border/50 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm text-muted-foreground">
                Letzter Umzug vor <span className="font-semibold text-foreground">{minutesAgo} Min</span> in {lastCity}
              </span>
            </div>
            <div className="flex items-center gap-4">
              {["SRF", "TCS", "NZZ"].map((name) => (
                <MonochromeLogo key={name} name={name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-6 md:py-8 ${className}`}>
      <div className="container mx-auto px-4">
        
        {/* TRUST ANCHOR - Sleek Logo Strip (immediately under Hero) */}
        <motion.div 
          className="bg-muted/40 border-y border-border/50 py-4 -mx-4 px-4 md:-mx-8 md:px-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-6">
            <span className="text-xs text-muted-foreground uppercase tracking-widest">
              Vertrauen Sie dem Marktführer
            </span>
            
            {/* Desktop: Static row */}
            <div className="hidden md:flex items-center gap-6">
              {["SRF", "TCS", "NZZ", "20 Minuten", "Blick", "Watson"].map((name, idx) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                >
                  <MonochromeLogo name={name} />
                </motion.div>
              ))}
            </div>
            
            {/* Mobile: Marquee scroll */}
            <div className="md:hidden overflow-hidden w-full">
              <motion.div 
                className="flex items-center gap-8 whitespace-nowrap"
                animate={{ x: [0, -200] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                {["SRF", "TCS", "NZZ", "20 Minuten", "Blick", "Watson", "SRF", "TCS", "NZZ"].map((name, idx) => (
                  <MonochromeLogo key={`${name}-${idx}`} name={name} />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* LIVE DASHBOARD - The "Pulse" */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Live Activity */}
          <div className="col-span-2 bg-card border border-border rounded-xl p-4 flex items-center gap-4">
            <div className="relative">
              <Activity className="w-8 h-8 text-primary" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Live Aktivität</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p 
                  key={`${lastCity}-${minutesAgo}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="font-semibold text-foreground"
                >
                  Letzter Umzug vor <span className="text-primary">{minutesAgo} Min</span> in {lastCity}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Today's Savings */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
            <TrendingUp className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <AnimatePresence mode="wait">
              <motion.div 
                key={todaySavings}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold text-emerald-700"
              >
                CHF {todaySavings}.-
              </motion.div>
            </AnimatePresence>
            <span className="text-xs text-emerald-600">Ø Ersparnis heute</span>
          </div>
          
          {/* Offers Generated */}
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <Clock className="w-5 h-5 text-primary mx-auto mb-1" />
            <motion.div 
              key={offersToday}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold text-foreground"
            >
              {offersToday}
            </motion.div>
            <span className="text-xs text-muted-foreground">Offerten heute</span>
          </div>
        </motion.div>

        {/* CORE STATS - Centered, clean */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-3xl md:text-4xl font-black text-foreground">15'000+</span>
            <span className="text-sm text-muted-foreground">Umzüge</span>
          </div>
          
          <div className="hidden md:block w-px h-8 bg-border" />
          
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-yellow-400/80 text-yellow-400/80'}`} />
              ))}
            </div>
            <span className="text-lg font-bold text-foreground">4.9</span>
            <span className="text-sm text-muted-foreground">Bewertung</span>
          </div>
          
          <div className="hidden md:block w-px h-8 bg-border" />
          
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Top 200</span>
            <span className="text-sm text-muted-foreground">geprüfte Firmen</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
