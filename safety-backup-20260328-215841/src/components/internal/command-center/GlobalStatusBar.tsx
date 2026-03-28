/**
 * Global Status Bar - Sticky top bar with live indicators
 */

import { Shield, DollarSign, TrendingUp, Percent, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatSwissCHF, formatSwissPercent } from '@/lib/swiss-number-format';
import type { GlobalStatus } from './types';

interface GlobalStatusBarProps {
  status: GlobalStatus;
}

const STATUS_CONFIG = {
  scale: {
    label: '🟢 SCALE',
    className: 'bg-green-500 text-white',
    barClassName: 'bg-green-500/10 border-green-500',
  },
  hold: {
    label: '🟡 HOLD',
    className: 'bg-yellow-500 text-black',
    barClassName: 'bg-yellow-500/10 border-yellow-500',
  },
  stop: {
    label: '🔴 STOP',
    className: 'bg-red-500 text-white animate-pulse',
    barClassName: 'bg-red-500/10 border-red-500',
  },
};

export function GlobalStatusBar({ status }: GlobalStatusBarProps) {
  const config = STATUS_CONFIG[status.overall];
  
  return (
    <div className={`sticky top-0 z-50 border-b-2 ${config.barClassName}`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Overall Status */}
          <div className="flex items-center gap-3">
            <Badge className={`text-lg px-4 py-1 ${config.className}`}>
              {config.label}
            </Badge>
          </div>
          
          {/* Key Metrics */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">CPL 7d:</span>
              <span className={`font-mono font-bold ${status.blendedCPL7d > 90 ? 'text-red-600' : status.blendedCPL7d > 70 ? 'text-yellow-600' : 'text-green-600'}`}>
                {formatSwissCHF(status.blendedCPL7d)}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">CM2:</span>
              <span className={`font-mono font-bold ${status.cm2_7d > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatSwissCHF(status.cm2_7d)}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Percent className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Util:</span>
              <span className={`font-mono font-bold ${status.utilizationPercent >= 70 ? 'text-green-600' : status.utilizationPercent >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                {formatSwissPercent(status.utilizationPercent)}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Runway:</span>
              <span className={`font-mono font-bold ${status.cashRunwayMonths >= 6 ? 'text-green-600' : status.cashRunwayMonths >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                {status.cashRunwayMonths.toFixed(1)} Mo.
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Kill Switches:</span>
              {status.activeKillSwitches > 0 ? (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  {status.activeKillSwitches} ACTIVE
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                  CLEAR
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
