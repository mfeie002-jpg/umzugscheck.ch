/**
 * V1 Trust Badges Header - Score Optimization
 * 
 * Prominently displays trust signals above the fold:
 * - ASTAG Badge (Swiss moving association)
 * - Swiss quality indicators
 * - Customer satisfaction
 */

import { memo } from "react";
import { Shield, Star, Award, CheckCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

interface V1TrustBadgesHeaderProps {
  className?: string;
  variant?: "compact" | "full";
}

export const V1TrustBadgesHeader = memo(function V1TrustBadgesHeader({
  className = "",
  variant = "compact"
}: V1TrustBadgesHeaderProps) {
  if (variant === "compact") {
    return (
      <div className={`flex flex-wrap items-center justify-center gap-2 sm:gap-3 ${className}`}>
        {/* ASTAG Badge */}
        <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          <span>ASTAG Partner</span>
        </div>
        
        {/* Swiss Quality */}
        <div className="flex items-center gap-1.5 bg-primary/10 text-primary px-2.5 py-1.5 rounded-lg text-xs font-semibold">
          <Shield className="w-3.5 h-3.5" />
          <span>Schweizer Qualität</span>
        </div>
        
        {/* Customer Rating */}
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2.5 py-1.5 rounded-lg text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>4.8/5 Bewertung</span>
        </div>
      </div>
    );
  }

  // Full variant with more details
  return (
    <motion.div 
      className={`bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl p-4 border border-border/50 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {/* ASTAG Certification */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
            <Award className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">ASTAG zertifiziert</p>
            <p className="text-[10px] text-muted-foreground">Schweizer Verband</p>
          </div>
        </div>
        
        {/* Swiss Quality */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Geprüfte Qualität</p>
            <p className="text-[10px] text-muted-foreground">100% Schweizer Firmen</p>
          </div>
        </div>
        
        {/* Customer Satisfaction */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
            <Star className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-current" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">4.8 von 5 Sternen</p>
            <p className="text-[10px] text-muted-foreground">12'000+ Bewertungen</p>
          </div>
        </div>
        
        {/* Verified Companies */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
            <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">200+ Firmen</p>
            <p className="text-[10px] text-muted-foreground">Alle geprüft</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
});
