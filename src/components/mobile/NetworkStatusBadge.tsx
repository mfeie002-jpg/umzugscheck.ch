import React from 'react';
import { Wifi, WifiOff, Signal, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';
import { useNetworkInfo } from '@/hooks/useNetworkInfo';
import { cn } from '@/lib/utils';

interface NetworkStatusBadgeProps {
  className?: string;
  showDetails?: boolean;
  onOffline?: () => void;
  onOnline?: () => void;
}

export function NetworkStatusBadge({
  className,
  showDetails = false,
  onOffline,
  onOnline
}: NetworkStatusBadgeProps) {
  const { isOnline, effectiveType, downlink, rtt } = useNetworkInfo({
    onOffline,
    onOnline
  });

  const getSignalIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4" />;
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return <SignalLow className="w-4 h-4" />;
      case '3g':
        return <SignalMedium className="w-4 h-4" />;
      case '4g':
        return <SignalHigh className="w-4 h-4" />;
      default:
        return <Wifi className="w-4 h-4" />;
    }
  };

  const getStatusColor = () => {
    if (!isOnline) return 'text-destructive';
    
    switch (effectiveType) {
      case 'slow-2g':
      case '2g':
        return 'text-orange-500';
      case '3g':
        return 'text-yellow-500';
      case '4g':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getLabel = () => {
    if (!isOnline) return 'Offline';
    
    switch (effectiveType) {
      case 'slow-2g':
        return 'Sehr langsam';
      case '2g':
        return 'Langsam';
      case '3g':
        return 'Mittel';
      case '4g':
        return 'Schnell';
      default:
        return 'Online';
    }
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('transition-colors', getStatusColor())}>
        {getSignalIcon()}
      </span>
      {showDetails && (
        <div className="text-sm">
          <span className={getStatusColor()}>{getLabel()}</span>
          {isOnline && downlink && (
            <span className="text-muted-foreground ml-2">
              {downlink.toFixed(1)} Mbps
              {rtt && ` • ${rtt}ms`}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
