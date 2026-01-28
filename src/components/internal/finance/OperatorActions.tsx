/**
 * Operator Actions - Decision Engine
 */

import { Target, TrendingUp, AlertTriangle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { HealthStatus, FinanceKPIs } from './types';

interface OperatorActionsProps {
  kpis: FinanceKPIs;
}

function determineOverallStatus(kpis: FinanceKPIs): HealthStatus {
  // Critical conditions
  if (
    kpis.blendedCAC > 90 ||
    kpis.cm2Percent30d < 15 ||
    kpis.claimsRate > 5 ||
    kpis.cashRunwayMonths < 1
  ) {
    return 'red';
  }
  
  // Warning conditions
  if (
    kpis.blendedCAC > 70 ||
    kpis.cm2Percent30d < 20 ||
    kpis.utilizationRate < 60 ||
    kpis.cashRunwayMonths < 3 ||
    kpis.avgAOV < 2000
  ) {
    return 'yellow';
  }
  
  return 'green';
}

const STATUS_CONFIG: Record<HealthStatus, {
  icon: React.ReactNode;
  title: string;
  instruction: string;
  action: string;
  className: string;
}> = {
  green: {
    icon: <TrendingUp className="h-8 w-8 text-green-600" />,
    title: 'SCALE',
    instruction: 'Scale ads, consider increasing prices.',
    action: 'System is healthy. Push for growth.',
    className: 'border-green-500 bg-green-500/10',
  },
  yellow: {
    icon: <AlertTriangle className="h-8 w-8 text-yellow-600" />,
    title: 'HOLD',
    instruction: 'Optimize sales, tighten targeting, protect margin.',
    action: 'Fix inefficiencies before scaling.',
    className: 'border-yellow-500 bg-yellow-500/10',
  },
  red: {
    icon: <XCircle className="h-8 w-8 text-red-600" />,
    title: 'STOP',
    instruction: 'Pause ads immediately. Fix operations before spending.',
    action: 'Emergency mode. Protect cash.',
    className: 'border-red-500 bg-red-500/10',
  },
};

export function OperatorActions({ kpis }: OperatorActionsProps) {
  const status = determineOverallStatus(kpis);
  const config = STATUS_CONFIG[status];
  
  return (
    <Card className={`border-2 ${config.className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Target className="h-5 w-5" />
          Decision Engine
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {config.icon}
          <div>
            <h3 className="text-2xl font-bold">{config.title}</h3>
            <p className="text-sm font-medium mt-1">{config.instruction}</p>
            <p className="text-xs text-muted-foreground mt-1">{config.action}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
