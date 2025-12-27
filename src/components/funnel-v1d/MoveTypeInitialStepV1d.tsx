/**
 * V1.d Move Type Selection
 * 
 * Improvements:
 * - Cleaner design with visual confirmation
 * - Single-selection hint
 * - Trust micro-signal at bottom
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Package, Truck, Check } from "lucide-react";

interface MoveTypeOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const moveTypeOptions: MoveTypeOption[] = [
  {
    value: "wohnung",
    label: "Wohnung",
    description: "Studio bis Mehrfamilienhaus",
    icon: <Home className="w-5 h-5" />,
    color: "bg-primary/10 text-primary",
  },
  {
    value: "haus",
    label: "Haus",
    description: "Einfamilienhaus / Villa",
    icon: <Building2 className="w-5 h-5" />,
    color: "bg-secondary/10 text-secondary",
  },
  {
    value: "buero",
    label: "Büro / Firma",
    description: "Firmenumzug jeder Grösse",
    icon: <Truck className="w-5 h-5" />,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    value: "einzelteile",
    label: "Einzelteile",
    description: "Klavier, Tresor, Kunst, etc.",
    icon: <Package className="w-5 h-5" />,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
];

interface MoveTypeInitialStepV1dProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const MoveTypeInitialStepV1d = memo(function MoveTypeInitialStepV1d({
  value,
  onChange,
  className = "",
}: MoveTypeInitialStepV1dProps) {
  return (
    <div className={className}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold">Was möchten Sie zügeln?</h3>
        <p className="text-sm text-muted-foreground">
          Dient nur zur Auswahl passender Firmen – später änderbar
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {moveTypeOptions.map((option, index) => {
          const isSelected = value === option.value;
          
          return (
            <motion.button
              key={option.value}
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(option.value)}
              className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border hover:border-primary/40 hover:bg-muted/50"
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-primary-foreground" />
                </motion.div>
              )}
              
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${option.color}`}>
                {option.icon}
              </div>
              
              <p className="text-sm font-semibold text-center">{option.label}</p>
              <p className="text-[11px] text-muted-foreground text-center mt-0.5">
                {option.description}
              </p>
            </motion.button>
          );
        })}
      </div>

      <p className="text-center text-[11px] text-muted-foreground mt-4">
        🔒 100% kostenlos & unverbindlich · Dauert nur 2 Minuten
      </p>
    </div>
  );
});
