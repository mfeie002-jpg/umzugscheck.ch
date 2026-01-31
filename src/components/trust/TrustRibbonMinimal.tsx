/**
 * TrustRibbon MINIMAL - For Hero-Integrated Variants
 * 
 * Used by variants I, J, K, L, M, Q when trust is shown IN the hero.
 * This just shows a subtle stats strip below.
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Star, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { TRUST } from "@/content/trust";

interface TrustRibbonMinimalProps {
  className?: string;
}

export const TrustRibbonMinimal = memo(function TrustRibbonMinimal({
  className,
}: TrustRibbonMinimalProps) {
  return (
    <section className={cn("py-3 bg-muted/30 border-b border-border/30", className)}>
      <div className="container max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 md:gap-6 text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Versicherte Partner</span>
          </div>
          <span className="w-px h-4 bg-border" />
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-primary" />
            <span>{TRUST.movesCount} Umzüge</span>
          </div>
          <span className="w-px h-4 bg-border hidden md:block" />
          <div className="hidden md:flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span>{TRUST.ratingDisplay} Bewertung</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});
