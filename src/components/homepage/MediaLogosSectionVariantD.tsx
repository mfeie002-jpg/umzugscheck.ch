/**
 * MediaLogosSection VARIANT D - Trust Stack (Kompakt)
 * 
 * VERSION 4: Pill-based compact layout
 * - Single row of trust pills
 * - No separate sections, everything inline
 * - Maximum density, minimum space
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Truck, CheckCircle2, Newspaper } from "lucide-react";

// Trust pills - all in one compact row
const trustPills = [
  {
    id: "media",
    icon: Newspaper,
    text: "SRF • NZZ • 20min",
    subtext: "Bekannt aus",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
  },
  {
    id: "astag",
    icon: Truck,
    text: "ASTAG Mitglied",
    subtext: null,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "versichert",
    icon: Shield,
    text: "Bis 2 Mio. CHF",
    subtext: "Versichert",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "firmen",
    icon: CheckCircle2,
    text: "200+ Firmen",
    subtext: "Geprüft",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    id: "rating",
    icon: Star,
    text: "4.8/5",
    subtext: "2'847 Reviews",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export const MediaLogosSectionVariantD = memo(function MediaLogosSectionVariantD() {
  return (
    <section className="py-4 md:py-5 bg-muted/20 border-y border-border/30">
      <div className="container px-4">
        
        {/* SINGLE ROW - Scrollable on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-start md:justify-center gap-2 md:gap-3 
                     overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {trustPills.map((pill, index) => (
            <motion.div
              key={pill.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-2 px-3 py-2 rounded-full ${pill.bgColor} 
                         border border-border/30 whitespace-nowrap flex-shrink-0
                         hover:scale-105 transition-transform cursor-default`}
            >
              <pill.icon className={`w-4 h-4 ${pill.color}`} />
              <div className="flex flex-col leading-none">
                {pill.subtext && (
                  <span className="text-[9px] text-muted-foreground">{pill.subtext}</span>
                )}
                <span className={`text-xs font-semibold ${pill.id === 'rating' ? 'text-foreground' : pill.color}`}>
                  {pill.text}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});
