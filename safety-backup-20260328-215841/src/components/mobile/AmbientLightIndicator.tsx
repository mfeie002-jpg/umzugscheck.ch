import React from 'react';
import { Sun, Moon, SunDim, Lightbulb } from 'lucide-react';
import { useAmbientLight } from '@/hooks/useAmbientLight';
import { cn } from '@/lib/utils';

interface AmbientLightIndicatorProps {
  className?: string;
  showValue?: boolean;
  onDarkMode?: () => void;
  onBrightMode?: () => void;
}

export function AmbientLightIndicator({
  className,
  showValue = false,
  onDarkMode,
  onBrightMode
}: AmbientLightIndicatorProps) {
  const { illuminance, isSupported, lightLevel, error } = useAmbientLight({
    onDarkMode,
    onBrightMode
  });

  if (!isSupported || error) {
    return null;
  }

  const getIcon = () => {
    switch (lightLevel) {
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'dim':
        return <SunDim className="w-4 h-4" />;
      case 'bright':
        return <Sun className="w-4 h-4" />;
      default:
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getLabel = () => {
    switch (lightLevel) {
      case 'dark':
        return 'Dunkel';
      case 'dim':
        return 'Gedimmt';
      case 'bright':
        return 'Hell';
      case 'normal':
        return 'Normal';
      default:
        return 'Unbekannt';
    }
  };

  const getColor = () => {
    switch (lightLevel) {
      case 'dark':
        return 'text-blue-400';
      case 'dim':
        return 'text-yellow-500';
      case 'bright':
        return 'text-orange-500';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('transition-colors', getColor())}>
        {getIcon()}
      </span>
      {showValue && illuminance !== null && (
        <span className="text-sm text-muted-foreground">
          {getLabel()} ({Math.round(illuminance)} lux)
        </span>
      )}
    </div>
  );
}
