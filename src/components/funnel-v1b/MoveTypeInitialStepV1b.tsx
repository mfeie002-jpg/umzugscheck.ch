/**
 * MoveTypeInitialStepV1b - ChatGPT Rec #10: Visual selection confirmation
 */
import { memo } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Briefcase, Package, CheckCircle } from "lucide-react";

const moveTypeOptions = [
  { value: "wohnung", label: "Wohnung", description: "Privatumzug", icon: Home, color: "text-primary" },
  { value: "haus", label: "Haus", description: "Einfamilienhaus", icon: Building2, color: "text-secondary" },
  { value: "buero", label: "Büro", description: "Firmenumzug", icon: Briefcase, color: "text-amber-500" },
  { value: "einzelteile", label: "Einzelteile", description: "Möbel / Geräte", icon: Package, color: "text-green-500" },
];

interface MoveTypeInitialStepV1bProps {
  value: string;
  onChange: (value: string) => void;
}

export const MoveTypeInitialStepV1b = memo(function MoveTypeInitialStepV1b({ value, onChange }: MoveTypeInitialStepV1bProps) {
  return (
    <div className="space-y-4 overflow-x-hidden">
      {/* FIX: Clearer question hierarchy - main question as H2 equivalent */}
      <div className="text-center">
        <h3 className="text-xl sm:text-lg font-bold text-foreground">Was möchten Sie zügeln?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Wählen Sie einfach aus – wir finden die passenden Firmen
        </p>
      </div>

      {/* FIX: Better mobile grid - 2x2 with larger touch targets (min 72px height) */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 max-w-md mx-auto px-1">
        {moveTypeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all text-center min-h-[88px] touch-manipulation ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 hover:bg-muted/50 active:bg-muted"
              }`}
              aria-pressed={isSelected}
              aria-label={`${option.label}: ${option.description}`}
            >
              {/* FIX: Checkmark with clear visual confirmation */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10"
                >
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
              
              {/* FIX: Larger icon container for better touch target */}
              <div className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-1.5 sm:mb-2 rounded-xl flex items-center justify-center ${
                isSelected ? "bg-primary/20" : "bg-muted"
              }`}>
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${isSelected ? option.color : "text-muted-foreground"}`} />
              </div>
              <p className={`text-sm font-semibold leading-tight ${isSelected ? "text-primary" : ""}`}>
                {option.label}
              </p>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">{option.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* FIX: Trust badges more visible and better formatted */}
      <p className="text-center text-xs text-muted-foreground pt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          Kostenlos & unverbindlich
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3 h-3 text-green-500" />
          In 2 Minuten erledigt
        </span>
      </p>
    </div>
  );
});
