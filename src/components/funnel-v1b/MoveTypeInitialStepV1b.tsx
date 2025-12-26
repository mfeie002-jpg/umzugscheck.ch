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
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold">Was möchten Sie zügeln?</h3>
        <p className="text-sm text-muted-foreground">
          Wählen Sie einfach aus – wir finden die passenden Firmen
        </p>
        {/* ChatGPT Rec #10: Hint about single selection */}
        <p className="text-xs text-muted-foreground/70 mt-1">
          (Nur eine Option wählbar)
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
        {moveTypeOptions.map((option) => {
          const Icon = option.icon;
          const isSelected = value === option.value;
          
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                isSelected
                  ? "border-primary bg-primary/10 shadow-md"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              {/* ChatGPT Rec #10: Checkmark on selected */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md"
                >
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </motion.div>
              )}
              
              <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center ${
                isSelected ? "bg-primary/20" : "bg-muted"
              }`}>
                <Icon className={`w-6 h-6 ${isSelected ? option.color : "text-muted-foreground"}`} />
              </div>
              <p className={`text-sm font-semibold ${isSelected ? "text-primary" : ""}`}>
                {option.label}
              </p>
              <p className="text-xs text-muted-foreground">{option.description}</p>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground pt-2">
        ✓ Kostenlos & unverbindlich • ✓ In 2 Minuten erledigt
      </p>
    </div>
  );
});
