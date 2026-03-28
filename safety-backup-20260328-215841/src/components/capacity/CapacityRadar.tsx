import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, AlertTriangle, CheckCircle, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ProviderCapacity,
  WeeklySlot,
  getUrgencyColor,
  getUrgencyBadgeVariant,
} from "@/lib/capacity-radar";

interface CapacityRadarProps {
  capacity: ProviderCapacity;
  compactMode?: boolean;
  showWeeklyView?: boolean;
}

export const CapacityRadar = ({ 
  capacity, 
  compactMode = false,
  showWeeklyView = true 
}: CapacityRadarProps) => {
  const utilizationPercent = Math.round(
    ((capacity.maxCapacity - capacity.availableSlots) / capacity.maxCapacity) * 100
  );

  const getUrgencyIcon = () => {
    switch (capacity.urgencyLevel) {
      case 'critical':
        return <Flame className="h-4 w-4 text-red-500 animate-pulse" />;
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getUrgencyLabel = () => {
    switch (capacity.urgencyLevel) {
      case 'critical':
        return 'Fast ausgebucht!';
      case 'high':
        return 'Hohe Nachfrage';
      case 'medium':
        return 'Normale Auslastung';
      case 'low':
        return 'Gute Verfügbarkeit';
    }
  };

  if (compactMode) {
    return (
      <div className={cn(
        "flex items-center gap-2 px-2 py-1 rounded-md border",
        getUrgencyColor(capacity.urgencyLevel)
      )}>
        {getUrgencyIcon()}
        <span className="text-xs font-medium">
          {capacity.availableSlots} Plätze frei
        </span>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Verfügbarkeit
          </CardTitle>
          <Badge variant={getUrgencyBadgeVariant(capacity.urgencyLevel)}>
            {getUrgencyIcon()}
            <span className="ml-1">{getUrgencyLabel()}</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Utilization Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Auslastung</span>
            <span>{utilizationPercent}%</span>
          </div>
          <Progress 
            value={utilizationPercent} 
            className={cn(
              "h-2",
              utilizationPercent >= 90 && "[&>div]:bg-red-500",
              utilizationPercent >= 70 && utilizationPercent < 90 && "[&>div]:bg-orange-500",
              utilizationPercent >= 50 && utilizationPercent < 70 && "[&>div]:bg-yellow-500",
              utilizationPercent < 50 && "[&>div]:bg-green-500"
            )}
          />
        </div>

        {/* Available Slots Summary */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-2xl font-bold text-primary">{capacity.availableSlots}</p>
            <p className="text-xs text-muted-foreground">Freie Plätze</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-2xl font-bold">{capacity.currentJobs}</p>
            <p className="text-xs text-muted-foreground">Aktive Aufträge</p>
          </div>
        </div>

        {/* Weekly Availability Grid */}
        {showWeeklyView && capacity.weeklyAvailability.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Nächste 2 Wochen</p>
            <div className="grid grid-cols-7 gap-1">
              {capacity.weeklyAvailability.slice(0, 14).map((slot, index) => (
                <WeeklySlotCell key={index} slot={slot} />
              ))}
            </div>
          </div>
        )}

        {/* Next Available Date */}
        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <span className="text-muted-foreground">Nächster freier Termin:</span>
          <span className="font-medium">
            {capacity.nextAvailableDate.toLocaleDateString('de-CH', {
              weekday: 'short',
              day: 'numeric',
              month: 'short'
            })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const WeeklySlotCell = ({ slot }: { slot: WeeklySlot }) => {
  const getSlotColor = () => {
    if (slot.isFullyBooked) return 'bg-red-100 text-red-600 border-red-200';
    if (slot.availableSlots === 1) return 'bg-orange-100 text-orange-600 border-orange-200';
    if (slot.availableSlots <= 2) return 'bg-yellow-100 text-yellow-600 border-yellow-200';
    return 'bg-green-100 text-green-600 border-green-200';
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-1 rounded border text-xs",
        getSlotColor()
      )}
      title={`${slot.date.toLocaleDateString('de-CH')}: ${slot.availableSlots} frei`}
    >
      <span className="font-medium">{slot.dayOfWeek}</span>
      <span className="text-[10px]">
        {slot.isFullyBooked ? '–' : slot.availableSlots}
      </span>
    </div>
  );
};

export default CapacityRadar;
