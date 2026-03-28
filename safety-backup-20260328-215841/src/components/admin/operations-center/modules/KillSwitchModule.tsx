/**
 * Kill Switch Module
 * All guardrails in one view
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertOctagon, AlertTriangle, CheckCircle, Pause, TrendingDown, TrendingUp, DollarSign, Users, ShieldAlert } from 'lucide-react';

interface KillSwitch {
  id: string;
  name: string;
  description: string;
  metric: string;
  currentValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  unit: string;
  inverted?: boolean; // true = higher is better
  action: string;
}

const killSwitches: KillSwitch[] = [
  {
    id: 'cpl',
    name: 'CPL (7-Tage Ø)',
    description: 'Cost per Lead über alle Kanäle',
    metric: 'paid_media_daily_metrics.cpl_chf',
    currentValue: 52,
    warningThreshold: 60,
    criticalThreshold: 90,
    unit: 'CHF',
    action: 'ADS PAUSIEREN',
  },
  {
    id: 'cm2',
    name: 'CM2 (5-Job Ø)',
    description: 'Contribution Margin 2 nach Ops',
    metric: 'jobs.margin_percent',
    currentValue: 28,
    warningThreshold: 25,
    criticalThreshold: 20,
    unit: '%',
    inverted: true,
    action: 'OPS STOPPEN',
  },
  {
    id: 'claims',
    name: 'Claims Rate',
    description: 'Schadensmeldungen / Revenue',
    metric: 'claims.rate',
    currentValue: 2.1,
    warningThreshold: 3,
    criticalThreshold: 5,
    unit: '%',
    action: 'PAUSE + REVIEW',
  },
  {
    id: 'runway',
    name: 'Cash Runway',
    description: 'Monate bis Cashflow-negativ',
    metric: 'finance.runway_months',
    currentValue: 8,
    warningThreshold: 4,
    criticalThreshold: 3,
    unit: 'Mo',
    inverted: true,
    action: 'FUNDRAISE',
  },
  {
    id: 'partner_fill',
    name: 'Partner Fill Rate',
    description: 'Leads mit min. 1 Partner-Angebot',
    metric: 'marketplace.fill_rate',
    currentValue: 78,
    warningThreshold: 75,
    criticalThreshold: 70,
    unit: '%',
    inverted: true,
    action: 'MARKETPLACE PAUSE',
  },
  {
    id: 'partner_disputes',
    name: 'Partner Disputes',
    description: 'Streitfälle mit Partnern',
    metric: 'marketplace.dispute_rate',
    currentValue: 3.2,
    warningThreshold: 10,
    criticalThreshold: 15,
    unit: '%',
    action: 'PARTNER REVIEW',
  },
];

export function KillSwitchModule() {
  const getStatus = (ks: KillSwitch): 'ok' | 'warning' | 'critical' => {
    if (ks.inverted) {
      if (ks.currentValue <= ks.criticalThreshold) return 'critical';
      if (ks.currentValue <= ks.warningThreshold) return 'warning';
      return 'ok';
    } else {
      if (ks.currentValue >= ks.criticalThreshold) return 'critical';
      if (ks.currentValue >= ks.warningThreshold) return 'warning';
      return 'ok';
    }
  };

  const criticalCount = killSwitches.filter(ks => getStatus(ks) === 'critical').length;
  const warningCount = killSwitches.filter(ks => getStatus(ks) === 'warning').length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className={criticalCount > 0 ? 'border-destructive bg-destructive/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertOctagon className={`h-8 w-8 ${criticalCount > 0 ? 'text-destructive' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Kritische Alerts</p>
                <p className="text-3xl font-bold">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className={warningCount > 0 ? 'border-yellow-500 bg-yellow-500/5' : ''}>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className={`h-8 w-8 ${warningCount > 0 ? 'text-yellow-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm text-muted-foreground">Warnungen</p>
                <p className="text-3xl font-bold">{warningCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-500/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">System Status</p>
                <p className="text-3xl font-bold">
                  {criticalCount === 0 && warningCount === 0 ? 'OK' : 'ACHTUNG'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Kill Switch Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {killSwitches.map((ks) => {
          const status = getStatus(ks);
          return (
            <Card 
              key={ks.id}
              className={`
                ${status === 'critical' ? 'border-destructive bg-destructive/5' : ''}
                ${status === 'warning' ? 'border-yellow-500 bg-yellow-500/5' : ''}
              `}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    {status === 'critical' && <AlertOctagon className="h-5 w-5 text-destructive" />}
                    {status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    {status === 'ok' && <CheckCircle className="h-5 w-5 text-green-500" />}
                    {ks.name}
                  </CardTitle>
                  <Badge variant={
                    status === 'critical' ? 'destructive' :
                    status === 'warning' ? 'secondary' : 'outline'
                  }>
                    {status.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{ks.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Value Display */}
                  <div className="flex items-end gap-2">
                    <span className={`text-4xl font-bold ${
                      status === 'critical' ? 'text-destructive' :
                      status === 'warning' ? 'text-yellow-600' : ''
                    }`}>
                      {ks.currentValue}
                    </span>
                    <span className="text-lg text-muted-foreground mb-1">{ks.unit}</span>
                  </div>

                  {/* Threshold Bar */}
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    {/* Warning zone */}
                    <div 
                      className="absolute h-full bg-yellow-500/30"
                      style={{ 
                        left: ks.inverted ? '0%' : `${(ks.warningThreshold / ks.criticalThreshold) * 100}%`,
                        width: ks.inverted 
                          ? `${(ks.warningThreshold / (ks.warningThreshold * 1.5)) * 100}%`
                          : `${((ks.criticalThreshold - ks.warningThreshold) / ks.criticalThreshold) * 100}%`
                      }}
                    />
                    {/* Critical zone */}
                    <div 
                      className="absolute h-full bg-destructive/30"
                      style={{ 
                        left: ks.inverted ? '0%' : `${100 - 10}%`,
                        width: '10%'
                      }}
                    />
                    {/* Current value marker */}
                    <div 
                      className={`absolute top-0 bottom-0 w-1 rounded ${
                        status === 'critical' ? 'bg-destructive' :
                        status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ 
                        left: `${Math.min((ks.currentValue / (ks.criticalThreshold * 1.2)) * 100, 100)}%`
                      }}
                    />
                  </div>

                  {/* Thresholds */}
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Warnung: {ks.warningThreshold}{ks.unit}</span>
                    <span>Kritisch: {ks.criticalThreshold}{ks.unit}</span>
                  </div>

                  {/* Action */}
                  {status !== 'ok' && (
                    <div className="pt-2 border-t">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Aktion:</span>
                        <Button 
                          variant={status === 'critical' ? 'destructive' : 'outline'}
                          size="sm"
                        >
                          <Pause className="h-4 w-4 mr-1" />
                          {ks.action}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Emergency Actions */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldAlert className="h-5 w-5" />
            Notfall-Aktionen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="destructive">
              <Pause className="h-4 w-4 mr-2" />
              Alle Ads pausieren
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Marketplace stoppen
            </Button>
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Preise erhöhen (+20%)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
