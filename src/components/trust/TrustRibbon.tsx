/**
 * TrustRibbon - BEKANNT AUS & STATS
 * 
 * Nach User-Feedback:
 * ✅ BEKANNT AUS - Echte farbige Logos, PROMINENT
 * ✅ 15'000+ RIESIG, Rest klein als Support
 * ✅ Klare visuelle Hierarchie
 */

import { memo } from "react";
import { Shield, Star, Users, Building2, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

// Media logos with REAL brand colors - NOT greyed out
const MediaLogo = ({ name }: { name: string }) => {
  const logos: Record<string, JSX.Element> = {
    "20 Minuten": (
      <div className="flex items-center gap-1">
        <span className="text-xl font-black text-[#E3000F]">20</span>
        <span className="text-base font-bold text-foreground">Minuten</span>
      </div>
    ),
    "SRF": (
      <div className="bg-[#C8102E] text-white text-xs font-bold px-2.5 py-1 rounded">
        SRF
      </div>
    ),
    "Blick": (
      <div className="bg-[#E30613] text-white text-xs font-bold px-2.5 py-1 rounded">
        BLICK
      </div>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-lg text-foreground tracking-tight">NZZ</span>
    ),
    "Watson": (
      <span className="font-bold text-base text-[#00A4E4]">watson</span>
    ),
    "TCS": (
      <div className="bg-[#FFD700] text-black text-xs font-bold px-2.5 py-1 rounded">
        TCS
      </div>
    ),
  };
  
  return logos[name] || <span className="font-bold text-lg">{name}</span>;
};

interface TrustRibbonProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbon = memo(function TrustRibbon({ 
  variant = "full",
  className = ""
}: TrustRibbonProps) {
  
  // Compact version: Just the key stat strip - MOBILE OPTIMIZED
  if (variant === "compact") {
    return (
      <div className={`py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-y border-primary/20 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-2xl font-black text-primary">15'000+</span>
              <span className="text-sm text-muted-foreground">Umzüge</span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-primary/20" />
            
            {/* Rating */}
            <div className="flex items-center gap-2 md:gap-3 order-3 sm:order-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl md:text-2xl font-black text-foreground">4.8</span>
            </div>
            <div className="flex items-center gap-3">
              {["SRF", "NZZ", "Blick"].map((name) => (
                <MediaLogo key={name} name={name} />
              ))}
              <span className="text-xs md:text-sm font-semibold text-muted-foreground">& mehr</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version with all elements - MOBILE FIRST
  return (
    <section className={`py-10 md:py-14 ${className}`}>
      <div className="container mx-auto px-4">
        
        {/* ============================================ */}
        {/* 1. BEKANNT AUS - TOP POSITION, COLORED LOGOS */}
        {/* ============================================ */}
        <motion.div 
          className="bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-2 border-primary/20 rounded-2xl py-6 px-4 mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Label */}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary uppercase tracking-wide">Bekannt aus</span>
            </div>
            
            {/* Logos - COLORED, not grey */}
            <div className="flex flex-wrap items-center justify-center gap-5 md:gap-6">
              {["20 Minuten", "SRF", "Blick", "NZZ", "Watson", "TCS"].map((name) => (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.1 }}
                  className="cursor-pointer"
                >
                  <MediaLogo name={name} />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Trust statement */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
            <span className="text-foreground font-semibold">97% der Schweizer</span> vertrauen 
            Empfehlungen aus bekannten Medien
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* 2. KEY METRICS - MOBILE FIRST LAYOUT */}
        {/* ============================================ */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* THE BIG NUMBER - 15'000+ */}
          <div className="text-center">
            <motion.div 
              className="text-7xl md:text-8xl lg:text-9xl font-black text-primary leading-none"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              15'000+
            </motion.div>
            <p className="text-xl md:text-2xl font-semibold text-foreground mt-2">zufriedene Umzüge</p>
          </div>
          
          {/* Supporting stats - SMALLER */}
          <div className="flex items-center gap-4 md:gap-6">
            <div className="text-center px-5 py-3 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl font-bold text-foreground">4.8</span>
              </div>
              <span className="text-sm text-muted-foreground">Bewertung</span>
            </div>
            
            <div className="text-center px-5 py-3 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">200+</span>
              </div>
              <span className="text-sm text-muted-foreground">Partner</span>
            </div>
            
            <div className="text-center px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-2xl font-bold text-emerald-600">40%</span>
              </div>
              <span className="text-sm text-emerald-600/80">Ersparnis</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
