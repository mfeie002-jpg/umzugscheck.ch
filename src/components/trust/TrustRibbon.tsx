/**
 * TrustRibbon - BEKANNT AUS & STATS
 * 🎯 Mobile-first, prominente Logos, klare Hierarchie
 */

import { memo } from "react";
import { Shield, Star, Users, Building2, TrendingUp, Award } from "lucide-react";
import { motion } from "framer-motion";

// Professional media logos with REAL brand colors
const MediaLogo = ({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5"
  };

  const logos: Record<string, JSX.Element> = {
    "20 Minuten": (
      <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
        <span className={`font-black text-[#E3000F] ${size === "lg" ? "text-2xl" : "text-lg"}`}>20</span>
        <span className={`font-bold text-foreground ${size === "lg" ? "text-sm" : "text-xs"}`}>Minuten</span>
      </div>
    ),
    "SRF": (
      <div className={`bg-[#C8102E] text-white font-bold rounded-md ${sizeClasses[size]} shadow-sm`}>
        SRF
      </div>
    ),
    "Blick": (
      <div className={`bg-[#E30613] text-white font-bold rounded-md ${sizeClasses[size]} shadow-sm`}>
        BLICK
      </div>
    ),
    "NZZ": (
      <span className={`font-serif font-bold text-foreground tracking-tighter ${size === "lg" ? "text-lg" : "text-base"}`}>
        NZZ
      </span>
    ),
    "Watson": (
      <span className={`font-bold text-[#00A4E4] ${size === "lg" ? "text-lg" : "text-base"}`}>watson</span>
    ),
    "TCS": (
      <div className={`bg-[#FFD700] text-black font-bold rounded-md ${sizeClasses[size]} shadow-sm`}>
        TCS
      </div>
    ),
  };
  
  return logos[name] || <span className={`font-bold ${sizeClasses[size]}`}>{name}</span>;
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
      <div className={`py-3 md:py-5 bg-gradient-to-r from-primary/15 via-primary/8 to-secondary/15 border-y border-primary/25 ${className}`}>
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-12">
            {/* Main stat */}
            <div className="flex items-center gap-2 md:gap-3 order-1 sm:order-1">
              <Users className="w-4 h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
              <div>
                <span className="text-xl sm:text-2xl md:text-3xl font-black text-primary">15'000+</span>
                <span className="text-xs md:text-sm text-muted-foreground ml-1">Umzüge</span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-primary/20" />
            
            {/* Rating */}
            <div className="flex items-center gap-2 md:gap-3 order-3 sm:order-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              <span className="text-lg sm:text-xl md:text-2xl font-black text-foreground">4.8</span>
            </div>

            {/* Divider */}
            <div className="hidden sm:block w-px h-8 bg-primary/20" />
            
            {/* Logos preview */}
            <div className="flex items-center gap-2 md:gap-3 order-2 sm:order-3">
              {["SRF", "NZZ", "Blick"].map((name) => (
                <div key={name} className="hidden sm:block">
                  <MediaLogo name={name} size="sm" />
                </div>
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
    <section className={`py-8 md:py-12 lg:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 ${className}`}>
      <div className="container mx-auto px-3 md:px-4">
        
        {/* ============================================ */}
        {/* 1. BEKANNT AUS - HIGHLIGHTED BOX */}
        {/* ============================================ */}
        <motion.div 
          className="relative bg-gradient-to-br from-white via-blue-50/40 to-white border-2 border-primary/30 rounded-2xl md:rounded-3xl py-6 md:py-8 px-4 md:px-8 mb-10 md:mb-14 shadow-lg md:shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/5 rounded-full -ml-16 -mb-16 blur-3xl" />
          
          <div className="relative z-10">
            {/* Label - MOBILE FIRST */}
            <div className="flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/40 w-fit mx-auto mb-5 md:mb-6">
              <Award className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              <span className="text-xs md:text-sm font-bold text-primary uppercase tracking-widest">Ausgezeichnet & Empfohlen</span>
            </div>
            
            {/* Logos Grid - MOBILE OPTIMIZED */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 lg:gap-6">
              {["20 Minuten", "SRF", "Blick", "NZZ", "Watson", "TCS"].map((name, idx) => (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="cursor-pointer hover:brightness-110 transition-all"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="p-2 md:p-2.5 rounded-lg bg-white/60 backdrop-blur-sm border border-white/80 hover:border-primary/30 hover:bg-white transition-all shadow-sm hover:shadow-md">
                    <MediaLogo name={name} size="md" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* 2. KEY METRICS - MOBILE FIRST LAYOUT */}
        {/* ============================================ */}
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* THE BIG NUMBER - DOMINATES MOBILE */}
          <motion.div 
            className="text-center order-1 md:order-1 w-full md:w-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
          >
            <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 leading-none mb-1 md:mb-2">
              15'000+
            </div>
            <p className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
              zufriedene Umzüge
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 md:mt-2">
              in der Schweiz
            </p>
          </motion.div>
          
          {/* Supporting stats - STACKED ON MOBILE */}
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 lg:gap-6 order-2 md:order-2 w-full md:w-auto">
            {/* Rating */}
            <motion.div 
              className="flex-1 sm:flex-none text-center px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-50/80 to-orange-50/50 border border-yellow-200/60 hover:border-yellow-300 transition-all hover:shadow-lg"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400 text-yellow-400" />
                <span className="text-2xl sm:text-3xl font-black text-foreground">4.8</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Bewertung</span>
            </motion.div>
            
            {/* Partners */}
            <motion.div 
              className="flex-1 sm:flex-none text-center px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-50/80 to-cyan-50/50 border border-blue-200/60 hover:border-blue-300 transition-all hover:shadow-lg"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                <span className="text-2xl sm:text-3xl font-black text-foreground">200+</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Partner</span>
            </motion.div>
            
            {/* Savings */}
            <motion.div 
              className="flex-1 sm:flex-none text-center px-4 sm:px-5 py-3 sm:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/60 hover:border-emerald-300 transition-all hover:shadow-lg"
              whileHover={{ y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                <span className="text-2xl sm:text-3xl font-black text-emerald-600">40%</span>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-emerald-600/80">Ersparnis</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});