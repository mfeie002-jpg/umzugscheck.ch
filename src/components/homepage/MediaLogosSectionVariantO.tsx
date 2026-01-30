/**
 * MediaLogosSection VARIANT O - "Hero Eyebrow"
 * 
 * VERSION 15: Trust logos integrated ABOVE the headline in Hero
 * 
 * This variant moves trust signals INTO the Hero as an eyebrow badge
 * The separate MediaLogosSection shows complementary info
 * 
 * Features:
 * - Shows "Bekannt aus" with different/more logos below fold
 * - Complementary to the eyebrow (different signals)
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Newspaper, Star, TrendingUp } from "lucide-react";

const mediaOutlets = [
  { name: "20 Minuten", color: "text-orange-600" },
  { name: "Watson", color: "text-purple-600" },
  { name: "Handelszeitung", color: "text-blue-600" },
];

export const MediaLogosSectionVariantO = memo(function MediaLogosSectionVariantO() {
  return (
    <section className="py-4 bg-muted/30 border-b border-border/30">
      <div className="container max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center space-y-3"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Newspaper className="w-3.5 h-3.5" />
            <span>Ebenfalls bekannt aus:</span>
          </div>
          
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {mediaOutlets.map((outlet) => (
              <span 
                key={outlet.name}
                className="text-sm font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {outlet.name}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>4.8/5 Bewertung</span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>Bis 40% günstiger</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default MediaLogosSectionVariantO;
