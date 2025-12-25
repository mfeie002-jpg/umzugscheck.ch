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
  { value: "5+", label: "5+ Zi.", sublabel: "Haus", icon: Warehouse },
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
      
      <div className={cn(
        "grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 rounded-xl transition-all",
        !hasSelection && "ring-2 ring-amber-400/50 bg-amber-50/50 dark:bg-amber-900/10"
      )}>
        {roomOptions.map((option, index) => {
          const isSelected = value === option.value;
          const Icon = option.icon;
          
          return (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all min-h-[70px] sm:min-h-[80px] touch-manipulation",
                isSelected
                  ? "border-primary bg-primary/10 shadow-soft"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
              )}
              aria-pressed={isSelected}
            >
              <Icon 
                className={cn(
                  "w-5 h-5 sm:w-6 sm:h-6 mb-1 transition-colors",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )} 
              />
              <span className={cn(
                "text-[11px] sm:text-xs font-medium transition-colors leading-tight text-center",
                isSelected ? "text-primary" : "text-foreground"
              )}>
                {option.label}
              </span>
              <span className="text-[8px] sm:text-[9px] text-muted-foreground mt-0.5">
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
