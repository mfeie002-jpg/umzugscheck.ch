/**
 * Quality Standards Bar - "Trust Bar 2"
 * 
 * Purpose: Shows quality/security signals (not media fame)
 * Answers: "Is this safe?" with ASTAG, Swiss Made, Data Security, Insurance
 * 
 * Placement: Right after TrustRibbonAB (below "Bekannt aus")
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Server, 
  Truck, 
  CheckCircle2,
  Award
} from "lucide-react";

const qualityBadges = [
  {
    id: "astag",
    icon: Truck,
    title: "ASTAG-Standards",
    subtitle: "Geprüfte Qualität",
    color: "text-primary",
  },
  {
    id: "swiss-made",
    icon: Award,
    title: "Swiss Made",
    subtitle: "Software aus der Schweiz",
    color: "text-[#D52B1E]",
  },
  {
    id: "data-ch",
    icon: Server,
    title: "Schweizer Hosting",
    subtitle: "Daten bleiben hier",
    color: "text-emerald-600",
  },
  {
    id: "insured",
    icon: Shield,
    title: "Versicherte Partner",
    subtitle: "Haftpflicht geprüft",
    color: "text-[#E2001A]",
  },
  {
    id: "verified",
    icon: CheckCircle2,
    title: "Handelsregister",
    subtitle: "UID verifiziert",
    color: "text-primary",
  },
];

export const QualityStandardsBar = memo(function QualityStandardsBar() {
  return (
    <section className="py-4 md:py-5 bg-muted/20 border-b border-border/30">
      <div className="container max-w-5xl px-4">
        {/* Header */}
        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest mb-3">
          Geprüfte Qualität & Schweizer Standards
        </p>
        
        {/* Badge Row - Scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-start md:justify-center gap-3 md:gap-4
                     overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {qualityBadges.map((badge, index) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-card 
                         border border-border/50 whitespace-nowrap flex-shrink-0
                         hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <badge.icon className={`w-4 h-4 ${badge.color}`} />
              <div className="flex flex-col leading-none">
                <span className="text-xs font-semibold text-foreground">
                  {badge.title}
                </span>
                <span className="text-[9px] text-muted-foreground">
                  {badge.subtitle}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

export default QualityStandardsBar;
