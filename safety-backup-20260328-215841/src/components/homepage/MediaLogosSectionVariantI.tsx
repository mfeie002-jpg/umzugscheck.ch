/**
 * MediaLogosSection VARIANT I - "Hybrid Trust Bar"
 * 
 * VERSION 9: Psychological ordering (Risk → Infrastructure → Payment)
 * Based on feedback: "Der Schweizer Standard für Ihren Umzug"
 * 
 * Order from left to right:
 * 1. Die Mobiliar (Insurance/Risk)
 * 2. Die Post & eUmzugCH (Infrastructure)
 * 3. TWINT & Banking (Payment)
 * 4. Associations (ASTAG/Swiss Label)
 */

import { memo, useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield,
  Mail,
  Building2,
  CreditCard,
  Award,
  Star,
  Info
} from "lucide-react";
import { TRUST } from "@/content/trust";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Psychological ordering for maximum trust
const trustTiers = [
  {
    id: "risk",
    label: "Versicherung",
    items: [
      {
        name: "Versichert",
        description: "Haftpflicht & Transport",
        icon: Shield,
        color: "text-[#E2001A]",
      },
    ],
  },
  {
    id: "infrastructure", 
    label: "Infrastruktur",
    items: [
      {
        name: "eUmzugCH",
        description: "Behördenprozess",
        icon: Building2,
        color: "text-red-600",
      },
      {
        name: "Die Post",
        description: "Nachsendeauftrag",
        icon: Mail,
        color: "text-yellow-600",
      },
    ],
  },
  {
    id: "payment",
    label: "Zahlung",
    items: [
      {
        name: "TWINT",
        description: "& Kreditkarte",
        icon: CreditCard,
        color: "text-primary",
      },
    ],
  },
  {
    id: "quality",
    label: "Qualität",
    items: [
      {
        name: "ASTAG",
        description: "Branchenstandard",
        icon: Award,
        color: "text-blue-600",
      },
    ],
  },
];

export const MediaLogosSectionVariantI = memo(function MediaLogosSectionVariantI() {
  return (
    <section className="py-4 md:py-5 bg-card border-b border-border">
      <div className="container max-w-6xl px-4">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-4"
        >
          <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
            Der Schweizer Standard für Ihren Umzug
          </h3>
        </motion.div>

        {/* Horizontal Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6"
        >
          {trustTiers.map((tier, tierIdx) => (
            <div key={tier.id} className="flex items-center gap-3">
              {tier.items.map((item) => (
                <TooltipProvider key={item.name}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg
                                      hover:bg-muted/50 transition-colors cursor-help">
                        <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <span className="text-xs font-medium text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground">{item.description}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{tier.label}: {item.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
              
              {/* Separator between tiers */}
              {tierIdx < trustTiers.length - 1 && (
                <div className="hidden md:block w-px h-8 bg-border mx-2" />
              )}
            </div>
          ))}
          
          {/* Rating at the end */}
          <div className="flex items-center gap-3 pl-3 md:pl-6 md:border-l border-border">
            <div className="flex items-center gap-1.5">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-lg">{TRUST.ratingDisplay}</span>
            </div>
            <div className="text-left">
              <div className="text-xs text-muted-foreground">Kundenbewertung</div>
              <div className="text-[10px] text-muted-foreground">{TRUST.ratingCount.toLocaleString()} Bewertungen</div>
            </div>
          </div>
        </motion.div>

        {/* Savings Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-border/50"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground cursor-help">
                  <span>Ø CHF {TRUST.savingsAverage} gespart</span>
                  <Info className="w-3 h-3" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-xs">{TRUST.savingsDisclaimer}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantI;
