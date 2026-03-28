import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useFocusedABTestAdmin } from '@/hooks/useFocusedABTest';
import { toast } from 'sonner';
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  PlayCircle, 
  CheckCircle,
  Loader2,
  RefreshCw,
  Trophy,
  Target,
  Zap,
  Crown,
  RotateCcw,
  ExternalLink
} from 'lucide-react';

const VARIANT_CONFIG = {
  'umzugsofferten-v1': {
    name: 'V1 Control',
    icon: Target,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    description: 'Baseline Flow',
    path: '/umzugsofferten-v1',
  },
  'umzugsofferten-v2e': {
    name: 'V2e Enhanced',
    icon: Zap,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    description: 'Premium Design',
    path: '/umzugsofferten-v2e',
  },
  'umzugsofferten-ultimate-best36': {
    name: 'Ultimate Best36',
    icon: Crown,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    description: 'Synthese aller 36 Flows',
    path: '/umzugsofferten-ultimate-best36',
  },
};

const FocusedABTestPanel: React.FC = () => {
  const { 
    isActive, 
    loading, 
    stats, 
    toggleABTest, 
    fetchStats, 
    resetTest,
    refetch,
    variants 
  } = useFocusedABTestAdmin();

  const handleToggle = async (checked: boolean) => {
    const success = await toggleABTest(checked);
    if (success) {
      toast.success(checked ? '3-Wege A/B Test aktiviert!' : 'A/B Test deaktiviert');
    } else {
      toast.error('Fehler beim Ändern des A/B Test Status');
    }
  };

  const handleRefresh = async () => {
    await Promise.all([refetch(), fetchStats()]);
    toast.success('Daten aktualisiert');
  };

  const handleReset = () => {
    resetTest();
    toast.success('Lokale Zuweisung zurückgesetzt (nur für dich)');
  };

  // Find best performing variant
  const bestVariant = stats.length > 0 
    ? stats.reduce((best, curr) => 
        (curr.conversion_rate || 0) > (best.conversion_rate || 0) ? curr : best, stats[0])
    : null;

  const totalImpressions = stats.reduce((sum, s) => sum + (s.impressions || 0), 0);
  const totalLeads = stats.reduce((sum, s) => sum + (s.lead_submits || 0), 0);

  return (
    <Card className="border-2 border-amber-500/50 bg-gradient-to-br from-amber-50/50 to-background dark:from-amber-950/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <Trophy className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Fokus-Test: Ultimate vs V1 vs V2e
                <Badge variant="outline" className="text-xs">3-Wege</Badge>
              </CardTitle>
              <CardDescription>
                Direkter Vergleich der Top-3 Varianten
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} title="Lokale Zuweisung zurücksetzen">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Aktualisieren
            </Button>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2">
                <Badge variant={isActive ? "default" : "secondary"} className={isActive ? 'bg-green-500' : ''}>
                  {isActive ? 'Läuft' : 'Pausiert'}
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
        <div className={`rounded-lg p-4 ${isActive ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' : 'bg-muted/50'}`}>
          <p className="text-sm">
            {isActive ? (
              <>
                <strong className="text-green-600">✓ Test aktiv:</strong> Besucher werden zufällig einer der 3 Varianten zugewiesen (je 33.3%). 
                Zuweisung ist persistent pro User.
              </>
            ) : (
              <>
                <strong className="text-muted-foreground">○ Test pausiert:</strong> Alle Besucher sehen V1 (Control). 
                Aktiviere den Test, um den 3-Wege-Vergleich zu starten.
              </>
            )}
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{totalImpressions}</div>
            <div className="text-sm text-muted-foreground">Impressions</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{totalLeads}</div>
            <div className="text-sm text-muted-foreground">Leads</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">
              {totalImpressions > 0 ? Math.round((totalLeads / totalImpressions) * 1000) / 10 : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Gesamt CVR</div>
          </div>
        </div>

        {/* Variant Cards */}
        <div className="space-y-3">
          <h4 className="font-medium flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Varianten Performance
          </h4>
          
          {variants.map((variant) => {
            const config = VARIANT_CONFIG[variant];
            const stat = stats.find(s => s.flow_variant === variant) || {
              impressions: 0,
              cta_clicks: 0,
              funnel_starts: 0,
              lead_submits: 0,
              conversion_rate: 0,
              cta_rate: 0,
            };
            const isBest = bestVariant?.flow_variant === variant && totalImpressions > 10;
            const Icon = config.icon;
            
            return (
              <div 
                key={variant}
                className={`border rounded-lg p-4 transition-all ${
                  isBest ? 'border-green-500 ring-2 ring-green-500/20 bg-green-50/50 dark:bg-green-950/10' : ''
                } ${config.bg}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-background ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {config.name}
                        {isBest && (
                          <Badge className="bg-green-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            Führend
                          </Badge>
                        )}
                        <Link to={config.path} target="_blank">
                          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Ansehen
                          </Button>
                        </Link>
                      </div>
                      <div className="text-xs text-muted-foreground">{config.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${isBest ? 'text-green-600' : ''}`}>
                      {stat.conversion_rate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Conversion Rate</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 text-sm mb-3">
                  <div className="flex items-center gap-2 bg-background/50 rounded p-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{stat.impressions}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 rounded p-2">
                    <MousePointer className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="font-medium">{stat.cta_clicks}</div>
                      <div className="text-xs text-muted-foreground">CTA Clicks</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 rounded p-2">
                    <PlayCircle className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="font-medium">{stat.funnel_starts}</div>
                      <div className="text-xs text-muted-foreground">Starts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-background/50 rounded p-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <div className="font-medium">{stat.lead_submits}</div>
                      <div className="text-xs text-muted-foreground">Leads</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Funnel Conversion</span>
                    <span>{stat.conversion_rate}%</span>
                  </div>
                  <Progress 
                    value={Math.min(stat.conversion_rate * 5, 100)} 
                    className="h-2"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistical Note */}
        {totalImpressions < 100 && (
          <div className="text-center py-4 text-muted-foreground bg-muted/30 rounded-lg">
            <p className="text-sm">
              📊 Noch nicht genug Daten für statistische Signifikanz. 
              Empfohlen: mindestens 100 Impressions pro Variante.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FocusedABTestPanel;
