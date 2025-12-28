import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useABTestAdmin, FLOW_VARIANTS } from '@/hooks/useHomepageABTest';
import { toast } from 'sonner';
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  PlayCircle, 
  CheckCircle,
  Loader2,
  RefreshCw,
  FlaskConical,
  TrendingUp
} from 'lucide-react';

const ABTestToggle: React.FC = () => {
  const { isActive, loading, stats, toggleABTest, fetchStats, refetch } = useABTestAdmin();

  const handleToggle = async (checked: boolean) => {
    const success = await toggleABTest(checked);
    if (success) {
      toast.success(checked ? 'A/B Test aktiviert!' : 'A/B Test deaktiviert');
    } else {
      toast.error('Fehler beim Ändern des A/B Test Status');
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refetch(), fetchStats()]);
    toast.success('Daten aktualisiert');
  };

  // Find best performing variant
  const bestVariant = stats.length > 0 
    ? stats.reduce((best, curr) => 
        (curr.conversion_rate || 0) > (best.conversion_rate || 0) ? curr : best, stats[0])
    : null;

  return (
    <Card className="border-2 border-dashed border-primary/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FlaskConical className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Homepage A/B Test</CardTitle>
              <CardDescription>
                9 Flow-Varianten rotieren und messen
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant={isActive ? "default" : "secondary"}>
                  {isActive ? 'Aktiv' : 'Inaktiv'}
                </Badge>
                <Switch 
                  checked={isActive} 
                  onCheckedChange={handleToggle}
                />
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm">
            {isActive ? (
              <>
                <strong className="text-green-600">✓ Test läuft:</strong> Besucher sehen zufällig eine von 9 Flow-Varianten. 
                Zuweisung ist pro User persistent (localStorage).
              </>
            ) : (
              <>
                <strong className="text-muted-foreground">○ Test pausiert:</strong> Alle Besucher sehen V1 (Control Flow). 
                Schalte den Test ein, um Varianten zu rotieren.
              </>
            )}
          </p>
        </div>

        {/* Flow Variants Grid */}
        <div>
          <h4 className="font-medium mb-3">Getestete Varianten ({FLOW_VARIANTS.length})</h4>
          <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2">
            {FLOW_VARIANTS.map((variant, i) => {
              const variantStats = stats.find(s => s.flow_variant === variant);
              const isControl = variant === 'umzugsofferten-v1';
              
              return (
                <div 
                  key={variant}
                  className={`p-2 rounded-lg border text-center ${
                    isControl ? 'border-primary bg-primary/5' : 'border-border'
                  } ${bestVariant?.flow_variant === variant ? 'ring-2 ring-green-500' : ''}`}
                >
                  <div className="font-bold text-sm">V{i + 1}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {variantStats?.impressions || 0} views
                  </div>
                  <div className="text-xs font-medium text-primary">
                    {variantStats?.conversion_rate || 0}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        {stats.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance (letzte 30 Tage)
            </h4>
            
            <div className="grid gap-3">
              {stats.map((stat, i) => {
                const variantIndex = FLOW_VARIANTS.indexOf(stat.flow_variant as any);
                const isBest = bestVariant?.flow_variant === stat.flow_variant;
                
                return (
                  <div 
                    key={stat.flow_variant}
                    className={`border rounded-lg p-3 ${isBest ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">V{variantIndex + 1}</span>
                        <span className="text-sm text-muted-foreground">
                          {stat.flow_variant}
                        </span>
                        {isBest && (
                          <Badge variant="outline" className="border-green-500 text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Best
                          </Badge>
                        )}
                      </div>
                      <span className={`font-bold ${isBest ? 'text-green-600' : ''}`}>
                        {stat.conversion_rate || 0}% CVR
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3 text-muted-foreground" />
                        <span>{stat.impressions || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MousePointer className="h-3 w-3 text-blue-500" />
                        <span>{stat.cta_clicks || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <PlayCircle className="h-3 w-3 text-purple-500" />
                        <span>{stat.funnel_starts || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{stat.lead_submits || 0}</span>
                      </div>
                    </div>
                    
                    <Progress 
                      value={stat.conversion_rate || 0} 
                      className="h-1.5 mt-2"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {stats.length === 0 && isActive && (
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Noch keine Daten. Statistiken erscheinen nach den ersten Besuchen.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ABTestToggle;
