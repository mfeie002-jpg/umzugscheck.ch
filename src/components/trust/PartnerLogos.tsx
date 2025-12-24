import { memo } from "react";
import { motion } from "framer-motion";
import { Shield, Award, CheckCircle2, Truck, Building } from "lucide-react";

// Swiss moving industry associations and trust signals
const industryPartners = [
  { 
    name: "ASTAG", 
    fullName: "Schweizerischer Nutzfahrzeugverband",
    icon: Truck,
    color: "text-blue-700 dark:text-blue-400"
  },
  { 
    name: "VMS", 
    fullName: "Verband Möbeltransporte Schweiz",
    icon: Building,
    color: "text-primary"
  },
  { 
    name: "Geprüft", 
    fullName: "Alle Partner verifiziert",
    icon: CheckCircle2,
    color: "text-green-600 dark:text-green-400"
  },
  { 
    name: "TÜV", 
    fullName: "Geprüfte Qualität",
    icon: Shield,
    color: "text-blue-600 dark:text-blue-400"
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
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Geprüft von:</span>
        {industryPartners.slice(0, 3).map((partner) => (
          <div 
            key={partner.name} 
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <partner.icon className={`w-3.5 h-3.5 ${partner.color}`} />
            <span className="font-medium">{partner.name}</span>
          </div>
        ))}
      </div>
    );
  }

  // Hero variant - prominent display
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`${className}`}
    >
      <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider mr-1">
          Partner-Verbände:
        </span>
        {industryPartners.map((partner, index) => (
          <motion.div
            key={partner.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="group"
          >
            <div className="inline-flex items-center gap-1.5 bg-card/80 backdrop-blur-sm border border-border/50 px-3 py-1.5 rounded-full hover:border-primary/30 hover:bg-primary/5 transition-all cursor-default">
              <partner.icon className={`w-3.5 h-3.5 ${partner.color}`} />
              <span className="text-xs font-medium text-foreground/80 group-hover:text-foreground">
                {partner.name}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
});
