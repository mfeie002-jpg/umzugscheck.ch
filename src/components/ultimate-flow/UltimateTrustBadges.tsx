/**
 * Ultimate Trust Badges - SCORE OPTIMIZED
 * 
 * Schweizer Qualitätslabels + Kundenbewertungen
 * Prominent im Header platziert mit hover animations
 * 
 * Optimierungen:
 * - ASTAG Badge prominent
 * - Schweizer Qualität hervorgehoben
 * - Grössere Icons für bessere Sichtbarkeit
 * - Subtle hover animations
 */

import { Shield, Star, Clock, Users, Award, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export function UltimateTrustBadges() {
  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: Logo + Primary Trust */}
      <div className="flex items-center justify-between gap-2">
        {/* Logo/Brand */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">UC</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline">
            Umzugscheck.ch
          </span>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* ASTAG Badge - NEW prominent */}
          <motion.div 
            className="flex items-center gap-1.5 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2 py-1 rounded-lg text-xs font-semibold"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Award className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">ASTAG</span>
          </motion.div>

          {/* Rating */}
          <motion.div 
            className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">4.9</span>
          </motion.div>

          {/* Free */}
          <motion.div 
            className="flex items-center gap-1 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Shield className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Gratis</span>
          </motion.div>
        </div>
      </div>

      {/* Row 2: Enhanced Trust Banner - Above the fold */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 py-2 px-3 bg-muted/40 rounded-xl">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
          <span>Schweizer Qualität</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5 text-primary" />
          <span>200+ Firmen</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>~2 Min</span>
        </div>
      </div>
    </div>
  );
}

export function UltimateTrustPills({ context = 'default' }: { context?: string }) {
  const pills = {
    default: [
      { icon: Shield, text: "100% kostenlos", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/30" },
      { icon: Award, text: "ASTAG Partner", color: "text-red-600", bgColor: "bg-red-50 dark:bg-red-900/30" },
      { icon: Users, text: "200+ Firmen", color: "text-primary", bgColor: "bg-primary/10" },
    ],
    contact: [
      { icon: Shield, text: "Daten geschützt", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/30" },
      { icon: Clock, text: "Keine Telefonpflicht", color: "text-primary", bgColor: "bg-primary/10" },
      { icon: Users, text: "Nur an gewählte Firmen", color: "text-muted-foreground", bgColor: "bg-muted/50" },
    ],
    summary: [
      { icon: Shield, text: "Unverbindlich", color: "text-green-600", bgColor: "bg-green-50 dark:bg-green-900/30" },
      { icon: Star, text: "Geprüfte Partner", color: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-900/30" },
      { icon: Clock, text: "Jederzeit änderbar", color: "text-muted-foreground", bgColor: "bg-muted/50" },
    ],
  };

  const items = pills[context as keyof typeof pills] || pills.default;

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {items.map((item, i) => (
        <motion.div 
          key={i}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${item.bgColor} ${item.color}`}
          whileHover={{ scale: 1.05, y: -1 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <item.icon className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">{item.text}</span>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * NEW: Compact Trust Banner for near-CTA placement
 */
export function UltimateTrustBanner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      {/* ASTAG */}
      <div className="flex items-center gap-1.5">
        <Award className="h-4 w-4 text-red-600" />
        <span className="text-xs font-semibold text-red-700 dark:text-red-300">ASTAG</span>
      </div>
      
      {/* Swiss Quality */}
      <div className="flex items-center gap-1.5">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-xs font-semibold text-foreground">Schweizer Qualität</span>
      </div>
      
      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">4.9/5</span>
      </div>
    </div>
  );
}