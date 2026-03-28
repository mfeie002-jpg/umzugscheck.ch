/**
 * Issue Resolution Tracker - Track fixed vs open issues over time
 */

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { CheckCircle, AlertTriangle, Clock, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface IssueStats {
  total: number;
  resolved: number;
  critical: number;
  criticalResolved: number;
  warning: number;
  warningResolved: number;
  info: number;
  infoResolved: number;
}

interface IssueResolutionTrackerProps {
  flowId: string;
  className?: string;
}

export const IssueResolutionTracker: React.FC<IssueResolutionTrackerProps> = ({ flowId, className }) => {
  const [stats, setStats] = useState<IssueStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [flowId]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const normalizedId = flowId.startsWith('umzugsofferten-')
        ? flowId.replace('umzugsofferten-', '')
        : flowId;
      const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];

      const { data } = await supabase
        .from('flow_ux_issues')
        .select('severity, is_resolved')
        .in('flow_id', flowIds);

      if (data) {
        const s: IssueStats = {
          total: data.length,
          resolved: data.filter(d => d.is_resolved).length,
          critical: data.filter(d => d.severity === 'critical').length,
          criticalResolved: data.filter(d => d.severity === 'critical' && d.is_resolved).length,
          warning: data.filter(d => d.severity === 'warning').length,
          warningResolved: data.filter(d => d.severity === 'warning' && d.is_resolved).length,
          info: data.filter(d => d.severity === 'info').length,
          infoResolved: data.filter(d => d.severity === 'info' && d.is_resolved).length,
        };
        setStats(s);
      }
    } catch (err) {
      console.error('Failed to fetch issue stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAllResolved = async (severity: 'critical' | 'warning' | 'info') => {
    setResolving(true);
    try {
      const normalizedId = flowId.startsWith('umzugsofferten-')
        ? flowId.replace('umzugsofferten-', '')
        : flowId;
      const flowIds = [flowId, normalizedId, `umzugsofferten-${normalizedId}`];

      await supabase
        .from('flow_ux_issues')
        .update({ is_resolved: true, resolved_at: new Date().toISOString() })
        .in('flow_id', flowIds)
        .eq('severity', severity)
        .eq('is_resolved', false);

      toast.success(`Alle ${severity} Issues als gelöst markiert`);
      fetchStats();
    } catch (err) {
      toast.error('Fehler beim Markieren');
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Issue Resolution
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4 text-center text-muted-foreground text-sm">
          Keine Issues gefunden
        </CardContent>
      </Card>
    );
  }

  const resolutionRate = Math.round((stats.resolved / stats.total) * 100);

  return (
    <Card className={className}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Issue Resolution
          </CardTitle>
          <Badge variant={resolutionRate >= 80 ? "default" : resolutionRate >= 50 ? "secondary" : "destructive"}>
            {resolutionRate}% gelöst
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>{stats.resolved} von {stats.total} gelöst</span>
            <span className="text-muted-foreground">{stats.total - stats.resolved} offen</span>
          </div>
          <Progress value={resolutionRate} className="h-2" />
        </div>

        <div className="space-y-2">
          <SeverityRow 
            label="Kritisch" 
            resolved={stats.criticalResolved} 
            total={stats.critical}
            color="text-red-600"
            onMarkResolved={() => markAllResolved('critical')}
            disabled={resolving || stats.critical === stats.criticalResolved}
          />
          <SeverityRow 
            label="Warnung" 
            resolved={stats.warningResolved} 
            total={stats.warning}
            color="text-yellow-600"
            onMarkResolved={() => markAllResolved('warning')}
            disabled={resolving || stats.warning === stats.warningResolved}
          />
          <SeverityRow 
            label="Info" 
            resolved={stats.infoResolved} 
            total={stats.info}
            color="text-blue-600"
            onMarkResolved={() => markAllResolved('info')}
            disabled={resolving || stats.info === stats.infoResolved}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const SeverityRow: React.FC<{
  label: string;
  resolved: number;
  total: number;
  color: string;
  onMarkResolved: () => void;
  disabled: boolean;
}> = ({ label, resolved, total, color, onMarkResolved, disabled }) => {
  if (total === 0) return null;
  
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2">
        <span className={color}>{label}</span>
        <span className="text-muted-foreground">{resolved}/{total}</span>
      </div>
      {total > resolved && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 text-xs"
          onClick={onMarkResolved}
          disabled={disabled}
        >
          Alle lösen
        </Button>
      )}
      {total === resolved && (
        <CheckCircle className="h-4 w-4 text-green-500" />
      )}
    </div>
  );
};

export default IssueResolutionTracker;
