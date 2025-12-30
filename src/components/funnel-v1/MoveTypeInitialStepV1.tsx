/**
 * V1 Version - MoveTypeInitialStep with ChatGPT UX improvements
 * 
 * Improvements:
 * - Visual confirmation with checkmark for selected option
 * - 2x2 grid layout - all options visible without horizontal scroll
 * - Enhanced touch targets (min 44x44px)
 * - Trust signals near CTA
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Briefcase, Package, LucideIcon, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoveTypeOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

// Issue #25: Vereinheitlichte, kurze Beschreibungen - gleiche Länge
const moveTypeOptions: MoveTypeOption[] = [
  { 
    value: "wohnung", 
    label: "Wohnung", 
    description: "Mietwohnung / Eigentum",
    icon: Home,
    color: "text-primary"
  },
  { 
    value: "haus", 
    label: "Haus", 
    description: "Einfamilienhaus / Villa",
    icon: Building2,
    color: "text-secondary"
  },
  { 
    value: "buero", 
    label: "Büro", 
    description: "Firma / Praxis / Laden",
    icon: Briefcase,
    color: "text-amber-600 dark:text-amber-400"
  },
  { 
    value: "einzeln", 
    label: "Einzelteile", 
    description: "Klavier / Tresor / Kunst",
    icon: Package,
    color: "text-green-600 dark:text-green-400"
  },
];

interface MoveTypeInitialStepV1Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * V1 Version with ChatGPT UX Recommendations:
 * - 2x2 Grid layout (Issue #6, #35, #48)
 * - Larger touch targets (Issue #6)
 * - Trust signals near selection (Issue #7, #16, #64)
 * - Higher contrast text (Issue #49)
 */
export const MoveTypeInitialStepV1 = memo(function MoveTypeInitialStepV1({
  value,
  onChange,
  className = ""
}: MoveTypeInitialStepV1Props) {
  return (
    <div className={`space-y-5 ${className}`}>
      {/* Header - centered */}
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold mb-2">Was möchten Sie zügeln?</h3>
        <p className="text-sm text-muted-foreground">
          Wählen Sie aus – wir finden passende Firmen
        </p>
      </div>
      
      {/* Issue #6, #35, #48: Grid-basiertes 2x2 Layout - alle 4 Optionen sichtbar, KEIN horizontal scroll */}
      <div 
        className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto"
        role="radiogroup"
        aria-label="Umzugstyp auswählen"
      >
        {moveTypeOptions.map((option, index) => {
          const isSelected = value === option.value;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                // Issue #6: Min 44x44px Touch-Targets - jetzt 130px Höhe
                "relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-xl border-2 transition-all min-h-[130px] touch-manipulation",
                isSelected
                  ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/30"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/40 hover:shadow-md active:scale-[0.97]"
              )}
              aria-pressed={isSelected}
            >
              {/* Issue #1: Radio-Button-ähnliches Symbol für Einzelauswahl statt Checkbox */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2.5 right-2.5"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                  </div>
                </motion.div>
              )}
              
              {/* Icon container - larger for better visibility */}
              <div className={cn(
                "w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-3 transition-colors",
                isSelected ? "bg-primary/20" : "bg-muted"
              )}>
                <Icon 
                  className={cn(
                    "w-7 h-7 sm:w-8 sm:h-8 transition-colors",
                    isSelected ? "text-primary" : option.color
                  )} 
                />
              </div>
              <span className={cn(
                "text-base sm:text-lg font-bold transition-colors text-center leading-tight",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {option.label}
              </span>
              {/* Issue #49: Higher contrast text (13px min) */}
              <span className="text-[13px] sm:text-sm text-muted-foreground mt-1 text-center">
                {option.description}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Issue #9: Trust-Signals - clear and prominent, no pagination confusion */}
      <p className="text-center text-xs text-muted-foreground pt-2">
        <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
          <Shield className="w-3.5 h-3.5 text-green-600 shrink-0" />
          <span>100% kostenlos · Nur 2 Min. · SSL verschlüsselt</span>
        </span>
      </p>
    </div>
  );
});
