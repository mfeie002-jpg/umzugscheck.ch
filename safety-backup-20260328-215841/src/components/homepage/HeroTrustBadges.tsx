import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Star, ExternalLink } from "lucide-react";
import { SWISS_MEDIA_PARTNERS, ColoredMediaLogo } from "@/components/trust/media-logos";

interface HeroTrustBadgesProps {
  variant?: "below-form" | "inline" | "compact";
  className?: string;
}

export const HeroTrustBadges = memo(function HeroTrustBadges({
  variant = "below-form",
  className = ""
}: HeroTrustBadgesProps) {
  // Show 4 logos on inline, all 6 on below-form
  const logosToShow = variant === "inline" 
    ? SWISS_MEDIA_PARTNERS.slice(0, 4) 
    : SWISS_MEDIA_PARTNERS;
  
  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-3 sm:gap-4 ${className}`}>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Bekannt aus:</span>
        {logosToShow.map((partner) => (
          <div 
            key={partner.name} 
            className="opacity-70 hover:opacity-100 transition-opacity"
            title={partner.website}
          >
            <ColoredMediaLogo name={partner.name} size="sm" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-center gap-3 ${className}`}>
        {[
          { icon: Shield, text: "SSL" },
          { icon: Star, text: "4.8★" },
          { icon: Lock, text: "DSGVO" },
        ].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
            <item.icon className="w-3 h-3" />
            {item.text}
          </span>
        ))}
      </div>
    );
  }

  // Default: below-form variant - Enhanced design with real logos
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl border border-border/60 p-4 sm:p-5 backdrop-blur-sm ${className}`}
    >
      {/* Media logos header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px w-6 sm:w-8 bg-border/60" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Bekannt aus
        </span>
        <div className="h-px w-6 sm:w-8 bg-border/60" />
      </div>
      
      {/* Logo Grid - 2 cols on mobile, 3 on tablet, 6 on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-4">
        {logosToShow.map((partner, index) => (
          <motion.a
            key={partner.name}
            href={`https://www.${partner.website}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.08 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center gap-1 
                       p-2 sm:p-3 rounded-lg 
                       bg-background/50 hover:bg-background 
                       border border-transparent hover:border-border/50
                       transition-all duration-200 
                       cursor-pointer group
                       min-h-[60px] sm:min-h-[70px]"
          >
            <div className="grayscale-0 group-hover:grayscale-0 transition-all">
              <ColoredMediaLogo name={partner.name} size="sm" />
            </div>
            <span className="text-[9px] text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5">
              {partner.website}
              <ExternalLink className="w-2 h-2 opacity-0 group-hover:opacity-100" />
            </span>
          </motion.a>
        ))}
      </div>
      
      {/* Trust fact - Enhanced styling */}
      <div className="text-center border-t border-border/40 pt-3 sm:pt-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
          <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            <strong className="text-foreground font-semibold">83% der Kunden</strong> vertrauen Websites mit Zertifizierungen mehr
          </p>
        </div>
      </div>
    </motion.div>
  );
});
