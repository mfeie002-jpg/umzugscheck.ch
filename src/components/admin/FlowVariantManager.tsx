/**
 * Flow Variant Manager - Admin component to manage and reset flow A/B tests
 * Now dynamically fetches the Top 10 flows from flow_analysis_runs by overall_score
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  FlaskConical, 
  RefreshCw, 
  Trash2, 
  Eye, 
  BarChart3,
  Power,
  PowerOff,
  ExternalLink,
  Settings2,
  Trophy,
  Loader2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface TopFlow {
  id: string;
  name: string;
  score: number;
  description?: string;
}

interface FlowStats {
  variant: string;
  impressions: number;
  cta_clicks: number;
  funnel_starts: number;
  leads: number;
  conversion_rate: number;
}

export function FlowVariantManager() {
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [topFlows, setTopFlows] = useState<TopFlow[]>([]);
  const [stats, setStats] = useState<FlowStats[]>([]);
  const [currentUserVariant, setCurrentUserVariant] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatus();
    fetchTopFlows();
    checkCurrentVariant();
  }, []);

  const checkCurrentVariant = () => {
    const stored = localStorage.getItem('homepage_ab_variant');
    setCurrentUserVariant(stored);
  };

  const fetchStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_ab_config')
        .select('is_active')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .single();

      if (error) throw error;
      setIsActive(data?.is_active ?? false);
    } catch (err) {
      console.error('Error fetching AB config:', err);
    }
  };

  const fetchTopFlows = async () => {
    setLoading(true);
    try {
      // Fetch the TOP 10 flows from flow_analysis_runs ordered by overall_score
      const { data, error } = await supabase
        .from('flow_analysis_runs')
        .select('flow_id, flow_name, overall_score')
        .eq('status', 'completed')
        .not('overall_score', 'is', null)
        .order('overall_score', { ascending: false })
        .limit(50); // Get more to deduplicate

      if (error) throw error;

      // Deduplicate by flow_id (keep highest score per flow)
      const uniqueFlows = new Map<string, TopFlow>();
      data?.forEach(row => {
        if (!uniqueFlows.has(row.flow_id) && row.overall_score !== null) {
          uniqueFlows.set(row.flow_id, {
            id: row.flow_id,
            name: row.flow_name || row.flow_id,
            score: row.overall_score,
          });
        }
      });

      // Get top 10 unique flows
      const top10 = Array.from(uniqueFlows.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      setTopFlows(top10);
      await fetchStats(top10.map(f => f.id));
    } catch (err) {
      console.error('Error fetching top flows:', err);
      toast({
        title: 'Fehler',
        description: 'Top Flows konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async (flowIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('homepage_ab_events')
        .select('flow_variant, event_type')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Aggregate stats for the top flows
      const aggregated = flowIds.map(id => {
        // Match both exact ID and with prefix
        const variantEvents = data?.filter(e => 
          e.flow_variant === id || 
          e.flow_variant === `umzugsofferten-${id}` ||
          e.flow_variant?.replace('umzugsofferten-', '') === id
        ) || [];
        const impressions = variantEvents.filter(e => e.event_type === 'impression').length;
        const cta_clicks = variantEvents.filter(e => e.event_type === 'cta_click').length;
        const funnel_starts = variantEvents.filter(e => e.event_type === 'funnel_start').length;
        const leads = variantEvents.filter(e => e.event_type === 'lead_submit').length;
        
        return {
          variant: id,
          impressions,
          cta_clicks,
          funnel_starts,
          leads,
          conversion_rate: impressions > 0 ? (leads / impressions) * 100 : 0,
        };
      });

      setStats(aggregated);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const toggleABTest = async (active: boolean) => {
    try {
      // First try to update
      const { error: updateError, count } = await supabase
        .from('homepage_ab_config')
        .update({ is_active: active, updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .select();

      if (updateError) throw updateError;

      // If no rows updated, insert
      if (!count || count === 0) {
        const { error: insertError } = await supabase
          .from('homepage_ab_config')
          .upsert({
            id: '00000000-0000-0000-0000-000000000001',
            is_active: active,
            updated_at: new Date().toISOString(),
          });
        if (insertError) throw insertError;
      }

      setIsActive(active);
      toast({
        title: active ? 'A/B Test aktiviert' : 'A/B Test deaktiviert',
        description: active 
          ? 'Benutzer werden zufällig auf Top 10 Flows verteilt' 
          : 'Alle Benutzer sehen den Standard-Flow',
      });
    } catch (err) {
      console.error('Error toggling AB test:', err);
      toast({
        title: 'Fehler',
        description: 'A/B Test konnte nicht umgeschaltet werden',
        variant: 'destructive',
      });
    }
  };

  const resetUserVariant = () => {
    localStorage.removeItem('homepage_ab_variant');
    localStorage.removeItem('homepage_ab_user_id');
    sessionStorage.removeItem('homepage_ab_session');
    setCurrentUserVariant(null);
    toast({
      title: 'Variante zurückgesetzt',
      description: 'Bei der nächsten Seitenladung wird eine neue Variante zugewiesen',
    });
    // Force re-assignment on next visit
    setTimeout(() => window.location.reload(), 500);
  };

  const forceVariant = (variantId: string) => {
    localStorage.setItem('homepage_ab_variant', variantId);
    setCurrentUserVariant(variantId);
    toast({
      title: 'Variante gesetzt',
      description: `Sie sehen jetzt: ${variantId}`,
    });
    setTimeout(() => window.location.reload(), 500);
  };

  const previewVariant = (variantId: string) => {
    // Open variant in new tab
    const url = `/umzugsofferten-${variantId}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Top 10 Flows werden geladen...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="h-5 w-5" />
                Flow A/B Testing
                <Badge variant="outline" className="ml-2">
                  <Trophy className="h-3 w-3 mr-1" />
                  Top 10 Flows
                </Badge>
              </CardTitle>
              <CardDescription>
                Die 10 bestbewerteten Flows aus der Flow-Analyse (Score-basiert)
              </CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={isActive ? 'default' : 'secondary'} className="text-sm">
                {isActive ? (
                  <>
                    <Power className="h-3 w-3 mr-1" />
                    Aktiv
                  </>
                ) : (
                  <>
                    <PowerOff className="h-3 w-3 mr-1" />
                    Inaktiv
                  </>
                )}
              </Badge>
              <Switch
                checked={isActive}
                onCheckedChange={toggleABTest}
                aria-label="A/B Test aktivieren"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Ihre aktuelle Variante:</p>
                <p className="text-lg font-bold text-primary">
                  {currentUserVariant || 'Nicht zugewiesen'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchTopFlows}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Aktualisieren
                </Button>
                <Button variant="destructive" size="sm" onClick={resetUserVariant}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Zurücksetzen & neu zuweisen
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 10 Flows Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Top 10 Flows (Score-Ranking)
          </CardTitle>
          <CardDescription>
            Aus der Flow Command Center Analyse – höchste Scores zuerst
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topFlows.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Keine analysierten Flows gefunden.</p>
              <p className="text-sm">Führen Sie zuerst Analysen im Flow Command Center durch.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {topFlows.map((flow, index) => {
                const variantStats = stats.find(s => s.variant === flow.id);
                const isCurrentVariant = currentUserVariant === flow.id || 
                  currentUserVariant === `umzugsofferten-${flow.id}`;
                
                return (
                  <div
                    key={flow.id}
                    className={`border rounded-lg p-4 transition-all ${
                      isCurrentVariant 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={index < 3 ? 'default' : 'secondary'} className="text-xs">
                          #{index + 1}
                        </Badge>
                        {isCurrentVariant && (
                          <Badge variant="default" className="text-xs bg-green-600">Aktiv</Badge>
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs font-bold">
                        {flow.score}/100
                      </Badge>
                    </div>
                    
                    <h4 className="font-semibold text-sm mb-1 truncate" title={flow.name}>
                      {flow.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mb-3">
                      {flow.id}
                    </p>
                    
                    {/* Mini Stats */}
                    {variantStats && (
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div className="bg-muted/50 rounded p-1.5">
                          <span className="text-muted-foreground">Impr:</span>
                          <span className="font-bold ml-1">{variantStats.impressions}</span>
                        </div>
                        <div className="bg-muted/50 rounded p-1.5">
                          <span className="text-muted-foreground">Leads:</span>
                          <span className="font-bold ml-1">{variantStats.leads}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => previewVariant(flow.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        variant={isCurrentVariant ? 'secondary' : 'default'}
                        size="sm"
                        className="flex-1"
                        onClick={() => forceVariant(flow.id)}
                        disabled={isCurrentVariant}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Setzen
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Statistiken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3">Rang</th>
                  <th className="text-left py-2 px-3">Flow</th>
                  <th className="text-right py-2 px-3">Score</th>
                  <th className="text-right py-2 px-3">Impressions</th>
                  <th className="text-right py-2 px-3">CTA Clicks</th>
                  <th className="text-right py-2 px-3">Funnel Starts</th>
                  <th className="text-right py-2 px-3">Leads</th>
                  <th className="text-right py-2 px-3">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {topFlows.map((flow, index) => {
                  const stat = stats.find(s => s.variant === flow.id);
                  return (
                    <tr key={flow.id} className="border-b last:border-0">
                      <td className="py-2 px-3">
                        <Badge variant={index < 3 ? 'default' : 'outline'} className="text-xs">
                          #{index + 1}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 font-medium">{flow.name}</td>
                      <td className="text-right py-2 px-3">
                        <Badge variant="secondary">{flow.score}</Badge>
                      </td>
                      <td className="text-right py-2 px-3">{stat?.impressions || 0}</td>
                      <td className="text-right py-2 px-3">{stat?.cta_clicks || 0}</td>
                      <td className="text-right py-2 px-3">{stat?.funnel_starts || 0}</td>
                      <td className="text-right py-2 px-3 font-semibold">{stat?.leads || 0}</td>
                      <td className="text-right py-2 px-3">
                        <Badge variant={(stat?.conversion_rate || 0) > 5 ? 'default' : 'secondary'}>
                          {(stat?.conversion_rate || 0).toFixed(2)}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
