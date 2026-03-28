import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Target, DollarSign, Calendar, Percent, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ConversionStats {
  total_leads: number;
  converted_leads: number;
  lost_leads: number;
  pending_leads: number;
  conversion_rate: number;
  avg_job_value: number;
  avg_days_to_convert: number;
}

export function ConversionAnalytics({ providerId }: { providerId: string }) {
  const [stats, setStats] = useState<ConversionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversionStats();
  }, [providerId]);

  const fetchConversionStats = async () => {
    try {
      const { data, error } = await supabase
        .from('provider_conversion_stats')
        .select('*')
        .eq('provider_id', providerId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setStats(data as any || {
        total_leads: 0,
        converted_leads: 0,
        lost_leads: 0,
        pending_leads: 0,
        conversion_rate: 0,
        avg_job_value: 0,
        avg_days_to_convert: 0
      });
    } catch (error) {
      console.error('Error fetching conversion stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversion Analytics</CardTitle>
          <CardDescription>Lädt Statistiken...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!stats || stats.total_leads === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Conversion Analytics</CardTitle>
          <CardDescription>Noch keine Conversion-Daten verfügbar</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
          <p className="text-muted-foreground">
            Kaufen Sie Leads und tracken Sie Conversions, um Ihre Statistiken zu sehen
          </p>
        </CardContent>
      </Card>
    );
  }

  const conversionRate = stats.conversion_rate || 0;
  const isGoodConversionRate = conversionRate >= 30;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Conversion Analytics
          </CardTitle>
          <CardDescription>
            Basierend auf {stats.total_leads} gekauften Leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Conversion Rate */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Percent className="h-5 w-5 text-primary" />
                  {isGoodConversionRate ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground mt-1">Conversion Rate</div>
                <Progress value={conversionRate} className="h-2 mt-2" />
              </CardContent>
            </Card>

            {/* Converted Leads */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600">{stats.converted_leads}</div>
                <div className="text-xs text-muted-foreground mt-1">Gewonnene Leads</div>
                <div className="text-xs text-muted-foreground mt-2">
                  {stats.lost_leads} verloren • {stats.pending_leads} ausstehend
                </div>
              </CardContent>
            </Card>

            {/* Average Job Value */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">
                  {stats.avg_job_value ? `CHF ${Math.round(stats.avg_job_value).toLocaleString()}` : '-'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Ø Auftragswert</div>
              </CardContent>
            </Card>

            {/* Avg Days to Convert */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="text-2xl font-bold">
                  {stats.avg_days_to_convert ? `${Math.round(stats.avg_days_to_convert)}` : '-'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Ø Tage bis Conversion</div>
              </CardContent>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <div className="mt-6">
            <h4 className="font-semibold mb-4">Conversion Funnel</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Total Leads gekauft</span>
                  <span className="font-medium">{stats.total_leads}</span>
                </div>
                <Progress value={100} className="h-3" />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Gewonnen</span>
                  <span className="font-medium text-green-600">{stats.converted_leads}</span>
                </div>
                <Progress 
                  value={(stats.converted_leads / stats.total_leads) * 100} 
                  className="h-3 bg-muted [&>div]:bg-green-600" 
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Verloren</span>
                  <span className="font-medium text-red-600">{stats.lost_leads}</span>
                </div>
                <Progress 
                  value={(stats.lost_leads / stats.total_leads) * 100} 
                  className="h-3 bg-muted [&>div]:bg-red-600" 
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Ausstehend</span>
                  <span className="font-medium text-muted-foreground">{stats.pending_leads}</span>
                </div>
                <Progress 
                  value={(stats.pending_leads / stats.total_leads) * 100} 
                  className="h-3" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
