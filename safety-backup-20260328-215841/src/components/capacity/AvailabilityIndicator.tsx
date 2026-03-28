import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AvailabilityIndicatorProps {
  availableSlots: number;
  maxCapacity: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AvailabilityIndicator = ({
  availableSlots,
  maxCapacity,
  showLabel = true,
  size = 'md',
}: AvailabilityIndicatorProps) => {
  const utilizationRate = 1 - (availableSlots / maxCapacity);
  
  const getStatus = () => {
    if (availableSlots === 0) {
      return { color: 'text-red-500', label: 'Ausgebucht', pulse: false };
    }
    if (utilizationRate >= 0.9) {
      return { color: 'text-red-500', label: 'Fast voll', pulse: true };
    }
    if (utilizationRate >= 0.7) {
      return { color: 'text-orange-500', label: 'Begrenzt', pulse: false };
    }
    if (utilizationRate >= 0.5) {
      return { color: 'text-yellow-500', label: 'Verfügbar', pulse: false };
    }
    return { color: 'text-green-500', label: 'Freie Kapazität', pulse: false };
  };

  const status = getStatus();
  
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5">
            <div className="relative">
              <Circle 
                className={cn(
                  sizeClasses[size],
                  status.color,
                  "fill-current"
                )} 
              />
              {status.pulse && (
                <Circle 
                  className={cn(
                    sizeClasses[size],
                    status.color,
                    "fill-current absolute inset-0 animate-ping opacity-75"
                  )} 
                />
              )}
            </div>
            {showLabel && (
              <span className={cn(textSizes[size], "text-muted-foreground")}>
                {status.label}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{availableSlots} von {maxCapacity} Plätzen frei</p>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(utilizationRate * 100)}% ausgelastet
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AvailabilityIndicator;
