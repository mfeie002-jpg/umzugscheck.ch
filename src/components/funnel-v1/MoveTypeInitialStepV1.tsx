/**
 * V1 Version - MoveTypeInitialStep with ChatGPT UX improvements
 * 
 * Improvements:
 * - Visual confirmation with checkmark for selected option
 * - Single selection hint "(Nur eine Option wählbar)"
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Briefcase, Package, LucideIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface MoveTypeOption {
  value: string;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const moveTypeOptions: MoveTypeOption[] = [
  { 
    value: "wohnung", 
    label: "Wohnung", 
    description: "Privatumzug",
    icon: Home,
    color: "text-primary"
  },
  { 
    value: "haus", 
    label: "Haus", 
    description: "Einfamilienhaus",
    icon: Building2,
    color: "text-secondary"
  },
  { 
    value: "buero", 
    label: "Büro", 
    description: "Firmenumzug",
    icon: Briefcase,
    color: "text-amber-600 dark:text-amber-400"
  },
  { 
    value: "einzeln", 
    label: "Einzelteile", 
    description: "Möbel / Geräte",
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
 * #10 - Visual confirmation with checkmark
 * #10 - Hint for single selection
 */
export const MoveTypeInitialStepV1 = memo(function MoveTypeInitialStepV1({
  value,
  onChange,
  className = ""
}: MoveTypeInitialStepV1Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-bold mb-1">Was möchten Sie zügeln?</h3>
        <p className="text-sm text-muted-foreground">
          Wählen Sie einfach aus – wir finden die passenden Firmen
        </p>
        {/* V1: Hint for single selection */}
        <p className="text-xs text-muted-foreground/70 mt-1">
          (Nur eine Option wählbar)
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {moveTypeOptions.map((option, index) => {
          const isSelected = value === option.value;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all min-h-[100px] touch-manipulation",
                isSelected
                  ? "border-primary bg-primary/10 shadow-medium ring-2 ring-primary/20"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/30 hover:shadow-soft"
              )}
              aria-pressed={isSelected}
            >
              {/* V1: Checkmark for selected state */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2"
                >
                  <CheckCircle className="w-5 h-5 text-primary fill-primary/20" />
                </motion.div>
              )}
              
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors",
                isSelected ? "bg-primary/20" : "bg-muted"
              )}>
                <Icon 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isSelected ? "text-primary" : option.color
                  )} 
                />
              </div>
              <span className={cn(
                "text-sm font-semibold transition-colors",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {option.description}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Trust micro-signal */}
      <p className="text-center text-xs text-muted-foreground pt-2">
        ✓ Kostenlos & unverbindlich • ✓ In 2 Minuten erledigt
      </p>
    </div>
  );
});
