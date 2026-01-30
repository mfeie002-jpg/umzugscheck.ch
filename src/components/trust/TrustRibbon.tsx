/**
 * TrustRibbon - BEKANNT AUS & STATS
 * 
 * Nach User-Feedback:
 * ✅ BEKANNT AUS - Echte farbige Logos mit Website-Namen
 * ✅ 15'000+ RIESIG, Rest klein als Support
 * ✅ Mobile-First Design mit besserer Touch-UX
 * ✅ Logos: 20min.ch, srf.ch, blick.ch, nzz.ch, watson.ch, newhome.ch
 */

import { memo } from "react";
import { Shield, Star, Users, Building2, TrendingUp, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

// Swiss Media Partners with real brand styling and website URLs
const MEDIA_PARTNERS = [
  {
    name: "20 Minuten",
    website: "20min.ch",
    logo: () => (
      <div className="flex items-baseline gap-0.5">
        <span className="text-xl sm:text-2xl font-black text-[#E3000F]">20</span>
        <span className="text-sm sm:text-base font-semibold text-foreground">Minuten</span>
      </div>
    ),
  },
  {
    name: "SRF",
    website: "srf.ch",
    logo: () => (
      <div className="bg-[#C8102E] text-white font-bold text-xs sm:text-sm px-2 sm:px-3 py-1 rounded">
        SRF
      </div>
    ),
  },
  {
    name: "Blick",
    website: "blick.ch",
    logo: () => (
      <div className="bg-[#E30613] text-white font-black text-xs sm:text-sm px-2 sm:px-3 py-1 rounded">
        BLICK
      </div>
    ),
  },
  {
    name: "NZZ",
    website: "nzz.ch",
    logo: () => (
      <span className="font-serif font-bold text-xl sm:text-2xl text-foreground tracking-tight">
        NZZ
      </span>
    ),
  },
  {
    name: "Watson",
    website: "watson.ch",
    logo: () => (
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] sm:text-xs font-bold">W</span>
        </div>
        <span className="font-bold text-sm sm:text-base text-foreground lowercase">watson</span>
      </div>
    ),
  },
  {
    name: "newhome",
    website: "newhome.ch",
    logo: () => (
      <div className="flex items-center gap-1">
        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#00A859] rounded flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="currentColor">
            <path d="M12 3L4 9v12h16V9l-8-6zm0 2.25L18 10v9H6v-9l6-4.75z"/>
            <rect x="10" y="14" width="4" height="5"/>
          </svg>
        </div>
        <span className="font-semibold text-sm sm:text-base text-[#00A859]">newhome</span>
      </div>
    ),
  },
];

interface TrustRibbonProps {
  variant?: "full" | "compact";
  className?: string;
}

export const TrustRibbon = memo(function TrustRibbon({ 
  variant = "full",
  className = ""
}: TrustRibbonProps) {
  
  // Compact version: Just the key stat strip
  if (variant === "compact") {
    return (
      <div className={`py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border-y border-primary/20 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-10">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-xl sm:text-2xl font-black text-primary">15'000+</span>
              <span className="text-xs sm:text-sm text-muted-foreground">Umzüge</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-foreground">4.8</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {MEDIA_PARTNERS.slice(0, 3).map((partner) => (
                <partner.logo key={partner.name} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full version with all elements - MOBILE FIRST
  return (
    <section className={`py-8 sm:py-10 md:py-14 ${className}`}>
      <div className="container mx-auto px-4">
        
        {/* ============================================ */}
        {/* 1. BEKANNT AUS - PROMINENT, MOBILE OPTIMIZED */}
        {/* ============================================ */}
        <motion.div 
          className="bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 
                     border-2 border-primary/20 rounded-2xl 
                     py-5 sm:py-6 px-4 sm:px-6 mb-8 sm:mb-10
                     shadow-sm"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header Label */}
          <div className="flex items-center justify-center gap-2 mb-5 sm:mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/30">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-xs sm:text-sm font-bold text-primary uppercase tracking-wide">
                Vertrauen Sie dem Marktführer
              </span>
            </div>
          </div>

          {/* Subheader */}
          <p className="text-center text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6">
            Bekannt aus:
          </p>
          
          {/* Logo Grid - 2 cols on mobile, 3 on tablet, 6 on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {MEDIA_PARTNERS.map((partner, index) => (
              <motion.a
                key={partner.name}
                href={`https://www.${partner.website}`}
                target="_blank"
                rel="noopener noreferrer nofollow"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="flex flex-col items-center justify-center gap-2 
                           p-3 sm:p-4 rounded-xl 
                           bg-background/80 hover:bg-background 
                           border border-border/50 hover:border-primary/30
                           transition-all duration-200 
                           cursor-pointer group
                           min-h-[80px] sm:min-h-[90px]"
              >
                {/* Logo */}
                <div className="grayscale-0 group-hover:grayscale-0 transition-all">
                  <partner.logo />
                </div>
                
                {/* Website URL - Always visible on mobile for trust */}
                <div className="flex items-center gap-1 text-[10px] sm:text-xs text-muted-foreground group-hover:text-primary transition-colors">
                  <span>{partner.website}</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>

          {/* Trust statement */}
          <p className="text-center text-xs sm:text-sm text-muted-foreground mt-5 sm:mt-6">
            <span className="text-foreground font-semibold">97% der Schweizer</span> vertrauen 
            Empfehlungen aus bekannten Medien
          </p>
        </motion.div>

        {/* ============================================ */}
        {/* 2. PROOF POINTS - 15'000+ DOMINATES */}
        {/* ============================================ */}
        <motion.div 
          className="flex flex-col items-center gap-6 sm:gap-8 md:flex-row md:justify-center md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* THE BIG NUMBER - 15'000+ */}
          <div className="text-center">
            <motion.div 
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-primary leading-none"
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              15'000+
            </motion.div>
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mt-2">
              zufriedene Umzüge
            </p>
          </div>
          
          {/* Supporting stats - Mobile: horizontal scroll, Desktop: row */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 sm:pb-0 
                          max-w-full sm:max-w-none px-2 sm:px-0
                          scrollbar-hide">
            <div className="flex-shrink-0 text-center px-4 sm:px-5 py-3 rounded-xl bg-muted/50 border border-border min-w-[100px]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-xl sm:text-2xl font-bold text-foreground">4.8</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Bewertung</span>
            </div>
            
            <div className="flex-shrink-0 text-center px-4 sm:px-5 py-3 rounded-xl bg-muted/50 border border-border min-w-[100px]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                <span className="text-xl sm:text-2xl font-bold text-foreground">200+</span>
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Partner</span>
            </div>
            
            <div className="flex-shrink-0 text-center px-4 sm:px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 min-w-[100px]">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <span className="text-xl sm:text-2xl font-bold text-emerald-600">40%</span>
              </div>
              <span className="text-xs sm:text-sm text-emerald-600/80">Ersparnis</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
