/**
 * MediaLogosSection VARIANT B - Live Dashboard + Deal Cards Style
 * 
 * VERSION 2: Dynamic stats with monochrome media logos
 * - Live activity ticker
 * - Media logos (NZZ, SRF, Blick, etc.) in grayscale
 * - Dynamic savings counter
 */

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, TrendingDown, Users, Clock, Sparkles } from "lucide-react";

// Live stats that rotate
const liveStats = [
  { city: "Zürich", savings: 580, minutes: 3 },
  { city: "Bern", savings: 420, minutes: 7 },
  { city: "Basel", savings: 890, minutes: 12 },
  { city: "Luzern", savings: 340, minutes: 18 },
];

// Media logos - bekannte Schweizer Medien
const mediaLogos = [
  { name: "SRF", abbr: "SRF" },
  { name: "NZZ", abbr: "NZZ" },
  { name: "20min", abbr: "20'" },
  { name: "Blick", abbr: "BL" },
  { name: "Watson", abbr: "W" },
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
              <span className="text-xl md:text-2xl font-bold text-foreground">15'000+</span>
            </div>
            <span className="text-xs text-muted-foreground">Anfragen/Jahr</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingDown className="w-4 h-4 text-primary" />
              <span className="text-xl md:text-2xl font-bold text-foreground">Ø CHF 620</span>
            </div>
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
            <span className="text-xs text-muted-foreground">4.8/5 (2'847 Bewertungen)</span>
          </motion.div>
        </div>
        
        {/* MEDIA LOGOS - Monochrome */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div className="flex items-center gap-2 md:gap-4 px-4 py-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide mr-2">Bekannt aus:</span>
            {mediaLogos.map((logo, i) => (
              <div
                key={logo.name}
                className="px-2 py-1 rounded bg-muted/50 text-xs font-bold text-muted-foreground 
                           hover:text-foreground hover:bg-muted transition-colors cursor-default"
              >
                {logo.abbr}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
});
