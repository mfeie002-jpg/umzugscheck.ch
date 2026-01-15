/**
 * TRUST BAR
 * 
 * Displays trust signals with icons and stats
 * Shows both global brand stats and local stats
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Clock, CheckCircle, Users, Award } from "lucide-react";
import type { PlaceStats, TrustGlobals } from "@/data/archetypeConfig";

interface TrustBarProps {
  stats: PlaceStats;
  trustGlobals: TrustGlobals;
  placeName: string;
  placeKind: 'canton' | 'city';
}

export const TrustBar = memo(({ 
  stats, 
  trustGlobals, 
  placeName,
  placeKind 
}: TrustBarProps) => {
  const locationPrefix = placeKind === 'canton' ? 'im Kanton' : 'in';
  
  const globalItems = [
    {
      icon: Shield,
      value: "100%",
      label: "Kostenlos & unverbindlich",
    },
    {
      icon: Clock,
      value: "24–48h",
      label: "Offerten erhalten",
    },
    {
      icon: Star,
      value: `${stats.avgRating}/5`,
      label: `Ø Bewertung ${locationPrefix} ${placeName}`,
      highlight: true,
    },
    {
      icon: Users,
      value: `${trustGlobals.totalProviders}+`,
      label: "Geprüfte Firmen schweizweit",
    },
  ];

  return (
    <section className="py-8 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-6 md:gap-10"
        >
          {globalItems.map((item, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 text-center"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                item.highlight ? 'bg-primary/10' : 'bg-muted'
              }`}>
                <item.icon className={`w-5 h-5 ${
                  item.highlight ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>
              <div className="text-left">
                <div className={`font-bold text-lg ${
                  item.highlight ? 'text-primary' : ''
                }`}>
                  {item.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Local Stats Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center mt-4 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            {stats.providerCount}+ Partner {locationPrefix} {placeName}
          </span>
          <span className="mx-2">•</span>
          <span className="inline-flex items-center gap-1">
            <Award className="w-4 h-4 text-yellow-600" />
            {stats.reviewCount.toLocaleString('de-CH')} Bewertungen
          </span>
        </motion.div>
      </div>
    </section>
  );
});

TrustBar.displayName = 'TrustBar';
