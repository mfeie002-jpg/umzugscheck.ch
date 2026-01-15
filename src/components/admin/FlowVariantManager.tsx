/**
 * Flow Variant Manager - Admin component to manage and reset flow A/B tests
 * Fixes the "stuck on V6" issue by providing reset functionality
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
  Settings2
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Flow variants configuration
const FLOW_VARIANTS = [
  { id: 'umzugsofferten-v1', name: 'V1 - Control', description: 'Basis-Variante' },
  { id: 'umzugsofferten-v2', name: 'V2 - Premium', description: 'Premium-Design' },
  { id: 'umzugsofferten-v3', name: 'V3 - God Mode', description: 'Full-Service Flow' },
  { id: 'umzugsofferten-v4', name: 'V4 - Video AI', description: 'Video-basiert' },
  { id: 'umzugsofferten-v5', name: 'V5 - Marketplace', description: 'Marktplatz-Flow' },
  { id: 'umzugsofferten-v6', name: 'V6 - Ultimate', description: 'Ultimate Swiss Flow' },
  { id: 'umzugsofferten-v7', name: 'V7 - SwissMove', description: 'Swiss-optimiert' },
  { id: 'umzugsofferten-v8', name: 'V8 - Decision-Free', description: 'Keine Entscheidungen' },
  { id: 'umzugsofferten-v9', name: 'V9 - Zero Friction', description: 'Minimaler Widerstand' },
] as const;

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
  const [stats, setStats] = useState<FlowStats[]>([]);
  const [currentUserVariant, setCurrentUserVariant] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchStatus();
    fetchStats();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('homepage_ab_events')
        .select('flow_variant, event_type')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Aggregate stats
      const aggregated = FLOW_VARIANTS.map(v => {
        const variantEvents = data?.filter(e => e.flow_variant === v.id) || [];
        const impressions = variantEvents.filter(e => e.event_type === 'impression').length;
        const cta_clicks = variantEvents.filter(e => e.event_type === 'cta_click').length;
        const funnel_starts = variantEvents.filter(e => e.event_type === 'funnel_start').length;
        const leads = variantEvents.filter(e => e.event_type === 'lead_submit').length;
        
        return {
          variant: v.id,
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
      const { error } = await supabase
        .from('homepage_ab_config')
        .update({ is_active: active, updated_at: new Date().toISOString() })
        .eq('id', '00000000-0000-0000-0000-000000000001');

      if (error) throw error;

      setIsActive(active);
      toast({
        title: active ? 'A/B Test aktiviert' : 'A/B Test deaktiviert',
        description: active 
          ? 'Benutzer werden zufällig auf Varianten verteilt' 
          : 'Alle Benutzer sehen die Standard-Variante (V1)',
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
    // Open variant in new tab (without storing in localStorage)
    const url = `/${variantId}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
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
              </CardTitle>
              <CardDescription>
                Verwalten Sie die 9 Umzugsofferten-Flow-Varianten
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
              <Button variant="outline" size="sm" onClick={resetUserVariant}>
                <Trash2 className="h-4 w-4 mr-2" />
                Zurücksetzen & neu zuweisen
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variants Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            Alle Varianten
          </CardTitle>
          <CardDescription>
            Klicken Sie auf eine Variante um diese zu testen
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLOW_VARIANTS.map((variant) => {
              const variantStats = stats.find(s => s.variant === variant.id);
              const isCurrentVariant = currentUserVariant === variant.id;
              
              return (
                <div
                  key={variant.id}
                  className={`border rounded-lg p-4 transition-all ${
                    isCurrentVariant 
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                      : 'hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{variant.name}</h4>
                    {isCurrentVariant && (
                      <Badge variant="default" className="text-xs">Aktiv</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {variant.description}
                  </p>
                  
                  {/* Mini Stats */}
                  {variantStats && (
                    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                      <div className="bg-muted/50 rounded p-1.5">
                        <span className="text-muted-foreground">Impressions:</span>
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
                      onClick={() => previewVariant(variant.id)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant={isCurrentVariant ? 'secondary' : 'default'}
                      size="sm"
                      className="flex-1"
                      onClick={() => forceVariant(variant.id)}
                      disabled={isCurrentVariant}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Aktivieren
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
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
                  <th className="text-left py-2 px-3">Variante</th>
                  <th className="text-right py-2 px-3">Impressions</th>
                  <th className="text-right py-2 px-3">CTA Clicks</th>
                  <th className="text-right py-2 px-3">Funnel Starts</th>
                  <th className="text-right py-2 px-3">Leads</th>
                  <th className="text-right py-2 px-3">Conv. Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.variant} className="border-b last:border-0">
                    <td className="py-2 px-3 font-medium">
                      {FLOW_VARIANTS.find(v => v.id === stat.variant)?.name || stat.variant}
                    </td>
                    <td className="text-right py-2 px-3">{stat.impressions}</td>
                    <td className="text-right py-2 px-3">{stat.cta_clicks}</td>
                    <td className="text-right py-2 px-3">{stat.funnel_starts}</td>
                    <td className="text-right py-2 px-3 font-semibold">{stat.leads}</td>
                    <td className="text-right py-2 px-3">
                      <Badge variant={stat.conversion_rate > 5 ? 'default' : 'secondary'}>
                        {stat.conversion_rate.toFixed(2)}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
