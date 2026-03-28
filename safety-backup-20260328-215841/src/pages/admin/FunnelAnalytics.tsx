import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Loader2, TrendingUp, Users, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VariantStats {
  variant: string;
  total_sessions: number;
  viewed_companies: number;
  selected_avg: number;
  submitted_leads: number;
  conversion_rate: number;
}

export default function FunnelAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<VariantStats[]>([]);

  useEffect(() => {
    fetchFunnelStats();
  }, []);

  const fetchFunnelStats = async () => {
    try {
      setLoading(true);
      
      // Fetch funnel conversion stats grouped by variant
      const { data, error } = await supabase
        .from('estimate_sessions')
        .select('*');

      if (error) throw error;

      // Group by variant and calculate metrics
      const variantMap = new Map<string, VariantStats>();
      
      (data || []).forEach((session: any) => {
        const variant = session.funnel_variant || 'default';
        
        if (!variantMap.has(variant)) {
          variantMap.set(variant, {
            variant,
            total_sessions: 0,
            viewed_companies: 0,
            selected_avg: 0,
            submitted_leads: 0,
            conversion_rate: 0,
          });
        }
        
        const stats = variantMap.get(variant)!;
        stats.total_sessions++;
        
        if (session.viewed_companies) {
          stats.viewed_companies++;
        }
        
        if (session.selected_companies > 0) {
          stats.selected_avg += session.selected_companies;
        }
        
        if (session.submitted_lead) {
          stats.submitted_leads++;
        }
      });

      // Calculate conversion rates and averages
      const finalStats = Array.from(variantMap.values()).map(stat => ({
        ...stat,
        selected_avg: stat.viewed_companies > 0 
          ? Math.round((stat.selected_avg / stat.viewed_companies) * 10) / 10
          : 0,
        conversion_rate: stat.total_sessions > 0
          ? Math.round((stat.submitted_leads / stat.total_sessions) * 1000) / 10
          : 0,
      }));

      setStats(finalStats.sort((a, b) => b.conversion_rate - a.conversion_rate));
    } catch (error) {
      console.error('Error fetching funnel stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Funnel Analytics
            </h1>
            <p className="text-muted-foreground">
              A/B Test Performance & Conversion Tracking
            </p>
          </div>

          {/* Variant Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((variant) => (
              <Card key={variant.variant}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="capitalize">{variant.variant}</span>
                    <Badge variant={variant.conversion_rate > 30 ? "default" : "secondary"}>
                      {variant.conversion_rate}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Total Sessions</div>
                      <div className="text-2xl font-bold">{variant.total_sessions}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Viewed Companies</div>
                      <div className="text-2xl font-bold">
                        {variant.viewed_companies}
                        <span className="text-sm text-muted-foreground ml-2">
                          ({variant.total_sessions > 0 ? Math.round((variant.viewed_companies / variant.total_sessions) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Submitted Leads</div>
                      <div className="text-2xl font-bold text-green-600">
                        {variant.submitted_leads}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="text-sm text-muted-foreground">Avg Companies Selected</div>
                    <div className="text-xl font-semibold">{variant.selected_avg}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <div className="font-medium">Overall Funnel Performance</div>
                  <div className="text-sm text-muted-foreground">
                    Track how users progress from estimate viewing to company selection to lead submission
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <div className="font-medium">A/B Test Variants</div>
                  <div className="text-sm text-muted-foreground">
                    Compare different funnel designs to optimize conversion rates
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div>
                  <div className="font-medium">Company Selection Patterns</div>
                  <div className="text-sm text-muted-foreground">
                    Average number of companies users select before submitting leads
                  </div>
                </div>
              </div>
            </CardContent>
        </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
