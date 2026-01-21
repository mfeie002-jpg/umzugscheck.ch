import { Badge } from "@/components/ui/badge";
import { Flame, AlertTriangle, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { CapacityAlert } from "@/lib/capacity-radar";

interface UrgencyBadgeProps {
  alert: CapacityAlert | null;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
}

export const UrgencyBadge = ({ 
  alert, 
  size = 'md',
  showIcon = true,
  animated = true 
}: UrgencyBadgeProps) => {
  if (!alert) return null;

  const getAlertStyles = () => {
    switch (alert.type) {
      case 'fully_booked':
        return {
          bg: 'bg-red-500 hover:bg-red-600',
          text: 'text-white',
          icon: <Flame className={cn("h-3 w-3", animated && "animate-pulse")} />,
        };
      case 'last_slots':
        return {
          bg: 'bg-orange-500 hover:bg-orange-600',
          text: 'text-white',
          icon: <AlertTriangle className={cn("h-3 w-3", animated && "animate-bounce")} />,
        };
      case 'limited_availability':
        return {
          bg: 'bg-yellow-500 hover:bg-yellow-600',
          text: 'text-yellow-950',
          icon: <Clock className="h-3 w-3" />,
        };
      case 'high_demand':
        return {
          bg: 'bg-blue-500 hover:bg-blue-600',
          text: 'text-white',
          icon: <Zap className="h-3 w-3" />,
        };
      default:
        return {
          bg: 'bg-muted',
          text: 'text-muted-foreground',
          icon: null,
        };
    }
  };

  const styles = getAlertStyles();
  
  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <Badge 
      className={cn(
        styles.bg,
        styles.text,
        sizeClasses[size],
        "font-medium gap-1 border-0"
      )}
    >
      {showIcon && styles.icon}
      {alert.message}
    </Badge>
  );
};

export default UrgencyBadge;
