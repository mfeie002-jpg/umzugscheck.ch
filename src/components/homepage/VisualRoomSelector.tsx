import { memo } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Building, Warehouse, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomOption {
  value: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
}

// Issue #41: Konsistente Abkürzung - "Zi." überall
const roomOptions: RoomOption[] = [
  { value: "studio", label: "Studio", sublabel: "1 Zi.", icon: Home },
  { value: "2-2.5", label: "2–2.5 Zi.", sublabel: "50-65m²", icon: Home },
  { value: "3-3.5", label: "3–3.5 Zi.", sublabel: "65-85m²", icon: Building2 },
  { value: "4-4.5", label: "4–4.5 Zi.", sublabel: "85-110m²", icon: Building },
  { value: "5+", label: "5+ Zi.", sublabel: "110m²+", icon: Warehouse },
];

interface VisualRoomSelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const VisualRoomSelector = memo(function VisualRoomSelector({
  value,
  onChange,
  className = ""
}: VisualRoomSelectorProps) {
  const hasSelection = value !== "";
  
  return (
    <div className={`space-y-2.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold flex items-center gap-2">
          <Home className="w-4 h-4 text-primary" />
          Wohnungsgrösse
        </label>
        {!hasSelection && (
          <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2.5 py-1 rounded-full flex items-center gap-1.5 animate-pulse font-semibold">
            👆 Bitte auswählen
          </span>
        )}
      </div>
      
      {/* Issue #65, #66: 2-Spalten-Grid auf Mobile, 3 auf Tablet, 5 auf Desktop - KEIN horizontal scroll */}
      <div 
        className={cn(
          "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-5 p-3 rounded-xl transition-all",
          !hasSelection && "ring-2 ring-amber-400/60 bg-amber-50/60 dark:bg-amber-900/20"
        )}
        role="radiogroup"
        aria-label="Wohnungsgröße auswählen"
      >
        {roomOptions.map((option, index) => {
          const isSelected = value === option.value;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(option.value)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                // Issue #66: Min 110px Höhe für bessere Touch-Targets (44x44px+)
                "flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border-2 transition-all min-h-[110px] min-w-[80px] touch-manipulation active:scale-[0.96]",
                isSelected
                  ? "border-primary bg-primary/15 shadow-lg ring-2 ring-primary/40"
                  : "border-border bg-card hover:border-primary/50 hover:bg-muted/60 hover:shadow-md"
              )}
              aria-pressed={isSelected}
            >
              <Icon 
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 mb-2 transition-colors",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className={cn(
                "text-sm sm:text-base font-bold transition-colors leading-tight text-center",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {option.label}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {option.sublabel}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {!hasSelection && (
        <p className="text-xs text-muted-foreground text-center">
          Wählen Sie Ihre Wohnungsgrösse für eine Preisschätzung
        </p>
      )}
    </div>
  );
});
