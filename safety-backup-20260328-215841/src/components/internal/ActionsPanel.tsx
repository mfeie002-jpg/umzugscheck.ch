/**
 * Today's Actions Panel - Dynamic recommendations based on status
 */

import { Zap, Target, TrendingUp, TrendingDown, Pause, Play, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { LaunchKPIs, OverallStatus } from './types';

interface ActionsPanelProps {
  status: OverallStatus;
  kpis: LaunchKPIs;
  currentWeek: number;
}

interface Action {
  icon: React.ReactNode;
  text: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

export function ActionsPanel({ status, kpis, currentWeek }: ActionsPanelProps) {
  const actions: Action[] = [];
  
  // Critical status actions
  if (status === 'critical') {
    if (kpis.blendedCPL7Day > 90) {
      actions.push({
        icon: <Pause className="h-4 w-4 text-red-500" />,
        text: 'Pause all Google Ads immediately',
        priority: 'urgent',
      });
    }
    if (kpis.claimRatePercent > 5) {
      actions.push({
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        text: 'Stop ops, schedule crew retraining',
        priority: 'urgent',
      });
    }
    if (kpis.cashReserveMonths < 1) {
      actions.push({
        icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
        text: 'Initiate emergency capital call',
        priority: 'urgent',
      });
    }
  }
  
  // Warning status actions
  if (status === 'warning' || status === 'critical') {
    if (kpis.closeRate < 15) {
      actions.push({
        icon: <TrendingDown className="h-4 w-4 text-yellow-500" />,
        text: 'Review & improve sales script',
        priority: 'high',
      });
      actions.push({
        icon: <Target className="h-4 w-4 text-yellow-500" />,
        text: 'Analyze lost deals for pricing issues',
        priority: 'high',
      });
    }
    if (kpis.cm2Percent < 20) {
      actions.push({
        icon: <TrendingDown className="h-4 w-4 text-yellow-500" />,
        text: 'Audit COGS on last 5 jobs',
        priority: 'high',
      });
      actions.push({
        icon: <Target className="h-4 w-4 text-yellow-500" />,
        text: 'Test 10% price increase on new leads',
        priority: 'medium',
      });
    }
    if (kpis.utilization < 50) {
      actions.push({
        icon: <TrendingDown className="h-4 w-4 text-yellow-500" />,
        text: 'Activate mid-month discounts (-10%)',
        priority: 'high',
      });
      actions.push({
        icon: <TrendingUp className="h-4 w-4 text-yellow-500" />,
        text: 'Increase daily ad budget by 20%',
        priority: 'medium',
      });
    }
    if (kpis.partnerAcceptRate < 40) {
      actions.push({
        icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
        text: 'Tighten lead qualification (min 2.0 rooms)',
        priority: 'high',
      });
    }
  }
  
  // Healthy status actions
  if (status === 'healthy') {
    if (kpis.closeRate > 45) {
      actions.push({
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        text: 'Raise prices by 10% on new quotes',
        priority: 'medium',
      });
    }
    if (kpis.utilization > 85) {
      actions.push({
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        text: 'Activate peak surcharge (+15%)',
        priority: 'medium',
      });
      actions.push({
        icon: <Zap className="h-4 w-4 text-green-500" />,
        text: 'Begin planning for Crew #2',
        priority: 'low',
      });
    }
    if (kpis.marketplaceRevenuePercent >= 30) {
      actions.push({
        icon: <TrendingUp className="h-4 w-4 text-green-500" />,
        text: 'Increase ad budget by 30%',
        priority: 'medium',
      });
    }
    
    // Default healthy actions
    if (actions.length === 0) {
      actions.push({
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
        text: 'Maintain current operations',
        priority: 'low',
      });
      actions.push({
        icon: <Target className="h-4 w-4 text-green-500" />,
        text: 'Focus on customer experience',
        priority: 'low',
      });
    }
  }
  
  // Week-specific actions
  if (currentWeek <= 4) {
    actions.push({
      icon: <Target className="h-4 w-4 text-blue-500" />,
      text: 'Log all calls for script refinement',
      priority: 'medium',
    });
  }
  if (currentWeek >= 5 && currentWeek <= 8) {
    actions.push({
      icon: <Target className="h-4 w-4 text-blue-500" />,
      text: 'Weekly partner satisfaction check',
      priority: 'medium',
    });
  }
  if (currentWeek >= 9) {
    actions.push({
      icon: <Target className="h-4 w-4 text-blue-500" />,
      text: 'Full P&L review every Friday',
      priority: 'medium',
    });
  }
  
  // Sort by priority
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Zap className="h-5 w-5" />
          Today's Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {actions.slice(0, 6).map((action, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="mt-0.5">{action.icon}</div>
              <div className="flex-1">
                <p className="text-sm">{action.text}</p>
              </div>
              <Badge 
                variant={
                  action.priority === 'urgent' ? 'destructive' :
                  action.priority === 'high' ? 'secondary' :
                  'outline'
                }
                className="text-xs shrink-0"
              >
                {action.priority}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
