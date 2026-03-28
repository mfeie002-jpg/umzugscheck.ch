/**
 * Operator Decision Output Panel
 */

import { Target, TrendingUp, Pause, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { OperatorDecision } from './types';

interface OperatorDecisionPanelProps {
  decision: OperatorDecision;
}

const DECISION_CONFIG = {
  scale: {
    icon: <TrendingUp className="h-8 w-8 text-green-600" />,
    title: 'SCALE ADS',
    subtitle: 'All systems healthy. Push for growth.',
    className: 'border-green-500 bg-green-500/10',
    textClass: 'text-green-700',
  },
  hold: {
    icon: <Pause className="h-8 w-8 text-yellow-600" />,
    title: 'HOLD & OPTIMIZE',
    subtitle: 'Fix inefficiencies before scaling.',
    className: 'border-yellow-500 bg-yellow-500/10',
    textClass: 'text-yellow-700',
  },
  stop: {
    icon: <XCircle className="h-8 w-8 text-red-600" />,
    title: 'STOP & FIX',
    subtitle: 'Critical issues detected. Protect cash.',
    className: 'border-red-500 bg-red-500/10',
    textClass: 'text-red-700',
  },
};

export function OperatorDecisionPanel({ decision }: OperatorDecisionPanelProps) {
  const config = DECISION_CONFIG[decision.action];
  
  return (
    <Card className={`border-2 ${config.className}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Decision Icon & Title */}
          <div className="flex items-center gap-3">
            {config.icon}
            <div>
              <h2 className={`text-2xl font-bold ${config.textClass}`}>{config.title}</h2>
              <p className="text-sm text-muted-foreground">{config.subtitle}</p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="w-px h-16 bg-border mx-4" />
          
          {/* Reasons */}
          <div className="flex-1">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">WHY</h4>
            <ul className="space-y-1">
              {decision.reasons.map((reason, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <CheckCircle className={`h-3 w-3 ${config.textClass}`} />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Divider */}
          <div className="w-px h-16 bg-border mx-4" />
          
          {/* Actions */}
          <div className="flex-1">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">DO TODAY</h4>
            <ul className="space-y-1">
              {decision.todayActions.map((action, i) => (
                <li key={i} className="text-sm flex items-center gap-2">
                  <Target className={`h-3 w-3 ${config.textClass}`} />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
