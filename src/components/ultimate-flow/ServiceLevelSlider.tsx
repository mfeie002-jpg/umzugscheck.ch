/**
 * Service Level Slider Component
 * 
 * Prompt 1: Horizontaler Slider für Service-Level
 * - 0-100 Slider
 * - "Beliebt" Badge bei Level 50
 * - Echtzeit-Preisaktualisierung
 */

import { memo, useMemo } from 'react';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Star, Check } from 'lucide-react';
import { getServiceLevelDetails, getServiceLevelMarkers } from '@/lib/service-level-pricing';

interface ServiceLevelSliderProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export const ServiceLevelSlider = memo(function ServiceLevelSlider({
  value,
  onChange,
  className
}: ServiceLevelSliderProps) {
  const markers = useMemo(() => getServiceLevelMarkers(), []);
  const levelDetails = useMemo(() => getServiceLevelDetails(value), [value]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header with current level */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Service-Level</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-primary">{levelDetails.serviceLevelLabel}</span>
          {levelDetails.isPopular && (
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 gap-1">
              <Star className="w-3 h-3 fill-current" />
              Beliebt
            </Badge>
          )}
        </div>
      </div>

      {/* Slider */}
      <div className="relative pt-2 pb-6">
        <Slider
          value={[value]}
          onValueChange={(vals) => onChange(vals[0])}
          min={0}
          max={100}
          step={1}
          className="w-full"
        />
        
        {/* Markers */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-muted-foreground">
          {markers.map((marker) => (
            <span 
              key={marker.value}
              className={cn(
                "cursor-pointer hover:text-primary transition-colors",
                Math.abs(value - marker.value) < 10 && "text-primary font-medium"
              )}
              onClick={() => onChange(marker.value)}
            >
              {marker.label}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-muted/50 rounded-lg p-3 space-y-1.5">
        <p className="text-xs text-muted-foreground font-medium">Inklusive:</p>
        <div className="flex flex-wrap gap-2">
          {levelDetails.features.map((feature, i) => (
            <span 
              key={i}
              className="inline-flex items-center gap-1 text-xs bg-background px-2 py-1 rounded-md border"
            >
              <Check className="w-3 h-3 text-green-600" />
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});
