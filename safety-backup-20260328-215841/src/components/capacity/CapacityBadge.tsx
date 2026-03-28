import { memo } from 'react';
import { Gauge, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CapacityBadgeProps {
  availableSlots: number;
  totalSlots?: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md';
}

export const CapacityBadge = memo(function CapacityBadge({
  availableSlots,
  totalSlots = 10,
  showTooltip = true,
  size = 'sm',
}: CapacityBadgeProps) {
  const utilizationPercent = ((totalSlots - availableSlots) / totalSlots) * 100;
  
  let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline';
  let label = '';
  let Icon = CheckCircle;
  let colorClass = '';
  
  if (availableSlots === 0) {
    variant = 'destructive';
    label = 'Ausgebucht';
    Icon = AlertCircle;
    colorClass = 'text-destructive';
  } else if (availableSlots <= 2) {
    variant = 'destructive';
    label = `Nur ${availableSlots} frei`;
    Icon = AlertCircle;
    colorClass = 'text-destructive';
  } else if (utilizationPercent >= 70) {
    variant = 'secondary';
    label = 'Begrenzt';
    Icon = Clock;
    colorClass = 'text-yellow-600';
  } else {
    variant = 'outline';
    label = 'Verfügbar';
    Icon = CheckCircle;
    colorClass = 'text-green-600';
  }
  
  const badge = (
    <Badge 
      variant={variant} 
      className={`gap-1 ${size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'}`}
    >
      <Icon className={`${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} ${colorClass}`} />
      {label}
    </Badge>
  );
  
  if (!showTooltip) return badge;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">
            {availableSlots} von {totalSlots} Plätzen verfügbar
          </p>
          <p className="text-xs text-muted-foreground">
            {utilizationPercent.toFixed(0)}% Auslastung
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

export default CapacityBadge;
