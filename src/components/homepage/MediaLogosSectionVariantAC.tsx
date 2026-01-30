/**
 * Variant AC (V26) - Floating Cards / Visuelle Integration
 * 
 * Research Pattern: UI cards overlaying hero image
 * - Trust stats as floating cards
 * - Glasmorphism styling
 * - Subtle hover animations
 * - Creates "contextual social proof"
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Users, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const FLOATING_CARDS = [
  {
    icon: Star,
    value: "4.8/5",
    label: "Kundenbewertung",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  {
    icon: Users,
    value: "15'000+",
    label: "Zufriedene Umzüge",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Shield,
    value: "100%",
    label: "Vollversichert",
    color: "text-alpine",
    bgColor: "bg-alpine/10",
  },
  {
    icon: CheckCircle,
    value: "Inkl.",
    label: "Abnahmegarantie",
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
];

export const MediaLogosSectionVariantAC = memo(function MediaLogosSectionVariantAC() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="py-6"
    >
      <div className="container mx-auto px-4">
        {/* Simulated Hero Image Area */}
        <div className={cn(
          "relative max-w-4xl mx-auto",
          "bg-gradient-to-br from-muted/50 to-muted/30",
          "rounded-2xl overflow-hidden",
          "min-h-[280px] md:min-h-[320px]"
        )}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary),0.1),transparent_50%)]" />
          </div>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground/50 text-sm">
              [Hero Bild / Umzugswagen]
            </p>
          </div>
          
          {/* Floating Cards */}
          {FLOATING_CARDS.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className={cn(
                "absolute",
                // Position each card differently
                idx === 0 && "top-4 left-4 md:top-6 md:left-6",
                idx === 1 && "top-4 right-4 md:top-6 md:right-6",
                idx === 2 && "bottom-4 left-4 md:bottom-6 md:left-6",
                idx === 3 && "bottom-4 right-4 md:bottom-6 md:right-6"
              )}
            >
              <motion.div
                whileHover={{ y: -2, scale: 1.02 }}
                className={cn(
                  "flex items-center gap-2 px-3 py-2",
                  "bg-white/95 backdrop-blur-sm",
                  "rounded-lg shadow-lg border border-white/50",
                  "cursor-default"
                )}
              >
                <div className={cn("p-1.5 rounded-md", card.bgColor)}>
                  <card.icon className={cn("w-4 h-4", card.color)} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold leading-tight">{card.value}</p>
                  <p className="text-[10px] text-muted-foreground">{card.label}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantAC;
