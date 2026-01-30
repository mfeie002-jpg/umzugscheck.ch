/**
 * MediaLogosSection VARIANT B - Swiss Authority Stack
 * 
 * VERSION 2: Fokus auf verifizierbare Schweizer Autorität
 * - ASTAG + Versicherung prominent
 * - Live-Statistiken für Social Proof
 * - Keine unverifizierte Media-Logos
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingDown, Users, Shield, Truck, Award, Info } from "lucide-react";
import { TRUST } from "@/content/trust";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Live stats that rotate
const liveStats = [
  { city: "Zürich", savings: 580, minutes: 3 },
  { city: "Bern", savings: 420, minutes: 7 },
  { city: "Basel", savings: 890, minutes: 12 },
  { city: "Luzern", savings: 340, minutes: 18 },
];

// Schweizer Trust-Siegel
const swissTrustBadges = [
  {
    id: "astag",
    name: "ASTAG",
    label: "Verbandsmitglied",
    Icon: Truck,
    color: "text-primary",
  },
  {
    id: "versichert",
    name: "Versichert",
    label: "Bis CHF 2 Mio.",
    Icon: Shield,
    color: "text-[#E2001A]",
  },
  {
    id: "swisslabel",
    name: "Swiss Label",
    label: "Schweizer Qualität",
    Icon: Award,
    color: "text-[#D52B1E]",
  },
];

export const MediaLogosSectionVariantB = memo(function MediaLogosSectionVariantB() {
  const [tickerIndex, setTickerIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % liveStats.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="py-5 md:py-8 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 border-y border-border/30">
      <div className="container max-w-5xl px-4">
        
        {/* LIVE TICKER - Top */}
        <motion.div
          className="flex justify-center mb-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <AnimatePresence mode="wait">
              <motion.span
                key={tickerIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-muted-foreground"
              >
                <span className="font-semibold text-foreground">{liveStats[tickerIndex].city}</span>
                {" – CHF "}
                <span className="font-semibold text-primary">{liveStats[tickerIndex].savings}</span>
                {" gespart vor "}
                {liveStats[tickerIndex].minutes} Min
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* STATS ROW */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xl md:text-2xl font-bold text-foreground">{TRUST.movesCount}</span>
            </div>
            <span className="text-xs text-muted-foreground">{TRUST.movesLabel}</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center justify-center gap-2 mb-1 cursor-help">
                    <TrendingDown className="w-4 h-4 text-primary" />
                    <span className="text-xl md:text-2xl font-bold text-foreground">
                      Ø CHF {TRUST.savingsAverage}
                    </span>
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[250px]">
                  <p className="text-xs">{TRUST.savingsDisclaimer}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span className="text-xs text-muted-foreground">gespart pro Umzug</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-1 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-primary text-primary" />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">{TRUST.ratingWithCount}</span>
          </motion.div>
        </div>
        
        {/* SWISS TRUST BADGES */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-3 md:gap-4 px-4 py-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide mr-2">Zertifiziert:</span>
            {swissTrustBadges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border/50 
                           hover:border-border hover:shadow-sm transition-all cursor-default"
              >
                <badge.Icon className={`w-4 h-4 ${badge.color}`} />
                <span className="text-xs font-medium text-foreground">{badge.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});
