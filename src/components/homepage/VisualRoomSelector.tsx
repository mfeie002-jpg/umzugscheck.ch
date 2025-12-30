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

const roomOptions: RoomOption[] = [
  { value: "studio", label: "Studio", sublabel: "1 Zimmer", icon: Home },
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
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <Home className="w-4 h-4 text-primary" />
          Wohnungsgrösse
        </label>
        {!hasSelection && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse font-medium">
            👆 Bitte auswählen
          </span>
        )}
      </div>
      
      {/* Issue #42, #45: Vertikales Grid auf Mobile (2 Spalten), keine horizontale Scroll */}
      <div 
        className={cn(
          "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl transition-all",
          !hasSelection && "ring-2 ring-amber-400/50 bg-amber-50/50 dark:bg-amber-900/10"
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                // Issue #6, #45: Min 88px Touch-Targets auf Mobile, grössere Touch-Flächen für bessere Bedienbarkeit
                "flex flex-col items-center justify-center p-4 sm:p-5 rounded-xl border-2 transition-all min-h-[100px] touch-manipulation active:scale-[0.97]",
                isSelected
                  ? "border-primary bg-primary/10 shadow-soft ring-2 ring-primary/30"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
              )}
              aria-pressed={isSelected}
            >
              <Icon 
                className={cn(
                  // Issue #6: Larger icons for better visibility
                  "w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-2.5 transition-colors",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className={cn(
                // Issue #6: Larger text for better readability
                "text-sm sm:text-base font-bold transition-colors leading-tight text-center",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {option.label}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground mt-1 sm:mt-1.5">
                {option.sublabel}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {!hasSelection && (
        <p className="text-[10px] text-muted-foreground text-center">
          Wählen Sie Ihre Wohnungsgrösse für eine Preisschätzung
        </p>
      )}
    </div>
  );
});
