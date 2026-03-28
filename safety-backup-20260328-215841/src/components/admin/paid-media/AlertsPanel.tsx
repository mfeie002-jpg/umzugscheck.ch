/**
 * Alerts Panel
 * Kill Switch & Warning Alerts
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AlertTriangle, AlertOctagon, Info, Check, Clock } from 'lucide-react';
import type { PaidMediaAlert } from './types';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { de } from 'date-fns/locale';

interface AlertsPanelProps {
  alerts: PaidMediaAlert[];
  onRefresh: () => void;
}

export function AlertsPanel({ alerts, onRefresh }: AlertsPanelProps) {
  const { toast } = useToast();

  const acknowledgeAlert = async (alertId: string) => {
    try {
      await supabase
        .from('paid_media_alerts')
        .update({
          is_acknowledged: true,
          acknowledged_at: new Date().toISOString(),
        })
        .eq('id', alertId);

      toast({
        title: 'Alert bestätigt',
      });

      onRefresh();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const getAlertIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="h-6 w-6 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">KRITISCH</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Warnung</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Kill Switch Reference */}
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertOctagon className="h-4 w-4" />
            Kill Switch Referenz
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 text-sm">
            <div className="flex items-center justify-between p-2 rounded bg-destructive/10 border border-destructive/20">
              <span>CPL &gt; CHF 90 (7d Ø)</span>
              <span className="font-bold text-destructive">PAUSE ADS</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-destructive/10 border border-destructive/20">
              <span>CM2 &lt; 20% (5 Jobs)</span>
              <span className="font-bold text-destructive">STOP OPS</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-destructive/10 border border-destructive/20">
              <span>Claims &gt; 5% Revenue</span>
              <span className="font-bold text-destructive">PAUSE ADS</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
              <span>CPL &gt; CHF 60</span>
              <span className="font-medium text-yellow-600">Kampagnen prüfen</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts */}
      {alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Check className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="font-medium">Keine aktiven Alerts</p>
            <p className="text-sm text-muted-foreground mt-1">
              Alle Metriken sind im grünen Bereich
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <Card 
              key={alert.id}
              className={`border-l-4 ${
                alert.severity === 'critical' ? 'border-l-destructive' :
                alert.severity === 'warning' ? 'border-l-yellow-500' : 'border-l-blue-500'
              }`}
            >
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {getAlertIcon(alert.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getSeverityBadge(alert.severity)}
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(parseISO(alert.created_at), { 
                          addSuffix: true, 
                          locale: de 
                        })}
                      </span>
                    </div>
                    <p className="font-medium">{alert.message}</p>
                    {alert.metric_value !== undefined && alert.threshold_value !== undefined && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Aktuell: CHF {alert.metric_value.toFixed(2)} | Schwellwert: CHF {alert.threshold_value}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => acknowledgeAlert(alert.id)}
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Bestätigen
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
