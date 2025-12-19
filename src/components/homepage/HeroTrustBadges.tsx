import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Star } from "lucide-react";

// Media logos as simple text-based components for now
const MediaLogo = ({ name, className = "" }: { name: string; className?: string }) => {
  const logos: Record<string, JSX.Element> = {
    "20 Minuten": (
      <span className="font-bold text-sm">
        <span className="text-[#E3000F]">20</span>
        <span className="text-muted-foreground ml-0.5">min</span>
      </span>
    ),
    "NZZ": (
      <span className="font-serif font-bold text-sm text-foreground">NZZ</span>
    ),
    "Blick": (
      <span className="bg-[#E30613] text-white text-xs font-bold px-2 py-0.5 rounded">BLICK</span>
    ),
    "SRF": (
      <span className="bg-[#C8102E] text-white text-xs font-bold px-2 py-0.5 rounded">SRF</span>
    ),
    "Tages-Anzeiger": (
      <span className="font-serif text-xs text-foreground">Tages-Anzeiger</span>
    ),
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {logos[name] || <span className="text-xs text-muted-foreground">{name}</span>}
    </div>
  );
};

interface HeroTrustBadgesProps {
  variant?: "below-form" | "inline" | "compact";
  className?: string;
}

export const HeroTrustBadges = memo(function HeroTrustBadges({
  variant = "below-form",
  className = ""
}: HeroTrustBadgesProps) {
  const mediaLogos = ["20 Minuten", "NZZ", "Blick"];
  
  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Bekannt aus:</span>
        {mediaLogos.map((name) => (
          <MediaLogo key={name} name={name} className="opacity-70 hover:opacity-100 transition-opacity" />
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

  // Default: below-form variant - Enhanced design
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`bg-gradient-to-br from-muted/60 to-muted/30 rounded-xl border border-border/60 p-5 backdrop-blur-sm ${className}`}
    >
      {/* Media logos header */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="h-px w-8 bg-border/60" />
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">Bekannt aus</span>
        <div className="h-px w-8 bg-border/60" />
      </div>
      
      <div className="flex items-center justify-center gap-8 mb-4">
        {mediaLogos.map((name, index) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className="opacity-70 hover:opacity-100 transition-all duration-200 grayscale hover:grayscale-0 cursor-default"
          >
            <MediaLogo name={name} />
          </motion.div>
        ))}
      </div>
      
      {/* Trust fact - Enhanced styling */}
      <div className="text-center border-t border-border/40 pt-4">
        <div className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full">
          <Shield className="w-4 h-4 text-primary" />
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground font-semibold">83% der Kunden</strong> vertrauen Websites mit Zertifizierungen mehr
          </p>
        </div>
      </div>
    </motion.div>
  );
});
