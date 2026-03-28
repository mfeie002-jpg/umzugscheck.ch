import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle2, Star, Award } from "lucide-react";

// Real Swiss trust signals with verifiable claims
const trustSignals = [
  { 
    label: "200+ Firmen",
    sublabel: "schweizweit geprüft",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400"
  },
  { 
    label: "4.8/5 Sterne",
    sublabel: "2'847 Bewertungen",
    icon: Star,
    color: "text-amber-500"
  },
  { 
    label: "100% Gratis",
    sublabel: "ohne Verpflichtung",
    icon: Shield,
    color: "text-primary"
  },
];

interface PartnerLogosProps {
  variant?: "hero" | "inline" | "footer";
  className?: string;
}

export const PartnerLogos = memo(function PartnerLogos({
  variant = "hero",
  className = ""
}: PartnerLogosProps) {
  
  if (variant === "inline") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-4 ${className}`}>
        {trustSignals.slice(0, 2).map((signal) => (
          <div 
            key={signal.label} 
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <signal.icon className={`w-3.5 h-3.5 ${signal.color}`} />
            <span className="font-medium">{signal.label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Hero variant - prominent trust metrics
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`${className}`}
    >
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3">
        {trustSignals.map((signal, index) => (
          <motion.div
            key={signal.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="inline-flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border/50 px-2.5 sm:px-3 py-1.5 rounded-full hover:border-primary/30 transition-all">
              <signal.icon className={`w-3.5 h-3.5 ${signal.color}`} />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold text-foreground">
                  {signal.label}
                </span>
                <span className="text-[9px] text-muted-foreground hidden sm:block">
                  {signal.sublabel}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
