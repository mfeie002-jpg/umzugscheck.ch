/**
 * Backend Health Indicator Component
 * Shows current backend connectivity status with retry option
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle,
  Loader2,
  Clock
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { BackendStatus } from '../hooks/useBackendHealth';

interface BackendHealthIndicatorProps {
  status: BackendStatus;
  latencyMs: number | null;
  lastChecked: Date | null;
  error: string | null;
  onRetry: () => void;
  compact?: boolean;
}

const STATUS_CONFIG: Record<BackendStatus, {
  icon: typeof Wifi;
  label: string;
  color: string;
  bgColor: string;
}> = {
  online: {
    icon: Wifi,
    label: 'Online',
    color: 'text-green-600',
    bgColor: 'bg-green-100 dark:bg-green-950',
  },
  offline: {
    icon: WifiOff,
    label: 'Offline',
    color: 'text-red-600',
    bgColor: 'bg-red-100 dark:bg-red-950',
  },
  checking: {
    icon: Loader2,
    label: 'Prüfe...',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  degraded: {
    icon: AlertTriangle,
    label: 'Langsam',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100 dark:bg-yellow-950',
  },
};

export const BackendHealthIndicator: React.FC<BackendHealthIndicatorProps> = ({
  status,
  latencyMs,
  lastChecked,
  error,
  onRetry,
  compact = false,
}) => {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  const formatTime = (date: Date | null) => {
    if (!date) return '-';
    return date.toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (compact) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn(
              'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium cursor-default',
              config.bgColor,
              config.color
            )}>
              <Icon className={cn('h-3 w-3', status === 'checking' && 'animate-spin')} />
              {latencyMs !== null && status !== 'checking' && (
                <span>{latencyMs}ms</span>
              )}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <div className="space-y-1">
              <p className="font-medium">Backend: {config.label}</p>
              {latencyMs !== null && <p className="text-xs">Latenz: {latencyMs}ms</p>}
              {lastChecked && <p className="text-xs">Zuletzt: {formatTime(lastChecked)}</p>}
              {error && <p className="text-xs text-red-500">{error}</p>}
              {status !== 'online' && (
                <Button size="sm" variant="outline" className="w-full mt-2 h-7" onClick={onRetry}>
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Erneut prüfen
                </Button>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-3 p-3 rounded-lg border',
      status === 'offline' && 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/50',
      status === 'degraded' && 'border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950/50',
      status === 'online' && 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50',
      status === 'checking' && 'border-border bg-muted/50',
    )}>
      <div className={cn('p-2 rounded-full', config.bgColor)}>
        <Icon className={cn('h-4 w-4', config.color, status === 'checking' && 'animate-spin')} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('font-medium text-sm', config.color)}>
            Backend {config.label}
          </span>
          {latencyMs !== null && status !== 'checking' && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {latencyMs}ms
            </Badge>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 truncate">
            {error}
          </p>
        )}
        {lastChecked && !error && (
          <p className="text-xs text-muted-foreground">
            Zuletzt geprüft: {formatTime(lastChecked)}
          </p>
        )}
      </div>

      {status !== 'checking' && (
        <Button
          size="sm"
          variant={status === 'offline' ? 'default' : 'ghost'}
          onClick={onRetry}
          className="shrink-0"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Prüfen
        </Button>
      )}
    </div>
  );
};

export default BackendHealthIndicator;
