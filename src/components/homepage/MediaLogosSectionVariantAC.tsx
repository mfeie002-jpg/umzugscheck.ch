/**
 * Variant AC (V26) - Floating Cards / Visuelle Integration
 * 
 * CRO Research Pattern: "Floating UI Cards" on hero image
 * - Trust stats as floating cards over hero image
 * - Glasmorphism styling (backdrop-blur, white/95)
 * - Subtle hover animations (y: -2, scale: 1.02)
 * - Creates "contextual social proof" - results anchored in visual
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Users, CheckCircle, Truck } from "lucide-react";
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
      aria-label="Floating Trust Cards"
    >
      <div className="container mx-auto px-4">
        {/* Simulated Hero Image Area with Floating Cards */}
        <div className={cn(
          "relative max-w-4xl mx-auto",
          "bg-gradient-to-br from-slate-100 to-slate-200",
          "rounded-2xl overflow-hidden",
          "min-h-[280px] md:min-h-[360px]"
        )}>
          {/* Background Pattern - simulating moving truck/boxes */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(0,80,168,0.08),transparent_50%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(227,32,38,0.05),transparent_40%)]" />
          </div>
          
          {/* Center Content - simulated truck icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center opacity-30">
              <Truck className="w-24 h-24 mx-auto text-muted-foreground" strokeWidth={1} />
              <p className="text-muted-foreground text-sm mt-2">
                Hero-Bild hier
              </p>
            </div>
          </div>
          
          {/* Floating Cards - positioned at corners */}
          {FLOATING_CARDS.map((card, idx) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
              className={cn(
                "absolute",
                // Position each card at corners
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
                  // Glasmorphism per research
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
          
          {/* Media Logos at bottom center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className={cn(
                "flex items-center gap-3 px-4 py-2",
                "bg-white/90 backdrop-blur-sm rounded-full",
                "shadow-md"
              )}
            >
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60">
                Bekannt aus:
              </span>
              {["SRF", "NZZ", "TCS"].map((name) => (
                <span key={name} className="text-[10px] font-bold text-muted-foreground/50">
                  {name}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
});

export default MediaLogosSectionVariantAC;
