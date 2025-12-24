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
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium flex items-center gap-2">
        <Home className="w-4 h-4 text-primary" />
        Wohnungsgrösse
      </label>
      
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
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
    </div>
  );
});
